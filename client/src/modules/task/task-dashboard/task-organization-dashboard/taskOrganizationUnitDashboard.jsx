import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2';
import isEqual from 'lodash/isEqual';
import dayjs from 'dayjs';

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

import { SelectMulti, DatePicker, LazyLoadComponent, forceCheckOrVisible, ExportExcel } from '../../../../common-components/index';
import { getTableConfiguration } from '../../../../helpers/tableConfiguration'
import { showListInSwal } from '../../../../helpers/showListInSwal';

let INFO_SEARCH = {
    startMonth: dayjs().subtract(3, 'month').format("YYYY-MM"),
    endMonth: dayjs().format("YYYY-MM"),
    idsUnit: null,

}

const formatString = (value) => {
    if (value && typeof value === 'string') {
        let part = value.split('-');
        return [part[1], part[0]].join('-');
    }
    return value
}

function TaskOrganizationUnitDashboard(props) {
    const { taskDashboardChart } = props.tasks
    const { tasks, translate, user, dashboardEvaluationEmployeeKpiSet } = props;
    const [state, setState] = useState(() => {
        const defaultConfig = { limit: 10 }
        const allTimeSheetLogsByUnitId = "all-time-sheet-logs"
        const allTimeSheetLogsByUnitIdPerPage = getTableConfiguration(allTimeSheetLogsByUnitId, defaultConfig).limit;
        const distributionOfEmployeeChartId = "distribution-of-employee-chart";
        const distributionOfEmployeeChartPerPage = getTableConfiguration(distributionOfEmployeeChartId, defaultConfig).limit;

        return {
            userID: "",
            idsUnit: INFO_SEARCH.idsUnit,
            startMonth: INFO_SEARCH.startMonth,
            startMonthTitle: formatString(INFO_SEARCH.startMonth),
            endMonth: INFO_SEARCH.endMonth,
            endMonthTitle: formatString(INFO_SEARCH.endMonth),
            allTimeSheetLogsByUnitIdPerPage: allTimeSheetLogsByUnitIdPerPage,
            distributionOfEmployeeChartPerPage: distributionOfEmployeeChartPerPage
        };
    })

    const { idsUnit, startMonth, startMonthTitle, endMonth, endMonthTitle, selectBoxUnit, distributionOfEmployeeChart, allTimeSheetLogsByUnit, dataExport } = state;

    useEffect(() => {
        props.getChildrenOfOrganizationalUnitsAsTree(localStorage.getItem("currentRole"));
    }, [])

    useEffect(() => {
        // Trưởng hợp đổi 2 role cùng là trưởng đơn vị, cập nhật lại select box chọn đơn vị
        if (idsUnit && dashboardEvaluationEmployeeKpiSet && !dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit) {
            setState({
                ...state,
                idsUnit: null
            })
        }

        if (!idsUnit && dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit) {
            // let data, organizationUnit = "organizationUnit";
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

            let data = {
                organizationalUnitId: childrenOrganizationalUnit?.[0]?.id,
                startMonth: state.startMonth,
                endMonth: state.endMonth
            }
            // service mới, lưu vào state redux : props.tasks.taskDashboardChart:[ general-task-chart, ]
            props.getOrganizationTaskDashboardChart(data);

            setState({
                ...state,
                idsUnit: !idsUnit?.length ? [childrenOrganizationalUnit?.[0]?.id] : state.idsUnit,
                selectBoxUnit: childrenOrganizationalUnit
            });
        }
    }, [JSON.stringify(idsUnit), JSON.stringify(dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit)])


    useEffect(() => {
        if ((!distributionOfEmployeeChart?.employees || !allTimeSheetLogsByUnit?.employees) && user?.employees) {
            let employeesDistributionOfEmployeeChart = filterArraySkipAndLimit(user?.employees, distributionOfEmployeeChart?.page, distributionOfEmployeeChart?.perPage);
            let employeesAllTimeSheetLogsByUnit = filterArraySkipAndLimit(user?.employees, allTimeSheetLogsByUnit?.page, allTimeSheetLogsByUnit?.perPage);
            setState({
                ...state,
                distributionOfEmployeeChart: {
                    ...state.distributionOfEmployeeChart,
                    employees: employeesDistributionOfEmployeeChart
                },
                allTimeSheetLogsByUnit: {
                    ...state.allTimeSheetLogsByUnit,
                    employees: employeesAllTimeSheetLogsByUnit
                }
            })
        }
    }, [distributionOfEmployeeChart?.employees, allTimeSheetLogsByUnit?.employees, user?.employees])

    const handleChangeOrganizationUnit = (value) => {
        INFO_SEARCH = {
            ...INFO_SEARCH,
            idsUnit: value
        }
    }

    const handleSelectMonthStart = (value) => {
        INFO_SEARCH = {
            ...INFO_SEARCH,
            startMonth: value ? formatString(value) : value,
        }
    }

    const handleSelectMonthEnd = (value) => {
        INFO_SEARCH = {
            ...INFO_SEARCH,
            endMonth: value ? formatString(value) : value,
        }
    }

    const handleSearchData = async () => {
        const { allTimeSheetLogsByUnitIdPerPage, distributionOfEmployeeChartPerPage } = state;
        const { idsUnit, startMonth, endMonth } = INFO_SEARCH;

        let startMonthObj = new Date(startMonth);
        let endMonthObj = new Date(endMonth);

        if (startMonthObj.getTime() > endMonthObj.getTime()) {
            const { translate } = props;
            Swal.fire({
                title: translate('kpi.evaluation.employee_evaluation.wrong_time'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm'),
            })
        } else {
            setState({
                ...state,
                startMonth: startMonth,
                startMonthTitle: formatString(startMonth),
                endMonth: endMonth,
                endMonthTitle: formatString(endMonth),
                idsUnit: idsUnit
            })

            let data = {
                organizationalUnitIds: idsUnit,
                page: 1
            }

            props.getAllEmployeeOfUnitByIds({
                ...data,
                type: "forDistributionChart",
                perPage: distributionOfEmployeeChartPerPage
            });

            props.getAllEmployeeOfUnitByIds({
                ...data,
                type: "forAllTimeSheetLogs",
                perPage: allTimeSheetLogsByUnitIdPerPage
            });

            let dataQuery = {
                organizationalUnitId: idsUnit,
                startMonth: startMonth,
                endMonth: endMonth
            }
            props.getOrganizationTaskDashboardChart(dataQuery);
        }
    }

    const showLoadTaskDoc = () => {
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

    function filterArraySkipAndLimit(arrays, page, limit) {
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

    const getUnitName = (arrayUnit, arrUnitId) => {
        let data = [];
        arrayUnit && arrayUnit.forEach(x => {
            arrUnitId && arrUnitId.length > 0 && arrUnitId.forEach(y => {
                if (x.id === y)
                    data.push(x.name)
            })
        })
        return data;
    }

    const showUnitGeneraTask = (selectBoxUnit, idsUnit) => {
        const { translate } = props
        if (idsUnit && idsUnit.length > 0) {
            const listUnit = getUnitName(selectBoxUnit, idsUnit);
            showListInSwal(listUnit, translate('general.list_unit'))
        }
    }

    const handleDataExport = (data) => {
        let { dataExport } = state;
        if (!isEqual(dataExport, data)) {
            setState({
                ...state,
                dataExport: data,
            })
        }
    }
    function checkNullOrUndefined(chartName) {
        let found = false;
        for (let i = 0; i < taskDashboardChart?.length; i++) {
            if (taskDashboardChart[i].name == chartName && taskDashboardChart[i].data.length > 0) {
                found = true;
                break;
            }
        }
        return found
    }

    function getDataTask(chartName) {
        let data = [];
        if (taskDashboardChart?.length) {
            for (let i = 0; i < taskDashboardChart?.length; i++) {
                if (taskDashboardChart[i].name == chartName) {
                    data = taskDashboardChart[i].data.organizationUnitTasks
                }
            }
        }

        return data
    }

    function getDataEmployee(chartName) {
        let data = [];
        if (taskDashboardChart?.length) {
            for (let i = 0; i < taskDashboardChart?.length; i++) {
                if (taskDashboardChart[i].name == chartName) {
                    data = taskDashboardChart[i].data.usersInUnitsOfCompany
                }
            }
        }
        return data
    }

    let currentOrganizationalUnit, currentOrganizationalUnitLoading;

    if (dashboardEvaluationEmployeeKpiSet) {
        currentOrganizationalUnit = dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit;
        currentOrganizationalUnitLoading = dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnitLoading;
    }


    const handleNavTabs = (value) => {
        if (value) {
            forceCheckOrVisible(true, false);
        }
        window.dispatchEvent(new Event('resize')); // Fix lỗi chart bị resize khi đổi tab
    }
    console.log('state', state);
    return (
        <React.Fragment>
            {currentOrganizationalUnit
                ? <React.Fragment>
                    <div className="qlcv">
                        <div className="form-inline" style={{ marginBottom: 10 }}>
                            <div className="form-group">
                                <label style={{ width: "auto" }} className="form-control-static">{translate('kpi.evaluation.dashboard.organizational_unit')}</label>
                                {selectBoxUnit && selectBoxUnit.length &&
                                    <SelectMulti id="multiSelectOrganizationalUnitInTaskUnit"
                                        items={selectBoxUnit.map(item => { return { value: item.id, text: item.name } })}
                                        options={{
                                            nonSelectedText: translate('task.task_management.select_department'),
                                            allSelectedText: translate('kpi.evaluation.dashboard.all_unit'),
                                        }}
                                        onChange={handleChangeOrganizationUnit}
                                        value={idsUnit ? idsUnit : undefined}
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
                                    onChange={handleSelectMonthStart}
                                    disabled={false}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ width: "auto" }}>{translate('task.task_management.to')}</label>
                                <DatePicker
                                    id="monthEndInOrganizationUnitDashboard"
                                    dateFormat="month-year"
                                    value={endMonthTitle}
                                    onChange={handleSelectMonthEnd}
                                    disabled={false}
                                />
                            </div>
                            <div className="form-group">
                                <button className="btn btn-success" onClick={() => handleSearchData()}>{translate('task.task_management.search')}</button>
                            </div>

                        </div>

                        {/* Tổng quan công việc đơn vị */}
                        <div className="nav-tabs-custom">
                            <ul className="nav nav-tabs">
                                <li className="active"><a href="#general" data-toggle="tab" onClick={() => handleNavTabs()}>Tổng quan</a></li>
                                <li><a href="#calender" data-toggle="tab" onClick={() => handleNavTabs(true)}>{translate('task.task_management.tasks_calendar')}</a></li>
                            </ul>

                            <div className="tab-content ">
                                <div className="tab-pane active" id="general">
                                    {/* Tổng quan công việc */}
                                    <div className="row">
                                        <div className="col-xs-12">
                                            <div className="box box-primary">
                                                <div className="box-header with-border">
                                                    <div className="box-title">
                                                        {
                                                            idsUnit && idsUnit.length < 2 ?
                                                                <>
                                                                    <span>{`${translate('task.task_dashboard.general_unit_task')} ${getUnitName(selectBoxUnit, idsUnit).map(o => o).join(", ")} `}</span>
                                                                    <span>{`${startMonthTitle}`}<i className="fa fa-fw fa-caret-right"></i>{`${endMonthTitle}`}</span>
                                                                </>
                                                                :
                                                                <span onClick={() => showUnitGeneraTask(selectBoxUnit, idsUnit)} style={{ cursor: 'pointer' }}>
                                                                    <span>{`${translate('task.task_dashboard.general_unit_task')} `}</span>
                                                                    <a style={{ cursor: 'pointer', fontWeight: 'bold' }}>{idsUnit && idsUnit.length}</a>
                                                                    <span>{` ${translate('task.task_dashboard.unit_lowercase')} `}</span>
                                                                    <span>{`${startMonthTitle}`}<i className="fa fa-fw fa-caret-right"></i>{`${endMonthTitle}`} </span>
                                                                </span>
                                                        }

                                                    </div>
                                                    {
                                                        dataExport && <ExportExcel id="export-general-task" buttonName={translate('general.export')} exportData={dataExport} style={{ marginTop: 0 }} />
                                                    }
                                                </div>

                                                <div className="box-body qlcv">
                                                    {taskDashboardChart?.length &&
                                                        <GeneralTaskChart
                                                            tasks={getDataTask("general-task-chart")}
                                                            units={selectBoxUnit}
                                                            employees={getDataEmployee("general-task-chart")}
                                                            unitSelected={idsUnit}
                                                            startMonthTitle={startMonthTitle}
                                                            endMonthTitle={endMonthTitle}
                                                            unitNameSelected={idsUnit && getUnitName(selectBoxUnit, idsUnit)}
                                                            handleDataExport={handleDataExport}
                                                        />
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Đóng góp công việc */}
                                    <div className="row">
                                        <div className="col-xs-12">
                                            <div className="box box-primary">
                                                {taskDashboardChart?.length &&
                                                    <LazyLoadComponent once={true}>
                                                        <DistributionOfEmployee
                                                            unitIds={idsUnit}
                                                            tasks={getDataTask("employee-distribution-chart")}
                                                            startMonthTitle={startMonthTitle}
                                                            endMonthTitle={endMonthTitle}
                                                            selectBoxUnit={selectBoxUnit}
                                                            getUnitName={getUnitName}
                                                            showUnitGeneraTask={showUnitGeneraTask}
                                                        />
                                                    </LazyLoadComponent>
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tiến độ công việc */}
                                    <div className="row">
                                        <div className="col-xs-12">
                                            <div className="box box-primary">
                                                <div className="box-header with-border">
                                                    <div className="box-title">
                                                        {translate('task.task_management.calc_progress')}
                                                        {
                                                            idsUnit && idsUnit.length < 2 ?
                                                                <span>{` ${getUnitName(selectBoxUnit, idsUnit).map(o => o).join(", ")} `}</span>
                                                                :
                                                                <span onClick={() => showUnitGeneraTask(selectBoxUnit, idsUnit)} style={{ cursor: 'pointer' }}>
                                                                    <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {idsUnit && idsUnit.length}</a>
                                                                    <span>{` ${translate('task.task_dashboard.unit_lowercase')} `}</span>
                                                                </span>
                                                        }
                                                        {startMonthTitle}<i className="fa fa-fw fa-caret-right"></i>{endMonthTitle}
                                                    </div>
                                                </div>
                                                <div className="box-body qlcv">
                                                    {taskDashboardChart?.length &&
                                                        <LazyLoadComponent once={true}>
                                                            <InprocessOfUnitTask
                                                                tasks={getDataTask("in-process-unit-chart")}
                                                                unitSelected={idsUnit}
                                                                unitNameSelected={idsUnit && getUnitName(selectBoxUnit, idsUnit)}
                                                            />
                                                        </LazyLoadComponent>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Miền công việc + trạng thái công việc  */}
                                    <div className="row">
                                        <div className="col-xs-6">
                                            <div className="box box-primary">
                                                <div className="box-header with-border">
                                                    <div className="box-title">
                                                        {translate('task.task_management.dashboard_area_result')}
                                                        {
                                                            idsUnit && idsUnit.length < 2 ?
                                                                <>
                                                                    <span>{` ${getUnitName(selectBoxUnit, idsUnit).map(o => o).join(", ")} `}</span>
                                                                </>
                                                                :
                                                                <span onClick={() => showUnitGeneraTask(selectBoxUnit, idsUnit)} style={{ cursor: 'pointer' }}>
                                                                    <span>{` ${translate('task.task_dashboard.of')}`}</span>
                                                                    <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {idsUnit && idsUnit.length}</a>
                                                                    <span>{` ${translate('task.task_dashboard.unit_lowercase')} `}</span>
                                                                </span>
                                                        }
                                                        {startMonthTitle}<i className="fa fa-fw fa-caret-right"></i>{endMonthTitle}
                                                    </div>
                                                </div>
                                                <div className="box-body qlcv">
                                                    <LazyLoadComponent once={true}>
                                                        <DomainOfTaskResultsChart
                                                            organizationUnitTasks={getDataTask("task-results-domain-chart")}
                                                            TaskOrganizationUnitDashboard={true}
                                                            units={idsUnit}
                                                            startMonth={startMonth}
                                                            endMonth={endMonth}
                                                        />
                                                    </LazyLoadComponent>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xs-6">
                                            <div className="box box-primary">
                                                <div className="box-header with-border">
                                                    <div className="box-title">
                                                        {translate('task.task_management.detail_status_task')}
                                                        {
                                                            idsUnit && idsUnit.length < 2 ?
                                                                <>
                                                                    <span>{` ${getUnitName(selectBoxUnit, idsUnit).map(o => o).join(", ")} `}</span>
                                                                </>
                                                                :
                                                                <span onClick={() => showUnitGeneraTask(selectBoxUnit, idsUnit)} style={{ cursor: 'pointer' }}>
                                                                    <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {idsUnit && idsUnit.length}</a>
                                                                    <span>{` ${translate('task.task_dashboard.unit_lowercase')} `}</span>
                                                                </span>
                                                        }
                                                        {startMonthTitle}<i className="fa fa-fw fa-caret-right"></i>{endMonthTitle}
                                                    </div>
                                                </div>
                                                <div className="box-body qlcv" style={{ height: '384px' }}>
                                                    <LazyLoadComponent once={true}>
                                                        <TaskStatusChart
                                                            organizationUnitTasks={getDataTask("task-status-chart")}
                                                            TaskOrganizationUnitDashboard={true}
                                                            startMonth={startMonth}
                                                            endMonth={endMonth}
                                                            units={idsUnit}
                                                        />
                                                    </LazyLoadComponent>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* kết quả trung bình công việc */}
                                    <div className="row">
                                        <div className="col-xs-12">
                                            <div className="box box-primary">
                                                <div className="box-header with-border">
                                                    <div className="box-title">
                                                        {translate('task.task_management.detail_average_results')}
                                                        {
                                                            idsUnit && idsUnit.length < 2 ?
                                                                <>
                                                                    <span>{` ${getUnitName(selectBoxUnit, idsUnit).map(o => o).join(", ")} `}</span>
                                                                </>
                                                                :
                                                                <span onClick={() => showUnitGeneraTask(selectBoxUnit, idsUnit)} style={{ cursor: 'pointer' }}>
                                                                    <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {idsUnit && idsUnit.length}</a>
                                                                    <span>{` ${translate('task.task_dashboard.unit_lowercase')} `}</span>
                                                                </span>
                                                        }
                                                        {startMonthTitle}<i className="fa fa-fw fa-caret-right"></i>{endMonthTitle}

                                                    </div>
                                                </div>
                                                <div className="box-body qlcv">
                                                    <LazyLoadComponent once={true}>
                                                        <AverageResultsOfTaskInOrganizationalUnit
                                                            organizationUnitTasks={getDataTask("average-results-chart")}
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
                                            <LazyLoadComponent once={true}>
                                                <LoadTaskOrganizationChart
                                                    organizationUnitTasks={getDataTask("load-task-organization-chart")}
                                                    units={selectBoxUnit}
                                                    startMonth={startMonth}
                                                    endMonth={endMonth}
                                                    startMonthTitle={startMonthTitle}
                                                    endMonthTitle={endMonthTitle}
                                                    idsUnit={idsUnit}
                                                    getUnitName={getUnitName}
                                                    showUnitTask={showUnitGeneraTask}
                                                />
                                            </LazyLoadComponent>
                                        </div>
                                    </div>

                                    {/* Danh sách nhân viên đang bấm giờ */}
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="box box-solid">
                                                <LazyLoadComponent once={true}>
                                                    <CurrentTaskTimesheetLogInOrganizationalUnit
                                                        organizationalUnitIds={idsUnit}
                                                        listUnitSelect={selectBoxUnit}
                                                        getUnitName={getUnitName}
                                                        showUnitTask={showUnitGeneraTask}
                                                    />
                                                </LazyLoadComponent>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Thống kê bấm giờ */}
                                    <div className="row">
                                        <div className="col-xs-12 col-md-12">
                                            <div className="box box-primary">
                                                <LazyLoadComponent once={true}>
                                                    <AllTimeSheetLogsByUnit
                                                        unitIds={idsUnit}
                                                        userDepartment={allTimeSheetLogsByUnit?.employees}
                                                        organizationUnitTasks={tasks.organizationUnitTasks}
                                                        startMonthTitle={startMonthTitle}
                                                        endMonthTitle={endMonthTitle}
                                                        selectBoxUnit={selectBoxUnit}
                                                        getUnitName={getUnitName}
                                                        showUnitGeneraTask={showUnitGeneraTask}
                                                        startMonth={startMonth}
                                                        endMonth={endMonth}
                                                    />
                                                </LazyLoadComponent>

                                            </div>
                                        </div>
                                    </div>
                                </div>


                                {/* Tab lịch công việc */}
                                <div className="tab-pane" id="calender">
                                    {/* Biểu đồ gantt */}
                                    <div className="row">
                                        <div className="col-xs-12">
                                            <div className="box box-primary">
                                                <div className="box-header with-border">
                                                    <div className="box-title">
                                                        {translate('task.task_management.tasks_calendar')}
                                                        {
                                                            idsUnit && idsUnit.length < 2 ?
                                                                <>
                                                                    <span>{` ${getUnitName(selectBoxUnit, idsUnit).map(o => o).join(", ")} `}</span>
                                                                </>
                                                                :
                                                                <span onClick={() => showUnitGeneraTask(selectBoxUnit, idsUnit)} style={{ cursor: 'pointer' }}>
                                                                    <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {idsUnit && idsUnit.length}</a>
                                                                    <span>{` ${translate('task.task_dashboard.unit_lowercase')} `}</span>
                                                                </span>
                                                        }
                                                        {startMonthTitle}<i className="fa fa-fw fa-caret-right"></i>{endMonthTitle}
                                                    </div>
                                                </div>
                                                <LazyLoadComponent once={true}>
                                                    <GanttCalendar
                                                        organizationUnitTasks={getDataTask("gantt-chart")}
                                                        unit={true}
                                                        unitSelected={idsUnit}
                                                    />
                                                </LazyLoadComponent>
                                            </div>

                                        </div>
                                    </div>
                                </div>
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


function mapState(state) {
    const { tasks, user, dashboardEvaluationEmployeeKpiSet } = state;
    return { tasks, user, dashboardEvaluationEmployeeKpiSet };
}
const actionCreators = {
    getChildrenOfOrganizationalUnitsAsTree: DashboardEvaluationEmployeeKpiSetAction.getChildrenOfOrganizationalUnitsAsTree,
    getAllEmployeeOfUnitByIds: UserActions.getAllEmployeeOfUnitByIds,
    getOrganizationTaskDashboardChart: taskManagementActions.getOrganizationTaskDashboardChart
};

export default connect(mapState, actionCreators)(withTranslate(TaskOrganizationUnitDashboard));