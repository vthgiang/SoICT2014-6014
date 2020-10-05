const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Bảng xưởng sản xuất
const ManufacturingMillSchema = new Schema({
    code: { // Mã xưởng sản xuất
        type: String,
        required: true
    },
    name: { // Tên xưởng sản xuất
        type: String,
        required: true
    },
    manufacturingWorks: { // Tên nhà máy chứa xưởng
        type: Schema.Types.ObjectId,
        ref: 'ManufacturingWorks'
    },
    desciption: { // Mô tả xưởng
        type: String
    }
}, {
    timestamps: true
});

module.exports = (db) => {
    if (!db.models.ManufacturingMill)
        return db.model('ManufacturingMill', ManufacturingMillSchema);
    return db.models.ManufacturingMill;
}