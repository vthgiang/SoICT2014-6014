const {
  Transport3Issue
} = require('../../../models');

const {
  connect
} = require(`../../../helpers/dbHelper`);

// Lấy danh sách các vấn đề
exports.getIssues = async (portal, query) => {
  return Transport3Issue(connect(DB_CONNECTION, portal)).find(query)
    .populate('schedule')
    .populate('receiver_solve');
}

// Tạo mới 1 vấn đề
exports.createIssue = async (portal, data) => {
  let newIssue = await Transport3Issue(connect(DB_CONNECTION, portal)).create({
    ...data
  });
  return Transport3Issue(connect(DB_CONNECTION, portal)).findById({
    _id: newIssue._id
  });
}
