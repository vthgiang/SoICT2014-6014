import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting, DeleteNotification, PaginateBar, SelectBox, DialogModal } from "../../../../../common-components";

import { formatDate } from "../../../../../helpers/formatDate"

import { TransportManageVehicleProcess } from "./transportManageVehicleProcess"
import { TransportDetailRouteListMission } from './transportDetailRouteListMission'

import { transportPlanActions } from "../../transport-plan/redux/actions"
import { transportScheduleActions } from "../../transport-schedule/redux/actions";
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';
import { convertJsonObjectToFormData } from '../../../../../helpers/jsonObjectToFormDataObjectConverter'

import './timeLine.css';

function TransportDetailRoute(props) {
    let {currentVehicleRoute, transportPlanId} = props;
    useEffect(() => {
        console.log(currentVehicleRoute)
        let width = document.getElementById('modal-detail-route').clientHeight;
    }, [currentVehicleRoute])
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
                    <TransportDetailRouteListMission
                        currentVehicleRoute = {currentVehicleRoute}
                        transportPlanId = {transportPlanId}
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

const connectedTransportDetailRoute = connect(mapState, actions)(withTranslate(TransportDetailRoute));
export { connectedTransportDetailRoute as TransportDetailRoute };