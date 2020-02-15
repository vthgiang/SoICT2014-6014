const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Company = require('./company.model');
const DocumentType = require('./documentType.model');
const DocumentCategory = require('./documentCategory.model');
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
        name: {
            type: String
        },
        description: {
            type: String
        }
    },
    views: { //số lần xem
        type: Number,
        default: 0
    },
    downloads: { //số lần download
        type: Number,
        default: 0
    },
    relationship: { //liên kết với những văn bản nào
        description: { //mô tả
            type: String
        }, 
        documents: [{ //các tài liệu được liên kết
            type: Schema.Types.ObjectId
        }]
    },
    storageLocation: { //nơi lưu trữ bản cứng
        type: String
    },
    fileUpload: {
        type: String //vị trí file upload được tải lên
    },
    fileScan: {
        type: String //vị trí file scan được tải lên
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