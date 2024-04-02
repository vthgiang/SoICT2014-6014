// import gaussian from 'gaussian'
const gaussian = require('gaussian')
class Pert {
    constructor(tasks){
        this.tasks = tasks
    }
    estimateDuration(opt,mos,pes){
        return (opt+4*mos + pes)/6
    }
    standardDeviation(opt,pes){
        return (pes-opt)/6
    }
    getEsCompareValue(par){
        return par.taskInformation.duration + par.taskInformation.es
    }
    getLfCompareValue(suc){
        return suc.taskInformation.lf-suc.taskInformation.duration
    }
    parents(task){
        return this.tasks.filter(t => (task.parentList.includes(t.taskId)))
    }
    childs(task){
        return this.tasks.filter(t => (t.parentList.includes(task.taskId)))
    }
    updateChildParent(){
        // console.log('update task')
        for(let t of this.tasks){
            t.parents = this.parents(t)
            t.childs = this.childs(t)
        }
    }
    getSlack(t){
        return t.taskInformation.ls -t.taskInformation.es
    }
    getParents(task){
        console.log(task.parents)
    }
    updateTaskList(){
        this.updateChildParent()
        let firstTask = this.tasks[0]
        firstTask.taskInformation.es = 0;
        for(let t of this.tasks){
            if(t.parents.length ==0){
                t.taskInformation.es = 0;
            }else{
                let initEs = 0
                for(let par of t.parents){
                    let compare = this.getEsCompareValue(par)
                    if(initEs < compare){
                        initEs = compare
                    }
                }
                t.taskInformation.es = initEs
               
            }
            t.taskInformation.ef = this.getEsCompareValue(t)
        }

        let endTask = this.tasks[this.tasks.length-1]
        endTask.taskInformation.lf = this.getEsCompareValue(endTask)
        let reverseTasks = this.tasks.reverse()
        for(let t of reverseTasks){
            if(t.childs.length==0){
                t.taskInformation.lf = this.getEsCompareValue(t)
            }else{
                let initLf = 100000
                for(let child of t.childs){
                    if(child.taskInformation.ls<initLf){
                        initLf = child.taskInformation.ls
                    }
                }
                t.taskInformation.lf = initLf
            }
            t.taskInformation.ls = this.getLfCompareValue(t)
            t.taskInformation.slack = this.getSlack(t)
        }
        this.tasks.reverse()

    }
    getCriticalPath(){
        // console.log(this.tasks.filter(t => t.taskInformation.slack==0).map(t1=> t1.taskId))
        return this.tasks.filter(t => t.taskInformation.slack==0)
    }
    updatePertProb(){
        this.updateTaskList()
        for(let t of this.tasks){
            let duration = t.taskInformation.duration
            let opt = t.taskInformation.optimistic
            let mos = t.taskInformation.mostlikely
            let pes = t.taskInformation.pessimistic
            let expectedTime = this.estimateDuration(opt,mos,pes)
            let standardDeviation = this.standardDeviation(opt,pes)
            // let prob = cdf(expectedTime,standardDeviation,duration)
            var distribution = gaussian(expectedTime, standardDeviation*standardDeviation);
            let prob = distribution.cdf(duration)
            t.pertProb = prob
        }
    }
}
// export default Pert;
module.exports = Pert