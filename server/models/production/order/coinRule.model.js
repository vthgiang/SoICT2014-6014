const  mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CoinRuleSchema = new Schema({
    coinToDiscountMoney: {
        type: Number,
        required: true
    }, 
    minCoin: {
        type: Number,
        required: Number
    },
    createAt: {
        type: Date
    },
    updateAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = (db) =>{
    if (!db.models.CoinRule) 
        return db.model('CoinRule', CoinRuleSchema)
    return db.models.CoinRule
}