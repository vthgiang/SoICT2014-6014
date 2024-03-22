import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { ApiImage } from '../../../../../common-components'

function GeneralTab(props) {
  const [state, setState] = useState({})

  /**
   * Function format dữ liệu Date thành string
   * @param {*} date : Ngày muốn format
   * @param {*} monthYear : true trả về tháng năm , false trả về ngày tháng năm
   */
  const formatDate = (date, monthYear = false) => {
    if (date) {
      let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()

      if (month.length < 2) month = '0' + month
      if (day.length < 2) day = '0' + day

      if (monthYear === true) {
        return [month, year].join('-')
      } else return [day, month, year].join('-')
    } else {
      return date
    }
  }

  useEffect(() => {
    setState((state) => {
      return {
        ...state,
        id: props.id,
        avatar: props.employee.avatar,
        employeeNumber: props.employee.employeeNumber,
        employeeTimesheetId: props.employee.employeeTimesheetId,
        fullName: props.employee.fullName,
        gender: props.employee.gender,
        birthdate: props.employee.birthdate,
        birthplace: props.employee.birthplace,
        emailInCompany: props.employee.emailInCompany,
        maritalStatus: props.employee.maritalStatus,
        identityCardNumber: props.employee.identityCardNumber,
        identityCardDate: props.employee.identityCardDate,
        identityCardAddress: props.employee.identityCardAddress,
        nationality: props.employee.nationality,
        ethnic: props.employee.ethnic,
        religion: props.employee.religion,
        status: props.employee.status,
        startingDate: props.employee.startingDate,
        leavingDate: props.employee.leavingDate,
        roles: props.roles,
        totalAnnualLeaves: props.totalAnnualLeaves
      }
    })
  }, [props.id])

  const { translate } = props

  const {
    id,
    avatar,
    employeeNumber,
    employeeTimesheetId,
    fullName,
    gender,
    birthdate,
    birthplace,
    status,
    roles,
    startingDate,
    leavingDate,
    emailInCompany,
    maritalStatus,
    identityCardNumber,
    identityCardDate,
    identityCardAddress,
    nationality,
    ethnic,
    religion,
    totalAnnualLeaves
  } = state

  return (
    <div id={id} className='tab-pane active'>
      <div className=' row box-body'>
        {/* Ảnh đại diện */}
        <div className='col-lg-4 col-md-4 col-ms-12 col-xs-12' style={{ textAlign: 'center' }}>
          <div>
            {avatar && (
              <ApiImage
                className='attachment-img'
                id={`avater-imform-${id}`}
                src={`.${avatar}`}
                style={{ width: '200px', height: '240px', border: '2px solid #ddd', cursor: 'pointer', objectFit: 'cover' }}
              />
            )}
          </div>
        </div>
        <div className='pull-right col-lg-8 col-md-8 col-ms-12 col-xs-12'>
          <div className='row'>
            {/* Mã nhân viên */}
            <div className='form-group col-lg-6 col-md-6 col-ms-6 col-xs-6'>
              <strong>{translate('human_resource.profile.staff_number')}&emsp; </strong>
              {employeeNumber}
            </div>
            {/* Mã chấm công */}
            <div className='form-group col-lg-6 col-md-6 col-ms-6 col-xs-6'>
              <strong>{translate('human_resource.profile.attendance_code')}&emsp; </strong>
              {employeeTimesheetId}
            </div>
          </div>
          <div className='row'>
            {/* Họ và tên nhân viên */}
            <div className='form-group col-lg-6 col-md-6 col-ms-6 col-xs-6'>
              <strong>{translate('human_resource.profile.full_name')}&emsp; </strong>
              {fullName}
            </div>
            {/* Giới tính */}
            <div className='form-group col-lg-6 col-md-6 col-ms-6 col-xs-6'>
              <strong>{translate('human_resource.profile.gender')}&emsp; </strong>
              {translate(`human_resource.profile.${gender}`)}
            </div>
          </div>
          <div className='row'>
            {/* Ngày sinh */}
            <div className='form-group col-lg-6 col-md-6 col-ms-6 col-xs-6'>
              <strong>{translate('human_resource.profile.date_birth')}&emsp; </strong>
              {formatDate(birthdate)}
            </div>
            {/* Nơi sinh */}
            <div className='form-group col-lg-6 col-md-6 col-ms-6 col-xs-6'>
              <strong>{translate('human_resource.profile.place_birth')}&emsp; </strong>
              {birthplace}
            </div>
          </div>
          <div className='row'>
            {/* Trạng thái*/}
            <div className='form-group col-lg-6 col-md-6 col-ms-6 col-xs-6'>
              <strong>{translate('general.status')}&emsp; </strong>
              {translate(`human_resource.profile.${status}`)}
            </div>
            {/* Chức vụ */}
            <div className='form-group col-lg-6 col-md-6 col-ms-6 col-xs-6'>
              <strong>{translate('page.position')}&emsp; </strong>
              {roles?.length !== 0 && roles?.map((x) => x.roleId.name).join(', ')}
            </div>
          </div>
          <div className='row'>
            {/* Email công ty */}
            <div className='form-group col-lg-6 col-md-6 col-ms-6 col-xs-6'>
              <strong>{translate('human_resource.profile.email_company')}&emsp; </strong>
              {emailInCompany}
            </div>
            {/* Tình trạng hôn nhân */}
            <div className='form-group col-lg-6 col-md-6 col-ms-6 col-xs-6'>
              <strong>{translate('human_resource.profile.relationship')}&emsp; </strong>
              {translate(`human_resource.profile.${maritalStatus}`)}
            </div>
          </div>
          <div className='row'>
            {/* Ngày bắt đầu làm việc*/}
            <div className='form-group col-lg-6 col-md-6 col-ms-6 col-xs-6'>
              <strong>{translate('human_resource.profile.starting_date')}&emsp; </strong>
              {formatDate(startingDate)}
            </div>
            {/*Ngày nghỉ việc */}
            <div className='form-group col-lg-6 col-md-6 col-ms-6 col-xs-6'>
              <strong>{translate('human_resource.profile.leaving_date')}&emsp; </strong>
              {formatDate(leavingDate)}
            </div>
          </div>

          <div className='row'>
            {/* Số chứng minh thư */}
            <div className='form-group col-lg-6 col-md-6 col-ms-6 col-xs-6'>
              <strong>{translate('human_resource.profile.id_card')}&emsp; </strong>
              {identityCardNumber}
            </div>
            {/* Ngày cấp */}
            <div className='form-group col-lg-6 col-md-6 col-ms-6 col-xs-6'>
              <strong>{translate('human_resource.profile.date_issued')}&emsp; </strong>
              {formatDate(identityCardDate)}
            </div>
          </div>
          <div className='row'>
            {/* Nơi cấp */}
            <div className='form-group col-lg-6 col-md-6 col-ms-6 col-xs-6'>
              <strong>{translate('human_resource.profile.issued_by')}&emsp; </strong>
              {identityCardAddress}
            </div>
            {/* Dân tộc */}
            <div className='form-group col-lg-6 col-md-6 col-ms-6 col-xs-6'>
              <strong>{translate('human_resource.profile.ethnic')}&emsp; </strong>
              {ethnic}
            </div>
          </div>
          <div className='row'>
            {/* Tôn giáo */}
            <div className='form-group col-lg-6 col-md-6 col-ms-6 col-xs-6'>
              <strong>{translate('human_resource.profile.religion')}&emsp; </strong>
              {religion}
            </div>
            {/* Quốc tịch */}
            <div className='form-group col-lg-6 col-md-6 col-ms-6 col-xs-6'>
              <strong>{translate('human_resource.profile.nationality')}&emsp; </strong>
              {nationality}
            </div>
          </div>
          {totalAnnualLeaves !== undefined && (
            <div className='row'>
              {/* Tôn giáo */}
              <div className='form-group col-lg-6 col-md-6 col-ms-6 col-xs-6'>
                <strong>{translate('human_resource.profile.hours_off_remaining')}&emsp; </strong>
                {totalAnnualLeaves}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const tabGeneral = connect(null, null)(withTranslate(GeneralTab))
export { tabGeneral as GeneralTab }
