import React, { Component } from 'react';
import { connect } from 'react-redux';

import { taskManagementActions } from '../../redux/actions';

import { TaskStatusChart } from './taskStatusChart';
import { DomainOfTaskResultsChart } from './domainOfTaskResultsChart';
import { TasksSchedule } from './tasksSchedule';

import { withTranslate } from 'react-redux-multilingual';

import { DatePicker } from '../../../../../common-components';
import Swal from 'sweetalert2';

class TaskDashboard extends Component {

    constructor(props) {
        super(props);

        let currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        let currentMonth = currentDate.getMonth();

        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };

        this.INFO_SEARCH = {
            startMonth: currentYear + '-' + 1,
            endMonth: currentYear + '-' + (currentMonth + 2)
        }

        this.state = {
            userID: "",

            dataStatus: this.DATA_STATUS.NOT_AVAILABLE,

            startMonth: this.INFO_SEARCH.startMonth,
            endMonth: this.INFO_SEARCH.endMonth,

            willUpdate: false,       // Khi true sẽ cập nhật dữ liệu vào props từ redux
            callAction: false
        };
    }

    componentDidMount = async () => {
        // unit, number, perPage, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore, aPeriodOfTime = false
        await this.props.getResponsibleTaskByUser("[]", 1, 100, "[]", "[]", "[]", null, null, null, null, null, false);
        await this.props.getAccountableTaskByUser("[]", 1, 1000, "[]", "[]", "[]", null, null, null, null, null, false);
        await this.props.getConsultedTaskByUser("[]", 1, 1000, "[]", "[]", "[]", null, null, null, null, null, false);
        await this.props.getInformedTaskByUser("[]", 1, 1000, "[]", "[]", "[]", null, null, null, null, null, false);
        await this.props.getCreatorTaskByUser("[]", 1, 1000, "[]", "[]", "[]", null, null, null, null, null, false);
        // await this.props.getResponsibleTaskByUser("[]", 1, 1000, "[]", "[]", "[]", null, null, null, null, null);
        // await this.props.getAccountableTaskByUser("[]", 1, 1000, "[]", "[]", "[]", null, null, null, null, null);
        // await this.props.getConsultedTaskByUser("[]", 1, 1000, "[]", "[]", "[]", null, null, null, null, null);
        // await this.props.getInformedTaskByUser("[]", 1, 1000, "[]", "[]", "[]", null, null, null, null, null);
        // await this.props.getCreatorTaskByUser("[]", 1, 1000, "[]", "[]", "[]", null, null, null, null, null);
        let data = {
            type: "user"
        }
        await this.props.getTaskByUser(data);

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
            if (!nextProps.tasks.responsibleTasks || !nextProps.tasks.accountableTasks || !nextProps.tasks.consultedTasks || !nextProps.tasks.informedTasks || !nextProps.tasks.creatorTasks || !nextProps.tasks.tasksbyuser) {
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

    generateDataPoints(noOfDps) {
        let xVal = 1, yVal = 100;
        let dps = [];
        for (let i = 0; i < noOfDps; i++) {
            yVal = yVal + Math.round(5 + Math.random() * (-5 - 5));
            dps.push({ x: xVal, y: yVal });
            xVal++;
        }
        return dps;
    }

    handleSelectMonthStart = (value) => {
        let month = value.slice(3, 7) + '-' + (new Number(value.slice(0, 2)));

        this.INFO_SEARCH.startMonth = month;
    }

    handleSelectMonthEnd = (value) => {
        let month;

        if (value.slice(0, 2) < 12) {
            month = value.slice(3, 7) + '-' + (new Number(value.slice(0, 2)) + 1);
        } else {
            month = (new Number(value.slice(3, 7)) + 1) + '-' + '1';
        }

        this.INFO_SEARCH.endMonth = month;
    }

    handleSearchData = async () => {
        let startMonth = new Date(this.INFO_SEARCH.startMonth);
        let endMonth = new Date(this.INFO_SEARCH.endMonth);

        if (startMonth.getTime() >= endMonth.getTime()) {
            const { translate } = this.props;
            Swal.fire({
                title: translate('kpi.evaluation.employee_evaluation.wrong_time'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm'),
            })
        } else {
            await this.setState(state => {
                return {
                    ...state,
                    startMonth: this.INFO_SEARCH.startMonth,
                    endMonth: this.INFO_SEARCH.endMonth
                }
            })
        }
    }

    render() {
        const { tasks, translate } = this.props;
        const { startMonth, endMonth, willUpdate, callAction } = this.state;

        let amountResponsibleTask = 0, amountTaskCreated = 0, amountAccountableTasks = 0, amountConsultedTasks = 0;
        let numTask = [];
        let totalTasks = 0;

        // Tinh so luong tat ca cac task 
        if (tasks && tasks.responsibleTasks) {
            let task = tasks.responsibleTasks;
            let i;
            for (i in task) {
                if (task[i].status === "Inprocess")
                    amountResponsibleTask++;

            }
        }

        // tính số lượng task mà người này là creator
        if (tasks && tasks.creatorTasks) {
            let task = tasks.creatorTasks;
            let i;
            for (i in task) {
                if (task[i].status === "Inprocess")
                    amountTaskCreated++;

            }
        }

        // tính số lượng task mà người này cần phê duyệt
        if (tasks && tasks.accountableTasks) {
            let task = tasks.accountableTasks;
            let i;
            for (i in task) {
                if (task[i].status === "Inprocess")
                    amountAccountableTasks++;
            }
        }

        // tính số lượng task mà người này là người hỗ trợ
        if (tasks && tasks.consultedTasks) {
            let task = tasks.consultedTasks;
            let i;
            for (i in task) {
                if (task[i].status === "Inprocess")
                    amountConsultedTasks++;
            }
        }

        // Tinh tong so luong cong viec co trang thai Inprogess
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

        let d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        let defaultEndMonth = [month, year].join('-');
        let defaultStartMonth = ['01', year].join('-');

        return (
            <React.Fragment>
                <div className="qlcv">
                    {/**Chọn ngày bắt đầu */}
                    <div className="form-inline">
                        <div className="form-group">
                            <label>{translate('task.task_management.from')}</label>
                            <DatePicker
                                id="monthStartInTaskDashBoard"
                                dateFormat="month-year"             // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm 
                                value={defaultStartMonth}                 // giá trị mặc định cho datePicker    
                                onChange={this.handleSelectMonthStart}
                                disabled={false}                    // sử dụng khi muốn disabled, mặc định là false
                            />
                        </div>
                    </div>

                    {/**Chọn ngày kết thúc */}
                    <div className="form-inline">
                        <div className="form-group">
                            <label>{translate('task.task_management.to')}</label>
                            <DatePicker
                                id="monthEndInTaskDashBoard"
                                dateFormat="month-year"             // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm 
                                value={defaultEndMonth}                 // giá trị mặc định cho datePicker    
                                onChange={this.handleSelectMonthEnd}
                                disabled={false}                    // sử dụng khi muốn disabled, mặc định là false
                            />
                        </div>

                        {/**button tìm kiếm data để vẽ biểu đồ */}
                        <div className="form-group">
                            <button type="button" className="btn btn-success" onClick={this.handleSearchData}>{translate('kpi.evaluation.employee_evaluation.search')}</button>
                        </div>
                    </div>
                </div>

                <div className="row">
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
                </div>
                <div className="row">
                    <div className="col-xs-6">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <div className="box-title">{translate('task.task_management.dashboard_area_result')}</div>
                            </div>
                            <div className="box-body qlcv">
                                {callAction &&
                                    <DomainOfTaskResultsChart
                                        callAction={!willUpdate}
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
                                {callAction &&
                                    <TaskStatusChart
                                        callAction={!willUpdate}
                                        startMonth={startMonth}
                                        endMonth={endMonth}
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
                                                            <span className="text"><a href={`/task?taskId=${item.task._id}`} target="_blank" />{item.task.name}</span>
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