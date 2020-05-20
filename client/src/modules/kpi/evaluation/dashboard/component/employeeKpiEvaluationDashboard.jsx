import React, { Component } from 'react';
import { connect } from 'react-redux';
import { UserActions } from "../../../../super-admin/user/redux/actions";
import { kpiMemberActions } from '../../employee-evaluation/redux/actions';
import { DashboardEvaluationEmployeeKpiSetAction } from '../redux/actions';
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions';
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
            showEvaluateModal: "",

            dateOfExcellentEmployees: this.formatDate(new Date(currentYear, currentMonth - 1, 1)),
            numberOfExcellentEmployees: 1,
            role: [localStorage.getItem("currentRole")],
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
        let script = document.createElement('script');
        script.src = '../lib/main/js/CoCauToChuc.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        this.handleResizeColumn();


        this.props.getAllEmployeeKpiSetOfUnit([localStorage.getItem("currentRole")]);
        this.props.getAllEmployeeOfUnit([localStorage.getItem("currentRole")]);
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

    handleChangeDate = async (value) => {        
        await this.setState(state => {
            return {
                ...state,
                dateOfExcellentEmployees: value
            }
        })
    }

    handleNumberOfEmployeesChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                numberOfExcellentEmployees: value[0]   
            }
        });    
    }

    handleSelectOrganizationalUnit = (value) => {
        this.setState(state => {
            return {
                ...state,
                role: value
            }
        });   
    }

    handleUpdateData = () => {
        this.props.getAllEmployeeKpiSetOfUnit(this.state.role);
        this.props.getAllEmployeeOfUnit(this.state.role);
    }

    handleShowEditing = () => {
        this.setState(state => {
            return {
                ...state,
                editing: !state.editing
            }
        });
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
        
        var employeeItems = [];
        for(var i = 1; i <= 20; i++){
            employeeItems[i - 1] = {value: i, text: i}
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
                                    defaultValue = {childrenOrganizationalUnit.map(item => {return item.dean})}
                                    items = {childrenOrganizationalUnit.map(item => {return {value: item.dean, text: item.name}})} 
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
                                        <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false" onClick={() => this.handleShowEditing()}>
                                            <span className="caret" />
                                        </button>

                                        <button type="button" className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus"></i></button>
                                        <button type="button" class="btn btn-box-tool" data-toggle="tooltip" title="" data-widget="chat-pane-toggle" data-original-title="Contacts"><i class="fa fa-comments"></i></button>
                                        <button type="button" className="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></button>
                                    </div>
                                </div>                                 
                                <div className="box-body no-parding">
                            
                                    <div className="row">
                                        <div className="col-sm-8">
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

                                        {   editing &&
                                            <div className="col-sm-4">
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
                                                <div className = "form-group">
                                                    <label className = "form-control-static">{translate('kpi.evaluation.dashboard.number_of_employee')}</label>
                                                    <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                                        id={`number-of-employees`}
                                                        className="form-control select2"
                                                        style={{width: "100%"}}
                                                        items = {employeeItems}
                                                        onChange={this.handleNumberOfEmployeesChange}
                                                        multiple={false}
                                                    /> 
                                                </div>    
                                            </div>
                                        }

                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Yêu cầu Phê duyệt kpi nhân viên này KPI */}
                        {/* <div className="col-md-6">
                            <div className="box box-primary">
                                <div className="box-header with-border">
                                    <h3 className="box-title">Yêu cầu Phê duyệt kpi nhân viên này KPI</h3>
                                    <div className="box-tools pull-right">
                                        <button type="button" className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus" />
                                        </button>
                                    </div>
                                </div>
                                <div className="box-body">
                                    <ul className="products-list product-list-in-box">
                                        <li className="item">
                                            <div className="product-img">
                                                <img src="/lib/adminLTE/dist/img/user1-128x128.jpg" alt="Avatar member" />
                                            </div>
                                            <div className="product-info">
                                                <a href="#detailKpiMember2" data-toggle="modal" data-target="#memberKPIApprove2" className="product-title">Alexander
                                                <span className="label label-info pull-right">Mới</span></a>
                                                <span className="product-description">
                                                    Sếp duyệt KPI tháng tới giúp em nhé sếp!
                                                </span>
                                            </div>
                                        </li>
                                        <li className="item">
                                            <div className="product-img">
                                                <img src="/lib/adminLTE/dist/img/user2-160x160.jpg" alt="Avatar member" />
                                            </div>
                                            <div className="product-info">
                                                <a href="#detailKpiMember2" data-toggle="modal" data-target="#memberKPIApprove2" className="product-title">John
                                                <span className="label label-warning pull-right">Chưa xem</span></a>
                                                <span className="product-description">
                                                    Sếp duyệt KPI giúp em với sếp.
                                                </span>
                                            </div>
                                        </li>
                                        <li className="item">
                                            <div className="product-img">
                                                <img src="/lib/adminLTE/dist/img/user3-128x128.jpg" alt="Avatar member" />
                                            </div>
                                            <div className="product-info">
                                                <a href="#detailKpiMember2" data-toggle="modal" data-target="#memberKPIApprove2" className="product-title"> Sahara
                                                <span className="label label-danger pull-right">Gấp</span></a>
                                                <span className="product-description">
                                                    E đã sửa lại. Sếp duyệt lại giúp em nhé.
                                                </span>
                                            </div>
                                        </li>
                                        <li className="item">
                                            <div className="product-img">
                                                <img src="/lib/adminLTE/dist/img/user4-128x128.jpg" alt="Avatar member" />
                                            </div>
                                            <div className="product-info">
                                                <a href="#detailKpiMember2" data-toggle="modal" data-target="#memberKPIApprove2" className="product-title">Nora
                                                <span className="label label-success pull-right">Đã xem</span></a>
                                                <span className="product-description">
                                                    Sếp duyệt KPI giúp em nhé sếp.
                                                </span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div className="box-footer text-center">
                                    <a href="#detailKpiMember2" data-toggle="modal" data-target="#memberKPIApprove2" className="uppercase">Xem tất cả yêu cầu</a>
                                </div>
                            </div>
                        </div> */}

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
                                            
                                            <div className="form-group" >
                                                <label>Từ tháng:</label>
                                                {/* <div className='input-group col-sm-4 date has-feedback'> */}
                                                    {/* <div className="input-group-addon"> */}
                                                        {/* <i className="fa fa-calendar" /> */}
                                                        {/* </div> */}
                                                    <input type="text" className="form-control" ref={input => this.startDate = input} defaultValue={this.formatDate(Date.now())} name="date" id="datepicker2" data-date-format="mm-yyyy" />
                                                {/* </div> */}
                                            </div>
                                            <div className="form-group" >
                                                <label>Đến tháng:</label>
                                                {/* <div className='input-group col-sm-4 date has-feedback' > */}
                                                    {/* <div className="input-group-addon"> */}
                                                        {/* <i className="fa fa-calendar" /> */}
                                                    {/* </div> */}
                                                    <input type="text" className="form-control" ref={input => this.endDate = input} defaultValue={this.formatDate(Date.now())} name="date" id="datepicker6" data-date-format="mm-yyyy" />
                                                {/* </div> */}
                                            </div>
                                            
                                        </div>
                                        <div className="form-inline">
                                    <div className='form-group'>
                                        <label>Nhân viên:</label>
                                        {userdepartments && <select defaultValue={userdepartments[1].userId._id} className="form-control" ref={input => this.user = input}>
                                            <optgroup label={userdepartments[1].roleId.name}>
                                                <option key={userdepartments[1].userId._id} value={userdepartments[1].userId._id}>{userdepartments[1].userId.name}</option>
                                            </optgroup>
                                            <optgroup label={userdepartments[2].roleId.name}>
                                                <option key={userdepartments[2].userId._id} value={userdepartments[2].userId._id}>{userdepartments[2].userId.name}</option>
                                            </optgroup>
                                        </select>}
                                    </div>
                                    <div className="form-group">
                                        <label></label>
                                        <button type="button" className="btn btn-success pull-right" onClick={() => this.handleSearchData()}>Tìm kiếm</button>
                                    </div>
                                </div>
                                
                                        
                                        <div className="col-xs-12">
                                            <CanvasJSReact options={options1} />
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
    getAllEmployeeKpiSetOfUnit : DashboardEvaluationEmployeeKpiSetAction.getAllEmployeeKpiSetOfUnit,
    getAllEmployeeOfUnit : DashboardEvaluationEmployeeKpiSetAction.getAllEmployeeOfUnit,
    getChildrenOfOrganizationalUnitsAsTree : DashboardEvaluationEmployeeKpiSetAction.getChildrenOfOrganizationalUnitsAsTree,
};
const connectedKPIMember = connect(mapState, actionCreators)(withTranslate(DashBoardKPIMember));
export { connectedKPIMember as DashBoardKPIMember };