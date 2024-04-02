const  { Network, Node, Variable, State, Link, TableIterator, Table, RelevanceTreeInferenceFactory } = require('bayes-server');
function BayesianNet(name){
    //init
    this.name = name
    this.bayesianNet = new Network(name)
    this.node = []
    this.matTF = [] // 2 D array
    this.addNode = (name) =>{
        this.bayesianNet.nodes.push(new Node(name,[new State("True"),new State("False")]))
    }
  
    this.addLink = (parent,child) =>{
        this.bayesianNet.links.push(new Link(parent,child))
    }
    this.addLinkStr = (parentStr,childStr) =>{
        this.bayesianNet.links.push(new Link(this.getNode(parentStr),this.getNode(childStr)))
    }
    this.addCptTable = (nodes,problist) =>{
        // console.log(nodes)
        let tableChildNode = nodes[nodes.length-1].newDistribution().table; 
        let iterChildNode = new TableIterator(tableChildNode,nodes)
        iterChildNode.copyFrom(problist)
        nodes[nodes.length-1].distribution = tableChildNode
    }
    this.getNode = (name) =>{
        return this.bayesianNet.nodes.get(name)
    }
    this.getNodeState =  (node,state) =>{
        // console.log(node.variables())
        return node.variables.get(0).states.get(state)
    }
    this.initEngine = () =>{
        this.factory = new RelevanceTreeInferenceFactory();
        this.inference = this.factory.createInferenceEngine(this.bayesianNet);
        this.queryOptions = this.factory.createQueryOptions();
        this.queryOutput = this.factory.createQueryOutput();
    }
    this.getNet = ()=>{
        return this.bayesianNet
    }


}
module.exports = BayesianNet
// export default BayesianNet