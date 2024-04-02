import React, { Component, useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { getIconURL } from '../../utilities';
import { Marker, InfoWindow } from '@react-google-maps/api';

function VehicleMarker (props) {
    const [state, setState] = useState({
        id: props.vehicle.id,
        lat: props.vehicle.lat,
        lng: props.vehicle.lng,
        infoWindow: props.vehicle.infoWindow,
    });

    const hideMarkerInfo = () => {
    }

    const image = {
        url: require('../custom-map/image/truck-shipper.png'),
    }
    return (
        <>
            <Marker
                key={state.id}
                icon={image}
                position={{
                    lat: parseFloat(state.lat),
                    lng: parseFloat(state.lng),
                }}
            >

            </Marker>
        </>
    );
}

export default connect(null, null)(withTranslate(VehicleMarker))