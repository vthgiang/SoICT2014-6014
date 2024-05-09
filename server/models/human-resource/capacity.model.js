const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Tạo bảng chuyên ngành tương đương
const CapacitySchema = new Schema({
  name: {
    type: String, 
  },
  key: {
    type: String, 
  },
  description: {
    type: String, 
  },
  minValue: {
    type: Number
  },
  maxValue: {
    type: Number
  },
  values: [
    {
      key: String,
      value: Number
    }
  ]
}, {
  timestamps: true,
});

module.exports = (db) => {
  if (!db.models.Capacity)
    return db.model('Capacity', CapacitySchema);
  return db.models.Capacity;
}