import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ButtonModal, ErrorLabel, DatePicker, SelectBox } from '../../../../common-components';

import { CommendationFromValidator } from './commendationFormValidator';

import { DisciplineActions } from '../redux/actions';

class PraiseCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employeeNumber: "",
            decisionNumber: "",
            organizationalUnit: "",
            startDate: this.formatDate(Date.now()),
            type: "",
            reason: "",
        };
    }

    /**
     * Function format ngày hiện tại thành dạnh dd-mm-yyyy
     * @param {*} date : Ngày muốn format
     */
    formatDate = (date) => {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            return [day, month, year].join('-');
        }
        return date;

    }

    /** Bắt sự kiện thay đổi mã nhân viên */
    handleMSNVChange = (e) => {
        let { value } = e.target;
        this.validateEmployeeNumber(value, true);
    }
    validateEmployeeNumber = (value, willUpdateState = true) => {
        const { translate } = this.props;
        let msg = CommendationFromValidator.validateEmployeeNumber(value, translate)
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

    /** Bắt sự kiện thay đổi số quyết định */
    handleDecisionNumberChange = (e) => {
        let { value } = e.target;
        this.validateDecisionNumber(value, true);
    }
    validateDecisionNumber = (value, willUpdateState = true) => {
        const { translate } = this.props;
        let msg = CommendationFromValidator.validateDecisionNumber(value, translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnDecisionNumber: msg,
                    decisionNumber: value,
                }
            });
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện thay đổi cấp ra quyết định
     * @param {*} value : Id cấp ra quyết định
     */
    handleOrganizationalUnitChange = (value) => {
        this.validateOrganizationalUnit(value[0], true);
    }
    validateOrganizationalUnit = (value, willUpdateState = true) => {
        const { translate } = this.props;
        let msg = CommendationFromValidator.validateOrganizationalUnit(value, translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnOrganizationalUnit: msg,
                    organizationalUnit: value,
                }
            });
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện thay đổi ngày ra quyết định
     * @param {*} value : Ngày ra quyết định
     */
    handleStartDateChange = (value) => {
        this.validateStartDate(value, true);
    }
    validateStartDate = (value, willUpdateState = true) => {
        const { translate } = this.props;
        let msg = CommendationFromValidator.validateStartDate(value, translate)
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

    /** Bắt sự kiện thay đổi hình thức khen thưởng */
    handleTypeChange = (e) => {
        let { value } = e.target;
        this.validateType(value, true);
    }
    validateType = (value, willUpdateState = true) => {
        const { translate } = this.props;
        let msg = CommendationFromValidator.validateType(value, translate)
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
        let { value } = e.target;
        this.validateReason(value, true);
    }
    validateReason = (value, willUpdateState = true) => {
        const { translate } = this.props;
        let msg = CommendationFromValidator.validateReason(value, translate)
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

    /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form */
    isFormValidated = () => {
        const { employeeNumber, startDate, decisionNumber, organizationalUnit, type, reason } = this.state;
        let result =
            this.validateEmployeeNumber(employeeNumber, false) && this.validateStartDate(startDate, false) &&
            this.validateDecisionNumber(decisionNumber, false) && this.validateOrganizationalUnit(organizationalUnit, false) &&
            this.validateType(type, false) && this.validateReason(reason, false);
        return result;
    }

    /** Bắt sự kiện submit form */
    save = () => {
        if (this.isFormValidated()) {
            return this.props.createNewPraise(this.state);
        }
    }

    render() {
        const { translate, discipline, department } = this.props;

        const { employeeNumber, startDate, reason, decisionNumber, organizationalUnit, type, errorOnStartDate,
            errorOnEmployeeNumber, errorOnDecisionNumber, errorOnOrganizationalUnit, errorOnType, errorOnReason } = this.state;

        return (
            <React.Fragment>
                <ButtonModal modalID="modal-create-praise" button_name={translate('human_resource.commendation_discipline.commendation.add_commendation')} title={translate('human_resource.commendation_discipline.commendation.add_commendation_title')} />
                <DialogModal
                    size='50' modalID="modal-create-praise" isLoading={discipline.isLoading}
                    formID="form-create-praise"
                    title={translate('human_resource.commendation_discipline.commendation.add_commendation_title')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id="form-create-praise">
                        {/* Mã nhân viên */}
                        <div className={`form-group ${errorOnEmployeeNumber && "has-error"}`}>
                            <label>{translate('human_resource.staff_number')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="employeeNumber" value={employeeNumber} onChange={this.handleMSNVChange} autoComplete="off" placeholder={translate('human_resource.staff_number')} />
                            <ErrorLabel content={errorOnEmployeeNumber} />
                        </div>
                        <div className="row">
                            {/* Số quyết định */}
                            <div className={`col-sm-6 col-xs-12 form-group ${errorOnDecisionNumber && "has-error"}`}>
                                <label>{translate('human_resource.commendation_discipline.commendation.table.decision_number')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="number" value={decisionNumber} onChange={this.handleDecisionNumberChange} autoComplete="off" placeholder={translate('human_resource.commendation_discipline.commendation.table.decision_number')} />
                                <ErrorLabel content={errorOnDecisionNumber} />
                            </div>
                            {/* Cấp ra quyết định */}
                            <div className={`col-sm-6 col-xs-12 form-group ${errorOnOrganizationalUnit && "has-error"}`}>
                                <label>{translate('human_resource.commendation_discipline.commendation.table.decision_unit')}<span className="text-red">*</span></label>
                                <SelectBox
                                    id={`create_commendation`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={organizationalUnit}
                                    items={[...department.list.map((u, i) => { return { value: u._id, text: u.name } }), { value: '', text: 'Chọn cấp ra quyết định' }]}
                                    onChange={this.handleOrganizationalUnitChange}
                                />
                                <ErrorLabel content={errorOnOrganizationalUnit} />
                            </div>
                        </div>
                        <div className="row">
                            {/* Ngày ra quyết định */}
                            <div className={`col-sm-6 col-xs-12 form-group ${errorOnStartDate && "has-error"}`}>
                                <label>{translate('human_resource.commendation_discipline.commendation.table.decision_date')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id="create_praise_start_date"
                                    value={startDate}
                                    onChange={this.handleStartDateChange}
                                />
                                <ErrorLabel content={errorOnStartDate} />
                            </div>
                            {/* hình thức khen thưởng */}
                            <div className={`col-sm-6 col-xs-12 form-group ${errorOnType && "has-error"}`}>
                                <label>{translate('human_resource.commendation_discipline.commendation.table.reward_forms')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="type" value={type} onChange={this.handleTypeChange} autoComplete="off" placeholder={translate('human_resource.commendation_discipline.commendation.table.reward_forms')} />
                                <ErrorLabel content={errorOnType} />
                            </div>
                        </div>
                        {/* Lý do khen thưởng */}
                        <div className={`form-group ${errorOnReason && "has-error"}`}>
                            <label>{translate('human_resource.commendation_discipline.commendation.table.reason_praise')}<span className="text-red">*</span></label>
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
    const { discipline, department } = state;
    return { discipline, department };
};

const actionCreators = {
    createNewPraise: DisciplineActions.createNewPraise,
};

const createForm = connect(mapState, actionCreators)(withTranslate(PraiseCreateForm));
export { createForm as PraiseCreateForm };