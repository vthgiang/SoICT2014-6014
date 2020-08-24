const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConfiguraionSchema = new Schema({
    database: {
        type: String
    },
    backup: {
        time: {
            second: {
                type: String,
                default: '0'
            },
            minute: {
                type: String,
                default: '0'
            },
            hour: {
                type: String,
                default: '2'
            },
            date: {
                type: String,
                default: '*'
            },
            month: {
                type: String,
                default: '*'
            },
            day: {
                type: String,
                default: '*'
            }
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