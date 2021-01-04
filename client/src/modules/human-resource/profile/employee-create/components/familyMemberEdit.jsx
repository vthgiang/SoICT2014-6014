import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DatePicker, DialogModal } from '../../../../../common-components';
import { getFormatDateFromTime, getTimeFromFormatDate } from '../../../../../helpers/stringMethod';

const FamilyMemberEdit = ({
    tabEditMember,
    editMember,
    _save,
    translate
}) => {
    const [name, setName] = useState('');
    const [codeSocialInsurance, setCodeSocialInsurance] = useState('');
    const [bookNumberSocialInsurance, setBookNumberSocialInsurance] = useState('');
    const [gender, setGender] = useState('male');
    const [isHeadHousehold, setIsHeadHousehold] = useState('no');
    const [relationshipWithHeadHousehold, setRelationshipWithHeadHousehold] = useState('');
    const [cnss, setCnss] = useState('');
    const [birth, setBirth] = useState('');
    const [placeOfBirthCertificate, setPlaceOfBirthCertificate] = useState('');
    const [nationality, setNationality] = useState('');
    const [nation, setNation] = useState('');
    const [numberPassport, setNumberPassport] = useState('');
    const [note, setNote] = useState('');

    const _handleCurName = (e) => {
        let { value } = e.target;
        setName(value)
    }

    const _handleCurCodeSocialInsurance = (e) => {
        let { value } = e.target;
        setCodeSocialInsurance(value)
    }

    const _handleCurBookNumberSocialInsurance = (e) => {
        let { value } = e.target;
        setBookNumberSocialInsurance(value)
    }

    const _handleCurGender = (e) => {
        let { value } = e.target;
        setGender(value)
    }

    const _handleCurIsHeadHousehold = (e) => {
        let { value } = e.target;
        setIsHeadHousehold(value);
    }

    const _handleCurRelationshipWithHeadHousehold = (e) => {
        let { value } = e.target;
        setRelationshipWithHeadHousehold(value)
    }

    const _handleCurBirth = (value) => {
        setBirth(value)
    }

    const _handleCurCnss = (e) => {
        let { value } = e.target;
        setCnss(value)
    }

    const _handleCurPlaceOfBirthCertificate = (e) => {
        let { value } = e.target;
        setPlaceOfBirthCertificate(value)
    }

    const _handleCurNationality = (e) => {
        let { value } = e.target;
        setNationality(value)
    }


    const _handleCurNation = (e) => {
        let { value } = e.target;
        setNation(value)
    }

    const _handleCurNumberPassport = (e) => {
        let { value } = e.target;
        setNumberPassport(value)
    }

    const _handleCurNote = (e) => {
        let { value } = e.target;
        setNote(value)
    }

    const _editMember = () => {
        const member = {
            name,
            codeSocialInsurance,
            bookNumberSocialInsurance,
            gender,
            isHeadHousehold,
            relationshipWithHeadHousehold,
            cnss,
            birth: getTimeFromFormatDate(birth, 'dd-mm-yyyy'),
            placeOfBirthCertificate,
            nationality,
            nation,
            numberPassport,
            note
        }
        _save(editMember.index, member);
    }

    useEffect(() => {
        setName(editMember.name)
        setCodeSocialInsurance(editMember.codeSocialInsurance)
        setBookNumberSocialInsurance(editMember.bookNumberSocialInsurance)
        setGender(editMember.gender)
        setIsHeadHousehold(editMember.isHeadHousehold)
        setRelationshipWithHeadHousehold(editMember.relationshipWithHeadHousehold)
        setCnss(editMember.cnss)
        setBirth(getFormatDateFromTime(editMember.birth, 'dd-mm-yyyy'))
        setPlaceOfBirthCertificate(editMember.placeOfBirthCertificate)
        setNationality(editMember.nationality)
        setNation(editMember.nation)
        setNumberPassport(editMember.numberPassport)
        setNote(editMember.note)
    }, [editMember.index])

    return (
        <React.Fragment>
            <DialogModal
                modalID={tabEditMember}
                formID="form-edit-family-members"
                title={translate('human_resource.profile.house_hold.edit')}
                func={_editMember} size={100}
            >
                <form id="form-add-family-members">
                    <div className="row">
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className="form-group">
                                <label>{translate('human_resource.profile.house_hold.members.name')}</label>
                                <input className="form-control" onChange={_handleCurName} value={name} />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className="form-group">
                                <label>{translate('human_resource.profile.house_hold.members.code_social_insurance')}</label>
                                <input className="form-control" onChange={_handleCurCodeSocialInsurance} value={codeSocialInsurance} />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className="form-group">
                                <label>{translate('human_resource.profile.house_hold.members.book_nci')}</label>
                                <input className="form-control" onChange={_handleCurBookNumberSocialInsurance} value={bookNumberSocialInsurance} />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className="form-group">
                                <label>{translate('human_resource.profile.house_hold.members.is_hh')}</label>
                                <div>
                                    <div className="radio-inline">
                                        <label>
                                            <input type="radio" value="yes" onChange={_handleCurIsHeadHousehold}
                                                checked={isHeadHousehold === 'yes' ? true : false} />&nbsp;&nbsp; Có</label>
                                    </div>
                                    <div className="radio-inline">
                                        <label>
                                            <input type="radio" value="no" onChange={_handleCurIsHeadHousehold}
                                                checked={isHeadHousehold === 'no' ? true : false} />&nbsp;&nbsp; Không</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className="form-group">
                                <label>{translate('human_resource.profile.house_hold.members.rwhh')}</label>
                                <input className="form-control" onChange={_handleCurRelationshipWithHeadHousehold} value={relationshipWithHeadHousehold} />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className="form-group ">
                                <label>{translate('human_resource.profile.house_hold.members.gender')}</label>
                                <div>
                                    <div className="radio-inline">
                                        <label>
                                            <input type="radio" value="male" onChange={_handleCurGender}
                                                checked={gender === "male" ? true : false} />&nbsp;&nbsp;{translate('human_resource.profile.male')}</label>
                                    </div>
                                    <div className="radio-inline">
                                        <label>
                                            <input type="radio" value="female" onChange={_handleCurGender}
                                                checked={gender === "female" ? true : false} />&nbsp;&nbsp;{translate('human_resource.profile.female')}</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className="form-group">
                                <label>{translate('human_resource.profile.house_hold.members.birth')}</label>
                                <DatePicker
                                    id="edit-member-birthday"
                                    value={birth}
                                    onChange={_handleCurBirth}
                                />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className="form-group">
                                <label>{translate('human_resource.profile.house_hold.members.cnss')}</label>
                                <input className="form-control" onChange={_handleCurCnss} value={cnss} />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className="form-group">
                                <label>{translate('human_resource.profile.house_hold.members.pob')}</label>
                                <input className="form-control" onChange={_handleCurPlaceOfBirthCertificate} value={placeOfBirthCertificate} />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className="form-group">
                                <label>{translate('human_resource.profile.house_hold.members.nationality')}</label>
                                <input className="form-control" onChange={_handleCurNationality} value={nationality} />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className="form-group">
                                <label>{translate('human_resource.profile.house_hold.members.nation')}</label>
                                <input className="form-control" onChange={_handleCurNation} value={nation} />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className="form-group">
                                <label>{translate('human_resource.profile.house_hold.members.npp')}</label>
                                <input className="form-control" onChange={_handleCurNumberPassport} value={numberPassport} />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="form-group">
                                <label>{translate('human_resource.profile.house_hold.members.note')}</label>
                                <textarea className="form-control" onChange={_handleCurNote} value={note} />
                            </div>
                        </div>
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    )
}

export default connect()(withTranslate(FamilyMemberEdit));