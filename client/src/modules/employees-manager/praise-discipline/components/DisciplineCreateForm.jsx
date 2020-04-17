import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { ModalDialog, ModalButton, ErrorLabel, DatePicker } from '../../../../common-components';
import { DisciplineFromValidator } from './DisciplineFromValidator';

import { DisciplineActions } from '../redux/actions';
class DisciplineCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employeeNumber: "",
            number: "",
            unit: "",
            startDate: this.formatDate(Date.now()),
            endDate: this.formatDate(Date.now()),
            type: "",
            reason: "",
        };
    }
    /**
     * Function format ngày hiện tại thành dạnh dd-mm-yyyy
     */
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

    /**
    * Bắt sự kiện thay đổi mã nhân viên
    */
    handleMSNVChange = (e) => {
        let value = e.target.value;
        this.validateEmployeeNumber(value, true);
    }
    validateEmployeeNumber = (value, willUpdateState = true) => {
        let msg = DisciplineFromValidator.validateEmployeeNumber(value, this.props.translate)
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

    /**
     * Bắt sự kiện thay đổi số quyết định
     */
    handleNumberChange = (e) => {
        let value = e.target.value;
        this.validateNumber(value, true);
    }
    validateNumber = (value, willUpdateState = true) => {
        let msg = DisciplineFromValidator.validateNumber(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnNumber: msg,
                    number: value,
                }
            });
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện thay đổi cấp ra quyết định
     */
    handleUnitChange = (e) => {
        let value = e.target.value;
        this.validateUnit(value, true);
    }
    validateUnit = (value, willUpdateState = true) => {
        let msg = DisciplineFromValidator.validateUnit(value, this.props.translate)
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
     * Bắt sự kiện thay đổi ngày có hiệu lực
     */
    handleStartDateChange = (value) => {
        this.validateStartDate(value, true)
    }
    validateStartDate = (value, willUpdateState = true) => {
        let msg = DisciplineFromValidator.validateStartDate(value, this.props.translate)
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
     * Bắt sự kiện thay đổi ngày hết hiệu lực
     */
    handleEndDateChange = (value) => {
        this.validateEndDate(value, true);
    }
    validateEndDate = (value, willUpdateState = true) => {
        let msg = DisciplineFromValidator.validateEndDate(value, this.props.translate)
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

    /**
     * Bắt sự kiện thay đổi hình thức khen thưởng
     */
    handleTypeChange = (e) => {
        let value = e.target.value;
        this.validateType(value, true);
    }
    validateType = (value, willUpdateState = true) => {
        let msg = DisciplineFromValidator.validateType(value, this.props.translate)
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
        let msg = DisciplineFromValidator.validateReason(value, this.props.translate)
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
        let result =
            this.validateEmployeeNumber(this.state.employeeNumber, false) &&
            this.validateStartDate(this.state.startDate, false) && this.validateEndDate(this.state.endDate, false) &&
            this.validateNumber(this.state.number, false) && this.validateUnit(this.state.unit, false) &&
            this.validateType(this.state.reason, false) && this.validateReason(this.state.reason, false);
        return result;
    }
    /**
     * Bắt sự kiện submit form
     */
    save = () => {
        if (this.isFormValidated()) {
            return this.props.createNewDiscipline(this.state);
        }
    }
    render() {
        const { translate, discipline } = this.props;
        const { employeeNumber, startDate, endDate, reason, number, unit, type, errorOnEndDate, errorOnStartDate,
            errorOnEmployeeNumber, errorOnNumber, errorOnUnit, errorOnType, errorOnReason } = this.state;
        return (
            <React.Fragment>
                <ModalButton modalID="modal-create-discipline" button_name={translate('discipline.add_discipline')} title={translate('discipline.add_discipline_title')} />
                <ModalDialog
                    size='50' modalID="modal-create-discipline" isLoading={discipline.isLoading}
                    formID="form-create-discipline"
                    title={translate('discipline.add_discipline_title')}
                    msg_success={translate('error.create_discipline_success')}
                    msg_faile={translate('error.create_discipline_faile')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id="form-create-discipline">
                        <div className={`form-group ${errorOnEmployeeNumber === undefined ? "" : "has-error"}`}>
                            <label>{translate('table.employee_number')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="employeeNumber" value={employeeNumber} onChange={this.handleMSNVChange} autoComplete="off" placeholder={translate('table.employee_number')} />
                            <ErrorLabel content={errorOnEmployeeNumber} />
                        </div>
                        <div className="row">
                            <div className={`col-sm-6 col-xs-12 form-group ${errorOnNumber === undefined ? "" : "has-error"}`}>
                                <label>{translate('page.number_decisions')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="number" value={number} onChange={this.handleNumberChange} autoComplete="off" placeholder={translate('page.number_decisions')} />
                                <ErrorLabel content={errorOnNumber} />
                            </div>
                            <div className={`col-sm-6 col-xs-12 form-group ${errorOnUnit === undefined ? "" : "has-error"}`}>
                                <label>{translate('discipline.decision_unit')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="unit" value={unit} onChange={this.handleUnitChange} autoComplete="off" placeholder={translate('discipline.decision_unit')} />
                                <ErrorLabel content={errorOnUnit} />
                            </div>
                        </div>
                        <div className="row">
                            <div className={`col-sm-6 col-xs-12 form-group ${errorOnStartDate === undefined ? "" : "has-error"}`}>
                                <label>{translate('discipline.start_date')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id="create_discipline_start_date"
                                    value={startDate}
                                    onChange={this.handleStartDateChange}
                                />
                                <ErrorLabel content={errorOnStartDate} />
                            </div>
                            <div className={`col-sm-6 col-xs-12 form-group ${errorOnEndDate === undefined ? "" : "has-error"}`}>
                                <label>{translate('discipline.end_date')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id="create_discipline_end_date"
                                    value={endDate}
                                    onChange={this.handleEndDateChange}
                                />
                                <ErrorLabel content={errorOnEndDate} />
                            </div>
                        </div>
                        <div className={`form-group ${errorOnType === undefined ? "" : "has-error"}`}>
                            <label>{translate('discipline.discipline_forms')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="type" value={type} onChange={this.handleTypeChange} autoComplete="off" placeholder={translate('discipline.discipline_forms')} />
                            <ErrorLabel content={errorOnType} />
                        </div>
                        <div className={`form-group ${errorOnReason === undefined ? "" : "has-error"}`}>
                            <label>{translate('discipline.reason_discipline')}<span className="text-red">*</span></label>
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
    createNewDiscipline: DisciplineActions.createNewDiscipline,
};

const createForm = connect(mapState, actionCreators)(withTranslate(DisciplineCreateForm));
export { createForm as DisciplineCreateForm };