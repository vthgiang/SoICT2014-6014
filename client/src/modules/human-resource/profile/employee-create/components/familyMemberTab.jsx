import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DataTableSetting, DialogModal, ButtonModal } from '../../../../../common-components';
import FamilyMemberInfo from './familyMemberInfo';

const initHouseHold = {
    headHouseHoldName: '',
    documentType: '',
    houseHoldNumber: '',
    city: '',
    district: '',
    ward: '',
    houseHoldAddress: '',
    phone: '',
    houseHoldCode: '',
    familyMembers: []
}

const FamilyMemberTab = ({
    houseHold,
    id, translate,
    _fm_handleHeadHouseHoldName,
    _fm_handleDocumentType,
    _fm_handleHouseHoldNumber,
    _fm_handleCity,
    _fm_handleDistrict,
    _fm_handleWard,
    _fm_handleHouseHoldAddress,
    _fm_handlePhone,
    _fm_handleHouseHoldCode,
    _fm_saveMember,
}) => {

    return (
        <div id={id} className="tab-pane">
            <div className="box-body">
                <fieldset className="scheduler-border" style={{ margin: '10px 20px' }}>
                    <legend className="scheduler-border" >
                        <h4 className="box-title">Phụ luc: Thành viên hộ gia đình của NLĐ</h4>
                    </legend>
                    <div className="row">
                        {/* họ và tên chủ hộ */}
                        <div className="form-group col-md-4">
                            <label >Họ và tên chủ hộ <span className="text-red">*</span></label>
                            <input type="text" className="form-control" onChange={_fm_handleHeadHouseHoldName} />
                        </div>
                        {/* Loại giấy tờ */}
                        <div className="form-group col-md-4">
                            <label >Loại giấy tờ</label>
                            <input type="text" className="form-control" onChange={_fm_handleDocumentType} />
                        </div>
                        {/* Số sổ hộ khẩu */}
                        <div className="form-group col-md-4">
                            <label >Số sổ hộ khẩu</label>
                            <input type="text" className="form-control" onChange={_fm_handleHouseHoldNumber} />
                        </div>

                        {/* Tỉnh/TP */}
                        <div className="form-group col-md-4">
                            <label >Tỉnh/TP <span className="text-red">*</span></label>
                            <input type="text" className="form-control" onChange={_fm_handleCity} />
                        </div>
                        {/* Loại giấy tờ */}
                        <div className="form-group col-md-4">
                            <label >Quận/huyện <span className="text-red">*</span></label>
                            <input type="text" className="form-control" onChange={_fm_handleDistrict} />
                        </div>
                        {/* Số sổ hộ khẩu */}
                        <div className="form-group col-md-4">
                            <label >Phường/xã <span className="text-red">*</span></label>
                            <input type="text" className="form-control" onChange={_fm_handleWard} />
                        </div>

                        {/* Địa chỉ hộ khẩu */}
                        <div className="form-group col-md-4">
                            <label >Địa chỉ hộ khẩu</label>
                            <input type="text" className="form-control" onChange={_fm_handleHouseHoldAddress} />
                        </div>
                        {/* Số điện thoại */}
                        <div className="form-group col-md-4">
                            <label >Số điện thoại</label>
                            <input type="text" className="form-control" onChange={_fm_handlePhone} />
                        </div>
                        {/* Số sổ hộ khẩu */}
                        <div className="form-group col-md-4">
                            <label >Mã số hộ gia đình</label>
                            <input type="text" className="form-control" onChange={_fm_handleHouseHoldCode} />
                        </div>
                    </div>
                </fieldset>

                <fieldset className="scheduler-border" style={{ margin: '10px 20px' }}>
                    <legend className="scheduler-border" >
                        <h4 className="box-title">Kê khai đầy đủ thành viên hộ gia đình trong sổ hộ khẩu hoặc sổ tạm trú</h4>
                    </legend>

                    <FamilyMemberInfo
                        _save={_fm_saveMember}
                    />

                    {/* Bảng danh sách thông tin các thành viên trong hộ gia đình */}
                    <div id="container-employee-family-member" className="row">
                        <table className="table table-hover table-striped table-bordered" id="table-employee-family-member" style={{ marginBottom: 0 }}>
                            <thead>
                                <tr>
                                    <th style={{ width: 20 }}>STT</th>
                                    <th>Họ và tên</th>
                                    <th>Mã số BHXH</th>
                                    <th>Số sổ BHXH</th>
                                    <th>Giới tính</th>
                                    <th>Là chủ hộ</th>
                                    <th>Quan hệ với chủ hộ</th>
                                    <th>CNSS</th>
                                    <th>Ngày sinh</th>
                                    <th>Nơi cấp giấy khai sinh</th>
                                    <th>Quốc tịch</th>
                                    <th>Dân tộc</th>
                                    <th>Số CMND/Hộ chiếu</th>
                                    <th>Ghi chú</th>
                                    <th>Hành động
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
                                    houseHold.familyMembers.map((member, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{member.name}</td>
                                            <td>{member.codeSocialInsurance}</td>
                                            <td>{member.bookNumberSocialInsurance}</td>
                                            <td>{member.gender}</td>
                                            <td>{member.isHeadHousehold}</td>
                                            <td>{member.relationshipWithHeadHousehold}</td>
                                            <td>{member.cnss}</td>
                                            <td>{member.birth}</td>
                                            <td>{member.placeOfBirthCertificate}</td>
                                            <td>{member.nationality}</td>
                                            <td>{member.nation}</td>
                                            <td>{member.numberPassport}</td>
                                            <td>{member.note}</td>
                                            <td>
                                                <a className="text-orange" onClick={() => { }}><i className="material-icons">edit</i></a>
                                                <a className="text-red"><i className="material-icons">delete</i></a>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        {
                            houseHold.familyMembers.length === 0 && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </div>
                </fieldset>
            </div>
        </div>
    )
}

export default connect()(withTranslate(FamilyMemberTab));