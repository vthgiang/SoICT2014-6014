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
    const [listVehicleAndCarrier, setListVehicleAndCarrier] = useState([]);

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
    /**
     * Lấy id tài xế đã có trong listVehicleAndCarrier
     */
    const getCurrentDriver = (vehicleId) => {
        let currentDriver = "0";
        if (listVehicleAndCarrier && listVehicleAndCarrier.length!==0){
            listVehicleAndCarrier.map(transportVehicles => {
                if (String(transportVehicles.vehicle) === vehicleId){
                    if (transportVehicles.carriers && transportVehicles.carriers.length!==0){
                        transportVehicles.carriers.map(carriers => {
                            if (String(carriers.pos) === "1"){
                                currentDriver = carriers.carrier;
                            }
                        })
                    }
                }
            })
        }
        return currentDriver;
    }
    /**
     * Lấy danh sách nhân viên có thể lái xe
     * Lọc từ nhân viên có thể sử dụng và các nhân viên đã có trong listVehicleAndCarrier
     * @param {*} vehicleId 
     * @returns 
     */
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
    /**
     * Cập nhật listVehicleAndCarrier
     * @param {*} value 
     * @param {*} vehicleId 
     */
    const handleDriverChange = (value, vehicleId) => {
        let vehicleAndCarrier = [...listVehicleAndCarrier];
        // Nếu không chọn tài xế nào, xóa hết các tài xế trong listVehicleAndCarrier
        if (value[0]==="0"){
            if (vehicleAndCarrier && vehicleAndCarrier.length!==0){
                let currentVehicleAndCarrier =  vehicleAndCarrier.filter(r => r.vehicle === vehicleId)
                if (currentVehicleAndCarrier && currentVehicleAndCarrier.length!==0){
                    if (currentVehicleAndCarrier[0].carriers && currentVehicleAndCarrier[0].carriers.length!==0){
                        currentVehicleAndCarrier[0].carriers = currentVehicleAndCarrier[0].carriers.filter(r => String(r.pos)!=="1")
                    }
                }
            }
        }
        else {
            // Chọn 1 tài xế
            if (vehicleAndCarrier && vehicleAndCarrier.length!==0){
                let currentVehicleAndCarrier =  vehicleAndCarrier.filter(r => r.vehicle === vehicleId);
                // Nếu đã lưu xe này trong listVehicleAndCarrier
                if (currentVehicleAndCarrier && currentVehicleAndCarrier.length!==0){
                    // Nếu xe này cũng đã có nhân viên vận chuyển, xóa bỏ các tài xế đã có và đẩy tài xế mới vào
                    if (currentVehicleAndCarrier[0].carriers && currentVehicleAndCarrier[0].carriers.length!==0){
                        currentVehicleAndCarrier[0].carriers = currentVehicleAndCarrier[0].carriers.filter(r => String(r.carrier)!==value[0]);
                        currentVehicleAndCarrier[0].carriers = currentVehicleAndCarrier[0].carriers.filter(r => String(r.carrier)!==getCurrentDriver(vehicleId));
                        currentVehicleAndCarrier[0].carriers.push({
                            carrier: value[0],
                            pos :1,
                        })
                    }
                    else {
                        // Nếu xe chưa có nhân viên vận chuyển nào => tạo mới
                        currentVehicleAndCarrier[0].push({
                            carriers: [{
                                carrier: value[0],
                                pos: 1,
                            }]
                        })
                    }
                }
                else {
                    // Nếu chưa có xe này trong phân công
                    vehicleAndCarrier.push({
                        vehicle: vehicleId,
                        carriers: [{
                            carrier: value[0],
                            pos: 1,
                        }]
                    })
                }
            }
            else {
                // Nếu mảng trạng thái hoàn toàn rỗng
                vehicleAndCarrier = [{
                    vehicle: vehicleId,
                    carriers: [{
                        carrier: value[0],
                        pos: 1,
                    }]
                }]
            }
        }
        setListVehicleAndCarrier(vehicleAndCarrier)
    }

    const getCurrentCarriers = (vehicleId) => {
        // let currentDriver = ["0"];
        let currentDriver=[]
        if (listVehicleAndCarrier && listVehicleAndCarrier.length!==0){
            listVehicleAndCarrier.map(transportVehicles => {
                if (String(transportVehicles.vehicle) === vehicleId){
                    if (transportVehicles.carriers && transportVehicles.carriers.length!==0){
                        transportVehicles.carriers.map(carriers => {
                            if (!(String(carriers.pos) === "1")){
                                currentDriver.push(carriers.carrier);
                            }
                        })
                    }
                }
            })
        }
        if (currentDriver.length>=1){
            return currentDriver.slice(0);
        }
        return currentDriver;
    }
    /**
     * Lấy danh sách nhân viên có thể lái xe
     * Lọc từ nhân viên có thể sử dụng và các nhân viên đã có trong listVehicleAndCarrier
     * @param {*} vehicleId 
     * @returns 
     */
    const getAllCarriers = (vehicleId) => {       
        // let selectedBoxCarriers = [{
        //     // value: "0",
        //     // text: "--Chọn nhân viên--"
        // }]
        let selectedBoxCarriers = []
        if (listCarriersUsable && listCarriersUsable.length!==0){
            listCarriersUsable.map(x => {
                selectedBoxCarriers.push({
                    value: x._id,
                    text: x.name,
                })
            })
        }
        if (listVehicleAndCarrier && listVehicleAndCarrier.length!==0){
            listVehicleAndCarrier.map(transportVehicles => {
                if (transportVehicles.carriers && transportVehicles.carriers.length!==0){
                    transportVehicles.carriers.map(carriers => {
                        if (!(transportVehicles.vehicle===vehicleId && String(carriers.pos)!=="1")){
                            selectedBoxCarriers=selectedBoxCarriers.filter(r=>String(r.value)!==carriers.carrier)
                        }
                    })
                }
            })
        }
        return selectedBoxCarriers;
    }
    /**
     * Cập nhật listVehicleAndCarrier
     * @param {*} value 
     * @param {*} vehicleId 
     */
    const handleCarriersChange = (value, vehicleId1) => {
        const vehicleId = vehicleId1.slice(0, -1) // cắt bỏ ký tự cuối cùng do cài đặt thêm id cho khác biệt
        let vehicleAndCarrier = [...listVehicleAndCarrier];
        if (value[0]==="0"){
            if (vehicleAndCarrier && vehicleAndCarrier.length!==0){
                let currentVehicleAndCarrier =  vehicleAndCarrier.filter(r => r.vehicle === vehicleId)
                if (currentVehicleAndCarrier && currentVehicleAndCarrier.length!==0){
                    if (currentVehicleAndCarrier[0].carriers && currentVehicleAndCarrier[0].carriers.length!==0){
                        currentVehicleAndCarrier[0].carriers = currentVehicleAndCarrier[0].carriers.filter(r => String(r.pos)==="1")
                    }
                }
            }
        }
        else {
            if (vehicleAndCarrier && vehicleAndCarrier.length!==0){
                let currentVehicleAndCarrier =  vehicleAndCarrier.filter(r => r.vehicle === vehicleId);
                if (currentVehicleAndCarrier && currentVehicleAndCarrier.length!==0){
                    if (currentVehicleAndCarrier[0].carriers && currentVehicleAndCarrier[0].carriers.length!==0){
                        // Lọc tài xế đã chọn
                        currentVehicleAndCarrier[0].carriers = currentVehicleAndCarrier[0].carriers.filter(r => String(r.pos)==="1");
                        if (value && value.length!==0){
                            value.map(val => {
                                currentVehicleAndCarrier[0].carriers.push({
                                    carrier: val,
                                })
                            })
                        }
                    }
                    else {                        
                        if (value && value.length!==0){
                            let carrierList = [];
                            value.map(val => {
                                carrierList.push({
                                    carrier: val,
                                })
                            })
                            currentVehicleAndCarrier[0].push({
                                carriers: [{
                                    carrier: carrierList,
                                }]
                            })
                        }
                    }
                }
                else {                        
                    if (value && value.length!==0){
                        let carrierList = [];
                        value.map(val => {
                            carrierList.push({
                                carrier: val,
                            })
                        })
                        vehicleAndCarrier.push({
                            vehicle: vehicleId,
                            carriers: carrierList,
                        })
                    }

                }
            }
            else {
                if (value && value.length!==0){
                    let carrierList = [];
                    value.map(val => {
                        carrierList.push({
                            carrier: val,
                        })
                    })
                    vehicleAndCarrier = [{
                        vehicle: vehicleId,
                        carriers: carrierList,
                    }]
                }
            }
        }
        setListVehicleAndCarrier(vehicleAndCarrier)
    }

    useEffect(() => {
        console.log(listVehiclesUsable)
    }, [listVehiclesUsable])

    useEffect(() => {
        console.log(listVehicleAndCarrier)
    }, [listVehicleAndCarrier])

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
                            <th style={{width: '200px'}}>{"Nhân viên đi cùng"}</th>
                            <th >{"Hành động"}</th>
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
                                    <td>
                                        <SelectBox
                                            id={x._id+"1"}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            value={getCurrentCarriers(x._id)}
                                            items={getAllCarriers(x._id)}
                                            onChange={handleCarriersChange}
                                            multiple={true}
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