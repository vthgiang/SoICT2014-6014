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

let minR = 999;
let fatherDistance;
let went;
let ordinal = [];
let payload, volume;
let currentPayload, currentVolume;
const calDistanceGeocode = (lat1, lng1, lat2, lng2) => {
    return Math.sqrt((lat2- lat1)*(lat2- lat1) + (lng2-lng1)*(lng2-lng1));
}
const checkValid = (i, listRequirementsGeocode) => {
    if (i===0) {
        if (listRequirementsGeocode[i].type===1){
            return true;
        }
        else return false;
    }
    if (Number(listRequirementsGeocode[i].type) === 2){
        if (went[i-1]){
            return true;
        }
        else return false;
    }
    if (Number(listRequirementsGeocode[i].type) === 1){
        if (currentPayload+Number(listRequirementsGeocode[i].payload) > payload || 
            currentVolume+Number(listRequirementsGeocode[i].volume) > volume){
                return false;
            }
    }
    return true;
}

const nextAddress = (i, listRequirementsGeocode) => {
    if (Number(listRequirementsGeocode[i].type) === 1){
        currentVolume+=listRequirementsGeocode[i].volume;
        currentPayload+=listRequirementsGeocode[i].payload;
    }
    else {
        currentVolume-=listRequirementsGeocode[i].volume;
        currentPayload-=listRequirementsGeocode[i].payload;
    }
}

const backAddress = (i, listRequirementsGeocode) => {
    if (Number(listRequirementsGeocode[i].type) === 1){
        currentVolume-=listRequirementsGeocode[i].volume;
        currentPayload-=listRequirementsGeocode[i].payload;
    }
    else {
        currentVolume+=listRequirementsGeocode[i].volume;
        currentPayload+=listRequirementsGeocode[i].payload;
    }
}

const minRouteVehicle = (listRequirementsGeocode, beforeGeocode, currentDistance, k, len) => {
    if (k >=len) {
        if (currentDistance < minR) minR = currentDistance;
        return;
    }
    if (currentDistance > minR || currentDistance >=fatherDistance) return;
    for (let i = 0; i< listRequirementsGeocode.length; i++){
        if (checkValid(i, listRequirementsGeocode) && !went[i]) {
            ordinal.push(listRequirementsGeocode);
            went[i] = true;
            let extraDistance = 0;
            if (beforeGeocode){
                extraDistance= calDistanceGeocode(listRequirementsGeocode[i].geocode.lat, listRequirementsGeocode[i].geocode.lng, beforeGeocode.geocode.lat, beforeGeocode.geocode.lng);
                currentDistance += extraDistance;
            }
            nextAddress(i, listRequirementsGeocode);         
            minRouteVehicle(listRequirementsGeocode, listRequirementsGeocode[i], currentDistance, k+1, len);
            currentDistance -= extraDistance;
            went[i] = false;
            backAddress(i, listRequirementsGeocode);
            ordinal.pop();
        }
    }
}

exports.calMinDistanceVehicleGo = (listRequirementsGeocode, transportVehicles, fatherMin) => {
    fatherDistance = fatherMin;
    minR = 999;
    went = new Array(listRequirementsGeocode.length);
    currentPayload = 0;
    currentVolume = 0;
    for (let i = 0 ; i< listRequirementsGeocode.length; i++){
        went[i] = false;
    }
    payload = transportVehicles.payload;
    volume = transportVehicles.volume;
    // console.log(listRequirementsGeocode, " aaaaaaaaaaa")
    minRouteVehicle(listRequirementsGeocode, null, 0, 0, listRequirementsGeocode.length);
    return minR;
}