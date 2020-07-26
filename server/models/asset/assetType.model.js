const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Company = require('../system-admin/company.model');
const mongoosePaginate = require('mongoose-paginate-v2');

// Create Schema
const AssetTypeSchema = new Schema({
    company: {// công ty
        type: Schema.Types.ObjectId,
        ref: Company,
    },
    typeNumber: { //mã loại
        type: String,
        required: true
    },
    typeName: { //Tên loại
        type: String,
        required: true
    },
    timeDepreciation: { //thời gian trính khấu hao
        type: Number,
        // required: true
    },
    parent: { // loại tài sản cha
        type: Schema.Types.ObjectId,
        replies: this 
    },
    description: { //mô tả
        type: String,
        // required: true
    },
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