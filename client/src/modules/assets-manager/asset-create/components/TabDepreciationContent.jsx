import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { AssetCreateValidator } from './AssetCreateValidator';
import { DatePicker, ErrorLabel } from '../../../../common-components';
import moment from 'moment';

class TabDepreciationContent extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            
            isChangeTimDep: false, timeDepreciation: "" 
        };
    }

    // Function lưu các trường thông tin vào state
    handleChange = (e) => {
        const { name, value } = e.target;
        this.props.handleChange(name, value);
    }

    /**
     * Bắt sự kiện thay đổi nguyên giá
     */
    handleCostChange = (e) => {
        const { value } = e.target;
        this.validateCost(value, true);
    }
    validateCost = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateCost(value, this.props.translate)
        if (willUpdateState) {

            this.setState(state => {
                return {
                    ...state,
                    errorOnCost: msg,
                    cost: value
                }
            });
            this.props.handleChange("cost", value);
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện thay đổi Giá trị thu hồi dự tính
     */
    handleResidualValueChange = (e) => {
        const { value } = e.target;
        this.validateResidualValue(value, true);
    }
    validateResidualValue = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateResidualValue(value, this.props.translate)
        if (willUpdateState) {

            this.setState(state => {
                return {
                    ...state,
                    errorOnResidualValue: msg,
                    residualValue: value
                }
            });
            this.props.handleChange("residualValue", value);
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện thay đổi Thời gian trích khấu hao
     */
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
                    timeDepreciation: value
                }
            });
            this.props.handleChange("timeDepreciation", value);
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện thay đổi Thời gian bắt đầu trích khấu hao
     */
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
                    startDepreciation: value,
                }
            });
            this.props.handleChange("startDepreciation", value);
        }
        return msg === undefined;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        console.log('nextProps', nextProps);
        console.log('prevState', prevState);
        if (nextProps.id !== prevState.id || (nextProps.timeDepreciation !== prevState.timeDepreciation && nextProps.isChangeTimeDep !== prevState.isChangeTimeDep)) {
            return {
                ...prevState,
                id: nextProps.id,
                cost: nextProps.asset.cost,
                residualValue: nextProps.asset.residualValue,
                timeDepreciation: nextProps.timeDepreciation,
                startDepreciation: nextProps.asset.startDepreciation,
                isChangeTimeDep: nextProps.isChangeTimeDep,
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

    addMonthToEndDepreciation = (day) => {
        if (day !== undefined) {
            let { timeDepreciation } = this.state,
                splitDay = day.toString().split('-'),
                currentDate = moment(`${splitDay[2]}-${splitDay[1]}-${splitDay[0]}`),
                futureMonth = moment(currentDate).add(timeDepreciation, 'M'),
                futureMonthEnd = moment(futureMonth).endOf('month');
            if (currentDate.date() !== futureMonth.date() && futureMonth.isSame(futureMonthEnd.format('YYYY-MM-DD'))) {
                futureMonth = futureMonth.add(1, 'd');
            }
            return futureMonth.format('DD-MM-YYYY');
        }
    };

    render() {
        const { id, translate } = this.props;
        const {
            cost, residualValue, timeDepreciation, startDepreciation, endDepreciation, annualDepreciationValue,
            monthlyDepreciationValue, errorOnCost, errorOnStartDepreciation, errorOnTimeDepreciation
        } = this.state;
        console.log('addMonthToEndDepreciation', timeDepreciation);
        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    {this.a}
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">Thông tin khấu hao</h4></legend>
                        <div className={`form-group ${errorOnCost === undefined ? "" : "has-error"} `}>
                            <label htmlFor="cost">Nguyên giá (VNĐ)<span className="text-red">*</span></label><br />
                            <input type="number" className="form-control" name="cost" value={cost} onChange={this.handleCostChange}
                                placeholder="Nguyên giá" autoComplete="off" />
                            <ErrorLabel content={errorOnCost} />
                        </div>
                        <div className={`form-group`}>
                            <label htmlFor="residualValue">Giá trị thu hồi ước tính (VNĐ)</label><br />
                            <input type="number" className="form-control" name="residualValue" value={residualValue} onChange={this.handleResidualValueChange}
                                placeholder="Giá trị thu hồi ước tính" autoComplete="off" />
                        </div>
                        <div className={`form-group ${errorOnTimeDepreciation === undefined ? "" : "has-error"} `}>
                            <label htmlFor="timeDepreciation">Thời gian trích khấu hao (Tháng)<span className="text-red">*</span> (Ghi chú: Giá trị default = thời gian trích khấu hao của loại tài sản
                                ứng với tài sản đó)</label><br />
                            <input type="number" className="form-control" name="timeDepreciation" value={timeDepreciation} onChange={this.handleTimeDepreciationChange}
                                placeholder="Thời gian trích khấu hao" autoComplete="off" />
                            <ErrorLabel content={errorOnTimeDepreciation} />
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
                        <div className="form-group">
                            <label htmlFor="endDepreciation">Thời gian kết thúc trích khấu hao (Ghi chú: thời gian kết thúc = thời gian bắt đầu + thời gian trích khấu hao)</label><br />
                            <input
                                className="form-control"
                                id={`endDepreciation${id}`}
                                value={startDepreciation !== "" ? this.addMonthToEndDepreciation(startDepreciation) : ""}
                                disabled
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="annualDepreciationValue">Mức độ khấu hao trung bình hằng năm (VNĐ/Năm)</label><br />
                            <input type="number" className="form-control" name="initialPrice" value={annualDepreciationValue}
                                placeholder="Mức độ khấu hao trung bình hằng năm = ( 12 x Nguyên giá ) / Thời gian trích khấu hao" autoComplete="off" disabled />
                        </div>
                        <div className="form-group">
                            <label htmlFor="monthlyDepreciationValue">Mức độ khấu hao trung bình hằng tháng (VNĐ/Tháng)</label><br />
                            <input type="number" className="form-control" name="initialPrice" value={monthlyDepreciationValue}
                                placeholder="Mức độ khấu hao trung bình hằng tháng = Nguyên giá / Thời gian trích khấu hao" autoComplete="off" disabled />
                        </div>
                    </fieldset>
                </div>
            </div>
        );
    }
};
const tabDepreciation = connect((state) => ({ isChangeTimeDep: state.assetsManager.isChangeTimeDep, timeDepreciation: state.assetsManager.timeDepreciation }), null)(withTranslate(TabDepreciationContent));
export { tabDepreciation as TabDepreciationContent };
