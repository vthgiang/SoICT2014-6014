import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DataTableSetting, DialogModal, ButtonModal, SelectBox } from '../../../../../common-components';

const initMember = {
    name: '',
    codeSocialInsurance: '',
    bookNumberSocialInsurance: '',
    gender: '',
    isHeadHousehold: '',
    relationshipWithHeadHousehold: '',
    cnss: '',
    birth: '',
    placeOfBirthCertificate: '',
    nationality: '',
    nation: '',
    numberPassport: '',
    note: ''
};

const FamilyMemberModal = ({
    _save
}) => {
    const [currentMember, setCurrentMember] = useState(initMember);

    const _handleCurName = (e) => {
        let { value } = e.target;
        setCurrentMember({
            ...currentMember,
            name: value
        })
    }

    const _handleCurCodeSocialInsurance = (e) => {
        let { value } = e.target;
        setCurrentMember({
            ...currentMember,
            codeSocialInsurance: value
        })
    }

    const _handleCurBookNumberSocialInsurance = (e) => {
        let { value } = e.target;
        setCurrentMember({
            ...currentMember,
            bookNumberSocialInsurance: value
        })
    }

    const _handleCurGender = (e) => {
        let { value } = e.target;
        setCurrentMember({
            ...currentMember,
            gender: value
        })
    }

    const _handleCurIsHeadHousehold = (value) => {
        setCurrentMember({
            ...currentMember,
            isHeadHousehold: value[0]
        })
    }

    const _handleCurRelationshipWithHeadHousehold = (e) => {
        let { value } = e.target;
        setCurrentMember({
            ...currentMember,
            relationshipWithHeadHousehold: value
        })
    }

    const _handleCurBirth = (e) => {
        let { value } = e.target;
        setCurrentMember({
            ...currentMember,
            birth: value
        })
    }

    const _handleCurCnss = (e) => {
        let { value } = e.target;
        setCurrentMember({
            ...currentMember,
            cnss: value
        })
    }

    const _handleCurPlaceOfBirthCertificate = (e) => {
        let { value } = e.target;
        setCurrentMember({
            ...currentMember,
            placeOfBirthCertificate: value
        })
    }

    const _handleCurNationality = (e) => {
        let { value } = e.target;
        setCurrentMember({
            ...currentMember,
            nationality: value
        })
    }


    const _handleCurNation = (e) => {
        let { value } = e.target;
        setCurrentMember({
            ...currentMember,
            nation: value
        })
    }

    const _handleCurNumberPassport = (e) => {
        let { value } = e.target;
        setCurrentMember({
            ...currentMember,
            numberPassport: value
        })
    }

    const _handleCurNote = (e) => {
        let { value } = e.target;
        setCurrentMember({
            ...currentMember,
            note: value
        })
    }

    const _openModalAddFamilyMember = () => {
        window.$('#modal-add-family-members').modal('show'); // hiển thị form thành viên hộ gia đình
    }

    const _addFamilyMember = () => {
        _save(currentMember);
        setCurrentMember(initMember);
    }

    return (
        <React.Fragment>
            <button className="btn btn-success pull-right" style={{ cursor: 'pointer' }} onClick={_openModalAddFamilyMember}>Thêm mới</button>
            <DialogModal
                modalID="modal-add-family-members"
                formID="form-add-family-members"
                title="Thêm thành viên trong hộ gia đình"
                func={_addFamilyMember} size={75}
            >
                <form id="form-add-family-members">
                    <div className="row">
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className="form-group">
                                <label>Họ và tên</label>
                                <input className="form-control" onChange={_handleCurName} value={currentMember.name} />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className="form-group">
                                <label>Mã số BHXH</label>
                                <input className="form-control" onChange={_handleCurCodeSocialInsurance} value={currentMember.codeSocialInsurance} />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className="form-group">
                                <label>Số sổ BHXH</label>
                                <input className="form-control" onChange={_handleCurBookNumberSocialInsurance} value={currentMember.bookNumberSocialInsurance} />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className="form-group">
                                <label>Giới tính</label>
                                <SelectBox
                                    id="house-hold-family-gender"
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={[
                                        { text: 'Nam', value: 'male' },
                                        { text: 'Nữ', value: 'female' }
                                    ]}
                                    onChange={_handleCurGender}
                                    multiple={false}
                                />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className="form-group">
                                <label>Là chủ hộ</label>
                                <SelectBox
                                    id="select-head-house-hold-family"
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={[
                                        { text: 'Có', value: true },
                                        { text: 'Không', value: false }
                                    ]}
                                    onChange={_handleCurIsHeadHousehold}
                                    multiple={false}
                                />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className="form-group">
                                <label>Quan hệ với chủ hộ</label>
                                <input className="form-control" onChange={_handleCurRelationshipWithHeadHousehold} value={currentMember.relationshipWithHeadHousehold} />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className="form-group">
                                <label>Ngày sinh</label>
                                <input className="form-control" onChange={_handleCurBirth} value={currentMember.birth} />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className="form-group">
                                <label>CNSS</label>
                                <input className="form-control" onChange={_handleCurCnss} value={currentMember.cnss} />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className="form-group">
                                <label>Nơi cấp giấy khai sinh</label>
                                <input className="form-control" onChange={_handleCurPlaceOfBirthCertificate} value={currentMember.placeOfBirthCertificate} />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className="form-group">
                                <label>Quốc tịch</label>
                                <input className="form-control" onChange={_handleCurNationality} value={currentMember.nationality} />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className="form-group">
                                <label>Dân tộc</label>
                                <input className="form-control" onChange={_handleCurNation} value={currentMember.nation} />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className="form-group">
                                <label>Số CMND/Hộ chiếu</label>
                                <input className="form-control" onChange={_handleCurNumberPassport} value={currentMember.numberPassport} />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="form-group">
                                <label>Ghi chú</label>
                                <textarea className="form-control" onChange={_handleCurNote} value={currentMember.note} />
                            </div>
                        </div>
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    )
}

export default connect()(withTranslate(FamilyMemberModal));