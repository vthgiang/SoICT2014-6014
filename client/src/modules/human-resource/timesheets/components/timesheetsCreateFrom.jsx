import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { getStorage } from '../../../../config';

import { DialogModal, ErrorLabel, DatePicker, SlimScroll, SelectBox } from '../../../../common-components';

import { TimesheetsFormValidator } from './combinedContent';

import { TimesheetsActions } from '../redux/actions';
import { EmployeeManagerActions } from '../../profile/employee-management/redux/actions';
import ValidationHelper from '../../../../helpers/validationHelper';

const TimesheetsCreateForm = (props) => {

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

    /**
     * Function lấy danh sách các ngày trong tháng
     * @param {*} month : Tháng
     */
    const getAllDayOfMonth = (month) => {
        const lang = getStorage("lang");
        let arrayDay = [], days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        if (lang === 'vn') {
            days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
        };
        let partMonth = month.split('-');
        let lastDayOfmonth = new Date(partMonth[1], partMonth[0], 0);

        for (let i = 1; i <= lastDayOfmonth.getDate(); i++) {
            let day = i;
            if (i.toString().length < 2)
                day = '0' + i;
            let date = new Date([partMonth[1], partMonth[0], day]);
            arrayDay = [...arrayDay, { day: days[date.getDay()], date: date.getDate() }]
        }
        return arrayDay
    }

    let _allDayOfMonth = getAllDayOfMonth(formatDate(Date.now(), true));

    const [state, setState] = useState({
        employee: "",
        month: formatDate(Date.now(), true),
        shift1s: _allDayOfMonth.map(x => true),
        shift2s: _allDayOfMonth.map(x => true),
        shift3s: _allDayOfMonth.map(x => false),
        timekeepingByHours: _allDayOfMonth.map(x => 0),
        allDayOfMonth: _allDayOfMonth,
        totalHoursOff: "",
        totalOvertime: ""
    })

    useEffect(() => {
        props.getAllEmployee();
    }, []);





    /** Function bắt sự kiện thay đổi mã nhân viên */
    const handleMSNVChange = async (value) => {
        validateEmployeeNumber(value[0], true);
    }
    const validateEmployeeNumber = (value, willUpdateState = true) => {
        let { translate } = props;
        let msg = TimesheetsFormValidator.validateEmployeeNumber(value, translate);
        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    errorOnEmployee: msg,
                    employee: value,
                }
            });

        }
        return msg === undefined;
    }

    /**
     * Function bắt sự kiện thay đổi tháng lương để lưu vào state
     * @param {*} value : Tháng
     */
    const handleMonthChange = (value) => {
        let { message } = ValidationHelper.validateEmpty(translate, value);
        if (value) {
            let allDayOfMonth = getAllDayOfMonth(value);
            setState({
                ...state,
                shift1s: allDayOfMonth.map(x => true),
                shift2s: allDayOfMonth.map(x => true),
                shift3s: allDayOfMonth.map(x => false),
                allDayOfMonth: allDayOfMonth,
                month: value,
                errorOnMonthSalary: message,
            })
        }
    }


    const validateMonth = (value, willUpdateState = true) => {
        const { translate } = props;
        let msg = TimesheetsFormValidator.validateMonth(value, translate);
        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    errorOnMonthSalary: msg,
                    month: value,
                }
            });
        }
        return msg === undefined;
    }

    /**
     * Function bắt sự kiện thay đổi chấm công nhân viên (checkbox)
     * @param {*} workSession : Dữ liệu ca chấm công
     * @param {*} index : Số thứ tự công thay đổi
     */
    const handleCheckBoxChange = (workSession, index) => {
        let { shift1s, shift2s, shift3s } = state;
        if (workSession === "shift1s") {
            shift1s[index] = !shift1s[index];
            setState({
                ...state,
                shift1s: shift1s
            })
        } else if (workSession === "shift2s") {
            shift2s[index] = !shift2s[index];
            setState({
                ...state,
                shift2s: shift2s
            })
        } else {
            shift3s[index] = !shift3s[index];
            setState({
                ...state,
                shift3s: shift3s
            })
        }
    }

    /**
     * Function thay đổi số giờ làm của một ngày
     * @param {*} index : số thứ tự ngày cần thay đổi
     */
    const handleHoursChange = (e, index) => {
        let { timekeepingByHours } = state;
        const { value } = e.target;
        timekeepingByHours[index] = value;
        setState({
            ...state,
            timekeepingByHours: timekeepingByHours
        })
    }

    // Bắt sự kiện thay đổi số giờ nghỉ và số giờ tăng ca
    const handleChange = (e) => {
        const { value, name } = e.target;
        setState({
            ...state,
            [name]: value
        })
    }

    /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form  */
    const isFormValidated = () => {
        const { month, employee } = state;
        let result = validateMonth(month, false) && validateEmployeeNumber(employee, false);
        return result;
    }

    /** Function bắt sự kiện lưu bảng chấm công */
    const save = () => {
        let { month, shift1s, shift2s, shift3s, timekeepingByHours } = state;
        let partMonth = month.split('-');
        let monthNew = [partMonth[1], partMonth[0]].join('-');
        if (isFormValidated()) {
            props.createTimesheets({ ...state, month: monthNew, timekeepingByHours: timekeepingByHours, timekeepingByShift: { shift1s: shift1s, shift2s: shift2s, shift3s: shift3s } });
        }
    }

    const { timesheets, translate, employeesManager } = props;

    const { timekeepingType } = props;

    const { errorOnEmployee, errorOnMonthSalary, month, totalHoursOff, totalOvertime, employee, allDayOfMonth, shift1s, shift2s, shift3s, timekeepingByHours } = state;

    let listAllEmployees = employeesManager.listAllEmployees;

    return (
        <React.Fragment>
            <DialogModal
                size='50' modalID="modal-create-timesheets" isLoading={timesheets.isLoading}
                formID="form-create-timesheets"
                title={translate('human_resource.timesheets.add_timesheets_title')}
                resetOnSave={true}
                resetOnClose={true}
                func={save}
                disableSubmit={!isFormValidated()}
            >
                <form className="form-group" id="form-create-timesheets">
                    {/* Mã số nhân viên */}
                    <div className={`form-group ${errorOnEmployee && "has-error"}`}>
                        <label>{translate('human_resource.staff_number')}<span className="text-red">*</span></label>
                        <SelectBox
                            id={`create-timesheets-employee`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            value={employee}
                            items={listAllEmployees.map(y => { return { value: y._id, text: `${y.employeeNumber} - ${y.fullName}` } }).concat([{ value: "", text: translate('human_resource.non_staff') }])}
                            onChange={handleMSNVChange}
                        />
                        <ErrorLabel content={errorOnEmployee} />
                    </div>
                    {/* Tháng */}
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
                    <div className="row">
                        {/* Số giờ nghỉ phép */}
                        <div className="col-sm-6 col-xs-12 form-group">
                            <label>{translate('human_resource.timesheets.total_hours_off')}</label>
                            <input type="text" className="form-control" name="totalHoursOff" value={totalHoursOff} onChange={handleChange} autoComplete="off" />
                        </div>

                        {/* Số giờ tăng ca */}
                        <div className="col-sm-6 col-xs-12 form-group">
                            <label>{translate('human_resource.timesheets.total_over_time')}</label>
                            <input type="text" className="form-control" name="totalOvertime" value={totalOvertime} onChange={handleChange} autoComplete="off" />
                        </div>
                    </div>
                    {/* Công các ngày trong tháng */}
                    {
                        timekeepingType === 'shift' &&
                        <div className="form-group">
                            <label>{translate('human_resource.timesheets.work_date_in_month')}</label>
                            <div id="create-croll-table">
                                <table id="create-timesheets" className="table table-striped table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th className="col-fixed not-sort" style={{ width: 100 }}>{translate('human_resource.timesheets.shift_work')}</th>
                                            {allDayOfMonth.map((x, index) => (
                                                <th className="col-fixed not-sort" style={{ width: 60 }} key={index}>{`${x.date} - ${x.day}`}</th>
                                            ))}
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr>
                                            <td>{translate('human_resource.timesheets.shifts1')}</td>
                                            {allDayOfMonth.map((x, index) => (
                                                <td key={index}>
                                                    <div className="checkbox" style={{ textAlign: 'center' }}>
                                                        <input type="checkbox" onChange={() => handleCheckBoxChange('shift1s', index)}
                                                            style={{ margin: 'auto', position: 'inherit', width: 17, height: 17 }} checked={shift1s[index]} />
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td>{translate('human_resource.timesheets.shifts2')}</td>
                                            {allDayOfMonth.map((x, index) => (
                                                <td key={index}>
                                                    <div className="checkbox" style={{ textAlign: 'center' }}>
                                                        <input type="checkbox" onChange={() => handleCheckBoxChange('shift2s', index)}
                                                            style={{ margin: 'auto', position: 'inherit', width: 17, height: 17 }} checked={shift2s[index]} />
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td>{translate('human_resource.timesheets.shifts3')}</td>
                                            {allDayOfMonth.map((x, index) => (
                                                <td key={index}>
                                                    <div className="checkbox" style={{ textAlign: 'center' }}>
                                                        <input type="checkbox" onChange={() => handleCheckBoxChange('shift3s', index)}
                                                            style={{ margin: 'auto', position: 'inherit', width: 17, height: 17 }} checked={shift3s[index]} />
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>}
                    {
                        timekeepingType === 'hours' &&
                        <div className="form-group">
                            <label>{translate('human_resource.timesheets.date_of_month')}</label>
                            <div id="create-croll-table">
                                <table id="create-timesheets" className="table table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            {allDayOfMonth.map((x, index) => (
                                                <th className="col-fixed not-sort" style={{ width: 100 }} key={index}>{`${x.date} - ${x.day}`}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            {timekeepingByHours.map((x, index) => (
                                                <td key={index}>
                                                    <input type="number" className="form-control" style={{ width: "100%" }} value={x !== 0 ? x : ''} onChange={(e) => handleHoursChange(e, index)} />
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    }

                    <SlimScroll outerComponentId='create-croll-table' innerComponentId='create-timesheets' innerComponentWidth={1500} activate={true} />
                </form>
            </DialogModal>
        </React.Fragment >
    )
}

function mapState(state) {
    const { timesheets, employeesManager } = state;
    return { timesheets, employeesManager };
};

const actionCreators = {
    createTimesheets: TimesheetsActions.createTimesheets,
    getAllEmployee: EmployeeManagerActions.getAllEmployee,
};

const createForm = connect(mapState, actionCreators)(withTranslate(TimesheetsCreateForm));
export { createForm as TimesheetsCreateForm };