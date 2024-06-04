const {
  Transport3Order,
  Stock,
  Customer,
  Good
} = require('../../../models');

const {
  connect
} = require(`../../../helpers/dbHelper`);
const mongoose = require('mongoose');
// Tạo mới 1 vận đơn
exports.createOrder = async (portal, data) => {
  if(data.transportType !== 3) {
    delete data.stockIn;
    delete data.stockOut;
  }
  let newOrder = await Transport3Order(connect(DB_CONNECTION, portal)).create({
    ...data,
    status: 1
  });
  let order = await Transport3Order(connect(DB_CONNECTION, portal)).findById({
    _id: newOrder._id
  });
  return order;
}

// Lấy tất cả vận đơn
exports.getAllOrder = async (portal, query) => {
  let orders = await Transport3Order(connect(DB_CONNECTION, portal)).find(query)
    .populate('customer')
    .populate('stockIn')
    .populate('stockOut')
  return orders;
}
