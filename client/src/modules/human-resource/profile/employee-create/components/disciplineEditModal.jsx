import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ErrorLabel, DatePicker } from '../../../../../common-components';
import { DisciplineFromValidator } from '../../../commendation-discipline/components/combinedContent';
class DisciplineEditModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    /**
     * Bắt sự kiện thay đổi số quyết định
     */
    handleNumberChange = (e) => {
        let value = e.target.value;
        this.validateDecisionNumber(value, true);
    }
    validateDecisionNumber = (value, willUpdateState = true) => {
        let msg = DisciplineFromValidator.validateDecisionNumber(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnNumber: msg,
                    decisionNumber: value,
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
        this.validateOrganizationalUnit(value, true);
    }
    validateOrganizationalUnit = (value, willUpdateState = true) => {
        let msg = DisciplineFromValidator.validateOrganizationalUnit(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnUnit: msg,
                    organizationalUnit: value,
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
            this.validateStartDate(this.state.startDate, false) && this.validateEndDate(this.state.endDate, false) &&
            this.validateDecisionNumber(this.state.decisionNumber, false) && this.validateOrganizationalUnit(this.state.organizationalUnit, false) &&
            this.validateType(this.state.reason, false) && this.validateReason(this.state.reason, false);
        return result;
    }
    /**
     * Bắt sự kiện submit form
     */
    save = async () => {
        var partStart = this.state.startDate.split('-');
        var startDate = [partStart[2], partStart[1], partStart[0]].join('-');
        var partEnd = this.state.endDate.split('-');
        var endDate = [partEnd[2], partEnd[1], partEnd[0]].join('-');
        await this.setState({
            startDate: startDate,
            endDate: endDate
        })
        if (this.isFormValidated()) {
            return this.props.handleChange(this.state);
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                _id: nextProps._id,
                index: nextProps.index,
                decisionNumber: nextProps.decisionNumber,
                organizationalUnit: nextProps.organizationalUnit,
                reason: nextProps.reason,
                startDate: nextProps.startDate,
                endDate: nextProps.endDate,
                type: nextProps.type,

                errorOnNumber: undefined,
                errorOnUnit: undefined,
                errorOnStartDate: undefined,
                errorOnEndDate: undefined,
                errorOnType: undefined,
                errorOnReason: undefined,

            }
        } else {
            return null;
        }
    }
    render() {
        const { translate, id } = this.props;
        const { startDate, reason, decisionNumber, organizationalUnit, type, errorOnEndDate, errorOnStartDate, endDate,
            errorOnNumber, errorOnUnit, errorOnType, errorOnReason } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID={`modal-edit-discipline-${id}`} isLoading={false}
                    formID={`form-edit-discipline-${id}`}
                    title={translate('discipline.edit_discipline')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id={`form-edit-discipline-${id}`}>
                        <div className="row">
                            <div className={`col-sm-6 col-xs-12 form-group ${errorOnNumber === undefined ? "" : "has-error"}`}>
                                <label>{translate('page.number_decisions')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="decisionNumber" value={decisionNumber} onChange={this.handleNumberChange} autoComplete="off" placeholder={translate('page.number_decisions')} />
                                <ErrorLabel content={errorOnNumber} />
                            </div>
                            <div className={`col-sm-6 col-xs-12 form-group ${errorOnUnit === undefined ? "" : "has-error"}`}>
                                <label>{translate('discipline.decision_unit')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="organizationalUnit" value={organizationalUnit} onChange={this.handleUnitChange} autoComplete="off" placeholder={translate('discipline.decision_unit')} />
                                <ErrorLabel content={errorOnUnit} />
                            </div>
                        </div>
                        <div className="row">
                            <div className={`col-sm-6 col-xs-12 form-group ${errorOnStartDate === undefined ? "" : "has-error"}`}>
                                <label>{translate('discipline.start_date')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`edit_discipline_start_date${id}`}
                                    value={startDate}
                                    onChange={this.handleStartDateChange}
                                />
                                <ErrorLabel content={errorOnStartDate} />
                            </div>
                            <div className={`col-sm-6 col-xs-12 form-group ${errorOnEndDate === undefined ? "" : "has-error"}`}>
                                <label>{translate('discipline.end_date')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`edit_discipline_end_date${id}`}
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
                </DialogModal>
            </React.Fragment>
        );
    }
};
const editModal = connect(null, null)(withTranslate(DisciplineEditModal));
export { editModal as DisciplineEditModal };