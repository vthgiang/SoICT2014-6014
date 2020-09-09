const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

// Create Schema
const LocationSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    districts: [{
        name: {
            type: String
        },
        communes: [
            {
                name: {
                    type: String
                }
            }
        ]
    }]
},{
    timestamps: true,
    toJSON: { virtuals: true }
});

LocationSchema.plugin(mongoosePaginate);

module.exports = Location = (db) => db.model("locations", LocationSchema);