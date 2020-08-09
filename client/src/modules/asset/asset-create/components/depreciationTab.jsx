import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import moment from 'moment';

import { DatePicker, ErrorLabel, SelectBox } from '../../../../common-components';

import { AssetCreateValidator } from './assetCreateValidator';

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

    // Function lưu các trường thông tin vào state
    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        })
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
    handleUsefulLifeChange = (e) => {
        const { value } = e.target;
        this.validateUsefulLife(value, true);
    }
    validateUsefulLife = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateUsefulLife(value, this.props.translate)
        if (willUpdateState) {

            this.setState(state => {
                return {
                    ...state,
                    errorOnUsefulLife: msg,
                    usefulLife: value
                }
            });
            this.props.handleChange("usefulLife", value);
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
        console.log('value', value);
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

    /**
     * Bắt sự kiện thay đổi phương pháp khấu hao
     */
    handleDepreciationTypeChange = (value) => {
        this.setState({
            depreciationType: value[0]
        })
        this.props.handleChange('depreciationType', value[0]);
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
                depreciationType: nextProps.depreciationType,
                errorOnStartDepreciation: undefined,
                errorOnUsefulLife: undefined,
                errorOnDepreciationType: undefined,
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
        
        const {
            cost, residualValue, usefulLife, startDepreciation, depreciationType, errorOnCost, errorOnStartDepreciation,
            errorOnUsefulLife, errorOnDepreciationType
        } = this.state;

        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    {/* Thông tin khấu hao */}
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">Thông tin khấu hao</h4></legend>

                        {/* Nguyên giá */}
                        <div className={`form-group ${!errorOnCost ? "" : "has-error"} `}>
                            <label htmlFor="cost">Nguyên giá (VNĐ)<span className="text-red">*</span></label><br />
                            <input type="number" className="form-control" name="cost" value={cost} onChange={this.handleCostChange}
                                placeholder="Nguyên giá" autoComplete="off" />
                            <ErrorLabel content={errorOnCost} />
                        </div>

                        {/* Giá trị thu hồi ước tính */}
                        <div className={`form-group`}>
                            <label htmlFor="residualValue">Giá trị thu hồi ước tính (VNĐ)</label><br />
                            <input type="number" className="form-control" name="residualValue" value={residualValue} onChange={this.handleResidualValueChange}
                                placeholder="Giá trị thu hồi ước tính" autoComplete="off" />
                        </div>

                        {/* Thời gian sử dụng */}
                        <div className={`form-group ${!errorOnUsefulLife ? "" : "has-error"} `}>
                            <label htmlFor="usefulLife">Thời gian sử dụng (Tháng)<span className="text-red">*</span></label>
                            <input type="number" className="form-control" name="usefulLife" value={usefulLife} onChange={this.handleUsefulLifeChange}
                                placeholder="Thời gian trích khấu hao" autoComplete="off" />
                            <ErrorLabel content={errorOnUsefulLife} />
                        </div>

                        {/* Thời gian bắt đầu trích khấu hao */}
                        <div className={`form-group ${!errorOnStartDepreciation ? "" : "has-error"} `}>
                            <label htmlFor="startDepreciation">Thời gian bắt đầu trích khấu hao<span className="text-red">*</span></label>
                            <DatePicker
                                id={`startDepreciation${id}`}
                                value={startDepreciation}
                                onChange={this.handleStartDepreciationChange}
                            />
                            <ErrorLabel content={errorOnStartDepreciation} />
                        </div>

                        {/* Phương pháp khấu hao */}
                        <div className={`form-group ${!errorOnDepreciationType ? "" : "has-error"}`}>
                            <label htmlFor="depreciationType">Phương pháp khấu hao<span className="text-red">*</span></label>
                            <SelectBox
                                id={`depreciationType${id}`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={depreciationType}
                                items={[
                                    { value: '', text: '---Chọn phương pháp khấu hao---' },
                                    { value: 'Đường thẳng', text: 'Phương pháp khấu hao đường thẳng' },
                                    { value: 'Số dư giảm dần', text: 'Phương pháp khấu hao theo số dư giảm dần' },
                                    { value: 'Sản lượng', text: 'Phương pháp khấu hao theo sản lượng'},
                                ]}
                                onChange={this.handleDepreciationTypeChange}
                            />
                            <ErrorLabel content={errorOnDepreciationType} />
                        </div>
                    </fieldset>
                </div>
            </div>
        );
    }
};

const depreciationTab = connect(null, null)(withTranslate(DepreciationTab));

export { depreciationTab as DepreciationTab };
