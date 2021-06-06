import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting, DeleteNotification, PaginateBar, forceCheckOrVisible } from "../../../../../common-components";

import { formatDate } from "../../../../../helpers/formatDate"
import { TransportPlanGenerate } from "./transport-plan-auto-generate/transportPlanGenerate"
import { TransportPlanCreateForm } from "./transportPlanCreateForm"
import { TransportPlanEditForm } from "./transportPlanEditForm"
import { TransportPlanDetailInfo } from "./transportPlanDetailInfo"
import { TransportVehicleAndCarrierListed } from "./transportVehicleAndCarrierListed"
import { TransportVehicleCarrier2 } from "./transportVehicleCarrier2"
import { transportPlanActions } from "../redux/actions"
import { transportVehicleActions } from '../../transport-vehicle/redux/actions'
import { transportDepartmentActions } from "../../transport-department/redux/actions"
// import { transportRequirementsActions } from "../redux/actions";
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';
// import { convertJsonObjectToFormData } from '../../../../../helpers/jsonObjectToFormDataObjectConverter'
// import { UserActions } from "../../../../super-admin/user/redux/actions";



function TransportPlanManagementTable(props) {

    let { translate, allTransportPlans, transportPlan } = props;


    const getTableId = "transport-plan-management-table"
    const defaultConfig = { limit: 5 }
    const getLimit = getTableConfiguration(getTableId, defaultConfig).limit;

    const [currentTransportPlan, setCurrentTransportPlan] = useState()
    const [reloadRequirementTable, setReloadRequirementTable] = useState()

    const [pageStatus, setPageStatus] = useState({
        page: 1,
        perPage: getLimit,
        tableId: getTableId,
    })
    let {page, perPage, tableId} = pageStatus;
    const totalPage = transportPlan && Math.ceil(transportPlan.totalList / perPage);

    const planStatus = [
        {
            value: "1",
            text: "Cần phân công phương tiện, xếp lộ trình di chuyển"
        },
        {
            value: "2",
            text: "Sẵn sàng vận chuyển"
        },
        {
            value: "3",
            text: "Đang tiến hành vận chuyển"
        },
        {
            value: "4",
            text: "Hoàn thành"
        },
    ]

    useEffect(() => {
        props.getAllTransportPlans({page: page, limit: perPage});
        // props.getAllUserOfCompany();
    }, [pageStatus])

    useEffect(() => {
        // console.log(totalPage, " hihi");
        console.log(transportPlan);        
        props.getAllTransportVehicles();
        props.getUserByRole({currentUserId: localStorage.getItem('userId'), role: 2});
        props.getUserByRole({currentUserId: localStorage.getItem('userId'), role: 3});
    }, [transportPlan])
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

    const setLimit = (number) => {
        setPageStatus({
            ...pageStatus,
            page: 1,
            perPage: parseInt(number)
        })
    }

    const setPage = (pageNumber) => {
        setPageStatus({
            ...pageStatus,
            page: parseInt(pageNumber)
        })
    }

    const getPlanStatus = (value) => {
        let res = "";
        let tmp = planStatus.filter(r => String(r.value)===String(value));
        if (tmp && tmp.length!==0){
            res = tmp[0].text;
        }
        return res;
    }

    const checkHasComponent = (name) => {
        let { auth } = props;
        // console.log(auth);
        let result = false;
        if (auth && auth.component && auth.component.length!==0){
            auth.components.forEach((component) => {
                if (component.name === name) result = true;
            });
        }
        return true;
    }
    return (
        // <div className="nav-tabs-custom">
        // <ul className="nav nav-tabs">
        //     <li className="active"><a href="#list-transport-plan" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>{"Kế hoạch vận chuyển"}</a></li>
        //     {/* <li><a href="#list-vehicle-carrier" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>{"Thống kê phương tiện và nhân viên vận chuyển"}</a></li> */}
        //     <li><a href="#list-vehicle-carrier2" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>{"Thống kê phương tiện và nhân viên vận chuyển"}</a></li>
        // </ul>
        // <div className="tab-content">
        //     <div className="tab-pane active" id="list-transport-plan">
            <div className="box-body qlcv">
                {
                    checkHasComponent('create-transport-plan')
                    && 
                    <TransportPlanGenerate 
                        transportPlan={transportPlan}
                    />
                }
                {
                    checkHasComponent('create-transport-plan')
                    &&                         
                    <TransportPlanCreateForm 
                        transportPlan={transportPlan}
                        currentDateClient={getCurrentDate()}
                    />
                }
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
            <table id={tableId} className="table table-striped table-bordered table-hover">
                <thead>
                    <tr>
                        <th className="col-fixed" style={{ width: 60 }}>{"Số thứ tự"}</th>
                        <th>{"Mã kế hoạch"}</th>
                        <th>{"Tên kế hoạch"}</th>
                        <th>{"Trạng thái"}</th>
                        <th>{"Thời gian"}</th>
                        <th>{"Người phụ trách giám sát"}</th>
                        <th style={{ width: "120px", textAlign: "center" }}>{translate('table.action')}
                            <DataTableSetting
                                tableId={tableId}
                                columnArr={[
                                    // translate('manage_example.index'),
                                    // translate('manage_example.exampleName'),
                                    // translate('manage_example.description'),
                                    translate('manage_example.index'),
                                    "Mã kế hoạch",
                                    "Tên kế hoạch",
                                    "Trạng thái",
                                    "Thời gian",
                                    "Người phụ trách giám sát",
                                ]}
                                setLimit={setLimit}
                            />
                        </th>
                        {/* <th>{"Hành động"}</th> */}
                    </tr>
                </thead>
                <tbody>
                {
                (transportPlan && transportPlan.lists && transportPlan.lists.length !== 0) &&
                transportPlan.lists.map((x, index) => (
                        x &&
                        <tr key={index}>
                            <td>{index + 1 + (page - 1) * perPage}</td>
                            <td>{x.code}</td>
                            <td>{x.name}</td>
                            <td>{getPlanStatus(x.status)}</td>
                            <td>{formatDate(x.startTime)+" - "+formatDate(x.endTime)}</td>
                            <td>{x.supervisor?.name}</td>
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

            {transportPlan && transportPlan.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    (typeof transportPlan.lists === 'undefined' || transportPlan.lists.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
            }
            <PaginateBar
                pageTotal={totalPage ? totalPage : 0}
                currentPage={page}
                display={transportPlan && transportPlan.lists && transportPlan.lists.length !== 0 && transportPlan.lists.length}
                total={transportPlan && transportPlan.totalList}
                func={setPage}
            />
        </div>
        
    //         {/* </div>
    //         <div className="tab-pane" id="list-vehicle-carrier">
    //             <TransportVehicleAndCarrierListed 
    //                 transportPlan = {transportPlan}
    //                 // key={transportPlan}
    //             />
    //         </div>
    //         <div className="tab-pane" id="list-vehicle-carrier2">
    //             <TransportVehicleCarrier2 
    //                 transportPlan = {transportPlan}
    //                 // key={transportPlan}
    //             />
    //         </div>

    //     </div>
    // </div> */}
    )
}

function mapState(state) {
    const allTransportPlans = state.transportPlan.lists;
    const {transportPlan, auth} = state
    // console.log(transportPlan);
    return { allTransportPlans, transportPlan, auth }
}

const actions = {
    getAllTransportPlans: transportPlanActions.getAllTransportPlans,
    deleteTransportPlan: transportPlanActions.deleteTransportPlan,
    getAllTransportVehicles: transportVehicleActions.getAllTransportVehicles,
    getAllTransportDepartments: transportDepartmentActions.getAllTransportDepartments,
    getUserByRole: transportDepartmentActions.getUserByRole,
    // getAllUserOfCompany: UserActions.getAllUserOfCompany,
}

const connectedTransportPlanManagementTable = connect(mapState, actions)(withTranslate(TransportPlanManagementTable));
export { connectedTransportPlanManagementTable as TransportPlanManagementTable };