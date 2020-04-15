import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DatePicker } from '../../../../common-components';

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
    handleStartDateChange = (value) => {
        this.props.handleChange("startTax", value);
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
            }
        } else {
            return null;
        }
    }
    render() {
        const { id, translate } = this.props;
        const { ATM, nameBank, addressBank, numberTax, userTax, startTax, unitTax } = this.state;
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
                        <div className="form-group">
                            <label htmlFor="numberTax">{translate('manage_employee.tax_number')}<span className="text-red">*</span></label>
                            <input type="number" className="form-control" name="numberTax" value={numberTax} onChange={this.handleChange} placeholder={translate('manage_employee.tax_number')} autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="userTax">{translate('manage_employee.representative')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="userTax" value={userTax} onChange={this.handleChange} placeholder={translate('manage_employee.representative')} autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="startDate">{translate('manage_employee.day_active')}<span className="text-red">*</span></label>
                            <DatePicker
                                id={`startTax-date-${id}`}
                                value={startTax}
                                onChange={this.handleStartDateChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="unitTax">{translate('manage_employee.managed_by')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="unitTax" value={unitTax} onChange={this.handleChange} placeholder={translate('manage_employee.managed_by')} autoComplete="off" />
                        </div>
                    </fieldset>
                </div>
            </div >
        );
    }
};

const tabGeneral = connect(null, null)(withTranslate(TabTaxContent));
export { tabGeneral as TabTaxContent };