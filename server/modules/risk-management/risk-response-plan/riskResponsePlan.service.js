
const { connect } = require(`../../../helpers/dbHelper`);
const { RiskResponsePlan} = require("../../../models");
exports.getRiskResponsePlans = async (portal,params) =>{
  
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
    let totalList = await RiskResponsePlan(connect(DB_CONNECTION,portal)).find(keySearch).countDocuments()
    let riskResponsePlans = await RiskResponsePlan(connect(DB_CONNECTION,portal))
    .find(keySearch).sort({ 'createdAt': -1 })
    .skip((params.page - 1) * parseInt(params.perPage))
    .limit(parseInt(params.perPage))
    console.log(totalList)
    return {lists:riskResponsePlans,totalList:totalList};
}
exports.getRiskResponsePlanById = async(portal,id) =>{
    return await RiskResponsePlan(connect(DB_CONNECTION,portal)).findOne(id)
}
exports.createRiskResponsePlan = async(portal, data) =>{
    let {
        riskApply,
        riskLevel,
        applyCase,
        probabilityMitigationMethod,
        impactMitigationMethod,
        // implementationDate
    } = data
    let newRiskResponsePlan = await RiskResponsePlan(connect(DB_CONNECTION,portal)).create(data)
    return newRiskResponsePlan
}
exports.deleteRiskResponsePlan = async(portal,id) =>{
    let deleteRiskResponse = await RiskResponsePlan(connect(DB_CONNECTION,portal)).findOneAndDelete({
        _id:id
    })
    return deleteRiskResponse
}
exports.editRiskResponsePlan = async(portal,id,data) =>{
    delete data._id 
    console.log('data',data)
    let editRisk = await RiskResponsePlan(connect(DB_CONNECTION,portal)).findByIdAndUpdate(id,data,{new:true})
    console.log(editRisk._id)
    return editRisk
}
exports.getRiskResponsePlanByRiskId = async(portal,id) =>{
    console.log('riskID',id)
    return await RiskResponsePlan(connect(DB_CONNECTION,portal)).find({riskApply:id})
}