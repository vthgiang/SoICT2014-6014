import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DatePicker, SelectBox } from '../../../common-components';

import { ViewAllTasks, ViewAllOverTime, TrendWorkChart, ViewBirthdayList } from './combinedContent';
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
        this.props.getAllEmployeeKpiSetByMonth(undefined, localStorage.getItem("userId"), monthNew, "2020-12");

        /* Lấy dữ liệu nghỉ phép tăng ca của nhân viên trong công ty */
        this.props.getTimesheets({ organizationalUnits: organizationalUnits, startDate: monthNew, endDate: monthNew });

        /* Lấy số ngày nghỉ phép còn lại của nhân viên */
        this.props.getNumberAnnaulLeave({ numberAnnulLeave: true, year: partMonth[1] });
        this.props.getListWorkPlan({ year: partMonth[1] });

        /* Lấy danh sách nhân viên theo tháng sinh*/
        this.props.getAllEmployee({ status: 'active', page: 0, limit: 10000, birthdate: monthNew, organizationalUnits: organizationalUnits });
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

        /* Lấy dánh sách khen thưởng, kỷ luật */
        this.props.getListPraise({ organizationalUnits: organizationalUnits, month: monthNew });
        this.props.getListDiscipline({ organizationalUnits: organizationalUnits, month: monthNew });

        /* Lấy dữ liệu công việc của nhân viên trong đơn vị */
        this.props.getAllEmployeeOfUnitByIds(organizationalUnits);
        this.props.getTaskInOrganizationUnitByMonth(organizationalUnits, monthNew, monthNew);

        /* Lấy dữ liệu kết quả kpi của nhân viên */
        this.props.getAllEmployeeKpiSetByMonth(undefined, localStorage.getItem("userId"), monthNew, "2020-12");

        /* Lấy dữ liệu nghỉ phép tăng ca của nhân viên */
        this.props.getTimesheets({ organizationalUnits: organizationalUnits, startDate: monthNew, endDate: monthNew });

        /* Lấy số ngày nghỉ phép còn lại của nhân viên */
        this.props.getNumberAnnaulLeave({ numberAnnulLeave: true, year: partMonth[1] });
        this.props.getListWorkPlan({ year: partMonth[1] });

        /* Lấy danh sách nhân viên theo tháng sinh*/
        this.props.getAllEmployee({ status: 'active', page: 0, limit: 10000, birthdate: monthNew, organizationalUnits: organizationalUnits });
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

    /** Function xem danh sách sinh nhật */
    ViewBirthdayList = () => {
        window.$(`#modal-view-birthday-list`).modal('show');
    }

    render() {
        const { discipline, translate, timesheets, tasks, user, workPlan, annualLeave, employeesManager, createEmployeeKpiSet } = this.props;

        const { month, organizationalUnits, viewOverTime, viewHoursOff } = this.state;

        const { organizationalUnitsOfUser } = this.props;

        let partMonth = month.split('-');
        let year = partMonth[1];

        console.log('employeeKpiSetByMonth', createEmployeeKpiSet.employeeKpiSetByMonth);

        /* Lấy số ngày nghỉ phép còn lại của nhân viên */
        let numberAnnualLeave = 0;
        if (workPlan.maximumNumberOfLeaveDays && annualLeave.numberAnnulLeave && workPlan.maximumNumberOfLeaveDays - annualLeave.numberAnnulLeave > 0) {
            numberAnnualLeave = workPlan.maximumNumberOfLeaveDays - annualLeave.numberAnnulLeave
        } else if (annualLeave.numberAnnulLeave === 0 && workPlan.maximumNumberOfLeaveDays) {
            numberAnnualLeave = workPlan.maximumNumberOfLeaveDays;
        }

        /* Lấy dữ liệu công việc của môi nhân viên trong đơn vị */
        let taskListByStatus = tasks.organizationUnitTasks ? tasks.organizationUnitTasks.tasks : null;
        let listEmployee = user.employees;
        let employeeTasks = [], employeeOvertime = [], employeeHoursOff = [];
        for (let i in listEmployee) {
            let count = 0;
            taskListByStatus && taskListByStatus.forEach(task => {
                for (let j in task.accountableEmployees)
                    if (listEmployee[i].userId._id == task.accountableEmployees[j])
                        count += 1;
                for (let j in task.consultedEmployees)
                    if (listEmployee[i].userId._id == task.consultedEmployees[j])
                        count += 1;
                for (let j in task.responsibleEmployees)
                    if (listEmployee[i].userId._id == task.responsibleEmployees[j]._id)
                        count += 1;
                for (let j in task.informedEmployees)
                    if (listEmployee[i].userId._id == task.informedEmployees[j])
                        count += 1;
            });
            employeeTasks = [...employeeTasks, { _id: listEmployee[i].userId._id, name: listEmployee[i].userId.name, totalTask: count }]
        };
        if (employeeTasks.length !== 0) {
            employeeTasks = employeeTasks.sort((a, b) => b.totalTask - a.totalTask);
        };

        /* Lấy tổng số công việc làm trong tháng của nhân viên */
        let totalTask = 0;
        let taskPersonal = employeeTasks.find(x => x._id === localStorage.getItem("userId"));
        if (taskPersonal) {
            totalTask = taskPersonal.totalTask;
        }

        /* Lấy dữ liệu tăng ca và nghỉ phép của mỗi nhân viên trong đơn vị */
        let listOvertimeOfUnitsByStartDateAndEndDate = timesheets.listOvertimeOfUnitsByStartDateAndEndDate;
        for (let i in listEmployee) {
            let totalOvertime = 0, totalHoursOff = 0;
            listOvertimeOfUnitsByStartDateAndEndDate && listOvertimeOfUnitsByStartDateAndEndDate.forEach(x => {
                if (listEmployee[i].userId.email === x.employee.emailInCompany && x.totalHoursOff < 0) {
                    totalOvertime = 0 - x.totalHoursOff;

                };
                if (listEmployee[i].userId.email === x.employee.emailInCompany && x.totalHoursOff > 0) {
                    totalHoursOff = x.totalHoursOff;

                }
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

        /* Lấy tổng thời gian nghỉ phép cua nhân viên */
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
                                        <h3 className="box-title">Nhắc việc {month}</h3>
                                    </div>
                                    <div className="box-body">
                                        <ul className="todo-list">
                                            <li>
                                                <span className="handle">
                                                    <i className="fa fa-ellipsis-v"></i>
                                                    <i className="fa fa-ellipsis-v"></i>
                                                </span>
                                                <span className="text"><a href='/hr-annual-leave-personal' target="_blank">Số ngày nghỉ phép còn lại trong năm {year}</a></span>
                                                <small className="label label-success">{numberAnnualLeave} ngày</small>
                                            </li>

                                            <li>
                                                <span className="handle">
                                                    <i className="fa fa-ellipsis-v"></i>
                                                    <i className="fa fa-ellipsis-v"></i>
                                                </span>
                                                <span className="text"><a style={{ cursor: 'pointer' }} onClick={this.ViewBirthdayList} >Số nhân viên có sinh nhật</a></span>
                                                <small className="label label-info">{employeesManager.listEmployees ? employeesManager.listEmployees.length : 0} nhân viên</small>
                                            </li>
                                            <li>
                                                <span className="handle">
                                                    <i className="fa fa-ellipsis-v"></i>
                                                    <i className="fa fa-ellipsis-v"></i>
                                                </span>
                                                <span className="text"><a href='/task-management-dashboard' target="_blank">Tổng số công việc</a></span>
                                                <small className="label label-warning">{totalTask} công việc</small>
                                            </li>
                                            <li>
                                                <span className="handle">
                                                    <i className="fa fa-ellipsis-v"></i>
                                                    <i className="fa fa-ellipsis-v"></i>
                                                </span>
                                                <span className="text"><a target="_blank">Kết quả KPI</a></span>
                                                <small className="label label-success">80 điểm</small>
                                            </li>
                                            <li>
                                                <span className="handle">
                                                    <i className="fa fa-ellipsis-v"></i>
                                                    <i className="fa fa-ellipsis-v"></i>
                                                </span>
                                                <span className="text"><a style={{ pointerEvents: "none" }} >Tổng thời gian tăng ca</a></span>
                                                <small className="label label-primary">{totalOvertime} giờ</small>
                                            </li>
                                            <li>
                                                <span className="handle">
                                                    <i className="fa fa-ellipsis-v"></i>
                                                    <i className="fa fa-ellipsis-v"></i>
                                                </span>
                                                <span className="text"><a style={{ pointerEvents: "none" }} >Tổng thời gian nghỉ phép</a></span>
                                                <small className="label label-danger">{totalHoursOff} giờ</small>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Tổng hợp công việc */}
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                <div className="box box-solid">
                                    <div className="box-header with-border">
                                        <h3 className="box-title">Tổng hợp công việc {month}</h3>
                                    </div>
                                    <div className="box-body">
                                        <table className="table table-striped table-bordered table-hover">
                                            <thead>
                                                <tr>
                                                    <th>STT</th>
                                                    <th>Họ và tên</th>
                                                    <th>Số công việc</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {employeeTasks.length !== 0 &&
                                                    employeeTasks.map((x, index) => index < 5 ? (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{x.name}</td>
                                                            <td>{x.totalTask}</td>
                                                        </tr>
                                                    ) : null)
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="box-footer text-center">
                                        <a style={{ cursor: 'pointer' }} onClick={this.viewAllTasks} className="uppercase">Xem tất cả</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            {/* Tổng hợp khen thưởng */}
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                <div className="box box-solid">
                                    <div className="box-header with-border">
                                        <h3 className="box-title">Tổng hợp khen thưởng {month}</h3>
                                    </div>
                                    <div className="box-body">
                                        <table className="table table-striped table-bordered table-hover">
                                            <thead>
                                                <tr>
                                                    <th>STT</th>
                                                    <th>Họ và tên</th>
                                                    <th>Lý do khen thưởng </th>
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
                                        <a style={{ cursor: 'pointer' }} onClick={this.viewAllCommendation} className="uppercase">Xem tất cả</a>
                                    </div>
                                </div>
                            </div>
                            {/* Tổng hợp kỷ luật */}
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                <div className="box box-solid">
                                    <div className="box-header with-border">
                                        <h3 className="box-title">Tổng hợp kỷ luật {month}</h3>
                                    </div>
                                    <div className="box-body">
                                        <table className="table table-striped table-bordered table-hover">
                                            <thead>
                                                <tr>
                                                    <th>STT</th>
                                                    <th>Họ và tên</th>
                                                    <th>Lý do kỷ luật</th>
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
                                        <a style={{ cursor: 'pointer' }} onClick={this.viewAllDiscipline} className="uppercase">Xem tất cả</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            {/* Tổng hợp nghỉ phép */}
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                <div className="box box-solid">
                                    <div className="box-header with-border">
                                        <h3 className="box-title">Tổng hợp tình hình nghỉ phép {month}</h3>
                                    </div>
                                    <div className="box-body">
                                        <table className="table table-striped table-bordered table-hover">
                                            <thead>
                                                <tr>
                                                    <th>STT</th>
                                                    <th>Họ và tên</th>
                                                    <th>Tổng số giờ</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {employeeHoursOff.length !== 0 &&
                                                    employeeHoursOff.map((x, index) => index < 5 ? (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{x.name}</td>
                                                            <td>{x.totalHours}</td>
                                                        </tr>
                                                    ) : null)
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="box-footer text-center">
                                        <a style={{ cursor: 'pointer' }} onClick={this.viewAllHoursOff} className="uppercase">Xem tất cả</a>
                                    </div>
                                </div>
                            </div>

                            {/* Tổng hợp tăng ca */}
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                <div className="box box-solid">
                                    <div className="box-header with-border">
                                        <h3 className="box-title">Tổng hợp tình hình tăng ca {month}</h3>
                                    </div>
                                    <div className="box-body">
                                        <table className="table table-striped table-bordered table-hover">
                                            <thead>
                                                <tr>
                                                    <th>STT</th>
                                                    <th>Họ và tên</th>
                                                    <th>Tổng số giờ</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {employeeOvertime.length !== 0 &&
                                                    employeeOvertime.map((x, index) => index < 5 ? (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{x.name}</td>
                                                            <td>{x.totalHours}</td>
                                                        </tr>
                                                    ) : null)
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="box-footer text-center">
                                        <a style={{ cursor: 'pointer' }} onClick={this.viewAllOverTime} className="uppercase">Xem tất cả</a>
                                    </div>
                                </div>
                            </div>

                            <TrendWorkChart nameChart={'Xu hướng làm việc'} nameData1={'Tổng giờ làm'} nameData2={'Tổng giờ tăng ca'} />

                        </div>
                    </div> : <div className="box">
                        <div className="box-body">
                            <h4>Bạn chưa có đơn vị</h4>
                        </div>
                    </div>
                }

                <ViewAllTasks employeeTasks={employeeTasks} title={`Tổng hợp công việc ${month}`} showCheck={true} />
                <ViewAllCommendation dataCommendation={discipline.totalListCommendation} title={`Tổng hợp khen thưởng ${month}`} />
                <ViewAllDiscipline dataDiscipline={discipline.totalListDiscipline} title={`Tổng hợp kỷ luật ${month}`} />
                {
                    viewOverTime &&
                    <ViewAllOverTime dataView={employeeOvertime} title={`Tổng hợp tình hình tăng ca ${month}`} id={viewOverTime} showCheck={true} />
                }
                {
                    viewHoursOff &&
                    <ViewAllOverTime dataView={employeeHoursOff} title={`Tổng hợp tình hình nghỉ phép ${month}`} id={viewHoursOff} showCheck={true} />
                }
                { employeesManager.listEmployees &&
                    <ViewBirthdayList dataBirthday={employeesManager.listEmployees} title={`Danh sách nhân viên có sinh nhật trong tháng ${month}`} />
                }

            </React.Fragment>
        );
    }
};
function mapState(state) {
    const { timesheets, tasks, user, workPlan, annualLeave, employeesManager, createEmployeeKpiSet, discipline } = state;
    return { timesheets, tasks, user, workPlan, annualLeave, employeesManager, createEmployeeKpiSet, discipline };
}

const actionCreators = {
    getTimesheets: TimesheetsActions.searchTimesheets,
    getTaskInOrganizationUnitByMonth: taskManagementActions.getTaskInOrganizationUnitByMonth,
    getAllEmployeeOfUnitByIds: UserActions.getAllEmployeeOfUnitByIds,
    getListWorkPlan: WorkPlanActions.getListWorkPlan,
    getNumberAnnaulLeave: AnnualLeaveActions.searchAnnualLeaves,
    getAllEmployee: EmployeeManagerActions.getAllEmployee,
    getAllEmployeeKpiSetByMonth: createKpiSetActions.getAllEmployeeKpiSetByMonth,

    getListPraise: DisciplineActions.getListPraise,
    getListDiscipline: DisciplineActions.getListDiscipline,
};

const componentInfor = connect(mapState, actionCreators)(withTranslate(ComponentInfor));
export { componentInfor as ComponentInfor };