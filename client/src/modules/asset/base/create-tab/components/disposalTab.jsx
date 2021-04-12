import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DatePicker, ErrorLabel, SelectBox } from '../../../../../common-components';

function DisposalTab(props) {
    const [state, setState] =useState({})
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
     * Bắt sự kiện thay đổi Ngày thanh lý
     */
    const handleDisposalDateChange = (value) => {
        setState(state => {
            return {
                ...state,
                disposalDate: value,
            }
        });
        props.handleChange("disposalDate", value);
    }

    /**
     * Bắt sự kiện thay đổi hình thức thanh lý
     */
    const handleDisposalTypeChange = (value) => {
        setState(state =>{
            return{
                ...state,
                disposalType: value[0]
            }
        })
        props.handleChange('disposalType', value[0]);
    }

    /**
     * Bắt sự kiện thay đổi giá trị thanh lý
     */
    const handleDisposalCostChange = (e) => {
        let value = e.target.value;
        setState(state => {
            return {
                ...state,
                disposalCost: value
            }
        });
        props.handleChange("disposalCost", value);
    }

    /**
     * Bắt sự kiện thay đổi nội dung thanh lý
     */
    const handleDisposalDescriptionChange = (e) => {
        let value = e.target.value;
        setState(state => {
            return {
                ...state,
                disposalDesc: value
            }
        });
        props.handleChange("disposalDesc", value);
    }

    if(prevProps.id !== props.id) {
        setState(state => {
            return {
                ...state,
                id: props.id,
                disposalDate: props.disposalDate,
                disposalType: props.disposalType,
                disposalCost: props.disposalCost,
                disposalDesc: props.disposalDesc,
            }
        })
        setPrevProps(props)
    }
  

    
        const { id } = props;
        const { translate } = props;
        const { disposalDate, disposalType, disposalCost, disposalDesc } = state;

        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    {/* Thông tin thanh lý */}
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('asset.general_information.disposal_information')}</h4></legend>

                        {/* Ngày thanh lý */}
                        <div className={`form-group`}>
                            <label htmlFor="disposalDate">{translate('asset.general_information.disposal_date')}</label>
                            <DatePicker
                                id={`disposalDate${id}`}
                                value={disposalDate ? formatDate(disposalDate) : ''}
                                onChange={handleDisposalDateChange}
                            />
                        </div>

                        {/* Hình thức thanh lý */}
                        <div className="form-group">
                            <label htmlFor="disposalType">{translate('asset.general_information.disposal_type')}</label>
                            <SelectBox
                                id={`disposalType${id}`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={disposalType}
                                items={[
                                    { value: '', text: '---Chọn hình thức thanh lý---' },
                                    { value: '1', text: translate('asset.asset_info.destruction') },
                                    { value: '2', text: translate('asset.asset_info.sale') },
                                    { value: '3', text: translate('asset.asset_info.give') },
                                ]}
                                onChange={handleDisposalTypeChange}
                            />
                        </div>

                        {/* Giá trị thanh lý */}
                        <div className={`form-group`}>
                            <label htmlFor="disposalCost">{translate('asset.general_information.disposal_price')} (VNĐ)</label><br />
                            <input type="number" className="form-control" name="disposalCost" value={disposalCost ? disposalCost : ''} onChange={handleDisposalCostChange}
                                placeholder={translate('asset.general_information.disposal_price')} autoComplete="off" />
                        </div>

                        {/* Nội dung thanh */}
                        <div className={`form-group`}>
                            <label htmlFor="disposalDesc">{translate('asset.general_information.disposal_content')}</label><br />
                            <input type="text" className="form-control" name="disposalDesc" value={disposalDesc ? disposalDesc : ''} onChange={handleDisposalDescriptionChange}
                                placeholder={translate('asset.general_information.disposal_content')} autoComplete="off" />
                        </div>
                    </fieldset>
                </div>
            </div>
        );
};

const disposalTab = connect(null, null)(withTranslate(DisposalTab));

export { disposalTab as DisposalTab };
