import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal } from '../../../../common-components';

import { taskTemplateActions } from '../redux/actions';
import { ViewTaskTemplate } from './viewTaskTemplate';

class ModalViewTaskTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.taskTemplateId !== prevState.taskTemplateId) {
            return {
                ...prevState,
                taskTemplateId: nextProps.taskTemplateId,
            }
        } else {
            return null;
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextProps.taskTemplateId !== this.state.taskTemplateId) {
            this.props.getTaskTemplate(nextProps.taskTemplateId);
            return false;
        }
        return true;
    }

    render() {
        const { tasktemplates, translate } = this.props;

        let taskTemplate = {};
        let priority = "";

        if (tasktemplates.taskTemplate) {
            taskTemplate = tasktemplates.taskTemplate;
            switch (taskTemplate.priority) {
                case 1: priority = translate('task_template.low'); break;
                case 2: priority = translate('task_template.medium'); break;
                case 3: priority = translate('task_template.high'); break;
            }
        }

        return (
            <React.Fragment>
                <DialogModal
                    size='100' modalID="modal-view-tasktemplate" isLoading={false}
                    formID="form-view-tasktemplate"
                    title={taskTemplate && taskTemplate.name}
                    hasSaveButton={false}
                >
                   <ViewTaskTemplate
                    taskTemplate = {taskTemplate}
                    isProcess = {false}
                   >
                   </ViewTaskTemplate>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { tasktemplates } = state;
    return { tasktemplates };
}

const actionCreators = {
    getTaskTemplate: taskTemplateActions.getTaskTemplateById,
};

const connectedModalViewTaskTemplate = connect(mapState, actionCreators)(withTranslate(ModalViewTaskTemplate));
export { connectedModalViewTaskTemplate as ModalViewTaskTemplate };