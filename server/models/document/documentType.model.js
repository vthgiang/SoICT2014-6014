const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { Company, Document } = require('../').schema;
const mongoosePaginate = require('mongoose-paginate-v2');

// Create Schema
const DocumentTypeSchema = new Schema({
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

DocumentTypeSchema.plugin(mongoosePaginate);

module.exports = DocumentType = mongoose.model("document_types", DocumentTypeSchema);