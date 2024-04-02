import dayjs from "dayjs"
export const roundProb = (prob) =>{
    return Math.round(prob*10000)/100
}
export const getItemsFromRiskResponsePlan =(riskResponsePlanList) =>{
    let items = riskResponsePlanList.map(riskResponsePlan => {
        var item = { text: '', value: '' }
        item.text = riskResponsePlan.riskApply 
        item.value = riskResponsePlan._id
        return item
    })
    return items
}
export const getRiskSelectBoxItems = (groupName, riskList) => {
    let groupRisk = riskList.filter(r => r.riskID < 5)
    let items = []
    for (let risk of groupRisk) {
        if (risk.parents.length != 0) {
            let textGroupName = risk.name
            let groupValue = risk.parentList.map(
                r => {
                    var item = { text: '', value: '' }
                    item.text = r.name + `(ID:${r.riskID})`
                    item.value = r.name
                    return item
                }
            )
            items.push({
                text:textGroupName,
                value:groupValue
            })
        }
    }
    return items;
}

export const getTaskSelectBox = (groupName, taskList) => {
    let taskIDName = taskList.map(task => {
        var item = { text: '', value: '' }
        item.text = task.name + "-" + task._id
        item.value = task._id
        return item
    })
    let items = [
        {
            text: groupName,
            value: taskIDName
        }
    ];
    return items;
}
export const isBetweenDate = (d,d1,d2) =>{
    return DateDiff.inDays(d1,d)>=0&&DateDiff.inDays(d,d2)>0
}
export const getStatusStr = (status) =>{
    if(status =='finished') return 'Đã xử lý'
    if(status =='inprocess') return 'Đang xử lý'
    if(status =='wait_for_approve') return 'Chờ phê duyệt'
    
}
export const getRankingStr = (translate,ranking) =>{
    let str = ""
    
    if(ranking<=3) str= `${translate('risk_dash.risk_matrix.minor')} (${ranking})`
    if(ranking>3&&ranking<=6) str= `${translate('risk_dash.risk_matrix.moderate')}(${ranking})`
    if(ranking>6&&ranking<=9) str= `${translate('risk_dash.risk_matrix.major')} (${ranking})`
    if(ranking>9) str= `${translate('risk_dash.risk_matrix.severe')}(${ranking})`
    if(ranking==0) str =''
    return str
}
export const getImpactStr = (translate,impact)=>{
    if(impact ==1) return translate('manage_risk.low')
    if(impact ==2) return  translate('manage_risk.medium')
    if(impact ==3) return  translate('manage_risk.high')
    if(impact ==4) return  translate('manage_risk.very_high')
    return ""
}
export const filteredArray =(array1,array2)=>{
    return array1.filter(value => array2.includes(value));
}
export const isIntersection= (array1,array2) =>{
    for(let item of array1){
        if(array2.includes(item)) return true
    }
    return false
}
export const getRankingColors = () =>{
    return ["#2EFE2E","#D7DF01","orange","#FF0040"]
}
export const getRankingColor = (ranking) =>{
    let color = "gray"
    if (ranking < 4) {
        color = "#04B404"
    }
    if (ranking <= 6 && ranking >= 4) {
        color = "#D7DF01"
    }
    if (ranking >= 8 && ranking <= 9) {
        color = "orange"

    }
    if(ranking>9){
        color = "#FF0040"
    }
    return color
}
export const DateDiff = {
    
    inDays: function(d1, d2) {
        // console.log('d1',d1)
        // console.log('d2',d2)
        let dt1 = new Date(d1)
        let dt2 = new Date(d2)
        var t2 = dt2.getTime();
        var t1 = dt1.getTime();
 
        return parseInt((t2-t1)/(24*3600*1000));
    },
 
    inWeeks: function(d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();
 
        return parseInt((t2-t1)/(24*3600*1000*7));
    },
 
    inMonths: function(d1, d2) {
        var d1Y = d1.getFullYear();
        var d2Y = d2.getFullYear();
        var d1M = d1.getMonth();
        var d2M = d2.getMonth();
 
        return (d2M+12*d2Y)-(d1M+12*d1Y);
    },
 
    inYears: function(d1, d2) {
        return d2.getFullYear()-d1.getFullYear();
    }
}
export const getRiskParentBox = (groupName, parents) => {
    let parentIdName = parents.map(par => {
        var item = { text: '', value: '' }
        item.text = par.riskName + "-ID:" + par._id
        item.value = par.riskID
        return item
    })
    return [{
        text: groupName,
        value: parentIdName
    }]
}
export const normalizeDescription = (description) => {

    return (description.includes('<p>') && description.includes('</p>')) ? description.replace('<p>', '').replace('</p>', '') : description
}
export const getDate = (date) => {
    return dayjs(date).format('YYYY/MM/DD HH:mm:ss')
}
export const convertDate = (date) => {
    return dayjs(date).format('DD-MM-YYYY')
}
export const  clone = (o) => {
    return JSON.parse(JSON.stringify(o))
}