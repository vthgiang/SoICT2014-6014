const { ProductionLine, ProductionActivity, ActivityAssetTemplate } = require('../../../models')
const { connect } = require('../../../helpers/dbHelper')

exports.getAllProductionLineTemplate = async (params, portal) => {

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

    let totalList = await ProductionLine(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    let templateCollection = await ProductionLine(connect(DB_CONNECTION, portal)).find(keySearch)
        .skip((page - 1) * perPage)
        .limit(perPage)
        .populate({ path: 'organizationalUnit', select: '_id, name' })
        .populate({ path: 'approverEmployee', select: '_id, name' });

    return {
        data: templateCollection,
        totalList
    }
}

exports.getProductionLineTemplateById = async (id, portal) => {
    // console.log("iddddd: ", id)
    let productionTemplate = await ProductionLine(connect(DB_CONNECTION, portal))
        .findById({ _id: id })
        .populate({ path: 'taskList', select: ['_id', 'activityName', 'activityTimeSchedule', 'listActivityAsset'] })
    console.log(productionTemplate)
    if (productionTemplate) {
        return productionTemplate;
    }
    return -1;
}

exports.createProductionLineTemplate = async (data, portal) => {
    let newProductionLineTemplate;
    let newProductionActivities = [];
    let totalTimeSchedule = 0;

    if (data && data.listActivityAsset) {
        for (item in data.listActivityAsset) {
            createdItem = await ProductionActivity(connect(DB_CONNECTION, portal)).create({
                processTemplate: data.processTemplate,
                activityName: data.listActivityAsset[item].name,
                activityDescription: data.listActivityAsset[item].description,
                activityTimeSchedule: data.listActivityAsset[item].timeSchedule ? data.listActivityAsset[item].timeSchedule : 0,
                activityTaskRef: data.listActivityAsset[item]._id,
                listActivityAsset: data.listActivityAsset[item].listAssetTask ? data.listActivityAsset[item].listAssetTask : []
            })
            totalTimeSchedule = totalTimeSchedule + (data.listActivityAsset[item].timeSchedule ? data.listActivityAsset[item].timeSchedule : 0);
            newProductionActivities = [...newProductionActivities, createdItem._id]
        }
    }
    if (data) {
        newProductionLineTemplate = await ProductionLine(connect(DB_CONNECTION, portal)).create({
            manufacturingLineName: data.name,
            organizationalUnit: data.organizationalUnit,
            description: data.description,
            approverEmployee: data.approver,
            watcherEmployee: data.watcher,
            processTemplate: data.processTemplate,
            totalTimeProductionLine: totalTimeSchedule,
            taskList: newProductionActivities
        })
    }

    let productionLineTemplate = await ProductionLine(connect(DB_CONNECTION, portal)).findById({ _id: newProductionLineTemplate._id });
    return productionLineTemplate;
}

exports.editProductionLineTemplate = async (id, data, portal) => {
    let oldProductionLineTemplate = await ProductionLine(connect(DB_CONNECTION, portal)).findById(id);
    if (!oldProductionLineTemplate) {
        return -1;
    }
    let updatedData = {
        manufacturingLineName: data.name,
        organizationalUnit: data.organizationalUnit,
        description: data.description,
        approverEmployee: data.approver,
        watcherEmployee: data.watcher,
        processTemplate: data.processTemplate,
        taskList: data.listActivityAsset
    }
    await ProductionLine(connect(DB_CONNECTION, portal)).updateOne({ _id: id }, { $set: updatedData });
    let newProductionLineTemplate = await ProductionLine(connect(DB_CONNECTION, portal)).findById({ _id: oldProductionLineTemplate._id });
    // console.log("newwwww: ", newProductionLineTemplate)
    return newProductionLineTemplate;
}

exports.deleteProductionLineTemplate = async (id, portal) => {
    let removedChainTemplate = ProductionLine(connect(DB_CONNECTION, portal)).findByIdAndDelete({ _id: id });
    return removedChainTemplate;
}