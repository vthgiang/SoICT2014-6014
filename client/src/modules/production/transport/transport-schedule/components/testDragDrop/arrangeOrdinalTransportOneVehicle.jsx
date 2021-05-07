import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { SortableComponent } from "./sortableComponent"

import { MapContainer } from "../googleReactMap/maphook"

import { reverseConvertDistanceToKm, convertDistanceToKm, reverseConvertTimeToMinutes, convertTimeToMinutes } from "../../../transportHelper/convertDistanceAndDuration"

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
     * addressList của component con
     * sử dụng để kiểm tra đường đi hợp lệ hay ko, tổng quãng đường
     */
    const [addressList, setAddressList] = useState([]);

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

    const callBackAddressList = (addressList) => {
        setAddressList(addressList);
    }

    const handleUpdateMap = () =>{
        setActiveMapState(locationsOnMap);
    }

    const getTotalDistance = () => {
        let res = 0;
        if (addressList && addressList.length!==0){
            addressList.map(address => {
                if (address && address.distance){
                    res += convertDistanceToKm(address.distance);
                }
            })
        }
        return reverseConvertDistanceToKm(res);
    }
    const getTotalTime = () => {
        let res = 0;
        if (addressList && addressList.length!==0){
            addressList.map(address => {
                if (address && address.duration){
                    res += convertTimeToMinutes(address.duration);
                }
            })
        }
        return reverseConvertTimeToMinutes(res);    
    }
    return (		
        <fieldset className="scheduler-border" style={{ height: "100%" }}>

            <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5">
                <legend className="scheduler-border">{item.transportVehicle.name}</legend>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div className="form-group">
                        <strong>{"Trọng tải: "}</strong>{item.transportVehicle.payload}
                    </div>
                </div>                                    
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div className="form-group">
                        <strong>{"Thể tích thùng chứa: "}</strong>{item.transportVehicle.volume}
                    </div>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div className="form-group">
                        <strong>{"Tổng quãng đường di chuyển: "}</strong>{getTotalDistance()}
                    </div>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div className="form-group">
                        <strong>{"Tổng thời gian di chuyển: "}</strong>{getTotalTime()}
                    </div>
                </div>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7">
                <div className = "transport-map">
                    {
                        // (activeMapState && activeMapState.length!==0)
                        (locationsOnMap && locationsOnMap.length!==0 && locationsOnMap.length>=2)
                        &&
                        <MapContainer 
                            locations={locationsOnMap}

                            // locations={activeMapState}
                        />
                    }
                </div>
                {/* <div className="form-group">
                    <button type="button" className="btn btn-success" title="Cập nhật bản đồ" 
                        onClick={handleUpdateMap}
                    >
                        Cập nhật bản đồ
                    </button>
                </div> */}
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
                    callBackAddressList={callBackAddressList}
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
                    callBackAddressList={callBackAddressList}
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