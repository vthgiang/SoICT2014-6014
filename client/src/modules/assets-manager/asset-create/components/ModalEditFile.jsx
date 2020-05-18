import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ErrorLabel } from '../../../../common-components';
import { AssetCreateValidator } from './CombineContent';
class ModalEditFile extends Component {
    constructor(props) {
        super(props);
        this.state = {}
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

    // Bắt sự kiên thay đổi mô tả
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
                    nameFile: value,
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
                    discFile: value,
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
        let msg = AssetCreateValidator.validateNumberFile(value, this.props.translate)
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
            this.validateNameFile(this.state.nameFile, false) && this.validateDiscFile(this.state.discFile, false) &&
            this.validateNumberFile(this.state.number, false);
        return result;
    }
    // Bắt sự kiện submit form
    save = () => {
        if (this.isFormValidated()) {
            return this.props.handleChange(this.state);
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                index: nextProps.index,
                nameFile: nextProps.nameFile,
                discFile: nextProps.discFile,
                number: nextProps.number,

                errorOnNameFile: undefined,
                errorOnDiscFile: undefined,
                errorOnNumberFile: undefined,
            }
        } else {
            return null;
        }
    }
    render() {
        const { id, translate } = this.props;
        const { nameFile, discFile, number, 
            errorOnNameFile, errorOnDiscFile, errorOnNumberFile } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID={`modal-edit-file-${id}`} isLoading={false}
                    formID={`form-edit-file-${id}`}
                    title="Chỉnh sửa tài liệu đính kèm"
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id={`form-create-file-${id}`}>
                        <div className={`form-group ${errorOnNameFile === undefined ? "" : "has-error"}`}>
                            <label>Tên tài liệu<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="nameFile" value={nameFile} onChange={this.handleNameFileChange} autoComplete="off" />
                            <ErrorLabel content={errorOnNameFile} />
                        </div>
                        <div className={`form-group ${errorOnDiscFile === undefined ? "" : "has-error"}`}>
                            <label>Mô tả<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="discFile" value={discFile} onChange={this.handleDiscFileChange} autoComplete="off" />
                            <ErrorLabel content={errorOnDiscFile} />
                        </div>
                            <div className={`form-group ${errorOnNumberFile === undefined ? "" : "has-error"}`}>
                                <label>Số lượng<span className="text-red">*</span></label>
                                <input type="number" className="form-control" name="number" value={number} onChange={this.handleNumberChange} autoComplete="off" />
                                <ErrorLabel content={errorOnNumberFile} />
                            </div>
                            
                        <div className="form-group">
                            <label htmlFor="file">File đính kèm</label>
                            <input type="file" style={{ height: 34, paddingTop: 2 }} className="form-control" name="file" onChange={this.handleChangeFile} />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};
const editFile = connect(null, null)(withTranslate(ModalEditFile));
export { editFile as ModalEditFile };
