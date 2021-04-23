import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2';
import isEqual from 'lodash/isEqual';

import { taskManagementActions } from '../../task-management/redux/actions';
import { DashboardEvaluationEmployeeKpiSetAction } from '../../../kpi/evaluation/dashboard/redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';

import { DistributionOfEmployee } from './distributionOfEmployee';
import { DomainOfTaskResultsChart } from '../task-personal-dashboard/domainOfTaskResultsChart';
import { TaskStatusChart } from '../task-personal-dashboard/taskStatusChart';
import { LoadTaskOrganizationChart } from './loadTaskOrganizationChart';
import { AverageResultsOfTaskInOrganizationalUnit } from './averageResultsOfTaskInOrganizationalUnit';
import { AllTimeSheetLogsByUnit } from './allTimeSheetLogByUnit'
import { InprocessOfUnitTask } from './processOfUnitTasks';
import { GanttCalendar } from '../task-personal-dashboard/ganttCalendar';
import GeneralTaskChart from './generalTaskChart';
import { CurrentTaskTimesheetLogInOrganizationalUnit } from './currentTaskTimesheetLogInOrganizationalUnit'

import { SelectMulti, DatePicker, LazyLoadComponent, ExportExcel } from '../../../../common-components/index';
import { getTableConfiguration } from '../../../../helpers/tableConfiguration'
import { showListInSwal } from '../../../../helpers/showListInSwal';

class TaskOrganizationUnitDashboard extends Component {
    constructor(props) {
        super(props);

        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };

        let d = new Date(),
            month = d.getMonth() + 1,
            year = d.getFullYear();
        let startMonth, endMonth, startYear;

        if (month > 3) {
            startMonth = month - 3;
            startYear = year;
        } else {
            startMonth = month - 3 + 12;
            startYear = year - 1;
        }
        if (startMonth < 10)
            startMonth = '0' + startMonth;
        if (month < 10) {
            endMonth = '0' + month;
        } else {
            endMonth = month;
        }
        this.INFO_SEARCH = {
            idsUnit: null,
            checkUnit: 0,
            startMonth: [startYear, startMonth].join('-'),
            endMonth: [year, endMonth].join('-'),

            startMonthTitle: [startMonth, startYear].join('-'),
            endMonthTitle: [endMonth, year].join('-'),
        }

        const defaultConfig = { limit: 10 }
        this.allTimeSheetLogsByUnitId = "all-time-sheet-logs"
        const allTimeSheetLogsByUnitIdPerPage = getTableConfiguration(this.allTimeSheetLogsByUnitId, defaultConfig).limit;
        this.distributionOfEmployeeChartId = "distribution-of-employee-chart";
        const distributionOfEmployeeChartPerPage = getTableConfiguration(this.distributionOfEmployeeChartId, defaultConfig).limit;

