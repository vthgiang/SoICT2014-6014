import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting,  PaginateBar, DialogModal, forceCheckOrVisible, LazyLoadComponent } from "../../../../../common-components";

import { transportPlanActions } from "../../transport-plan/redux/actions"
import { transportScheduleActions } from "../../transport-schedule/redux/actions";
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';
import { convertJsonObjectToFormData } from '../../../../../helpers/jsonObjectToFormDataObjectConverter'

import { convertStringNavigatorGeocode } from '../../transportHelper/convertDistanceAndDuration'
import { MapContainer } from "../../transportHelper/googleReactMap/mapContainer"

function TransportDetailMap(props) {
    let {currentVehicleRoute, transportPlanId, socket, getLocateOnMap, stopGetLocateOnMap, currentLocationOnMap} = props;
    const [ currentPosition, setCurrentPosition ] = useState({});
    
    const [driverLocation, setDriverLocation] = useState([])
    const [nonDirectLocations, setNonDirectLocations] = useState([])
    const [locations, setLocations] = useState([]);
    // const [timer, setTimer] =useState()
    // useEffect(() => {
    //     console.log(currentVehicleRoute, " day la route")
    // }, [currentVehicleRoute])
    useEffect(() => {
        if (currentLocationOnMap){
            console.log(currentLocationOnMap);
            console.log(typeof currentLocationOnMap);
            let {lat, lng} = convertStringNavigatorGeocode(currentLocationOnMap);
            // setDriverLocation([{
            //     name: "c",
            //     location: {
            //         lat: parseFloat(currentLocationOnMap.slice(a1+5,a2)),
            //         lng: parseFloat(currentLocationOnMap.slice(b1+5,b2))
            //     }
            // }])
            if (Number(lat)>=0 && Number(lng)>=0){
                setDriverLocation([{
                    name: "c",
                    location: {
                        lat: lat,
                        lng: lng
                    }
                }])
            }
            else {                
                setDriverLocation([])
            }
        }
    }, [currentLocationOnMap])

    useEffect(() => {
        console.log(driverLocation, " bbbbbbbbbbbb")
    }, [driverLocation])

    useEffect(() => {
        console.log(currentVehicleRoute, "ok baby")
        let nonDirect = [];
        let locationsList = [];
        if (currentVehicleRoute && currentVehicleRoute.routeOrdinal && currentVehicleRoute.routeOrdinal.length !==0 ){
            currentVehicleRoute.routeOrdinal.map((mission, index) => {
                if (Number(mission.type) === 1){
                    let address= {
                        name: String(index+1),
                        location: mission.transportRequirement?.geocode?.fromAddress
                        
                    }
                    if (mission.transportRequirement?.transportStatus?.fromAddress){
                        nonDirect.push(address)
                    }
                    else {
                        locationsList.push(address);
                    }
                }
                else {
                    let address={
                        name: String(index+1),
                        location: mission.transportRequirement?.geocode?.toAddress
                    }
                    if (mission.transportRequirement?.transportStatus?.toAddress){
                        nonDirect.push(address)
                    }
                    else {
                        locationsList.push(address);
                    }
                }
            })
        }
        setNonDirectLocations(nonDirect);
        setLocations(locationsList);
    }, [currentVehicleRoute])
    // useEffect(() => {
    //     if (getLocateOnMap){
    //         setTimer(setInterval(() => {
    //             // //     navigator.geolocation.getCurrentPosition(success);  
    //             // if (getLocateOnMap){
    //                 let date = new Date();
    //                 console.log(date.toLocaleTimeString(), "   aaaaaaaa");
    //             // }
    //             // console.log((new Date().getTime())
    //         }, 4000));
    //         // return () => clearInterval(timer);
    //     }
    //     else{
    //             clearInterval(timer)
    //     }
    // }, [getLocateOnMap])

    // const success = position => {
    //     const currentPosition = {
    //       lat: position.coords.latitude,
    //       lng: position.coords.longitude
    //     }
    //     setCurrentPosition(currentPosition);
    //   };
      
    // // navigator.geolocation.getCurrentPosition(success);  
    // // const timer = setInterval(() => {
    // //     navigator.geolocation.getCurrentPosition(success);  
    // // }, 4000);
    //   useEffect(() => {
    //     // console.log(currentPosition, " currentPosition");
    //     // console.log(localStorage.getItem("currentRole"))
    //     const currentPosition = {
    //         lat: "11",
    //         lng: "11"
    //       }
    //     // if (localStorage.getItem("currentRole")!=="607a98ace57ad61670049a40"){
    //         // props.driverSendMessage({
    //         //     data: {
    //         //         position: currentPosition,
    //         //     }
    //         // })
    //     // }
    //     socket.io.on("current position", data => {
    //         console.log(data);
    //     })
    //     socket.io.emit("ok", "alo123")
    //   }, [currentPosition])
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-detail-map`}
                title={"Bản đồ"}
                formID={`modal-detail-map`}
                size={100}
                maxWidth={500}
                hasSaveButton={false}
                hasNote={false}
                afterClose={stopGetLocateOnMap}
            >
                <form id={`modal-detail-map`}>
                    <div style={{height: "600px"}}>

                        <MapContainer
                            driverLocation={driverLocation}
                            locations={locations}
                            nonDirectLocations={nonDirectLocations}
                        />
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    )
}

function mapState(state) {
    const allTransportPlans = state.transportPlan.lists;
    const {currentTransportSchedule} = state.transportSchedule;
    const {socket} = state
    return { allTransportPlans, currentTransportSchedule,socket }
}

const actions = {
    getAllTransportPlans: transportPlanActions.getAllTransportPlans,
    getTransportScheduleByPlanId: transportScheduleActions.getTransportScheduleByPlanId,    
}

const connectedTransportDetailMap = connect(mapState, actions)(withTranslate(TransportDetailMap));
export { connectedTransportDetailMap as TransportDetailMap };