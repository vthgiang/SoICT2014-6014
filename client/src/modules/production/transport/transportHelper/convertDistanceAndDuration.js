/**
 * Chuyển đổi "ngày giờ phút" sang phút 1 ngày 1 giờ 24 phút => 1524
 * @param {*} time 
 * @returns 
 */
export const convertTimeToMinutes = (time) => {
    if (!time) return 0;
    let timeElement = time.split(" ")
    let timeToMinutes = 0
    if (timeElement.length >1){
      for (let i = 1; i<timeElement.length;i++){
        if (timeElement[i] === "ngày"){
            try {
                timeToMinutes+=parseInt(timeElement[i-1])*24*60;
            } catch (error) {
            }
        }
        if (timeElement[i] === "giờ"){
            try {
                timeToMinutes+=parseInt(timeElement[i-1])*60;
            } catch (error) {
            }
        }    
        if (timeElement[i] === "phút"){
            try {
                timeToMinutes+=parseInt(timeElement[i-1]);
            } catch (error) {
            }
        }
      }
    }
    return timeToMinutes;
}
/**
 * Chuyển đổi km m => m
 * @param {*} distance 
 * @returns 
 */
export const convertDistanceToKm = (distance) => {
    if (!distance) return 0;
    let distanceElement = distance.split(" ")
    let distanceToKm = 0
    if (distanceElement.length >1){
      for (let i = 1; i<distanceElement.length;i++){
        if (distanceElement[i] === "km"){
            try {
                distanceToKm+=parseInt(distanceElement[i-1]);
            } catch (error) {
            }
        }
      }
    }
    return distanceToKm;
}

export const reverseConvertTimeToMinutes = (timeToMinutes) => {
    let result = ""
    if (!timeToMinutes || String(timeToMinutes) === "") return "0"
    if (timeToMinutes>=24*60){
    result+=Math.floor(timeToMinutes/(24*60)) + " ngày ";
    timeToMinutes = timeToMinutes%(24*60);
    }
    if (timeToMinutes>=60){
        result+=Math.floor(timeToMinutes/60) + " giờ ";
        timeToMinutes = timeToMinutes%60;
    }
    result+=timeToMinutes+ " phút";
    return result;
}

export const reverseConvertDistanceToKm = (distance) => {
    let res;
    if (!distance || String(distance) === "0") {
        res= "0 km"
    }
    else{
        res = distance+ " km"
    }
    return res;
}

export const convertStringNavigatorGeocode = (currentLocation) => {
    let lat = -1;
    let lng = -1;
    if (currentLocation){
        console.log(currentLocation);
        console.log(typeof currentLocation);
        let a1 = currentLocation.indexOf("lat");
        let a2 = currentLocation.indexOf(",");
        let b1 = currentLocation.indexOf("lng");
        let b2 = currentLocation.indexOf("}");
        try {
            lat = parseFloat(currentLocation.slice(a1+5,a2));
            lng = parseFloat(currentLocation.slice(b1+5,b2));
        } catch (error) {
            lat = -1;
            lng = -1;
        }
    }
    return {lat, lng}
}