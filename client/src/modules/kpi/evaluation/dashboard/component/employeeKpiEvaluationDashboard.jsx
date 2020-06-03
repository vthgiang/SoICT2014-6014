import React, { Component } from 'react';
import { connect } from 'react-redux';

import { UserActions } from "../../../../super-admin/user/redux/actions";
import { kpiMemberActions } from '../../employee-evaluation/redux/actions';
import { DashboardEvaluationEmployeeKpiSetAction } from '../redux/actions';
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions';

import { StatisticsEmployeeKpiSetChart } from './statisticsEmployeeKpiSetChart';

import { SelectBox, SelectMulti } from '../../../../../common-components';
import Swal from 'sweetalert2';
import CanvasJSReact from '../../../../../chart/canvasjs.react.js';
import { DatePicker } from '../../../../../common-components';
import { LOCAL_SERVER_API } from '../../../../../env';
import { withTranslate } from 'react-redux-multilingual';


class DashBoardKPIMember extends Component {
    constructor(props) {
        super(props);

        var currentDate = new Date();
        var currentYear = currentDate.getFullYear();
        var currentMonth = currentDate.getMonth();
        
        this.INFO_SEARCH = {
            userId: localStorage.getItem("userId"),
            startMonth: currentYear + '-' + 1,
            endMonth: currentYear + '-' + (currentMonth + 1)
        }

        this.state = {
            commenting: false,
            infosearch: {
                role: localStorage.getItem("currentRole"),
                userId: localStorage.getItem("userId"),
                status: 4,
                startMonth: currentYear + '-' + 1,
                endMonth: currentYear + '-' + (currentMonth + 1)
            },
            showApproveModal: "",
            showEvaluateModal: "",

            dateOfExcellentEmployees: this.formatDate(new Date(currentYear, currentMonth - 1, 1)),
            numberOfExcellentEmployees: 5,
            ids: null,
            editing: false,
        };
    }

