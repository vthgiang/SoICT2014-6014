const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const CrmUnitSchema = new Schema({
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

CrmUnitSchema.plugin(mongoosePaginate);
module.exports = (db) => {
    if (!db.models.CrmUnit)
        return db.model('CrmUnit', CrmUnitSchema);
    return db.models.CrmUnit;
}