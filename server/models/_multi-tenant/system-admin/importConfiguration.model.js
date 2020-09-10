const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImportConfiguraionSchema = new Schema({
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    configuration: {
        type: Object,
        required: true
    },
    type: {
        type: String,
        enum: ['salary', 'taskTemplate']
    },
}, {
    timestamps: true
});

module.exports = (db) => {
    if(!db.models.ImportConfiguraion)
        return db.model('ImportConfiguraion', ImportConfiguraionSchema);
    return db.models.ImportConfiguraion;
}