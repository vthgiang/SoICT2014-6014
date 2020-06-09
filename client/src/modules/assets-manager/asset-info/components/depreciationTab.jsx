import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

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
                cost: nextProps.asset.cost,
                residualValue: nextProps.asset.residualValue,
                usefulLife: nextProps.asset.usefulLife,
                startDepreciation: nextProps.asset.startDepreciation,
                endDepreciation: nextProps.asset.endDepreciation,
                annualDepreciationValue: nextProps.asset.annualDepreciationValue,
                monthlyDepreciationValue: nextProps.asset.monthlyDepreciationValue,
            }
        } else {
            return null;
        }
    }


    render() {
        const { id, translate } = this.props;
        const { cost, residualValue, startDepreciation, usefulLife, endDepreciation, annualDepreciationValue, 
                monthlyDepreciationValue } = this.state;
                console.log('this.state', this.state);
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
                            {formater.format(parseInt(residualValue))} VNĐ
                            
                        </div>
                        <div className={`form-group`}>
                            <strong>Thời gian bắt đầu trích khấu hao:&emsp; </strong>
                            {this.formatDate(startDepreciation)}
                        </div>
                        <div className={`form-group`}>
                            <strong>Thời gian sử dụng:&emsp; </strong>
                            {usefulLife} Tháng
                            
                        </div>
                        <div className="form-group">
                            <strong>Thời gian kết thúc trích khấu hao:&emsp; </strong>
                            {endDepreciation}
                        </div>
                        <div className="form-group">
                            <strong>Mức độ khấu hao trung bình hằng năm:&emsp; </strong>
                            {annualDepreciationValue} VNĐ/Năm
                            
                        </div>
                        <div className="form-group">
                            <strong>Mức độ khấu hao trung bình hằng tháng:&emsp; </strong>
                            {monthlyDepreciationValue} VNĐ/Tháng 
                            
                        </div>
                    </fieldset>
                </div>
            </div>
        );
    }
};
const depreciationTab = connect(null, null)(withTranslate(DepreciationTab));
export { depreciationTab as DepreciationTab };