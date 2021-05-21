const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const CrmTaskSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,//nhân viên cskh
        ref: 'User',
    },
    month: { //tháng thực hiện công việc
        type: Number,

    },
    year: { // năm thực hiện công việc
        type: Number,
    },
    task: { // công việc liên kết
        type: Schema.Types.ObjectId,
        ref: 'Task',
     
    },
    type: { //loại công việc : 1-công việc tìm kiếm khách hàng mới , 2- công việc CSKH
        type: Number,
        ref: 'User',

    }


}, {
    timestamps: true,
});

CrmTaskSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.CrmTask)
        return db.model('CrmTask', CrmTaskSchema);
    return db.models.CrmTask;
}