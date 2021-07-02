import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting, DeleteNotification, PaginateBar, DatePicker } from "../../../../../common-components";
import { formatDate, formatToTimeZoneDate} from "../../../../../helpers/formatDate"

import { TransportPlanCreateForm } from "./transportPlanCreateForm"
import { TransportPlanEditForm } from "./transportPlanEditForm"
import { TransportPlanDetailInfo } from "./transport-plan-detail/transportPlanDetailInfo2"
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

    // Danh sách xe và người
    const [listAllVehicles, setListAllVehicles] = useState([]);
    const [listAllCarriers, setListAllCarriers] = useState([]);
    /**
     * Danh sách xe và người đã sử dụng
     * [
     *  date: đd-mm-yyyy
     *  usedVehicles: [transportVehicle, ....]
     *  usedCarriers: [user, user, ...]
     *  transportPlan: transportPlan
     * ]
     */
    const [listUsedVehiclesCarriers, setListUsedVehiclesCarriers] = useState([]);
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
        // props.getAllTransportDepartments();       
        // props.getAllTransportVehicles();
        // props.getUserByRole({currentUserId: localStorage.getItem('userId'), role: 3})
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
            // if (transportDepartment && transportDepartment.lists && transportDepartment.lists.length !==0){
            //     let lists = transportDepartment.lists;
            //     let carrierOrganizationalUnit = [];
            //     carrierOrganizationalUnit = lists.filter(r => r.role === 2) // role nhân viên vận chuyển
            //     if (carrierOrganizationalUnit && carrierOrganizationalUnit.length !==0){
            //         carrierOrganizationalUnit.map(item =>{
            //             if (item.organizationalUnit){
            //                 let organizationalUnit = item.organizationalUnit;
            //                 organizationalUnit.employees && organizationalUnit.employees.length !==0
            //                 && organizationalUnit.employees.map(employees => {
            //                     employees.users && employees.users.length !== 0
            //                     && employees.users.map(users => {
            //                         if (users.userId){
            //                             if (users.userId.name){
            //                                 allCarriers.push(users.userId)
            //                             }
            //                         }
            //                     })
            //                 })
            //             }
            //         })
            //     } 
            // }
            if (transportDepartment && transportDepartment.listUser && transportDepartment.listUser.length!==0){
                let listUser = transportDepartment.listUser.filter(r=>Number(r.role) === 3);
                if (listUser && listUser.length!==0 && listUser[0].list && listUser[0].list.length!==0){
                    listUser[0].list.map(userId => {
                        if (allCarriers.length!==0){
                            allCarriers = allCarriers.filter(r=>String(r._id)!==String(userId._id));
                        }
                        allCarriers.push(userId);
                    })
                }
            }

            if (lday && lday.length!==0 && allVehicles && allCarriers){
                for (let i=0;i<lday.length;i++){      
                    let usedVehicles=[];
                    let usedCarriers=[];
                    let currentPlan;
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
                                                    currentPlan=plan;
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
                                                                    currentPlan=plan;
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
                        transportPlan: currentPlan,
                    })
                    
                }
            }
            setListDay(lday);

            setListAllVehicles(allVehicles);
            setListAllCarriers(allCarriers);
            setListUsedVehiclesCarriers(usedVehiclesCarriers);
        }
    }, [date, transportDepartment, transportVehicle])

    const getStatusTickBox = (date, itemId) => {
        let res = "iconinactive";
        try {
            let timeZoneDate = new Date(formatToTimeZoneDate(date));
            if (listUsedVehiclesCarriers && listUsedVehiclesCarriers.length!==0){
                listUsedVehiclesCarriers.map(item => {
                    if (item.date){
                        let itemDate = new Date(formatToTimeZoneDate(item.date));
                        if (itemDate.getTime() === timeZoneDate.getTime()){
                            if (item.usedVehicles && item.usedVehicles.length!==0){
                                let k = item.usedVehicles.filter(r=> String(r._id)===String(itemId));
                                if (k && k.length!==0){
                                    res = "iconred";
                                }
                            }
                            if (item.usedCarriers && item.usedCarriers.length!==0){
                                let k = item.usedCarriers.filter(r=> String(r._id)===String(itemId));
                                if (k && k.length!==0){
                                    res = "iconred"
                                }
                            }
                        }
                    }
                })
            }
        } catch (error) {
            return res;
        }
        return res;
    }

    const getCurrentPlan = (date, itemId) => {
        let res = undefined;
        try {
            let timeZoneDate = new Date(formatToTimeZoneDate(date));
            if (listUsedVehiclesCarriers && listUsedVehiclesCarriers.length!==0){
                listUsedVehiclesCarriers.map(item => {
                    if (item.date){
                        let itemDate = new Date(formatToTimeZoneDate(item.date));
                        if (itemDate.getTime() === timeZoneDate.getTime()){
                            if (item.usedVehicles && item.usedVehicles.length!==0){
                                let k = item.usedVehicles.filter(r=> String(r._id)===String(itemId));
                                if (k && k.length!==0){
                                    res = item.transportPlan;
                                }
                            }
                            if (item.usedCarriers && item.usedCarriers.length!==0){
                                let k = item.usedCarriers.filter(r=> String(r._id)===String(itemId));
                                if (k && k.length!==0){
                                    res = item.transportPlan;
                                }
                            }
                        }
                    }
                })
            }
        } catch (error) {
            return res = undefined;
        }
        return res;
    }
    const [planChosenSeen, setPlanChosenSeen] = useState({})
    const handleShowDetailPlan = (plan) => {
        // console.log(plan);
        setPlanChosenSeen(plan);
        window.$('#modal-detail-info-transport-plan2').modal('show');
    }

    useEffect(() => {
        // console.log(listAllVehicles);
        // console.log(listAllCarriers);
    }, [listAllVehicles])

    useEffect(() => {
        // console.log(listUsedVehiclesCarriers, " okkkkkkkkkkkkkkkkkkkk")
    }, [listUsedVehiclesCarriers])

    return (
        <React.Fragment>
        {/* <div className="box-body qlcv"> */}
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
            
            {/* <div className="box box-solid"> */}
                {/* <div className="box-header"> */}
                    {/* <div className="box-title">{"Danh sách sử dụng phuơng tiện theo ngày"}</div> */}
                {/* </div> */}

                {/* <div className="box-body qlcv"> */}
                    <TransportPlanDetailInfo 
                        currentTransportPlan={planChosenSeen}
                    />
                    <div className={"divTest"}>
                        <table className={"tableTest table-bordered table-hover not-sort"}>
                            <thead>
                                <tr key={"vehicle-label"}>
                                    <td colSpan={listDay?listDay.length + 4:4}>
                                        <div className="transport-table-carrier-vehicle-label"> {"Lịch vận chuyển phương tiện"}</div>
                                    </td>
                                </tr>
                                <tr className="word-no-break">
                                    <th>{"STT"}</th>
                                    <th>{"Mã xe"}</th>
                                    <th>{"Tên xe"}</th>
                                    <th>{"Chi tiết"}</th>
                                    {
                                        listDay && listDay.length!==0
                                        &&
                                        listDay.map((item, index) => (
                                            <th key={index+"day"}>{formatDate(item)}</th>
                                        )) 
                                    }
                                </tr>
                            </thead>
                            <tbody className="transport-special-row">
                            {
                                listAllVehicles && listAllVehicles.length!==0
                                &&
                                listAllVehicles.map((vehicle, index1)=>(
                                    vehicle &&
                                    <tr key={vehicle._id} className="word-no-break">
                                        <td>{index1+1}</td>
                                        <td>{vehicle.code}</td>
                                        <td>{vehicle.name}</td>
                                        <td>
                                            <p>{"Trọng tải: "+vehicle.payload}</p>
                                            <p>{"Thể tích thùng: "+vehicle.volume}</p>
                                        </td>
                                        {
                                            listDay && listDay.length!==0
                                            && listDay.map((day, index2) => (
                                                <td className="tooltip-checkbox-transport" key={index2}>
                                                    <span className={"icon "+getStatusTickBox(formatDate(day), vehicle._id)}
                                                    title={"KH"}
                                                    style={{cursor: "default"}} 
                                                    >
                                                    </span>
                                                    {
                                                        getCurrentPlan(formatDate(day), vehicle._id)
                                                        &&
                                                        <span className="tooltiptext">
                                                            <a style={{ color: "white", cursor: "pointer" }} 
                                                                onClick={() => handleShowDetailPlan(getCurrentPlan(formatDate(day), vehicle._id))}
                                                            >{getCurrentPlan(formatDate(day), vehicle._id)?.code}</a>
                                                        </span>
                                                    }
                                                </td>
                                            ))
                                        }
                                    </tr>
                                ))
                            }
                            <tr key="page-nav-vehicle">
                                <td colSpan={listDay?listDay.length+4:4}>
                                    { }
                                </td>
                            </tr>
                            </tbody>
                            
                            <thead>
                                <tr key="carrier-label">
                                    <td colSpan={listDay?listDay.length + 4:4}>
                                        <div className="transport-table-carrier-vehicle-label"> {"Lịch vận chuyển của nhân viên"}</div>
                                    </td>
                                </tr>
                                <tr className="word-no-break">
                                    <th>{"STT"}</th>
                                    <th>{"Tên nhân viên"}</th>
                                    <th colSpan={2}>{"Email"}</th>
                                    {
                                        listDay && listDay.length!==0
                                        &&
                                        listDay.map((item, index) => (
                                            <th key={index+"day2"}>{formatDate(item)}</th>
                                        )) 
                                    }
                                </tr>
                            </thead>
                            <tbody className="transport-special-row">
                            {
                                listAllCarriers && listAllCarriers.length!==0
                                &&
                                listAllCarriers.map((carrier, index1)=>(
                                    carrier &&
                                    <tr key={carrier._id} className="word-no-break">
                                        <td>{index1+1}</td>
                                        <td>{carrier.name}</td>
                                        <td colSpan={2}>{carrier.email}</td>
                                        {
                                            listDay && listDay.length!==0
                                            && listDay.map((day, index2) => (
                                                <td className="tooltip-checkbox-transport" key={index2}>
                                                    <span className={"icon "+getStatusTickBox(formatDate(day), carrier._id)}
                                                    title={"KH"} 
                                                    style={{cursor: "default"}} 
                                                    >
                                                    </span>
                                                    {
                                                        getCurrentPlan(formatDate(day), carrier._id)
                                                        &&
                                                        <span className="tooltiptext">
                                                            <a style={{ color: "white", cursor: "pointer" }} 
                                                                onClick={() => handleShowDetailPlan(getCurrentPlan(formatDate(day), carrier._id))}
                                                            >{getCurrentPlan(formatDate(day), carrier._id)?.code}</a>
                                                        </span>
                                                    }
                                                </td>
                                            ))
                                        }
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table>
                    </div>
                {/* </div> */}
            {/* </div> */}

            {/* <div className="box box-solid">
                <div className="box-header">
                    <div className="box-title">{"Danh sách công việc vận chuyển nhân viên theo ngày"}</div>
                </div>

                <div className="box-body qlcv">

                    <div className={"divTest"}>
                        <table id="vehicle-used-list" className={"tableTest table-bordered table-hover not-sort"}>
                            <thead>
                                <tr className="word-no-break">
                                    <th>{"STT"}</th>
                                    <th>{"Tên nhân viên"}</th>
                                    <th>{"Email"}</th>
                                </tr>
                            </thead>
                            <tbody className="transport-special-row">
                            
                            </tbody>
                        </table>
                    </div>
                </div>
            </div> */}
         
        {/* </div> */}
        </React.Fragment>
    )
}

function mapState(state) {
    const {transportDepartment, transportVehicle } = state;
    return { transportDepartment, transportVehicle }
}

const actions = {
    // getAllTransportDepartments: transportDepartmentActions.getAllTransportDepartments,
    // getAllTransportVehicles: transportVehicleActions.getAllTransportVehicles,
    // getUserByRole: transportDepartmentActions.getUserByRole,
}

const connectedTransportVehicleCarrier2 = connect(mapState, actions)(withTranslate(TransportVehicleCarrier2));
export { connectedTransportVehicleCarrier2 as TransportVehicleCarrier2 };