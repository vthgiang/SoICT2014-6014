import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ButtonModal, ErrorLabel, UploadFile } from '../../../../../common-components';

import ValidationHelper from '../../../../../helpers/validationHelper';

function FileAddModal(props) {

    const [state, setState] = useState({
        name: "",
        description: "",
        number: "",
        status: "submitted",
        file: "",
        urlFile: "",
        fileUpload: ""
    })

    const { translate } = props;

    const { id } = props;

    const { name, description, number, status,
        errorOnNameFile, errorOnDiscFile, errorOnNumberFile } = state;

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

    /** Bắt sự kiện thay đổi trạng thái */
    const handleStatusChange = (e) => {
        let { value } = e.target;
        setState({
            ...state,
            status: value
        });
    }

    /** Bắt sự kiên thay đổi tên tài liệu */
    const handleNameFileChange = (e) => {
        let { value } = e.target;
        validateNameFile(value, true);
    }

    const validateNameFile = (value, willUpdateState = true) => {
        const { translate } = props;
        let { message } = ValidationHelper.validateEmpty(translate, value);

        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    errorOnNameFile: message,
                    name: value,
                }
            });
        }
        return message === undefined;
    }

    /** Bắt sự kiên thay đổi mô tả */
    const handleDiscFileChange = (e) => {
        let { value } = e.target;
        validateDiscFile(value, true);
    }

    const validateDiscFile = (value, willUpdateState = true) => {
        const { translate } = props;
        let { message } = ValidationHelper.validateEmpty(translate, value);

        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    errorOnDiscFile: message,
                    description: value,
                }
            });
        }
        return message === undefined;
    }

    /** Bắt sự kiên thay đổi số lượng */
    const handleNumberChange = (e) => {
        let { value } = e.target;
        validateNumberFile(value, true);
    }

    const validateNumberFile = (value, willUpdateState = true) => {
        const { translate } = props;
        let { message } = ValidationHelper.validateEmpty(translate, value.toString());

        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    errorOnNumberFile: message,
                    number: value,
                }
            });
        }
        return message === undefined;
    }

    /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form */
    const isFormValidated = () => {
        const { name, description, number } = state;
        let result = validateNameFile(name, false) &&
            validateDiscFile(description, false) &&
            validateNumberFile(number, false);
        return result;
    }

    /** Bắt sự kiện submit form */
    const save = () => {
        if (isFormValidated()) {
            return props.handleChange(state);
        }
    }

    return (
        <React.Fragment>
            <ButtonModal modalID={`modal-create-file-${id}`} button_name={translate('modal.create')} title={translate('human_resource.profile.add_file')} />
            <DialogModal
                size='50' modalID={`modal-create-file-${id}`} isLoading={false}
                formID={`form-create-file-${id}`}
                title={translate('human_resource.profile.add_file')}
                func={save}
                disableSubmit={!isFormValidated()}
            >
                <form className="form-group" id={`form-create-file-${id}`}>
                    {/* Tên tài liệu  */}
                    <div className={`form-group ${errorOnNameFile && "has-error"}`}>
                        <label>{translate('human_resource.profile.file_name')}<span className="text-red">*</span></label>
                        <input type="text" className="form-control" name="name" value={name} onChange={handleNameFileChange} autoComplete="off" />
                        <ErrorLabel content={errorOnNameFile} />
                    </div>
                    {/* Mô tả */}
                    <div className={`form-group ${errorOnDiscFile && "has-error"}`}>
                        <label>{translate('table.description')}<span className="text-red">*</span></label>
                        <input type="text" className="form-control" name="description" value={description} onChange={handleDiscFileChange} autoComplete="off" />
                        <ErrorLabel content={errorOnDiscFile} />
                    </div>
                    <div className="row">
                        {/* Số lượng */}
                        <div className={`form-group col-sm-6 col-xs-12 ${errorOnNumberFile && "has-error"}`}>
                            <label>{translate('human_resource.profile.number')}<span className="text-red">*</span></label>
                            <input type="number" className="form-control" name="number" value={number} onChange={handleNumberChange} autoComplete="off" />
                            <ErrorLabel content={errorOnNumberFile} />
                        </div>
                        {/* Trạng thái */}
                        <div className="form-group col-sm-6 col-xs-12">
                            <label>{translate('table.status')}<span className="text-red">*</span></label>
                            <select className="form-control" value={status} name="status" onChange={handleStatusChange}>
                                <option value="not_submitted_yet">{translate('human_resource.profile.not_submitted_yet')}</option>
                                <option value="submitted">{translate('human_resource.profile.submitted')}</option>
                                <option value="returned">{translate('human_resource.profile.returned')}</option>
                            </select>
                        </div>
                    </div>
                    {/* File đính kèm */}
                    <div className="form-group">
                        <label htmlFor="file">{translate('human_resource.profile.attached_files')}</label>
                        <UploadFile onChange={handleChangeFile} />
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
};

const addModal = connect(null, null)(withTranslate(FileAddModal));
export { addModal as FileAddModal };
