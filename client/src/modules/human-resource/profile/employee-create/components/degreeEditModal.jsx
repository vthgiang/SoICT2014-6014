import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel, UploadFile, SelectBox } from '../../../../../common-components';

import ValidationHelper from '../../../../../helpers/validationHelper';

function DegreeEditModal(props) {
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

    useEffect(() => {
        setState(state => {
            return {
                ...state,
                id: props.id,
                index: props.index,
                name: props.name,
                issuedBy: props.issuedBy,
                field: props.fieldId,
                year: props.year,
                degreeType: props.degreeType,
                file: props.file,
                urlFile: props.urlFile,
                fileUpload: props.fileUpload,
                errorOnName: undefined,
                errorOnIssuedBy: undefined,
                errorOnYear: undefined,
            }
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

    const { translate } = props;

    const { id } = props;

    const { index, name, issuedBy, year, degreeType, file, urlFile, fileUpload, errorOnName, errorOnIssuedBy, errorOnYear, field } = state;

    let files;
    let listFields = props.field.listFields;
    if (file) {
        files = [{ fileName: file, urlFile: urlFile, fileUpload: fileUpload }]
    }

    /** Bắt sự kiện thay đổi file đính kèm */
    const handleChangeFile = (value) => {
        if (value.length !== 0) {
            setState({
                ...state,
                file: value[0].fileName,
                urlFile: value[0].urlFile,
                fileUpload: value[0].fileUpload

            })
        } else {
            setState({
                ...state,
                file: "",
                urlFile: "",
                fileUpload: ""
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
        let { message } = ValidationHelper.validateEmpty(translate, value);

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
    const handleYearChange = (e) => {
        let { value } = e.target;
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
        setState({
            ...state,
            [name]: value
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

    /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form */
    const isFormValidated = () => {
        const { name, issuedBy, year } = state;
        let result =
            validateName(name, false) && validateIssuedBy(issuedBy, false) &&
            validateYear(year, false);
        return result;
    }

    /** Bắt sự kiện submit form */
    const save = () => {
        let { field } = state;
        let valueField = props.field;
        if (isFormValidated()) {
            if (!field && valueField && valueField.listFields && valueField.listFields[0]) {
                field = props.field.listFields[0]._id
            }
            return props.handleChange({ ...state, field: field });
        }
    }

    return (
        <React.Fragment>
            <DialogModal
                size='50' modalID={`modal-edit-certificate-${id}`} isLoading={false}
                formID={`form-edit-certificate-${id}`}
                title={translate('human_resource.profile.edit_diploma')}
                func={save}
                disableSubmit={!isFormValidated()}
            >
                <form className="form-group" id={`form-edit-certificate-${id}`}>
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
                            id={`edit-degree-field${index}`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            value={field}
                            items={[...listFields.map(y => { return { value: y._id, text: y.name } }), { value: '', text: 'Chọn ngành nghề' }]}
                            onChange={handleFieldChange}
                        />
                    </div>
                    <div className="row">
                        {/* Năm tốt nghiệp */}
                        <div className={`form-group col-sm-6 col-xs-12 ${errorOnYear && "has-error"}`}>
                            <label>{translate('human_resource.profile.graduation_year')}<span className="text-red">*</span></label>
                            <input type="number" className="form-control" name="year" value={year} onChange={handleYearChange} autoComplete="off" />
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
                            </select>
                        </div>
                    </div>
                    {/* File đính kèm */}
                    <div className="form-group">
                        <label htmlFor="file">{translate('human_resource.profile.attached_files')}</label>
                        <UploadFile files={files} onChange={handleChangeFile} />
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
};

function mapState(state) {
    const { field } = state;
    return { field };
};

const editModal = connect(mapState, null)(withTranslate(DegreeEditModal));
export { editModal as DegreeEditModal };
