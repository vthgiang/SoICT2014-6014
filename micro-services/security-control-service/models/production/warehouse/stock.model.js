const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const StockSchema = new Schema ({

    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },

    code: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    address: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["1", "2", "3", "4"]
    },

    managementLocation: [{
        role: {
            type: Schema.Types.ObjectId,
            ref: 'Role'
        },

        managementGood: [{
            type: String,
            enum: ["product", "material", "equipment", "waste"],
        }]
    }],

    goods: [{

        good: {
            type: Schema.Types.ObjectId,
            ref: "Good"
        },

        maxQuantity: {
            type: Number
        },

        minQuantity: {
            type: Number
        }
    }],
    organizationalUnit: {// Kho thuộc cơ cấu tổ chức nào
        type: Schema.Types.ObjectId,
        ref: "OrganizationalUnit"
    },
    startTime: {
        type: String,
        required: true
    },

    endTime: {
        type: String,
        required: true
    },

});

StockSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if(!db.models.Stock){
        return db.model('Stock', StockSchema);
    }
    return db.models.Stock;
}
