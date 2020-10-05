const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ManufacturingCommandSchema = new Schema({

}, {
    timestamps: true
});

module.exports = (db) => {
    if (!db.models.ManufacturingCommand)
        return db.model("ManufacturingCommand", ManufacturingCommandSchema);
    return db.models.ManufacturingCommand;
}