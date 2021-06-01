import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ErrorLabel, SelectMulti } from '../../../../../common-components';

function UnitCreateForm(props) {
    const EMPTY_UNIT = {
        name: '',
        conversionRate: '',
        description: ''
    };

    const [state, setState] = useState({
        unit: Object.assign({}, EMPTY_UNIT),
        listUnit: props.initialData,
        editInfo: false,
        listUnitSelected: []
    })

    const getListUnitArray = () => {
        let listUnitArray = [];
        if (state.baseUnit !== "") {
            listUnitArray.push({
                value: state.baseUnit,
                text: state.baseUnit,
                conversionRate: 1
            })
        }

        if (props.initialData.length) {
            props.initialData.map((unit, index) => {
                listUnitArray.push({
                    value: index,
                    text: unit.name,
                    conversionRate: parseFloat(unit.conversionRate),
                });
            });

        }
        return listUnitArray;
    }

    const handleSelectMultiBaseUnit = (value) => {
        if (value.length == 0) {
            value = null;
        }
        validateMultiBaseUnit(value, true)
    }

    const validateMultiBaseUnit = (value, willUpdateState) => {
        console.log(value);
        let msg = undefined;

        const { translate } = props;
        if (!value) {
            msg = translate('manage_warehouse.good_management.choose_base_unit')
        }
        if (willUpdateState) {
            let packingRule = "";
            if (value) {
                packingRule = convertToPackingRule(value);
            }
            if (packingRule !== "") {
                setState({
                    ...state,
                    packingRule: packingRule,
                    listUnitSelected: value,
                    errorOnBaseUnit: msg
                });
            } else {
                setState({
                    ...state,
                    listUnitSelected: value,
                    packingRule: packingRule,
                    errorOnBaseUnit: value ? translate("manage_warehouse.good_management.error_packing_rule") : msg
                })
            }

            props.onDataChange(state.listUnit);
            // props.onDataChange(state.listUnit, state.packingRule);

        }

        return msg
    }

    // Hàm sắp xếp subListUnitArray theo thứ tự conversion rate tăng dần
    const sortListUnitArray = (array) => {
        for (let i = 0; i < array.length; i++) {
            for (let j = i + 1; j < array.length; j++) {
                if (array[i].conversionRate > array[j].conversionRate) {
                    let tmp = array[i];
                    array[i] = array[j];
                    array[j] = tmp
                }
            }
        }
        return array;
    }

    // Hàm này validate xem list unit có hợp lệ để tạo thành một packingRule hay không
    // Input là 1 array chứa các phần tử có conversion rate tăng dần
    const validateListUnitArray = (array) => {
        for (let i = 0; i < array.length - 1; i++) {
            let rate = array[i + 1].conversionRate / array[i].conversionRate;
            if (!Number.isInteger(rate)) {
                return false;
            }
        }
        return true;
    }


    const convertToPackingRule = (value) => {
        let packingRule = '';
        let listUnitArray = getListUnitArray();
        let subListUnitArray = [];
        for (let i = 0; i < listUnitArray.length; i++) {
            for (let j = 0; j < value.length; j++) {
                if (listUnitArray[i].value == value[j]) {
                    subListUnitArray.push(listUnitArray[i]);
                    break;
                }
            }
        }
        let sortListUnitArray = sortListUnitArray(subListUnitArray);
        let resultValidate = validateListUnitArray(sortListUnitArray);
        // Nếu chuỗi tạo thành được 1 packingRule
        if (resultValidate) {
            let maxIndexOfArray = sortListUnitArray.length - 1;
            packingRule += sortListUnitArray[maxIndexOfArray].text;
            if (maxIndexOfArray > 0) {
                for (let i = maxIndexOfArray - 1; i >= 0; i--) {
                    packingRule += " x " + (sortListUnitArray[i + 1].conversionRate / sortListUnitArray[i].conversionRate) + sortListUnitArray[i].text
                }

            }
        }
        return packingRule;
    }

    useEffect(() => {
        setState({
            ...state,
            baseUnit: props.baseUnit,
            id: props.id,
            packingRule: props.packingRule,
            listUnit: props.initialData
        })
    }, [props.id, props.baseUnit])

    const handleUnitNameChange = (e) => {
        let value = e.target.value;
        validateUnitName(value, true);
    }

    const validateUnitName = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate('manage_warehouse.category_management.validate_name');
        }
        if (willUpdateState) {
            state.unit.name = value;
            setState({
                ...state,
                errorOnUnitName: msg,
            });
        }
        return msg === undefined;
    }

    const handleConversionRateChange = (e) => {
        let value = e.target.value;
        validateConversionRate(value, true);
    }

    const validateConversionRate = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate('manage_warehouse.category_management.validate_name');
        }
        if (willUpdateState) {
            state.unit.conversionRate = value;
            setState({
                ...state,
                errorOnUnitConversionRate: msg,
            });
        }
        return msg === undefined;
    }

    const handleDescriptionChange = (e) => {
        let value = e.target.value;
        state.unit.description = value;
        setState({
            ...state
        })
    }

    const isUnitsValidated = () => {
        let result =
            validateUnitName(state.unit.name, false) &&
            validateConversionRate(state.unit.conversionRate, false)
        return result
    }

    const handleAddUnit = async (e) => {
        e.preventDefault();
        const listUnit = [...(state.listUnit), state.unit];

        await setState({
            ...state,
            listUnit: listUnit,
            unit: Object.assign({}, EMPTY_UNIT),
        })
        props.onDataChange(state.listUnit);
        // props.onDataChange(state.listUnit, state.packingRule);
    }

    const handleEditUnit = async (unit, index) => {
        setState({
            ...state,
            editInfo: true,
            indexInfo: index,
            unit: Object.assign({}, unit)
        })
    }

    const handleSaveEditUnit = async (e) => {
        e.preventDefault();
        const { indexInfo, listUnit } = state;
        let newListUnit;
        if (listUnit) {
            newListUnit = listUnit.map((item, index) => {
                return (index === indexInfo) ? state.unit : item;
            })
        }
        await setState({
            ...state,
            listUnit: newListUnit,
            editInfo: false,
            unit: Object.assign({}, EMPTY_UNIT),
        })
        // props.onDataChange(state.listUnit, state.packingRule);
        props.onDataChange(state.listUnit);
    }

    const handleCancelEditUnit = async (e) => {
        e.preventDefault();
        setState({
            ...state,
            editInfo: false,
            unit: Object.assign({}, EMPTY_UNIT)
        })
    }

    const handleClearUnit = async (e) => {
        e.preventDefault();
        setState({
            ...state,
            unit: Object.assign({}, EMPTY_UNIT)
        })
    }

    const handleDeleteUnit = async (index) => {
        const { listUnit } = state;
        let newListUnit;
        if (listUnit) {
            newListUnit = listUnit.filter((item, x) => index !== x);
        }
        await setState({
            ...state,
            listUnit: newListUnit
        })

        // props.onDataChange(state.listUnit, state.packingRule);
        props.onDataChange(state.listUnit);
    }

    const { translate, id } = props;
    let { listUnit, unit, errorOnUnitName, errorOnConversionRate, description, conversionRate, errorOnBaseUnit, listUnitSelected, packingRule } = state;
    return (

        <fieldset className="scheduler-border">
            <legend className="scheduler-border">{translate('manage_warehouse.good_management.unit')}</legend>

            <div className={`form-group ${!errorOnUnitName ? "" : "has-error"}`}>
                <label className="control-label">{translate('manage_warehouse.good_management.unit_name')}</label>
                <div>
                    <input type="text" className="form-control" placeholder={translate('manage_warehouse.good_management.unit_name')} value={unit.name} onChange={handleUnitNameChange} />
                </div>
                <ErrorLabel content={errorOnUnitName} />
            </div>

            <div className={`form-group ${!errorOnConversionRate ? "" : "has-error"}`}>
                <label className="control-label">{translate('manage_warehouse.good_management.conversion_rate')}</label>
                <div>
                    <input type="number" className="form-control" placeholder={translate('manage_warehouse.good_management.conversion_rate')} value={unit.conversionRate} onChange={handleConversionRateChange} />
                </div>
                <ErrorLabel content={errorOnConversionRate} />
            </div>

            <div className="form-group">
                <label className="control-label">{translate('manage_warehouse.good_management.description')}</label>
                <div>
                    <textarea type="number" className="form-control" placeholder={translate('manage_warehouse.good_management.description')} value={unit.description} onChange={handleDescriptionChange} />
                </div>
            </div>

            <div className="pull-right" style={{ marginBottom: "10px" }}>
                {state.editInfo ?
                    <React.Fragment>
                        <button className="btn btn-success" onClick={handleCancelEditUnit} style={{ marginLeft: "10px" }}>{translate('task_template.cancel_editing')}</button>
                        <button className="btn btn-success" disabled={!isUnitsValidated()} onClick={handleSaveEditUnit} style={{ marginLeft: "10px" }}>{translate('task_template.save')}</button>
                    </React.Fragment> :
                    <button className="btn btn-success" style={{ marginLeft: "10px" }} disabled={!isUnitsValidated()} onClick={handleAddUnit}>{translate('task_template.add')}</button>
                }
                <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={handleClearUnit}>{translate('task_template.delete')}</button>
            </div>

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th title={translate('manage_warehouse.good_management.name')}>{translate('manage_warehouse.good_management.name')}</th>
                        <th title={translate('manage_warehouse.good_management.conversion_rate')}>{translate('manage_warehouse.good_management.conversion_rate')}</th>
                        <th title={translate('manage_warehouse.good_management.description')}>{translate('manage_warehouse.good_management.description')}</th>
                        <th>{translate('task_template.action')}</th>
                    </tr>
                </thead>
                <tbody id={`unit-create-good${id}`}>
                    {
                        (typeof listUnit === 'undefined' || listUnit.length === 0) ? <tr><td colSpan={4}><center>{translate('task_template.no_data')}</center></td></tr> :
                            listUnit.map((item, index) =>
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>{item.conversionRate}</td>
                                    <td>{item.description}</td>
                                    <td>
                                        <a href="#abc" className="edit" title={translate('general.edit')} onClick={() => handleEditUnit(item, index)}><i className="material-icons"></i></a>
                                        <a href="#abc" className="delete" title={translate('general.delete')} onClick={() => handleDeleteUnit(index)}><i className="material-icons"></i></a>
                                    </td>
                                </tr>
                            )
                    }
                </tbody>
            </table>
            {/* <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                    <div className={`form-group ${!errorOnBaseUnit ? "" : "has-error"}`}>
                        <label style={{ width: 'auto' }}>{translate('manage_warehouse.good_management.packing_rule')} <span className="attention"> * </span></label>
                        <SelectMulti
                            id={`multi-select-base-unit-${id}`}
                            items={getListUnitArray()}
                            options={{ nonSelectedText: translate('manage_warehouse.good_management.non_choose_base_unit'), allSelectedText: translate('manage_warehouse.good_management.choose_base_unit_all') }}
                            onChange={handleSelectMultiBaseUnit}
                        >
                        </SelectMulti>

                    </div>
                </div>
                <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                    <div className={`form-group ${!errorOnBaseUnit ? "" : "has-error"}`}>
                        <ErrorLabel content={errorOnBaseUnit} />
                        {
                            packingRule || !errorOnBaseUnit && listUnitSelected.length > 0 && packingRule
                        }
                    </div>
                </div> */}

        </fieldset >
    )
}

export default connect(null, null)(withTranslate(UnitCreateForm));