import React, {useState, useEffect} from 'react';
import {
    DirectionsRenderer 
} from 'react-google-maps';
function MapDirectionsRenderer(props) {
    const [directions, setDirections] = useState(null);
    const [error, setError] = useState(null);
  
    const { places, travelMode } = props;
    useEffect(() => {
        if (places && travelMode){
            console.log(process.env.REACT_APP_SERVER, " api");
            let waypoints = []
            places.map((p, index) => {
                waypoints.push({
                    location: { lat: p?.location.lat, lng: p?.location.lng },
                    stopover: true
                })
            });
    
            const origin = waypoints.shift().location;
            const destination = waypoints.pop().location;
            const directionsService = new window.google.maps.DirectionsService();
            directionsService.route(
                {
                    origin: origin,
                    destination: destination,
                    travelMode: travelMode,
                    waypoints: waypoints
                },
                (result, status) => {
                    console.log(result, status, "123");
                    if (status === window.google.maps.DirectionsStatus.OK) {
                        console.log(result, " day la ket qua")
                        setDirections(result);
                    } else {
                        setError(result);
                    }
                }
            );
        }
    }, [places, travelMode]);
  
    if (error) {
      return <h1>{error}</h1>;
    }
    return (
      directions && (
        <DirectionsRenderer directions={directions} options={{suppressMarkers: true}}/>
      )
    );
  }

export {MapDirectionsRenderer}