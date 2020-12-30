const {
    SalesOrder
} = require(`../../../../models`);

const {
    connect
} = require(`../../../../helpers/dbHelper`);



exports.create = async (data, portal) => {
}

exports.getAllSalesOrders = async (portal) => {
    let salesOrders = await SalesOrder(connect(DB_CONNECTION, portal)).find()
        .populate([{
            path: 'goods.good',
            populate: [{
                path: 'manufacturingMills.manufacturingMill'
            }]
        }]);
    return { salesOrders }
}