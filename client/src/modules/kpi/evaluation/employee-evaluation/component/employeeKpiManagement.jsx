import React, { Component } from 'react';
import { ModalMemberApprove } from './employeeKpiApproveModal';
import { ModalMemberEvaluate } from './employeeKpiEvaluateModal';
import { connect } from 'react-redux';
import { UserActions } from "../../../../super-admin/user/redux/actions";
import { kpiMemberActions } from '../redux/actions';
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions' ;
import Swal from 'sweetalert2';
import CanvasJSChart from '../../../../../chart/canvasjs.react.js';
import {PaginateBar, DataTableSetting } from '../../../../../common-components';
// import { withTranslate } from 'react-redux-multilingual';
 
class KPIMember extends Component {
    constructor(props) {
        super(props);
        this.state = {
            commenting: false,
            infosearch: {
                role: localStorage.getItem("currentRole"),
                user: "",
                status: 4,
                startDate: this.formatDate(Date.now()),
                endDate: this.formatDate(Date.now())
            },
            showApproveModal: "",
            showEvaluateModal: ""
        };
    }
    componentDidMount() {
        var infosearch = {
            role: localStorage.getItem("currentRole"),
            user: "all",
            status: 4,
            startDate: this.formatDate(Date.now()),
            endDate: this.formatDate(Date.now())
        }
        // Lấy tất cả nhân viên của phòng ban

        this.props.getAllUserSameDepartment(localStorage.getItem("currentRole"));
        this.props.getAllKPIMemberOfUnit(infosearch);
        this.props.getAllKPIMember();//---------localStorage.getItem("id")--------
        let script = document.createElement('script');
        script.src = '../lib/main/js/GridTableVers1.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        this.handleResizeColumn();
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
    handleSearchData = async () => {
        await this.setState(state => {
            return {
                ...state,
                infosearch: {
                    ...state.infosearch,
                    user: this.user.value,
                    status: this.status.value,
                    startDate: this.startDate.value,
                    endDate: this.endDate.value
                }
            }
        })
        const { infosearch } = this.state;
        if (infosearch.role && infosearch.user && infosearch.status && infosearch.startDate && infosearch.endDate) {
            var startDate = infosearch.startDate.split("-");
            var startdate = new Date(startDate[1], startDate[0], 0);
            var endDate = infosearch.endDate.split("-");
            var enddate = new Date(endDate[1], endDate[0], 28);
            if (Date.parse(startdate) > Date.parse(enddate)) {
                Swal.fire({
                    title: "Thời gian bắt đầu phải trước hoặc bằng thời gian kết thúc!",
                    type: 'warning',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Xác nhận'
                })
            } else {
                this.props.getAllKPIMemberOfUnit(infosearch);
            }
        }
    }
    handleShowApproveModal = async (id) => {
        await this.setState(state => {
            return {
                ...state,
                showApproveModal: id
            }
        })
        var element = document.getElementsByTagName("BODY")[0];
        element.classList.add("modal-open");
        var modal = document.getElementById(`memberKPIApprove${id}`);
        modal.classList.add("in");
        modal.style = "display: block; padding-right: 17px;";
    }
    showEvaluateModal = async (id) => {
        await this.setState(state => {
            return {
                ...state,
                showEvaluateModal: id
            }
        })
        var element = document.getElementsByTagName("BODY")[0];
        element.classList.add("modal-open");
        var modal = document.getElementById(`memberEvaluate${id}`);
        modal.classList.add("in");
        modal.style = "display: block; padding-right: 17px;";
    }
    render() {
        var userdepartments, kpimember;
        const { user, kpimembers } = this.props;
        if (user.userdepartments) userdepartments = user.userdepartments;
        if (kpimembers.kpimembers) kpimember = kpimembers.kpimembers;
        var listkpi;
        var kpiApproved, automaticPoint, employeePoint, approvedPoint, targetA, targetC, targetOther, misspoint;
        if (kpimembers.kpimembers) {
            listkpi = kpimembers.kpimembers;
            kpiApproved = listkpi.filter(item => item.status === 3);
            automaticPoint = kpiApproved.map(item => {
                return { label: this.formatDate(item.date), y: item.automaticPoint }
            }).reverse();
            employeePoint = kpiApproved.map(item => {
                return { label: this.formatDate(item.date), y: item.employeePoint }
            }).reverse();
            approvedPoint = kpiApproved.map(item => {
                return { label: this.formatDate(item.date), y: item.approvedPoint }
            }).reverse();
        }
        const options1 = {
            animationEnabled: true,
            exportEnabled: true,
            // title: {
            //     text: "Kết quả KPI cá nhân năm 2019",
            //     fontFamily: "tahoma",
            //     fontWeight: "normal",
            //     fontSize: 25,
            // },
            axisY: {
                title: "Kết quả",
                includeZero: false
            },
            toolTip: {
                shared: true
            },
            data: [{
                type: "spline",
                name: "Hệ thống đánh giá",
                showInLegend: true,
                dataPoints: automaticPoint
            },
            {
                type: "spline",
                name: "Cá nhân tự đánh giá",
                showInLegend: true,
                dataPoints: employeePoint
            }, {
                type: "spline",
                name: "Quản lý đánh giá",
                showInLegend: true,
                dataPoints: approvedPoint
            }]
        }
        return (
            <React.Fragment>
                <div className="box">
                    <div className="box-body qlcv">
                        <div className="form-inline">
                        <div className="form-group">
                            <label>Nhân viên:</label>
                            {userdepartments && <select defaultValue="all" className="form-control" ref={input=> this.user = input}>
                            <option value="all">Tất cả nhân viên</option>
                            <optgroup label={userdepartments[1].roleId.name}>
                                <option key={userdepartments[1].userId._id} value={userdepartments[1].userId._id}>
                                {userdepartments[1].userId.name}</option>
                            </optgroup>
                            <optgroup label={userdepartments[2].roleId.name}>
                                <option key={userdepartments[2].userId._id} value={userdepartments[2].userId._id}>
                                {userdepartments[2].userId.name}</option>
                            </optgroup>
                            </select>}
                        </div>
                        <div className="form-group">
                            <label>Trạng thái:</label>
                            <select defaultValue={4} className="form-control" ref={input=> this.status = input}>
                            <option value={0}>Đang thiết lập</option>
                            <option value={1}>Chờ phê duyệt</option>
                            <option value={2}>Đã kích hoạt</option>
                            <option value={3}>Đã kết thúc</option>
                            <option value={4}>Đang hoạt động</option>
                            <option value={5}>Tất cả các trạng thái</option>
                            </select>
                        </div>
                        </div>

                        <div className="form-inline">
                        <div className="form-group">
                            <label>Từ tháng:</label>

                            <input type="text" className="form-control" ref={input=> this.startDate = input}
                            defaultValue={this.formatDate(Date.now())} name="date" id="datepicker2" data-date-format="mm-yyyy" />

                        </div>
                        <div className="form-group">
                            <label>Đến tháng:</label>

                            <input type="text" className="form-control" ref={input=> this.endDate = input}
                            defaultValue={this.formatDate(Date.now())} name="date" id="datepicker6" data-date-format="mm-yyyy" />
                            <div className="form-group">
                            <button type="button" className="btn btn-success" onClick={()=> this.handleSearchData()}>Tìm
                                kiếm</button>
                            </div>

                        </div>

                        </div>

                        <DataTableSetting class="pull-right" tableId="tree-table" tableContainerId="tree-table-container" tableWidth="1300px"
                        columnArr={[ 'STT' , 'Thời gian' , 'Tên nhân viên' , 'Số lượng mục tiêu' , 'Trạng thái KPI' , 'Kết quả'
                        , 'Phê duyệt' , 'Đánh giá' ]} limit={this.state.perPage} setLimit={this.setLimit} hideColumnOption={true} />

                        <table id="myTable" className="table table-hover table-bordered">
                        <thead>
                            <tr>
                            <th title="STT">STT</th>
                            <th title="Thời gian">Thời gian</th>
                            <th title="Tên nhân viên">Tên nhân viên</th>
                            <th title="Số lượng mục tiêu">Số lượng mục tiêu</th>
                            <th title="Trạng thái KPI">Trạng thái Kpi</th>
                            <th title="Kết quả">Kết quả</th>
                            <th title=">Phê duyệt">Phê duyệt</th>
                            <th title="Đánh giá">Đánh giá</th>
                            </tr>
                        </thead>
                        <tbody className="task-table">
                            {(typeof kpimember !== "undefined" && kpimember.length !== 0) ?
                            kpimember.map((item, index) =>
                            <tr key={index + 1}>
                            <td title={index+1}>{index + 1}</td>
                            <td title={this.formatDate(item.date)}>{this.formatDate(item.date)}</td>
                            <td title="">{item.creator.name}</td>
                            <td title="">{item.kpis.length}</td>
                            <td title="">{this.checkStatusKPI(item.status)}</td>
                            <td title="">{item.approvedPoint === -1 ? "Chưa đánh giá" : item.approvedPoint}</td>
                            <td>
                                <a href="#abc" onClick={()=> this.handleShowApproveModal(item._id)} data-toggle="modal" className="approve"
                                title="Phê duyệt kpi nhân viên này"><i className="fa fa-bullseye"></i></a>
                                {this.state.showApproveModal === item._id ?
                                <ModalMemberApprove id={item._id} /> : null}
                            </td>
                            <td>
                                <a href="#memberEvaluate1" onClick={()=> this.showEvaluateModal(item._id)} data-toggle="modal"
                                className="copy" title="Đánh giá kpi nhân viên này"><i className="fa fa-list"></i></a>
                                {this.state.showEvaluateModal === item._id ?
                                <ModalMemberEvaluate name={item.creator.name} id={item._id} /> : null}
                            </td>
                            </tr>
                            ) : <tr>
                            <td colSpan={8}>
                                <center>Không có dữ liệu</center>
                            </td>
                            </tr>}
                        </tbody>
                        </table>
                    </div>
                </div>

        </React.Fragment>
        );
    }
}

function mapState(state) {
    const { user, kpimembers } = state;
    return { user, kpimembers };
}
 
const actionCreators = {
    getAllUserSameDepartment: UserActions.getAllUserSameDepartment,
    getAllKPIMemberOfUnit: kpiMemberActions.getAllKPIMemberOfUnit,
    getAllKPIMember: kpiMemberActions.getAllKPIMemberByMember
};
const connectedKPIMember = connect(mapState, actionCreators)(KPIMember);
export { connectedKPIMember as KPIMember };