import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { taskManagementActions } from "../../task-management/redux/actions";
import { LOCAL_SERVER_API } from '../../../../env';
import { ModalPerformTask } from './modalPerformTask';
import './actionTab.css';
import qs from 'qs';
class SubTaskTab extends Component {
    constructor(props) {
        super(props);
        this.state = this.props;
    }
    
    componentDidMount = () => {
        if (this.props.location) { // Nếu là trang trực tiếp (trong Route)
            const { taskId } = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
            if (taskId){
                this.props.getTaskById(taskId);
                // this.props.getTaskActions(taskId);
                // this.props.getTaskComments(taskId);
                this.props.getSubTask(taskId);
            }
        }
    }

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('-');
    }

    render() {
        const { translate } = this.props;
        const { tasks } = this.props;
        var subtasks,startDate,endDate;
        if (tasks.subtasks) {
            subtasks = tasks.subtasks;
            console.log("subtasks : " + subtasks.length);
            var subtask=[];
            for (let n in subtasks){
                subtask[n]={
                    ...subtasks[n],
                    name: subtasks[n].name,
                    startDate: this.formatDate(subtasks[n].startDate),
                    endDate: this.formatDate(subtasks[n].endDate),
                    status: subtasks[n].status,
                    progress: subtasks[n].progress
                }
            }
            return (
                <div>
                    {subtask.map( item =>{
                        return (
                            <div className="nav-tabs-custom" style={{boxShadow: "none", MozBoxShadow: "none", WebkitBoxShadow: "none"}}>
                                <ul className="nav nav-tabs">
                                    <li>
                                    <div className="row">
                                        <div className="col-xs-5">
                                            <a href={`http://localhost:3000/task?taskId=${item._id}`} target="_blank" >{item.name}</a>
                                        </div>
                                    <div className="col-xs-3">{item.startDate}</div>
                                    <div className="col-xs-3">{item.endDate}</div>
                                    <div className="col-xs-1">{item.status}</div>
                                    </div></li>
                                </ul>
                            </div>
                        )
                    })}
                </div>
            )
        }
        return (<div>{null}</div>)
    }
}

function mapState(state) {
    const { tasks, performtasks, user, auth } = state;
    return { tasks, performtasks, user, auth };
}

const subTaskCreators = {
    getSubTask: taskManagementActions.getSubTask,
    getTaskById: taskManagementActions.getTaskById
};

const subTaskTab = connect(mapState, subTaskCreators)(withTranslate(SubTaskTab));
export { subTaskTab as SubTaskTab }

