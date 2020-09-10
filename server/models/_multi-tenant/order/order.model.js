const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create Schema
const OrderSchema = new Schema({
  code: {
    //1. mã đơn hàng
    type: String,
    required: true,
  },

  quantity: {
    //2. Số lượng
    type: Number,
  },

  amount: {
    // 3. Tổng thanh toán
    type: Number,
  },
});

module.exports = (db) => {
  if(!db.models.Order)
      return db.model('Order', OrderSchema);
  return db.models.Order;
}
