const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RiskSchema = new Schema({
    approvalData:{
        approveType:{
            type:Number
        },
        description:{
            type:String
        }
    },
    ranking:{
        type:Number
    },
    riskID:{
        type: Number,
    },
    parentChecked:[{
        type:Number
    }],
    riskName: {
        type: String,
        required: true
    },
    riskStatus:{
        type: String,
    },
    taskRelate: [{
        type: Schema.Types.ObjectId,
        ref:"Task"
    }],
    taskIDList:[{
        type: String,
    }],
    riskParents: [
        {
            type: Number
        }
    ],
    description: {
        type: String,
        default: '',
        required: false
    },
    raisedDate: {
        type: Date,
    },
    occurrenceDate: {
        type: Date,
    },
    responsibleEmployees: [
        {
            //người thực hiện
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    accountableEmployees: [
        {
            //người phê duyệt
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    impact:{
        type: Schema.Types.ObjectId,
        ref:"Impact"
    },
    riskResponsePlans:[{
        type: Schema.Types.ObjectId,
        ref:"RiskResponsePlan"
    }]
}, {
    timestamps: true
});

module.exports = (db) => {
    if (!db.models.Risk) {
        return db.model('Risk', RiskSchema);
    }

    return db.models.Risk;
}