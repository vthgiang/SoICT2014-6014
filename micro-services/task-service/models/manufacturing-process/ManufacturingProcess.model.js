const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ManufacturingProcessSchema = new Schema({

    manfucturingProcessCode: {
        type: String,
        required: true,
    },
    manufacturingName: {
        type: String,
        required: true,
    },
    organizationalUnit: {
        type: String,
        required: true
    },
    quantityOfDay: {
        type: Number,
        default: 0,
    },
    productionLineTemplate: {
        type: Schema.Types.ObjectId,
        ref: "ProductionLine"
    },
    timeStartOfDay: {
        type: String,
        default: "08:00 AM"
    },
    timeEndOfDay: {
        type: String,
        default: "05:00 PM"
    },
    processStatus: {
        type: String
    },
    progress: {
        type: Number,
        default: 0
    },
    managerEmployee: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        requried: true
    }],
    supporterEmployee: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
    xmlDiagram: {
        type: String,
    },
    tasks: [
        {
            name: {
                type: String,
                required: true,
            },
            description: {
                type: String,
            },
            code: {
                type: String,
            },
            taskActions: [],
            preceedingTasks: [
                {
                    task: {
                        type: String,
                    },
                    link: {
                        type: String,
                    },
                },
            ],
            followingTasks: [
                {
                    task: {
                        type: String,
                    },
                    link: {
                        type: String,
                    },
                },
            ],
        }
    ]
}, { timestamps: true })

module.exports = (db) => {
    if (!db.models.ManufacturingProcess) return db.model("ManufacturingProcess", ManufacturingProcessSchema);
    return db.models.ManufacturingProcess;
};