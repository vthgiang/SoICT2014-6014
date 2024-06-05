const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const Transport3EmployeeSchema = new Schema(
  {
    code: {
      type: String
    },
    employee: {
      type: Schema.Types.ObjectId,
      ref: 'Employee'
    },
    certificate: {
      type: String
    },
    salary: {
      type: Number
    },
  },
  {
    timestamps: true,
  }
);

Transport3EmployeeSchema.plugin(mongoosePaginate);

module.exports = (db) => {
  if (!db.models.Transport3Employee)
    return db.model('Transport3Employee', Transport3EmployeeSchema);
  return db.models.Transport3Employee;
};