        this.state = {
            userID: "",
            idsUnit: this.INFO_SEARCH.idsUnit,
            dataStatus: this.DATA_STATUS.NOT_AVAILABLE,

            willUpdate: false,       // Khi true sẽ cập nhật dữ liệu vào props từ redux
            callAction: false,

            checkUnit: this.INFO_SEARCH.checkUnit,
            startMonth: this.INFO_SEARCH.startMonth,
            endMonth: this.INFO_SEARCH.endMonth,

            allTimeSheetLogsByUnitIdPerPage: allTimeSheetLogsByUnitIdPerPage,
            distributionOfEmployeeChartPerPage: distributionOfEmployeeChartPerPage
        };
    }

    componentDidMount = async () => {
        await this.props.getDepartment();
        await this.props.getChildrenOfOrganizationalUnitsAsTree(localStorage.getItem("currentRole"));
        await this.props.getAllUserSameDepartment(localStorage.getItem("currentRole"));
        await this.props.getAllUserInAllUnitsOfCompany();
        await this.setState(state => {
            return {
                ...state,
                dataStatus: this.DATA_STATUS.QUERYING,
                willUpdate: true       // Khi true sẽ cập nhật dữ liệu vào props từ redux
            };
        });
    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        const { dashboardEvaluationEmployeeKpiSet, user } = this.props;
        let { idsUnit, distributionOfEmployeeChart, allTimeSheetLogsByUnit } = this.state;
        let data, organizationUnit = "organizationUnit";


        // Trưởng hợp đổi 2 role cùng là trưởng đơn vị, cập nhật lại select box chọn đơn vị
        if (idsUnit && dashboardEvaluationEmployeeKpiSet && !dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit) {
            this.setState(state => {
                return {
                    ...state,
                    idsUnit: null
                }
            })

            return true;
        }

        if (!idsUnit && dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit) {
            let childrenOrganizationalUnit = [], queue = [], currentOrganizationalUnit;

            if (dashboardEvaluationEmployeeKpiSet) {
                currentOrganizationalUnit = dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit;
            }
            if (currentOrganizationalUnit) {
                childrenOrganizationalUnit.push(currentOrganizationalUnit);
                queue.push(currentOrganizationalUnit);
                while (queue.length > 0) {
                    let v = queue.shift();
                    if (v.children) {
                        for (let i = 0; i < v.children.length; i++) {
                            let u = v.children[i];
                            queue.push(u);
                            childrenOrganizationalUnit.push(u);
                        }
                    }
                }
            }

            this.setState((state) => {
                return {
                    ...state,
                    startMonth: nextState.startMonth,
                    endMonth: nextState.endMonth,
                    checkUnit: nextState.checkUnit,
                    idsUnit: !idsUnit?.length ? [childrenOrganizationalUnit?.[0]?.id] : nextState.idsUnit,
                    selectBoxUnit: childrenOrganizationalUnit
                }
            });
            data = {
                organizationUnitId: [childrenOrganizationalUnit?.[0]?.id],
                type: organizationUnit,
            }

            await this.props.getTaskInOrganizationUnitByMonth([childrenOrganizationalUnit?.[0]?.id], this.state.startMonth, this.state.endMonth);
            await this.props.getTaskByUser(data);

            return true;
        } else if (nextState.dataStatus === this.DATA_STATUS.QUERYING) {
            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.AVAILABLE,
                    callAction: true
                }
            });
            return true;
        } else if (nextState.dataStatus === this.DATA_STATUS.AVAILABLE && nextState.willUpdate) {
            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.FINISHED,
                    willUpdate: false       // Khi true sẽ cập nhật dữ liệu vào props từ redux
                }
            });

            return true;
        }

        if ((!distributionOfEmployeeChart?.employees || !allTimeSheetLogsByUnit?.employees) && nextProps.user?.employees) {
            let employeesDistributionOfEmployeeChart = this.filterArraySkipAndLimit(nextProps.user?.employees, distributionOfEmployeeChart?.page, distributionOfEmployeeChart?.perPage);
            let employeesAllTimeSheetLogsByUnit = this.filterArraySkipAndLimit(nextProps.user?.employees, allTimeSheetLogsByUnit?.page, allTimeSheetLogsByUnit?.perPage);
            this.setState(state => {
                return {
                    ...state,
                    distributionOfEmployeeChart: {
                        ...state.distributionOfEmployeeChart,
                        employees: employeesDistributionOfEmployeeChart
                    },
                    allTimeSheetLogsByUnit: {
                        ...state.allTimeSheetLogsByUnit,
                        employees: employeesAllTimeSheetLogsByUnit
                    }
                }
            })
            return true;
        }

        return true;
    }

    formatDate = (date) => {
        if (date) {
            let data = date.split("-");
            data = data[1] + "-" + data[0]
            return data;
        }
    }

    handleChangeOrganizationUnit = async (value) => {
        let checkUnit = this.state.checkUnit + 1;
        this.INFO_SEARCH.checkUnit = checkUnit;
        this.INFO_SEARCH.idsUnit = value;
    }

    handleSelectMonthStart = async (value) => {
        let month = value.slice(3, 7) + '-' + value.slice(0, 2);
        let startMonthTitle = value.slice(0, 2) + '-' + value.slice(3, 7);

        this.INFO_SEARCH.startMonth = month;
        this.INFO_SEARCH.startMonthTitle = startMonthTitle;
    }

    handleSelectMonthEnd = async (value) => {
        let month = value.slice(3, 7) + '-' + value.slice(0, 2);
        let endMonthTitle = value.slice(0, 2) + '-' + value.slice(3, 7);

        this.INFO_SEARCH.endMonth = month;
        this.INFO_SEARCH.endMonthTitle = endMonthTitle;
    }

    handleSearchData = async () => {
        const { allTimeSheetLogsByUnitIdPerPage, distributionOfEmployeeChartPerPage } = this.state;
        let startMonth = new Date(this.INFO_SEARCH.startMonth);
        let endMonth = new Date(this.INFO_SEARCH.endMonth);

        if (startMonth.getTime() > endMonth.getTime()) {
            const { translate } = this.props;
            Swal.fire({
                title: translate('kpi.evaluation.employee_evaluation.wrong_time'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm'),
            })
        } else {
            this.setState(state => {
                return {
                    ...state,
                    startMonth: this.INFO_SEARCH.startMonth,
                    endMonth: this.INFO_SEARCH.endMonth,
                    checkUnit: this.INFO_SEARCH.checkUnit,
                    idsUnit: this.INFO_SEARCH.idsUnit
                }
            })

            let data = {
                organizationalUnitIds: this.INFO_SEARCH.idsUnit,
                page: 1
            }

            await this.props.getAllEmployeeOfUnitByIds({
                ...data,
                type: "forDistributionChart",
                perPage: distributionOfEmployeeChartPerPage
            });
            await this.props.getAllEmployeeOfUnitByIds({
                ...data,
                type: "forAllTimeSheetLogs",
                perPage: allTimeSheetLogsByUnitIdPerPage
            });
            await this.props.getTaskInOrganizationUnitByMonth(this.INFO_SEARCH.idsUnit, this.state.startMonth, this.state.endMonth);
        }
    }

    showLoadTaskDoc = () => {
        Swal.fire({
            icon: "question",

            html: `<h3 style="color: red"><div>Tải công việc đơn vị</div> </h3>
            <div style="font-size: 1.3em; text-align: left; margin-top: 15px; line-height: 1.7">
            <p>Tải công việc đơn vị trong 1 tháng được tính như sau</p>
            <ul>
                <li>Lấy tất cả các công việc do đơn vị đó quản lý</li>
                <li>Tải của một công việc = Số ngày thực hiện công việc trong tháng đó/tổng số người thực hiện, phê duyệt, tư vấn trong công việc</li>
                <li>Tải công việc đơn vị trong tháng = Tổng tải của tất cả các công việc trong tháng đó</li>
            </ul>
            <p>Ví dụ, 1 công việc kéo dài từ 15/3 đến 20/5, có 1 người thực hiện, 1 người phê duyệt và 1 người tư vấn</p>
            <ul>
                <li>Tải công việc đó trong tháng 3 = 15/(1+1+1)</li>
                <li>Tải công việc đó trong tháng 4 = 31/(1+1+1)</li>
                <li>Tải công việc đó trong tháng 5 = 20/(1+1+1)</li>
            </ul>`,
            width: "50%",
        })
    }

    filterArraySkipAndLimit = (arrays, page, limit) => {
        let employees;
        if (arrays?.length > 0) {
            employees = arrays.filter((item, index) => {
                if (index >= (page - 1) * limit && index < page * limit) {
                    return true;
                }
                else return false;
            })
        }
        return employees;
    }

    getUnitName = (arrayUnit, arrUnitId) => {
        let data = [];
        arrayUnit && arrayUnit.forEach(x => {
            arrUnitId && arrUnitId.length > 0 && arrUnitId.forEach(y => {
                if (x.id === y)
                    data.push(x.name)
            })
        })
        return data;
    }

    showUnitGeneraTask = (selectBoxUnit, idsUnit) => {
        const { translate } = this.props
        if (idsUnit && idsUnit.length > 0) {
            const listUnit = this.getUnitName(selectBoxUnit, idsUnit);
            showListInSwal(listUnit, translate('general.list_unit'))
        }
    }

    handleDataExport = (data) => {
        let { dataExport } = this.state;
        if (!isEqual(dataExport, data)) {
            this.setState(state => {
                return {
                    ...state,
                    dataExport: data,
                }
            })
        }
    }


    render() {
        const { tasks, translate, user, dashboardEvaluationEmployeeKpiSet } = this.props;
        let { idsUnit, startMonth, endMonth, selectBoxUnit, distributionOfEmployeeChart, allTimeSheetLogsByUnit, dataExport } = this.state;
        let { startMonthTitle, endMonthTitle } = this.INFO_SEARCH;
        let childrenOrganizationalUnit = [];
        let currentOrganizationalUnit, currentOrganizationalUnitLoading;

        if (dashboardEvaluationEmployeeKpiSet) {
            currentOrganizationalUnit = dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit;
            currentOrganizationalUnitLoading = dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnitLoading;
        }


        return (
            <React.Fragment>
                {currentOrganizationalUnit
                    ? <React.Fragment>
                        <div className="qlcv" style={{ marginBottom: '5px' }}>
                            <div className="form-inline">
                                <div className="form-group">
                                    <label style={{ width: "auto" }} className="form-control-static">{translate('kpi.evaluation.dashboard.organizational_unit')}</label>
                                    {selectBoxUnit && selectBoxUnit.length &&
                                        <SelectMulti id="multiSelectOrganizationalUnitInTaskUnit"
                                            items={selectBoxUnit.map(item => { return { value: item.id, text: item.name } })}
                                            options={{
                                                nonSelectedText: translate('task.task_management.select_department'),
                                                allSelectedText: translate('kpi.evaluation.dashboard.all_unit'),
                                            }}
                                            onChange={this.handleChangeOrganizationUnit}
                                            value={idsUnit}
                                        >
                                        </SelectMulti>
                                    }
                                </div>
                                <div className="form-group">
                                    <label style={{ width: "auto" }}>{translate('task.task_management.from')}</label>
                                    <DatePicker
                                        id="monthStartInOrganizationUnitDashboard"
                                        dateFormat="month-year"
                                        value={startMonthTitle}
                                        onChange={this.handleSelectMonthStart}
                                        disabled={false}
                                    />
                                </div>
                                <div className="form-group">
                                    <label style={{ width: "auto" }}>{translate('task.task_management.to')}</label>
                                    <DatePicker
                                        id="monthEndInOrganizationUnitDashboard"
                                        dateFormat="month-year"
                                        value={endMonthTitle}
                                        onChange={this.handleSelectMonthEnd}
                                        disabled={false}
                                    />
                                </div>
                                <div className="form-group">
                                    <button className="btn btn-success" onClick={this.handleSearchData}>{translate('task.task_management.search')}</button>
                                </div>

                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12">
                                <div className="box box-primary">
                                    <div className="box-header with-border">
                                        <div className="box-title">
                                            {
                                                idsUnit && idsUnit.length < 2 ?
                                                    <>
                                                        <span>{`${translate('task.task_dashboard.general_unit_task')} ${startMonthTitle}`}<i className="fa fa-fw fa-caret-right"></i>{`${endMonthTitle} ${translate('task.task_dashboard.of')}`}</span>
                                                        <span>{` ${this.getUnitName(selectBoxUnit, idsUnit).map(o => o).join(", ")}`}</span>
                                                    </>
                                                    :
                                                    <span onClick={() => this.showUnitGeneraTask(selectBoxUnit, idsUnit)} style={{ cursor: 'pointer' }}>
                                                        <span>{`${translate('task.task_dashboard.general_unit_task')} ${startMonthTitle}`}<i className="fa fa-fw fa-caret-right"></i>{`${endMonthTitle} ${translate('task.task_dashboard.of')} `} </span>
                                                        <a style={{ cursor: 'pointer', fontWeight: 'bold' }}>{idsUnit && idsUnit.length}</a>
                                                        <span>{` ${translate('task.task_dashboard.unit_lowercase')}`}</span>
                                                    </span>
                                            }

                                        </div>
                                        {
                                            dataExport && <ExportExcel id="export-general-task" buttonName={translate('general.export')} exportData={dataExport} style={{ marginTop: 0 }} />
                                        }
                                    </div>

                                    <div className="box-body qlcv">
                                        {this.state.callAction && tasks && tasks.organizationUnitTasks?.tasks?.length > 0 &&
                                            <GeneralTaskChart
                                                tasks={tasks.organizationUnitTasks}
                                                units={selectBoxUnit}
                                                employees={user.usersInUnitsOfCompany}
                                                unitSelected={idsUnit}
                                                startMonthTitle={startMonthTitle}
                                                endMonthTitle={endMonthTitle}
                                                unitNameSelected={idsUnit && this.getUnitName(selectBoxUnit, idsUnit)}
                                                handleDataExport={this.handleDataExport}
                                            />
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12">
                                <div className="box box-primary">
                                    <div className="box-header with-border">
                                        <div className="box-title">
                                            {translate('task.task_management.tasks_calendar')} {startMonthTitle}<i className="fa fa-fw fa-caret-right"></i>{endMonthTitle}
                                            {
                                                idsUnit && idsUnit.length < 2 ?
                                                    <>
                                                        <span>{` ${translate('task.task_dashboard.of')}`}</span>
                                                        <span>{` ${this.getUnitName(selectBoxUnit, idsUnit).map(o => o).join(", ")}`}</span>
                                                    </>
                                                    :
                                                    <span onClick={() => this.showUnitGeneraTask(selectBoxUnit, idsUnit)} style={{ cursor: 'pointer' }}>
                                                        <span>{` ${translate('task.task_dashboard.of')}`}</span>
                                                        <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {idsUnit && idsUnit.length}</a>
                                                        <span>{` ${translate('task.task_dashboard.unit_lowercase')}`}</span>
                                                    </span>
                                            }
                                        </div>
                                    </div>
                                    <LazyLoadComponent once={true}>
                                        <GanttCalendar
                                            tasks={tasks}
                                            unit={true}
                                            unitSelected={idsUnit}
                                        />
                                    </LazyLoadComponent>
                                </div>

                            </div>
                        </div>

                        {/* Đóng góp công việc */}
                        <div className="row">
                            <div className="col-xs-12">
                                <div className="box box-primary">
                                    {tasks && tasks.organizationUnitTasks &&
                                        <LazyLoadComponent once={true}>
                                            <DistributionOfEmployee
                                                unitIds={idsUnit}
                                                tasks={tasks.organizationUnitTasks}
                                                listEmployee={distributionOfEmployeeChart?.employees}
                                                startMonthTitle={startMonthTitle}
                                                endMonthTitle={endMonthTitle}
                                                selectBoxUnit={selectBoxUnit}
                                                getUnitName={this.getUnitName}
                                                showUnitGeneraTask={this.showUnitGeneraTask}
                                            />
                                        </LazyLoadComponent>
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-xs-12">
                                <div className="box box-primary">
                                    <div className="box-header with-border">
                                        <div className="box-title">
                                            {translate('task.task_management.calc_progress')} {startMonthTitle}<i className="fa fa-fw fa-caret-right"></i>{endMonthTitle}
                                            {
                                                idsUnit && idsUnit.length < 2 ?
                                                    <>
                                                        <span>{` ${translate('task.task_dashboard.of')}`}</span>
                                                        <span>{` ${this.getUnitName(selectBoxUnit, idsUnit).map(o => o).join(", ")}`}</span>
                                                    </>
                                                    :
                                                    <span onClick={() => this.showUnitGeneraTask(selectBoxUnit, idsUnit)} style={{ cursor: 'pointer' }}>
                                                        <span>{` ${translate('task.task_dashboard.of')}`}</span>
                                                        <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {idsUnit && idsUnit.length}</a>
                                                        <span>{` ${translate('task.task_dashboard.unit_lowercase')}`}</span>
                                                    </span>
                                            }
                                        </div>
                                    </div>
                                    <div className="box-body qlcv">
                                        {this.state.callAction && tasks && tasks.organizationUnitTasks &&
                                            <LazyLoadComponent once={true}>
                                                <InprocessOfUnitTask
                                                    tasks={tasks.organizationUnitTasks}
                                                    listEmployee={user && user.employees}
                                                    unitSelected={idsUnit}
                                                    unitNameSelected={idsUnit && this.getUnitName(selectBoxUnit, idsUnit)}
                                                />
                                            </LazyLoadComponent>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-6">
                                <div className="box box-primary">
                                    <div className="box-header with-border">
                                        <div className="box-title">
                                            {translate('task.task_management.dashboard_area_result')} {startMonthTitle}<i className="fa fa-fw fa-caret-right"></i>{endMonthTitle}
                                            {
                                                idsUnit && idsUnit.length < 2 ?
                                                    <>
                                                        <spn>{` ${translate('task.task_dashboard.of')}`}</spn>
                                                        <span>{` ${this.getUnitName(selectBoxUnit, idsUnit).map(o => o).join(", ")}`}</span>
                                                    </>
                                                    :
                                                    <span onClick={() => this.showUnitGeneraTask(selectBoxUnit, idsUnit)} style={{ cursor: 'pointer' }}>
                                                        <span>{` ${translate('task.task_dashboard.of')}`}</span>
                                                        <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {idsUnit && idsUnit.length}</a>
                                                        <span>{` ${translate('task.task_dashboard.unit_lowercase')}`}</span>
                                                    </span>
                                            }
                                        </div>
                                    </div>
                                    <div className="box-body qlcv">
                                        {this.state.callAction &&
                                            <LazyLoadComponent once={true}>
                                                <DomainOfTaskResultsChart
                                                    callAction={!this.state.willUpdate}
                                                    TaskOrganizationUnitDashboard={true}
                                                    units={idsUnit}
                                                    startMonth={startMonth}
                                                    endMonth={endMonth}
                                                />
                                            </LazyLoadComponent>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="col-xs-6">
                                <div className="box box-primary">
                                    <div className="box-header with-border">
                                        <div className="box-title">
                                            {translate('task.task_management.detail_status')} {startMonthTitle}<i className="fa fa-fw fa-caret-right"></i>{endMonthTitle}
                                            {
                                                idsUnit && idsUnit.length < 2 ?
                                                    <>
                                                        <spn>{` ${translate('task.task_dashboard.of')}`}</spn>
                                                        <span>{` ${this.getUnitName(selectBoxUnit, idsUnit).map(o => o).join(", ")}`}</span>
                                                    </>
                                                    :
                                                    <span onClick={() => this.showUnitGeneraTask(selectBoxUnit, idsUnit)} style={{ cursor: 'pointer' }}>
                                                        <span>{` ${translate('task.task_dashboard.of')}`}</span>
                                                        <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {idsUnit && idsUnit.length}</a>
                                                        <span>{` ${translate('task.task_dashboard.unit_lowercase')}`}</span>
                                                    </span>
                                            }
                                        </div>
                                    </div>
                                    <div className="box-body qlcv" style={{ maxHeight: '384px' }}>
                                        {this.state.callAction &&
                                            <LazyLoadComponent once={true}>
                                                <TaskStatusChart
                                                    callAction={!this.state.willUpdate}
                                                    TaskOrganizationUnitDashboard={true}
                                                    startMonth={startMonth}
                                                    endMonth={endMonth}
                                                    units={idsUnit}
                                                />
                                            </LazyLoadComponent>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-xs-12">
                                <div className="box box-primary">
                                    <div className="box-header with-border">
                                        <div className="box-title">
                                            Kết quả trung bình công việc {startMonthTitle}<i className="fa fa-fw fa-caret-right"></i>{endMonthTitle}
                                            {
                                                idsUnit && idsUnit.length < 2 ?
                                                    <>
                                                        <spn>{` ${translate('task.task_dashboard.of')}`}</spn>
                                                        <span>{` ${this.getUnitName(selectBoxUnit, idsUnit).map(o => o).join(", ")}`}</span>
                                                    </>
                                                    :
                                                    <span onClick={() => this.showUnitGeneraTask(selectBoxUnit, idsUnit)} style={{ cursor: 'pointer' }}>
                                                        <span>{` ${translate('task.task_dashboard.of')}`}</span>
                                                        <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {idsUnit && idsUnit.length}</a>
                                                        <span>{` ${translate('task.task_dashboard.unit_lowercase')}`}</span>
                                                    </span>
                                            }
                                        </div>
                                    </div>
                                    <div className="box-body qlcv">
                                        <LazyLoadComponent once={true}>
                                            <AverageResultsOfTaskInOrganizationalUnit
                                                units={idsUnit}
                                                startMonth={startMonth}
                                                endMonth={endMonth}
                                            />
                                        </LazyLoadComponent>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/*Dashboard tải công việc */}
                        <div className="row">
                            <div className="col-xs-12">
                                <div className="box box-primary">
                                    <div className="box-header with-border">
                                        <div className="box-title">
                                            {translate('task.task_management.load_task_chart_unit')} {startMonthTitle}<i className="fa fa-fw fa-caret-right"></i>{endMonthTitle}
                                            {
                                                idsUnit && idsUnit.length < 2 ?
                                                    <>
                                                        <spn>{` ${translate('task.task_dashboard.of')}`}</spn>
                                                        <span>{` ${this.getUnitName(selectBoxUnit, idsUnit).map(o => o).join(", ")}`}</span>
                                                    </>
                                                    :
                                                    <span onClick={() => this.showUnitGeneraTask(selectBoxUnit, idsUnit)} style={{ cursor: 'pointer' }}>
                                                        <span>{` ${translate('task.task_dashboard.of')}`}</span>
                                                        <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {idsUnit && idsUnit.length}</a>
                                                        <span>{` ${translate('task.task_dashboard.unit_lowercase')}`}</span>
                                                    </span>
                                            }
                                        </div>
                                        <a className="text-red" title={translate('task.task_management.explain')} onClick={() => this.showLoadTaskDoc()}>
                                            <i className="fa fa-question-circle" style={{ cursor: 'pointer', color: '#dd4b39', marginLeft: '5px' }} />
                                        </a>
                                    </div>
                                    <div className="box-body">
                                        {tasks && tasks.organizationUnitTasks &&
                                            <LazyLoadComponent once={true}>
                                                <LoadTaskOrganizationChart
                                                    tasks={tasks?.organizationUnitTasks}
                                                    listEmployee={user && user.employees}
                                                    units={selectBoxUnit}
                                                    startMonth={startMonth}
                                                    endMonth={endMonth}
                                                    idsUnit={idsUnit}
                                                    employeeLoading={user?.employeeLoading}
                                                />
                                            </LazyLoadComponent>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Danh sách nhân viên đang bấm giờ */}
                        <div className="row">
                            <div className="col-md-12">
                                <div className="box box-solid">
                                    <CurrentTaskTimesheetLogInOrganizationalUnit
                                        organizationalUnitIds={idsUnit}
                                        listUnitSelect={selectBoxUnit}
                                        getUnitName={this.getUnitName}
                                        showUnitTask={this.showUnitGeneraTask}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Thống kê bấm giờ */}
                        <div className="row">
                            <div className="col-xs-12 col-md-12">
                                <div className="box box-primary">
                                    <AllTimeSheetLogsByUnit
                                        unitIds={idsUnit}
                                        userDepartment={allTimeSheetLogsByUnit?.employees}
                                        organizationUnitTasks={tasks.organizationUnitTasks}
                                        startMonthTitle={startMonthTitle}
                                        endMonthTitle={endMonthTitle}
                                        selectBoxUnit={selectBoxUnit}
                                        getUnitName={this.getUnitName}
                                        showUnitGeneraTask={this.showUnitGeneraTask}
                                        startMonth={startMonth}
                                        endMonth={endMonth}
                                    />
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                    : currentOrganizationalUnitLoading
                    && <div className="box">
                        <div className="box-body">
                            <h4>{translate('general.not_org_unit')}</h4>
                        </div>
                    </div>
                }
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { tasks, user, dashboardEvaluationEmployeeKpiSet } = state;
    return { tasks, user, dashboardEvaluationEmployeeKpiSet };
}
const actionCreators = {
    getTaskByUser: taskManagementActions.getTasksByUser,
    getTaskInOrganizationUnitByMonth: taskManagementActions.getTaskInOrganizationUnitByMonth,
    getDepartment: UserActions.getDepartmentOfUser,
    getAllUserSameDepartment: UserActions.getAllUserSameDepartment,
    getChildrenOfOrganizationalUnitsAsTree: DashboardEvaluationEmployeeKpiSetAction.getChildrenOfOrganizationalUnitsAsTree,
    getAllEmployeeOfUnitByIds: UserActions.getAllEmployeeOfUnitByIds,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
};

const connectedTaskDashboardUnit = connect(mapState, actionCreators)(withTranslate(TaskOrganizationUnitDashboard));
export { connectedTaskDashboardUnit as TaskOrganizationUnitDashboard };