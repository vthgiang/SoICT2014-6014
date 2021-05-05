import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting, DeleteNotification, PaginateBar, DatePicker } from "../../../../../common-components";
import { formatDate, formatToTimeZoneDate} from "../../../../../helpers/formatDate"

import { TransportPlanCreateForm } from "./transportPlanCreateForm"
import { TransportPlanEditForm } from "./transportPlanEditForm"
import { TransportPlanDetailInfo } from "./transportPlanDetailInfo"
import { TransportVehicleCarrierListedChart } from "./transport-vehicle-carrier-listed/transportVehicleCarrierListedChart"


import { transportPlanActions } from "../redux/actions"
import { transportVehicleActions } from '../../transport-vehicle/redux/actions'
import { transportDepartmentActions } from "../../transport-department/redux/actions"
// import { transportRequirementsActions } from "../redux/actions";
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';
import { convertJsonObjectToFormData } from '../../../../../helpers/jsonObjectToFormDataObjectConverter'

import { isTimeZoneDateSmaller, getListDateBetween } from "../../transportHelper/compareDateTimeZone"

function TransportVehicleCarrier2(props) {
    let { transportPlan, transportDepartment, transportVehicle } = props
    const getNext5Day = ()=> {
        let currentDay = new Date();
        let date = currentDay.getDate();
        currentDay.setDate(date+5);
        return new Date(currentDay);
    }
    const [date, setDate] = useState({
        startDate: (new Date()).toISOString(),
        // endDate: (new Date()).toISOString(),
        endDate: getNext5Day(),
    })

    const [listVehiclesUsable, setListVehiclesUsable] = useState();
    const [listCarriersUsable, setListCarriersUsable] = useState();
    // Số lượng xe và người => vẽ biểu đồ
    const [countVehicles, setCountVehicles] = useState([]);
    const [countCarriers, setCountCarriers] = useState([]);
    // Danh sách xe và người
    const [listVehicles, setListVehicles] = useState([]);
    const [listCarriers, setListCarriers] = useState([]);
    const [listAllVehicles, setListAllVehicles] = useState([]);
    const [listAllCarriers, setListAllCarriers] = useState([]);

    const [listUsedVehiclesCarriers, setListUsedVehiclesCarriers] = useState([]);
    // Khi click trên biểu đồ, lưu lại index của cột để show danh sách người xe
    const [indexListVehiclesCarriers, setIndexListVehiclesCarriers] = useState(0)
    const [listDay, setListDay] = useState([]);
    const handleStartDateChange = (value) => {
        setDate({
            ...date,
            startDate: formatToTimeZoneDate(value),
        })
    }
    const handleEndDateChange = (value) => {
        setDate({
            ...date,
            endDate: formatToTimeZoneDate(value),
        })
    }

    useEffect(() => {
        // Lấy tất cả plans đã có để kiểm tra xe và người có bị trùng lặp không
        props.getAllTransportDepartments();
        props.getAllTransportVehicles();
    }, [transportPlan])

    useEffect(() => {
        if (date.startDate && date.endDate){
            let lday = getListDateBetween(date.startDate, date.endDate);
            let allVehicles=[];
            let allCarriers=[];
            let usedVehiclesCarriers=[];
            if (transportVehicle && transportVehicle.lists && transportVehicle.lists.length!==0){
                transportVehicle.lists.map(vehicle => {
                    allVehicles.push(vehicle);
                })
            }
            if (transportDepartment && transportDepartment.lists && transportDepartment.lists.length !==0){
                let lists = transportDepartment.lists;
                let carrierOrganizationalUnit = [];
                carrierOrganizationalUnit = lists.filter(r => r.role === 2) // role nhân viên vận chuyển
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
                                            allCarriers.push(users.userId)
                                        }
                                    }
                                })
                            })
                        }
                    })
                } 
            }

            if (lday && lday.length!==0 && allVehicles && allCarriers){
                for (let i=0;i<lday.length;i++){      
                    let usedVehicles=[];
                    let usedCarriers=[];
                    if (transportPlan && transportPlan.lists && transportPlan.lists.length!==0){
                        transportPlan.lists.map(plan => {
                            // nếu có kế hoạch khác bị trùng thời gian
                            if (!(isTimeZoneDateSmaller(lday[i], plan.startTime) || isTimeZoneDateSmaller(plan.endTime, lday[i]))){
                                if(plan.transportVehicles && plan.transportVehicles.length!==0){
                                    plan.transportVehicles.map(transportVehicles => {
                                        // xét xe đã sử dụng trong kế hoạch đó
                                        if (transportVehicles.vehicle?._id){
                                            for (let j=0;j<allVehicles.length;j++){
                                                if (String(allVehicles[j]._id) === String(transportVehicles.vehicle._id)){
                                                    usedVehicles.push(allVehicles[j]);
                                                }
                                            }
                                        }
                                        // xét người đã sử dụng trong kế hoạch đó
                                        
                                        if (plan.transportVehicles && plan.transportVehicles.length!==0){
                                            plan.transportVehicles.map(transportVehicles => {
                                                if (transportVehicles.carriers && transportVehicles.carriers.length !==0){
                                                    transportVehicles.carriers.map(carriers => {
                                                        if(carriers.carrier){
                                                            for (let j =0;j<allCarriers.length;j++){
                                                                if (String(allCarriers[j]._id) === String(carriers.carrier._id)){
                                                                    usedCarriers.push(allCarriers[j]);
                                                                }
                                                            }                                                            
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                        
                                    })
                                }
                            } 
                        })
                    }

                    usedVehiclesCarriers.push({
                        date: formatDate(lday[i]),
                        usedVehicles: usedVehicles,
                        usedCarriers: usedCarriers,
                    })
                    
                }
            }
            setListDay(lday);

            setListAllVehicles(allVehicles);
            setListAllCarriers(allCarriers);
            setListUsedVehiclesCarriers(usedVehiclesCarriers);
        }
    }, [date, transportDepartment, transportVehicle])


    useEffect(() => {
        console.log(listUsedVehiclesCarriers, " okkkkkkkkkkkkkkkkkkkk")
    }, [listUsedVehiclesCarriers])

    return (
        <div className="box-body qlcv">
            <div className="form-inline">
                <div className="form-group">
                    <label className="form-control-static">Từ ngày: </label>
                    <DatePicker
                        id={`start_date_23`}
                        value={formatDate(date.startDate)}
                        onChange={handleStartDateChange}
                        disabled={false}
                    />
                </div>
                <div className="form-group">
                    <label className="form-control-static">Đến ngày: </label>
                    <DatePicker
                        id={`end_date_23`}
                        value={formatDate(date.endDate)}
                        onChange={handleEndDateChange}
                        disabled={false}
                    />
                </div>
            </div>
            <div className="box box-solid">
                <div className="box-header">
                    <div className="box-title">{"Xe có thể sử dụng ngày: "+listDay[indexListVehiclesCarriers]}</div>
                </div>
            <div className="box-body qlcv">
            {
                !(listVehicles && listVehicles[indexListVehiclesCarriers] && listVehicles[indexListVehiclesCarriers].length!==0)
                &&<div>{"Hiện không có phương tiện nào có thể tiếp tục phân công"}</div>
            }
            {
                (listVehicles && listVehicles[indexListVehiclesCarriers] && listVehicles[indexListVehiclesCarriers].length!==0)
                &&      

                <table id={"1"} className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                        <th className="col-fixed" style={{ width: 60 }}>{"STT"}</th>
                        <th>{"Mã xe"}</th>
                        <th>{"Tên xe"}</th>
                        <th>{"Trọng tải"}</th>
                        <th>{"Thể tích thùng"}</th>
                            {/* <th style={{ width: "120px", textAlign: "center" }}>{translate('table.action')}
                                <DataTableSetting
                                    tableId={tableId}
                                    columnArr={[
                                        translate('manage_example.index'),
                                        translate('manage_example.exampleName'),
                                        translate('manage_example.description'),
                                    ]}
                                    setLimit={setLimit}
                                />
                            </th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {(listVehicles[indexListVehiclesCarriers] && listVehicles[indexListVehiclesCarriers].length !== 0) &&
                            listVehicles[indexListVehiclesCarriers].map((x, index) => (
                                x &&
                                <tr key={index}>
                                    <td>{index+1}</td>
                                    <td>{x.code}</td>
                                    <td>{x.name}</td>
                                    <td>{x.payload}</td>
                                    <td>{x.volume}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            }                    
                </div>
            </div>
            <div className="box box-solid">
                <div className="box-header">
                    <div className="box-title">{"Nhân viên chưa có lịch ngày: "+listDay[indexListVehiclesCarriers]}</div>
                </div>
                <div className="box-body qlcv">
            {
                !(listCarriers && listCarriers[indexListVehiclesCarriers] && listCarriers[indexListVehiclesCarriers].length!==0)
                && <div>{"Hiện không có nhân viên nào có thể tiếp tục phân công"}</div>
            }
            {
                (listCarriers && listCarriers[indexListVehiclesCarriers] && listCarriers[indexListVehiclesCarriers].length!==0)
                &&      
                <table id={"2"} className="table table-striped table-bordered table-hover">
                                <thead>
                                    <tr>
                                    <th className="col-fixed" style={{ width: 60 }}>{"STT"}</th>
                                    <th>{"Tên"}</th>
                                    <th>{"Email"}</th>
                                    <th>{"Id"}</th>
                                        {/* <th style={{ width: "120px", textAlign: "center" }}>{translate('table.action')}
                                            <DataTableSetting
                                                tableId={tableId}
                                                columnArr={[
                                                    translate('manage_example.index'),
                                                    translate('manage_example.exampleName'),
                                                    translate('manage_example.description'),
                                                ]}
                                                setLimit={setLimit}
                                            />
                                        </th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {(listCarriers[indexListVehiclesCarriers] && listCarriers[indexListVehiclesCarriers].length !== 0) &&
                                        listCarriers[indexListVehiclesCarriers].map((x, index) => (
                                            x &&
                                            <tr key={index + " carriers"}>
                                                <td>{index+1}</td>
                                                <td>{x.name}</td>
                                                <td>{x.mail}</td>
                                                <td>{x.id}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
            }
                </div>
            </div>
            <div className={"divTest"}>
                <table className={"tableTest table-bordered table-hover not-sort"}>
                    <thead>
                        <tr className="word-no-break">
                            <th>{"STT"}</th>
                            {/* <th>{"Yêu cầu vận chuyển"}</th> */}
                            {
                                listDay && listDay.length!==0
                                &&
                                listDay.map(item => (
                                    <th>{item}</th>
                                )) 
                            }
                        </tr>
                    </thead>
                    <tbody className="transport-special-row">
                    
                    </tbody>
                </table>
            </div>
            
        </div>
    )
}

function mapState(state) {
    const {transportDepartment, transportVehicle } = state;
    return { transportDepartment, transportVehicle }
}

const actions = {
    getAllTransportDepartments: transportDepartmentActions.getAllTransportDepartments,
    getAllTransportVehicles: transportVehicleActions.getAllTransportVehicles,
}

const connectedTransportVehicleCarrier2 = connect(mapState, actions)(withTranslate(TransportVehicleCarrier2));
export { connectedTransportVehicleCarrier2 as TransportVehicleCarrier2 };