import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { AssetCreateValidator } from './AssetCreateValidator';
import { DatePicker, ErrorLabel } from '../../../../common-components';

class TabDepreciationContent extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    // Function lưu các trường thông tin vào state
    handleChange = (e) => {
        const { name, value } = e.target;
        this.props.handleChange(name, value);
    }

    // Function bắt sự kiện thay đổi thời gian bắt đầu trích khấu hao
    handleStartDepreciationChange = (value) => {
        this.validateStartDepreciation(value, true);
    }
    validateStartDepreciation = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateStartDepreciation(value, this.props.translate)
        if (willUpdateState) {

            this.setState(state => {
                return {
                    ...state,
                    errorOnStartDepreciation: msg,
                    assetNumber: value,
                }
            });
            this.props.handleChange("startDepreciation", value);
        }
        return msg === undefined;
    }

    // Function bắt sự kiện thay đồi thời gian trích khấu hao
    handleTimeDepreciationChange = (e) => {
        const { value } = e.target;
        this.validateTimeDepreciation(value, true);
    }
    validateTimeDepreciation = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateTimeDepreciation(value, this.props.translate)
        if (willUpdateState) {

            this.setState(state => {
                return {
                    ...state,
                    errorOnTimeDepreciation: msg,
                    timeDepreciation: value,
                }
            });
            this.props.handleChange("timeDepreciation", value);
        }
        return msg === undefined;
    }

    
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                // assetCost: nextProps.asset.assetCost,
                startDepreciation: nextProps.asset.startDepreciation,
                timeDepreciation: nextProps.asset.timeDepreciation,
                // endDepreciation: nextProps.asset.endDepreciation,
                // annualDepreciationValue: nextProps.asset.annualDepreciationValue,
                // monthlyDepreciationValue: nextProps.asset.monthlyDepreciationValue,

                errorOnStartDepreciation: undefined,
                errorOnTimeDepreciation: undefined,
            }
        } else {
            return null;
        }
    }


    render() {
        const { id, translate } = this.props;
        const { assetCost, startDepreciation, timeDepreciation, endDepreciation, annualDepreciationValue, 
                monthlyDepreciationValue, errorOnStartDepreciation, errorOnTimeDepreciation
        } = this.state;
        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">Thông tin khấu hao</h4></legend>
                        <div className="form-group">
                            <label htmlFor="initialPrice">Nguyên giá<span className="text-red">*</span></label><br/>
                            <input style={{ display: "inline", width: "95%" }} type="number" className="form-control" name="initialPrice" value={assetCost} placeholder="Nguyên giá = Giá trị ban đầu + Chi phí nâng cấp (không tính chi phí sửa chữa, thay thế)" autoComplete="off" disabled />
                            <label style={{ height: 34, display: "inline", width: "2%" }}>&nbsp; VNĐ</label>
                        </div>
                        <div className={`form-group ${errorOnStartDepreciation === undefined ? "" : "has-error"} `}>
                            <label htmlFor="startDepreciation">Thời gian bắt đầu trích khấu hao<span className="text-red">*</span> (Ghi chú: giá trị default = ngày nhập tài sản)</label>
                            <DatePicker
                                id={`startDepreciation${id}`}
                                value={startDepreciation}
                                onChange={this.handleStartDepreciationChange}
                            />
                            <ErrorLabel content={errorOnStartDepreciation} />
                        </div>
                        <div className={`form-group ${errorOnTimeDepreciation === undefined ? "" : "has-error"} `}>
                            <label htmlFor="timeDepreciation">Thời gian trích khấu hao<span className="text-red">*</span> (Ghi chú: Giá trị default = thời gian trích khấu hao của loại tài sản ứng với tài sản đó)</label><br/>
                            <input style={{ display: "inline", width: "95%" }} type="number" className="form-control" name="timeDepreciation" value={timeDepreciation}  onChange={this.handleTimeDepreciationChange} placeholder="Thời gian trích khấu hao" autoComplete="off" />
                            <label style={{ height: 34, display: "inline", width: "2%" }}>&nbsp; Năm</label>
                            <ErrorLabel content={errorOnTimeDepreciation} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="endDepreciation">Thời gian kết thúc trích khấu hao (Ghi chú: thời gian kết thúc = thời gian bắt đầu + thời gian trích khấu hao)</label>
                            <DatePicker
                                id={`endDepreciation${id}`}
                                value={endDepreciation}
                                disabled
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="annualDepreciationValue">Mức độ khấu hao trung bình hằng năm</label><br/>
                            <input style={{ display: "inline", width: "93%" }} type="number" className="form-control" name="initialPrice" value={annualDepreciationValue} placeholder="Mức độ khấu hao trung bình hằng năm = Nguyên giá / Thời gian trích khấu hao" autoComplete="off" disabled />
                            <label style={{ height: 34, display: "inline", width: "5%" }}>&nbsp; VNĐ/Năm</label>
                        </div>
                        <div className="form-group">
                            <label htmlFor="monthlyDepreciationValue">Mức độ khấu hao trung bình hằng tháng</label><br/>
                            <input style={{ display: "inline", width: "92%" }} type="number" className="form-control" name="initialPrice" value={monthlyDepreciationValue} placeholder="Mức độ khấu hao trung bình hằng tháng = Mức độ khấu hao trung bình hằng năm / 12" autoComplete="off" disabled />
                            <label style={{ height: 34, display: "inline", width: "5%" }}>&nbsp; VNĐ/Tháng</label>
                        </div>
                    </fieldset>
                </div>
            </div>
        );
    }
};
const tabDepreciation = connect(null, null)(withTranslate(TabDepreciationContent));
export { tabDepreciation as TabDepreciationContent };