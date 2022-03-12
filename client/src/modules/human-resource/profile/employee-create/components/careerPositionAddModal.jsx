import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ButtonModal, ErrorLabel, DatePicker, SelectBox, UploadFile } from '../../../../../common-components';
import { UploadFileHook } from '../../../../../common-components/src/upload-file/uploadFileHook';

import ValidationHelper from '../../../../../helpers/validationHelper';

function ModalAddCareerPosition(props) {
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
        startDate: formatDate(Date.now()),
        endDate: formatDate(Date.now()),
    })

    const { translate } = props;
    
    const { id } = props;
    
    const { company, files, startDate, endDate, careerPosition, project, professionalExperience, errorOnStartDate, errorOnEndDate, errorOnUnit, errorOnPosition } = state;
    
    let listPosition = props.career.listPosition;
    let listFields = props.field.listFields;
    let listMajor = props.major.listMajor;
    
    /** Bắt sự kiện thay đổi file đính kèm */
    const handleChangeFile = (value) => {
        if (value.length !== 0) {
            setState(state => {
                return {
                    ...state,
                    files: value,
                    file: value[0].fileName,
                    urlFile: value[0].urlFile,
                    fileUpload: value[0].fileUpload
                }
            })
        } else {
            setState(state => {
                return {
                    ...state,
                    files: undefined,
                    file: "",
                    urlFile: "",
                    fileUpload: ""
                }
            })
        }
    }

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
    const handlePositionChange = (value) => {
        validatePosition(value[0])
        // setState(state => {
        //     return {
        //         ...state,
        //         careerPosition: value[0]
        //     }
        // })
    }

    const handleProjectChange = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            project: value,
        })
    }

    const validatePosition = (value, willUpdateState = true) => {
        const { translate } = props;
        let message = undefined;
        if (!value || value?.toString()?.replace(/\s/g,"") === "0")
            message = translate('general.validate.empty_error')

        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    errorOnPosition: message,
                    careerPosition: value,
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
            professionalExperience: value,
        })
    }

    /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form */
    const isFormValidated = () => {
        const { position, company, startDate, endDate } = state;
        let result = validateUnit(company, false) 
        // && validatePosition(position, false);
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
            <ButtonModal modalID={`modal-create-career-position-${id}`} button_name={translate('modal.create')} title={translate('human_resource.profile.add_working_process')} />
            <DialogModal
                size='50' modalID={`modal-create-career-position-${id}`} isLoading={false}
                formID={`modal-create-career-position-${id}`}
                title={translate('human_resource.profile.add_experience')}
                func={save}
                resetOnSave={true}
                resetOnClose={true}
                afterClose={()=>{setState(state => ({
                    ...state,
                    company: "",
                    startDate: formatDate(Date.now()),
                    endDate: formatDate(Date.now()),
                    careerPosition: '0',
                    project: '',
                    professionalExperience: '',
                    files: undefined,
                    file: '',
                    urlFile: '',
                    fileUpload: ''
                }))}}
                disableSubmit={!isFormValidated()}
            >
                <form className="form-group" id={`modal-create-career-position-${id}`}>
                    {/* Đơn vị */}
                    <div className={`form-group ${errorOnUnit && "has-error"}`}>
                        <label>{translate('human_resource.profile.unit')}<span className="text-red">*</span></label>
                        <input type="text" className="form-control" name="company" value={company ? company : ''} onChange={handleUnitChange} autoComplete="off" />
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

                    {/* Vị trí công việc */}
                    <div className={`form-group ${errorOnPosition && "has-error"}`}>
                        <label>{translate('human_resource.profile.project_employee_position')}<span className="text-red">*</span>
                            <a href='/hr-list-career-position' target="_blank"> (Quản lý) </a>
                        </label>
                        <SelectBox
                            id={`career-position${id}`}
                            key={id}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            value={state.careerPosition}
                            items={[{value: '0', text: "Chọn vị trí công việc"}, ...listPosition.map(y => { return { value: y._id, text: y.name } }), { value: '', text: 'Chọn vị trí công việc' }]}
                            options={{ placeholder: "Chọn vị trí công việc" }}
                            onChange={handlePositionChange}
                            multiple={false}
                        />
                        <ErrorLabel content={errorOnPosition} />
                    </div>

                    {/* Dự án */}
                    <div className="form-group">
                        <label>{translate('human_resource.profile.project')}<span className="text-red">*</span></label>
                        <input type="text" className="form-control" name="position" value={project ? project : ''} onChange={handleProjectChange} autoComplete="off" />
                    </div>

                    {/* Kinh nghiệm chuyên môn và quản lý có liên quan */}
                    <div className="form-group">
                        <label>{translate('human_resource.profile.project_professional_or_managerment')}
                        </label>
                        <textarea style={{ minHeight: '100px' }} type="text" value={professionalExperience ? professionalExperience : ""} className="form-control" onChange={handleReferenceInformation} />
                    </div>

                    {/* File đính kèm */}
                    <div className="form-group">
                        <label htmlFor="file">{translate('human_resource.profile.attached_files')}</label>
                        <UploadFileHook value={files} onChange={handleChangeFile} deleteValue={true} />
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
};

function mapState(state) {
    const { career, field, major, biddingPackagesManager } = state;
    return { career, field, major, biddingPackagesManager };
};

const addCareerPosition = connect(mapState, null)(withTranslate(ModalAddCareerPosition));
export { addCareerPosition as ModalAddCareerPosition };
