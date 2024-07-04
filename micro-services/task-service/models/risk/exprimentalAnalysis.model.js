const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExprimentalSchema = new Schema({
    id:{
        type: Number,
    },
    taskDataset: [[{
        ID:{
            type:String
        },
        value:{
            type:Number
        }
    }]],
    riskDataset: [[{
        ID:{
            type:String
        },
        value:{
            type:Number
        }
    }]],
    risks: [
        {
            isRiskClass: {
                type: Schema.Types.Boolean,
                require: true
            },
            taskClass: [{
                type: Number
            }],
            ID: {
                type: String,
                require: true
            },
            name: {
                type: String,
                require: true
            },
            parents: [{
                type: String,
                require: true
            }],
            probs: [{
                type: Number,

            }],
            prob: {
                type: Number
            },
        }
    ],
    tasks: [{
        class: {
            type: Number
        },
        ID: {
            type: String,
        },
        name: {
            type: String
        },
        predecessor: [
            {
                type: String
            }
        ],
        riskClass:[{
            type:String
        }],
        expectedTime:
        {
            type: Number,
            default: 0
        },
        optimistic:
        {
            type: Number,
            default: 0
        },
        mostlikely:
        {
            type: Number,
            default: 0
        },
        pessimistic:
        {
            type: Number,
            default: 0
        },
        duration:
        {
            type: Number,
            default: 0
        },
        es:
        {
            type: Number,
            default: 0
        },
        ls:
        {
            type: Number,
            default: 0
        },
        ef:
        {
            type: Number,
            default: 0
        },
        lf:
        {
            type: Number,
            default: 0
        },
        slack:
        {
            type: Number,
            default: 0
        },
        prob: {
            type: Number,
        },
        pertProb: {
            type: Number
        },
        probs: [{
            type: Number
        }]
    }]

}, {
    timestamps: true
});

module.exports = (db) => {
    if (!db.models.Exprimental) {
        return db.model('Exprimental', ExprimentalSchema);
    }

    return db.models.Exprimental;
}