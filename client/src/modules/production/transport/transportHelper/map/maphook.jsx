import React, { useState, useEffect } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
function MapContainer(props) {
  // let locationsa = [
  //     {
  //         name: "Location 1",
  //         location: {
  //             lat: 21.004748911,
  //             lng: 105.84537907
  //         }
  //     }
  // ]
  let { locations, callBackLatLng } = props
  const mapStyles = {
    height: '350px',
    width: '100%',
    margin: '10px'
  }

  // const defaultCenter = {
  //   lat: 21.078017641, lng: 105.70710958
  // }
  const [defaultCenter, setDefaultCenter] = useState({
    lat: 21.078017641,
    lng: 105.70710958
  })
  useEffect(() => {
    console.log(locations, '213')
    if (locations) {
      if (locations[0]) {
        if (locations[0].lat && locations[0].lng) {
          setDefaultCenter({
            lat: locations[0].lat,
            lng: locations[0].lng
          })
        }
      }
    }
  }, [locations])
  const getLatLng = (e) => {
    const { latLng } = e
    callBackLatLng({
      lat: latLng.lat(),
      lng: latLng.lng()
    })
  }
  return (
    <LoadScript
      // googleMapsApiKey='AIzaSyCkVQAqCoJU79mTctNsNmQLy9ME7qiTlfs'
      googleMapsApiKey={process.env.REACT_APP_API_KEY}
    >
      <GoogleMap mapContainerStyle={mapStyles} zoom={10} center={defaultCenter} onClick={getLatLng}>
        {locations &&
          locations.length !== 0 &&
          locations.map((item) => {
            return <Marker key={item.name} position={item.location} icon={item.icon} />
          })}
      </GoogleMap>
    </LoadScript>
  )
}
export { MapContainer }
