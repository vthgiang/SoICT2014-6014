const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const CustomerCareUnitSchema = new Schema({
    organizationalUnit: {
        type: Schema.Types.ObjectId,
        ref: "OrganizationalUnit",
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
    },
}, {
    timestamps: true,
});

CustomerCareUnitSchema.plugin(mongoosePaginate);
module.exports = (db) => {
    if (!db.models.CustomerCareUnit)
        return db.model('CustomerCareUnit', CustomerCareUnitSchema);
    return db.models.CustomerCareUnit;
}