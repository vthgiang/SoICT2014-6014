import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, ErrorLabel } from '../../../../../common-components';
import { EmployeeCreateValidator } from './combinedContent';
class FileAddModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            description: "",
            number: "",
            status: "submitted",
            file: "",
            urlFile: "",
            fileUpload: ""
        }
    }
    // Bắt sự kiện thay đổi file đính kèm
    handleChangeFile = (e) => {
        const { name } = e.target;
        var file = e.target.files[0];
        if (file !== undefined) {
            var url = URL.createObjectURL(file);
            var fileLoad = new FileReader();
            fileLoad.readAsDataURL(file);
            fileLoad.onload = () => {
                this.setState({
                    [name]: file.name,
                    urlFile: url,
                    fileUpload: file,
                })
            };
        }
    }

    // Bắt sự kiện thay đổi trạng thái
    handleStatusChange = (e) => {
        const { value } = e.target;
        this.setState({
            status: value
        });
    }
    // Bắt sự kiên thay đổi mô tả
    handleNameFileChange = (e) => {
        let { value } = e.target;
        this.validateNameFile(value, true);
    }
    validateNameFile = (value, willUpdateState = true) => {
        let msg = EmployeeCreateValidator.validateNameFile(value, this.props.translate)
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
        let msg = EmployeeCreateValidator.validateDiscFile(value, this.props.translate)
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

    // Bắt sự kiên thay đổi mô tả
    handleNumberChange = (e) => {
        let { value } = e.target;
        this.validateNumberFile(value, true);
    }
    validateNumberFile = (value, willUpdateState = true) => {
        let msg = EmployeeCreateValidator.validateNumberFile(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnNumberFile: msg,
                    number: value,
                }
            });
        }
        return msg === undefined;
    }

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        let result =
            this.validateNameFile(this.state.name, false) && this.validateDiscFile(this.state.description, false) &&
            this.validateNumberFile(this.state.number, false);
        return result;
    }
    // Bắt sự kiện submit form
    save = () => {
        if (this.isFormValidated()) {
            return this.props.handleChange(this.state);
        }
    }
    render() {
        const { id, translate } = this.props;
        const { name, description, number, status,
            errorOnNameFile, errorOnDiscFile, errorOnNumberFile } = this.state;
        return (
            <React.Fragment>
                <ButtonModal modalID={`modal-create-file-${id}`} button_name={translate('modal.create')} title={translate('manage_employee.add_file')} />
                <DialogModal
                    size='50' modalID={`modal-create-file-${id}`} isLoading={false}
                    formID={`form-create-file-${id}`}
                    title={translate('manage_employee.add_file')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id={`form-create-file-${id}`}>
                        <div className={`form-group ${errorOnNameFile === undefined ? "" : "has-error"}`}>
                            <label>{translate('manage_employee.file_name')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="name" value={name} onChange={this.handleNameFileChange} autoComplete="off" />
                            <ErrorLabel content={errorOnNameFile} />
                        </div>
                        <div className={`form-group ${errorOnDiscFile === undefined ? "" : "has-error"}`}>
                            <label>{translate('table.description')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="description" value={description} onChange={this.handleDiscFileChange} autoComplete="off" />
                            <ErrorLabel content={errorOnDiscFile} />
                        </div>
                        <div className="row">
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnNumberFile === undefined ? "" : "has-error"}`}>
                                <label>{translate('manage_employee.number')}<span className="text-red">*</span></label>
                                <input type="number" className="form-control" name="number" value={number} onChange={this.handleNumberChange} autoComplete="off" />
                                <ErrorLabel content={errorOnNumberFile} />
                            </div>
                            <div className="form-group col-sm-6 col-xs-12">
                                <label>{translate('table.status')}<span className="text-red">*</span></label>
                                <select className="form-control" value={status} name="status" onChange={this.handleStatusChange}>
                                <option value="no_submitted">{translate('manage_employee.no_submitted')}</option>
                                    <option value="submitted">{translate('manage_employee.submitted')}</option>
                                    <option value="returned">{translate('manage_employee.returned')}</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="file">{translate('manage_employee.attached_files')}</label>
                            <input type="file" style={{ height: 34, paddingTop: 2 }} className="form-control" name="file" onChange={this.handleChangeFile} />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};
const addModal = connect(null, null)(withTranslate(FileAddModal));
export { addModal as FileAddModal };
