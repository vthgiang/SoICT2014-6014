
const { connect } = require(`../../../helpers/dbHelper`);
const { Risk, RiskDistribution,Impact ,Task,TaskDistribution,TaskProcess, RiskResponsePlan} = require("../../../models");
const { getRiskIDByName, round } = require('../riskDistribution/riskDistributionHelper');
const { clone, sortByRiskID, compareArr } = require('./util/RiskUtil')
const RiskNet = require('./core/algorithms/impl/RiskNet')
const product = require('cartesian-product')
/**
 * Lấy ra danh sách các rủi ro
 * @param {*} params
 * @param {*} portal
 * @returns danh sách rủi ro
 */
exports.getRisks = async (portal, params) => {
    let keySearch;

    if (params.riskName !== undefined && params.riskName.length !== 0) {
        keySearch = {
            ...keySearch,
            riskName: {
                $regex: params.riskName,
                $options: "i"
            },

        }
    }
    keySearch={
        ...keySearch,
        riskID:{
            $nin:[1,2,3,4]
        },
    }

    let RiskCollection = await Risk(connect(DB_CONNECTION, portal))
        .find(keySearch).sort({ 'createdAt': -1 })
        .skip((params.page - 1) * parseInt(params.perPage))
        .limit(parseInt(params.perPage))
        .populate([
            {path: 'responsibleEmployees'},
            {path: 'accountableEmployees'},
            {path: 'taskRelate'},
            {path: 'riskResponsePlans'},
            {path: 'impact'},
        ]);
    let totalList = await Risk(connect(DB_CONNECTION, portal)).find(keySearch)
    .populate('responsibleEmployees')
    .populate('accountableEmployees')
    if(params.user!=null&&params.user){
        let user = params.user.toString()
        totalList = totalList.filter(r => r.responsibleEmployees.map(u=>u._id).includes(params.user)||r.accountableEmployees.map(u=>u._id).includes(params.user))
        RiskCollection = RiskCollection.filter(r => {
            return (r.responsibleEmployees.map(u=>u._id).includes(user)||r.accountableEmployees.map(u=>u._id).includes(user))
        })
    }
    totalList = totalList.length;
    return { lists: RiskCollection, totalList }
}
/**
 * Lẩy rủi ro theo ID
 * @param {*} portal
 * @param {*} id
 * @returns
 */
exports.getRiskById = async (portal, id) => {
    let riskById = await Risk(connect(DB_CONNECTION, portal)).findById(id)
    .populate('responsibleEmployees')
    .populate('accountableEmployees')
    .populate('taskRelate')
    .populate('impact');
    return riskById;
}
/**
 *
 * @param {*} portal
 * @param {*} data
 * @returns
 */
exports.createRisk = async (portal, data) => {
    let {
        riskName,
        description,
        plans,
        occurrenceDate,
        responsibleEmployees,
        accountableEmployees,
        taskRelateList,
        riskParents,
        riskStatus,
        // parentChecked,
        impact,
        ranking
    } = data;

    let hsseImpact = await Impact(connect(DB_CONNECTION,portal)).create({
        type: impact.type,
        description:impact.description,
        health: impact.health,
        security: impact.security,
        enviroment: impact.enviroment
    })
    // Sử dụng await để tránh promise return
    let riskID = await getRiskIDByName(riskName, portal)
    let newRisk
    if(plans.length!=0){
       newRisk = await Risk(connect(DB_CONNECTION, portal)).create({
            riskID: riskID,
            riskName: riskName,
            description: description,
            occurrenceDate: occurrenceDate,
            raisedDate: occurrenceDate,
            responsibleEmployees: responsibleEmployees,
            accountableEmployees: accountableEmployees,
            taskRelate: taskRelateList,
            riskParents: riskParents.sort(),
            riskStatus: 'inprocess',
            parentChecked: [],
            impact: hsseImpact,
            ranking:ranking,
            riskResponsePlans:plans

        })
    }else{
         newRisk = await Risk(connect(DB_CONNECTION, portal)).create({
            riskID: riskID,
            riskName: riskName,
            description: description,
            occurrenceDate: occurrenceDate,
            raisedDate: occurrenceDate,
            responsibleEmployees: responsibleEmployees,
            accountableEmployees: accountableEmployees,
            taskRelate: taskRelateList,
            riskParents: riskParents.sort(),
            riskStatus: riskStatus,
            parentChecked: [],
            impact: hsseImpact,
            ranking:ranking,

        })
    }

    let newRiskData = await Risk(connect(DB_CONNECTION,portal)).findOne({_id:newRisk._id})
    .populate('accountableEmployees')
    .populate('responsibleEmployees')
    .populate('taskRelate')
    .populate('impact')
    .populate('riskResponsePlans')
    return newRiskData;
}
/**
 * Cập nhật một risk
 * @param {*} id
 * @param {*} data
 * @param {*} portal
 * @returns
 */
