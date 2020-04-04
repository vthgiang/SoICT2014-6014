import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createUnitKpiActions } from '../redux/actions.js';
import { DepartmentActions} from '../../../super-admin-management/departments-management/redux/actions';
import { ModalAddTargetKPIUnit } from './ModalAddTargetKPIUnit';
import { ModalStartKPIUnit } from './ModalStartKPIUnit';
import Swal from 'sweetalert2';
import { ModalEditTargetKPIUnit } from './ModalEditTargetKPIUnit';

//
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { withTranslate } from 'react-redux-multilingual';

// hàm để chuyển sang song ngữ
var translate = '';

class KPIUnitCreate extends Component {
    componentDidMount() {
        // get department list of company
        
        this.props.getDepartment();
        this.props.getCurrentKPIUnit(localStorage.getItem('currentRole'));

        this.handleResizeColumn();
    }
    componentDidUpdate() {
        let script = document.createElement('script');
        script.src = '../lib/main/js/CoCauToChuc.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        if (this.state.currentRole !== localStorage.getItem('currentRole')) {
            this.props.getCurrentKPIUnit(localStorage.getItem('currentRole'));
            this.setState(state => {
                return {
                    ...state,
                    currentRole: localStorage.getItem('currentRole')
                }
            })
        }
    }
    constructor(props) {
        super(props);   translate = this.props.translate;
        this.state = {
            kpiunit: {
                unit: "",
                time: this.formatDate(Date.now()),
                creater: ""     //localStorage.getItem("id")
            },
            adding: false,
            editing: false,
            submitted: false,
            currentRole: localStorage.getItem("currentRole")
        };

    }

    // function: notification the result of an action
    notifysuccess = (message) => toast(message, {containerId: 'toast-notification'});
    notifyerror = (message) => toast.error(message, {containerId: 'toast-notification'});
    notifywarning = (message) => toast.warning(message, {containerId: 'toast-notification'});

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
    handleEditKPi = async () => {
        await this.setState(state => {
            return {
                ...state,
                editing: !state.editing,
            }
        })
    }
    saveEdit = async (id, unit) => {
        await this.setState(state => {
            return {
                ...state,
                editing: !state.editing,
                kpiunit: {
                    ...state.kpiunit,
                    unit: unit,
                    time: this.time.value,
                }
            }
        })
        var { kpiunit } = this.state;
        if (kpiunit.unit && kpiunit.time ) {//&& kpiunit.creater
            this.props.editKPIUnit(id, kpiunit);

            this.notifysuccess(translate('kpi_unit_create.edit_success'));
        }
        else{
            this.notifyerror(translate('kpi_unit_create.error'));
        }
    }
    cancelKPIUnit = (event, id, status) => {
        event.preventDefault();
        Swal.fire({
            title: translate('kpi_unit_create.confirm_unapprove_success'),
            type: 'success',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: translate('kpi_unit_create.confirm')
        }).then((res) => {
            if (res.value) {
                this.props.editStatusKPIUnit(id, status);

                this.notifysuccess(translate('kpi_unit_create.unapprove_success'));
            }
        });
    }
    approveKPIUnit = (event,currentStatus, currentKPI, status) => {
        event.preventDefault();
        var totalWeight = currentKPI.listtarget.map(item => parseInt(item.weight)).reduce((sum, number) => sum + number, 0);
        if(currentStatus === 1){
            Swal.fire({
                title: translate('kpi_unit_create.approve_already'),
                type: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi_unit_create.confirm'),
            })
        } else {
            if (totalWeight === 100) {
                Swal.fire({
                    title: translate('kpi_unit_create.confirm_approve_success'),
                    type: 'success',
                    showCancelButton: true,
                    cancelButtonColor: '#d33',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: translate('kpi_unit_create.confirm'),
                }).then((res) => {
                    if (res.value) {
                        this.props.editStatusKPIUnit(currentKPI._id, status);

                        this.notifysuccess(translate('kpi_unit_create.approve_success'));
                    }
                });
            } else {
                Swal.fire({
                    title: translate('kpi_unit_create.confirm_approve_error'),
                    type: 'warning',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: translate('kpi_unit_create.confirm'),
                })
            }
        }
    }
    deleteKPI = (status, id) => {
        if (status === 1) {
            Swal.fire({
                title: translate('kpi_unit_create.confirm_delete_error'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi_unit_create.confirm'),
            })
        } else {
            Swal.fire({
                title: translate('kpi_unit_create.confirm_delete_success'),
                type: 'success',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: translate('kpi_unit_create.confirm'),
            }).then((res) => {
                if (res.value) {
                    this.props.deleteKPIUnit(id);

                    this.notifysuccess(translate('kpi_unit_create.delete_success'));
                }
            });
        }
    }
    deleteTargetKPIUnit = (status ,id, kpiunit) => {
        if (status === 1) {
            Swal.fire({
                title: translate('kpi_unit_create.confirm_delete_target_error'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi_unit_create.confirm'),
            })
        } else {
            Swal.fire({
                title: translate('kpi_unit_create.confirm_delete_target_success'),
                type: 'success',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: translate('kpi_unit_create.confirm'),
            }).then((res) => {
                if (res.value) {
                    this.props.deleteTargetKPIUnit(id, kpiunit);

                    this.notifysuccess(translate('kpi_unit_create.delete_target_success'));
                }
            });
        }
    }
    formatDate(date) {
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
    checkPermisson = (deanCurrentUnit) => {
        var currentRole = localStorage.getItem("currentRole");
        return (currentRole === deanCurrentUnit);
    }
    render() {
        var unitList, currentUnit, currentKPI;
        const { department, createKpiUnit } = this.props;
        const { editing } = this.state;
        if (department.unitofuser) {
            unitList = department.unitofuser;
            currentUnit = unitList.filter(item =>
                item.dean === this.state.currentRole
                || item.vice_dean === this.state.currentRole
                || item.employee === this.state.currentRole);
        }
        if (createKpiUnit.currentKPI) currentKPI = createKpiUnit.currentKPI;
        console.log(currentKPI);

        // hàm để chuyển sang song ngữ
        const { translate } = this.props;

        return (
            <div className="box">
                <div className="box-body">
                    <div className="row">
                        {(typeof currentKPI !== 'undefined' && currentKPI !== null) ?
                            <div className="">
                                <div className="col-xs-12 col-sm-12">
                                    <h4 style={{ fontWeight: "600", display: "inline-block" }}>{translate('kpi_unit_create.general_information')}</h4>
                                    {this.checkPermisson(currentUnit && currentUnit[0].dean) &&
                                        <React.Fragment>
                                            {editing ? <a href="#abc" style={{ color: "green", marginLeft: "10px" }} onClick={() => this.saveEdit(currentKPI._id, currentUnit && currentUnit[0]._id)} title="Lưu thông tin chỉnh sửa"><i className="material-icons" style={{ fontSize: "16px" }}>save</i></a>
                                                : <a href="#abc" style={{ color: "#FFC107", marginLeft: "10px" }} onClick={() => this.handleEditKPi()} title="Chỉnh sửa thông tin chung"><i className="material-icons" style={{ fontSize: "16px" }}>edit</i></a>}
                                            <a href="#abc" style={{ color: "#E34724", marginLeft: "10px" }} onClick={() => this.deleteKPI(currentKPI.status, currentKPI._id)} title="Xóa bỏ KPI này"><i className="material-icons" style={{ fontSize: "16px" }}></i></a>
                                        </React.Fragment>}
                                </div>

                                <div className="col-lg-6 col-sm-12">
                                    <div className="form-group">
                                        <label className="col-sm-3">{translate('kpi_unit_create.unit')}:</label>
                                        <p className="col-sm-9">{currentKPI.unit.name}</p>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-sm-3">{translate('kpi_unit_create.num_target')}:</label>
                                        <p className="col-sm-9">{currentKPI.listtarget.reduce(sum => sum + 1, 0)}</p>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-sm-3">{translate('kpi_unit_create.weight_total')}:</label>
                                        <p className="col-sm-9">{currentKPI.listtarget.map(item => parseInt(item.weight)).reduce((sum, number) => sum + number, 0)}/100</p>
                                    </div>
                                </div> 

                                <div className="col-lg-6 col-sm-12">
                                    <div className="form-group">
                                        <label className="col-sm-3">{translate('kpi_unit_create.time')}:</label>
                                        {editing ?
                                            <div className='input-group col-sm-9 date has-feedback' style={{ paddingLeft: "15px" }}>
                                                <div className="input-group-addon">
                                                    <i className="fa fa-calendar" />
                                                </div>
                                                <input type="text" className="form-control pull-right" ref={input => this.time = input} defaultValue={this.formatDate(Date.now())} name="time" id="datepicker2" data-date-format="mm-yyyy" />
                                            </div>
                                            : <p className="col-sm-9">{this.formatDate(currentKPI.time)}</p>}
                                    </div>
                                    <div className="form-group">
                                        <label className="col-sm-3">{translate('kpi_unit_create.status')}:</label>
                                        <p className="col-sm-9">{currentKPI.status === 1 ? "Đã kích hoạt" : "Chưa kích hoạt"}</p>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-sm-3">***{translate('kpi_unit_create.note')}:</label>
                                        <p className="col-sm-9">{currentKPI.listtarget.map(item => parseInt(item.weight)).reduce((sum, number) => sum + number, 0) !== 100 ? " Trọng số chưa thỏa mãn" : " Trọng số đã thỏa mãn"}</p>
                                    </div>
                                </div> 
                            </div>    :
                            <div className="col-xs-12">
                                <h4 style={{ display: "inline", fontWeight: "600" }}>{translate('kpi_unit_create.general_information')}</h4>
                                <br/>
                                <br/>
                                <div className="form-group">
                                    <label className="col-sm-3 col-md-2 col-lg-1">{translate('kpi_unit_create.unit')}:</label>
                                    <p className="col-sm-9 col-md-10 col-lg-11">{currentUnit && currentUnit[0].name}</p>
                                </div>
                            </div>
                        }
                        <div className="col-xs-12">
                            <h4 style={{ display: "inline-block", fontWeight: "600" }}>{translate('kpi_unit_create.target_list')}</h4>
                            {(typeof currentKPI !== 'undefined' && currentKPI !== null) ?
                                this.checkPermisson(currentUnit && currentUnit[0].dean) && <React.Fragment>
                                    <button type="button" className="btn btn-success" style={{ float: "right" }} data-toggle="modal" data-target="#addNewTargetKPIUnit" data-backdrop="static" data-keyboard="false">{translate('kpi_unit_create.add_target')}</button>
                                    <ModalAddTargetKPIUnit kpiunit={currentKPI._id} unit={currentKPI.unit._id} />
                                </React.Fragment> :
                                this.checkPermisson(currentUnit && currentUnit[0].dean) && <React.Fragment>
                                    <button type="button" className="btn btn-success" style={{ float: "right" }} data-toggle="modal" data-target="#startKPIUnit" data-backdrop="static" data-keyboard="false">{translate('kpi_unit_create.start_kpi')}</button>
                                    <ModalStartKPIUnit unit={currentUnit && currentUnit[0]} />
                                </React.Fragment>
                            }
                            <table className="table table-bordered table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th titl="Số thứ tự" style={{ width: "40px" }}>Stt</th>
                                        <th title="Tên mục tiêu">{translate('kpi_unit_create.target_name')}</th>
                                        <th title="Tiêu chí đánh giá">{translate('kpi_unit_create.criteria')}</th>
                                        <th title="Trọng số" style={{ width: "100px" }}>{translate('kpi_unit_create.weight')}</th>
                                        {this.checkPermisson(currentUnit && currentUnit[0].dean) && <th style={{ width: "100px" }}>{translate('kpi_unit_create.action')}</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        (typeof currentKPI === 'undefined' || currentKPI === null) ? <tr><td colSpan={5}><center>Chưa thiết lập KPI tháng {this.formatDate(Date.now())}</center></td></tr> :
                                            currentKPI.listtarget.map((item, index) =>
                                                <tr key={item._id}>
                                                    <td>{index + 1}</td>
                                                    <td title={item.name}>{item.name}</td>
                                                    <td title={item.criteria}>{item.criteria}</td>
                                                    <td title={item.weight}>{item.weight}</td>
                                                    {this.checkPermisson(currentUnit && currentUnit[0].dean) &&
                                                        <td>
                                                            <a href="#abc" className="edit" title="Edit" data-toggle="modal" data-target={`#editTargetKPIUnit${item._id}`} data-backdrop="static" data-keyboard="false"><i className="material-icons"></i></a>
                                                            <ModalEditTargetKPIUnit target={item} unit={currentUnit && currentUnit[0]} />
                                                            {item.default === 0 ? <a href="#abc" className="delete" title="Delete" onClick={() => this.deleteTargetKPIUnit(currentKPI.status, item._id, currentKPI._id)}><i className="material-icons"></i></a> :
                                                                <a className="copy" title="Đây là mục tiêu mặc định (nếu cần thiết có thể sửa trọng số)"><i className="material-icons">notification_important</i></a>}
                                                        </td>
                                                    }
                                                </tr>
                                            )
                                    }
                                </tbody>
                            </table>
                        </div>
                        {(typeof currentKPI !== 'undefined' && currentKPI !== null) && this.checkPermisson(currentUnit && currentUnit[0].dean) &&
                            <div className="col-xs-8 col-xs-offset-9">
                                <button type="submit" className="btn btn-success col-md-2" onClick={(event) => this.approveKPIUnit(event,currentKPI.status, currentKPI, 1)}>{translate('kpi_unit_create.approve')}</button>
                                <button className="btn btn-primary col-md-2" style={{ marginLeft: "15px" }} onClick={(event) => this.cancelKPIUnit(event, currentKPI._id, 0)}>{translate('kpi_unit_create.cancel_approve')}</button>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

function mapState(state) {
    const { department, createKpiUnit } = state;
    return { department, createKpiUnit };
}

const actionCreators = {
    getDepartment: DepartmentActions.getDepartmentOfUser,
    getCurrentKPIUnit: createUnitKpiActions.getCurrentKPIUnit,
    editKPIUnit: createUnitKpiActions.editKPIUnit,
    deleteKPIUnit: createUnitKpiActions.deleteKPIUnit,
    deleteTargetKPIUnit: createUnitKpiActions.deleteTargetKPIUnit,
    editStatusKPIUnit: createUnitKpiActions.editStatusKPIUnit
};
const connectedKPIUnitCreate = connect(mapState, actionCreators)(withTranslate(KPIUnitCreate));
export { connectedKPIUnitCreate as KPIUnitCreate };