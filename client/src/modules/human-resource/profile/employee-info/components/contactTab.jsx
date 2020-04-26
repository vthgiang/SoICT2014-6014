import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class ContactTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
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
                emergencyContactPersonAddress: nextProps.employee.emergencyContactPersonAddress,
                emergencyContactPersonPhoneNumber: nextProps.employee.emergencyContactPersonPhoneNumber,
                emergencyContactPersonHomePhone: nextProps.employee.emergencyContactPersonHomePhone,
                emergencyContactPersonEmail: nextProps.employee.emergencyContactPersonEmail,
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
            }
        } else {
            return null;
        }
    }

    render() {
        const { id, translate } = this.props;
        const { phoneNumber2, phoneNumber, personalEmail, personalEmail2, homePhone, emergencyContactPerson,
            relationWithEmergencyContactPerson, emergencyContactPersonAddress, emergencyContactPersonPhoneNumber,
            emergencyContactPersonHomePhone, emergencyContactPersonEmail, permanentResidence,
            permanentResidenceWard, permanentResidenceDistrict, permanentResidenceCity, permanentResidenceCountry,
            temporaryResidence, temporaryResidenceWard, temporaryResidenceDistrict,
            temporaryResidenceCity, temporaryResidenceCountry } = this.state;
        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    <div className="row">
                        <div className="form-group col-md-4">
                            <strong>{translate('manage_employee.mobile_phone_1')}&emsp; </strong>
                            {phoneNumber ? "0" + phoneNumber : ""}
                        </div>
                        <div className="form-group col-md-4">
                            <strong>{translate('manage_employee.mobile_phone_2')}&emsp; </strong>
                            {phoneNumber2 ? "0" + phoneNumber2 : ""}
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-md-4">
                            <strong>{translate('manage_employee.personal_email_1')}&emsp; </strong>
                            {personalEmail}
                        </div>
                        <div className="form-group col-md-4">
                            <strong>{translate('manage_employee.personal_email_2')}&emsp; </strong>
                            {personalEmail2}
                        </div>
                        <div className="form-group col-md-4">
                            <strong>{translate('manage_employee.home_phone')}&emsp; </strong>
                            {homePhone ? "0" + homePhone : ""}
                        </div>
                    </div>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('manage_employee.emergency_contact')}</h4></legend>
                        <div className="row">
                            <div className="form-group col-md-4">
                                <strong>{translate('manage_employee.full_name')}&emsp; </strong>
                                {emergencyContactPerson}
                            </div>
                            <div className="form-group col-md-4">
                                <strong>{translate('manage_employee.nexus')}&emsp; </strong>
                                {relationWithEmergencyContactPerson}
                            </div>
                            <div className="form-group col-md-4">
                                <strong>{translate('manage_employee.address')}&emsp; </strong>
                                {emergencyContactPersonAddress}
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-md-4">
                                <strong>{translate('manage_employee.mobile_phone')}&emsp; </strong>
                                {emergencyContactPersonPhoneNumber ? "0" + emergencyContactPersonPhoneNumber : ""}
                            </div>
                            <div className="form-group col-md-4">
                                <strong>{translate('manage_employee.home_phone')}&emsp; </strong>
                                {emergencyContactPersonHomePhone ? "0" + homePhone : ""}
                            </div>
                            <div className="form-group col-md-4">
                                <strong>{translate('manage_employee.email')}&emsp; </strong>
                                {emergencyContactPersonEmail}
                            </div>
                        </div>
                    </fieldset>
                    <div className="row">
                        <div className="col-md-6">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border"><h4 className="box-title">{translate('manage_employee.permanent_address')}</h4></legend>
                                <div className="form-group" >
                                    <strong>{translate('manage_employee.address')}&emsp; </strong>
                                    {permanentResidence}
                                </div>
                                <div className="form-group" >
                                    <strong>{translate('manage_employee.nation')}&emsp; </strong>
                                    {permanentResidenceCountry}
                                </div>
                                <div className="form-group" >
                                    <strong>{translate('manage_employee.province')}&emsp; </strong>
                                    {permanentResidenceCity}
                                </div>
                                <div className="form-group" >
                                    <strong>{translate('manage_employee.district')}&emsp; </strong>
                                    {permanentResidenceDistrict}
                                </div>
                                <div className="form-group" >
                                    <strong>{translate('manage_employee.wards')}&emsp; </strong>
                                    {permanentResidenceWard}
                                </div>
                            </fieldset>
                        </div>
                        <div className="col-md-6">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border"><h4 className="box-title">Chỗ ở hiện tại</h4></legend>
                                <div className="form-group" >
                                    <strong>{translate('manage_employee.address')}&emsp; </strong>
                                    {temporaryResidence}
                                </div>
                                <div className="form-group" >
                                    <strong>{translate('manage_employee.nation')}&emsp; </strong>
                                    {temporaryResidenceCountry}
                                </div>
                                <div className="form-group" >
                                    <strong>{translate('manage_employee.province')}&emsp; </strong>
                                    {temporaryResidenceCity}
                                </div>
                                <div className="form-group" >
                                    <strong>{translate('manage_employee.district')}&emsp; </strong>
                                    {temporaryResidenceDistrict}
                                </div>
                                <div className="form-group" >
                                    <strong>{translate('manage_employee.wards')}&emsp; </strong>
                                    {temporaryResidenceWard}
                                </div>
                            </fieldset>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
};
const tabContact = connect(null, null)(withTranslate(ContactTab));
export { tabContact as ContactTab };