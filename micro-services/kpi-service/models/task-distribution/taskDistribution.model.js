
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TaskDistributionSchema = mongoose.Schema({
    processName:{
        type: String,
        require: true
    },
    processDescription:{
        type: String,
    },
   
    tasks:[{
        class:{
            type:Number
        },
        risks :[{
            type:Number
        }],
        taskID:{
            type: String,
        },
        name:{
            type:String
        },
        description: {
            type:String
        },
        riskTaskCPT: [
            {
                type: Number
            }
        ],
        parentList:[
            {
                type: String
            }
        ],
        childList:[
            {
                type: String
            }
        ],
        expectedTime:
        {
            type:Number,
            default: 0
        },
        optimistic:
        {
            type:Number,
            default: 0
        },
        mostlikely:
        {
            type:Number,
            default: 0
        },
        pessimistic:
        {
            type:Number,
            default: 0
        },
        duration: 
        {
            type:Number,
            default: 0
        },
        es:
        {
            type:Number,
            default: 0
        },
        ls: 
        {
            type:Number,
            default: 0
        },
        ef:
        {
            type:Number,
            default: 0
        },
        lf:
        {
            type:Number,
            default: 0
        },
        slack: 
        {
            type:Number,
            default: 0
        },
        prob:{
            type: Number,
        },
        pertProb:{
            type: Number
        },
        probs:[{
            type:Number
        }]
    }]
})
module.exports = (db) => {
    if (!db.models.TaskDistribution) {
        return db.model('TaskDistribution', TaskDistributionSchema);
    }

    return db.models.TaskDistribution;
}