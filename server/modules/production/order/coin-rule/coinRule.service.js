const {
    CoinRule
} = require(`../../../../models`);

const {
    connect
} = require(`../../../../helpers/dbHelper`);



exports.createNewCoinRule = async (data, portal) => {
    let newCoinRule = await CoinRule(connect(DB_CONNECTION, portal)).create({
        coinToDiscountMoney: data.coinToDiscountMoney,
        minCoin: data.minCoin
    })

    let coinRule = await CoinRule(connect(DB_CONNECTION, portal)).findById({ _id: newCoinRule._id })
    return {coinRule};
}