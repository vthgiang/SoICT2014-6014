import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel } from '../../../../../common-components';

import { AssetCreateValidator } from './combinedContent';

class FileEditModal extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    // Bắt sự kiện thay đổi file đính kèm
    handleChangeFile = (e) => {
        var file = e.target.files[0];

        if (file) {
            var url = URL.createObjectURL(file);
            var fileLoad = new FileReader();
            fileLoad.readAsDataURL(file);
            fileLoad.onload = () => {
                let item = {
                    fileName: file.name,
                    url: url,
                    fileUpload: file,
                }
                this.setState(state => {
                    return {
                        ...state,
                        files: [...state.files, item],
                    }
                })
            };
        } else {
            let item = {
                fileName: "",
                url: "",
                fileUpload: ""
            }

            this.setState(state => {
                return {
                    ...state,
                    files: [...state.files, item],
                }
            })
        }
    }

    // Bắt sự kiện xóa file đính kèm
    handleDeleteFile = (name) => {
        const { files } = this.state;
        let newfiles = files.filter((item) => item.fileName !== name);

        this.setState(state => {
            return {
                ...state,
                files: newfiles,
            }
        })
    }

    // Bắt sự kiên thay đổi tên tài liệu
    handleNameFileChange = (e) => {
        let { value } = e.target;
        this.validateNameFile(value, true);
    }
    validateNameFile = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateNameFile(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnNameFile: msg,
                    name: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiên thay đổi mô tả
    handleDiscFileChange = (e) => {
        let { value } = e.target;
        this.validateDiscFile(value, true);
    }
    validateDiscFile = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateDiscFile(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnDiscFile: msg,
                    description: value,
                }
            });
        }
        return msg === undefined;
    }

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        let result = this.validateNameFile(this.state.name, false) && this.validateDiscFile(this.state.description, false);

        return result;
    }
    
    // Bắt sự kiện submit form
    save = () => {
        if (this.isFormValidated()) {
            return this.props.handleEditFile(this.state);
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                _id: nextProps._id,
                index: nextProps.index,
                name: nextProps.name,
                description: nextProps.description,
                files: nextProps.files,

                errorOnNameFile: undefined,
                errorOnDiscFile: undefined,
                errorOnNumberFile: undefined,
            }
        } else {
            return null;
        }
    }

    render() {
        const { id } = this.props;
        const { translate } = this.props;
        const { name, description, files, errorOnNameFile, errorOnDiscFile, errorOnNumberFile } = this.state;

        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID={`modal-edit-file-${id}`} isLoading={false}
                    formID={`form-edit-file-${id}`}
                    title={translate('manage_employee.edit_file')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    {/* Form chỉnh sửa tài liệu đính kèm */}
                    <form className="form-group" id={`form-create-file-${id}`}>
                        {/* Tên tài liệu */}
                        <div className={`form-group ${!errorOnNameFile ? "" : "has-error"}`}>
                            <label>{translate('asset.general_information.file_name')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="name" value={name} onChange={this.handleNameFileChange} autoComplete="off" />
                            <ErrorLabel content={errorOnNameFile} />
                        </div>

                        {/* Mô tả */}
                        <div className={`form-group ${!errorOnDiscFile ? "" : "has-error"}`}>
                            <label>{translate('asset.general_information.description')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="description" value={description} onChange={this.handleDiscFileChange} autoComplete="off" />
                            <ErrorLabel content={errorOnDiscFile} />
                        </div>

                        {/* File đính kèm */}
                        <div className="form-group">
                            <label htmlFor="file">{translate('asset.general_information.attached_file')}</label>
                            <input type="file" style={{ height: 34, paddingTop: 2 }} className="form-control" name="file" onChange={this.handleChangeFile} />
                        </div>
                        <ul style={{ listStyle: 'none' }}>
                            {files.map((child, index) => {
                                return (
                                    <React.Fragment>
                                        <li key={index}>
                                            <label><a style={{ cursor: "pointer" }} title='Xóa file này'><i className="fa fa-times" style={{ color: "black", marginRight: 5 }}
                                                onClick={(e) => this.handleDeleteFile(child.fileName)} /></a></label>
                                            <a>{child.fileName}</a>
                                        </li>
                                    </React.Fragment>
                                )
                            })}
                        </ul>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};

const editModal = connect(null, null)(withTranslate(FileEditModal));

export { editModal as FileEditModal };
