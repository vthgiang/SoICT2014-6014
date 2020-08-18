import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual'

class TasksIsNotLinked extends Component {
    constructor(props) {
        super(props);
        let currentMonth = new Date().getMonth() + 1;
        this.state = {
            currentMonth: currentMonth,
            userId: localStorage.getItem("userId")
        }
    }

    render() {
        let { tasks, translate } = this.props;
        let { currentMonth, userId } = this.state;
        let taskList = tasks && tasks.tasks;

        if (taskList) {
            let inprocessTask = taskList.filter(task => task.status === "Inprocess")
            var notLinkedTasks = [];

            inprocessTask.length && inprocessTask.map(x => {
                let evaluations;
                let currentEvaluate = [];

                evaluations = x.evaluations.length && x.evaluations;
                for (let i in evaluations) {
                    let d = evaluations[i].date.slice(5, 7);

                    if (d == currentMonth) {
                        currentEvaluate.push(evaluations[i]);
                    }
                }
                currentEvaluate.length && currentEvaluate.map(cur => {
                    cur.results.length && cur.results.map(res => {
                        if (!res.kpis.length && res.employee == userId) {
                            notLinkedTasks.push(x);
                            return;
                        }
                    })
                })

            })

        }

        return (
            <React.Fragment>
                {/* Các công việc chưa liên kết kpi tháng */}
                <div className="col-xs-6">
                    <div className="box box-primary">
                        <div className="box-header with-border">
                            <div className="box-title">{translate('task.task_management.task_is_not_linked_up_with_monthly_kpi')}</div>
                        </div>
                        <div className="box-body" style={{ height: "300px" }}>
                            {
                                notLinkedTasks ?
                                    <ul className="todo-list">
                                        {
                                            (notLinkedTasks.length !== 0) ?
                                                notLinkedTasks.map((item, key) =>
                                                    <li key={key}>
                                                        <span className="handle">
                                                            <i className="fa fa-ellipsis-v" />
                                                            <i className="fa fa-ellipsis-v" />
                                                        </span>
                                                        <span className="text"><a href={`/task?taskId=${item._id}`} target="_blank">{item.name}</a></span>
                                                    </li>
                                                ) : translate('task.task_management.no_task_is_not_linked')
                                        }
                                    </ul> : translate('task.task_management.loading_data')
                            }
                        </div>

                    </div>
                </div>
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { tasks } = state;
    return { tasks }
}

const actions = {
}

const connectedTasksIsNotLinked = connect(mapState, actions)(withTranslate(TasksIsNotLinked))
export { connectedTasksIsNotLinked as TasksIsNotLinked }