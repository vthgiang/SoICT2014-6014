import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ButtonModal, DialogModal, ErrorLabel, DatePicker, SelectBox, LazyLoadComponent, forceCheckOrVisible, DeleteNotification } from '../../../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import { generateCode } from "../../../../../../helpers/generateCode";
import { formatToTimeZoneDate, formatDate } from "../../../../../../helpers/formatDate"
import ValidationHelper from '../../../../../../helpers/validationHelper';

// import { LocationMap } from './map/locationMap'
import { TransportPlanDetailInfo } from './transportPlanDetailInfo'

import { transportPlanActions } from '../../redux/actions';
import { transportRequirementsActions } from '../../../transport-requirements/redux/actions'
import { transportVehicleActions } from '../../../transport-vehicle/redux/actions'
import { transportDepartmentActions } from "../../../transport-department/redux/actions"
import { generatePlanFastestMove } from "../../../transportHelper/generatePlan"

import { getListDateBetween, isTimeZoneDateSmaller } from "../../../transportHelper/compareDateTimeZone"

function TransportPlanGenerate(props) {
    // let allTransportRequirements;
    let {transportRequirements, transportVehicle, transportDepartment, transportPlan} = props;
    const [formSchedule, setFormSchedule] = useState({
        code: "",
        startDate: "",
        endDate: "",
        name: "Kế hoạch vận chuyển",
        inDay: 0,
        disableGenerateButtonStatus: true,
    });
    const [listPlanGenerate, setListPlanGenerate] = useState([])

    const [currentPlan, setCurrentPlan] = useState();
    /**
     * Danh sách tất cả transportrequirements theo thứ tự ưu tiên
     * [transportRequirement, ...]
     */
    const [listRequirements, setListRequirements] = useState([])
    const [listAll, setListAll] = useState({
        allRequirements: [],
        allPlans: [],
        allVehicles: [],
        allCarriers: [],
    })
    /**
     * Danh sách transportrequirements đã lựa chọn
     * [id, id...]
     */
    const [listSelectedRequirements, setListSelectedRequirements] = useState([])
    const handleClickCreateCode = () => {
        setFormSchedule({
            code: generateCode("KHVC"),
        })
    }

    const handlePlanNameChange = (e) => {
        setFormSchedule({
            ...formSchedule,
            name: e.target.value,
        })
    }

    const handleStartDateChange = async (value) => {
        await setFormSchedule({
            ...formSchedule,
            startDate: formatToTimeZoneDate(value),
        })
    }

    const handleEndDateChange = async (value) => {
        console.log(value, " end date change");
        await setFormSchedule({
            ...formSchedule,
            endDate: formatToTimeZoneDate(value),
        })
    }
    const handleDayChange = (e) => {
        setFormSchedule({
            inDay: Number(e.target.value),
        })
    }

    const handleSubmitGenerate = () => {
        // console.log(listAll);
        let generatePlan = generatePlanFastestMove(listAll.allRequirements, listAll.allPlans, listAll.allVehicles, listAll.allCarriers, formSchedule.inDay, formSchedule.startDate);
        console.log(generatePlan);
        let {plans} = generatePlan;
        let res=[]
        if (plans && plans.length!==0){
            plans.map(item => {
                if (item.transportRequirements && item.transportRequirements.length!==0){
                    res.push(item);
                }
            })
        }
        setListPlanGenerate(res);
    }

    const handleShowDetailInfo = (transportPlan) => {
        setCurrentPlan(transportPlan);
        window.$('#modal-detail-info-transport-plan-generate').modal('show');
    }

    const save = () => {
        // props.createTransportPlan(formSchedule);
    }
    
    useEffect(() => {
        let allPlans = [];
        if (transportPlan && transportPlan.lists){
            allPlans = transportPlan.lists;
        }
        setListAll({
            ...listAll,
            allPlans: allPlans,
        })
        props.getAllTransportRequirements({page: 1, limit: 100, status: "2"})
        props.getAllTransportDepartments();
        props.getUserByRole({currentUserId: localStorage.getItem('userId'), role: 1})
        props.getAllTransportVehicles();
    }, [transportPlan]);

    useEffect(() => {
        if (transportRequirements && transportRequirements.lists){
            setListAll({
                ...listAll,
                allRequirements: transportRequirements.lists,
            })
        }
    }, [transportRequirements])

    useEffect(() => {
        // if (isTimeZoneDateSmaller(formSchedule.startDate, formSchedule.endDate)){
            let lenDay = getListDateBetween(formSchedule.startDate, formSchedule.endDate).length;
            console.log(lenDay, " so ngay");
            if (lenDay !==0){
                setFormSchedule({
                    ...formSchedule,
                    inDay: lenDay
                })
            }
        // }
    }, [formSchedule.startDate, formSchedule.endDate])

    useEffect(() => {
        if (formSchedule.inDay && Number(formSchedule.inDay) > 0){
            setFormSchedule({
                ...formSchedule,
                disableGenerateButtonStatus: false,
            })
        }
        else{
            setFormSchedule({
                ...formSchedule,
                disableGenerateButtonStatus: true,
            })
        }
    }, [formSchedule.inDay])

    useEffect(() => {
        let allVehicles=[];
        let allCarriers=[];
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
                    allCarriers.push(userId);
                })
            }
        }
        
        // console.log(allCarriers);
        // console.log(allVehicles);
        setListAll({
            ...listAll,
            allVehicles: allVehicles,
            allCarriers: allCarriers,
        })
    }, [transportDepartment, transportVehicle])

    return (
        <React.Fragment>
            <ButtonModal
                    onButtonCallBack={handleClickCreateCode}
                    modalID={"modal-generate-transport-plan"}
                    button_name={"Tạo kế hoạch tự động"}
                    title={"Tạo kế hoạch tự động"}
                    style={ { marginBottom: '10px', marginTop: '2px', marginLeft: '5px' }}
            />
            <DialogModal
                modalID="modal-generate-transport-plan" 
                isLoading={false}
                formID="form-generate-transport-requirements"
                title={"Tạo kế hoạch vận chuyển tự động"}
                msg_success={"success"}
                msg_faile={"fail"}
                func={save}
                // disableSubmit={!isFormValidated()}
                size={100}
                maxWidth={500}
            >
            <form id="form-generate-transport-requirements" >
            
                <div className="box-body">
                    <TransportPlanDetailInfo
                        currentTransportPlan = {currentPlan}
                    />

                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">

                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                    <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3">
                                        <div className="form-group">
                                            <label>
                                                Từ ngày <span className="attention"> * </span>
                                            </label>
                                            <DatePicker
                                                id={`start_date_generate_plan`}
                                                value={formatDate(formSchedule.startDate)}
                                                onChange={handleStartDateChange}
                                                disabled={false}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3">
                                        <div className={`form-group`}>
                                            <label>
                                                Tới ngày
                                                <span className="attention"> * </span>
                                            </label>
                                            <DatePicker
                                                id={`end_date_generate_plan`}
                                                value={formatDate(formSchedule.endDate)}
                                                onChange={handleEndDateChange}
                                                disabled={false}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3">
                                        <div className="form-group" style={{marginTop: "26px"}}>
                                            <button type="button" 
                                                    className="btn btn-success" 
                                                    title={"Tạo kế hoạch"} 
                                                    onClick={() => handleSubmitGenerate()}
                                                    disabled={formSchedule.disableGenerateButtonStatus}
                                            >
                                                {"Tạo kế hoạch"}
                                            </button>
                                        </div>
                                    </div>
                                    
                                </div>
                                {/* <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                    <div className="form-group">
                                        <label>
                                            Số ngày <span className="attention"> * </span>
                                        </label>
                                        <input type="number" onChange={handleDayChange}></input>
                                    </div>
                                </div> */}
                    </div>
                
                    <table id={"tableId"} className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th className="col-fixed" style={{ width: 60 }}>{"Số thứ tự"}</th>
                            {/* <th>{"Mã kế hoạch"}</th>
                            <th>{"Tên kế hoạch"}</th>
                            <th>{"Trạng thái"}</th> */}
                            <th>{"Thời gian"}</th>
                            {/* <th>{"Người phụ trách"}</th> */}
                            <th>{"Hành động"}</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                    (listPlanGenerate && listPlanGenerate.length !== 0) &&
                    listPlanGenerate.map((x, index) => (
                            x &&
                            <tr key={index}>
                                <td>{index + 1}</td>
                                {/* <td>{x.code}</td>
                                <td>{x.name}</td> */}
                                {/* <td>{getPlanStatus(x.status)}</td> */}
                                <td>{formatDate(x.date)+" - "+formatDate(x.date)}</td>
                                
                                {/* <td>{x.date+" - "+x.date}</td> */}
                                {/* <td>{""}</td> */}
                                <td style={{ textAlign: "center" }}>
                                    <a className="edit text-green" 
                                        style={{ width: '5px' }} 
                                        title={"Thông tin chi tiết kế hoạch"} 
                                        onClick={() => handleShowDetailInfo(x)}
                                    >
                                        <i className="material-icons">visibility
                                        </i>
                                    </a>
                                    {/* <a className="edit text-yellow" style={{ width: '5px' }} 
                                        title={"Chỉnh sửa kế hoạch"} 
                                        // onClick={() => handleEditPlan(x)}
                                    >
                                        <i className="material-icons">edit</i>
                                    </a> */}
                                    {/* <DeleteNotification
                                        content={"Xóa kế hoạch vận chuyển"}
                                        data={{
                                            id: x._id,
                                            info: x.code
                                        }}
                                        func={handleDelete}
                                    /> */}
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
            
                </div>
            </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    const {transportRequirements, transportVehicle, transportDepartment} = state;
    return {transportRequirements, transportVehicle, transportDepartment}
}

const actions = {
    getAllTransportRequirements: transportRequirementsActions.getAllTransportRequirements,
    createTransportPlan: transportPlanActions.createTransportPlan,
    getAllTransportDepartments: transportDepartmentActions.getAllTransportDepartments,
    getAllTransportVehicles: transportVehicleActions.getAllTransportVehicles,
    getUserByRole: transportDepartmentActions.getUserByRole,
}

const connectedTransportPlanGenerate = connect(mapState, actions)(withTranslate(TransportPlanGenerate));
export { connectedTransportPlanGenerate as TransportPlanGenerate };