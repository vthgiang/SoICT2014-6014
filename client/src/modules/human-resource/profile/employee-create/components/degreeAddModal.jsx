import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ButtonModal, ErrorLabel, UploadFile, SelectBox, DatePicker } from '../../../../../common-components';

import ValidationHelper from '../../../../../helpers/validationHelper';

function DegreeAddModal(props) {

    const [state, setState] = useState({
        name: "",
        issuedBy: "",
        year: "",
        field: "",
        degreeType: "excellent",
        file: "",
        urlFile: "",
        fileUpload: "",
    })

    const { translate } = props;

    const { id } = props;

    const { name, issuedBy, major, degreeQualification, year, degreeType, errorOnName, errorOnIssuedBy, errorOnYear, field } = state;
    let listFields = props.field.listFields;
    let listMajor = props.major.listMajor;

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

    /** Bắt sự kiên thay đổi tên bằng cấp */
    const handleNameChange = (e) => {
        let { value } = e.target;
        validateName(value, true);
    }

    const validateName = (value, willUpdateState = true) => {
        const { translate } = props;
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    errorOnName: message,
                    name: value,
                }
            });
        }
        return message === undefined;
    }

    /** Bắt sự kiện thay đổi nơi đào tạo */
    const handleIssuedByChange = (e) => {
        let { value } = e.target;
        validateIssuedBy(value, true);
    }

    const validateIssuedBy = (value, willUpdateState = true) => {
        const { translate } = props;
        let { message } = ValidationHelper.validateEmpty(translate, value);

        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    errorOnIssuedBy: message,
                    issuedBy: value,
                }
            });
        }
        return message === undefined;
    }

    /** Bắt sự kiện thay đổi năm tốt nghiệp */
    const handleYearChange = (value) => {
        validateYear(value, true);
    }

    const validateYear = (value, willUpdateState = true) => {
        const { translate } = props;
        let { message } = ValidationHelper.validateEmpty(translate, value.toString());

        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    errorOnYear: message,
                    year: value,
                }
            });
        }
        return message === undefined;
    }

    /** Bắt sự kiện thay đổi xếp loại */
    const handleDegreeTypeChange = (e) => {
        let { name, value } = e.target;
        setState(state => {
            return {
                ...state,
                [name]: value
            }
        });
    }

    /**
     * Bắt sự kiện thay đổi ngành nghề, lĩnh vực
     * @param {*} value : id Ngành nghề lĩnh vực
     */
    const handleFieldChange = (value) => {
        setState({
            ...state,
            field: value[0]
        });
    }

    const handleMajorChange = (value) => {
        setState({
            ...state,
            major: value[0]
        });
    }

    const handlerDegreeQualificationChange = (value) => {
        setState({
            ...state,
            degreeQualification: value[0]
        });
    }

    /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form */
    const isFormValidated = () => {
        const { issuedBy, name, year } = state;
        let result =
            validateName(name, false) && validateIssuedBy(issuedBy, false) &&
            validateYear(year, false);
        return result;
    }

    /** Bắt sự kiện submit form */
    const save = () => {
        let { field, degreeQualification } = state;
        degreeQualification = Number(degreeQualification)
        let valueField = props.field;
        if (isFormValidated()) {
            if (!field && valueField && valueField.listFields && valueField.listFields[0]) {
                field = props.field.listFields[0]._id
            }
            return props.handleChange({ ...state, field: field, degreeQualification: degreeQualification });
        }
    }

    let professionalSkillArr = [
        { value: null, text: "Chọn trình độ" },
        { value: 1, text: "Trình độ phổ thông" },
        { value: 2, text: "Trung cấp" },
        { value: 3, text: "Cao đẳng" },
        { value: 4, text: "Đại học / Cử nhân" },
        { value: 5, text: "Kỹ sư" },
        { value: 6, text: "Thạc sĩ" },
        { value: 7, text: "Tiến sĩ" },
        { value: 8, text: "Giáo sư" },
        { value: 0, text: "Không có" },
    ];

    return (
        <React.Fragment>
            <ButtonModal modalID={`modal-create-certificate-${id}`} button_name={translate('modal.create')} title={translate('human_resource.profile.add_diploma')} />
            <DialogModal
                size='50' modalID={`modal-create-certificate-${id}`} isLoading={false}
                formID={`form-create-certificate-${id}`}
                title={translate('human_resource.profile.add_diploma')}
                func={save}
                disableSubmit={!isFormValidated()}
            >
                <form className="form-group" id={`form-create-certificate-${id}`}>
                    {/* Tên bằng cấp */}
                    <div className={`form-group ${errorOnName && "has-error"}`}>
                        <label>{translate('human_resource.profile.name_diploma')}<span className="text-red">*</span></label>
                        <input type="text" className="form-control" name="name" value={name} onChange={handleNameChange} autoComplete="off" />
                        <ErrorLabel content={errorOnName} />
                    </div>
                    {/* Nơi đào tạo */}
                    <div className={`form-group ${errorOnIssuedBy && "has-error"}`}>
                        <label>{translate('human_resource.profile.diploma_issued_by')}<span className="text-red">*</span></label>
                        <input type="text" className="form-control" name="issuedBy" value={issuedBy} onChange={handleIssuedByChange} autoComplete="off" />
                        <ErrorLabel content={errorOnIssuedBy} />
                    </div>
                    {/* Ngành nghề/ lĩnh vực */}
                    <div className="form-group">
                        <label>{translate('human_resource.profile.career_fields')}</label>
                        <SelectBox
                            id={`create-degree-field${id}`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            value={field}
                            items={[...listFields.map(y => { return { value: y._id, text: y.name } }), { value: '', text: 'Chọn ngành nghề' }]}
                            onChange={handleFieldChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Chọn chuyên ngnành</label>
                        <SelectBox
                            id={`create-major${id}`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            value={major}
                            items={[...listMajor.map(y => { return { value: y._id, text: y.name } }), { value: '', text: 'Chọn ngành nghề' }]}
                            onChange={handleMajorChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Chọn trình độ chuyên môn</label>
                        <SelectBox
                            id={`create-professional${id}`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            value={degreeQualification}
                            items={professionalSkillArr}
                            onChange={handlerDegreeQualificationChange}
                        />
                    </div>

                    <div className="row">
                        {/* Năm tốt nghiệp */}
                        <div className={`form-group col-sm-6 col-xs-12 ${errorOnYear && "has-error"}`}>
                            <label>{translate('human_resource.profile.graduation_year')}<span className="text-red">*</span></label>
                            <DatePicker
                                id={`year${id}`}
                                value={year}
                                onChange={handleYearChange}
                            />
                            <ErrorLabel content={errorOnYear} />
                        </div>
                        {/* Loại bằng cấp */}
                        <div className="form-group col-sm-6 col-xs-12">
                            <label>{translate('human_resource.profile.ranking_learning')}<span className="text-red">*</span></label>
                            <select className="form-control" value={degreeType} name="degreeType" onChange={handleDegreeTypeChange}>
                                <option value="excellent">{translate('human_resource.profile.excellent')}</option>
                                <option value="very_good">{translate('human_resource.profile.very_good')}</option>
                                <option value="good">{translate('human_resource.profile.good')}</option>
                                <option value="average_good">{translate('human_resource.profile.average_good')}</option>
                                <option value="ordinary">{translate('human_resource.profile.ordinary')}</option>
                                <option value="no_rating">{translate('human_resource.profile.no_rating')}</option>
                                <option value="unknown">{translate('human_resource.profile.unknown')}</option>
                            </select>
                        </div>
                    </div>
                    {/* File đính kèm*/}
                    <div className="form-group">
                        <label htmlFor="file">{translate('human_resource.profile.attached_files')}</label>
                        <UploadFile onChange={handleChangeFile} />
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
};

function mapState(state) {
    const { field, major } = state;
    return { field, major };
};

const addModal = connect(mapState, null)(withTranslate(DegreeAddModal));
export { addModal as DegreeAddModal };
