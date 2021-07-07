import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { ButtonModal, DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../../../helpers/validationHelper';

import { MapContainer } from '../../../transportHelper/mapbox/map'
import { getGeocode } from '../../../transportHelper/getGeocodeGoong'
import { getAddressName } from "../../../transportHelper/getAddressNameGoogleMap"

function TransportNewOne(props) {

    const { callBackGeneralInfo, curentTransportRequirementDetail} = props;

    const [inputValue, setInputValue] = useState({
        customer1AddressTransport: "",
    })
    // { center: {lat, lng}}
    const [flyToCenter1, setFlyToCenter1] = useState()
    const [flyToCenter2, setFlyToCenter2] = useState()

    const [formInfo1, setFormInfo1] = useState({
        customer1AddressTransport: "",
        newOneDetail1: "",
        fromLat: undefined,
        fromLng: undefined,
        isReload1: true,
    })

    const [formInfo2, setFormInfo2] = useState({
        customer2AddressTransport: "",
        newOneDetail2: "",
        toLat: undefined,
        toLng: undefined,
        isReload2: true
    })

    // time out thoi gian go, het time out goi api lay toa do
    const [timeOut1, setTimeOut1] = useState();
    const handleCustomer1AddressTransportChange = (e) => {
        setInputValue({
            ...inputValue,
            customer1AddressTransport: e.target.value,
        })
        if (timeOut1){
            clearTimeout(timeOut1);
        };
        let text = e.target.value;
        let timeOut = setTimeout(() => { 
            setFormInfo1({
                ...formInfo1,
                customer1AddressTransport: text,
                isReload1: true,
            })   
        }, 4000);
        setTimeOut1(timeOut);
    }

    const callBackLatLng1 = async(latlng) => {
        const newAddress = await getAddressName(latlng.lat,latlng.lng)
        setFlyToCenter1(null);
        setFormInfo1({
            ...formInfo1,
            customer1AddressTransport: newAddress,
            fromLat: latlng.lat,
            fromLng: latlng.lng,
            isReload1: false,
        });
        setInputValue({
            ...inputValue,
            customer1AddressTransport: newAddress,
        })
    }
    const handlecustomer1DetailChange = (e) => {
        setFormInfo1({
            ...formInfo1,
            newOneDetail1: e.target.value,
        })
    }

    
    const [timeOut2, setTimeOut2] = useState();
    const handleCustomer2AddressTransportChange = (e) => {
        setInputValue({
            ...inputValue,
            customer2AddressTransport: e.target.value,
        })
        if (timeOut2){
            clearTimeout(timeOut2);
        };
        let text = e.target.value;
        let timeOut = setTimeout(() => { 
            setFormInfo2({
                ...formInfo2,
                customer2AddressTransport: text,
                isReload2: true,
            })   
        }, 4000);
        setTimeOut2(timeOut);
    }
    
    const callBackLatLng2 = async(latlng) => {
        const newAddress = await getAddressName(latlng.lat,latlng.lng)
        setFlyToCenter2(null);
        console.log(newAddress);
        setFormInfo2({
            ...formInfo2,
            customer2AddressTransport: newAddress,
            toLat: latlng.lat,
            toLng: latlng.lng,
            isReload2: false,
        });
        setInputValue({
            ...inputValue,
            customer2AddressTransport: newAddress,
        })
    }

    const handlecustomer2DetailChange = (e) => {
        setFormInfo2({
            ...formInfo2,
            newOneDetail2: e.target.value,
        })
    }
    
    // useEffect(() => {
    //     if (curentTransportRequirementDetail){
    //         setFormInfo({
    //             ...formInfo,
    //             customer1AddressTransport: curentTransportRequirementDetail.fromAddress,
    //             customer2AddressTransport: curentTransportRequirementDetail.toAddress,
    //         })
    //     }
    // }, [curentTransportRequirementDetail])

    useEffect(() => {
        callBackGeneralInfo({...formInfo1, ...formInfo2});
    }, [formInfo1, formInfo2])

    useEffect(() => {
        if (formInfo1.customer1AddressTransport && formInfo1.isReload1){
            getGeocode(formInfo1.customer1AddressTransport).then(
                (value) => {
                    // if (value.lat !== -1 && value.lng !== -1){
                        setFormInfo1({
                            ...formInfo1,
                            fromLat: value.lat,
                            fromLng: value.lng
                        });
                        
                        setFlyToCenter1({
                            center: {
                                lat: value.lat,
                                lng: value.lng,
                            }
                        })
                    // }

                }
            );      
            // console.log("okjasdasdasd")              
        }
    }, [formInfo1.customer1AddressTransport])

    useEffect(() => {
        if (formInfo2.customer2AddressTransport && formInfo2.isReload2){
            getGeocode(formInfo2.customer2AddressTransport).then(
                (value) => {
                    // if (value.lat !== -1 && value.lng !== -1){
                        setFormInfo2({
                            ...formInfo2,
                            toLat: value.lat,
                            toLng: value.lng
                        });
                        
                        setFlyToCenter2({
                            center: {
                                lat: value.lat,
                                lng: value.lng,
                            }
                        })
                    // }

                }
            );             
        }
    }, [formInfo2.customer2AddressTransport])

    return (
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6" style={{ paddingLeft: 0}}>
                <fieldset className="scheduler-border" style={{ height: "100%" }}>
                    <legend className="scheduler-border">Thông tin giao hàng</legend>                    
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className={`form-group`}>
                            <label>
                                Chi tiết
                            </label>
                            <textarea type="text" className="form-control"
                                value={formInfo1.newOneDetail1}
                                onChange={handlecustomer1DetailChange}
                            />
                        </div>
                    </div>   

                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className={`form-group`}>
                            <label>
                                Địa chỉ giao hàng
                                <span className="attention"> * </span>
                            </label>
                            <textarea type="text" className="form-control"
                                value={inputValue.customer1AddressTransport}
                                onChange={handleCustomer1AddressTransportChange}
                            />
                        </div>
                    </div>  

                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <MapContainer
                            locations = {[
                                {
                                    name: "S",
                                    location: {
                                        lat: formInfo1?.fromLat,
                                        lng: formInfo1?.fromLng
                                    }
                                }
                            ]}
                            callBackLatLng={callBackLatLng1}
                            mapHeight={"300px"}
                            indexComponent={"mapFromAddress"}
                            flyToCenter={flyToCenter1}
                        /> 
                    </div>                   
                </fieldset>
                
            </div>

            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6" style={{ paddingRight: 0}}>
                <fieldset className="scheduler-border" style={{ height: "100%" }}>

                    <legend className="scheduler-border">Thông tin nhận hàng</legend>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className={`form-group`}>
                            <label>
                                Chi tiết
                            </label>
                            <textarea type="text" className="form-control"
                                value={formInfo2.newOneDetail2}
                                onChange={handlecustomer2DetailChange}
                            />
                        </div>
                    </div>

                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className={`form-group`}>
                            <label>
                                Địa chỉ nhận hàng
                                <span className="attention"> * </span>
                            </label>
                            <textarea type="text" className="form-control"
                                value={inputValue.customer2AddressTransport}
                                onChange={handleCustomer2AddressTransportChange}
                            />
                        </div>
                    </div> 
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <MapContainer
                            locations = {[
                                {
                                    name: "D",                                    
                                    location: {
                                        lat: formInfo2?.toLat,
                                        lng: formInfo2?.toLng
                                    }
                                }
                            ]}
                            callBackLatLng={callBackLatLng2}
                            mapHeight={"300px"}
                            indexComponent={"mapToAddress"}
                            flyToCenter={flyToCenter2}
                        /> 
                    </div>

                </fieldset>

            </div>

        </div>
    );
}

function mapState(state) {
    return {}
}

const actions = {
    // createExample: exampleActions.createExample,
    // getExamples: exampleActions.getExamples,
}

const connectedTransportNewOne = connect(mapState, actions)(withTranslate(TransportNewOne));
export { connectedTransportNewOne as TransportNewOne };