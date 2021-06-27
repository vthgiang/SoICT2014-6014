import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting, DeleteNotification, PaginateBar } from "../../../../../../common-components";

// import { MapContainer } from "../../../transportHelper/map/googleMap"
import { MapContainer } from "../../../transportHelper/mapbox/map"

import { getAddressName } from "../../../transportHelper/getAddressNameGoogleMap"

import { getTableConfiguration } from '../../../../../../helpers/tableConfiguration';

function LocateTransportRequirement(props) {
    let {curentTransportRequirementDetail , callBackLocate} = props

    /**
     * location = {
     *  fromAddress: ...,
     *  fromLat: ,
     *  fromLng: , 
     *  toAddress: ...,
     *  toLat: ,
     *  toLng: ,
     * }
     */
    const [location, setLocation] = useState();

    const handleCustomer1AddressChange = (e) => {
        setLocation({
            ...location,
            fromAddress: e.target.value,
        })
    }

    const handleCustomer2AddressChange = (e) => {
        setLocation({
            ...location,
            toAddress: e.target.value,
        })
    }

    const handleCustomer1LatChange = (e) => {
        setLocation({
            ...location,
            fromLat: e.target.value,
        })
    }

    const handleCustomer1LngChange = (e) => {
        setLocation({
            ...location,
            fromLng: e.target.value,
        })
    }

    const handleCustomer2LatChange = (e) => {
        setLocation({
            ...location,
            toLat: e.target.value,
        })
    }

    const handleCustomer2LngChange = (e) => {
        setLocation({
            ...location,
            toLng: e.target.value,
        })
    }

    const callBackLatLng1 = async(latlng) => {
        const newAddress = await getAddressName(latlng.lat,latlng.lng)
        setLocation({
            ...location,
            fromAddress: newAddress,
            fromLat: latlng.lat,
            fromLng: latlng.lng
        })
    }

    const callBackLatLng2 = async(latlng) => {
        const newAddress = await getAddressName(latlng.lat,latlng.lng)
        setLocation({
            ...location,
            toAddress: newAddress,
            toLat: latlng.lat,
            toLng: latlng.lng
        })
    }    
    useEffect(() => {
        if (curentTransportRequirementDetail){
            setLocation({
                fromAddress: curentTransportRequirementDetail?.fromAddress,
                fromLat: curentTransportRequirementDetail?.geocode?.fromAddress?.lat,
                fromLng: curentTransportRequirementDetail?.geocode?.fromAddress?.lng,
                toAddress: curentTransportRequirementDetail?.toAddress,
                toLat: curentTransportRequirementDetail?.geocode?.toAddress?.lat,
                toLng: curentTransportRequirementDetail?.geocode?.toAddress?.lng,
            })
        }
    }, [curentTransportRequirementDetail])

    useEffect(() => {
        callBackLocate(location)
    }, [location])

    return (
        <React.Fragment>
            <div className="box-body qlcv">
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6" style={{ padding: 0 }}>
                    <fieldset className="scheduler-border" style={{ height: "100%" }}>
                        <legend className="scheduler-border">Vị trí giao hàng</legend>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className={`form-group`}>
                                    <label>
                                        Địa chỉ khách hàng
                                        <span className="attention"> * </span>
                                    </label>
                                    <textarea type="text" className="form-control" 
                                        value={location?.fromAddress}
                                        onChange={handleCustomer1AddressChange}
                                    />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                    <div className={`form-group`}>
                                        <label>
                                            Tọa độ
                                            {/* <span className="attention"> * </span> */}
                                        </label>
                                        <input type="text" className="form-control" disabled={true}
                                            value={location?.fromLat + ", " +location?.fromLng} 
                                            // onChange={handleCustomer1LatChange}
                                        />
                                    </div>
                                </div>
                            
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <MapContainer
                                    locations = {[
                                        {
                                            name: "S",
                                            location: {
                                                lat: location?.fromLat,
                                                lng: location?.fromLng
                                            }
                                        }
                                    ]}
                                    callBackLatLng={callBackLatLng1}
                                />
                            </div>
                    </fieldset>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6" style={{ padding: 0 }}>
                    <fieldset className="scheduler-border" style={{ height: "100%" }}>
                        <legend className="scheduler-border">Vị trí nhận hàng</legend>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className={`form-group`}>
                                    <label>
                                        Địa chỉ khách hàng
                                        <span className="attention"> * </span>
                                    </label>
                                    <textarea type="text" className="form-control" 
                                        value={location?.toAddress}
                                        onChange={handleCustomer2AddressChange}
                                    />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className={`form-group`}>
                                    <label>
                                        Tọa độ
                                    </label>
                                    <input type="text" className="form-control" disabled={true}
                                        value={location?.toLat+", "+location?.toLng} 
                                    />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <MapContainer
                                    locations = {[
                                        {
                                            name: "D",
                                            location: {
                                                lat: location?.toLat,
                                                lng: location?.toLng
                                            }
                                        }
                                    ]}
                                    callBackLatLng={callBackLatLng2}
                                />
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>
        </React.Fragment>
    )
}

function mapState(state) {
    return {}
}

const actions = {
}

const connectedLocateTransportRequirement = connect(mapState, actions)(withTranslate(LocateTransportRequirement));
export { connectedLocateTransportRequirement as LocateTransportRequirement };