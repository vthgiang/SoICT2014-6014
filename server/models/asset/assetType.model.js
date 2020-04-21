const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const AssetTypeSchema = new Schema({
    company: {// công ty
        type: Schema.Types.ObjectId,
        ref: 'companies'
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
        required: true
    },
    parent: { // loại tài sản cha
        type: Schema.Types.ObjectId,
        replies: this
    }
});
module.exports = AssetType = mongoose.model("asset_type", AssetTypeSchema);