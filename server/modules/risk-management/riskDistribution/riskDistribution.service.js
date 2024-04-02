
const { connect } = require(`../../../helpers/dbHelper`);
const { RiskDistribution, Risk, BayesDataset, TaskDistribution, TaskProcess } = require("../../../models");
const { hasSubArray, clone } = require("./riskDistributionHelper")
const product = require('cartesian-product')
const RiskNet = require('../risk-list/core/algorithms/impl/RiskNet')
exports.deleteRiskDistribution = async (portal, id) => {
    let deleteRiskDistribution = await RiskDistribution(connect(DB_CONNECTION, portal)).findOneAndDelete({ _id: id });
    return deleteRiskDistribution;
}
/**
 * Lấy ra danh sách các rủi ro
 * @param {*} params 
 * @param {*} portal 
 * @returns danh sách rủi ro
 */
exports.getRiskDistributions = async (portal, params) => {
    //console.log('params', params)
    let keySearch;
    if (params.name !== undefined && params.name.length !== 0) {
        keySearch = {
            ...keySearch,
            name: {
                $regex: params.name,
                $options: "i"
            }
        }
    }
    let totalList = await RiskDistribution(connect(DB_CONNECTION, portal))
        .countDocuments(keySearch);
    let RiskCollection = await RiskDistribution(connect(DB_CONNECTION, portal))
        .find(keySearch).sort({ 'createdAt': -1 })
        .skip((params.page - 1) * parseInt(params.perPage))
        .limit(parseInt(params.perPage))
        .populate('parentList')
    // //console.log(RiskCollection)
    return { lists: RiskCollection, totalList }
}
exports.getParentsOfRisk = async (portal, params) => {
    // //console.log('params get riskdis',params)
    let parentList = await RiskDistribution(connect(DB_CONNECTION, portal)).findOne({ 'name': params.name })
    let parents = []
    let parentCheck = []
    if (parentList != null) {
        parents = await Risk(connect(DB_CONNECTION, portal)).find({ riskStatus: "inprocess" }).where('riskID').in(parentList.parents)
        for (let par of parentList.parents) {
            // //console.log('parent',par)
            parentCheck = [...parentCheck, {
                riskID: par,
                status: false
            }]
        }
        let forCheckParent = Array.from(new Set(parents.map(p => p.riskID)))
        parentCheck = new Map(parentCheck.map(p => [p.riskID, p]))
        for (let temp of forCheckParent) {
            // //console.log(temp)
            parentCheck.get(temp).status = true;
        }
        //console.log(parentCheck)
    }
    let checkRs = []
    for (let [key, value] of parentCheck) {
        if (value.status == true)
            checkRs = [...checkRs, value.riskID]
    }
    if (parents === null) {

        return { parents: [] }
    }
    // //console.log(parents)
    return { parents: parents, parentChecked: checkRs }
}
exports.getRiskDistributionByName = async (portal, params) => {
    // console.log('name', params.name)
    let risk = await RiskDistribution(connect(DB_CONNECTION, portal)).findOne({ 'name': params.name })
    // console.log('r by name', risk)
    return risk
}
exports.updateProbFromDataSet = async (portal, params) => {
    console.log('update prob')

    const LENGTH_OF_DATASET = 17
    let risks = await RiskDistribution(connect(DB_CONNECTION, portal)).find()
    // //console.log('length', risks.length)

    // Update dữ liệu rủi ro từ hệ thống
    let check = risks.find(r => r.tech == "expert")
    if (!check || check.length == 0) {
        console.log('using MLE')
        let riskList = await Risk(connect(DB_CONNECTION, portal)).find().populate('taskRelate')
        let taskProcess = await TaskProcess(connect(DB_CONNECTION, portal)).find().populate({
            path: 'tasks'
        })
        if (taskProcess && taskProcess.length != 0) {
            // let processForUpdate = taskProcess.filter(process => (process.tasks[process.tasks.length-1].status.toString()=="finished"))
            let processForUpdate = taskProcess.filter(process => {
                // console.log('Process for Update ',process._id)
                // console.log('tasks length',process.tasks.length)
                return (process.status.toString() == "temp_finished") && (process.updateDataStatus != true)
            })
            processFinished = processForUpdate.map(p => p.tasks)

            let allTaskFinised = []
            for (let tasks of processFinished) {
                allTaskFinised = allTaskFinised.concat(tasks)
            }
            allTaskFinised = allTaskFinised.map(t => t._id.toString())
            // //console.log('all task finished',allTaskFinised)
            // //console.log(allTaskFinised.includes(r.taskRelate._id))
            // let riskForUpdateDataSet = riskList.filter(r => (allTaskFinised.find(task => task == r.taskRelate._id.toString())!=undefined))
            let dataPoints = []
            for (let process of processFinished) {
                let taskIDs = process.map(t => t._id.toString())
                // Tìm những rủi ro có những task chịu ảnh hưởng là con của TaskIDS
                let dataPoint = riskList.filter(r => {
                    for (let task of r.taskRelate) {
                        if (hasSubArray(taskIDs, [task._id])) return true;
                    }
                    return false
                }).map(r => r.riskID)

                dataPoint = Array.from(new Set(dataPoint))
                // console.log('dataPoint',dataPoint)
                dataPoint.sort((a, b) => a - b)
                let temp = []
                for (let i = 1; i <= LENGTH_OF_DATASET; i++) {
                    if (dataPoint.includes(i)) {
                        temp.push(1)
                    } else {
                        temp.push(0)
                    }
                }
                console.log('update thêm dữ liệu', temp)
                dataPoints.push({
                    type: 1,
                    states: temp
                })

            }
            await BayesDataset(connect(DB_CONNECTION, portal)).insertMany(dataPoints)
            for (let process of processForUpdate) {
                process.updateDataStatus = true
                process.save()
            }
        } else {
            console.log('Không có quy trình để cập nhật rủi ro')
        }
        let nodes = []
        for (let risk of risks) {
            let item = []
            item = item.concat(risk.parents)
            item.push(risk.riskID)
            // //console.log(item)
            // nodeWithoutChild.push(risk.parents)
            nodes.push(item)
        }

        //Bắt đầu đếm từ dataset
        let dataSet = await BayesDataset(connect(DB_CONNECTION, portal)).find({ type: 1 })
        // //console.log('length of data ',dataSet.length)
        dataSet = dataSet.map(d => {
            let states = d.states
            let data = []
            for (let i = 0; i < states.length; i++) {
                (states[i] == 1) ? data.push(i + 1) : data.push(-(i + 1))
            }
            return data
        })
        // //console.log(dataSet)
        // Tạo ra tất cả các trường hợp của join prob
        let dataCheck = []
        dataCheck = nodes.map(node => {
            // //console.log('node',node)
            let data = []
            let temp = []
            for (let item of node) {
                temp = [...temp, [1, -1]]
            }
            temp = product(temp)
            // //console.log(temp)
            for (let item of temp) {
                let dTemp = clone(node)
                for (let i = 0; i < item.length; i++) {
                    dTemp[i] = node[i] * item[i]
                }
                data.push(dTemp)
                // console.log(dTemp)
            }

            data = {
                id: node[node.length - 1],
                data: data,
                child: [],
                parent: [],
                probs: []
            }
            return data;
        })
        let dataCheckMap = new Map(dataCheck.map(d => [d.id, d]))
        for (let risk of risks) {
            let dc = dataCheckMap.get(risk.riskID)
            for (let d of dc.data) {
                // //console.log('data ',d)
                let parents = clone(d)
                parents.pop()
                let numJoinProb = dataSet.filter(o => hasSubArray(o, d) == true).length
                let numParentJoinProb = (parents.length == 0) ? dataSet.length : dataSet.filter(o => hasSubArray(o, parents) == true).length
                dc.child.push(numJoinProb)
                dc.parent.push(numParentJoinProb)
                dc.probs.push(numJoinProb / numParentJoinProb)
            }
        }
        //update to db
        for (let risk of risks) {
            try {
                risk.probs = dataCheckMap.get(risk.riskID).probs
                risk.save()
            } catch (err) {
                //console.log(err)
            }

        }
    } else {
        console.log('expert')
    }

    // Tính toán rủi ro cho mạng bayes 
    let riskBayes = []
    try {
        let listOfRisk = await RiskDistribution(connect(DB_CONNECTION, portal)).find().populate('parentList')
        console.log(listOfRisk => listOfRisk.probs)
        let riskNet = new RiskNet('Bayesian network', listOfRisk)
        riskNet.init()
        riskNet.updateProb()
        riskBayes = riskNet.getRiskList()
        for (let riskDis of listOfRisk) {
            riskDis.prob = riskNet.getRiskProb(riskDis.name)
            // //console.log(riskDis.prob)
            riskDis.save()
        }
        // //console.log('riskBayes',riskBayes)
    } catch (err) {
        console.log(err)
    }
    // Đếm số lượng rủi ro
    let countModel = risks.map(rd => {
        let data = {
            id: rd.riskID,
            parents: rd.parents,
            probs: rd.probs,
            prob: rd.prob,
            count: 0// gom n+1 ( n la so luong cha) phan tu dau tien de dem so luong con
        }
        return data
    })
    countModel = new Map(countModel.map(cM => [cM.id, cM]))
    let allRisk = await Risk(connect(DB_CONNECTION, portal)).find()
    for (let risk of allRisk) {
        countModel.get(risk.riskID).count++
    }
    let res = []
    for (let [key, value] of countModel) {
        res = [
            ...res,
            {
                id: key,
                probs: value.probs,
                prob: value.prob,
                parents: value.parents,
                total: value.count
            }

        ]
    }
    
    // //console.log(res)

    return { riskInfo: riskBayes, countInfo: res };
}
exports.editRiskDistribution = async (portal, id, data) => {
    delete data._id
    // console.log('id', id)
    // console.log(data)
    console.log(data.tech)
    let editRisk
    if (data.tech == undefined) {
        let risks = await RiskDistribution(connect(DB_CONNECTION, portal)).find()
        for (let r of risks) {
            r.tech = "mle"
            r.save()
        }
        await this.updateProbFromDataSet(portal, '')
        console.log('update to mle')
    } else {
        // let riskTemp = await RiskDistribution(connect(DB_CONNECTION, portal)).findOne({ _id: id })
        editRisk = await RiskDistribution(connect(DB_CONNECTION, portal)).findOneAndUpdate({ _id: id }, {
            tech: data.tech,
            probs: data.probs 
        })
        await this.updateProbFromDataSet(portal, '')
    }
    let riskTemp = await RiskDistribution(connect(DB_CONNECTION, portal)).findOne({ _id: id })
    let risks = await RiskDistribution(connect(DB_CONNECTION, portal)).find()
    // console.log('editRisk', riskTemp.prob)
    console.log(risks.map(r => r.prob))
    return risks
    return editRisk
}