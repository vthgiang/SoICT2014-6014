const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const Company = require('../system-admin/company.model');
const Document = require('./document.model');

// Create Schema
const DocumentCategorySchema = new Schema({
    name: { //tên 
        type: String,
        required: true
    },
    documents: [{ //chứa những document nào
        type: Schema.Types.ObjectId,
        ref: Document
    }],
    company: { //thuộc công ty nào
        type: Schema.Types.ObjectId,
        ref: Company,
        required: true
    }
},{
    timestamps: true, //ngày tạo và ngày sửa gần nhất
    toJSON: { virtuals: true }
});

DocumentCategorySchema.plugin(mongoosePaginate);

module.exports = DocumentCategory = mongoose.model("document_categories", DocumentCategorySchema);