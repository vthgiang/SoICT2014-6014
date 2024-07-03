
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const RiskDistributionSchema = mongoose.Schema({
    tech:{
        type:String,
        default:'mle'
    },
    taskRelate:[{
        type:String
    }],
    
    isRiskClass:{
        type:Schema.Types.Boolean,
        require:true  
    },
    taskClass:[{
        type: Number
    }],
    riskID:{
        type:  Number,
        require: true
    },
    name:{
        type: String,
        require: true
    },
    parents:[{
        type:  Number,
        require: true
    }],
    probs :[{
        type:  Number,
        
    }],
    parentList: [{
        type: Schema.Types.ObjectId,
        ref: 'RiskDistribution'
    }],
    prob:{
        type: Number
    },
  
})
module.exports = (db) => {
    if (!db.models.RiskDistribution) {
        return db.model('RiskDistribution', RiskDistributionSchema);
    }

    return db.models.RiskDistribution;
}