const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Company = require('./company.model');
const mongoosePaginate = require('mongoose-paginate-v2');

// Create Schema
const DocumentSchema = new Schema({
    name: { //tên 
        type: String,
        required: true
    },
    company: { //thuộc công ty nào
        type: Schema.Types.ObjectId,
        ref: Company,
        required: true
    },
    type: {
        type: Schema.Types.ObjectId,
        ref: DocumentType
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: DocumentCategory
    },
    description: { //mô tả
        type: String
    },
    dateApply: { //ngày áp dụng
        type: Date
    },
    version: { //Phiên bản
        type: Boolean,
    },
    views: { //số lần xem
        type: Number,
        default: 0
    },
    downloads: { //số lần download
        type: Number,
        default: 0
    },
    relationship: {
        type: Schema.Types.ObjectId,
        replies: this
    },
    storageLocation: {
        type: String
    }
},{
    timestamps: true, //ngày tạo và ngày sửa gần nhất
    toJSON: { virtuals: true }
});

// DocumentSchema.virtual('roles', {
//     ref: 'UserRole',
//     localField: '_id',
//     foreignField: 'userId'
// });

DocumentSchema.plugin(mongoosePaginate);

module.exports = Document = mongoose.model("Document", DocumentSchema);