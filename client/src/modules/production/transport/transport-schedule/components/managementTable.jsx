import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting, DeleteNotification, PaginateBar, SelectBox } from "../../../../../common-components";

import { formatDate } from "../../../../../helpers/formatDate"

import { ArrangeDialog } from "./arrangeDialog"

import { transportPlanActions } from "../../transport-plan/redux/actions";
import { transportScheduleActions } from "../redux/actions";
import {getPlanStatus } from "../../transportHelper/getTextFromValue"
import { convertDistanceToKm, convertTimeToMinutes } from "../../transportHelper/convertDistanceAndDuration"


function ManagementTable(props) {
    let {transportPlan} = props
    const [currentPlanId, setCurrentPlanId] = useState()
    useEffect(() => {
        props.getAllTransportPlans({page: 1, limit: 100});
    }, []);
    const handleShowArrangeForm = (plan) => {
        console.log(plan, " aaaa")
        setCurrentPlanId(plan._id);
        window.$('#modal-arrange-good-vehicle-ordinal-transport').modal('show');
    }
    return (
        <React.Fragment>
            <ArrangeDialog 
                currentPlanId={currentPlanId}
            />
            <table id={"tableId"} className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th className="col-fixed" style={{ width: 60 }}>{"Số thứ tự"}</th>
                            <th>{"Mã kế hoạch"}</th>
                            <th>{"Tên kế hoạch"}</th>
                            <th>{"Trạng thái"}</th>
                            <th>{"Thời gian"}</th>
                            <th>{"Người phụ trách"}</th>
                            <th>{"Hành động"}</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                    (transportPlan && transportPlan.lists && transportPlan.lists.length !== 0) &&
                    transportPlan.lists.map((x, index) => (
                            x &&
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{x.code}</td>
                                <td>{x.name}</td>
                                <td>{getPlanStatus(x.status)}</td>
                                <td>{formatDate(x.startTime)+" - "+formatDate(x.endTime)}</td>
                                <td>{""}</td>
                                <td style={{ textAlign: "center" }}>
                                    <a className="edit text-yellow" 
                                        style={{ width: '5px' }} 
                                        title={"Thông tin chi tiết kế hoạch"} 
                                        onClick={() => handleShowArrangeForm(x)}
                                    >
                                        <i className="material-icons">chrome_reader_mode
                                        </i>
                                    </a>
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
        </React.Fragment>
    )
}

function mapState(state) {
    const {transportPlan} = state;
    return { transportPlan };
}

const actions = {
    getAllTransportPlans: transportPlanActions.getAllTransportPlans,
    getTransportScheduleByPlanId: transportScheduleActions.getTransportScheduleByPlanId,
    editTransportScheduleByPlanId: transportScheduleActions.editTransportScheduleByPlanId,
}

const connectedManagementTable = connect(mapState, actions)(withTranslate(ManagementTable));
export { connectedManagementTable as ManagementTable };