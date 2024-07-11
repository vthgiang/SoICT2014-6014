const {
    ManufacturingQualityInspection,
    ManufacturingCommand
} = require('../../../../../models');

const {
    connect
} = require('../../../../../helpers/dbHelper');

exports.getAllManufacturingQualityInspections = async (query, portal) => {
    let { page, limit, manufacturingCommand } = query;
    let options = {};

    if (manufacturingCommand) {
        options.manufacturingCommand = manufacturingCommand;
    }

    if (!page || !limit) {
        let docs = await ManufacturingQualityInspection(connect(DB_CONNECTION, portal))
            .find(options)
            .populate([{
                path: "manufacturingCommand",
                select: "id code"
            }, {
                path: "responsible",
                select: "id name email"
            }, {
                path: "criteria",
                select: "id name"
            }, {
                path: "errorList",
                select: "id name"
            }]);
        let manufacturingQualityInspections = {};
        manufacturingQualityInspections.docs = docs;
        return { manufacturingQualityInspections }
    } else {
        let manufacturingQualityInspections = await ManufacturingQualityInspection(connect(DB_CONNECTION, portal))
            .paginate({}, {
                limit: limit,
                page: page,
                populate: [{
                    path: "reporter",
                }]
            })
        return { manufacturingQualityInspections }
    }
}

exports.createManufacturingQualityInspection = async (data, portal) => {
    let newQualityInspection = await ManufacturingQualityInspection(connect(DB_CONNECTION, portal)).create(data);
    let manufacturingCommand = await ManufacturingCommand(connect(DB_CONNECTION, portal)).findById(data.manufacturingCommand);

    let index = manufacturingCommand.workOrders.findIndex(item => item.operationId == data.workOrder);
    manufacturingCommand.workOrders.map(item => console.log(typeof item.operationId))

    if (index >= 0) {
        manufacturingCommand.workOrders[index].qc_inspection = newQualityInspection._id;
    }

    await manufacturingCommand.save();
    
    let manufacturingQualityInspections = await ManufacturingQualityInspection(connect(DB_CONNECTION, portal))
        .findById(newQualityInspection._id)
    
    return { manufacturingQualityInspections }
}

exports.getNumberCreatedInspection = async (portal) => {
    numInspections = await ManufacturingQualityInspection(connect(DB_CONNECTION, portal)).countDocuments();
    return numInspections
}
