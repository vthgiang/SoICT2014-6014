import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import moment from 'moment';

class DepreciationTab extends Component {
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

        if (month.length < 2) {
            month = '0' + month;
        }

        if (day.length < 2) {
            day = '0' + day;
        }

        if (monthYear === true) {
            return [month, year].join('-');
        } else {
            return [day, month, year].join('-');
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                cost: nextProps.cost,
                residualValue: nextProps.residualValue,
                usefulLife: nextProps.usefulLife,
                startDepreciation: nextProps.startDepreciation,
                endDepreciation: nextProps.endDepreciation,
                depreciationType: nextProps.depreciationType,
                annualDepreciationValue: nextProps.annualDepreciationValue,
                monthlyDepreciationValue: nextProps.monthlyDepreciationValue,
            }
        } else {
            return null;
        }
    }

    addMonthToEndDepreciation = (day) => {
        if (day) {
            let { usefulLife } = this.state,
                splitDay = day.toString().split('-'),
                currentDate = moment(`${splitDay[2]}-${splitDay[1]}-${splitDay[0]}`),
                futureMonth = moment(currentDate).add(usefulLife, 'M'),
                futureMonthEnd = moment(futureMonth).endOf('month');
            
            if (currentDate.date() !== futureMonth.date() && futureMonth.isSame(futureMonthEnd.format('YYYY-MM-DD'))) {
                futureMonth = futureMonth.add(1, 'd');
            }

            return futureMonth.format('DD-MM-YYYY');
        }
    };


    render() {
        const { id } = this.props;
        const { translate } = this.props;
        const { cost, residualValue, startDepreciation, usefulLife, depreciationType, endDepreciation, annualDepreciationValue, monthlyDepreciationValue } = this.state;
        
        var formater = new Intl.NumberFormat();

        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    {/* Thông tin khấu hao */}
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('asset.general_information.depreciation_information')}</h4></legend>
                        <div className="form-group">
                            <strong>{translate('asset.general_information.original_price')}&emsp; </strong>
                            {formater.format(parseInt(cost))} VNĐ

                        </div>
                        <div className="form-group">
                            <strong>{translate('asset.general_information.residual_price')}&emsp; </strong>
                            {residualValue ? formater.format(parseInt(residualValue)) : ''} VNĐ

                        </div>
                        <div className={`form-group`}>
                            <strong>{translate('asset.general_information.start_depreciation')}&emsp; </strong>
                            {this.formatDate(startDepreciation)}
                        </div>
                        <div className={`form-group`}>
                            <strong>{translate('asset.asset_info.usage_time')}&emsp; </strong>
                            {usefulLife} tháng

                        </div>
                        <div className="form-group">
                            <strong>{translate('asset.general_information.end_depreciation')}&emsp; </strong>
                            {startDepreciation ? this.addMonthToEndDepreciation(this.formatDate(startDepreciation)) : ""}
                        </div>
                        <div className="form-group">
                            <strong>{translate('asset.general_information.depreciation_type')}&emsp; </strong>
                            {depreciationType}
                        </div>
                        <div className="form-group">
                            <strong>{translate('asset.asset_info.annual_depreciation')}&emsp; </strong>
                            {formater.format(parseInt(((12 * cost) / usefulLife)))} VNĐ/năm

                        </div>
                        <div className="form-group">
                            <strong>{translate('asset.asset_info.monthly_depreciation')}&emsp; </strong>
                            {formater.format(cost / usefulLife)} VNĐ/tháng

                        </div>

                        {/* Giá trị hiện tại */}
                        <div className="form-group">
                            <strong>{translate('asset.depreciation.remaining_value')}&emsp; </strong>
                            {formater.format(parseInt(cost - ((cost / usefulLife)) * ((new Date().getFullYear() * 12 + new Date().getMonth()) - (new Date(startDepreciation).getFullYear() * 12 + new Date(startDepreciation).getMonth()))))} VNĐ
                        </div>
                    </fieldset>
                </div>
            </div>
        );
    }
};
const depreciationTab = connect(null, null)(withTranslate(DepreciationTab));
export { depreciationTab as DepreciationTab };