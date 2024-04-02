const { ProductionActivityIssue } = require('../../../models')
const { connect } = require('../../../helpers/dbHelper')

exports.getAllIssuesList = async (params, portal) => {
    let keySearch;
    if (params.issueName !== undefined && params.issueName.length !== 0) {
        keySearch = {
            ...keySearch,
            name: {
                $regex: params.issueName,
                $options: "i"
            }
        }
    }

    let page, perPage;
    page = params?.page ? Number(params.page) : 1;
    perPage = params?.perPage ? Number(params.perPage) : 20;

    let totalList = await ProductionActivityIssue(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    let templateCollection = await ProductionActivityIssue(connect(DB_CONNECTION, portal)).find(keySearch)
        .skip((page - 1) * perPage)
        .limit(perPage)
        // .populate({ path: 'productionActivity', select: '_id, activityName' })
        .populate({path: 'manufacturingProcess', select: '_id, manufacturingName'})
        .populate({ path: 'byRepairer', select: '_id, name' })
        .populate({ path: 'byReporter', select: '_id, name' });

    return {
        data: templateCollection,
        totalList
    }
}

exports.getIssueById = async (id, portal) => {
    let issueReported = await ProductionActivityIssue(connect(DB_CONNECTION, portal))
        .findById({ _id: id })

    console.log(issueReported)
    if (issueReported) {
        return issueReported;
    }
    return -1;
}

exports.createIssueReport = async (data, portal) => {
    let saveddata = {
        manufacturingProcess: data.manufacturingProcess,
        productionActivity: data.productionActivityId,
        activityIssueName: data.activityIssueName,
        activityIssueStatus: data.issueStatus,
        activityCategoryIssue: data.activityCategoryIssue,
        activityIssueRepaireTimer: data.activityIssueRepaireTimer,
        byRepairer: data.byRepairer,
        byReporter: data.byReporter,
    }
    let savedIssue = await ProductionActivityIssue(connect(DB_CONNECTION, portal)).create(saveddata)
    let newProductionActivityIssue = await ProductionActivityIssue(connect(DB_CONNECTION, portal)).findById({ _id: savedIssue._id });
    return newProductionActivityIssue;
}


exports.editIssueReport = async (id, data, portal) => {
    let oldProductionActivityIssue = await ProductionActivityIssue(connect(DB_CONNECTION, portal)).findById(id);
    if (!oldProductionActivityIssue) {
        return -1;
    }
    let updatedData = {
        productionActivity: data.productionActivityId,
        activityIssueName: data.activityIssueName,
        activityIssueStatus: data.issueStatus,
        activityCategoryIssue: data.activityCategoryIssue,
        activityIssueRepaireTimer: data.activityIssueRepaireTimer,
        byRepairer: data.byRepairer,
        byReporter: data.byReporter
    }
    await ProductionActivityIssue(connect(DB_CONNECTION, portal)).updateOne({ _id: id }, { $set: updatedData });
    let newProductionActivityIssue = await ProductionActivityIssue(connect(DB_CONNECTION, portal)).findById({ _id: oldProductionActivityIssue._id });
    return newProductionActivityIssue;
}

exports.deleteIssueReported = async (id, portal) => {
    let removedIssue = ProductionActivityIssue(connect(DB_CONNECTION, portal)).findByIdAndDelete({ _id: id });
    return removedIssue;
}