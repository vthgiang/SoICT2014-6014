import React, { useEffect, useState } from 'react'
import { withTranslate } from 'react-redux-multilingual';
import moment from 'moment';

const GeneralTaskPersonalChart = (props) => {
    const { translate } = props;
    const [state, setState] = useState({});

    const [unConfirm, showTaskUnConfirm] = useState(false);
    const [urgent, showTaskUrgent] = useState(false);
    const [todo, showTaskTodo] = useState(false);
    const [inTime, showTaskInTime] = useState(false);
    const [delay, showTaskDelay] = useState(false);
    const [overdue, showTaskOverdue] = useState(false);
    const [noneUpdate, showTaskNoneUpdate] = useState(false);


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

                if (taskOfUser[i].status === 'inprocess') {
                    // cac cong viec khan cap
                    if (taskOfUser[i].priority === 5) {
                        let add = {
                            ...taskOfUser[i],
                            createdToNow
                        }
                        urgentTask.push(add)
                    }
                    // viec 7 ngay chua update
                    if (updatedToNow >= 7) {
                        let add = {
                            ...taskOfUser[i],
                            updatedToNow
                        }
                        noneUpdateTask.push(add);
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
            }

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
        <div className="qlcv box-body" style={{ maxHeight: "350px", overflow: "auto" }}>
            <div className="col-md-4">
                {/* Công việc Khẩn cấp */}
                <div className="row" style={{ marginBottom: '15px' }}>
                    <div className="col-md-12">
                        <p data-toggle="collapse" data-target="#show-task-urgent" aria-expanded="false" style={{ display: "flex", alignItems: "center", fontWeight: "bold", cursor: "pointer" }} onClick={() => showTaskUrgent(!urgent)}>
                            <span className="material-icons" style={{ fontWeight: "bold", marginRight: '10px' }}>
                                {urgent ? `keyboard_arrow_up` : `keyboard_arrow_down`}

                            </span>
                            <span className="text-red">{`${translate('task.task_dashboard.urgent_task')} (${state.urgentTask ? state.urgentTask.length : 0})`}</span>
                        </p>
                        <div className="collapse" data-toggle="collapse " id="show-task-urgent">
                            {
                                state.urgentTask &&
                                <ul className="todo-list">
                                    {
                                        (state.urgentTask.length !== 0) ?
                                            state.urgentTask.map((item, key) =>
                                                <li key={key} style={{ border: 'none', borderBottom: '1px solid #f4f4f4' }}>
                                                    <span className="handle text"><a href={`/task?taskId=${item._id}`} target="_blank">{`${key + 1}. ${item.name}`}</a></span>
                                                    <small className="label label-danger">{item.createdToNow} {translate('task.task_dashboard.day_ago')}</small>

                                                </li>
                                            ) : <small style={{ color: "#696767" }}>{translate('task.task_dashboard.no_task')}</small>
                                    }
                                </ul>
                            }
                        </div>
                    </div>
                </div>

                {/* Công việc trễ tiến độ */}
                <div className="row" style={{ marginBottom: '15px' }}>
                    <div className="col-md-12">
                        <p data-toggle="collapse" data-target="#show-task-delay" aria-expanded="false" style={{ display: "flex", alignItems: "center", fontWeight: "bold", cursor: "pointer" }} onClick={() => showTaskDelay(!delay)}>
                            <span className="material-icons" style={{ fontWeight: "bold", marginRight: '10px' }}>
                                {delay ? `keyboard_arrow_up` : `keyboard_arrow_down`}

                            </span>
                            <span className="text-yellow">{`${translate('task.task_dashboard.delay_task')} (${state.delayTask ? state.delayTask.length : 0})`}</span>
                        </p>
                        <div className="collapse" data-toggle="collapse " id="show-task-delay">
                            {
                                state.delayTask &&
                                <ul className="todo-list">
                                    {
                                        (state.delayTask.length !== 0) ?
                                            state.delayTask.map((item, key) =>
                                                <li key={key} style={{ border: 'none', borderBottom: '1px solid #f4f4f4' }}>
                                                    <span className="handle text"><a href={`/task?taskId=${item._id}`} target="_blank">{`${key + 1}. ${item.name}`}</a></span>
                                                    <small className="label label-warning">{item.progress}% - {translate('task.task_dashboard.rest')} {item.nowToEnd} {translate('task.task_dashboard.day')}</small>
                                                </li>
                                            ) : <small style={{ color: "#696767" }}>{translate('task.task_dashboard.no_task')}</small>
                                    }
                                </ul>
                            }
                        </div>

                    </div>
                </div>

                {/* Công việc cần làm */}
                <div className="row" style={{ marginBottom: '15px' }}>
                    <div className="col-md-12">
                        <p data-toggle="collapse" data-target="#show-task-need-to-do" aria-expanded="false" style={{ display: "flex", alignItems: "center", fontWeight: "bold", cursor: "pointer" }} onClick={() => showTaskTodo(!todo)}>
                            <span className="material-icons" style={{ fontWeight: "bold", marginRight: '10px' }}>
                                {todo ? `keyboard_arrow_up` : `keyboard_arrow_down`}

                            </span>{`${translate('task.task_dashboard.to_do_task')} (${state.todoTask ? state.todoTask.length : 0})`}
                        </p>
                        <div className="collapse" data-toggle="collapse " id="show-task-need-to-do">
                            {
                                state.todoTask &&
                                <ul className="todo-list">
                                    {
                                        (state.todoTask.length !== 0) ?
                                            state.todoTask.map((item, key) =>
                                                <li key={key} style={{ border: 'none', borderBottom: '1px solid #f4f4f4' }} >
                                                    <span className="handle text"><a href={`/task?taskId=${item._id}`} target="_blank">{`${key + 1}. ${item.name}`}</a></span>
                                                    <small className="label label-primary">{item.progress}% - {translate('task.task_dashboard.rest')} {item.nowToEnd} {translate('task.task_dashboard.day')}</small>
                                                </li>
                                            ) : <small style={{ color: "#696767" }}>{translate('task.task_dashboard.no_task')}</small>
                                    }
                                </ul>
                            }
                        </div>
                    </div>
                </div>

                {/* Công việc đúng hạn */}
                <div className="row" style={{ marginBottom: '15px' }}>
                    <div className="col-md-12">
                        <p data-toggle="collapse" data-target="#show-task-intime" aria-expanded="false" style={{ display: "flex", alignItems: "center", fontWeight: "bold", cursor: "pointer" }} onClick={() => showTaskInTime(!inTime)}>
                            <span className="material-icons" style={{ fontWeight: "bold", marginRight: '10px' }}>
                                {inTime ? `keyboard_arrow_up` : `keyboard_arrow_down`}

                            </span>
                            <span className="text-green">{`${translate('task.task_dashboard.intime_task')} (${state.intimeTask ? state.intimeTask.length : 0})`}</span>
                        </p>
                        <div className="collapse" data-toggle="collapse " id="show-task-intime">
                            {
                                state.intimeTask &&
                                <ul className="todo-list">
                                    {
                                        (state.intimeTask.length !== 0) ?
                                            state.intimeTask.map((item, key) =>
                                                <li key={key} style={{ border: 'none', borderBottom: '1px solid #f4f4f4' }}>
                                                    <span className="handle text"><a href={`/task?taskId=${item._id}`} target="_blank">{`${key + 1}. ${item.name}`}</a></span>
                                                    <small className="label label-success">{item.progress}% - {translate('task.task_dashboard.rest')} {item.nowToEnd} {translate('task.task_dashboard.day')}</small>
                                                </li>
                                            ) : <small style={{ color: "#696767" }}>{translate('task.task_dashboard.no_task')}</small>
                                    }
                                </ul>
                            }
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-md-4">
                <div className="row" style={{ marginBottom: '15px' }}>
                    <div className="col-md-12">
                        <p data-toggle="collapse" aria-expanded="false" style={{ height: '21px' }} >
                        </p>
                    </div>
                </div>

                {/* Công việc quá hạn */}
                <div className="row" style={{ marginBottom: '15px' }}>
                    <div className="col-md-12">
                        <p data-toggle="collapse" data-target="#show-task-overdue" aria-expanded="false" style={{ display: "flex", alignItems: "center", fontWeight: "bold", cursor: "pointer" }} onClick={() => showTaskOverdue(!overdue)}>
                            <span className="material-icons" style={{ fontWeight: "bold", marginRight: '10px' }}>
                                {overdue ? `keyboard_arrow_up` : `keyboard_arrow_down`}

                            </span>
                            <span className="text-red">{`${translate('task.task_dashboard.overdue_task')} (${state.overdueTask ? state.overdueTask.length : 0})`}</span>
                        </p>
                        <div className="collapse" data-toggle="collapse " id="show-task-overdue">
                            {
                                state.overdueTask &&
                                <ul className="todo-list">
                                    {
                                        (state.overdueTask.length !== 0) ?
                                            state.overdueTask.map((item, key) =>
                                                <li key={key} style={{ border: 'none', borderBottom: '1px solid #f4f4f4' }}>
                                                    <span className="handle text"><a href={`/task?taskId=${item._id}`} target="_blank">{`${key + 1}. ${item.name}`}</a></span>
                                                    <small className="label label-danger">{translate('task.task_dashboard.overdue')} {item.nowToEnd} {translate('task.task_dashboard.day')}</small>
                                                </li>
                                            ) : <small style={{ color: "#696767" }}>{translate('task.task_dashboard.no_task')}</small>
                                    }
                                </ul>
                            }
                        </div>
                    </div>
                </div>

                {/* Công việc chưa xác nhận */}
                <div className="row" style={{ marginBottom: '15px' }}>
                    <div className="col-md-12">
                        <p data-toggle="collapse" data-target="#show-task-un-confirm" aria-expanded="false" style={{ display: "flex", alignItems: "center", fontWeight: "bold", cursor: "pointer" }} onClick={() => showTaskUnConfirm(!unConfirm)}>
                            <span className="material-icons" style={{ fontWeight: "bold", marginRight: '10px' }}>
                                {unConfirm ? `keyboard_arrow_up` : `keyboard_arrow_down`}

                            </span>{`${translate('task.task_dashboard.unconfirmed_task')} (${state.unconfirmedTask ? state.unconfirmedTask.length : 0})`}
                        </p>
                        <div className="collapse" data-toggle="collapse " id="show-task-un-confirm">
                            {state.unconfirmedTask &&
                                <ul className="todo-list" data-widget="todo-list">

                                    {(state.unconfirmedTask.length !== 0) ?
                                        state.unconfirmedTask.map((item, key) => (
                                            <li key={key} style={{ border: 'none', borderBottom: '1px solid #f4f4f4' }}>
                                                <span className="handle text"><a href={`/task?taskId=${item._id}`} target="_blank">{`${key + 1}. ${item.name}`}</a></span>
                                                <small className="label label-primary">{item.createdToNow} {translate('task.task_dashboard.day_ago')}</small>
                                            </li>
                                        )) : <small style={{ color: "#696767" }}>{translate('task.task_dashboard.no_task')}</small>
                                    }

                                </ul>
                            }
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-md-4">
                <div className="row" style={{ marginBottom: '15px' }}>
                    <div className="col-md-12">
                        <p data-toggle="collapse" aria-expanded="false" style={{ height: '21px' }} ></p>
                    </div>
                </div>

                <div className="row" style={{ marginBottom: '15px' }}>
                    <div className="col-md-12">
                        <p data-toggle="collapse" aria-expanded="false" style={{ height: '21px' }} ></p>
                    </div>
                </div>

                {/* Công việc chưa cập nhật */}
                <div className="row" style={{ marginBottom: '15px' }}>
                    <div className="col-md-12">
                        <p data-toggle="collapse" data-target="#show-task-none-update" aria-expanded="false" style={{ display: "flex", alignItems: "center", fontWeight: "bold", cursor: "pointer" }} onClick={() => showTaskNoneUpdate(!noneUpdate)}>
                            <span className="material-icons" style={{ fontWeight: "bold", marginRight: '10px' }}>
                                {noneUpdate ? `keyboard_arrow_up` : `keyboard_arrow_down`}

                            </span>{`${translate('task.task_dashboard.none_update_recently')} (${state.noneUpdateTask ? state.noneUpdateTask.length : 0})`}
                        </p>

                        <div className="collapse" data-toggle="collapse " id="show-task-none-update">
                            {
                                state.noneUpdateTask &&
                                <ul className="todo-list">
                                    {
                                        (state.noneUpdateTask.length !== 0) ?
                                            state.noneUpdateTask.map((item, key) =>
                                                <li key={key} style={{ border: 'none', borderBottom: '1px solid #f4f4f4' }}>
                                                    <span className="handle text"><a href={`/task?taskId=${item._id}`} target="_blank">{`${key + 1}. ${item.name}`}</a></span>
                                                    <small className="label label-primary"><i className="fa fa-clock-o" /> &nbsp;
                                                {translate('task.task_dashboard.updated')} {item.updatedToNow}
                                                        {translate('task.task_dashboard.day_ago')}</small>
                                                </li>
                                            ) : <small style={{ color: "#696767" }}>{translate('task.task_dashboard.no_task')}</small>
                                    }
                                </ul>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withTranslate(GeneralTaskPersonalChart)
