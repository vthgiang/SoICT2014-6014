const { connect } = require('../../../helpers/dbHelper');
const { Task, Risk, RiskDistribution, TaskDistribution, BayesDataset, TaskProcess, PertEstimation } = require('../../../models');
const Pert = require('./core/Pert');
const { DateDiff, countFrequency, clone, hasSubArray, compareArr, getRandomInt, getRandomCpt } = require('./TaskPertHelper')
const product = require('cartesian-product')
const RiskServices = require('../risk-list/risk.service')
const TaskRiskNet = require('./core/TaskRiskNet')
exports.closeProcess = async (portal, process) => {
    let taskProcess = await TaskProcess(connect(DB_CONNECTION, portal)).findOne({ _id: process._id })
    taskProcess.status = 'temp_finished'
    taskProcess.save()
    return taskProcess
}
/**
 * Hàm tính toán xác suất thành công của một list các quy trình
 * @param {Tên database} portal 
 * @param {Danh sách các quy trình} processList 
 * @returns 
 */
exports.updateList = async (portal, processList) => {
    console.log(processList)
    console.log('start')
    var results = []
    for (let process of processList) {
        let rs = await this.update(portal, process)
        // console.log('tskDIs',rs.taskDisId)
        results.push({
            process: process,
            tasks: rs.pertData,
            diagramData: rs.diagramData,
            taskDisId: rs.taskDisId,
            totalData:rs.totalData
        })
    }
    return { processListData: results }

}
/**
 * Hàm tính toán xác suất thành công cho một quy trình
 * @param {Database} portal 
 * @param {Quy trình} process 
 * @returns 
 */
