import React, { Component } from 'react';
import { connect } from 'react-redux';

import { UserActions } from "../../../../super-admin/user/redux/actions";
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions';
import { createKpiSetActions } from '../redux/actions';
import { createUnitKpiActions } from '../../../organizational-unit/creation/redux/actions';
import {performTaskAction} from '../../../../task/task-perform/redux/actions'
import { ModalCreateEmployeeKpi } from './employeeKpiAddTargetModal';
import { ModalCreateEmployeeKpiSet } from './employeeKpiCreateModal';
import { ModalEditEmployeeKpi } from './employeeKpiEditTargetModal';
import Swal from 'sweetalert2';
import { getStorage } from '../../../../../config'
import { SlimScroll} from '../../../../../common-components';
import {Comment} from './comment'
import { withTranslate } from 'react-redux-multilingual';
import { DatePicker, DialogModal, SelectBox } from '../../../../../../src/common-components';

import getEmployeeSelectBoxItems from '../../../../task/organizationalUnitHelper';

var translate = '';
class CreateEmployeeKpiSet extends Component {
    constructor(props) {
        super(props);
        var idUser = getStorage("userId");
        translate = this.props.translate;
        this.state = {
            employeeKpiSet: {
                creator: "", //localStorage.getItem("id")
                organizationUnit: "",
                date: "",
                approver: null
            },
            adding: false,
            editing: false,
            editingTarget: "",
            submitted: false,
            commenting: false,
            currentRole: localStorage.getItem("currentRole"),
            fixTableWidth: false,
            comment : {
                creator: idUser,
                description: '',
                files: [],
            },
            newComment : {
                description: ''
            },
            commentOfComment : {
                creator: idUser,
                description: '',
                files: [],
            }
        };
    }
    componentDidMount() {
        this.props.getDepartment();
        this.props.getEmployeeKpiSet()
        this.props.getCurrentKPIUnit(localStorage.getItem('currentRole'));
        this.props.getAllUserSameDepartment(localStorage.getItem("currentRole"));
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        const { user } = this.props;

        // Khi truy vấn API đã có kết quả
        if (!this.state.employeeKpiSet.approver && user.userdepartments && user.userdepartments.deans) {
            if (Object.keys(user.userdepartments.deans).length > 0){ // Nếu có trưởng đơn vị
                let members = user.userdepartments.deans[Object.keys(user.userdepartments.deans)[0]].members;
                if (members.length) {
                    this.setState(state =>{
                        return{
                            ...state,
                            employeeKpiSet: {
                                ...this.state.employeeKpiSet,
                                approver: members[0]
                            }
                        };
                    });
                    return false; // Sẽ cập nhật lại state nên không cần render
                }
            }
        }
        return true;
    }

    adjustSize = async (innerWidth) => {
        await this.setState(state => {
            return {
                ...state,
                fixTableWidth: (innerWidth > 992 ? false : true) // 992: kích thước Bootstrap md
            }
        })
    }

    handleCommentEmployeeKpiSet = async () => {
        await this.setState(state => {
            return {
                ...state,
                commenting: !state.commenting,
            }
        })
    }

    handleEditEmployeeKpiSet = async (status) => {
        if (status === 0) {
            await this.setState(state => {
                return {
                    ...state,
                    editing: !state.editing
                }
            })
        } else if(status === 1){
            Swal.fire({
                title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.handle_edit_kpi.approving'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
            })
        } else {
            Swal.fire({
                title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.handle_edit_kpi.activated'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
            })
        }
    }

    handleNotInitializeOrganizationalUnitKpi = async () => {
            Swal.fire({
                title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.not_initialize_organiztional_unit_kpi'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
            })
    }

    handleNotActivatedOrganizationalUnitKpi = async () => {
        Swal.fire({
            title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.not_activate_organiztional_unit_kpi'),
            type: 'warning',
            confirmButtonColor: '#3085d6',
            confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
        })
    }
    
