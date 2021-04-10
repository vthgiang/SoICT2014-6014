import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../common-components';

import { SalaryActions } from '../redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { EmployeeManagerActions } from '../../profile/employee-management/redux/actions';
import ValidationHelper from '../../../../helpers/validationHelper';

const SalaryCreateForm = (props) => {
    const { getAllEmployee, getDepartmentOfUser, createSalary } = props;

    /**
     * Function format ngày hiện tại thành dạnh mm-yyyy
     * @param {*} date : Ngày muốn format
     */
    const formatDate = (date) => {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();
            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;
            return [month, year].join('-');
        }
        return date;
    }

    const [state, setState] = useState({
        unit: "VND",
        employee: "",
        organizationalUnit: "",
        month: formatDate(Date.now()),
        mainSalary: "",
        bonus: [],
    });

    useState(() => {
        getAllEmployee({ organizationalUnits: 'allUnist' });
    }, []);

    

    /** Function bắt sự kiện thay đổi mã nhân viên */
    const validateEmployeeNumber = (value, willUpdateState = true) => {
        let { translate } = props;
        let { message } = ValidationHelper.validateEmpty(translate, value);

        if (willUpdateState) {
            setState(state => ({...state,
                errorOnEmployee: message,
                employee: value,
                organizationalUnit: ""}))
        }
        return message === undefined;
    }

    const handleMSNVChange = async (value) => {
        await getDepartmentOfUser({ email: value[0] });
        validateEmployeeNumber(value[0], true);
    }

    /** Function bắt sự kiện thay đổi đơn vị */
    const validateOrganizationalUnit = (value, willUpdateState = true) => {
        let { translate } = props;
        let { message } = ValidationHelper.validateEmpty(translate, value);

        if (willUpdateState) {
            setState(state => ({
                ...state,
                errorOnOrganizationalUnit: message,
                organizationalUnit: value,
            }))
        }
        return message === undefined;
    }

    const handleOrganizationalUnitChange = (value) => {
        validateOrganizationalUnit(value[0], true);
    }
    


    /**
     * Function bắt sự kiện thay đổi tháng lương để lưu vào state
     * @param {*} value : Giá trị tháng lương
     */

    const validateMonthSalary = (value, willUpdateState = true) => {
        let { translate } = props;
        let { message } = ValidationHelper.validateEmpty(translate, value);

        if (willUpdateState) {
            setState(state => ({
                ...state,
                errorOnMonthSalary: message,
                month: value,
            }))
        }
        return message === undefined;
    }
    const handleMonthChange = (value) => {
        validateMonthSalary(value, true);
    }
    

    /** Function bắt sự kiện thay đổi tiền lương chính */
    const validateMainSalary = (value, willUpdateState = true) => {
        let { translate } = props;
        let { message } = ValidationHelper.validateEmpty(translate, value);

        if (willUpdateState) {
            setState(state => ({
                ...state,
                errorOnMainSalary: message,
                mainSalary: value
            }))
        }
        return message === undefined;
    }
    const handleMainSalaryChange = (e) => {
        let value = e.target.value;
        validateMainSalary(value, true);
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
                setState(state => ({
                    ...state,
                    bonus: [...bonus, { nameBonus: "", number: "" }]
                }))
            }
        } else {
            setState(state => ({
                ...state,
                bonus: [...bonus, { nameBonus: "", number: "" }]
            }))
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
            }))
        }
        return message === undefined;
    }

    /** Bắt sự kiện chỉnh sửa tiền lương thưởng khác */
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
        setState(state => ({...state, bonus: bonus}))
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
            }))
        }
    };

    /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form  */
    const isFormValidated = () => {
        const { user } = props;
        let { employee, organizationalUnit, mainSalary, month, bonus } = state;

        if (user.organizationalUnitsOfUserByEmail) {
            if (!organizationalUnit) {
                let department = user.organizationalUnitsOfUserByEmail[0];
                organizationalUnit = department._id;
            }
        }

        let result = validateEmployeeNumber(employee, false) &&
            validateMainSalary(mainSalary, false) && validateOrganizationalUnit(organizationalUnit, false) &&
            validateMonthSalary(month, false);

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
        const { user, employeesManager } = props;
        let { organizationalUnit, month, employee } = state;

        if (user.organizationalUnitsOfUserByEmail) {
            if (!organizationalUnit) {
                let department = user.organizationalUnitsOfUserByEmail[0];
                organizationalUnit = department._id;
            }
        }
        let employeeID = employeesManager.listEmployeesOfOrganizationalUnits.find(x => x.emailInCompany === employee);
        employeeID = employeeID._id;

        let partMonth = month.split('-');
        let monthNew = [partMonth[1], partMonth[0]].join('-');
        if (isFormValidated()) {
            createSalary({ ...state, employee: employeeID, organizationalUnit: organizationalUnit, month: monthNew });
        }
    }

    const { translate, salary, employeesManager, user } = props;

    let { employee, organizationalUnit, unit, mainSalary, bonus, month, errorOnEmployee, errorOnOrganizationalUnit,
        errorOnMainSalary, errorOnNameSalary, errorOnMoreMoneySalary, errorOnMonthSalary } = state;

    let listAllEmployees = employeesManager.listEmployeesOfOrganizationalUnits;
    let listDepartments = [{ _id: "", name: translate('human_resource.non_unit') }];

    if (user.organizationalUnitsOfUserByEmail) {
        listDepartments = user.organizationalUnitsOfUserByEmail;
        if (!organizationalUnit) {
            let department = user.organizationalUnitsOfUserByEmail[0];
            organizationalUnit = department._id;
        }
    }

    return (
        <React.Fragment>
            <DialogModal
                size='50' modalID="modal-create-salary" isLoading={salary.isLoading}
                formID="form-create-salary"
                title={translate('human_resource.salary.add_salary_title')}
                resetOnSave={true}
                resetOnClose={true}
                func={save}
                disableSubmit={!isFormValidated()}
            >
                <form className="form-group" id="form-create-salary">
                    {/* Mã số nhân viên */}
                    <div className={`form-group ${errorOnEmployee && "has-error"}`}>
                        <label>{translate('human_resource.staff_number')}<span className="text-red">*</span></label>
                        <SelectBox
                            id={`create-salary-employee`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            value={employee}
                            items={listAllEmployees.map(y => { return { value: y.emailInCompany, text: `${y.employeeNumber} - ${y.fullName}` } }).concat([{ value: "", text: translate('human_resource.non_staff') }])}
                            onChange={handleMSNVChange}
                        />
                        <ErrorLabel content={errorOnEmployee} />
                    </div>
                    {/* Đơn vị */}
                    <div className={`form-group ${errorOnOrganizationalUnit && "has-error"}`}>
                        <label>{translate('human_resource.unit')}<span className="text-red">*</span></label>
                        <SelectBox
                            id={`create-salary-unit`}
                            className="form-control select2"
                            disabled={listDepartments.length > 1 ? false : true}
                            style={{ width: "100%" }}
                            value={organizationalUnit}
                            items={listDepartments.map(y => { return { value: y._id, text: y.name } })}
                            onChange={handleOrganizationalUnitChange}
                        />
                        <ErrorLabel content={errorOnOrganizationalUnit} />
                    </div>
                    {/* Tháng lương */}
                    <div className={`form-group ${errorOnMonthSalary && "has-error"}`}>
                        <label>{translate('human_resource.month')}<span className="text-red">*</span></label>
                        <DatePicker
                            id="create_month"
                            dateFormat="month-year"
                            value={month}
                            onChange={handleMonthChange}
                        />
                        <ErrorLabel content={errorOnMonthSalary} />
                    </div>
                    {/* Tiền lương chính */}
                    <div className={`form-group ${errorOnMainSalary && "has-error"}`}>
                        <label >{translate('human_resource.salary.table.main_salary')}<span className="text-red">*</span></label>
                        <div>
                            <input type="number" className="form-control" name="mainSalary" value={mainSalary} onChange={handleMainSalaryChange}
                                style={{ display: "inline", width: "85%" }} autoComplete="off" placeholder={translate('human_resource.salary.table.main_salary')} autoComplete="off" />
                            <select className="form-control" name="unit" value={unit} onChange={handleChange} style={{ display: "inline", width: "15%" }}>
                                <option value="VND">VND</option>
                                <option value="USD">USD</option>
                            </select>
                        </div>
                        <ErrorLabel content={errorOnMainSalary} />
                    </div>
                    {/* Các loại lương thưởng khác */}
                    <div className={`form-group ${(errorOnNameSalary || errorOnMoreMoneySalary) && "has-error"}`}>
                        <label>{translate('human_resource.salary.table.other_salary')}<a title={translate('human_resource.salary.table.add_more_salary')}>
                            <i className="fa fa-plus-square" style={{ color: "#28A745", marginLeft: 5 }} onClick={handleAddBonus} /></a></label>
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}>
                            <thead>
                                <tr>
                                    <th>{translate('human_resource.salary.table.name_salary')}</th>
                                    <th>{translate('human_resource.salary.table.money_salary')}</th>
                                    <th style={{ width: '120px', textAlign: 'center' }}>{translate('human_resource.salary.table.action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(bonus && bonus.length !== 0) &&
                                    bonus.map((x, index) => (
                                        <tr key={index}>
                                            <td><input className={index} type="text" value={x.nameBonus} name="nameBonus" style={{ width: "100%" }} onChange={handleChangeNameBonus} /></td>
                                            <td><input className={index} type="number" value={x.number} name="number" style={{ width: "100%" }} onChange={handleChangeMoneyBonus} /></td>
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
    const { salary, employeesManager, user } = state;
    return { salary, employeesManager, user };
};

const actionCreators = {
    createSalary: SalaryActions.createSalary,
    getAllEmployee: EmployeeManagerActions.getAllEmployee,
    getDepartmentOfUser: UserActions.getDepartmentOfUser,
};

const createForm = connect(mapState, actionCreators)(withTranslate(SalaryCreateForm));
export { createForm as SalaryCreateForm };