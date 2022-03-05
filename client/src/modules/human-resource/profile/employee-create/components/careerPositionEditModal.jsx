import React, { useState, useEffect, useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel, DatePicker, UploadFile, SelectBox } from '../../../../../common-components';
import { UploadFileHook } from '../../../../../common-components/src/upload-file/uploadFileHook';

import ValidationHelper from '../../../../../helpers/validationHelper';

function ModalEditCareerPosition(props) {

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
        careerPosition: "",
        project: "",
        professionalExperience: "",
        urlFile: "",
        fileUpload: "",
        file: "",
    })

    useEffect(() => {
        setState(state => {
            const newState = {
                ...state,
                id: props.id,
                index: props.index,
                company: props.company,
                startDate: props.startDate,
                endDate: props.endDate,
                careerPosition: props.careerPosition,
                project: props.project ? props.project : '',
                professionalExperience: props.professionalExperience ? props.professionalExperience : '',
                files: props.file ? [{ fileName: props.file, urlFile: props.urlFile, fileUpload: props.fileUpload }] : [],
                urlFile: props.urlFile,
                fileUpload: props.fileUpload,
                errorOnPosition: undefined,
                errorOnUnit: undefined,
                errorOnStartDate: undefined,
                errorOnEndDate: undefined,
                errorOnProject: undefined
            }
            return newState
        })
        if (props._id) {
            setState(state => {
                return {
                    ...state,
                    _id: props._id
                }
            })
        }
    }, [props.id])

    const { translate, listPosition } = props;

    const { id } = props;
    
    const { company, files, file, urlFile, fileUpload, careerPosition, project, professionalExperience, startDate, endDate, errorOnUnit, errorOnStartDate, errorOnEndDate, errorOnPosition, errorOnProject } = state;
    
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

    /** Bắt sự kiện thay đổi vị trí công việc */
    const handlePositionChange = (value) => {
        validatePosition(value[0], true)
    }

    const validatePosition = (value, willUpdateState = true) => {
        const { translate } = props;
        let { message } = ValidationHelper.validateEmpty(translate, value);

        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    careerPosition: value,
                    errorOnPosition: message,
                }
            });
        }
        return message === undefined;
    }

    const handleProjectChange = (e) => {
        const { value } = e.target;
        validateProject(value, true)
    }

    const validateProject = (value, willUpdateState = true) => {
        const { translate } = props;
        let { message } = ValidationHelper.validateEmpty(translate, value);

        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    project: value,
                    errorOnProject: message,
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

    
    /** Bắt sự kiện thay đổi file đính kèm */
    const handleChangeFile = (value) => {
        if (value.length !== 0) {
            setState(state => {
                return {
                    ...state,
                    file: value[0].fileName,
                    urlFile: value[0].urlFile,
                    fileUpload: value[0].fileUpload
                }
            })
        } else {
            setState(state => {
                return {
                    ...state,
                    file: "",
                    urlFile: "",
                    fileUpload: ""
                }
            })
        }
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

    const handleProfessionalExperience = (e) => {
        const { value } = e.target;

        setState({
            ...state,
            professionalExperience: value,
        })
    }

    /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form */
    const isFormValidated = () => {
        const { company, careerPosition, project, startDate, endDate } = state;
        let result = validateUnit(company, false) && validatePosition(careerPosition, false) && validateProject(project, false);
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
                size='50' modalID={`modal-edit-career-position-${id}`} isLoading={false}
                formID={`form-edit-career-position-${id}`}
                title={"Chỉnh sửa thông tin kinh nghiệm chuyên ngành"}
                func={save}
                resetOnSave={true}
                resetOnClose={true}
                // afterClose={()=>{setState(state => ({
                //     ...state,
                //     careerPosition: ''
                // }))}}
                disableSubmit={!isFormValidated()}
            >
                <form className="form-group" id={`form-edit-career-position-${id}`}>
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

                    {/* Vị trí công việc */}
                    <div className={`form-group ${errorOnPosition && "has-error"}`}>
                        <label>Vị trí công việc<span className="text-red">*</span></label>
                        <SelectBox
                            id={`career-position-${id}`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={listPosition?.map(x => {
                                return { text: x.name, value: x._id }
                            })}
                            options={{ placeholder: "Chọn vị trí công việc" }}
                            value={careerPosition}
                            onChange={handlePositionChange}
                        />
                        <ErrorLabel content={errorOnPosition} />
                    </div>

                    {/* Dự án */}
                    <div className="form-group">
                        <label>{translate('human_resource.profile.project')}<span className="text-red">*</span></label>
                        <input type="text" className="form-control" name="position" value={project} onChange={handleProjectChange} autoComplete="off" />
                        <ErrorLabel content={errorOnProject} />
                    </div>

                    {/* Kinh nghiệm chuyên môn và quản lý có liên quan */}
                    <div className="form-group">
                        <label>Kinh nghiệm chuyên môn và quản lý có liên quan</label>
                        <textarea style={{ minHeight: '100px' }} type="text" name="professionalExperience" value={professionalExperience} className="form-control" onChange={handleProfessionalExperience} />
                    </div>

                    {/* File đính kèm */}
                    <div className="form-group">
                        <label htmlFor="file">{translate('human_resource.profile.attached_files')}</label>
                        <UploadFileHook id={`file-${id}`} value={files} onChange={handleChangeFile} />
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
};

const editCareerPosition = connect(null, null)(withTranslate(ModalEditCareerPosition));
export { editCareerPosition as ModalEditCareerPosition };