    handleDeleteEmployeeKpiSet = async (id, employeeKpiSet) => {
        if (employeeKpiSet === 0) {
            Swal.fire({
                title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.delete_kpi.kpi'),
                type: 'success',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
            }).then((res) => {
                if (res.value) {
                    // Xóa KPI
                    this.props.deleteEmployeeKpiSet(id);
                }
            });
        } else if(employeeKpiSet === 1){
            Swal.fire({
                title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.delete_kpi.approving'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
            })
        } else {
            Swal.fire({
                title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.delete_kpi.activated'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
            })
        }
    }

    handleApproverChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                    employeeKpiSet: {
                        ...state.employeeKpiSet,
                        approver: value,
                    }
            }
        });
    }

    handleSaveEditEmployeeKpiSet = async (id, organizationUnit) => {
        var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        var defaultTime =  [month, year].join('-');

        if(this.state.employeeKpiSet.date === ""){
            await this.setState(state => {
                return {
                    ...state,
                    employeeKpiSet: {
                        ...state.employeeKpiSet,
                        date: defaultTime,
                    }
                }
            })
        }
        await this.setState(state => {
            return {
                ...state,
                editing: !state.editing,
                employeeKpiSet: {
                    ...state.employeeKpiSet,
                }
            }
        })
        var { employeeKpiSet } = this.state;
        if (employeeKpiSet.approver && employeeKpiSet.date ) {//&& kpipersonal.creater
            this.props.editEmployeeKpiSet(id, employeeKpiSet);
        }
    }

    handleCancelEditEmployeeKpiSet = async () => {
        await this.setState(state => {
            return {
                ...state,
                editing: !state.editing
            }
        })
    }

    formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [month, year].join('-');
    }

    handleDeleteEmployeeKpi = (employeeKpiSetStatus, id, employeeKpiSet) => {
        if (employeeKpiSetStatus === 0) {
            Swal.fire({
                title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.delete_kpi.kpi_target'),
                type: 'success',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
            }).then((res) => {
                if (res.value) {
                    this.props.deleteEmployeeKpi(id, employeeKpiSet);
                }
            });
        } else if (employeeKpiSetStatus === 1) {
            Swal.fire({
                title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.delete_kpi.approving'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
            })
        } else {
            Swal.fire({
                title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.delete_kpi.activated'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
            })
        }

    }

    handleEditEmployeeKpi = async (employeeKpiStatus, target) => {
        if (employeeKpiStatus === 0) {
            await this.setState(state => {
                return {
                    ...state,
                    editingTarget: target._id
                }
            });
            window.$(`#editEmployeeKpi${target._id}`).modal("show");
        } else if (employeeKpiStatus === 1) {
            Swal.fire({
                title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.edit_target.approving'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
            })
        } else {
            Swal.fire({
                title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.edit_target.activated'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
            })
        }

    }

    handleCheckEmployeeKpiStatus = (employeeKpiStatus) => {
        if (employeeKpiStatus === null) {
            return translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.check_status_target.not_approved');
        } else if (employeeKpiStatus === 0) {
            return translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.check_status_target.edit_request');
        } else if (employeeKpiStatus === 1) {
            return translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.check_status_target.activated');
        } else if (employeeKpiStatus === 2) {
            return translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.check_status_target.not_finished')
        }
    }

    handleCheckEmployeeKpiSetStatus = (employeeKpiSetStatus) => {
        if (employeeKpiSetStatus === 0) {
            return <span style={{fontWeight: "bold"}} >{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.kpi_status.setting_up')} <i className="fa fa-cogs" style={{ fontSize: "16px"}}></i></span>;
        } else if (employeeKpiSetStatus === 1) {
            return <span style={{fontWeight: "bold"}} className="text-danger">{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.kpi_status.awaiting_approval')} <i className="fa fa-hourglass-half" style={{ fontSize: "16px"}}></i></span>;
        } else if (employeeKpiSetStatus === 2) {
            return <span style={{fontWeight: "bold"}} className="text-success">{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.kpi_status.activated')} <i className="fa fa-check-circle" style={{ fontSize: "16px"}}></i></span>;
        }
    }

    handleRequestApproveEmployeeKpiSet = (kpipersonal) => {
        var totalWeight = kpipersonal.kpis.map(item => parseInt(item.weight)).reduce((sum, number) => sum + number, 0);
        if (totalWeight === 100) {
            Swal.fire({
                title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.request_approval_kpi.approve'),
                type: 'success',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
            }).then((res) => {
                if (res.value) {
                    this.props.updateEmployeeKpiSetStatus(kpipersonal._id, 1);
                }
            });
        } else {
            Swal.fire({
                title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.request_approval_kpi.not_enough_weight'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
            })
        }
    }

    handleCancelApproveEmployeeKpiSet = (kpipersonal) => {
        if (kpipersonal.status === 1) {
            Swal.fire({
                title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.cancel_approve.cancel'),
                type: 'success',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
            }).then((res) => {
                if (res.value) {
                    this.props.updateEmployeeKpiSetStatus(kpipersonal._id, 0);
                }
            });
        } else {
            Swal.fire({
                title: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.cancel_approve.activated'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
            })
        }
    }

    onFilesChange  = (files) => {
        this.setState((state)=>{
            return {
                ...state,
                comment: {
                    ...state.comment,
                    files: files,
                }
            }
        })
    }
    onCommentFilesChange  = (files) => {
        this.setState((state)=>{
            return {
                ...state,
                commentOfComment: {
                    ...state.commentOfComment,
                    files: files,
                }
            }
        })
    }
    submitComment = async (id) => {
        var { comment } = this.state;
        const data = new FormData();
        data.append("idKPI", id);
        data.append("creator", comment.creator);
        data.append("description", comment.description);
        comment.files && comment.files.forEach(x=>{
            data.append("files", x);
        })
        console.log(comment)
        if(comment.creator && comment.description){
            this.props.createComment(data);
        }
        // Reset state cho việc thêm mới action
        await this.setState(state => {
            return {
                ...state,
                comment: {
                    ...state.comment,
                    description: "",
                    files: [],
                },
            }
        })
    }
    submitCommentOfComment = async (id) => {
        var { commentOfComment } = this.state;
        const data = new FormData();
        data.append("idComment", id);
        data.append("creator", commentOfComment.creator);
        data.append("description", commentOfComment.description);
        commentOfComment.files && commentOfComment.files.forEach(x=>{
            data.append("files", x);
        })
        if(commentOfComment.creator && commentOfComment.description){
            console.log("Đỗ Tiến Thành")
            this.props.createCommentOfComment(data);
        }
        // Reset state cho việc thêm mới action
        await this.setState(state => {
            return {
                ...state,
                commentOfComment: {
                    ...state.commentOfComment,
                    description: "",
                    files: [],
                },
            }
        })
    }

    editComment = async (id) => {
        let {newComment} = this.state;
        if(newComment.description){
            this.props.editComment(id,newComment)
        }
    }
    handleDeleteComment = (id) => {
        this.props.deleteComment(id,this.props.createEmployeeKpiSet.currentKPI._id)
    }
    render() {
        var unitList, currentUnit, currentKPI, userdepartments, items;
        const { commenting, editing, editingTarget } = this.state;
        const { department, createEmployeeKpiSet, user, translate, createKpiUnit } = this.props;

        if (user.organizationalUnitsOfUser) {
            unitList = user.organizationalUnitsOfUser;
            currentUnit = unitList.filter(item => (
                item.deans.includes(this.state.currentRole)
                || item.employees.includes(this.state.currentRole)
                || item.viceDeans.includes(this.state.currentRole)));
        }
        
        if (createEmployeeKpiSet.currentKPI) currentKPI = createEmployeeKpiSet.currentKPI;
        let deans;
        if (user.userdepartments) {
            userdepartments = user.userdepartments;
            deans = getEmployeeSelectBoxItems([user.userdepartments], true, false, false);
        }
        

        var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        var defaultTime =  [month, year].join('-');
        
        return (
            <div className="box">
                <div className="box-body">
                    <div className="row">
                        {(typeof currentKPI !== 'undefined' && currentKPI !== null) ?
                            <div className="col-xs-12 col-sm-12">
                                <div style={{ marginLeft: "-10px", marginBottom: "10px" }}>
                                    {editing ?
                                        <React.Fragment>
                                            <a className="btn btn-app" onClick={() => this.handleSaveEditEmployeeKpiSet(currentKPI._id, currentUnit && currentUnit[0]._id)} title="Lưu thông tin chỉnh sửa">
                                                <i className="fa fa-save" style={{ fontSize: "16px" }}></i>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.general_information.save')}
                                            </a>
                                            <a className="btn btn-app" onClick={() => this.handleCancelEditEmployeeKpiSet()} title="Hủy bỏ chỉnh sửa">
                                                <i className="fa fa-ban" style={{ fontSize: "16px" }}></i>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.general_information.cancel')}
                                            </a>
                                        </React.Fragment> :
                                        <a className="btn btn-app" onClick={() => this.handleEditEmployeeKpiSet(currentKPI.status)} title="Chỉnh sửa thông tin chung">
                                            <i className="fa fa-edit" style={{ fontSize: "16px" }}></i>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.general_information.edit')}
                                        </a>
                                    }
                                    
                                    <a className="btn btn-app" onClick={() => this.handleDeleteEmployeeKpiSet(currentKPI._id, currentKPI.status)} title="Xóa KPI tháng">
                                        <i className="fa fa-trash" style={{ fontSize: "16px" }}></i>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.general_information.delete')}
                                    </a>
                                    
                                    <a className="btn btn-app" data-toggle="modal" data-target="#createEmployeeKpi" data-backdrop="static" data-keyboard="false">
                                        <i className="fa fa-plus-circle" style={{ fontSize: "16px" }}></i>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.add_target')}
                                    </a>
                                    <ModalCreateEmployeeKpi employeeKpiSet={currentKPI._id} organizationalUnit={currentUnit && currentUnit[0]} />

                                    {currentKPI.status === 0 ? 
                                        <a className="btn btn-app" onClick={() => this.handleRequestApproveEmployeeKpiSet(currentKPI)}>
                                            <i className="fa fa-external-link-square" style={{ fontSize: "16px" }}></i>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.request_approval')}
                                        </a> 
                                        : <a className="btn btn-app" onClick={() => this.handleCancelApproveEmployeeKpiSet(currentKPI)}>
                                            <i className="fa fa-minus-square" style={{ fontSize: "16px" }}></i>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.cancel_request_approval')}
                                        </a>
                                    }
                                </div>

                                <div className="" style={{ marginBottom: "10px" }}>
                                    <h4 style={{ display: "inline", fontWeight: "600" }}>
                                        {translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.general_information.general_information')} {this.formatDate(currentKPI.date)} ({currentKPI.organizationalUnit.name})
                                    </h4>
                                </div>
                                
                                {editing ? deans &&
                                    <div className="col-sm-6 col-xs-12 form-group">
                                        <label>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set_modal.approver')}</label>
                                        <SelectBox
                                            id={`createEmployeeKpiSet`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={deans}
                                            multiple={false}
                                            onChange={this.handleApproverChange}
                                            value={this.state.employeeKpiSet.approver}
                                        />
                                    </div> 
                                    : <div className="form-group">
                                        <span style={{ fontWeight: "600" }}>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.approver')}: </span>
                                        <span>{currentKPI.approver.name}</span>
                                    </div>
                                }

                                {editing &&
                                   <div className="col-sm-6 col-xs-12 form-group">
                                        <label>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set_modal.month')}</label>
                                        <DatePicker 
                                        style={{ width: "60%" }}
                                            id="month"   
                                            dateFormat="month-year"             // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm 
                                            value={defaultTime}                 // giá trị mặc định cho datePicker    
                                            onChange={this.formatDate}
                                            disabled={false}                    // sử dụng khi muốn disabled, mặc định là false
                                        />
                                    </div>
                                }

                                {editing === false &&
                                    <div>
                                        <span>{currentKPI.kpis.length} {translate('kpi.evaluation.employee_evaluation.target')} - {translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.weight_total')} </span>
                                        <span>{currentKPI.kpis.map(item => parseInt(item.weight)).reduce((sum, number) => sum + number, 0)}/100 - </span>
                                        {currentKPI.kpis.map(item => parseInt(item.weight)).reduce((sum, number) => sum + number, 0) !== 100 ?
                                            <span className="text-danger" style={{fontWeight: "bold"}}>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.not_satisfied')}</span>
                                            : <span className="text-success" style={{fontWeight: "bold"}}>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.satisfied')}</span>
                                        }
                                        <span> - </span>
                                        {this.handleCheckEmployeeKpiSetStatus(currentKPI.status)}
                                    </div>
                                }

                                <div>
                                    {(typeof currentKPI !== 'undefined' && currentKPI !== null) &&
                                        <h4 style={{ display: "inline-block", fontWeight: "600", marginTop: "20px" }}>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.target_list')}</h4>
                                    }

                                    <SlimScroll outerComponentId="kpi_table" innerComponentId="kpipersonal_table" innerComponentWidth="992px" activate={this.state.fixTableWidth}/>
                                    <div id="kpi_table">
                                        <table className="table table-bordered table-striped table-hover" id="kpipersonal_table">
                                            <thead>
                                                <tr>
                                                    <th title={translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.no_')} style={{ width: '40px' }}>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.no_')}</th>
                                                    <th title={translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.target_name')} className="col-lg-3 col-sm-3">{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.target_name')}</th>
                                                    <th title={translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.parents_target')} className="col-lg-3 col-sm-3">{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.parents_target')}</th>
                                                    <th title={translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.evaluation_criteria')} className="col-lg-2 col-sm-2">{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.evaluation_criteria')}</th>
                                                    <th title={translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.weight')} className="col-lg-1 col-sm-1">{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.weight')}</th>
                                                    <th title={translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.status')} className="col-lg-1 col-sm-1">{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.status')}</th>
                                                    <th title={translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.action')} className="col-lg-1 col-sm-1">{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.action')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    (typeof currentKPI === 'undefined' || currentKPI === null) ? 
                                                        <tr><td colSpan={7}><center>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.not_initialize')} {this.formatDate(Date.now())}</center></td></tr> 
                                                        : (currentKPI.kpis.map((item, index) =>
                                                            <tr key={index + 1}>
                                                                <td title={index + 1}>{index + 1}</td>
                                                                <td title={item.name}>{item.name}</td>
                                                                <td title={item.parent ? item.parent.name : null}>{item.parent ? item.parent.name : null}</td>    
                                                                <td title={item.criteria}>{item.criteria}</td>
                                                                <td title={item.weight}>{item.weight}</td>
                                                                <td title={this.handleCheckEmployeeKpiStatus(item.status)}>{this.handleCheckEmployeeKpiStatus(item.status)}</td>
                                                                <td>
                                                                    <a data-target={`#editEmployeeKpi${item._id}`} style={{ color: "#FFC107", fontSize: "16px" }} title={translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.action_title.edit')} data-toggle="modal" onClick={() => this.handleEditEmployeeKpi(currentKPI.status, item)}><i className="fa fa-edit"></i></a>
                                                                    {editingTarget === item._id && <ModalEditEmployeeKpi target={item}/>}
                                                                    {item.type !== 0 ? 
                                                                        <a className="copy" title={translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.action_title.content')}><i className="material-icons">notification_important</i></a> 
                                                                        : <a style={{ color: "#E34724", fontSize: "16px" }} title={translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.action_title.delete')} onClick={() => this.handleDeleteEmployeeKpi(currentKPI.status, item._id, currentKPI._id)}><i className="fa fa-trash"></i></a> 
                                                                    }
                                                                </td>
                                                            </tr>
                                                        ))
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="row" style={{display:'flex',flex:'no-wrap',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                                    <div className="col-xs-12 col-sm-12 col-md-6">
                                        <Comment currentKPI = {currentKPI}/>
                                    </div>
                                </div>
                            </div>
                            : <div className="col-xs-12">
                                <div style={{marginLeft: "-10px"}}>
                                    {(typeof createKpiUnit.currentKPI !== 'undefined' && createKpiUnit.currentKPI !== null) ?
                                        <div>{ createKpiUnit.currentKPI.status !== 1 ?
                                            <div>  
                                                <a className="btn btn-app" data-toggle="modal" data-target="#startKPIPersonal" data-backdrop="static" data-keyboard="false" onClick={() => {this.handleNotActivatedOrganizationalUnitKpi()}}>
                                                    <i className="fa fa-calendar-plus-o" style={{ fontSize: "16px" }}></i>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.initialize_kpi_newmonth')}
                                                </a>
                                            </div>
                                            : <div>
                                                <a className="btn btn-app" data-toggle="modal" data-target="#createEmployeeKpiSet" data-backdrop="static" data-keyboard="false">
                                                    <i className="fa fa-calendar-plus-o" style={{ fontSize: "16px" }}></i>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.initialize_kpi_newmonth')}
                                                </a>
                                                <ModalCreateEmployeeKpiSet organizationalUnit={currentUnit && currentUnit[0]} />
                                            </div>
                                            }
                                        </div>
                                        : <a className="btn btn-app" data-toggle="modal" data-target="#startKPIPersonal" data-backdrop="static" data-keyboard="false" onClick={() => {this.handleNotInitializeOrganizationalUnitKpi()}}>
                                            <i className="fa fa-calendar-plus-o" style={{ fontSize: "16px" }}></i>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.initialize_kpi_newmonth')}
                                        </a>
                                    }
                                </div>
                                <h3 style={{ display: "inline-block", fontWeight: "600" }}>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.general_information.general_information')} {this.formatDate(Date.now())}</h3>
                                <p>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.not_initialize')}</p>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

function mapState(state) {
    const { department, createEmployeeKpiSet, user, createKpiUnit,auth } = state;
    return { department, createEmployeeKpiSet, user, createKpiUnit,auth };
}

const actionCreators = {
    getAllUserSameDepartment: UserActions.getAllUserSameDepartment,
    getDepartment: UserActions.getDepartmentOfUser,
    getEmployeeKpiSet: createKpiSetActions.getEmployeeKpiSet,
    deleteEmployeeKpi: createKpiSetActions.deleteEmployeeKpi,
    editEmployeeKpiSet: createKpiSetActions.editEmployeeKpiSet,
    deleteEmployeeKpiSet: createKpiSetActions.deleteEmployeeKpiSet,
    updateEmployeeKpiSetStatus: createKpiSetActions.updateEmployeeKpiSetStatus,
    createComment : createKpiSetActions.createComment,
    createCommentOfComment: createKpiSetActions.createCommentOfComment,
    getCurrentKPIUnit: createUnitKpiActions.getCurrentKPIUnit,
    editComment : createKpiSetActions.editComment,
    deleteComment : createKpiSetActions.deleteComment,
    downloadFile: performTaskAction.downloadFile
    
};

const connectedCreateEmployeeKpiSet = connect( mapState, actionCreators )( withTranslate(CreateEmployeeKpiSet) );
export { connectedCreateEmployeeKpiSet as CreateEmployeeKpiSet };