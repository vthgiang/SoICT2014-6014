import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ModalDialog, ModalButton, ErrorLabel, DatePicker } from '../../../../common-components';
import { PraiseFromValidator } from './PraiseFromValidator';

import { DisciplineActions } from '../redux/actions';
class PraiseEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    /**
     * Bắt sự kiện thay đổi cấp ra quyết định
     */
    handleUnitChange = (e) => {
        let value = e.target.value;
        this.validateUnit(value, true);
    }
    validateUnit = (value, willUpdateState = true) => {
        let msg = PraiseFromValidator.validateUnit(value, this.props.translate)
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
    /**
     * Bắt sự kiện thay đổi ngày ra quyết định
     */
    handleStartDateChange = (value) => {
        this.validateStartDate(value, true);
    }
    validateStartDate = (value, willUpdateState = true) => {
        let msg = PraiseFromValidator.validateStartDate(value, this.props.translate)
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

    /**
     * Bắt sự kiện thay đổi hình thức khen thưởng
     */
    handleTypeChange = (e) => {
        let value = e.target.value;
        this.validateType(value, true);
    }
    validateType = (value, willUpdateState = true) => {
        let msg = PraiseFromValidator.validateType(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnType: msg,
                    type: value,
                }
            });
        }
        return msg === undefined;
    }

    /**
     *  Bắt sự kiện thay đổi thành tich(lý do) khen thưởng
     */
    handleReasonChange = (e) => {
        let value = e.target.value;
        this.validateReason(value, true);
    }
    validateReason = (value, willUpdateState = true) => {
        let msg = PraiseFromValidator.validateReason(value, this.props.translate)
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

    /**
     * Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
     */
    isFormValidated = () => {
        let result = this.validateUnit(this.state.unit, false) && this.validateType(this.state.reason, false) &&
            this.validateReason(this.state.reason, false) && this.validateStartDate(this.state.startDate, false);
        return result;
    }
    /**
     * Bắt sự kiện submit form
     */
    save = () => {
        if (this.isFormValidated()) {
            return this.props.updatePraise(this.state._id, this.state);
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                employeeNumber: nextProps.employeeNumber,
                number: nextProps.number,
                unit: nextProps.unit,
                startDate: nextProps.startDate,
                type: nextProps.type,
                reason: nextProps.reason,
                errorOnUnit: undefined,
                errorOnType: undefined,
                errorOnReason: undefined,
                errorOnStartDate: undefined
            }
        } else {
            return null;
        }
    }
    render() {
        const { translate, discipline } = this.props;
        const { employeeNumber, startDate, reason, number, unit, type, errorOnStartDate,
            errorOnUnit, errorOnType, errorOnReason } = this.state;
        return (
            <React.Fragment>
                <ModalDialog
                    size='50' modalID="modal-edit-praise" isLoading={discipline.isLoading}
                    formID="form-edit-praise"
                    title={translate('discipline.edit_praise')}
                    msg_success={translate('error.edit_praise_success')}
                    msg_faile={translate('error.edit_praise_faile')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id="form-edit-praise">
                        <div className="form-group">
                            <label>{translate('table.employee_number')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="employeeNumber" value={employeeNumber} disabled autoComplete="off" />
                        </div>
                        <div className="row">
                            <div className="col-sm-6 col-xs-12 form-group">
                                <label>{translate('page.number_decisions')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="number" value={number} disabled autoComplete="off" placeholder={translate('page.number_decisions')} />
                            </div>
                            <div className={`col-sm-6 col-xs-12 form-group ${errorOnUnit === undefined ? "" : "has-error"}`}>
                                <label>{translate('discipline.decision_unit')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="unit" value={unit} onChange={this.handleUnitChange} autoComplete="off" placeholder={translate('discipline.decision_unit')} />
                                <ErrorLabel content={errorOnUnit} />
                            </div>
                        </div>
                        <div className="row">
                            <div className={`col-sm-6 col-xs-12 form-group ${errorOnStartDate === undefined ? "" : "has-error"}`}>
                                <label>{translate('discipline.decision_day')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id="edit_praise_start_date"
                                    value={startDate}
                                    onChange={this.handleStartDateChange}
                                />
                                <ErrorLabel content={errorOnStartDate} />
                            </div>
                            <div className={`col-sm-6 col-xs-12 form-group ${errorOnType === undefined ? "" : "has-error"}`}>
                                <label>{translate('discipline.reward_forms')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="type" value={type} onChange={this.handleTypeChange} autoComplete="off" />
                                <ErrorLabel content={errorOnType} />
                            </div>
                        </div>
                        <div className={`form-group ${errorOnReason === undefined ? "" : "has-error"}`}>
                            <label>{translate('discipline.reason_praise')}<span className="text-red">*</span></label>
                            <textarea className="form-control" rows="3" name="reason" value={reason} onChange={this.handleReasonChange} placeholder="Enter ..." autoComplete="off" ></textarea>
                            <ErrorLabel content={errorOnReason} />
                        </div>
                    </form>
                </ModalDialog>
            </React.Fragment>
        );
    }
};
function mapState(state) {
    const { discipline } = state;
    return { discipline };
};

const actionCreators = {
    updatePraise: DisciplineActions.updatePraise,
};

const editForm = connect(mapState, actionCreators)(withTranslate(PraiseEditForm));
export { editForm as PraiseEditForm };