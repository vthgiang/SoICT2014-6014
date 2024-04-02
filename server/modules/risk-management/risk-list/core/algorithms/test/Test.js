const RiskNet =  require( '../impl/RiskNet.js')
const taskList =  require( './TaskDataSample')
const riskList =  require( './RiskDataSample')
const Pert =  require( '../Pert.js')
const TaskNet =  require( '../impl/TaskNet.js')
// Step 1: Caculate risk Prob
let riskNet = new RiskNet('riskNet',riskList)
riskNet.init()
riskNet.updateProb()
let risks = riskNet.getRiskList()
let riskProb = risks[riskList.length-1].prob
// Step 2 : Caculate task Prob by Pert Method
let pert = new Pert(taskList)
pert.updatePertProb()
// Step 3 : Combine task and risk
for(let task of taskList){
    let taskNet = new TaskNet('risk and task',[task.riskTaskCpt,riskProb,task.pertProb])
    task.prob= taskNet.calcProb()
    console.log(`Task ${task.taskId} :`)
    console.log(`Pert prob : ${task.pertProb}`)
    console.log(`Risk prob :${riskProb}`)
    console.log(`Prob : ${task.prob}`)
}