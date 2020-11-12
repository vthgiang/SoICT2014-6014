const {
    ManufacturingPlan
} = require(`${SERVER_MODELS_DIR}`);

const {
    connect
} = require(`${SERVER_HELPERS_DIR}/dbHelper`);

exports.createManufacturingPlan = async (data, portal) => {
    console.log(data);
    let newManufacturingPlan = await ManufacturingPlan(connect(DB_CONNECTION, portal)).create({
        code: data.code,
        manufacturingOrder: data.manufacturingOrder ? data.manufacturingOrder : null,
        salesOrder: data.salesOrder ? data.salesOrder : null,
        goods: data.goods.map(x => {
            return {
                good: x.good,
                quantity: x.quantity,
                orderedQuantity: x.orderedQuantity ? x.orderedQuantity : null
            }
        }),
        approvers: data.approvers.map(x => {
            return {
                approver: x.approver,
                approvedTime: null
            }
        }),
        creator: data.creator,
        startDate: data.startDate,
        endDate: data.endDate,
        description: data.description,
        logs: [{
            creator: data.creator,
            title: data.title,
            description: data.description
        }]
    });

    let manufacturingPlan = await ManufacturingPlan(connect(DB_CONNECTION, portal)).findById(newManufacturingPlan._id);

    return { manufacturingPlan }
}