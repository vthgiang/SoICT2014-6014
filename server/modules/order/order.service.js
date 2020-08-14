const { Order } = require("../../models").schema;

/**
 * Lấy các đơn hàng
 */
exports.getAllOrder = async (params) => {
  let keySearch;

  if (params.code !== undefined && params.code.length !== 0) {
    keySearch = {
      ...keySearch,
      code: { $regex: params.code, $options: "i" },
    };
  }
  
  let totalList = await Order.count(keySearch);
  console.log("TOTAL KEY ", totalList)
  const orderCollection = await Order.find(keySearch)
  .sort({ materialName: "asc" })
  .skip(params.page)
  .limit(params.limit);

  
  return { data: orderCollection, totalList };
};

exports.getOrderById = async (id) => {
  //code here
};

/**
 * Tạo mới một đơn hàng
 * @param {*} data dữ liệu được thêm vào
 */
exports.createNewOrder = async (data) => {
  const newOrderData = await Order.create({
    code: data.code,
    quantity: data.quantity,
    amount: data.amount,
  });

  const newOrder = await Order.find({ _id: newOrderData._id });
  return { newOrder };
};

/**
 * Chỉnh sửa đơn đơn hàng
 * @param {*} id
 * @param {*} data dữ liệu chỉnh sửa
 */
exports.updateOrderById = async (id, data) => {
  const orderUpdate = await Order.findById(id);
  if (!orderUpdate) {
    return -1;
  } else {
    (orderUpdate.code = data.code),
      (orderUpdate.quantity = data.quantity),
      (orderUpdate.amount = data.amount);
  }
  orderUpdate.save();
  const orderUpdated = await Order.find({ _id: orderUpdate._id });
  return { orderUpdate };
};

/**
 * Xóa một đơn hàng
 * @param {*} id mã đơn cần xóa
 */
exports.deleteOrderById = async (id) => {
  const order = Order.findByIdAndDelete({ _id: id });

  return order;
};
