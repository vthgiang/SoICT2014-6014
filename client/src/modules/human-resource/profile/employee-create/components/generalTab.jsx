import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DatePicker, ErrorLabel, SelectBox } from '../../../../../common-components';
import { EmployeeCreateValidator } from './employeeCreateValidator';
import { LOCAL_SERVER_API } from '../../../../../env';
import "./addEmployee.css";
class GeneralTab extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    // Function format dữ liệu Date thành string
    formatDate(date, monthYear = false) {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            if (monthYear === true) {
                return [month, year].join('-');
            } else return [day, month, year].join('-');
        } else {
            return date;
        }

    }

    // Function upload avatar 
    handleUpload = (e) => {
        var file = e.target.files[0];
        if (file !== undefined) {
            var fileLoad = new FileReader();
            fileLoad.readAsDataURL(file);
            fileLoad.onload = () => {
                this.setState({
                    img: fileLoad.result
                });
                this.props.handleUpload(fileLoad.result, file)
            };
        }
    }

    // Function lưu các trường thông tin vào state
    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value,
        })
        this.props.handleChange(name, value);
    }
    //Funtion bắt sự kiện thay đổi trạng thái làm việc
    handleChangeStatus = (value) => {
        this.setState({
            status: value[0]
        })
        this.props.handleChange('status', value[0]);
    }

    // Funtion bắt sự kiện thay đổi giới tính
    handleGenderChange = (e) => {
        const { value } = e.target;
        this.setState({
            gender: value,
        })
        this.props.handleChange('gender', value);
    }

    // Funtion bắt sự kiện thay đổi tình trạng quan hệ
    handleMaritalStatusChange = (e) => {
        const { value } = e.target;
        this.setState({
            maritalStatus: value,
        })
        this.props.handleChange('maritalStatus', value);
    }

    // Function bắt sự kiện thay đổi mã nhân viên
    handleMSNVChange = (e) => {
        const { value } = e.target;
        this.validateEmployeeNumber(value, true);
    }
    validateEmployeeNumber = (value, willUpdateState = true) => {
        let msg = EmployeeCreateValidator.validateEmployeeNumber(value, this.props.translate)
        if (willUpdateState) {
            this.setState({
                errorOnEmployeeNumber: msg,
                employeeNumber: value,
            });
            this.props.handleChange("employeeNumber", value);
        }
        return msg === undefined;
    }

    // Function bắt sự kiện thay đổi mã chấm công
    handleMSCCChange = (e) => {
        const { value } = e.target;
        this.validateMSCC(value, true);
    }
    validateMSCC = (value, willUpdateState = true) => {
        let msg = EmployeeCreateValidator.validateMSCC(value, this.props.translate)
        if (willUpdateState) {

            this.setState(state => {
                return {
                    ...state,
                    errorOnMSCC: msg,
                    employeeTimesheetId: value,
                }
            });
            this.props.handleChange("employeeTimesheetId", value);
        }
        return msg === undefined;
    }

    // Function bắt sự kiện thay đổi Họ và tên
    handleFullNameChange = (e) => {
        const { value } = e.target;
        this.validateFullName(value, true);
    }
    validateFullName = (value, willUpdateState = true) => {
        let msg = EmployeeCreateValidator.validateFullName(value, this.props.translate)
        if (willUpdateState) {

            this.setState(state => {
                return {
                    ...state,
                    errorOnFullName: msg,
                    fullName: value,
                }
            });
            this.props.handleChange("fullName", value);
        }
        return msg === undefined;
    }

    // Function bắt sự kiện thay đổi Email công ty
    handleEmailCompanyChange = (e) => {
        const { value } = e.target;
        this.validateEmailCompany(value, true);
    }
    validateEmailCompany = (value, willUpdateState = true) => {
        let msg = EmployeeCreateValidator.validateEmailCompany(value, this.props.translate)
        if (willUpdateState) {

            this.setState(state => {
                return {
                    ...state,
                    errorOnEmailCompany: msg,
                    emailInCompany: value,
                }
            });
            this.props.handleChange("emailInCompany", value);
        }
        return msg === undefined;
    }

    // Function bắt sự kiện thay đổi số CMND
    handleCMNDChange = (e) => {
        const { value } = e.target;
        this.validateCMND(value, true);
    }
    validateCMND = (value, willUpdateState = true) => {
        let msg = EmployeeCreateValidator.validateCMND(value, this.props.translate)
        if (willUpdateState) {

            this.setState(state => {
                return {
                    ...state,
                    errorOnCMND: msg,
                    identityCardNumber: value,
                }
            });
            this.props.handleChange("identityCardNumber", value);
        }
        return msg === undefined;
    }

    // Function bắt sự kiện thay đổi nơi cấp
    handleAddressCMNDChange = (e) => {
        const { value } = e.target;
        this.validateAddressCMND(value, true);
    }
    validateAddressCMND = (value, willUpdateState = true) => {
        let msg = EmployeeCreateValidator.validateAddressCMND(value, this.props.translate)
        if (willUpdateState) {

            this.setState(state => {
                return {
                    ...state,
                    errorOnAddressCMND: msg,
                    identityCardAddress: value,
                }
            });
            this.props.handleChange("identityCardAddress", value);
        }
        return msg === undefined;
    }

    // Function bắt sự kiện thay đổi ngày sinh
    handleBrithdayChange = (value) => {
        this.validateBrithday(value, true)
    }
    validateBrithday = (value, willUpdateState = true) => {
        let msg = EmployeeCreateValidator.validateBrithday(value, this.props.translate)
        if (willUpdateState) {

            this.setState(state => {
                return {
                    ...state,
                    errorOnBrithdate: msg,
                    birthdate: value,
                }
            });
            this.props.handleChange("birthdate", value);
        }
        return msg === undefined;
    }

    // Function bắt sự kiện thay đổi ngày bắt đầu làm việc
    handleStartingDateChange = (value) => {
        this.validateStartingDate(value, true)
    }
    validateStartingDate = (value, willUpdateState = true) => {
        let msg = EmployeeCreateValidator.validateStartingDate(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnStartingDate: msg,
                    startingDate: value,
                }
            });
            this.props.handleChange("startingDate", value);
        }
        return msg === undefined;
    }

    // Function bắt sự kiện thay đổi ngày nghỉ việc
    handleLeavingDateChange = (value) => {
        this.setState({
            leavingDate: value
        });
        this.props.handleChange("leavingDate", value);
    }

    // Function bắt sự kiện thay đổi ngày cấp CMND
    handleDateCMNDChange = (value) => {
        this.validateCMNDDate(value, true);
    }

    validateCMNDDate = (value, willUpdateState = true) => {
        let msg = EmployeeCreateValidator.validateCMNDDate(value, this.props.translate)
        if (willUpdateState) {

            this.setState(state => {
                return {
                    ...state,
                    errorOnDateCMND: msg,
                    identityCardDate: value,
                }
            });
            this.props.handleChange("identityCardDate", value);
        }
        return msg === undefined;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                img: nextProps.img,
                employeeNumber: nextProps.employee.employeeNumber,
                employeeTimesheetId: nextProps.employee.employeeTimesheetId,
                fullName: nextProps.employee.fullName,
                gender: nextProps.employee.gender,
                birthdate: nextProps.employee.birthdate,
                birthplace: nextProps.employee.birthplace,
                emailInCompany: nextProps.employee.emailInCompany,
                maritalStatus: nextProps.employee.maritalStatus,
                identityCardNumber: nextProps.employee.identityCardNumber,
                identityCardDate: nextProps.employee.identityCardDate,
                identityCardAddress: nextProps.employee.identityCardAddress,
                ethnic: nextProps.employee.ethnic,
                religion: nextProps.employee.religion,
                nationality: nextProps.employee.nationality,
                status: nextProps.employee.status,
                startingDate: nextProps.employee.startingDate,
                leavingDate: nextProps.employee.leavingDate,

                errorOnBrithdate: undefined,
                errorOnDateCMND: undefined,
                errorOnEmployeeNumber: undefined,
                errorOnMSCC: undefined,
                errorOnFullName: undefined,
                errorOnEmailCompany: undefined,
                errorOnCMND: undefined,
                errorOnAddressCMND: undefined,
                errorOnStartingDate: undefined,
            }
        } else {
            return null;
        }
    }

    render() {
        const { id, translate } = this.props;
        const { birthdate, identityCardDate, img, employeeNumber, employeeTimesheetId, fullName, gender, birthplace, status,
            startingDate, leavingDate, emailInCompany, maritalStatus, identityCardNumber, identityCardAddress, ethnic, religion, nationality,
            errorOnBrithdate, errorOnDateCMND, errorOnEmployeeNumber, errorOnMSCC, errorOnFullName, errorOnEmailCompany, errorOnStartingDate,
            errorOnCMND, errorOnAddressCMND } = this.state;
        return (
            <div id={id} className="tab-pane active">
                <div className="row box-body">
                    <div className="col-lg-4 col-md-4 col-ms-12 col-xs-12" style={{ textAlign: 'center' }}>
                        <div>
                            <a href={img} target="_blank">
                                <img className="attachment-img avarta" src={img} alt="Attachment" />
                            </a>
                        </div>
                        <div className="upload btn btn-default ">
                            {translate('manage_employee.upload')}
                            <input className="upload" type="file" name="file" onChange={this.handleUpload} />
                        </div>
                    </div>
                    <div className="pull-right col-lg-8 col-md-8 col-ms-12  ">
                        {
                            id === 'page_general' &&
                            <div className="row col-lg-12 col-md-12 col-ms-12 col-xs-12">
                                <p >(<span className="text-red">*</span>): <span className="text-red">{translate('modal.note')}</span></p>
                            </div>
                        }

                        <div className="row">
                            <div className={`form-group col-lg-6 col-md-6 col-ms-12 col-xs-12 ${errorOnEmployeeNumber === undefined ? "" : "has-error"}`}>
                                <label>{translate('manage_employee.staff_number')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="employeeNumber" value={employeeNumber} autoComplete="off" placeholder={translate('manage_employee.staff_number')} onChange={this.handleMSNVChange} />
                                <ErrorLabel content={errorOnEmployeeNumber} />
                            </div>
                            <div className={`form-group col-lg-6 col-md-6 col-ms-12 col-xs-12 ${errorOnMSCC === undefined ? "" : "has-error"}`}>
                                <label htmlFor="MSCC">{translate('manage_employee.attendance_code')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" placeholder={translate('manage_employee.attendance_code')} name="employeeTimesheetId" value={employeeTimesheetId} onChange={this.handleMSCCChange} autoComplete="off" />
                                <ErrorLabel content={errorOnMSCC} />
                            </div>
                        </div>
                        <div className="row">
                            <div className={`form-group col-lg-6 col-md-6 col-ms-12 col-xs-12 ${errorOnFullName === undefined ? "" : "has-error"}`}>
                                <label htmlFor="fullname">{translate('manage_employee.full_name')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="fullName" value={fullName} placeholder={translate('manage_employee.full_name')} onChange={this.handleFullNameChange} autoComplete="off" />
                                <ErrorLabel content={errorOnFullName} />
                            </div>
                            <div className="form-group col-lg-6 col-md-6 col-ms-12 col-xs-12">
                                <label>{translate('manage_employee.gender')}<span className="text-red">*</span></label>
                                <div>
                                    <div className="radio-inline">
                                        <label>
                                            <input type="radio" name={`gender${id}`} value="male" onChange={this.handleGenderChange}
                                                checked={gender === "male" ? true : false} />{translate('manage_employee.male')}</label>
                                    </div>
                                    <div className="radio-inline">
                                        <label>
                                            <input type="radio" name={`gender${id}`} value="female" onChange={this.handleGenderChange}
                                                checked={gender === "female" ? true : false} />{translate('manage_employee.female')}</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className={`form-group col-lg-6 col-md-6 col-ms-12 col-xs-12 ${errorOnBrithdate === undefined ? "" : "has-error"}`}>
                                <label >{translate('manage_employee.date_birth')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`brithday${id}`}
                                    value={this.formatDate(birthdate)}
                                    onChange={this.handleBrithdayChange}
                                />
                                <ErrorLabel content={errorOnBrithdate} />
                            </div>
                            <div className="form-group col-lg-6 col-md-6 col-ms-12 col-xs-12">
                                <label htmlFor="birthplace">{translate('manage_employee.place_birth')}</label>
                                <input type="text" className="form-control" name="birthplace" value={birthplace} onChange={this.handleChange} placeholder={translate('manage_employee.place_birth')} autoComplete="off" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-lg-6 col-md-6 col-ms-12 col-xs-12">
                                <label>Trạng thái</label>
                                <SelectBox
                                    id={`status${id}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={status}
                                    items={[{ value: 'active', text: 'Đang làm việc' }, { value: 'leave', text: 'Đã nghỉ làm' }]}
                                    onChange={this.handleChangeStatus}
                                />
                            </div>
                            <div className="form-group col-lg-6 col-md-6 col-ms-12 col-xs-12">
                                <label>{translate('manage_employee.relationship')}</label>
                                <div>
                                    <div className="radio-inline">
                                        <label>
                                            <input type="radio" name={`maritalStatus${id}`} value="single" onChange={this.handleMaritalStatusChange} checked={maritalStatus === "single" ? true : false} />{translate('manage_employee.single')}</label>
                                    </div>
                                    <div className="radio-inline">
                                        <label>
                                            <input type="radio" name={`maritalStatus${id}`} value="married" onChange={this.handleMaritalStatusChange} checked={maritalStatus === "married" ? true : false} />{translate('manage_employee.married')}</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="form-group col-lg-12 col-md-12 col-ms-12 col-xs-12">
                        <div className="row">
                            <div className={`form-group col-lg-4 col-md-4 col-ms-12 col-xs-12 ${errorOnEmailCompany === undefined ? "" : "has-error"}`}>
                                <label htmlFor="emailCompany">{translate('manage_employee.email')}<span className="text-red">*</span></label>
                                <input type="email" className="form-control" placeholder={translate('manage_employee.email_company')} name="emailInCompany" value={emailInCompany} onChange={this.handleEmailCompanyChange} autoComplete="off" />
                                <ErrorLabel content={errorOnEmailCompany} />
                            </div>
                            <div className={`form-group col-lg-4 col-md-4 col-ms-12 col-xs-12 ${errorOnStartingDate === undefined ? "" : "has-error"}`}>
                                <label >Ngày bắt đầu làm việc<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`startingDate${id}`}
                                    value={this.formatDate(startingDate)}
                                    onChange={this.handleStartingDateChange}
                                />
                                <ErrorLabel content={errorOnStartingDate} />
                            </div>
                            <div className="form-group col-lg-4 col-md-4 col-ms-12 col-xs-12">
                                <label >Ngày nghỉ việc</label>
                                <DatePicker
                                    id={`leavingDate${id}`}
                                    value={this.formatDate(leavingDate)}
                                    onChange={this.handleLeavingDateChange}
                                />
                                <ErrorLabel content={errorOnBrithdate} />
                            </div>
                        </div>
                        <div className="row">
                            <div className={`form-group col-lg-4 col-md-4 col-ms-12 col-xs-12 ${errorOnCMND === undefined ? "" : "has-error"}`}>
                                <label htmlFor="CMND">{translate('manage_employee.id_card')}<span className="text-red">*</span></label>
                                <input type="number" className="form-control" name="identityCardNumber" value={identityCardNumber} onChange={this.handleCMNDChange} placeholder={translate('manage_employee.id_card')} autoComplete="off" />
                                <ErrorLabel content={errorOnCMND} />
                            </div>
                            <div className={`form-group col-lg-4 col-md-4 col-ms-12 col-xs-12 ${errorOnDateCMND === undefined ? "" : "has-error"}`}>
                                <label >{translate('manage_employee.date_issued')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`dateCMND${id}`}
                                    value={this.formatDate(identityCardDate)}
                                    onChange={this.handleDateCMNDChange}
                                />
                                <ErrorLabel content={errorOnDateCMND} />
                            </div>
                            <div className={`form-group col-lg-4 col-md-4 col-ms-12 col-xs-12 ${errorOnAddressCMND === undefined ? "" : "has-error"}`}>
                                <label htmlFor="addressCMND">{translate('manage_employee.issued_by')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="identityCardAddress" value={identityCardAddress} onChange={this.handleAddressCMNDChange} placeholder={translate('manage_employee.issued_by')} autoComplete="off" />
                                <ErrorLabel content={errorOnAddressCMND} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-lg-4 col-md-4 col-ms-12 col-xs-12">
                                <label htmlFor="national">{translate('manage_employee.ethnic')}</label>
                                <input type="text" className="form-control" name="ethnic" value={ethnic} onChange={this.handleChange} placeholder={translate('manage_employee.ethnic')} autoComplete="off" />
                            </div>
                            <div className="form-group col-lg-4 col-md-4 col-ms-12 col-xs-12">
                                <label htmlFor="religion">{translate('manage_employee.religion')}</label>
                                <input type="text" className="form-control" name="religion" value={religion} onChange={this.handleChange} placeholder={translate('manage_employee.religion')} autoComplete="off" />
                            </div>
                            <div className="form-group col-lg-4 col-md-4 col-ms-12 col-xs-12">
                                <label htmlFor="nation">{translate('manage_employee.nationality')}</label>
                                <input type="text" className="form-control" name="nationality" value={nationality} onChange={this.handleChange} placeholder={translate('manage_employee.nationality')} autoComplete="off" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};
const generalTab = connect(null, null)(withTranslate(GeneralTab));
export { generalTab as GeneralTab };