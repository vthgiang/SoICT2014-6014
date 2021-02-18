import React, { useEffect, useState } from 'react'
import { withTranslate } from 'react-redux-multilingual';
import moment from 'moment';

const GeneralTaskPersonalChart = (props) => {
    const { translate } = props;
    const [state, setState] = useState({});

    useEffect(() => {
        const { tasks } = props;
        const taskOfUser = tasks?.tasks;
        // console.log("===hello props: =====", taskOfUser)

        // xu ly du lieu
        if (taskOfUser && taskOfUser.length) {
            const unconfirmedTask = [], urgentTask = [], noneUpdateTask = [],
                overdueTask = [], delayTask = [], intimeTask = [], todoTask = [];
            for (let i in taskOfUser) {
                let start = moment(taskOfUser[i].startDate);
                let end = moment(taskOfUser[i].endDate);
                let lastUpdate = moment(taskOfUser[i].updatedAt);
                let now = moment(new Date());
                let duration = end.diff(start, 'days');
                let uptonow = now.diff(lastUpdate, 'days');

                // viec 7 ngay chua update
                if (uptonow >= 7) {
                    noneUpdateTask.push(taskOfUser[i]);
                }
                if (taskOfUser[i].status === 'inprocess') {
                    if (now <= end) {
                        //viec can lam
                        todoTask.push(taskOfUser[i])
                    }
                    if (now > end) {
                        //viec Quá hạn
                        overdueTask.push(taskOfUser[i]);
                    }
                    else {
                        let processDay = Math.floor(taskOfUser[i].progress * duration / 100);
                        let startToNow = now.diff(start, 'days');

                        if (startToNow > processDay) {
                            //viec Trễ hạn
                            delayTask.push(taskOfUser[i]);
                        }
                        else if (startToNow <= processDay) {
                            //viec Đúng hạn
                            intimeTask.push(taskOfUser[i]);
                        }
                    }
                }
                // cac cong viec chua xac nhan
                if (!taskOfUser[i].confirmedByEmployees.length) {
                    unconfirmedTask.push(taskOfUser[i])
                }

                // cac cong viec khan cap
                if (taskOfUser[i].priority === 5) {
                    urgentTask.push(taskOfUser[i])
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
        <div className="qlcv box-body" style={{ height: "380px", overflow: "auto" }}>
            <h5><i class="fa fa-asterisk" style={{ fontSize: 10 }}></i> Việc chưa xác nhận</h5>
            {
                state.unconfirmedTask &&
                <ul className="todo-list">
                    {
                        (state.unconfirmedTask.length !== 0) ?
                            state.unconfirmedTask.map((item, key) =>
                                <li key={key}>
                                    <span className="handle">
                                        <i className="fa fa-ellipsis-v" />
                                        <i className="fa fa-ellipsis-v" />
                                    </span>
                                    <span className="text"><a href={`/task?taskId=${item._id}`} target="_blank">{item.name}</a></span>
                                </li>
                            ) : <small>Không có công việc nào</small>
                    }
                </ul>
            }
            <h5><i class="fa fa-asterisk" style={{ fontSize: 10 }}></i> Việc khẩn cấp</h5>
            {
                state.urgentTask &&
                <ul className="todo-list">
                    {
                        (state.urgentTask.length !== 0) ?
                            state.urgentTask.map((item, key) =>
                                <li key={key}>
                                    <span className="handle">
                                        <i className="fa fa-ellipsis-v" />
                                        <i className="fa fa-ellipsis-v" />
                                    </span>
                                    <span className="text"><a href={`/task?taskId=${item._id}`} target="_blank">{item.name}</a></span>
                                </li>
                            ) : <small>Không có công việc nào</small>
                    }
                </ul>
            }
            <h5><i class="fa fa-asterisk" style={{ fontSize: 10 }}></i> Việc cần làm</h5>
            {
                state.todoTask &&
                <ul className="todo-list">
                    {
                        (state.todoTask.length !== 0) ?
                            state.todoTask.map((item, key) =>
                                <li key={key}>
                                    <span className="handle"></span>
                                    <span className="text"><a href={`/task?taskId=${item._id}`} target="_blank">{item.name}</a></span>
                                    <span>{item.progress} - {item.updatedAt}</span>
                                </li>
                            ) : <small>Không có công việc nào</small>
                    }
                </ul>
            }
            <h5><i class="fa fa-asterisk" style={{ fontSize: 10 }}></i> Việc đúng hạn</h5>
            {
                state.intimeTask &&
                <ul className="todo-list">
                    {
                        (state.intimeTask.length !== 0) ?
                            state.intimeTask.map((item, key) =>
                                <li key={key}>
                                    <span className="handle">
                                        <i className="fa fa-ellipsis-v" />
                                        <i className="fa fa-ellipsis-v" />
                                    </span>
                                    <span className="text"><a href={`/task?taskId=${item._id}`} target="_blank">{item.name}</a></span>
                                </li>
                            ) : <small>Không có công việc nào</small>
                    }
                </ul>
            }
            <h5><i class="fa fa-asterisk" style={{ fontSize: 10 }}></i> Việc trễ hạn</h5>
            {
                state.delayTask &&
                <ul className="todo-list">
                    {
                        (state.delayTask.length !== 0) ?
                            state.delayTask.map((item, key) =>
                                <li key={key}>
                                    <span className="handle">
                                        <i className="fa fa-ellipsis-v" />
                                        <i className="fa fa-ellipsis-v" />
                                    </span>
                                    <span className="text"><a href={`/task?taskId=${item._id}`} target="_blank">{item.name}</a></span>
                                </li>
                            ) : <small>Không có công việc nào</small>
                    }
                </ul>
            }
            <h5><i class="fa fa-asterisk" style={{ fontSize: 10 }}></i> Việc quá hạn</h5>
            {
                state.overdueTask &&
                <ul className="todo-list">
                    {
                        (state.overdueTask.length !== 0) ?
                            state.overdueTask.map((item, key) =>
                                <li key={key}>
                                    <span className="handle">
                                        <i className="fa fa-ellipsis-v" />
                                        <i className="fa fa-ellipsis-v" />
                                    </span>
                                    <span className="text"><a href={`/task?taskId=${item._id}`} target="_blank">{item.name}</a></span>
                                </li>
                            ) : <small>Không có công việc nào</small>
                    }
                </ul>
            }
            <h5><i class="fa fa-asterisk" style={{ fontSize: 10 }}></i> Việc chưa update</h5>
            {
                state.noneUpdateTask &&
                <ul className="todo-list">
                    {
                        (state.noneUpdateTask.length !== 0) ?
                            state.noneUpdateTask.map((item, key) =>
                                <li key={key}>
                                    <span className="handle">
                                        <i className="fa fa-ellipsis-v" />
                                        <i className="fa fa-ellipsis-v" />
                                    </span>
                                    <span className="text"><a href={`/task?taskId=${item._id}`} target="_blank">{item.name}</a></span>
                                </li>
                            ) : <small>Không có công việc nào</small>
                    }
                </ul>
            }

        </div>
    )
}

export default withTranslate(GeneralTaskPersonalChart)
