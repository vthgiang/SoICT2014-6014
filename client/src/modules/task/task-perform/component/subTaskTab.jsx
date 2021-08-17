import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import parse from 'html-react-parser';
import qs from 'qs';
import './actionTab.css';

import { taskManagementActions } from "../../task-management/redux/actions";

import { performTaskAction } from '../redux/actions';

function SubTaskTab(props) {

    const [state, setState] = useState({});

    useEffect(() => {
        if (props.location) { // Nếu là trang trực tiếp (trong Route)
            const { taskId } = qs.parse(props.location.search, { ignoreQueryPrefix: true });
            if (taskId) {
                props.getTaskById(taskId);
                props.getSubTask(taskId);
            }
        }
    })

    const formatDate = (date) => {
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

    const { translate, tasks } = props;
    let subtasks = tasks.subtasks;

    return (
        <div>
            {subtasks && subtasks.length > 0 &&
                subtasks.map(item => {
                    return (
                        <div className="item-box" key={item._id}>
                            <strong><a href={`/task?taskId=${item._id}`} target="_blank" >{item.name} </a></strong>
                            <span>{item.status}, </span>
                            <span>{item.progress}%, </span>
                            <span>{formatDate(item.startDate)} - {formatDate(item.endDate)}</span>
                            <div>
                                {parse(item.description)}
                            </div>
                        </div>
                    )
                })}

            {subtasks && subtasks.length == 0 && <strong>{translate("task.task_perform.none_subtask")}</strong>}
        </div>
    )
}


function mapState(state) {
    const { tasks } = state;
    return { tasks };
}

const subTaskCreators = {
    getSubTask: taskManagementActions.getSubTask,
    getTaskById: performTaskAction.getTaskById
};

const subTaskTab = connect(mapState, subTaskCreators)(withTranslate(SubTaskTab));
export { subTaskTab as SubTaskTab }

