
const { connect } = require(`../../helpers/dbHelper`);
const { Exprimental } = require("../../models");
const { clone } = require("../risk-management/riskDistribution/riskDistributionHelper")
const product = require('cartesian-product')
const RiskNet = require('./core/RiskNet')
const Pert = require('./core/Pert')
const TaskRiskNet = require('./core/TaskRiskNet')

exports.getProbabilityDistribution = async (portal, data) => {
    // const { taskName } = data
    let exprimentalData = await Exprimental(connect(DB_CONNECTION, portal)).find({ id: 1 })
    if (exprimentalData.length != 0) {
        exprimentalData = exprimentalData[0]
        // console.log(exprimentalData.risks)

        let tasks = exprimentalData.tasks
        // let tasks = exprimentalData.tasks
        let risks = exprimentalData.risks
        let riskDataset = exprimentalData.riskDataset
        let taskDataset = exprimentalData.taskDataset
        let riskProbs = await this.calcRiskProb(risks, riskDataset)
        for (let task of tasks) {

            task.parentList = tasks.filter(t => task.predecessor.includes(t.ID))

            task.childList = tasks.filter(t => t.predecessor.includes(task.ID))
        }
        // Tính toán xác suất thành công của các công việc theo giải thuật PERT
        let pertService = new Pert();
        let probList = []

        for (let task of tasks) {
            task.expectedTime = pertService.estimateDuration(task.optimistic, task.mostlikely, task.pessimistic)
        }

    }

}
/**
 * Hàm tính toán xác suất xảy ra của rủi ro trong mạng Bayes
 * @param {*} riskList 
 * @param {*} riskDataset 
 */
exports.calcRiskProb = async (riskList, riskDataset) => {
    let nodes = []// chứa các node và parents
    // let riskList = risks.filter(r => !r.isRiskClass)
    let risks = clone(riskList)
    for (let risk of risks) {
        let item = []
        item = item.concat(risks.filter(r => risk.parents.includes(r.ID)))
        item.push(risk)
        // console.log('item',item)
        nodes.push(item)
    }
    // console.log(nodes)
    // Tạo ra tất cả các trường hợp của join prob
    // let dataCheck = []
    dataCheck = nodes.map(node => {
        let temp = []
        for (let item of node) {
            temp = [
                ...temp,
                [
                    {
                        ID: item.ID,
                        value: 1
                    },
                    {
                        ID: item.ID,
                        value: 0
                    }

                ]
            ]
            // temp = [...temp, [1, 0]]
        }
        temp = product(temp)

        // console.log(temp)
        data = {
            id: node[node.length - 1].ID,
            data: temp,
            child: [],
            parent: [],
            probs: []
        }
        return data;
    })
    // console.log(dataCheck)
    let dataCheckMap = new Map(dataCheck.map(d => [d.id, d]))
    const hasSub = (sub, master) => {
        // console.log('master',master)
        // console.log('sub',sub)
        let subClone = clone(sub)
        let masterClone = clone(master)
        let subLen = subClone.length
        for (let data of subClone) {
            if (masterClone.find(masterData => masterData.ID == data.ID && masterData.value == data.value) == undefined) {
                return false
            }
        }
        return true;
    }
    for (let risk of risks) {
        let dc = dataCheckMap.get(risk.ID)
        for (let d of dc.data) {
            let parents = clone(d)
            parents.pop()
            let numJoinProb = riskDataset.filter(o => hasSub(d, o) == true).length
            let numParentJoinProb = (parents.length == 0) ? riskDataset.length : riskDataset.filter(o => hasSub(parents, o) == true).length
            dc.child.push(numJoinProb)
            dc.probs.push(numJoinProb / numParentJoinProb)
        }
    }


    for (let risk of risks) {
        try {
            risk.probs = dataCheckMap.get(risk.ID).probs

        } catch (err) {
            console.log(err)
        }

    }
    for (let risk of risks) {
        // console.log('risk',risk)
        // console.log('parents',risk.parents )
        let parentList = risks.filter(r => risk.parents.includes(r.ID))
        risk.parentList = parentList
        // console.log('parentList',parentList)
    }
    // console.log('risks',risks)
    // Tính toán rủi ro cho mạng bayes 
    let riskBayes = []
    try {
        // let listOfRisk = await RiskDistribution(connect(DB_CONNECTION, portal)).find().populate('parentList')
        let riskNet = new RiskNet('Bayesian network', risks)
        riskNet.init()
        riskNet.updateProb()
        riskBayes = riskNet.getRiskList()
        for (let risk of risks) {
            risk.prob = riskNet.getRiskProb(risk.name)
        }
    } catch (err) {
        console.log(err)
    }
    // console.log(risks)
    return risks
}
/**
 * Tính toán xác suất thành công của các công việc khi xét đến các yếu tố rủi ro
 * @param {*} riskList 
 * @param {*} taskList 
 * @param {*} taskDataset 
 * @returns 
 */
