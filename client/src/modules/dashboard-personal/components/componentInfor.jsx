import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DatePicker, SelectBox } from '../../../common-components';

import { ViewAllTasks, ViewAllOverTime, TrendWorkChart } from './combinedContent';
import { ViewAllCommendation, ViewAllDiscipline } from '../../dashboard-unit/components/combinedContent';

import { DisciplineActions } from '../../human-resource/commendation-discipline/redux/actions';
import { AnnualLeaveActions } from '../../human-resource/annual-leave/redux/actions';
import { WorkPlanActions } from '../../human-resource/work-plan/redux/actions';
import { TimesheetsActions } from '../../human-resource/timesheets/redux/actions';
import { EmployeeManagerActions } from '../../human-resource/profile/employee-management/redux/actions'
import { taskManagementActions } from '../../task/task-management/redux/actions';
import { createKpiSetActions } from '../../kpi/employee/creation/redux/actions';
import { UserActions } from '../../super-admin/user/redux/actions';


class ComponentInfor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            month: this.formatDate(Date.now(), true),
            monthShow: this.formatDate(Date.now(), true),
            organizationalUnits: [this.props.organizationalUnitsOfUser[0]._id],
        }
    }

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
     */
    formatDate(date, monthYear = false) {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            if (monthYear === true) {
                return [month, year].join('-');
            } else return [day, month, year].join('-');
        }
        return date;
    };

    componentDidMount() {
        const { month, organizationalUnits } = this.state;
        let partMonth = month.split('-');
        let monthNew = [partMonth[1], partMonth[0]].join('-');

        /* Lấy dánh sách khen thưởng, kỷ luật */
        this.props.getListPraise({ organizationalUnits: organizationalUnits, month: monthNew });
        this.props.getListDiscipline({ organizationalUnits: organizationalUnits, month: monthNew });

        /* Lấy dữ liệu công việc của nhân viên trong đơn vị */
        this.props.getAllEmployeeOfUnitByIds(organizationalUnits);
        this.props.getTaskInOrganizationUnitByMonth(organizationalUnits, monthNew, monthNew);

        /* Lấy dữ liệu kết quả kpi của nhân viên */
        this.props.getAllEmployeeKpiSetByMonth(undefined, localStorage.getItem("userId"), monthNew, monthNew);

        /* Lấy dữ liệu nghỉ phép tăng ca của nhân viên trong công ty */
        this.props.getTimesheets({ organizationalUnits: organizationalUnits, startDate: monthNew, endDate: monthNew });

        /* Lấy số ngày nghỉ phép còn lại của nhân viên */
        this.props.getNumberAnnaulLeave({ numberAnnulLeave: true, year: partMonth[1] });
        this.props.getListWorkPlan({ year: partMonth[1] });

    }

    /**
     * Function bắt sự kiện thay đổi đơn vị
     * @param {*} value : Array id đơn vị
     */
    handleSelectOrganizationalUnit = (value) => {
        this.setState({
            organizationalUnits: value
        })
    }

    /**
     * Function bắt sự kiện thay đổi tháng
     * @param {*} value : Giá trị tháng
     */
    handleSelectMonth = (value) => {
        this.setState({
            month: value
        })
    }

    /** Bắt sự kiện phân tích dữ liệu */
    handleUpdateData = () => {
        const { month, organizationalUnits } = this.state;
        let partMonth = month.split('-');
        let monthNew = [partMonth[1], partMonth[0]].join('-');
        this.setState({
            monthShow: month
        })

        /* Lấy dánh sách khen thưởng, kỷ luật */
        this.props.getListPraise({ organizationalUnits: organizationalUnits, month: monthNew });
        this.props.getListDiscipline({ organizationalUnits: organizationalUnits, month: monthNew });

        /* Lấy dữ liệu công việc của nhân viên trong đơn vị */
        this.props.getAllEmployeeOfUnitByIds(organizationalUnits);
        this.props.getTaskInOrganizationUnitByMonth(organizationalUnits, monthNew, monthNew);

        /* Lấy dữ liệu kết quả kpi của nhân viên */
        this.props.getAllEmployeeKpiSetByMonth(undefined, localStorage.getItem("userId"), monthNew, monthNew);

        /* Lấy dữ liệu nghỉ phép tăng ca của nhân viên */
        this.props.getTimesheets({ organizationalUnits: organizationalUnits, startDate: monthNew, endDate: monthNew });

        /* Lấy số ngày nghỉ phép còn lại của nhân viên */
        this.props.getNumberAnnaulLeave({ numberAnnulLeave: true, year: partMonth[1] });
        this.props.getListWorkPlan({ year: partMonth[1] });

    }

    /** Function xem tất cả bảng tổng hợp công việc*/
    viewAllTasks = () => {
        window.$('#modal-view-all-task').modal('show');
    }

    /** Function xem tất cả bảng tổng hợp khen thưởng*/
    viewAllCommendation = () => {
        window.$('#modal-view-all-commendation').modal('show');
    }

    /** Function xem tất cả bảng tổng hợp kỷ luật*/
    viewAllDiscipline = () => {
        window.$('#modal-view-all-discipline').modal('show');
    }

    /** Function xem tất cả tình hình tăng ca */
    viewAllOverTime = async () => {
        await this.setState({
            viewOverTime: 'overTime',
        });
        window.$(`#modal-view-${"overTime"}`).modal('show');
    };

    /** Function xem tất cả tình hình nghỉ phép */
    viewAllHoursOff = async () => {
        await this.setState({
            viewHoursOff: 'hoursOff',
        });
        window.$(`#modal-view-${"hoursOff"}`).modal('show');
    }

    render() {
        const { discipline, translate, timesheets, tasks, user, workPlan, annualLeave, createEmployeeKpiSet } = this.props;

        const { monthShow, month, organizationalUnits, viewOverTime, viewHoursOff } = this.state;

        const { organizationalUnitsOfUser } = this.props;

        let partMonth = monthShow.split('-');
        let year = partMonth[1];

        console.log('employeeKpiSetByMonth', createEmployeeKpiSet.employeeKpiSetByMonth);

        /* Lấy số ngày nghỉ phép còn lại của nhân viên */
        let numberAnnualLeave = 0;
        let maximumNumberOfLeaveDays = 0;
        if (workPlan.maximumNumberOfLeaveDays && annualLeave.numberAnnulLeave && workPlan.maximumNumberOfLeaveDays - annualLeave.numberAnnulLeave > 0) {
            maximumNumberOfLeaveDays = workPlan.maximumNumberOfLeaveDays
            numberAnnualLeave = workPlan.maximumNumberOfLeaveDays - annualLeave.numberAnnulLeave
        } else if (annualLeave.numberAnnulLeave === 0 && workPlan.maximumNumberOfLeaveDays) {
            numberAnnualLeave = workPlan.maximumNumberOfLeaveDays;
            maximumNumberOfLeaveDays = workPlan.maximumNumberOfLeaveDays
        }

        /* Lấy dữ liệu công việc của mỗi nhân viên trong đơn vị */
        let taskListByStatus = tasks.organizationUnitTasks ? tasks.organizationUnitTasks.tasks : null;
        let listEmployee = user.employees;
        let maxTask = 1;
        let employeeTasks = [], employeeOvertime = [], employeeHoursOff = [];
        for (let i in listEmployee) {
            let tasks = [];
            let accountableEmployees = [], consultedEmployees = [], responsibleEmployees = [], informedEmployees = [];
            taskListByStatus && taskListByStatus.forEach(task => {
                for (let j in task.accountableEmployees)
                    if (listEmployee[i].userId._id === task.accountableEmployees[j])
                        accountableEmployees = [...accountableEmployees, task.accountableEmployees[j]];
                for (let j in task.consultedEmployees)
                    if (listEmployee[i].userId._id === task.consultedEmployees[j])
                        consultedEmployees = [...consultedEmployees, task.accountableEmployees[j]];
                for (let j in task.responsibleEmployees)
                    if (listEmployee[i].userId._id === task.responsibleEmployees[j]._id)
                        responsibleEmployees = [...responsibleEmployees, task.accountableEmployees[j]];
                for (let j in task.informedEmployees)
                    if (listEmployee[i].userId._id === task.informedEmployees[j])
                        informedEmployees = [...informedEmployees, task.accountableEmployees[j]];
            });
            tasks = tasks.concat(accountableEmployees).concat(consultedEmployees).concat(responsibleEmployees).concat(informedEmployees);
            let totalTask = tasks.filter(function (item, pos) {
                return tasks.indexOf(item) == pos;
            })
            if (totalTask.length > totalTask) {
                maxTask = totalTask
            };
            employeeTasks = [...employeeTasks, {
                _id: listEmployee[i].userId._id,
                name: listEmployee[i].userId.name,
                accountableEmployees: accountableEmployees.length,
                consultedEmployees: consultedEmployees.length,
                responsibleEmployees: responsibleEmployees.length,
                informedEmployees: informedEmployees.length,
                totalTask: totalTask.length
            }]
        };

        if (employeeTasks.length !== 0) {
            employeeTasks = employeeTasks.sort((a, b) => b.totalTask - a.totalTask);
        };

        /* Lấy tổng số công việc làm trong tháng của nhân viên */
        let totalTask = 0, accountableEmployees = 0, consultedEmployees = 0, responsibleEmployees = 0, informedEmployees = 0;
        let taskPersonal = employeeTasks.find(x => x._id === localStorage.getItem("userId"));
        if (taskPersonal) {
            totalTask = taskPersonal.totalTask;
            accountableEmployees = taskPersonal.accountableEmployees;
            consultedEmployees = taskPersonal.consultedEmployees;
            responsibleEmployees = taskPersonal.responsibleEmployees;
            informedEmployees = taskPersonal.informedEmployees;

        }

        /* Lấy dữ liệu tăng ca và nghỉ phép của mỗi nhân viên trong đơn vị */
        let listOvertimeOfUnitsByStartDateAndEndDate = timesheets.listOvertimeOfUnitsByStartDateAndEndDate;
        for (let i in listEmployee) {
            let totalOvertime = 0, totalHoursOff = 0;
            listOvertimeOfUnitsByStartDateAndEndDate && listOvertimeOfUnitsByStartDateAndEndDate.forEach(x => {
                if (listEmployee[i].userId.email === x.employee.emailInCompany) {
                    totalOvertime = x.totalOvertime ? x.totalOvertime : 0;
                    totalHoursOff = x.totalHoursOff ? x.totalHoursOff : 0;
                };
            });
            employeeOvertime = [...employeeOvertime, { _id: listEmployee[i].userId._id, name: listEmployee[i].userId.name, totalHours: totalOvertime }];
            employeeHoursOff = [...employeeHoursOff, { _id: listEmployee[i].userId._id, name: listEmployee[i].userId.name, totalHours: totalHoursOff }];
        };
        /* Sắp xếp theo thứ tự giảm dần */
        if (employeeOvertime.length !== 0) {
            employeeOvertime = employeeOvertime.sort((a, b) => b.totalHours - a.totalHours);
        };
        if (employeeHoursOff.length !== 0) {
            employeeHoursOff = employeeHoursOff.sort((a, b) => b.totalHours - a.totalHours);
        };
        let maxHoursOff = 1, maxOverTime = 1;
        employeeHoursOff.forEach(x => {
            if (x.totalHours > maxHoursOff) {
                maxHoursOff = x.totalHours
            }
        })

        employeeOvertime.forEach(x => {
            if (x.totalHours > maxHoursOff) {
                maxOverTime = x.totalHours
            }
        })

        /* Lấy tổng thời gian nghỉ phép của nhân viên */
        let totalOvertime = 0, totalHoursOff = 0;
        let overtimePersonal = employeeOvertime.find(x => x._id === localStorage.getItem("userId"));
        let hoursOffPersonal = employeeHoursOff.find(x => x._id === localStorage.getItem("userId"));
        if (overtimePersonal) {
            totalOvertime = overtimePersonal.totalHours
        };
        if (hoursOffPersonal) {
            totalHoursOff = hoursOffPersonal.totalHours
        }

        return (
            <React.Fragment>
                { organizationalUnitsOfUser.length !== 0
                    ? <div className="qlcv">
                        <div className="form-inline" style={{ marginBottom: 10 }}>
                            <div className="form-group">
                                <label style={{ width: "auto" }}>{translate('kpi.organizational_unit.dashboard.organizational_unit')}</label>
                                <SelectBox
                                    id={`organizationalUnitSelectBox`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={organizationalUnitsOfUser.map(item => { return { value: item._id, text: item.name } })}
                                    multiple={false}
                                    onChange={this.handleSelectOrganizationalUnit}
                                    value={organizationalUnits[0]}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ width: "auto" }}>{translate('kpi.organizational_unit.dashboard.month')}</label>
                                <DatePicker
                                    id="monthInOrganizationalUnitKpiDashboard"
                                    dateFormat="month-year"
                                    value={month}
                                    onChange={this.handleSelectMonth}
                                    deleteValue={false}
                                />
                            </div>

                            <button type="button" className="btn btn-success" onClick={this.handleUpdateData}>{translate('kpi.evaluation.dashboard.analyze')}</button>
                        </div>
                        <div className="row">

                            {/* Nhắc việc */}
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                <div className="box box-solid">
                                    <div className="box-header with-border">
                                        <h3 className="box-title">{translate('human_resource.dashboard_personal.remind_work')} {monthShow}</h3>
                                    </div>
                                    <div className="box-body">
                                        <ul className="todo-list">
                                            <li>
                                                <span className="handle">
                                                    <i className="fa fa-ellipsis-v"></i>
                                                    <i className="fa fa-ellipsis-v"></i>
                                                </span>
                                                <span className="text"><a href='/hr-annual-leave-personal' target="_blank">{translate('human_resource.dashboard_personal.number_annual_leave_in_year')} {year}</a></span>
                                                <small className="label label-success">{numberAnnualLeave}/{maximumNumberOfLeaveDays} ngày</small>
                                            </li>

                                            <li>
                                                <span className="handle">
                                                    <i className="fa fa-ellipsis-v"></i>
                                                    <i className="fa fa-ellipsis-v"></i>
                                                </span>
                                                <span className="text"><a href='/task-management-dashboard' target="_blank" >{translate('human_resource.dashboard_personal.task')}</a></span>
                                                <small className="label label-danger">{accountableEmployees} {translate('human_resource.dashboard_personal.accountable')}</small>
                                                <small className="label label-success">{responsibleEmployees} {translate('human_resource.dashboard_personal.responsible')}</small>
                                                <small className="label label-warning">{consultedEmployees} {translate('human_resource.dashboard_personal.consulted')}</small>
                                                <small className="label label-info">{informedEmployees} {translate('human_resource.dashboard_personal.informed')}</small>
                                            </li>
                                            <li>
                                                <span className="handle">
                                                    <i className="fa fa-ellipsis-v"></i>
                                                    <i className="fa fa-ellipsis-v"></i>
                                                </span>
                                                <span className="text"><a href='/task-management-dashboard' target="_blank">{translate('human_resource.dashboard_personal.task_total')}</a></span>
                                                <small className="label label-warning">{totalTask} {translate('human_resource.dashboard_personal.task')}</small>
                                            </li>
                                            <li title="Hệ thống đánh giá/Cá nhân đánh giá/Quản lý đánh giá">
                                                <span className="handle">
                                                    <i className="fa fa-ellipsis-v"></i>
                                                    <i className="fa fa-ellipsis-v"></i>
                                                </span>
                                                <span className="text"><a target="_blank">{translate('human_resource.dashboard_personal.kpi_results')}</a></span>
                                                <small className="label label-success">{`80 ${translate('human_resource.dashboard_personal.point')}/ 90 ${translate('human_resource.dashboard_personal.point')}/95 ${translate('human_resource.dashboard_personal.point')}`}</small>
                                            </li>
                                            <li>
                                                <span className="handle">
                                                    <i className="fa fa-ellipsis-v"></i>
                                                    <i className="fa fa-ellipsis-v"></i>
                                                </span>
                                                <span className="text"><a style={{ pointerEvents: "none" }} >{translate('human_resource.dashboard_personal.overtime_total')}</a></span>
                                                <small className="label label-primary">{totalOvertime} {translate('human_resource.dashboard_personal.hours')}</small>
                                            </li>
                                            <li>
                                                <span className="handle">
                                                    <i className="fa fa-ellipsis-v"></i>
                                                    <i className="fa fa-ellipsis-v"></i>
                                                </span>
                                                <span className="text"><a style={{ pointerEvents: "none" }} >{translate('human_resource.dashboard_personal.total_time_annual_leave')}</a></span>
                                                <small className="label label-danger">{totalHoursOff} {translate('human_resource.dashboard_personal.hours')}</small>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Tổng hợp công việc */}
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                <div className="box box-solid">
                                    <div className="box-header with-border">
                                        <h3 className="box-title"> {translate('human_resource.dashboard_personal.general_task')} {monthShow}</h3>
                                    </div>
                                    <div className="box-body">
                                        <table className="table table-striped table-bordered table-hover">
                                            <thead>
                                                <tr>
                                                    <th className="col-fixed" style={{ width: 80 }}>STT</th>
                                                    <th>{translate('human_resource.dashboard_personal.fullname')}</th>
                                                    <th>{translate('human_resource.dashboard_personal.task_total')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {employeeTasks.length !== 0 &&
                                                    employeeTasks.map((x, index) => index < 5 ? (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{x.name}</td>
                                                            <td>
                                                                <div className="clearfix"> <small className="pull-right">{x.totalTask}</small> </div>
                                                                <div className="progress xs">
                                                                    <div style={{ width: `${(x.totalTask / maxTask).toFixed(2) * 100}%` }} className="progress-bar progress-bar-green">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ) : null)
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="box-footer text-center">
                                        <a style={{ cursor: 'pointer' }} onClick={this.viewAllTasks} className="uppercase">{translate('human_resource.dashboard_personal.see_all')}</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            {/* Tổng hợp khen thưởng */}
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                <div className="box box-solid">
                                    <div className="box-header with-border">
                                        <h3 className="box-title">{translate('human_resource.dashboard_personal.general_commendation')} {monthShow}</h3>
                                    </div>
                                    <div className="box-body">
                                        <table className="table table-striped table-bordered table-hover">
                                            <thead>
                                                <tr>
                                                    <th className="col-fixed" style={{ width: 80 }}>STT</th>
                                                    <th>{translate('human_resource.dashboard_personal.fullname')}</th>
                                                    <th>{translate('human_resource.dashboard_personal.reason_praise')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {discipline.totalListCommendation.length !== 0 &&
                                                    discipline.totalListCommendation.map((x, index) => index < 5 ? (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{x.employee.fullName}</td>
                                                            <td>{x.reason}</td>
                                                        </tr>
                                                    ) : null)
                                                }
                                            </tbody>
                                        </table>
                                        {
                                            (!discipline.totalListCommendation || discipline.totalListCommendation.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                                        }
                                    </div>
                                    <div className="box-footer text-center">
                                        <a style={{ cursor: 'pointer' }} onClick={this.viewAllCommendation} className="uppercase">{translate('human_resource.dashboard_personal.see_all')}</a>
                                    </div>
                                </div>
                            </div>
                            {/* Tổng hợp kỷ luật */}
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                <div className="box box-solid">
                                    <div className="box-header with-border">
                                        <h3 className="box-title">{translate('human_resource.dashboard_personal.general_discipline')} {monthShow}</h3>
                                    </div>
                                    <div className="box-body">
                                        <table className="table table-striped table-bordered table-hover">
                                            <thead>
                                                <tr>
                                                    <th className="col-fixed" style={{ width: 80 }}>STT</th>
                                                    <th>{translate('human_resource.dashboard_personal.fullname')}</th>
                                                    <th>{translate('human_resource.dashboard_personal.reason_discipline')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {discipline.totalListDiscipline.length !== 0 &&
                                                    discipline.totalListDiscipline.map((x, index) => index < 5 ? (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{x.employee.fullName}</td>
                                                            <td>{x.reason}</td>
                                                        </tr>
                                                    ) : null)
                                                }
                                            </tbody>
                                        </table>
                                        {
                                            (!discipline.totalListDiscipline || discipline.totalListDiscipline.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                                        }
                                    </div>
                                    <div className="box-footer text-center">
                                        <a style={{ cursor: 'pointer' }} onClick={this.viewAllDiscipline} className="uppercase">{translate('human_resource.dashboard_personal.see_all')}</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            {/* Tổng hợp nghỉ phép */}
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                <div className="box box-solid">
                                    <div className="box-header with-border">
                                        <h3 className="box-title">{translate('human_resource.dashboard_personal.general_annual_leave')} {monthShow}</h3>
                                    </div>
                                    <div className="box-body">
                                        <table className="table table-striped table-bordered table-hover">
                                            <thead>
                                                <tr>
                                                    <th>STT</th>
                                                    <th>{translate('human_resource.dashboard_personal.fullname')}</th>
                                                    <th>{translate('human_resource.dashboard_personal.total_hours')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {employeeHoursOff.length !== 0 &&
                                                    employeeHoursOff.map((x, index) => index < 5 ? (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>Nhân viên {index + 1}</td>
                                                            {/* <td>{x.totalHours}</td> */}
                                                            <td>
                                                                <div className="clearfix"> <small className="pull-right">{x.totalHours}</small> </div>
                                                                <div className="progress xs">
                                                                    <div style={{ width: `${(x.totalHours / maxHoursOff).toFixed(2) * 100}%` }} className="progress-bar progress-bar-green">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ) : null)
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="box-footer text-center">
                                        <a style={{ cursor: 'pointer' }} onClick={this.viewAllHoursOff} className="uppercase">{translate('human_resource.dashboard_personal.see_all')}</a>
                                    </div>
                                </div>
                            </div>

                            {/* Tổng hợp tăng ca */}
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                <div className="box box-solid">
                                    <div className="box-header with-border">
                                        <h3 className="box-title">{translate('human_resource.dashboard_personal.general_overtime')} {monthShow}</h3>
                                    </div>
                                    <div className="box-body">
                                        <table className="table table-striped table-bordered table-hover">
                                            <thead>
                                                <tr>
                                                    <th>STT</th>
                                                    <th>{translate('human_resource.dashboard_personal.fullname')}</th>
                                                    <th>{translate('human_resource.dashboard_personal.total_hours')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {employeeOvertime.length !== 0 &&
                                                    employeeOvertime.map((x, index) => index < 5 ? (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>Nhân viên {index + 1}</td>
                                                            {/* <td>{x.totalHours}</td> */}
                                                            <td>
                                                                <div className="clearfix"> <small className="pull-right">{x.totalHours}</small> </div>
                                                                <div className="progress xs">
                                                                    <div style={{ width: `${(x.totalHours / maxOverTime).toFixed(2) * 100}%` }} className="progress-bar progress-bar-green">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ) : null)
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="box-footer text-center">
                                        <a style={{ cursor: 'pointer' }} onClick={this.viewAllOverTime} className="uppercase">{translate('human_resource.dashboard_personal.see_all')}</a>
                                    </div>
                                </div>
                            </div>

                            <TrendWorkChart nameChart={`${translate('human_resource.dashboard_personal.trend_of_work')}`} nameData1={`${translate('human_resource.dashboard_personal.total_hours_works')}`} nameData2={`${translate('human_resource.dashboard_personal.overtime_total')}`} />

                        </div>
                    </div> : <div className="box">
                        <div className="box-body">
                            <h4>{translate('human_resource.dashboard_personal.not_org_unit')}</h4>
                        </div>
                    </div>
                }

                <ViewAllTasks employeeTasks={employeeTasks} title={`${translate('human_resource.dashboard_personal.general_task')} ${monthShow}`} showCheck={true} />
                <ViewAllCommendation dataCommendation={discipline.totalListCommendation} title={`${translate('human_resource.dashboard_personal.general_commendation')} ${monthShow}`} />
                <ViewAllDiscipline dataDiscipline={discipline.totalListDiscipline} title={`${translate('human_resource.dashboard_personal.general_discipline')} ${monthShow}`} />
                {
                    viewOverTime &&
                    <ViewAllOverTime dataView={employeeOvertime} hideEmployee={true} title={`${translate('human_resource.dashboard_personal.general_overtime')} ${monthShow}`} id={viewOverTime} showCheck={true} />
                }
                {
                    viewHoursOff &&
                    <ViewAllOverTime dataView={employeeHoursOff} hideEmployee={true} title={`${translate('human_resource.dashboard_personal.general_annual_leave')} ${monthShow}`} id={viewHoursOff} showCheck={true} />
                }

            </React.Fragment>
        );
    }
};
function mapState(state) {
    const { timesheets, tasks, user, workPlan, annualLeave, createEmployeeKpiSet, discipline } = state;
    return { timesheets, tasks, user, workPlan, annualLeave, createEmployeeKpiSet, discipline };
}

const actionCreators = {
    getTimesheets: TimesheetsActions.searchTimesheets,
    getTaskInOrganizationUnitByMonth: taskManagementActions.getTaskInOrganizationUnitByMonth,
    getAllEmployeeOfUnitByIds: UserActions.getAllEmployeeOfUnitByIds,
    getListWorkPlan: WorkPlanActions.getListWorkPlan,
    getNumberAnnaulLeave: AnnualLeaveActions.searchAnnualLeaves,
    getAllEmployeeKpiSetByMonth: createKpiSetActions.getAllEmployeeKpiSetByMonth,

    getListPraise: DisciplineActions.getListPraise,
    getListDiscipline: DisciplineActions.getListDiscipline,
};

const componentInfor = connect(mapState, actionCreators)(withTranslate(ComponentInfor));
export { componentInfor as ComponentInfor };