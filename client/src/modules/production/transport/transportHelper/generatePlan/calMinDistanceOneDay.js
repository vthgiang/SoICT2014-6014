// import { calMinDistanceVehicleGo } from './calMinDistanceVehicleGo'

const calMinDistanceVehicleGo = require("./calMinDistanceVehicleGo")

const changeTransportRequirementToGeocodeArray = (listRequirements) => {
    let res = [];
    listRequirements.map((item, index) => {
        res.push({
            _id: item._id,
            payload: item.payload,
            volume: item.volume,
            geocode: item.geocode?.fromAddress,
            type: 1,
        }, {
            _id: item._id,
            payload: item.payload,
            volume: item.volume,
            geocode: item.geocode?.toAddress,
            type: 2,
        })
    })
    return res;
}
let minR = 999;
let fatherDistance;
let selected;
let vehicleUsed;
let vehicleUsedRes;
let countVehicleUsed=0;
const minRouteInDay = (listRequirements, listVehicles, numVehicles, k) => {
    if (k>=listRequirements.length){
        let tmpDistance = 0;
        for (let i=0;i<listVehicles.length;i++){
            if (vehicleUsed[i] && vehicleUsed[i].length!==0){
                if (tmpDistance >=minR || tmpDistance >=fatherDistance) return;
                tmpDistance+=calMinDistanceVehicleGo.calMinDistanceVehicleGo(changeTransportRequirementToGeocodeArray(vehicleUsed[i]), listVehicles[i], minR);
            }
        }
        if (tmpDistance < minR) {
            for (let i=0;i<listVehicles.length;i++){
                vehicleUsedRes[i] = [...vehicleUsed[i]];
            }
            minR = tmpDistance;
        }
        return;
    }
    for (let i=0; i<listRequirements.length; i++){
        if (selected[i] === false && check(i, listRequirements.length)){
            for (let j=0; j< listVehicles.length; j++){
                let flag2 = true;
                if (!(vehicleUsed[j] && vehicleUsed[j].length!==0)){
                    if (countVehicleUsed + 1 > numVehicles){
                        continue;
                    }
                    else{
                        flag2= false;
                        countVehicleUsed++;
                    }
                }
                vehicleUsed[j].push(listRequirements[i]);
                selected[i] = true;
                minRouteInDay(listRequirements, listVehicles, numVehicles, k+1);
                if (!flag2){
                    countVehicleUsed--;
                }
                vehicleUsed[j].pop();
            }
        }
    }
}
const check = (start, end) => {
    for (let i = start + 1; i<end;i++){
        if (selected[i]===true) return false;
    }
    return true;
}
exports.calMinDistanceOneDay = (listRequirements, listVehicles, numVehicles, totalDistance) => {
    minR = 999;
    fatherDistance = totalDistance;
    selected = new Array(listRequirements.length);
    vehicleUsed = new Array(listVehicles.length);
    vehicleUsedRes = new Array(listVehicles.length)
    for (let i =0; i< listRequirements.length ;i++){
        selected[i] = false;
    }
    for (let i=0; i< listVehicles.length;i++){
        vehicleUsed[i] = [];
    };
    minRouteInDay(listRequirements, listVehicles, numVehicles, 0);
    return {minR, vehicleUsedRes};
}