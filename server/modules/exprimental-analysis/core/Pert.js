// import gaussian from 'gaussian'
const gaussian = require('gaussian')
const ztable = require('ztable');
class Pert {
    constructor(tasks){
        this.tasks = tasks
    }
    setTasks(tasks){
        this.tasks = tasks
    }
    getTasks(){
        this.tasks.forEach(element => {
            delete element.parents
            delete element.childs
        });
        return this.tasks
    }
    estimateDuration(opt,mos,pes){
        return (opt+4*mos + pes)/6
    }
    standardDeviation(opt,pes){
        return (pes-opt)/6
    }
    getEsCompareValue(par){
        return par.duration + par.es
    }
    getLfCompareValue(suc){
        return suc.lf-suc.duration
    }
    parents(task){
        return task.parentList
        return this.tasks.filter(t => (task.parentList.includes(t.ID)))
    }
    childs(task){
        return task.childList
        return this.tasks.filter(t => (task.childList.includes(t.ID)))
    }
    updateChildParent(){
        // console.log('update task')
        for(let t of this.tasks){
            t.parents = this.parents(t)
            t.childs = this.childs(t)
        }
    }
    getSlack(t){
        return t.ls -t.es
    }
    getParents(task){
        console.log(task.parents)
    }
    updateTaskList(){
        this.updateChildParent()
        let firstTask = this.tasks[0]
        firstTask.es = 0;
        for(let t of this.tasks){
            if(t.parents.length ==0){
                console.log('parent not')
                t.es = 0;
            }else{
                let initEs = 0
                for(let par of t.parents){
                    let compare = this.getEsCompareValue(par)
                    // console.log(t.ID,initEs,compare)
                    if(initEs < compare){
                        initEs = compare
                    }
                }
                t.es = initEs
               
            }
            t.ef = this.getEsCompareValue(t)
        }

        let endTask = this.tasks[this.tasks.length-1]
        endTask.lf = this.getEsCompareValue(endTask)
        let reverseTasks = this.tasks.reverse()
        for(let t of reverseTasks){
            if(t.childs.length==0){
                t.lf = this.getEsCompareValue(t)
            }else{
                let initLf = 100000
                for(let child of t.childs){
                    if(child.ls<initLf){
                        initLf = child.ls
                    }
                }
                t.lf = initLf
            }
            t.ls = this.getLfCompareValue(t)
            t.slack = this.getSlack(t)
        }
        this.tasks.reverse()

    }
    getCriticalPath(){
        // console.log(this.tasks.filter(t => t.slack==0).map(t1=> t1.ID))
        return this.tasks.filter(t => t.slack==0)
    }
    updatePertProb(){
        this.updateTaskList()
        for(let t of this.tasks){
            let duration = t.duration
            let opt = t.optimistic
            let mos = t.mostlikely
            let pes = t.pessimistic
            let expectedTime = this.estimateDuration(opt,mos,pes)
            let standardDeviation = this.standardDeviation(opt,pes)
            let zScore = (duration-expectedTime)/standardDeviation
            let prob = ztable(zScore)
            console.log(zScore)
            // let prob = cdf(expectedTime,standardDeviation,duration)
            // var distribution = gaussian(expectedTime, standardDeviation*standardDeviation);
            // let prob = distribution.cdf(duration)
            t.pertProb = prob
        }
    }
    getTotalProb() {
        let criticalPath = this.getCriticalPath()
        console.log(criticalPath.length)
        let totalVariance = 0
        let totalExpectedTime = 0
        let totalDuration = 0
        for(let t of criticalPath){
            console.log(t.duration)
            let duration = t.duration
            let opt = t.optimistic
            let mos = t.mostlikely
            let pes = t.pessimistic
            let expectedTime = this.estimateDuration(opt,mos,pes)
            let standardDeviation = this.standardDeviation(opt,pes)
            totalVariance += standardDeviation*standardDeviation
            totalExpectedTime += expectedTime
            totalDuration +=duration
        }
        console.log('total',totalDuration)
        console.log('exp',totalExpectedTime)
        let zScore = (totalDuration-totalExpectedTime)/Math.sqrt(totalVariance)
        // console.log(zScore)
        return {totalProb:ztable(zScore),totalDuration:totalDuration,criticalPath:criticalPath.map(task=> task.ID)}
    }
}
// export default Pert;
module.exports = Pert