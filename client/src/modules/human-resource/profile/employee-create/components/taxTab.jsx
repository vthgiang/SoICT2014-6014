import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DatePicker } from '../../../../../common-components';

function TaxTab(props) {
    const [state, setState] = useState({

    })

    useEffect(() => {
        setState(state => {
            return {
                ...state,
                id: props.id,
                atmNumber: props.employee ? props.employee.atmNumber : "",
                bankName: props.employee ? props.employee.bankName : "",
                bankAddress: props.employee ? props.employee.bankAddress : "",
                taxNumber: props.employee ? props.employee.taxNumber : "",
                taxRepresentative: props.employee ? props.employee.taxRepresentative : "",
                taxDateOfIssue: props.employee ? props.employee.taxDateOfIssue : "",
                taxAuthority: props.employee ? props.employee.taxAuthority : "",
            }
        })
    }, [props.id])

    const { translate } = props;

    const { id } = props;

    const { atmNumber, bankName, bankAddress, taxNumber, taxRepresentative, taxDateOfIssue, taxAuthority } = state;

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
     */
    const formatDate = (date, monthYear = false) => {
        if (date) {
            let d = new Date(date),
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
        return date;

    }

    /** Function lưu các trường thông tin vào state */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setState({
            ...state,
            [name]: value
        })
        props.handleChange(name, value);
    }

    /** Function Bắt sự kiện thay đổi người đại diện */
    const handleUserTaxChange = (e) => {
        const { value } = e.target;
        setState(state => {
            return {
                ...state,
                taxRepresentative: value,
            }
        });
        props.handleChange("taxRepresentative", value);
    }

    /** Function Bắt sự kiện thay đổi mã số thuế */
    const handleNumberTaxChange = (e) => {
        const { value } = e.target;
        setState(state => {
            return {
                ...state,
                taxNumber: value,
            }
        });
        props.handleChange("taxNumber", value);
    }

    /** Function Bắt sự kiện thay đổi tổ chức quản lý */
    const handleUnitTaxChange = (e) => {
        const { value } = e.target;
        setState(state => {
            return {
                ...state,
                taxAuthority: value,
            }
        });
        props.handleChange("taxAuthority", value);
    }

    /**
     * Function bắt sự kiện thay đổi ngày hoạt động
     * @param {*} value 
     */
    const handleStartDateChange = (value) => {
        setState(state => {
            return {
                ...state,
                taxDateOfIssue: value,
            }
        });
        props.handleChange("taxDateOfIssue", value);
    }

    return (
        <div id={id} className="tab-pane">
            <div className="box-body">
                {/* Thông tin tài khoản */}
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border"><h4 className="box-title">{translate('human_resource.profile.bank_account')}</h4></legend>
                    <div className="row">
                        {/* Số tài khoản */}
                        <div className="form-group col-md-4">
                            <label >{translate('human_resource.profile.account_number')}</label>
                            <input type="text" className="form-control" name="atmNumber" value={atmNumber ? atmNumber : ''} onChange={handleChange} placeholder={translate('human_resource.profile.account_number')} autoComplete="off" />
                        </div>
                        {/* Tên ngân hàng */}
                        <div className="form-group col-md-4">
                            <label >{translate('human_resource.profile.bank_name')}</label>
                            <input type="text" className="form-control" name="bankName" value={bankName ? bankName : ''} onChange={handleChange} placeholder={translate('human_resource.profile.bank_name')} autoComplete="off" />
                        </div>
                        {/* Chi nhánh */}
                        <div className="form-group col-md-4">
                            <label >{translate('human_resource.profile.bank_branch')}</label>
                            <input type="text" className="form-control" name="bankAddress" value={bankAddress ? bankAddress : ''} onChange={handleChange} placeholder={translate('human_resource.profile.bank_branch')} autoComplete="off" />
                        </div>
                    </div>
                </fieldset>
                {/* Thông tin thuế */}
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border" ><h4 className="box-title">{translate('human_resource.profile.personal_income_tax')}</h4></legend>
                    {/* Mã số thuế */}
                    <div className="form-group">
                        <label >{translate('human_resource.profile.tax_number')}</label>
                        <input type="number" className="form-control" name="taxNumber" value={taxNumber ? taxNumber : ''} onChange={handleNumberTaxChange} placeholder={translate('human_resource.profile.tax_number')} autoComplete="off" />

                    </div>
                    {/* Người đại diện */}
                    <div className="form-group">
                        <label >{translate('human_resource.profile.representative')}</label>
                        <input type="text" className="form-control" name="taxRepresentative" value={taxRepresentative ? taxRepresentative : ''} onChange={handleUserTaxChange} placeholder={translate('human_resource.profile.representative')} autoComplete="off" />

                    </div>
                    {/* Ngày hoạt động */}
                    <div className="form-group">
                        <label htmlFor="startDate">{translate('human_resource.profile.day_active')}</label>
                        <DatePicker
                            id={`taxDateOfIssue-${id}`}
                            deleteValue={true}
                            value={formatDate(taxDateOfIssue)}
                            onChange={handleStartDateChange}
                        />
                    </div>
                    {/* Quản lý bởi */}
                    <div className="form-group">
                        <label>{translate('human_resource.profile.managed_by')}</label>
                        <input type="text" className="form-control" name="taxAuthority" value={taxAuthority ? taxAuthority : ''} onChange={handleUnitTaxChange} placeholder={translate('human_resource.profile.managed_by')} autoComplete="off" />
                    </div>
                </fieldset>
            </div>
        </div >
    );
};

const taxTab = connect(null, null)(withTranslate(TaxTab));
export { taxTab as TaxTab };