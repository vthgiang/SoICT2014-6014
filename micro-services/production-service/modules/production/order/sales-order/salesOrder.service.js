const { SalesOrder } = require('../../../../models');

const { connect } = require('../../../../helpers/dbHelper');

const BusinessDepartmentServices = require('../business-department/buninessDepartment.service');

//PHẦN SERVICE PHỤC VỤ THỐNG KÊ
exports.countSalesOrder = async (userId, query, portal) => {
  let users = await BusinessDepartmentServices.getAllRelationsUser(userId, query.currentRole, portal);
  let { startDate, endDate } = query;
  console.log('Dates received in service:', startDate, endDate); // Log kiểm tra
  let option = {};
  if (users.length) {
    option = {
      $or: [{ creator: users }, { approvers: { $elemMatch: { approver: userId } } }],
    };
  }
  if (startDate && endDate) {
    option = {
      ...option,
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    };
  }

  let allSalesOrders = await SalesOrder(connect(DB_CONNECTION, portal)).find(option);
  let totalMoneyWithStatus = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // Lấy tổng tiền theo trạng thái
  let totalNumberWithStatus = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // Lấy số lượng đơn theo trạng thái
  let totalMoney = 0;

  for (let index = 0; index < allSalesOrders.length; index++) {
    totalMoneyWithStatus[allSalesOrders[index].status] += allSalesOrders[index].paymentAmount;
    totalNumberWithStatus[allSalesOrders[index].status] += 1;
    if (allSalesOrders[index].status === 7) {
      totalMoney += allSalesOrders[index].paymentAmount;
    }
  }

  return { salesOrdersCounter: { count: allSalesOrders.length, totalMoneyWithStatus, totalNumberWithStatus, totalMoney } };
};
