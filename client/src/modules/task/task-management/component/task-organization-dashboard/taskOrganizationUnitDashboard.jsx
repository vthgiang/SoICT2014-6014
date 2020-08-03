import React, { Component } from 'react';
import { connect } from 'react-redux';

import { DomainOfTaskResultsChart } from '../task-dashboard/domainOfTaskResultsChart';
import { TaskStatusChart } from '../task-dashboard/taskStatusChart';
import { TasksSchedule } from '../task-dashboard/tasksSchedule';

import { taskManagementActions } from '../../redux/actions';

import { withTranslate } from 'react-redux-multilingual';

class TaskOrganizationUnitDashboard extends Component {
    constructor(props) {
        super(props);

        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };

        this.state = {
            userID: "",

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
        let organizationUnit = "organizationUnit"
        await this.props.getTaskByUser(organizationUnit);
        await this.props.getTaskInOrganizationUnitByMonth("[]", null, null);

        await this.setState(state => {
            return {
                ...state,
                dataStatus: this.DATA_STATUS.QUERYING,
                willUpdate: true       // Khi true sẽ cập nhật dữ liệu vào props từ redux
            };
        });
    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        if (nextState.dataStatus === this.DATA_STATUS.QUERYING) {
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
    render() {
        const { tasks, translate } = this.props;

        // let amountResponsibleTask = 0, amountTaskCreated = 0, amountAccountableTasks = 0, amountConsultedTasks = 0;
        let numTask = [];
        let totalTasks = 0;

        // Tinh so luong tat ca cac task 
        // if (tasks && tasks.responsibleTasks) {
        //     let task = tasks.responsibleTasks;
        //     let i;
        //     for (i in task) {
        //         if (task[i].status === "Inprocess")
        //             amountResponsibleTask++;

        //     }
        // }

        // tính số lượng task mà người này là creator
        // if (tasks && tasks.creatorTasks) {
        //     let task = tasks.creatorTasks;
        //     let i;
        //     for (i in task) {
        //         if (task[i].status === "Inprocess")
        //             amountTaskCreated++;

        //     }
        // }

        // tính số lượng task mà người này cần phê duyệt
        // if (tasks && tasks.accountableTasks) {
        //     let task = tasks.accountableTasks;
        //     let i;
        //     for (i in task) {
        //         if (task[i].status === "Inprocess")
        //             amountAccountableTasks++;
        //     }
        // }

        // tính số lượng task mà người này là người hỗ trợ
        // if (tasks && tasks.consultedTasks) {
        //     let task = tasks.consultedTasks;
        //     let i;
        //     for (i in task) {
        //         if (task[i].status === "Inprocess")
        //             amountConsultedTasks++;
        //     }
        // }

        // Tinh tong so luong cong viec co trang thai Inprogess
        // if (tasks) {
        //     let tempObj = {};
        //     if (tasks.responsibleTasks)
        //         numTask = numTask.concat(tasks.responsibleTasks);
        //     if (tasks.creatorTasks)
        //         numTask = numTask.concat(tasks.creatorTasks);
        //     if (tasks.accountableTasks)
        //         numTask = numTask.concat(tasks.accountableTasks);
        //     if (tasks.consultedTasks)
        //         numTask = numTask.concat(tasks.consultedTasks);
        //     let i;
        //     for (i in numTask) {
        //         if (numTask[i].status === "Inprocess")
        //             tempObj[numTask[i]._id] = numTask[i].name;
        //     }

        //     totalTasks = Object.keys(tempObj).length;

        // }
        return (

            <React.Fragment>
                {/* <div className="row">
                    <div className="col-md-3 col-sm-6 col-xs-12">
                        <div className="info-box">
                            <span className="info-box-icon bg-aqua"><i className="fa fa-plus" /></span>
                            <div className="info-box-content">
                                <span className="info-box-text">{translate('task.task_management.dashboard_created')}</span>
                                <span className="info-box-number">{amountTaskCreated}/{totalTasks}</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-xs-12">
                        <div className="info-box">
                            <span className="info-box-icon bg-green"><i className="fa fa-spinner" /></span>
                            <div className="info-box-content">
                                <span className="info-box-text">{translate('task.task_management.dashboard_need_perform')}</span>
                                <span className="info-box-number">{amountResponsibleTask}/{totalTasks}</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-xs-12">
                        <div className="info-box">
                            <span className="info-box-icon bg-red"><i className="fa fa-check-square-o" /></span>
                            <div className="info-box-content">
                                <span className="info-box-text">{translate('task.task_management.dashboard_need_approve')}</span>
                                <span className="info-box-number">{amountAccountableTasks}/{totalTasks}</span>
                            </div>
                        </div>
                    </div>
                    <div className="clearfix visible-sm-block" />
                    <div className="col-md-3 col-sm-6 col-xs-12">
                        <div className="info-box">
                            <span className="info-box-icon bg-yellow"><i className="fa fa-comments-o" /></span>
                            <div className="info-box-content">
                                <span className="info-box-text">{translate('task.task_management.dashboard_need_consult')}</span>
                                <span className="info-box-number">{amountConsultedTasks}/{totalTasks}</span>
                            </div>
                        </div>
                    </div>
                </div> */}
                <div className="row">
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
                            <TasksSchedule />
                        </div>

                    </div>
                </div>
            </React.Fragment>
        )
    }
}

// export { TaskOrganizationUnitDashboard };
function mapState(state) {
    const { tasks } = state;
    return { tasks };
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

};

const connectedTaskDashboardUnit = connect(mapState, actionCreators)(withTranslate(TaskOrganizationUnitDashboard));
export { connectedTaskDashboardUnit as TaskOrganizationUnitDashboard };