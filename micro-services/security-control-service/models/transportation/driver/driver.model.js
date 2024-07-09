const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

// Bảng tài xế của 1 đơn vị vận chuyển
const Driver = new Schema(
    {
        name: {
            type: String
        },
        driver: {
            type: Schema.Types.ObjectId,
            ref: "Employee"
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        drivingLicense : [{
            type: String,
            enum: [
                "A2",
                "B1",
                "B2",
                "C",
                "FC",
                "FB1",
                "FB2",
            ],
        }],
        experienceDescription: {
            type: String
        },
        workingSchedules: [{
            workingSchedule: {
                type: Schema.Types.ObjectId,
                ref: "EmployeeWorkingSchedule"
            },
            date: {
                type: Date
            }
        }],
        salary: {
            type: Number
        },
        bonusSalary: [{
            time: {
                type: Date
            },
            cost: {
                type: Number
            }
        }],
        // 1 là đang không làm việc, 2 là đang làm việc
        status: {
            type: Number,
        }
    },
    {
        timestamps: true,
    }
);

Driver.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.Driver) return db.model("Driver", Driver);
    return db.models.Driver;
};