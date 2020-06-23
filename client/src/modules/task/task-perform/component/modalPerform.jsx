import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../common-components';
import { TaskComponent } from './taskComponent';
import { taskManagementActions } from '../../task-management/redux/actions';

class ModalPerform extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        
    }

    componentDidMount(){
        // this.props.getTaskById(this.props.id)
    }

    render() {
        var task;
        const { tasks} = this.props; 
        
        if (typeof tasks.task !== 'undefined' && tasks.task !== null) task = tasks.task.info;
        
        return (
            <React.Fragment>
                <DialogModal
                    size="100"
                    modalID={`modelPerformTask${this.props.id}`}
                    formID="form-perform-task"
                    title={task && task.name}
                    bodyStyle={{padding: "0px"}}
                    hasSaveButton={false}
                >
                    <TaskComponent 
                        id={this.props.id} 
                        // task={task && task}
                    />
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { tasks } = state;
    return { tasks };
}

const actionDispatch = {
    // getTaskById: taskManagementActions.getTaskById
}

const modalPerform = connect(mapState, actionDispatch)(withTranslate(ModalPerform));
export { modalPerform as ModalPerform }


