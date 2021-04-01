import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting, DeleteNotification, PaginateBar } from "../../../../../common-components";

import { TransportScheduleCreateForm } from "./transportScheduleCreateForm"
// import { transportRequirementsActions } from "../redux/actions";
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';

function TransportScheduleManagementTable(props) {
    return (
        <React.Fragment>
            <TransportScheduleCreateForm />
            <div className="box-body qlcv">
                <div className="form-inline">
                    {/* Tìm kiếm */}
                    {/* <div className="form-group">
                        <label className="form-control-static">{translate('manage_example.exampleName')}</label>
                        <input type="text" className="form-control" name="exampleName" onChange={handleChangeExampleName} placeholder={translate('manage_example.exampleName')} autoComplete="off" />
                    </div>
                    <div className="form-group">
                        <button type="button" className="btn btn-success" title={translate('manage_example.search')} onClick={() => handleSubmitSearch()}>{translate('manage_example.search')}</button>
                    </div> */}
                </div>

                {/* Danh sách các yêu cầu */}
                <table id={"tableId"} className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th className="col-fixed" style={{ width: 60 }}>{"i"}</th>
                            <th>{"Loại yêu cầu"}</th>
                            <th>{"Địa chỉ bắt đầu"}</th>
                            <th>{"Địa chỉ kết thúc"}</th>
                            <th>{"Người tạo"}</th>
                            <th>{"Trạng thái"}</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                    </tbody>
                </table>

            </div>
        </React.Fragment>
    )
}

function mapState(state) {
    // const allTransportRequirements = state.transportRequirements.lists;
    // return { allTransportRequirements }
}

const actions = {
    // getAllTransportRequirements: transportRequirementsActions.getAllTransportRequirements,
}

const connectedTransportScheduleManagementTable = connect(mapState, actions)(withTranslate(TransportScheduleManagementTable));
export { connectedTransportScheduleManagementTable as TransportScheduleManagementTable };