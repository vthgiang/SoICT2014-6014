import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DialogModal, ButtonModal, ErrorLabel, DatePicker, UploadFile, SelectBox } from '../../../../../common-components'
import { UploadFileHook } from '../../../../../common-components/src/upload-file/uploadFileHook'

import ValidationHelper from '../../../../../helpers/validationHelper'

function CertificateAddModal(props) {
  /**
   * Function format ngày hiện tại thành dạnh mm-yyyy
   * @param {*} date : Ngày muốn format
   */
  const formatDate = (date) => {
    if (date) {
      let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()

      if (month.length < 2) month = '0' + month
      if (day.length < 2) day = '0' + day

      return [day, month, year].join('-')
    }
    return date
  }

  const [state, setState] = useState({
    certificate: '',
    startDate: formatDate(Date.now()),
    endDate: '',
    name: '',
    issuedBy: '',
    urlFile: '',
    fileUpload: '',
    file: ''
  })

  const { translate } = props

  const { id } = props

  const { issuedBy, endDate, startDate, files, errorOnName, errorOnUnit, errorOnEndDate, errorOnStartDate, certificate } = state
  let listFields = props.field.listFields
  let listMajor = props.major.listMajor
  let listCertificates = props.certificate.listCertificate

  /** Bắt sự kiện thay đổi file đính kèm */
  const handleChangeFile = (value) => {
    if (value.length !== 0) {
      setState((state) => {
        return {
          ...state,
          files: value,
          file: value[0].fileName,
          urlFile: value[0].urlFile,
          fileUpload: value[0].fileUpload
        }
      })
    } else {
      setState((state) => {
        return {
          ...state,
          files: undefined,
          file: '',
          urlFile: '',
          fileUpload: ''
        }
      })
    }
  }

  /** Bắt sự kiên thay đổi chứng chỉ */
  const handleCertificateChange = (value) => {
    setState({
      ...state,
      certificate: value[0]
    })
  }

  const validateCertificate = (value, willUpdateState = true) => {
    const { translate } = props
    let { message } = ValidationHelper.validateEmpty(translate, value)

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnName: message,
          name: value
        }
      })
    }
    return message === undefined
  }

  /** Bắt sự kiện thay đổi nơi cấp */
  const handleIssuedByChange = (e) => {
    let { value } = e.target
    validateIssuedByCertificate(value, true)
  }

  const validateIssuedByCertificate = (value, willUpdateState = true) => {
    const { translate } = props
    let { message } = ValidationHelper.validateEmpty(translate, value)

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnUnit: message,
          issuedBy: value
        }
      })
    }
    return message === undefined
  }

  /**
   * Bắt sự kiện thay đổi ngày cấp
   * @param {*} value : Ngày cấp
   */
  const handleStartDateChange = (value) => {
    const { translate } = props
    let { errorOnEndDate, endDate } = state

    let errorOnStartDate
    let partValue = value.split('-')
    let date = new Date([partValue[2], partValue[1], partValue[0]].join('-'))

    let partEndDate = endDate.split('-')
    let d = new Date([partEndDate[2], partEndDate[1], partEndDate[0]].join('-'))

    if (date.getTime() > d.getTime()) {
      errorOnStartDate = translate('human_resource.profile.start_date_before_end_date')
    } else {
      errorOnEndDate = undefined
    }

    setState((state) => {
      return {
        ...state,
        startDate: value,
        errorOnStartDate: errorOnStartDate,
        errorOnEndDate: errorOnEndDate
      }
    })
  }

  /**
   * Bắt sự kiện thay đổi ngày hết hạn
   * @param {*} value : Ngày hết hạn
   */
  const handleEndDateChange = (value) => {
    const { translate } = props
    let { startDate, errorOnStartDate } = state

    let errorOnEndDate
    let partValue = value.split('-')
    let date = new Date([partValue[2], partValue[1], partValue[0]].join('-'))

    let partStartDate = startDate.split('-')
    let d = new Date([partStartDate[2], partStartDate[1], partStartDate[0]].join('-'))

    if (d.getTime() > date.getTime()) {
      errorOnEndDate = translate('human_resource.profile.end_date_after_start_date')
    } else {
      errorOnStartDate = undefined
    }

    setState((state) => {
      return {
        ...state,
        endDate: value,
        errorOnStartDate: errorOnStartDate,
        errorOnEndDate: errorOnEndDate
      }
    })
  }

  /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form */
  const isFormValidated = () => {
    const { certificate, issuedBy, startDate, endDate } = state
    let result = validateCertificate(certificate, false) && validateIssuedByCertificate(issuedBy, false)
    let partStart = startDate.split('-')
    let startDateNew = [partStart[2], partStart[1], partStart[0]].join('-')
    if (endDate) {
      let partEnd = endDate.split('-')
      let endDateNew = [partEnd[2], partEnd[1], partEnd[0]].join('-')
      if (new Date(startDateNew).getTime() <= new Date(endDateNew).getTime()) {
        return result
      } else return false
    } else {
      return result
    }
  }

  /** Bắt sự kiện submit form */
  const save = async () => {
    const { startDate, endDate } = state
    let partStart = startDate.split('-')
    let startDateNew = [partStart[2], partStart[1], partStart[0]].join('-')
    let endDateNew = null
    if (endDate) {
      let partEnd = endDate.split('-')
      endDateNew = [partEnd[2], partEnd[1], partEnd[0]].join('-')
    }
    if (isFormValidated()) {
      return props.handleChange({ ...state, startDate: startDateNew, endDate: endDateNew })
    }
  }

  return (
    <React.Fragment>
      <ButtonModal
        modalID={`modal-create-certificateShort-${id}`}
        button_name={translate('modal.create')}
        title={translate('human_resource.profile.add_certificate')}
      />
      <DialogModal
        size='50'
        modalID={`modal-create-certificateShort-${id}`}
        isLoading={false}
        formID={`form-create-certificateShort-${id}`}
        title={translate('human_resource.profile.add_certificate')}
        func={save}
        resetOnSave={true}
        resetOnClose={true}
        afterClose={() => {
          setState((state) => ({
            ...state,
            certificate: '',
            startDate: formatDate(Date.now()),
            endDate: '',
            name: '',
            issuedBy: '',
            files: undefined,
            file: '',
            urlFile: '',
            fileUpload: ''
          }))
        }}
        disableSubmit={!isFormValidated()}
      >
        <form className='form-group' id={`form-create-certificateShort-${id}`}>
          {/* Chọn chứng chỉ */}
          <div className={`form-group ${errorOnName && 'has-error'}`}>
            <label>
              Chọn chứng chỉ<span className='text-red'>*</span>
              <a href='/hr-list-certificate' target='_blank'>
                {' '}
                (Quản lý){' '}
              </a>
            </label>
            <SelectBox
              id={`create-degree-field${id}`}
              className='form-control select2'
              style={{ width: '100%' }}
              value={certificate}
              items={[
                { value: '', text: 'Chọn chứng chỉ' },
                ...listCertificates.map((y) => {
                  return { value: y._id, text: y.name + ' (' + y.abbreviation + ')' }
                })
              ]}
              onChange={handleCertificateChange}
            />
          </div>
          {/* Nơi cấp */}
          <div className={`form-group ${errorOnUnit && 'has-error'}`}>
            <label>
              {translate('human_resource.profile.issued_by')}
              <span className='text-red'>*</span>
            </label>
            <input
              type='text'
              className='form-control'
              name='issuedBy'
              value={issuedBy}
              onChange={handleIssuedByChange}
              autoComplete='off'
            />
            <ErrorLabel content={errorOnUnit} />
          </div>
          <div className='row'>
            {/* Ngày cấp */}
            <div className={`form-group col-sm-6 col-xs-12 ${errorOnStartDate && 'has-error'}`}>
              <label>
                {translate('human_resource.profile.date_issued')}
                <span className='text-red'>*</span>
              </label>
              <DatePicker id={`add-start-date-${id}`} deleteValue={false} value={startDate} onChange={handleStartDateChange} />
              <ErrorLabel content={errorOnStartDate} />
            </div>
            {/* Ngày hết hạn */}
            <div className={`form-group col-sm-6 col-xs-12 ${errorOnEndDate && 'has-error'}`}>
              <label>{translate('human_resource.profile.end_date_certificate')}</label>
              <DatePicker id={`add-end-date-${id}`} deleteValue={true} value={endDate} onChange={handleEndDateChange} />
              <ErrorLabel content={errorOnEndDate} />
            </div>
          </div>
          {/* File đính kèm */}
          <div className='form-group'>
            <label htmlFor='file'>{translate('human_resource.profile.attached_files')}</label>
            <UploadFileHook value={files} onChange={handleChangeFile} deleteValue={true} />
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

function mapState(state) {
  const { field, major, certificate } = state
  return { field, major, certificate }
}

const addModal = connect(mapState, null)(withTranslate(CertificateAddModal))
export { addModal as CertificateAddModal }
