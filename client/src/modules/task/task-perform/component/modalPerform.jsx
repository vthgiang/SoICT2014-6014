import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ErrorLabel, ButtonModal } from '../../../../common-components';
import { DetailTaskTab } from './detailTaskTab';

import { taskManagementActions } from "../../task-management/redux/actions";

class ModalPerform extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        
    }

    render() {
        const { translate } = this.props;
        var task, actions, informations;
        var statusTask;
        const { tasks} = this.props; 
        
        if (typeof tasks.task !== 'undefined' && tasks.task !== null) task = tasks.task.info;
        if (typeof tasks.task !== 'undefined' && tasks.task !== null) statusTask = task.status;
        if (typeof tasks.task !== 'undefined' && tasks.task !== null && tasks.task.info.taskTemplate !== null) {
            actions = tasks.task.actions;
            informations = tasks.task.informations;
        }
        return (
            <React.Fragment>
                <DialogModal
                    size="100"
                    modalID={`modelPerformTask${this.props.id}`}
                    formID="form-perform-task"
                    title={task && task.name}
                    // msg_success={translate('task.task_perform.modal_approve_task.msg_success')}
                    // msg_faile={translate('task.task_perform.modal_approve_task.msg_faile')}
                    // func={this.save}
                >
                    <div className="row">
                        <div className="col-sm-6 box-body" style={{ borderRight: "1px solid #ccc" }}>
                            <DetailTaskTab
                                id={this.props.id}
                                role={this.props.role}
                            />
                        </div>

                        {/* end div mô tả... */}

                        <div className="col-sm-6 box-body">
                            <h1>TAB ATION TASK</h1>
                        </div>
                    </div>



                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { tasks } = state;
    return { tasks };
}

const actionCreators = {
    getTaskById: taskManagementActions.getTaskById,
};

const modalPerform = connect(mapState, actionCreators)(withTranslate(ModalPerform));
export { modalPerform as ModalPerform }


