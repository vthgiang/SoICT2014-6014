import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import moment from 'moment';

function DepreciationTab(props) {
   
    const [state, setState] = useState({})
    const [prevProps, setPrevProps] = useState({
        id: null
    })

    // Function format dữ liệu Date thành string
    const formatDate = (date, monthYear = false) =>{
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

    if(prevProps.id !== props.id){
        setState({
                ...state,
                id: props.id,
                cost: props.cost,
                residualValue: props.residualValue,
                usefulLife: props.usefulLife,
                startDepreciation: props.startDepreciation,
                endDepreciation: props.endDepreciation,
                depreciationType: props.depreciationType,
                estimatedTotalProduction: props.estimatedTotalProduction,
                unitsProducedDuringTheYears: props.unitsProducedDuringTheYears,
                annualDepreciationValue: props.annualDepreciationValue,
                monthlyDepreciationValue: props.monthlyDepreciationValue,
        })
        setPrevProps(props)
    }
   

    const addMonthToEndDepreciation = (day) => {
        if (day) {
            let { usefulLife } = state,
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
     * @param {*} estimatedTotalProduction Sản lượng theo công suất thiết kế (trong 1 năm)
     * @param {*} unitsProducedDuringTheYears Sản lượng sản phẩm trong các tháng
     */
    const calculateDepreciation = (depreciationType, cost, usefulLife, estimatedTotalProduction, unitsProducedDuringTheYears, startDepreciation) => {
        let annualDepreciation, monthlyDepreciation, remainingValue = cost;

        if (depreciationType === "straight_line") { // Phương pháp khấu hao theo đường thẳng
            annualDepreciation = ((12 * cost) / usefulLife);
            monthlyDepreciation = cost / usefulLife;
            remainingValue = cost - (cost / usefulLife) * ((new Date().getFullYear() * 12 + new Date().getMonth()) - (new Date(startDepreciation).getFullYear() * 12 + new Date(startDepreciation).getMonth()));

        } else if (depreciationType === "declining_balance") { // Phương pháp khấu hao theo số dư giảm dần
            let lastYears = false,
                t,
                usefulYear = usefulLife / 12,
                usedTime = (new Date().getFullYear() * 12 + new Date().getMonth()) - (new Date(startDepreciation).getFullYear() * 12 + new Date(startDepreciation).getMonth());

            if (usefulYear < 4) {
                t = (1 / usefulYear) * 1.5;
            } else if (usefulYear >= 4 && usefulYear <= 6) {
                t = (1 / usefulYear) * 2;
            } else if (usefulYear > 6) {
                t = (1 / usefulYear) * 2.5;
            }

            // Tính khấu hao đến năm hiện tại
            for (let i = 1; i <= usedTime / 12; i++) {
                if (!lastYears) {
                    if (remainingValue * t > (remainingValue / (usefulYear - i + 1))) {
                        annualDepreciation = remainingValue * t;
                    } else {
                        annualDepreciation = (remainingValue / (usefulYear - i + 1));
                        lastYears = true;
                    }
                }

                remainingValue = remainingValue - annualDepreciation;
            }

            // Tính khấu hao đến tháng hiện tại
            if (usedTime % 12 !== 0) {
                if (!lastYears) {
                    if (remainingValue * t > (remainingValue / (usefulYear - Math.floor(usedTime / 12)))) {
                        annualDepreciation = remainingValue * t;
                    } else {
                        annualDepreciation = (remainingValue / (usefulYear - Math.floor(usedTime / 12)));
                        lastYears = true;
                    }
                }

                monthlyDepreciation = annualDepreciation / 12;
                remainingValue = remainingValue - (monthlyDepreciation * (usedTime % 12))
            }

        } else if (depreciationType === "units_of_production") { // Phương pháp khấu hao theo sản lượng
            let monthTotal = unitsProducedDuringTheYears.length; // Tổng số tháng tính khấu hao
            let productUnitDepreciation = cost / (estimatedTotalProduction * (usefulLife / 12)); // Mức khấu hao đơn vị sản phẩm
            let accumulatedDepreciation = 0; // Giá trị hao mòn lũy kế

            for (let i = 0; i < monthTotal; i++) {
                accumulatedDepreciation += unitsProducedDuringTheYears[i].unitsProducedDuringTheYear * productUnitDepreciation;
            }

            remainingValue = cost - accumulatedDepreciation;
            annualDepreciation = monthTotal ? accumulatedDepreciation * 12 / monthTotal : 0;
        }

        return [parseInt(annualDepreciation), parseInt(annualDepreciation / 12), parseInt(remainingValue)];
    }

    const formatDepreciationType = (type) => {
        const { translate } = props;
        if (type === 'straight_line') {
            return translate('asset.depreciation.line');
        }
        else if (type === 'declining_balance') {
            return translate('asset.depreciation.declining_balance')
        }
        else if (type === 'units_of_production') {
            return translate('asset.depreciation.units_production')
        }
        else {
            return translate('asset.general_information.no_data')
        }
    }

    
        const { id } = props;
        const { translate } = props;
        const { cost, residualValue, startDepreciation, usefulLife, depreciationType, endDepreciation, annualDepreciationValue, monthlyDepreciationValue,
            estimatedTotalProduction, unitsProducedDuringTheYears } = state;

        var formater = new Intl.NumberFormat();

        let annualDepreciation, monthlyDepreciation, remainingValue = cost;
        let result = calculateDepreciation(depreciationType, cost, usefulLife, estimatedTotalProduction, unitsProducedDuringTheYears, startDepreciation);
        annualDepreciation = result[0];
        monthlyDepreciation = result[1];
        remainingValue = result[2];

        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    {/* Thông tin khấu hao */}
                    <fieldset className="scheduler-border">
                        <div className="form-group" style={{ marginTop: "10px" }}>
                            <strong>{translate('asset.general_information.original_price')}&emsp; </strong>
                            {cost ? `${formater.format(parseInt(cost))} VND` : translate('asset.general_information.no_data')}
                        </div>
                        <div className="form-group">
                            <strong>{translate('asset.general_information.residual_price')}&emsp; </strong>
                            {residualValue ? `${formater.format(parseInt(residualValue))} VND` : translate('asset.general_information.no_data')}

                        </div>
                        <div className={`form-group`}>
                            <strong>{translate('asset.general_information.start_depreciation')}&emsp; </strong>
                            {startDepreciation ? formatDate(startDepreciation) : translate('asset.general_information.no_data')}
                        </div>
                        <div className={`form-group`}>
                            <strong>{translate('asset.asset_info.usage_time')}&emsp; </strong>
                            {usefulLife ? `${usefulLife} tháng` : translate('asset.general_information.no_data')}

                        </div>
                        <div className="form-group">
                            <strong>{translate('asset.general_information.end_depreciation')}&emsp; </strong>
                            {startDepreciation ? addMonthToEndDepreciation(formatDate(startDepreciation)) : translate('asset.general_information.no_data')}
                        </div>
                        <div className="form-group">
                            <strong>{translate('asset.general_information.depreciation_type')}&emsp; </strong>
                            {depreciationType ? formatDepreciationType(depreciationType) : translate('asset.general_information.no_data')}
                        </div>
                        <div className="form-group">
                            <strong>{translate('asset.asset_info.annual_depreciation')}&emsp; </strong>
                            {annualDepreciation ? `${formater.format(annualDepreciation)} VNĐ/năm` : translate('asset.general_information.no_data')}

                        </div>
                        <div className="form-group">
                            <strong>{translate('asset.asset_info.monthly_depreciation')}&emsp; </strong>
                            {monthlyDepreciation ? `${formater.format(monthlyDepreciation)} VNĐ/tháng` : translate('asset.general_information.no_data')}

                        </div>

                        {/* Giá trị hiện tại */}
                        <div className="form-group">
                            <strong>{translate('asset.depreciation.remaining_value')}&emsp; </strong>
                            {remainingValue ? `${formater.format(parseInt(remainingValue))} VND` : translate('asset.general_information.no_data')}
                        </div>
                    </fieldset>
                </div>
            </div>
        );
};
const depreciationTab = connect(null, null)(withTranslate(DepreciationTab));
export { depreciationTab as DepreciationTab };