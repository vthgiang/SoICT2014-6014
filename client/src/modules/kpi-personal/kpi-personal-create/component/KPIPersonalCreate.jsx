import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { DepartmentActions, UserActions } from '../../../../redux-actions/CombineActions';
import { UserActions } from "../../../super-admin-management/manage-user/redux/actions";
import { DepartmentActions } from "../../../super-admin-management/manage-department/redux/actions";
// import { createKpiActions } from '../../../../redux-actions/CombineActions';
import { createKpiActions } from '../redux/actions';
import { ModalAddTargetKPIPersonal } from './ModalAddTargetKPIPersonal';
import { ModalStartKPIPersonal } from './ModalStartKPIPersonal';
import { ModalEditTargetKPIPersonal } from './ModalEditTargetKPIPersonal';
import Swal from 'sweetalert2';

// sau khi gộp vào prj mới nhớ đổi đường dẫn của DepartmentActions và UserActions

class KPIPersonalCreate extends Component {
    componentDidMount() {
        this.props.getDepartment(localStorage.getItem('id'));
        this.props.getCurrentKPIPersonal(localStorage.getItem('id'));
        this.handleResizeColumn();
    }
    componentDidUpdate() {
        let script = document.createElement('script');
        script.src = 'lib/main/js/CoCauToChuc.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }
    constructor(props) {
        super(props);
        this.state = {
            kpipersonal: {
                creater: localStorage.getItem("id"),
            },
            adding: false,
            editing: false,
            editingTarget: "",
            submitted: false,
            commenting: false,
            currentRole: localStorage.getItem("currentRole")
        };

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
                title: "KPI đang được phê duyệt, bạn không thể chỉnh sửa. Nếu muốn sửa đổi hãy liên hệ với quản lý của bạn!",
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Xác nhận'
            })
        } else {
            Swal.fire({
                title: "KPI đã được kích hoạt, bạn không thể chỉnh sửa. Nếu muốn sửa đổi hãy liên hệ với quản lý của bạn!",
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Xác nhận'
            })
        }
    }
    deleteKPI = async (id, status) => {
        if (status === 0) {
            Swal.fire({
                title: "Bạn chắc chắn muốn xóa KPI này?",
                type: 'success',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Xác nhận'
            }).then((res) => {
                if (res.value) {
                    // Xóa KPI
                    this.props.deleteKPIPersonal(id);
                }
            });
        } else if(status === 1){
            Swal.fire({
                title: "KPI đang được phê duyệt, bạn không thể xóa!",
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Xác nhận'
            })
        } else {
            Swal.fire({
                title: "KPI đã được kích hoạt, bạn không thể xóa!",
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
        console.log(kpipersonal);
        if (kpipersonal.unit && kpipersonal.time && kpipersonal.creater) {
            // this.props.editKPIUnit(id, kpipersonal);
        }
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
    deleteTargetKPIKPIPersonal = (statusTarget, status, id, kpipersonal) => {
        if (statusTarget === 0) {
            Swal.fire({
                title: "Bạn chắc chắn muốn xóa mục tiêu KPI này?",
                type: 'success',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Xác nhận'
            }).then((res) => {
                if (res.value) {
                    this.props.deleteTargetKPIPersonal(id, kpipersonal);
                }
            });
        } else if (status === 1) {
            Swal.fire({
                title: "KPI đang được phê duyệt, Bạn không thể xóa!",
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Xác nhận'
            })
        } else {
            Swal.fire({
                title: "KPI đã được kích hoạt, Bạn không thể xóa!",
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Xác nhận'
            })
        }

    }
    editTargetKPIPersonal = async (statusTarget, statusKPI, target) => {
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
                title: "KPI đang được phê duyệt, Bạn không thể chỉnh sửa!",
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Xác nhận'
            })
        } else {
            Swal.fire({
                title: "KPI đã được kích hoạt, Bạn không thể chỉnh sửa!",
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Xác nhận'
            })
        }

    }
    checkStatusTarget = (status) => {
        if (status === null) {
            return "Chưa phê duyệt";
        } else if (status === 0) {
            return "Yêu cầu chỉnh sửa";
        } else if (status === 1) {
            return "Đã kích hoạt";
        } else if (status === 2) {
            return "Đã kết thúc"
        }
    }
    checkStatusKPI = (status) => {
        if (status === 0) {
            return "Đang thiết lập";
        } else if (status === 1) {
            return "Chờ phê duyệt";
        } else if (status === 2) {
            return "Đã kích hoạt";
        } else if (status === 3) {
            return "Đã kết thúc"
        }
    }
    requestApproveKPI = (kpiersonal) => {
        var totalWeight = kpiersonal.listtarget.map(item => parseInt(item.weight)).reduce((sum, number) => sum + number, 0);
        if (totalWeight === 100) {
            Swal.fire({
                title: "Bạn chắc chắn muốn quản lý phê quyệt KPI này?",
                type: 'success',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Xác nhận'
            }).then((res) => {
                if (res.value) {
                    this.props.editStatusKPIPersonal(kpiersonal._id, 1);
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
    cancelApproveKPI = (kpiersonal) => {
        if (kpiersonal.status === 1) {
            Swal.fire({
                title: "Bạn chắc chắn muốn hủy yêu cầu phê duyệt KPI này?",
                type: 'success',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Xác nhận'
            }).then((res) => {
                if (res.value) {
                    this.props.editStatusKPIPersonal(kpiersonal._id, 0);
                }
            });
        } else {
            Swal.fire({
                title: "KPI đã được kích hoạt bạn không thể hủy bỏ yêu cầu phê duyệt, nếu muốn sửa đổi hãy liên hệ với quản lý của bạn!",
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Xác nhận'
            })
        }
    }
    render() {
        var unitList, currentUnit, currentKPI, userdepartments;
        const { commenting, editing } = this.state;
        const { department, createKpiPersonal, user } = this.props;
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
            <div className="table-wrapper box">
                {/* <div className="content-wrapper"> */}
                    {/* <section className="content-header">
                        <h1>
                            <b>KPI cá nhân</b>
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
                                                    <h4 style={{ display: "inline", fontWeight: "600" }}>Thông tin chung</h4>
                                                    {editing ? <a href="#abc" style={{ color: "green", marginLeft: "10px" }} onClick={() => this.saveEdit(currentKPI._id, currentUnit && currentUnit[0]._id)} title="Lưu thông tin chỉnh sửa"><i className="material-icons" style={{ fontSize: "16px" }}>save</i></a>
                                                        : <a href="#abc" style={{ color: "#FFC107", marginLeft: "10px" }} onClick={() => this.handleEditKPi(currentKPI.status)} title="Chỉnh sửa thông tin chung"><i className="material-icons" style={{ fontSize: "16px" }}>edit</i></a>}
                                                    <a href="#abc" style={{ color: "#E34724", marginLeft: "10px" }} onClick={() => this.deleteKPI(currentKPI._id, currentKPI.status)} title="Xóa bỏ KPI này"><i className="material-icons" style={{ fontSize: "16px" }}></i></a>
                                                    <div className="form-group">
                                                        <label className="col-sm-2" style={{ fontWeight: "500" }}>Đơn vị</label>
                                                        <label className="col-sm-10" style={{ fontWeight: "400" }}>: {currentKPI.unit.name}</label>
                                                    </div>
                                                    <div className="form-group" style={{ paddingTop: editing && "15px" }}>
                                                        <label className="col-sm-2" style={{ fontWeight: "500", marginTop: editing && "10px" }}>Thời gian</label>
                                                        {editing ?
                                                            <div className='input-group col-sm-3 date has-feedback' style={{ paddingLeft: "15px" }}>
                                                                <div className="input-group-addon">
                                                                    <i className="fa fa-calendar" />
                                                                </div>
                                                                <input type="text" className="form-control pull-right" ref={input => this.time = input} defaultValue={this.formatDate(currentKPI.time)} name="time" id="datepicker2" data-date-format="mm-yyyy" />
                                                            </div>
                                                            : <label className="col-sm-10" style={{ fontWeight: "400" }}>: {this.formatDate(currentKPI.time)}</label>}
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="col-sm-2" style={{ fontWeight: "500", marginTop: editing && "8px" }}>Người phê duyệt</label>
                                                        {editing ? userdepartments &&
                                                            <div className="col-sm-10 input-group" style={{ width: "25%", paddingLeft: "15px" }}>
                                                                <select defaultValue={currentKPI.approver._id} ref={input => this.approver = input} className="form-control select2">
                                                                    <optgroup label={userdepartments[0].id_role.name}>
                                                                        {userdepartments[0].id_user.map(x => {
                                                                            return <option key={x._id} value={x._id}>{x.name}</option>
                                                                        })}
                                                                    </optgroup>
                                                                    <optgroup label={userdepartments[1].id_role.name}>
                                                                        {userdepartments[1].id_user.map(x => {
                                                                            return <option key={x._id} value={x._id}>{x.name}</option>
                                                                        })}
                                                                    </optgroup>
                                                                </select>
                                                            </div> :
                                                            <label className="col-sm-10" style={{ fontWeight: "400" }}>: {currentKPI.approver.name}</label>
                                                        }
                                                    </div>
                                                    {editing === false &&
                                                        <React.Fragment>
                                                            <div className="form-group">
                                                                <label className="col-sm-2" style={{ fontWeight: "500" }}>Trạng thái KPI</label>
                                                                <label className="col-sm-10" style={{ fontWeight: "400" }}>: {this.checkStatusKPI(currentKPI.status)}</label>
                                                            </div>
                                                            <div className="form-group">
                                                                <label className="col-sm-2" style={{ fontWeight: "500" }}>Số mục tiêu</label>
                                                                <label className="col-sm-10" style={{ fontWeight: "400" }}>: {currentKPI.listtarget.reduce(sum => sum + 1, 0)}</label>
                                                            </div>
                                                            <div className="form-group">
                                                                <label className="col-sm-2" style={{ fontWeight: "500" }}>Tổng điểm tối đa</label>
                                                                <label className="col-sm-10" style={{ fontWeight: "400" }}>: {currentKPI.listtarget.map(item => parseInt(item.weight)).reduce((sum, number) => sum + number, 0)}/100</label>
                                                            </div>
                                                            <div className="form-group">
                                                                <label className="col-sm-2" style={{ fontWeight: "500" }}>*Ghi chú</label>
                                                                <label className="col-sm-10" style={{ fontWeight: "400" }}>: {currentKPI.listtarget.map(item => parseInt(item.weight)).reduce((sum, number) => sum + number, 0) !== 100 ? " Trọng số chưa thỏa mãn" : " Trọng số đã thỏa mãn"}</label>
                                                            </div>
                                                        </React.Fragment>
                                                    }
                                                </div> :
                                                <div className="col-xs-12">
                                                    <h4 style={{ display: "inline", fontWeight: "600" }}>Thông tin chung</h4>
                                                    <div className="form-group">
                                                        <label className="col-sm-2" style={{ fontWeight: "500" }}>Đơn vị</label>
                                                        <label className="col-sm-10" style={{ fontWeight: "400" }}>: {currentUnit && currentUnit[0].name}</label>
                                                    </div>
                                                </div>}
                                            <div className="col-xs-12">
                                                <h4 style={{ display: "inline-block", fontWeight: "600" }}>Danh sách mục tiêu</h4>
                                                {(typeof currentKPI !== 'undefined' && currentKPI !== null) ?
                                                    currentKPI.status === 0 && <React.Fragment>
                                                        <button type="button" className="btn btn-success" style={{ float: "right" }} data-toggle="modal" data-target="#addNewTargetKPIPersonal" data-backdrop="static" data-keyboard="false">Thêm mục tiêu</button>
                                                        <ModalAddTargetKPIPersonal kpipersonal={currentKPI._id} unit={currentUnit && currentUnit[0]} />
                                                    </React.Fragment> :
                                                    <React.Fragment>
                                                        <button type="button" className="btn btn-success" style={{ float: "right" }} data-toggle="modal" data-target="#startKPIPersonal" data-backdrop="static" data-keyboard="false">Khởi tạo KPI tháng mới</button>
                                                        <ModalStartKPIPersonal unit={currentUnit && currentUnit[0]} />
                                                    </React.Fragment>
                                                }
                                                <table className="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th title="Số thứ tự" style={{ width: "40px" }}>Stt</th>
                                                            <th title="Tên mục tiêu">Tên mục tiêu</th>
                                                            <th title="Mục tiêu cha">Mục tiêu cha</th>
                                                            <th title="Tiêu chí đánh giá">Tiêu chí đánh giá</th>
                                                            <th title="Trọng số" style={{ width: "95px" }}>Điểm tối đa</th>
                                                            <th title="Trạng thái" style={{ width: "87px" }}>Trạng thái</th>
                                                            <th title="Hành động" style={{ width: "100px" }}>Hành động</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            (typeof currentKPI === 'undefined' || currentKPI === null) ? <tr><td colSpan={7}><center>Chưa khởi tạo KPI cá nhân tháng {this.formatDate(Date.now())}</center></td></tr> :
                                                                currentKPI.listtarget.map((item, index) =>
                                                                    <tr key={index + 1}>
                                                                        <td title={index + 1}>{index + 1}</td>
                                                                        <td title={item.name}>{item.name}</td>
                                                                        <td title={item.parent.name}>{item.parent.name}</td>
                                                                        <td title={item.criteria}>{item.criteria}</td>
                                                                        <td title={item.weight}>{item.weight}</td>
                                                                        <td title={this.checkStatusTarget(item.status)}>{this.checkStatusTarget(item.status)}</td>
                                                                        <td>
                                                                            <a href="#abc" className="edit" title="Edit" data-toggle="tooltip" onClick={() => this.editTargetKPIPersonal(item.status, currentKPI.status, item)}><i className="material-icons"></i></a>
                                                                            {this.state.editingTarget === item._id ? <ModalEditTargetKPIPersonal target={item}/> : null}
                                                                            {item.default === 0 ? <a href="#abc" className="delete" title="Delete" onClick={() => this.deleteTargetKPIKPIPersonal(item.status, currentKPI.status, item._id, currentKPI._id)}><i className="material-icons"></i></a> :
                                                                                <a className="copy" title="Đây là mục tiêu mặc định (nếu cần thiết có thể sửa trọng số)"><i className="material-icons">notification_important</i></a>}
                                                                        </td>
                                                                    </tr>
                                                                )
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                            {(typeof currentKPI !== 'undefined' && currentKPI !== null) &&
                                                <div className={currentKPI.status === 0 ? "col-xs-10 col-xs-offset-8" : "col-xs-10 col-xs-offset-7"}>
                                                    {currentKPI.status === 0 ? <button type="submit" className="btn btn-success col-md-2" style={{ marginLeft: "3%" }} onClick={() => this.requestApproveKPI(currentKPI)}>Yêu cầu phê duyệt</button> :
                                                        <button type="submit" className="btn btn-success col-md-3" style={{ marginLeft: "3%" }} onClick={() => this.cancelApproveKPI(currentKPI)}>Hủy yêu cầu phê duyệt</button>}
                                                    {commenting ? <button className="btn btn-primary col-md-2" style={{ marginLeft: "15px" }} onClick={() => this.handleCommentKPI()}>Gửi phản hồi</button>
                                                        : <button className="btn btn-primary col-md-2" style={{ marginLeft: "15px" }} onClick={() => this.handleCommentKPI()}>Viết bình luận</button>}
                                                </div>}
                                            {commenting && <div className="col-xs-12">
                                                <form>
                                                    <div className="form-group">
                                                        <label>Phản hồi:</label>
                                                        <div className='form-group'>
                                                            <textarea type="text" className='form-control' id="inputname" name="reason" />
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>}
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
    const { department, createKpiPersonal, user } = state;
    return { department, createKpiPersonal, user };
}

const actionCreators = {
    getAllUserSameDepartment: UserActions.getAllUserSameDepartment,
    getDepartment: DepartmentActions.getDepartmentOfUser,
    getCurrentKPIPersonal: createKpiActions.getCurrentKPIPersonal,
    deleteTargetKPIPersonal: createKpiActions.deleteTarget,
    editKPIPersonal: createKpiActions.editKPIPersonal,
    deleteKPIPersonal: createKpiActions.deleteKPIPersonal,
    editStatusKPIPersonal: createKpiActions.editStatusKPIPersonal
};
const connectedKPIPersonalCreate = connect(mapState, actionCreators)(KPIPersonalCreate);
export { connectedKPIPersonalCreate as KPIPersonalCreate };