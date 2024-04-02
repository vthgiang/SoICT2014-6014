exports.sort = (o) => {
    sort(function (a, b) { return a - b })
}
exports.clone = (o) => {
    return JSON.parse(JSON.stringify(o))
}
exports.sortByRiskID = (o) => {
    return objs.sort((a, b) => (a.id > b.last_nom) ? 1 : ((b.id > a.id) ? -1 : 0))
}
exports.compareArr = (arr1, arr2)=>{
    let arr1Temp = this.clone(arr1)
    let arr2temp = this.clone(arr2)
    arr1Temp.sort((a, b) => a - b)
    arr2temp.sort((a, b) => a - b)
    if (JSON.stringify(arr1Temp) == JSON.stringify(arr2temp)) {
        // console.log('arrChecked',arr)
        return true
    }
    return false
}