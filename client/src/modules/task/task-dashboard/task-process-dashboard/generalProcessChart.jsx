import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
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
                let created = dayjs(tasks[i].createdAt);
                let start = dayjs(tasks[i].startDate);
                let end = dayjs(tasks[i].endDate);
                let now = dayjs(new Date());
                let duration = end.diff(start, 'day');
                let createdToNow = now.diff(created, 'day');
                let nowToEnd = end.diff(now, 'day');

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
                    <li className="active"><a className="general-task-type" href="#allGeneralTaskUrgent" data-toggle="tab" ><img style={{ width: '18px', height: '18px', marginRight: '5px' }} src={urgentIcon} alt="urgent" />{`${translate('task.task_dashboard.urgent_task')}`}&nbsp;<span>{`(${state.urgentTask ? state.urgentTask.length : 0})`}</span></a></li>
                    <li><a className="general-task-type" href="#allGeneralTaskTodo" data-toggle="tab" ><img src={todoIcon} alt="todo" style={{ width: '20px', marginRight: '5px' }} />  {`${translate('task.task_dashboard.to_do_task')}`}&nbsp;<span>{`(${state.todoTask ? state.todoTask.length : 0})`}</span></a></li>
                    <li><a className="general-task-type" href="#allGeneralTaskOverdue" data-toggle="tab" >{`${translate('task.task_dashboard.overdue_task')}`}&nbsp;<span>{`(${state.overdueTask ? state.overdueTask.length : 0})`}</span></a></li>
                    <li><a className="general-task-type" href="#allGeneralTaskDelay" data-toggle="tab" >{`${translate('task.task_dashboard.delay_task')}`}&nbsp;<span>{`(${state.delayTask ? state.delayTask.length : 0})`}</span></a></li>
                    <li><a className="general-task-type" href="#allGeneralTaskDeedlineNow" data-toggle="tab" >{`Hạn hôm nay`}&nbsp;<span>{`(${state.deadlineNow ? state.deadlineNow.length : 0})`}</span></a></li>
                    <li><a className="general-task-type" href="#allGeneralTaskDeedlineIncoming" data-toggle="tab" >{`${translate('task.task_dashboard.incoming_task')}`}&nbsp;<span>{`(${state.deadlineincoming ? state.deadlineincoming.length : 0})`}</span></a></li>
                    <li><a className="general-task-type" href="#allGeneralTaskIntime" data-toggle="tab" >{`${translate('task.task_dashboard.intime_task')}`}&nbsp;<span>{`(${state.intimeTask ? state.intimeTask.length : 0})`}</span></a></li>
                </ul>

            </div>
        </div>
    )
}
function mapState(state) {
    const { project } = state;
    return { project };
}

export default connect(mapState, null)(withTranslate(GeneralTaskPersonalChart))
