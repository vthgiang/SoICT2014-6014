import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, ErrorLabel, DatePicker, SelectBox } from '../../../../../common-components';
import { CommendationFromValidator } from '../../../commendation-discipline/components/combinedContent';
class CommendationAddModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            decisionNumber: "",
            organizationalUnit: "",
            startDate: this.formatDate(Date.now()),
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
     * Bắt sự kiện thay đổi số quyết định
     */
    handleNumberChange = (e) => {
        let value = e.target.value;
        this.validateDecisionNumber(value, true);
    }
    validateDecisionNumber = (value, willUpdateState = true) => {
        let msg = CommendationFromValidator.validateDecisionNumber(value, this.props.translate)
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
    handleUnitChange = (value) => {
        this.validateOrganizationalUnit(value[0], true);
    }
    validateOrganizationalUnit = (value, willUpdateState = true) => {
        let msg = CommendationFromValidator.validateOrganizationalUnit(value, this.props.translate)
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
     * Bắt sự kiện thay đổi ngày ra quyết định
     */
    handleStartDateChange = (value) => {
        this.validateStartDate(value, true);
    }
    validateStartDate = (value, willUpdateState = true) => {
        let msg = CommendationFromValidator.validateStartDate(value, this.props.translate)
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
        let msg = CommendationFromValidator.validateType(value, this.props.translate)
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
        let msg = CommendationFromValidator.validateReason(value, this.props.translate)
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
            this.validateStartDate(this.state.startDate, false) &&
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
        if (this.isFormValidated()) {
            return this.props.handleChange({ ...this.state, startDate: startDate });
        }
    }
    render() {
        const { translate, id, department } = this.props;
        const { startDate, reason, decisionNumber, organizationalUnit, type, errorOnStartDate,
            errorOnNumber, errorOnUnit, errorOnType, errorOnReason } = this.state;
        return (
            <React.Fragment>
                <ButtonModal modalID={`modal-create-praise-${id}`} button_name={translate('modal.create')} title={translate('discipline.add_praise_title')} />
                <DialogModal
                    size='50' modalID={`modal-create-praise-${id}`} isLoading={false}
                    formID={`form-create-praise-${id}`}
                    title={translate('discipline.add_praise_title')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id={`form-create-praise-${id}`}>
                        <div className="row">
                            <div className={`col-sm-6 col-xs-12 form-group ${errorOnNumber === undefined ? "" : "has-error"}`}>
                                <label>{translate('page.number_decisions')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="decisionNumber" value={decisionNumber} onChange={this.handleNumberChange} autoComplete="off" placeholder={translate('page.number_decisions')} />
                                <ErrorLabel content={errorOnNumber} />
                            </div>
                            <div className={`col-sm-6 col-xs-12 form-group ${errorOnUnit === undefined ? "" : "has-error"}`}>
                                <label>{translate('discipline.decision_unit')}<span className="text-red">*</span></label>
                                <SelectBox
                                    id={`create_commendation${id}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={organizationalUnit}
                                    items={[...department.list.map((u, i) => { return { value: u._id, text: u.name } }), { value: '', text: 'Chọn cấp ra quyết định' }]}
                                    onChange={this.handleUnitChange}
                                />
                                <ErrorLabel content={errorOnUnit} />
                            </div>
                        </div>
                        <div className="row">
                            <div className={`col-sm-6 col-xs-12 form-group ${errorOnStartDate === undefined ? "" : "has-error"}`}>
                                <label>{translate('discipline.decision_day')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`add_praise_start_date${id}`}
                                    value={startDate}
                                    onChange={this.handleStartDateChange}
                                />
                                <ErrorLabel content={errorOnStartDate} />
                            </div>
                            <div className={`col-sm-6 col-xs-12 form-group ${errorOnType === undefined ? "" : "has-error"}`}>
                                <label>{translate('discipline.reward_forms')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="type" value={type} onChange={this.handleTypeChange} autoComplete="off" placeholder={translate('discipline.reward_forms')} />
                                <ErrorLabel content={errorOnType} />
                            </div>
                        </div>
                        <div className={`form-group ${errorOnReason === undefined ? "" : "has-error"}`}>
                            <label>{translate('discipline.reason_praise')}<span className="text-red">*</span></label>
                            <textarea className="form-control" rows="3" name="reason" value={reason} onChange={this.handleReasonChange} placeholder="Enter ..." autoComplete="off" ></textarea>
                            <ErrorLabel content={errorOnReason} />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};
function mapState(state) {
    const { department } = state;
    return { department };
};
const addModal = connect(mapState, null)(withTranslate(CommendationAddModal));
export { addModal as CommendationAddModal };