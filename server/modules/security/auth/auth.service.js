const {
  connect
} = require(`../../../helpers/dbHelper`)
const LogggingService = require('../log/logging.service');
const { Policy, Entity, Object, Rule } = require('../../../models');

function checkCondition(value, operation, target, dataType = 'string') {
  if (dataType === 'int') {
    value = parseInt(value, 10);
    target = parseInt(target, 10);
  }

  switch (operation) {
      case '=': return value === target;
      case '>': return value > target;
      case '<': return value < target;
      case '>=': return value >= target;
      case '<=': return value <= target;
      case '<>': return value !== target;
      default: return false;
  }
}

// Hàm kiểm tra điều kiện của entity hoặc object
const checkAttributes = (conditions, attributes) => {
  return conditions.every(condition => {
      const attribute = attributes.find(attr => attr.key === condition.key);
      if (!attribute) return false;
      return checkCondition(attribute.value, condition.operation, condition.value);
  });
}

// Hàm kiểm tra Authorization
exports.checkAuthorization = async (portal, data) => {
  const {entityId, objectId, action} = data;
  // Lấy tất cả các policy từ PolicyService
  const policies = await Policy(connect(DB_CONNECTION, portal))
    .find({}).sort({ priority: "desc" });
  const entity = await Entity(connect(DB_CONNECTION, portal)).findById(entityId);
  const object = await Object(connect(DB_CONNECTION, portal)).findById(objectId);
  
  // Duyệt qua tất cả các policy
  for (const policy of policies) {
      // Kiểm tra authorization cho từng policy
      const appliedRule = await authorize(portal, entity, object, action, policy);
      
      // Nếu policy cho phép thì trả về true
      
      if (appliedRule) {
        await LogggingService.create(
          portal,
          true,
          'mixed',
          entityId,
          objectId,
          action,
          policy.id,
          appliedRule,
          data.ip,
          data.userAgent
        );
        return true;
      }
  }
  
  // Nếu không có policy nào cho phép, trả về false
  // save log
  await LogggingService.create(
    portal,
    false,
    'mixed',
    entityId,
    objectId,
    action,
    null,
    null,
    data.ip,
    data.userAgent
  );
  return false;
}

// Hàm kiểm tra Authorization
const authorize = async (portal, entity, object, action, policy) => {
  // Duyệt qua tất cả các rule trong policy
  for (const ruleId of policy.authorizationRules) {
      const rule = await Rule(connect(DB_CONNECTION, portal)).findById(ruleId);
      if (rule.action !== action) continue;  // Bỏ qua nếu action không khớp
      console.log(`Start check action=${action} | entity=${entity.name} | object=${object.name}`);
      
      // Kiểm tra entity conditions
      const entityCheck = checkAttributes(rule.entityConditions, entity.attributes);
      if (!entityCheck) continue;  // Bỏ qua rule nếu entity không đạt
      console.log("Entity pass");
      
      // Kiểm tra object conditions
      const objectCheck = checkAttributes(rule.objectConditions, object.attributes);
      if (!objectCheck) continue;  // Bỏ qua rule nếu object không đạt
      console.log("Object pass");
      
      // Kiểm tra environment conditions (nếu có)
      const environmentCheck = rule.environmentConditions ? checkAttributes(rule.environmentConditions, getEnvironmentAttributes()) : true;
      if (!environmentCheck) continue;  // Bỏ qua nếu môi trường không đạt
      console.log("Env pass");
      
      // Nếu tất cả điều kiện đều đạt và conditionType là "allow", trả về true
      if (rule.conditionType === "allow") {
        return rule;
      }
  }

  // Không tìm thấy rule nào phù hợp, trả về false
  return false;
}

function getEnvironmentAttributes() {
  const date = new Date();
  return [
      { key: "day", value: date.getDay().toString(), dataType: "int" }
  ];
}
