const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const CrmTaskTemplateSchema = new Schema({
    organizationalUnit: {
        type: Schema.Types.ObjectId,
        ref: "OrganizationalUnit",
    },
    taskTemplate: { // công việc liên kết
        type: Schema.Types.ObjectId,
        ref: 'Task',
    },
    taskTemplate: {
        type: Schema.Types.ObjectId,
        ref: "TaskTemplate",
    },
    type: { //loại công việc : 1-công việc tìm kiếm khách hàng mới , 2- công việc CSKH
        type: Number,
    }
}, {
    timestamps: true,
});

CrmTaskTemplateSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.CrmTaskTemplate)
        return db.model('CrmTasktemplate', CrmTaskTemplateSchema);
    return db.models.CrmTaskTemplate;
}