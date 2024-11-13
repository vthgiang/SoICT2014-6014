const {
  connect
} = require(`../../../helpers/dbHelper`)

const { AuthorizationLog } = require('../../../models');


exports.create = async (portal, allow, type, entity, object, action, policyApplied, ruleApplied, ipAddress, userAgent) => {
  await AuthorizationLog(connect(DB_CONNECTION, portal)).create({
    allow,
    type,
    entity,
    object,
    action,
    policyApplied,
    ruleApplied,
    ipAddress,
    userAgent
  });
}

exports.getLogs = async (portal, queryParams = {}) => {
  let query = {};
  const page = queryParams?.page ? Number(queryParams.page) : 1;
  const perPage = queryParams?.perPage ? Number(queryParams?.perPage) : 20;

  const loggingRecords = await AuthorizationLog(connect(DB_CONNECTION, portal))
    .find(query)
    .skip((page - 1) * perPage)
    .limit(perPage)
    .sort({ accessTime: 'desc' })
    .populate('');

  const totalLoggingRecords = await AuthorizationLog(connect(DB_CONNECTION, portal)).countDocuments(query);
  const totalPages = perPage ? Math.ceil(totalLoggingRecords / perPage) : 1;

  return {
    data: loggingRecords,
    totalLoggingRecords,
    totalPages,
  };
}