exports.calcTaskProb = async (riskList, taskList, taskDataset) => {
    const RDCPT = [// mạng CPT của nút hoạt động ( do chưa có dữ liệu thực tế)
        0.99, 0.01,
        0.65, 0.35,
        0.3, 0.7,
        0.2, 0.8,
        0.4, 0.6,
        0.3, 0.7,
        0.2, 0.8,
        0.4, 0.6
    ]
    let risks = clone(riskList)
    let tasks = clone(taskList)
    // update predecessor
    for (let task of tasks) {
        task.parentList = tasks.filter(t => task.predecessor.includes(t.ID))

        task.childList = tasks.filter(t => t.predecessor.includes(task.ID))
        // console.log(task.childList.map(t => t.ID))
    }
    // console.log(tasks)

    // Tính toán xác suất thành công của các công việc theo giải thuật PERT
    let pertService = new Pert();
    for (let task of tasks) {
        task.expectedTime = pertService.estimateDuration(task.optimistic, task.mostlikely, task.pessimistic)
    }
    pertService.setTasks(tasks)
    pertService.updateTaskList()
    pertService.updatePertProb()
    tasks = pertService.getTasks()
    // console.log(tasks)
    // Tính toán xác suất thành công khi xét đến yếu tố rủi ro

    // Tính xác suất của các nút trong mạng Bayes con
    // Tính nút risk: Các task thuộc các class khác nhau chịu ảnh hưởng từ những risk class khác nhau
    // risks = risks.filter(r => r.isRiskClass)// Các lớp rủi ro
    for (let task of tasks) {
        // Tìm những lớp rủi ro ảnh hưởng đến task đó
        let riskImpact = risks.filter(r => task.riskClass.includes(r.ID))
        let riskProb = 1;// nút Risk 
        riskImpact.forEach(r => {
            riskProb = riskProb * r.prob
        })// Đoạn này chưa gọi updateRisk thì chưa có prob ( nên gọi ở client )
        // Tính xác suất thành công của nút đầu tiên
        // Update task đầu tiên
        // Thứ tự của Input cho mạng Bayes : Risk,Pert,Sucessfully
        let nodesForBayesNet = []
        nodesForBayesNet.push({
            id: 'Risk',
            probs: riskProb
        })
        nodesForBayesNet.push({
            id: 'Pert',
            probs: task.pertProb
        })
        nodesForBayesNet.push({
            id: task.ID,
            probs: RDCPT
        })
        // console.log('nodes for Bayes',nodesForBayesNet)
        let taskRiskNet = new TaskRiskNet('Task Risk Net', nodesForBayesNet)
        let res = taskRiskNet.calcProb()
        task.prob = res.prob
        task.noRiskProb = res.noRiskProb
        task.riskProb = riskProb

    }
    for (let task of tasks) {
        delete task.parentList
        delete task.childList

    }
    // console.log('tasks',tasks)
    return tasks
}
/**
 * Phân tích thực nghiệm
 * @param {*} params 
 * @param {*} portal 
 * @returns danh sách rủi ro
 */
