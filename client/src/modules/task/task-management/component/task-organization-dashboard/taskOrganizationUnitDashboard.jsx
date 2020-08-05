import React, { Component } from 'react';
import { connect } from 'react-redux';

import { DomainOfTaskResultsChart } from '../task-dashboard/domainOfTaskResultsChart';
import { TaskStatusChart } from '../task-dashboard/taskStatusChart';
import { TasksSchedule } from '../task-dashboard/tasksSchedule';

import { taskManagementActions } from '../../redux/actions';
import { UserActions } from '../../../../super-admin/user/redux/actions';
import { DashboardEvaluationEmployeeKpiSetAction } from '../../../../kpi/evaluation/dashboard/redux/actions';

import { withTranslate } from 'react-redux-multilingual';
import { SelectBox, SelectMulti } from '../../../../../common-components/index';

class TaskOrganizationUnitDashboard extends Component {
    constructor(props) {
        super(props);

        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };

        this.state = {
            userID: "",
            idsUnit: [],
            dataStatus: this.DATA_STATUS.NOT_AVAILABLE,

            willUpdate: false,       // Khi true sẽ cập nhật dữ liệu vào props từ redux
            callAction: false
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
        // console.log(";;;;;;;;", this.state.idsUnit)

        if (!this.state.idsUnit.length && this.props.dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit) {
            console.log("====dòng 59=======", this.props.dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit.id)
            await this.setState((state) => {
                return {
                    ...state,
                    idsUnit: [this.props.dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit.id],
                }
            });

            await this.props.getTaskInOrganizationUnitByMonth(this.state.idsUnit, null, null);

            return false;
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
        // console.log('Valueeeeeeeeeeeeeeeeeeeeeeeeeee', value);
        await this.setState(state => {
            return {
                ...state,
                idsUnit: value
            }
        })
        let organizationUnit = "organizationUnit";
        let data = {
            organizationUnitId: this.state.idsUnit,
            type: organizationUnit,
        }
        await this.props.getTaskByUser(data);
    }

    render() {
        const { tasks, translate, user } = this.props;
        let { idsUnit } = this.state;
        // console.log(idsUnit)
        // let amountResponsibleTask = 0, amountTaskCreated = 0, amountAccountableTasks = 0, amountConsultedTasks = 0;
        let numTask, units, queue = [];
        let totalTasks = 0;
        let childrenOrganizationalUnit = [];
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
                                {/* <button type="button" className="btn btn-success" onClick={this.handleUpdateData}>{translate('kpi.evaluation.dashboard.analyze')}</button> */}
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <div className="box-title">{translate('task.task_management.dashboard_area_result')}</div>
                            </div>
                            <div className="box-body qlcv">
                                {this.state.callAction &&
                                    <DomainOfTaskResultsChart
                                        callAction={!this.state.willUpdate}
                                        TaskOrganizationUnitDashboard={true}
                                        // tasks={tasks.organizationUnitTasks}
                                        units={idsUnit}
                                    />
                                }
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <div className="box-title">{translate('task.task_management.detail_status')}</div>
                            </div>
                            <div className="box-body qlcv">
                                {this.state.callAction &&
                                    <TaskStatusChart
                                        callAction={!this.state.willUpdate}
                                        TaskOrganizationUnitDashboard={true}
                                        // tasksInUnit={tasks.organizationUnitTasks && tasks.organizationUnitTasks}
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
                                                            <small className="label label-warning"><i className="fa fa-clock-o" />{item.totalDays} {translate('task.task_management.calc_days')}</small>
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
                                                            <span className="text"><a href={`/task?taskId=${item.task._id}`} target="_blank" />{item.task.name}</span>
                                                            <small className="label label-info"><i className="fa fa-clock-o" />{item.totalDays} {translate('task.task_management.calc_days')}</small>
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
                                // tasksInUnit={tasks.organizationUnitTasks && tasks.organizationUnitTasks}
                                units={idsUnit}
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
    // getAllTaskByRole: taskManagementActions.getAllTaskByRole,
    // getResponsibleTaskByUser: taskManagementActions.getResponsibleTaskByUser,
    // getAccountableTaskByUser: taskManagementActions.getAccountableTaskByUser,
    // getConsultedTaskByUser: taskManagementActions.getConsultedTaskByUser,
    // getInformedTaskByUser: taskManagementActions.getInformedTaskByUser,
    // getCreatorTaskByUser: taskManagementActions.getCreatorTaskByUser,
    getTaskByUser: taskManagementActions.getTasksByUser,
    getTaskInOrganizationUnitByMonth: taskManagementActions.getTaskInOrganizationUnitByMonth,
    getDepartment: UserActions.getDepartmentOfUser,
    getAllUserSameDepartment: UserActions.getAllUserSameDepartment,
    getChildrenOfOrganizationalUnitsAsTree: DashboardEvaluationEmployeeKpiSetAction.getChildrenOfOrganizationalUnitsAsTree,


};

const connectedTaskDashboardUnit = connect(mapState, actionCreators)(withTranslate(TaskOrganizationUnitDashboard));
export { connectedTaskDashboardUnit as TaskOrganizationUnitDashboard };