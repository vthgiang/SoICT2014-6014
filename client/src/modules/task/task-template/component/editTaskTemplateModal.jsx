import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { taskTemplateActions } from '../redux/actions';
import { EditTaskTemplate } from './editTaskTemplate';

import { ActionForm } from '../component/actionsTemplate';
import { DialogModal, SelectBox, ErrorLabel } from '../../../../common-components';

import { TaskTemplateFormValidator } from './taskTemplateFormValidator';
import getEmployeeSelectBoxItems from '../../organizationalUnitHelper';
import './tasktemplate.css';

class ModalEditTaskTemplate extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentRole: localStorage.getItem('currentRole'),
            editingTemplate: {
                organizationalUnit: '',
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

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    shouldComponentUpdate ( nextProps, nextState) {
        if(nextProps.taskTemplateId !== this.props.taskTemplateId) {
            
            this.setState({
                taskTemplateId: nextProps.taskTemplateId,
                taskTemplate: nextProps.taskTemplate,
                editingTemplate: {
                    _id: nextProps.taskTemplate._id,
                    organizationalUnit: nextProps.taskTemplate.organizationalUnit._id,
                    name: nextProps.taskTemplate.name,
                    readByEmployees: nextProps.taskTemplate.readByEmployees.map(item => item._id),
                    responsibleEmployees: nextProps.taskTemplate.responsibleEmployees.map(item => item._id),
                    accountableEmployees: nextProps.taskTemplate.accountableEmployees.map(item => item._id),
                    consultedEmployees: nextProps.taskTemplate.consultedEmployees.map(item => item._id),
                    informedEmployees: nextProps.taskTemplate.informedEmployees.map(item => item._id),
                    description: nextProps.taskTemplate.description,
                    formula: nextProps.taskTemplate.formula,
                    priority: nextProps.taskTemplate.priority,
                    taskActions: nextProps.taskTemplate.taskActions,
                    taskInformations: nextProps.taskTemplate.taskInformations,
                },
                showActionForm: true,
            });
            return true;
        }
        return true;
    }

    /**Gửi req sửa mẫu công việc này */
    handleSubmit = async (event) => {
        const { editingTemplate } = this.state;
        console.log('editing', editingTemplate);
        this.props.editTaskTemplate(editingTemplate._id, editingTemplate);
    }

    /**
     * Xử lý form lớn tasktemplate
     */
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
        let msg = TaskTemplateFormValidator.validateTaskTemplateName(value);

        if (willUpdateState) {
            this.state.editingTemplate.name = value;
            this.state.editingTemplate.errorOnName = msg;
            this.setState(state => {
                return {
                    ...state,
                };
            });
        }
        return msg == undefined;
    }

    validateTaskTemplateDesc = (value, willUpdateState = true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateDescription(value);

        if (willUpdateState) {
            this.state.editingTemplate.description = value;
            this.state.editingTemplate.errorOnDescription = msg;
            this.setState(state => {
                return {
                    ...state,
                };
            });
        }
        return msg == undefined;
    }

    validateTaskTemplateFormula = (value, willUpdateState = true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateFormula(value);

        if (willUpdateState) {
            this.state.editingTemplate.formula = value;
            this.state.editingTemplate.errorOnFormula = msg;
            this.setState(state => {
                return {
                    ...state,
                };
            });
        }
        return msg == undefined;
    }
   
    validateTaskTemplateUnit = (value, willUpdateState = true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateUnit(value);

        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    editingTemplate: { // update lại unit, và reset các selection phía sau
                        ...this.state.editingTemplate,
                        organizationalUnit: value,
                        errorOnUnit: msg,
                        readByEmployees: [],
                        responsibleEmployees: [],
                        accountableEmployees: [],
                        consultedEmployees: [],
                        informedEmployees: [],
                    }
                };
            });
        }
        return msg == undefined;
    }

    validateTaskTemplateRead = (value, willUpdateState = true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateRead(value);

        if (willUpdateState) {
            this.state.editingTemplate.readByEmployees = value;
            this.state.editingTemplate.errorOnRead = msg;
            this.setState(state => {
                return {
                    ...state,
                };
            });
        }
        return msg == undefined;
    }

    onChangeTemplateData = (value) => {
        this.setState({
            editingTemplate: value
        })
    }

    render() {
        const { department, user, translate, tasktemplates } = this.props;
        const { taskTemplate, taskTemplateId } = this.props;

        return (
            <DialogModal
                modalID="modal-edit-task-template" isLoading={user.isLoading}
                formID="form-edit-task-template"
                title={translate('task_template.edit_tasktemplate')}
                func={this.handleSubmit}
                disableSubmit={!this.isTaskTemplateFormValidated()}
                size={100}
            >
                <React.Fragment>
                    <EditTaskTemplate isTaskTemplate={true} taskTemplate={taskTemplate} taskTemplateId={taskTemplateId} onChangeTemplateData={this.onChangeTemplateData} />
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
    getTaskTemplate: taskTemplateActions.getTaskTemplateById,
    editTaskTemplate: taskTemplateActions.editTaskTemplate,
    addNewTemplate: taskTemplateActions.addTaskTemplate,
    getDepartment: UserActions.getDepartmentOfUser,
    getAllUserOfCompany: UserActions.getAllUserOfCompany,
    getAllUserOfDepartment: UserActions.getAllUserOfDepartment,
    getRoleSameDepartment: UserActions.getRoleSameDepartment,
    getDepartmentsThatUserIsDean: DepartmentActions.getDepartmentsThatUserIsDean,
    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany

};
const connectedModalEditTaskTemplate = connect(mapState, actionCreators)(withTranslate(ModalEditTaskTemplate));
export { connectedModalEditTaskTemplate as ModalEditTaskTemplate };