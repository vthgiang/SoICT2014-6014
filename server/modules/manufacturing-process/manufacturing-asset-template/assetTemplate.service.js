const { ActivityAssetTemplate } = require('../../../models')
const { connect } = require('../../../helpers/dbHelper');
const { forEach } = require('lodash');

exports.getAllAssetTemplate = async (params, portal) => {
    let keySearch;
    if (params.templateName !== undefined && params.templateName.length !== 0) {
        keySearch = {
            ...keySearch,
            name: {
                $regex: params.templateName,
                $options: "i"
            }
        }
    }

    let page, perPage;
    page = params?.page ? Number(params.page) : 1;
    perPage = params?.perPage ? Number(params.perPage) : 20;

    let totalList = await ActivityAssetTemplate(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    let templateCollection = await ActivityAssetTemplate(connect(DB_CONNECTION, portal)).find(keySearch)
        .skip((page - 1) * perPage)
        .limit(perPage)

    return {
        data: templateCollection,
        totalList
    }
}

exports.getAssetTemplateId = async (id, portal) => {
    let templateId = await ActivityAssetTemplate(connect(DB_CONNECTION, portal))
        .findById({ _id: id })

    if (templateId) {
        return templateId;
    }
    return -1;
}

exports.createAssetTemplate = async (data, portal) => {
    let listTask = [];
    data.listTask.forEach((item) => {
        let task = {
            taskCodeId: item.taskCodeId,
            name: item.taskName,
            timeSchedule: item.taskTimeSchedule ? item.taskTimeSchedule : 0,
            description: item.taskDescription ? item.taskDescription : "",
            listAssetTask: item.listActivityAsset ? item.listActivityAsset : []
        };
        listTask.push(task)
    })
    let saveddata = {
        processTemplate: data.processTemplate,
        listTaskTemplate: listTask,
        isTemplateAsset: true,
        assetTemplateName: data.assetTemplateName
    }
    let assetTemplateSaved = await ActivityAssetTemplate(connect(DB_CONNECTION, portal)).create(saveddata)
    let newAssetTemplate = await ActivityAssetTemplate(connect(DB_CONNECTION, portal)).findById({ _id: assetTemplateSaved._id });
    return newAssetTemplate;
}