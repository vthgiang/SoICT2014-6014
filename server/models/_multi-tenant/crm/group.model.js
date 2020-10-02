const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const GroupSchema = new Schema({
    code: { // Mã nhóm khách hàng
        type: String,
        required: true
    },
    name: { // Tên nhóm khashc hàng (Bán lẻ, Bán buôn)
        type: String,
        required: true
    },
    description: { // Mô tả nhóm khashc hàng
        type: String
    },
    customerTotal: {
        type: Number,
        default: 0
    },
    promotion: [{ // Ưu đãi theo nhóm khách hàng
        code: {
            type: String
        },
        name: {
            type: String
        },
        value: {
            type: String,
        }
    }]
}, {
    timestamps: true,
});

CrmGroupSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.CrmGroup)
        return db.model('CrmGroup', GroupSchema);
    return db.models.CrmGroup;
}
