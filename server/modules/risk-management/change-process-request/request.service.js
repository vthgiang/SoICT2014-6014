
const { connect } = require(`../../../helpers/dbHelper`);
const { RiskResponsePlanRequest } = require("../../../models");
exports.getRiskResponsePlanRequests = async (portal, params) => {

    let keySearch;
    console.log(params)
    console.log(portal)
    if (params.name !== undefined && params.name.length !== 0) {
        console.log('findByName')
        keySearch = {
            ...keySearch,
            name: {
                $regex: params.name,
                $options: "i"
            },

        }
    }
    let totalList = await RiskResponsePlanRequest(connect(DB_CONNECTION, portal)).find(keySearch).countDocuments()
    let riskResponsePlanRequests = await RiskResponsePlanRequest(connect(DB_CONNECTION, portal))
        .find(keySearch).sort({ 'createdAt': -1 })
        .skip((params.page - 1) * parseInt(params.perPage))
        .limit(parseInt(params.perPage))
        .populate('sendEmployee')
        .populate({
            path: 'process',
            populate: {
                path: 'manager'
            }
        })
        .populate('receiveEmployees')
    console.log(totalList)
    return { lists: riskResponsePlanRequests, totalList: totalList };
}

exports.createRiskResponsePlanRequest = async (portal, data) => {
    let newRiskResponsePlan = await RiskResponsePlanRequest(connect(DB_CONNECTION, portal)).create(data)
    let newChangeRequest = await RiskResponsePlanRequest(connect(DB_CONNECTION, portal)).findOne(newRiskResponsePlan._id)
        .populate('sendEmployee')
        .populate({
            path: 'process',
            populate: {
                path: 'manager'
            }
        })
        .populate('receiveEmployees')
    return newChangeRequest
}
exports.editRiskResponsePlanRequest = async (portal, id, data) => {
    delete data._id
    console.log('data', data)
    console.log('id', id)
    let editRisk
    if (data.action == 'approve') {
        let { approveData, status } = data
        editRisk = await RiskResponsePlanRequest(connect(DB_CONNECTION, portal))
            .findByIdAndUpdate(id, {
                status: status,
                approveData: approveData
            }, { new: true })
            .populate('sendEmployee')
            .populate({
                path: 'process',
                populate: {
                    path: 'manager'
                }
            })
            .populate('receiveEmployees')
    } else {
        editRisk = await RiskResponsePlanRequest(connect(DB_CONNECTION, portal))
            .findByIdAndUpdate(id, data, { new: true })
            .populate('sendEmployee')
            .populate({
                path: 'process',
                populate: {
                    path: 'manager'
                }
            })
            .populate({
                path:'approveData',
                populate:{
                    path:'approveEmployee'
                }
            })
            .populate('receiveEmployees')
    }
    console.log(editRisk)
    return editRisk
}
exports.deleteRiskResponsePlanRequest = async (portal, id) => {
    let deleteRiskResponse = await RiskResponsePlanRequest(connect(DB_CONNECTION, portal)).findOneAndDelete({
        _id: id
    })
    return deleteRiskResponse
}