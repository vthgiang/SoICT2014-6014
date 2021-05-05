import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { SortableComponent } from "./sortableComponent"

import { MapContainer } from "../googleReactMap/maphook"

import '../arrangeOrdinalTransport.css'

function ArrangeOrdinalTransportOneVehicle(props) {

    let {item, routeOrdinal, callBackStateOrdinalAddress} = props;
    
    /**
     * Lưu vị trí tọa độ các điểm hiện tại, chờ cập nhật bản đồ
     * [
     *  name: "index",
     *  location: {
     *      lat: 
     *      lng:
     *  }
     * ]
     */
    const [locationsOnMap, setLocationOnMap] = useState();

    const [activeMapState, setActiveMapState] = useState();

    /**
     * Sau khi sort, gửi lại component cha để update route trên map
     * @param {*} addressOrdinalList 
     */
    const callBackToSetLocationsOnMap = (addressOrdinalList) => {
        if(addressOrdinalList && addressOrdinalList.length !==0 ){
            let locationsList = [];
            addressOrdinalList.map((item, index) => {
                locationsList.push({
                    name: String(index),
                    location: {
                        lat: item.geocodeAddress.lat,
                        lng: item.geocodeAddress.lng,
                    }
                })
            })
            setLocationOnMap(locationsList);
        } 
    }

    const handleUpdateMap = () =>{
        setActiveMapState(locationsOnMap);
    }
    return (		
        <fieldset className="scheduler-border" style={{ height: "100%" }}>

            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <legend className="scheduler-border">{item.transportVehicle.name}</legend>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div className="form-group">
                        <strong>{"Trọng tải: "+item.transportVehicle.payload}</strong>
                    </div>
                </div>                                    
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div className="form-group">
                        <strong>{"Thể tích thùng chứa: "+item.transportVehicle.volume}</strong>
                    </div>
                </div>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <div className = "transport-map">
                    {
                        // (activeMapState && activeMapState.length!==0)
                        // &&
                        <MapContainer 
                            locations={locationsOnMap}

                            // locations={activeMapState}
                        />
                    }
                </div>
                <div className="form-group">
                    <button type="button" className="btn btn-success" title="Cập nhật bản đồ" 
                        onClick={handleUpdateMap}
                    >
                        Cập nhật bản đồ
                    </button>
                </div>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                {
                    routeOrdinal && routeOrdinal.length!==0
                    && 
                    <SortableComponent
                    // currentTransportSchedule = {item}
                    // transportRequirements = {item.transportRequirements}
                    transportVehicle = {item.transportVehicle}
                    routeOrdinal = {routeOrdinal}
                    callBackStateOrdinalAddress = {callBackStateOrdinalAddress}
                    callBackToSetLocationsOnMap = {callBackToSetLocationsOnMap}
                />
                }
                {
                    !(routeOrdinal && routeOrdinal.length!==0)
                    && 
                    <SortableComponent
                    // currentTransportSchedule = {item}
                    transportRequirements = {item.transportRequirements}
                    transportVehicle = {item.transportVehicle}
                    // routeOrdinal = {routeOrdinal}
                    callBackStateOrdinalAddress = {callBackStateOrdinalAddress}
                    callBackToSetLocationsOnMap = {callBackToSetLocationsOnMap}
                />
                }
                {/* <SortableComponent
                    currentTransportSchedule = {item}
                    // transportRequirements = {item.transportRequirements}
                    // transportVehicle = {item.transportVehicle}
                    routeOrdinal = {routeOrdinal}
                    callBackStateOrdinalAddress = {callBackStateOrdinalAddress}
                    callBackToSetLocationsOnMap = {callBackToSetLocationsOnMap}
                /> */}
            </div>
        </fieldset>
                       
    )
}

function mapState(state) {
}

const actions = {
}

const connectedArrangeOrdinalTransportOneVehicle = connect(mapState, actions)(withTranslate(ArrangeOrdinalTransportOneVehicle));
export { connectedArrangeOrdinalTransportOneVehicle as ArrangeOrdinalTransportOneVehicle };