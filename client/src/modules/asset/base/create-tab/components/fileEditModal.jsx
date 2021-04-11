import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel, UploadFile } from '../../../../../common-components';

import ValidationHelper from '../../../../../helpers/validationHelper';

function FileEditModal(props){
    const [state, setState] =useState({})
    const [prevProps, setPrevProps] = useState({
        id: null
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
        setState(state =>{
            return{
                ...state,
                files: file
            }
        });
    }

    // Bắt sự kiện xóa file đính kèm
    const handleDeleteFile = (name) => {
        const { files } = state;
        let newfiles = files.filter((item) => item.fileName !== name);

        setState(state => {
            return {
                ...state,
                files: newfiles,
            }
        })
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
            return props.handleEditFile(state);
        }
    }

    if(prevProps.id !== props.id){
        setState(state => {
            return {
                ...state,
                id: props.id,
                _id: props._id,
                index: props.index,
                name: props.name,
                description: props.description,
                files: props.files,

                errorOnNameFile: undefined,
                errorOnDiscFile: undefined,
                errorOnNumberFile: undefined,
            }
        })
        setPrevProps(props)
    }
    

    
        const { id } = props;
        const { translate } = props;
        const { name, description, files, errorOnNameFile, errorOnDiscFile, errorOnNumberFile } = state;

        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID={`modal-edit-file-${id}`} isLoading={false}
                    formID={`form-edit-file-${id}`}
                    title={translate('asset.general_information.edit_document')}
                    func={save}
                    disableSubmit={!isFormValidated()}
                >
                    {/* Form chỉnh sửa tài liệu đính kèm */}
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
                            <label htmlFor="file">{translate('asset.general_information.attached_file')}</label>
                            <UploadFile multiple={true} onChange={handleChangeFile} />
                            {/* <br />
                            <div className="upload btn btn-primary">
                                <i className="fa fa-folder"></i>
                                {" " + translate('document.choose_file')}
                                <input className="upload" type="file" name="file" onChange={handleChangeFile} />
                            </div> */}
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
};

const editModal = connect(null, null)(withTranslate(FileEditModal));

export { editModal as FileEditModal };
