const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const VehicleSchedule = new Schema(
    {
        vehicle: {
            type: Schema.Types.ObjectId,
            ref: "Vehicle"
        },
        // Ngày làm việc
        date: {
            type: Date
        },
        // Biểu thị ca làm việc của 1 xe trong ngày
        shift: {
            // Khung thời gian làm việc trong ngày
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
                    // Chuyến hành trình mà shipper sẽ thực hiện
                    journey: {
                        type: Schema.Types.ObjectId,
                        ref: "Journey"
                    },
                }
            ]
        },
    },
    {
        timestamps: true,
    }
);

module.exports = (db) => {
    if (!db.models.VehicleSchedule) return db.model("VehicleSchedule", VehicleSchedule);
    return db.models.VehicleSchedule;
};