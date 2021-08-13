import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ButtonModal, ErrorLabel, DatePicker } from '../../../../../common-components';

import ValidationHelper from '../../../../../helpers/validationHelper';

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
function ModalAddWorkProcess(props) {
    const [state, setState] = useState({
        company: "",
        startDate: formatDate(Date.now()),
        endDate: formatDate(Date.now()),
        position: "",
        referenceInformation: "",
    })

    const { translate } = props;

    const { id } = props;

    const { company, startDate, endDate, position, referenceInformation, errorOnStartDate, errorOnEndDate, errorOnUnit, errorOnPosition } = state;

    /** Bắt sự kiện thay đổi đơn vị công tác */
    const handleUnitChange = (e) => {
        let { value } = e.target;
        validateUnit(value, true)
    }

    const validateUnit = (value, willUpdateState = true) => {
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
        validatePosition(value, true)
    }

    const validatePosition = (value, willUpdateState = true) => {
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

    const handleReferenceInformation = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            referenceInformation: value,
        })
    }

    /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form */
    const isFormValidated = () => {
        const { position, company, startDate, endDate } = state;
        let result = validateUnit(company, false) && validatePosition(position, false);
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
            <ButtonModal modalID={`modal-create-work-process-${id}`} button_name={translate('modal.create')} title={translate('human_resource.profile.add_working_process')} />
            <DialogModal
                size='50' modalID={`modal-create-work-process-${id}`} isLoading={false}
                formID={`modal-create-work-process-${id}`}
                title={translate('human_resource.profile.add_working_process')}
                func={save}
                disableSubmit={!isFormValidated()}
            >
                <form className="form-group" id={`modal-create-work-process-${id}`}>
                    {/* Đơn vị */}
                    <div className={`form-group ${errorOnUnit && "has-error"}`}>
                        <label>{translate('human_resource.profile.unit')}<span className="text-red">*</span></label>
                        <input type="text" className="form-control" name="company" value={company} onChange={handleUnitChange} autoComplete="off" />
                        <ErrorLabel content={errorOnUnit} />
                    </div>

                    {/* Chức danh */}
                    <div className={`form-group ${errorOnPosition && "has-error"}`}>
                        <label>{translate('table.position')}<span className="text-red">*</span></label>
                        <input type="text" className="form-control" name="position" value={position} onChange={handlePositionChange} autoComplete="off" />
                        <ErrorLabel content={errorOnPosition} />
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

                    {/* Thoong tin tham chieu*/}
                    <div className="form-group">
                        <label>{translate('human_resource.profile.reference_information')}</label>
                        <textarea style={{ minHeight: '100px' }} type="text" value={referenceInformation} className="form-control" onChange={handleReferenceInformation} />
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
};

const addWorkProcess = connect(null, null)(withTranslate(ModalAddWorkProcess));
export { addWorkProcess as ModalAddWorkProcess };