exports.editRisk = async (portal, id, data) => {
    if(data.action =='edit_risk'||data.action==undefined){
        let {
            riskName,
            description,
            occurrenceDate,
            responsibleEmployees,
            accountableEmployees,
            taskRelateList,
            riskParents,
            riskStatus,
            impact,
            ranking,
            // riskResponsePlans
        }= data;
        let hsseImpact = await Impact(connect(DB_CONNECTION,portal)).findByIdAndUpdate(impact._id,{
            type: impact.type,
            description:impact.description,
            health: impact.health,
            security: impact.security,
            enviroment: impact.enviroment
        },{new:true})
        let riskID = await getRiskIDByName(riskName, portal)
        await Risk(connect(DB_CONNECTION, portal))
            .findByIdAndUpdate(id, {
                // riskResponsePlans:riskResponsePlans,
                riskID: riskID,
                riskName: riskName,
                description: description,
                occurrenceDate: occurrenceDate,
                raisedDate: occurrenceDate,
                responsibleEmployees: responsibleEmployees,
                accountableEmployees: accountableEmployees,
                taskRelate: taskRelateList,
                riskParents: riskParents.sort(),
                riskStatus: riskStatus,
                parentChecked: [],
                // impact: impact,
                ranking:ranking

            }, { new: true })
    }
    if(data.action =="approve"){
        console.log('approve risk')
        await Risk(connect(DB_CONNECTION, portal))
        .findByIdAndUpdate(id, {
            riskResponsePlans:data.riskResponsePlans,
            approvalData :{
                approveType: data.approveType,
                description: data.description
            },
            riskStatus: data.status

        }, { new: true })
    }
    if(data.action == "request_to_close"){
        console.log('close risk')
        await Risk(connect(DB_CONNECTION, portal))
        .findByIdAndUpdate(id, {
            riskStatus: data.riskStatus
        }, { new: true })
    }

    return await Risk(connect(DB_CONNECTION, portal)).findOne({ _id: id })
    .populate('accountableEmployees')
    .populate('responsibleEmployees')
    .populate('taskRelate')
    .populate('impact')
    .populate('riskResponsePlans')
}
/**
 * Xoá một rủi ro
 * @param {*} portal
 * @param {*} id
 * @returns
 */
exports.deleteRisk = async (portal, id) => {
    let deleteRisk = await Risk(connect(DB_CONNECTION, portal)).findOneAndDelete({ _id: id });
    console.log('taskImpact',deleteRisk.impact)
    try{
        await Impact(connect(DB_CONNECTION,portal)).findOneAndDelete({_id:deleteRisk.impact})
    }catch(err){
        console.log(err)
    }

    return deleteRisk;
}
exports.getTasksByRisk = async (portal,data) =>{
    if(data.name==undefined){
        return []
    }
    let tasksByRisk = []
    try{
        let riskDis = await RiskDistribution(connect(DB_CONNECTION,portal)).findOne({name:data.name})
        console.log(riskDis)
        let taskClassRelate = riskDis.taskClass
        let taskDisList = await TaskDistribution(connect(DB_CONNECTION,portal)).find()
        let tasks = []
        for(let taskDis of taskDisList){
            tasks = tasks.concat(taskDis.tasks)
        }
        tasks = tasks.filter(t => taskClassRelate.includes(t.class)).map(task => task.taskID)
        console.log(tasks)
        let processList = await TaskProcess(connect(DB_CONNECTION,portal)).find({status:'inprocess'}).populate('tasks')
        let taskInProcess = []
        for(let process of processList){
            taskInProcess = taskInProcess.concat(process.tasks.map(t => t._id))
        }
        console.log(taskInProcess.length)

        tasksByRisk = await Task(connect(DB_CONNECTION,portal)).find({status:'inprocess'}).where('codeInProcess').in(tasks).where('_id').in(taskInProcess)
        .populate('responsibleEmployees')
        .populate('accountableEmployees')
        .populate('consultedEmployees')
        .populate('informedEmployees')
        .populate('confirmedByEmployees')
        .populate('riskResponsePlans')
        .populate('process')

        // console.log(tasksByRisk.length)

    }catch(err){
        console.log(err)
    }

    return tasksByRisk

}
function getArrayCheck(parents, data) {
    let parentClone = clone(parents)
    // if(parentClone.includes(4))
    // console.log('parent check',parentClone)
    for (let arr of data) {
        let temp = arr.filter(a => a.status == true).map(p => p.id)
        temp.sort((a, b) => a - b)
        parentClone.sort((a, b) => a - b)
        if (JSON.stringify(temp) == JSON.stringify(parentClone)) {
            // console.log('arrChecked',arr)
            return arr
        }

    }
    return null
}
exports.bayesianNetworkAutoConfig = async (portal) => {

    return true
}
exports.getPlanByRiskInfo = async(portal, data)=>{
    const {
        id,
        level
    }= data
    console.log(data)
    let plans = await RiskResponsePlan(connect(DB_CONNECTION,portal)).find({riskApply:id,riskLevel:level})
    console.log(plans)
    return plans
}