import React, { useEffect, useState } from 'react'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps'

const Map = withScriptjs(
  withGoogleMap((props) => (
    <GoogleMap defaultCenter={props.defaultCenter} defaultZoom={props.defaultZoom}>
      {props.locations &&
        props.locations.length !== 0 &&
        props.locations.map((item, index) => {
          return <Marker key={item.name + index} position={item.location} icon={item.icon} label={item.name} />
        })}
    </GoogleMap>
  ))
)

const LocationMap = (props) => {
  const { locations } = props
  const { loadingElement, containerElement, mapElement, defaultCenter, defaultZoom } = props
  useEffect(() => {
    console.log(locations, ' locations')
  }, [locations])
  return (
    <Map
      googleMapURL={
        'https://maps.googleapis.com/maps/api/js?key=' + process.env.REACT_APP_API_KEY + '&v=3.exp&libraries=geometry,drawing,places'
      }
      locations={locations}
      //   loadingElement={loadingElement || <div style={{height: `100%`}}/>}
      loadingElement={loadingElement || <div style={{ height: `300px` }} />}
      containerElement={containerElement || <div style={{ height: '50vh' }} />}
      // containerElement={containerElement || <div style={{height: "30vh"}}/>}
      //   mapElement={mapElement || <div style={{height: `100%`}}/>}
      mapElement={mapElement || <div style={{ height: `300px` }} />}
      defaultCenter={defaultCenter || { lat: 21.078017641, lng: 105.70710958 }}
      defaultZoom={defaultZoom || 9}
    />
  )
}
export { LocationMap }