exports.update = async (portal, process) => {

    let taskProcess = await TaskProcess(connect(DB_CONNECTION, portal)).findOne({ _id: process }).populate('tasks')
    // console.log('updateProcess', taskProcess.processName)
    let durationMap = new Map()// Chứa các duration của các công việc trong quy trình

    // Tính duration của các công việc 
    for (let task of taskProcess.tasks) {
        if (task.codeInProcess != undefined) {
            let duration = DateDiff.inDays(task.startDate, task.endDate)
            // console.log('duration of task',task.name)
            // console.log(duration)
            durationMap.set(task.codeInProcess, duration)
        }
    }
    // Tính toán xác xuất thành công theo PERT
    let taskDistribution = await TaskDistribution(connect(DB_CONNECTION, portal)).find().populate('tasks')
    // Tìm taskDistribution đã dùng để tạo nên Process
    taskDistribution = taskDistribution.find(td => {
        return td.tasks[0].taskID.toString() == taskProcess.tasks[0].codeInProcess.toString()
    })
    let tasks = taskDistribution.tasks;
    let tasksTemp = []
    let pertService = new Pert()
    let pertEs = await PertEstimation(connect(DB_CONNECTION, portal)).find()
    pertEs = new Map(pertEs.map(pe => [pe.taskID, pe]))
    // console.log(pertEs)
    for (let task of tasks) {
        let pertData = pertEs.get(task.taskID)// Lấy dữ liệu về 3 ước lượng của PERT
        // console.log(pertData)
        let temp = clone(task)
        temp.optimistic = pertData.opt
        temp.mostlikely = pertData.mos
        temp.pessimistic = pertData.pes
        temp.duration = durationMap.get(task.taskID)
        temp.expectedTime = pertService.estimateDuration(pertData.opt, pertData.mos, pertData.pes)
        tasksTemp.push(temp)

    }
    pertService.setTasks(tasksTemp)
    pertService.updateTaskList()
    pertService.updatePertProb()
    let totalData = pertService.getTotalProb()
    let totalPertProb = totalData.totalProb
    let totalDuration = totalData.totalDuration
    let criticalPath = totalData.criticalPath
    console.log('totalPert',totalPertProb)
    tasksTemp = pertService.getTasks()
    
    // Tạo ra 5 ví dụ để vẽ biểu đồ
    let pertMap = new Map(tasksTemp.map(task => { return [task.taskID, []] }))
    // console.log(pertMap)
    let processDiagrams = []
    for (let i = -2; i <= 2; i++) {
        let taskClone = clone(tasksTemp)
        for (let task of taskClone) {
            let temp = tasksTemp.find(t => t.ID == task.ID)
            // let exp = pertService.estimateDuration(temp.optimistic, temp.mostlikely, temp.pessimistic)
            task.duration = temp.duration + i
        }
        pertService.setTasks(taskClone)
        pertService.updateTaskList()
        pertService.updatePertProb()
        processDiagrams = processDiagrams.concat(pertService.getTasks())

    }

    processDiagrams = processDiagrams.map(process => { return { taskID: process.taskID, duration: process.duration, pertProb: process.pertProb } })
    // console.log('processDiagram', processDiagrams)
    for (let task of processDiagrams) {
        pertMap.get(task.taskID).push(task.pertProb)
    }
    // for([key,value] of pertMap){
    //     console.log(key)
    //     console.log(value)
    // }
    // Update lại cơ sở dữ liệu
    await TaskDistribution(connect(DB_CONNECTION, portal)).findOneAndUpdate({ _id: taskDistribution._id }, {
        tasks: tasksTemp
    })
    tasks = tasksTemp
    // console.log(tasks)// Đang dùng random data nên comment bên dưới nếu thích chính xác thì bỏ comment đi
    // Tính xác suất thành công khi xét đến các yếu tố rủi ro
    // Lấy dữ liệu dataset của task
    // const TASK_DATASET = 2;
    // var BitArray = require('node-bitarray')// lib convert between binary and oct
    // let taskData = await BayesDataset(connect(DB_CONNECTION, portal)).find({ type: TASK_DATASET, taskDistribution: taskDistribution })
    // // console.log('dataset',taskData)
    // if (taskData == null || taskData.length == 0) return []
    // let taskInfo = []
    // let index = 0

    // // Cập nhập CPT cho các task 
    // for (let task of tasks) {
    //     let bitArrLen = BitArray.parse(2 ** (task.parentList.length + 3) - 1).length
    //     let data = taskData.map(t => {
    //         let bitarr = BitArray.parse(t.states[index], 32)
    //         let rs = bitarr.slice(-bitArrLen)
    //         return rs
    //     })
    //     taskInfo.push({
    //         taskID: task.taskID,
    //         data: data,
    //         len: bitArrLen,
    //     })
    //     index++;
    // }
    // // console.log(taskInfo)
    // // Ước lượng tham số cho các mạng Bayes con
    // let taskInfoMap = new Map(taskInfo.map(task => {
    //     let len = task.len
    //     let joinProb = []
    //     for (let i = 0; i < len; i++) {
    //         joinProb.push([1, 0])
    //     }
    //     joinProb = product(joinProb)
    //     let data = {
    //         taskID: task.taskID,
    //         data: task.data,
    //         matrix: joinProb,
    //         probs: []
    //     }

    //     return [task.taskID, data]
    // }))
    // // Sử dụng MLE để ước lượng các tham số đầu vào ( các giá trị của CPT )
    // for (let data of taskInfo) {
    //     let taskInfo = taskInfoMap.get(data.taskID)
    //     let matrix = taskInfo.matrix
    //     let dataSet = taskInfo.data
    //     for (let d of matrix) {
    //         let parents = clone(d)
    //         parents.pop()// Chỉ lấy trạng thái các nút cha
    //         let numJoinProb = dataSet.filter(o => compareArr(o, d) == true).length
    //         let numParentJoinProb = dataSet.filter(o => {
    //             let data = clone(o)
    //             data.pop()
    //             return compareArr(data, parents)
    //         }).length
    //         taskInfo.probs.push(numJoinProb / numParentJoinProb)
    //     }
    // }
    // // console.log('taskInfo',taskInfo)
    // tasksTemp = []
    // for (let task of tasks) {
    //     let temp = clone(task)
    //     temp.probs = taskInfoMap.get(task.taskID).probs
    //     tasksTemp.push(temp)
    // }
    // await TaskDistribution(connect(DB_CONNECTION, portal)).findOneAndUpdate({ _id: taskDistribution._id }, {
    //     tasks: tasksTemp
    // })
    // Tính xác suất của các nút trong mạng Bayes con
    // Đã tính : nút PERT
    // Chưa tính : nút Risk, nút Predecessor
    // Tính nút risk: Các task thuộc các class khác nhau chịu ảnh hưởng từ những risk class khác nhau
    let risks = await RiskDistribution(connect(DB_CONNECTION, portal)).find()
    risks = risks.filter(r => r.isRiskClass)// Các lớp rủi ro
    // console.log('riskclass',risks)
    let taskDataMap = []
    let resCountJson = []
    let diagramDataMap = new Map(tasks.map(task => [task.taskID, []]))
    for (let task of tasks) {

        // Tìm những lớp rủi ro ảnh hưởng đến task đó
        let riskImpact = risks.filter(r => r.taskClass.includes(task.class))
        let riskProb = 1;// nút Risk 
        let cpt = task.probs
        riskImpact.forEach(r => {
            riskProb = riskProb * r.prob
        })// Đoạn này chưa gọi updateRisk thì chưa có prob ( nên gọi ở client )
        // Tính xác suất thành công của nút đầu tiên
        // Update task đầu tiên
        // Thứ tự của dataset : Predecessors,Risk,Pert,Sucessfully
        let nodesForBayesNet = []
        if (task.parentList.length != 0) {
            let predecessors = tasks.filter(t => task.parentList.includes(t.taskID))
            for (let pre of predecessors) {
                nodesForBayesNet.push({
                    id: pre.taskID,
                    probs: pre.prob
                })
            }
        }

        nodesForBayesNet.push({
            id: 'Risk',
            probs: riskProb
        })
        nodesForBayesNet.push({
            id: 'Pert',
            probs: task.pertProb
        })
        cpt = getRandomCpt(task.parentList.length)
        nodesForBayesNet.push({
            id: task.taskID,
            probs: cpt
        })
        // console.log('nodeFor',nodesForBayesNet)
        // Tinh toan 5 gia tri cho do thi
        for (let i = 0; i < 5; i++) {
            let pertProb = pertMap.get(task.taskID)[i]
            let nodes = nodesForBayesNet.map(node => {
                if (node.id != 'Pert') return node
                return {
                    id: 'Pert',
                    probs: pertProb
                }
            })
            // nodes.push()
            // console.log('node for Bayes',nodes)
            let taskRiskNet = new TaskRiskNet('Task Risk Net', nodes)
            let res = taskRiskNet.calcProb()
            diagramDataMap.get(task.taskID).push(res.prob)
        }
        // random phan phoi cho task 

        // console.log('nodes for Bayes', nodesForBayesNet)
        let taskRiskNet = new TaskRiskNet('Task Risk Net', nodesForBayesNet)
        let res = taskRiskNet.calcProb()
        task.prob = res.prob
        task.noRiskProb = res.noRiskProb
        taskDataMap.push({
            taskID: task.taskID,
            pertProb: task.pertProb,
            riskProb: riskProb,
        })
        for (let temp of tasksTemp) {
            if (temp.taskID == task.taskID) {
                temp.prob = task.prob
                temp.riskProb = riskProb
                temp.noRiskProb = task.noRiskProb
            }
        }
        resCountJson.push({
            taskID: task.taskID,
            riskList: [],
            childProbs: task.probs,
            parentProbs: [],
            successProb: task.prob,
        })
    }
    // console.log(diagramDataMap)
    let diagramData = []
    for (let [key, val] of diagramDataMap) {
        // console.log('kye',key)
        let timeseries = tasks.filter(t => t.taskID == key).map(p => {
            let data = p.duration
            return [data - 2, data - 1, data, data + 1, data + 2]
        })
        timeseries = timeseries[0]
        // console.log(timeseries)
        diagramData.push({
            taskID: key,
            points: val,
            timeseries: timeseries
        })
    }
    // Tính xác suất xảy ra rủi ro đối với cả quy trình
    // Đếm những hàng có toàn 0 rồi lấy tổng số datapoints trừ đi
    //Bắt đầu đếm từ dataset
    let dataSet = await BayesDataset(connect(DB_CONNECTION, portal)).find({ type: 1 })
    // //console.log('length of data ',dataSet.length)
    dataSet = dataSet.map(d => d.states)
    let hasRiskPoint = dataSet.filter(dp =>dp.includes(1))
    // console.log(dataSet)
    // console.log(hasRiskPoint.length)
    // console.log(dataSet.length)
    let totalRisk   = hasRiskPoint.length/dataSet.length
    // sử dụng tri thức chuyên gia
    // mạng Bayes gồm 3 nút : totalRisk: xác suất xảy ra rủi ro , totalPert: xác suất hoàn thành trước deadline, 
    //totalProbability: Xác suất thành công của cả quy trình
    let cptTotal = [
        0.9,0.1,
        0.3,0.7,
        0.9,0.1,
        0.7,0.3
    ]
    // Tạo mạng Bayes
    let nodes = []
    nodes.push({
        id:'Risk',
        probs:totalRisk
    })
    nodes.push({
        id:'Pert',
        probs:totalPertProb
    })
    nodes.push({
        id:'all',
        probs:cptTotal
    })
    console.log(nodes)
    
    let taskRiskNet = new TaskRiskNet('Total Prob', nodes)
    let totalProb = taskRiskNet.calcProb()
    totalProb = totalProb.prob
    // console.log(totalProb)
    // console.log(criticalPath)
    totalData = {totalDuration:totalDuration,totalProb:totalProb,criticalPath:criticalPath}

    return { pertData: tasksTemp, countModel: [], taskRiskData: resCountJson, diagramData: diagramData, taskDisId: taskDistribution._id,totalData:totalData}
}
exports.changeTime = async (portal, data) => {
    const { taskDistributionId, taskProcessId, tasks } = data
    let taskProcess = await TaskProcess(connect(DB_CONNECTION, portal)).findOne({ _id: taskProcessId }).
        populate('tasks')
    if (taskProcess) {
        console.log(taskProcess)
        let temp = clone(taskProcess.tasks)
        let durationMap = new Map(tasks.map(task => [task.taskID, task.duration]))
        for (let task of temp) {
            console.log(task._id)
            let duration = durationMap.get(task.codeInProcess)
            // console.log('end Befor',task.endDate)
            let endDate = new Date(task.startDate)
            // console.log(endDate)
            endDate.setTime(endDate.getTime() + duration * (24 * 3600 * 1000))
            task.endDate = endDate
            // console.log('end after',task.endDate)
            let taskUpdate = await Task(connect(DB_CONNECTION, portal)).findOneAndUpdate({ _id: task._id }, {
                $set: { endDate: endDate }
            }
                , { new: true })
        }

    }
    return await TaskProcess(connect(DB_CONNECTION, portal)).findOne({ _id: taskProcessId })
    // return rs
}
exports.countTask = async (portal, params) => {


}