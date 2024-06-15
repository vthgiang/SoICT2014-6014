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
  if (data.transportType !== 3) {
    delete data.stockIn;
    delete data.stockOut;
  } else {
    delete data.customer;
    delete data.customerPhone;
    delete data.lat;
    delete data.lng;
  }
  let newOrder = await Transport3Order(connect(DB_CONNECTION, portal)).create({
    ...data,
    status: 1
  });
  return Transport3Order(connect(DB_CONNECTION, portal)).findById({
    _id: newOrder._id
  });
}

// Lấy tất cả vận đơn
exports.getAllOrder = async (portal, query) => {
  return await Transport3Order(connect(DB_CONNECTION, portal)).find(query)
    .populate('customer')
    .populate('stockIn')
    .populate('stockOut');
}

// Xoá 1 vận đơn
exports.deleteOrder = async (portal, id) => {
  return Transport3Order(connect(DB_CONNECTION, portal)).findByIdAndDelete(id);
}

// Sửa thông tin 1 vận đơn
exports.updateOrder = async (portal, id, data) => {
  if (data.transportType !== 3) {
    delete data.stockIn;
    delete data.stockOut;
  } else {
    delete data.customer;
    delete data.customerPhone;
    delete data.lat;
    delete data.lng;
  }
  return Transport3Order(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id, {
    $set: data
  }, {
    new: true
  });
}
