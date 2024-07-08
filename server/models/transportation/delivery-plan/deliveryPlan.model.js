const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");
// const { Journey } = require("../..");

// Bảng kế hoạch vận chuyển hàng trong 1 ngày
const DeliveryPlanSchema = new Schema(
    {
        code: {
            type: String
        },
        // Giải pháp tối ưu cho kế hoạch giao hàng
        solution: {
            solution: {
                type: Schema.Types.ObjectId,
                ref: "Solution"
            },
            journeys: [{
                type: Schema.Types.ObjectId,
                ref: "Journey"
            }]
        },
        // Thông tin đầu vào khi lập kế hoạch gồm: Thông tin về đơn hàng, đội xe,
        // các thông số cấu hình thuật toán tối ưu
        problemAssumption: {
            type: Schema.Types.ObjectId,
            ref: "ProblemAssumption"
        },
        // Ngày giao hàng dự kiến
        estimatedDeliveryDate: {
            type: String
        }
    },
    {
        timestamps: true,
    }
);

DeliveryPlanSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.DeliveryPlan) return db.model("DeliveryPlan", DeliveryPlanSchema);
    return db.models.DeliveryPlan;
};
