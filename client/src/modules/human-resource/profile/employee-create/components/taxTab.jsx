import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DatePicker, ErrorLabel } from '../../../../../common-components';
import { EmployeeCreateValidator } from './employeeCreateValidator';

class TaxTab extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    // Function format dữ liệu Date thành string
    formatDate(date, monthYear = false) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        if (monthYear === true) {
            return [month, year].join('-');
        } else return [day, month, year].join('-');
    }
    // Function lưu các trường thông tin vào state
    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        })
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
                    errorOnTaxRepresentative: msg,
                    taxRepresentative: value,
                }
            });
            this.props.handleChange("taxRepresentative", value);
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
                    errorOnTaxNumber: msg,
                    taxNumber: value,
                }
            });
            this.props.handleChange("taxNumber", value);
        }
        return msg === undefined;
    }
    // Function Bắt sự kiện thay đổi tổ chức quản lý
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
                    errorOnTaxAuthority: msg,
                    taxAuthority: value,
                }
            });
            this.props.handleChange("taxAuthority", value);
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
                    errorOnTaxDateOfIssue: msg,
                    taxDateOfIssue: value,
                }
            });
            this.props.handleChange("taxDateOfIssue", value);
        }
        return msg === undefined;
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                atmNumber: nextProps.employee.atmNumber,
                bankName: nextProps.employee.bankName,
                bankAddress: nextProps.employee.bankAddress,
                taxNumber: nextProps.employee.taxNumber,
                taxRepresentative: nextProps.employee.taxRepresentative,
                taxDateOfIssue: nextProps.employee.taxDateOfIssue,
                taxAuthority: nextProps.employee.taxAuthority,

                errorOnTaxRepresentative: undefined,
                errorOnTaxDateOfIssue: undefined,
                errorOnTaxAuthority: undefined,
                errorOnTaxNumber: undefined,

            }
        } else {
            return null;
        }
    }
    render() {
        const { id, translate } = this.props;
        const { atmNumber, bankName, bankAddress, taxNumber, taxRepresentative, taxDateOfIssue, taxAuthority,
            errorOnTaxRepresentative, errorOnTaxDateOfIssue, errorOnTaxNumber, errorOnTaxAuthority } = this.state;
        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('manage_employee.bank_account')}</h4></legend>
                        <div className="row">
                            <div className="form-group col-md-4">
                                <label >{translate('manage_employee.account_number')}</label>
                                <input type="text" className="form-control" name="atmNumber" value={atmNumber} onChange={this.handleChange} placeholder={translate('manage_employee.account_number')} autoComplete="off" />
                            </div>
                            <div className="form-group col-md-4">
                                <label >{translate('manage_employee.bank_name')}</label>
                                <input type="text" className="form-control" name="bankName" value={bankName} onChange={this.handleChange} placeholder={translate('manage_employee.bank_name')} autoComplete="off" />
                            </div>
                            <div className="form-group col-md-4">
                                <label >{translate('manage_employee.bank_branch')}</label>
                                <input type="text" className="form-control" name="bankAddress" value={bankAddress} onChange={this.handleChange} placeholder={translate('manage_employee.bank_branch')} autoComplete="off" />
                            </div>
                        </div>
                    </fieldset>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border" ><h4 className="box-title">{translate('manage_employee.personal_income_tax')}</h4></legend>
                        <div className={`form-group ${errorOnTaxNumber === undefined ? "" : "has-error"}`}>
                            <label >{translate('manage_employee.tax_number')}<span className="text-red">*</span></label>
                            <input type="number" className="form-control" name="taxNumber" value={taxNumber} onChange={this.handleNumberTaxChange} placeholder={translate('manage_employee.tax_number')} autoComplete="off" />
                            <ErrorLabel content={errorOnTaxNumber} />
                        </div>
                        <div className={`form-group ${errorOnTaxRepresentative === undefined ? "" : "has-error"}`}>
                            <label >{translate('manage_employee.representative')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="taxRepresentative" value={taxRepresentative} onChange={this.handleUserTaxChange} placeholder={translate('manage_employee.representative')} autoComplete="off" />
                            <ErrorLabel content={errorOnTaxRepresentative} />
                        </div>
                        <div className={`form-group ${errorOnTaxDateOfIssue === undefined ? "" : "has-error"}`}>
                            <label htmlFor="startDate">{translate('manage_employee.day_active')}<span className="text-red">*</span></label>
                            <DatePicker
                                id={`taxDateOfIssue-${id}`}
                                value={this.formatDate(taxDateOfIssue)}
                                onChange={this.handleStartDateChange}
                            />
                            <ErrorLabel content={errorOnTaxDateOfIssue} />
                        </div>
                        <div className={`form-group ${errorOnTaxAuthority === undefined ? "" : "has-error"}`}>
                            <label>{translate('manage_employee.managed_by')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="taxAuthority" value={taxAuthority} onChange={this.handleUnitTaxChange} placeholder={translate('manage_employee.managed_by')} autoComplete="off" />
                            <ErrorLabel content={errorOnTaxAuthority} />
                        </div>
                    </fieldset>
                </div>
            </div >
        );
    }
};

const taxTab = connect(null, null)(withTranslate(TaxTab));
export { taxTab as TaxTab };