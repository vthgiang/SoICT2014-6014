import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel, DatePicker } from '../../../../../common-components';

import ValidationHelper from '../../../../../helpers/validationHelper';

function ModalEditExperience(props) {

    /**
     * Function format ngày hiện tại thành dạnh mm-yyyy
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

            return [month, year].join('-');
        }
        return date;
    }

    const [state, setState] = useState({
        company: "",
        startDate: formatDate(Date.now()),
        endDate: formatDate(Date.now()),
        position: "",
    })

    useEffect(() => {
        setState(state => {
            return {
                ...state,
                id: props.id,
                _id: props._id,
                index: props.index,
                company: props.company,
                startDate: props.startDate,
                endDate: props.endDate,
                position: props.position,

                errorOnPosition: undefined,
                errorOnUnit: undefined,
                errorOnStartDate: undefined,
                errorOnEndDate: undefined
            }
        })
    }, [props.id])

    const { translate } = props;

    const { id } = props;

    const { company, position, startDate, endDate, errorOnUnit, errorOnStartDate, errorOnEndDate, errorOnPosition } = state;

    /** Bắt sự kiện thay đổi đơn vị công tác */
    const handleUnitChange = (e) => {
        let { value } = e.target;
        validateExperienceUnit(value, true)
    }

    const validateExperienceUnit = (value, willUpdateState = true) => {
        const { translate } = props;
        let { message } = ValidationHelper.validateEmpty(translate, value);

        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    errorOnUnit: message,
                    company: value,
                }
            });
        }
        return message === undefined;
    }

    /** Bắt sự kiện thay đổi chức vụ */
    const handlePositionChange = (e) => {
        let { value } = e.target;
        validateExperiencePosition(value, true)
    }

    const validateExperiencePosition = (value, willUpdateState = true) => {
        const { translate } = props;
        let { message } = ValidationHelper.validateEmpty(translate, value);

        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    errorOnPosition: message,
                    position: value,
                }
            });
        }
        return message === undefined;
    }

    /**
     * Function lưu thay đổi "từ tháng/năm" vào state
     * @param {*} value : Từ tháng
     */
    const handleStartDateChange = (value) => {
        const { translate } = props;
        let { errorOnEndDate, endDate } = state;

        let errorOnStartDate;
        let partValue = value.split('-');
        let date = new Date([partValue[1], partValue[0], 1].join('-'));

        let partEndDate = endDate.split('-');
        let d = new Date([partEndDate[1], partEndDate[0], 1].join('-'));

        if (date.getTime() > d.getTime()) {
            errorOnStartDate = translate('human_resource.profile.start_month_before_end_month');
        } else {
            errorOnEndDate = undefined;
        }

        setState({
            ...state,
            startDate: value,
            errorOnStartDate: errorOnStartDate,
            errorOnEndDate: errorOnEndDate
        })
    }

    /**
     *  Function lưu thay đổi "đến tháng/năm" vào state
     * @param {*} value : Đến tháng
     */
    const handleEndDateChange = (value) => {
        const { translate } = props;
        let { startDate, errorOnStartDate } = state;

        let errorOnEndDate;
        let partValue = value.split('-');
        let date = new Date([partValue[1], partValue[0], 1].join('-'));

        let partStartDate = startDate.split('-');
        let d = new Date([partStartDate[1], partStartDate[0], 1].join('-'));

        if (d.getTime() > date.getTime()) {
            errorOnEndDate = translate('human_resource.profile.end_month_after_start_month');
        } else {
            errorOnStartDate = undefined;
        }

        setState({
            ...state,
            endDate: value,
            errorOnStartDate: errorOnStartDate,
            errorOnEndDate: errorOnEndDate
        })
    }

    /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form */
    const isFormValidated = () => {
        const { company, position, startDate, endDate } = state;
        let result = validateExperienceUnit(company, false) && validateExperiencePosition(position, false);
        let partStart = startDate.split('-');
        let startDateNew = [partStart[1], partStart[0]].join('-');
        let partEnd = endDate.split('-');
        let endDateNew = [partEnd[1], partEnd[0]].join('-');
        if (new Date(startDateNew).getTime() <= new Date(endDateNew).getTime()) {
            return result;
        } else return false;
    }

    /** Bắt sự kiện submit form */
    const save = async () => {
        const { startDate, endDate } = state;
        let partStart = startDate.split('-');
        let startDateNew = [partStart[1], partStart[0]].join('-');
        let partEnd = endDate.split('-');
        let endDateNew = [partEnd[1], partEnd[0]].join('-');
        if (isFormValidated()) {
            return props.handleChange({ ...state, startDate: startDateNew, endDate: endDateNew });
        }
    }

    return (
        <React.Fragment>
            <DialogModal
                size='50' modalID={`modal-edit-experience-${id}`} isLoading={false}
                formID={`form-edit-experience-${id}`}
                title={translate('human_resource.profile.edit_experience')}
                func={save}
                disableSubmit={!isFormValidated()}
            >
                <form className="form-group" id={`form-edit-experience-${id}`}>
                    {/* Đơn vị */}
                    <div className={`form-group ${errorOnUnit && "has-error"}`}>
                        <label>{translate('human_resource.profile.unit')}<span className="text-red">*</span></label>
                        <input type="text" className="form-control" name="company" value={company} onChange={handleUnitChange} autoComplete="off" />
                        <ErrorLabel content={errorOnUnit} />
                    </div>
                    <div className="row">
                        {/* Từ tháng */}
                        <div className={`form-group col-sm-6 col-xs-12 ${errorOnStartDate && "has-error"}`}>
                            <label>{translate('human_resource.profile.from_month_year')}<span className="text-red">*</span></label>
                            <DatePicker
                                id={`edit-start-date-${id}`}
                                dateFormat="month-year"
                                deleteValue={false}
                                value={startDate}
                                onChange={handleStartDateChange}
                            />
                            <ErrorLabel content={errorOnStartDate} />
                        </div>
                        {/* Đến tháng */}
                        <div className={`form-group col-sm-6 col-xs-12 ${errorOnEndDate && "has-error"}`}>
                            <label>{translate('human_resource.profile.to_month_year')}<span className="text-red">*</span></label>
                            <DatePicker
                                id={`edit-end-date-${id}`}
                                dateFormat="month-year"
                                deleteValue={false}
                                value={endDate}
                                onChange={handleEndDateChange}
                            />
                            <ErrorLabel content={errorOnEndDate} />
                        </div>
                    </div>
                    {/* Chức vụ */}
                    <div className={`form-group ${errorOnPosition && "has-error"}`}>
                        <label>{translate('table.position')}<span className="text-red">*</span></label>
                        <input type="text" className="form-control" name="position" value={position} onChange={handlePositionChange} autoComplete="off" />
                        <ErrorLabel content={errorOnPosition} />
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
};

const editExperience = connect(null, null)(withTranslate(ModalEditExperience));
export { editExperience as ModalEditExperience };
