import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ModalDialog, ModalButton, ErrorLabel, DatePicker } from '../../../../common-components';
import { EmployeeCreateValidator } from './CombineContent';
class ModalAddCertificateShort extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: this.formatDate(Date.now()),
            endDate: this.formatDate(Date.now()),
            nameCertificateShort: "",
            unit: "",
            urlFile: " ",
            fileUpload: " ",
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
    handleNameCertificateChange = (e) => {
        let { value } = e.target;
        this.validateNameCertificateShort(value, true);
    }
    validateNameCertificateShort = (value, willUpdateState = true) => {
        let msg = EmployeeCreateValidator.validateNameCertificateShort(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnNameCertificateShort: msg,
                    nameCertificateShort: value,
                }
            });
        }
        return msg === undefined;
    }
    // Bắt sự kiện thay đổi nơi cấp
    handleUnitCertificateChange = (e) => {
        let { value } = e.target;
        this.validateUnitCertificateShort(value, true);
    }
    validateUnitCertificateShort = (value, willUpdateState = true) => {
        let msg = EmployeeCreateValidator.validateUnitCertificateShort(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnUnit: msg,
                    unit: value,
                }
            });
        }
        return msg === undefined;
    }
    // Bắt sự kiện thay đổi ngày có hiệu lực
    handleStartDateChange = (value) => {
        this.validateStartDateCertificateShort(value, true);
    }
    validateStartDateCertificateShort = (value, willUpdateState = true) => {
        let msg = EmployeeCreateValidator.validateStartDateCertificateShort(value, this.props.translate)
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
        this.validateEndDateCertificateShort(value, true);
    }
    validateEndDateCertificateShort = (value, willUpdateState = true) => {
        let msg = EmployeeCreateValidator.validateEndDateCertificateShort(value, this.props.translate)
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
            this.validateNameCertificateShort(this.state.nameCertificateShort, false) &&
            this.validateUnitCertificateShort(this.state.unit, false) &&
            this.validateStartDateCertificateShort(this.state.startDate, false) &&
            this.validateEndDateCertificateShort(this.state.endDate, false);
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
        const { nameCertificateShort, unit, endDate, startDate,
            errorOnNameCertificateShort, errorOnUnit, errorOnEndDate, errorOnStartDate } = this.state;
        return (
            <React.Fragment>
                <ModalButton modalID={`modal-create-certificateShort-${id}`} button_name={translate('modal.create')} title={translate('manage_employee.add_certificate')} />
                <ModalDialog
                    size='50' modalID={`modal-create-certificateShort-${id}`} isLoading={false}
                    formID={`form-create-certificateShort-${id}`}
                    title={translate('manage_employee.add_certificate')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id={`form-create-certificateShort-${id}`}>
                        <div className={`form-group ${errorOnNameCertificateShort === undefined ? "" : "has-error"}`}>
                            <label>{translate('manage_employee.name_certificate')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="nameCertificate" value={nameCertificateShort} onChange={this.handleNameCertificateChange} autoComplete="off" />
                            <ErrorLabel content={errorOnNameCertificateShort} />
                        </div>
                        <div className={`form-group ${errorOnUnit === undefined ? "" : "has-error"}`}>
                            <label>{translate('manage_employee.issued_by')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="addressCertificate" value={unit} onChange={this.handleUnitCertificateChange} autoComplete="off" />
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
                </ModalDialog>
            </React.Fragment>
        );
    }
};
const addCertificateShort = connect(null, null)(withTranslate(ModalAddCertificateShort));
export { addCertificateShort as ModalAddCertificateShort };
