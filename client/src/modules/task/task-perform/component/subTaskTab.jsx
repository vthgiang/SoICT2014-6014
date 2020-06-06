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

        return [day, month, year].join('/');
    }

    render() {
        const { translate, tasks } = this.props;
        var subtasks = tasks.subtasks;

        return (
            <div>
                {subtasks && subtasks.length>0 &&
                    subtasks.map( item =>{
                    return (
                        <div style={{marginBottom: 20}}>
                            <strong><a href={`http://localhost:3000/task?taskId=${item._id}`} target="_blank" >{item.name}</a></strong>
                            <span>{item.description}</span>
                            <div>
                                <span>{this.formatDate(item.startDate)} - {this.formatDate(item.endDate)}. </span>
                                <span>{item.status}. </span>
                                <span>{item.progress}%</span>
                            </div>
                        </div>
                    )
                })}

                {subtasks && subtasks.length==0 && <dt>Không có công việc con</dt>}
            </div>
        )
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

