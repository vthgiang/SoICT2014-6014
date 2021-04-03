import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting, DeleteNotification, PaginateBar } from "../../../../../common-components";

import { Chart } from './chart'

// import { transportRequirementsActions } from "../redux/actions";
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';

function TransportArrangeSchedule(props) {
    const getTableId = "table-manage-transport-requirements-hooks";
    const defaultConfig = { limit: 5 }
    const getLimit = getTableConfiguration(getTableId, defaultConfig).limit;

    return (
        <div className="box-body qlcv">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-6">
                    <div className="form-inline">
                        <table id={"123"} className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th className="col-fixed" style={{ width: 60 }}>{"STT"}</th>
                            <th>{"Loại yêu cầu"}</th>
                            <th>{"Điểm nhận hàng"}</th>
                            <th>{"Điểm giao hàng"}</th>
                            <th>{"Người tạo"}</th>
                            <th>{"Trạng thái"}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr key={"1"}>
                            <td>{1}</td>
                            <td>{"Giao hàng"}</td>
                            <td>{"Thái Hà"}</td>
                            <td>{"Bách Khoa"}</td>
                            <td>{"Nguyễn Văn Danh"}</td>
                            <td>{"Chờ phê duyệt"}</td>
                        </tr>
                    </tbody>
                </table>
                    </div>
                </div>
                
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-6">
                    
                    <Chart />
                </div>
            </div>
        </div>
    )
}

function mapState(state) {
}

const actions = {
}

const connectedTransportArrangeSchedule = connect(mapState, actions)(withTranslate(TransportArrangeSchedule));
export { connectedTransportArrangeSchedule as TransportArrangeSchedule };