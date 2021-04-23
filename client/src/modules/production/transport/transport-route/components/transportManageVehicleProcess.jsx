import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting, DeleteNotification, PaginateBar, SelectBox } from "../../../../../common-components";

import { formatDate } from "../../../../../helpers/formatDate"

import { transportPlanActions } from "../../transport-plan/redux/actions"
import { transportScheduleActions } from "../../transport-schedule/redux/actions";
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';
import { convertJsonObjectToFormData } from '../../../../../helpers/jsonObjectToFormDataObjectConverter'

// import './timeLine.css';

function TransportManageVehicleProcess(props) {

    const {allTransportPlans, currentTransportSchedule} = props

    const [ currentPosition, setCurrentPosition ] = useState({});

    const [currentTransportPlan, setCurrentTransportPlan] = useState({
        _id: "0",
        code: "",
    });
    useEffect(() => {
        if (props.socket){
            console.log("okkkk")
            props.socket.io.emit("hihi", {data: "123456"});
        }
    })
    // useEffect(() => {
    //     if (props.socket){
    //         props.socket.io.on("hihi", data => {
    //             console.log(data);
    //         });
    //     }
    // }, [])
    const getListTransportPlans = () => {
        let listTransportPlans = [
            {
                value: "0",
                text: "Lịch trình",
            },
        ];        
        if (allTransportPlans) {
            allTransportPlans.map((item) => {
                listTransportPlans.push({
                    value: item._id,
                    text: item.code,
                });
            });
        }
        return listTransportPlans;
    }

    const handleTransportPlanChange = (value) => {
        if (value[0] !== "0" && allTransportPlans){
            let filterPlan = allTransportPlans.filter((r) => r._id === value[0]);
            if (filterPlan.length > 0){
                setCurrentTransportPlan(filterPlan[0]);
            }
        }
        else{
            setCurrentTransportPlan({_id: value[0], code: ""});
        }
    }

    useEffect(() => {
        props.getAllTransportPlans({page:1, limit: 100})
    }, [])

    useEffect(() => {
        props.getTransportScheduleByPlanId(currentTransportPlan._id);
        if (props.socket){
            props.socket.io.emit("hihi", "nguyen dang trung kien");
        }
    }, [currentTransportPlan])

    useEffect(() => {
        console.log(currentTransportSchedule, " allll")
    }, [currentTransportSchedule])

    const success = position => {
        const currentPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        setCurrentPosition(currentPosition);
      };
      
      useEffect(() => {
        // navigator.geolocation.getCurrentPosition(success);  
        // const timer = setTimeout(() => {
        //     navigator.geolocation.getCurrentPosition(success);  
        // }, 5000);
        // return () => clearTimeout(timer);
        })
      useEffect(() => {
        console.log(currentPosition, " currentPosition");
      }, [currentPosition])
   return (
        <div className="timeline">
            <div className="timeline-progress" style={{ width: `10%` }}></div>
            <div className="timeline-items">
                {
                    (item.routeOrdinal && item.routeOrdinal.length !== 0)
                    && item.routeOrdinal.map((item2, index2) => (
                        <div key={item + "-"+ index2} 
                            // className={`timeline-item ${o.active ? 'active' : ''}`}
                            className={`timeline-item`}
                        >
                            <div className="timeline-contain">{"1"}</div>
                        </div>
                    ))
                }
                {/* <div key={"1"} className={`timeline-item active`} >
                    <div className="timeline-contain">{"123131323"}</div>
                </div>
                <div key={"2"} className={`timeline-item`} >
                    <div className="timeline-contain" 
                    // onClick={(e) => this.setCurrentStep(e, index)}
                    >{"123131323"}</div>
                    
                </div> */}
            </div>
        </div>               
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

const connectedTransportManageVehicleProcess = connect(mapState, actions)(withTranslate(TransportManageVehicleProcess));
export { connectedTransportManageVehicleProcess as TransportManageVehicleProcess };