    componentDidMount() {
        var currentDate = new Date();
        var currentMonth = currentDate.getMonth();
        var currentYear = currentDate.getFullYear();

        var infosearch = {
            role: localStorage.getItem("currentRole"),
            user: "all",
            status: 5,
            startDate: this.formatDate(Date.now()),
            endDate: this.formatDate(new Date(currentYear, currentMonth - 11, 1))
        }
        // Lấy tất cả nhân viên của phòng ban
 
        this.props.getAllUserSameDepartment(localStorage.getItem("currentRole"));
        this.props.getAllKPIMemberOfUnit(infosearch);
        this.props.getAllKPIMember();//---------localStorage.getItem("id")--------
        
        this.handleResizeColumn();

        this.props.getAllEmployeeKpiSetOfUnitByRole(localStorage.getItem("currentRole"));
        this.props.getAllEmployeeOfUnitByRole(localStorage.getItem("currentRole"));
        this.props.getChildrenOfOrganizationalUnitsAsTree(localStorage.getItem("currentRole"));
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
        var startDate = this.INFO_SEARCH.startMonth.split("-");
        var startdate = new Date(startDate[1], startDate[0], 0);
        var endDate = this.INFO_SEARCH.endMonth.split("-");
        var enddate = new Date(endDate[1], endDate[0], 28);
        
        if (Date.parse(startdate) > Date.parse(enddate)) {
            Swal.fire({
                title: "Thời gian bắt đầu phải trước hoặc bằng thời gian kết thúc!",
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Xác nhận'
            })
        } else {
            await this.setState(state => {
                return {
                    ...state,
                    infosearch: {
                        ...state.infosearch,
                        userId: this.INFO_SEARCH.userId,
                        startMonth: this.INFO_SEARCH.startMonth,
                        endMonth: this.INFO_SEARCH.endMonth
                    }
                }
            })
        }
        console.log("55555", this.state.infosearch, this.INFO_SEARCH)
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

    handleChangeDate = async (value) => {        
        await this.setState(state => {
            return {
                ...state,
                dateOfExcellentEmployees: value
            }
        })
    }

    handleNumberOfEmployeesChange = (event) => {
        const value = event.target.value;
        this.setState(state => {
            return {
                ...state,
                numberOfExcellentEmployees: value
            }
        });    
    }

    handleSelectOrganizationalUnit = (value) => {
        this.setState(state => {
            return {
                ...state,
                ids: value
            }
        });   
    }

    handleUpdateData = () => {
        this.props.getAllEmployeeKpiSetOfUnitByIds(this.state.ids);
        this.props.getAllEmployeeOfUnitByIds(this.state.ids);
        this.props.getChildrenOfOrganizationalUnitsAsTree(localStorage.getItem("currentRole"));
    }

    handleShowEditing = () => {
        this.setState(state => {
            return {
                ...state,
                editing: !state.editing
            }
        });
    }

    handleSelectEmployee = (value) => {
        this.INFO_SEARCH.userId = value[0];
    }

    handleSelectMonthStart = (value) => {
        var month = value.slice(3,7) + '-' + value.slice(0,2);
        this.INFO_SEARCH.startMonth = month;
    }

    handleSelectMonthEnd = async (value) => {
        var month = value.slice(3,7) + '-' + value.slice(0,2);
        this.INFO_SEARCH.endMonth = month;
    }

    render() {
        var employeeKpiSets, lastMonthEmployeeKpiSets, currentMonthEmployeeKpiSets, settingUpKpi, awaitingApprovalKpi, activatedKpi, totalKpi, numberOfEmployee;
        var { dateOfExcellentEmployees, numberOfExcellentEmployees, editing } = this.state;

        var currentDate = new Date();
        var currentYear = currentDate.getFullYear();
        var currentMonth = currentDate.getMonth();

        if(this.props.dashboardEvaluationEmployeeKpiSet.employeeKpiSets !== undefined){
            employeeKpiSets = this.props.dashboardEvaluationEmployeeKpiSet.employeeKpiSets;

            //Lấy các kpi set của tháng cần xem
            lastMonthEmployeeKpiSets = employeeKpiSets.filter(item => this.formatDate(item.date) == dateOfExcellentEmployees);
            
            // Sắp xếp theo chiều giảm dần điểm được phê duyệt
            lastMonthEmployeeKpiSets.sort((a, b) => b.approvedPoint - a.approvedPoint);

            // Lấy các kpi set có điểm được phê duyệt cao nhất
            lastMonthEmployeeKpiSets = lastMonthEmployeeKpiSets.slice(0, numberOfExcellentEmployees);
        }
        

        if(employeeKpiSets !== undefined){
            currentMonthEmployeeKpiSets = employeeKpiSets.filter(item => this.formatDate(item.date) == this.formatDate(new Date(currentYear, currentMonth, 1)));

            totalKpi = currentMonthEmployeeKpiSets.length;
            settingUpKpi = currentMonthEmployeeKpiSets.filter(item => item.status == 0);
            settingUpKpi = settingUpKpi.length;
            awaitingApprovalKpi = currentMonthEmployeeKpiSets.filter(item => item.status == 1);
            awaitingApprovalKpi = awaitingApprovalKpi.length;
            activatedKpi = currentMonthEmployeeKpiSets.filter(item => item.status == 2);
            activatedKpi = activatedKpi.length;
        }
        
        if(this.props.dashboardEvaluationEmployeeKpiSet.employees !== undefined){
            numberOfEmployee = this.props.dashboardEvaluationEmployeeKpiSet.employees.length;
        }

        var queue = [];
        var childrenOrganizationalUnit = [];
        if(this.props.dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit !== undefined){
           var currentOrganizationalUnit = this.props.dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit;
            
           childrenOrganizationalUnit.push(currentOrganizationalUnit);
           queue.push(currentOrganizationalUnit);
           while(queue.length > 0){
               var v = queue.shift();
               if(v.children !== undefined){
                for(var i = 0; i < v.children.length; i++){
                    var u = v.children[i];
                    queue.push(u);
                    childrenOrganizationalUnit.push(u);
                }
            }
           }
        }        
        

        var userdepartments, kpimember, items;
        const { user, kpimembers } = this.props;

        if (user.userdepartments) userdepartments = user.userdepartments;
        if(userdepartments === undefined) {
            items = [];
        } 
        else {
            items = userdepartments.map(x => {
                return { value: x.userId._id, text: x.userId.name }
            });
        }

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
        
        var d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        var defaultTime =  [month, year].join('-');

        // hàm để chuyển sang song ngữ
        const { translate } = this.props;

        return (
            <div className="box">
                <div className="box-header with-border qlcv">
                    <div className="form-inline">
                        <div className="form-group">
                            <label className = "form-control-static">{translate('kpi.evaluation.dashboard.organizational_unit')}</label>
                            {childrenOrganizationalUnit &&
                                <SelectMulti id="multiSelectOrganizationalUnit"
                                    //value = {childrenOrganizationalUnit.map(item => {return item.id})}
                                    items = {childrenOrganizationalUnit.map(item => {return {value: item.id, text: item.name}})} 
                                    options = {{nonSelectedText: translate('kpi.evaluation.dashboard.select_all_units'), allSelectedText: translate('kpi.evaluation.dashboard.all_unit')}}
                                    onChange={this.handleSelectOrganizationalUnit}
                                >
                                </SelectMulti>
                            }
                            <button type="button" className="btn btn-success" title="Tìm tiếm mẫu công việc" onClick={this.handleUpdateData}>{translate('kpi.evaluation.dashboard.search')}</button>
                        </div>
                    </div>
                </div>

                <div className="box-body">
                    <div className="row">
                        <div className="col-md-3 col-sm-6 form-inline">
                            <div className="info-box">
                                <span className="info-box-icon bg-aqua"><i className="fa fa-cogs" /></span>
                                <div className="info-box-content">
                                    <span className="info-box-text">{`KPI ${translate('kpi.evaluation.dashboard.setting_up')}`}</span>
                                    <span className="info-box-number">{`${settingUpKpi}/${totalKpi}`}</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6 form-inline">
                            <div className="info-box">
                                <span className="info-box-icon bg-green"><i className="fa fa-comments-o" /></span>
                                <div className="info-box-content">
                                    <span className="info-box-text">{`KPI ${translate('kpi.evaluation.dashboard.awaiting_approval')}`}</span>
                                    <span className="info-box-number">{`${awaitingApprovalKpi}/${totalKpi}`}</span>
                                </div>
                            </div>
                        </div>
                        <div className="clearfix visible-sm-block" />
                        <div className="col-md-3 col-sm-6 form-inline">
                            <div className="info-box">
                                <span className="info-box-icon bg-red"><i className="fa fa-thumbs-o-up" /></span>
                                <div className="info-box-content">
                                    <span className="info-box-text">{`KPI ${translate('kpi.evaluation.dashboard.activated')}`}</span>
                                    <span className="info-box-number">{`${activatedKpi}/${totalKpi}`}</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6 form-inline">
                            <div className="info-box">
                                <span className="info-box-icon bg-yellow"><i className="fa fa-users" /></span>
                                <div className="info-box-content">
                                    <span className="info-box-text">{translate('kpi.evaluation.dashboard.number_of_employee')}</span>
                                    <span className="info-box-number">{numberOfEmployee}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* Nhân viên ưu tú */}
                        <div className="col-md-12">
                            <div className="box box-danger">
                                <div className="box-header with-border">
                                    <h3 className="box-title">{translate('kpi.evaluation.dashboard.excellent_employee')}</h3>
                                    <div className="box-tools pull-right">
                                        <span className="label label-danger">{`${numberOfExcellentEmployees} ${translate('kpi.evaluation.dashboard.best_employee')}`}</span>

                                        <button type="button" data-toggle="collapse" data-target="#setting-excellent-employee" className="pull-right" style={{ border: "none", background: "none", padding: "0px" }}><i className="fa fa-gear" style={{ fontSize: "19px" }}></i></button>
                                        <div id="setting-excellent-employee" className="box collapse setting-table">
                                            <span className="pop-arw arwTop L-auto" style={{ right: "26px" }}></span>

                                            <div className = "form-group">
                                                <label className = "form-control-static">{translate('kpi.evaluation.dashboard.month')}</label>
                                                <DatePicker
                                                    id="kpi_month"      
                                                    dateFormat="month-year"             // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm 
                                                    value={this.state.dateOfExcellentEmployees} // giá trị mặc định cho datePicker    
                                                    onChange={this.handleChangeDate}
                                                    disabled={false}                     // sử dụng khi muốn disabled, mặc định là false
                                                /> 
                                            </div> 

                                            <div className="form-group">
                                                <label className="form-control-static">{translate('kpi.evaluation.dashboard.number_of_employee')}</label>
                                                <input name="numberOfExcellentEmployees" className="form-control" type="Number" onChange={(event) => this.handleNumberOfEmployeesChange(event)} defaultValue={numberOfExcellentEmployees}/>
                                            </div>
                                        </div>

                                    </div>
                                </div>                                 
                                <div className="box-body no-parding">
                                    <ul className="users-list clearfix">
                                        {
                                            (typeof lastMonthEmployeeKpiSets !== 'undefined' && lastMonthEmployeeKpiSets.length !== 0) ?
                                                lastMonthEmployeeKpiSets.map(item =>
                                                    <li>
                                                        <img src={ (LOCAL_SERVER_API + item.creator.avatar) } />
                                                        <a className="users-list-name" href="#detailKpiMember2" data-toggle="modal" data-target="#memberKPIApprove2">{item.creator.name}</a>
                                                        <span className="users-list-date">{item.approvedPoint}</span>
                                                    </li>
                                                )
                                            : <li>Không có dữ liệu</li>
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>


                        {/* Thống kê kết quả thực hiện mục tiêu của nhân viên */}
                        <div className="col-md-12">
                            <div className="box box-info">
                                <div className="box-header with-border">
                                    <h3 className="box-title">Thống kê kết quả thực hiện mục tiêu của nhân viên</h3>
                                    <div className="box-tools pull-right">
                                        <button type="button" className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus" />
                                        </button>
                                    </div>
                                </div>
                                {/* /.box-header */}

                                <div className="box-body qlcv">
                                    <div className="form-inline">
                                        <div className="col-sm-6 col-xs-12 form-group" >
                                            <label>Từ tháng</label>
                                            <DatePicker 
                                                id="monthStart"      
                                                dateFormat="month-year"             // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm 
                                                //value={defaultTime}                 // giá trị mặc định cho datePicker    
                                                onChange={this.handleSelectMonthStart}
                                                disabled={false}                    // sử dụng khi muốn disabled, mặc định là false
                                            />
                                        </div>
                                        <div className="col-sm-6 col-xs-12 form-group" >
                                            <label>Đến tháng</label>
                                            <DatePicker 
                                                id="monthEnd"      
                                                dateFormat="month-year"             // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm 
                                                //value={defaultTime}                 // giá trị mặc định cho datePicker    
                                                onChange={this.handleSelectMonthEnd}
                                                disabled={false}                    // sử dụng khi muốn disabled, mặc định là false
                                            />
                                        </div>
                                    </div>
                                    <div className="form-inline">
                                        {userdepartments && (items.length !== 0) &&
                                            <div className="col-sm-6 col-xs-12 form-group"> 
                                                <label>Nhân viên</label>
                                                <SelectBox
                                                    id={`createEmployeeKpiSet`}
                                                    className="form-control select2"
                                                    style={{ width: "100%" }}
                                                    items={items}
                                                    multiple={false}
                                                    onChange={this.handleSelectEmployee}
                                                    value={items[0]}
                                                />
                                            </div>
                                        }
                                        <div className="col-sm-6 col-xs-12 form-group">
                                            <label></label>
                                            <button type="button" className="btn btn-success" onClick={this.handleSearchData}>Tìm kiếm</button>
                                        </div>
                                    </div>

                                    <div className="col-sm-12 col-xs-12">
                                        <StatisticsEmployeeKpiSetChart 
                                            userId={this.state.infosearch.userId} 
                                            startMonth={this.state.infosearch.startMonth}
                                            endMonth={this.state.infosearch.endMonth}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                        {/* Phản hồi nhân viên */}
                        <div className="col-md-3" id="chart-member">
                            <div className="box box-success direct-chat direct-chat-success collapsed-box">
                                <div className="box-header with-border">
                                    <h3 className="box-title">Phản hồi nhân viên</h3>
                                    <div className="box-tools pull-right">
                                        <span data-toggle="tooltip" title="3 New Messages" className="badge bg-green">3</span>
                                        <button type="button" className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-plus" />
                                        </button>
                                        <button type="button" className="btn btn-box-tool" data-toggle="tooltip" title="Contacts" data-widget="chat-pane-toggle">
                                            <i className="fa fa-comments" /></button>
                                        {/* <button type="button" className="btn btn-box-tool" data-widget="remove"><i className="fa fa-dates" /></button> */}
                                    </div>
                                </div>
                                <div className="box-body" style={{ display: "none" }}>
                                    <div className="direct-chat-messages">
                                        <div className="direct-chat-msg">
                                            <div className="direct-chat-info clearfix">
                                                <span className="direct-chat-name pull-left">Alexander Pierce</span>
                                                <span className="direct-chat-datestamp pull-right">23 Jan 2:00 pm</span>
                                            </div>
                                            <img className="direct-chat-img" src="/lib/adminLTE/dist/img/user1-128x128.jpg" alt="Message Avatar User" />{/* /.direct-chat-img */}
                                            <div className="direct-chat-text">
                                                Is this template really for free? That's unbelievable!
                                            </div>
                                        </div>
                                        <div className="direct-chat-msg right">
                                            <div className="direct-chat-info clearfix">
                                                <span className="direct-chat-name pull-right">Sarah Bullock</span>
                                                <span className="direct-chat-datestamp pull-left">23 Jan 2:05 pm</span>
                                            </div>
                                            <img className="direct-chat-img" src="/lib/adminLTE/dist/img/user3-128x128.jpg" alt="Message Avatar User" />{/* /.direct-chat-img */}
                                            <div className="direct-chat-text">
                                                You better believe it!
                                            </div>
                                        </div>
                                    </div>
                                    <div className="direct-chat-contacts">
                                        <ul className="contacts-list">
                                            <li>
                                                <a href="#detailKpiMember2" data-toggle="modal" data-target="#memberKPIApprove2">
                                                    <img className="contacts-list-img" src="/lib/adminLTE/dist/img/user1-128x128.jpg" alt="Avatar User" />
                                                    <div className="contacts-list-info">
                                                        <span className="contacts-list-name">
                                                            Count Dracula
                                                            <small className="contacts-list-date pull-right">2/28/2015</small>
                                                        </span>
                                                        <span className="contacts-list-msg">How have you been? I was...</span>
                                                    </div>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#detailKpiMember2" data-toggle="modal" data-target="#memberKPIApprove2">
                                                    <img className="contacts-list-img" src="/lib/adminLTE/dist/img/user1-128x128.jpg" alt="Avatar User" />
                                                    <div className="contacts-list-info">
                                                        <span className="contacts-list-name">
                                                            Count Dracula
                                                            <small className="contacts-list-date pull-right">2/28/2015</small>
                                                        </span>
                                                        <span className="contacts-list-msg">How have you been? I was...</span>
                                                    </div>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#detailKpiMember2" data-toggle="modal" data-target="#memberKPIApprove2">
                                                    <img className="contacts-list-img" src="/lib/adminLTE/dist/img/user1-128x128.jpg" alt="Avatar User" />
                                                    <div className="contacts-list-info">
                                                        <span className="contacts-list-name">
                                                            Count Dracula
                                                            <small className="contacts-list-date pull-right">2/28/2015</small>
                                                        </span>
                                                        <span className="contacts-list-msg">How have you been? I was...</span>
                                                    </div>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#detailKpiMember2" data-toggle="modal" data-target="#memberKPIApprove2">
                                                    <img className="contacts-list-img" src="/lib/adminLTE/dist/img/user1-128x128.jpg" alt="Avatar User" />
                                                    <div className="contacts-list-info">
                                                        <span className="contacts-list-name">
                                                            Count Dracula
                                                            <small className="contacts-list-date pull-right">2/28/2015</small>
                                                        </span>
                                                        <span className="contacts-list-msg">How have you been? I was...</span>
                                                    </div>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#detailKpiMember2" data-toggle="modal" data-target="#memberKPIApprove2">
                                                    <img className="contacts-list-img" src="/lib/adminLTE/dist/img/user1-128x128.jpg" alt="Avatar User" />
                                                    <div className="contacts-list-info">
                                                        <span className="contacts-list-name">
                                                            Count Dracula
                                                            <small className="contacts-list-date pull-right">2/28/2015</small>
                                                        </span>
                                                        <span className="contacts-list-msg">How have you been? I was...</span>
                                                    </div>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#detailKpiMember2" data-toggle="modal" data-target="#memberKPIApprove2">
                                                    <img className="contacts-list-img" src="/lib/adminLTE/dist/img/user1-128x128.jpg" alt="Avatar User" />
                                                    <div className="contacts-list-info">
                                                        <span className="contacts-list-name">
                                                            Count Dracula
                                                            <small className="contacts-list-date pull-right">2/28/2015</small>
                                                        </span>
                                                        <span className="contacts-list-msg">How have you been? I was...</span>
                                                    </div>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#detailKpiMember2" data-toggle="modal" data-target="#memberKPIApprove2">
                                                    <img className="contacts-list-img" src="/lib/adminLTE/dist/img/user1-128x128.jpg" alt="Avatar User" />
                                                    <div className="contacts-list-info">
                                                        <span className="contacts-list-name">
                                                            Count Dracula
                                                            <small className="contacts-list-date pull-right">2/28/2015</small>
                                                        </span>
                                                        <span className="contacts-list-msg">How have you been? I was...</span>
                                                    </div>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#detailKpiMember2" data-toggle="modal" data-target="#memberKPIApprove2">
                                                    <img className="contacts-list-img" src="/lib/adminLTE/dist/img/user1-128x128.jpg" alt="Avatar User" />
                                                    <div className="contacts-list-info">
                                                        <span className="contacts-list-name">
                                                            Count Dracula
                                                            <small className="contacts-list-date pull-right">2/28/2015</small>
                                                        </span>
                                                        <span className="contacts-list-msg">How have you been? I was...</span>
                                                    </div>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="box-footer" style={{ display: "none" }}>
                                    <form action="#abc" method="post">
                                        <div className="input-group">
                                            <input type="text" name="message" placeholder="Type Message ..." className="form-control" />
                                            <span className="input-group-btn">
                                                <button type="submit" className="btn btn-success btn-flat">Send</button>
                                            </span>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                     </div>               

            </div>
        );
    }
}
 
function mapState(state) {
    const { user, kpimembers, dashboardEvaluationEmployeeKpiSet, department } = state;
    return { user, kpimembers, dashboardEvaluationEmployeeKpiSet, department };
}
 
const actionCreators = {
    getAllUserSameDepartment: UserActions.getAllUserSameDepartment,
    getAllKPIMemberOfUnit: kpiMemberActions.getAllKPIMemberOfUnit,
    getAllKPIMember: kpiMemberActions.getAllKPIMemberByMember,
    getAllEmployeeKpiSetOfUnitByRole : DashboardEvaluationEmployeeKpiSetAction.getAllEmployeeKpiSetOfUnitByRole,
    getAllEmployeeOfUnitByRole : DashboardEvaluationEmployeeKpiSetAction.getAllEmployeeOfUnitByRole,
    getAllEmployeeKpiSetOfUnitByIds : DashboardEvaluationEmployeeKpiSetAction.getAllEmployeeKpiSetOfUnitByIds,
    getAllEmployeeOfUnitByIds : DashboardEvaluationEmployeeKpiSetAction.getAllEmployeeOfUnitByIds,
    getChildrenOfOrganizationalUnitsAsTree : DashboardEvaluationEmployeeKpiSetAction.getChildrenOfOrganizationalUnitsAsTree,
};
const connectedKPIMember = connect(mapState, actionCreators)(withTranslate(DashBoardKPIMember));
export { connectedKPIMember as DashBoardKPIMember };