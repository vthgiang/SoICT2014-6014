const {
  Transport3Issue, Role, Employee
} = require('../../../models');

const {
  connect
} = require(`../../../helpers/dbHelper`);

// Lấy danh sách các vấn đề
exports.getIssues = async (portal, query, currentRole) => {
  let role = await Role(connect(DB_CONNECTION, portal)).find({
    _id: currentRole
  });

  if (role[0].name !== 'Trưởng phòng vận chuyển' && role[0].name !== 'Nhân viên giám sát') {
    return [];
  }

  return Transport3Issue(connect(DB_CONNECTION, portal)).find(query)
    .populate('schedule')
    .populate('order')
    .populate('receiver_solve');
}

// Tạo mới 1 vấn đề
exports.createIssue = async (portal, data) => {
  let newIssue = await Transport3Issue(connect(DB_CONNECTION, portal)).create({
    ...data,
    status: 1,
    description: ''
  });
  return Transport3Issue(connect(DB_CONNECTION, portal)).findById({
    _id: newIssue._id
  });
}

// van de cua toi
exports.getMyIssues = async (portal, user) => {
  let myEmployee = await Employee(connect(DB_CONNECTION, portal)).findOne({emailInCompany: user.email});
  let issues = await Transport3Issue(connect(DB_CONNECTION, portal)).find({})
    .populate('schedule')
    .populate('order')
    .populate('receiver_solve');

  console.log(issues);
  return issues.filter(issue => issue.schedule.employees.some(employee => employee._id.toString() === myEmployee._id.toString()));
}
