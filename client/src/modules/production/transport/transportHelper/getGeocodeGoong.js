import axios from 'axios';
const api_key = "YPYc8LFkPoxTwpowJZgnWDx0qynIK0hGED0xTp39";

export async function getGeocode(address){
	let lat=-1;
	let lng=-1;
	const url =  "https://rsapi.goong.io/Geocode?api_key="+api_key+"&address='"+address+"'";
	console.log(url, "rysadasd");
    const response = await axios.get(url)
    
    if(response.data){
      if (response.data.status === "OK"){
        if (response.data.results){
          if (response.data.results[0].geometry){
            if (response.data.results[0].geometry.location){
              lat = response.data.results[0].geometry.location.lat;
              lng = response.data.results[0].geometry.location.lng;
            }
          }
        }
      }
    };
	return {lat, lng};
}