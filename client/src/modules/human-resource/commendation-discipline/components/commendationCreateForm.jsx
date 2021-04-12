import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ButtonModal, ErrorLabel, DatePicker, SelectBox } from '../../../../common-components';

import { CommendationFromValidator } from './commendationFormValidator';

import { DisciplineActions } from '../redux/actions';
import { EmployeeManagerActions } from '../../profile/employee-management/redux/actions';

const PraiseCreateForm = (props) => {
    /**
     * Function format ngày hiện tại thành dạnh dd-mm-yyyy
     * @param {*} date : Ngày muốn format
     */
     const formatDate = (date) => {
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
    
    const [state, setState] = useState({
        employee: "",
        decisionNumber: "",
        organizationalUnit: "",
        startDate: formatDate(Date.now()),
        type: "",
        reason: ""
    })

    useEffect(() => {
        const { getAllEmployee } = props;
        getAllEmployee();
    }, []);

    

    /** Function bắt sự kiện thay đổi mã nhân viên */
    const handleMSNVChange = async (value) => {
        validateEmployeeNumber(value[0], true);
    }
    const validateEmployeeNumber = (value, willUpdateState = true) => {
        let { translate } = props;
        let msg = CommendationFromValidator.validateEmployeeNumber(value, translate);
        if (willUpdateState) {
            setState(state => ({
                ...state,
                errorOnEmployee: msg,
                employee: value
            }));
        }
        return msg === undefined;
    }

    /** Bắt sự kiện thay đổi số quyết định */
    const handleDecisionNumberChange = (e) => {
        let { value } = e.target;
        validateDecisionNumber(value, true);
    }
    const validateDecisionNumber = (value, willUpdateState = true) => {
        const { translate } = props;
        let msg = CommendationFromValidator.validateDecisionNumber(value, translate)
        if (willUpdateState) {
            setState(state => ({
                ...state,
                errorOnDecisionNumber: msg,
                decisionNumber: value
            }));
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện thay đổi cấp ra quyết định
     * @param {*} value : Id cấp ra quyết định
     */
    const handleOrganizationalUnitChange = (value) => {
        validateOrganizationalUnit(value[0], true);
    }
    const validateOrganizationalUnit = (value, willUpdateState = true) => {
        const { translate } = props;
        let msg = CommendationFromValidator.validateOrganizationalUnit(value, translate)
        if (willUpdateState) {
            setState(state => ({
                ...state,
                errorOnOrganizationalUnit: msg,
                organizationalUnit: value
            }))
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện thay đổi ngày ra quyết định
     * @param {*} value : Ngày ra quyết định
     */
    const handleStartDateChange = (value) => {
        validateStartDate(value, true);
    }
    const validateStartDate = (value, willUpdateState = true) => {
        const { translate } = props;
        let msg = CommendationFromValidator.validateStartDate(value, translate)
        if (willUpdateState) {
            setState(state => ({
                ...state,
                errorOnStartDate: msg,
                startDate: value
            }));
        }
        return msg === undefined;
    }

    /** Bắt sự kiện thay đổi hình thức khen thưởng */
    const handleTypeChange = (e) => {
        let { value } = e.target;
        validateType(value, true);
    }
    const validateType = (value, willUpdateState = true) => {
        const { translate } = props;
        let msg = CommendationFromValidator.validateType(value, translate)
        if (willUpdateState) {
            setState(state => ({
                ...state,
                errorOnType: msg,
                type: value
            }));
        }
        return msg === undefined;
    }

    /**
     *  Bắt sự kiện thay đổi thành tich(lý do) khen thưởng
     */
    const handleReasonChange = (e) => {
        let { value } = e.target;
        validateReason(value, true);
    }
    const validateReason = (value, willUpdateState = true) => {
        const { translate } = props;
        let msg = CommendationFromValidator.validateReason(value, translate)
        if (willUpdateState) {
            setState(state => ({
                ...state,
                errorOnReason: msg,
                reason: value
            }))
        }
        return msg === undefined;
    }

    /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form */
    const isFormValidated = () => {
        const { employee, startDate, decisionNumber, organizationalUnit, type, reason } = state;
        let result =
            validateEmployeeNumber(employee, false) && validateStartDate(startDate, false) &&
            validateDecisionNumber(decisionNumber, false) && validateOrganizationalUnit(organizationalUnit, false) &&
            validateType(type, false) && validateReason(reason, false);
        return result;
    }

    /** Bắt sự kiện submit form */
    const save = () => {
        const { startDate } = state;
        const { createNewPraise } = props;
        let partStart = startDate.split('-');
        let startDateNew = new Date(partStart[2], partStart[1] - 1, partStart[0]);
        if (isFormValidated()) {
            return createNewPraise({ ...state, startDate: startDateNew });
        }
    }

    const { translate, discipline, department, employeesManager } = props;

    const { employee, startDate, reason, decisionNumber, organizationalUnit, type, errorOnStartDate,
        errorOnEmployee, errorOnDecisionNumber, errorOnOrganizationalUnit, errorOnType, errorOnReason } = state;

    let listAllEmployees = employeesManager.listAllEmployees;
    return (
        <React.Fragment>
            <ButtonModal modalID="modal-create-praise" button_name={translate('human_resource.commendation_discipline.commendation.add_commendation')} title={translate('human_resource.commendation_discipline.commendation.add_commendation_title')} />
            <DialogModal
                size='50' modalID="modal-create-praise" isLoading={discipline.isLoading}
                formID="form-create-praise"
                title={translate('human_resource.commendation_discipline.commendation.add_commendation_title')}
                func={save}
                disableSubmit={!isFormValidated()}
            >
                <form className="form-group" id="form-create-praise">
                    {/* Mã số nhân viên */}
                    <div className={`form-group ${errorOnEmployee && "has-error"}`}>
                        <label>{translate('human_resource.staff_number')}<span className="text-red">*</span></label>
                        <SelectBox
                            id={`create-commendation-employee`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            value={employee}
                            items={listAllEmployees.map(y => { return { value: y._id, text: `${y.employeeNumber} - ${y.fullName}` } }).concat([{ value: "", text: translate('human_resource.non_staff') }])}
                            onChange={handleMSNVChange}
                        />
                        <ErrorLabel content={errorOnEmployee} />
                    </div>

                    <div className="row">
                        {/* Số quyết định */}
                        <div className={`col-sm-6 col-xs-12 form-group ${errorOnDecisionNumber && "has-error"}`}>
                            <label>{translate('human_resource.commendation_discipline.commendation.table.decision_number')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="number" value={decisionNumber} onChange={handleDecisionNumberChange}
                                autoComplete="off" placeholder={translate('human_resource.commendation_discipline.commendation.table.decision_number')} />
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
                                items={[...department.list.map((u, i) => { return { value: u._id, text: u.name } }), { value: '', text: translate('human_resource.choose_decision_unit') }]}
                                onChange={handleOrganizationalUnitChange}
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
                                onChange={handleStartDateChange}
                            />
                            <ErrorLabel content={errorOnStartDate} />
                        </div>
                        {/* hình thức khen thưởng */}
                        <div className={`col-sm-6 col-xs-12 form-group ${errorOnType && "has-error"}`}>
                            <label>{translate('human_resource.commendation_discipline.commendation.table.reward_forms')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="type" value={type} onChange={handleTypeChange} autoComplete="off" placeholder={translate('human_resource.commendation_discipline.commendation.table.reward_forms')} />
                            <ErrorLabel content={errorOnType} />
                        </div>
                    </div>
                    {/* Lý do khen thưởng */}
                    <div className={`form-group ${errorOnReason && "has-error"}`}>
                        <label>{translate('human_resource.commendation_discipline.commendation.table.reason_praise')}<span className="text-red">*</span></label>
                        <textarea className="form-control" rows="3" name="reason" value={reason} onChange={handleReasonChange} placeholder="Enter ..." autoComplete="off" ></textarea>
                        <ErrorLabel content={errorOnReason} />
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
};

function mapState(state) {
    const { discipline, department, employeesManager } = state;
    return { discipline, department, employeesManager };
};

const actionCreators = {
    createNewPraise: DisciplineActions.createNewPraise,
    getAllEmployee: EmployeeManagerActions.getAllEmployee,
};

const createForm = connect(mapState, actionCreators)(withTranslate(PraiseCreateForm));
export { createForm as PraiseCreateForm };