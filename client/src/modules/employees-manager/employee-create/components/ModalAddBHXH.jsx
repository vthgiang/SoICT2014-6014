import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ModalDialog, ModalButton, ErrorLabel, DatePicker } from '../../../../common-components';
import { EmployeeCreateValidator } from './CombineContent';
class ModalAddBHXH extends Component {
    constructor(props) {
        super(props);
        this.state = {
            unit: "",
            startDate: this.formatDate(Date.now()),
            endDate: this.formatDate(Date.now()),
            position: "",
        }
    }
    // Function format ngày hiện tại thành dạnh mm-yyyy
    formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [month, year].join('-');
    }
    // Bắt sự kiện thay đổi đơn vị công tác
    handleUnitChange = (e) => {
        let value = e.target.value;
        this.validateExperienceUnit(value, true)
    }
    validateExperienceUnit = (value, willUpdateState = true) => {
        let msg = EmployeeCreateValidator.validateExperienceUnit(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnUnit: msg,
                    unit: value,
                }
            });
        }
        return msg === undefined;
    }
    //  Bắt sự kiện thay đổi chức vụ
    handlePositionChange = (e) => {
        let value = e.target.value;
        this.validateExperiencePosition(value, true)
    }
    validateExperiencePosition = (value, willUpdateState = true) => {
        let msg = EmployeeCreateValidator.validateExperiencePosition(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnPosition: msg,
                    position: value,
                }
            });
        }
        return msg === undefined;
    }

    // Function lưu thay đổi "từ tháng/năm" vào state
    handleStartDateChange = (value) => {
        this.validateExperienceStartDate(value, true)
    }
    validateExperienceStartDate = (value, willUpdateState = true) => {
        let msg = EmployeeCreateValidator.validateExperienceStartDate(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnStartDate: msg,
                    startDate: value,
                }
            });
        }
        return msg === undefined;
    }
    // Function lưu thay đổi "đến tháng/năm" vào state
    handleEndDateChange = (value) => {
        this.validateExperienceEndDate(value, true)
    }
    validateExperienceEndDate = (value, willUpdateState = true) => {
        let msg = EmployeeCreateValidator.validateExperienceEndDate(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnEndDate: msg,
                    endDate: value,
                }
            });
        }
        return msg === undefined;
    }
    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        let result =
            this.validateExperienceUnit(this.state.unit, false) &&
            this.validateExperiencePosition(this.state.position, false);
        return result;
    }
    // Bắt sự kiện submit form
    save = () => {
        if (this.isFormValidated()) {
            return this.props.handleChange(this.state);
        }
    }
    render() {
        const { id, translate } = this.props;
        const { unit, position, startDate, endDate, errorOnStartDate, errorOnEndDate, errorOnUnit, errorOnPosition } = this.state;
        return (
            <React.Fragment>
                <ModalButton modalID={`modal-create-BHXH-${id}`} button_name={translate('modal.create')} title={translate('manage_employee.add_bhxh')} />
                <ModalDialog
                    size='50' modalID={`modal-create-BHXH-${id}`} isLoading={false}
                    formID={`form-create-BHXH-${id}`}
                    title={translate('manage_employee.add_bhxh')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id={`form-create-BHXH-${id}`}>
                        <div className={`form-group ${errorOnUnit === undefined ? "" : "has-error"}`}>
                            <label htmlFor="unit">{translate('manage_employee.unit')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="unit" value={unit} onChange={this.handleUnitChange} autoComplete="off" />
                            <ErrorLabel content={errorOnUnit} />
                        </div>
                        <div className="row">
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnStartDate === undefined ? "" : "has-error"}`}>
                                <label>{translate('manage_employee.from_month_year')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`addBHXH-start-date-${id}`}
                                    dateFormat="month-year"
                                    value={startDate}
                                    onChange={this.handleStartDateChange}
                                />
                                <ErrorLabel content={errorOnStartDate} />
                            </div>
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnEndDate === undefined ? "" : "has-error"}`}>
                                <label>{translate('manage_employee.to_month_year')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`addBHXH-end-date-${id}`}
                                    dateFormat="month-year"
                                    value={endDate}
                                    onChange={this.handleEndDateChange}
                                />
                                <ErrorLabel content={errorOnEndDate} />
                            </div>
                        </div>
                        <div className={`form-group ${errorOnPosition === undefined ? "" : "has-error"}`}>
                            <label htmlFor="unit">{translate('table.position')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="position" value={position} onChange={this.handlePositionChange} autoComplete="off" />
                            <ErrorLabel content={errorOnPosition} />
                        </div>
                    </form>
                </ModalDialog>
            </React.Fragment>
        );
    }
};
const addBHXH = connect(null, null)(withTranslate(ModalAddBHXH));
export { addBHXH as ModalAddBHXH };
