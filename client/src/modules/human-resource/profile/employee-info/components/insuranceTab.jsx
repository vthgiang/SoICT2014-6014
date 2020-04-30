import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class InsurranceTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                socialInsuranceDetails: nextProps.socialInsuranceDetails,
                healthInsuranceNumber: nextProps.employee.healthInsuranceNumber,
                healthInsuranceStartDate: nextProps.employee.healthInsuranceStartDate,
                healthInsuranceEndDate: nextProps.employee.healthInsuranceEndDate,
                socialInsuranceNumber: nextProps.employee.socialInsuranceNumber,
            }
        } else {
            return null;
        }
    }


    render() {
        const { id, translate } = this.props;
        const { healthInsuranceNumber, healthInsuranceStartDate, healthInsuranceEndDate, socialInsuranceNumber, socialInsuranceDetails } = this.state;
        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('manage_employee.bhyt')}</h4></legend>
                        <div className="row">
                            <div className="form-group col-md-4" >
                                <strong>{translate('manage_employee.number_BHYT')}&emsp; </strong>
                                {healthInsuranceNumber}
                            </div>
                            <div className="form-group col-md-4" >
                                <strong>{translate('manage_employee.start_date')}&emsp; </strong>
                                {healthInsuranceStartDate}
                            </div>
                            <div className="form-group col-md-4" >
                                <strong>{translate('manage_employee.end_date_certificate')}&emsp; </strong>
                                {healthInsuranceEndDate}
                            </div>
                        </div>
                    </fieldset>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('manage_employee.bhxh')}</h4></legend>
                        <div className="form-group">
                            <strong>{translate('manage_employee.number_BHXH')}&emsp; </strong>
                            {socialInsuranceNumber}
                        </div>
                        <h4 className="col-md-6" style={{ paddingLeft: 0, fontSize: 16 }}>{translate('manage_employee.bhxh_process')}:</h4>
                        <table className="table table-striped table-bordered table-hover " style={{ marginBottom: 0 }} >
                            <thead>
                                <tr>
                                    <th>{translate('manage_employee.from_month_year')}</th>
                                    <th>{translate('manage_employee.to_month_year')}</th>
                                    <th>{translate('manage_employee.unit')}</th>
                                    <th>{translate('table.position')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    (typeof socialInsuranceDetails !== 'undefined' && socialInsuranceDetails.length !== 0) &&
                                        socialInsuranceDetails.map((x, index) => (
                                            <tr key={index}>
                                                <td>{x.startDate}</td>
                                                <td>{x.endDate}</td>
                                                <td>{x.company}</td>
                                                <td>{x.position}</td>
                                            </tr>
                                        ))
                                }
                            </tbody>
                        </table>
                        {
                            (typeof socialInsuranceDetails === 'undefined' || socialInsuranceDetails === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </fieldset>
                </div>
            </div>
        );
    }
};

const tabInsurrance = connect(null, null)(withTranslate(InsurranceTab));
export { tabInsurrance as InsurranceTab };