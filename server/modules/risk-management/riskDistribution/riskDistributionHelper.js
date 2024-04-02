const {connect} = require(`../../../helpers/dbHelper`);
const { Risk ,RiskDistribution} = require("../../../models");

exports.getRiskIDByName = async(name,portal)=>{
    let riskIDObject = await RiskDistribution(connect(DB_CONNECTION,portal)).findOne({'name':name}).select('riskID');
    const riskID = riskIDObject.riskID;
    return parseInt(riskID)
} 
exports.round = (num) =>{
    return Math.round((num + Number.EPSILON) * 100) / 100
}
exports.hasSubArray = (master, sub) => {
    
    let masterClone = JSON.parse(JSON.stringify(master))
    masterClone.sort((a, b) => a - b)
    let subClone = JSON.parse(JSON.stringify(sub))
    if(subClone.length>1){
        subClone.sort((a, b) => a - b)
        return subClone.every((i => v => i = masterClone.indexOf(v, i) + 1)(0))
    }else{
        // console.log('length=1',subClone)
        // console.log(masterClone.includes(subClone[0]))
        return masterClone.includes(subClone[0])
    }
}
exports.clone = (o) => {
    return JSON.parse(JSON.stringify(o))
}