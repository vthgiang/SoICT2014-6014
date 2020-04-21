import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ErrorLabel, DatePicker } from '../../../../common-components';
import { SabbaticalFormValidator } from './annualLeaveFormValidator';
import { SabbaticalActions } from '../redux/actions';
class SabbaticalEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    // Bắt sự kiện thay đổi ngày bắt đầu
    handleStartDateChange = (value) => {
        this.validateStartDate(value, true);
    }
    validateStartDate = (value, willUpdateState = true) => {
        let msg = SabbaticalFormValidator.validateStartDate(value, this.props.translate)
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
        let msg = SabbaticalFormValidator.validateEndDate(value, this.props.translate)
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
        let msg = SabbaticalFormValidator.validateReason(value, this.props.translate)
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
        let result = this.validateEndDate(this.state.endDate, false) &&
            this.validateReason(this.state.reason, false) && this.validateStartDate(this.state.startDate, false);
        return result;
    }

    save = () => {
        if (this.isFormValidated()) {
            return this.props.updateSabbatical(this.state._id, this.state);
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                employeeNumber: nextProps.employeeNumber,
                endDate: nextProps.endDate,
                startDate: nextProps.startDate,
                reason: nextProps.reason,
                status: nextProps.status,
                errorOnReason: undefined,
                errorOnStartDate: undefined,
                errorOnEndDate: undefined,
            }
        } else {
            return null;
        }
    }

    render() {
        const { translate, sabbatical } = this.props;
        const { employeeNumber, startDate, endDate, reason, status,
            errorOnReason, errorOnStartDate, errorOnEndDate } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID="modal-edit-sabbtical" isLoading={sabbatical.isLoading}
                    formID="form-edit-sabbtical"
                    title={translate('sabbatical.edit_sabbatical')}
                    msg_success={translate('manage_user.edit_success')}
                    msg_faile={translate('sabbatical.edit_faile')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id="form-edit-sabbtical">
                        <div className="form-group">
                            <label>{translate('table.employee_number')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="employeeNumber" value={employeeNumber} disabled />
                        </div>
                        <div className="row">
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnStartDate === undefined ? "" : "has-error"}`}>
                                <label>{translate('sabbatical.start_date')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id="edit_start_date"
                                    value={startDate}
                                    onChange={this.handleStartDateChange}
                                />
                                <ErrorLabel content={errorOnStartDate} />
                            </div>
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnEndDate === undefined ? "" : "has-error"}`}>
                                <label>{translate('sabbatical.end_date')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id="edit_end_date"
                                    value={endDate}
                                    onChange={this.handleEndDateChange}
                                />
                                <ErrorLabel content={errorOnEndDate} />
                            </div>
                        </div>
                        <div className={`form-group ${errorOnReason === undefined ? "" : "has-error"}`}>
                            <label>{translate('sabbatical.reason')}<span className="text-red">*</span></label>
                            <textarea className="form-control" rows="3" style={{ height: 72 }} name="reason" value={reason} onChange={this.handleReasonChange}></textarea>
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
    const { sabbatical } = state;
    return { sabbatical };
};

const actionCreators = {
    updateSabbatical: SabbaticalActions.updateSabbatical,
};

const editSabbatical = connect(mapState, actionCreators)(withTranslate(SabbaticalEditForm));
export { editSabbatical as SabbaticalEditForm };