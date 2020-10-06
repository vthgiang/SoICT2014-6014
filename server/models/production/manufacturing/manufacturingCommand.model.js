const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ManufacturingCommandSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    manufacturingPlan: {
        type: Schema.Types.ObjectId,
        ref: "ManufacturingPlan"
    },
    usages: [{
        date: Date,
        turns: [{
            type: Schema.Types.ObjectId,
            replies: this
        }]
    }],
    good: {
        type: Schema.Types.ObjectId,
        ref: "Good"
    },
    quantity: {
        type: Number
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    approvers: [{ // Danh sách người phê duyệt
        approver: { // Người phê duyệt
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        approveredTime: { // Thời gian phê duyệt
            type: Date
        }
    }],
    responsible: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    accountable: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }]


}, {
    timestamps: true
});

module.exports = (db) => {
    if (!db.models.ManufacturingCommand)
        return db.model("ManufacturingCommand", ManufacturingCommandSchema);
    return db.models.ManufacturingCommand;
}