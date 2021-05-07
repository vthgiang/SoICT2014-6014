import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

function ContactTab(props) {
    const [state, setState] = useState({

    })

    useEffect(() => {
        setState(state => {
            return {
                ...state,
                id: props.id,
                phoneNumber: props.employee.phoneNumber,
                phoneNumber2: props.employee.phoneNumber2,
                personalEmail: props.employee.personalEmail,
                personalEmail2: props.employee.personalEmail2,
                homePhone: props.employee.homePhone,
                emergencyContactPerson: props.employee.emergencyContactPerson,
                relationWithEmergencyContactPerson: props.employee.relationWithEmergencyContactPerson,
                emergencyContactPersonAddress: props.employee.emergencyContactPersonAddress,
                emergencyContactPersonPhoneNumber: props.employee.emergencyContactPersonPhoneNumber,
                emergencyContactPersonHomePhone: props.employee.emergencyContactPersonHomePhone,
                emergencyContactPersonEmail: props.employee.emergencyContactPersonEmail,
                permanentResidence: props.employee.permanentResidence,
                permanentResidenceCountry: props.employee.permanentResidenceCountry,
                permanentResidenceCity: props.employee.permanentResidenceCity,
                permanentResidenceDistrict: props.employee.permanentResidenceDistrict,
                permanentResidenceWard: props.employee.permanentResidenceWard,
                temporaryResidence: props.employee.temporaryResidence,
                temporaryResidenceCountry: props.employee.temporaryResidenceCountry,
                temporaryResidenceCity: props.employee.temporaryResidenceCity,
                temporaryResidenceDistrict: props.employee.temporaryResidenceDistrict,
                temporaryResidenceWard: props.employee.temporaryResidenceWard,
            }
        })
    }, [props.id])

    const { translate } = props;

    const { id, phoneNumber2, phoneNumber, personalEmail, personalEmail2, homePhone, emergencyContactPerson,
        relationWithEmergencyContactPerson, emergencyContactPersonAddress, emergencyContactPersonPhoneNumber,
        emergencyContactPersonHomePhone, emergencyContactPersonEmail, permanentResidence,
        permanentResidenceWard, permanentResidenceDistrict, permanentResidenceCity, permanentResidenceCountry,
        temporaryResidence, temporaryResidenceWard, temporaryResidenceDistrict,
        temporaryResidenceCity, temporaryResidenceCountry } = state;

    return (
        <div id={id} className="tab-pane">
            <div className="box-body">
                <div className="row">
                    {/* Số điện thoại di động 1 */}
                    <div className="form-group col-md-4">
                        <strong>{translate('human_resource.profile.mobile_phone_1')}&emsp; </strong>
                        {phoneNumber ? "0" + phoneNumber : ""}
                    </div>
                    {/* Số điện thoại di động 2 */}
                    <div className="form-group col-md-4">
                        <strong>{translate('human_resource.profile.mobile_phone_2')}&emsp; </strong>
                        {phoneNumber2 ? "0" + phoneNumber2 : ""}
                    </div>
                </div>
                <div className="row">
                    {/* Email cá nhân */}
                    <div className="form-group col-md-4">
                        <strong>{translate('human_resource.profile.personal_email_1')}&emsp; </strong>
                        {personalEmail}
                    </div>
                    {/* Email cá nhân 2 */}
                    <div className="form-group col-md-4">
                        <strong>{translate('human_resource.profile.personal_email_2')}&emsp; </strong>
                        {personalEmail2}
                    </div>
                    {/* Số điện thoại cố định */}
                    <div className="form-group col-md-4">
                        <strong>{translate('human_resource.profile.home_phone')}&emsp; </strong>
                        {homePhone ? "0" + homePhone : ""}
                    </div>
                </div>
                {/* Thông tin liên hệ khẩn cấp */}
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border"><h4 className="box-title">{translate('human_resource.profile.emergency_contact')}</h4></legend>
                    <div className="row">
                        {/* Họ tên */}
                        <div className="form-group col-md-4">
                            <strong>{translate('human_resource.profile.full_name')}&emsp; </strong>
                            {emergencyContactPerson}
                        </div>
                        {/* Quan hệ */}
                        <div className="form-group col-md-4">
                            <strong>{translate('human_resource.profile.nexus')}&emsp; </strong>
                            {relationWithEmergencyContactPerson}
                        </div>
                        {/* Địa chỉ */}
                        <div className="form-group col-md-4">
                            <strong>{translate('human_resource.profile.address')}&emsp; </strong>
                            {emergencyContactPersonAddress}
                        </div>
                    </div>
                    <div className="row">
                        {/* Điện thoại di động*/}
                        <div className="form-group col-md-4">
                            <strong>{translate('human_resource.profile.mobile_phone')}&emsp; </strong>
                            {emergencyContactPersonPhoneNumber ? "0" + emergencyContactPersonPhoneNumber : ""}
                        </div>
                        {/* Điện thoại cố định */}
                        <div className="form-group col-md-4">
                            <strong>{translate('human_resource.profile.home_phone')}&emsp; </strong>
                            {emergencyContactPersonHomePhone ? "0" + homePhone : ""}
                        </div>
                        {/* Email */}
                        <div className="form-group col-md-4">
                            <strong>{translate('human_resource.profile.email')}&emsp; </strong>
                            {emergencyContactPersonEmail}
                        </div>
                    </div>
                </fieldset>
                <div className="row">
                    <div className="col-md-6">
                        {/* Hộ khẩu thường trú */}
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border"><h4 className="box-title">{translate('human_resource.profile.permanent_address')}</h4></legend>
                            {/* Địa chỉ */}
                            <div className="form-group" >
                                <strong>{translate('human_resource.profile.address')}&emsp; </strong>
                                {permanentResidence}
                            </div>
                            {/* Quốc gia  */}
                            <div className="form-group" >
                                <strong>{translate('human_resource.profile.nation')}&emsp; </strong>
                                {permanentResidenceCountry}
                            </div>
                            {/* Tỉnh/ Thành phố */}
                            <div className="form-group" >
                                <strong>{translate('human_resource.profile.province')}&emsp; </strong>
                                {permanentResidenceCity}
                            </div>
                            {/* Quận / Huyện/  */}
                            <div className="form-group" >
                                <strong>{translate('human_resource.profile.district')}&emsp; </strong>
                                {permanentResidenceDistrict}
                            </div>
                            {/* Xã/ Phường */}
                            <div className="form-group" >
                                <strong>{translate('human_resource.profile.wards')}&emsp; </strong>
                                {permanentResidenceWard}
                            </div>
                        </fieldset>
                    </div>
                    <div className="col-md-6">
                        {/* Chỗ ở hiện tại */}
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border"><h4 className="box-title">{translate('human_resource.profile.current_residence')}</h4></legend>
                            {/* Địa chỉ */}
                            <div className="form-group" >
                                <strong>{translate('human_resource.profile.address')}&emsp; </strong>
                                {temporaryResidence}
                            </div>
                            {/* Quốc gia  */}
                            <div className="form-group" >
                                <strong>{translate('human_resource.profile.nation')}&emsp; </strong>
                                {temporaryResidenceCountry}
                            </div>
                            {/* Tỉnh/ Thành phố */}
                            <div className="form-group" >
                                <strong>{translate('human_resource.profile.province')}&emsp; </strong>
                                {temporaryResidenceCity}
                            </div>
                            {/* Quận / Huyện/  */}
                            <div className="form-group" >
                                <strong>{translate('human_resource.profile.district')}&emsp; </strong>
                                {temporaryResidenceDistrict}
                            </div>
                            {/* Xã/ Phường */}
                            <div className="form-group" >
                                <strong>{translate('human_resource.profile.wards')}&emsp; </strong>
                                {temporaryResidenceWard}
                            </div>
                        </fieldset>
                    </div>
                </div>
            </div>
        </div >
    );
};

const tabContact = connect(null, null)(withTranslate(ContactTab));
export { tabContact as ContactTab };