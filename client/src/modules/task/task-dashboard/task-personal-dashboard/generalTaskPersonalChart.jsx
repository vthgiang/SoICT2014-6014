import React, { useEffect, useState } from 'react'
import { withTranslate } from 'react-redux-multilingual';
import moment from 'moment';
import Swal from 'sweetalert2';
import useDeepCompareEffect from 'use-deep-compare-effect'
import dayjs from 'dayjs';
import { SlimScroll } from '../../../../common-components';
import "./generalTaskPersonalChart.css";
const GeneralTaskPersonalChart = (props) => {
    const { translate } = props;
    const [state, setState] = useState({
        userId: localStorage.getItem("userId")
    })

    useEffect(() => {
        console.count()
        const { tasks } = props;
        let overdueTask = [], delayTask = [], intimeTask = [], urgentTask = [], todoTask = [], deadlineNow = [];
        const taskOfUser = tasks?.tasks;

        // xu ly du lieu
        if (taskOfUser && taskOfUser.length) {
            for (let i in taskOfUser) {
                let created = moment(taskOfUser[i].createdAt);
                let start = moment(taskOfUser[i].startDate);
                let end = moment(taskOfUser[i].endDate);
                let now = moment(new Date());
                let duration = end.diff(start, 'days');
                let createdToNow = now.diff(created, 'days');
                let nowToEnd = end.diff(now, 'days');

                if (taskOfUser[i].status === 'inprocess') {
                    // cac cong viec khan cap
                    if (taskOfUser[i].priority === 5) {
                        let add = {
                            ...taskOfUser[i],
                            createdToNow
                        }
                        urgentTask.push(add)
                    }

                    if (now <= end) {
                        //viec can lam
                        let add = {
                            ...taskOfUser[i],
                            nowToEnd
                        }
                        todoTask.push(add)
                    }

                    if (now > end) {
                        //viec Quá hạn
                        let add = {
                            ...taskOfUser[i],
                            nowToEnd: -parseInt(nowToEnd)
                        }
                        overdueTask.push(add);
                    }
                    else {
                        let processDay = Math.floor(taskOfUser[i].progress * duration / 100);
                        let startToNow = now.diff(start, 'days');

                        if (startToNow > processDay) {
                            //viec chậm tiến độ
                            let add = {
                                ...taskOfUser[i],
                                nowToEnd
                            }
                            delayTask.push(add);
                        }
                        else if (startToNow <= processDay) {
                            // Đúng tiến độ
                            let add = {
                                ...taskOfUser[i],
                                nowToEnd
                            }
                            intimeTask.push(add);
                        }
                    }

                    // Láy công việc hạn hôm nay
                    const startDate = dayjs(taskOfUser[i].startDate).format();
                    const currentDate = dayjs().format();

                    if (dayjs(startDate).isSame(currentDate, 'day')) {
                        const secondDiff = dayjs(startDate).diff(currentDate, 'millisecond')
                        deadlineNow = [...deadlineNow, { ...taskOfUser[i], diff: secondDiff }];
                    }
                }
            }
        }
        setState({
            ...state,
            urgentTask,
            todoTask,
            intimeTask,
            delayTask,
            overdueTask,
            deadlineNow
        })
    }, [props.tasks.tasks])

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

    const checkPriority = (value) => {
        const valueConvert = parseInt(value);
        if (valueConvert === 1) return "#808080"
        if (valueConvert === 2) return "#ffa707"
        if (valueConvert === 3) return "#28A745"
        if (valueConvert === 4) return "#ff5707"
        if (valueConvert === 5) return "#ff0707"
    }

    const formatPriority = (data) => {
        const { translate } = props;
        if (data === 1) return translate('task.task_management.low');
        if (data === 2) return translate('task.task_management.average');
        if (data === 3) return translate('task.task_management.standard');
        if (data === 4) return translate('task.task_management.high');
        if (data === 5) return translate('task.task_management.urgent');
    }
    return (
        <div className="qlcv box-body">
            <div className="nav-tabs-custom" >
                <ul className="general-tabs nav nav-tabs">
                    <li className="active"><a className="general-task-type" href="#allGeneralTaskUrgent" data-toggle="tab" >{`${translate('task.task_dashboard.urgent_task')} `} <span>{`(${state.urgentTask ? state.urgentTask.length : 0})`}</span></a></li>
                    <li><a className="general-task-type" href="#allGeneralTaskTodo" data-toggle="tab" >{`${translate('task.task_dashboard.to_do_task')} `}<span>{`(${state.todoTask ? state.todoTask.length : 0})`}</span></a></li>
                    <li><a className="general-task-type" href="#allGeneralTaskOverdue" data-toggle="tab" >{`${translate('task.task_dashboard.overdue_task')} `}<span>{`(${state.overdueTask ? state.overdueTask.length : 0})`}</span></a></li>
                    <li><a className="general-task-type" href="#allGeneralTaskDelay" data-toggle="tab" >{`${translate('task.task_dashboard.delay_task')} `}<span>{`(${state.delayTask ? state.delayTask.length : 0})`}</span></a></li>
                    <li><a className="general-task-type" href="#allGeneralTaskDeedlineNow" data-toggle="tab" >{`Hạn hôm nay `}<span>{`(${state.deadlineNow ? state.deadlineNow.length : 0})`}</span></a></li>
                    <li><a className="general-task-type" href="#allGeneralTaskDeedlineIncoming" data-toggle="tab" >{`${translate('task.task_dashboard.incoming_task')} `}<span>{`(${props.tasks && props.tasks.tasksbyuser && props.tasks.tasksbyuser.deadlineincoming ? props.tasks.tasksbyuser.deadlineincoming.length : 0})`}</span></a></li>
                    <li><a className="general-task-type" href="#allGeneralTaskIntime" data-toggle="tab" >{`${translate('task.task_dashboard.intime_task')} `}<span>{`(${state.intimeTask ? state.intimeTask.length : 0})`}</span></a></li>
                </ul>

                <div className="tab-content" id="general-tasks-wraper">
                    <div className="tab-pane active notifi-tab-pane" id="allGeneralTaskUrgent">
                        {
                            state.urgentTask &&
                            <div className="faqs-page block ">
                                <div className="panel-group" id="accordion-urgent" role="tablist" aria-multiselectable="true" style={{ marginBottom: 0 }}>
                                    {
                                        (state.urgentTask.length !== 0) ?
                                            state.urgentTask.map((obj, index) => (
                                                <div className="panel panel-default" key={index}>
                                                    <a role="button" className="item-question collapsed" data-toggle="collapse" data-parent="#accordion-urgent" href={`#collapse-urgent${index}`} aria-expanded="true" aria-controls="collapse1a">
                                                        <span className="index">{index + 1}</span> <span style={{ color: "#171717", }}>{obj.name}</span> <small className="label label-danger" style={{ fontSize: '9px', marginLeft: '5px', borderRadius: '.5em' }}>{obj.progress}% - {translate('task.task_dashboard.rest')} {obj.nowToEnd} {translate('task.task_dashboard.day')}</small>
                                                    </a>
                                                    <div id={`collapse-urgent${index}`} className="panel-collapse collapse" role="tabpanel">
                                                        <div className="panel-body">
                                                            <div className="time-todo-range">
                                                                <span style={{ marginRight: '10px' }}>Thời gian thực hiện công việc: </span> <span style={{ marginRight: '5px' }}><i className="fa fa-clock-o" style={{ marginRight: '1px', color: "rgb(191 71 71)" }}> </i> {formatTime(obj.startDate)}</span> <span style={{ marginRight: '5px' }}>-</span> <span> <i className="fa fa-clock-o" style={{ marginRight: '4px', color: "rgb(191 71 71)" }}> </i>{formatTime(obj.endDate)}</span>
                                                            </div>
                                                            <div className="priority-task-wraper">
                                                                <span style={{ marginRight: '10px' }}>Độ ưu tiên công việc: </span>
                                                                <span style={{ color: checkPriority(obj.priority) }}>{formatPriority(obj.priority)}</span>
                                                            </div>
                                                            <div className="progress-task-wraper">
                                                                <span style={{ marginRight: '10px' }}>Tiến độ hiện tại: </span>
                                                                <div className="progress-task">
                                                                    <div className="fillmult" data-width={`${obj.progress}%`} style={{ width: `${obj.progress}%`, backgroundColor: obj.progress < 50 ? "#dc0000" : "#28a745" }}></div>
                                                                    <span className="perc">{obj.progress}%</span>
                                                                </div>
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

                    <div className="tab-pane notifi-tab-pane" id="allGeneralTaskTodo">
                        {
                            state.todoTask &&
                            <div className="faqs-page block ">
                                <div className="panel-group" id="accordion-todo" role="tablist" aria-multiselectable="true" style={{ marginBottom: 0 }}>
                                    {
                                        (state.todoTask.length !== 0) ?
                                            state.todoTask.map((obj, index) => (
                                                <div className="panel panel-default" key={index}>
                                                    <a role="button" className="item-question collapsed" data-toggle="collapse" data-parent="#accordion-todo" href={`#collapse-todo${index}`} aria-expanded="false" aria-controls={`#collapse-todo${index}`}>
                                                        <span className="index">{index + 1}</span> <span style={{ color: "#171717", }}>{obj.name}</span> <small className="label label-primary" style={{ fontSize: '9px', marginLeft: '5px', borderRadius: '.5em' }}>{obj.progress}% - {translate('task.task_dashboard.rest')} {obj.nowToEnd} {translate('task.task_dashboard.day')}</small>
                                                    </a>
                                                    <div id={`collapse-todo${index}`} className="panel-collapse collapse" role="tabpanel">
                                                        <div className="panel-body">
                                                            <div className="time-todo-range">
                                                                <span style={{ marginRight: '10px' }}>Thời gian thực hiện công việc: </span> <span style={{ marginRight: '5px' }}><i className="fa fa-clock-o" style={{ marginRight: '1px', color: "rgb(191 71 71)" }}> </i> {formatTime(obj.startDate)}</span> <span style={{ marginRight: '5px' }}>-</span> <span> <i className="fa fa-clock-o" style={{ marginRight: '4px', color: "rgb(191 71 71)" }}> </i>{formatTime(obj.endDate)}</span>
                                                            </div>

                                                            <div className="priority-task-wraper">
                                                                <span style={{ marginRight: '10px' }}>Độ ưu tiên công việc: </span>
                                                                <span style={{ color: checkPriority(obj.priority) }}>{formatPriority(obj.priority)}</span>
                                                            </div>

                                                            <div className="progress-task-wraper">
                                                                <span style={{ marginRight: '10px' }}>Tiến độ hiện tại: </span>
                                                                <div className="progress-task">
                                                                    <div className="fillmult" data-width={`${obj.progress}%`} style={{ width: `${obj.progress}%`, backgroundColor: obj.progress < 50 ? "#dc0000" : "#28a745" }}></div>
                                                                    <span className="perc">{obj.progress}%</span>
                                                                </div>
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

                    <div className="tab-pane notifi-tab-pane" id="allGeneralTaskOverdue">
                        {
                            state.overdueTask &&
                            <div className="faqs-page block ">
                                <div className="panel-group" id="accordion-overdue" role="tablist" aria-multiselectable="true" style={{ marginBottom: 0 }}>
                                    {
                                        (state.overdueTask.length !== 0) ?
                                            state.overdueTask.map((obj, index) => (
                                                <div className="panel panel-default" key={index}>
                                                    <a role="button" className="item-question collapsed" data-toggle="collapse" data-parent="#accordion-overdue" href={`#collapse-overdue${index}`} aria-expanded="true" aria-controls="collapse1a">
                                                        <span className="index">{index + 1}</span>
                                                        <span style={{ color: "#171717", }}>{obj.name}</span>
                                                        <small className="label label-danger" style={{ fontSize: '9px', marginLeft: '5px', borderRadius: '.5em' }}>{translate('task.task_dashboard.overdue')} {obj.nowToEnd} {translate('task.task_dashboard.day')}</small>
                                                    </a>
                                                    <div id={`collapse-overdue${index}`} className="panel-collapse collapse" role="tabpanel">
                                                        <div className="panel-body">
                                                            <div className="time-todo-range">
                                                                <span style={{ marginRight: '10px' }}>Thời gian thực hiện công việc: </span> <span style={{ marginRight: '5px' }}><i className="fa fa-clock-o" style={{ marginRight: '1px', color: "rgb(191 71 71)" }}> </i> {formatTime(obj.startDate)}</span> <span style={{ marginRight: '5px' }}>-</span> <span> <i className="fa fa-clock-o" style={{ marginRight: '4px', color: "rgb(191 71 71)" }}> </i>{formatTime(obj.endDate)}</span>
                                                            </div>

                                                            <div className="priority-task-wraper">
                                                                <span style={{ marginRight: '10px' }}>Độ ưu tiên công việc: </span>
                                                                <span style={{ color: checkPriority(obj.priority) }}>{formatPriority(obj.priority)}</span>
                                                            </div>

                                                            <div className="progress-task-wraper">
                                                                <span style={{ marginRight: '10px' }}>Tiến độ hiện tại: </span>
                                                                <div className="progress-task">
                                                                    <div className="fillmult" data-width={`${obj.progress}%`} style={{ width: `${obj.progress}%`, backgroundColor: obj.progress < 50 ? "#dc0000" : "#28a745" }}></div>
                                                                    <span className="perc">{obj.progress}%</span>
                                                                </div>
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

                    <div className="tab-pane notifi-tab-pane" id="allGeneralTaskDelay">
                        {
                            state.delayTask &&
                            <div className="faqs-page block ">
                                <div className="panel-group" id="accordion-delay" role="tablist" aria-multiselectable="true" style={{ marginBottom: 0 }}>
                                    {
                                        (state.delayTask.length !== 0) ?
                                            state.delayTask.map((obj, index) => (
                                                <div className="panel panel-default" key={index}>
                                                    <a role="button" className="item-question collapsed" data-toggle="collapse" data-parent="#accordion-delay" href={`#collapse-delay${index}`} aria-expanded="true" aria-controls="collapse1a">
                                                        <span className="index">{index + 1}</span> <span style={{ color: "#171717", }}>{obj.name}</span>
                                                        <small className="label" style={{ fontSize: '9px', marginLeft: '5px', borderRadius: '.5em', backgroundColor: "#db8b0b" }}>{obj.progress}% - {translate('task.task_dashboard.rest')} {obj.nowToEnd} {translate('task.task_dashboard.day')}</small>
                                                    </a>
                                                    <div id={`collapse-delay${index}`} className="panel-collapse collapse" role="tabpanel">
                                                        <div className="panel-body">
                                                            <div className="time-todo-range">
                                                                <span style={{ marginRight: '10px' }}>Thời gian thực hiện công việc: </span> <span style={{ marginRight: '5px' }}><i className="fa fa-clock-o" style={{ marginRight: '1px', color: "rgb(191 71 71)" }}> </i> {formatTime(obj.startDate)}</span> <span style={{ marginRight: '5px' }}>-</span> <span> <i className="fa fa-clock-o" style={{ marginRight: '4px', color: "rgb(191 71 71)" }}> </i>{formatTime(obj.endDate)}</span>
                                                            </div>

                                                            <div className="priority-task-wraper">
                                                                <span style={{ marginRight: '10px' }}>Độ ưu tiên công việc: </span>
                                                                <span style={{ color: checkPriority(obj.priority) }}>{formatPriority(obj.priority)}</span>
                                                            </div>

                                                            <div className="progress-task-wraper">
                                                                <span style={{ marginRight: '10px' }}>Tiến độ hiện tại: </span>
                                                                <div className="progress-task">
                                                                    <div className="fillmult" data-width={`${obj.progress}%`} style={{ width: `${obj.progress}%`, backgroundColor: obj.progress < 50 ? "#dc0000" : "#28a745" }}></div>
                                                                    <span className="perc">{obj.progress}%</span>
                                                                </div>
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

                    {/* Hạn hôm nay */}
                    <div className="tab-pane notifi-tab-pane" id="allGeneralTaskDeedlineNow">
                        {
                            state.deadlineNow &&
                            <div className="faqs-page block ">
                                <div className="panel-group" id="accordion-deadlinenow" role="tablist" aria-multiselectable="true" style={{ marginBottom: 0 }}>
                                    {
                                        (state.deadlineNow.length !== 0) ?
                                            state.deadlineNow.map((obj, index) => (
                                                <div className="panel panel-default" key={index}>
                                                    <a role="button" className="item-question collapsed" data-toggle="collapse" data-parent="#accordion-deadlinenow" href={`#collapse-deadlinenow${index}`} aria-expanded="true" aria-controls="collapse1a">
                                                        <span className="index">{index + 1}</span> <span style={{ color: "#171717", }}>{obj.name}</span>
                                                    </a>
                                                    <div id={`collapse-deadlinenow${index}`} className="panel-collapse collapse" role="tabpanel">
                                                        <div className="panel-body">
                                                            <div className="time-todo-range">
                                                                <span style={{ marginRight: '10px' }}>Thời gian thực hiện công việc: </span> <span style={{ marginRight: '5px' }}><i className="fa fa-clock-o" style={{ marginRight: '1px' }}> </i> {formatTime(obj.startDate)}</span> <span style={{ marginRight: '5px' }}>-</span> <span> <i className="fa fa-clock-o" style={{ marginRight: '1px' }}> </i>{formatTime(obj.endDate)}</span>
                                                            </div>

                                                            <div className="priority-task-wraper">
                                                                <span style={{ marginRight: '10px' }}>Độ ưu tiên công việc: </span>
                                                                <span style={{ color: checkPriority(obj.priority) }}>{formatPriority(obj.priority)}</span>
                                                            </div>

                                                            <div className="progress-task-wraper">
                                                                <span style={{ marginRight: '10px' }}>Tiến độ hiện tại: </span>
                                                                <div className="progress-task">
                                                                    <div className="fillmult" data-width={`${obj.progress}%`} style={{ width: `${obj.progress}%`, backgroundColor: obj.progress < 50 ? "#dc0000" : "#28a745" }}>
                                                                    </div>
                                                                    <span className="perc">{obj.progress}%</span>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            )) : <small style={{ color: "#696767" }}>{translate('task.task_dashboard.no_task')}</small>
                                    }
                                </div>
                            </div>
                        }
                    </div>

                    <div className="tab-pane notifi-tab-pane" id="allGeneralTaskDeedlineIncoming">
                        {
                            props.tasks && props.tasks.tasksbyuser && props.tasks.tasksbyuser.deadlineincoming &&
                            <div className="faqs-page block ">
                                <div className="panel-group" id="accordion-deadlineincoming" role="tablist" aria-multiselectable="true" style={{ marginBottom: 0 }}>
                                    {
                                        (props.tasks.tasksbyuser.deadlineincoming.length !== 0) ?
                                            props.tasks.tasksbyuser.deadlineincoming.map((obj, index) => (
                                                <div className="panel panel-default" key={index}>
                                                    <a role="button" className="item-question collapsed" data-toggle="collapse" data-parent="#accordion-deadlineincoming" href={`#collapse-deadlineincoming${index}`} aria-expanded="true" aria-controls="collapse1a">
                                                        <span className="index">{index + 1}</span> <span style={{ color: "#171717", }}>{obj.task && obj.task.name}</span>
                                                        <small className="label" style={{ fontSize: '9px', marginLeft: '5px', borderRadius: '.5em', backgroundColor: "#db8b0b" }}>{obj.task && obj.task.progress}% - {translate('task.task_dashboard.rest')} {obj.nowToEnd} {translate('task.task_dashboard.day')}</small>
                                                    </a>
                                                    <div id={`collapse-deadlineincoming${index}`} className="panel-collapse collapse" role="tabpanel">
                                                        <div className="panel-body">
                                                            <div className="time-todo-range">
                                                                <span style={{ marginRight: '10px' }}>Thời gian thực hiện công việc: </span> <span style={{ marginRight: '5px' }}><i className="fa fa-clock-o" style={{ marginRight: '1px' }}> </i> {formatTime(obj.startDate)}</span> <span style={{ marginRight: '5px' }}>-</span> <span> <i className="fa fa-clock-o" style={{ marginRight: '1px' }}> </i>{formatTime(obj.endDate)}</span>
                                                            </div>

                                                            <div className="priority-task-wraper">
                                                                <span style={{ marginRight: '10px' }}>Độ ưu tiên công việc: </span>
                                                                <span style={{ color: checkPriority(obj.task.priority) }}>{formatPriority(obj.task.priority)}</span>
                                                            </div>

                                                            <div className="progress-task-wraper">
                                                                <span style={{ marginRight: '10px' }}>Tiến độ hiện tại: </span>
                                                                <div className="progress-task">
                                                                    <div className="fillmult" data-width={`${obj.task && obj.task.progress}%`} style={{ width: `${obj.task && obj.task.progress}%`, backgroundColor: obj.task.progress < 50 ? "#dc0000" : "#28a745" }}>
                                                                    </div>
                                                                    <span className="perc">{obj.task.progress}%</span>
                                                                </div>
                                                            </div>

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
                                                    <a role="button" className="item-question collapsed" data-toggle="collapse" data-parent="#accordion-intime" href={`#collapse-intime${index}`} aria-expanded="true" aria-controls="collapse1a">
                                                        <span className="index">{index + 1}</span> <span style={{ color: "#171717", }}>{obj.name}</span>
                                                        <small className="label label-success" style={{ fontSize: '9px', marginLeft: '5px', borderRadius: '.5em' }}>{obj.progress}% - {translate('task.task_dashboard.rest')} {obj.nowToEnd} {translate('task.task_dashboard.day')}</small>
                                                    </a>
                                                    <div id={`collapse-intime${index}`} className="panel-collapse collapse" role="tabpanel">
                                                        <div className="panel-body">
                                                            <div className="time-todo-range">
                                                                <span style={{ marginRight: '10px' }}>Thời gian thực hiện công việc: </span> <span style={{ marginRight: '5px' }}><i className="fa fa-clock-o" style={{ marginRight: '1px' }}> </i> {formatTime(obj.startDate)}</span> <span style={{ marginRight: '5px' }}>-</span> <span> <i className="fa fa-clock-o" style={{ marginRight: '4px' }}> </i>{formatTime(obj.endDate)}</span>
                                                            </div>

                                                            <div className="priority-task-wraper">
                                                                <span style={{ marginRight: '10px' }}>Độ ưu tiên công việc: </span>
                                                                <span style={{ color: checkPriority(obj.priority) }}>{formatPriority(obj.priority)}</span>
                                                            </div>

                                                            <div className="progress-task-wraper">
                                                                <span style={{ marginRight: '10px' }}>Tiến độ hiện tại: </span>
                                                                <div className="progress-task">
                                                                    <div className="fillmult" data-width={`${obj.progress}%`} style={{ width: `${obj.progress}%`, backgroundColor: obj.progress < 50 ? "#dc0000" : "#28a745" }}></div>
                                                                    <span className="perc">{obj.progress}%</span>
                                                                </div>
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
            <SlimScroll verticalScroll={true} outerComponentId={"allGeneralTaskUrgent"} maxHeight={400} activate={true} />
            <SlimScroll verticalScroll={true} outerComponentId={"allGeneralTaskTodo"} maxHeight={400} activate={true} />
            <SlimScroll verticalScroll={true} outerComponentId={"allGeneralTaskOverdue"} maxHeight={400} activate={true} />
            <SlimScroll verticalScroll={true} outerComponentId={"allGeneralTaskDelay"} maxHeight={400} activate={true} />
            <SlimScroll verticalScroll={true} outerComponentId={"allGeneralTaskDeedlineNow"} maxHeight={400} activate={true} />
            <SlimScroll verticalScroll={true} outerComponentId={"allGeneralTaskDeedlineIncoming"} maxHeight={400} activate={true} />
            <SlimScroll verticalScroll={true} outerComponentId={"allGeneralTaskIntime"} maxHeight={400} activate={true} />
        </div>
    )
}

export default withTranslate(GeneralTaskPersonalChart)
