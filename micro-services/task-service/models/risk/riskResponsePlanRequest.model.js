const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RiskResponsePlanRequestSchema = new Schema({
    approveData:{
        comment:{
            type:String
        },
        approveEmployee:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    },
    status:{
        type:String,
        default:'none'
    },
    process:{
        type:Schema.Types.ObjectId,
        ref:'TaskProcess'
    },
    content:{
        type:String
    },
    reson:{
        type:String
    },
    sendEmployee:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    receiveEmployees:[{
        type:Schema.Types.ObjectId,
        ref:"User"
    }]
}, {
    timestamps: true
});

module.exports = (db) => {
    if (!db.models.RiskResponsePlanRequest) {
        return db.model('RiskResponsePlanRequest', RiskResponsePlanRequestSchema);
    }

    return db.models.RiskResponsePlanRequest;
}