import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../../common-components';

import { CommendationFromValidator } from '../../../commendation-discipline/components/combinedContent';

function CommendationEditModal(props) {

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
        decisionNumber: "",
        organizationalUnit: "",
        startDate: formatDate(Date.now()),
        type: "",
        reason: "",
    });

    const { translate, department } = props;

    const { id } = props;

    const { startDate, reason, decisionNumber, organizationalUnit, type, errorOnStartDate,
        errorOnNumber, errorOnUnit, errorOnType, errorOnReason } = state;

    useEffect(() => {
        setState(state => {
            return {
                ...state,
                id: props.id,
                _id: props._id,
                index: props.index,
                decisionNumber: props.decisionNumber,
                organizationalUnit: props.organizationalUnit,
                startDate: props.startDate,
                type: props.type,
                reason: props.reason,

                errorOnNumber: undefined,
                errorOnUnit: undefined,
                errorOnType: undefined,
                errorOnReason: undefined,
                errorOnStartDate: undefined

            }
        })
    }, [props.id])

    /** Bắt sự kiện thay đổi số quyết định */
    const handleNumberChange = (e) => {
        let { value } = e.target;
        validateDecisionNumber(value, true);
    }

    const validateDecisionNumber = (value, willUpdateState = true) => {
        const { translate } = props;
        let msg = CommendationFromValidator.validateDecisionNumber(value, translate)
        if (willUpdateState) {
            setState(state => {
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
     * @param {*} value : Cấp ra quyết định
     */
    const handleUnitChange = (value) => {
        validateOrganizationalUnit(value[0], true);
    }

    const validateOrganizationalUnit = (value, willUpdateState = true) => {
        const { translate } = props;
        let msg = CommendationFromValidator.validateOrganizationalUnit(value, translate)
        if (willUpdateState) {
            setState(state => {
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
     * @param {*} value : Ngày ra quyết định
     */
    const handleStartDateChange = (value) => {
        validateStartDate(value, true);
    }

    const validateStartDate = (value, willUpdateState = true) => {
        const { translate } = props;
        let msg = CommendationFromValidator.validateStartDate(value, translate)
        if (willUpdateState) {
            setState(state => {
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
    const handleTypeChange = (e) => {
        let { value } = e.target;
        validateType(value, true);
    }

    const validateType = (value, willUpdateState = true) => {
        const { translate } = props;
        let msg = CommendationFromValidator.validateType(value, translate)
        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    errorOnType: msg,
                    type: value,
                }
            });
        }
        return msg === undefined;
    }

    /** Bắt sự kiện thay đổi thành tich(lý do) khen thưởng */
    const handleReasonChange = (e) => {
        let { value } = e.target;
        validateReason(value, true);
    }

    const validateReason = (value, willUpdateState = true) => {
        const { translate } = props;
        let msg = CommendationFromValidator.validateReason(value, translate)
        if (willUpdateState) {
            setState(state => {
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
    const isFormValidated = () => {
        const { startDate, decisionNumber, type, reason, organizationalUnit } = state;
        let result =
            validateStartDate(startDate, false) &&
            validateDecisionNumber(decisionNumber, false) && validateOrganizationalUnit(organizationalUnit, false) &&
            validateType(type, false) && validateReason(reason, false);
        return result;
    }

    /** Bắt sự kiện submit form */
    const save = async () => {
        const { startDate } = state;
        let partStart = state.startDate.split('-');
        let startDateNew = [partStart[2], partStart[1], partStart[0]].join('-');
        if (isFormValidated()) {
            return props.handleChange({ ...state, startDate: startDateNew });
        }
    }

    return (
        <React.Fragment>
            <DialogModal
                size='50' modalID={`modal-edit-praise-${id}`} isLoading={false}
                formID={`form-edit-praise-${id}`}
                title={translate('human_resource.commendation_discipline.commendation.edit_commendation')}
                func={save}
                disableSubmit={!isFormValidated()}
            >
                <form className="form-group" id={`form-edit-praise-${id}`}>
                    <div className="row">
                        {/* Số ra quyết định*/}
                        <div className={`col-sm-6 col-xs-12 form-group ${errorOnNumber && "has-error"}`}>
                            <label>{translate('human_resource.commendation_discipline.commendation.table.decision_number')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="decisionNumber" value={decisionNumber} onChange={handleNumberChange}
                                autoComplete="off" placeholder={translate('human_resource.commendation_discipline.commendation.table.decision_number')} />
                            <ErrorLabel content={errorOnNumber} />
                        </div>
                        {/* Cấp ra quyết định*/}
                        <div className={`col-sm-6 col-xs-12 form-group ${errorOnUnit && "has-error"}`}>
                            <label>{translate('human_resource.commendation_discipline.commendation.table.decision_unit')}<span className="text-red">*</span></label>
                            <SelectBox
                                id={`edit_commendation${id}`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={organizationalUnit}
                                items={[...department.list.map((u, i) => { return { value: u._id, text: u.name } }), { value: '', text: translate('human_resource.choose_decision_unit') }]}
                                onChange={handleUnitChange}
                            />
                            <ErrorLabel content={errorOnUnit} />
                        </div>
                    </div>
                    <div className="row">
                        {/* Ngày ra quyết định*/}
                        <div className={`col-sm-6 col-xs-12 form-group ${errorOnStartDate && "has-error"}`}>
                            <label>{translate('human_resource.commendation_discipline.commendation.table.decision_date')}<span className="text-red">*</span></label>
                            <DatePicker
                                id={`edit_praise_start_date${id}`}
                                value={startDate}
                                onChange={handleStartDateChange}
                            />
                            <ErrorLabel content={errorOnStartDate} />
                        </div>
                        {/* Hình thức khen thưởng*/}
                        <div className={`col-sm-6 col-xs-12 form-group ${errorOnType && "has-error"}`}>
                            <label>{translate('human_resource.commendation_discipline.commendation.table.reward_forms')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="type" value={type} onChange={handleTypeChange}
                                autoComplete="off" placeholder={translate('human_resource.commendation_discipline.commendation.table.reward_forms')} />
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
    const { department } = state;
    return { department };
};

const editModal = connect(mapState, null)(withTranslate(CommendationEditModal));
export { editModal as CommendationEditModal };