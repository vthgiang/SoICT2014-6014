const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const StatusSchema = new Schema({
    code: { // Mã trạng thái khách hàng
        type: String,
        required: true
    },
    name: { // Tên trạng thái
        type: String,
        required: true
    },
    description: { // Mô tả trạng thái
        type: String
    },
}, {
    timestamps: true,
});

StatusSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.Status)
        return db.model('Status', StatusSchema);
    return db.models.Status;
}
