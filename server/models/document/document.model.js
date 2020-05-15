const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

// Create Schema
const DocumentSchema = new Schema({
    name: { //tên 
        type: String,
        required: true
    },
    company: { //thuộc công ty nào
        type: Schema.Types.ObjectId,
        ref: 'companies',
        required: true
    },
    domain: {
        type: Schema.Types.ObjectId,
        ref: 'document_domains'
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'document_categories'
    },
    description: { //mô tả
        type: String
    },
    applyAt: { //ngày áp dụng
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
            type: Schema.Types.ObjectId,
            refs: 'documents'
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

DocumentSchema.plugin(mongoosePaginate);

module.exports = Document = mongoose.model("documents", DocumentSchema);