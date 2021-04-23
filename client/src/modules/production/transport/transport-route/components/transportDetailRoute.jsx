import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting,  PaginateBar, DialogModal, forceCheckOrVisible, LazyLoadComponent } from "../../../../../common-components";

import { formatDate } from "../../../../../helpers/formatDate"

import { TransportManageVehicleProcess } from "./transportManageVehicleProcess"
import { TransportDetailRouteListMission } from './transportDetailRouteListMission'

import { transportPlanActions } from "../../transport-plan/redux/actions"
import { transportScheduleActions } from "../../transport-schedule/redux/actions";
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';
import { convertJsonObjectToFormData } from '../../../../../helpers/jsonObjectToFormDataObjectConverter'

import './timeLine.css';

function TransportDetailRoute(props) {
    let {currentVehicleRoute, transportPlanId, socket} = props;
    const [ currentPosition, setCurrentPosition ] = useState({});
    useEffect(() => {
        console.log(currentVehicleRoute, " day la route")
    }, [currentVehicleRoute])
    const success = position => {
        const currentPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        setCurrentPosition(currentPosition);
      };
      
    // navigator.geolocation.getCurrentPosition(success);  
    // const timer = setInterval(() => {
    //     navigator.geolocation.getCurrentPosition(success);  
    // }, 4000);
      useEffect(() => {
        // console.log(currentPosition, " currentPosition");
        // console.log(localStorage.getItem("currentRole"))
        const currentPosition = {
            lat: "11",
            lng: "11"
          }
        // if (localStorage.getItem("currentRole")!=="607a98ace57ad61670049a40"){
            // props.driverSendMessage({
            //     data: {
            //         position: currentPosition,
            //     }
            // })
        // }
        socket.io.on("current position", data => {
            console.log(data);
        })
        socket.io.emit("ok", "alo123")
      }, [currentPosition])
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-detail-route`}
                title={"hanhf trinh xe"}
                formID={`modal-detail-route`}
                size={100}
                maxWidth={500}
                hasSaveButton={false}
                hasNote={false}
            >
                <form id={`modal-detail-route`}>
                <div className="nav-tabs-custom">
                    <ul className="nav nav-tabs">
                        <li className="active"><a href="#list-route-mission" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>{"Nhiệm vụ vận chuyển"}</a></li>
                        <li><a href="#list-route-map" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>{"Bản đồ"}</a></li>
                    </ul>
                    <div className="tab-content">
                        <div className="tab-pane active" id="list-route-mission">
                            <TransportDetailRouteListMission
                                currentVehicleRoute = {currentVehicleRoute}
                                transportPlanId = {transportPlanId}
                            />
                        </div>
                        <div className="tab-pane" id="list-route-map">
                        </div>
                    </div>
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

const connectedTransportDetailRoute = connect(mapState, actions)(withTranslate(TransportDetailRoute));
export { connectedTransportDetailRoute as TransportDetailRoute };