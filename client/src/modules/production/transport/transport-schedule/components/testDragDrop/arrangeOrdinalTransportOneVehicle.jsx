import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { SortableComponent } from "./sortableComponent"

// import { MapContainer } from "../googleReactMap/maphook"
import { MapContainer } from "../../../transportHelper/googleReactMap/mapContainer"

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

    const [payloadVolumeStatus, setPayloadVolumeStatus] = useState({
        maxPayload: 0,
        maxVolume: 0,
        posMaxPayload: 0,
        posMaxVolume: 0,
    })

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

    useEffect(() => {
        let res = {
            maxPayload: 0,
            maxVolume: 0,
            posMaxPayload: 0,
            posMaxVolume: 0,
            status: 1, // 1 hợp lý, 2 không hợp lý do trọng tải hoặc thể tích không đáp ứng được
        }
        let payload=0, volume=0;
        if (addressList && addressList.length!==0){
            addressList.map((address, index) => {
                if (address.payload && address.volume){
                    if (Number(address.addressType) === 1){
                        payload+=address.payload;
                        volume+=address.volume;
                    }
                    else {
                        payload-=address.payload;
                        volume-=address.volume;
                    }
                    if (payload>res.maxPayload){
                        res.maxPayload = payload;
                        res.posMaxPayload = index+1;
                    }
                    if (volume>res.maxVolume){
                       res.maxVolume = volume;
                       res.posMaxVolume = index + 1;
                    }
                }
                
            })
        }
        if (res.maxPayload > item.transportVehicle?.payload || res.maxVolume > item.transportVehicle?.volume){
            res.status = 0;
        }
        setPayloadVolumeStatus(res);
    }, [addressList]) 

    return (		
        // <fieldset className="scheduler-border" style={{ height: "100%" }}>
            <div className="box box-solid">
                {/* <div className="box-header"> */}
                    {/* <div className="box-title">{item.transportVehicle?.name +" - " +item.transportVehicle?.code}</div> */}
                {/* </div> */}

                <div className="box-body qlcv">

            <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5" style={{padding: "0px"}}>
                <legend className="scheduler-border">{item.transportVehicle.code}</legend>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div className="form-group">
                        <strong>{"Tên xe: "}</strong>{item.transportVehicle.name}
                    </div>
                </div> 
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
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div className="form-group">
                        <strong>{"Trọng lượng hàng hóa lớn nhất đạt: "}</strong>{payloadVolumeStatus.maxPayload + "- tại địa điểm "+ payloadVolumeStatus.posMaxPayload }
                    </div>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div className="form-group">
                        <strong>{"Thể tích hàng hóa lớn nhất đạt: "}</strong>{payloadVolumeStatus.maxVolume + "- tại địa điểm "+ payloadVolumeStatus.posMaxVolume }
                    </div>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div className="form-group">
                        <strong>{payloadVolumeStatus.status === 1? "Có thể sử dụng lộ trình này": "Lộ trình không hợp lý cần sắp xếp lại"}</strong>
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

                            loadingElement={<div style={{height: `100%`}}/>}
                            containerElement={<div style={{height: "50vh"}}/>}
                            mapElement={<div style={{height: `100%`}}/>}
                            defaultZoom={11}
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
        {/* </fieldset> */}
        </div>
        </div>
                       
    )
}

function mapState(state) {
    return {};
}

const actions = {
}

const connectedArrangeOrdinalTransportOneVehicle = connect(mapState, actions)(withTranslate(ArrangeOrdinalTransportOneVehicle));
export { connectedArrangeOrdinalTransportOneVehicle as ArrangeOrdinalTransportOneVehicle };