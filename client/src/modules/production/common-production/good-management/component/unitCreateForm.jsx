import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ErrorLabel, SelectMulti } from '../../../../../common-components';

class UnitCreateForm extends Component {
    constructor(props) {
        super(props);
        this.EMPTY_UNIT = {
            name: '',
            conversionRate: '',
            description: ''
        };

        this.state = {
            unit: Object.assign({}, this.EMPTY_UNIT),
            listUnit: this.props.initialData,
            editInfo: false,
            listUnitSelected: []
        }
    }

    getListUnitArray = () => {
        let listUnitArray = [];
        if (this.state.baseUnit !== "") {
            listUnitArray.push({
                value: this.state.baseUnit,
                text: this.state.baseUnit,
                conversionRate: 1
            })
        }

        if (this.props.initialData.length) {
            this.props.initialData.map((unit, index) => {
                listUnitArray.push({
                    value: index,
                    text: unit.name,
                    conversionRate: parseFloat(unit.conversionRate),
                });
            });

        }
        return listUnitArray;
    }

    handleSelectMultiBaseUnit = (value) => {
        if (value.length == 0) {
            value = null;
        }
        this.validateMultiBaseUnit(value, true)
    }

    validateMultiBaseUnit = (value, willUpdateState) => {
        console.log(value);
        let msg = undefined;

        const { translate } = this.props;
        if (!value) {
            msg = translate('manage_warehouse.good_management.choose_base_unit')
        }
        if (willUpdateState) {
            let packingRule = "";
            if (value) {
                packingRule = this.convertToPackingRule(value);
            }
            if (packingRule !== "") {
                this.setState(state => ({
                    ...state,
                    packingRule: packingRule,
                    listUnitSelected: value,
                    errorOnBaseUnit: msg
                }));
            } else {
                this.setState(state => ({
                    ...state,
                    listUnitSelected: value,
                    packingRule: packingRule,
                    errorOnBaseUnit: value ? translate("manage_warehouse.good_management.error_packing_rule") : msg
                }))
            }

            this.props.onDataChange(this.state.listUnit);
            // this.props.onDataChange(this.state.listUnit, this.state.packingRule);

        }

        return msg
    }

    // Hàm sắp xếp subListUnitArray theo thứ tự conversion rate tăng dần
    sortListUnitArray = (array) => {
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
    validateListUnitArray = (array) => {
        for (let i = 0; i < array.length - 1; i++) {
            let rate = array[i + 1].conversionRate / array[i].conversionRate;
            if (!Number.isInteger(rate)) {
                return false;
            }
        }
        return true;
    }


    convertToPackingRule = (value) => {
        let packingRule = '';
        let listUnitArray = this.getListUnitArray();
        let subListUnitArray = [];
        for (let i = 0; i < listUnitArray.length; i++) {
            for (let j = 0; j < value.length; j++) {
                if (listUnitArray[i].value == value[j]) {
                    subListUnitArray.push(listUnitArray[i]);
                    break;
                }
            }
        }
        let sortListUnitArray = this.sortListUnitArray(subListUnitArray);
        let resultValidate = this.validateListUnitArray(sortListUnitArray);
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


    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id || nextProps.baseUnit !== prevState.baseUnit) {
            return {
                ...prevState,
                baseUnit: nextProps.baseUnit,
                id: nextProps.id,
                packingRule: nextProps.packingRule,
                listUnit: nextProps.initialData
            }
        }
        else {
            return null;
        }
    }

    handleUnitNameChange = (e) => {
        let value = e.target.value;
        this.validateUnitName(value, true);
    }

