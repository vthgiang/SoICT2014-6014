import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting, DeleteNotification, PaginateBar } from "../../../../../common-components";

import { formatDate } from "../../../../../helpers/formatDate"
import { TransportPlanCreateForm } from "./transportPlanCreateForm"
import { TransportPlanEditForm } from "./transportPlanEditForm"
import { TransportPlanDetailInfo } from "./transportPlanDetailInfo"

import { transportPlanActions } from "../redux/actions"
// import { transportRequirementsActions } from "../redux/actions";
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';
import { convertJsonObjectToFormData } from '../../../../../helpers/jsonObjectToFormDataObjectConverter'



function TransportPlanManagementTable(props) {

    let { allTransportPlans, transportPlan } = props;
    const [currentTransportPlan, setCurrentTransportPlan] = useState()
    const [reloadRequirementTable, setReloadRequirementTable] = useState()
    useEffect(() => {
        props.getAllTransportPlans({page: 1, limit: 500});
    }, [])
    const handleDelete = (id) => {
        props.deleteTransportPlan(id);
    }

    const getCurrentDate = () => {
        let currentDate = new Date();
        currentDate = currentDate.getFullYear()+"-"+currentDate.getMonth()+"-"+currentDate.getDate();
        return currentDate;
    }
    const handleEditPlan = (transportPlan) => {
        setCurrentTransportPlan(transportPlan);
        window.$('#modal-edit-transport-plan').modal('show');
    }

    const handleShowDetailInfo = (transportPlan) => {
        setCurrentTransportPlan(transportPlan);
        window.$('#modal-detail-info-transport-plan').modal('show');
    }

    const reloadOtherEditForm = (value) => {
        setReloadRequirementTable(value);
    }
    return (
            <div className="box-body qlcv">
                <TransportPlanCreateForm 
                    currentDateClient={getCurrentDate()}
                />
                <TransportPlanEditForm
                    currentTransportPlan={currentTransportPlan}
                    reloadRequirementTable = {reloadRequirementTable}
                    reloadOtherEditForm = {reloadOtherEditForm}
                />

                <TransportPlanDetailInfo
                    currentTransportPlan={currentTransportPlan}
                />
                
                <div className="form-inline">

                </div>

                {/* Danh sách lịch vận chuyển */}
                <table id={"tableId"} className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th className="col-fixed" style={{ width: 60 }}>{"Số thứ tự"}</th>
                            <th>{"Mã lịch trình"}</th>
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
                                    <td>{""}</td>
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
            </div>
    )
}

function mapState(state) {
    const allTransportPlans = state.transportPlan.lists;
    const {transportPlan} = state
    return { allTransportPlans, transportPlan }
}

const actions = {
    getAllTransportPlans: transportPlanActions.getAllTransportPlans,
    deleteTransportPlan: transportPlanActions.deleteTransportPlan,
}

const connectedTransportPlanManagementTable = connect(mapState, actions)(withTranslate(TransportPlanManagementTable));
export { connectedTransportPlanManagementTable as TransportPlanManagementTable };