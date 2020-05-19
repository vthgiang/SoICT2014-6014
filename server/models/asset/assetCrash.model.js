const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Company = require('../system-admin/company.model');
const Asset = require('./asset.model');
const User = require('../auth/user.model');

/**
 * Tạo bảng Sự cố tài sản
 */
const AssetCrashSchema = new Schema({
    company: {//Công ty
        type: Schema.Types.ObjectId,
        ref: Company,
    },

    asset: {//Tài sản
        type: Schema.Types.ObjectId,
        ref: Asset,
        // require: true,
    },

    type: {//Phân loại: 1. Báo hỏng , 2.Báo mất
        type: String,
        require: true,
    },

    annunciator: {//Người báo cáo
        type: Schema.Types.ObjectId,
        ref: User,
        // required: true
    },

    reportDate: { //Ngày báo cáo
        type: String,
        defaut: Date.now,
        required: true
    },

    detectionDate: { //Ngày phát hiện
        type: String,
        defaut: Date.now,
        // required: true
    },

    reason: { //Nội dung
        type: String,
        // required: true
    },

});

module.exports = AssetCrash = mongoose.model("asset_crash", AssetCrashSchema);
