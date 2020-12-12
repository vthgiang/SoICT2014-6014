const {
    SalesOrder
} = require(`${SERVER_MODELS_DIR}`);

const {
    connect
} = require(`${SERVER_HELPERS_DIR}/dbHelper`);



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