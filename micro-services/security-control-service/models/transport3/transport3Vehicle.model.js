const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const Transport3VehicleSchema = new Schema(
  {
    code: {
      type: String
    },
    asset: {
      type: Schema.Types.ObjectId,
      ref: 'Asset'
    },
    // Trọng tải xe
    tonnage: {
      type: Number
    },
    // Thể tích thùng xe
    volume: {
      type: Number
    },
    // Rộng, cao , sâu của thùng xe
    width: {
      type: Number
    },
    height: {
      type: Number
    },
    depth: {
      type: Number
    },
    // Mức tiêu thụ nhiên liệu của xe/1km
    averageGasConsume: {
      type: Number
    },
    // Trung bình chi phí vận chuyển của xe
    averageFeeTransport: {
      type: Number
    },
    // Tốc độ tối thiểu
    minVelocity: {
      type: Number
    },
    // Tốc độ tối đa
    maxVelocity: {
      type: Number
    },
  },
);

Transport3VehicleSchema.plugin(mongoosePaginate);

module.exports = (db) => {
  if (!db.models.Transport3Vehicle)
    return db.model('Transport3Vehicle', Transport3VehicleSchema);
  return db.models.Transport3Vehicle;
};
