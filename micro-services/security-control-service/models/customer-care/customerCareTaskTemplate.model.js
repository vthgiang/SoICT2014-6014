const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const CustomerCareTaskTemplateSchema = new Schema({
    taskTemplate: {
        type: Schema.Types.ObjectId,
        ref: "TaskTemplate",
    },
    type: { //loại công việc : 1-công việc tìm kiếm khách hàng mới , 2- công việc CSKH
        type: Number,
    },
    customerCareUnit: {// đơn vị CSKH
        type: Schema.Types.ObjectId,
        ref: "CustomerCareUnit",
    },
    manager: {// trưởng đơn vị
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
}, {
    timestamps: true,
});

CustomerCareTaskTemplateSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.CustomerCareTaskTemplate)
        return db.model('CustomerCareTaskTemplate', CustomerCareTaskTemplateSchema);
    return db.models.CustomerCareTaskTemplate;
}