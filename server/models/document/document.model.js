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

    /**Thông tin cơ bản về tài liệu*/
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
    issuingBody: { // Cơ quan ban hành
        type: String
    },
    signer: {  // Người ký
        type: String
    },
    officialNumber:{ // Số hiệu. VD: 920/QD-NHNN
        type: String
    },
    views: [{
        viewer: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        },
        time: {
            type: Date,
            default: Date.now()
        }
    }],
    downloads: [{
        downloader: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        },
        time: {
            type: Date,
            default: Date.now()
        },
    }],
    numberOfView: { //số lần xem
        type: Number,
        default: 0
    },
    numberOfDownload: { //số lần download
        type: Number,
        default: 0
    },

    //**Thông tin về các phiên bản của tài liệu này*/
    versions: [{
        versionName: { // tên phiên bản
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
        replies: this
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