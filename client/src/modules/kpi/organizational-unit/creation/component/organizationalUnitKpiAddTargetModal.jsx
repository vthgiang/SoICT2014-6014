import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel, QuillEditor, SelectBox } from '../../../../../common-components';
import ValidationHelper from '../../../../../helpers/validationHelper';

import { createUnitKpiActions } from '../redux/actions';

function OrganizationalUnitKpiAddTargetModal(props) {
    const [state, setState] = useState({
        name: "",
        parent: null,
        weight: "",
        criteria: "",
        unit: "",
        target: "",
        organizationalUnitKpiSetId: "",

        adding: false,
        submitted: false,

        errorOnName: undefined,
        errorOnCriteria: undefined,
        errorOnWeight: undefined,
    });
    const { createKpiUnit, translate } = props;
    const { organizationalUnit } = props;
    const { name, adding, weight, criteria, target, unit, errorOnName, errorOnCriteria, errorOnWeight } = state;

    let parentKPI;
    const onAddItem = async () => {
        let parentKPI = null;
        let items;
        let parent = null;
        const { createKpiUnit } = props;

        if (createKpiUnit.parent) {
            parentKPI = createKpiUnit.parent;
        }

        if (!state.parent) {
            if (!parentKPI) {
                parent = null;
            } else {
                items = parentKPI.kpis.filter(item => item.type === 0).map(x => {
                    return { value: x._id, text: x.name }
                });
                parent = items && items[0] && items[0].value;
            }
        } else {
            parent = state.parent;
        }

        if (isFormValidated()) {
            return await props.addTargetKPIUnit({
                name,
                parent,
                weight,
                criteria,
                target,
                unit,
                organizationalUnitKpiSetId: props.organizationalUnitKpiSetId,
            });
        }
    };

    const handleNameChange = (e) => {
        let value = e.target.value;
        let validation = ValidationHelper.validateName(props.translate, value);

        setState({
            ...state,
            errorOnName: validation.message,
            name: value,
        });
    };

    const handleParentChange = (value) => {
        setState({
            ...state,
            parent: value[0]
        });
    };

    const handleCriteriaChange = (value, imgs) => {
        let validation = ValidationHelper.validateDescription(props.translate, value);

        setState({
            ...state,
            errorOnCriteria: validation.message,
            criteria: value,
        });
    }

    const handleWeightChange = (e) => {
        const { translate } = props;

        let value = e.target.value;
        let validation = ValidationHelper.validateNumberInput(translate, value, 0, 100);

        setState({
            ...state,
            errorOnWeight: validation.message,
            weight: value,
        });
    }

    const handleChangeTarget = (e) => {
        let value = e.target.value;
        setState({
            ...state,
            target: value,
        });
    }

    const handleChangeUnit = (e) => {
        let value = e.target.value;
        setState({
            ...state,
            unit: value,
        });
    }


    const isFormValidated = () => {
        const { translate } = props;
        const { name, criteria, weight } = state;

        let validatateName, validateCriteria, validateWeight, result;

        validatateName = ValidationHelper.validateName(translate, name);
        validateCriteria = ValidationHelper.validateDescription(translate, criteria);
        validateWeight = ValidationHelper.validateNumberInput(translate, weight, 0, 100);

        result = validatateName.status && validateCriteria.status && validateWeight.status;
        return result;
    }

    if (createKpiUnit.parent) {
        parentKPI = createKpiUnit.parent;
    }

    let items;
    if (!parentKPI) {
        items = [];
    } else {
        items = parentKPI.kpis.filter(item => item.type === 0).map(x => {
            return { value: x._id, text: x.name };
        });
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-add-target" isLoading={adding}
                formID="form-add-target"
                title={translate('kpi.organizational_unit.create_organizational_unit_kpi_modal.create_organizational_unit_kpi')}
                msg_success={translate('kpi.organizational_unit.create_organizational_unit_kpi_modal.success')}
                msg_failure={translate('kpi.organizational_unit.create_organizational_unit_kpi_modal.failure')}
                func={onAddItem}
                disableSubmit={!isFormValidated()}>

                {/* Form thêm mục tiêu */}
                <form id="form-add-target" onSubmit={() => onAddItem(translate('kpi.organizational_unit.create_organizational_unit_kpi_modal.success'))}>
                    {/* Tên mục tiêu */}
                    <div className={`form-group ${!errorOnName ? "" : "has-error"}`}>
                        <label>{translate('kpi.organizational_unit.create_organizational_unit_kpi_modal.name')}<span className="text-red">*</span></label>
                        <input type="text" className="form-control" value={name} onChange={handleNameChange} />
                        <ErrorLabel content={errorOnName} />
                    </div>

                    {/* Mục tiêu cha */}
                    {(organizationalUnit && organizationalUnit.parent) && (items.length !== 0) &&
                        <div className="form-group">
                            <label>{translate('kpi.organizational_unit.create_organizational_unit_kpi_modal.parents')}</label>
                            <SelectBox
                                id={`parent-target-add`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={items}
                                onChange={handleParentChange}
                                multiple={false}
                            />
                        </div>
                    }

                    {/* Tiêu chí đánh giá */}
                    <div className={`form-group ${!errorOnCriteria ? "" : "has-error"}`}>
                        <label>{translate('kpi.organizational_unit.create_organizational_unit_kpi_modal.evaluation_criteria')}<span className="text-red">*</span></label>
                        <QuillEditor
                            id={'create-organizational-unit-kpi'}
                            getTextData={handleCriteriaChange}
                            toolbar={false}
                        />
                        <ErrorLabel content={errorOnCriteria} />
                    </div>

                    {/* Trọng số */}
                    <div className={`form-group ${!errorOnWeight ? "" : "has-error"}`}>
                        <label>{translate('kpi.organizational_unit.create_organizational_unit_kpi_modal.weight')}<span className="text-red">*</span></label>
                        <input type="number" className="form-control" value={weight} onChange={handleWeightChange} />
                        <ErrorLabel content={errorOnWeight} />
                    </div>

                    {/* Chỉ tiêu  */}
                    <div className='form-group'>
                        <label>Chỉ tiêu</label>
                        <input type="number" min={0} className="form-control" value={target} onChange={handleChangeTarget} />
                    </div>

                    {/* Đơn vị  */}
                    <div className='form-group'>
                        <label>Đơn vị</label>
                        <input type="text" className="form-control" value={unit} onChange={handleChangeUnit} />
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
    addTargetKPIUnit: createUnitKpiActions.addTargetKPIUnit
};

const connectedOrganizationalUnitKpiAddTargetModal = connect(mapState, actionCreators)(withTranslate(OrganizationalUnitKpiAddTargetModal));
export { connectedOrganizationalUnitKpiAddTargetModal as OrganizationalUnitKpiAddTargetModal };
