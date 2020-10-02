const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const CategorySchema = new Schema ({

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

    description: {
        type: String
    }
});

CategorySchema.plugin(mongoosePaginate);

module.exports = Category = mongoose.model("categories", CategorySchema);