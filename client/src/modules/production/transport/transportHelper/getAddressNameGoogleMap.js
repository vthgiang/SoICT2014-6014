import axios from 'axios'
const api_key = 'YPYc8LFkPoxTwpowJZgnWDx0qynIK0hGED0xTp39'

export async function getAddressName(lat, lng) {
  // const url =  "https://maps.googleapis.com/maps/api/geocode/json?"
  //               +"address="+lat+","+lng
  //               +"&key="+process.env.REACT_APP_API_KEY
  const url = 'https://rsapi.goong.io/Geocode/?' + 'latlng=' + lat + ',' + lng + '&api_key=' + api_key

  console.log(url)
  try {
    const response = await axios.get(url)
    if (response.data) {
      if (response.data.status === 'OK') {
        if (response.data.results && response.data.results.length !== 0) {
          if (response.data.results[0].formatted_address) {
            return String(response.data.results[0].formatted_address)
          }
        }
      }
    }
    return 'Không có tên địa chỉ'
  } catch (error) {
    return 'Không có tên địa chỉ'
  }
}
