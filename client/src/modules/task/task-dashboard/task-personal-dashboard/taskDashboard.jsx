import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { Link } from 'react-router-dom';

import { taskManagementActions } from '../../task-management/redux/actions';

import { TaskStatusChart } from './taskStatusChart';
import { DomainOfTaskResultsChart } from './domainOfTaskResultsChart';
import { GanttCalendar } from './ganttCalendar';
import { AverageResultsOfTask } from './averageResultsOfTask';
import GeneralTaskPersonalChart from './generalTaskPersonalChart';
import { InprocessTask } from './inprocessTask';
import { LoadTaskChart } from './loadTaskChart';

import { DatePicker, LazyLoadComponent } from '../../../../common-components';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';

import { convertTime } from '../../../../helpers/stringMethod';
import { filterDifference } from '../../../../helpers/taskModuleHelpers';
import { getStorage } from '../../../../config';
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
            type: 'status',
            monthTimeSheetLog: this.INFO_SEARCH.endMonthTitle,
        };
    }

    componentDidMount = () => {
        const { startMonth, endMonth } = this.state;
        let d = new Date(),
            month = d.getMonth() + 1,
            year = d.getFullYear();

        this.props.getResponsibleTaskByUser([], 1, 1000, [], [], [], null, startMonth, endMonth, null, null, true);
        this.props.getAccountableTaskByUser([], 1, 1000, [], [], [], null, startMonth, endMonth, null, null, true);
        this.props.getConsultedTaskByUser([], 1, 1000, [], [], [], null, startMonth, endMonth, null, null, true);
        this.props.getCreatorTaskByUser([], 1, 1000, [], [], [], null, startMonth, endMonth, null, null, true);
        this.props.getInformedTaskByUser([], 1, 1000, [], [], [], null, startMonth, endMonth, null, null, true);
        this.props.getTimeSheetOfUser(getStorage('userId'), month, year);
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
            return "Bấm giờ"
        } else if (value == 2) {
            return "Bấm hẹn giờ"
        } else {
            return "Bấm bù giờ"
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
            html: `<h3 style="color: red"><div>Tải công việc cá nhân</div> </h3>
            <div style="font-size: 1.3em; text-align: left; margin-top: 15px; line-height: 1.7">
            <p>Tải công việc cá nhân trong 1 tháng được tính như sau</p>
            <ul>
                <li>Lấy tất cả các công việc trong tháng đó (theo các vai trò thực hiện, phê duyệt, tư vấn)</li>
                <li>Tải của một công việc = Số ngày thực hiện công việc trong tháng đó/tổng số người thực hiện, phê duyệt, tư vấn trong công việc</li>
                <li>Tải công việc tháng = Tổng tải của tất cả các công việc</li>
            </ul>
            <p>Ví dụ, 1 công việc kéo dài từ 15/3 đến 20/5, có 1 người thực hiện, 1 người phê duyệt và 1 người tư vấn</p>
            <ul>
                <li>Tải công việc đó trong tháng 3 = 15/(1+1+1)</li>
                <li>Tải công việc đó trong tháng 4 = 31/(1+1+1)</li>
                <li>Tải công việc đó trong tháng 5 = 20/(1+1+1)</li>
            </ul>
            </div>`,
            width: "50%",

        })
    }

    showGeneralTaskDescription = () => {
        Swal.fire({
            icon: "question",
            html: `<h3 style="color: red"><div>Tổng quan công việc được thống kê như sau  ?</div> </h3>
            <ul>
             <li style="font-size: 15px; margin-top: 25px; text-align: left;">Thời gian thống kê tự chọn</li>
             <li style="font-size: 15px; margin-top: 25px; text-align: left;">Vai trò trong công việc</strong>: thực hiện, phê duyệt, hỗ trợ</li>
             <li style="font-size: 15px; margin-top: 25px; text-align: left;">Trạng thái công viêc: đang thực hiện</li>
             </ul>`,
            width: "50%",
        })
    }

    render() {
        const { tasks, translate } = this.props;
        const { startMonth, endMonth, monthTimeSheetLog } = this.state;
        const { loadingInformed, loadingCreator, loadingConsulted, loadingAccountable, loadingResponsible } = tasks;
        let { startMonthTitle, endMonthTitle } = this.INFO_SEARCH;
        let { userTimeSheetLogs } = tasks;       // Thống kê bấm giờ

        let amountResponsibleTask = 0, amountTaskCreated = 0, amountAccountableTasks = 0, amountConsultedTasks = 0, amountInformedTasks = 0;
        let totalTasks = 0;
        let newNumTask = [], listTasksGeneral = [];
        // Tinh tong so luong cong viec co trang thai Inprogess
        let responsibleTasks = [], creatorTasks = [], accountableTasks = [], consultedTasks = [], informedTasks = [];

        if (!loadingResponsible && !loadingInformed && !loadingCreator && !loadingConsulted && !loadingAccountable) {
            // Tinh so luong tat ca cac task người này là người thực hiện
            if (tasks?.responsibleTasks?.length > 0) {
                responsibleTasks = tasks.responsibleTasks.filter(o => o.status === "inprocess");
                amountResponsibleTask = responsibleTasks.length;
            }

            if (tasks?.creatorTasks?.length > 0) {
                creatorTasks = tasks.creatorTasks.filter(o => o.status === "inprocess");
                amountTaskCreated = creatorTasks.length;
            }

            if (tasks?.accountableTasks?.length > 0) {
                accountableTasks = tasks.accountableTasks.filter(o => o.status === "inprocess");
                amountAccountableTasks = accountableTasks.length;
            }

            if (tasks?.consultedTasks?.length > 0) {
                consultedTasks = tasks.consultedTasks.filter(o => o.status === "inprocess");
                amountConsultedTasks = consultedTasks.length;
            }

            if (tasks?.informedTasks?.length > 0) {
                informedTasks = tasks.informedTasks.filter(o => o.status === "inprocess");
                amountInformedTasks = informedTasks.length;
            }

            newNumTask = [...newNumTask, ...responsibleTasks, ...creatorTasks, ...consultedTasks, ...accountableTasks, ...informedTasks];
            listTasksGeneral = [...listTasksGeneral, ...responsibleTasks, ...accountableTasks, ...consultedTasks];

            newNumTask = filterDifference(newNumTask);
            listTasksGeneral = filterDifference(listTasksGeneral);

            totalTasks = newNumTask.length;
        }

        return (
            <React.Fragment>
                <div className="qlcv" style={{ textAlign: "left" }}>
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

                <div className="row statistical-wrapper" style={{ marginTop: '5px' }}>
                    <div className="col-md-2 col-sm-4 col-xs-4 statistical-item">
                        <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: "#fff", padding: '10px', borderRadius: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ marginRight: '10px', color: "#00c0ef" }} className="material-icons">
                                    list_alt
                                </span>
                                <span style={{ fontWeight: 'bold' }}>Tổng số cv</span>
                            </div>

                            <Link to="/task-management" onClick={() => localStorage.setItem('stateFromTaskDashboard', JSON.stringify(
                                {
                                    fromTaskPersonalDashboard: true,
                                    status: ["inprocess"],
                                    startDate: this.INFO_SEARCH.startMonth,
                                    endDate: this.INFO_SEARCH.endMonth,
                                    roles: ["responsible", "accountable", "consulted", "creator", "informed"]
                                }
                            ))} target="_blank" rel="noopener noreferrer">
                                <span style={{ fontSize: '21px' }} className="info-box-number">{totalTasks}</span>
                            </Link>
                        </div>
                    </div>

                    <div className="col-md-2 col-sm-4 col-xs-4 statistical-item" >
                        <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: "#fff", padding: '10px', borderRadius: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ marginRight: '10px', color: "#00c0ef" }} className="material-icons">
                                    person_add
                                </span>
                                <span style={{ fontWeight: 'bold' }}>Bạn đã tạo</span>
                            </div>
                            <Link to="/task-management" onClick={() => localStorage.setItem('stateFromTaskDashboard', JSON.stringify(
                                {
                                    fromTaskPersonalDashboard: true,
                                    status: ["inprocess"],
                                    startDate: this.INFO_SEARCH.startMonth,
                                    endDate: this.INFO_SEARCH.endMonth,
                                    roles: ["creator"]
                                }
                            ))} target="_blank" rel="noopener noreferrer">
                                <span style={{ fontSize: '21px' }} className="info-box-number">{amountTaskCreated}</span>
                            </Link>
                        </div>
                    </div>

                    <div className="col-md-2 col-sm-4 col-xs-4 statistical-item">
                        <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: "#fff", padding: '10px', borderRadius: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ marginRight: '10px', color: "#289428" }} className="material-icons">
                                    person
                                </span>
                                <span style={{ fontWeight: 'bold' }}>Bạn thực hiện</span>
                            </div>
                            <Link to="/task-management" onClick={() => localStorage.setItem('stateFromTaskDashboard', JSON.stringify(
                                {
                                    fromTaskPersonalDashboard: true,
                                    status: ["inprocess"],
                                    startDate: this.INFO_SEARCH.startMonth,
                                    endDate: this.INFO_SEARCH.endMonth,
                                    roles: ["responsible"]
                                }
                            ))} target="_blank" rel="noopener noreferrer">
                                <span style={{ fontSize: '21px' }} className="info-box-number">{amountResponsibleTask}</span>
                            </Link>
                        </div>
                    </div>

                    <div className="col-md-2 col-sm-4 col-xs-4 statistical-item">
                        <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: "#fff", padding: '10px', borderRadius: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ marginRight: '10px', color: "#f13c3c" }} className="material-icons">
                                    person
                                </span>
                                <span style={{ fontWeight: 'bold' }}>Bạn phê duyệt</span>
                            </div>
                            <Link to="/task-management" onClick={() => localStorage.setItem('stateFromTaskDashboard', JSON.stringify(
                                {
                                    fromTaskPersonalDashboard: true,
                                    status: ["inprocess"],
                                    startDate: this.INFO_SEARCH.startMonth,
                                    endDate: this.INFO_SEARCH.endMonth,
                                    roles: ["accountable"]
                                }
                            ))} target="_blank" rel="noopener noreferrer">
                                <span style={{ fontSize: '21px' }} className="info-box-number">{amountAccountableTasks}</span>
                            </Link>
                        </div>
                    </div>
                    <div className="col-md-2 col-sm-4 col-xs-4 statistical-item">
                        <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: "#fff", padding: '10px', borderRadius: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ marginRight: '10px', color: "#f39c12" }} className="material-icons">
                                    people
                                </span>

                                <span style={{ fontWeight: 'bold' }}>Bạn tư vấn</span>
                            </div>
                            <Link to="/task-management" onClick={() => localStorage.setItem('stateFromTaskDashboard', JSON.stringify(
                                {
                                    fromTaskPersonalDashboard: true,
                                    status: ["inprocess"],
                                    startDate: this.INFO_SEARCH.startMonth,
                                    endDate: this.INFO_SEARCH.endMonth,
                                    roles: ["consulted"]
                                }
                            ))} target="_blank" rel="noopener noreferrer">
                                <span style={{ fontSize: '21px' }} className="info-box-number">{amountConsultedTasks}</span>
                            </Link>
                        </div>
                    </div>

                    <div className="col-md-2 col-sm-4 col-xs-4 statistical-item">
                        <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: "#fff", padding: '10px', borderRadius: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ marginRight: '10px', color: "#dcb67a" }} className="material-icons">
                                    <span className="material-icons-outlined">
                                        person_search
                                    </span>
                                </span>
                                <span style={{ fontWeight: 'bold' }}>Bạn quan sát</span>
                            </div>
                            <Link to="/task-management" onClick={() => localStorage.setItem('stateFromTaskDashboard', JSON.stringify(
                                {
                                    fromTaskPersonalDashboard: true,
                                    status: ["inprocess"],
                                    startDate: this.INFO_SEARCH.startMonth,
                                    endDate: this.INFO_SEARCH.endMonth,
                                    roles: ["informed"]
                                }
                            ))} target="_blank" rel="noopener noreferrer">
                                <span style={{ fontSize: '21px' }} className="info-box-number">{amountInformedTasks}</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Tổng quan công việc cá nhân */}
                <div className="row">
                    <div className="col-md-12">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <div className="box-title">{`Tổng quan công việc `} {translate('task.task_management.lower_from')} {startMonthTitle} {translate('task.task_management.lower_to')} {endMonthTitle} {`(${listTasksGeneral ? listTasksGeneral.length : 0} công việc)`}</div>
                                <a title={translate('task.task_management.explain')} onClick={() => this.showGeneralTaskDescription()}>
                                    <i className="fa fa-question-circle" style={{ cursor: 'pointer', marginLeft: '5px' }} />
                                </a>
                            </div>
                            <LazyLoadComponent once={true}>
                                {
                                    listTasksGeneral && listTasksGeneral.length > 0 ?
                                        <GeneralTaskPersonalChart tasks={listTasksGeneral} />
                                        : (loadingInformed && loadingConsulted && loadingAccountable) ?
                                            <div className="table-info-panel">{translate('confirm.loading')}</div> :
                                            <div className="table-info-panel">{translate('confirm.no_data')}</div>
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
                                <LazyLoadComponent once={true}>
                                    <DomainOfTaskResultsChart
                                        startMonth={startMonth}
                                        endMonth={endMonth}
                                    />
                                </LazyLoadComponent>
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

                {/*Biểu đồ dashboard tải công việc */}
                <div className="row">
                    <div className="col-xs-12">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <div className="box-title">{translate('task.task_management.load_task_chart')}</div>
                                <a className="text-red" title={translate('task.task_management.explain')} onClick={() => this.showLoadTaskDoc()}>
                                    <i className="fa fa-question-circle" style={{ cursor: 'pointer', color: '#dd4b39', marginLeft: '5px' }} />
                                </a>
                            </div>

                            <div className="box-body qlcv">
                                <LazyLoadComponent once={true}>
                                    <LoadTaskChart
                                        startMonth={startMonth}
                                        endMonth={endMonth}
                                    />
                                </LazyLoadComponent>
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
                                                    tsl?.acceptLog && <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{tsl.name}</td>
                                                        <td>{dayjs(tsl.startedAt).format("DD-MM-YYYY h:mm:ss A")}</td>
                                                        <td>{dayjs(tsl.stoppedAt).format("DD-MM-YYYY h:mm:ss A")}</td>
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
    getTimeSheetOfUser: taskManagementActions.getTimeSheetOfUser,
};

export default connect(mapState, actionCreators)(withTranslate(TaskDashboard));