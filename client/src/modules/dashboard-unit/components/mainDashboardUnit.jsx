import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { TabEmployeeCapacity, TabIntegratedStatistics, TabTask } from './combinedContent';
import { TabHumanResource, TabSalary, TabAnualLeave } from '../../human-resource/employee-dashboard/components/combinedContent';

import { DatePicker, SelectMulti, LazyLoadComponent, forceCheckOrVisible, CustomLegendC3js } from '../../../common-components';
import { showListInSwal } from '../../../helpers/showListInSwal';

import { EmployeeManagerActions } from '../../human-resource/profile/employee-management/redux/actions';
import { TimesheetsActions } from '../../human-resource/timesheets/redux/actions';
import { DisciplineActions } from '../../human-resource/commendation-discipline/redux/actions';
import { SalaryActions } from '../../human-resource/salary/redux/actions';
import { taskManagementActions } from '../../task/task-management/redux/actions';
import { UserActions } from '../../super-admin/user/redux/actions';

import "./dashboardUnit.css";

class MainDashboardUnit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            month: this.formatDate(Date.now(), true),
            monthSearch: this.formatDate(Date.now(), false, true),
            monthShow: this.formatDate(Date.now(), true),
            organizationalUnits: [this.props.childOrganizationalUnit[0].id],
            arrayUnitShow: [this.props.childOrganizationalUnit[0].id],

            // Biểu đồ khẩn cấp / cần làm
            currentDate: this.formatDate(Date.now(), false),
            listUnit: [],
            urgent: [],
            taskNeedToDo: [],
            arrayUnitForUrgentChart: [this.props.childOrganizationalUnit[0].id],
        }
    };

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
     */
    formatDate(date, monthYear = false, yearMonth = false) {
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
            } else if (yearMonth) {
                return [year, month].join('-');
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
            monthShow: month,
            monthSearch: newMonth
        });

        let arrayUnit = arrayUnitShow;
        if (arrayUnitShow.length === department.list.length) {
            arrayUnitShow = department.list.map(x => x._id);
            arrayUnit = undefined;
        } else if (arrayUnitShow.length === 0) {
            arrayUnitShow = childOrganizationalUnit.map(x => x.id);
            arrayUnit = childOrganizationalUnit.map(x => x.id);
        }



        /* Lấy danh sách nhân viên  */
        this.props.getAllEmployee({ organizationalUnits: arrayUnit, status: ["active", 'maternity_leave', 'unpaid_leave', 'probationary', 'sick_leave'] });

        /* Lấy danh sách nhân viên theo tháng sinh*/
        this.props.getAllEmployee({ status: ["active", 'maternity_leave', 'unpaid_leave', 'probationary', 'sick_leave'], page: 0, limit: 10000, birthdate: newMonth, organizationalUnits: arrayUnitShow });

        /* Lấy dữ liệu công việc của nhân viên trong đơn vị */
        this.props.getAllEmployeeOfUnitByIds({ organizationalUnitIds: arrayUnitShow });
        this.props.getTaskInOrganizationUnitByMonth(arrayUnitShow, newMonth, newMonth, "in_month");

        /** Lấy dữ liệu công việc sắp hết hạn */
        this.props.getTaskByUser({ organizationUnitId: arrayUnitShow, type: "organizationUnit", })

        // this.props.searchAnnualLeaves({ organizationalUnits: arrayUnitShow, month: newMonth });
        /* Lấy dánh sách khen thưởng, kỷ luật */
        this.props.getListPraise({ organizationalUnits: arrayUnitShow, month: newMonth });
        this.props.getListDiscipline({ organizationalUnits: arrayUnitShow, month: newMonth });

        /* Lấy dữ liệu lương nhân viên*/
        this.props.searchSalary({ callApiDashboard: true, organizationalUnits: arrayUnitShow, month: newMonth });
        this.props.searchSalary({ callApiDashboard: true, month: newMonth });

        /* Lấy dữ liệu nghỉ phép, tăng ca của nhân viên */
        this.props.getTimesheets({
            organizationalUnits: arrayUnitShow, month: newMonth, page: 0,
            limit: 100000,
        });

    }

    /** Bắt sự kiện chuyển tab  */
    handleNavTabs = (value) => {
        if (value) {
            forceCheckOrVisible(true, false);
        }
        window.dispatchEvent(new Event('resize')); // Fix lỗi chart bị resize khi đổi tab
    }


    static getDerivedStateFromProps(props, state) {
        const { tasks } = props;

        if (tasks && tasks.organizationUnitTasksChart && props.childOrganizationalUnit) {
            return {
                ...state,
                listUnit: props.childOrganizationalUnit,
                urgent: tasks.organizationUnitTasksChart.urgent,
                taskNeedToDo: tasks.organizationUnitTasksChart.taskNeedToDo,
            }
        } else {
            return null;
        }
    }

    componentDidMount() {
        const { organizationalUnits, month, currentDate, arrayUnitForUrgentChart } = this.state;
        let partMonth = month.split('-');
        let newMonth = [partMonth[1], partMonth[0]].join('-');

        /* Lấy danh sách nhân viên  */
        this.props.getAllEmployee({ organizationalUnits: organizationalUnits, status: ["active", 'maternity_leave', 'unpaid_leave', 'probationary', 'sick_leave'] });

        /* Lấy danh sách nhân viên theo tháng sinh*/
        this.props.getAllEmployee({ status: ["active", 'maternity_leave', 'unpaid_leave', 'probationary', 'sick_leave'], page: 0, limit: 10000, birthdate: newMonth, organizationalUnits: organizationalUnits });

        /* Lấy dữ liệu công việc của nhân viên trong đơn vị */
        this.props.getAllEmployeeOfUnitByIds({ organizationalUnitIds: organizationalUnits });
        this.props.getTaskInOrganizationUnitByMonth(organizationalUnits, newMonth, newMonth, "in_month");

        /** Lấy dữ liệu công việc sắp hết hạn */
        this.props.getTaskByUser({ organizationUnitId: organizationalUnits, type: "organizationUnit", })

        /* Lấy dánh sách khen thưởng, kỷ luật */
        this.props.getListPraise({ organizationalUnits: organizationalUnits, month: newMonth });
        this.props.getListDiscipline({ organizationalUnits: organizationalUnits, month: newMonth });

        /* Lấy dữ liệu lương nhân viên*/
        this.props.searchSalary({ callApiDashboard: true, organizationalUnits: organizationalUnits, month: newMonth });
        this.props.searchSalary({ callApiDashboard: true, month: newMonth });

        /* Lấy dữ liệu nghỉ phép, tăng ca của nhân viên */
        this.props.getTimesheets({
            organizationalUnits: organizationalUnits, month: newMonth, page: 0,
            limit: 100000,
        });


        let partDate = currentDate.split('-');
        let newDate = [partDate[2], partDate[1], partDate[0]].join('-');
        this.props.getTaskInOrganizationUnitByDateNow(arrayUnitForUrgentChart, newDate)
    }

    getUnitName = (arrayUnit, arrUnitId) => {
        let data = [];
        arrayUnit && arrayUnit.forEach(x => {
            arrUnitId && arrUnitId.length > 0 && arrUnitId.forEach(y => {
                if (x.value === y)
                    data.push(x.text)
            })
        })
        return data;
    }
    
    showUnitTask = (selectBoxUnit, idsUnit) => {
        const { translate } = this.props
        if (idsUnit && idsUnit.length > 0) {
            const listUnit = this.getUnitName(selectBoxUnit, idsUnit);
            showListInSwal(listUnit, translate('general.list_unit'))
        }
    }

    render() {
        const { translate, department, employeesManager, user, tasks, discipline } = this.props;

        const { childOrganizationalUnit } = this.props;

        const { monthShow, month, organizationalUnits, arrayUnitShow, listUnit, monthSearch } = this.state;

        let listAllEmployees = (!organizationalUnits || organizationalUnits.length === department.list.length) ?
            employeesManager.listAllEmployees : employeesManager.listEmployeesOfOrganizationalUnits;

        // Item select box chọn đơn vị
        let listUnitSelect = listUnit.map(item => ({ value: item.id, text: item.name }));

        /* Lấy dữ liệu công việc của nhân viên trong đơn vị */
        let taskListByStatus = tasks.organizationUnitTasksInMonth ? tasks.organizationUnitTasksInMonth.tasks : null;
        let listEmployee = user.employees;
        let employeeTasks = [];
        for (let i in listEmployee) {
            let tasks = [];
            let accountableTask = [], consultedTask = [], responsibleTask = [], informedTask = [];
            taskListByStatus && taskListByStatus.forEach(task => {
                if (task?.accountableEmployees?.includes(listEmployee?.[i]?.userId?._id)) {
                    accountableTask = [...accountableTask, task._id]
                }
                if (task?.consultedEmployees?.includes(listEmployee?.[i]?.userId?._id)) {
                    consultedTask = [...consultedTask, task._id]
                }
                if (task?.responsibleEmployees?.includes(listEmployee?.[i]?.userId?._id)) {
                    responsibleTask = [...responsibleTask, task._id]
                }
                if (task?.informedEmployees?.includes(listEmployee?.[i]?.userId?._id)) {
                    informedTask = [...informedTask, task._id]
                }
            });
            tasks = tasks.concat(accountableTask).concat(consultedTask).concat(responsibleTask).concat(informedTask);
            let totalTask = tasks.filter(function (item, pos) {
                return tasks.indexOf(item) === pos;
            })
            employeeTasks = [...employeeTasks, { _id: listEmployee?.[i]?.userId?._id, name: listEmployee?.[i].userId?.name, totalTask: totalTask?.length }]
        };
        if (employeeTasks.length !== 0) {
            employeeTasks = employeeTasks.sort((a, b) => b.totalTask - a.totalTask);

        };

        return (
            <React.Fragment>
                <div className="qlcv">
                    <div className="form-inline" style={{ marginBottom: 10 }}>
                        <div className="form-group">
                            <label style={{ width: "auto" }}>{translate('kpi.organizational_unit.dashboard.organizational_unit')}</label>
                            <SelectMulti id="multiSelectOrganizationalUnitInDashboardUnit"
                                items={childOrganizationalUnit.map(item => { return { value: item.id, text: item.name } })}
                                options={{
                                    nonSelectedText: translate('page.non_unit'),
                                    allSelectedText: translate('page.all_unit'),
                                }}
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

                    <div className="nav-tabs-custom">
                        <ul className="nav nav-tabs">
                            <li className="active"><a href="#task" data-toggle="tab" onClick={() => this.handleNavTabs()}>Công việc</a></li>
                            <li><a href="#employee-capacity" data-toggle="tab" onClick={() => this.handleNavTabs(true)}>Năng lực nhân viên</a></li>
                            <li><a href="#human-resourse" data-toggle="tab" onClick={() => this.handleNavTabs(true)}>Tổng quan nhân sự</a></li>
                            <li><a href="#annualLeave" data-toggle="tab" onClick={() => this.handleNavTabs(true)}>Nghỉ phép-Tăng ca</a></li>
                            <li><a href="#salary" data-toggle="tab" onClick={() => this.handleNavTabs(true)}>Lương thưởng nhân viên</a></li>
                            <li><a href="#integrated-statistics" data-toggle="tab" onClick={() => this.handleNavTabs(true)}>Thống kê tổng hợp</a></li>
                        </ul>
                        <div className="tab-content ">
                            <div className="tab-pane active" id="task">
                                <TabTask 
                                    childOrganizationalUnit={childOrganizationalUnit.filter(item => organizationalUnits.includes(item?.id))} 
                                    organizationalUnits={organizationalUnits}
                                    getUnitName={this.getUnitName}
                                    showUnitTask={this.showUnitTask}
                                    month={monthSearch}
                                />
                            </div>
                            {/* Tab năng lực nhân viên*/}
                            <div className="tab-pane" id="employee-capacity">
                                <LazyLoadComponent>
                                    <TabEmployeeCapacity 
                                        organizationalUnits={organizationalUnits}
                                        month={monthShow} 
                                        allOrganizationalUnits={organizationalUnits} 
                                        childOrganizationalUnit={childOrganizationalUnit}
                                    />
                                </LazyLoadComponent>
                            </div>

                            {/* Tab tổng quan nhân sự*/}
                            <div className="tab-pane" id="human-resourse">
                                <LazyLoadComponent>
                                    <div className="row qlcv" style={{ marginTop: '10px' }}>
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
                                                    <span className="info-box-text">Số sinh nhật</span>
                                                    <span className="info-box-number">
                                                        {employeesManager.listEmployees ? employeesManager.listEmployees.length : 0}
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
                                    <TabHumanResource childOrganizationalUnit={childOrganizationalUnit.filter(item => organizationalUnits.includes(item?.id))} defaultUnit={true} organizationalUnits={organizationalUnits} monthShow={monthShow} />
                                </LazyLoadComponent>
                            </div>

                            {/* Tab nghỉ phép tăng ca*/}
                            <div className="tab-pane" id="annualLeave">
                                <LazyLoadComponent>
                                    <TabAnualLeave childOrganizationalUnit={childOrganizationalUnit.filter(item => organizationalUnits.includes(item?.id))} defaultUnit={true} organizationalUnits={organizationalUnits}/>
                                </LazyLoadComponent>
                            </div>

                            {/* Tab lương thưởng*/}
                            <div className="tab-pane" id="salary">
                                <LazyLoadComponent>
                                    <TabSalary childOrganizationalUnit={childOrganizationalUnit.filter(item => organizationalUnits.includes(item?.id))} organizationalUnits={organizationalUnits} monthShow={monthShow} />
                                </LazyLoadComponent>
                            </div>

                            {/* Tab thống kê tổng hợp*/}
                            <div className="tab-pane" id="integrated-statistics">
                                <LazyLoadComponent>
                                    <TabIntegratedStatistics listAllEmployees={listAllEmployees} month={monthShow} employeeTasks={employeeTasks} listEmployee={listEmployee} organizationalUnits={organizationalUnits}/>
                                </LazyLoadComponent>
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
    getListPraise: DisciplineActions.getListPraise,
    getListDiscipline: DisciplineActions.getListDiscipline,
    searchSalary: SalaryActions.searchSalary,
    getTimesheets: TimesheetsActions.searchTimesheets,

    getAllEmployeeOfUnitByIds: UserActions.getAllEmployeeOfUnitByIds,
    getTaskInOrganizationUnitByMonth: taskManagementActions.getTaskInOrganizationUnitByMonth,
    getTaskByUser: taskManagementActions.getTasksByUser,
    getTaskInOrganizationUnitByDateNow: taskManagementActions.getTaskByPriorityInOrganizationUnit,
};

const mainDashboardUnit = connect(mapState, actionCreators)(withTranslate(MainDashboardUnit));
export { mainDashboardUnit as MainDashboardUnit };