import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
function MapContainer(props){
  let locationsa = [
      {
          name: "Location 1",
          location: {
              lat: 21.004748911,
              lng: 105.84537907
          }
      }
  ]
  const mapStyles = {        
    height: "100vh",
    width: "100%"};
  
  const defaultCenter = {
    lat: 21.078017641, lng: 105.70710958
  }
  
  return (
     <LoadScript
       googleMapsApiKey='AIzaSyCkVQAqCoJU79mTctNsNmQLy9ME7qiTlfs'>
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={13}
          center={defaultCenter}
          >
          {
              locationsa.map(item => {
                  return (
                      <Marker key={item.name} position={item.location}/>
                  )
              })
          }
          </GoogleMap>
     </LoadScript>
  )
}
export {MapContainer};