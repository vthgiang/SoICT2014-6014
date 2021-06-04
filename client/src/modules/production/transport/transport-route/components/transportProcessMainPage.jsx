import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting, DeleteNotification, PaginateBar, SelectBox } from "../../../../../common-components";

import { formatDate } from "../../../../../helpers/formatDate"

import { TransportManageVehicleProcess } from "./transportManageVehicleProcess"

import { TransportManageProcess } from "./transportManageProcess"

import { transportPlanActions } from "../../transport-plan/redux/actions";

import { getPlanStatus } from "../../transportHelper/getTextFromValue"

import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';

import './timeLine.css';

function TransportProcessMainPage(props) {

    const {transportPlan} = props

    const [listPlans, setListPlans] = useState();

    const [currentTransportPlan, setCurrentTransportPlan] = useState();

    

    const handleShowDetailProcess = (plan) => {
        setCurrentTransportPlan(plan);
        // setCurrentVehicleRoute(route);
        window.$(`#modal-detail-process`).modal('show')
    }

    useEffect(() => {
        props.getAllTransportPlans({page:1, limit: 1000})
    }, [])

    useEffect(() => {
        if (transportPlan && transportPlan.lists && transportPlan.lists.length !==0){
            setListPlans(transportPlan.lists);
        }
    }, [transportPlan])


   return (
        <div className="box-body qlcv">
            <TransportManageProcess 
                currentTransportPlan={currentTransportPlan}
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
                (listPlans && listPlans.length !== 0) &&
                listPlans.map((x, index) => (
                        x &&
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{x.code}</td>
                            <td>{x.name}</td>
                            <td>{getPlanStatus(x.status)}</td>
                            <td>{formatDate(x.startTime)+" - "+formatDate(x.endTime)}</td>
                            <td>{x.supervisor? x.supervisor.name: ""}</td>
                            <td style={{ textAlign: "center" }}>
                                <a className="edit text-blue" 
                                    style={{ width: '5px' }} 
                                    title={"Thông tin chi tiết kế hoạch"} 
                                    onClick={() => handleShowDetailProcess(x)}
                                >
                                    <i className="material-icons">center_focus_strong
                                    </i>
                                </a>
                            </td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
        </div>
    )
}

function mapState(state) {
    const {transportPlan} = state;
    return { transportPlan }
}

const actions = {
    getAllTransportPlans: transportPlanActions.getAllTransportPlans,
}

const connectedTransportProcessMainPage = connect(mapState, actions)(withTranslate(TransportProcessMainPage));
export { connectedTransportProcessMainPage as TransportProcessMainPage };