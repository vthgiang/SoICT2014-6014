import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DataTableSetting, DateTimeConverter, ConfirmNotification } from '../../../../../common-components';

const FamilyMemberTabInfo = ({
    id,
    houseHold,
    translate
}) => {

    const _showMemberGender = (gender) => {
        switch (gender) {
            case 'male': return "Nam";
            case 'female': return "Nữ";
            default: return "";
        }
    }

    const _showIsHeadHouseHold = (headHouseHold) => {
        switch (headHouseHold) {
            case 'yes': return "Có";
            case 'no': return "Không";
            default: return "";
        }
    }

    return (
        <div id={id} className="tab-pane">
            <div className="box-body">
                <fieldset className="scheduler-border" style={{ margin: '10px 20px' }}>
                    <legend className="scheduler-border" >
                        <h4 className="box-title">{translate('human_resource.profile.house_hold.appendix.title')}</h4>
                    </legend>
                    <div className="row">
                        {/* Tên chủ hộ*/}
                        <div className="form-group col-lg-4 col-md-4 col-ms-4 col-xs-4">
                            <strong>{translate('human_resource.profile.house_hold.appendix.head_house_hold_name')}&emsp; </strong>
                            {houseHold?.headHouseHoldName}
                        </div>
                        {/* Loại giấy tờ */}
                        <div className="form-group col-lg-4 col-md-4 col-ms-4 col-xs-4">
                            <strong>{translate('human_resource.profile.house_hold.appendix.document_type')}&emsp; </strong>
                            {houseHold?.documentType}
                        </div>
                        {/* Số sổ hộ khẩu */}
                        <div className="form-group col-lg-4 col-md-4 col-ms-4 col-xs-4">
                            <strong>{translate('human_resource.profile.house_hold.appendix.house_hold_number')}&emsp; </strong>
                            {houseHold?.houseHoldNumber}
                        </div>
                    </div>

                    <div className="row">
                        {/* Tỉnh/Thành phố*/}
                        <div className="form-group col-lg-4 col-md-4 col-ms-4 col-xs-4">
                            <strong>{translate('human_resource.profile.house_hold.appendix.city')}&emsp; </strong>
                            {houseHold?.city}
                        </div>
                        {/* Quận/Huyện */}
                        <div className="form-group col-lg-4 col-md-4 col-ms-4 col-xs-4">
                            <strong>{translate('human_resource.profile.house_hold.appendix.district')}&emsp; </strong>
                            {houseHold?.district}
                        </div>
                        {/* Phường/Xã*/}
                        <div className="form-group col-lg-4 col-md-4 col-ms-4 col-xs-4">
                            <strong>{translate('human_resource.profile.house_hold.appendix.ward')}&emsp; </strong>
                            {houseHold?.ward}
                        </div>
                    </div>

                    <div className="row">
                        {/* Địa chỉ hộ khẩu*/}
                        <div className="form-group col-lg-4 col-md-4 col-ms-4 col-xs-4">
                            <strong>{translate('human_resource.profile.house_hold.appendix.house_hold_address')}&emsp; </strong>
                            {houseHold?.houseHoldAddress}
                        </div>
                        {/* Số điện thoại */}
                        <div className="form-group col-lg-4 col-md-4 col-ms-4 col-xs-4">
                            <strong>{translate('human_resource.profile.house_hold.appendix.phone')}&emsp; </strong>
                            {houseHold?.phone}
                        </div>
                        {/* Mã số hộ gia đình*/}
                        <div className="form-group col-lg-4 col-md-4 col-ms-4 col-xs-4">
                            <strong>{translate('human_resource.profile.house_hold.appendix.house_hold_code')}&emsp; </strong>
                            {houseHold?.houseHoldCode}
                        </div>
                    </div>
                </fieldset>

                <fieldset className="scheduler-border" style={{ margin: '10px 20px' }}>
                    <legend className="scheduler-border" >
                        <h4 className="box-title">{translate('human_resource.profile.house_hold.members.title')}</h4>
                    </legend>

                    {/* Bảng danh sách thông tin các thành viên trong hộ gia đình */}
                    <div id="container-employee-family-member" className="row">
                        <table className="table table-hover table-striped table-bordered" id="table-employee-family-member" style={{ marginBottom: 0 }}>
                            <thead>
                                <tr>
                                    <th style={{ width: 20 }}>{translate('human_resource.profile.house_hold.members.stt')}</th>
                                    <th>{translate('human_resource.profile.house_hold.members.name')}</th>
                                    <th>{translate('human_resource.profile.house_hold.members.code_social_insurance')}</th>
                                    <th>{translate('human_resource.profile.house_hold.members.book_nci')}</th>
                                    <th>{translate('human_resource.profile.house_hold.members.gender')}</th>
                                    <th>{translate('human_resource.profile.house_hold.members.is_hh')}</th>
                                    <th>{translate('human_resource.profile.house_hold.members.rwhh')}</th>
                                    <th>{translate('human_resource.profile.house_hold.members.cnss')}</th>
                                    <th>{translate('human_resource.profile.house_hold.members.birth')}</th>
                                    <th>{translate('human_resource.profile.house_hold.members.pob')}</th>
                                    <th>{translate('human_resource.profile.house_hold.members.nationality')}</th>
                                    <th>{translate('human_resource.profile.house_hold.members.nation')}</th>
                                    <th>{translate('human_resource.profile.house_hold.members.npp')}</th>
                                    <th>{translate('human_resource.profile.house_hold.members.note')}</th>
                                    <th>{translate('general.action')}
                                        <DataTableSetting
                                            tableId="table-employee-family-member"
                                            tableContainerId="container-employee-family-member"
                                            tableWidt={1500}
                                        />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    houseHold?.familyMembers && houseHold?.familyMembers.map((member, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{member.name}</td>
                                            <td>{member.codeSocialInsurance}</td>
                                            <td>{member.bookNumberSocialInsurance}</td>
                                            <td>{_showMemberGender(member.gender)}</td>
                                            <td>{_showIsHeadHouseHold(member.isHeadHousehold)}</td>
                                            <td>{member.relationshipWithHeadHousehold}</td>
                                            <td>{member.cnss}</td>
                                            <td><DateTimeConverter dateTime={member.birth} type="DD-MM-YYYY" /></td>
                                            <td>{member.placeOfBirthCertificate}</td>
                                            <td>{member.nationality}</td>
                                            <td>{member.nation}</td>
                                            <td>{member.numberPassport}</td>
                                            <td>{member.note}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        {
                            houseHold?.familyMembers.length === 0 && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </div>
                </fieldset>
            </div>
        </div>
    )
}

export default connect()(withTranslate(FamilyMemberTabInfo));