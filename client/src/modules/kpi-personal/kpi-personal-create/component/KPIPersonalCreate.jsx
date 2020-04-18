import React, { Component } from 'react';
import { connect } from 'react-redux';

import { UserActions } from "../../../super-admin-management/users-management/redux/actions";
import { DepartmentActions } from '../../../super-admin-management/departments-management/redux/actions';
import { createKpiActions } from '../redux/actions';
import { createUnitKpiActions } from '../../../kpi-unit/kpi-unit-create/redux/actions';

import { ModalAddTargetKPIPersonal } from './ModalAddTargetKPIPersonal';
import { ModalStartKPIPersonal } from './ModalStartKPIPersonal';
import { ModalEditTargetKPIPersonal } from './ModalEditTargetKPIPersonal';
import Swal from 'sweetalert2';

import { SlimScroll } from '../../../../common-components/index.js';
import { withTranslate } from 'react-redux-multilingual';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// sau khi gộp vào prj mới nhớ đổi đường dẫn của DepartmentActions và UserActions

var translate = '';
class KPIPersonalCreate extends Component {
    componentDidMount() {
        this.props.getDepartment();//localStorage.getItem('id');
        this.props.getCurrentKPIPersonal()//localStorage.getItem('id');
        this.props.getCurrentKPIUnit(localStorage.getItem('currentRole'));
        this.handleResizeColumn();
    }

