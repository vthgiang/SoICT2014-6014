import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
class TabGeneralViewContent extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                avatar: nextProps.employee.avatar,
                employeeNumber: nextProps.employee.employeeNumber,
                MSCC: nextProps.employee.MSCC,
                fullName: nextProps.employee.fullName,
                gender: nextProps.employee.gender,
                brithday: nextProps.employee.brithday,
                birthplace: nextProps.employee.birthplace,
                emailCompany: nextProps.employee.emailCompany,
                relationship: nextProps.employee.relationship,
                CMND: nextProps.employee.CMND,
                dateCMND: nextProps.employee.dateCMND,
                addressCMND: nextProps.employee.addressCMND,
                national: nextProps.employee.national,
                religion: nextProps.employee.religion,
                nation: nextProps.employee.nation,
            }
        } else {
            return null;
        }
    }
    render() {
        const { id, translate } = this.props;
        const { brithday, dateCMND, avatar, employeeNumber, MSCC, fullName, gender, birthplace,
            emailCompany, relationship, CMND, addressCMND, national, religion, nation } = this.state;
        return (
            <div id={id} className="tab-pane active">
                <div className=" row box-body">
                    <div className="col-lg-4 col-md-4 col-ms-12 col-xs-12" style={{ textAlign: 'center' }}>
                        <div>
                            <img className="attachment-img avarta" src={avatar} alt="Attachment" />
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
                                {MSCC}
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
                                {brithday}
                            </div>
                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('manage_employee.place_birth')}&emsp; </strong>
                                {birthplace}
                            </div>

                        </div>
                        <div className="row">
                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('manage_employee.email_company')}&emsp; </strong>
                                {emailCompany}
                            </div>
                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('manage_employee.relationship')}&emsp; </strong>
                                {translate(`manage_employee.${relationship}`)}
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('manage_employee.id_card')}&emsp; </strong>
                                {CMND}

                            </div>
                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('manage_employee.date_issued')}&emsp; </strong>
                                {dateCMND}
                            </div>

                        </div>
                        <div className="row">
                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('manage_employee.issued_by')}&emsp; </strong>
                                {addressCMND}
                            </div>
                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('manage_employee.ethnic')}&emsp; </strong>
                                {national}
                            </div>

                        </div>
                        <div className="row">
                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('manage_employee.religion')}&emsp; </strong>
                                {religion}
                            </div>
                            <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                                <strong>{translate('manage_employee.nationality')}&emsp; </strong>
                                {nation}
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
};
const tabGeneral = connect(null, null)(withTranslate(TabGeneralViewContent));
export { tabGeneral as TabGeneralViewContent };