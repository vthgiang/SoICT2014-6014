const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const DocumentCategorySchema = new Schema({
    name: { //tên 
        type: String,
        required: true
    },
    description: { //tên 
        type: String,
        required: true
    },
    documents: [{ //chứa những document nào
        type: Schema.Types.ObjectId,
        ref: 'Document'
    }],
}, {
    timestamps: true, //ngày tạo và ngày sửa gần nhất
    toJSON: { virtuals: true }
});

DocumentCategorySchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if(!db.models.DocumentCategory)
        return db.model('DocumentCategory', DocumentCategorySchema);
    return db.models.DocumentCategory;
}