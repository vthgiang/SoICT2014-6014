import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, ErrorLabel, DatePicker } from '../../../../../common-components';
import { EmployeeCreateValidator } from './combinedContent';
class ContractAddModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            contractType: "",
            startDate: this.formatDate(Date.now()),
            endDate: this.formatDate(Date.now()),
            file: "",
            urlFile: "",
            fileUpload: ""
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
    // Bắt sự kiện thay đổi tên hợp đồng lao động
    handleNameContract =(e)=>{
        let { value } = e.target;
        this.validateNameContract(value, true);
    }
    validateNameContract = (value, willUpdateState = true) => {
        let msg = EmployeeCreateValidator.validateNameContract(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnNameContract: msg,
                    name: value,
                }
            });
        }
        return msg === undefined;
    }
    // Bắt sự kiện thay đổi tên hợp đồng lao động
    handleTypeContract =(e)=>{
        let { value } = e.target;
        this.validateTypeContract(value, true);
    }
    validateTypeContract = (value, willUpdateState = true) => {
        let msg = EmployeeCreateValidator.validateTypeContract(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnTypeContract: msg,
                    contractType: value,
                }
            });
        }
        return msg === undefined;
    }


    // Bắt sự kiện thay đổi ngày có hiệu lực
    handleStartDateChange = (value) => {
        this.validateStartDateContract(value, true);
    }
    validateStartDateContract = (value, willUpdateState = true) => {
        let msg = EmployeeCreateValidator.validateStartDateContract(value, this.props.translate)
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
            this.validateStartDateContract(this.state.startDate, false) && this.validateEndDateCertificateShort(this.state.endDate, false) &&
            this.validateNameContract(this.state.name, false) && this.validateTypeContract(this.state.contractType, false) ;
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
        const { name, contractType, startDate, endDate,
            errorOnNameContract, errorOnTypeContract, errorOnStartDate, errorOnEndDate } = this.state;
        return (
            <React.Fragment>
                <ButtonModal modalID={`modal-create-contract-${id}`} button_name={translate('modal.create')} title={translate('manage_employee.add_contract')} />
                <DialogModal
                    size='50' modalID={`modal-create-contract-${id}`} isLoading={false}
                    formID={`form-create-contract-${id}`}
                    title={translate('manage_employee.add_contract')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id={`form-create-contract-${id}`}>
                        <div className={`form-group ${errorOnNameContract === undefined ? "" : "has-error"}`}>
                            <label>{translate('manage_employee.name_contract')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="name" value={name} onChange={this.handleNameContract} autoComplete="off" />
                            <ErrorLabel content={errorOnNameContract} />
                        </div>
                        <div className={`form-group ${errorOnTypeContract === undefined ? "" : "has-error"}`}>
                            <label>{translate('manage_employee.type_contract')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="contractType" value={contractType} onChange={this.handleTypeContract} autoComplete="off" />
                            <ErrorLabel content={errorOnTypeContract} />
                        </div>
                        <div className="row">
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnStartDate === undefined ? "" : "has-error"}`}>
                                <label>{translate('manage_employee.start_date')}<span className="text-red">*</span></label>
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
const addModal = connect(null, null)(withTranslate(ContractAddModal));
export { addModal as ContractAddModal };
