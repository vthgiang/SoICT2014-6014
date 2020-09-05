const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Company = require('../system-admin/company.model');
const mongoosePaginate = require('mongoose-paginate-v2');

// Create Schema
const AssetTypeSchema = new Schema({
    company: { // Công ty
        type: Schema.Types.ObjectId,
        ref: Company,
    },

    typeNumber: { // Mã loại
        type: String,
        required: true
    },

    typeName: { // Tên loại
        type: String,
        required: true
    },

    parent: { // Loại tài sản cha
        type: Schema.Types.ObjectId,
        replies: this 
    },

    description: { // Mô tả
        type: String,
        // required: true
    },

    defaultInformation: [{ // Thông tin mặc định khi chọn loại tài sản 
        nameField: String, // Tên trường dữ liệu
    }],

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }
});

AssetTypeSchema.plugin(mongoosePaginate);

module.exports = AssetType = mongoose.model("asset_type", AssetTypeSchema);