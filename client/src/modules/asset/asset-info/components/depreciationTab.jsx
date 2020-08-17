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

    /**
     * Hàm để tính các giá trị khấu hao cho tài sản
     * @param {*} depreciationType Phương pháp khấu hao
     * @param {*} cost Nguyên giá
     * @param {*} usefulLife Thời gian trích khấu hao
     * @param {*} startDepreciation Thời gian bắt đầu trích khấu hao
     */
    calculateDepreciation = (depreciationType, cost, usefulLife, startDepreciation) => {
        let annualDepreciation, monthlyDepreciation, remainingValue = cost;

        var formater = new Intl.NumberFormat();

        if (depreciationType === "Đường thẳng") { // Phương pháp khấu hao theo đường thẳng
            annualDepreciation = formater.format(parseInt(((12 * cost) / usefulLife)));
            monthlyDepreciation = formater.format(cost / usefulLife);
            remainingValue = formater.format(parseInt(cost - ((cost / usefulLife)) * ((new Date().getFullYear() * 12 + new Date().getMonth()) - (new Date(startDepreciation).getFullYear() * 12 + new Date(startDepreciation).getMonth()))));

        } else if (depreciationType === "Số dư giảm dần") { // Phương pháp khấu hao theo số dư giảm dần
            
        } else if (depreciationType === "Sản lượng") { // Phương pháp khấu hao theo sản lượng
            
        }

        return [annualDepreciation, monthlyDepreciation, remainingValue];
    }

    render() {
        const { id } = this.props;
        const { translate } = this.props;
        const { cost, residualValue, startDepreciation, usefulLife, depreciationType, endDepreciation, annualDepreciationValue, monthlyDepreciationValue } = this.state;
        
        var formater = new Intl.NumberFormat();

        let annualDepreciation, monthlyDepreciation, remainingValue = cost;
        let result = this.calculateDepreciation(depreciationType, cost, usefulLife, startDepreciation);
        annualDepreciation = result[0];
        monthlyDepreciation = result[1];
        remainingValue = result[2];

        console.log("depreciationType depreciationType depreciationType depreciationType ***", depreciationType);

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
                            {annualDepreciation} VNĐ/năm

                        </div>
                        <div className="form-group">
                            <strong>{translate('asset.asset_info.monthly_depreciation')}&emsp; </strong>
                            {monthlyDepreciation} VNĐ/tháng

                        </div>

                        {/* Giá trị hiện tại */}
                        <div className="form-group">
                            <strong>{translate('asset.depreciation.remaining_value')}&emsp; </strong>
                            {remainingValue} VNĐ
                        </div>
                    </fieldset>
                </div>
            </div>
        );
    }
};
const depreciationTab = connect(null, null)(withTranslate(DepreciationTab));
export { depreciationTab as DepreciationTab };