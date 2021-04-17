import axios from 'axios';
const api_key = "YPYc8LFkPoxTwpowJZgnWDx0qynIK0hGED0xTp39";

export async function getDistanceAndTime(origin, destination){
	let latOrigin = origin.lat ? origin.lat : -1;
	let lngOrigin = origin.lng ? origin.lng : -1;
    let latDestination = destination.lat ? destination.lat : -1;
	let lngDestination = destination.lng ? destination.lng : -1;
    let distance = "0";
    let duration = "0";
	const url =  "https://rsapi.goong.io/DistanceMatrix?"
                + "api_key=" + api_key
                + "&origins=" + latOrigin +"," + lngOrigin
                + "&destinations=" + latDestination + "," + lngDestination;
	console.log(url, " distance");
    const response = await axios.get(url)
    
    if(response.data){
        if (response.data.rows && response.data.rows.length !== 0 ){
            if (response.data.rows[0].elements){
                if (response.data.rows[0].elements[0].duration){
                    if (response.data.rows[0].elements[0].duration.text){
                        duration = response.data.rows[0].elements[0].duration.text;
                    }
                }
                if (response.data.rows[0].elements[0].duration){
                    if (response.data.rows[0].elements[0].distance.text){
                        distance = response.data.rows[0].elements[0].distance.text;
                    }
                }
            }
        }
    };
	return {distance, duration};
}