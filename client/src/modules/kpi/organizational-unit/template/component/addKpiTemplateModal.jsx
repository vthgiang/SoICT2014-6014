import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../../common-components';
import ValidationHelper from '../../../../../helpers/validationHelper';
import { kpiTemplateActions } from '../redux/actions';

import { AddKpiTemplate } from './addKpiTemplate';
import { KpiTemplateFormValidator } from './kpiTemplateFormValidator';

function ModalAddKpiTemplate(props) {

    const [state, setState] = useState({
        templateData: {
            organizationalUnit: '',
            name: '',
            creator: '',
            kpis: []
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
        let { templateData } = state;
        console.log(templateData);
        props.addNewTemplate(templateData);
        // props.getKpiTemplates(null, null, 1, props.limit);
        // window.$("#addKpiTemplate").modal("hide");
    }


    /**
     * Xử lý form lớn kpitemplate
     */
    const isKpiTemplateFormValidated = () => {
        // let result =
        //     validateKpiTemplateUnit(state.templateData.organizationalUnit, false) &&
        //     validateKpiTemplateRead(state.templateData.readByEmployees, false) &&
        //     validateKpiTemplateName(state.templateData.name, false) &&
        //     validateKpiTemplateDescription(state.templateData.description, false) &&
        //     validateKpiTemplateFormula(state.templateData.formula, false);
        // return result;
    }


    const validateKpiTemplateName = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateName(props.translate, value);

        if (willUpdateState) {
            state.templateData.name = value;
            state.templateData.errorOnName = message;
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
            state.templateData.description = value;
            state.templateData.errorOnDescription = message;
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
            state.templateData.formula = value;
            state.templateData.errorOnFormula = msg;
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
                    templateData: { // update lại unit, và reset các selection phía sau
                        ...state.templateData,
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
            state.templateData.readByEmployees = value;
            state.templateData.errorOnRead = message;
            setState(state => {
                return {
                    ...state,
                };
            });
        }
        return message === undefined;
    }

    const onChangeTemplateData = (value) => {
        console.log(138, value)
        setState({
            templateData: value
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
    addNewTemplate: kpiTemplateActions.addKpiTemplate,
    getKpiTemplates: kpiTemplateActions.getKpiTemplates,
};
const connectedModalAddKpiTemplate = connect(mapState, actionCreators)(withTranslate(ModalAddKpiTemplate));
export { connectedModalAddKpiTemplate as ModalAddKpiTemplate };
