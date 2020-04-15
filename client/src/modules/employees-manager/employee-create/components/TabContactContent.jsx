import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class TabContactContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    // Function lưu các trường thông tin vào state
    handleChange = (e) => {
        const { name, value } = e.target;
        this.props.handleChange(name, value);
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

                errorOnPosition: undefined,
                errorOnUnit: undefined,
                errorOnStartDate: undefined,
                errorOnEndDate: undefined
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
            nowDistrict, nowCity, nowNational } = this.state;
        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    <div className="row">
                        <div className="form-group col-md-4">
                            <label htmlFor="phoneNumber">{translate('manage_employee.mobile_phone_1')}<span className="text-red">*</span></label>
                            <input type="number" className="form-control" name="phoneNumber" value={phoneNumber} onChange={this.handleChange} placeholder={translate('manage_employee.mobile_phone_1')} autoComplete="off" />
                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="phoneNumber2">{translate('manage_employee.mobile_phone_2')}</label>
                            <input type="number" className="form-control" name="phoneNumber2" value={phoneNumber2} onChange={this.handleChange} placeholder={translate('manage_employee.mobile_phone_2')} autoComplete="off" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-md-4">
                            <label htmlFor="emailPersonal">{translate('manage_employee.personal_email_1')}</label>
                            <input type="text" className="form-control" name="emailPersonal" value={emailPersonal} onChange={this.handleChange} placeholder={translate('manage_employee.personal_email_1')} autoComplete="off" />
                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="emailPersonal2">{translate('manage_employee.personal_email_2')}</label>
                            <input type="text" className="form-control" name="emailPersonal2" value={emailPersonal2} onChange={this.handleChange} placeholder={translate('manage_employee.personal_email_2')} autoComplete="off" />
                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="phoneNumberAddress">{translate('manage_employee.home_phone')}</label>
                            <input type="text" className="form-control" name="phoneNumberAddress" value={phoneNumberAddress} onChange={this.handleChange} placeholder={translate('manage_employee.home_phone')} autoComplete="off" />
                        </div>
                    </div>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">
                            <h4 className="box-title">{translate('manage_employee.emergency_contact')}</h4>
                        </legend>
                        <div className="row">
                            <div className="form-group col-md-4">
                                <label htmlFor="friendName">{translate('manage_employee.full_name')}</label>
                                <input type="text" className="form-control" name="friendName" value={friendName} onChange={this.handleChange} placeholder={translate('manage_employee.full_name')} autoComplete="off" />
                            </div>

                            <div className="form-group col-md-4">
                                <label htmlFor="relation">{translate('manage_employee.nexus')}</label>
                                <input type="text" className="form-control" name="relation" value={relation} onChange={this.handleChange} placeholder={translate('manage_employee.nexus')} autoComplete="off" />
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="friendAddress">{translate('manage_employee.address')}</label>
                                <input type="text" className="form-control" name="friendAddress" value={friendAddress} onChange={this.handleChange} placeholder={translate('manage_employee.address')} autoComplete="off" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-md-4">
                                <label htmlFor="friendPhone">{translate('manage_employee.mobile_phone')}</label>
                                <input type="text" className="form-control" name="friendPhone" value={friendPhone} onChange={this.handleChange} placeholder={translate('manage_employee.mobile_phone')} autoComplete="off" />
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="friendPhoneAddress">{translate('manage_employee.home_phone')}</label>
                                <input type="text" className="form-control" name="friendPhoneAddress" value={friendPhoneAddress} onChange={this.handleChange} placeholder={translate('manage_employee.home_phone')} autoComplete="off" />
                            </div>

                            <div className="form-group col-md-4">
                                <label htmlFor="friendEmail">{translate('manage_employee.email')}</label>
                                <input type="text" className="form-control" name="friendEmail" value={friendEmail} onChange={this.handleChange} placeholder={translate('manage_employee.email')} autoComplete="off" />
                            </div>
                        </div>
                    </fieldset>
                    <div className="row">
                        <div className="col-md-6">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border"><h4 className="box-title">{translate('manage_employee.permanent_address')}</h4></legend>
                                <div className="form-group">
                                    <label htmlFor="localAddress">{translate('manage_employee.address')}</label>
                                    <input type="text" className="form-control " name="localAddress" value={localAddress} onChange={this.handleChange} placeholder={translate('manage_employee.address')} autoComplete="off" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="localCommune">
                                        {translate('manage_employee.wards')}</label>
                                    <input type="text" className="form-control " name="localCommune" value={localCommune} onChange={this.handleChange} placeholder={translate('manage_employee.wards')} autoComplete="off" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="localDistrict">
                                        {translate('manage_employee.district')}</label>
                                    <input type="text" className="form-control " name="localDistrict" value={localDistrict} onChange={this.handleChange} placeholder={translate('manage_employee.district')} autoComplete="off" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="localCity">
                                        {translate('manage_employee.province')}</label>
                                    <input type="text" className="form-control " name="localCity" value={localCity} onChange={this.handleChange} placeholder={translate('manage_employee.province')} autoComplete="off" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="localNational">{translate('manage_employee.nation')}</label>
                                    <input type="text" className="form-control " name="localNational" value={localNational} onChange={this.handleChange} placeholder={translate('manage_employee.nation')} autoComplete="off" />
                                </div>
                            </fieldset>

                        </div>
                        <div className="col-md-6">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border"><h4 className="box-title"> {translate('manage_employee.current_residence')}</h4></legend>
                                <div className="form-group">
                                    <label htmlFor="nowAddress">
                                        {translate('manage_employee.address')}<span className="text-red">*</span></label>
                                    <input type="text" className="form-control " name="nowAddress" value={nowAddress} onChange={this.handleChange} placeholder={translate('manage_employee.address')} autoComplete="off" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="nowCommune">
                                        {translate('manage_employee.wards')}</label>
                                    <input type="text" className="form-control " name="nowCommune" value={nowCommune} onChange={this.handleChange} placeholder={translate('manage_employee.wards')} autoComplete="off" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="nowDistrict">
                                        {translate('manage_employee.district')}</label>
                                    <input type="text" className="form-control " name="nowDistrict" value={nowDistrict} onChange={this.handleChange} placeholder={translate('manage_employee.district')} autoComplete="off" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="nowCity">
                                        {translate('manage_employee.province')}</label>
                                    <input type="text" className="form-control " name="nowCity" value={nowCity} onChange={this.handleChange} placeholder={translate('manage_employee.province')} autoComplete="off" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="nowNational">
                                        {translate('manage_employee.nation')}</label>
                                    <input type="text" className="form-control " name="nowNational" value={nowNational} onChange={this.handleChange} placeholder={translate('manage_employee.nation')} autoComplete="off" />
                                </div>
                            </fieldset>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
};
const tabContact = connect(null, null)(withTranslate(TabContactContent));
export { tabContact as TabContactContent };