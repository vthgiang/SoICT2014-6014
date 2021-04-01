import React, {Component, useEffect, useState} from 'react';
import { connect } from 'react-redux';

import { withTranslate } from 'react-redux-multilingual';

import { createUnitKpiActions } from '../../../organizational-unit/creation/redux/actions';
import { createKpiSetActions } from "../redux/actions";

import { DialogModal, ErrorLabel, SelectBox, QuillEditor } from '../../../../../common-components';
import ValidationHelper from '../../../../../helpers/validationHelper';

function ModalEditEmployeeKpi(props) {
    const [state, setState] = useState({
        _id: null,
        name: "",
        parent: undefined,
        weight: "",
        criteria: "",
        employeeKpiSet: "",

        errorOnName: undefined,
        errorOnCriteria: undefined,
        errorOnWeight: undefined,

        editing: false,
        submitted: false
    });

    let currentOrganizationalUnitKPI, items;
    const { createKpiUnit, translate } = props;
    const { _id, name, weight, criteria, errorOnName, errorOnCriteria, errorOnWeight, editing, parent, quillValueDefault } = state;

    useEffect(()=>{
        if (props.id !== state._id && props.employeeKpi) {
            setState({
                ...state,
                _id: props.id,
                name: props.employeeKpi.name,
                parent: props.employeeKpi.parent ? props.employeeKpi.parent._id : null,
                weight: props.employeeKpi.weight,
                criteria: props.employeeKpi.criteria,
                quillValueDefault: props.employeeKpi.criteria,

                errorOnName: undefined, // Khi nhận thuộc tính mới, cần lưu ý reset lại các gợi ý nhắc lỗi, nếu không các lỗi cũ sẽ hiển thị lại
                errorOnCriteria: undefined,
                errorOnWeight: undefined,
            })
        }
    },[props.id])

    /**Gửi request chỉnh sửa mục tiêu này */
    const handleEditTargetEmployeeKpi = async () => {
        const { _id, name, parent, weight, criteria } = state;

        let newTarget = {
            name: name,
            parent: parent,
            weight: weight,
            criteria: criteria,
        }

        if (isFormValidated()) {
            let res = await props.editEmployeeKpi(_id, newTarget);

            window.$(`#editEmployeeKpi${_id}`).modal("hide");
            window.$(".modal-backdrop").remove();
            window.$('body').removeClass('modal-open');
            window.$('body').css('padding-right',"0px");

            return res;
        }
    }

   const handleNameChange = (e) => {
        let value = e.target.value;
        let validation = ValidationHelper.validateName(props.translate, value);

        setState( {
            ...state,
            errorOnName: validation.message,
            name: value,
        });
    };

   const handleParentChange = (value) => {
        setState( {
            ...state,
            parent: value,
        });
    };

   const handleCriteriaChange = (value) => {
        let validation = ValidationHelper.validateDescription(props.translate, value);
        setState( {
            ...state,
            errorOnCriteria: validation.message,
            criteria: value,
        });
    };

   const handleWeightChange = (e) => {
        let value = e.target.value;
        let validation = validateWeight(props.translate, value);

        setState( {
            ...state,
            errorOnWeight: validation.message,
            weight: value,
        });
    };

   const validateWeight = (translate, value) => {
        let validation = ValidationHelper.validateEmpty(translate, value);

        if (!validation.status) {
            return validation;
        }

        if (value < 0) {
            return {
                status: false,
                message: props.translate('kpi.employee.employee_kpi_set.create_employee_kpi_modal.validate_weight.less_than_0')
            };
        } else if(value > 100){
            return {
                status: false,
                message: props.translate('kpi.employee.employee_kpi_set.create_employee_kpi_modal.validate_weight.greater_than_100')
            };
        } else {
            return {
                status: true
            };
        }
    };

    const isFormValidated = () => {
        const { translate } = props;
        const { name, criteria, weight } = state;

        let validatateName, validateCriteria, result;

        validatateName = ValidationHelper.validateName(translate, name);
        validateCriteria = ValidationHelper.validateDescription(translate, criteria);
        let validation = validateWeight(translate, weight)

        result = validatateName.status && validateCriteria.status && validation.status;
        return result;
    };


    if (createKpiUnit.currentKPI) currentOrganizationalUnitKPI = createKpiUnit.currentKPI;

    if (!currentOrganizationalUnitKPI) {
        items = [];
    } else {
        items = currentOrganizationalUnitKPI.kpis.map(x => {//type !==0 thì đc. cái này để loại những mục tiêu mặc định?
            return {value: x._id, text: x.name} });
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID={`editEmployeeKpi${_id}`} isLoading={editing}
                formID="formeditEmployeeKpi"
                title={translate('kpi.employee.employee_kpi_set.edit_employee_kpi_modal.edit_employee_kpi')}
                msg_success={translate('kpi.employee.employee_kpi_set.edit_employee_kpi_modal.success')}
                msg_faile={translate('kpi.employee.employee_kpi_set.edit_employee_kpi_modal.failure')}
                func={handleEditTargetEmployeeKpi}
                disableSubmit={!isFormValidated()}
            >
                <form id="formEditTargetEmployeeKpi" onSubmit={() => handleEditTargetEmployeeKpi(translate('kpi.employee.employee_kpi_set.edit_employee_kpi_modal.success'))}>

                    {/**Tên của mục tiêu */}
                    <div className={`form-group ${errorOnName === undefined ? "" : "has-error"}`}>
                        <label>{translate('kpi.employee.employee_kpi_set.edit_employee_kpi_modal.name')}<span className="text-red">*</span></label>
                        <input type="text" className="form-control" value={name} onChange = {handleNameChange}/>
                        <ErrorLabel content={errorOnName}/>
                    </div>

                    {/**Mục tiêu cha */}
                    {(createKpiUnit.currentKPI !== null) &&
                    (items.length !== 0) &&
                    <div className="form-group">
                        <label>{translate('kpi.employee.employee_kpi_set.edit_employee_kpi_modal.parents')}<span className="text-red">*</span></label>
                        <SelectBox
                            id={`parent-target-edit${_id}`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={items}
                            onChange={handleParentChange}
                            multiple={false}
                            value={parent ? parent : ""}
                        />
                    </div>
                    }

                    {/**Tiêu chí đánh giá */}
                    <div className={`form-group ${errorOnCriteria === undefined ? "" : "has-error"}`}>
                        <label>{translate('kpi.employee.employee_kpi_set.edit_employee_kpi_modal.evaluation_criteria')}<span className="text-red">*</span></label>
                        <QuillEditor
                            id={'edit-employee-kpi'}
                            getTextData={handleCriteriaChange}
                            quillValueDefault={quillValueDefault}
                            toolbar={false}
                        />
                        <ErrorLabel content={errorOnCriteria} />
                    </div>

                    {/**Trọng số của mục tiêu */}
                    <div className={`form-group ${errorOnWeight === undefined ? "" : "has-error"}`}>
                        <label>{translate('kpi.employee.employee_kpi_set.edit_employee_kpi_modal.weight')}<span className="text-red">*</span></label>
                        <input type="number" className="form-control" value={weight} onChange = {handleWeightChange}/>
                        <ErrorLabel content={errorOnWeight}/>
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );

}

function mapState(state) {
    const { createKpiUnit } = state;
    return { createKpiUnit };
}

const actionCreators = {
    editEmployeeKpi: createKpiSetActions.editEmployeeKpi
};

const connectedModalEditEmployeeKpi = connect( mapState, actionCreators )( withTranslate(ModalEditEmployeeKpi) );
export { connectedModalEditEmployeeKpi as ModalEditEmployeeKpi };
