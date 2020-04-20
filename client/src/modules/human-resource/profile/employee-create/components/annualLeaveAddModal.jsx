import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ErrorLabel, DatePicker, ButtonModal } from '../../../../common-components';
import { SabbaticalFormValidator } from '../../annual-leave/components/combinedContent';
class ModalAddSabbatical extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
        let result =
            this.validateEndDate(this.state.endDate, false) &&
            this.validateReason(this.state.reason, false) && this.validateStartDate(this.state.startDate, false);
        return result;
    }

    // Bắt sự kiện submit form
    save = () => {
        if (this.isFormValidated()) {
            return this.props.handleChange(this.state);
        }
    }
    render() {
        const { translate, id } = this.props;
        const { startDate, endDate, reason, status,
            errorOnReason, errorOnStartDate, errorOnEndDate } = this.state;
        return (
            <React.Fragment>
                <ButtonModal modalID={`modal-create-sabbatical-${id}`} button_name={translate('modal.create')} title={translate('sabbatical.add_sabbatical_title')} />
                <DialogModal
                    size='50' modalID={`modal-create-sabbatical-${id}`} isLoading={false}
                    formID={`form-create-sabbatical-${id}`}
                    title={translate('sabbatical.add_sabbatical_title')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id={`form-create-sabbatical-${id}`}>
                        <div className="row">
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnStartDate === undefined ? "" : "has-error"}`}>
                                <label>{translate('sabbatical.start_date')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`create_start_date${id}`}
                                    value={startDate}
                                    onChange={this.handleStartDateChange}
                                />
                                <ErrorLabel content={errorOnStartDate} />
                            </div>
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnEndDate === undefined ? "" : "has-error"}`}>
                                <label>{translate('sabbatical.end_date')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`create_end_date${id}`}
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
const addSabbatical = connect(null, null)(withTranslate(ModalAddSabbatical));
export { addSabbatical as ModalAddSabbatical };
