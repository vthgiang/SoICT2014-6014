const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const CompanySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    short_name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    log: {
        type: Boolean,
        default: true
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    links: [{
        type: Schema.Types.ObjectId,
        ref: 'links'
    }],
    super_admin: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
},{
    timestamps: true
});

CompanySchema.plugin(mongoosePaginate);

module.exports = Company = mongoose.model("companies", CompanySchema);