import React, { Component, useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DirectionsRenderer } from '@react-google-maps/api';

function CustomDirection (props) {
    const [state, setState] = useState({
        wayPoints: null,
        currentLocation: null
    });

    var delayFactor = 0;

    useEffect(() => {
        const startLoc = props.from.latitude + ", " + props.from.longitude;
        const destinationLoc = props.to.latitude + ", " + props.to.longitude;
        getDirections(startLoc, destinationLoc);
        setCurrentLocation();
    }, []);

    const getDirections = async (startLoc, destinationLoc, wayPoints = []) => {
        const waypts = [];
        if (wayPoints.length > 0) {
        waypts.push({
            location: new window.google.maps.LatLng(
            wayPoints[0].lat,
            wayPoints[0].lng
            ),
            stopover: true
        });
        }
        const directionService = new window.google.maps.DirectionsService();
        directionService.route(
            {
                origin: startLoc,
                destination: destinationLoc,
                waypoints: waypts,
                optimizeWaypoints: true,
                travelMode: window.google.maps.TravelMode.DRIVING
            },
            (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    setState({
                        ...state,
                        directions: result,
                        wayPoints: result.routes[0].overview_path.filter((elem, index) => {
                            return index % 30 === 0;
                        })
                    });
                } else if (status === window.google.maps.DirectionsStatus.OVER_QUERY_LIMIT) {
                    delayFactor += 1;
                    setTimeout(() => {
                        getDirections(startLoc, destinationLoc, wayPoints);
                    }, delayFactor * 1000);
                } else {
                    console.error(`error fetching directions ${result}`);
                }
            }
        );
    }

    const setCurrentLocation = () => {
        let count = 0;
    };
    const { directions } = state;
    return (
        <>
            {directions && (
                <DirectionsRenderer
                    key={props.key}
                    directions={directions}
                    options={{
                        polylineOptions: {
                            strokeColor: props.strokeColor,
                            strokeOpacity: 1,
                            strokeWeight: 3,
                            icons: [{ repeat: '400px', icon: { path: window.google.maps.SymbolPath.FORWARD_OPEN_ARROW, scale: 3 } }]
                        },
                        preserveViewport: true,
                        suppressMarkers: true,
                        icon: {
                            scale: 1,
                        }
                    }}
                />
            )}
        </>
    );
}

export default connect(null, null)(withTranslate(CustomDirection))