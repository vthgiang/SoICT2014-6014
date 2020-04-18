import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ModalDialog, ModalButton, ErrorLabel } from '../../../../common-components';
import { EmployeeCreateValidator } from './CombineContent';
class ModalAddCertificate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nameCertificate: "",
            addressCertificate: "",
            yearCertificate: "",
            typeCertificate: "Xuất sắc",
            file: "",
            urlFile: " ",
            fileUpload: " ",
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
    // Bắt sự kiên thay đổi tên bằng cấp
    handleNameCertificateChange = (e) => {
        let { value } = e.target;
        this.validateNameCertificate(value, true);
    }
    validateNameCertificate = (value, willUpdateState = true) => {
        let msg = EmployeeCreateValidator.validateNameCertificate(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnNameCertificate: msg,
                    nameCertificate: value,
                }
            });
        }
        return msg === undefined;
    }
    // Bắt sự kiện thay đổi nơi đào tạo
    handleAddressCertificateChange = (e) => {
        let { value } = e.target;
        this.validateAddressCertificate(value, true);
    }
    validateAddressCertificate = (value, willUpdateState = true) => {
        let msg = EmployeeCreateValidator.validateAddressCertificate(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnAddressCertificate: msg,
                    addressCertificate: value,
                }
            });
        }
        return msg === undefined;
    }
    // Bắt sự kiện thay đổi năm tốt nghiệp
    handleYearCertificateChange = (e) => {
        let { value } = e.target;
        this.validateYearCertificate(value, true);
    }
    validateYearCertificate = (value, willUpdateState = true) => {
        let msg = EmployeeCreateValidator.validateYearCertificate(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnYearCertificate: msg,
                    yearCertificate: value,
                }
            });
        }
        return msg === undefined;
    }
    // Bắt sự kiện thay đổi xếp loại
    handleTypeCertificateChange = (e) => {
        let { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        let result =
            this.validateNameCertificate(this.state.nameCertificate, false) && this.validateAddressCertificate(this.state.addressCertificate, false) &&
            this.validateYearCertificate(this.state.yearCertificate, false);
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
        const { nameCertificate, addressCertificate, yearCertificate, typeCertificate,
            errorOnNameCertificate, errorOnAddressCertificate, errorOnYearCertificate } = this.state;
        return (
            <React.Fragment>
                <ModalButton modalID={`modal-create-certificate-${id}`} button_name={translate('modal.create')} title="Thêm mới bằng cấp" />
                <ModalDialog
                    size='50' modalID={`modal-create-certificate-${id}`} isLoading={false}
                    formID={`form-create-certificate-${id}`}
                    title="Thêm mới bằng cấp"
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id={`form-create-certificate-${id}`}>
                        <div className={`form-group ${errorOnNameCertificate === undefined ? "" : "has-error"}`}>
                            <label>Tên bằng cấp<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="nameCertificate" value={nameCertificate} onChange={this.handleNameCertificateChange} autoComplete="off" />
                            <ErrorLabel content={errorOnNameCertificate} />
                        </div>
                        <div className={`form-group ${errorOnAddressCertificate === undefined ? "" : "has-error"}`}>
                            <label>Nơi đào tạo<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="addressCertificate" value={addressCertificate} onChange={this.handleAddressCertificateChange} autoComplete="off" />
                            <ErrorLabel content={errorOnAddressCertificate} />
                        </div>
                        <div className="row">
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnYearCertificate === undefined ? "" : "has-error"}`}>
                                <label>Năm tốt nghiệp<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="yearCertificate" value={yearCertificate} onChange={this.handleYearCertificateChange} autoComplete="off" />
                                <ErrorLabel content={errorOnYearCertificate} />
                            </div>
                            <div className="form-group col-sm-6 col-xs-12">
                                <label>Xếp loại<span className="text-red">*</span></label>
                                <select className="form-control" value={typeCertificate} name="typeCertificate" onChange={this.handleTypeCertificateChange}>
                                    <option value="Xuất sắc">Xuất sắc</option>
                                    <option value="Giỏi">Giỏi</option>
                                    <option value="Khá">Khá</option>
                                    <option value="Trung bình khá">Trung bình khá</option>
                                    <option value="Trung bình">Trung bình</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="file">Chọn file đính kèm</label>
                            <input type="file" style={{ height: 34, paddingTop: 2 }} className="form-control" name="file" onChange={this.handleChangeFile} />
                        </div>
                    </form>
                </ModalDialog>
            </React.Fragment>
        );
    }
};
const addCertificate = connect(null, null)(withTranslate(ModalAddCertificate));
export { addCertificate as ModalAddCertificate };
