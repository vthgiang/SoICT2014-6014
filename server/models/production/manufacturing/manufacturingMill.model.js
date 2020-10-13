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
    description: { // Mô tả xưởng
        type: String
    },
    teamLeader: { //Tên tổ trưởng của xưởng
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    workSchedules: [{
        year: Number,
        numberOfTurn: [{
            type: Number
        }],
        stateOfTurn: [{
            // type: Schema.Types.ObjectId,
            // ref: "ManufacturingCommand",
            type: Number,
            default: null
        }]
    }]
}, {
    timestamps: true
});

module.exports = (db) => {
    if (!db.models.ManufacturingMill)
        return db.model('ManufacturingMill', ManufacturingMillSchema);
    return db.models.ManufacturingMill;
}