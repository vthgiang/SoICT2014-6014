import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { TabEmployeeCapacity, TabIntegratedStatistics } from './combinedContent';
import { TabHumanResource, TabSalary, TabAnualLeave } from '../../human-resource/employee-dashboard/components/combinedContent';

import { DatePicker, SelectMulti, LazyLoadComponent, forceCheckOrVisible } from '../../../common-components';

import { EmployeeManagerActions } from '../../human-resource/profile/employee-management/redux/actions';
import { TimesheetsActions } from '../../human-resource/timesheets/redux/actions';
import { AnnualLeaveActions } from '../../human-resource/annual-leave/redux/actions';
import { DisciplineActions } from '../../human-resource/commendation-discipline/redux/actions';
import { SalaryActions } from '../../human-resource/salary/redux/actions';
import { taskManagementActions } from '../../task/task-management/redux/actions';
import { UserActions } from '../../super-admin/user/redux/actions';

class MainDashboardUnit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            month: this.formatDate(Date.now(), true),
            monthShow: this.formatDate(Date.now(), true),
            organizationalUnits: [this.props.childOrganizationalUnit[0].id],
            arrayUnitShow: [this.props.childOrganizationalUnit[0].id],
        }
    };

    componentDidMount() {
        const { organizationalUnits, month } = this.state;
        let partMonth = month.split('-');
        let newMonth = [partMonth[1], partMonth[0]].join('-');

        /* Lấy danh sách nhân viên  */
        this.props.getAllEmployee({ organizationalUnits: organizationalUnits, status: 'active' });

        /* Lấy dữ liệu công việc của nhân viên trong đơn vị */
        this.props.getAllEmployeeOfUnitByIds(organizationalUnits);
        this.props.getTaskInOrganizationUnitByMonth(organizationalUnits, newMonth, newMonth);

        /* Lấy dánh sách khen thưởng, kỷ luật */
        this.props.getListPraise({ organizationalUnits: organizationalUnits, month: newMonth });
        this.props.getListDiscipline({ organizationalUnits: organizationalUnits, month: newMonth });

        /* Lấy dữ liệu lương nhân viên*/
        this.props.searchSalary({ callApiDashboard: true, organizationalUnits: organizationalUnits, month: newMonth });
        this.props.searchSalary({ callApiDashboard: true, month: newMonth });

        /* Lấy dữ liệu nghỉ phép, tăng ca của nhân viên */
        this.props.getTimesheets({ organizationalUnits: organizationalUnits, startDate: newMonth, endDate: newMonth });
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

    /**
     * Function bắt sự kiện thay đổi đơn vị
     * @param {*} value : Array id đơn vị
     */
    handleSelectOrganizationalUnit = (value) => {
        this.setState({
            arrayUnitShow: value,
        });

    }

    /**
     * Function bắt sự kiện thay đổi tháng
     * @param {*} value : Giá trị tháng
     */
    handleSelectMonth = (value) => {
        this.setState({
            month: value
        })
    };

    /** Bắt sự kiện phân tích dữ liệu */
    handleUpdateData = () => {
        const { department, childOrganizationalUnit } = this.props;
        let { month, arrayUnitShow } = this.state;
        let partMonth = month.split('-');
        let newMonth = [partMonth[1], partMonth[0]].join('-');

        this.setState({
            organizationalUnits: arrayUnitShow,
            monthShow: month
        });

        if (arrayUnitShow.length === department.list.length) {
            arrayUnitShow = undefined;
        };

        if (arrayUnitShow.length == 0) {
            arrayUnitShow = childOrganizationalUnit.map(x => x.id)
        }

        /* Lấy danh sách nhân viên  */
        this.props.getAllEmployee({ organizationalUnits: arrayUnitShow, status: 'active' });

        /* Lấy dữ liệu công việc của nhân viên trong đơn vị */
        this.props.getAllEmployeeOfUnitByIds(arrayUnitShow);
        this.props.getTaskInOrganizationUnitByMonth(arrayUnitShow, newMonth, newMonth);

        // this.props.searchAnnualLeaves({ organizationalUnits: arrayUnitShow, month: newMonth });
        /* Lấy dánh sách khen thưởng, kỷ luật */
        this.props.getListPraise({ organizationalUnits: arrayUnitShow, month: newMonth });
        this.props.getListDiscipline({ organizationalUnits: arrayUnitShow, month: newMonth });

        /* Lấy dữ liệu lương nhân viên*/
        this.props.searchSalary({ callApiDashboard: true, organizationalUnits: arrayUnitShow, month: newMonth });
        this.props.searchSalary({ callApiDashboard: true, month: newMonth });

        /* Lấy dữ liệu nghỉ phép, tăng ca của nhân viên */
        this.props.getTimesheets({ organizationalUnits: arrayUnitShow, startDate: newMonth, endDate: newMonth });

    }

    /** Bắt sự kiện chuyển tab  */
    handleNavTabs = (value) => {
        if (!value) {
            forceCheckOrVisible(true, false);
        }
        window.dispatchEvent(new Event('resize')); // Fix lỗi chart bị resize khi đổi tab
    }


    render() {
        const { translate, department, employeesManager, user, tasks, discipline } = this.props;

        const { childOrganizationalUnit } = this.props;

        const { monthShow, month, organizationalUnits, arrayUnitShow } = this.state;

        let listAllEmployees = (!organizationalUnits || organizationalUnits.length === 0 || organizationalUnits.length === department.list.length) ?
            employeesManager.listAllEmployees : employeesManager.listEmployeesOfOrganizationalUnits;

        /* Lấy dữ liệu công việc của nhân viên trong đơn vị */
        let taskListByStatus = tasks.organizationUnitTasks ? tasks.organizationUnitTasks.tasks : null;
        let listEmployee = user.employees;
        let employeeTasks = [];
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

        /* Lấy tổng số công việc của đơn vị */
        let totalTask = 0;
        if (employeeTasks.length !== 0) {
            employeeTasks = employeeTasks.sort((a, b) => b.totalTask - a.totalTask);
            employeeTasks.forEach(x => {
                totalTask += x.totalTask;
            })
        };

        return (
            <React.Fragment>
                <div className="qlcv">
                    <div className="form-inline" style={{ marginBottom: 10 }}>
                        <div className="form-group">
                            <label style={{ width: "auto" }}>{translate('kpi.organizational_unit.dashboard.organizational_unit')}</label>
                            <SelectMulti id="multiSelectOrganizationalUnitInDashboardUnit"
                                items={childOrganizationalUnit.map(item => { return { value: item.id, text: item.name } })}
                                options={{ nonSelectedText: translate('page.non_unit'), allSelectedText: translate('page.all_unit') }}
                                onChange={this.handleSelectOrganizationalUnit}
                                value={arrayUnitShow}
                            >
                            </SelectMulti>
                        </div>

                        <div className="form-group">
                            <label style={{ width: "auto" }}>{translate('kpi.organizational_unit.dashboard.month')}</label>
                            <DatePicker
                                id="monthInDashboardUnit"
                                dateFormat="month-year"
                                value={month}
                                onChange={this.handleSelectMonth}
                                deleteValue={false}
                            />
                        </div>
                        <button type="button" className="btn btn-success" onClick={this.handleUpdateData}>{translate('kpi.evaluation.dashboard.analyze')}</button>
                    </div>
                    <div className="row">
                        <div className="col-md-3 col-sm-6 col-xs-6">
                            <div className="info-box with-border">
                                <span className="info-box-icon bg-aqua"><i className="fa fa-users"></i></span>
                                <div className="info-box-content">
                                    <span className="info-box-text">Số nhân viên</span>
                                    <span className="info-box-number">
                                        {listAllEmployees.length}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6">
                            <div className="info-box with-border">
                                <span className="info-box-icon bg-yellow"><i className="fa fa-tasks"></i></span>
                                <div className="info-box-content">
                                    <span className="info-box-text">Số công việc</span>
                                    <span className="info-box-number">
                                        {totalTask}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6">
                            <div className="info-box with-border">
                                <span className="info-box-icon bg-green"><i className="fa fa-gift"></i></span>
                                <div className="info-box-content">
                                    <span className="info-box-text">Số khen thưởng</span>
                                    <span className="info-box-number">
                                        {discipline.totalListCommendation ? discipline.totalListCommendation.length : 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6">
                            <div className="info-box with-border">
                                <span className="info-box-icon bg-red"><i className="fa fa-balance-scale"></i></span>
                                <div className="info-box-content">
                                    <span className="info-box-text">Số kỷ luật</span>
                                    <span className="info-box-number">
                                        {discipline.totalListDiscipline ? discipline.totalListDiscipline.length : 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="nav-tabs-custom">
                        <ul className="nav nav-tabs">
                            <li className="active"><a href="#employee-capacity" data-toggle="tab" onClick={() => this.handleNavTabs()}>Năng lực nhân viên</a></li>
                            <li><a href="#human-resourse" data-toggle="tab" onClick={() => this.handleNavTabs(true)}>Tổng quan nhân sự</a></li>
                            <li><a href="#annualLeave" data-toggle="tab" onClick={() => this.handleNavTabs()}>Nghỉ phép-Tăng ca</a></li>
                            <li><a href="#salary" data-toggle="tab" onClick={() => this.handleNavTabs(true)}>Lương thưởng nhân viên</a></li>
                            <li><a href="#integrated-statistics" data-toggle="tab">Thống kê tổng hợp</a></li>
                        </ul>
                        <div className="tab-content ">
                            {/* Tab năng lực nhân viên*/}
                            <div className="tab-pane active" id="employee-capacity">
                                <LazyLoadComponent>
                                    <TabEmployeeCapacity organizationalUnits={organizationalUnits} month={monthShow} allOrganizationalUnits={childOrganizationalUnit.map(x => x.id)} />
                                </LazyLoadComponent>
                            </div>

                            {/* Tab tổng quan nhân sự*/}
                            <div className="tab-pane" id="human-resourse">
                                <TabHumanResource childOrganizationalUnit={childOrganizationalUnit} defaultUnit={true} organizationalUnits={organizationalUnits} monthShow={monthShow} />
                            </div>

                            {/* Tab nghỉ phép tăng ca*/}
                            <div className="tab-pane" id="annualLeave">
                                <TabAnualLeave childOrganizationalUnit={childOrganizationalUnit} defaultUnit={true} />
                            </div>

                            {/* Tab lương thưởng*/}
                            <div className="tab-pane" id="salary">
                                <TabSalary childOrganizationalUnit={childOrganizationalUnit} organizationalUnits={organizationalUnits} monthShow={monthShow} />
                            </div>

                            {/* Tab thống kê tổng hợp*/}
                            <div className="tab-pane" id="integrated-statistics">
                                <TabIntegratedStatistics listAllEmployees={listAllEmployees} month={monthShow} employeeTasks={employeeTasks} listEmployee={listEmployee} />
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { department, employeesManager, tasks, user, discipline } = state;
    return { department, employeesManager, tasks, user, discipline };
}

const actionCreators = {
    getAllEmployee: EmployeeManagerActions.getAllEmployee,
    // searchAnnualLeaves: AnnualLeaveActions.searchAnnualLeaves,
    getListPraise: DisciplineActions.getListPraise,
    getListDiscipline: DisciplineActions.getListDiscipline,
    searchSalary: SalaryActions.searchSalary,
    getTimesheets: TimesheetsActions.searchTimesheets,

    getAllEmployeeOfUnitByIds: UserActions.getAllEmployeeOfUnitByIds,
    getTaskInOrganizationUnitByMonth: taskManagementActions.getTaskInOrganizationUnitByMonth,
};

const mainDashboardUnit = connect(mapState, actionCreators)(withTranslate(MainDashboardUnit));
export { mainDashboardUnit as MainDashboardUnit };