const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlanSchema = new Schema({
    code: { // Mã kế hoạch
        type: String,
        required: true
    },
    planName: { // Tên kế hoạch
        type: String,
        required: true
    },
    description: { // Mô tả kế hoạch
        type: String
    }
});

module.exports = Plan = (db) => db.model('plans', PlanSchema);