exports.analysis = async (portal) => {
    // console.log(body)
    // Lấy dữ liệu từ database
    let result = {
        taskData: null,
        riskData: null
    }
    let exprimentalData = await Exprimental(connect(DB_CONNECTION, portal)).find({ id: 1 })
    if (exprimentalData.length != 0) {
        exprimentalData = exprimentalData[0]
        // console.log(exprimentalData.risks)
        let tasks = exprimentalData.tasks
        let risks = exprimentalData.risks
        let riskDataset = exprimentalData.riskDataset
        let taskDataset = exprimentalData.taskDataset
        let riskProbs = await this.calcRiskProb(risks, riskDataset)
        let taskProbs = await this.calcTaskProb(riskProbs, tasks, taskDataset)
        let probList = []
        let totalProbList = []
        let totalDurationList = []
        let pertService = new Pert();
        let totalDuration = 0
        for(let task of task){
            totalDuration+=task.duration
        }
        for (let task of tasks) {
            task.expectedTime = pertService.estimateDuration(task.optimistic, task.mostlikely, task.pessimistic)
        }
        for (let i = -2; i <= 7; i++) {
            let taskClone = clone(tasks)
            for (let task of taskClone) {
                let temp = tasks.find(t => t.ID == task.ID)
                let exp = pertService.estimateDuration(temp.optimistic, temp.mostlikely, temp.pessimistic)
                task.duration = temp.mostlikely + i
            }
            let taskTemp = await this.calcTaskProb(riskProbs, taskClone, taskDataset)
            let temp = taskTemp.map(t => {
                return { id: t.ID, duration: t.duration, prob: t.prob, pertProb: t.pertProb }
            })
            for (let task of taskClone) {
                task.parentList = taskClone.filter(t => task.predecessor.includes(t.ID))
        
                task.childList = taskClone.filter(t => t.predecessor.includes(task.ID))
                // console.log(task.childList.map(t => t.ID))
            }
            // total prob
            pertService.setTasks(taskClone)
            pertService.updateTaskList()
            pertService.updatePertProb()
            let tempPert = pertService.getTotalProb()
            totalProbList.push(tempPert.totalProb)
            totalDurationList.push(tempPert.totalDuration)
            probList.push(temp)
        }

        // console.log('probList', probList)
        result.taskData = taskProbs
        result.riskData = riskProbs
        result.probList = probList
        result.totalProbList = totalProbList
        result.totalDurationList = totalDurationList
    }
    return result
}
exports.createTaskDistribution = async (portal, body) => {
    let taskMap = new Map(body.map(d => [d.ID, d]))

    let experimentalData = await Exprimental(connect(DB_CONNECTION, portal)).find({ id: 1 })
    if (experimentalData.length != 0) {

        // console.log(experimentalData)
        let tasks = JSON.parse(JSON.stringify(experimentalData[0].tasks))
        if (tasks?.length != 0) {
            // console.log('create')
            for (let task of tasks) {
                task.ID = taskMap.get(task.ID).ID
                task.name = taskMap.get(task.ID).name
                task.riskClass = taskMap.get(task.ID).riskClass
            }
            experimentalData[0].tasks = tasks
        } else {
            experimentalData[0].tasks = body

        }
        experimentalData[0].save();
    }
}
exports.createPertData = async (portal, body) => {
    let taskMap = new Map(body.map(d => [d.ID, d]))

    let experimentalData = await Exprimental(connect(DB_CONNECTION, portal)).find({ id: 1 })
    if (experimentalData.length != 0) {

        // console.log(experimentalData)
        let tasks = JSON.parse(JSON.stringify(experimentalData[0].tasks))
        if (tasks?.length != 0) {
            // console.log('create')
            for (let task of tasks) {
                task.duration = taskMap.get(task.ID).duration,
                    task.optimistic = taskMap.get(task.ID).optimistic,
                    task.mostlikely = taskMap.get(task.ID).mostlikely,
                    task.predecessor = taskMap.get(task.ID).predecessor,
                    task.pessimistic = taskMap.get(task.ID).pessimistic

            }
            await Exprimental(connect(DB_CONNECTION, portal)).findOneAndUpdate({ id: 1 }, {
                tasks: tasks
            })
            // experimentalData[0].tasks = tasks
        } else {
            await Exprimental(connect(DB_CONNECTION, portal)).findOneAndUpdate({ id: 1 }, {
                tasks: body
            })
            // experimentalData[0].tasks = body

        }

    }
}
exports.createRiskDistribution = async (portal, body) => {
    let exprimentalData = await Exprimental(connect(DB_CONNECTION, portal)).find({ id: 1 })
    // console.log(exprimentalData)
    if (exprimentalData != null && exprimentalData != undefined && exprimentalData.length != 0) {
        // console.log('udpate')

        await Exprimental(connect(DB_CONNECTION, portal)).findOneAndUpdate({ id: 1 }, { risks: body })
    } else {
        // console.log('create')
        await Exprimental(connect(DB_CONNECTION, portal)).create({
            id: 1,
            risks: body
        })
    }
}

exports.createTaskDataset = async (portal, body) => {
    let exprimentalData = await Exprimental(connect(DB_CONNECTION, portal)).find({ id: 1 })
    // console.log(exprimentalData)
    if (exprimentalData != null && exprimentalData != undefined && exprimentalData.length != 0) {
        // console.log('udpate')

        await Exprimental(connect(DB_CONNECTION, portal)).findOneAndUpdate({ id: 1 }, { taskDataset: body })
    } else {
        // console.log('create')
        await Exprimental(connect(DB_CONNECTION, portal)).create({
            id: 1,
            taskDataset: body
        })
    }
}
exports.createRiskDataset = async (portal, body) => {
    let exprimentalData = await Exprimental(connect(DB_CONNECTION, portal)).find({ id: 1 })
    // console.log(exprimentalData)
    if (exprimentalData.length != 0) {
        console.log('udpate risk dataset')

        await Exprimental(connect(DB_CONNECTION, portal)).findOneAndUpdate({ id: 1 }, { riskDataset: body })
    } else {
        console.log('create risk dataset')
        await Exprimental(connect(DB_CONNECTION, portal)).create({
            id: 1,
            riskDataset: body
        })
    }
}