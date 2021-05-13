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
let went = new Array(999999);
const calDistanceGeocode = (lat1, lng1, lat2, lng2) => {
    return Math.sqrt((lat2- lat1)*(lat2- lat1) + (lng2-lng1)*(lng2-lng1));
}
const minRouteVehicle = (listRequirementsGeocode, beforeGeocode, currentDistance, k, len) => {
    if (k >=len-1) {
        if (currentDistance < minR) minR = currentDistance;
        return;
    }
    if (currentDistance > minR) return;
    for (let i = 0; i< listRequirementsGeocode.length; i++){
        if (checkValid(i)) {
            went[i] = true;
            currentDistance += calDistanceGeocode(listRequirementsGeocode[i].geocode.lat, listRequirementsGeocode[i].geocode.lng, beforeGeocode.geocode.lat, beforeGeocode.geocode.lng);
            minRouteVehicle(listRequirementsGeocode, listRequirementsGeocode[i], currentDistance, k+1, len);
            currentDistance -= calDistanceGeocode(listRequirementsGeocode[i].geocode.lat, listRequirementsGeocode[i].geocode.lng, beforeGeocode.geocode.lat, beforeGeocode.geocode.lng);
            went[i] = false;
        }
    }
}

exports.calMinDistanceVehicleGo = async (listRequirementsGeocode) => {
    minR = 99999;
    for (let i = 0 ; i< listRequirementsGeocode.length; i++){
        went[i] = false;
    }
    await minRouteVehicle(listRequirementsGeocode, null, 0, 0, listRequirementsGeocode.length);
    return minR;
}