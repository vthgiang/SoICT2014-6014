import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { ModalDialog, ModalButton, ErrorLabel, DatePicker } from '../../../../common-components';
import { DisciplineFromValidator } from './DisciplineFromValidator';

import { DisciplineActions } from '../redux/actions';
class DisciplineEditForm extends Component {
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
        this.setState({
            ...this.state,
            startDate: value
        })
    }
    /**
     * Bắt sự kiện thay đổi ngày hết hiệu lực
     */
    handleEndDateChange = (value) => {
        this.setState({
            ...this.state,
            endDate: value
        })
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
            this.validateUnit(this.state.unit, false) && this.validateType(this.state.reason, false) &&
            this.validateReason(this.state.reason, false);
        return result;
    }
    /**
     * Bắt sự kiện submit form
     */
    save = () => {
        if (this.isFormValidated()) {
            return this.props.updateDiscipline(this.state._id, this.state);
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
                endDate: nextProps.endDate,
                type: nextProps.type,
                reason: nextProps.reason,
                errorOnUnit: undefined,
                errorOnType: undefined,
                errorOnReason: undefined
            }
        } else {
            return null;
        }
    }

    render() {
        const { translate, discipline } = this.props;
        const { employeeNumber, startDate, endDate, reason, number, unit, type,
            errorOnUnit, errorOnType, errorOnReason } = this.state;
        return (
            <React.Fragment>
                <ModalDialog
                    size='50' modalID="modal-edit-discipline" isLoading={discipline.isLoading}
                    formID="form-edit-discipline"
                    title={translate('discipline.edit_discipline')}
                    msg_success={translate('error.edit_discipline_success')}
                    msg_faile={translate('error.edit_discipline_faile')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id="form-edit-discipline">
                        <div className="form-group">
                            <label>{translate('table.employee_number')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="employeeNumber" value={employeeNumber} onChange={this.handleMSNVChange} autoComplete="off" disabled />
                        </div>
                        <div className="row qlcv-from">
                            <div className="left col-sm-6 col-xs-12 form-group">
                                <label>{translate('page.number_decisions')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="number" value={number} onChange={this.handleNumberChange} autoComplete="off" disabled />
                            </div>
                            <div className={`right col-sm-6 col-xs-12 form-group ${errorOnUnit === undefined ? "" : "has-error"}`}>
                                <label>{translate('discipline.decision_unit')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="unit" value={unit} onChange={this.handleUnitChange} autoComplete="off" placeholder={translate('discipline.decision_unit')} />
                                <ErrorLabel content={errorOnUnit} />
                            </div>
                        </div>
                        <div className="row qlcv-from">
                            <div className="left col-sm-6 col-xs-12 form-group">
                                <label>{translate('discipline.start_date')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id="edit_discipline_start_date"
                                    value={startDate}
                                    onChange={this.handleStartDateChange}
                                />
                            </div>
                            <div className="right col-sm-6 col-xs-12 form-group">
                                <label>{translate('discipline.end_date')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id="edit_discipline_end_date"
                                    value={endDate}
                                    onChange={this.handleEndDateChange}
                                />
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
    updateDiscipline: DisciplineActions.updateDiscipline,
};

const editForm = connect(mapState, actionCreators)(withTranslate(DisciplineEditForm));
export { editForm as DisciplineEditForm };