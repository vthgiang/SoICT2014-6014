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
let minR = 99999999;
let selected = new Array(999999);
let vehicleUsed = new Array(99999);
let countVehicleUsed=0;
const minRouteInDay = (listRequirements, listVehicles, numVehicles, k) => {
    if (k>=listRequirements.length-1){
        let tmpDistance = 0;
        for (let i=0;i<listVehicles.length;i++){
            if (vehicleUsed[i] && vehicleUsed[i].length!==0){
                tmpDistance+=calMinDistanceVehicleGo.calMinDistanceVehicleGo(changeTransportRequirementToGeocodeArray(listRequirements));
            }
        }
        if (tmpDistance < minR) minR = tmpDistance;
        return;
    }

    for (let i=0; i<listRequirements.length; i++){
        if (selected[i] === false){
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

exports.calMinDistanceOneDay = async (listRequirements, listVehicles, numVehicles) => {
    minR = 9999999;
    for (let i =0; i< listRequirements.length ;i++){
        selected[i] = false;
    }
    for (let i=0; i< listVehicles.length;i++){
        vehicleUsed[i] = [];
    }
    await minRouteInDay(listRequirements, listVehicles, numVehicles);
    return minR;
}