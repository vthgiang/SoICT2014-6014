import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { LOCAL_SERVER_API } from '../../../../../env';
class GeneralTab extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    // Function format dữ liệu Date thành string
    formatDate(date, monthYear = false) {
        var d = new Date(date),
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
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                avatar: nextProps.employee.avatar,
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
                nationality: nextProps.employee.nationality,
                ethnic: nextProps.employee.ethnic,
                religion: nextProps.employee.religion,
            }
        } else {
            return null;
        }
    }
    render() {
        const { id, translate } = this.props;
        const { avatar, employeeNumber, employeeTimesheetId, fullName, gender, birthdate, birthplace,
            emailInCompany, maritalStatus, identityCardNumber, identityCardDate, identityCardAddress, nationality, ethnic, religion } = this.state;
        return (
            <div id={id} className="tab-pane active">
                <div className=" row box-body">
                    <div className="col-lg-4 col-md-4 col-ms-12 col-xs-12" style={{ textAlign: 'center' }}>
                        <div>
                            <a href={LOCAL_SERVER_API + avatar} target="_blank">
                            <img className="attachment-img avarta" src={LOCAL_SERVER_API + avatar} alt="Attachment" />
                            </a>
                        </div>
                    </div>
                    <div className="pull-right col-lg-8 col-md-8 col-ms-12 col-xs-12">
                        <div className="row">
                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('manage_employee.staff_number')}&emsp; </strong>
                                {employeeNumber}
                            </div>
                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('manage_employee.attendance_code')}&emsp; </strong>
                                {employeeTimesheetId}
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('manage_employee.full_name')}&emsp; </strong>
                                {fullName}
                            </div>
                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('manage_employee.gender')}&emsp; </strong>
                                {translate(`manage_employee.${gender}`)}
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('manage_employee.date_birth')}&emsp; </strong>
                                {this.formatDate(birthdate)}
                            </div>
                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('manage_employee.place_birth')}&emsp; </strong>
                                {birthplace}
                            </div>

                        </div>
                        <div className="row">
                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('manage_employee.email_company')}&emsp; </strong>
                                {emailInCompany}
                            </div>
                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('manage_employee.relationship')}&emsp; </strong>
                                {translate(`manage_employee.${maritalStatus}`)}
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('manage_employee.id_card')}&emsp; </strong>
                                {identityCardNumber}

                            </div>
                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('manage_employee.date_issued')}&emsp; </strong>
                                {this.formatDate(identityCardDate)}
                            </div>

                        </div>
                        <div className="row">
                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('manage_employee.issued_by')}&emsp; </strong>
                                {identityCardAddress}
                            </div>
                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('manage_employee.ethnic')}&emsp; </strong>
                                {ethnic}
                            </div>

                        </div>
                        <div className="row">
                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('manage_employee.religion')}&emsp; </strong>
                                {religion}
                            </div>
                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('manage_employee.nationality')}&emsp; </strong>
                                {nationality}
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
};
const tabGeneral = connect(null, null)(withTranslate(GeneralTab));
export { tabGeneral as GeneralTab };