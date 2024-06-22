const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const RoutePickingSchema = new Schema({
    waveId: {
        type: Number,
    },
    distanceRoute: {
        type: Number,
    },
    chemins: {
        type: Array,
    },
    orderId: {
        type: Array,
    },
    listInfoOrders: [
        {
            good: {
                type: Schema.Types.ObjectId,
                ref: "Good",
            },
            location: String,
            quantity_taken: {
                type: Number,
            },

        }
    ]
});

RoutePickingSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.InventoryWarehouse)
        return db.model("RoutePicking", RoutePickingSchema);
    return db.models.InventoryWarehouse;
};
