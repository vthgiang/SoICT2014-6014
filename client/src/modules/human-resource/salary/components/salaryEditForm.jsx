import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../common-components';

import { SalaryActions } from '../redux/actions';

import ValidationHelper from '../../../../helpers/validationHelper';

const SalaryEditForm = (props) => {
    const [state, setState] = useState({});
    const { updateSalary, handleOrganizationalUnitChange, handleMonthChange } = props

    /** Function bắt sự kiện thay đổi tiền lương chính */
    const handleMainSalaryChange = (e) => {
        let value = e.target.value;
        validateMainSalary(value, true);
    }
    const validateMainSalary = (value, willUpdateState = true) => {
        let { translate } = props;
        let { message } = ValidationHelper.validateEmpty(translate, value);

        if (willUpdateState) {
            setState(state => ({
                ...state,
                errorOnMainSalary: message,
                mainSalary: value}))
        }
        return message === undefined;
    }


    /** Function bắt sự kiện thay đổi đơn vị tiền lương */
    const handleChange = (e) => {
        let value = e.target.value;
        setState(state => ({...state, unit: value}));
    }

    /** Bắt sự kiện click thêm lương thưởng khác */
    const handleAddBonus = () => {
        let { bonus } = state;
        if (bonus.length !== 0) {
            let result;
            for (let n in bonus) {
                result = validateNameSalary(bonus[n].nameBonus, n) &&
                    validateMoreMoneySalary(bonus[n].number, n);
                if (result === false) {
                    validateNameSalary(bonus[n].nameBonus, n);
                    validateMoreMoneySalary(bonus[n].number, n)
                    break;
                }
            }
            if (result === true) {
                setState(state => ({...state, bonus: [...bonus, { nameBonus: "", number: "" }]}));
            }
        } else {
            setState(state => ({...state, bonus: [...bonus, { nameBonus: "", number: "" }]}));
        }

    }

    /** Bắt sự kiện chỉnh sửa tên lương thưởng khác */
    const handleChangeNameBonus = (e) => {
        let { value, className } = e.target;
        validateNameSalary(value, className);
    }

    const validateNameSalary = (value, className, willUpdateState = true) => {
        let { translate } = props;
        let { message } = ValidationHelper.validateEmpty(translate, value);

        if (willUpdateState) {
            let { bonus } = state;
            bonus[className] = { ...bonus[className], nameBonus: value }
            setState(state => ({
                ...state,
                errorOnNameSalary: message,
                bonus: bonus
            }));
        }
        return message === undefined;
    }

    /** Bắt sự kiện chỉnh sửa tiền lương thưởng khác  */
    const handleChangeMoneyBonus = (e) => {
        let { value, className } = e.target;
        validateMoreMoneySalary(value, className);
    }
    const validateMoreMoneySalary = (value, className, willUpdateState = true) => {
        let { translate } = props;
        let { message } = ValidationHelper.validateEmpty(translate, value);

        if (willUpdateState) {
            let { bonus } = state;
            bonus[className] = { ...bonus[className], number: value }
            setState(state => ({
                ...state,
                errorOnMoreMoneySalary: message,
                bonus: bonus
            }))
        }
        return message === undefined;
    }

    /**
     * Function xoá lương thưởng khác
     * @param {*} index : Số thứ tự lương thưởng khác cần xoá
     */
    const Delete = (index) => {
        let { bonus } = state;
        bonus.splice(index, 1);
        setState(state => ({
            ...state,
            bonus: bonus
        }))
        if (bonus.length !== 0) {
            for (let n in bonus) {
                validateNameSalary(bonus[n].nameBonus, n);
                validateMoreMoneySalary(bonus[n].number, n)
            }
        } else {
            setState(state => ({
                ...state,
                errorOnMoreMoneySalary: undefined,
                errorOnNameSalary: undefined
            }));
        }
    };

    /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form */
    const isFormValidated = () => {
        let { mainSalary, bonus } = state;
        let result = validateMainSalary(mainSalary, false);
        if (result === true) {
            if (bonus !== []) {
                let test = bonus;
                for (let n in test) {
                    result = validateNameSalary(test[n].nameBonus, n, false) &&
                        validateMoreMoneySalary(test[n].number, n, false);
                    if (result === false) break;
                }
            }
        }
        return result;
    }

    /** Function bắt sự kiện lưu bảng lương */
    const save = () => {
        let id = state._id;
        if (isFormValidated()) {
            return updateSalary(id, state);
        }
    }

    if (props._id != state._id) {
        setState(state => ({
            ...state,
            _id: props._id,
            unit: props.unit,
            organizationalUnit: props.organizationalUnit,
            employeeNumber: props.employeeNumber,
            month: props.month,
            mainSalary: props.mainSalary,
            bonus: props.bonus,
            errorOnMainSalary: undefined,
            errorOnNameSalary: undefined,
            errorOnMoreMoneySalary: undefined,
        }))
    }

    const { translate, salary, department } = props;

    const { employeeNumber, organizationalUnit, unit, mainSalary, bonus, month, _id,
        errorOnMainSalary, errorOnNameSalary, errorOnMoreMoneySalary } = state;

    return (
        <React.Fragment>
            <DialogModal
                size='50' modalID="modal-edit-salary" isLoading={salary.isLoading}
                formID="form-edit-salary"
                title={translate('human_resource.salary.edit_salary')}
                func={save}
                disableSubmit={!isFormValidated()}
            >
                <form className="form-group" id="form-edit-salary">
                    {/* Mã số nhân viên */}
                    <div className="form-group">
                        <label>{translate('human_resource.staff_number')}<span className="text-red">*</span></label>
                        <input type="text" className="form-control" name="employeeNumber" value={employeeNumber} disabled />
                    </div>
                    {/* Đơn vị */}
                    <div className="form-group">
                        <label>{translate('human_resource.unit')}<span className="text-red">*</span></label>
                        <SelectBox
                            id={`edit-salary-unit`}
                            className="form-control select2"
                            disabled={true}
                            style={{ width: "100%" }}
                            value={organizationalUnit}
                            items={department.list.map(y => { return { value: y._id, text: y.name } })}
                            onChange={handleOrganizationalUnitChange}
                        />
                    </div>
                    {/* Tháng lương */}
                    <div className="form-group">
                        <label>{translate('human_resource.month')}<span className="text-red">*</span></label>
                        <DatePicker
                            id={`edit_month${_id}`}
                            dateFormat="month-year"
                            value={month}
                            onChange={handleMonthChange}
                            disabled={true}
                        />
                    </div>
                    {/* Tiền lương chính */}
                    <div className={`form-group ${errorOnMainSalary && "has-error"}`}>
                        <label >{translate('human_resource.salary.table.main_salary')}<span className="text-red">*</span></label>
                        <div>
                            <input type="number" className="form-control" name="mainSalary" value={mainSalary} onChange={handleMainSalaryChange} style={{ display: "inline", width: "85%" }} autoComplete="off" />
                            <select className="form-control" name="unit" value={unit} onChange={handleChange} style={{ display: "inline", width: "15%" }}>
                                <option value="VND">VND</option>
                                <option value="USD">USD</option>
                            </select>
                        </div>
                        <ErrorLabel content={errorOnMainSalary} />
                    </div>
                    {/* Các loại lương thưởng khác*/}
                    <div className={`form-group ${(errorOnNameSalary || errorOnMoreMoneySalary) && "has-error"}`}>
                        <label>{translate('human_resource.salary.table.other_salary')}<a title={translate('human_resource.salary.table.add_more_salary')}><i className="fa fa-plus-square" style={{ color: "#28A745", marginLeft: 5 }} onClick={handleAddBonus} /></a></label>
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}>
                            <thead>
                                <tr>
                                    <th>{translate('human_resource.salary.table.name_salary')}</th>
                                    <th>{translate('human_resource.salary.table.money_salary')}</th>
                                    <th style={{ width: '120px', textAlign: 'center' }}>{translate('human_resource.salary.table.action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bonus && bonus.length !== 0 &&
                                    bonus.map((x, index) => (
                                        <tr key={index}>
                                            <td><input className={index} type="text" value={x.nameBonus} name="nameBonus" style={{ width: "100%" }} onChange={handleChangeNameBonus} autoComplete="off" /></td>
                                            <td><input className={index} type="number" value={x.number} name="number" style={{ width: "100%" }} onChange={handleChangeMoneyBonus} autoComplete="off" /></td>
                                            <td style={{ textAlign: "center" }}>
                                                <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => Delete(index)}><i className="material-icons"></i></a>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        {
                            (!bonus || bonus.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                        <ErrorLabel content={errorOnNameSalary} />
                        <ErrorLabel content={errorOnMoreMoneySalary} />
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
};
function mapState(state) {
    const { salary, department } = state;
    return { salary, department };
};

const actionCreators = {
    updateSalary: SalaryActions.updateSalary,
};

const editSalary = connect(mapState, actionCreators)(withTranslate(SalaryEditForm));
export { editSalary as SalaryEditForm };