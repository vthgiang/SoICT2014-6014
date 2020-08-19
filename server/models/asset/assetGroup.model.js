const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

// Create Schema
const AssetGroupSchema = new Schema({
    name: { //tên 
        type: String,
        required: true
    },
    description: { //tên 
        type: String,
        required: true
    },
    company: { //thuộc công ty nào
        type: Schema.Types.ObjectId,
        ref: 'companies',
        required: true
    }
}, {
    timestamps: true, //ngày tạo và ngày sửa gần nhất
    toJSON: { virtuals: true }
});

AssetGroupSchema.plugin(mongoosePaginate);

module.exports = AssetGroup = mongoose.model("asset_groups", AssetGroupSchema);