const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConfiguraionSchema = new Schema({
    backup: {
        time: {
            type: String,
            default: '0 0 2 15 * *'
        },
        limit: {
            type: Number,
            default: 10
        }
    }
}, {
    timestamps: true
});

module.exports = Configuraion = mongoose.model("configuraions", ConfiguraionSchema);