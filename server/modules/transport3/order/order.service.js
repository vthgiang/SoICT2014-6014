const {
  Transport3Order,
  Role
} = require('../../../models');

const {
  connect
} = require(`../../../helpers/dbHelper`);
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
exports.getAllOrder = async (portal, query, currentRole) => {
  let role = await Role(connect(DB_CONNECTION, portal)).find({
    _id: currentRole
  });

  if (role[0].name !== 'Trưởng phòng vận chuyển' && role[0].name !== 'Nhân viên giám sát') {
    return [];
  }

  let result = await Transport3Order(connect(DB_CONNECTION, portal)).find({})
    .populate('customer')
    .populate('stockIn')
    .populate('stockOut');

  if (query.query) {
    result = result.filter(x => x.code.toLowerCase().includes(query.query.toLowerCase()) || x.customer.name.toLowerCase().includes(query.query.toLowerCase()));
  }

  return result;
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

// Duyệt vận đơn
exports.approveOrder = async (portal, id) => {
  return Transport3Order(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id, {
    $set: {
      status: 2
    }
  }, {
    new: true
  });
}

// Xoá vận đơn chưa duyệt
exports.deleteUnapprovedOrder = async (portal, id) => {
  return Transport3Order(connect(DB_CONNECTION, portal)).findOneAndDelete({
    _id: id,
    status: 1
  });
}
