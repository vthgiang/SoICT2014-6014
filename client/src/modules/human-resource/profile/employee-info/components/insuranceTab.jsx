import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class InsurranceTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm , false trả về ngày tháng năm
     */
    formatDate(date, monthYear = false) {
        if (date) {
            let d = new Date(date),
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
        return date;

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
        const { translate } = this.props;

        const { id, healthInsuranceNumber, healthInsuranceStartDate, healthInsuranceEndDate, socialInsuranceNumber, socialInsuranceDetails } = this.state;

        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    {/* Thông tin bảo hiểm y tê */}
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('human_resource.profile.bhyt')}</h4></legend>
                        <div className="row">
                            {/* Mã bảo hiểm y tế */}
                            <div className="form-group col-md-4" >
                                <strong>{translate('human_resource.profile.number_BHYT')}&emsp; </strong>
                                {healthInsuranceNumber}
                            </div>
                            {/* Ngày có hiệu lực */}
                            <div className="form-group col-md-4" >
                                <strong>{translate('human_resource.profile.start_date')}&emsp; </strong>
                                {this.formatDate(healthInsuranceStartDate)}
                            </div>
                            {/* Ngày hết hiệu lực */}
                            <div className="form-group col-md-4" >
                                <strong>{translate('human_resource.profile.end_date_certificate')}&emsp; </strong>
                                {this.formatDate(healthInsuranceEndDate)}
                            </div>
                        </div>
                    </fieldset>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('human_resource.profile.bhxh')}</h4></legend>
                        {/* Mã bảo hiểm xã hội */}
                        <div className="form-group">
                            <strong>{translate('human_resource.profile.number_BHXH')}&emsp; </strong>
                            {socialInsuranceNumber}
                        </div>
                        <h4 className="col-md-6" style={{ paddingLeft: 0, fontSize: 16 }}>{translate('human_resource.profile.bhxh_process')}:</h4>
                        <table className="table table-striped table-bordered table-hover " style={{ marginBottom: 0 }} >
                            <thead>
                                <tr>
                                    <th>{translate('human_resource.profile.from_month_year')}</th>
                                    <th>{translate('human_resource.profile.to_month_year')}</th>
                                    <th>{translate('human_resource.profile.unit')}</th>
                                    <th>{translate('table.position')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    (socialInsuranceDetails && socialInsuranceDetails.length !== 0) &&
                                    socialInsuranceDetails.map((x, index) => (
                                        <tr key={index}>
                                            <td>{this.formatDate(x.startDate, true)}</td>
                                            <td>{this.formatDate(x.endDate, true)}</td>
                                            <td>{x.company}</td>
                                            <td>{x.position}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        {(!socialInsuranceDetails || socialInsuranceDetails.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>}
                    </fieldset>
                </div>
            </div>
        );
    }
};

const tabInsurrance = connect(null, null)(withTranslate(InsurranceTab));
export { tabInsurrance as InsurranceTab };