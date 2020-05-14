import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ErrorLabel, ButtonModal } from '../../../../common-components';
import { DetailTaskTab } from './detailTaskTab';

import { taskManagementActions } from "../../task-management/redux/actions";
import { ActionTab } from './actionTab';

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
                    bodyStyle={{paddingTop: "0px", paddingBottom: "0px"}}
                    // msg_success={translate('task.task_perform.modal_approve_task.msg_success')}
                    // msg_faile={translate('task.task_perform.modal_approve_task.msg_faile')}
                    // func={this.save}
                >
                    <div className="row" style={{height: "100%"}}>
                        <div className="col-sm-6" style={{ paddingTop: "10px" }}>
                            <DetailTaskTab
                                id={this.props.id}
                                role={this.props.role}
                            />
                        </div>

                        {/* end div mô tả... */}

                        <div className="col-sm-6" style={{padding: "10px 0 10px 0", borderLeft: "1px solid #f4f4f4", height: "100%"}}>
                            <ActionTab 
                                id = {this.props.id}
                                role={this.props.role}
                            />
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


