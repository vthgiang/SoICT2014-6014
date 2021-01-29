import React, { Component } from 'react';
import { connect } from 'react-redux';

import { taskManagementActions } from '../../task-management/redux/actions';
import { DashboardEvaluationEmployeeKpiSetAction } from '../../../kpi/evaluation/dashboard/redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';

import { DistributionOfEmployee } from './distributionOfEmployee';
import { DomainOfTaskResultsChart } from '../task-personal-dashboard/domainOfTaskResultsChart';
import { TaskStatusChart } from '../task-personal-dashboard/taskStatusChart';
import { CalendarOrganizationUnit } from './calendarOrganizationUnit';
import { LoadTaskOrganizationChart } from './loadTaskOrganizationChart';
import { AverageResultsOfTaskInOrganizationalUnit } from './averageResultsOfTaskInOrganizationalUnit';

import { withTranslate } from 'react-redux-multilingual';
import { SelectMulti, DatePicker, ToolTip } from '../../../../common-components/index';
import Swal from 'sweetalert2';
import { InprocessOfUnitTask } from './processOfUnitTasks';

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
            idsUnit: [],
            checkUnit: 0,
            startMonth: [startYear, startMonth].join('-'),
            endMonth: [year, endMonth].join('-'),

            startMonthTitle: [startMonth, startYear].join('-'),
            endMonthTitle: [endMonth, year].join('-'),
        }

        this.state = {
            userID: "",
            idsUnit: this.INFO_SEARCH.idsUnit,
            dataStatus: this.DATA_STATUS.NOT_AVAILABLE,

            willUpdate: false,       // Khi true sẽ cập nhật dữ liệu vào props từ redux
            callAction: false,

            checkUnit: this.INFO_SEARCH.checkUnit,
            startMonth: this.INFO_SEARCH.startMonth,
            endMonth: this.INFO_SEARCH.endMonth
        };


    }

    componentDidMount = async () => {
        await this.props.getDepartment();
        await this.props.getChildrenOfOrganizationalUnitsAsTree(localStorage.getItem("currentRole"));
        await this.props.getAllUserSameDepartment(localStorage.getItem("currentRole"));
        await this.props.getTaskInOrganizationUnitByMonth(this.state.idsUnit, new Date(this.state.startMonth), new Date(this.state.endMonth));

        await this.setState(state => {
            return {
                ...state,
                dataStatus: this.DATA_STATUS.QUERYING,
                willUpdate: true       // Khi true sẽ cập nhật dữ liệu vào props từ redux
            };
        });
    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        const { dashboardEvaluationEmployeeKpiSet } = this.props;
        let { idsUnit, checkUnit, startMonth, endMonth } = this.state;
        let data, organizationUnit = "organizationUnit";

        if (idsUnit !== nextState.idsUnit) {
            return false;
        }
        
        if (!idsUnit.length && dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit
            || (nextState.checkUnit !== checkUnit
            || nextState.startMonth !== startMonth
            || nextState.endMonth !== endMonth)
        ) {
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

            let units = childrenOrganizationalUnit.map(item => item.id);

            this.setState((state) => {
                return {
                    ...state,
                    startMonth: nextState.startMonth,
                    endMonth: nextState.endMonth,
                    checkUnit: nextState.checkUnit,
                    idsUnit: !idsUnit.length ? units : nextState.idsUnit,
                    selectBoxUnit: childrenOrganizationalUnit
                }
            });
            await this.props.getAllEmployeeOfUnitByIds(units);
            data = {
                organizationUnitId: units,
                type: organizationUnit,
            }

            if (units.length) {
                await this.props.getTaskInOrganizationUnitByMonth(units, this.state.startMonth, this.state.endMonth);
            }

            await this.props.getTaskByUser(data);

        } else if (nextState.dataStatus === this.DATA_STATUS.QUERYING) {
            if (!nextProps.tasks.organizationUnitTasks) {
                return false;
            }

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.AVAILABLE,
                    callAction: true
                }
            });
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
        return false;
    }

    handleChangeOrganizationUnit = async (value) => {
        let checkUnit = this.state.checkUnit + 1;
        this.INFO_SEARCH.checkUnit = checkUnit;

        this.setState(state => {
            return {
                ...state,
                idsUnit: value
            }
        })
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
                }
            })

            await this.props.getTaskInOrganizationUnitByMonth(this.state.idsUnit, this.state.startMonth, this.state.endMonth);
        }
    }
    render() {
        const { tasks, translate, user, dashboardEvaluationEmployeeKpiSet } = this.props;
        let { idsUnit, startMonth, endMonth, selectBoxUnit } = this.state;
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
                        <div className="qlcv" style={{ textAlign: "right" }}>
                            <div className="form-inline">
                                <div className="form-group">
                                    <label style={{ width: "auto" }} className="form-control-static">{translate('kpi.evaluation.dashboard.organizational_unit')}</label>
                                    {selectBoxUnit && selectBoxUnit.length &&
                                        <SelectMulti id="multiSelectOrganizationalUnitInTaskUnit"
                                            items={selectBoxUnit.map(item => { return { value: item.id, text: item.name } })}
                                            options={{
                                                nonSelectedText: idsUnit.length !== 0 ? translate('task.task_management.select_department') : translate('general.not_org_unit'),
                                                allSelectedText: translate('kpi.evaluation.dashboard.all_unit'),
                                                includeSelectAllOption: true,
                                                maxHeight: 200
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
                                        <div className="box-title">{translate('task.task_management.tasks_calendar')} {translate('task.task_management.lower_from')} {startMonthTitle} {translate('task.task_management.lower_to')} {endMonthTitle}</div>
                                    </div>
                                    <CalendarOrganizationUnit
                                        // callAction={!this.state.willUpdate}
                                        // TaskOrganizationUnitDashboard={true}
                                        // units={idsUnit}
                                        // willUpdate={true}
                                        tasks={tasks} />
                                </div>

                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12">
                                <div className="box box-primary">
                                    <div className="box-header with-border">
                                        <div className="box-title">{translate('task.task_management.distribution_Of_Employee')} {translate('task.task_management.lower_from')} {startMonthTitle} {translate('task.task_management.lower_to')} {endMonthTitle}</div>
                                    </div>
                                    <div className="box-body qlcv">
                                        {this.state.callAction && tasks && tasks.organizationUnitTasks &&
                                            <DistributionOfEmployee
                                                tasks={tasks.organizationUnitTasks}
                                                listEmployee={user && user.employees}
                                                units={idsUnit}
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
                                        <div className="box-title">{translate('task.task_management.calc_progress')} {translate('task.task_management.lower_from')} {startMonthTitle} {translate('task.task_management.lower_to')} {endMonthTitle}</div>
                                    </div>
                                    <div className="box-body qlcv">
                                        {this.state.callAction && tasks && tasks.organizationUnitTasks &&
                                            <InprocessOfUnitTask
                                                tasks={tasks.organizationUnitTasks}
                                                listEmployee={user && user.employees}
                                                units={childrenOrganizationalUnit}
                                            />
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12 col-sm-12 col-md-6">
                                <div className="box box-primary">
                                    <div className="box-header with-border">
                                        <div className="box-title">{translate('task.task_management.dashboard_area_result')} {translate('task.task_management.lower_from')} {startMonthTitle} {translate('task.task_management.lower_to')} {endMonthTitle}</div>
                                    </div>
                                    <div className="box-body qlcv">
                                        {this.state.callAction &&
                                            <DomainOfTaskResultsChart
                                                callAction={!this.state.willUpdate}
                                                TaskOrganizationUnitDashboard={true}
                                                units={idsUnit}
                                                startMonth={startMonth}
                                                endMonth={endMonth}
                                            />
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-6">
                                <div className="box box-primary">
                                    <div className="box-header with-border">
                                        <div className="box-title">{translate('task.task_management.detail_status')} {translate('task.task_management.lower_from')} {startMonthTitle} {translate('task.task_management.lower_to')} {endMonthTitle}</div>
                                    </div>
                                    <div className="box-body qlcv" style={{ height: '384px' }}>
                                        {this.state.callAction &&
                                            <TaskStatusChart
                                                callAction={!this.state.willUpdate}
                                                TaskOrganizationUnitDashboard={true}
                                                startMonth={startMonth}
                                                endMonth={endMonth}
                                                units={idsUnit}
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
                                        <div className="box-title">Kết quả trung bình công việc các đơn vị {translate('task.task_management.lower_from')} {startMonthTitle} {translate('task.task_management.lower_to')} {endMonthTitle}</div>
                                    </div>
                                    <div className="box-body qlcv">
                                        <AverageResultsOfTaskInOrganizationalUnit
                                            units={idsUnit}
                                            startMonth={startMonth}
                                            endMonth={endMonth}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-xs-12 col-sm-12 col-md-6">
                                <div className="box box-primary">
                                    <div className="box-header with-border">
                                        <div className="box-title">{translate('task.task_management.dashboard_overdue')}</div>
                                    </div>

                                    <div className="box-body" style={{ height: "380px", overflow: "auto" }}>
                                        {
                                            (tasks && tasks.tasksbyuser) ?
                                                <ul className="todo-list">
                                                    {
                                                        (tasks.tasksbyuser.expire.length !== 0) ?
                                                            tasks.tasksbyuser.expire.map((item, key) =>
                                                                <li key={key}>
                                                                    <span className="handle">
                                                                        <i className="fa fa-ellipsis-v" />
                                                                        <i className="fa fa-ellipsis-v" />
                                                                    </span>
                                                                    <span className="text"><a href={`/task?taskId=${item.task._id}`} target="_blank">{item.task.name}</a></span>
                                                                    <small className="label label-danger"><i className="fa fa-clock-o" /> &nbsp;{item.totalDays} {translate('task.task_management.calc_days')}</small>
                                                                </li>
                                                            ) : "Không có công việc quá hạn"
                                                    }
                                                </ul> : "Đang tải dữ liệu"
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-6">
                                <div className="box box-primary">
                                    <div className="box-header with-border">
                                        <div className="box-title">{translate('task.task_management.dashboard_about_to_overdue')}</div>
                                    </div>
                                    <div className="box-body" style={{ height: "380px", overflow: "auto" }}>
                                        {
                                            (tasks && tasks.tasksbyuser) ?
                                                <ul className="todo-list">
                                                    {
                                                        (tasks.tasksbyuser.deadlineincoming.length !== 0) ?
                                                            tasks.tasksbyuser.deadlineincoming.map((item, key) =>
                                                                <li key={key}>
                                                                    <span className="handle">
                                                                        <i className="fa fa-ellipsis-v" />
                                                                        <i className="fa fa-ellipsis-v" />
                                                                    </span>
                                                                    <span className="text"><a href={`/task?taskId=${item.task._id}`} target="_blank" >{item.task.name}</a></span>
                                                                    <small className="label label-warning"><i className="fa fa-clock-o" /> &nbsp;{item.totalDays} {translate('task.task_management.calc_days')}</small>
                                                                </li>
                                                            ) : "Không có công việc nào sắp hết hạn"
                                                    }
                                                </ul> : "Đang tải dữ liệu"
                                        }
                                    </div>

                                </div>
                            </div>

                        </div>
                        {/*Dashboard tải công việc */}
                        <div className="row">
                            <div className="col-xs-12">
                                <div className="box box-primary">
                                    <div className="box-header with-border">
                                        <div className="box-title">{translate('task.task_management.load_task_chart_unit')} {translate('task.task_management.lower_from')} {startMonthTitle} {translate('task.task_management.lower_to')} {endMonthTitle}</div>
                                        <ToolTip
                                            type={"icon_tooltip"} materialIcon={"help"}
                                            dataTooltip={['Tải công việc tính theo công thức tổng các tỉ số: số ngày thực hiện công việc trong tháng/(số người thực hiện + số người phê duyệt + số người hỗ trợ)']}
                                        />
                                    </div>
                                    <div className="box-body qlcv">
                                        {this.state.callAction && tasks && tasks.organizationUnitTasks &&
                                            <LoadTaskOrganizationChart
                                                tasks={tasks.organizationUnitTasks}
                                                listEmployee={user && user.employees}
                                                units={childrenOrganizationalUnit}
                                                startMonth={startMonth}
                                                endMonth={endMonth}
                                                idsUnit={this.state.idsUnit}
                                            />
                                        }
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

};

const connectedTaskDashboardUnit = connect(mapState, actionCreators)(withTranslate(TaskOrganizationUnitDashboard));
export { connectedTaskDashboardUnit as TaskOrganizationUnitDashboard };