const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Bảng cấu hình ca làm việc
const ConfigurationTurnSchema = new Schema({
    turnNumber: {
        type: Number
    }
}, {
    timestamps: true
});

module.exports = (db) => {
    if (!db.models || !db.models.ConfigurationTurn)
        return db.model('ConfigurationTurn', ConfigurationTurnSchema);
    return db.models.ConfigurationTurn;
}
