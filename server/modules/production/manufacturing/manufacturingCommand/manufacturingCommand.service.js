const {
    ManufacturingCommand, ManufacturingPlan
} = require(`${SERVER_MODELS_DIR}`);
const {
    connect
} = require(`${SERVER_HELPERS_DIR}/dbHelper`);


exports.createManufacturingCommand = async (data, portal) => {
    let newManufacturingCommand = await ManufacturingCommand(connect(DB_CONNECTION, portal)).create({
        code: data.code,
        manufacturingPlan: data.manufacturingPlan,
        manufacturingMill: data.manufacturingMill,
        startDate: data.startDate,
        endDate: data.endDate,
        startTurn: data.startTurn,
        endTurn: data.endTurn,
        good: data.good,
        quantity: data.quantity,
        creator: data.creator,
        approvers: data.approvers.map(x => {
            return {
                approver: x.approver,
                approvedTime: null
            }
        }),
        responsibles: data.responsibles.map(x => {
            return x
        }),
        accountables: data.accountables.map(x => {
            return x
        }),
        description: data.description
    });

    let manufacturingCommand = await ManufacturingCommand(connect(DB_CONNECTION, portal)).findById(newManufacturingCommand);

    let manufacturingPlan = await ManufacturingPlan(connect(DB_CONNECTION, portal)).findById(data.manufacturingPlan);
    manufacturingPlan.manufacturingCommands.push(manufacturingCommand._id);
    await manufacturingPlan.save();
    return { manufacturingCommand }
}