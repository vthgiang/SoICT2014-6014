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

function TransportVehicleAndCarrierListed(props) {
    let { transportPlan, transportDepartment, transportVehicle } = props
    const [date, setDate] = useState({
        startDate: (new Date()).toISOString(),
        endDate: (new Date()).toISOString(),
    })

    const [listVehiclesUsable, setListVehiclesUsable] = useState();
    const [listCarriersUsable, setListCarriersUsable] = useState();
    const [countVehicles, setCountVehicles] = useState([]);
    const [countCarriers, setCountCarriers] = useState([]);
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
        if (listDay && listDay.length!==0){
            console.log(listDay, " list day");
        }
        console.log(countVehicles, " kkk")
    }, [countVehicles])
    useEffect(() => {
        console.log(date.startDate, date.endDate);
        console.log(isTimeZoneDateSmaller(date.startDate, date.endDate));
        if (date.startDate && date.endDate){
            let lday = getListDateBetween(date.startDate, date.endDate);
            let countVehiclesUsable = [];
            let countCarriersUsable = []
            if (lday && lday.length!==0){
                for (let i=0;i<lday.length;i++){
                    let vehiclesList = []
                    if (transportVehicle && transportVehicle.lists && transportVehicle.lists.length!==0){
                        transportVehicle.lists.map(vehicle => {
                            vehiclesList.push(vehicle);
                        })
                    }
                    console.log(vehiclesList, " vehiclesList")
                    let carriersList = [];
                    if (transportDepartment && transportDepartment.lists && transportDepartment.lists.length !==0){
                        let lists = transportDepartment.lists;
                        let carrierOrganizationalUnit = [];
                        carrierOrganizationalUnit = lists.filter(r => r.role === 2) // role nhân viên vận chuyển
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
                                                    carriersList.push(users.userId)
                                                }
                                            }
                                        })
                                    })
                                }
                            })
                        } 
                    }
                    console.log(carriersList, " carrrierlistt")
                    if (transportPlan && transportPlan.lists && transportPlan.lists.length!==0){
                        transportPlan.lists.map(plan => {
                            // nếu có kế hoạch khác bị trùng thời gian
                            if (!(isTimeZoneDateSmaller(lday[i], plan.startTime) || isTimeZoneDateSmaller(plan.endTime, lday[i]))){
                                if(plan.transportVehicles && plan.transportVehicles.length!==0){
                                    plan.transportVehicles.map(transportVehicles => {
                                        // xét xe đã sử dụng trong kế hoạch đó
                                        if (transportVehicles.vehicle?._id){
                                            let newVehiclesList = [];
                                            for (let i=0;i<vehiclesList.length;i++){
                                                if (String(vehiclesList[i]._id) !== String(transportVehicles.vehicle._id)){
                                                    newVehiclesList.push(vehiclesList[i])
                                                }
                                            }
                                            vehiclesList = newVehiclesList;
                                        }
                                        // xét người đã sử dụng trong kế hoạch đó
                                        console.log(carriersList, " carrierList");
                                        if (plan.transportVehicles && plan.transportVehicles.length!==0){
                                            plan.transportVehicles.map(transportVehicles => {
                                                if (transportVehicles.carriers && transportVehicles.carriers.length !==0){
                                                    transportVehicles.carriers.map(carriers => {
                                                        console.log(carriers);
                                                        if(carriers.carrier){
                                                            carriersList = carriersList.filter(r => String(r._id) !== String(carriers.carrier))
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
                    
                    lday[i] = formatDate(lday[i])
                    countVehiclesUsable.push(vehiclesList.length);
                    countCarriersUsable.push(carriersList.length);
                }
            }
            setListDay(lday);
            // setListVehiclesUsable(vehiclesList);
            // setListCarriersUsable(carriersList);
            setCountCarriers(countCarriersUsable);
            setCountVehicles(countVehiclesUsable);
        }
        console.log(transportVehicle, transportDepartment)
    }, [date, transportDepartment, transportVehicle])


    return (
        <div className="box-body qlcv">
            <div className="form-inline">
                <div className="form-group">
                    <label className="form-control-static">Từ ngày: </label>
                    <DatePicker
                        id={`start_date_2`}
                        value={formatDate(date.startDate)}
                        onChange={handleStartDateChange}
                        disabled={false}
                    />
                </div>
                <div className="form-group">
                    <label className="form-control-static">Đến ngày: </label>
                    <DatePicker
                        id={`end_date_2`}
                        value={formatDate(date.endDate)}
                        onChange={handleEndDateChange}
                        disabled={false}
                    />
                </div>
            </div>
            <TransportVehicleCarrierListedChart
                listDay={listDay}
                countVehicles={countVehicles}
                countCarriers={countCarriers}
            />
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

const connectedTransportVehicleAndCarrierListed = connect(mapState, actions)(withTranslate(TransportVehicleAndCarrierListed));
export { connectedTransportVehicleAndCarrierListed as TransportVehicleAndCarrierListed };