    validateUnitName = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate('manage_warehouse.category_management.validate_name');
        }
        if (willUpdateState) {
            this.state.unit.name = value;
            this.setState(state => {
                return {
                    ...state,
                    errorOnUnitName: msg,
                }
            });
        }
        return msg === undefined;
    }

    handleConversionRateChange = (e) => {
        let value = e.target.value;
        this.validateConversionRate(value, true);
    }

    validateConversionRate = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate('manage_warehouse.category_management.validate_name');
        }
        if (willUpdateState) {
            this.state.unit.conversionRate = value;
            this.setState(state => {
                return {
                    ...state,
                    errorOnUnitConversionRate: msg,
                }
            });
        }
        return msg === undefined;
    }

    handleDescriptionChange = (e) => {
        let value = e.target.value;
        this.state.unit.description = value;
        this.setState(state => {
            return {
                ...state
            }
        })
    }

    isUnitsValidated = () => {
        let result =
            this.validateUnitName(this.state.unit.name, false) &&
            this.validateConversionRate(this.state.unit.conversionRate, false)
        return result
    }

    handleAddUnit = async (e) => {
        e.preventDefault();
        await this.setState(state => {
            const listUnit = [...(this.state.listUnit), state.unit];
            return {
                ...state,
                listUnit: listUnit,
                unit: Object.assign({}, this.EMPTY_UNIT),
            }
        })
        this.props.onDataChange(this.state.listUnit);
        // this.props.onDataChange(this.state.listUnit, this.state.packingRule);
    }

    handleEditUnit = async (unit, index) => {
        this.setState(state => {
            return {
                ...state,
                editInfo: true,
                indexInfo: index,
                unit: Object.assign({}, unit)
            }
        })
    }

    handleSaveEditUnit = async (e) => {
        e.preventDefault();
        const { indexInfo, listUnit } = this.state;
        let newListUnit;
        if (listUnit) {
            newListUnit = listUnit.map((item, index) => {
                return (index === indexInfo) ? this.state.unit : item;
            })
        }
        await this.setState(state => {
            return {
                ...state,
                listUnit: newListUnit,
                editInfo: false,
                unit: Object.assign({}, this.EMPTY_UNIT),
            }
        })
        // this.props.onDataChange(this.state.listUnit, this.state.packingRule);
        this.props.onDataChange(this.state.listUnit);
    }

    handleCancelEditUnit = async (e) => {
        e.preventDefault();
        this.setState(state => {
            return {
                ...state,
                editInfo: false,
                unit: Object.assign({}, this.EMPTY_UNIT)
            }
        })
    }

    handleClearUnit = async (e) => {
        e.preventDefault();
        this.setState(state => {
            return {
                ...state,
                unit: Object.assign({}, this.EMPTY_UNIT)
            }
        })
    }

    handleDeleteUnit = async (index) => {
        const { listUnit } = this.state;
        let newListUnit;
        if (listUnit) {
            newListUnit = listUnit.filter((item, x) => index !== x);
        }
        await this.setState(state => {
            return {
                ...state,
                listUnit: newListUnit
            }
        })

        // this.props.onDataChange(this.state.listUnit, this.state.packingRule);
        this.props.onDataChange(this.state.listUnit);
    }

    render() {
        const { translate, id } = this.props;
        let { listUnit, unit, errorOnUnitName, errorOnConversionRate, description, conversionRate, errorOnBaseUnit, listUnitSelected, packingRule } = this.state;
        return (

            <fieldset className="scheduler-border">
                <legend className="scheduler-border">{translate('manage_warehouse.good_management.unit')}</legend>

                <div className={`form-group ${!errorOnUnitName ? "" : "has-error"}`}>
                    <label className="control-label">{translate('manage_warehouse.good_management.unit_name')}</label>
                    <div>
                        <input type="text" className="form-control" placeholder={translate('manage_warehouse.good_management.unit_name')} value={unit.name} onChange={this.handleUnitNameChange} />
                    </div>
                    <ErrorLabel content={errorOnUnitName} />
                </div>

                <div className={`form-group ${!errorOnConversionRate ? "" : "has-error"}`}>
                    <label className="control-label">{translate('manage_warehouse.good_management.conversion_rate')}</label>
                    <div>
                        <input type="number" className="form-control" placeholder={translate('manage_warehouse.good_management.conversion_rate')} value={unit.conversionRate} onChange={this.handleConversionRateChange} />
                    </div>
                    <ErrorLabel content={errorOnConversionRate} />
                </div>

                <div className="form-group">
                    <label className="control-label">{translate('manage_warehouse.good_management.description')}</label>
                    <div>
                        <textarea type="number" className="form-control" placeholder={translate('manage_warehouse.good_management.description')} value={unit.description} onChange={this.handleDescriptionChange} />
                    </div>
                </div>

                <div className="pull-right" style={{ marginBottom: "10px" }}>
                    {this.state.editInfo ?
                        <React.Fragment>
                            <button className="btn btn-success" onClick={this.handleCancelEditUnit} style={{ marginLeft: "10px" }}>{translate('task_template.cancel_editing')}</button>
                            <button className="btn btn-success" disabled={!this.isUnitsValidated()} onClick={this.handleSaveEditUnit} style={{ marginLeft: "10px" }}>{translate('task_template.save')}</button>
                        </React.Fragment> :
                        <button className="btn btn-success" style={{ marginLeft: "10px" }} disabled={!this.isUnitsValidated()} onClick={this.handleAddUnit}>{translate('task_template.add')}</button>
                    }
                    <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={this.handleClearUnit}>{translate('task_template.delete')}</button>
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
                                            <a href="#abc" className="edit" title={translate('general.edit')} onClick={() => this.handleEditUnit(item, index)}><i className="material-icons"></i></a>
                                            <a href="#abc" className="delete" title={translate('general.delete')} onClick={() => this.handleDeleteUnit(index)}><i className="material-icons"></i></a>
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
                            items={this.getListUnitArray()}
                            options={{ nonSelectedText: translate('manage_warehouse.good_management.non_choose_base_unit'), allSelectedText: translate('manage_warehouse.good_management.choose_base_unit_all') }}
                            onChange={this.handleSelectMultiBaseUnit}
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
}

export default connect(null, null)(withTranslate(UnitCreateForm));
