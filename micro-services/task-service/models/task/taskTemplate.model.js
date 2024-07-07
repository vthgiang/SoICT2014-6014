const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
const { ObjectId } = mongoose.Types;

// Model quản lý dữ liệu của một mẫu công việc
const TaskTemplateSchema = new Schema(
  {
    organizationalUnit: {
      type: Schema.Types.ObjectId,
      ref: 'OrganizationalUnit',
    },
    collaboratedWithOrganizationalUnits: [
      {
        type: Schema.Types.ObjectId,
        ref: 'OrganizationalUnit',
      },
    ],
    name: {
      type: String,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    priority: {
      // 1: Thấp, 2: Trung Bình, 3: Tiêu chuẩn, 4: Cao, 5: Khẩn cấp
      type: Number,
    },
    numberOfDaysTaken: {
      type: Number,
      default: 1,
    },
    taskActions: [
      {
        name: {
          type: String,
        },
        description: {
          type: String,
        },
        mandatory: {
          // Hoạt động này bắt buộc hay không?
          type: Boolean,
          default: true,
        },
        creator: {
          type: Schema.Types.ObjectId,
        },
      },
    ],
    taskInformations: [
      {
        code: {
          // Mã thuộc tính công việc dùng trong công thức
          type: String,
        },
        name: {
          // Tên thuộc tính công việc
          type: String,
        },
        description: {
          type: String,
        },
        extra: {
          // Cho kiểu dữ liệu tập giá trị, lưu lại các tập giá trị
          type: String,
        },
        filledByAccountableEmployeesOnly: {
          // Chỉ người phê duyệt được điền?
          type: Boolean,
          default: true,
        },
        type: {
          type: String,
          enum: ['text', 'boolean', 'date', 'number', 'set_of_values'],
        },
      },
    ],
    readByEmployees: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Role',
      },
    ],
    responsibleEmployees: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    accountableEmployees: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    consultedEmployees: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    informedEmployees: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    description: {
      type: String,
    },
    formula: {
      type: String,
    },
    status: {
      type: Boolean,
      default: false,
    },
    numberOfUse: {
      type: Number,
      default: 0,
    },
    isMappingTask: {
      type: Boolean,
      default: false,
    },
    listMappingTask: [
      {
        taskName: {
          type: String,
        },
        taskDescription: {
          type: String,
        },
        durations: {
          type: Number,
        },
        startDate: {
          type: Date,
        },
        endDate: {
          type: Date,
        },
        target: {
          type: Number,
        },
        unit: {
          type: String,
        },
        organizationalUnitKpi: {
          type: ObjectId,
          ref: 'OrganizationalUnitKpi',
        },
        factor: {
          company: {
            type: Number,
            min: 1,
            max: 5,
            required: true,
          },
          contract: {
            type: Number,
            min: 1,
            max: 5,
            required: true,
          },
          document: {
            type: Number,
            min: 1,
            max: 5,
            required: true,
          },
          event: {
            type: Number,
            min: 1,
            max: 5,
            required: true,
          },
          online: {
            type: Number,
            min: 1,
            max: 5,
            required: true,
          },
          newCustomer: {
            type: Number,
            min: 1,
            max: 5,
            required: true,
          },
          outdoor: {
            type: Number,
            min: 1,
            max: 5,
            required: true,
          },
          sales: {
            type: Number,
            min: 1,
            max: 5,
            required: true,
          },
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

TaskTemplateSchema.plugin(mongoosePaginate);

module.exports = (db) => {
  if (!db.models.TaskTemplate) return db.model('TaskTemplate', TaskTemplateSchema);
  return db.models.TaskTemplate;
};
