const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const CategorySchema = new Schema ({

    company: {
        type: Schema.Types.ObjectId,
        ref: "companies"
    },

    code: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    type: {
        type: String,
        enum: ["product", "material", "equipment", "asset"],
        required: true
    },

    goods: [{
        type: Schema.Types.ObjectId,
        ref: "goods"
    }],

    description: {
        type: String
    }
});

CategorySchema.plugin(mongoosePaginate);

module.exports = Category = mongoose.model("categories", CategorySchema);