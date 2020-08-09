import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, ErrorLabel, DatePicker } from '../../../../../common-components';
import { EmployeeCreateValidator } from './combinedContent';
class SocialInsuranceEditModal extends Component {
    constructor(props) {
        super(props);
        this.state = {}
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
                    company: value,
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
        let { errorOnEndDate, endDate } = this.state;
        let errorOnStartDate;
        let partValue = value.split('-');
        let date = new Date([partValue[1], partValue[0], 1].join('-'));

        let partEndDate = endDate.split('-');
        let d = new Date([partEndDate[1], partEndDate[0], 1].join('-'));

        if (date.getTime() > d.getTime()) {
            errorOnStartDate = "Từ tháng/năm phải trước đến tháng/năm";
        } else {
            errorOnEndDate = errorOnEndDate === 'Đến tháng/năm phải sau từ tháng/năm' ? undefined : errorOnEndDate
        }
        this.setState({
            startDate: value,
            errorOnStartDate: errorOnStartDate,
            errorOnEndDate: errorOnEndDate
        })

    }
    // Function lưu thay đổi "đến tháng/năm" vào state
    handleEndDateChange = (value) => {
        let { startDate, errorOnStartDate } = this.state;
        let partValue = value.split('-');
        let date = new Date([partValue[1], partValue[0], 1].join('-'));

        let partStartDate = startDate.split('-');
        let d = new Date([partStartDate[1], partStartDate[0], 1].join('-'));
        let errorOnEndDate;
        if (d.getTime() > date.getTime()) {
            errorOnEndDate = "Đến tháng/năm phải sau từ tháng/năm";
        } else {
            errorOnStartDate = errorOnStartDate === 'Từ tháng/năm phải trước đến tháng/năm' ? undefined : errorOnStartDate
        }
        this.setState({
            endDate: value,
            errorOnStartDate: errorOnStartDate,
            errorOnEndDate: errorOnEndDate
        })
    }
    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        let result = this.validateExperienceUnit(this.state.company, false) && this.validateExperiencePosition(this.state.position, false);
        let partStart = this.state.startDate.split('-');
        let startDate = [partStart[1], partStart[0]].join('-');
        let partEnd = this.state.endDate.split('-');
        let endDate = [partEnd[1], partEnd[0]].join('-');
        if (new Date(startDate).getTime() <= new Date(endDate).getTime()) {
            return result;
        } else return false;


    }
    // Bắt sự kiện submit form
    save = async () => {
        let partStart = this.state.startDate.split('-');
        let startDate = [partStart[1], partStart[0]].join('-');
        let partEnd = this.state.endDate.split('-');
        let endDate = [partEnd[1], partEnd[0]].join('-');
        if (this.isFormValidated()) {
            return this.props.handleChange({ ...this.state, startDate: startDate, endDate: endDate });
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                _id: nextProps._id,
                company: nextProps.company,
                startDate: nextProps.startDate,
                endDate: nextProps.endDate,
                position: nextProps.position,
                index: nextProps.index,
                errorOnPosition: undefined,
                errorOnUnit: undefined,
                errorOnStartDate: undefined,
                errorOnEndDate: undefined
            }
        } else {
            return null;
        }
    }
    render() {
        const { id, translate } = this.props;
        const { company, position, startDate, endDate, errorOnStartDate, errorOnEndDate, errorOnUnit, errorOnPosition } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID={`modal-edit-BHXH-${id}`} isLoading={false}
                    formID={`form-edit-BHXH-${id}`}
                    title={translate('manage_employee.edit_bhxh')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id={`form-edit-BHXH-${id}`}>
                        <div className={`form-group ${errorOnUnit === undefined ? "" : "has-error"}`}>
                            <label >{translate('manage_employee.unit')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="company" value={company} onChange={this.handleUnitChange} autoComplete="off" />
                            <ErrorLabel content={errorOnUnit} />
                        </div>
                        <div className="row">
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnStartDate === undefined ? "" : "has-error"}`}>
                                <label>{translate('manage_employee.from_month_year')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`editBHXH-start-date-${id}`}
                                    dateFormat="month-year"
                                    deleteValue={false}
                                    value={startDate}
                                    onChange={this.handleStartDateChange}
                                />
                                <ErrorLabel content={errorOnStartDate} />
                            </div>
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnEndDate === undefined ? "" : "has-error"}`}>
                                <label>{translate('manage_employee.to_month_year')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`editBHXH-end-date-${id}`}
                                    dateFormat="month-year"
                                    deleteValue={false}
                                    value={endDate}
                                    onChange={this.handleEndDateChange}
                                />
                                <ErrorLabel content={errorOnEndDate} />
                            </div>
                        </div>
                        <div className={`form-group ${errorOnPosition === undefined ? "" : "has-error"}`}>
                            <label>{translate('table.position')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="position" value={position} onChange={this.handlePositionChange} autoComplete="off" />
                            <ErrorLabel content={errorOnPosition} />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};
const editBHXH = connect(null, null)(withTranslate(SocialInsuranceEditModal));
export { editBHXH as SocialInsuranceEditModal };
