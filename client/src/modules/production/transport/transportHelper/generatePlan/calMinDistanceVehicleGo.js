/**
 * {
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
        }
 */

let minR = 99999;
let went = new Array(999);
let ordinal = [];
let payload, volume;
const calDistanceGeocode = (lat1, lng1, lat2, lng2) => {
    return Math.sqrt((lat2- lat1)*(lat2- lat1) + (lng2-lng1)*(lng2-lng1));
}
const checkValid = (i, listRequirementsGeocode) => {
    let currentPayload=0;
    let currentVolume=0;
    if (i===0) {
        if (listRequirementsGeocode[i].type===1){
            return true;
        }
        else return false;
    }
    if (listRequirementsGeocode[i].type === 2){
        if (went[i-1]){
            return true;
        }
        else return false;
    }
    if (ordinal && ordinal.length!==0){
        for (let i = 0;i<ordinal.length;i++){
            if(ordinal[i].type===1){
                currentVolume+=ordinal[i].volume;
                currentPayload+=ordinal[i].payload;
                if (currentPayload>payload || currentVolume>volume) return false;
            }
            else {
                currentVolume-=ordinal[i].volume;
                currentPayload-=ordinal[i].payload;
            }
        }
    }
    return true;
}

const minRouteVehicle = (listRequirementsGeocode, beforeGeocode, currentDistance, k, len) => {
    if (k >=len) {
        if (currentDistance < minR) minR = currentDistance;
        return;
    }
    if (currentDistance > minR) return;
    for (let i = 0; i< listRequirementsGeocode.length; i++){
        if (checkValid(i, listRequirementsGeocode) && !went[i]) {
            ordinal.push(listRequirementsGeocode);
            went[i] = true;
            if (beforeGeocode)
            currentDistance += calDistanceGeocode(listRequirementsGeocode[i].geocode.lat, listRequirementsGeocode[i].geocode.lng, beforeGeocode.geocode.lat, beforeGeocode.geocode.lng);
            minRouteVehicle(listRequirementsGeocode, listRequirementsGeocode[i], currentDistance, k+1, len);
            if (beforeGeocode)
            currentDistance -= calDistanceGeocode(listRequirementsGeocode[i].geocode.lat, listRequirementsGeocode[i].geocode.lng, beforeGeocode.geocode.lat, beforeGeocode.geocode.lng);
            went[i] = false;
            ordinal.pop();
        }
    }
}

exports.calMinDistanceVehicleGo = (listRequirementsGeocode, transportVehicles) => {
    minR = 99999;
    for (let i = 0 ; i< listRequirementsGeocode.length; i++){
        went[i] = false;
    }
    payload = transportVehicles.payload;
    volume = transportVehicles.volume;
    // console.log(listRequirementsGeocode, " aaaaaaaaaaa")
    minRouteVehicle(listRequirementsGeocode, null, 0, 0, listRequirementsGeocode.length);
    return minR;
}