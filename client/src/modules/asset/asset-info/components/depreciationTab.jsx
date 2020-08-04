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

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        if (monthYear === true) {
            return [month, year].join('-');
        } else return [day, month, year].join('-');
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
        if (day !== undefined) {
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
        const { id, translate } = this.props;
        const { cost, residualValue, startDepreciation, usefulLife, depreciationType, endDepreciation, annualDepreciationValue,
            monthlyDepreciationValue } = this.state;
        var formater = new Intl.NumberFormat();
        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">Thông tin khấu hao</h4></legend>
                        <div className="form-group">
                            <strong>Nguyên giá:&emsp; </strong>
                            {formater.format(parseInt(cost))} VNĐ

                        </div>
                        <div className="form-group">
                            <strong>Giá trị thu hồi ước tính:&emsp; </strong>
                            {residualValue ? formater.format(parseInt(residualValue)) : ''} VNĐ

                        </div>
                        <div className={`form-group`}>
                            <strong>Thời gian bắt đầu trích khấu hao:&emsp; </strong>
                            {this.formatDate(startDepreciation)}
                        </div>
                        <div className={`form-group`}>
                            <strong>Thời gian sử dụng:&emsp; </strong>
                            {usefulLife} tháng

                        </div>
                        <div className="form-group">
                            <strong>Thời gian kết thúc trích khấu hao:&emsp; </strong>
                            {startDepreciation !== '' ? this.addMonthToEndDepreciation(this.formatDate(startDepreciation)) : ""}
                        </div>
                        <div className="form-group">
                            <strong>Phương pháp trích khấu hao:&emsp; </strong>
                            {depreciationType}
                        </div>
                        <div className="form-group">
                            <strong>Mức độ khấu hao trung bình hằng năm:&emsp; </strong>
                            {formater.format(parseInt(((12 * cost) / usefulLife)))} VNĐ/năm

                        </div>
                        <div className="form-group">
                            <strong>Mức độ khấu hao trung bình hằng tháng:&emsp; </strong>
                            {formater.format(cost / usefulLife)} VNĐ/tháng

                        </div>
                    </fieldset>
                </div>
            </div>
        );
    }
};
const depreciationTab = connect(null, null)(withTranslate(DepreciationTab));
export { depreciationTab as DepreciationTab };