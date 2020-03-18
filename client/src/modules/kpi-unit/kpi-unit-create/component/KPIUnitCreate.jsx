import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createUnitKpiActions } from '../redux/actions.js';
import { DepartmentActions} from '../../../super-admin-management/departments-management/redux/actions';
import { ModalAddTargetKPIUnit } from './ModalAddTargetKPIUnit';
import { ModalStartKPIUnit } from './ModalStartKPIUnit';
import Swal from 'sweetalert2';
import { ModalEditTargetKPIUnit } from './ModalEditTargetKPIUnit';

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
        super(props);
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
        }
    }
    cancelKPIUnit = (event, id, status) => {
        event.preventDefault();
        Swal.fire({
            title: "Bạn chắc chắn muốn hủy kích hoạt KPI này?",
            type: 'success',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xác nhận'
        }).then((res) => {
            if (res.value) {
            this.props.editStatusKPIUnit(id, status);
            }
        });
    }
    approveKPIUnit = (event,currentStatus, currentKPI, status) => {
        event.preventDefault();
        var totalWeight = currentKPI.listtarget.map(item => parseInt(item.weight)).reduce((sum, number) => sum + number, 0);
        if(currentStatus === 1){
            Swal.fire({
                title: "KPI đã kích hoạt!",
                type: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Xác nhận'
            })
        } else {
            if (totalWeight === 100) {
                Swal.fire({
                    title: "Bạn chắc chắn muốn kích hoạt KPI này?",
                    type: 'success',
                    showCancelButton: true,
                    cancelButtonColor: '#d33',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Xác nhận'
                }).then((res) => {
                    if (res.value) {
                    this.props.editStatusKPIUnit(currentKPI._id, status);
                    }
                });
            } else {
                Swal.fire({
                    title: "Tổng trọng số phải bằng 100",
                    type: 'warning',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Xác nhận'
                })
            }
        }
    }
    deleteKPI = (status, id) => {
        if (status === 1) {
            Swal.fire({
                title: "KPI đã kích hoạt, bạn không thể xóa!",
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Xác nhận'
            })
        } else {
            Swal.fire({
                title: "Bạn chắc chắn muốn xóa toàn bộ KPI này?",
                type: 'success',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Xác nhận'
            }).then((res) => {
                if (res.value) {
                this.props.deleteKPIUnit(id);
                }
            });
        }
    }
    deleteTargetKPIUnit = (status ,id, kpiunit) => {
        if (status === 1) {
            Swal.fire({
                title: "KPI đã kích hoạt, Bạn không thể xóa!",
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Xác nhận'
            })
        } else {
            Swal.fire({
                title: "Bạn chắc chắn muốn xóa mục tiêu này?",
                type: 'success',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Xác nhận'
            }).then((res) => {
                if (res.value) {
                    this.props.deleteTargetKPIUnit(id, kpiunit);
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
        return (
            <div className="table-wrapper box">
                {/* <div className="content-wrapper"> */}
                    {/* <section className="content-header">
                        <h1>
                            <b>KPI đơn vị</b>
                        </h1>
                        <ol className="breadcrumb">
                            <li><a href="/"><i className="fa fa-dashboard" /> Home</a></li>
                            <li><a href="/">Forms</a></li>
                            <li className="active">Advanced Elements</li>
                        </ol>
                    </section> */}
                    <section className="content">
                        <div className="row">
                            <div className="col-xs-12">
                                <div className="box">
                                    <div className="box-body">
                                        <div className="row">
                                            {(typeof currentKPI !== 'undefined' && currentKPI !== null) ?
                                                <div className="col-xs-12">
                                                    <h4 style={{ fontWeight: "600", display: "inline-block" }}>Thông tin chung</h4>
                                                    {this.checkPermisson(currentUnit && currentUnit[0].dean) &&
                                                        <React.Fragment>
                                                            {editing ? <a href="#abc" style={{ color: "green", marginLeft: "10px" }} onClick={() => this.saveEdit(currentKPI._id, currentUnit && currentUnit[0]._id)} title="Lưu thông tin chỉnh sửa"><i className="material-icons" style={{ fontSize: "16px" }}>save</i></a>
                                                                : <a href="#abc" style={{ color: "#FFC107", marginLeft: "10px" }} onClick={() => this.handleEditKPi()} title="Chỉnh sửa thông tin chung"><i className="material-icons" style={{ fontSize: "16px" }}>edit</i></a>}
                                                            <a href="#abc" style={{ color: "#E34724", marginLeft: "10px" }} onClick={() => this.deleteKPI(currentKPI.status, currentKPI._id)} title="Xóa bỏ KPI này"><i className="material-icons" style={{ fontSize: "16px" }}></i></a>
                                                        </React.Fragment>}
                                                    <div className="form-group">
                                                        <label className="col-sm-2" style={{ fontWeight: "500" }}>Tên đơn vị</label>
                                                        <label className="col-sm-10" style={{ fontWeight: "400" }}>: {currentKPI.unit.name}</label>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="col-sm-2" style={{ fontWeight: "500" }}>Số mục tiêu</label>
                                                        <label className="col-sm-10" style={{ fontWeight: "400" }}>: {currentKPI.listtarget.reduce(sum => sum + 1, 0)}</label>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="col-sm-2" style={{ fontWeight: "500" }}>Tổng trọng số</label>
                                                        <label className="col-sm-10" style={{ fontWeight: "400" }}>: {currentKPI.listtarget.map(item => parseInt(item.weight)).reduce((sum, number) => sum + number, 0)}/100</label>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="col-sm-2" style={{ fontWeight: "500" }}>Thời gian</label>
                                                        {editing ?
                                                            <div className='input-group col-sm-3 date has-feedback' style={{ paddingLeft: "15px" }}>
                                                                <div className="input-group-addon">
                                                                    <i className="fa fa-calendar" />
                                                                </div>
                                                                <input type="text" className="form-control pull-right" ref={input => this.time = input} defaultValue={this.formatDate(Date.now())} name="time" id="datepicker2" data-date-format="mm-yyyy" />
                                                            </div>
                                                            : <label className="col-sm-10" style={{ fontWeight: "400" }}>: {this.formatDate(currentKPI.time)}</label>}
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="col-sm-2" style={{ fontWeight: "500" }}>Trạng thái:</label>
                                                        <label className="col-sm-10" style={{ fontWeight: "400" }}>: {currentKPI.status === 1 ? "Đã kích hoạt" : "Chưa kích hoạt"}</label>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="col-sm-2" style={{ fontWeight: "500" }}>***Ghi chú</label>
                                                        <label className="col-sm-10" style={{ fontWeight: "400" }}>: {currentKPI.listtarget.map(item => parseInt(item.weight)).reduce((sum, number) => sum + number, 0) !== 100 ? " Trọng số chưa thỏa mãn" : " Trọng số đã thỏa mãn"}</label>
                                                    </div>
                                                </div> :
                                                <div className="col-xs-12">
                                                    <h4 style={{ display: "inline", fontWeight: "600" }}>Thông tin chung</h4>
                                                    <div className="form-group">
                                                        <label className="col-sm-2" style={{ fontWeight: "500" }}>Đơn vị</label>
                                                        <label className="col-sm-10" style={{ fontWeight: "400" }}>: {currentUnit && currentUnit[0].name}</label>
                                                    </div>
                                                </div>
                                            }
                                            <div className="col-xs-12">
                                                <h4 style={{ display: "inline-block", fontWeight: "600" }}>Danh sách mục tiêu</h4>
                                                {(typeof currentKPI !== 'undefined' && currentKPI !== null) ?
                                                    this.checkPermisson(currentUnit && currentUnit[0].dean) && <React.Fragment>
                                                        <button type="button" className="btn btn-success" style={{ float: "right" }} data-toggle="modal" data-target="#addNewTargetKPIUnit" data-backdrop="static" data-keyboard="false">Thêm mục tiêu</button>
                                                        <ModalAddTargetKPIUnit kpiunit={currentKPI._id} unit={currentKPI.unit._id} />
                                                    </React.Fragment> :
                                                    this.checkPermisson(currentUnit && currentUnit[0].dean) && <React.Fragment>
                                                        <button type="button" className="btn btn-success" style={{ float: "right" }} data-toggle="modal" data-target="#startKPIUnit" data-backdrop="static" data-keyboard="false">Khởi tạo KPI tháng mới</button>
                                                        <ModalStartKPIUnit unit={currentUnit && currentUnit[0]} />
                                                    </React.Fragment>
                                                }
                                                <table className="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th titl="Số thứ tự" style={{ width: "40px" }}>Stt</th>
                                                            <th title="Tên mục tiêu">Tên mục tiêu</th>
                                                            <th title="Tiêu chí đánh giá">Tiêu chí đánh giá</th>
                                                            <th title="Trọng số" style={{ width: "100px" }}>Trọng số</th>
                                                            {this.checkPermisson(currentUnit && currentUnit[0].dean) && <th style={{ width: "100px" }}>Hành động</th>}
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
                                                    <button type="submit" className="btn btn-success col-md-2" onClick={(event) => this.approveKPIUnit(event,currentKPI.status, currentKPI, 1)}>Kích hoạt</button>
                                                    <button className="btn btn-primary col-md-2" style={{ marginLeft: "15px" }} onClick={(event) => this.cancelKPIUnit(event, currentKPI._id, 0)}>Bỏ kích hoạt</button>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                {/* </div> */}
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
const connectedKPIUnitCreate = connect(mapState, actionCreators)(KPIUnitCreate);
export { connectedKPIUnitCreate as KPIUnitCreate };