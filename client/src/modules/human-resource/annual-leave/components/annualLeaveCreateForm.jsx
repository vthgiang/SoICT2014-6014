import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, ErrorLabel, DatePicker } from '../../../../common-components';
import { AnnualLeaveFormValidator } from './annualLeaveFormValidator';
import { AnnualLeaveActions } from '../redux/actions';
class AnnualLeaveCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employeeNumber: "",
            startDate: this.formatDate(Date.now()),
            endDate: this.formatDate(Date.now()),
            status: "pass",
            reason: "",
        };
    }
    // Function format ngày hiện tại thành dạnh dd-mm-yyyy
    formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('-');
    }

    // Bắt sự kiện thay đổi mã nhân viên
    handleMSNVChange = (e) => {
        let { value } = e.target;
        this.validateEmployeeNumber(value, true);
    }
    validateEmployeeNumber = (value, willUpdateState = true) => {
        let msg = AnnualLeaveFormValidator.validateEmployeeNumber(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnEmployeeNumber: msg,
                    employeeNumber: value,
                }
            });
        }
        return msg === undefined;
    }
    // Bắt sự kiện thay đổi ngày bắt đầu
    handleStartDateChange = (value) => {
        this.validateStartDate(value, true);
    }
    validateStartDate = (value, willUpdateState = true) => {
        let msg = AnnualLeaveFormValidator.validateStartDate(value, this.props.translate)
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

    // Bắt sự kiện thay đổi ngày kết thúc
    handleEndDateChange = (value) => {
        this.validateEndDate(value, true);
    }
    validateEndDate = (value, willUpdateState = true) => {
        let msg = AnnualLeaveFormValidator.validateEndDate(value, this.props.translate)
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

    // Bắt sự kiện thay đổi lý do xin nghỉ phép
    handleReasonChange = (e) => {
        let value = e.target.value;
        this.validateReason(value, true);
    }
    validateReason = (value, willUpdateState = true) => {
        let msg = AnnualLeaveFormValidator.validateReason(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnReason: msg,
                    reason: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi trạng thái đơn xin nghỉ phép
    handleStatusChange = (e) => {
        let value = e.target.value;
        this.setState({
            ...this.state,
            status: value
        })
    }

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        let result =
            this.validateEmployeeNumber(this.state.employeeNumber, false) && this.validateEndDate(this.state.endDate, false) &&
            this.validateReason(this.state.reason, false) && this.validateStartDate(this.state.startDate, false);
        return result;
    }

    // Bắt sự kiện submit form
    save = () => {
        var partStart = this.state.startDate.split('-');
        var startDate = [partStart[2], partStart[1], partStart[0]].join('-');
        var partEnd = this.state.endDate.split('-');
        var endDate = [partEnd[2], partEnd[1], partEnd[0]].join('-');
        if (this.isFormValidated()) {
            return this.props.createAnnualLeave({ ...this.state, startDate: startDate, endDate: endDate});
        }
    }

    render() {
        const { translate, annualLeave } = this.props;
        const { employeeNumber, startDate, endDate, reason, status,
            errorOnEmployeeNumber, errorOnReason, errorOnStartDate, errorOnEndDate } = this.state;
        return (
            <React.Fragment>
                <ButtonModal modalID="modal-create-sabbtical" button_name={translate('sabbatical.add_sabbatical')} title={translate('sabbatical.add_sabbatical_title')} />
                <DialogModal
                    size='50' modalID="modal-create-sabbtical" isLoading={annualLeave.isLoading}
                    formID="form-create-sabbtical"
                    title={translate('sabbatical.add_sabbatical_title')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id="form-create-sabbtical">
                        <div className={`form-group ${errorOnEmployeeNumber === undefined ? "" : "has-error"}`}>
                            <label>{translate('table.employee_number')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="employeeNumber" value={employeeNumber} onChange={this.handleMSNVChange} placeholder={translate('table.employee_number')} />
                            <ErrorLabel content={errorOnEmployeeNumber} />
                        </div>
                        <div className="row">
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnStartDate === undefined ? "" : "has-error"}`}>
                                <label>{translate('sabbatical.start_date')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id="create_start_date"
                                    value={startDate}
                                    onChange={this.handleStartDateChange}
                                />
                                <ErrorLabel content={errorOnStartDate} />
                            </div>
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnEndDate === undefined ? "" : "has-error"}`}>
                                <label>{translate('sabbatical.end_date')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id="create_end_date"
                                    value={endDate}
                                    onChange={this.handleEndDateChange}
                                />
                                <ErrorLabel content={errorOnEndDate} />
                            </div>
                        </div>
                        <div className={`form-group ${errorOnReason === undefined ? "" : "has-error"}`}>
                            <label>{translate('sabbatical.reason')}<span className="text-red">*</span></label>
                            <textarea className="form-control" rows="3" style={{ height: 72 }} name="reason" value={reason} onChange={this.handleReasonChange} placeholder="Enter ..." autoComplete="off"></textarea>
                            <ErrorLabel content={errorOnReason} />
                        </div>
                        <div className="form-group">
                            <label>{translate('table.status')}<span className="text-red">*</span></label>
                            <select className="form-control" value={status} name="status" onChange={this.handleStatusChange}>
                                <option value="pass">{translate('sabbatical.pass')}</option>
                                <option value="process">{translate('sabbatical.process')}</option>
                                <option value="faile">{translate('sabbatical.faile')}</option>
                            </select>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};

function mapState(state) {
    const { annualLeave } = state;
    return { annualLeave };
};

const actionCreators = {
    createAnnualLeave: AnnualLeaveActions.createAnnualLeave,
};

const createForm = connect(mapState, actionCreators)(withTranslate(AnnualLeaveCreateForm));
export { createForm as AnnualLeaveCreateForm };
