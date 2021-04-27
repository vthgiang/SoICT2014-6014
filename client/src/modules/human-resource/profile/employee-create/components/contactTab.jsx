import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { ErrorLabel } from '../../../../../common-components';

import ValidationHelper from '../../../../../helpers/validationHelper';
function ContactTab(props) {

    const [state, setState] = useState({
        phoneNumber: ""
    });

    useEffect(() => {
        setState(state => {
            return {
                ...state,
                id: props.id,
                phoneNumber: props.employee ? props.employee.phoneNumber : "",
                phoneNumber2: props.employee ? props.employee.phoneNumber2 : "",
                personalEmail: props.employee ? props.employee.personalEmail : "",
                personalEmail2: props.employee ? props.employee.personalEmail2 : "",
                homePhone: props.employee ? props.employee.homePhone : "",
                emergencyContactPerson: props.employee ? props.employee.emergencyContactPerson : "",
                relationWithEmergencyContactPerson: props.employee ? props.employee.relationWithEmergencyContactPerson : "",
                emergencyContactPersonPhoneNumber: props.employee ? props.employee.emergencyContactPersonPhoneNumber : "",
                emergencyContactPersonEmail: props.employee ? props.employee.emergencyContactPersonEmail : "",
                emergencyContactPersonHomePhone: props.employee ? props.employee.emergencyContactPersonHomePhone : "",
                emergencyContactPersonAddress: props.employee ? props.employee.emergencyContactPersonAddress : "",
                permanentResidence: props.employee ? props.employee.permanentResidence : "",
                permanentResidenceCountry: props.employee ? props.employee.permanentResidenceCountry : "",
                permanentResidenceCity: props.employee ? props.employee.permanentResidenceCity : "",
                permanentResidenceDistrict: props.employee ? props.employee.permanentResidenceDistrict : "",
                permanentResidenceWard: props.employee ? props.employee.permanentResidenceWard : "",
                temporaryResidence: props.employee ? props.employee.temporaryResidence : "",
                temporaryResidenceCountry: props.employee ? props.employee.temporaryResidenceCountry : "",
                temporaryResidenceCity: props.employee ? props.employee.temporaryResidenceCity : "",
                temporaryResidenceDistrict: props.employee ? props.employee.temporaryResidenceDistrict : "",
                temporaryResidenceWard: props.employee ? props.employee.temporaryResidenceWard : "",

                errorOnPhoneNumber: undefined,
                errorOnTemporaryResidence: undefined,
                errorOnPersonalEmail: undefined,
                errorOnPersonalEmail2: undefined
            }
        })
    }, [props.id])

    const { translate } = props;
    const { id, phoneNumber2, phoneNumber, personalEmail, personalEmail2, homePhone, emergencyContactPerson,
        relationWithEmergencyContactPerson, emergencyContactPersonAddress, emergencyContactPersonPhoneNumber, emergencyContactPersonHomePhone, emergencyContactPersonEmail, permanentResidence,
        permanentResidenceWard, permanentResidenceDistrict, permanentResidenceCity, permanentResidenceCountry, temporaryResidence, temporaryResidenceWard, errorOnEmergencyContactPersonEmail,
        temporaryResidenceDistrict, temporaryResidenceCity, temporaryResidenceCountry, errorOnPhoneNumber, errorOnTemporaryResidence, errorOnPersonalEmail, errorOnPersonalEmail2 } = state;

    /** Function lưu các trường thông tin vào state */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setState(state => {
            return {
                ...state,
                [name]: value,
            }
        })
        props.handleChange(name, value);
    }

    /** Function bắt sự kiện thay đổi điện thoại đi động 1 */
    const handlePhoneChange = (e) => {
        const { value } = e.target;
        validatePhone(value, true);
    }

    const validatePhone = (value, willUpdateState = true) => {
        const { translate } = props;
        let { message } = ValidationHelper.validateEmpty(translate, value.toString());

        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    errorOnPhoneNumber: message,
                    phoneNumber: value,
                }
            });
            props.handleChange("phoneNumber", value);
        }
        return message === undefined;
    }

    /** Function bắt sự kiện thay đổi emailPersonal 1  */
    const handleEmail1Change = (e) => {
        const { value } = e.target;
        validateEmail1(value, true);
    }

    const validateEmail1 = (value, willUpdateState = true) => {
        const { translate } = props;
        let { message } = ValidationHelper.validateEmail(translate, value);

        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    errorOnPersonalEmail: (value && value.length !== 0) ? message : undefined,
                    personalEmail: value,
                }
            });
            props.handleChange("personalEmail", value);
        }
        return message === undefined;
    }

    /** Function bắt sự kiện thay đổi emailPersonal 2 */
    const handleEmail2Change = (e) => {
        const { value } = e.target;
        validateEmail2(value, true);
    }

    const validateEmail2 = (value, willUpdateState = true) => {
        const { translate } = props;
        let { message } = ValidationHelper.validateEmail(translate, value);

        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    errorOnPersonalEmail2: (value && value.length !== 0) ? message : undefined,
                    personalEmail2: value,
                }
            });
            props.handleChange("personalEmail2", value);
        }
        return message === undefined;
    }

    /** Function bắt sự kiện thay đổi email người liên hệ  */
    const handleEmergencyContactPersonEmailChange = (e) => {
        const { value } = e.target;
        validateEmergencyContactPersonEmail(value, true);
    }

    const validateEmergencyContactPersonEmail = (value, willUpdateState = true) => {
        const { translate } = props;
        let { message } = ValidationHelper.validateEmail(translate, value);

        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    errorOnEmergencyContactPersonEmail: (value && value.length !== 0) ? message : undefined,
                    emergencyContactPersonEmail: value,
                }
            });
            props.handleChange("emergencyContactPersonEmail", value);
        }
        return message === undefined;
    }

    /** Function bắt sự kiện thay đổi địa chỉ chỗ ở hiện tại */
    const handleNowAddressChange = (e) => {
        const { value } = e.target;
        validateAddress(value, true);
    }

    const validateAddress = (value, willUpdateState = true) => {
        const { translate } = props;
        let { message } = ValidationHelper.validateEmpty(translate, value);

        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    errorOnTemporaryResidence: message,
                    temporaryResidence: value,
                }
            });
            props.handleChange("temporaryResidence", value);
        }
        return message === undefined;
    }

    return (
        <div id={id} className="tab-pane">
            <div className="box-body">
                <div className="row">
                    {/* Điện thoại cá nhân 1 */}
                    <div className={`form-group col-md-4 ${errorOnPhoneNumber && "has-error"}`}>
                        <label >{translate('human_resource.profile.mobile_phone_1')}<span className="text-red">*</span></label>
                        <input type="number" className="form-control" name="phoneNumber" value={phoneNumber} onChange={handlePhoneChange} placeholder={translate('human_resource.profile.mobile_phone_1')} autoComplete="off" />
                        <ErrorLabel content={errorOnPhoneNumber} />
                    </div>
                    {/* Điện thoại cá nhân 2 */}
                    <div className="form-group col-md-4">
                        <label >{translate('human_resource.profile.mobile_phone_2')}</label>
                        <input type="number" className="form-control" name="phoneNumber2" value={phoneNumber2 ? phoneNumber2 : ''} onChange={handleChange} placeholder={translate('human_resource.profile.mobile_phone_2')} autoComplete="off" />
                    </div>
                </div>
                <div className="row">
                    {/* Email cá nhân 1 */}
                    <div className={`form-group col-md-4 ${errorOnPersonalEmail && "has-error"}`}>
                        <label >{translate('human_resource.profile.personal_email_1')}</label>
                        <input type="text" className="form-control" name="personalEmail" value={personalEmail ? personalEmail : ''} onChange={handleEmail1Change} placeholder={translate('human_resource.profile.personal_email_1')} autoComplete="off" />
                        <ErrorLabel content={errorOnPersonalEmail} />
                    </div>
                    {/* Email cá nhân 2 */}
                    <div className={`form-group col-md-4 ${errorOnPersonalEmail2 && "has-error"}`}>
                        <label >{translate('human_resource.profile.personal_email_2')}</label>
                        <input type="text" className="form-control" name="personalEmail2" value={personalEmail2 ? personalEmail2 : ''} onChange={handleEmail2Change} placeholder={translate('human_resource.profile.personal_email_2')} autoComplete="off" />
                        <ErrorLabel content={errorOnPersonalEmail2} />
                    </div>
                    {/* Điện thoại cố định */}
                    <div className="form-group col-md-4">
                        <label >{translate('human_resource.profile.home_phone')}</label>
                        <input type="text" className="form-control" name="homePhone" value={homePhone ? homePhone : ''} onChange={handleChange} placeholder={translate('human_resource.profile.home_phone')} autoComplete="off" />
                    </div>
                </div>
                {/* Liên hệ khẩn cấp */}
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border">
                        <h4 className="box-title">{translate('human_resource.profile.emergency_contact')}</h4>
                    </legend>
                    <div className="row">
                        {/* Tên người liên hệ */}
                        <div className="form-group col-md-4">
                            <label >{translate('human_resource.profile.full_name')}</label>
                            <input type="text" className="form-control" name="emergencyContactPerson" value={emergencyContactPerson ? emergencyContactPerson : ''} onChange={handleChange} placeholder={translate('human_resource.profile.full_name')} autoComplete="off" />
                        </div>
                        {/* Quan hệ */}
                        <div className="form-group col-md-4">
                            <label >{translate('human_resource.profile.nexus')}</label>
                            <input type="text" className="form-control" name="relationWithEmergencyContactPerson" value={relationWithEmergencyContactPerson ? relationWithEmergencyContactPerson : ''} onChange={handleChange} placeholder={translate('human_resource.profile.nexus')} autoComplete="off" />
                        </div>
                        {/* Địa chỉ */}
                        <div className="form-group col-md-4">
                            <label >{translate('human_resource.profile.address')}</label>
                            <input type="text" className="form-control" name="emergencyContactPersonAddress" value={emergencyContactPersonAddress ? emergencyContactPersonAddress : ''} onChange={handleChange} placeholder={translate('human_resource.profile.address')} autoComplete="off" />
                        </div>
                    </div>
                    <div className="row">
                        {/* Điện thoại di động */}
                        <div className="form-group col-md-4">
                            <label >{translate('human_resource.profile.mobile_phone')}</label>
                            <input type="text" className="form-control" name="emergencyContactPersonPhoneNumber" value={emergencyContactPersonPhoneNumber ? emergencyContactPersonPhoneNumber : ''} onChange={handleChange} placeholder={translate('human_resource.profile.mobile_phone')} autoComplete="off" />
                        </div>
                        {/* Điện thoại cố định */}
                        <div className="form-group col-md-4">
                            <label >{translate('human_resource.profile.home_phone')}</label>
                            <input type="text" className="form-control" name="emergencyContactPersonHomePhone" value={emergencyContactPersonHomePhone ? emergencyContactPersonHomePhone : ''} onChange={handleChange} placeholder={translate('human_resource.profile.home_phone')} autoComplete="off" />
                        </div>
                        {/* Email */}
                        <div className={`form-group col-md-4 ${errorOnEmergencyContactPersonEmail && "has-error"}`}>
                            <label >{translate('human_resource.profile.email')}</label>
                            <input type="text" className="form-control" name="emergencyContactPersonEmail" value={emergencyContactPersonEmail ? emergencyContactPersonEmail : ''} onChange={handleEmergencyContactPersonEmailChange} placeholder={translate('human_resource.profile.email')} autoComplete="off" />
                            <ErrorLabel content={errorOnEmergencyContactPersonEmail} />
                        </div>
                    </div>
                </fieldset>
                <div className="row">
                    <div className="col-md-6">
                        {/* Hộ khẩu thường trú */}
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border"><h4 className="box-title">{translate('human_resource.profile.permanent_address')}</h4></legend>
                            {/* Địa chỉ */}
                            <div className="form-group">
                                <label >{translate('human_resource.profile.address')}</label>
                                <input type="text" className="form-control " name="permanentResidence" value={permanentResidence ? permanentResidence : ''} onChange={handleChange} placeholder={translate('human_resource.profile.address')} autoComplete="off" />
                            </div>
                            {/* Xã/Phường */}
                            <div className="form-group">
                                <label >{translate('human_resource.profile.wards')}</label>
                                <input type="text" className="form-control " name="permanentResidenceWard" value={permanentResidenceWard ? permanentResidenceWard : ''} onChange={handleChange} placeholder={translate('human_resource.profile.wards')} autoComplete="off" />
                            </div>
                            {/* Huyện/Quận */}
                            <div className="form-group">
                                <label >{translate('human_resource.profile.district')}</label>
                                <input type="text" className="form-control " name="permanentResidenceDistrict" value={permanentResidenceDistrict ? permanentResidenceDistrict : ''} onChange={handleChange} placeholder={translate('human_resource.profile.district')} autoComplete="off" />
                            </div>
                            {/* Tỉnh/Thành phố */}
                            <div className="form-group">
                                <label >{translate('human_resource.profile.province')}</label>
                                <input type="text" className="form-control " name="permanentResidenceCity" value={permanentResidenceCity ? permanentResidenceCity : ''} onChange={handleChange} placeholder={translate('human_resource.profile.province')} autoComplete="off" />
                            </div>
                            {/* Quốc gia */}
                            <div className="form-group">
                                <label >{translate('human_resource.profile.nation')}</label>
                                <input type="text" className="form-control " name="permanentResidenceCountry" value={permanentResidenceCountry ? permanentResidenceCountry : ''} onChange={handleChange} placeholder={translate('human_resource.profile.nation')} autoComplete="off" />
                            </div>
                        </fieldset>
                    </div>
                    <div className="col-md-6">
                        {/* Chỗ ở hiện tại*/}
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border"><h4 className="box-title"> {translate('human_resource.profile.current_residence')}</h4></legend>
                            {/* Địa chỉ hiện tại */}
                            <div className={`form-group ${errorOnTemporaryResidence && "has-error"}`}>
                                <label >{translate('human_resource.profile.address')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control " name="temporaryResidence" value={temporaryResidence ? temporaryResidence : ''} onChange={handleNowAddressChange} placeholder={translate('human_resource.profile.address')} autoComplete="off" />
                                <ErrorLabel content={errorOnTemporaryResidence} />
                            </div>
                            {/* Xã/Phường */}
                            <div className="form-group">
                                <label >{translate('human_resource.profile.wards')}</label>
                                <input type="text" className="form-control " name="temporaryResidenceWard" value={temporaryResidenceWard ? temporaryResidenceWard : ''} onChange={handleChange} placeholder={translate('human_resource.profile.wards')} autoComplete="off" />
                            </div>
                            {/* Huyện/Quận */}
                            <div className="form-group">
                                <label >{translate('human_resource.profile.district')}</label>
                                <input type="text" className="form-control " name="temporaryResidenceDistrict" value={temporaryResidenceDistrict ? temporaryResidenceDistrict : ''} onChange={handleChange} placeholder={translate('human_resource.profile.district')} autoComplete="off" />
                            </div>
                            {/* Tỉnh/Thành phố */}
                            <div className="form-group">
                                <label >{translate('human_resource.profile.province')}</label>
                                <input type="text" className="form-control " name="temporaryResidenceCity" value={temporaryResidenceCity ? temporaryResidenceCity : ''} onChange={handleChange} placeholder={translate('human_resource.profile.province')} autoComplete="off" />
                            </div>
                            {/* Quốc gia */}
                            <div className="form-group">
                                <label >{translate('human_resource.profile.nation')}</label>
                                <input type="text" className="form-control " name="temporaryResidenceCountry" value={temporaryResidenceCountry ? temporaryResidenceCountry : ''} onChange={handleChange} placeholder={translate('human_resource.profile.nation')} autoComplete="off" />
                            </div>
                        </fieldset>
                    </div>
                </div>
            </div>
        </div >
    );
};

const contactTab = connect(null, null)(withTranslate(ContactTab));
export { contactTab as ContactTab };