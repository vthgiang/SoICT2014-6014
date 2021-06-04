import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting, DeleteNotification, PaginateBar } from "../../../../../common-components";
// import { getTableConfiguration } from '../../../../helpers/tableConfiguration';
import { TransportDepartmentCreateForm } from "../components/transportDepartmentCreateForm"

import { transportDepartmentActions } from "../redux/actions"
function TransportDepartmentManagementTable(props) {
    let { listTransportDepartments } = props
    useEffect(() => {
        props.getAllTransportDepartments({page: 1, limit: 100})
    }, [])

    const handleShowDetailBusinessDepartment = (businessDepartment) => {
        console.log(businessDepartment, " okkkkkk")
    }
    return (
        <React.Fragment>
            <div className="box-body qlcv">
                <TransportDepartmentCreateForm />
                {/* <table id={tableId} className="table table-striped table-bordered table-hover"> */}
                <table id={"tableId"} className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>{"STT"}</th>
                                <th>{"Tên đơn vị"}</th>
                                <th>{"Trưởng đơn vị"}</th>
                                <th>{"Vai trò"}</th>
                                {/* <th style={{ width: "120px", textAlign: "center" }}>
                                    {translate("table.action")}
                                    <DataTableSetting
                                        tableId={tableId}
                                        columnArr={["STT", "Tên đơn vị", "Trưởng đơn vị", "Vai trò"]}
                                        setLimit={this.setLimit}
                                    />
                                </th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                (listTransportDepartments && listTransportDepartments.length !== 0)
                                && listTransportDepartments.map((businessDepartment, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{businessDepartment.organizationalUnit ? businessDepartment.organizationalUnit.name : "---"}</td>
                                        <td>
                                            {/* {businessDepartment.organizationalUnit
                                                ? this.getManagerName(businessDepartment.organizationalUnit)
                                                : "---"} */}
                                        </td>
                                        {/* <td>{roleConvert[businessDepartment.role]}</td> */}
                                        <td style={{ textAlign: "center" }}>
                                            <a
                                                style={{ width: "5px" }}
                                                title={"Xem chi tiết"}
                                                onClick={() => {
                                                    handleShowDetailBusinessDepartment(businessDepartment);
                                                }}
                                            >
                                                <i className="material-icons">view_list</i>
                                            </a>
                                            {/* <a
                                                className="edit text-yellow"
                                                style={{ width: "5px" }}
                                                title={"Chỉnh sửa thông tin"}
                                                onClick={() => {
                                                    this.handleEditBusinessDepartment(businessDepartment);
                                                }}
                                            >
                                                <i className="material-icons">edit</i>
                                            </a> */}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
            </div>
        </React.Fragment>
    )
}

function mapState(state) {
    console.log(state);
    const listTransportDepartments = state?.transportDepartment?.lists;
    return {listTransportDepartments}

}

const actions = {
    getAllTransportDepartments: transportDepartmentActions.getAllTransportDepartments,
}

const connectedTransportDepartmentManagementTable = connect(mapState, actions)(withTranslate(TransportDepartmentManagementTable));
export { connectedTransportDepartmentManagementTable as TransportDepartmentManagementTable };