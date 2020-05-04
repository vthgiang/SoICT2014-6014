import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ErrorLabel } from '../../../../../common-components';
import { EmployeeCreateValidator } from './employeeCreateValidator';

class ContactTab extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    // Function lưu các trường thông tin vào state
    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value,
        })
        this.props.handleChange(name, value);
    }
    // Function bắt sự kiện thay đổi điện thoại đi động 1
    handlePhoneChange = (e) => {
        const { value } = e.target;
        this.validatePhone(value, true);
    }
    validatePhone = (value, willUpdateState = true) => {
        let msg = EmployeeCreateValidator.validatePhone(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnPhoneNumber: msg,
                    phoneNumber: value,
                }
            });
            this.props.handleChange("phoneNumber", value);
        }
        return msg === undefined;
    }
    // Function bắt sự kiện thay đổi emailPersonal 1
    handleEmail1Change = (e) => {
        const { value } = e.target;
        this.validateEmail1(value, true);
    }
    validateEmail1 = (value, willUpdateState = true) => {
        let msg = EmployeeCreateValidator.validateEmail(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnPersonalEmail: msg,
                    personalEmail: value,
                }
            });
            this.props.handleChange("personalEmail", value);
        }
        return msg === undefined;
    }
    // Function bắt sự kiện thay đổi emailPersonal 1
    handleEmail2Change = (e) => {
        const { value } = e.target;
        this.validateEmail2(value, true);
    }
    validateEmail2 = (value, willUpdateState = true) => {
        let msg = EmployeeCreateValidator.validateEmail(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnPersonalEmail2: msg,
                    personalEmail2: value,
                }
            });
            this.props.handleChange("personalEmail2", value);
        }
        return msg === undefined;
    }
    // Function bắt sự kiện thay đổi địa chỉ chỗ ở hiện tại
    handleNowAddressChange = (e) => {
        const { value } = e.target;
        this.validateAddress(value, true);
    }
    validateAddress = (value, willUpdateState = true) => {
        let msg = EmployeeCreateValidator.validateAddress(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnTemporaryResidence: msg,
                    temporaryResidence: value,
                }
            });
            this.props.handleChange("temporaryResidence", value);
        }
        return msg === undefined;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                phoneNumber: nextProps.employee.phoneNumber,
                phoneNumber2: nextProps.employee.phoneNumber2,
                personalEmail: nextProps.employee.personalEmail,
                personalEmail2: nextProps.employee.personalEmail2,
                homePhone: nextProps.employee.homePhone,
                emergencyContactPerson: nextProps.employee.emergencyContactPerson,
                relationWithEmergencyContactPerson: nextProps.employee.relationWithEmergencyContactPerson,
                emergencyContactPersonPhoneNumber: nextProps.employee.emergencyContactPersonPhoneNumber,
                emergencyContactPersonEmail: nextProps.employee.emergencyContactPersonEmail,
                emergencyContactPersonHomePhone: nextProps.employee.emergencyContactPersonHomePhone,
                emergencyContactPersonAddress: nextProps.employee.emergencyContactPersonAddress,
                permanentResidence: nextProps.employee.permanentResidence,
                permanentResidenceCountry: nextProps.employee.permanentResidenceCountry,
                permanentResidenceCity: nextProps.employee.permanentResidenceCity,
                permanentResidenceDistrict: nextProps.employee.permanentResidenceDistrict,
                permanentResidenceWard: nextProps.employee.permanentResidenceWard,
                temporaryResidence: nextProps.employee.temporaryResidence,
                temporaryResidenceCountry: nextProps.employee.temporaryResidenceCountry,
                temporaryResidenceCity: nextProps.employee.temporaryResidenceCity,
                temporaryResidenceDistrict: nextProps.employee.temporaryResidenceDistrict,
                temporaryResidenceWard: nextProps.employee.temporaryResidenceWard,

                errorOnPhoneNumber: undefined,
                errorOnTemporaryResidence: undefined,
                errorOnPersonalEmail: undefined,
                errorOnPersonalEmail2: undefined
            }
        } else {
            return null;
        }
    }

    render() {
        const { id, translate } = this.props;
        const { phoneNumber2, phoneNumber, personalEmail, personalEmail2, homePhone, emergencyContactPerson,
            relationWithEmergencyContactPerson, emergencyContactPersonAddress, emergencyContactPersonPhoneNumber, emergencyContactPersonHomePhone, emergencyContactPersonEmail, permanentResidence,
            permanentResidenceWard, permanentResidenceDistrict, permanentResidenceCity, permanentResidenceCountry, temporaryResidence, temporaryResidenceWard,
            temporaryResidenceDistrict, temporaryResidenceCity, temporaryResidenceCountry, errorOnPhoneNumber, errorOnTemporaryResidence, errorOnPersonalEmail, errorOnPersonalEmail2 } = this.state;
        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    <div className="row">
                        <div className={`form-group col-md-4 ${errorOnPhoneNumber === undefined ? "" : "has-error"}`}>
                            <label >{translate('manage_employee.mobile_phone_1')}<span className="text-red">*</span></label>
                            <input type="number" className="form-control" name="phoneNumber" value={phoneNumber} onChange={this.handlePhoneChange} placeholder={translate('manage_employee.mobile_phone_1')} autoComplete="off" />
                            <ErrorLabel content={errorOnPhoneNumber} />
                        </div>
                        <div className="form-group col-md-4">
                            <label >{translate('manage_employee.mobile_phone_2')}</label>
                            <input type="number" className="form-control" name="phoneNumber2" value={phoneNumber2} onChange={this.handleChange} placeholder={translate('manage_employee.mobile_phone_2')} autoComplete="off" />
                        </div>
                    </div>
                    <div className="row">
                        <div className={`form-group col-md-4 ${errorOnPersonalEmail === undefined ? "" : "has-error"}`}>
                            <label >{translate('manage_employee.personal_email_1')}</label>
                            <input type="text" className="form-control" name="personalEmail" value={personalEmail} onChange={this.handleEmail1Change} placeholder={translate('manage_employee.personal_email_1')} autoComplete="off" />
                            <ErrorLabel content={errorOnPersonalEmail} />
                        </div>
                        <div className={`form-group col-md-4 ${errorOnPersonalEmail2 === undefined ? "" : "has-error"}`}>
                            <label >{translate('manage_employee.personal_email_2')}</label>
                            <input type="text" className="form-control" name="personalEmail2" value={personalEmail2} onChange={this.handleEmail2Change} placeholder={translate('manage_employee.personal_email_2')} autoComplete="off" />
                            <ErrorLabel content={errorOnPersonalEmail2} />
                        </div>
                        <div className="form-group col-md-4">
                            <label >{translate('manage_employee.home_phone')}</label>
                            <input type="text" className="form-control" name="homePhone" value={homePhone} onChange={this.handleChange} placeholder={translate('manage_employee.home_phone')} autoComplete="off" />
                        </div>
                    </div>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">
                            <h4 className="box-title">{translate('manage_employee.emergency_contact')}</h4>
                        </legend>
                        <div className="row">
                            <div className="form-group col-md-4">
                                <label >{translate('manage_employee.full_name')}</label>
                                <input type="text" className="form-control" name="emergencyContactPerson" value={emergencyContactPerson} onChange={this.handleChange} placeholder={translate('manage_employee.full_name')} autoComplete="off" />
                            </div>

                            <div className="form-group col-md-4">
                                <label >{translate('manage_employee.nexus')}</label>
                                <input type="text" className="form-control" name="relationWithEmergencyContactPerson" value={relationWithEmergencyContactPerson} onChange={this.handleChange} placeholder={translate('manage_employee.nexus')} autoComplete="off" />
                            </div>
                            <div className="form-group col-md-4">
                                <label >{translate('manage_employee.address')}</label>
                                <input type="text" className="form-control" name="emergencyContactPersonAddress" value={emergencyContactPersonAddress} onChange={this.handleChange} placeholder={translate('manage_employee.address')} autoComplete="off" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-md-4">
                                <label >{translate('manage_employee.mobile_phone')}</label>
                                <input type="text" className="form-control" name="emergencyContactPersonPhoneNumber" value={emergencyContactPersonPhoneNumber} onChange={this.handleChange} placeholder={translate('manage_employee.mobile_phone')} autoComplete="off" />
                            </div>
                            <div className="form-group col-md-4">
                                <label >{translate('manage_employee.home_phone')}</label>
                                <input type="text" className="form-control" name="emergencyContactPersonHomePhone" value={emergencyContactPersonHomePhone} onChange={this.handleChange} placeholder={translate('manage_employee.home_phone')} autoComplete="off" />
                            </div>

                            <div className="form-group col-md-4">
                                <label >{translate('manage_employee.email')}</label>
                                <input type="text" className="form-control" name="emergencyContactPersonEmail" value={emergencyContactPersonEmail} onChange={this.handleChange} placeholder={translate('manage_employee.email')} autoComplete="off" />
                            </div>
                        </div>
                    </fieldset>
                    <div className="row">
                        <div className="col-md-6">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border"><h4 className="box-title">{translate('manage_employee.permanent_address')}</h4></legend>
                                <div className="form-group">
                                    <label >{translate('manage_employee.address')}</label>
                                    <input type="text" className="form-control " name="permanentResidence" value={permanentResidence} onChange={this.handleChange} placeholder={translate('manage_employee.address')} autoComplete="off" />
                                </div>
                                <div className="form-group">
                                    <label >{translate('manage_employee.wards')}</label>
                                    <input type="text" className="form-control " name="permanentResidenceWard" value={permanentResidenceWard} onChange={this.handleChange} placeholder={translate('manage_employee.wards')} autoComplete="off" />
                                </div>
                                <div className="form-group">
                                    <label >{translate('manage_employee.district')}</label>
                                    <input type="text" className="form-control " name="permanentResidenceDistrict" value={permanentResidenceDistrict} onChange={this.handleChange} placeholder={translate('manage_employee.district')} autoComplete="off" />
                                </div>
                                <div className="form-group">
                                    <label >{translate('manage_employee.province')}</label>
                                    <input type="text" className="form-control " name="permanentResidenceCity" value={permanentResidenceCity} onChange={this.handleChange} placeholder={translate('manage_employee.province')} autoComplete="off" />
                                </div>
                                <div className="form-group">
                                    <label >{translate('manage_employee.nation')}</label>
                                    <input type="text" className="form-control " name="permanentResidenceCountry" value={permanentResidenceCountry} onChange={this.handleChange} placeholder={translate('manage_employee.nation')} autoComplete="off" />
                                </div>
                            </fieldset>

                        </div>
                        <div className="col-md-6">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border"><h4 className="box-title"> {translate('manage_employee.current_residence')}</h4></legend>
                                <div className={`form-group ${errorOnTemporaryResidence === undefined ? "" : "has-error"}`}>
                                    <label >{translate('manage_employee.address')}<span className="text-red">*</span></label>
                                    <input type="text" className="form-control " name="temporaryResidence" value={temporaryResidence} onChange={this.handleNowAddressChange} placeholder={translate('manage_employee.address')} autoComplete="off" />
                                    <ErrorLabel content={errorOnTemporaryResidence} />
                                </div>
                                <div className="form-group">
                                    <label >{translate('manage_employee.wards')}</label>
                                    <input type="text" className="form-control " name="temporaryResidenceWard" value={temporaryResidenceWard} onChange={this.handleChange} placeholder={translate('manage_employee.wards')} autoComplete="off" />
                                </div>
                                <div className="form-group">
                                    <label >{translate('manage_employee.district')}</label>
                                    <input type="text" className="form-control " name="temporaryResidenceDistrict" value={temporaryResidenceDistrict} onChange={this.handleChange} placeholder={translate('manage_employee.district')} autoComplete="off" />
                                </div>
                                <div className="form-group">
                                    <label >{translate('manage_employee.province')}</label>
                                    <input type="text" className="form-control " name="temporaryResidenceCity" value={temporaryResidenceCity} onChange={this.handleChange} placeholder={translate('manage_employee.province')} autoComplete="off" />
                                </div>
                                <div className="form-group">
                                    <label >{translate('manage_employee.nation')}</label>
                                    <input type="text" className="form-control " name="temporaryResidenceCountry" value={temporaryResidenceCountry} onChange={this.handleChange} placeholder={translate('manage_employee.nation')} autoComplete="off" />
                                </div>
                            </fieldset>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
};
const contactTab = connect(null, null)(withTranslate(ContactTab));
export { contactTab as ContactTab };