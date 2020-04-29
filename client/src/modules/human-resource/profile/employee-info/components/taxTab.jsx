import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class TaxTab extends Component {
    constructor(props) {
        super(props);
        this.state = {};
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
            }
        } else {
            return null;
        }
    }
    render() {
        const { id, translate } = this.props;
        const { atmNumber, bankName, bankAddress, taxNumber, taxRepresentative, taxDateOfIssue, taxAuthority } = this.state;
        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('manage_employee.bank_account')}</h4></legend>
                        <div className="row">
                            <div className="form-group col-md-4">
                                <strong>{translate('manage_employee.account_number')}&emsp; </strong>
                                {atmNumber}
                            </div>
                            <div className="form-group col-md-4">
                                <strong>{translate('manage_employee.bank_name')}&emsp; </strong>
                                {bankName}
                            </div>
                            <div className="form-group col-md-4">
                                <strong>{translate('manage_employee.bank_branch')}&emsp; </strong>
                                {bankAddress}
                            </div>
                        </div>
                    </fieldset>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('manage_employee.personal_income_tax')}</h4></legend>
                        <div className="form-group">
                            <strong>{translate('manage_employee.tax_number')}&emsp; </strong>
                            {taxNumber}
                        </div>
                        <div className="form-group">
                            <strong>{translate('manage_employee.representative')}&emsp; </strong>
                            {taxRepresentative}
                        </div>
                        <div className="form-group">
                            <strong>{translate('manage_employee.day_active')}&emsp; </strong>
                            {taxDateOfIssue}
                        </div>
                        <div className="form-group">
                            <strong>{translate('manage_employee.managed_by')}&emsp; </strong>
                            {taxAuthority}
                        </div>
                    </fieldset>
                </div>
            </div>
        );
    }
};

const tabGeneral = connect(null, null)(withTranslate(TaxTab));
export { tabGeneral as TaxTab };