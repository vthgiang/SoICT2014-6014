import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ButtonModal, DialogModal, ErrorLabel, DatePicker, SelectBox, LazyLoadComponent, forceCheckOrVisible } from '../../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import { generateCode } from "../../../../../helpers/generateCode";
import { formatToTimeZoneDate, formatDate } from "../../../../../helpers/formatDate"
import ValidationHelper from '../../../../../helpers/validationHelper';

import { LocationMap } from './map/locationMap'
import { MapContainer } from '../../transportHelper/mapbox/map'
import { TransportVehicleAndCarrierSelect } from "./transport-plan-edit/transportVehicleAndCarrierSelect"

import { transportPlanActions } from '../redux/actions';
import { transportDepartmentActions } from '../../transport-department/redux/actions'
import { transportRequirementsActions } from '../../transport-requirements/redux/actions'
import { getTypeRequirement, getTransportRequirementStatus } from '../../transportHelper/getTextFromValue'

import './transport-plan.css'

function TransportPlanEditForm(props) {
    let allTransportRequirements;
    let {transportRequirements, currentDateClient, currentTransportPlan,
        reloadRequirementTable, reloadOtherEditForm, transportDepartment
    } = props;
    const [formSchedule, setFormSchedule] = useState({
        code: "",
        startDate: "",
        endDate: "",
    });

    /**
     * Danh sách tất cả transportrequirements theo thứ tự ưu tiên
     * [transportRequirement, ...]
     */
    const [listRequirements, setListRequirements] = useState([])

    /**
     * Danh sách transportrequirements đã lựa chọn
     * [id, id...]
     */
    const [listSelectedRequirements, setListSelectedRequirements] = useState([])
    /**
     * Danh sách vị trí tọa độ tương ứng với transportrequirements
     */
    const [listSelectedRequirementsLocation, setListSelectedRequirementsLocation] = useState([])

    const [listChosenVehicleCarrier, setListChosenVehicleCarrier] = useState()

    const save = async () => {
        console.log(formSchedule)
        let data = {
            code: formSchedule?.code,
            name: formSchedule?.name,
            startTime: formSchedule?.startDate,
            endTime: formSchedule?.endDate,
            supervisor: formSchedule?.supervisor?._id,
            transportRequirements: formSchedule?.transportRequirements?formSchedule.transportRequirements:listSelectedRequirements,
            transportVehicles: formSchedule?.transportVehicles?formSchedule.transportVehicles:listChosenVehicleCarrier,
        }
        await props.editTransportPlan(currentTransportPlan?._id, data);
        reloadOtherEditForm(new Date());
        // await props.getAllTransportRequirements({page:1, limit: 100, status: 2})
    }
    
    /**
     * sắp xếp và trả về thứ tự ưu tiên các yêu cần vận chuyển
     * theo thời gian yêu cầu và thời gian của kế hoạch
     * @param {*} allTransportRequirements 
     */
    const arrangeRequirement = (allTransportRequirements, date) => {
        let result = [];
        let calArr = [];
        if(allTransportRequirements && allTransportRequirements.length !==0){
            allTransportRequirements.map((requirement, index)=> {
                let mark = 0;
                if (requirement.timeRequests && requirement.timeRequests.length !==0){
                    requirement.timeRequests.map(time => {
                        let timeRequest = new Date(time.timeRequest);
                        if(timeRequest.getTime() === date.getTime()){
                            mark = 5*86400000;
                        }
                    })
                }
                const createdAt = new Date(requirement.createdAt);
                mark += date.getTime() - createdAt.getTime();
                calArr.push({
                    requirement: requirement,
                    mark: mark,
                })
            })
            calArr.sort((a, b)=> {
                return b.mark-a.mark;
              });
            for (let i=0;i<calArr.length;i++){
                result.push(calArr[i].requirement);
            }
        }
        return result;
    }

    const handleSelectRequirement = (requirement) => {
        let arr = [...listSelectedRequirements];
        let pos = arr.indexOf(requirement._id)
        if (pos>=0){
            arr = arr.slice(0,pos).concat(arr.slice(pos+1));
        }
        else{
            arr.push(requirement._id);
        }
        console.log(arr);
        setListSelectedRequirements(arr);
    }

    const getStatusTickBox = (requirement) => {
        if (listSelectedRequirements && listSelectedRequirements.length!==0){
            if (listSelectedRequirements.indexOf(requirement._id)>=0){
                return "iconactive";
            }
            else{
                return "iconinactive";
            }
        }
        else{
            return "iconinactive"
        }
    }

    const getSupervisor = () => {
        let supervisorList = [];
        if (transportDepartment && transportDepartment.listUser && transportDepartment.listUser.length!==0){
            let listUser = transportDepartment.listUser.filter(r=>Number(r.role) === 2);
            if (listUser && listUser.length!==0 && listUser[0].list && listUser[0].list.length!==0){
                listUser[0].list.map(userId => {
                    supervisorList.push({
                        value: userId._id,
                        text: userId.name,
                    });
                })
            }
        }
        return supervisorList;
    }

    const handleSupervisorChange = (value) => {
        setFormSchedule({
            ...formSchedule,
            supervisor: value[0],
        })
    }
    
    const handlePlanNameChange = (e) => {
        setFormSchedule({
            ...formSchedule,
            name: e.target.value,
        })
    }

    useEffect(() => {
        props.getAllTransportRequirements({page:1, limit: 100, status:2})
    }, [reloadRequirementTable])
    useEffect(() => {
        if (currentTransportPlan){
            setFormSchedule({
                startDate: currentTransportPlan.startTime,
                endDate: currentTransportPlan.endTime,
                code: currentTransportPlan.code,
                name: currentTransportPlan.name,
                supervisor: currentTransportPlan.supervisor._id,
            });

            let idArr = []
            if (currentTransportPlan.transportRequirements && currentTransportPlan.transportRequirements.length!==0){
                currentTransportPlan.transportRequirements.map(item => {
                    idArr.push(item._id);
                })
            }
            setListSelectedRequirements(idArr);

            // khởi tạo giá trị cho chọn người lên xe => chosenVehicleCarrier => listChosenVehicle, listVehicleAndCarrier
            let chosenVehicleCarrier = [];
            console.log(currentTransportPlan)
            if (currentTransportPlan.transportVehicles && currentTransportPlan.transportVehicles.length!==0){
                currentTransportPlan.transportVehicles.map(transportVehicles => {
                    let carriers = [];
                    if (transportVehicles.carriers && transportVehicles.carriers.length !==0){
                        transportVehicles.carriers.map(carrier => {
                            console.log(carrier)
                            if (carrier.pos && String(carrier.pos) ==="1"){
                                carriers.push({
                                    carrier: carrier.carrier._id?carrier.carrier._id:carrier.carrier,
                                    pos: 1,
                                })
                            }
                            else {
                                carriers.push({
                                    carrier: carrier.carrier._id?carrier.carrier._id:carrier.carrier,
                                })
                            }
                        })
                    }
                    if (transportVehicles.vehicle){
                        chosenVehicleCarrier.push({
                            vehicle: transportVehicles.vehicle._id,
                            carriers: carriers,
                        })
                    }
                })
            }
            setListChosenVehicleCarrier(chosenVehicleCarrier)
            console.log(currentTransportPlan)
        }
    }, [currentTransportPlan])
    useEffect(() => {
        props.getUserByRole({currentUserId: localStorage.getItem('userId'), role: 2})
    }, [])
    useEffect(() => {
        // console.log(formSchedule, " day la form schedule");
    }, [formSchedule])
    useEffect(() => {
        console.log(currentTransportPlan, " sss");
        if (transportRequirements){
            let {lists} = transportRequirements;
            let allRequirementCanSelect = []
            if (lists && lists.length!==0){
                if (formSchedule.startDate && formSchedule.endDate){
                    const startDate = new Date(formSchedule.startDate);
                    const endDate = new Date(formSchedule.endDate);
                    if(startDate.getTime() <= endDate.getTime()){
                        allRequirementCanSelect = arrangeRequirement(lists, startDate);
                    }
                }
                else {
                    setListRequirements([])
                }
            }
            if (currentTransportPlan && currentTransportPlan.transportRequirements && currentTransportPlan.transportRequirements.length!==0){
                allRequirementCanSelect = allRequirementCanSelect.concat(currentTransportPlan.transportRequirements);
            }
            setListRequirements(allRequirementCanSelect)
        }
    }, [formSchedule.startDate, formSchedule.endDate, currentTransportPlan])

    useEffect(() => {
        setFormSchedule({
            ...formSchedule,
            transportRequirements: listSelectedRequirements,
        })

        let locationArr= []
        if (listRequirements && listRequirements.length!==0
            &&listSelectedRequirements && listSelectedRequirements.length !==0){
            listRequirements.map((item, index) => {
                if (listSelectedRequirements.indexOf(item._id) >=0){
                    locationArr.push(
                        {
                            name: String(index+1),
                            location: {
                                lat: item.geocode?.fromAddress?.lat,
                                lng: item.geocode?.fromAddress?.lng,
                            }
                        },
                        {
                            name: String(index+1),
                            location: {
                                lat: item.geocode?.toAddress?.lat,
                                lng: item.geocode?.toAddress?.lng,
                            }
                        }
                    )
                }
            })
        }
        setListSelectedRequirementsLocation(locationArr);
    }, [listSelectedRequirements, listRequirements])

    useEffect(() => {
        console.log(listRequirements, " luiaaaaaaaa")
    }, [listRequirements])
    const callBackVehicleAndCarrier = (transportVehicles) => {
        setFormSchedule({
            ...formSchedule,
            transportVehicles: transportVehicles,
        })
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-edit-transport-plan" 
                isLoading={false}
                formID="modal-edit-transport-plan"
                title={"Chỉnh sửa kế hoạch vận chuyển"}
                msg_success={"success"}
                msg_failure={"fail"}
                func={save}
                // disableSubmit={!isFormValidated()}
                size={100}
                maxWidth={500}
            >
            <form id="form-create-transport-requirements" >
            <div className="nav-tabs-custom">
                <ul className="nav nav-tabs">
                    <li className="active"><a href="#plan-list-transport-requirement-edit" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>{"Kế hoạch vận chuyển"}</a></li>
                    <li><a href="#plan-transport-vehicle-carrier-edit" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>{"Xếp kế hoạch vận chuyển"}</a></li>
                </ul>
                <div className="tab-content">
                    <div className="tab-pane active" id="plan-list-transport-requirement-edit">
                        <div className="box-body">
                            
                            <div className="box box-solid">
                                <div className="box-body qlcv">
                                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">

                                        <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">

                                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                                    <div className="form-group">
                                                        <label>
                                                            Mã kế hoạch <span className="attention"> </span>
                                                        </label>
                                                        <input type="text" className="form-control" disabled={true} 
                                                            value={formSchedule.code}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                                    <div className="form-group">
                                                        <label>
                                                            Tên kế hoạch <span className="attention"> </span>
                                                        </label>
                                                        <input type="text" className="form-control" disabled={false} 
                                                            value={formSchedule.name}
                                                            onChange={handlePlanNameChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                                    <div className={`form-group`}>
                                                        <label>
                                                            Người phụ trách giám sát
                                                            <span className="attention"> * </span>
                                                        </label>
                                                        <SelectBox
                                                            id={`select-supervisor-edit`}
                                                            className="form-control select2"
                                                            style={{ width: "100%" }}
                                                            value={formSchedule.supervisor}
                                                            items={getSupervisor()}
                                                            onChange={handleSupervisorChange}
                                                            multiple={false}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                                    <div className="form-group">
                                                        <label>
                                                            Ngày bắt đầu <span className="attention"> * </span>
                                                        </label>
                                                        <DatePicker
                                                            id={`start_date_edit`}
                                                            value={formatDate(formSchedule.startDate)}
                                                            // onChange={handleStartDateChange}
                                                            disabled={true}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                                    <div className={`form-group`}>
                                                        <label>
                                                            Ngày kết thúc
                                                            <span className="attention"> * </span>
                                                        </label>
                                                        <DatePicker
                                                            id={`end_date_edit`}
                                                            value={formatDate(formSchedule.endDate)}
                                                            // onChange={handleEndDateChange}
                                                            disabled={true}
                                                        />
                                                    </div>
                                                </div>

                                        </div>
                                        <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8">
                                            {
                                                (listRequirements && listRequirements.length!==0)
                                                &&
                                                // <LocationMap 
                                                //     locations = {listSelectedRequirementsLocation}
                                                //     loadingElement={<div style={{height: `100%`}}/>}
                                                //     containerElement={<div style={{height: "45vh", marginTop: '20px'}}/>}
                                                //     mapElement={<div style={{height: `100%`}}/>}
                                                //     defaultZoom={10}
                                                //     defaultCenter={listSelectedRequirementsLocation[0]?.locations}
                                                // />
                                                <MapContainer 
                                                    nonDirectLocations = {listSelectedRequirementsLocation}
                                                />
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="box box-solid">
                                <div className="box-header">
                                    <div className="box-title">{"Danh sách nhiệm vụ vận chuyển"}</div>
                                </div>
                                <div className="box-body qlcv">
                                {
                                    listRequirements && listRequirements.length!==0
                                    &&
                                    <table id={"1"} className="table table-striped table-bordered table-hover">
                                        <thead>
                                            <tr>
                                                <th className="col-fixed" style={{ width: 60 }}>{"STT"}</th>
                                                <th>{"Mã yêu cầu"}</th>
                                                <th>{"Loại yêu cầu"}</th>
                                                <th>{"Địa chỉ nhận hàng"}</th>
                                                <th>{"Địa chỉ giao hàng"}</th>
                                                <th>{"Ngày tạo"}</th>
                                                <th>{"Ngày mong muốn vận chuyển"}</th>
                                                <th>{"Trạng thái"}</th>
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
                                            {(listRequirements && listRequirements.length !== 0) &&
                                                listRequirements.map((x, index) => (
                                                    x &&
                                                    <tr key={index}>
                                                        <td>{index+1}</td>
                                                        <td>{x.code}</td>
                                                        <td>{getTypeRequirement(x.type)}</td>
                                                        <td>{x.fromAddress}</td>
                                                        <td>{x.toAddress}</td>
                                                        <td>{x.createdAt ? formatDate(x.createdAt) : ""}</td>
                                                        <td>
                                                            {
                                                                (x.timeRequests && x.timeRequests.length!==0)
                                                                && x.timeRequests.map((timeRequest, index2)=>(
                                                                    <div key={index+" "+index2}>
                                                                        {index2+1+"/ "+formatDate(timeRequest.timeRequest)}
                                                                    </div>
                                                                ))
                                                            }
                                                        </td>
                                                        <td>{getTransportRequirementStatus(x.status)}</td>
                                                        <td style={{ textAlign: "center" }} className="tooltip-checkbox">
                                                            <span className={"icon "
                                                            +getStatusTickBox(x)
                                                        }
                                                            title={"alo"} 
                                                            onClick={() => handleSelectRequirement(x)}
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
                            </div>
                        </div>
                    </div>
                    <div className="tab-pane" id="plan-transport-vehicle-carrier-edit">
                        <LazyLoadComponent
                        >
                            <TransportVehicleAndCarrierSelect
                                key={formSchedule.transportRequirements}
                                startTime={formSchedule.startDate}
                                endTime={formSchedule.endDate}
                                callBackVehicleAndCarrier={callBackVehicleAndCarrier}
                                chosenVehicleCarrier={listChosenVehicleCarrier}
                                currentTransportPlanId = {currentTransportPlan?._id}
                            />
                        </LazyLoadComponent>
                    </div>
                </div>
            </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    const {transportRequirements, transportDepartment} = state;
    return {transportRequirements, transportDepartment}
}

const actions = {
    getAllTransportRequirements: transportRequirementsActions.getAllTransportRequirements,
    createTransportPlan: transportPlanActions.createTransportPlan,
    editTransportPlan: transportPlanActions.editTransportPlan,
    getUserByRole: transportDepartmentActions.getUserByRole,
}

const connectedTransportPlanEditForm = connect(mapState, actions)(withTranslate(TransportPlanEditForm));
export { connectedTransportPlanEditForm as TransportPlanEditForm };