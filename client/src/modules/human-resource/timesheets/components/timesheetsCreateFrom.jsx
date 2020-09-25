import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel, DatePicker, SlimScroll, SelectBox } from '../../../../common-components';

import { TimesheetsFormValidator } from './combinedContent';

import { TimesheetsActions } from '../redux/actions';
import { EmployeeManagerActions } from '../../profile/employee-management/redux/actions';

class TimesheetsCreateForm extends Component {
    constructor(props) {
        super(props);
        let allDayOfMonth = this.getAllDayOfMonth(this.formatDate(Date.now(), true));
        this.state = {
            employee: "",
            month: this.formatDate(Date.now(), true),
            shift1: allDayOfMonth.map(x => false),
            shift2: allDayOfMonth.map(x => false),
            shift3: allDayOfMonth.map(x => false),
            allDayOfMonth: allDayOfMonth,
        };
    }

    componentDidMount() {
        this.props.getAllEmployee();
    }

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
     */
    formatDate(date, monthYear = false) {
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
    getAllDayOfMonth = (month) => {
        let partMonth = month.split('-');
        let lastDayOfmonth = new Date(partMonth[1], partMonth[0], 0);
        let arrayDay = [], days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        for (let i = 1; i <= lastDayOfmonth.getDate(); i++) {
            let day = i;
            if (i.toString().length < 2)
                day = '0' + i;
            let date = new Date([partMonth[1], partMonth[0], day]);
            arrayDay = [...arrayDay, { day: days[date.getDay()], date: date.getDate() }]
        }
        return arrayDay
    }

    /** Function bắt sự kiện thay đổi mã nhân viên */
    handleMSNVChange = async (value) => {
        this.validateEmployeeNumber(value[0], true);
    }
    validateEmployeeNumber = (value, willUpdateState = true) => {
        let { translate } = this.props;
        let msg = TimesheetsFormValidator.validateEmployeeNumber(value, translate);
        if (willUpdateState) {
            this.setState(state => {
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
    handleMonthChange = (value) => {
        this.validateMonth(value, true);
        if (value) {
            let allDayOfMonth = this.getAllDayOfMonth(value);
            this.setState({
                shift1: allDayOfMonth.map(x => false),
                shift2: allDayOfMonth.map(x => false),
                shift3: allDayOfMonth.map(x => false),
                allDayOfMonth: allDayOfMonth
            })
        }
    }
    validateMonth = (value, willUpdateState = true) => {
        const { translate } = this.props;
        let msg = TimesheetsFormValidator.validateMonth(value, translate);
        if (willUpdateState) {
            this.setState(state => {
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
    handleCheckBoxChange = (workSession, index) => {
        let { shift1, shift2, shift3 } = this.state;
        if (workSession === "shift1") {
            shift1[index] = !shift1[index];
            this.setState({
                shift1: shift1
            })
        } else if (workSession === "shift2") {
            shift2[index] = !shift2[index];
            this.setState({
                shift2: shift2
            })
        } else {
            shift3[index] = !shift3[index];
            this.setState({
                shift3: shift3
            })
        }
    }

    /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form  */
    isFormValidated = () => {
        const { month, employee } = this.state;
        let result = this.validateMonth(month, false) && this.validateEmployeeNumber(employee, false);
        return result;
    }

    /** Function bắt sự kiện lưu bảng chấm công */
    save = () => {
        let { month } = this.state;
        let partMonth = month.split('-');
        let monthNew = [partMonth[1], partMonth[0]].join('-');
        if (this.isFormValidated()) {
            this.props.createTimesheets({ ...this.state, month: monthNew });
        }
    }

    render() {
        const { timesheets, translate, employeesManager } = this.props;

        const { errorOnEmployee, errorOnMonthSalary, month, employee, allDayOfMonth, shift1, shift2, shift3 } = this.state;

        let listAllEmployees = employeesManager.listAllEmployees;
        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID="modal-create-timesheets" isLoading={timesheets.isLoading}
                    formID="form-create-timesheets"
                    title={translate('human_resource.timesheets.add_timesheets_title')}
                    resetOnSave={true}
                    resetOnClose={true}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
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
                                onChange={this.handleMSNVChange}
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
                                onChange={this.handleMonthChange}
                            />
                            <ErrorLabel content={errorOnMonthSalary} />
                        </div>
                        {/* Công các ngày trong tháng */}
                        <div className="form-group" id="create-croll-table">
                            <label>{translate('human_resource.timesheets.work_date_in_month')}</label>
                            <table id="create-timesheets" className="table table-striped table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <th style={{ width: 100 }}>{translate('human_resource.timesheets.shift_work')}</th>
                                        {allDayOfMonth.map((x, index) => (
                                            <th key={index}>{x.day}&nbsp; {x.date}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{translate('human_resource.timesheets.shifts1')}</td>
                                        {allDayOfMonth.map((x, index) => (
                                            <th key={index}>
                                                <div className="checkbox" style={{ textAlign: 'center' }}>
                                                    <input type="checkbox" onChange={() => this.handleCheckBoxChange('shift1', index)}
                                                        style={{ margin: 'auto', position: 'inherit', width: 17, height: 17 }} checked={shift1[index]} />
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td>{translate('human_resource.timesheets.shifts2')}</td>
                                        {allDayOfMonth.map((x, index) => (
                                            <th key={index}>
                                                <div className="checkbox" style={{ textAlign: 'center' }}>
                                                    <input type="checkbox" onChange={() => this.handleCheckBoxChange('shift2', index)}
                                                        style={{ margin: 'auto', position: 'inherit', width: 17, height: 17 }} checked={shift2[index]} />
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td>{translate('human_resource.timesheets.shifts3')}</td>
                                        {allDayOfMonth.map((x, index) => (
                                            <th key={index}>
                                                <div className="checkbox" style={{ textAlign: 'center' }}>
                                                    <input type="checkbox" onChange={() => this.handleCheckBoxChange('shift3', index)}
                                                        style={{ margin: 'auto', position: 'inherit', width: 17, height: 17 }} checked={shift3[index]} />
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <SlimScroll outerComponentId='create-croll-table' innerComponentId='create-timesheets' innerComponentWidth={1500} activate={true} />

                    </form>
                </DialogModal>
            </React.Fragment>
        )
    }
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