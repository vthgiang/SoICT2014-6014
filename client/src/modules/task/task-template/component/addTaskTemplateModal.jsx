import React, { Component, useEffect, useState } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';

import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { taskTemplateActions } from '../redux/actions';
import { DialogModal } from '../../../../common-components';
import { TaskTemplateFormValidator } from './taskTemplateFormValidator';
import { AddTaskTemplate } from './addTaskTemplate';
import ValidationHelper from '../../../../helpers/validationHelper';

const ModalAddTaskTemplate = (props) => {

    const [state, setState] = useState({
            newTemplate: {
                organizationalUnit: '',
                collaboratedWithOrganizationalUnits: [],
                name: '',
                readByEmployees: [],
                responsibleEmployees: [],
                accountableEmployees: [],
                consultedEmployees: [],
                informedEmployees: [],
                description: '',
                creator: '',
                formula: '',
                priority: 3,
                taskActions: [],
                taskInformations: []
            },
            currentRole: localStorage.getItem('currentRole'),
        })

    useEffect(() => {
        props.getDepartment();
        props.getAllUserOfCompany();
        props.getRoleSameDepartment(localStorage.getItem("currentRole"));
        props.getDepartmentsThatUserIsManager();
        props.getAllUserInAllUnitsOfCompany();
    },[])

    /**Submit new template in data */
    const handleSubmit = async (event) => {
        let { newTemplate } = state;
        props.addNewTemplate(newTemplate);
        window.$("#addTaskTemplate").modal("hide");
    }


    /**
     * Xử lý form lớn tasktemplate
     */
    const isTaskTemplateFormValidated = () => {
        // let result =
        //     validateTaskTemplateUnit(state.newTemplate.organizationalUnit, false) &&
        //     validateTaskTemplateRead(state.newTemplate.readByEmployees, false) &&
        //     validateTaskTemplateName(state.newTemplate.name, false) &&
        //     validateTaskTemplateDescription(state.newTemplate.description, false) &&
        //     validateTaskTemplateFormula(state.newTemplate.formula, false);
        // return result;
    }


    const validateTaskTemplateName = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateName(props.translate, value);

        if (willUpdateState) {
            state.newTemplate.name = value;
            state.newTemplate.errorOnName = message;
            setState(state => {
                return {
                    ...state,
                };
            });
        }
        return message === undefined;
    }

    const validateTaskTemplateDescription = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            state.newTemplate.description = value;
            state.newTemplate.errorOnDescription = message;
            setState(state => {
                return {
                    ...state,
                };
            });
        }
        return message === undefined;
    }

    const validateTaskTemplateFormula = (value, willUpdateState = true) => {
        let msg = TaskTemplateFormValidator.validateTaskTemplateFormula(value);

        if (willUpdateState) {
            state.newTemplate.formula = value;
            state.newTemplate.errorOnFormula = msg;
            setState(state => {
                return {
                    ...state,
                };
            });
        }
        return msg === undefined;
    }

    const validateTaskTemplateUnit = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    newTemplate: { // update lại unit, và reset các selection phía sau
                        ...state.newTemplate,
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
        return message === undefined;
    }

    const validateTaskTemplateRead = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateArrayLength(props.translate, value);

        if (willUpdateState) {
            state.newTemplate.readByEmployees = value;
            state.newTemplate.errorOnRead = message;
            setState(state => {
                return {
                    ...state,
                };
            });
        }
        return message === undefined;
    }

    const onChangeTemplateData = (value) => {
        setState({
            newTemplate: value
        });
    }

    const { user, translate, savedTaskAsTemplate, savedTaskItem, savedTaskId } = props;
    
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-add-task-template-${savedTaskId}`} isLoading={user.isLoading}
                formID={`form-add-task-template-${savedTaskId}`}
                title={translate('task_template.add_tasktemplate')}
                func={handleSubmit}
                size={100}
            >
                <AddTaskTemplate
                    onChangeTemplateData={onChangeTemplateData}

                    // dùng cho chức năng lưu task thành template
                    savedTaskAsTemplate={savedTaskAsTemplate}
                    savedTaskItem={savedTaskItem}
                    savedTaskId={savedTaskId}
                    // end

                />
            </DialogModal>
        </React.Fragment>
    );
}


function mapState(state) {
    const { department, user, tasktemplates } = state;
    const adding = state.tasktemplates;
    return { adding, department, user, tasktemplates };
}

const actionCreators = {
    addNewTemplate: taskTemplateActions.addTaskTemplate,
    getDepartment: UserActions.getDepartmentOfUser,
    getAllUserOfCompany: UserActions.getAllUserOfCompany,
    getAllUserOfDepartment: UserActions.getAllUserOfDepartment,
    getRoleSameDepartment: UserActions.getRoleSameDepartment,
    getDepartmentsThatUserIsManager: DepartmentActions.getDepartmentsThatUserIsManager,
    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany
};
const connectedModalAddTaskTemplate = connect(mapState, actionCreators)(withTranslate(ModalAddTaskTemplate));
export { connectedModalAddTaskTemplate as ModalAddTaskTemplate };