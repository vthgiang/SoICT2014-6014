import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ButtonModal, ErrorLabel, UploadFile } from '../../../../../common-components';

import ValidationHelper from '../../../../../helpers/validationHelper';

function FileAddModal(props) {
    const [state, setState] = useState({
        name: "",
        description: "",
        number: "",
        files: [],
    })


    // Bắt sự kiện thay đổi file đính kèm
    const handleChangeFile = (file) => {
        file = file.map(x => {
            return {
                fileName: x.fileName,
                url: x.urlFile,
                fileUpload: x.fileUpload
            }
        })
        setState(state => {
            return {
                ...state,
                files: file
            }
        });
    }

    // Bắt sự kiên thay đổi tên tài liệu
    const handleNameFileChange = (e) => {
        let { value } = e.target;
        validateNameFile(value, true);
    }
    const validateNameFile = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

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

    // Bắt sự kiên thay đổi mô tả
    const handleDiscFileChange = (e) => {
        let { value } = e.target;
        validateDiscFile(value, true);
    }
    const validateDiscFile = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

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

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    const isFormValidated = () => {
        let result = validateNameFile(state.name, false) && validateDiscFile(state.description, false);

        return result;
    }

    // Bắt sự kiện submit form
    const save = () => {
        if (isFormValidated()) {
            return props.handleChange(state);
        }
    }


    const { id } = props;
    const { translate } = props;
    const { name, description, number, status, errorOnNameFile, errorOnDiscFile, errorOnNumberFile, files } = state;

    return (
        <React.Fragment>
            {/* Button thêm tài liệu đính kèm */}
            <ButtonModal modalID={`modal-create-file-${id}`} button_name={translate('manage_asset.add_file')} title={translate('manage_asset.add_file')} />
            <DialogModal
                size='50' modalID={`modal-create-file-${id}`} isLoading={false}
                formID={`form-create-file-${id}`}
                title={translate('manage_asset.add_file')}
                func={save}
                disableSubmit={!isFormValidated()}
            >
                {/* Form thêm tài liệu đính kèm */}
                <form className="form-group" id={`form-create-file-${id}`}>
                    {/* Tên tài liệu */}
                    <div className={`form-group ${!errorOnNameFile ? "" : "has-error"}`}>
                        <label>{translate('asset.general_information.file_name')}<span className="text-red">*</span></label>
                        <input type="text" className="form-control" name="name" value={name} onChange={handleNameFileChange} autoComplete="off" />
                        <ErrorLabel content={errorOnNameFile} />
                    </div>

                    {/* Mô tả */}
                    <div className={`form-group ${!errorOnDiscFile ? "" : "has-error"}`}>
                        <label>{translate('asset.general_information.description')}<span className="text-red">*</span></label>
                        <textarea className="form-control" rows="3" name="description" value={description} onChange={handleDiscFileChange} autoComplete="off"></textarea>
                        <ErrorLabel content={errorOnDiscFile} />
                    </div>

                    {/* File đính kèm */}
                    <div className="form-group">
                        <label htmlFor="">Chọn tài liệu</label>
                        <UploadFile multiple={true} onChange={handleChangeFile} />
                    </div>

                    {/* <div className="form-group">
                            <label htmlFor="file">{translate('asset.general_information.attached_file')}</label>
                            <input type="file" style={{ height: 34, paddingTop: 2 }} className="form-control" name="file" onChange={handleChangeFile} />
                            <br />
                            <div className="upload btn btn-primary">
                                <i className="fa fa-folder"></i>
                                {" " + translate('document.choose_file')}
                                <input className="upload" type="file" name="file" onChange={handleChangeFile} />
                            </div>
                        </div> */}
                    {/* <ul style={{ listStyle: 'none' }}>
                            {files.map((child, index) => {
                                return (
                                    <React.Fragment>
                                        <li key={index}>
                                            <label><a style={{ cursor: "pointer" }} title='Xóa file này'><i className="fa fa-times" style={{ color: "black", marginRight: 5 }}
                                                onClick={(e) => handleDeleteFile(child.fileName)} /></a></label>
                                            <a>{child.fileName}</a>
                                        </li>
                                    </React.Fragment>
                                )
                            })}
                        </ul> */}
                </form>
            </DialogModal>
        </React.Fragment>
    );
};

const addModal = connect(null, null)(withTranslate(FileAddModal));

export { addModal as FileAddModal };
