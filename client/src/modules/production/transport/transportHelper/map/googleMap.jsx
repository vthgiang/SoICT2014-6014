import React from 'react';
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
    MarkerWithLabel,
} from 'react-google-maps';

const Map = withScriptjs(
  withGoogleMap(props => (
    <GoogleMap
        defaultCenter={props.defaultCenter}
        defaultZoom={props.defaultZoom}
        onClick={props.getLatLng}
    >
      {
            props.locations.map((item, index) => {
              return (
                  <Marker key={item.name} position={item.location} icon={item.icon}/>
              )
          })
      }
    </GoogleMap>
  ))
);

const MapContainer = props => {
  const {locations} = props;
  const {
    loadingElement,
    containerElement,
    mapElement,
    defaultCenter,
    defaultZoom,
    callBackLatLng,
  } = props;
  const getLatLng = (e) => {
    const {latLng} = e;
    callBackLatLng({
        lat: latLng.lat(), 
        lng: latLng.lng()
      })
      
}
  return (
    <Map
      googleMapURL={
        'https://maps.googleapis.com/maps/api/js?key=' +
        process.env.REACT_APP_API_KEY 
        +'&v=3.exp&libraries=geometry,drawing,places'
      }
      locations={locations}
    //   loadingElement={loadingElement || <div style={{height: `100%`}}/>}
      loadingElement={loadingElement || <div style={{height: `350px`}}/>}
      containerElement={containerElement || <div style={{height: "350px", width: "100%"}}/>}
    //   mapElement={mapElement || <div style={{height: `100%`}}/>}
      mapElement={mapElement || <div style={{height: `350px`}}/>}
      defaultCenter={defaultCenter || {lat: 21.078017641, lng: 105.70710958}}
      defaultZoom={defaultZoom || 11}
      getLatLng={getLatLng}
    />
  );
};
export {MapContainer};