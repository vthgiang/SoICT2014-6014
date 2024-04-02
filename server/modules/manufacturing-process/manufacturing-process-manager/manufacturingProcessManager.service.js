const { ManufacturingProcess } = require('../../../models')
const { connect } = require('../../../helpers/dbHelper')

exports.getAllManufacturingProcess = async (params, portal) => {
    let keySearch;
    if (params.processName !== undefined && params.processName.length !== 0) {
        keySearch = {
            ...keySearch,
            name: {
                $regex: params.processName,
                $options: "i"
            }
        }
    }

    let page, perPage;
    page = params?.page ? Number(params.page) : 1;
    perPage = params?.perPage ? Number(params.perPage) : 20;

    let totalList = await ManufacturingProcess(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    let templateCollection = await ManufacturingProcess(connect(DB_CONNECTION, portal)).find(keySearch)
        .skip((page - 1) * perPage)
        .limit(perPage)
        .populate({ path: 'supporterEmployee', select: '_id, name' })
        .populate({ path: 'managerEmployee', select: '_id, name' })
        .populate({ path: 'productionLineTemplate', select: '_id, name' });

    return {
        data: templateCollection,
        totalList
    }
}

exports.getManufacturingProcessById = async (id, portal) => {
    // console.log("iddddd: ", id)
    let manufacturingProcess = await ManufacturingProcess(connect(DB_CONNECTION, portal))
        .findById({ _id: id })

    if (manufacturingProcess) {
        return manufacturingProcess;
    }
    return -1;
}

exports.createManufacturingProcess = async (data, portal) => {
    let tasks = [];
    let processDiagram = data.processDiagram;
    processDiagram.xmlDiagram.tasks.forEach(item => {
        let task = {
            name: item.name,
            code: item.code,
            description: item.description,
            preceedingTasks: item.preceedingTasks,
            followingTasks: item.followingTasks,
            taskActions: item.taskActions
        }
        tasks.push(task);
    })
    let processInfo = data.processInfo;
    let processSave = {
        manfucturingProcessCode: processInfo.manufacturingProcessCode,
        organizationalUnit: processInfo.organizationalUnit,
        manufacturingName: processInfo.processManufacturingName,
        quantityOfDay: processInfo.quantityOfDay,
        productionLineTemplate: processInfo.productionLineTemplate,
        timeStartOfDay: processInfo.startTime,
        timeEndOfDay: processInfo.endTime,
        processStatus: processInfo.processStatus ? processInfo.processStatus : 0,
        progress: processInfo.progress ? processInfo.progress : 0,
        managerEmployee: processInfo.manager ? processInfo.manager : [],
        supporterEmployee: processInfo.supporter ? processInfo.supporter : [],
        xmlDiagram: processDiagram.xmlDiagram.xmlDiagram,
        tasks: tasks
    }
    let manufacturingProcess = await ManufacturingProcess(connect(DB_CONNECTION, portal)).create(processSave);
    let newManufacturingProcess = await ManufacturingProcess(connect(DB_CONNECTION, portal)).findById({ _id: manufacturingProcess._id });
    return newManufacturingProcess;
}

exports.editManufacturingProcess = async (id, data, portal) => {
    let oldManufacturingProcess = await ManufacturingProcess(connect(DB_CONNECTION, portal)).findById(id);
    if (!oldManufacturingProcess) {
        return -1;
    }
    let updatedData = {
        manfucturingProcessCode: data.manufacturingProcessCode,
        organizationalUnit: data.organizationalUnit,
        manufacturingName: data.processManufacturingName,
        quantityOfDay: data.quantityOfDay,
        productionLineTemplate: data.productionLineTemplate,
        timeStartOfDay: data.startTime,
        timeEndOfDay: data.endTime,
        onDate: data.onDate ? data.onDate : Date.now,
        processStatus: data.processStatus ? data.processStatus : 0,
        progress: data.progress ? data.progress : 0,
        managerEmployee: data.manager,
        supporterEmployee: data.supporter
    }
    await ManufacturingProcess(connect(DB_CONNECTION, portal)).updateOne({ _id: id }, { $set: updatedData });
    let newManufacturingProcess = await ManufacturingProcess(connect(DB_CONNECTION, portal)).findById({ _id: oldManufacturingProcess._id });
    return newManufacturingProcess;
}

exports.deleteManufacturingProcess = async (id, portal) => {
    let removedManufacturingProcess = ManufacturingProcess(connect(DB_CONNECTION, portal)).findByIdAndDelete({ _id: id });
    return removedManufacturingProcess;
}