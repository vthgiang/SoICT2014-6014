import React, { useEffect, useState } from 'react'
import { withTranslate } from 'react-redux-multilingual';
import moment from 'moment';

const GeneralTaskPersonalChart = (props) => {
    const { translate } = props;
    const [state, setState] = useState({});
    const now = moment
    useEffect(() => {
        const { tasks } = props;
        const taskOfUser = tasks?.tasks;

        // xu ly du lieu
        if (taskOfUser && taskOfUser.length) {
            const unconfirmedTask = [], urgentTask = [], noneUpdateTask = [],
                overdueTask = [], delayTask = [], intimeTask = [], todoTask = [];
            for (let i in taskOfUser) {
                let created = moment(taskOfUser[i].createdAt);
                let start = moment(taskOfUser[i].startDate);
                let end = moment(taskOfUser[i].endDate);
                let lastUpdate = moment(taskOfUser[i].updatedAt);
                let now = moment(new Date());
                let duration = end.diff(start, 'days');
                let updatedToNow = now.diff(lastUpdate, 'days');
                let createdToNow = now.diff(created, 'days');
                let nowToEnd = end.diff(now, 'days');

                // viec 7 {translate('task.task_dashboard.day')} chua update
                if (updatedToNow >= 7) {
                    let add = {
                        ...taskOfUser[i],
                        updatedToNow
                    }
                    noneUpdateTask.push(add);
                }

                if (taskOfUser[i].status === 'inprocess') {
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
                            //viec Trễ hạn
                            let add = {
                                ...taskOfUser[i],
                                nowToEnd
                            }
                            delayTask.push(add);
                        }
                        else if (startToNow <= processDay) {
                            //viec Đúng hạn
                            let add = {
                                ...taskOfUser[i],
                                nowToEnd
                            }
                            intimeTask.push(add);
                        }
                    }
                }
                // cac cong viec chua xac nhan
                if (!taskOfUser[i].confirmedByEmployees.length) {
                    let add = {
                        ...taskOfUser[i],
                        createdToNow
                    }
                    unconfirmedTask.push(add)
                }

                // cac cong viec khan cap
                if (taskOfUser[i].priority === 5) {
                    let add = {
                        ...taskOfUser[i],
                        createdToNow
                    }
                    urgentTask.push(add)
                }

            }
            console.log("===", urgentTask);
            setState({
                ...state,
                unconfirmedTask,
                urgentTask,
                todoTask,
                intimeTask,
                delayTask,
                overdueTask,
                noneUpdateTask
            })
        }

    }, [props])

    return (
        <div className="qlcv box-body" style={{ height: "380px", overflow: "auto" }}>
            {/* Công việc chưa xác nhận */}
            <strong><i class="fa fa-asterisk" style={{ fontSize: '80%' }}></i> {`${translate('task.task_dashboard.unconfirmed_task')} (${state.unconfirmedTask?.length})`}</strong>
            {
                state.unconfirmedTask &&
                <ul className="todo-list">
                    {
                        (state.unconfirmedTask.length !== 0) ?
                            state.unconfirmedTask.map((item, key) =>
                                <li key={key}>
                                    <span className="handle">
                                        <i className="fa fa-circle" style={{ fontSize: '60%' }} />
                                    </span>
                                    <span className="handle text"><a href={`/task?taskId=${item._id}`} target="_blank">{item.name}</a></span>
                                    <small className="label label-warning">{item.createdToNow} {translate('task.task_dashboard.day_ago')}</small>
                                </li>
                            ) : <small>{translate('task.task_dashboard.no_task')}</small>
                    }
                </ul>
            }
            {/* Công việc khẩn cấp */}
            <strong><i class="fa fa-asterisk" style={{ fontSize: '80%' }}></i> {`${translate('task.task_dashboard.urgent_task')} (${state.urgentTask?.length})`}</strong>
            {
                state.urgentTask &&
                <ul className="todo-list">
                    {
                        (state.urgentTask.length !== 0) ?
                            state.urgentTask.map((item, key) =>
                                <li key={key}>
                                    <span className="handle">
                                        <i className="fa fa-circle" style={{ fontSize: '60%' }} />
                                    </span>
                                    <span className="handle text"><a href={`/task?taskId=${item._id}`} target="_blank">{item.name}</a></span>
                                    <small className="label label-danger">{item.createdToNow} {translate('task.task_dashboard.day_ago')}</small>

                                </li>
                            ) : <small>{translate('task.task_dashboard.no_task')}</small>
                    }
                </ul>
            }
            {/* Công việc cần làm */}
            <strong><i class="fa fa-asterisk" style={{ fontSize: '80%' }}></i> {`${translate('task.task_dashboard.to_do_task')} (${state.todoTask?.length})`}</strong>
            {
                state.todoTask &&
                <ul className="todo-list">
                    {
                        (state.todoTask.length !== 0) ?
                            state.todoTask.map((item, key) =>
                                <li key={key}>
                                    <span className="handle">
                                        <i className="fa fa-circle" style={{ fontSize: '60%' }} />
                                    </span>
                                    <span className="handle text"><a href={`/task?taskId=${item._id}`} target="_blank">{item.name}</a></span>
                                    <small className="label label-primary">{item.progress}% - {translate('task.task_dashboard.rest')} {item.nowToEnd} {translate('task.task_dashboard.day')}</small>
                                </li>
                            ) : <small>{translate('task.task_dashboard.no_task')}</small>
                    }
                </ul>
            }
            {/* Công việc đúng hạn */}
            <strong><i class="fa fa-asterisk" style={{ fontSize: '80%' }}></i> {`${translate('task.task_dashboard.intime_task')} (${state.intimeTask?.length})`}</strong>
            {
                state.intimeTask &&
                <ul className="todo-list">
                    {
                        (state.intimeTask.length !== 0) ?
                            state.intimeTask.map((item, key) =>
                                <li key={key}>
                                    <span className="handle">
                                        <i className="fa fa-circle" style={{ fontSize: '60%' }} />
                                    </span>
                                    <span className="handle text"><a href={`/task?taskId=${item._id}`} target="_blank">{item.name}</a></span>
                                    <small className="label label-success">{item.progress}% - {translate('task.task_dashboard.rest')} {item.nowToEnd} {translate('task.task_dashboard.day')}</small>
                                </li>
                            ) : <small>{translate('task.task_dashboard.no_task')}</small>
                    }
                </ul>
            }
            {/* Công việc trễ tiến độ */}
            <strong><i class="fa fa-asterisk" style={{ fontSize: '80%' }}></i> {`${translate('task.task_dashboard.delay_task')} (${state.delayTask?.length})`}</strong>
            {
                state.delayTask &&
                <ul className="todo-list">
                    {
                        (state.delayTask.length !== 0) ?
                            state.delayTask.map((item, key) =>
                                <li key={key}>
                                    <span className="handle">
                                        <i className="fa fa-circle" style={{ fontSize: '60%' }} />
                                    </span>
                                    <span className="handle text"><a href={`/task?taskId=${item._id}`} target="_blank">{item.name}</a></span>
                                    <small className="label label-warning">{item.progress}% - {translate('task.task_dashboard.rest')} {item.nowToEnd} {translate('task.task_dashboard.day')}</small>
                                </li>
                            ) : <small>{translate('task.task_dashboard.no_task')}</small>
                    }
                </ul>
            }
            {/* Công việc quá hạn */}
            <strong><i class="fa fa-asterisk" style={{ fontSize: '80%' }}></i> {`${translate('task.task_dashboard.overdue_task')} (${state.overdueTask?.length})`}</strong>
            {
                state.overdueTask &&
                <ul className="todo-list">
                    {
                        (state.overdueTask.length !== 0) ?
                            state.overdueTask.map((item, key) =>
                                <li key={key}>
                                    <span className="handle">
                                        <i className="fa fa-circle" style={{ fontSize: '60%' }} />
                                    </span>
                                    <span className="handle text"><a href={`/task?taskId=${item._id}`} target="_blank">{item.name}</a></span>
                                    <small className="label label-danger">{translate('task.task_dashboard.overdue')} {item.nowToEnd} {translate('task.task_dashboard.day')}</small>
                                </li>
                            ) : <small>{translate('task.task_dashboard.no_task')}</small>
                    }
                </ul>
            }
            {/* Công việc chưa cập nhật trong tuần qua */}
            <strong><i class="fa fa-asterisk" style={{ fontSize: '80%' }}></i> {`${translate('task.task_dashboard.none_update_recently')} (${state.noneUpdateTask?.length})`}</strong>
            {
                state.noneUpdateTask &&
                <ul className="todo-list">
                    {
                        (state.noneUpdateTask.length !== 0) ?
                            state.noneUpdateTask.map((item, key) =>
                                <li key={key}>
                                    <span className="handle">
                                        <i className="fa fa-circle" style={{ fontSize: '60%' }} />
                                    </span>
                                    <span className="handle text"><a href={`/task?taskId=${item._id}`} target="_blank">{item.name}</a></span>
                                    <small className="label label-warning"><i className="fa fa-clock-o" /> &nbsp;
                                    {translate('task.task_dashboard.updated')} {item.updatedToNow}
                                        {translate('task.task_dashboard.day_ago')}</small>
                                </li>
                            ) : <small>{translate('task.task_dashboard.no_task')}</small>
                    }
                </ul>
            }

        </div>
    )
}

export default withTranslate(GeneralTaskPersonalChart)
