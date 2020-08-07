import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ButtonModal, ErrorLabel, DatePicker, SelectBox } from '../../../../common-components';
import { DisciplineFromValidator } from './disciplineFormValidator';

import { DisciplineActions } from '../redux/actions';
class DisciplineCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employeeNumber: "",
            decisionNumber: "",
            organizationalUnit: "",
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
    handleDecisionNumberChange = (e) => {
        let value = e.target.value;
        this.validateDecisionNumber(value, true);
    }
    validateDecisionNumber = (value, willUpdateState = true) => {
        let msg = DisciplineFromValidator.validateDecisionNumber(value, this.props.translate)
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
     */
    handleOrganizationalUnitChange = (value) => {
        this.validateOrganizationalUnit(value[0], true);
    }
    validateOrganizationalUnit = (value, willUpdateState = true) => {
        let msg = DisciplineFromValidator.validateOrganizationalUnit(value, this.props.translate)
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
     * Bắt sự kiện thay đổi ngày có hiệu lực
     */
    handleStartDateChange = (value) => {
        let { errorOnEndDate, endDate } = this.state;
        let errorOnStartDate;
        let partValue = value.split('-');
        let date = new Date([partValue[2], partValue[1], partValue[0]].join('-'));

        let partEndDate = endDate.split('-');
        let d = new Date([partEndDate[2], partEndDate[1], partEndDate[0]].join('-'));

        if (date.getTime() > d.getTime()) {
            errorOnStartDate = "Ngày có hiệu lực phải trước ngày hết hiệu lực";
        } else {
            errorOnEndDate = errorOnEndDate === 'Ngày hết hiệu lực phải sau ngày có hiệu lực' ? undefined : errorOnEndDate
        }
        this.setState({
            startDate: value,
            errorOnStartDate: errorOnStartDate,
            errorOnEndDate: errorOnEndDate
        })
    }
    /**
     * Bắt sự kiện thay đổi ngày hết hiệu lực
     */
    handleEndDateChange = (value) => {
        let { startDate, errorOnStartDate } = this.state;
        let partValue = value.split('-');
        let date = new Date([partValue[2], partValue[1], partValue[0]].join('-'));

        let partStartDate = startDate.split('-');
        let d = new Date([partStartDate[2], partStartDate[1], partStartDate[0]].join('-'));
        let errorOnEndDate;
        if (d.getTime() > date.getTime()) {
            errorOnEndDate = "Ngày hết hiệu lực phải sau ngày có hiệu lực";
        } else {
            errorOnStartDate = errorOnStartDate === 'Ngày có hiệu lực phải trước ngày hết hiệu lực' ? undefined : errorOnStartDate
        }
        this.setState({
            endDate: value,
            errorOnStartDate: errorOnStartDate,
            errorOnEndDate: errorOnEndDate
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
            this.validateEmployeeNumber(this.state.employeeNumber, false) &&
            this.validateDecisionNumber(this.state.decisionNumber, false) && this.validateOrganizationalUnit(this.state.organizationalUnit, false) &&
            this.validateType(this.state.reason, false) && this.validateReason(this.state.reason, false);
        let partStart = this.state.startDate.split('-');
        let startDate = [partStart[2], partStart[1], partStart[0]].join('-');
        let partEnd = this.state.endDate.split('-');
        let endDate = [partEnd[2], partEnd[1], partEnd[0]].join('-');
        if (new Date(startDate).getTime() <= new Date(endDate).getTime()) {
            return result;
        } else return false;
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
        const { translate, discipline, department } = this.props;
        const { employeeNumber, startDate, endDate, reason, decisionNumber, organizationalUnit, type, errorOnEndDate, errorOnStartDate,
            errorOnEmployeeNumber, errorOnDecisionNumber, errorOnOrganizationalUnit, errorOnType, errorOnReason } = this.state;
        return (
            <React.Fragment>
                <ButtonModal modalID="modal-create-discipline" button_name={translate('discipline.add_discipline')} title={translate('discipline.add_discipline_title')} />
                <DialogModal
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
                            <div className={`col-sm-6 col-xs-12 form-group ${errorOnDecisionNumber === undefined ? "" : "has-error"}`}>
                                <label>{translate('page.number_decisions')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="number" value={decisionNumber} onChange={this.handleDecisionNumberChange} autoComplete="off" placeholder={translate('page.number_decisions')} />
                                <ErrorLabel content={errorOnDecisionNumber} />
                            </div>
                            <div className={`col-sm-6 col-xs-12 form-group ${errorOnOrganizationalUnit === undefined ? "" : "has-error"}`}>
                                <label>{translate('discipline.decision_unit')}<span className="text-red">*</span></label>
                                <SelectBox
                                    id={`create_discipline`}
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
                            <div className={`col-sm-6 col-xs-12 form-group ${errorOnStartDate === undefined ? "" : "has-error"}`}>
                                <label>{translate('discipline.start_date')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id="create_discipline_start_date"
                                    deleteValue={false}
                                    value={startDate}
                                    onChange={this.handleStartDateChange}
                                />
                                <ErrorLabel content={errorOnStartDate} />
                            </div>
                            <div className={`col-sm-6 col-xs-12 form-group ${errorOnEndDate === undefined ? "" : "has-error"}`}>
                                <label>{translate('discipline.end_date')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id="create_discipline_end_date"
                                    deleteValue={false}
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

function mapState(state) {
    const { discipline, department } = state;
    return { discipline, department };
};

const actionCreators = {
    createNewDiscipline: DisciplineActions.createNewDiscipline,
};

const createForm = connect(mapState, actionCreators)(withTranslate(DisciplineCreateForm));
export { createForm as DisciplineCreateForm };