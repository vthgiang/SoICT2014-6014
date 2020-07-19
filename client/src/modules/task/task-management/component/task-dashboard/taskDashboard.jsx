import React, { Component } from 'react';
import { connect } from 'react-redux';

import { TaskStatusChart } from './taskStatusChart';
import { DomainOfTaskResultsChart } from './domainOfTaskResultsChart';
import { TasksSchedule } from './tasksSchedule';
import { taskManagementActions } from '../../redux/actions';

import {withTranslate} from 'react-redux-multilingual';


class TaskDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userID: "",
        };
    }
    componentDidMount() {
        this.props.getResponsibleTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, null, null, null, null);
        this.props.getAccountableTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, null, null);
        this.props.getConsultedTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, null, null);
        this.props.getInformedTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, null, null);
        this.props.getCreatorTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, null, null);
        this.props.getTaskByUser();
    }
    generateDataPoints(noOfDps) {
        var xVal = 1, yVal = 100;
        var dps = [];
        for (var i = 0; i < noOfDps; i++) {
            yVal = yVal + Math.round(5 + Math.random() * (-5 - 5));
            dps.push({ x: xVal, y: yVal });
            xVal++;
        }
        return dps;
    }
    render() {
        const { tasks, translate } = this.props;
        const options3 = {
            theme: "light2", // "light1", "dark1", "dark2"
            animationEnabled: true,
            zoomEnabled: true,
            exportEnabled: true,
            title: {
                text: "Try Zooming and Panning",
                fontWeight: "normal",
                fontFamily: "tahoma",
                fontSize: 25,
            },
            axisY: {
                includeZero: false
            },
            data: [{
                type: "area",
                dataPoints: this.generateDataPoints(500)
            }]
        }

        var amountResponsibleTask = 0;
        if (tasks && tasks.responsibleTasks) {
            let task = tasks.responsibleTasks;
            let i;
            for (i in task) {
                if (task[i].status === "Inprocess")
                    amountResponsibleTask++;

            }
        }
        // Tinh so luong tat ca cac task 
        var amountResponsibleTask = 0;
        if (tasks && tasks.responsibleTasks) {
            let task = tasks.responsibleTasks;
            let i;
            for (i in task) {
                if (task[i].status === "Inprocess")
                    amountResponsibleTask++;

            }
        }
        // tính số lượng task mà người này là creator
        var amountTaskCreated = 0;
        if (tasks && tasks.creatorTasks) {
            let task = tasks.creatorTasks;
            let i;
            for (i in task) {
                if (task[i].status === "Inprocess")
                    amountTaskCreated++;

            }
        }
        // tính số lượng task mà người này cần phê duyệt
        var amountAccountableTasks = 0;
        if (tasks && tasks.accountableTasks) {
            let task = tasks.accountableTasks;
            let i;
            for (i in task) {
                if (task[i].status === "Inprocess")
                    amountAccountableTasks++;
            }
        }
        // tính số lượng task mà người này là người hỗ trợ
        var amountConsultedTasks = 0;
        if (tasks && tasks.consultedTasks) {
            let task = tasks.consultedTasks;
            let i;
            for (i in task) {
                if (task[i].status === "Inprocess")
                    amountConsultedTasks++;
            }
        }
        // Tinh tong so luong cong viec co trang thai Inprogess
        var numTask = [];
        var totalTasks = 0;
        if (tasks) {
            let tempObj = {};
            if (tasks.responsibleTasks)
                numTask = numTask.concat(tasks.responsibleTasks);
            if (tasks.creatorTasks)
                numTask = numTask.concat(tasks.creatorTasks);
            if (tasks.accountableTasks)
                numTask = numTask.concat(tasks.accountableTasks);
            if (tasks.consultedTasks)
                numTask = numTask.concat(tasks.consultedTasks);
            let i;
            for (i in numTask) {
                if (numTask[i].status === "Inprocess")
                    tempObj[numTask[i]._id] = numTask[i].name;
            }

            totalTasks = Object.keys(tempObj).length;

        }

        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-md-3 col-sm-6 col-xs-12">
                        <div className="info-box">
                            <span className="info-box-icon bg-aqua"><i className="fa fa-plus" /></span>
                            <div className="info-box-content">
                                <span className="info-box-text">Đã tạo</span>
                                <span className="info-box-number">{amountTaskCreated}/{totalTasks}</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-xs-12">
                        <div className="info-box">
                            <span className="info-box-icon bg-green"><i className="fa fa-spinner" /></span>
                            <div className="info-box-content">
                                <span className="info-box-text">Cần thực hiện</span>
                                <span className="info-box-number">{amountResponsibleTask}/{totalTasks}</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-xs-12">
                        <div className="info-box">
                            <span className="info-box-icon bg-red"><i className="fa fa-check-square-o" /></span>
                            <div className="info-box-content">
                                <span className="info-box-text">Cần phê duyệt</span>
                                <span className="info-box-number">{amountAccountableTasks}/{totalTasks}</span>
                            </div>
                        </div>
                    </div>
                    <div className="clearfix visible-sm-block" />
                    <div className="col-md-3 col-sm-6 col-xs-12">
                        <div className="info-box">
                            <span className="info-box-icon bg-yellow"><i className="fa fa-comments-o" /></span>
                            <div className="info-box-content">
                                <span className="info-box-text">Cần hỗ trợ</span>
                                <span className="info-box-number">{amountConsultedTasks}/{totalTasks}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-6">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <div className="box-title">Miền kết quả công việc</div>
                            </div>
                            <DomainOfTaskResultsChart />
                        </div>
                    </div>
                    <div className="col-xs-6">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <div className="box-title">Trạng thái công việc</div>
                            </div>
                            <TaskStatusChart />
                        </div>
                    </div>
                </div>

                <div className="row">

                    <div className="col-xs-6">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <div className="box-title">Công việc quá hạn</div>
                            </div>

                            <div className="box-body" style={{ height: "300px" }}>
                                {
                                    (tasks && tasks.tasksbyuser && tasks.tasksbyuser.expire.length !== 0) ?
                                        <ul className="todo-list">
                                            {
                                                tasks.tasksbyuser.expire.map(item =>
                                                    <li>
                                                        <span className="handle">
                                                            <i className="fa fa-ellipsis-v" />
                                                            <i className="fa fa-ellipsis-v" />
                                                        </span>
                                                        <span className="text"><a href={`/task?taskId=${item.task._id}`} target="_blank">{item.task.name}</a></span>
                                                        <small className="label label-warning"><i className="fa fa-clock-o" />{item.totalDays} days</small>
                                                    </li>
                                                )
                                            }
                                        </ul> : "Không có công việc quá hạn"
                                }
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-6">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <div className="box-title">Công việc sắp hết hạn</div>
                            </div>
                            <div className="box-body" style={{ height: "300px" }}>
                                {
                                    (tasks && tasks.tasksbyuser && tasks.tasksbyuser.deadlineincoming.length !== 0) ?
                                        <ul className="todo-list">
                                            {
                                                tasks.tasksbyuser.deadlineincoming.map(item =>
                                                    <li>
                                                        <span className="handle">
                                                            <i className="fa fa-ellipsis-v" />
                                                            <i className="fa fa-ellipsis-v" />
                                                        </span>
                                                        <span className="text"><a href={`/task?taskId=${item.task._id}`} target="_blank" />{item.task.name}</span>
                                                        <small className="label label-info"><i className="fa fa-clock-o" />{item.totalDays} days</small>
                                                    </li>
                                                )
                                            }
                                        </ul> : "Không có công việc nào sắp hết hạn"
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
        );
    }
}
function mapState(state) {
    const { tasks } = state;
    return { tasks };
}
const actionCreators = {
    getAllTaskByRole: taskManagementActions.getAllTaskByRole,
    getResponsibleTaskByUser: taskManagementActions.getResponsibleTaskByUser,
    getAccountableTaskByUser: taskManagementActions.getAccountableTaskByUser,
    getConsultedTaskByUser: taskManagementActions.getConsultedTaskByUser,
    getInformedTaskByUser: taskManagementActions.getInformedTaskByUser,
    getCreatorTaskByUser: taskManagementActions.getCreatorTaskByUser,
    getTaskByUser: taskManagementActions.getTasksByUser,

};
const connectedTaskDashboard = connect(mapState, actionCreators)(withTranslate(TaskDashboard));
export { connectedTaskDashboard as TaskDashboard };