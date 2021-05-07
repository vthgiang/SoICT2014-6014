import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting, DeleteNotification, PaginateBar } from "../../../../../../common-components";

import { MapContainer } from "../../../transportHelper/map/googleMap"

import { getAddressName } from "../../../transportHelper/getAddressNameGoogleMap"

import { getTableConfiguration } from '../../../../../../helpers/tableConfiguration';

function PlanTransportRequirement(props) {
    let {curentTransportRequirementDetail, callBackLocate, requirementsForm} = props

    


    useEffect(() => {
        effect
        return () => {
            cleanup
        }
    }, [curentTransportRequirementDetail])

    return (
        <React.Fragment>
            <div className="box-body qlcv">
                
            </div>
        </React.Fragment>
    )
}

function mapState(state) {
}

const actions = {
}

const connectedPlanTransportRequirement = connect(mapState, actions)(withTranslate(PlanTransportRequirement));
export { connectedPlanTransportRequirement as PlanTransportRequirement };