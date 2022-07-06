import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../../common-components';
import ValidationHelper from '../../../../../helpers/validationHelper';

import { AddKpiTemplate } from './addKpiTemplate';
import { KpiTemplateFormValidator } from './kpiTemplateFormValidator';

function ModalAddKpiTemplate(props) {

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
            kpiActions: [],
            kpiInformations: []
        },
        currentRole: localStorage.getItem('currentRole'),
    })

    // useEffect(() => {
    //     props.getDepartment();
    //     props.getAllUserOfCompany();
    //     props.getRoleSameDepartment(localStorage.getItem("currentRole"));
    //     props.getDepartmentsThatUserIsManager();
    //     props.getAllUserInAllUnitsOfCompany();
    // }, [])

    /**Submit new template in data */
    const handleSubmit = async (event) => {
        let { newTemplate } = state;
        console.log(newTemplate);
        props.addNewTemplate(newTemplate);
        // window.$("#addKpiTemplate").modal("hide");
    }


    /**
     * Xử lý form lớn kpitemplate
     */
    const isKpiTemplateFormValidated = () => {
        // let result =
        //     validateKpiTemplateUnit(state.newTemplate.organizationalUnit, false) &&
        //     validateKpiTemplateRead(state.newTemplate.readByEmployees, false) &&
        //     validateKpiTemplateName(state.newTemplate.name, false) &&
        //     validateKpiTemplateDescription(state.newTemplate.description, false) &&
        //     validateKpiTemplateFormula(state.newTemplate.formula, false);
        // return result;
    }


    const validateKpiTemplateName = (value, willUpdateState = true) => {
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

    const validateKpiTemplateDescription = (value, willUpdateState = true) => {
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

    const validateKpiTemplateFormula = (value, willUpdateState = true) => {
        let msg = KpiTemplateFormValidator.validateKpiTemplateFormula(value);

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

    const validateKpiTemplateUnit = (value, willUpdateState = true) => {
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

    const validateKpiTemplateRead = (value, willUpdateState = true) => {
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

    const { user, translate, savedKpiAsTemplate, savedKpiItem, savedKpiId } = props;

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-add-kpi-template`}
                formID={`form-add-kpi-template`}
                title={"Thêm mới mẫu KPI đơn vị"}
                func={handleSubmit}
                size={75}
            >
                <AddKpiTemplate
                    onChangeTemplateData={onChangeTemplateData}

                    // dùng cho chức năng lưu kpi thành template
                    savedKpiAsTemplate={savedKpiAsTemplate}
                    savedKpiItem={savedKpiItem}
                    savedKpiId={savedKpiId}
                // end

                />
            </DialogModal>
        </React.Fragment>
    );
}


function mapState(state) {

}

const actionCreators = {
};
const connectedModalAddKpiTemplate = connect(mapState, actionCreators)(withTranslate(ModalAddKpiTemplate));
export { connectedModalAddKpiTemplate as ModalAddKpiTemplate };
