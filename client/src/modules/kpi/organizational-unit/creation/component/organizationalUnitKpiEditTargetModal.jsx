import React, {Component, useEffect, useState} from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel, SelectBox, QuillEditor } from '../../../../../common-components';
import ValidationHelper from '../../../../../helpers/validationHelper';

import { createUnitKpiActions } from '../redux/actions';

function OrganizationalUnitKpiEditTargetModal(props) {
    const [state, setState] = useState({
        _id: null,
        name: "",
        parent: undefined,
        weight: "",
        criteria: "",
        editing: false,
        errorOnName: undefined,
        errorOnCriteria: undefined,
        errorOnWeight: undefined,
    });

    const { createKpiUnit, translate } = props;
    const { organizationalUnit } = props;
    const { editing, newTarget, _id, name, parent, weight, 
        criteria, errorOnName, errorOnCriteria, errorOnWeight, 
        quillValueDefault 
    } = state;

    let parentKPI;

    if (props.id !== state._id && props.organizationalUnitKpi) {
        setState( {
            ...state,
            _id: props.id,
            name: props.organizationalUnitKpi.name,
            parent: props.organizationalUnitKpi.parent ? props.organizationalUnitKpi.parent._id : null,
            weight: props.organizationalUnitKpi.weight,
            criteria: props.organizationalUnitKpi.criteria,
            quillValueDefault: props.organizationalUnitKpi.criteria,

            errorOnName: undefined,
            errorOnCriteria: undefined,
            errorOnWeight: undefined,
        })
    }

    const handleEditTarget = async () => {
        let id = state._id;
        let newTarget = {
            name: state.name,
            parent: state.parent ? state.parent : null,
            weight: state.weight,
            criteria: state.criteria,
        }

        if (isFormValidated()){
            return props.editTargetKPIUnit(id, newTarget);
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
    }

    const handleParentChange = (value) => {
        setState( {
            ...state, parent: value[0]
        });
    }

   const handleCriteriaChange = (value, imgs) => {
        let validation = ValidationHelper.validateDescription(props.translate, value);

        setState( {
            ...state,
            errorOnCriteria: validation.message,
            criteria: value,
        });
    }

   const  handleWeightChange = (e) => {
        let value = e.target.value;
        let validation = validateWeight(props.translate, value);

        setState({
            ...state,
            errorOnWeight: validation.message,
            weight: value,
        });
    }

   function validateWeight(translate, value) {
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
    }


    const isFormValidated = () => {
        const { translate } = props;
        const { name, criteria, weight } = state;

        let validatateName, validateCriteria, result;

        validatateName = ValidationHelper.validateName(translate, name);
        validateCriteria = ValidationHelper.validateDescription(translate, criteria);
        let validation = validateWeight(translate, weight)

        result = validatateName.status && validateCriteria.status && validation.status;
        return result;
    }

    if (createKpiUnit.parent) {
        parentKPI = createKpiUnit.parent;
    }

    let items;
    if (!parentKPI) {
        items = [];
    } else {
        items = parentKPI.kpis.map(x => {
            return {value: x._id, text: x.name} });
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID={`editTargetKPIUnit`} isLoading={editing}
                formID="form-edit-target"
                title={translate('kpi.organizational_unit.edit_target_kpi_modal.edit_organizational_unit_kpi')}
                msg_success={translate('kpi.organizational_unit.edit_target_kpi_modal.success')}
                msg_faile={translate('kpi.organizational_unit.edit_target_kpi_modal.failure')}
                func={handleEditTarget}
                disableSubmit={!isFormValidated()}
            >
                {/* Form chỉnh sửa mục tiêu */}
                <form id="form-edit-target" onSubmit={() => handleEditTarget(translate('kpi.organizational_unit.edit_target_kpi_modal.success'))}>
                    <div className={`form-group ${ !errorOnName ? "" : "has-error"}`}>
                        <label>{translate('kpi.organizational_unit.edit_target_kpi_modal.name')}<span className="text-red">*</span></label>
                        <input type="text" className="form-control" value={name} onChange = {handleNameChange}/>
                        <ErrorLabel content={errorOnName}/>
                    </div>

                    {/* Mục tiêu cha */}
                    {(organizationalUnit && organizationalUnit.parent) &&//unit.parent === null này!!! kiểm tra xem đây là đơn vị gốc hay không!
                    <div className="form-group">
                        <label>{translate('kpi.organizational_unit.edit_target_kpi_modal.parents')}</label>
                        {items.length !== 0 &&
                        <SelectBox
                            id={`parent-target-add${_id}`}
                            className="form-control select2"
                            style={{width: "100%"}}
                            items = {items}
                            value={parent}
                            onChange={handleParentChange}
                            multiple={false}
                        />
                        }
                    </div>}

                    {/* Tiêu chí đánh giá */}
                    <div className={`form-group ${!errorOnCriteria? "": "has-error"}`}>
                        <label>{translate('kpi.organizational_unit.edit_target_kpi_modal.evaluation_criteria')}<span className="text-red">*</span></label>
                        <QuillEditor
                            id={'edit-organizational-unit-kpi'}
                            getTextData={handleCriteriaChange}
                            quillValueDefault={quillValueDefault}
                            toolbar={false}
                        />
                        <ErrorLabel content={errorOnCriteria} />
                    </div>

                    {/* Trọng số */}
                    <div className={`form-group ${!errorOnWeight? "": "has-error"}`}>
                        <label>{translate('kpi.organizational_unit.edit_target_kpi_modal.weight')}<span className="text-red">*</span></label>
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
    editTargetKPIUnit: createUnitKpiActions.editTargetKPIUnit
};
const connectedOrganizationalUnitKpiEditTargetModal = connect(mapState, actionCreators)(withTranslate(OrganizationalUnitKpiEditTargetModal));
export { connectedOrganizationalUnitKpiEditTargetModal as OrganizationalUnitKpiEditTargetModal };
