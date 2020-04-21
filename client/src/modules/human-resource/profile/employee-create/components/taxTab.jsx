import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DatePicker, ErrorLabel } from '../../../../../common-components';
import { EmployeeCreateValidator } from './employeeCreateValidator';

class TabTaxContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    // Function lưu các trường thông tin vào state
    handleChange = (e) => {
        const { name, value } = e.target;
        this.props.handleChange(name, value);
    }
    // Function Bắt sự kiện thay đổi người đại diện
    handleUserTaxChange = (e) => {
        const { value } = e.target;
        this.validateUserTax(value, true);
    }
    validateUserTax = (value, willUpdateState = true) => {
        let msg = EmployeeCreateValidator.validateUserTax(value, this.props.translate)
        if (willUpdateState) {

            this.setState(state => {
                return {
                    ...state,
                    errorOnUserTax: msg,
                    userTax: value,
                }
            });
            this.props.handleChange("userTax", value);
        }
        return msg === undefined;
    }
    // Function Bắt sự kiện thay đổi mã số thuế
    handleNumberTaxChange = (e) => {
        const { value } = e.target;
        this.validateTaxNumber(value, true);
    }
    validateTaxNumber = (value, willUpdateState = true) => {
        let msg = EmployeeCreateValidator.validateTaxNumber(value, this.props.translate)
        if (willUpdateState) {

            this.setState(state => {
                return {
                    ...state,
                    errorOnNumberTax: msg,
                    numberTax: value,
                }
            });
            this.props.handleChange("numberTax", value);
        }
        return msg === undefined;
    }
    // Function Bắt sự kiện thay đổi người đại diện
    handleUnitTaxChange = (e) => {
        const { value } = e.target;
        this.validateUnitTax(value, true);
    }
    validateUnitTax = (value, willUpdateState = true) => {
        let msg = EmployeeCreateValidator.validateUnitTax(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnUnitTax: msg,
                    unitTax: value,
                }
            });
            this.props.handleChange("unitTax", value);
        }
        return msg === undefined;
    }
    // Function bắt sự kiện thay đổi ngày hoạt động
    handleStartDateChange = (value) => {
        this.validateStartTax(value, true);
    }
    validateStartTax = (value, willUpdateState = true) => {
        let msg = EmployeeCreateValidator.validateStartTax(value, this.props.translate)
        if (willUpdateState) {

            this.setState(state => {
                return {
                    ...state,
                    errorOnStartTax: msg,
                    startTax: value,
                }
            });
            this.props.handleChange("startTax", value);
        }
        return msg === undefined;
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                ATM: nextProps.employee.ATM,
                nameBank: nextProps.employee.addressBank,
                addressBank: nextProps.employee.addressBank,
                numberTax: nextProps.employee.numberTax,
                userTax: nextProps.employee.userTax,
                startTax: nextProps.employee.startTax,
                unitTax: nextProps.employee.unitTax,
                errorOnUserTax: undefined,
                errorOnStartTax: undefined,
                errorOnUnitTax: undefined,
                errorOnNumberTax: undefined,

            }
        } else {
            return null;
        }
    }
    render() {
        const { id, translate } = this.props;
        const { ATM, nameBank, addressBank, numberTax, userTax, startTax, unitTax,
            errorOnUserTax, errorOnStartTax, errorOnNumberTax, errorOnUnitTax } = this.state;
        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('manage_employee.bank_account')}</h4></legend>
                        <div className="row">
                            <div className="form-group col-md-4">
                                <label htmlFor="ATM">{translate('manage_employee.account_number')}</label>
                                <input type="text" className="form-control" name="ATM" value={ATM} onChange={this.handleChange} placeholder={translate('manage_employee.account_number')} autoComplete="off" />
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="nameBank">{translate('manage_employee.bank_name')}</label>
                                <input type="text" className="form-control" name="nameBank" value={nameBank} onChange={this.handleChange} placeholder={translate('manage_employee.bank_name')} autoComplete="off" />
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="addressBank">{translate('manage_employee.bank_branch')}</label>
                                <input type="text" className="form-control" name="addressBank" value={addressBank} onChange={this.handleChange} placeholder={translate('manage_employee.bank_branch')} autoComplete="off" />
                            </div>
                        </div>
                    </fieldset>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border" ><h4 className="box-title">{translate('manage_employee.personal_income_tax')}</h4></legend>
                        <div className={`form-group ${errorOnNumberTax === undefined ? "" : "has-error"}`}>
                            <label htmlFor="numberTax">{translate('manage_employee.tax_number')}<span className="text-red">*</span></label>
                            <input type="number" className="form-control" name="numberTax" value={numberTax} onChange={this.handleNumberTaxChange} placeholder={translate('manage_employee.tax_number')} autoComplete="off" />
                            <ErrorLabel content={errorOnNumberTax} />
                        </div>
                        <div className={`form-group ${errorOnUserTax === undefined ? "" : "has-error"}`}>
                            <label htmlFor="userTax">{translate('manage_employee.representative')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="userTax" value={userTax} onChange={this.handleUserTaxChange} placeholder={translate('manage_employee.representative')} autoComplete="off" />
                            <ErrorLabel content={errorOnUserTax} />
                        </div>
                        <div className={`form-group ${errorOnStartTax === undefined ? "" : "has-error"}`}>
                            <label htmlFor="startDate">{translate('manage_employee.day_active')}<span className="text-red">*</span></label>
                            <DatePicker
                                id={`startTax-date-${id}`}
                                value={startTax}
                                onChange={this.handleStartDateChange}
                            />
                            <ErrorLabel content={errorOnStartTax} />
                        </div>
                        <div className={`form-group ${errorOnUnitTax === undefined ? "" : "has-error"}`}>
                            <label htmlFor="unitTax">{translate('manage_employee.managed_by')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="unitTax" value={unitTax} onChange={this.handleUnitTaxChange} placeholder={translate('manage_employee.managed_by')} autoComplete="off" />
                            <ErrorLabel content={errorOnUnitTax} />
                        </div>
                    </fieldset>
                </div>
            </div >
        );
    }
};

const tabGeneral = connect(null, null)(withTranslate(TabTaxContent));
export { tabGeneral as TabTaxContent };