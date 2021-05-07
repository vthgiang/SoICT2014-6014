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

const reverseConvertTimeToMinutes = (timeToMinutes) => {
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
    if (!distance || String(distance) === "0") return "0";
    return distance+ " km";
}
