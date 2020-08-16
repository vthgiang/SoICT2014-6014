const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConfiguraionSchema = new Schema({
    backup: {
        time: {
            type: String,
            default: '* * * * * *'
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