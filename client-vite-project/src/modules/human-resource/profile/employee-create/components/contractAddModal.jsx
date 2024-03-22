import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DialogModal, ButtonModal, ErrorLabel, DatePicker, UploadFile } from '../../../../../common-components'
import ValidationHelper from '../../../../../helpers/validationHelper'

function ContractAddModal(props) {
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
    contractNumber: '',
    name: '',
    contractType: '',
    startDate: formatDate(Date.now()),
    endDate: '',
    file: '',
    urlFile: '',
    fileUpload: ''
  })

  const { translate } = props

  const { id } = props

  const {
    contractNumber,
    name,
    contractType,
    startDate,
    endDate,
    errorOnNumberContract,
    errorOnNameContract,
    errorOnTypeContract,
    errorOnStartDate,
    errorOnEndDate
  } = state

  /** Bắt sự kiện thay đổi file đính kèm */
  const handleChangeFile = (value) => {
    if (value.length !== 0) {
      setState((state) => {
        return {
          ...state,
          file: value[0].fileName,
          urlFile: value[0].urlFile,
          fileUpload: value[0].fileUpload
        }
      })
    } else {
      setState((state) => {
        return {
          ...state,
          file: '',
          urlFile: '',
          fileUpload: ''
        }
      })
    }
  }

  /** Bắt sự kiện thay đổi tên hợp đồng lao động */
  const handleNameContract = (e) => {
    let { value } = e.target
    const { translate } = props
    let { message } = ValidationHelper.validateEmpty(translate, value)

    setState((state) => {
      return {
        ...state,
        errorOnNameContract: message,
        name: value
      }
    })
  }

  /** Bắt sự kiện thay đổi loại hợp đồng lao động */
  const handleTypeContract = (e) => {
    let { value } = e.target
    const { translate } = props
    let { message } = ValidationHelper.validateEmpty(translate, value)

    setState((state) => {
      return {
        ...state,
        errorOnTypeContract: message,
        contractType: value
      }
    })
  }

  /**
   * Bắt sự kiện thay đổi ngày có hiệu lực
   * @param {*} value
   */
  const handleStartDateChange = (value) => {
    const { translate } = props
    let { errorOnEndDate, endDate } = state

    let errorOnStartDate
    if (!value) errorOnStartDate = translate('general.validate.empty_error')
    let partValue = value.split('-')
    let date = new Date([partValue[2], partValue[1], partValue[0]].join('-'))

    let partEndDate = endDate.split('-')
    let d = new Date([partEndDate[2], partEndDate[1], partEndDate[0]].join('-'))

    if (date.getTime() > d.getTime()) {
      errorOnStartDate = translate('human_resource.commendation_discipline.discipline.start_date_before_end_date')
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
   * Bắt sự kiện thay đổi ngày hết hiệu lực
   * @param {*} value : Ngày hết hiệu lực
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
      errorOnEndDate = translate('human_resource.commendation_discipline.discipline.end_date_after_start_date')
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

  const handleNumberContract = (e) => {
    const { translate } = props
    const { value } = e.target
    const { message } = ValidationHelper.validateEmpty(translate, value)
    setState({
      ...state,
      contractNumber: value,
      errorOnNumberContract: message
    })
  }

  /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form */
  const isFormValidated = () => {
    const { name, contractType, startDate, endDate, contractNumber } = state
    let result = name && contractType && contractNumber && startDate
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
      props.handleChange({ ...state, startDate: startDateNew, endDate: endDateNew })
    }
  }

  return (
    <React.Fragment>
      <ButtonModal
        modalID={`modal-create-contract-${id}`}
        button_name={translate('modal.create')}
        title={translate('human_resource.profile.add_contract')}
      />
      <DialogModal
        size='50'
        modalID={`modal-create-contract-${id}`}
        isLoading={false}
        formID={`form-create-contract-${id}`}
        title={translate('human_resource.profile.add_contract')}
        func={save}
        disableSubmit={!isFormValidated()}
      >
        <form className='form-group' id={`form-create-contract-${id}`}>
          {/* Số hợp đồng */}
          <div className={`form-group ${errorOnNumberContract && 'has-error'}`}>
            <label>
              {translate('human_resource.profile.number_contract')}
              <span className='text-red'>*</span>
            </label>
            <input type='text' className='form-control' value={contractNumber} onChange={handleNumberContract} autoComplete='off' />
            <ErrorLabel content={errorOnNumberContract} />
          </div>
          {/* Tên hợp đồng */}
          <div className={`form-group ${errorOnNameContract && 'has-error'}`}>
            <label>
              {translate('human_resource.profile.name_contract')}
              <span className='text-red'>*</span>
            </label>
            <input type='text' className='form-control' name='name' value={name} onChange={handleNameContract} autoComplete='off' />
            <ErrorLabel content={errorOnNameContract} />
          </div>
          {/* Loại hợp đồng */}
          <div className={`form-group ${errorOnTypeContract && 'has-error'}`}>
            <label>
              {translate('human_resource.profile.type_contract')}
              <span className='text-red'>*</span>
            </label>
            <input
              type='text'
              className='form-control'
              name='contractType'
              value={contractType}
              onChange={handleTypeContract}
              autoComplete='off'
            />
            <ErrorLabel content={errorOnTypeContract} />
          </div>
          <div className='row'>
            {/* Ngày có hiệu lực */}
            <div className={`form-group col-sm-6 col-xs-12 ${errorOnStartDate && 'has-error'}`}>
              <label>
                {translate('human_resource.profile.start_date')}
                <span className='text-red'>*</span>
              </label>
              <DatePicker id={`add-start-date-${id}`} deleteValue={false} value={startDate} onChange={handleStartDateChange} />
              <ErrorLabel content={errorOnStartDate} />
            </div>
            {/* Ngày hết hiệu lực */}
            <div className={`form-group col-sm-6 col-xs-12 ${errorOnEndDate && 'has-error'}`}>
              <label>{translate('human_resource.profile.end_date_certificate')}</label>
              <DatePicker id={`add-end-date-${id}`} deleteValue={true} value={endDate} onChange={handleEndDateChange} />
              <ErrorLabel content={errorOnEndDate} />
            </div>
          </div>
          {/* File đính kèm */}
          <div className='form-group'>
            <label htmlFor='file'>{translate('human_resource.profile.attached_files')}</label>
            <UploadFile onChange={handleChangeFile} />
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

const addModal = connect(null, null)(withTranslate(ContractAddModal))
export { addModal as ContractAddModal }
