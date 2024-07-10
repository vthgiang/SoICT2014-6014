const  mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CoinRuleSchema = new Schema({
    coinToDiscountMoney: { //1 xu đổi ra được bao nhiêu vnđ (mặc định bằng 1)
        type: Number,
        required: true
    }, 
    minCoin: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
})

module.exports = (db) =>{
    if (!db.models.CoinRule) 
        return db.model('CoinRule', CoinRuleSchema)
    return db.models.CoinRule
}