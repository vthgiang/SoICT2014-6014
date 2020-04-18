import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class TabContactViewContent extends Component {
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
                phoneNumber: nextProps.employeeContact.phoneNumber,
                phoneNumber2: nextProps.employeeContact.phoneNumber2,
                emailPersonal: nextProps.employeeContact.emailPersonal,
                emailPersonal2: nextProps.employeeContact.emailPersonal2,
                phoneNumberAddress: nextProps.employeeContact.phoneNumberAddress,
                friendName: nextProps.employeeContact.friendName,
                relation: nextProps.employeeContact.relation,
                friendAddress: nextProps.employeeContact.friendAddress,
                friendPhone: nextProps.employeeContact.friendPhone,
                friendPhoneAddress: nextProps.employeeContact.friendPhoneAddress,
                friendEmail: nextProps.employeeContact.friendEmail,
                localAddress: nextProps.employeeContact.localAddress,
                localCommune: nextProps.employeeContact.localCommune,
                localDistrict: nextProps.employeeContact.localDistrict,
                localCity: nextProps.employeeContact.localCity,
                localNational: nextProps.employeeContact.localNational,
                nowAddress: nextProps.employeeContact.nowAddress,
                nowCommune: nextProps.employeeContact.nowCommune,
                nowDistrict: nextProps.employeeContact.nowDistrict,
                nowCity: nextProps.employeeContact.nowCity,
                nowNational: nextProps.employeeContact.nowNational,
            }
        } else {
            return null;
        }
    }

    render() {
        const { id, translate } = this.props;
        const { phoneNumber2, phoneNumber, emailPersonal, emailPersonal2, phoneNumberAddress, friendName,
            relation, friendAddress, friendPhone, friendPhoneAddress, friendEmail, localAddress,
            localCommune, localDistrict, localCity, localNational, nowAddress, nowCommune,
            nowDistrict, nowCity, nowNational, errorOnPhoneNumber, errorOnNowAddress, errorOnEmailPersonal, errorOnEmailPersonal2 } = this.state;
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
                            {emailPersonal}
                        </div>
                        <div className="form-group col-md-4">
                            <strong>{translate('manage_employee.personal_email_2')}&emsp; </strong>
                            {emailPersonal2}
                        </div>
                        <div className="form-group col-md-4">
                            <strong>{translate('manage_employee.home_phone')}&emsp; </strong>
                            {phoneNumberAddress ? "0" + phoneNumberAddress : ""}
                        </div>
                    </div>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('manage_employee.emergency_contact')}</h4></legend>
                        <div className="row">
                            <div className="form-group col-md-4">
                                <strong>{translate('manage_employee.full_name')}&emsp; </strong>
                                {friendName}
                            </div>
                            <div className="form-group col-md-4">
                                <strong>{translate('manage_employee.nexus')}&emsp; </strong>
                                {relation}
                            </div>
                            <div className="form-group col-md-4">
                                <strong>{translate('manage_employee.address')}&emsp; </strong>
                                {friendAddress}
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-md-4">
                                <strong>{translate('manage_employee.mobile_phone')}&emsp; </strong>
                                {friendPhone ? "0" + friendPhone : ""}
                            </div>
                            <div className="form-group col-md-4">
                                <strong>{translate('manage_employee.home_phone')}&emsp; </strong>
                                {friendPhoneAddress ? "0" + phoneNumberAddress : ""}
                            </div>
                            <div className="form-group col-md-4">
                                <strong>{translate('manage_employee.email')}&emsp; </strong>
                                {friendEmail}
                            </div>
                        </div>
                    </fieldset>
                    <div className="row">
                        <div className="col-md-6">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border"><h4 className="box-title">{translate('manage_employee.permanent_address')}</h4></legend>
                                <div className="form-group" >
                                    <strong>{translate('manage_employee.address')}&emsp; </strong>
                                    {localAddress}
                                </div>
                                <div className="form-group" >
                                    <strong>{translate('manage_employee.nation')}&emsp; </strong>
                                    {localNational}
                                </div>
                                <div className="form-group" >
                                    <strong>{translate('manage_employee.district')}&emsp; </strong>
                                    {localCity}
                                </div>
                                <div className="form-group" >
                                    <strong>{translate('manage_employee.district')}&emsp; </strong>
                                    {localDistrict}
                                </div>
                                <div className="form-group" >
                                    <strong>{translate('manage_employee.wards')}&emsp; </strong>
                                    {localCommune}
                                </div>
                            </fieldset>
                        </div>
                        <div className="col-md-6">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border"><h4 className="box-title">Chỗ ở hiện tại</h4></legend>
                                <div className="form-group" >
                                    <strong>{translate('manage_employee.address')}&emsp; </strong>
                                    {nowAddress}
                                </div>
                                <div className="form-group" >
                                    <strong>{translate('manage_employee.nation')}&emsp; </strong>
                                    {nowNational}
                                </div>
                                <div className="form-group" >
                                    <strong>{translate('manage_employee.district')}&emsp; </strong>
                                    {nowCity}
                                </div>
                                <div className="form-group" >
                                    <strong>{translate('manage_employee.district')}&emsp; </strong>
                                    {nowDistrict}
                                </div>
                                <div className="form-group" >
                                    <strong>{translate('manage_employee.wards')}&emsp; </strong>
                                    {nowCommune}
                                </div>
                            </fieldset>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
};
const tabContact = connect(null, null)(withTranslate(TabContactViewContent));
export { tabContact as TabContactViewContent };