const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const CustomerForecastSchema = new Schema({
    code: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    gender: {
        type: Number,
    },
    customerType: {
        type: Number,
    },
    birthDate: {
        type: Date,
    },
    mobilephoneNumber: {
        type: String,
    },
    email: {
        type: String,
    },
    address: {
        type: String,
    },
    education: {
        type: String,
    },
    maritalStatus: {
        type: String,
    },
    income: {
        type: Number,
    },
    kidhome: {
        type: Number,
    },
    teenhome: {
        type: Number,
    },
    dt_Customer: {
        type: Date,
    },
    recency: {
        type: Number,
    },
    mntKidswear: {
        type: Number,
    },
    mntTeenswear: {
        type: Number,
    },
    mntMenswear: {
        type: Number,
    },
    mntWomenswear: {
        type: Number,
    },
    mntSportswear: {
        type: Number,
    },
    mntSleepwear: {
        type: Number,
    },
    numDealsPurchases: {
        type: Number,
    },
    numCatalogPurchases: {
        type: Number,
    },
    numStorePurchases: {
        type: Number,
    },
    numWebPurchases: {
        type: Number,
    },
    numWebVisitsMonth: {
        type: Number,
    },
    acceptedCmp: {
        type: Number,
    },
    complain: {
        type: Number,
    },
    response: {
        type: Number,
    },
    customerSource: {
        type: String,
    },
    response: {
        type: Number,
        default: 2
    }
}, {
    timestamps: true,
});

CustomerForecastSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.CustomerForecast)
        return db.model('CustomerForecast', CustomerForecastSchema);
    return db.models.CustomerForecast;
};