import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import moment from 'moment';

import { DatePicker, ErrorLabel, SelectBox } from '../../../../../common-components';

import ValidationHelper from '../../../../../helpers/validationHelper';

function DepreciationTab (props){
    const [state, setState] = useState({})
    const [prevProps, setPrevProps] = useState({
        id: null
    })

    // Function format dữ liệu Date thành string
    const formatDate = (date, monthYear = false) => {
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
    const handleChange = (e) => {
        const { name, value } = e.target;
        setState(state =>{
            return{
                ...state,
                [name]: value
            }
        })
        props.handleChange(name, value);
    }

    /**
     * Bắt sự kiện thay đổi nguyên giá
     */
    const handleCostChange = (e) => {
        const { value } = e.target;
        setState(state => {
            return {
                ...state,
                cost: value
            }
        });
        props.handleChange("cost", value);
    }

    /**
     * Bắt sự kiện thay đổi Giá trị thu hồi dự tính
     */
    const handleResidualValueChange = (e) => {
        const { value } = e.target;
        validateResidualValue(value, true);
    }
    const validateResidualValue = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    errorOnResidualValue: message,
                    residualValue: value
                }
            });
            props.handleChange("residualValue", value);
        }
        return message === undefined;
    }

    /**
     * Bắt sự kiện thay đổi Thời gian trích khấu hao
     */
    const handleUsefulLifeChange = (e) => {
        const { value } = e.target;
        setState(state => {
            return {
                ...state,
                usefulLife: value
            }
        });
        props.handleChange("usefulLife", value);
    }

    /**
     * Bắt sự kiện thay đổi Thời gian bắt đầu trích khấu hao
     */
    const handleStartDepreciationChange = (value) => {
        validateStartDepreciation(value, true);
    }
    const validateStartDepreciation = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {

            setState(state => {
                return {
                    ...state,
                    errorOnStartDepreciation: message,
                    startDepreciation: value,
                }
            });
            props.handleChange("startDepreciation", value);
        }
        return message === undefined;
    }

    /**
     * Bắt sự kiện thay đổi phương pháp khấu hao
     */
    const handleDepreciationTypeChange = (value) => {
        setState(state =>{
            return{
                ...state,
                depreciationType: value[0]
            }
        })
        props.handleChange('depreciationType', value[0]);
    }

    if(prevProps.id !== props.id) {
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
            errorOnStartDepreciation: undefined,
            errorOnDepreciationType: undefined,
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
     * Bắt sự kiện thay đổi ản lượng theo công suất thiết kế (trong 1 năm)
     */
    const handleEstimatedTotalProductionChange = (e) => {
        const { value } = e.target;
        validateEstimatedTotalProduction(value, true);
    }
    const validateEstimatedTotalProduction = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    errorOnEstimatedTotalProduction: message,
                    estimatedTotalProduction: value,
                }
            });

            props.handleChange("estimatedTotalProduction", value);
        }
        return message === undefined;
    }

    /**
     * Bắt sự kiện click thêm thông tin sản lượng sản phẩm
     */
    const handleAddUnitsProduced = () => {
        var unitsProducedDuringTheYears = state.unitsProducedDuringTheYears;

        if (unitsProducedDuringTheYears && unitsProducedDuringTheYears.length !== 0) {
            let result;

            for (let n in unitsProducedDuringTheYears) {
                result = validateYear(unitsProducedDuringTheYears[n].month, n) && validateValue(unitsProducedDuringTheYears[n].unitsProducedDuringTheYear, n);
                if (!result) {
                    validateYear(unitsProducedDuringTheYears[n].month, n);
                    validateValue(unitsProducedDuringTheYears[n].unitsProducedDuringTheYear, n)
                    break;
                }
            }

            if (result) {
                setState(state =>{
                    return{
                        ...state,
                        unitsProducedDuringTheYears: [...unitsProducedDuringTheYears, { month: "", unitsProducedDuringTheYear: "" }]
                    }
                })
            }
        } else {
            setState(state =>{
                return{
                    ...state,
                    unitsProducedDuringTheYears: [{ month: "", unitsProducedDuringTheYear: "" }]
                }
            })
        }

    }

    /**
     * Bắt sự kiện chỉnh sửa tên trường tháng sản lượng sản phẩm
     */
    const handleMonthChange = (value, index) => {
        validateYear(value, index);
    }
    const validateYear = (value, index, willUpdateState = true) => {
        let time = value.split("-");
        let date = new Date(time[1], time[0], 0)

        let startDepreciation = undefined, endDepreciation = undefined;
        if (state.startDepreciation) {
            let partDepreciation = state.startDepreciation.split('-');
            startDepreciation = [partDepreciation[2], partDepreciation[1], partDepreciation[0]].join('-');
        }

        if (state.endDepreciation) {
            let partEndDepreciation = state.endDepreciation.split('-');
            endDepreciation = [partEndDepreciation[2], partEndDepreciation[1], partEndDepreciation[0]].join('-');
        }

        let msg = undefined;

        if (value.toString().trim() === "") {
            msg = "Tháng sản lượng sản phẩm không được để trống";
        } else if (startDepreciation && date.getTime() < new Date(startDepreciation).getTime()) {
            msg = "Tháng sản lượng sản phẩm không được trước ngày bắt đầu tính khấu hao";
        } else if (endDepreciation && date.getTime() > new Date(endDepreciation).getTime()) {
            msg = "Tháng sản lượng sản phẩm không được sau ngày kết thúc tính khấu hao";
        }

        if (willUpdateState) {
            var { unitsProducedDuringTheYears } = state;
            unitsProducedDuringTheYears[index] = { ...unitsProducedDuringTheYears[index], month: value }
            setState(state => {
                return {
                    ...state,
                    errorOnMonth: msg,
                    errorOnMonthPosition: msg ? index : null,
                    unitsProducedDuringTheYears: unitsProducedDuringTheYears
                }
            });

            props.handleChange("unitsProducedDuringTheYears", unitsProducedDuringTheYears);
        }

        return msg === undefined;
    }

    /**
     * Bắt sự kiện chỉnh sửa giá trị trường giá trị sản lượng sản phẩm
     */
    const handleChangeValue = (e, index) => {
        var { value } = e.target;
        validateValue(value, index);
    }
    const validateValue = (value, className, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            var { unitsProducedDuringTheYears } = state;
            unitsProducedDuringTheYears[className] = { ...unitsProducedDuringTheYears[className], unitsProducedDuringTheYear: value }
            setState(state => {
                return {
                    ...state,
                    errorOnValue: message,
                    errorOnValuePosition: message ? className : null,
                    unitsProducedDuringTheYears: unitsProducedDuringTheYears
                }
            });

            props.handleChange("unitsProducedDuringTheYears", unitsProducedDuringTheYears);
        }
        return message === undefined;
    }

    /**
     * Bắt sự kiện xóa thông tin sản lượng sản phẩm
     */
    const delete_function = (index) => {
        var { unitsProducedDuringTheYears } = state;
        unitsProducedDuringTheYears.splice(index, 1);
        setState(state =>{
            return{
                ...state,
                unitsProducedDuringTheYears: unitsProducedDuringTheYears
            }
        })
        if (unitsProducedDuringTheYears.length !== 0) {
            for (let n in unitsProducedDuringTheYears) {
                validateYear(unitsProducedDuringTheYears[n].month, n);
                validateValue(unitsProducedDuringTheYears[n].unitsProducedDuringTheYear, n)
            }
        } else {
            setState(state =>{
                return{
                    ...state,
                    errorOnValue: undefined,
                    errorOnMonth: undefined
                }
            })
        }
    };

    
        const { id } = props;
        const { translate } = props;

        const {
            cost, residualValue, usefulLife, startDepreciation, depreciationType, errorOnStartDepreciation,
            errorOnDepreciationType, errorOnMonth, errorOnValue, unitsProducedDuringTheYears, errorOnEstimatedTotalProduction,
            estimatedTotalProduction, errorOnMonthPosition, errorOnValuePosition } = state;
        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    {/* Thông tin khấu hao */}
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('asset.general_information.depreciation_information')}</h4></legend>

                        {/* Nguyên giá */}
                        <div className="form-group">
                            <label htmlFor="cost">{translate('asset.general_information.original_price')} (VNĐ)</label><br />
                            <input type="number" className="form-control" name="cost" value={cost ? cost : ''} onChange={handleCostChange}
                                placeholder={translate('asset.general_information.original_price')} autoComplete="off" />
                        </div>

                        {/* Giá trị thu hồi ước tính */}
                        <div className={`form-group`}>
                            <label htmlFor="residualValue">{translate('asset.general_information.residual_price')} (VNĐ)</label><br />
                            <input type="number" className="form-control" name="residualValue" value={residualValue ? residualValue : ''} onChange={handleResidualValueChange}
                                placeholder="Giá trị thu hồi ước tính" autoComplete="off" />
                        </div>

                        {/* Thời gian sử dụng */}
                        <div className="form-group">
                            <label htmlFor="usefulLife">{translate('asset.asset_info.usage_time')} (Tháng)</label>
                            <input type="number" className="form-control" name="usefulLife" value={usefulLife ? usefulLife : ''} onChange={handleUsefulLifeChange}
                                placeholder="Thời gian trích khấu hao" autoComplete="off" />
                        </div>

                        {/* Thời gian bắt đầu trích khấu hao */}
                        <div className={`form-group ${!errorOnStartDepreciation ? "" : "has-error"} `}>
                            <label htmlFor="startDepreciation">{translate('asset.general_information.start_depreciation')}</label>
                            <DatePicker
                                id={`startDepreciation${id}`}
                                value={startDepreciation}
                                onChange={handleStartDepreciationChange}
                            />
                            <ErrorLabel content={errorOnStartDepreciation} />
                        </div>

                        {/* Phương pháp khấu hao */}
                        <div className={`form-group ${!errorOnDepreciationType ? "" : "has-error"}`}>
                            <label htmlFor="depreciationType">{translate('asset.general_information.depreciation_type')}</label>
                            <SelectBox
                                id={`depreciationType${id}`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={depreciationType}
                                items={[
                                    { value: '', text: translate('asset.depreciation.select_depreciation_type') },
                                    { value: 'straight_line', text: translate('asset.depreciation.line') },
                                    { value: 'declining_balance', text: translate('asset.depreciation.declining_balance') },
                                    { value: 'units_of_production', text: translate('asset.depreciation.units_production') },
                                ]}
                                onChange={handleDepreciationTypeChange}
                            />
                            <ErrorLabel content={errorOnDepreciationType} />
                        </div>

                        {/* Sản lượng theo công suất thiết kế */}
                        {
                            depreciationType == 'units_of_production' &&
                            <div className={`form-group ${!errorOnEstimatedTotalProduction ? "" : "has-error"} `}>
                                <label htmlFor="estimatedTotalProduction">{translate('asset.depreciation.estimated_production')}</label>
                                <input type="number" className="form-control" name="estimatedTotalProduction" value={estimatedTotalProduction ? estimatedTotalProduction : ''} onChange={handleEstimatedTotalProductionChange}
                                    placeholder='Sản lượng theo công suất thiết kế' autoComplete="off" />
                                <ErrorLabel content={errorOnEstimatedTotalProduction} />
                            </div>
                        }

                        {/* Sản lượng sản phẩm trong các năm */}
                        {
                            depreciationType == 'units_of_production' &&
                            <div className="col-md-12" style={{ paddingLeft: '0px' }}>
                                <label>{translate('asset.depreciation.months_production')}:
                                    <a style={{ cursor: "pointer" }} title={translate('asset.general_information.asset_properties')}><i className="fa fa-plus-square" style={{ color: "#28A745", marginLeft: 5 }}
                                        onClick={handleAddUnitsProduced} /></a>
                                </label>

                                {/* Bảng thông tin chi tiết */}
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th style={{ paddingLeft: '0px' }}>{translate('page.month')}</th>
                                            <th style={{ paddingLeft: '0px' }}>{translate('asset.depreciation.production')}</th>
                                            <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(!unitsProducedDuringTheYears || unitsProducedDuringTheYears.length === 0) ? <tr>
                                            <td colSpan={3}>
                                                <center> {translate('table.no_data')}</center>
                                            </td>
                                        </tr> :
                                            unitsProducedDuringTheYears.map((x, index) => {
                                                return <tr key={index}>
                                                    <td style={{ paddingLeft: '0px' }}>
                                                        <div className={`form-group ${(parseInt(errorOnMonthPosition) === index && errorOnMonth) ? "has-error" : ""}`}>
                                                            <DatePicker
                                                                id={index}
                                                                dateFormat="month-year"
                                                                value={x.month}
                                                                onChange={(e) => handleMonthChange(e, index)}
                                                            />
                                                            {(parseInt(errorOnMonthPosition) === index && errorOnMonth) && <ErrorLabel content={errorOnMonth} />}
                                                        </div>
                                                    </td>
                                                    <td style={{ paddingLeft: '0px' }}>
                                                        <div className={`form-group ${(parseInt(errorOnValuePosition) === index && errorOnValue) ? "has-error" : ""}`}>
                                                            <input className="form-control" type="number" value={x.unitsProducedDuringTheYear} name="unitsProducedDuringTheYears" style={{ width: "100%" }} onChange={(e) => handleChangeValue(e, index)} />
                                                            {(parseInt(errorOnValuePosition) === index && errorOnValue) && <ErrorLabel content={errorOnValue} />}
                                                        </div>
                                                    </td>
                                                    <td style={{ textAlign: "center" }}>
                                                        <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => delete_function(index)}><i className="material-icons"></i></a>
                                                    </td>
                                                </tr>
                                            })}
                                    </tbody>
                                </table>
                            </div>
                        }
                    </fieldset>
                </div>
            </div>
        );
};

const depreciationTab = connect(null, null)(withTranslate(DepreciationTab));

export { depreciationTab as DepreciationTab };
