const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const CustomerCareTypeSchema = new Schema({
    name: { //tên loại hình chăm sóc khách hàng
        type: String,
        required: true
    },
    description: { // Mô tả loại hình chăm sóc
        type: String,
    },
    createdAt: { // ngày tạo loại CSKH
        type: Date,
    },
    creator: {// người tạo loại CSKH
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedAt: { // ngày cập nhật
        type: Date,
    },
    updatedBy: {// người cập nhật
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    customerCareUnit: {// đơn vị CSKH
        type: Schema.Types.ObjectId,
        ref: "CustomerCareUnit",
    },
}, {
    timestamps: true,
});

CustomerCareTypeSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.CustomerCareType)
        return db.model('CustomerCareType', CustomerCareTypeSchema);
    return db.models.CustomerCareType;
}