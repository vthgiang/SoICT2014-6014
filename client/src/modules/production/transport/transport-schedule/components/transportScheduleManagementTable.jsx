import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting, DeleteNotification, PaginateBar } from "../../../../../common-components";

import { TransportScheduleCreateForm } from "./transportScheduleCreateForm"

import { transportScheduleActions } from "../redux/actions"
// import { transportRequirementsActions } from "../redux/actions";
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';
import { convertJsonObjectToFormData } from '../../../../../helpers/jsonObjectToFormDataObjectConverter'
function TransportScheduleManagementTable(props) {

    const {allTransportSchedulesState, setAllTransportSchedulesState} = useState({});

    useEffect(() => {
        props.getAllTransportSchedules({page: 1, limit: 500});
    }, [])

    useEffect(() => {
        let { allTransportSchedules } = props;
        console.log(convertJsonObjectToFormData(allTransportSchedules), " okasodkaosd");
        setAllTransportSchedulesState({
            convertJsonObjectToFormData(allTransportSchedules);
        })
    }, props.allTransportSchedules)

    return (
        <React.Fragment>
            <TransportScheduleCreateForm />
            <div className="box-body qlcv">
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
                    {(allTransportSchedules && allTransportSchedules.length !== 0) &&
                            allTransportSchedules.map((x, index) => (
                                x &&
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{allTransportSchedulesState.code}</td>
                                    <td>{""}</td>
                                    <td>{allTransportSchedulesState.startTime}</td>
                                    <td>{allTransportSchedulesState.endTime}</td>
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
        </React.Fragment>
    )
}

function mapState(state) {
    const allTransportSchedules = state.transportSchedule.lists;
    return { allTransportSchedules }
}

const actions = {
    getAllTransportSchedules: transportScheduleActions.getAllTransportSchedules,
}

const connectedTransportScheduleManagementTable = connect(mapState, actions)(withTranslate(TransportScheduleManagementTable));
export { connectedTransportScheduleManagementTable as TransportScheduleManagementTable };