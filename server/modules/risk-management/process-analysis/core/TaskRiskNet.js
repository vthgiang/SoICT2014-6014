const BayesianNet = require('./BayesianNetwork')
const product = require('cartesian-product')
const {Node,Table} = require('bayes-server')
class TaskRiskNet extends BayesianNet{
    constructor(name,data){
        super(name)
        this.data = data
    }
    
    init(){
        // console.log('RiskBayesData:',this.data)
        let childNode = this.data[this.data.length-1]
        for(var d of this.data){
            // console.log('addNode',d)
            this.addNode(d.id);
            
        }
        for(var d of this.data){
            if(d.id!=childNode.id){
                // console.log('parnode',d.id)
                this.addLink(this.getNode(d.id),this.getNode(childNode.id));
            }
        }
        // console.log('addNode completed')
        let nodes = []
        for(var d of this.data){
            nodes = [...nodes,this.getNode(d.id)]
        }
        this.nodes = nodes
        // add CPT table
        for(var d of this.data){
            // console.log('add CPT table')
            if(d.id!=childNode.id){
                let node = this.getNode(d.id)
                this.addCptTable([this.getNode(d.id)],[d.probs,1-d.probs])
            }else{
                // console.log('add cpt table child node')
                
                this.addCptTable(nodes,d.probs)
                // console.log('add cpt table child node ok')
            }
        }
        
    }
    generateTFMatrix(){
        this.TRUE = 'True'
        this.FALSE = 'False'
       
        let stateIter = []
        for(let r of this.data){
            let states = []
            let node = this.getNode(r.id)
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
        let childNode = this.data[this.data.length-1]
        childNode = this.nodes[this.nodes.length-1]
        let riskNode = this.nodes[this.nodes.length-3]
        let result = 0;
        let resNoRisk = 0;
        let row = this.TFMatrix.length
        let col = this.TFMatrix[0].length
        for(let rowState of this.TFMatrix){
            // console.log(this.TFMatrix[row].length)
            // Thứ tự của dataset : Predecessors,Risk,Pert,Sucessfully
            try{
               
                let queryRow = new Table(this.nodes)
                this.inference.queryDistributions.pushDistribution(queryRow) 
                this.inference.query(this.queryOptions,this.queryOutput)
                let sucessNodeState = rowState[col-1]
                let riskNodeState = rowState[col-3]
                if(rowState[col-1]==this.getNodeState(childNode,this.TRUE)){
                    result+=queryRow.get(rowState)
                }
                if(sucessNodeState==this.getNodeState(childNode,this.TRUE),riskNodeState==this.getNodeState(riskNode,this.FALSE)){
                    resNoRisk+=queryRow.get(rowState)
                }
            }catch(err){
                console.log(err)
            }
        }
        // console.log('res',result)
        // console.log('norisk',resNoRisk)
        // return result
        return {prob:result,noRiskProb:resNoRisk};
        
    }

}
module.exports = TaskRiskNet;