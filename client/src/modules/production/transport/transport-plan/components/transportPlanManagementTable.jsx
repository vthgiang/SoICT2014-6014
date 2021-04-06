import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting, DeleteNotification, PaginateBar } from "../../../../../common-components";

import { TransportPlanCreateForm } from "./transportPlanCreateForm"

import { transportPlanActions } from "../redux/actions"
// import { transportRequirementsActions } from "../redux/actions";
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';
import { convertJsonObjectToFormData } from '../../../../../helpers/jsonObjectToFormDataObjectConverter'
function TransportPlanManagementTable(props) {

    let { allTransportPlans } = props;

    useEffect(() => {
        props.getAllTransportPlans({page: 1, limit: 500});
    }, [])

   return (
            <div className="box-body qlcv">
                <TransportPlanCreateForm />
                <div className="form-inline">

                </div>

                {/* Danh sách lịch vận chuyển */}
                <table id={"tableId"} className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th className="col-fixed" style={{ width: 60 }}>{"Số thứ tự"}</th>
                            <th>{"Mã lịch trình"}</th>
                            <th>{"Trạng thái"}</th>
                            <th>{"Từ ngày"}</th>
                            <th>{"Đến ngày"}</th>
                            <th>{"Người phụ trách"}</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                    (allTransportPlans && allTransportPlans.length !== 0) &&
                    allTransportPlans.map((x, index) => (
                                x &&
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{x.code}</td>
                                    <td>{""}</td>
                                    <td>{x.startTime}</td>
                                    <td>{x.endTime}</td>
                                    <td>{""}</td>
                                    {/* <td style={{ textAlign: "center" }}>
                                        <a className="edit text-green" style={{ width: '5px' }} title={translate('manage_example.detail_info_example')} onClick={() => handleShowDetailInfo(example)}><i className="material-icons">visibility</i></a>
                                        <a className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_example.edit')} onClick={() => handleEdit(example)}><i className="material-icons">edit</i></a>
                                        <DeleteNotification
                                            content={translate('manage_example.delete')}
                                            data={{
                                                id: example._id,
                                                info: example.exampleName
                                            }}
                                            func={handleDelete}
                                        />
                                    </td> */}
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
    return { allTransportPlans }
}

const actions = {
    getAllTransportPlans: transportPlanActions.getAllTransportPlans,
}

const connectedTransportPlanManagementTable = connect(mapState, actions)(withTranslate(TransportPlanManagementTable));
export { connectedTransportPlanManagementTable as TransportPlanManagementTable };