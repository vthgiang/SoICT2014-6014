const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Role = require('../auth/role.model');
const User = require('../auth/user.model');
const OrganizationalUnits = require('../super-admin/organizationalUnit.model');
const TaskTemplate = require('../task/taskTemplate.model');
// Create Schema
const TaskProcessSchema = new Schema({
  xmlDiagram: {
    type: String,
  },
  nameProcess: {
    type: String
  },
  description: {
    type: String
  },
  viewer: [{
    type: Schema.Types.ObjectId,
    ref: Role,
  }],
  manager: [{
    type: Schema.Types.ObjectId,
    ref: Role,
  }],
  creator: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: User,
  },
  organizationalUnit: {
    type: Schema.Types.ObjectId,
    ref: OrganizationalUnit,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: true
  },
  priority: { // 1: Thấp, 2: Trung Bình, 3: Cao
    type: Number,
    required: true
  },
  taskActions: [{
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    mandatory: { // Hoạt động này bắt buộc hay không?
      type: Boolean,
      default: true,
      required: true
    },
    creator: {
      type: Schema.Types.ObjectId,
    }
  }],
  taskInformations: [{
    code: { // Mã thuộc tính công việc dùng trong công thức
      type: String,
      required: true
    },
    name: { // Tên thuộc tính công việc
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    extra: { // Cho kiểu dữ liệu tập giá trị, lưu lại các tập giá trị
      type: String
    },
    filledByAccountableEmployeesOnly: { // Chỉ người phê duyệt được điền?
      type: Boolean,
      default: true,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ['Text', 'Boolean', 'Date', 'Number', 'SetOfValues'],
    }
  }],
  readByEmployees: [{
    type: Schema.Types.ObjectId,
    ref: Role,
    required: true
  }],
  responsibleEmployees: [{
    type: Schema.Types.ObjectId,
    ref: User
  }],
  accountableEmployees: [{
    type: Schema.Types.ObjectId,
    ref: User
  }],
  consultedEmployees: [{
    type: Schema.Types.ObjectId,
    ref: User
  }],
  informedEmployees: [{
    type: Schema.Types.ObjectId,
    ref: User
  }],
  description: {
    type: String,
    required: true
  },
  formula: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    default: false,
    required: true
  },
  numberOfUse: {
    type: Number,
    default: 0,
    required: true
  }
});

module.exports = TaskHistory = mongoose.model("task_process", TaskProcessSchema);