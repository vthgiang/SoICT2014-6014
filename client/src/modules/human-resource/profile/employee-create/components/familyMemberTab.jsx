import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import { DataTableSetting, DialogModal, ButtonModal, DateTimeConverter, ConfirmNotification } from '../../../../../common-components'
import FamilyMemberEdit from './familyMemberEdit'
import FamilyMemberCreate from './familyMemberCreate'

const FamilyMemberTab = ({
  houseHold,
  _fm_deleteMember,
  id,
  translate,
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
  _fm_editMember
}) => {
  const [employeeHouseHold, setEmployeeHoldHouse] = useState({
    headHouseHoldName: '',
    documentType: '',
    houseHoldNumber: '',
    city: '',
    district: '',
    ward: '',
    houseHoldAddress: '',
    phone: '',
    houseHoldCode: '',
    memberEdit: ''
  })

  const _showMemberGender = (gender) => {
    switch (gender) {
      case 'male':
        return 'Nam'
      case 'female':
        return 'Nữ'
      default:
        return ''
    }
  }

  const _showIsHeadHouseHold = (headHouseHold) => {
    switch (headHouseHold) {
      case 'yes':
        return 'Có'
      case 'no':
        return 'Không'
      default:
        return ''
    }
  }

  const _deleteMember = (index) => {
    _fm_deleteMember(index)
  }

  // mở modal form tạo mới thông tin nhan viên
  const _openModalAddFamilyMemberCreateForm = () => {
    window.$(`#form-add-family-members-${id}`).modal('show') // hiển thị form thành viên hộ gia đình
  }

  const _fm_openEditFamilyMemberModal = async (index, member) => {
    await setEmployeeHoldHouse({
      ...employeeHouseHold,
      memberEdit: {
        ...member,
        index
      }
    })
    window.$(`#form-edit-family-members-${id}`).modal('show')
  }

  useEffect(() => {
    setEmployeeHoldHouse(houseHold)
  }, [JSON.stringify(houseHold)])

  return (
    <div id={id} className='tab-pane'>
      <div className='box-body'>
        <fieldset className='scheduler-border' style={{ margin: '10px 20px' }}>
          <legend className='scheduler-border'>
            <h4 className='box-title'>{translate('human_resource.profile.house_hold.appendix.title')}</h4>
          </legend>
          <div className='row'>
            {/* họ và tên chủ hộ */}
            <div className='form-group col-md-4'>
              <label>{translate('human_resource.profile.house_hold.appendix.head_house_hold_name')}</label>
              <input
                type='text'
                className='form-control'
                onChange={_fm_handleHeadHouseHoldName}
                value={employeeHouseHold.headHouseHoldName ? employeeHouseHold.headHouseHoldName : ''}
              />
            </div>
            {/* Loại giấy tờ */}
            <div className='form-group col-md-4'>
              <label>{translate('human_resource.profile.house_hold.appendix.document_type')}</label>
              <input
                type='text'
                className='form-control'
                onChange={_fm_handleDocumentType}
                value={employeeHouseHold.documentType ? employeeHouseHold.documentType : ''}
              />
            </div>
            {/* Số sổ hộ khẩu */}
            <div className='form-group col-md-4'>
              <label>{translate('human_resource.profile.house_hold.appendix.house_hold_number')}</label>
              <input
                type='text'
                className='form-control'
                onChange={_fm_handleHouseHoldNumber}
                value={employeeHouseHold.houseHoldNumber ? employeeHouseHold.houseHoldNumber : ''}
              />
            </div>

            {/* Tỉnh/TP */}
            <div className='form-group col-md-4'>
              <label>{translate('human_resource.profile.house_hold.appendix.city')}</label>
              <input
                type='text'
                className='form-control'
                onChange={_fm_handleCity}
                value={employeeHouseHold.city ? employeeHouseHold.city : ''}
              />
            </div>
            {/* Loại giấy tờ */}
            <div className='form-group col-md-4'>
              <label>{translate('human_resource.profile.house_hold.appendix.district')}</label>
              <input
                type='text'
                className='form-control'
                onChange={_fm_handleDistrict}
                value={employeeHouseHold.district ? employeeHouseHold.district : ''}
              />
            </div>
            {/* Số sổ hộ khẩu */}
            <div className='form-group col-md-4'>
              <label>{translate('human_resource.profile.house_hold.appendix.ward')}</label>
              <input
                type='text'
                className='form-control'
                onChange={_fm_handleWard}
                value={employeeHouseHold.ward ? employeeHouseHold.ward : ''}
              />
            </div>

            {/* Địa chỉ hộ khẩu */}
            <div className='form-group col-md-4'>
              <label>{translate('human_resource.profile.house_hold.appendix.house_hold_address')}</label>
              <input
                type='text'
                className='form-control'
                onChange={_fm_handleHouseHoldAddress}
                value={employeeHouseHold.houseHoldAddress ? employeeHouseHold.houseHoldAddress : ''}
              />
            </div>
            {/* Số điện thoại */}
            <div className='form-group col-md-4'>
              <label>{translate('human_resource.profile.house_hold.appendix.phone')}</label>
              <input
                type='text'
                className='form-control'
                onChange={_fm_handlePhone}
                value={employeeHouseHold.phone ? employeeHouseHold.phone : ''}
              />
            </div>
            {/* Số sổ hộ khẩu */}
            <div className='form-group col-md-4'>
              <label>{translate('human_resource.profile.house_hold.appendix.house_hold_code')}</label>
              <input
                type='text'
                className='form-control'
                onChange={_fm_handleHouseHoldCode}
                value={employeeHouseHold.houseHoldCode ? employeeHouseHold.houseHoldCode : ''}
              />
            </div>
          </div>
        </fieldset>

        <fieldset className='scheduler-border' style={{ margin: '10px 20px' }}>
          <legend className='scheduler-border'>
            <h4 className='box-title'>{translate('human_resource.profile.house_hold.members.title')}</h4>
          </legend>
          <button
            className='btn btn-success pull-right'
            style={{ cursor: 'pointer', marginBottom: '10px' }}
            onClick={_openModalAddFamilyMemberCreateForm}
          >
            {translate('general.add')}
          </button>

          {/* Modal cho form thêm mới thông tin nhân viên */}
          <FamilyMemberCreate _save={_fm_saveMember} id={id} />

          {employeeHouseHold.memberEdit && <FamilyMemberEdit id={id} editMember={employeeHouseHold.memberEdit} _save={_fm_editMember} />}

          {/* Bảng danh sách thông tin các thành viên trong hộ gia đình */}
          <div id='container-employee-family-member' className='row'>
            <table className='table table-hover table-striped table-bordered' id='table-employee-family-member' style={{ marginBottom: 0 }}>
              <thead>
                <tr>
                  <th className='not-sort' style={{ width: 20 }}>
                    {translate('human_resource.profile.house_hold.members.stt')}
                  </th>
                  <th className='not-sort'>{translate('human_resource.profile.house_hold.members.name')}</th>
                  <th className='not-sort'>{translate('human_resource.profile.house_hold.members.code_social_insurance')}</th>
                  <th className='not-sort'>{translate('human_resource.profile.house_hold.members.book_nci')}</th>
                  <th className='not-sort'>{translate('human_resource.profile.house_hold.members.gender')}</th>
                  <th className='not-sort'>{translate('human_resource.profile.house_hold.members.is_hh')}</th>
                  <th className='not-sort'>{translate('human_resource.profile.house_hold.members.rwhh')}</th>
                  <th className='not-sort'>{translate('human_resource.profile.house_hold.members.ccns')}</th>
                  <th className='not-sort'>{translate('human_resource.profile.house_hold.members.birth')}</th>
                  <th className='not-sort'>{translate('human_resource.profile.house_hold.members.pob')}</th>
                  <th className='not-sort'>{translate('human_resource.profile.house_hold.members.nationality')}</th>
                  <th className='not-sort'>{translate('human_resource.profile.house_hold.members.nation')}</th>
                  <th className='not-sort'>{translate('human_resource.profile.house_hold.members.npp')}</th>
                  <th className='not-sort'>{translate('human_resource.profile.house_hold.members.note')}</th>
                  <th className='not-sort'>
                    {translate('general.action')}
                    <DataTableSetting
                      tableId='table-employee-family-member'
                      tableContainerId='container-employee-family-member'
                      tableWidt={1500}
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {houseHold.familyMembers.map((member, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{member.name}</td>
                    <td>{member.codeSocialInsurance}</td>
                    <td>{member.bookNumberSocialInsurance}</td>
                    <td>{_showMemberGender(member.gender)}</td>
                    <td>{_showIsHeadHouseHold(member.isHeadHousehold)}</td>
                    <td>{member.relationshipWithHeadHousehold}</td>
                    <td>{member.ccns}</td>
                    <td> {member.birth ? <DateTimeConverter dateTime={member.birth} type='DD-MM-YYYY' /> : null}</td>
                    <td>{member.placeOfBirthCertificate}</td>
                    <td>{member.nationality}</td>
                    <td>{member.nation}</td>
                    <td>{member.numberPassport}</td>
                    <td>{member.note}</td>
                    <td>
                      <a className='text-orange' onClick={() => _fm_openEditFamilyMemberModal(index, member)}>
                        <i className='material-icons'>edit</i>
                      </a>
                      <ConfirmNotification
                        icon='question'
                        title={translate('human_resource.profile.house_hold.delete')}
                        content={translate('human_resource.profile.house_hold.delete')}
                        name='delete'
                        className='text-red'
                        func={() => _deleteMember(index)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {houseHold.familyMembers.length === 0 && <div className='table-info-panel'>{translate('confirm.no_data')}</div>}
          </div>
        </fieldset>
      </div>
    </div>
  )
}

export default connect()(withTranslate(FamilyMemberTab))
