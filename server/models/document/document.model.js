const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const { Company, DocumentType, DocumentCategory } = require('../').schema;


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
    dateOfApplication: { //ngày áp dụng
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
    numberOfView: { //số lần xem
        type: Number,
        default: 0
    },
    numberOfDownload: { //số lần download
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
    archivedRecordPlace: { //nơi lưu trữ hồ sơ bản cứng
        type: String
    },
    uploadedFile: {
        type: String //vị trí file upload (file doc) được tải lên
    },
    scannedFile: {
        type: String //vị trí file scan (file có chữ ký) được tải lên
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

module.exports = Document = mongoose.model("documents", DocumentSchema);