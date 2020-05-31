import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { taskManagementActions } from "../../task-management/redux/actions";
import { UserActions } from "../../../super-admin/user/redux/actions";
import { LOCAL_SERVER_API } from '../../../../env';
import './actionTab.css';
class SubTaskTab extends Component {
    constructor(props) {
        super(props);
        this.state = props;
    }
    componentDidUpdate() {
        if (this.props.id !== undefined) {
            console.log(this.props.id);
        }
    }
    render() {
        const { translate } = this.props;
        const { tasks } = this.props;
        var subtasks;
        if (typeof tasks.subtasks !== 'undefined') {
            subtasks = tasks.subtasks;
            console.log("subtasks : " + subtasks);
            return (
                <div>
                    {/* {subtasks.map(function(item){
                        return (
                        <option>{item.name}</option>
                        )
                    })} */}
                    {/* {subtasks} */}
                    abcd
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

