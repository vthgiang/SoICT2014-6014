import React, { useEffect } from 'react'
import { withTranslate } from 'react-redux-multilingual'
import moment from 'moment'
function ProcessOfTask(props) {
    useEffect(() => {
        const { tasks } = props;
        const taskOfUser = tasks.tasks;
        if (taskOfUser) {
            let intimeTask = 0, delayTask = 0, overdueTask = 0;

            for (let i in taskOfUser) {
                let start = moment(taskOfUser[i].startDate);
                let end = moment(taskOfUser[i].endDate);
                let lastUpdate = moment(taskOfUser[i].updatedAt);
                let now = moment(new Date());
                let duration = end.diff(start, 'days');
                let uptonow = now.diff(lastUpdate, 'days');

                if (taskOfUser[i].status === 'inprocess') {
                    if (now > end) {
                        // Quá hạn
                        overdueTask++;
                    }
                    else {
                        let processDay = Math.floor(taskOfUser[i].progress * duration / 100);
                        let startToNow = now.diff(start, 'days');

                        if (startToNow > processDay) {
                            // Trễ hạn
                            delayTask++;
                        }
                        else if (startToNow <= processDay) {
                            // Đúng hạn
                            intimeTask++;
                        }
                    }
                }
            }

            console.log("============", intimeTask, delayTask, overdueTask);
        }
    }, [props.tasks])

    return (
        <div className="box-body" style={{ overflow: "auto" }}>
            hello bạn neh
            {/* {
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
                                        <span className="text"><a href={`/task?taskId=${item.task._id}`} target="_blank">{item.task.name}</a></span>
                                        <small className="label label-warning"><i className="fa fa-clock-o" /> &nbsp;{item.totalDays} {translate('task.task_management.calc_days')}</small>
                                    </li>
                                ) : "Không có công việc nào sắp hết hạn"
                        }
                    </ul> : "Đang tải dữ liệu"
            } */}
        </div>
    )
}

export default withTranslate(ProcessOfTask)
