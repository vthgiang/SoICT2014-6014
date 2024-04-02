const BayesianNet = require('../BayesianNetwork')
const product = require('cartesian-product')
const {Node,Table} = require('bayes-server')
class TaskNet extends BayesianNet{
    constructor(name,probList){ // probList = [[Duration_Prob],RiskNode_Prob,TaskNode_Prob]
        super(name)
        this.probList = probList// contain task prob and risk prob
    }
    init(){
        const DURATION =0
        const TASKNODE =2
        const RISKNODE =1
        let nodes  = []
        this.addNode("Success")// child node
        this.addNode("RiskNode")// bayesian network
        this.addNode("TaskNode")// task node
       
        
        // add Link
        this.addLink(this.getNode("TaskNode"),this.getNode("Success"))
        this.addLink(this.getNode("RiskNode"),this.getNode("Success"))
        nodes = [...nodes,this.getNode("TaskNode")]
        nodes = [...nodes,this.getNode("RiskNode")]
        nodes = [...nodes,this.getNode("Success")]
        this.nodes = nodes
        // add cpt table
        this.addCptTable([this.getNode("RiskNode")],[this.probList[RISKNODE],1-this.probList[RISKNODE]])
        this.addCptTable([this.getNode("TaskNode")],[this.probList[TASKNODE],1-this.probList[TASKNODE]])
        this.addCptTable(nodes,this.probList[DURATION])

    }
    generateTFMatrix(){
        this.TRUE = 'True'
        this.FALSE = 'False'
        let stateIter = []
        for(let node of this.nodes){
            let states = []       
            states = [...states,this.getNodeState(node,this.TRUE)]
            states = [...states,this.getNodeState(node,this.FALSE)]
            stateIter = [...stateIter,states]
        }
        this.TFMatrix = product(stateIter)
    }
    calcProb(){
        this.init()
        this.generateTFMatrix()
        this.initEngine()
        let childNode = this.getNode("Success")
        let result = 0;
        let row = this.TFMatrix.length
        let col = this.TFMatrix[0].length
        for(let rowState of this.TFMatrix){
            // console.log(this.TFMatrix[row].length)
            try{
               
                let queryRow = new Table(this.nodes)
                this.inference.queryDistributions.pushDistribution(queryRow) 
                this.inference.query(this.queryOptions,this.queryOutput)
                
                if(rowState[col-1]==this.getNodeState(childNode,this.TRUE)){
                    result+=queryRow.get(rowState)
                }
            }catch(err){
                console.log(err)
            }
        }
        return result;
        
    }
}
module.exports = TaskNet