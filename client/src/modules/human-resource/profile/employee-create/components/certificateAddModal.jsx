import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, ErrorLabel, DatePicker } from '../../../../../common-components';
import { EmployeeCreateValidator } from './combinedContent';
class CertificateAddModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: this.formatDate(Date.now()),
            endDate: this.formatDate(Date.now()),
            name: "",
            issuedBy: "",
            urlFile: "",
            fileUpload: "",
            file: "",
        }
    }
    // Function format ngày hiện tại thành dạnh mm-yyyy
    formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('-');
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
    // Bắt sự kiên thay đổi tên chứng chỉ
    handleNameChange = (e) => {
        let { value } = e.target;
        this.validateNameCertificate(value, true);
    }
    validateNameCertificate = (value, willUpdateState = true) => {
        let msg = EmployeeCreateValidator.validateNameCertificate(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnName: msg,
                    name: value,
                }
            });
        }
        return msg === undefined;
    }
    // Bắt sự kiện thay đổi nơi cấp
    handleIssuedByChange = (e) => {
        let { value } = e.target;
        this.validateIssuedByCertificate(value, true);
    }
    validateIssuedByCertificate = (value, willUpdateState = true) => {
        let msg = EmployeeCreateValidator.validateIssuedByCertificate(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnUnit: msg,
                    issuedBy: value,
                }
            });
        }
        return msg === undefined;
    }
    // Bắt sự kiện thay đổi ngày có hiệu lực
    handleStartDateChange = (value) => {
        this.validateStartDateCertificate(value, true);
    }
    validateStartDateCertificate = (value, willUpdateState = true) => {
        let msg = EmployeeCreateValidator.validateStartDateCertificate(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnStartDate: msg,
                    startDate: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi ngày hết hiệu lực
    handleEndDateChange = (value) => {
        this.validateEndDateCertificate(value, true);
    }
    validateEndDateCertificate = (value, willUpdateState = true) => {
        let msg = EmployeeCreateValidator.validateEndDateCertificate(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnEndDate: msg,
                    endDate: value,
                }
            });
        }
        return msg === undefined;
    }

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        let result =
            this.validateNameCertificate(this.state.name, false) &&
            this.validateIssuedByCertificate(this.state.issuedBy, false) &&
            this.validateStartDateCertificate(this.state.startDate, false) &&
            this.validateEndDateCertificate(this.state.endDate, false);
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
        const { name, issuedBy, endDate, startDate, errorOnName, errorOnUnit, errorOnEndDate, errorOnStartDate } = this.state;
        return (
            <React.Fragment>
                <ButtonModal modalID={`modal-create-certificateShort-${id}`} button_name={translate('modal.create')} title={translate('manage_employee.add_certificate')} />
                <DialogModal
                    size='50' modalID={`modal-create-certificateShort-${id}`} isLoading={false}
                    formID={`form-create-certificateShort-${id}`}
                    title={translate('manage_employee.add_certificate')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id={`form-create-certificateShort-${id}`}>
                        <div className={`form-group ${errorOnName === undefined ? "" : "has-error"}`}>
                            <label>{translate('manage_employee.name_certificate')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="name" value={name} onChange={this.handleNameChange} autoComplete="off" />
                            <ErrorLabel content={errorOnName} />
                        </div>
                        <div className={`form-group ${errorOnUnit === undefined ? "" : "has-error"}`}>
                            <label>{translate('manage_employee.issued_by')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="issuedBy" value={issuedBy} onChange={this.handleIssuedByChange} autoComplete="off" />
                            <ErrorLabel content={errorOnUnit} />
                        </div>
                        <div className="row">
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnStartDate === undefined ? "" : "has-error"}`}>
                                <label>{translate('manage_employee.date_issued')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`add-start-date-${id}`}
                                    value={startDate}
                                    onChange={this.handleStartDateChange}
                                />
                                <ErrorLabel content={errorOnStartDate} />
                            </div>
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnEndDate === undefined ? "" : "has-error"}`}>
                                <label>{translate('manage_employee.end_date_certificate')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`add-end-date-${id}`}
                                    value={endDate}
                                    onChange={this.handleEndDateChange}
                                />
                                <ErrorLabel content={errorOnEndDate} />
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
const addModal = connect(null, null)(withTranslate(CertificateAddModal));
export { addModal as CertificateAddModal };
