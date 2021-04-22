import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ButtonModal, DialogModal, ErrorLabel, DatePicker, LazyLoadComponent, forceCheckOrVisible } from '../../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import { generateCode } from "../../../../../helpers/generateCode";
import { formatToTimeZoneDate, formatDate } from "../../../../../helpers/formatDate"
import ValidationHelper from '../../../../../helpers/validationHelper';

import { LocationMap } from './map/locationMap'
import { SelectBox } from '../../transportHelper/select-box-id/selectBoxId'
import { transportPlanActions } from '../redux/actions';
import { transportVehicleActions } from '../../transport-vehicle/redux/actions'
import { transportDepartmentActions } from "../../transport-department/redux/actions"
import { isTimeZoneDateSmaller } from "../../transportHelper/compareDateTimeZone"
import './transport-plan.css'

function TransportVehicleAndCarrierSelect(props) {
    let listRequirements = []
    let {startTime, endTime, transportDepartment, transportVehicle, transportPlan} = props;
    const [listVehicleAndCarrier, setListVehicleAndCarrier] = useState();

    // Danh sách nhân viên vận chuyển có thể phân công hiện tại
    const [listCarriersUsable, setListCarriersUsable] = useState();
    // Danh sách phương tiện có thể sử dụng hiện tại
    const [listVehiclesUsable, setListVehiclesUsable] = useState();
    // Danh sách nhân viên vận chuyển - tài xế - có thể phân công trong selectBox
    const [selectedBoxDriverList, setSelectedBoxDriverList] = useState();
    useEffect(() => {
        // Lấy tất cả plans đã có để kiểm tra xe và người có bị trùng lặp không
        props.getAllTransportDepartments();
        props.getAllTransportVehicles();
        props.getAllTransportPlans();
    }, [])

    useEffect(() => {
        if (startTime && endTime){
            let vehiclesList = []
            if (transportVehicle && transportVehicle.lists && transportVehicle.lists.length!==0){
                transportVehicle.lists.map(vehicle => {
                    vehiclesList.push(vehicle);
                })
            }
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
            if (transportPlan && transportPlan.lists && transportPlan.lists.length!==0){
                transportPlan.lists.map(plan => {
                    // nếu có kế hoạch khác bị trùng thời gian
                    if (!(isTimeZoneDateSmaller(endTime, plan.startTime) || isTimeZoneDateSmaller(plan.endTime, startTime))){
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
                                if (plan.transportVehicles.carriers && plan.transportVehicles.carriers.length !==0){
                                    plan.transportVehicles.carriers.map(carriers => {
                                        if(String(carriers.carrier?._id)){
                                            let newCarriersList = []
                                            for (let i=0;i<carriersList.length;i++){
                                                if (String(carriersList[i]._id) !== String(carriers.carrier._id)){
                                                    newCarriersList.push(carriersList[i])
                                                }
                                            }
                                            carriersList = newCarriersList; 
                                        }
                                    })
                                }
                            })
                        }
                    } 
                })
            }
            setListVehiclesUsable(vehiclesList);
            setListCarriersUsable(carriersList);
        }
        console.log(transportVehicle, transportDepartment)
        console.log(startTime)
    }, [startTime, endTime, transportDepartment, transportVehicle, transportPlan])

    const getCurrentDriver = (vehicleId) => {
        let currentDriver = "0";
        if (listVehicleAndCarrier && listVehicleAndCarrier.length!==0){
            listVehicleAndCarrier.map(transportVehicles => {
                if (String(transportVehicles.vehicle) === vehicleId){
                    if (transportVehicles.carriers && transportVehicles.carriers.length!==0){
                        transportVehicles.carriers.map(carriers => {
                            if (String(carriers.pos) === 1){
                                currentDriver = carriers.carrier;
                            }
                        })
                    }
                }
            })
        }
        return currentDriver;
    }

    const getAllDriver = (vehicleId) => {       
        let selectedBoxDriver = [{
            value: "0",
            text: "--Chọn tài xế--"
        }]
        if (listCarriersUsable && listCarriersUsable.length!==0){
            listCarriersUsable.map(x => {
                selectedBoxDriver.push({
                    value: x._id,
                    text: x.name,
                })
            })
        }
        if (listVehicleAndCarrier && listVehicleAndCarrier.length!==0){
            listVehicleAndCarrier.map(transportVehicles => {
                if (transportVehicles.carriers && transportVehicles.carriers.length!==0){
                    transportVehicles.carriers.map(carriers => {
                        if (!(transportVehicles.vehicle===vehicleId && String(carriers.pos)==="1")){
                            selectedBoxDriver=selectedBoxDriver.filter(r=>String(r.value)!==carriers.carrier)
                        }
                    })
                }
            })
        }
        return selectedBoxDriver;
    }

    const handleDriverChange = (value, id) => {
        console.log(value[0], id)
    }

    useEffect(() => {
        console.log(listVehiclesUsable)
    }, [listVehiclesUsable])

    useEffect(() => {
        // let selectedBoxDriver = [{
        //     value: "0",
        //     text: "--Chọn tài xế--"
        // }]
        // if (listCarriersUsable && listCarriersUsable.length!==0){
        //     listCarriersUsable.map(x =>{
        //         if (listVehicleAndCarrier && listVehicleAndCarrier.length!==0){
        //             listVehicleAndCarrier.map(transportVehicles => {
        //                 if (transportVehicles.length)
        //             })
        //         }
        //     })
        // }
    }, [listCarriersUsable, listVehicleAndCarrier])

    return (
        <React.Fragment>
            <div className="box-body">
                {
                listVehiclesUsable && listVehiclesUsable.length!==0
                &&
                <table id={"1"} className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th className="col-fixed" style={{ width: 60 }}>{"STT"}</th>
                            <th>{"Mã xe"}</th>
                            <th>{"Tên xe"}</th>
                            <th>{"Trọng tải"}</th>
                            <th>{"Thể tích thùng"}</th>
                            <th>{"Tài xế"}</th>
                            <th>{"Nhân viên đi cùng"}</th>
                            <th>{"Hành động"}</th>
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
                        {(listVehiclesUsable && listVehiclesUsable.length !== 0) &&
                            listVehiclesUsable.map((x, index) => (
                                x &&
                                <tr key={index}>
                                    <td>{index+1}</td>
                                    <td>{x.code}</td>
                                    <td>{x.name}</td>
                                    <td>{x.payload}</td>
                                    <td>{x.volume}</td>
                                    <td>
                                        <SelectBox
                                            id={x._id}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            value={getCurrentDriver(x._id)}
                                            items={getAllDriver(x._id)}
                                            onChange={handleDriverChange}
                                            multiple={false}
                                        />
                                    </td>
                                    {/* <td>{x.createdAt ? formatDate(x.createdAt) : ""}</td> */}
                                    <td>
                                        {
                                            // (x.timeRequests && x.timeRequests.length!==0)
                                            // && x.timeRequests.map((timeRequest, index2)=>(
                                            //     <div key={index+" "+index2}>
                                            //         {index2+1+"/ "+formatDate(timeRequest.timeRequest)}
                                            //     </div>
                                            // ))
                                        }
                                    </td>
                                    {/* <td>{x.status}</td> */}
                                    <td style={{ textAlign: "center" }} className="tooltip-checkbox">
                                        <span className={"icon "
                                        // +getStatusTickBox(x)
                                    }
                                        title={"alo"} 
                                        // onClick={() => handleSelectRequirement(x)}
                                        >
                                        </span>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            }

            {
                listCarriersUsable && listCarriersUsable.length!==0
                &&
                <table id={"1"} className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th className="col-fixed" style={{ width: 60 }}>{"STT"}</th>
                            <th>{"Tên nhân viên"}</th>
                            <th>{"Email"}</th>
                            <th>{"Thể tích thùng"}</th>
                            <th>{"Hành động"}</th>
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
                        {(listCarriersUsable && listCarriersUsable.length !== 0) &&
                            listCarriersUsable.map((x, index) => (
                                x &&
                                <tr key={index}>
                                    <td>{index+1}</td>
                                    <td>{x.name}</td>
                                    <td>{x.email}</td>
                                    {/* <td>{x.volume}</td> */}
                                    {/* <td>{x.createdAt ? formatDate(x.createdAt) : ""}</td> */}
                                    <td>
                                        {
                                            // (x.timeRequests && x.timeRequests.length!==0)
                                            // && x.timeRequests.map((timeRequest, index2)=>(
                                            //     <div key={index+" "+index2}>
                                            //         {index2+1+"/ "+formatDate(timeRequest.timeRequest)}
                                            //     </div>
                                            // ))
                                        }
                                    </td>
                                    {/* <td>{x.status}</td> */}
                                    <td style={{ textAlign: "center" }} className="tooltip-checkbox">
                                        <span className={"icon "
                                        // +getStatusTickBox(x)
                                    }
                                        title={"alo"} 
                                        // onClick={() => handleSelectRequirement(x)}
                                        >
                                        </span>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            }
            </div>
        </React.Fragment>
    );
}


function mapState(state) {
    const {transportDepartment, transportVehicle, transportPlan} = state;
    return { transportDepartment, transportVehicle, transportPlan }
}
const actions = {
    getAllTransportDepartments: transportDepartmentActions.getAllTransportDepartments,
    getAllTransportVehicles: transportVehicleActions.getAllTransportVehicles,
    getAllTransportPlans: transportPlanActions.getAllTransportPlans,
}
const connectedTransportVehicleAndCarrierSelect = connect(mapState, actions)(withTranslate(TransportVehicleAndCarrierSelect));
export { connectedTransportVehicleAndCarrierSelect as TransportVehicleAndCarrierSelect };