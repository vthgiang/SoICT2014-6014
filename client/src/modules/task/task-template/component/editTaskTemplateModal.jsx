import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { taskTemplateActions } from '../redux/actions';
import { EditTaskTemplate } from './editTaskTemplate';
import { DialogModal } from '../../../../common-components';
import { TaskTemplateFormValidator } from './taskTemplateFormValidator';
import ValidationHelper from '../../../../helpers/validationHelper';

class ModalEditTaskTemplate extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentRole: localStorage.getItem('currentRole'),
            editingTemplate: {
                organizationalUnit: '',
                collaboratedWithOrganizationalUnits: [],
                name: '',
                readByEmployees: [],
                responsibleEmployees: [],
                accountableEmployees: [],
                consultedEmployees: [],
                informedEmployees: [],
                description: '',
                formula: '',
                priority: 3,
                taskActions: [],
                taskInformations: []
            },

        };
    }

    static getDerivedStateFromProps(props, state) {
        if (props.taskTemplateId !== state.taskTemplateId) {
            return {
                ...state,
                taskTemplateId: props.taskTemplateId,
                taskTemplate: props.taskTemplate,
                editingTemplate: {
                    _id: props.taskTemplate._id,
                    organizationalUnit: props.taskTemplate.organizationalUnit._id,
                    collaboratedWithOrganizationalUnits: props.taskTemplate.collaboratedWithOrganizationalUnits.map(item => { if (item) return item._id }),
                    name: props.taskTemplate.name,
                    readByEmployees: props.taskTemplate.readByEmployees.map(item => item.id),
                    responsibleEmployees: props.taskTemplate.responsibleEmployees.map(item => item.id),
                    accountableEmployees: props.taskTemplate.accountableEmployees.map(item => item.id),
                    consultedEmployees: props.taskTemplate.consultedEmployees.map(item => item.id),
                    informedEmployees: props.taskTemplate.informedEmployees.map(item => item.id),
                    description: props.taskTemplate.description,
                    formula: props.taskTemplate.formula,
                    priority: props.taskTemplate.priority,
                    taskActions: props.taskTemplate.taskActions,
                    taskInformations: props.taskTemplate.taskInformations,
                },
                showActionForm: true,
            }
        } else return null;
    }

    handleSubmit = () => {
        const { editingTemplate } = this.state;
        this.props.editTaskTemplate(editingTemplate._id, editingTemplate);
    }

    isTaskTemplateFormValidated = () => {
        if (!this.state.editingTemplate._id)
            return false;
        let result =
            this.validateTaskTemplateRead(this.state.editingTemplate.readByEmployees, false) &&
            this.validateTaskTemplateName(this.state.editingTemplate.name, false) &&
            this.validateTaskTemplateDesc(this.state.editingTemplate.description, false) &&
            this.validateTaskTemplateFormula(this.state.editingTemplate.formula, false) &&
            this.validateTaskTemplateUnit(this.state.editingTemplate.organizationalUnit, false);
        return result;
    }

    validateTaskTemplateName = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateName(this.props.translate, value);

        if (willUpdateState) {
            let { editingTemplate } = this.state;
            editingTemplate.name = value;
            editingTemplate.errorOnName = message;
            this.setState({
                editingTemplate
            })
        }
        return message == undefined;
    }

    validateTaskTemplateDesc = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(this.props.translate, value);

        if (willUpdateState) {
            let { editingTemplate } = this.state;
            editingTemplate.description = value;
            editingTemplate.errorOnDescription = message;
            this.setState({
                editingTemplate
            })
        }
        return message == undefined;
    }

    validateTaskTemplateFormula = (value, willUpdateState = true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateFormula(value);

        if (willUpdateState) {
            let { editingTemplate } = this.state;
            editingTemplate.formula = value;
            editingTemplate.errorOnFormula = msg;
            this.setState({
                editingTemplate
            })
        }
        return msg == undefined;
    }

    validateTaskTemplateUnit = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(this.props.translate, value);

        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    editingTemplate: { // update lại unit, và reset các selection phía sau
                        ...this.state.editingTemplate,
                        organizationalUnit: value,
                        errorOnUnit: message,
                        readByEmployees: [],
                        responsibleEmployees: [],
                        accountableEmployees: [],
                        consultedEmployees: [],
                        informedEmployees: [],
                    }
                };
            });
        }
        return message == undefined;
    }

    validateTaskTemplateRead = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateArrayLength(this.props.translate, value);

        if (willUpdateState) {
            let { editingTemplate } = this.state;
            editingTemplate.readByEmployees = value;
            editingTemplate.errorOnRead = message;
            this.setState({
                editingTemplate
            })
        }
        return message == undefined;
    }

    onChangeTemplateData = (value) => {
        this.setState({
            editingTemplate: value
        })
    }

    render() {
        const { department, user, translate, tasktemplates } = this.props;
        const { editingTemplate, taskTemplateId } = this.state;

        return (
            <DialogModal
                modalID="modal-edit-task-template" isLoading={user.isLoading}
                formID="form-edit-task-template"
                title={translate('task_template.edit_tasktemplate')}
                func={this.handleSubmit}
                // disableSubmit={!this.isTaskTemplateFormValidated()}
                size={100}
            >
                <React.Fragment>
                    <EditTaskTemplate
                        isTaskTemplate={true}
                        taskTemplate={editingTemplate}
                        taskTemplateId={taskTemplateId} onChangeTemplateData={this.onChangeTemplateData}
                    />
                </React.Fragment>
            </DialogModal>
        );
    }
}

function mapState(state) {
    const { department, user, tasktemplates } = state;
    return { department, user, tasktemplates };
}

const actionCreators = {
    editTaskTemplate: taskTemplateActions.editTaskTemplate,
};
const connectedModalEditTaskTemplate = connect(mapState, actionCreators)(withTranslate(ModalEditTaskTemplate));
export { connectedModalEditTaskTemplate as ModalEditTaskTemplate };