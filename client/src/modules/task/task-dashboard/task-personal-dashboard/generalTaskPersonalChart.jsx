import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import moment from 'moment';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { SlimScroll, ToolTip } from '../../../../common-components';

import "./generalTaskPersonalChart.css";
import urgentIcon from './warning.png';
import todoIcon from './to-do-list.png';
import { getRoleInTask, checkPrioritySetColor, formatPriority, getProjectName } from '../../../../helpers/taskModuleHelpers';

const GeneralTaskPersonalChart = (props) => {
    const { translate, project } = props;
    const [state, setState] = useState({
        userId: localStorage.getItem("userId")
    })

    useEffect(() => {
        console.count()
        dayjs.extend(isSameOrAfter)
        const { tasks } = props;
        let overdueTask = [], delayTask = [], intimeTask = [], urgentTask = [], todoTask = [], deadlineNow = [], deadlineincoming = [];
        // xu ly du lieu
        if (tasks && tasks.length) {
            for (let i in tasks) {
                let created = moment(tasks[i].createdAt);
                let start = moment(tasks[i].startDate);
                let end = moment(tasks[i].endDate);
                let now = moment(new Date());
                let duration = end.diff(start, 'days');
                let createdToNow = now.diff(created, 'days');
                let nowToEnd = end.diff(now, 'days');

                if (dayjs(tasks[i].endDate).isSameOrAfter(dayjs(new Date()))) {
                    const nowDate = new Date();

                    // Lấy công việc khẩn cấp
                    let minimumWorkingTime = getPercent(nowDate, tasks[i].startDate, tasks[i].endDate);
                    let percentDifference = minimumWorkingTime - tasks[i].progress;

                    if (tasks[i].priority === 1 && tasks[i].progress < minimumWorkingTime && percentDifference >= 50) {
                        urgentTask = [...urgentTask, { ...tasks[i], createdToNow }]
                    }
                    if (tasks[i].priority === 2 && tasks[i].progress < minimumWorkingTime && percentDifference >= 40) {
                        urgentTask = [...urgentTask, { ...tasks[i], createdToNow }]
                    }
                    if (tasks[i].priority === 3 && tasks[i].progress < minimumWorkingTime && percentDifference >= 30) {
                        urgentTask = [...urgentTask, { ...tasks[i], createdToNow }]
                    }
                    if (tasks[i].priority === 4 && tasks[i].progress < minimumWorkingTime && percentDifference >= 20) {
                        urgentTask = [...urgentTask, { ...tasks[i], createdToNow }];
                    }
                    if (tasks[i].priority === 5 && tasks[i].progress < minimumWorkingTime && percentDifference >= 10) {
                        urgentTask = [...urgentTask, { ...tasks[i], createdToNow }];
                    }

                    // Lấy công việc cần làm
                    if (tasks[i].priority === 5 && tasks[i].progress < minimumWorkingTime && 0 < percentDifference && percentDifference < 10) {
                        todoTask = [...todoTask, { ...tasks[i], createdToNow }];
                    }
                    if (tasks[i].priority === 4 && tasks[i].progress < minimumWorkingTime && 10 < percentDifference && percentDifference < 20) {
                        todoTask = [...todoTask, { ...tasks[i], createdToNow }];
                    }
                    if (tasks[i].priority === 3 && tasks[i].progress < minimumWorkingTime && 20 < percentDifference && percentDifference < 30) {
                        todoTask = [...todoTask, { ...tasks[i], createdToNow }];
                    }
                    if (tasks[i].priority === 2 && tasks[i].progress < minimumWorkingTime && 30 < percentDifference && percentDifference < 40) {
                        todoTask = [...todoTask, { ...tasks[i], createdToNow }];
                    }
                    if (tasks[i].priority === 1 && tasks[i].progress < minimumWorkingTime && 40 < percentDifference && percentDifference < 50) {
                        todoTask = [...todoTask, { ...tasks[i], createdToNow }];
                    }
                } else {
                    let tasksExpireUrgent = [];
                    const nowDate = new Date();
                    // Quá hạn (cv cấp 1, 2, 3, 4, 5 :25 %, 20%, 15%,10%, 5% số ngày đã quá )
                    let delay = getPercentExpire(nowDate, tasks[i].startDate, tasks[i].endDate);
                    if (tasks[i].priority === 1 && delay > 25) {
                        tasksExpireUrgent = [...tasksExpireUrgent, { ...tasks[i], createdToNow }];
                    } else if (tasks[i].priority === 2 && delay > 20) {
                        tasksExpireUrgent = [...tasksExpireUrgent, { ...tasks[i], createdToNow }];
                    } else if (tasks[i].priority === 3 && delay > 15) {
                        tasksExpireUrgent = [...tasksExpireUrgent, { ...tasks[i], createdToNow }];
                    } else if (tasks[i].priority === 4 && delay > 10) {
                        tasksExpireUrgent = [...tasksExpireUrgent, { ...tasks[i], createdToNow }];
                    } else if (tasks[i].priority === 5 && delay > 5) {
                        tasksExpireUrgent = [...tasksExpireUrgent, { ...tasks[i], createdToNow }];
                    } else {
                        todoTask = [...todoTask, { ...tasks[i], createdToNow }];
                    }

                    urgentTask = [...urgentTask, ...tasksExpireUrgent];
                }

                if (now > end) {
                    //viec Quá hạn
                    let add = {
                        ...tasks[i],
                        nowToEnd: -parseInt(nowToEnd)
                    }
                    overdueTask.push(add);
                }
                else {
                    let processDay = Math.floor(tasks[i].progress * duration / 100);
                    let startToNow = now.diff(start, 'days');
                    // Công việc hạn sắp tới
                    if (nowToEnd <= 7) {
                        let add = {
                            ...tasks[i],
                            totalDays: nowToEnd
                        }
                        deadlineincoming.push(add);
                    }
                    if (startToNow > processDay) {
                        //viec chậm tiến độ
                        let add = {
                            ...tasks[i],
                            nowToEnd
                        }
                        delayTask.push(add);
                    }
                    else if (startToNow <= processDay) {
                        // Đúng tiến độ
                        let add = {
                            ...tasks[i],
                            nowToEnd
                        }
                        intimeTask.push(add);
                    }
                }

                // Láy công việc hạn hôm nay
                const endDate = dayjs(tasks[i].endDate).format();
                const currentDate = dayjs().format();

                if (dayjs(endDate).isSame(currentDate, 'day')) {
                    let secondDiff = dayjs(endDate).diff(currentDate, 'millisecond')
                    secondDiff = convertToDays(secondDiff);
                    deadlineNow = [...deadlineNow, { ...tasks[i], diff: secondDiff }];
                }
            }
        }

        urgentTask?.length > 0 && urgentTask.sort((a, b) => (a.createdToNow < b.createdToNow) ? 1 : -1);
        todoTask?.length > 0 && todoTask.sort((a, b) => (a.createdToNow < b.createdToNow) ? 1 : -1);
        overdueTask?.length > 0 && overdueTask.sort((a, b) => (a.nowToEnd < b.nowToEnd) ? 1 : -1);
        delayTask?.length > 0 && delayTask.sort((a, b) => (a.nowToEnd < b.nowToEnd) ? 1 : -1);
        intimeTask?.length > 0 && intimeTask.sort((a, b) => (a.nowToEnd < b.nowToEnd) ? 1 : -1);
        deadlineincoming?.length > 0 && deadlineincoming.sort((a, b) => (a.totalDays < b.totalDays) ? 1 : -1)
        setState({
            ...state,
            urgentTask,
            todoTask,
            intimeTask,
            delayTask,
            overdueTask,
            deadlineNow,
            deadlineincoming
        })
    }, [props.tasks])


    const getPercent = (nowDate, startDate, endDate) => {
        let start = new Date(startDate);
        let end = new Date(endDate);

        // lấy khoảng thời gian làm việc
        let workingTime = Math.round((end - start) / 1000 / 60 / 60 / 24);
        // lấy khoản thời gian làm việc tính đến ngày hiện tại
        // tính phần trăm phải làm trong 1 ngày
        let percentOneDay = 100 / workingTime;
        // % tiến độ tối thiểu phải làm được trong time hiện tại
        let workingTimeNow = Math.round((nowDate - start) / 1000 / 60 / 60 / 24);
        return workingTimeNow * percentOneDay;
    }

    const getPercentExpire = (nowDate, startDate, endDate) => {
        let start = new Date(startDate);
        let end = new Date(endDate);
        // lấy khoảng thời gian làm việc
        let workingTime = Math.round((end - start) / 1000 / 60 / 60 / 24);
        // tính phần trăm phải làm trong ngày
        let percentOneDay = 100 / workingTime;
        // Tính số ngày quá hạn
        let deadline2 = Math.round((nowDate - end) / 1000 / 60 / 60 / 24);
        // tính phần trăm chậm tiến độ. số ngày quá hạn nhân với phần trăm phải làm trong 1 ngày
        return percentOneDay * deadline2;
    }


    const convertToDays = (milliSeconds) => {
        let hours = Math.floor(milliSeconds / (60 * 60 * 1000));
        milliSeconds -= hours * (60 * 60 * 1000);
        let minutes = Math.floor(milliSeconds / (60 * 1000));
        return { hours, minutes };
    }

    // chú thích quá hạn
    const showTaskOverDueDescription = () => {
        Swal.fire({
            html: `<h4><div>Công việc bạn tham gia với 1 trong 4 tư cách:  thực hiện, phê duyệt, tư vấn, quan sát và được xem là quá hạn nếu đã hết hạn thực hiện công việc nhưng vẫn chưa hoàn thành ?</div> </h4>`
        })
    }

    // chú thích chậm tiến độ
    const showTaskDelayDescription = () => {
        Swal.fire({
            html: `<h4><div>Công việc bạn tham gia với 1 trong 4 tư cách thực hiện, phê duyệt, tư vấn, quan sát vẫn chưa đến hạn kết thúc nhưng % hoàn thành đang nhỏ hơn  % hoàn thành cần đạt tính đến ngày hiện tại</div></h4>`
        })
    }

    // Đúng tiến độ
    const showTaskIntimeDescription = () => {
        Swal.fire({
            html: `<h4><div>Công việc bạn tham gia với 1 trong 4 tư cách thực hiện, phê duyệt, tư vấn, quan sát vẫn chưa đến hạn kết thúc và % hoàn thành đang bằng hoặc hơn  % hoàn thành cần đạt tính đến ngày hiện tại
            </div></h4>`
        })
    }

    //chú thích sắp hết hạn
    const showTaskDeadLineDescription = () => {
        Swal.fire({
            html: `<h4<div>Công việc còn nhiều nhất 7 ngày nữa là đến hạn</div></h4>`
        })
    }

    // chú thích hạn hôm nay
    const formatTime = (date) => {
        return dayjs(date).format("DD-MM-YYYY hh:mm A")
    }
    console.log('state.urgentTask', state.urgentTask)
    return (
        <div className="qlcv box-body">
            <div className="nav-tabs-custom" >
                <ul className="general-tabs nav nav-tabs">
                    <li className="active"><a className="general-task-type" href="#allGeneralTaskUrgent" data-toggle="tab" ><img style={{ width: '18px', height: '18px', marginRight: '5px' }} src={urgentIcon} alt="urgent" />{`${translate('task.task_dashboard.urgent_task')} `} <span>{`(${state.urgentTask ? state.urgentTask.length : 0})`}</span></a></li>
                    <li><a className="general-task-type" href="#allGeneralTaskTodo" data-toggle="tab" ><img src={todoIcon} alt="todo" style={{ width: '20px', marginRight: '5px' }} />  {`${translate('task.task_dashboard.to_do_task')} `}<span>{`(${state.todoTask ? state.todoTask.length : 0})`}</span></a></li>
                    <li><a className="general-task-type" href="#allGeneralTaskOverdue" data-toggle="tab" >{`${translate('task.task_dashboard.overdue_task')} `}<span>{`(${state.overdueTask ? state.overdueTask.length : 0})`}</span></a></li>
                    <li><a className="general-task-type" href="#allGeneralTaskDelay" data-toggle="tab" >{`${translate('task.task_dashboard.delay_task')} `}<span>{`(${state.delayTask ? state.delayTask.length : 0})`}</span></a></li>
                    <li><a className="general-task-type" href="#allGeneralTaskDeedlineNow" data-toggle="tab" >{`Hạn hôm nay `}<span>{`(${state.deadlineNow ? state.deadlineNow.length : 0})`}</span></a></li>
                    <li><a className="general-task-type" href="#allGeneralTaskDeedlineIncoming" data-toggle="tab" >{`${translate('task.task_dashboard.incoming_task')} `}<span>{`(${state.deadlineincoming ? state.deadlineincoming.length : 0})`}</span></a></li>
                    <li><a className="general-task-type" href="#allGeneralTaskIntime" data-toggle="tab" >{`${translate('task.task_dashboard.intime_task')} `}<span>{`(${state.intimeTask ? state.intimeTask.length : 0})`}</span></a></li>
                </ul>

                <div className="tab-content" id="general-tasks-wraper">
                    <div className="tab-pane active notifi-tab-pane StyleScrollDiv StyleScrollDiv-y" id="allGeneralTaskUrgent" style={{ maxHeight: '400px' }}>
                        {
                            state.urgentTask ?
                                <div className="faqs-page block ">
                                    <div className="panel-group" id="accordion-urgent" role="tablist" aria-multiselectable="true" style={{ marginBottom: 0 }}>
                                        {
                                            (state.urgentTask.length !== 0) ?
                                                state.urgentTask.map((obj, index) => (
                                                    <div className="panel panel-default" key={index}>
                                                        <span role="button" className="item-question collapsed" data-toggle="collapse" data-parent="#accordion-urgent" href={`#collapse-urgent${index}`} aria-expanded="true" aria-controls="collapse1a">
                                                            <span className="index">{index + 1}</span>
                                                            <span className="task-name">{obj.name}</span>
                                                            {
                                                                obj.taskProject ?
                                                                    <><i className="fa fa-angle-right angle-right-custom" aria-hidden="true"></i>
                                                                        <a className="task-project-name" title="dự án">{getProjectName(obj.taskProject, project && project.data && project.data.list)}</a></> : null
                                                            }
                                                            <small className="label label-danger" style={{ fontSize: '9px', marginLeft: '5px', borderRadius: '.5em' }}>{obj.createdToNow} {translate('task.task_dashboard.day')} trước</small>
                                                        </span>
                                                        <div id={`collapse-urgent${index}`} className="panel-collapse collapse" role="tabpanel">
                                                            <div className="panel-body">
                                                                <div className="time-todo-range">
                                                                    <span style={{ marginRight: '10px' }}>Thời gian thực hiện công việc: </span> <span style={{ marginRight: '5px' }}><i className="fa fa-clock-o" style={{ marginRight: '1px', color: "rgb(191 71 71)" }}> </i> {formatTime(obj.startDate)}</span> <span style={{ marginRight: '5px' }}>-</span> <span> <i className="fa fa-clock-o" style={{ marginRight: '4px', color: "rgb(191 71 71)" }}> </i>{formatTime(obj.endDate)}</span>
                                                                </div>
                                                                <div className="priority-task-wraper">
                                                                    <span style={{ marginRight: '10px' }}>Độ ưu tiên công việc: </span>
                                                                    <span style={{ color: checkPrioritySetColor(obj.priority) }}>{formatPriority(obj.priority, translate)}</span>
                                                                </div>
                                                                <div className="progress-task-wraper">
                                                                    <span style={{ marginRight: '10px' }}>Tiến độ hiện tại: </span>
                                                                    <div className="progress-task">
                                                                        <div className="fillmult" data-width={`${obj.progress}%`} style={{ width: `${obj.progress}%`, backgroundColor: obj.progress < 50 ? "#dc0000" : "#28a745" }}></div>
                                                                        <span className="perc">{obj.progress}%</span>
                                                                    </div>
                                                                </div>

                                                                <div className="role-in-task">
                                                                    <span style={{ marginRight: '10px' }}>Người thực hiện: </span>
                                                                    {
                                                                        obj?.responsibleEmployees?.length ?
                                                                            <ToolTip dataTooltip={obj?.responsibleEmployees.map(o => o.name)} />
                                                                            : null
                                                                    }
                                                                </div>

                                                                <div className="role-in-task">
                                                                    <span style={{ marginRight: '10px' }}>Vai trò trong công việc: </span>
                                                                    <span>{getRoleInTask(state.userId, obj, translate)}</span>
                                                                </div>
                                                                <a href={`/task?taskId=${obj._id}`} target="_blank" className="seemore-task">Xem chi tiết</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )) : <small style={{ color: "#696767" }}>{translate('task.task_dashboard.no_task')}</small>
                                        }
                                    </div>
                                </div> : null
                        }
                    </div>

                    <div className="tab-pane notifi-tab-pane" id="allGeneralTaskTodo">
                        {
                            state.todoTask ?
                                <div className="faqs-page block ">
                                    <div className="panel-group" id="accordion-todo" role="tablist" aria-multiselectable="true" style={{ marginBottom: 0 }}>
                                        {
                                            (state.todoTask.length !== 0) ?
                                                state.todoTask.map((obj, index) => (
                                                    <div className="panel panel-default" key={index}>
                                                        <span role="button" className="item-question collapsed" data-toggle="collapse" data-parent="#accordion-todo" href={`#collapse-todo${index}`} aria-expanded="false" aria-controls={`#collapse-todo${index}`}>
                                                            <span className="index">{index + 1}</span>
                                                            <span className="task-name">{obj.name}</span>
                                                            {
                                                                obj.taskProject ?
                                                                    <><i className="fa fa-angle-right angle-right-custom" aria-hidden="true"></i>
                                                                        <a className="task-project-name" title="dự án">{getProjectName(obj.taskProject, project && project.data && project.data.list)}</a></> : null
                                                            }
                                                            <small className="label label-primary" style={{ fontSize: '9px', marginLeft: '5px', borderRadius: '.5em' }}>{obj.createdToNow} {translate('task.task_dashboard.day')} trước</small>
                                                        </span>
                                                        <div id={`collapse-todo${index}`} className="panel-collapse collapse" role="tabpanel">
                                                            <div className="panel-body">
                                                                <div className="time-todo-range">
                                                                    <span style={{ marginRight: '10px' }}>Thời gian thực hiện công việc: </span> <span style={{ marginRight: '5px' }}><i className="fa fa-clock-o" style={{ marginRight: '1px', color: "rgb(191 71 71)" }}> </i> {formatTime(obj.startDate)}</span> <span style={{ marginRight: '5px' }}>-</span> <span> <i className="fa fa-clock-o" style={{ marginRight: '4px', color: "rgb(191 71 71)" }}> </i>{formatTime(obj.endDate)}</span>
                                                                </div>

                                                                <div className="priority-task-wraper">
                                                                    <span style={{ marginRight: '10px' }}>Độ ưu tiên công việc: </span>
                                                                    <span style={{ color: checkPrioritySetColor(obj.priority) }}>{formatPriority(obj.priority, translate)}</span>
                                                                </div>

                                                                <div className="progress-task-wraper">
                                                                    <span style={{ marginRight: '10px' }}>Tiến độ hiện tại: </span>
                                                                    <div className="progress-task">
                                                                        <div className="fillmult" data-width={`${obj.progress}%`} style={{ width: `${obj.progress}%`, backgroundColor: obj.progress < 50 ? "#dc0000" : "#28a745" }}></div>
                                                                        <span className="perc">{obj.progress}%</span>
                                                                    </div>
                                                                </div>

                                                                <div className="role-in-task">
                                                                    <span style={{ marginRight: '10px' }}>Người thực hiện: </span>
                                                                    {
                                                                        obj?.responsibleEmployees?.length ?
                                                                            <ToolTip dataTooltip={obj?.responsibleEmployees.map(o => o.name)} />
                                                                            : null
                                                                    }
                                                                </div>

                                                                <div className="role-in-task">
                                                                    <span style={{ marginRight: '10px' }}>Vai trò trong công việc: </span>
                                                                    <span>{getRoleInTask(state.userId, obj, translate)}</span>
                                                                </div>
                                                                <a href={`/task?taskId=${obj._id}`} target="_blank" className="seemore-task">Xem chi tiết</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )) : <small style={{ color: "#696767" }}>{translate('task.task_dashboard.no_task')}</small>
                                        }
                                    </div>
                                </div> : null
                        }
                    </div>

                    <div className="tab-pane notifi-tab-pane" id="allGeneralTaskOverdue">
                        {
                            state.overdueTask ?
                                <div className="faqs-page block ">
                                    <div className="panel-group" id="accordion-overdue" role="tablist" aria-multiselectable="true" style={{ marginBottom: 0 }}>
                                        {
                                            (state.overdueTask.length !== 0) ?
                                                state.overdueTask.map((obj, index) => (
                                                    <div className="panel panel-default" key={index}>
                                                        <span role="button" className="item-question collapsed" data-toggle="collapse" data-parent="#accordion-overdue" href={`#collapse-overdue${index}`} aria-expanded="true" aria-controls="collapse1a">
                                                            <span className="index">{index + 1}</span>
                                                            <span className="task-name">{obj.name}</span>
                                                            {
                                                                obj.taskProject ?
                                                                    <><i className="fa fa-angle-right angle-right-custom" aria-hidden="true"></i>
                                                                        <a className="task-project-name" title="dự án">{getProjectName(obj.taskProject, project && project.data && project.data.list)}</a></> : null
                                                            }
                                                            <small className="label label-danger" style={{ fontSize: '9px', marginLeft: '5px', borderRadius: '.5em' }}>{translate('task.task_dashboard.overdue')} {obj.nowToEnd} {translate('task.task_dashboard.day')}</small>
                                                        </span>
                                                        <div id={`collapse-overdue${index}`} className="panel-collapse collapse" role="tabpanel">
                                                            <div className="panel-body">
                                                                <div className="time-todo-range">
                                                                    <span style={{ marginRight: '10px' }}>Thời gian thực hiện công việc: </span> <span style={{ marginRight: '5px' }}><i className="fa fa-clock-o" style={{ marginRight: '1px', color: "rgb(191 71 71)" }}> </i> {formatTime(obj.startDate)}</span> <span style={{ marginRight: '5px' }}>-</span> <span> <i className="fa fa-clock-o" style={{ marginRight: '4px', color: "rgb(191 71 71)" }}> </i>{formatTime(obj.endDate)}</span>
                                                                </div>

                                                                <div className="priority-task-wraper">
                                                                    <span style={{ marginRight: '10px' }}>Độ ưu tiên công việc: </span>
                                                                    <span style={{ color: checkPrioritySetColor(obj.priority) }}>{formatPriority(obj.priority, translate)}</span>
                                                                </div>

                                                                <div className="progress-task-wraper">
                                                                    <span style={{ marginRight: '10px' }}>Tiến độ hiện tại: </span>
                                                                    <div className="progress-task">
                                                                        <div className="fillmult" data-width={`${obj.progress}%`} style={{ width: `${obj.progress}%`, backgroundColor: obj.progress < 50 ? "#dc0000" : "#28a745" }}></div>
                                                                        <span className="perc">{obj.progress}%</span>
                                                                    </div>
                                                                </div>

                                                                <div className="role-in-task">
                                                                    <span style={{ marginRight: '10px' }}>Người thực hiện: </span>
                                                                    {
                                                                        obj?.responsibleEmployees?.length ?
                                                                            <ToolTip dataTooltip={obj?.responsibleEmployees.map(o => o.name)} />
                                                                            : null
                                                                    }
                                                                </div>

                                                                <div className="role-in-task">
                                                                    <span style={{ marginRight: '10px' }}>Vai trò trong công việc: </span>
                                                                    <span>{getRoleInTask(state.userId, obj, translate)}</span>
                                                                </div>
                                                                <a href={`/task?taskId=${obj._id}`} target="_blank" className="seemore-task">Xem chi tiết</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )) : <small style={{ color: "#696767" }}>{translate('task.task_dashboard.no_task')}</small>
                                        }
                                    </div>
                                </div> : null
                        }
                    </div>

                    <div className="tab-pane notifi-tab-pane" id="allGeneralTaskDelay">
                        {
                            state.delayTask ?
                                <div className="faqs-page block ">
                                    <div className="panel-group" id="accordion-delay" role="tablist" aria-multiselectable="true" style={{ marginBottom: 0 }}>
                                        {
                                            (state.delayTask.length !== 0) ?
                                                state.delayTask.map((obj, index) => (
                                                    <div className="panel panel-default" key={index}>
                                                        <span role="button" className="item-question collapsed" data-toggle="collapse" data-parent="#accordion-delay" href={`#collapse-delay${index}`} aria-expanded="true" aria-controls="collapse1a">
                                                            <span className="index">{index + 1}</span>
                                                            <span className="task-name">{obj.name}</span>
                                                            {
                                                                obj.taskProject ?
                                                                    <><i className="fa fa-angle-right angle-right-custom" aria-hidden="true"></i>
                                                                        <a className="task-project-name" title="dự án">{getProjectName(obj.taskProject, project && project.data && project.data.list)}</a></> : null
                                                            }
                                                            <small className="label" style={{ fontSize: '9px', marginLeft: '5px', borderRadius: '.5em', backgroundColor: "#db8b0b" }}>{obj.progress}% - {translate('task.task_dashboard.rest')} {obj.nowToEnd} {translate('task.task_dashboard.day')} tới hạn</small>
                                                        </span>
                                                        <div id={`collapse-delay${index}`} className="panel-collapse collapse" role="tabpanel">
                                                            <div className="panel-body">
                                                                <div className="time-todo-range">
                                                                    <span style={{ marginRight: '10px' }}>Thời gian thực hiện công việc: </span> <span style={{ marginRight: '5px' }}><i className="fa fa-clock-o" style={{ marginRight: '1px', color: "rgb(191 71 71)" }}> </i> {formatTime(obj.startDate)}</span> <span style={{ marginRight: '5px' }}>-</span> <span> <i className="fa fa-clock-o" style={{ marginRight: '4px', color: "rgb(191 71 71)" }}> </i>{formatTime(obj.endDate)}</span>
                                                                </div>

                                                                <div className="priority-task-wraper">
                                                                    <span style={{ marginRight: '10px' }}>Độ ưu tiên công việc: </span>
                                                                    <span style={{ color: checkPrioritySetColor(obj.priority) }}>{formatPriority(obj.priority, translate)}</span>
                                                                </div>

                                                                <div className="progress-task-wraper">
                                                                    <span style={{ marginRight: '10px' }}>Tiến độ hiện tại: </span>
                                                                    <div className="progress-task">
                                                                        <div className="fillmult" data-width={`${obj.progress}%`} style={{ width: `${obj.progress}%`, backgroundColor: obj.progress < 50 ? "#dc0000" : "#28a745" }}></div>
                                                                        <span className="perc">{obj.progress}%</span>
                                                                    </div>
                                                                </div>

                                                                <div className="role-in-task">
                                                                    <span style={{ marginRight: '10px' }}>Người thực hiện: </span>
                                                                    {
                                                                        obj?.responsibleEmployees?.length ?
                                                                            <ToolTip dataTooltip={obj?.responsibleEmployees.map(o => o.name)} />
                                                                            : null
                                                                    }
                                                                </div>

                                                                <div className="role-in-task">
                                                                    <span style={{ marginRight: '10px' }}>Vai trò trong công việc: </span>
                                                                    <span>{getRoleInTask(state.userId, obj, translate)}</span>
                                                                </div>

                                                                <a href={`/task?taskId=${obj._id}`} target="_blank" className="seemore-task">Xem chi tiết</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )) : <small style={{ color: "#696767" }}>{translate('task.task_dashboard.no_task')}</small>
                                        }
                                    </div>
                                </div> : null
                        }
                    </div>

                    {/* Hạn hôm nay */}
                    <div className="tab-pane notifi-tab-pane" id="allGeneralTaskDeedlineNow">
                        {
                            state.deadlineNow ?
                                <div className="faqs-page block ">
                                    <div className="panel-group" id="accordion-deadlinenow" role="tablist" aria-multiselectable="true" style={{ marginBottom: 0 }}>
                                        {
                                            (state.deadlineNow.length !== 0) ?
                                                state.deadlineNow.map((obj, index) => (
                                                    <div className="panel panel-default" key={index}>
                                                        <span role="button" className="item-question collapsed" data-toggle="collapse" data-parent="#accordion-deadlinenow" href={`#collapse-deadlinenow${index}`} aria-expanded="true" aria-controls="collapse1a">
                                                            <span className="index">{index + 1}</span>
                                                            <span className="task-name">{obj.name}</span>
                                                            {
                                                                obj.taskProject ?
                                                                    <><i className="fa fa-angle-right angle-right-custom" aria-hidden="true"></i>
                                                                        <a className="task-project-name" title="dự án">{getProjectName(obj.taskProject, project && project.data && project.data.list)}</a></> : null
                                                            }
                                                            <small className="label" style={{ fontSize: '9px', marginLeft: '5px', borderRadius: '.5em', backgroundColor: "rgb(117 152 224)" }}>{obj?.diff?.hours >= 0 ? `còn ${obj.diff.hours}h:${obj.diff.minutes}p hết hạn` : `hết hạn ${-obj.diff.hours}h:${obj.diff.minutes}p trước`}</small>
                                                        </span>
                                                        <div id={`collapse-deadlinenow${index}`} className="panel-collapse collapse" role="tabpanel">
                                                            <div className="panel-body">
                                                                <div className="time-todo-range">
                                                                    <span style={{ marginRight: '10px' }}>Thời gian thực hiện công việc: </span> <span style={{ marginRight: '5px' }}><i className="fa fa-clock-o" style={{ marginRight: '1px', color: "rgb(191 71 71)" }}> </i> {formatTime(obj.startDate)}</span> <span style={{ marginRight: '5px' }}>-</span> <span> <i className="fa fa-clock-o" style={{ marginRight: '4px', color: "rgb(191 71 71)" }}> </i>{formatTime(obj.endDate)}</span>
                                                                </div>

                                                                <div className="priority-task-wraper">
                                                                    <span style={{ marginRight: '10px' }}>Độ ưu tiên công việc: </span>
                                                                    <span style={{ color: checkPrioritySetColor(obj.priority) }}>{formatPriority(obj.priority, translate)}</span>
                                                                </div>

                                                                <div className="progress-task-wraper">
                                                                    <span style={{ marginRight: '10px' }}>Tiến độ hiện tại: </span>
                                                                    <div className="progress-task">
                                                                        <div className="fillmult" data-width={`${obj.progress}%`} style={{ width: `${obj.progress}%`, backgroundColor: obj.progress < 50 ? "#dc0000" : "#28a745" }}>
                                                                        </div>
                                                                        <span className="perc">{obj.progress}%</span>
                                                                    </div>
                                                                </div>

                                                                <div className="role-in-task">
                                                                    <span style={{ marginRight: '10px' }}>Người thực hiện: </span>
                                                                    {
                                                                        obj?.responsibleEmployees?.length ?
                                                                            <ToolTip dataTooltip={obj?.responsibleEmployees.map(o => o.name)} />
                                                                            : null
                                                                    }
                                                                </div>

                                                                <div className="role-in-task">
                                                                    <span style={{ marginRight: '10px' }}>Vai trò trong công việc: </span>
                                                                    <span>{getRoleInTask(state.userId, obj, translate)}</span>
                                                                </div>
                                                                <a href={`/task?taskId=${obj._id}`} target="_blank" className="seemore-task">Xem chi tiết</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )) : <small style={{ color: "#696767" }}>{translate('task.task_dashboard.no_task')}</small>
                                        }
                                    </div>
                                </div> : null
                        }
                    </div>

                    <div className="tab-pane notifi-tab-pane" id="allGeneralTaskDeedlineIncoming">
                        {
                            state.deadlineincoming &&
                            <div className="faqs-page block ">
                                <div className="panel-group" id="accordion-deadlineincoming" role="tablist" aria-multiselectable="true" style={{ marginBottom: 0 }}>
                                    {
                                        (state.deadlineincoming.length > 0) ?
                                            state.deadlineincoming.map((obj, index) => (
                                                <div className="panel panel-default" key={index}>
                                                    <span role="button" className="item-question collapsed" data-toggle="collapse" data-parent="#accordion-deadlineincoming" href={`#collapse-deadlineincoming${index}`} aria-expanded="true" aria-controls="collapse1a">
                                                        <span className="index">{index + 1}</span>
                                                        <span className="task-name">{obj?.name}</span>
                                                        {
                                                            obj?.taskProject ?
                                                                <><i className="fa fa-angle-right angle-right-custom" aria-hidden="true"></i>
                                                                    <a className="task-project-name" title="dự án">{getProjectName(obj.taskProject, project && project.data && project.data.list)}</a></> : null
                                                        }
                                                        <small className="label" style={{ fontSize: '9px', marginLeft: '5px', borderRadius: '.5em', backgroundColor: "#db8b0b" }}>{obj?.progress}% - {translate('task.task_dashboard.rest')} {obj.totalDays} {translate('task.task_dashboard.day')}</small>
                                                    </span>
                                                    <div id={`collapse-deadlineincoming${index}`} className="panel-collapse collapse" role="tabpanel">
                                                        <div className="panel-body">
                                                            <div className="time-todo-range">
                                                                <span style={{ marginRight: '10px' }}>Thời gian thực hiện công việc: </span> <span style={{ marginRight: '5px' }}><i className="fa fa-clock-o" style={{ marginRight: '1px', color: "rgb(191 71 71)" }}> </i> {formatTime(obj.startDate)}</span> <span style={{ marginRight: '5px' }}>-</span> <span> <i className="fa fa-clock-o" style={{ marginRight: '4px', color: "rgb(191 71 71)" }}> </i>{formatTime(obj.endDate)}</span>
                                                            </div>

                                                            <div className="priority-task-wraper">
                                                                <span style={{ marginRight: '10px' }}>Độ ưu tiên công việc: </span>
                                                                <span style={{ color: checkPrioritySetColor(obj.priority) }}>{formatPriority(obj.priority, translate)}</span>
                                                            </div>

                                                            <div className="progress-task-wraper">
                                                                <span style={{ marginRight: '10px' }}>Tiến độ hiện tại: </span>
                                                                <div className="progress-task">
                                                                    <div className="fillmult" data-width={`${obj?.progress}%`} style={{ width: `${obj?.progress}%`, backgroundColor: obj?.progress < 50 ? "#dc0000" : "#28a745" }}>
                                                                    </div>
                                                                    <span className="perc">{obj?.progress}%</span>
                                                                </div>
                                                            </div>

                                                            <div className="role-in-task">
                                                                <span style={{ marginRight: '10px' }}>Người thực hiện: </span>
                                                                {
                                                                    obj?.responsibleEmployees?.length ?
                                                                        <ToolTip dataTooltip={obj?.responsibleEmployees.map(o => o.name)} />
                                                                        : null
                                                                }
                                                            </div>

                                                            <div className="role-in-task">
                                                                <span style={{ marginRight: '10px' }}>Vai trò trong công việc: </span>
                                                                <span>{getRoleInTask(state.userId, obj, translate)}</span>
                                                            </div>
                                                            <a href={`/task?taskId=${obj._id}`} target="_blank" className="seemore-task">Xem chi tiết</a>

                                                        </div>
                                                    </div>
                                                </div>
                                            )) : <small style={{ color: "#696767" }}>{translate('task.task_dashboard.no_task')}</small>
                                    }
                                </div>
                            </div>
                        }
                    </div>

                    {/* đúng hạn */}
                    <div className="tab-pane notifi-tab-pane" id="allGeneralTaskIntime">
                        {
                            state.intimeTask &&
                            <div className="faqs-page block ">
                                <div className="panel-group" id="accordion-intime" role="tablist" aria-multiselectable="true" style={{ marginBottom: 0 }}>
                                    {
                                        (state.intimeTask.length !== 0) ?
                                            state.intimeTask.map((obj, index) => (
                                                <div className="panel panel-default" key={index}>
                                                    <span role="button" className="item-question collapsed" data-toggle="collapse" data-parent="#accordion-intime" href={`#collapse-intime${index}`} aria-expanded="true" aria-controls="collapse1a">
                                                        <span className="index">{index + 1}</span>
                                                        <span className="task-name">{obj.name}</span>
                                                        {
                                                            obj.taskProject &&
                                                            <><i className="fa fa-angle-right angle-right-custom" aria-hidden="true"></i>
                                                                <a className="task-project-name" title="dự án">{getProjectName(obj.taskProject, project && project.data && project.data.list)}</a></>
                                                        }
                                                        <small className="label label-success" style={{ fontSize: '9px', marginLeft: '5px', borderRadius: '.5em' }}>{obj.progress}% - {translate('task.task_dashboard.rest')} {obj.nowToEnd} {translate('task.task_dashboard.day')}</small>
                                                    </span>
                                                    <div id={`collapse-intime${index}`} className="panel-collapse collapse" role="tabpanel">
                                                        <div className="panel-body">
                                                            <div className="time-todo-range">
                                                                <span style={{ marginRight: '10px' }}>Thời gian thực hiện công việc: </span> <span style={{ marginRight: '5px' }}><i className="fa fa-clock-o" style={{ marginRight: '1px', color: "rgb(191 71 71)" }}> </i> {formatTime(obj.startDate)}</span> <span style={{ marginRight: '5px' }}>-</span> <span> <i className="fa fa-clock-o" style={{ marginRight: '4px', color: "rgb(191 71 71)" }}> </i>{formatTime(obj.endDate)}</span>
                                                            </div>

                                                            <div className="priority-task-wraper">
                                                                <span style={{ marginRight: '10px' }}>Độ ưu tiên công việc: </span>
                                                                <span style={{ color: checkPrioritySetColor(obj.priority) }}>{formatPriority(obj.priority, translate)}</span>
                                                            </div>

                                                            <div className="progress-task-wraper">
                                                                <span style={{ marginRight: '10px' }}>Tiến độ hiện tại: </span>
                                                                <div className="progress-task">
                                                                    <div className="fillmult" data-width={`${obj.progress}%`} style={{ width: `${obj.progress}%`, backgroundColor: obj.progress < 50 ? "#dc0000" : "#28a745" }}></div>
                                                                    <span className="perc">{obj.progress}%</span>
                                                                </div>
                                                            </div>

                                                            <div className="role-in-task">
                                                                <span style={{ marginRight: '10px' }}>Người thực hiện: </span>
                                                                {
                                                                    obj?.responsibleEmployees?.length ?
                                                                        <ToolTip dataTooltip={obj?.responsibleEmployees.map(o => o.name)} />
                                                                        : null
                                                                }
                                                            </div>

                                                            <div className="role-in-task">
                                                                <span style={{ marginRight: '10px' }}>Vai trò trong công việc: </span>
                                                                <span>{getRoleInTask(state.userId, obj, translate)}</span>
                                                            </div>
                                                            <a href={`/task?taskId=${obj._id}`} target="_blank" className="seemore-task">Xem chi tiết</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            )) : <small style={{ color: "#696767" }}>{translate('task.task_dashboard.no_task')}</small>
                                    }
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
            {/* <SlimScroll verticalScroll={true} outerComponentId={"allGeneralTaskUrgent"} maxHeight={400} activate={true} /> */}
            <SlimScroll verticalScroll={true} outerComponentId={"allGeneralTaskTodo"} maxHeight={400} activate={true} />
            <SlimScroll verticalScroll={true} outerComponentId={"allGeneralTaskOverdue"} maxHeight={400} activate={true} />
            <SlimScroll verticalScroll={true} outerComponentId={"allGeneralTaskDelay"} maxHeight={400} activate={true} />
            <SlimScroll verticalScroll={true} outerComponentId={"allGeneralTaskDeedlineNow"} maxHeight={400} activate={true} />
            <SlimScroll verticalScroll={true} outerComponentId={"allGeneralTaskDeedlineIncoming"} maxHeight={400} activate={true} />
            <SlimScroll verticalScroll={true} outerComponentId={"allGeneralTaskIntime"} maxHeight={400} activate={true} />
        </div>
    )
}
function mapState(state) {
    const { project } = state;
    return { project };
}

export default connect(mapState, null)(withTranslate(GeneralTaskPersonalChart))
