import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class DepreciationTab extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                assetCost: nextProps.asset.assetCost,
                startDepreciation: nextProps.asset.startDepreciation,
                timeDepreciation: nextProps.asset.timeDepreciation,
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
        const { assetCost, startDepreciation, timeDepreciation, endDepreciation, annualDepreciationValue, 
                monthlyDepreciationValue } = this.state;
        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">Thông tin khấu hao</h4></legend>
                        <div className="form-group">
                            <strong>Nguyên giá:&emsp; </strong>
                            {assetCost} VNĐ
                            
                        </div>
                        <div className={`form-group`}>
                            <strong>Thời gian bắt đầu trích khấu hao:&emsp; </strong>
                            {startDepreciation}
                        </div>
                        <div className={`form-group`}>
                            <strong>Thời gian trích khấu hao:&emsp; </strong>
                            {timeDepreciation} Tháng
                            
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
const tabDepreciation = connect(null, null)(withTranslate(DepreciationTab));
export { tabDepreciation as DepreciationTab };