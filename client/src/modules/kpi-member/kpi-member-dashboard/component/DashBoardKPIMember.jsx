import React, { Component } from 'react';
import { connect } from 'react-redux';
import { UserActions } from "../../../super-admin-management/users-management/redux/actions";
import { kpiMemberActions } from '../redux/actions';
import Swal from 'sweetalert2';
import CanvasJSReact from '../../../../Chart/canvasjs.react.js';
 
class DashBoardKPIMember extends Component {
    constructor(props) {
        super(props);
        this.state = {
            commenting: false,
            infosearch: {
                role: localStorage.getItem("currentRole"),
                user: "",
                status: 4,
                starttime: this.formatDate(Date.now()),
                endtime: this.formatDate(Date.now())
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
            starttime: this.formatDate(Date.now()),
            endtime: this.formatDate(Date.now())
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
                    starttime: this.starttime.value,
                    endtime: this.endtime.value
                }
            }
        })
        const { infosearch } = this.state;
        if (infosearch.role && infosearch.user && infosearch.status && infosearch.starttime && infosearch.endtime) {
            var starttime = infosearch.starttime.split("-");
            var startdate = new Date(starttime[1], starttime[0], 0);
            var endtime = infosearch.endtime.split("-");
            var enddate = new Date(endtime[1], endtime[0], 28);
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
        var kpiApproved, systempoint, mypoint, approverpoint, targetA, targetC, targetOther, misspoint;
        if (kpimembers.kpimembers) {
            listkpi = kpimembers.kpimembers;
            kpiApproved = listkpi.filter(item => item.status === 3);
            systempoint = kpiApproved.map(item => {
                return { label: this.formatDate(item.time), y: item.systempoint }
            }).reverse();
            mypoint = kpiApproved.map(item => {
                return { label: this.formatDate(item.time), y: item.mypoint }
            }).reverse();
            approverpoint = kpiApproved.map(item => {
                return { label: this.formatDate(item.time), y: item.approverpoint }
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
                dataPoints: systempoint
            },
            {
                type: "spline",
                name: "Cá nhân tự đánh giá",
                showInLegend: true,
                dataPoints: mypoint
            }, {
                type: "spline",
                name: "Quản lý đánh giá",
                showInLegend: true,
                dataPoints: approverpoint
            }]
        }
        return (
            <div className="table-wrapper">
                {/* <div className="content-wrapper"> */}
                    {/* <section className="content-header">
                        <h1>
                            Quản lý KPI nhân viên
                        </h1>
                        <ol className="breadcrumb">
                            <li><a href="/"><i className="fa fa-dashboard" /> Home</a></li>
                            <li><a href="/">Forms</a></li>
                            <li className="active">Advanced Elements</li>
                        </ol>
                    </section> */}
                   <section className="content">
                        <div className="row">
                            <div className="col-md-3 col-sm-6 form-inline">
                                <div className="info-box">
                                    <span className="info-b
                                    ox-icon bg-aqua"><i className="ion ion-ios-gear-outline" /></span>
                                    <div className="info-box-content">
                                        <span className="info-box-text">Đã thiết lập</span>
                                        <span className="info-box-number">38/40</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 col-sm-6 form-inline">
                                <div className="info-box">
                                    <span className="info-box-icon bg-red"><i className="fa fa-thumbs-o-up" /></span>
                                    <div className="info-box-content">
                                        <span className="info-box-text">Đang thực hiện</span>
                                        <span className="info-box-number">20/40</span>
                                    </div>
                                </div>
                            </div>
                            <div className="clearfix visible-sm-block" />
                            <div className="col-md-3 col-sm-6 form-inline">
                                <div className="info-box">
                                    <span className="info-box-icon bg-green"><i className="fa fa-comments-o" /></span>
                                    <div className="info-box-content">
                                        <span className="info-box-text">Số lượng yêu cầu</span>
                                        <span className="info-box-number">760</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 col-sm-6 form-inline">
                                <div className="info-box">
                                    <span className="info-box-icon bg-yellow"><i className="ion ion-ios-people-outline" /></span>
                                    <div className="info-box-content">
                                        <span className="info-box-text">Số nhân viên</span>
                                        <span className="info-box-number">{userdepartments && (userdepartments[1].userId.length + userdepartments[2].userId.length)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="col-md-6">
                                    <div className="box box-danger">
                                        <div className="box-header with-border">
                                            <h3 className="box-title">Nhân viên ưu tú</h3>
                                            <div className="box-tools pull-right">
                                                <span className="label label-danger">8 nhân viên xuất sắc nhất</span>
                                                <button type="button" className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus" />
                                                </button>
                                                {/* <button type="button" className="btn btn-box-tool" data-widget="remove"><i className="fa fa-times" />
                                                </button> */}
                                            </div>
                                        </div>
                                        <div className="box-body no-padding">
                                            <ul className="users-list clearfix">
                                                <li>
                                                    <img src="/lib/adminLTE/dist/img/user1-128x128.jpg" alt="Avatar member" />
                                                    <a className="users-list-name" href="#detailKpiMember2" data-toggle="modal" data-target="#memberKPIApprove2">Sahara</a>
                                                    <span className="users-list-date">98</span>
                                                </li>
                                                <li>
                                                    <img src="/lib/adminLTE/dist/img/user8-128x128.jpg" alt="Avatar member" />
                                                    <a className="users-list-name" href="#detailKpiMember2" data-toggle="modal" data-target="#memberKPIApprove2">Vân Anh</a>
                                                    <span className="users-list-date">97</span>
                                                </li>
                                                <li>
                                                    <img src="/lib/adminLTE/dist/img/user7-128x128.jpg" alt="Avatar member" />
                                                    <a className="users-list-name" href="#detailKpiMember2" data-toggle="modal" data-target="#memberKPIApprove2">Jane</a>
                                                    <span className="users-list-date">97</span>
                                                </li>
                                                <li>
                                                    <img src="/lib/adminLTE/dist/img/user6-128x128.jpg" alt="Avatar member" />
                                                    <a className="users-list-name" href="#detailKpiMember2" data-toggle="modal" data-target="#memberKPIApprove2">John</a>
                                                    <span className="users-list-date">96</span>
                                                </li>
                                                <li>
                                                    <img src="/lib/adminLTE/dist/img/user2-160x160.jpg" alt="Avatar member" />
                                                    <a className="users-list-name" href="#detailKpiMember2" data-toggle="modal" data-target="#memberKPIApprove2">Alexander</a>
                                                    <span className="users-list-date">96</span>
                                                </li>
                                                <li>
                                                    <img src="/lib/adminLTE/dist/img/user5-128x128.jpg" alt="Avatar member" />
                                                    <a className="users-list-name" href="#detailKpiMember2" data-toggle="modal" data-target="#memberKPIApprove2">Sarah</a>
                                                    <span className="users-list-date">95</span>
                                                </li>
                                                <li>
                                                    <img src="/lib/adminLTE/dist/img/user4-128x128.jpg" alt="Avatar member" />
                                                    <a className="users-list-name" href="#detailKpiMember2" data-toggle="modal" data-target="#memberKPIApprove2">Nora</a>
                                                    <span className="users-list-date">95</span>
                                                </li>
                                                <li>
                                                    <img src="/lib/adminLTE/dist/img/user3-128x128.jpg" alt="Avatar member" />
                                                    <a className="users-list-name" href="#detailKpiMember2" data-toggle="modal" data-target="#memberKPIApprove2">Nadia</a>
                                                    <span className="users-list-date">95</span>
                                                </li>
                                            </ul>
                                        </div>
                                        {/* <div className="box-footer text-center">
                                            <a href="#detailKpiMember2" data-toggle="modal" data-target="#memberKPIApprove2" className="uppercase">add All Users</a>
                                        </div> */}
                                    </div>
                                </div>
                                <div className="col-md-6">
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
 
                                </div>
                            </div>
                            <div className="col-md-12">
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
                                                            <input type="text" className="form-control" ref={input => this.starttime = input} defaultValue={this.formatDate(Date.now())} name="time" id="datepicker2" data-date-format="mm-yyyy" />
                                                        {/* </div> */}
                                                    </div>
                                                    <div className="form-group" >
                                                        <label>Đến tháng:</label>
                                                        {/* <div className='input-group col-sm-4 date has-feedback' > */}
                                                            {/* <div className="input-group-addon"> */}
                                                                {/* <i className="fa fa-calendar" /> */}
                                                            {/* </div> */}
                                                            <input type="text" className="form-control" ref={input => this.endtime = input} defaultValue={this.formatDate(Date.now())} name="time" id="datepicker6" data-date-format="mm-yyyy" />
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
                                            {/* <button type="button" className="btn btn-box-tool" data-widget="remove"><i className="fa fa-times" /></button> */}
                                        </div>
                                    </div>
                                    <div className="box-body" style={{ display: "none" }}>
                                        <div className="direct-chat-messages">
                                            <div className="direct-chat-msg">
                                                <div className="direct-chat-info clearfix">
                                                    <span className="direct-chat-name pull-left">Alexander Pierce</span>
                                                    <span className="direct-chat-timestamp pull-right">23 Jan 2:00 pm</span>
                                                </div>
                                                <img className="direct-chat-img" src="/lib/adminLTE/dist/img/user1-128x128.jpg" alt="Message Avatar User" />{/* /.direct-chat-img */}
                                                <div className="direct-chat-text">
                                                    Is this template really for free? That's unbelievable!
                                                </div>
                                            </div>
                                            <div className="direct-chat-msg right">
                                                <div className="direct-chat-info clearfix">
                                                    <span className="direct-chat-name pull-right">Sarah Bullock</span>
                                                    <span className="direct-chat-timestamp pull-left">23 Jan 2:05 pm</span>
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
                    </section>
                </div>
            // </div>
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
const connectedKPIMember = connect(mapState, actionCreators)(DashBoardKPIMember);
export { connectedKPIMember as DashBoardKPIMember };