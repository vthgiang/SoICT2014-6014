import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../common-components';
import { TaskComponent } from './taskComponent';

class ModalPerform extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        
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
                    <TaskComponent id={this.props.id} role={this.props.role}/>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { tasks } = state;
    return { tasks };
}

const modalPerform = connect(mapState, null)(withTranslate(ModalPerform));
export { modalPerform as ModalPerform }


