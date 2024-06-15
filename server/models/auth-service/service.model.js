const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const ServiceSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: "Company",
    },
    active: {
        type: Boolean,
        required: true,
        default: true,
    },
    status: {
        type: Number,
        required: true,
        default: 0,
    },
    deleteSoft: {
        type: Boolean,
        required: true,
        default: false,
    },
    tokens: [{
        type: String,
    }],
},
{
    timestamps: true,
    toJSON: { virtuals: true },
});

ServiceSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.Service) return db.model("Service", ServiceSchema);
    return db.models.Service;
};
