import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ModalDialog, ErrorLabel } from '../../../../common-components';
import { EmployeeCreateValidator } from './CombineContent';
class ModalEditCertificate extends Component {
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
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                index: nextProps.index,
                nameCertificate: nextProps.nameCertificate,
                addressCertificate: nextProps.addressCertificate,
                yearCertificate: nextProps.yearCertificate,
                typeCertificate: nextProps.typeCertificate,
                file: nextProps.file,
                urlFile: nextProps.urlFile,
                fileUpload: nextProps.fileUpload,

                errorOnNameCertificate: undefined,
                errorOnAddressCertificate: undefined,
                errorOnYearCertificate: undefined,
            }
        } else {
            return null;
        }
    }
    render() {
        const { id, translate } = this.props;
        const { nameCertificate, addressCertificate, yearCertificate, typeCertificate,
            errorOnNameCertificate, errorOnAddressCertificate, errorOnYearCertificate } = this.state;
        return (
            <React.Fragment>
                <ModalDialog
                    size='50' modalID={`modal-edit-certificate-${id}`} isLoading={false}
                    formID={`form-edit-certificate-${id}`}
                    title={translate('manage_employee.edit_diploma')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id={`form-edit-certificate-${id}`}>
                        <div className={`form-group ${errorOnNameCertificate === undefined ? "" : "has-error"}`}>
                            <label>{translate('manage_employee.name_diploma')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="nameCertificate" value={nameCertificate} onChange={this.handleNameCertificateChange} autoComplete="off" />
                            <ErrorLabel content={errorOnNameCertificate} />
                        </div>
                        <div className={`form-group ${errorOnAddressCertificate === undefined ? "" : "has-error"}`}>
                            <label>{translate('manage_employee.diploma_issued_by')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="addressCertificate" value={addressCertificate} onChange={this.handleAddressCertificateChange} autoComplete="off" />
                            <ErrorLabel content={errorOnAddressCertificate} />
                        </div>
                        <div className="row">
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnYearCertificate === undefined ? "" : "has-error"}`}>
                                <label>{translate('manage_employee.graduation_year')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="yearCertificate" value={yearCertificate} onChange={this.handleYearCertificateChange} autoComplete="off" />
                                <ErrorLabel content={errorOnYearCertificate} />
                            </div>
                            <div className="form-group col-sm-6 col-xs-12">
                                <label>{translate('manage_employee.ranking_learning')}<span className="text-red">*</span></label>
                                <select className="form-control" value={typeCertificate} name="typeCertificate" onChange={this.handleTypeCertificateChange}>
                                    <option value="excellent">{translate('manage_employee.excellent')}</option>
                                    <option value="very_good">{translate('manage_employee.very_good')}</option>
                                    <option value="good">{translate('manage_employee.good')}</option>
                                    <option value="average_good">{translate('manage_employee.average_good')}</option>
                                    <option value="ordinary">{translate('manage_employee.ordinary')}</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="file">{translate('manage_employee.attached_files')}</label>
                            <input type="file" style={{ height: 34, paddingTop: 2 }} className="form-control" name="file" onChange={this.handleChangeFile} />
                        </div>
                    </form>
                </ModalDialog>
            </React.Fragment>
        );
    }
};
const editCertificate = connect(null, null)(withTranslate(ModalEditCertificate));
export { editCertificate as ModalEditCertificate };
