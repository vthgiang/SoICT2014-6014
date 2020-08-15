import React, { Component } from 'react';
import { connect } from 'react-redux';

import { DomainOfTaskResultsChart } from '../task-dashboard/domainOfTaskResultsChart';
import { TaskStatusChart } from '../task-dashboard/taskStatusChart';
import { TasksSchedule } from '../task-dashboard/tasksSchedule';

import { taskManagementActions } from '../../redux/actions';
import { UserActions } from '../../../../super-admin/user/redux/actions';
import { DashboardEvaluationEmployeeKpiSetAction } from '../../../../kpi/evaluation/dashboard/redux/actions';

import { withTranslate } from 'react-redux-multilingual';
import { SelectBox, SelectMulti, DatePicker } from '../../../../../common-components/index';
import { DistributionOfEmployee } from './distributionOfEmployee';

class TaskOrganizationUnitDashboard extends Component {
    constructor(props) {
        super(props);

        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };

        let d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;


        this.state = {
            userID: "",
            idsUnit: [],
            dataStatus: this.DATA_STATUS.NOT_AVAILABLE,

            willUpdate: false,       // Khi true sẽ cập nhật dữ liệu vào props từ redux
            callAction: false,

            checkUnit: 0,
            startMonth: [year, month - 3].join('-'),
            endMonth: [year, month].join('-')
        };


    }

    componentDidMount = async () => {
        // await this.props.getResponsibleTaskByUser("[]", 1, 1000, "[]", "[]", "[]", null, null, null, null, null);
        // await this.props.getAccountableTaskByUser("[]", 1, 1000, "[]", "[]", "[]", null, null, null);
        // await this.props.getConsultedTaskByUser("[]", 1, 1000, "[]", "[]", "[]", null, null, null);
        // await this.props.getInformedTaskByUser("[]", 1, 1000, "[]", "[]", "[]", null, null, null);
        // await this.props.getCreatorTaskByUser("[]", 1, 1000, "[]", "[]", "[]", null, null, null);


        await this.props.getDepartment();
        await this.props.getChildrenOfOrganizationalUnitsAsTree(localStorage.getItem("currentRole"));
        await this.props.getAllUserSameDepartment(localStorage.getItem("currentRole"));
        // await this.props.getTaskInOrganizationUnitByMonth("[]", null, null);


        await this.setState(state => {
            return {
                ...state,
                dataStatus: this.DATA_STATUS.QUERYING,
                willUpdate: true       // Khi true sẽ cập nhật dữ liệu vào props từ redux
            };
        });
    }

    shouldComponentUpdate = async (nextProps, nextState) => {

        let data, organizationUnit = "organizationUnit";

        if (!this.state.idsUnit.length && this.props.dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit || (nextState.checkUnit !== this.state.checkUnit || nextState.startMonth !== this.state.startMonth || nextState.endMonth !== this.state.endMonth)) {
            let idsUnit = !this.state.idsUnit.length ? [this.props.dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit.id] : nextState.idsUnit;

            await this.setState((state) => {
                return {
                    ...state,
                    startMonth: nextState.startMonth,
                    endMonth: nextState.endMonth,
                    checkUnit: nextState.checkUnit,
                    idsUnit: idsUnit,
                }
            });
            await this.props.getAllEmployeeOfUnitByIds(this.state.idsUnit);
            data = {
                organizationUnitId: this.state.idsUnit,
                type: organizationUnit,
            }

            if (this.state.idsUnit.length) {
                await this.props.getTaskInOrganizationUnitByMonth(this.state.idsUnit, this.state.startMonth, this.state.endMonth);
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
        let checkUnit = this.state.checkUnit + 1
        await this.setState(state => {
            return {
                ...state,
                checkUnit: checkUnit,
                idsUnit: value
            }
        })
    }

    handleSelectMonthStart = async (value) => {
        let month = value.slice(3, 7) + '-' + (new Number(value.slice(0, 2)));

        await this.setState(state => {
            return {
                ...state,
                startMonth: month
            }
        })
    }

    handleSelectMonthEnd = async (value) => {
        let month;

        if (value.slice(0, 2) < 12) {
            month = value.slice(3, 7) + '-' + (new Number(value.slice(0, 2)));
        } else {
            month = (new Number(value.slice(3, 7))) + '-' + '1';
        }
        await this.setState(state => {
            return {
                ...state,
                endMonth: month
            }
        })
    }

    render() {
        const { tasks, translate, user } = this.props;
        let { idsUnit, startMonth, endMonth } = this.state;
        let numTask, units, queue = [];
        let totalTasks = 0;
        let childrenOrganizationalUnit = [];

        let d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        let defaultEndMonth = [month, year].join('-');
        let defaultStartMonth = [month - 3, year].join('-');

        if (this.props.dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit) {
            let currentOrganizationalUnit = this.props.dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit;
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
        return (

            <React.Fragment>

                <div className="row">
                    <div className="qlcv" style={{ textAlign: "right", marginBottom: 15, marginRight: 10 }}>
                        <div className="form-inline">
                            <div className="form-group">
                                <label className="form-control-static">{translate('kpi.evaluation.dashboard.organizational_unit')}</label>
                                {childrenOrganizationalUnit &&
                                    <SelectMulti id="multiSelectOrganizationalUnitInTaskUnit"
                                        items={childrenOrganizationalUnit.map(item => { return { value: item.id, text: item.name } })}
                                        // options={{ nonSelectedText: translate('kpi.evaluation.dashboard.select_units'), allSelectedText: translate('kpi.evaluation.dashboard.all_unit') }}
                                        onChange={this.handleChangeOrganizationUnit}
                                        value={idsUnit}
                                    >
                                    </SelectMulti>
                                }
                            </div>
                            <div className="form-group">
                                <label>{translate('task.task_management.from')}</label>
                                <DatePicker
                                    id="monthStartInOrganizationUnitDashboard"
                                    dateFormat="month-year"
                                    value={defaultStartMonth}
                                    onChange={this.handleSelectMonthStart}
                                    disabled={false}
                                />
                            </div>
                            <div className="form-group">
                                <label>{translate('task.task_management.to')}</label>
                                <DatePicker
                                    id="monthEndInOrganizationUnitDashboard"
                                    dateFormat="month-year"
                                    value={defaultEndMonth}
                                    onChange={this.handleSelectMonthEnd}
                                    disabled={false}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-6">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <div className="box-title">{translate('task.task_management.dashboard_area_result')}</div>
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
                    <div className="col-xs-6">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <div className="box-title">{translate('task.task_management.detail_status')}</div>
                            </div>
                            <div className="box-body qlcv">
                                {this.state.callAction &&
                                    <TaskStatusChart
                                        callAction={!this.state.willUpdate}
                                        TaskOrganizationUnitDashboard={true}
                                        startMonth={startMonth}
                                        endMonth={endMonth}
                                        // tasksInUnit={tasks.organizationUnitTasks && tasks.organizationUnitTasks}
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
                                <div className="box-title">Biểu đồ đóng góp của nhân viên </div>
                            </div>
                            <div className="box-body qlcv">
                                {this.state.callAction && tasks &&tasks.organizationUnitTasks &&
                                    <DistributionOfEmployee
                                        tasks= {tasks.organizationUnitTasks}
                                        listEmployee = {user.employees}
                                        units={idsUnit}
                                    />
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-6">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <div className="box-title">{translate('task.task_management.dashboard_overdue')}</div>
                            </div>

                            <div className="box-body" style={{ height: "300px" }}>
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
                    <div className="col-xs-6">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <div className="box-title">{translate('task.task_management.dashboard_about_to_overdue')}</div>
                            </div>
                            <div className="box-body" style={{ height: "300px" }}>
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
                <div className="row">
                    <div className="col-xs-12">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <div className="box-title">{translate('task.task_management.tasks_calendar')}</div>
                            </div>
                            <TasksSchedule
                                callAction={!this.state.willUpdate}
                                TaskOrganizationUnitDashboard={true}
                                units={idsUnit}
                                willUpdate={true}
                            />
                        </div>

                    </div>
                </div>
            </React.Fragment>
        )
    }
}

// export { TaskOrganizationUnitDashboard };
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