import React, { useEffect, useState } from 'react'
import { withTranslate } from 'react-redux-multilingual';
import moment from 'moment';
import Swal from 'sweetalert2';
import useDeepCompareEffect from 'use-deep-compare-effect'

const GeneralTaskPersonalChart = (props) => {
    const { translate } = props;
    const [state, setState] = useState({
        userId: localStorage.getItem("userId")
    });

    const [unConfirm, showTaskUnConfirm] = useState(false);
    const [urgent, showTaskUrgent] = useState(false);
    const [todo, showTaskTodo] = useState(false);
    const [inTime, showTaskInTime] = useState(false);
    const [delay, showTaskDelay] = useState(false);
    const [overdue, showTaskOverdue] = useState(false);
    const [noneUpdate, showTaskNoneUpdate] = useState(false);
    const [notLinkKpi, showTaskNotLinkKpi] = useState(false);
    const [taskHasActionsResponsible, showTaskHasActionsResponsible] = useState(false);
    const [taskHasActionsAccountable, showTaskHasActionsAccountable] = useState(false);
    const [taskHasNotEvaluationResult, showTaskHasNotEvaluationResult] = useState(false);
    const [deadlineComming, showTaskDeadLine] = useState(false);


    useDeepCompareEffect(() => {
        console.count()
        const { tasks } = props;
        const { userId } = state;
        let currentMonth = new Date().getMonth() + 1;
        let currentYear = new Date().getFullYear();
        let notLinkedTasks = [], taskList = [], unconfirmedTask = [], urgentTask = [], noneUpdateTask = [],
            overdueTask = [], delayTask = [], intimeTask = [], todoTask = [], taskHasActionsResponsible = [], taskHasActionsAccountable = [], taskHasNotEvaluationResultIncurrentMonth = [];
        const taskOfUser = tasks?.tasks;

        // xu ly du lieu
        if (taskOfUser && taskOfUser.length) {
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
        }

        if (tasks) {
            let accTasks = tasks.accountableTasks;
            let resTasks = tasks.responsibleTasks;
            let conTasks = tasks.consultedTasks;

            if (accTasks && accTasks.length > 0)
                accTasks = accTasks.filter(task => task.status === "inprocess");
            if (resTasks && resTasks.length > 0)
                resTasks = resTasks.filter(task => task.status === "inprocess");
            if (conTasks && conTasks.length > 0)
                conTasks = conTasks.filter(task => task.status === "inprocess");

            // tính toán lấy số công việc chưa được đánh giá kpi
            if (accTasks && resTasks && conTasks) {
                taskList = [...accTasks, ...resTasks, ...conTasks];

                if (taskList && taskList.length > 0) {
                    let distinctTasks = [];
                    for (let i in taskList) {
                        let check = false;
                        for (let j in distinctTasks) {

                            if (taskList[i]._id === distinctTasks[j]._id) {
                                check = true
                                break;
                            }
                        }
                        if (!check) distinctTasks.push(taskList[i])
                    }

                    distinctTasks.length && distinctTasks.map(x => {
                        let evaluations;
                        let currentEvaluate = [];

                        evaluations = x.evaluations.length && x.evaluations;
                        for (let i in evaluations) {
                            let month = evaluations[i] && evaluations[i].evaluatingMonth && evaluations[i].evaluatingMonth.slice(5, 7);
                            let year = evaluations[i] && evaluations[i].evaluatingMonth && evaluations[i].evaluatingMonth.slice(0, 4);
                            if (month == currentMonth && year == currentYear) {
                                currentEvaluate.push(evaluations[i]);
                            }
                        }
                        if (currentEvaluate.length === 0) notLinkedTasks.push(x);

                        else {
                            let break1 = false;
                            let add = true;
                            if (currentEvaluate.length !== 0)
                                for (let i in currentEvaluate) {
                                    if (currentEvaluate[i].results.length !== 0) {
                                        for (let j in currentEvaluate[i].results) {
                                            let res = currentEvaluate[i].results[j];

                                            if (res.employee === userId) {
                                                add = false;
                                                if (res.kpis.length === 0) {
                                                    notLinkedTasks.push(x);
                                                    break1 = true
                                                }
                                            };
                                            if (break1) break;
                                        }
                                        if (break1) break;
                                        if (add) notLinkedTasks.push(x);
                                    }
                                }
                        }
                    })

                    // Lấy các công việc chưa có kết quả đánh giá ở tháng hiện tại
                    distinctTasks.length && distinctTasks.forEach((o, index) => {
                        if (o.evaluations && o.evaluations.length > 0) {
                            let lengthEvaluations = o.evaluations.length;
                            let add = true;
                            for (let i = 0; i <= lengthEvaluations; i++) {
                                let currentEvaluationsMonth = o.evaluations[i] && o.evaluations[i].evaluatingMonth && o.evaluations[i].evaluatingMonth.slice(5, 7);
                                let currentEvaluationsYear = o.evaluations[i] && o.evaluations[i].evaluatingMonth && o.evaluations[i].evaluatingMonth.slice(0, 4);

                                if (parseInt(currentEvaluationsMonth) === currentMonth && parseInt(currentEvaluationsYear) === currentYear) {
                                    add = false;
                                }
                            }
                            if (add)
                                taskHasNotEvaluationResultIncurrentMonth.push(o);
                        } else {
                            taskHasNotEvaluationResultIncurrentMonth.push(o);
                        }
                    })
                }
            }

            // Tính toán lấy số công việc chưa được đánh gia
            if (resTasks?.length > 0) {
                resTasks.forEach(x => {
                    let taskActions;

                    taskActions = x.taskActions.length && x.taskActions;
                    for (let i in taskActions) {
                        let month = taskActions[i].createdAt.slice(5, 7);
                        let year = taskActions[i].createdAt.slice(0, 4)
                        if (month == currentMonth && year == currentYear) {
                            if (taskActions[i].rating == -1) {
                                taskHasActionsResponsible.push(x);
                                break;
                            }
                        }
                    }
                })
            }

            // Tính toán lấy số công việc cần đánh giá
            if (accTasks?.length > 0) {
                accTasks.forEach(x => {
                    let taskActions;

                    taskActions = x.taskActions.length && x.taskActions;
                    for (let i in taskActions) {
                        let month = taskActions[i].createdAt.slice(5, 7);
                        let year = taskActions[i].createdAt.slice(0, 4)
                        if (month == currentMonth && year == currentYear) {
                            if (taskActions[i].rating == -1) {
                                taskHasActionsAccountable.push(x);
                                break;
                            }
                        }
                    }
                })
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
            noneUpdateTask,
            notLinkedTasks,
            taskHasActionsResponsible,
            taskHasActionsAccountable,
            currentMonth,
            currentYear,
            taskHasNotEvaluationResultIncurrentMonth,
        })


    }, [props.tasks.tasks, props.tasks.accountableTasks, props.tasks.responsibleTasks, props.tasks.consultedTasks])

    const showTaskUrgentDescription = () => {
        Swal.fire({
            html: `<h4><div>Công việc bạn tham gia với 1 trong 4 tư cách:  thực hiện, phê duyệt, tư vấn, quan sát và được xem là khẩn cấp nếu: ?</div> </h4>
            <table class="table" style=" margin-bottom: 0 ">
                <tbody style="text-align: left;font-size: 13px;">
                    <tr>
                        <th class="not-sort" style="width: 100px">Độ ưu tiên công việc</th>
                        <th class="not-sort" style="width: 43px">Quá hạn</th>
                        <th class="not-sort" style="width: 61px">Chậm tiến độ</th>
                    </tr>
                    <tr>
                        <td>Cv độ ưu tiên thấp</td>
                        <td>> 25 %</td>
                        <td>>= 50 %</td>
                    </tr>
                    <tr>
                        <td>Cv độ ưu tiên trung bình</td>
                        <td>> 20 %</td>
                        <td>>= 40 %</td>
                    </tr>
                    <tr>
                        <td>Cv độ ưu tiên tiêu chuẩn</td>
                        <td>> 15 % </td>
                        <td>>= 30 %</td>
                    </tr>
                    <tr>
                        <td>Cv độ ưu tiên cao</td>
                        <td>> 10 % </td>
                        <td>>= 20 %</td>
                    </tr>
                    <tr>
                        <td>Cv độ ưu tiên khẩn cấp</td>
                        <td>> 5 %</td>
                        <td>>= 10 %</td>
                    </tr>
                </tbody>
            </table>`,
            width: "40%",
        })
    }

    const showTaskOverDueDescription = () => {
        Swal.fire({
            html: `<h4><div>Công việc bạn tham gia với 1 trong 4 tư cách:  thực hiện, phê duyệt, tư vấn, quan sát và được xem là quá hạn nếu đã hết hạn thực hiện công việc nhưng vẫn chưa hoàn thành ?</div> </h4>`
        })
    }

    const showTaskDelayDescription = () => {
        Swal.fire({
            html: `<h4><div>Công việc bạn tham gia với 1 trong 4 tư cách thực hiện, phê duyệt, tư vấn, quan sát vẫn chưa đến hạn kết thúc nhưng % hoàn thành đang nhỏ hơn  % hoàn thành cần đạt tính đến ngày hiện tại</div></h4>`
        })
    }

    const showTaskNeedToDoDescription = () => {
        Swal.fire({
            html: `<h4><div>Công việc đang thực hiện bạn tham gia với 1 trong 4 tư cách: thực hiện, phê duyệt, tư vấn, quan sát và được xem là cần làm nếu: ?</div> </h4>
            <table class="table" style=" margin-bottom: 0 ">
                <tbody style="text-align: left;font-size: 13px;">
                    <tr>
                        <th class="not-sort" style="width: 100px">Độ ưu tiên công việc</th>
                        <th class="not-sort" style="width: 43px">Quá hạn</th>
                        <th class="not-sort" style="width: 61px">Chậm tiến độ</th>
                    </tr>
                    <tr>
                        <td>Cv độ ưu tiên thấp</td>
                        <td><= 25%</td>
                        <td>40% < x < 50%</td>
                    </tr>
                    <tr>
                        <td>Cv độ ưu tiên trung bình</td>
                        <td><= 20%</td>
                        <td>30% < x < 40%</td>
                    </tr>
                    <tr>
                        <td>Cv độ ưu tiên tiêu chuẩn</td>
                        <td><= 15%</td>
                        <td>20% < x < 30%</td>
                    </tr>
                    <tr>
                        <td>Cv độ ưu tiên cao</td>
                        <td><= 10%</td>
                        <td>10% < x < 20%</td>
                    </tr>
                    <tr>
                        <td>Cv độ ưu tiên khẩn cấp</td>
                        <td><= 5%</td>
                        <td>0% < x < 10%</td>
                    </tr>
                </tbody>
            </table>`,
            width: "40%",
        })
    }


    const showTaskUnConfirmDescription = () => {
        Swal.fire({
            html: `<h4><div>Công việc bạn tham gia với 1 trong 4 tư cách: thực hiện, phê duyệt, tư vấn, quan sát nhưng bạn chưa xác nhận tham gia công việc</div></h4>`
        })
    }

    const showTaskNoneUpdateDescription = () => {
        Swal.fire({
            html: `<h4><div>Công việc bạn tham gia với 1 trong 4 tư cách thực hiện, phê duyệt, tư vấn, quan sát đã 7 ngày chưa có cập nhật thông tin gì
            </div></h4>`
        })
    }

    const showTaskIntimeDescription = () => {
        Swal.fire({
            html: `<h4><div>Công việc bạn tham gia với 1 trong 4 tư cách thực hiện, phê duyệt, tư vấn, quan sát vẫn chưa đến hạn kết thúc và % hoàn thành đang bằng hoặc hơn  % hoàn thành cần đạt tính đến ngày hiện tại
            </div></h4>`
        })
    }

    const showTaskDeadLineDescription = () => {
        Swal.fire({
            html: `<h4<div>Công việc còn nhiều nhất 7 ngày nữa là đến hạn</div></h4>`
        })
    }

    const showTaskHasActionResDescription = () => {
        Swal.fire({
            html: `<h4><div>Các công việc (bạn là người thực hiện) mà hoạt động của bạn chưa được người phê duyệt công việc đánh giá
            </div></h4>`
        })
    }

    const showTaskHasActionAccDescription = () => {
        Swal.fire({
            html: `<h4><div>Các công việc (bạn là người phê duyệt) có hoạt động mà bạn chưa đánh giá
            </div></h4>`
        })
    }

    const showTaskNotLinkKpiDescription = (month, year) => {
        Swal.fire({
            html: `<h4><div>Công việc bạn tham gia với 1 trong 3 tư cách thực hiện, phê duyệt, tư vấn và bạn chưa liên kết công việc đến KPI tháng hiện tại (tháng ${month}-${year})
            </div></h4>`
        })
    }

    const showTaskHasNotEvaluationResultDescription = (month, year) => {
        Swal.fire({
            html: `<h4><div>Công việc bạn tham gia với 1 trong 3 tư cách thực hiện, phê duyệt, tư vấn và công việc chưa có đánh giá kết quả thực hiện cho tháng hiện tại (tháng ${month}-${year})
            </div></h4>`
        })
    }


    return (
        <div className="qlcv box-body" style={{ maxHeight: "350px", overflow: "auto" }}>
            <div className="col-md-4">
                {/* Công việc Khẩn cấp */}
                <div className="row" style={{ marginBottom: '15px' }}>
                    <div className="col-md-12">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <p data-toggle="collapse" data-target="#show-task-urgent" aria-expanded="false" style={{ display: "flex", alignItems: "center", fontWeight: "bold", cursor: "pointer" }} onClick={() => showTaskUrgent(!urgent)}>
                                <span className="material-icons" style={{ fontWeight: "bold", marginRight: '10px' }}>
                                    {urgent ? `keyboard_arrow_up` : `keyboard_arrow_down`}
                                </span>
                                <span className="text-red">{`${translate('task.task_dashboard.urgent_task')} (${state.urgentTask ? state.urgentTask.length : 0})`}</span>
                            </p>
                            {/* chú thích  công việc khẩn cấp */}
                            <p className="text-red" title={translate('task.task_management.explain')} onClick={showTaskUrgentDescription}>
                                <i className="fa fa-exclamation-circle" style={{ color: '#06c', marginLeft: '5px', fontSize: '14px', cursor: 'pointer' }} />
                            </p>
                        </div>
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

                {/* Công việc quá hạn */}
                <div className="row" style={{ marginBottom: '15px' }}>
                    <div className="col-md-12">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <p data-toggle="collapse" data-target="#show-task-overdue" aria-expanded="false" style={{ display: "flex", alignItems: "center", fontWeight: "bold", cursor: "pointer" }} onClick={() => showTaskOverdue(!overdue)}>
                                <span className="material-icons" style={{ fontWeight: "bold", marginRight: '10px' }}>
                                    {overdue ? `keyboard_arrow_up` : `keyboard_arrow_down`}

                                </span>
                                <span className="text-red">{`${translate('task.task_dashboard.overdue_task')} (${state.overdueTask ? state.overdueTask.length : 0})`}</span>
                            </p>
                            {/* chú thích  công việc quá hạn */}
                            <p className="text-red" title={translate('task.task_management.explain')} onClick={showTaskOverDueDescription}>
                                <i className="fa fa-exclamation-circle" style={{ color: '#06c', marginLeft: '5px', fontSize: '14px', cursor: 'pointer' }} />
                            </p>
                        </div>

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

                {/* Công việc trễ tiến độ */}
                <div className="row" style={{ marginBottom: '15px' }}>
                    <div className="col-md-12">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <p data-toggle="collapse" data-target="#show-task-delay" aria-expanded="false" style={{ display: "flex", alignItems: "center", fontWeight: "bold", cursor: "pointer" }} onClick={() => showTaskDelay(!delay)}>
                                <span className="material-icons" style={{ fontWeight: "bold", marginRight: '10px' }}>
                                    {delay ? `keyboard_arrow_up` : `keyboard_arrow_down`}

                                </span>
                                <span className="text-yellow">{`${translate('task.task_dashboard.delay_task')} (${state.delayTask ? state.delayTask.length : 0})`}</span>
                            </p>

                            {/* chú thích  công việc trễ tiến độ */}
                            <p className="text-red" title={translate('task.task_management.explain')} onClick={showTaskDelayDescription}>
                                <i className="fa fa-exclamation-circle" style={{ color: '#06c', marginLeft: '5px', fontSize: '14px', cursor: 'pointer' }} />
                            </p>
                        </div>

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
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <p data-toggle="collapse" data-target="#show-task-need-to-do" aria-expanded="false" style={{ display: "flex", alignItems: "center", fontWeight: "bold", cursor: "pointer" }} onClick={() => showTaskTodo(!todo)}>
                                <span className="material-icons" style={{ fontWeight: "bold", marginRight: '10px' }}>
                                    {todo ? `keyboard_arrow_up` : `keyboard_arrow_down`}

                                </span>{`${translate('task.task_dashboard.to_do_task')} (${state.todoTask ? state.todoTask.length : 0})`}
                            </p>
                            {/* chú thích  công việc cần làm */}
                            <p className="text-red" title={translate('task.task_management.explain')} onClick={showTaskNeedToDoDescription}>
                                <i className="fa fa-exclamation-circle" style={{ color: '#06c', marginLeft: '5px', fontSize: '14px', cursor: 'pointer' }} />
                            </p>
                        </div>

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

            </div>

            <div className="col-md-4">
                {/* Công việc chưa xác nhận */}
                <div className="row" style={{ marginBottom: '15px' }}>
                    <div className="col-md-12">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <p data-toggle="collapse" data-target="#show-task-un-confirm" aria-expanded="false" style={{ display: "flex", alignItems: "center", fontWeight: "bold", cursor: "pointer" }} onClick={() => showTaskUnConfirm(!unConfirm)}>
                                <span className="material-icons" style={{ fontWeight: "bold", marginRight: '10px' }}>
                                    {unConfirm ? `keyboard_arrow_up` : `keyboard_arrow_down`}

                                </span>{`${translate('task.task_dashboard.unconfirmed_task')} (${state.unconfirmedTask ? state.unconfirmedTask.length : 0})`}
                            </p>

                            {/* chú thích  công việc chưa xác nhận */}
                            <p className="text-red" title={translate('task.task_management.explain')} onClick={showTaskUnConfirmDescription}>
                                <i className="fa fa-exclamation-circle" style={{ color: '#06c', marginLeft: '5px', fontSize: '14px', cursor: 'pointer' }} />
                            </p>
                        </div>

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

                {/* Công việc chưa cập nhật */}
                <div className="row" style={{ marginBottom: '15px' }}>
                    <div className="col-md-12">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <p data-toggle="collapse" data-target="#show-task-none-update" aria-expanded="false" style={{ display: "flex", alignItems: "center", fontWeight: "bold", cursor: "pointer" }} onClick={() => showTaskNoneUpdate(!noneUpdate)}>
                                <span className="material-icons" style={{ fontWeight: "bold", marginRight: '10px' }}>
                                    {noneUpdate ? `keyboard_arrow_up` : `keyboard_arrow_down`}

                                </span>{`${translate('task.task_dashboard.none_update_recently')} (${state.noneUpdateTask ? state.noneUpdateTask.length : 0})`}
                            </p>

                            {/* chú thích  công việc chưa cập nhật */}
                            <p className="text-red" title={translate('task.task_management.explain')} onClick={showTaskNoneUpdateDescription}>
                                <i className="fa fa-exclamation-circle" style={{ color: '#06c', marginLeft: '5px', fontSize: '14px', cursor: 'pointer' }} />
                            </p>
                        </div>


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

                {/* Công việc đúng hạn */}
                <div className="row" style={{ marginBottom: '15px' }}>
                    <div className="col-md-12">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <p data-toggle="collapse" data-target="#show-task-intime" aria-expanded="false" style={{ display: "flex", alignItems: "center", fontWeight: "bold", cursor: "pointer" }} onClick={() => showTaskInTime(!inTime)}>
                                <span className="material-icons" style={{ fontWeight: "bold", marginRight: '10px' }}>
                                    {inTime ? `keyboard_arrow_up` : `keyboard_arrow_down`}

                                </span>
                                <span className="text-green">{`${translate('task.task_dashboard.intime_task')} (${state.intimeTask ? state.intimeTask.length : 0})`}</span>
                            </p>
                            {/* chú thích  công việc đúng hạn */}
                            <p className="text-red" title={translate('task.task_management.explain')} onClick={showTaskIntimeDescription}>
                                <i className="fa fa-exclamation-circle" style={{ color: '#06c', marginLeft: '5px', fontSize: '14px', cursor: 'pointer' }} />
                            </p>
                        </div>

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

                {/* Công việc sắp hết hạn */}
                <div className="row" style={{ marginBottom: '15px' }}>
                    <div className="col-md-12">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <p data-toggle="collapse" data-target="#show-task-deadline-comming" aria-expanded="false" style={{ display: "flex", alignItems: "center", fontWeight: "bold", cursor: "pointer" }} onClick={() => showTaskDeadLine(!deadlineComming)}>
                                <span className="material-icons" style={{ fontWeight: "bold", marginRight: '10px' }}>
                                    {deadlineComming ? `keyboard_arrow_up` : `keyboard_arrow_down`}

                                </span>
                                <span className="text-yellow">{`${translate('task.task_dashboard.incoming_task')} (${(props.tasks && props.tasks.tasksbyuser && props.tasks.tasksbyuser.deadlineincoming) ? props.tasks.tasksbyuser.deadlineincoming.length : 0})`}</span>
                            </p>
                            {/* chú thích  công việc đúng hạn */}
                            <p className="text-red" title={translate('task.task_management.explain')} onClick={showTaskDeadLineDescription}>
                                <i className="fa fa-exclamation-circle" style={{ color: '#06c', marginLeft: '5px', fontSize: '14px', cursor: 'pointer' }} />
                            </p>
                        </div>

                        <div className="collapse" data-toggle="collapse " id="show-task-deadline-comming">
                            {
                                props.tasks && props.tasks.tasksbyuser && props.tasks.tasksbyuser.deadlineincoming &&
                                <ul className="todo-list">
                                    {
                                        (props.tasks.tasksbyuser.deadlineincoming.length > 0) ?
                                            props.tasks.tasksbyuser.deadlineincoming.map((item, key) =>
                                                <li key={key} style={{ border: 'none', borderBottom: '1px solid #f4f4f4' }}>
                                                    <span className="handle text"><a href={`/task?taskId=${item._id}`} target="_blank">{`${key + 1}. ${item.task && item.task.name}`}</a></span>
                                                    <small className="label label-warning"><i className="fa fa-clock-o" /> &nbsp;{item.totalDays} {translate('task.task_management.calc_days')}</small>
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
                {/* Công việc có hoạt động chưa được đánh giá */}
                <div className="row" style={{ marginBottom: '15px' }}>
                    <div className="col-md-12">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <p data-toggle="collapse" data-target="#show-task-has-action-res" aria-expanded="false" style={{ display: "flex", alignItems: "center", fontWeight: "bold", cursor: "pointer" }} onClick={() => showTaskHasActionsResponsible(!taskHasActionsResponsible)}>
                                <span className="material-icons" style={{ fontWeight: "bold", marginRight: '10px' }}>
                                    {taskHasActionsResponsible ? `keyboard_arrow_up` : `keyboard_arrow_down`}

                                </span>{`Công việc có hoạt động chưa được đánh giá (${state.taskHasActionsResponsible ? state.taskHasActionsResponsible.length : 0})`}
                            </p>
                            {/* chú thích Công việc có hoạt động chưa được đánh giá  */}
                            <p className="text-red" title={translate('task.task_management.explain')} onClick={showTaskHasActionResDescription}>
                                <i className="fa fa-exclamation-circle" style={{ color: '#06c', marginLeft: '5px', fontSize: '14px', cursor: 'pointer' }} />
                            </p>
                        </div>

                        <div className="collapse" data-toggle="collapse " id="show-task-has-action-res">
                            {
                                state.taskHasActionsResponsible &&
                                <ul className="todo-list">
                                    {
                                        (state.taskHasActionsResponsible.length !== 0) ?
                                            state.taskHasActionsResponsible.map((item, key) =>
                                                <li key={key} style={{ border: 'none', borderBottom: '1px solid #f4f4f4' }}>
                                                    <span className="handle text"><a href={`/task?taskId=${item._id}`} target="_blank">{`${key + 1}. ${item.name}`}</a></span>

                                                </li>
                                            ) : <small style={{ color: "#696767" }}>{translate('task.task_dashboard.no_task')}</small>
                                    }
                                </ul>
                            }
                        </div>
                    </div>
                </div>

                {/* Công việc cần đánh giá hoạt động */}
                <div className="row" style={{ marginBottom: '15px' }}>
                    <div className="col-md-12">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <p data-toggle="collapse" data-target="#show-task-has-action-res" aria-expanded="false" style={{ display: "flex", alignItems: "center", fontWeight: "bold", cursor: "pointer" }} onClick={() => showTaskHasActionsAccountable(!taskHasActionsAccountable)}>
                                <span className="material-icons" style={{ fontWeight: "bold", marginRight: '10px' }}>
                                    {taskHasActionsAccountable ? `keyboard_arrow_up` : `keyboard_arrow_down`}

                                </span>{`Công việc cần đánh giá hoạt động (${state.taskHasActionsAccountable ? state.taskHasActionsAccountable.length : 0})`}
                            </p>

                            {/* chú thích Công việc cần đánh giá hoạt động  */}
                            <p className="text-red" title={translate('task.task_management.explain')} onClick={showTaskHasActionAccDescription}>
                                <i className="fa fa-exclamation-circle" style={{ color: '#06c', marginLeft: '5px', fontSize: '14px', cursor: 'pointer' }} />
                            </p>
                        </div>


                        <div className="collapse" data-toggle="collapse " id="show-task-has-action-res">
                            {
                                state.taskHasActionsAccountable &&
                                <ul className="todo-list">
                                    {
                                        (state.taskHasActionsAccountable.length !== 0) ?
                                            state.taskHasActionsAccountable.map((item, key) =>
                                                <li key={key} style={{ border: 'none', borderBottom: '1px solid #f4f4f4' }}>
                                                    <span className="handle text"><a href={`/task?taskId=${item._id}`} target="_blank">{`${key + 1}. ${item.name}`}</a></span>

                                                </li>
                                            ) : <small style={{ color: "#696767" }}>{translate('task.task_dashboard.no_task')}</small>
                                    }
                                </ul>
                            }
                        </div>
                    </div>
                </div>

                {/* Công việc chưa liên kết Kpi */}
                <div className="row" style={{ marginBottom: '15px' }}>
                    <div className="col-md-12">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <p data-toggle="collapse" data-target="#show-task-not-link-kpi" aria-expanded="false" style={{ display: "flex", alignItems: "center", fontWeight: "bold", cursor: "pointer" }} onClick={() => showTaskNotLinkKpi(!notLinkKpi)}>
                                <span className="material-icons" style={{ fontWeight: "bold", marginRight: '10px' }}>
                                    {notLinkKpi ? `keyboard_arrow_up` : `keyboard_arrow_down`}

                                </span>{`${translate('task.task_management.task_is_not_linked_up_with_monthly_kpi')} (${state.notLinkedTasks ? state.notLinkedTasks.length : 0})`}
                            </p>

                            {/* chú thích công việc chưa liên kết Kpi  */}
                            <p className="text-red" title={translate('task.task_management.explain')} onClick={() => showTaskNotLinkKpiDescription(state.currentMonth, state.currentYear)}>
                                <i className="fa fa-exclamation-circle" style={{ color: '#06c', marginLeft: '5px', fontSize: '14px', cursor: 'pointer' }} />
                            </p>
                        </div>


                        <div className="collapse" data-toggle="collapse " id="show-task-not-link-kpi">
                            {
                                state.notLinkedTasks &&
                                <ul className="todo-list">
                                    {
                                        (state.notLinkedTasks.length !== 0) ?
                                            state.notLinkedTasks.map((item, key) =>
                                                <li key={key} style={{ border: 'none', borderBottom: '1px solid #f4f4f4' }}>
                                                    <span className="handle text"><a href={`/task?taskId=${item._id}`} target="_blank">{`${key + 1}. ${item.name}`}</a></span>

                                                </li>
                                            ) : <small style={{ color: "#696767" }}>{translate('task.task_dashboard.no_task')}</small>
                                    }
                                </ul>
                            }
                        </div>
                    </div>
                </div>

                {/* Công việc chưa có đánh giá kết quả thực hiện cho tháng hiện tại */}
                <div className="row" style={{ marginBottom: '15px' }}>
                    <div className="col-md-12">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <p data-toggle="collapse" data-target="#show-task-not-evaluation-results" aria-expanded="false" style={{ display: "flex", alignItems: "center", fontWeight: "bold", cursor: "pointer" }} onClick={() => showTaskHasNotEvaluationResult(!taskHasNotEvaluationResult)}>
                                <span className="material-icons" style={{ fontWeight: "bold", marginRight: '10px' }}>
                                    {taskHasNotEvaluationResult ? `keyboard_arrow_up` : `keyboard_arrow_down`}

                                </span>{`Công việc chưa có đánh giá kết quả thực hiện cho tháng hiện tại (${state.taskHasNotEvaluationResultIncurrentMonth ? state.taskHasNotEvaluationResultIncurrentMonth.length : 0})`}
                            </p>

                            {/* chú thích công việc chưa liên kết Kpi  */}
                            <p className="text-red" title={translate('task.task_management.explain')} onClick={() => showTaskHasNotEvaluationResultDescription(state.currentMonth, state.currentYear)}>
                                <i className="fa fa-exclamation-circle" style={{ color: '#06c', marginLeft: '5px', fontSize: '14px', cursor: 'pointer' }} />
                            </p>
                        </div>


                        <div className="collapse" data-toggle="collapse " id="show-task-not-evaluation-results">
                            {
                                state.taskHasNotEvaluationResultIncurrentMonth &&
                                <ul className="todo-list">
                                    {
                                        (state.taskHasNotEvaluationResultIncurrentMonth.length !== 0) ?
                                            state.taskHasNotEvaluationResultIncurrentMonth.map((item, key) =>
                                                <li key={key} style={{ border: 'none', borderBottom: '1px solid #f4f4f4' }}>
                                                    <span className="handle text"><a href={`/task?taskId=${item._id}`} target="_blank">{`${key + 1}. ${item.name}`}</a></span>

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
