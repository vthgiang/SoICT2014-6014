const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const CustomerRankPointSchema = new Schema({
    creator: {// Người tạo xếp hạng
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    point: { // số điểm tối thiểu
        type: Number,
        required: true,
    },
    name: { // Tên xếp hạng khách hàng
        type: String,
        required: true,
    },

    updatedAt: { // ngày cập nhật
        type: Date,
    },
    createdAt: { // ngày tạo
        type: Date,
    },
    updatedBy: {// người cập nhật
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    description: { // mô tả
        type: String,
    }
    ,


}, {
    timestamps: true,
});

CustomerRankPointSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.CustomerRankPoint)
        return db.model('CustomerRankPoint', CustomerRankPointSchema);
    return db.models.CustomerRankPoint;
}
