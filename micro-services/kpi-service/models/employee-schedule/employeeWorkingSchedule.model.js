const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const EmployeeWorkingScheduleSchema = new Schema(
    {
        employee: {
            type: Schema.Types.ObjectId,
            ref: "Employee"
        },
        // Ngày làm việc
        date: {
            type: Date
        },
        // Biểu thị ca làm việc của 1 nhân viên trong ngày
        shift: {
            // Khung thời gian làm việc trong ngày của nhân viên
            startWorkingTime: {
                type: String
            },
            endWorkingTime: {
                type: String
            },
            // Danh sách những công việc mà họ sẽ thực hiện trong ngày hôm đấy
            tasks: [
                {
                    startWorkingTime: {
                        type: String
                    },
                    endWorkingTime: {
                        type: String
                    },
                    // type = 1: Journey, type = 2: Task
                    type: {
                        type: Number
                    },
                    // Chuyến hành trình mà shipper sẽ thực hiện
                    journey: {
                        type: Schema.Types.ObjectId,
                        ref: "Journey"
                    },
                    // Công việc mà người nhân viên trong kho được gán
                    task: {
                        type: Schema.Types.ObjectId,
                        ref: "Task"
                    }
                }
            ]
        },
    },
    {
        timestamps: true,
    }
);

EmployeeWorkingScheduleSchema.plugin(mongoosePaginate)

module.exports = (db) => {
    if (!db.models.EmployeeWorkingSchedule) return db.model("EmployeeWorkingSchedule", EmployeeWorkingScheduleSchema);
    return db.models.EmployeeWorkingSchedule;
};