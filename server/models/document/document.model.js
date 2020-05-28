const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

// Create Schema
const DocumentSchema = new Schema({

    company: { //thuộc công ty nào
        type: Schema.Types.ObjectId,
        ref: 'companies',
        required: true
    },

    /**Thông tin cơ bản */
    name: { //tên 
        type: String,
        required: true
    },
    domains: [{
        type: Schema.Types.ObjectId,
        ref: 'document_domains'
    }],
    category: {
        type: Schema.Types.ObjectId,
        ref: 'document_categories'
    },
    description: { //mô tả
        type: String
    },

    //**Thông tin về phiên bản hiện tại và các phiên bản khác nếu có */
    versionName: { // tên phiên bản
        type: String,
        required: true
    },
    issuingBody: { // Cơ quan ban hành
        type: String
    },
    officialNumber:{ // Số hiệu. VD: 920/QD-NHNN
        type: String
    },
    issuingDate: { // Ngày ban hành
        type: Date
    },
    effectiveDate: { // ngày áp dụng
        type: Date
    },
    expiredDate: { // Ngày hết hạn
        type: Date
    },
    signer: {  // Người ký
        type: String
    },
    numberOfView: { //số lần xem
        type: Number,
        default: 0
    },
    numberOfDownload: { //số lần download
        type: Number,
        default: 0
    },
    file: {
        type: String // vị trí lưu file upload (file doc) được tải lên
    },
    scannedFileOfSignedDocument: {
        type: String // vị trí file scan (file có chữ ký) được tải lên
    },

    versions: [{ // Các phiên bản khác
        versionName: { // tên phiên bản
            type: String
        },
        description: {
            type: String
        },
        issuingBody: { // Cơ quan ban hành
            type: String
        },
        officialNumber:{ // Số hiệu. VD: 920/QD-NHNN
            type: String
        },
        issuingDate: { // Ngày ban hành
            type: Date
        },
        effectiveDate: { // ngày áp dụng
            type: Date
        },
        expiredDate: { // Ngày hết hạn
            type: Date
        },
        signer: {  // Người ký
            type: String
        },
        numberOfView: { //số lần xem
            type: Number,
            default: 0
        },
        numberOfDownload: { //số lần download
            type: Number,
            default: 0
        },
        file: {
            type: String // vị trí lưu file upload (file doc) được tải lên
        },
        scannedFileOfSignedDocument: {
            type: String // vị trí file scan (file có chữ ký) được tải lên
        },
    }],
    

    /**Liên kết văn bản */
    relationshipDescription: { //mô tả
        type: String
    }, 
    relationshipDocuments: [{ //các tài liệu được liên kết
        type: Schema.Types.ObjectId,
        refs: 'documents'
    }],

    /** Những vị trí có quyền xem mẫu này */
    roles: [{
        type: Schema.Types.ObjectId,
        ref: 'roles'
    }],

    /**Hồ sơ lưu trữ bản cứng */
    archivedRecordPlaceInfo: {
        type: String
    },
    archivedRecordPlaceOrganizationalUnit: {
        type: Schema.Types.ObjectId,
        ref: 'organizational_units'
    },
    archivedRecordPlaceManager: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
},{
    timestamps: true, //ngày tạo và ngày sửa gần nhất
    toJSON: { virtuals: true }
});

DocumentSchema.plugin(mongoosePaginate);

module.exports = Document = mongoose.model("documents", DocumentSchema);