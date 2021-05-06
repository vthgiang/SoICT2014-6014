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

function TransportMapRoute(props) {
    let {currentVehicleRoute, transportPlanId, socket} = props;
    useEffect(() => {
        console.log(currentVehicleRoute, " day la route")
    }, [currentVehicleRoute])

    useEffect(() => {
        socket.io.on("current position", data => {
            console.log(data);
        })
    }, [])

    return (
        <div>

        </div>
    )
}

function mapState(state) {
    const {socket} = state
    return { allTransportPlans, currentTransportSchedule,socket }
}

const actions = {
    
}

const connectedTransportMapRoute = connect(mapState, actions)(withTranslate(TransportMapRoute));
export { connectedTransportMapRoute as TransportMapRoute };