    componentDidUpdate() {
        let script = document.createElement('script');
        script.src = '../lib/main/js/CoCauToChuc.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }

    constructor(props) {
        super(props);
        translate = this.props.translate;
        this.state = {
            kpipersonal: {
                creater: "", //localStorage.getItem("id")
            },
            adding: false,
            editing: false,
            editingTarget: "",
            submitted: false,
            commenting: false,
            currentRole: localStorage.getItem("currentRole"),
            fixTableWidth: false
        };

        window.addEventListener("resize", () => {
            this.adjustSize(window.innerWidth);
        }, {passive: true});
    }

    // function: notification the result of an action
    notifysuccess = (message) => toast.success(message, {containerId: 'toast-notification'});
    notifyerror = (message) => toast.error(message, {containerId: 'toast-notification'});
    notifywarning = (message) => toast.warning(message, {containerId: 'toast-notification'});

    adjustSize = async (innerWidth) => {
        await this.setState(state => {
            return {
                ...state,
                fixTableWidth: (innerWidth > 992 ? false : true) // 992: kích thước Bootstrap md
            }
        })
    }

    handleCommentKPI = async () => {
        await this.setState(state => {
            return {
                ...state,
                commenting: !state.commenting,
            }
        })
    }

    handleEditKPi = async (status) => {
        if (status === 0) {
            await this.setState(state => {
                return {
                    ...state,
                    editing: !state.editing
                }
            })
        } else if(status === 1){
            Swal.fire({
                title: translate('kpi_personal.kpi_personal_create.handle_edit_kpi.approving'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Xác nhận'
            })
        } else {
            Swal.fire({
                title: translate('kpi_personal.kpi_personal_create.handle_edit_kpi.activated'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Xác nhận'
            })
        }
    }

    handleNotInitializeKPIUnit = async () => {
            Swal.fire({
                title: 'Chưa khởi tạo KPI đơn vị',
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Xác nhận'
            })
    }

    handleNotActivatedKPIUnit = async () => {
        Swal.fire({
            title: 'Chưa kích hoạt KPI đơn vị',
            type: 'warning',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Xác nhận'
        })
    }
    
    deleteKPI = async (id, status) => {
        if (status === 0) {
            Swal.fire({
                title: translate('kpi_personal.kpi_personal_create.delete_kpi.kpi'),
                type: 'success',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Xác nhận'
            }).then((res) => {
                if (res.value) {
                    // Xóa KPI
                    this.props.deleteKPIPersonal(id);
                    this.notifysuccess(translate('kpi_personal.kpi_personal_create.general_information.delete_success'));
                }
            });
        } else if(status === 1){
            Swal.fire({
                title: translate('kpi_personal.kpi_personal_create.delete_kpi.approving'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Xác nhận'
            })
        } else {
            Swal.fire({
                title: translate('kpi_personal.kpi_personal_create.delete_kpi.activated'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Xác nhận'
            })
        }
    }

    saveEdit = async (id, unit) => {
        await this.setState(state => {
            return {
                ...state,
                editing: !state.editing,
                kpipersonal: {
                    ...state.kpipersonal,
                    unit: unit,
                    time: this.time.value,
                    approver: this.approver.value
                }
            }
        })
        var { kpipersonal } = this.state;
        if (kpipersonal.unit && kpipersonal.time ) {//&& kpipersonal.creater
            this.props.editKPIPersonal(id, kpipersonal);
            this.notifysuccess(translate('kpi_personal.kpi_personal_create.general_information.edit_success'));
        }
        else{
            this.notifyerror(translate('kpi_personal.kpi_personal_create.edit_target.general_information.edit_failure'));
        }
    }

    cancelEdit = async () => {
        await this.setState(state => {
            return {
                ...state,
                editing: !state.editing
            }
        })
    }

    handleResizeColumn = () => {
        window.$(function () {
            var pressed = false;
            var start = undefined;
            var startX, startWidth;

            window.$("table thead tr th:not(:last-child)").mousedown(function (e) {
                start = window.$(this);
                pressed = true;
                startX = e.pageX;
                startWidth = window.$(this).width();
                window.$(start).addClass("resizing");
            });

            window.$(document).mousemove(function (e) {
                if (pressed) {
                    window.$(start).width(startWidth + (e.pageX - startX));
                }
            });

            window.$(document).mouseup(function () {
                if (pressed) {
                    window.$(start).removeClass("resizing");
                    pressed = false;
                }
            });
        });
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

    deleteTargetKPIKPIPersonal = (statusTarget, status, id, kpipersonal) => {
        if (statusTarget === null) {
            Swal.fire({
                title: translate('kpi_personal.kpi_personal_create.delete_kpi.kpi_target'),
                type: 'success',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Xác nhận'
            }).then((res) => {
                if (res.value) {
                    this.props.deleteTargetKPIPersonal(id, kpipersonal);
                    this.notifysuccess(translate('kpi_personal.kpi_personal_create.delete_kpi.delete_success'));
                    
                }
            });
        } else if (status === 1) {
            Swal.fire({
                title: translate('kpi_personal.kpi_personal_create.delete_kpi.approving'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Xác nhận'
            })
        } else {
            Swal.fire({
                title: translate('kpi_personal.kpi_personal_create.delete_kpi.activated'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Xác nhận'
            })
        }

    }

    editTargetKPIPersonal = async (statusKPI, target) => {
        if (statusKPI === 0) {
            await this.setState(state => {
                return {
                    ...state,
                    editingTarget: target._id
                }
            })
            var element = document.getElementsByTagName("BODY")[0];
            element.classList.add("modal-open");
            var modal = document.getElementById(`editTargetKPIPersonal${target._id}`);
            modal.classList.add("in");
            modal.style = "display: block; padding-right: 17px;";
        } else if (statusKPI === 1) {
            Swal.fire({
                title: translate('kpi_personal.kpi_personal_create.edit_target.approving'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Xác nhận'
            })
        } else {
            Swal.fire({
                title: translate('kpi_personal.kpi_personal_create.edit_target.activated'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Xác nhận'
            })
        }

    }

    checkStatusTarget = (statusTarget) => {
        if (statusTarget === null) {
            return translate('kpi_personal.kpi_personal_create.check_status_target.not_approved');
        } else if (statusTarget === 0) {
            return translate('kpi_personal.kpi_personal_create.check_status_target.edit_request');
        } else if (statusTarget === 1) {
            return translate('kpi_personal.kpi_personal_create.check_status_target.activated');
        } else if (statusTarget === 2) {
            return translate('kpi_personal.kpi_personal_create.check_status_target.not_finished')
        }
    }

    checkStatusKPI = (statusKPI) => {
        if (statusKPI === 0) {
            return <span style={{ color: "#2b035e" }}><i className="fa fa-cogs" style={{ fontSize: "16px", marginRight: "10px" }}></i>{translate('kpi_personal.kpi_personal_create.kpi_status.setting_up')}</span>;
        } else if (statusKPI === 1) {
            return <span style={{ color: "#FFC107" }}><i className="fa fa-hourglass-half" style={{ fontSize: "16px", marginRight: "10px" }}></i>{translate('kpi_personal.kpi_personal_create.kpi_status.awaiting_approval')}</span>;
        } else if (statusKPI === 2) {
            return <span style={{ color: "#00EB1B" }}><i className="fa fa-check-circle" style={{ fontSize: "16px", marginRight: "10px" }}></i>{translate('kpi_personal.kpi_personal_create.kpi_status.activated')}</span>;
        } else if (statusKPI === 3) {
            return <span style={{ color: "#270700" }}><i className="fa fa-lock" style={{ fontSize: "16px", marginRight: "10px" }}></i>{translate('kpi_personal.kpi_personal_create.kpi_status.finished')}</span>;
        }
    }

    requestApproveKPI = (kpipersonal) => {
        var totalWeight = kpipersonal.listtarget.map(item => parseInt(item.weight)).reduce((sum, number) => sum + number, 0);
        if (totalWeight === 100) {
            Swal.fire({
                title: translate('kpi_personal.kpi_personal_create.request_approval_kpi.approve'),
                type: 'success',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Xác nhận'
            }).then((res) => {
                if (res.value) {
                    this.props.editStatusKPIPersonal(kpipersonal._id, 1);
                }
            });
        } else {
            Swal.fire({
                title: translate('kpi_personal.kpi_personal_create.request_approval_kpi.not_enough_weight'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Xác nhận'
            })
        }
    }

    cancelApproveKPI = (kpipersonal) => {
        if (kpipersonal.status === 1) {
            Swal.fire({
                title: translate('kpi_personal.kpi_personal_create.cancel_approve.cancel'),
                type: 'success',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Xác nhận'
            }).then((res) => {
                if (res.value) {
                    this.props.editStatusKPIPersonal(kpipersonal._id, 0);
                }
            });
        } else {
            Swal.fire({
                title: translate('kpi_personal.kpi_personal_create.cancel_approve.activated'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Xác nhận'
            })
        }
    }

    render() {
        var unitList, currentUnit, currentKPI, userdepartments;
        const { commenting, editing } = this.state;
        const { department, createKpiPersonal, user, translate, createKpiUnit } = this.props;
        if (department.unitofuser) {
            unitList = department.unitofuser;
            currentUnit = unitList.filter(item => (
                item.dean === this.state.currentRole
                || item.employee === this.state.currentRole
                || item.vice_dean === this.state.currentRole));
        }
        if (createKpiPersonal.currentKPI) currentKPI = createKpiPersonal.currentKPI;
        if (user.userdepartments) userdepartments = user.userdepartments;
        return (
            // <div className="table-wrapper box">
            //     {/* <div className="content-wrapper"> */}
            //         {/* <section className="content-header">
            //             <h1>
            //                 <b>KPI cá nhân</b>
            //             </h1>
            //             <ol className="breadcrumb">
            //                 <li><a href="/"><i className="fa fa-dashboard" /> Home</a></li>
            //                 <li><a href="/">Forms</a></li>
            //                 <li className="active">Advanced Elements</li>
            //             </ol>
            //         </section> */}
            //         <section className="content">
            //             <div className="row">
            //                 <div className="col-xs-12">
                                <div className="box">
                                    <div className="box-body">
                                        <div className="row">
                                            {(typeof currentKPI !== 'undefined' && currentKPI !== null) ?
                                                <div className="col-xs-12 col-sm-12">
                                                    <div style={{ marginLeft: "-10px", marginBottom: "10px" }}>
                                                        {editing ?
                                                            <React.Fragment>
                                                                <a className="btn btn-app" onClick={() => this.saveEdit(currentKPI._id, currentUnit && currentUnit[0]._id)} title="Lưu thông tin chỉnh sửa">
                                                                    <i className="fa fa-save" style={{ fontSize: "16px" }}></i>{translate('kpi_personal.kpi_personal_create.general_information.save')}
                                                                </a>
                                                                <a className="btn btn-app" onClick={() => this.cancelEdit()} title="Hủy bỏ chỉnh sửa">
                                                                    <i className="fa fa-ban" style={{ fontSize: "16px" }}></i>{translate('kpi_personal.kpi_personal_create.general_information.cancel')}
                                                                </a>
                                                            </React.Fragment> :
                                                            <a className="btn btn-app" onClick={() => this.handleEditKPi(currentKPI.status)} title="Chỉnh sửa thông tin chung">
                                                                <i className="fa fa-edit" style={{ fontSize: "16px" }}></i>{translate('kpi_personal.kpi_personal_create.general_information.edit')}
                                                            </a>
                                                        }
                                                        
                                                        <a className="btn btn-app" onClick={() => this.deleteKPI(currentKPI._id, currentKPI.status)} title="Xóa KPI tháng">
                                                            <i className="fa fa-trash" style={{ fontSize: "16px" }}></i>{translate('kpi_personal.kpi_personal_create.general_information.delete')}
                                                        </a>
                                                        
                                                        <a className="btn btn-app" data-toggle="modal" data-target="#addNewTargetKPIPersonal" data-backdrop="static" data-keyboard="false">
                                                            <i className="fa fa-plus-circle" style={{ fontSize: "16px" }}></i>{translate('kpi_personal.kpi_personal_create.add_target')}
                                                        </a>
                                                        <ModalAddTargetKPIPersonal kpipersonal={currentKPI._id} unit={currentUnit && currentUnit[0]} />

                                                        {currentKPI.status === 0 ? 
                                                            <a className="btn btn-app" onClick={() => this.requestApproveKPI(currentKPI)}>
                                                                <i className="fa fa-external-link-square" style={{ fontSize: "16px" }}></i>{translate('kpi_personal.kpi_personal_create.submit.request_approval')}
                                                            </a> 
                                                            : <a className="btn btn-app" onClick={() => this.cancelApproveKPI(currentKPI)}>
                                                                <i className="fa fa-minus-square" style={{ fontSize: "16px" }}></i>{translate('kpi_personal.kpi_personal_create.submit.cancel_request_approval')}
                                                            </a>
                                                        }
                                                    </div>

                                                   <div className="" style={{ marginBottom: "10px" }}>
                                                        <h4 style={{ display: "inline", fontWeight: "600" }}>{translate('kpi_personal.kpi_personal_create.general_information.general_information')} {this.formatDate(currentKPI.time)} ({currentKPI.unit.name})</h4>
                                                        <span style={{ float: "right" }} title={translate('kpi_personal.kpi_personal_create.kpi_status.status')}>{this.checkStatusKPI(currentKPI.status)}</span>
                                                    </div>
                                                   
                                                    {editing ? userdepartments &&
                                                        <div className="col-xs-12 col-sm-6">
                                                            <div className="form-group">
                                                                <label>{translate('kpi_personal.kpi_personal_create.approver')}</label>
                                                                <div className="input-group" style={{ width: "250px" }}>
                                                                    <select defaultValue={currentKPI.approver._id} ref={input => this.approver = input} className="form-control select2" >
                                                                        <optgroup label={userdepartments[0].roleId.name}>
                                                                            <option key={userdepartments[0].userId._id} value={userdepartments[0].userId._id}>{userdepartments[0].userId.name}</option>
                                                                        </optgroup>
                                                                        <optgroup label={userdepartments[1].roleId.name}>
                                                                            <option key={userdepartments[1].userId._id} value={userdepartments[1].userId._id}>{userdepartments[1].userId.name}</option>
                                                                        </optgroup>
                                                                    </select>
                                                                </div>   
                                                            </div>
                                                        </div>            
                                                        : <div className="form-group">
                                                            <span style={{ fontWeight: "600" }}>{translate('kpi_personal.kpi_personal_create.approver')}: </span>
                                                            <span>{currentKPI.approver.name}</span>
                                                        </div>
                                                    }

                                                        {/* {editing ? userdepartments &&
                                                            <div className="col-sm-10 input-group" style={{ width: "25%", paddingLeft: "15px" }}>
                                                                <select defaultValue={currentKPI.approver._id} ref={input => this.approver = input} className="form-control select2">
                                                                    <optgroup label={userdepartments[0].roleId.name}>
                                                                        {userdepartments[0].userId.map(x => {
                                                                            return <option key={x._id} value={x._id}>{x.name}</option>
                                                                        })}
                                                                    </optgroup>
                                                                    <optgroup label={userdepartments[1].roleId.name}>
                                                                        {userdepartments[1].userId.map(x => {
                                                                            return <option key={x._id} value={x._id}>{x.name}</option>
                                                                        })}
                                                                    </optgroup>
                                                                </select>
                                                            </div> :
                                                            <label className="col-sm-10" style={{ fontWeight: "400" }}>: {currentKPI.approver.name}</label>
                                                        } */} 
                                                   

                                                    {editing &&
                                                        <div className="form-group col-xs-12 col-sm-6">
                                                            <label>{translate('kpi_personal.kpi_personal_create.time')}</label>
                                                            <div className="input-group date has-feedback" style={{ width: "250px" }}>
                                                                <div className="input-group-addon">
                                                                    <i className="fa fa-calendar" />
                                                                </div>
                                                                <input type="text" className="form-control" ref={input => this.time = input} defaultValue={this.formatDate(currentKPI.time)} name="time" id="datepicker2" data-date-format="mm-yyyy" />
                                                            </div>
                                                        </div>
                                                    }

                                                    {editing === false &&
                                                        <div className="form group">
                                                            <span style={{ fontWeight: "600" }}>{translate('kpi_personal.kpi_personal_create.weight.weight_total')}: </span>
                                                            <span>{currentKPI.listtarget.map(item => parseInt(item.weight)).reduce((sum, number) => sum + number, 0)}/100 - </span>
                                                            {currentKPI.listtarget.map(item => parseInt(item.weight)).reduce((sum, number) => sum + number, 0) !== 100 ?
                                                                <span className="text-danger" style={{fontWeight: "bold"}}>{translate('kpi_personal.kpi_personal_create.weight.not_satisfied')}</span>
                                                                : <span className="text-success" style={{fontWeight: "bold"}}>{translate('kpi_personal.kpi_personal_create.weight.satisfied')}</span>
                                                            }
                                                        </div>
                                                    }

                                                    <div>
                                                        {(typeof currentKPI !== 'undefined' && currentKPI !== null) &&
                                                            <h4 style={{ display: "inline-block", fontWeight: "600", marginTop: "20px" }}>{translate('kpi_personal.kpi_personal_create.target_list')} ({currentKPI.listtarget.reduce(sum => sum + 1, 0)})</h4>
                                                        }

                                                        <SlimScroll outerComponentId="kpi_table" innerComponentId="kpipersonal_table" innerComponentWidth="992px" activate={this.state.fixTableWidth}/>
                                                        <div id="kpi_table">
                                                            <table className="table table-bordered table-striped table-hover" id="kpipersonal_table">
                                                                <thead>
                                                                    <tr>
                                                                        <th title="Số thứ tự" style={{ width: '40px' }}>{translate('kpi_personal.kpi_personal_create.no_')}</th>
                                                                        <th title="Tên mục tiêu" className="col-lg-3 col-sm-3">{translate('kpi_personal.kpi_personal_create.target_name')}</th>
                                                                        <th title="Mục tiêu cha" className="col-lg-3 col-sm-3">{translate('kpi_personal.kpi_personal_create.parents_target')}</th>
                                                                        <th title="Tiêu chí đánh giá" className="col-lg-2 col-sm-2">{translate('kpi_personal.kpi_personal_create.evaluation_criteria')}</th>
                                                                        <th title="Trọng số" className="col-lg-1 col-sm-1">{translate('kpi_personal.kpi_personal_create.max_score')}</th>
                                                                        <th title="Trạng thái" className="col-lg-1 col-sm-1">{translate('kpi_personal.kpi_personal_create.status')}</th>
                                                                        <th title="Hành động" className="col-lg-1 col-sm-1">{translate('kpi_personal.kpi_personal_create.action')}</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                        (typeof currentKPI === 'undefined' || currentKPI === null) ? 
                                                                            <tr><td colSpan={7}><center>{translate('kpi_personal.kpi_personal_create.not_initialize')} {this.formatDate(Date.now())}</center></td></tr> 
                                                                            : (currentKPI.listtarget.map((item, index) =>
                                                                                <tr key={index + 1}>
                                                                                    <td title={index + 1}>{index + 1}</td>
                                                                                    <td title={item.name}>{item.name}</td>
                                                                                    <td title={item.parent ? item.parent.name : null}>{item.parent ? item.parent.name : null}</td>    
                                                                                    <td title={item.criteria}>{item.criteria}</td>
                                                                                    <td title={item.weight}>{item.weight}</td>
                                                                                    <td title={this.checkStatusTarget(item.status)}>{this.checkStatusTarget(item.status)}</td>
                                                                                    <td>
                                                                                        <a href="#abc" style={{ color: "#FFC107", fontSize: "16px" }} title={translate('kpi_personal.kpi_personal_create.action_title.edit')} data-toggle="tooltip" onClick={() => this.editTargetKPIPersonal(currentKPI.status, item)}><i className="fa fa-edit"></i></a>
                                                                                        {this.state.editingTarget === item._id ? <ModalEditTargetKPIPersonal target={item}/> : null}
                                                                                        {item.default === 0 ? <a href="#abc" style={{ color: "#E34724", fontSize: "16px" }} title={translate('kpi_personal.kpi_personal_create.action_title.delete')} onClick={() => this.deleteTargetKPIKPIPersonal(item.status, currentKPI.status, item._id, currentKPI._id)}><i className="fa fa-trash"></i></a> :
                                                                                            <a className="copy" title={translate('kpi_personal.kpi_personal_create.action_title.content')}><i className="material-icons">notification_important</i></a>}
                                                                                    </td>
                                                                                </tr>
                                                                            ))
                                                                    }
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                    
                                                    {(typeof currentKPI !== 'undefined' && currentKPI !== null) &&
                                                        <div>
                                                            {commenting ? 
                                                                <div>
                                                                    <button className="btn btn-danger" style={{ marginRight: "15px", float: "right" }} onClick={() => this.handleCommentKPI()}>{translate('kpi_personal.kpi_personal_create.submit.cancel_feedback')}</button>
                                                                    <button className="btn btn-primary" style={{ marginRight: "15px", float: "right" }} onClick={() => this.handleCommentKPI()}>{translate('kpi_personal.kpi_personal_create.submit.send_feedback')}</button>
                                                                </div>
                                                                : <button className="btn btn-primary" style={{ marginRight: "15px", float: "right" }} onClick={() => this.handleCommentKPI()}>{translate('kpi_personal.kpi_personal_create.submit.feedback')}</button>
                                                            }
                                                        </div>
                                                    }

                                                    {commenting && 
                                                        <div className="col-xs-12">
                                                            <form>
                                                                <div className="form-group">
                                                                    <label>{translate('kpi_personal.kpi_personal_create.submit.feedback')}</label>
                                                                    <div className='form-group'>
                                                                        <textarea type="text" className='form-control' id="inputname" name="reason" />
                                                                    </div>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    }
                                                </div>
                                                : <div className="col-xs-12">
                                                    <div style={{marginLeft: "-10px"}}>
                                                        
                                                        {(typeof createKpiUnit.currentKPI !== 'undefined' && createKpiUnit.currentKPI !== null) ?
                                                            <div>{ createKpiUnit.currentKPI.status !==1 ?
                                                                <div>  
                                                                    <a className="btn btn-app" data-toggle="modal" data-target="#startKPIPersonal" data-backdrop="static" data-keyboard="false" onClick={() => {this.handleNotActivatedKPIUnit()}}>
                                                                        <i className="fa fa-calendar-plus-o" style={{ fontSize: "16px" }}></i>{translate('kpi_personal.kpi_personal_create.initialize_kpi_newmonth')}
                                                                    </a>
                                                                </div>
                                                                : <div>
                                                                    <a className="btn btn-app" data-toggle="modal" data-target="#startKPIPersonal" data-backdrop="static" data-keyboard="false">
                                                                        <i className="fa fa-calendar-plus-o" style={{ fontSize: "16px" }}></i>{translate('kpi_personal.kpi_personal_create.initialize_kpi_newmonth')}
                                                                    </a>
                                                                    <ModalStartKPIPersonal unit={currentUnit && currentUnit[0]} />
                                                                </div>
                                                                }
                                                            </div>
                                                            : <a className="btn btn-app" data-toggle="modal" data-target="#startKPIPersonal" data-backdrop="static" data-keyboard="false" onClick={() => {this.handleNotInitializeKPIUnit()}}>
                                                                <i className="fa fa-calendar-plus-o" style={{ fontSize: "16px" }}></i>{translate('kpi_personal.kpi_personal_create.initialize_kpi_newmonth')}
                                                            </a>
                                                        }
                                                    </div>
                                                    <h3 style={{ display: "inline-block", fontWeight: "600" }}>{translate('kpi_personal.kpi_personal_create.general_information.general_information')} {this.formatDate(Date.now())}</h3>
                                                    <p>{translate('kpi_personal.kpi_personal_create.not_initialize')}</p>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
    //                         </div>
    //                     </div>
    //                 </section>
    //             {/* </div> */}
    //         </div>
    //     );
    // }
        );
    }
}

function mapState(state) {
    const { department, createKpiPersonal, user, createKpiUnit } = state;
    return { department, createKpiPersonal, user, createKpiUnit };
}

const actionCreators = {
    getAllUserSameDepartment: UserActions.getAllUserSameDepartment,
    getDepartment: DepartmentActions.getDepartmentOfUser,
    getCurrentKPIPersonal: createKpiActions.getCurrentKPIPersonal,
    deleteTargetKPIPersonal: createKpiActions.deleteTarget,
    editKPIPersonal: createKpiActions.editKPIPersonal,
    deleteKPIPersonal: createKpiActions.deleteKPIPersonal,
    editStatusKPIPersonal: createKpiActions.editStatusKPIPersonal,

    getCurrentKPIUnit: createUnitKpiActions.getCurrentKPIUnit,
};

const connectedKPIPersonalCreate = connect( mapState, actionCreators )( withTranslate(KPIPersonalCreate) );
export { connectedKPIPersonalCreate as KPIPersonalCreate };