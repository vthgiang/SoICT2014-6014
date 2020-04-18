import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class TabTaxViewContent extends Component {
    constructor(props) {
        super(props);
        this.state = {};
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
                                <strong>{translate('manage_employee.account_number')}&emsp; </strong>
                                {ATM}
                            </div>
                            <div className="form-group col-md-4">
                                <strong>{translate('manage_employee.bank_name')}&emsp; </strong>
                                {nameBank}
                            </div>
                            <div className="form-group col-md-4">
                                <strong>{translate('manage_employee.bank_branch')}&emsp; </strong>
                                {addressBank}
                            </div>
                        </div>
                    </fieldset>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('manage_employee.personal_income_tax')}</h4></legend>
                        <div className="form-group">
                            <strong>{translate('manage_employee.tax_number')}&emsp; </strong>
                            {numberTax}
                        </div>
                        <div className="form-group">
                            <strong>{translate('manage_employee.representative')}&emsp; </strong>
                            {userTax}
                        </div>
                        <div className="form-group">
                            <strong>{translate('manage_employee.day_active')}&emsp; </strong>
                            {startTax}
                        </div>
                        <div className="form-group">
                            <strong>{translate('manage_employee.managed_by')}&emsp; </strong>
                            {unitTax}
                        </div>
                    </fieldset>
                </div>
            </div>
        );
    }
};

const tabGeneral = connect(null, null)(withTranslate(TabTaxViewContent));
export { tabGeneral as TabTaxViewContent };