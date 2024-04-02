import React, { Component, useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { getIconURL } from '../../utilities';
import { Marker, InfoWindow } from '@react-google-maps/api';

function DepotMarker (props) {
    const [state, setState] = useState({
        id: props.marker.id,
        code: props.marker.code,
        lat: props.marker.lat,
        lng: props.marker.lng,
        infoWindow: props.marker.infoWindow,
        color: props.marker.color,
        icon: getIconURL("DEPOT"),
    });

    const hideMarkerInfo = () => {
        let marker = props.marker;
        marker.isShowInfo = false;
        props.setShow(marker);
    }

    const image = {
        url: require('../custom-map/image/warehouse.png'),
    }
    return (
        <>
            <Marker
                key={state.id}
                icon={image}
                label={{
                    color: state.color,
                    text: state.code,
                }}
                position={{
                    lat: parseFloat(state.lat),
                    lng: parseFloat(state.lng),
                }}
            >
                {props.marker.isShowInfo === true && props.marker.infoWindow &&
                    <InfoWindow onCloseClick={() => hideMarkerInfo()}>
                        {props.marker.infoWindow &&
                            <div>
                                <div>
                                    <p><b>{"Thời điểm đến: "}</b>{props.marker.infoWindow.startTime}</p>
                                </div>
                                <div>
                                    <p><b>{"Thời điểm dời: "}</b>{props.marker.infoWindow.endTime}</p>
                                </div>
                                {
                                    props.marker.infoWindow.depotCode &&
                                    <div>
                                        <p><b>{"Mã kho hàng: "}</b>{props.marker.infoWindow.depotCode}</p>
                                    </div>
                                }
                                {
                                    props.marker.infoWindow.fillRateCapacity &&
                                    <div>
                                        <p><b>{"Tỷ lệ lấp đầy thể tích: "}</b>{props.marker.infoWindow.fillRateCapacity + " %"}</p>
                                    </div>
                                }
                                {
                                    props.marker.infoWindow.fillRateLoadWeight &&
                                    <div>
                                        <p><b>{"Tỷ lệ lấp đầy khối lượng: "}</b>{props.marker.infoWindow.fillRateLoadWeight + " %"}</p>
                                    </div>
                                }
                            </div>
                        }
                    </InfoWindow>
                }
            </Marker>
        </>
    );
}

export default connect(null, null)(withTranslate(DepotMarker))