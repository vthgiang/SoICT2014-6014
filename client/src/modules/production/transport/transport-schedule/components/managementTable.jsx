import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting, DeleteNotification, PaginateBar, SelectBox } from "../../../../../common-components";

import { SortableComponent } from "./testDragDrop/sortableComponent"
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';
import { ArrangeOrdinalTransportOneVehicle } from './testDragDrop/arrangeOrdinalTransportOneVehicle'

import { transportPlanActions } from "../../transport-plan/redux/actions";
import { transportScheduleActions } from "../redux/actions";

import { convertDistanceToKm, convertTimeToMinutes } from "../../transportHelper/convertDistanceAndDuration"

import { MapContainer } from "./googleReactMap/maphook"

import './arrangeOrdinalTransport.css'

function ManagementTable(props) {
    let {transportPlan} = props
    useEffect(() => {
        props.getAllTransportPlans({page: 1, limit: 100});
    }, []);
    return (
        <React.Fragment>
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
                                    <a className="edit text-green" 
                                        style={{ width: '5px' }} 
                                        title={"Thông tin chi tiết kế hoạch"} 
                                        onClick={() => handleShowDetailInfo(x)}
                                    >
                                        <i className="material-icons">visibility
                                        </i>
                                    </a>
                                    <a className="edit text-yellow" style={{ width: '5px' }} 
                                        title={"Chỉnh sửa kế hoạch"} 
                                        onClick={() => handleEditPlan(x)}
                                    >
                                        <i className="material-icons">edit</i>
                                    </a>
                                    <DeleteNotification
                                        content={"Xóa kế hoạch vận chuyển"}
                                        data={{
                                            id: x._id,
                                            info: x.code
                                        }}
                                        func={handleDelete}
                                    />
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