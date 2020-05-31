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
        this.state = props;
    }
    componentDidMount = () => {
        if (this.props.location) { // Nếu là trang trực tiếp (trong Route)
            const { taskId } = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
            if (taskId){
                this.props.getSubTask(taskId);
            }
        }
    }

    handleShowModal = async (id) => {
        await this.setState(state => {
            return {
                ...state,
                showModal: id
            }
        })
        window.$(`#modelPerformTask${id}`).modal('show');
    }

    render() {
        const { translate } = this.props;
        const { tasks } = this.props;
        var subtasks;
        if (typeof tasks.subtasks !== 'undefined' && tasks.subtasks !== null) {
            subtasks = tasks.subtasks;
            console.log("subtasks : " + subtasks.length);
            return (
                <div>
                    {subtasks.map( item =>{
                        return (
                            <div className="nav-tabs-custom" style={{boxShadow: "none", MozBoxShadow: "none", WebkitBoxShadow: "none"}}>
                                <ul className="nav nav-tabs">
                                    <li><a href={`?taskId=${item._id}`} target="_blank" >{item.name}</a></li>
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
    getSubTask: taskManagementActions.getSubTask
};

const subTaskTab = connect(mapState, subTaskCreators)(withTranslate(SubTaskTab));
export { subTaskTab as SubTaskTab }

