import React, { Component } from 'react';
import { connect } from 'react-redux';

import { taskManagementActions } from '../../task-management/redux/actions';

import { TaskStatusChart } from './taskStatusChart';
import { DomainOfTaskResultsChart } from './domainOfTaskResultsChart';
import { GanttCalendar } from './ganttCalendar';
import { AverageResultsOfTask } from './averageResultsOfTask';

import { withTranslate } from 'react-redux-multilingual';

import { DatePicker, LazyLoadComponent } from '../../../../common-components';
import Swal from 'sweetalert2';
import { TasksIsNotLinked } from './tasksIsNotLinked';
import { TaskHasActionNotEvaluated } from './taskHasActionNotEvaluated';
import { InprocessTask } from './inprocessTask';
import { LoadTaskChart } from './loadTaskChart';
import { convertTime } from '../../../../helpers/stringMethod';
import { filterDifference } from '../../../../helpers/taskModuleHelpers';
import { getStorage } from '../../../../config';
import moment from 'moment';
import GeneralTaskPersonalChart from './generalTaskPersonalChart';
class TaskDashboard extends Component {

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
            startMonth: [startYear, startMonth].join('-'),
            endMonth: [year, endMonth].join('-'),

            startMonthTitle: [startMonth, startYear].join('-'),
            endMonthTitle: [endMonth, year].join('-'),
        }

        this.SEARCH_FOR_WEIGHT_TASK = {
            taskStartMonth: [startYear, startMonth].join('-'),
            taskEndMonth: [year, endMonth].join('-'),

            startMonthTitle: [startMonth, startYear].join('-'),
            endMonthTitle: [endMonth, year].join('-'),
        }

        this.state = {
            userID: "",

            dataStatus: this.DATA_STATUS.NOT_AVAILABLE,

            startMonth: this.INFO_SEARCH.startMonth,
            endMonth: this.INFO_SEARCH.endMonth,

            startMonthTitle: this.INFO_SEARCH.startMonthTitle,
            endMonthTitle: this.INFO_SEARCH.endMonthTitle,

            willUpdate: false,       // Khi true sẽ cập nhật dữ liệu vào props từ redux
            callAction: false,
            type: 'status',
            monthTimeSheetLog: '',
        };
    }

    componentDidMount = async () => {
        const { startMonth, endMonth } = this.state;
        await this.props.getResponsibleTaskByUser([], 1, 1000, [], [], [], null, startMonth, endMonth, null, null, true);
        await this.props.getAccountableTaskByUser([], 1, 1000, [], [], [], null, startMonth, endMonth, null, null, true);
        await this.props.getConsultedTaskByUser([], 1, 1000, [], [], [], null, startMonth, endMonth, null, null, true);
        await this.props.getCreatorTaskByUser([], 1, 1000, [], [], [], null, startMonth, endMonth, null, null, true);
        await this.props.getInformedTaskByUser([], 1, 1000, [], [], [], null, startMonth, endMonth, null, null, true);

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
            if (!nextProps.tasks.responsibleTasks
                || !nextProps.tasks.accountableTasks
                || !nextProps.tasks.consultedTasks
                || !nextProps.tasks.informedTasks
                || !nextProps.tasks.creatorTasks
                || !nextProps.tasks.tasksbyuser
            ) {
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

    convertType = (value) => {
        // 1: Tắt bấm giờ bằng tay, 2: Tắt bấm giờ tự động với thời gian hẹn trc, 3: add log timer
        if (value == 1) {
            return "Bấm giờ bù giờ"
        } else if (value == 2) {
            return "Bấm hẹn giờ"
        } else {
            return "Bấm giờ"
        }
    }

    handleSelectMonthStart = (value) => {
        let month = value.slice(3, 7) + '-' + value.slice(0, 2);
        let startMonthTitle = value.slice(0, 2) + '-' + value.slice(3, 7);

        this.INFO_SEARCH.startMonth = month;
        this.INFO_SEARCH.startMonthTitle = startMonthTitle;
    }

    handleSelectMonthEnd = (value) => {
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
                    endMonth: this.INFO_SEARCH.endMonth
                }
            })

            await this.props.getResponsibleTaskByUser([], 1, 1000, [], [], [], null, this.INFO_SEARCH.startMonth, this.INFO_SEARCH.endMonth, null, null, true);
            await this.props.getAccountableTaskByUser([], 1, 1000, [], [], [], null, this.INFO_SEARCH.startMonth, this.INFO_SEARCH.endMonth, null, null, true);
            await this.props.getConsultedTaskByUser([], 1, 1000, [], [], [], null, this.INFO_SEARCH.startMonth, this.INFO_SEARCH.endMonth, null, null, true);
            await this.props.getInformedTaskByUser([], 1, 1000, [], [], [], null, this.INFO_SEARCH.startMonth, this.INFO_SEARCH.endMonth, null, null, true);
            await this.props.getCreatorTaskByUser([], 1, 1000, [], [], [], null, this.INFO_SEARCH.startMonth, this.INFO_SEARCH.endMonth, null, null, true);
        }
    }

    handleChangeMonthTimeSheetLog = (value) => {
        this.setState({
            monthTimeSheetLog: value
        });
    }

    getUserTimeSheetLogs = () => {
        let { monthTimeSheetLog } = this.state;
        if (monthTimeSheetLog) {
            let d = monthTimeSheetLog.split('-');
            let month = d[0];
            let year = d[1];
            let userId = getStorage('userId');
            this.props.getTimeSheetOfUser(userId, month, year);
        }
    }

    getTotalTimeSheet = (ts) => {
        let total = 0;
        for (let i = 0; i < ts.length; i++) {
            let tslog = ts[i];
            if (typeof (tslog.duration) === 'number' && tslog.acceptLog) {
                total = total + Number(tslog.duration);
            }
        }
        return convertTime(total);
    }

    showLoadTaskDoc = () => {
        const { translate } = this.props;
        Swal.fire({
            icon: "question",
            html: `<h3 style="color: red"><div>Cách tính tải công việc  ?</div> </h3>
            <ul>
             <li style="font-size: 15px; margin-top: 25px; text-align: left;">Lấy tất cả các công việc người đó đống một trong 3 vai trò: thực hiện,phê duyệt, hỗ trợ,  trong khoảng thời gian được chọn,</li>
             <li style="font-size: 15px; margin-top: 25px; text-align: left;">Tính lần lượt tải công việc theo từng tháng rồi cộng lại,</li>
             <li style="font-size: 15px; margin-top: 25px; text-align: left;">Tải công việc theo từng tháng được tính bằng tỉ số: Số ngày thực hiện với  tổng số người thực hiện, phê duyệt, hỗ trợ</li>
             </ul>`,
            width: "50%",

        })
    }


    render() {
        const { tasks, translate } = this.props;
        const { startMonth, endMonth, willUpdate, callAction, taskAnalys, monthTimeSheetLog } = this.state;

        let { startMonthTitle, endMonthTitle } = this.INFO_SEARCH;
        let { userTimeSheetLogs } = tasks;       // Thống kê bấm giờ
        let amountResponsibleTask = 0, amountTaskCreated = 0, amountAccountableTasks = 0, amountConsultedTasks = 0;
        let numTask = [];
        let totalTasks = 0;
        // Tinh so luong tat ca cac task
        if (tasks && tasks.responsibleTasks) {
            let task = tasks.responsibleTasks;
            let i;
            for (i in task) {
                if (task[i].status === "inprocess")
                    amountResponsibleTask++;

            }
        }

        // tính số lượng task mà người này là creator
        if (tasks && tasks.creatorTasks) {
            let task = tasks.creatorTasks;
            let i;
            for (i in task) {
                if (task[i].status === "inprocess")
                    amountTaskCreated++;

            }
        }

        // tính số lượng task mà người này cần phê duyệt
        if (tasks && tasks.accountableTasks) {
            let task = tasks.accountableTasks;
            let i;
            for (i in task) {
                if (task[i].status === "inprocess")
                    amountAccountableTasks++;
            }
        }

        // tính số lượng task mà người này là người tư vấn
        if (tasks && tasks.consultedTasks) {
            let task = tasks.consultedTasks;
            let i;
            for (i in task) {
                if (task[i].status === "inprocess")
                    amountConsultedTasks++;
            }
        }

        // Tinh tong so luong cong viec co trang thai Inprogess
        let responsibleTasks = [], creatorTasks = [], accountableTasks = [], consultedTasks = [];

        let newNumTask = [], listTasksGeneral = [];
        if (tasks) {
            if (tasks.responsibleTasks && tasks.responsibleTasks.length > 0) {
                responsibleTasks = tasks.responsibleTasks.filter(o => o.status === "inprocess")
            }

            if (tasks.creatorTasks && tasks.creatorTasks.length > 0) {
                creatorTasks = tasks.creatorTasks.filter(o => o.status === "inprocess")
            }

            if (tasks.accountableTasks && tasks.accountableTasks.length > 0) {
                accountableTasks = tasks.accountableTasks.filter(o => o.status === "inprocess")
            }

            if (tasks.consultedTasks && tasks.consultedTasks.length > 0) {
                consultedTasks = tasks.consultedTasks.filter(o => o.status === "inprocess")
            }

            newNumTask = [...newNumTask, ...responsibleTasks, ...creatorTasks, ...consultedTasks, ...accountableTasks];
            listTasksGeneral = [...listTasksGeneral, ...responsibleTasks, ...accountableTasks, ...consultedTasks];

            newNumTask = filterDifference(newNumTask);
            listTasksGeneral = filterDifference(listTasksGeneral);

            totalTasks = newNumTask.length;
        }



        return (
            <React.Fragment>
                <div className="qlcv" style={{ textAlign: "right" }}>
                    {/**Chọn ngày bắt đầu */}
                    <div className="form-inline">
                        <div className="form-group">
                            <label style={{ width: "auto" }}>{translate('task.task_management.from')}</label>
                            <DatePicker
                                id="monthStartInTaskDashBoard"
                                dateFormat="month-year"             // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm 
                                value={startMonthTitle}                 // giá trị mặc định cho datePicker    
                                onChange={this.handleSelectMonthStart}
                                disabled={false}                    // sử dụng khi muốn disabled, mặc định là false
                            />
                        </div>

                        {/**Chọn ngày kết thúc */}
                        <div className="form-group">
                            <label style={{ width: "auto" }}>{translate('task.task_management.to')}</label>
                            <DatePicker
                                id="monthEndInTaskDashBoard"
                                dateFormat="month-year"             // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm 
                                value={endMonthTitle}                 // giá trị mặc định cho datePicker    
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

                {/* Tổng quan công việc cá nhân */}
                <div className="row">
                    <div className="col-md-12">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <div className="box-title">{`Tổng quan công việc (${listTasksGeneral ? listTasksGeneral.length : 0} công việc)`}</div>
                            </div>
                            <LazyLoadComponent once={true}>
                                {
                                    listTasksGeneral && listTasksGeneral.length > 0 &&
                                    <GeneralTaskPersonalChart tasks={listTasksGeneral} tasksbyuser={tasks && tasks.tasksbyuser} />
                                }
                            </LazyLoadComponent>
                        </div>

                    </div>
                </div>

                {/* Lịch công việc chi tiết */}
                <div className="row">
                    <div className="col-xs-12">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <div className="box-title">{translate('task.task_management.tasks_calendar')} {translate('task.task_management.lower_from')} {startMonthTitle} {translate('task.task_management.lower_to')} {endMonthTitle}</div>

                            </div>
                            <LazyLoadComponent once={true}>
                                <GanttCalendar
                                    tasks={tasks}
                                    unit={false}
                                />
                            </LazyLoadComponent>
                        </div>

                    </div>
                </div>

                <div className="row">
                    {/* Biểu đồ miền kết quả công việc */}
                    <div className="col-xs-12">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <div className="box-title">{translate('task.task_management.dashboard_area_result')} {translate('task.task_management.lower_from')} {startMonthTitle} {translate('task.task_management.lower_to')} {endMonthTitle}</div>
                            </div>
                            <div className="box-body qlcv">
                                {callAction &&
                                    <LazyLoadComponent once={true}>
                                        <DomainOfTaskResultsChart
                                            callAction={!willUpdate}
                                            startMonth={startMonth}
                                            endMonth={endMonth}
                                        />
                                    </LazyLoadComponent>
                                }
                            </div>
                        </div>
                    </div>

                    {/* Biểu đồ kết quả trung bình công việc */}
                    <div className="col-xs-12">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <div className="box-title">{translate('task.task_management.detail_average_results')} {translate('task.task_management.lower_from')} {startMonthTitle} {translate('task.task_management.lower_to')} {endMonthTitle}</div>
                            </div>
                            <div className="box-body">
                                <LazyLoadComponent once={true}>
                                    <AverageResultsOfTask
                                        startMonth={startMonth}
                                        endMonth={endMonth}
                                    />
                                </LazyLoadComponent>
                            </div>
                        </div>
                    </div>

                    {/* Biểu đồ trạng thái công việc */}
                    <div className="col-xs-12 col-sm-12 col-md-6">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <div className="box-title">{translate('task.task_management.detail_status')} {translate('task.task_management.lower_from')} {startMonthTitle} {translate('task.task_management.lower_to')} {endMonthTitle}</div>
                            </div>
                            <div className="box-body qlcv">
                                <LazyLoadComponent once={true}>
                                    <TaskStatusChart
                                        startMonth={startMonth}
                                        endMonth={endMonth}
                                    />
                                </LazyLoadComponent>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <div className="box-title">{translate('task.task_management.calc_progress')} {translate('task.task_management.lower_from')} {startMonthTitle} {translate('task.task_management.lower_to')} {endMonthTitle}</div>
                            </div>
                            <div className="box-body qlcv">
                                <LazyLoadComponent once={true}>
                                    <InprocessTask
                                        startMonth={startMonth}
                                        endMonth={endMonth}
                                        tasks={tasks.tasks}
                                    />
                                </LazyLoadComponent>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <TasksIsNotLinked />
                    <TaskHasActionNotEvaluated />
                </div>

                {/*Biểu đồ dashboard tải công việc */}
                <div className="row">
                    <div className="col-xs-12">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <div className="box-title">{translate('task.task_management.load_task_chart')}</div>
                                <a className="text-red" title={translate('task.task_management.explain')} onClick={() => this.showLoadTaskDoc()}>
                                    <i className="fa fa-question-circle" style={{ color: '#dd4b39', marginLeft: '5px' }} />
                                </a>
                            </div>

                            <div className="box-body qlcv">
                                {callAction &&
                                    <LoadTaskChart
                                        callAction={!willUpdate}
                                        startMonth={startMonth}
                                        endMonth={endMonth}
                                    />
                                }
                            </div>
                        </div>
                    </div>
                </div>


                {/* Thống kê bấm giờ theo tháng */}
                <div className="row">
                    <div className="col-xs-12 col-md-12">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <div className="box-title">
                                    Thống kê bấm giờ theo tháng
                                </div>
                            </div>
                            <div className="box-body qlcv">
                                {/* Seach theo thời gian */}
                                <div className="form-inline" >
                                    <div className="form-group">
                                        <label style={{ width: "auto" }}>Tháng</label>
                                        <DatePicker
                                            id="month-time-sheet-log"
                                            dateFormat="month-year"
                                            value={monthTimeSheetLog}
                                            onChange={this.handleChangeMonthTimeSheetLog}
                                            disabled={false}
                                        />
                                    </div>
                                    <button className="btn btn-primary" onClick={this.getUserTimeSheetLogs}>Thống kê</button>
                                </div>

                                <div>
                                    <p className="pull-right" style={{ fontWeight: 'bold' }}>Kết quả
                                    <span style={{ fontWeight: 'bold', marginLeft: 10 }}>
                                            {
                                                !tasks.isLoading ? this.getTotalTimeSheet(userTimeSheetLogs) : translate('general.loading')
                                            }
                                        </span>
                                    </p >
                                </div>
                                <table className="table table-hover table-striped table-bordered" id="table-user-timesheetlogs">
                                    <thead>
                                        <tr>
                                            <th style={{ width: 80 }}>STT</th>
                                            <th>Tên công việc</th>
                                            <th>Thời gian bắt đầu</th>
                                            <th>Thời gian kết thúc</th>
                                            <th>Loại bấm giờ</th>
                                            <th className="col-sort">Bấm giờ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            userTimeSheetLogs.map((tsl, index) => {
                                                return (
                                                    <tr>
                                                        <td>{index + 1}</td>
                                                        <td>{tsl.name}</td>
                                                        <td>{moment(tsl.startedAt).format("HH:mm:ss DD/MM/YYYY")}</td>
                                                        <td>{moment(tsl.stoppedAt).format("HH:mm:ss DD/MM/YYYY")}</td>
                                                        <td>{this.convertType(tsl.autoStopped)}</td>
                                                        <td>{convertTime(tsl.duration)}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
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
    getResponsibleTaskByUser: taskManagementActions.getResponsibleTaskByUser,
    getAccountableTaskByUser: taskManagementActions.getAccountableTaskByUser,
    getConsultedTaskByUser: taskManagementActions.getConsultedTaskByUser,
    getInformedTaskByUser: taskManagementActions.getInformedTaskByUser,
    getCreatorTaskByUser: taskManagementActions.getCreatorTaskByUser,
    getTaskByUser: taskManagementActions.getTasksByUser,
    getTimeSheetOfUser: taskManagementActions.getTimeSheetOfUser,
};

const connectedTaskDashboard = connect(mapState, actionCreators)(withTranslate(TaskDashboard));
export { connectedTaskDashboard as TaskDashboard };