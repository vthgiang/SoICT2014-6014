import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { taskTemplateActions } from '../redux/actions';
import { EditTaskTemplate } from './editTaskTemplate';
import { DialogModal } from '../../../../common-components';
import { TaskTemplateFormValidator } from './taskTemplateFormValidator';
import ValidationHelper from '../../../../helpers/validationHelper';

function ModalEditTaskTemplate (props) {

    const [state, setState] = useState ({
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
    })

    useEffect(()=> {
        if (props.taskTemplateId !== state.taskTemplateId) {
            setState(state => {
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
            }})
        }
    },[props.taskTemplateId, props.taskTemplate])

    const handleSubmit = () => {
        const { editingTemplate } = state;
        console.log(editingTemplate);
        props.editTaskTemplate(editingTemplate._id, editingTemplate);
    }

    const isTaskTemplateFormValidated = () => {
        if (!state.editingTemplate._id)
            return false;
        let result =
            validateTaskTemplateRead(state.editingTemplate.readByEmployees, false) &&
            validateTaskTemplateName(state.editingTemplate.name, false) &&
            validateTaskTemplateDesc(state.editingTemplate.description, false) &&
            validateTaskTemplateFormula(state.editingTemplate.formula, false) &&
            validateTaskTemplateUnit(state.editingTemplate.organizationalUnit, false);
        return result;
    }

    const validateTaskTemplateName = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateName(props.translate, value);

        if (willUpdateState) {
            let { editingTemplate } = state;
            editingTemplate.name = value;
            editingTemplate.errorOnName = message;
            setState({
                ...state,
                editingTemplate
            })
        }
        return message == undefined;
    }

    const validateTaskTemplateDesc = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            let { editingTemplate } = state;
            editingTemplate.description = value;
            editingTemplate.errorOnDescription = message;
            setState({
                ...state,
                editingTemplate
            })
        }
        return message == undefined;
    }

    const validateTaskTemplateFormula = (value, willUpdateState = true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateFormula(value);

        if (willUpdateState) {
            let { editingTemplate } = state;
            editingTemplate.formula = value;
            editingTemplate.errorOnFormula = msg;
            setState({
                ...state,
                editingTemplate
            })
        }
        return msg == undefined;
    }

    const validateTaskTemplateUnit = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    editingTemplate: { // update lại unit, và reset các selection phía sau
                        ...state.editingTemplate,
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

    const validateTaskTemplateRead = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateArrayLength(props.translate, value);

        if (willUpdateState) {
            let { editingTemplate } = state;
            editingTemplate.readByEmployees = value;
            editingTemplate.errorOnRead = message;
            setState({
                ...state,
                editingTemplate
            })
        }
        return message == undefined;
    }

    const onChangeTemplateData = (value) => {
        setState({
            ...state,
            editingTemplate: value
        })
        console.log(state.editingTemplate);
    }

    const { department, user, translate, tasktemplates } = props;
    const { editingTemplate, taskTemplateId } = state;

    return (
        <DialogModal
            modalID="modal-edit-task-template" isLoading={user.isLoading}
            formID="form-edit-task-template"
            title={translate('task_template.edit_tasktemplate')}
            func={handleSubmit}
            // disableSubmit={!isTaskTemplateFormValidated()}
            size={100}
        >
        <React.Fragment>
            <EditTaskTemplate
                isTaskTemplate={true}
                taskTemplate={editingTemplate}
                taskTemplateId={taskTemplateId} onChangeTemplateData={onChangeTemplateData}
            />
            </React.Fragment>
        </DialogModal>
    );
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