const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const RoutePickingSchema = new Schema({
  waveId: {
    type: Number,
  },
  distanceRoute: {
    type: Number,
  },
  chemins: {
    type: [[Number]],
  },
  orderId: [
    {
      type: Schema.Types.ObjectId,
      ref: 'SalesOrder',
    },
  ],
  listInfoOrders: [
    {
      good: {
        type: Schema.Types.ObjectId,
        ref: 'Good',
      },
      location: String,
      quantity_taken: {
        type: Number,
      },
    },
  ],
});

RoutePickingSchema.plugin(mongoosePaginate);

module.exports = (db) => {
  if (!db.models.RoutePicking)
    return db.model('RoutePickings', RoutePickingSchema);
  return db.models.RoutePicking;
};
