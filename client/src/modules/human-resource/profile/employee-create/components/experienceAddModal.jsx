import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ButtonModal, ErrorLabel, DatePicker } from '../../../../../common-components';

import ValidationHelper from '../../../../../helpers/validationHelper';

function ModalAddExperience(props) {

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
        project: "",
        customer: "",
        address: "",
        jobDescription: "",
    })

    const { translate } = props;

    const { id } = props;

    const { company, position, project, address, customer, startDate, endDate, jobDescription, errorOnStartDate, errorOnEndDate, errorOnUnit, errorOnPosition } = state;

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


    const handleProjectChange = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            project: value,
        })
    }
    const handleCustomerChange = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            customer: value,
        })
    }
    const handleAddessChange = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            address: value,
        })
    }
    /**
     * Function lưu thay đổi "từ tháng/năm" vào state
     * @param {*} value : Tháng bắt đầu
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
     * Function lưu thay đổi "đến tháng/năm" vào state
     * @param {*} value : Tháng kết thúc
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

    const handleJobDescription = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            jobDescription: value,
        })
    }

    /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form */
    const isFormValidated = () => {
        const { position, company, startDate, endDate } = state;
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
            <ButtonModal modalID={`modal-create-experience-${id}`} button_name={translate('modal.create')} title={translate('human_resource.profile.add_experience')} />
            <DialogModal
                size='50' modalID={`modal-create-experience-${id}`} isLoading={false}
                formID={`form-create-experience-${id}`}
                title={translate('human_resource.profile.add_experience')}
                func={save}
                disableSubmit={!isFormValidated()}
            >
                <form className="form-group" id={`form-create-experience-${id}`}>
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
                                id={`add-start-date-${id}`}
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
                                id={`add-end-date-${id}`}
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
                        <label>{translate('human_resource.profile.position_in_task')}<span className="text-red">*</span></label>
                        <input type="text" className="form-control" name="position" value={position} onChange={handlePositionChange} autoComplete="off" />
                        <ErrorLabel content={errorOnPosition} />
                    </div>

                    {/* Dự án */}
                    <div className="form-group">
                        <label>{translate('human_resource.profile.project')}</label>
                        <input type="text" className="form-control" name="position" value={project} onChange={handleProjectChange} autoComplete="off" />
                    </div>

                    {/* Khách hàng */}
                    <div className="form-group">
                        <label>{translate('human_resource.profile.customer')}</label>
                        <input type="text" className="form-control" name="position" value={customer} onChange={handleCustomerChange} autoComplete="off" />
                    </div>

                    {/* Địa chỉ */}
                    <div className="form-group">
                        <label>{translate('human_resource.profile.address')}</label>
                        <input type="text" className="form-control" name="position" value={address} onChange={handleAddessChange} autoComplete="off" />
                    </div>

                    {/* Các công việc đã làm */}
                    <div className="form-group">
                        <label>{translate('human_resource.profile.job_description')}</label>
                        <textarea style={{ minHeight: '100px' }} type="text" value={jobDescription} className="form-control" onChange={handleJobDescription} />
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
};

const addExperience = connect(null, null)(withTranslate(ModalAddExperience));
export { addExperience as ModalAddExperience };
