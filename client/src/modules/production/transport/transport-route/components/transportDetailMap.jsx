import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting,  PaginateBar, DialogModal, forceCheckOrVisible, LazyLoadComponent } from "../../../../../common-components";

import { transportPlanActions } from "../../transport-plan/redux/actions"
import { transportScheduleActions } from "../../transport-schedule/redux/actions";
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';
import { convertJsonObjectToFormData } from '../../../../../helpers/jsonObjectToFormDataObjectConverter'
import { MapContainer } from "../../transport-schedule/components/googleReactMap/maphook"

function TransportDetailMap(props) {
    let {currentVehicleRoute, transportPlanId, socket, getLocateOnMap, stopGetLocateOnMap, currentLocationOnMap} = props;
    const [ currentPosition, setCurrentPosition ] = useState({});
    
    const [currentMarker, setCurrentMarker] = useState([])
    // const [timer, setTimer] =useState()
    // useEffect(() => {
    //     console.log(currentVehicleRoute, " day la route")
    // }, [currentVehicleRoute])
    useEffect(() => {
        if (currentLocationOnMap){
            console.log(currentLocationOnMap);
            console.log(typeof currentLocationOnMap);
            let a1 = currentLocationOnMap.indexOf("lat");
            let a2 = currentLocationOnMap.indexOf(",");
            let b1 = currentLocationOnMap.indexOf("lng");
            let b2 = currentLocationOnMap.indexOf("}");
            console.log(currentLocationOnMap.slice(a1+5,a2));
            console.log(currentLocationOnMap.slice(b1+5,b2));
            // console.log(location)
            setCurrentMarker([{
                name: "c",
                location: {
                    lat: parseInt(currentLocationOnMap.slice(a1+5,a2)),
                    lng: parseInt(currentLocationOnMap.slice(b1+5,b2))
                }
            }])
        }
    }, [currentLocationOnMap])
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
                    <MapContainer
                        locations={currentMarker}
                    />
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