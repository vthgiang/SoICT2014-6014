import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting, DeleteNotification, PaginateBar } from "../../../../../common-components";

// import { transportRequirementsActions } from "../redux/actions";
import { getAllTransportDepartments, transportDepartmentActions } from "../../transport-department/redux/actions"

import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';

function TransportEmployee(props) {
    const getTableId = "table-manage-transport-requirements-hooks";
    const defaultConfig = { limit: 5 }
    const getLimit = getTableConfiguration(getTableId, defaultConfig).limit;

    const {transportDepartment} = props;

    const [listCarriers, setListCarriers] = useState([]);


    useEffect(() => {
        props.getAllTransportDepartments();
    }, [])

    useEffect(() => {
        if (transportDepartment && transportDepartment.lists && transportDepartment.lists.length !==0){
            let lists = transportDepartment.lists;
            let carrierOrganizationalUnit = [];
            carrierOrganizationalUnit = lists.filter(r => r.role === 2) // role nhân viên vận chuyển
            let carrier = [];
            console.log(carrierOrganizationalUnit, " unit")
            if (carrierOrganizationalUnit && carrierOrganizationalUnit.length !==0){
                carrierOrganizationalUnit.map(item =>{
                    if (item.organizationalUnit){
                        let organizationalUnit = item.organizationalUnit;
                        organizationalUnit.employees && organizationalUnit.employees.length !==0
                        && organizationalUnit.employees.map(employees => {
                            employees.users && employees.users.length !== 0
                            && employees.users.map(users => {
                                if (users.userId){
                                    if (users.userId.name){
                                        carrier.push({
                                            name: users.userId.name,
                                            _id: users.userId._id,
                                        })
                                    }
                                }
                            })
                        })
                    }
                })
            }
            setListCarriers(carrier);
        }
    }, [transportDepartment])

    useEffect(() => {
        console.log(listCarriers, " list")
    }, [listCarriers])

    return (
        <React.Fragment>
            <div className="box-body qlcv">
                <div className="form-inline">
                <table id={"123"} className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th className="col-fixed" style={{ width: 60 }}>{"STT"}</th>
                            <th>{"Tên nhân viên"}</th>
                            <th>{"Mã nhân viên"}</th>
                            <th>{"Hành động"}</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        (listCarriers && listCarriers.length!==0)
                        && listCarriers.map((item, index) => (
                            <tr key={index}>
                                <td>{index+1}</td>
                                <td>{item._id}</td>
                                <td>{item.name}</td>
                                <td>{123}</td>
                            </tr>
                        ))
                    }

                        {/* <tr key={"1"}>
                            <td>{1}</td>
                            <td>{"123"}</td>
                            <td>{"123"}</td>
                            <td>{"123"}</td>
                            <td>{"123"}</td>
                            <td>{"Chờ phê duyệt"}</td>
                            <td style={{ textAlign: "center" }}>
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
                            </td>
                        </tr> */}
                        {/* {(lists && lists.length !== 0) &&
                            lists.map((example, index) => (
                                <tr key={index}>
                                    <td>{index + 1 + (page - 1) * perPage}</td>
                                    <td>{example.exampleName}</td>
                                    <td>{example.description}</td>
                                    <td style={{ textAlign: "center" }}>
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
                                    </td>
                                </tr>
                            ))
                        } */}
                    </tbody>
                </table>

                {/* PaginateBar */}
                {/* {example && example.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    (typeof lists === 'undefined' || lists.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                } */}
                {/* <PaginateBar
                    pageTotal={totalPage ? totalPage : 0}
                    currentPage={page}
                    display={lists && lists.length !== 0 && lists.length}
                    total={example && example.totalList}
                    func={setPage}
                /> */}
            </div>
            </div>
        </React.Fragment>
    )
}

function mapState(state) {
    const {transportDepartment} = state;
    return { transportDepartment }
}

const actions = {
    getAllTransportDepartments: transportDepartmentActions.getAllTransportDepartments
}

const connectedTransportEmployee = connect(mapState, actions)(withTranslate(TransportEmployee));
export { connectedTransportEmployee as TransportEmployee };