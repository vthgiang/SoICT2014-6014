const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RiskResponsePlanSchema = new Schema({
    riskApply:{
        type: Number
    },
    riskLevel:{
        type:Number
    },
    applyCase:{
        type:String
    },
    probabilityMitigationMethod:{
        type:String
    },
    impactMitigationMethod:{
        type:String
    },
    // implementationDate:{
    //     type:Date
    // }
}, {
    timestamps: true
});

module.exports = (db) => {
    if (!db.models.RiskResponsePlan) {
        return db.model('RiskResponsePlan', RiskResponsePlanSchema);
    }

    return db.models.RiskResponsePlan;
}