import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DialogModal, ButtonModal, ErrorLabel, DatePicker } from '../../../../../common-components'

import ValidationHelper from '../../../../../helpers/validationHelper'

function SocialInsuranceAddModal(props) {
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

      return [month, year].join('-')
    }
    return date
  }

  const [state, setState] = useState({
    company: '',
    startDate: formatDate(Date.now()),
    endDate: formatDate(Date.now()),
    position: '',
    money: ''
  })

  const { translate } = props

  const { id } = props

  const { company, position, startDate, endDate, money, errorOnMoney, errorOnStartDate, errorOnEndDate, errorOnUnit, errorOnPosition } =
    state

  /** Bắt sự kiện thay đổi đơn vị công tác */
  const handleUnitChange = (e) => {
    let { value } = e.target
    validateExperienceUnit(value, true)
  }

  const validateExperienceUnit = (value, willUpdateState = true) => {
    const { translate } = props
    let { message } = ValidationHelper.validateEmpty(translate, value)

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnUnit: message,
          company: value
        }
      })
    }
    return message === undefined
  }

  /** Bắt sự kiện thay đổi chức vụ */
  const handlePositionChange = (e) => {
    let { value } = e.target
    validateExperiencePosition(value, true)
  }

  const validateExperiencePosition = (value, willUpdateState = true) => {
    const { translate } = props
    let { message } = ValidationHelper.validateEmpty(translate, value)

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnPosition: message,
          position: value
        }
      })
    }
    return message === undefined
  }

  /** Bắt sự kiện thay đổi mức lương đóng */
  const handleMoneyChange = (e) => {
    let { value } = e.target
    validateMoney(value, true)
  }

  const validateMoney = (value, willUpdateState = true) => {
    const { translate } = props
    let { message } = ValidationHelper.validateEmpty(translate, value.toString())

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnMoney: message,
          money: value
        }
      })
    }
    return message === undefined
  }

  /**
   * Function lưu thay đổi "từ tháng/năm" vào state
   * @param {*} value : Từ tháng
   */
  const handleStartDateChange = (value) => {
    const { translate } = props
    let { errorOnEndDate, endDate } = state

    let errorOnStartDate
    let partValue = value.split('-')
    let date = new Date([partValue[1], partValue[0], 1].join('-'))

    let partEndDate = endDate.split('-')
    let d = new Date([partEndDate[1], partEndDate[0], 1].join('-'))

    if (date.getTime() > d.getTime()) {
      errorOnStartDate = translate('human_resource.profile.start_month_before_end_month')
    } else {
      errorOnEndDate = undefined
    }

    setState({
      ...state,
      startDate: value,
      errorOnStartDate: errorOnStartDate,
      errorOnEndDate: errorOnEndDate
    })
  }

  /**
   * Function lưu thay đổi "đến tháng/năm" vào state
   * @param {*} value : Đến tháng
   */
  const handleEndDateChange = (value) => {
    const { translate } = props
    let { startDate, errorOnStartDate } = state

    let partValue = value.split('-')
    let date = new Date([partValue[1], partValue[0], 1].join('-'))

    let partStartDate = startDate.split('-')
    let d = new Date([partStartDate[1], partStartDate[0], 1].join('-'))
    let errorOnEndDate

    if (d.getTime() > date.getTime()) {
      errorOnEndDate = translate('human_resource.profile.end_month_after_start_month')
    } else {
      errorOnStartDate = undefined
    }

    setState({
      ...state,
      endDate: value,
      errorOnStartDate: errorOnStartDate,
      errorOnEndDate: errorOnEndDate
    })
  }

  /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form */
  const isFormValidated = () => {
    const { company, startDate, endDate, position, money } = state

    let result = validateExperienceUnit(company, false) && validateExperiencePosition(position, false) && validateMoney(money, false)
    let partStart = startDate.split('-')
    let startDateNew = [partStart[1], partStart[0]].join('-')
    let partEnd = endDate.split('-')
    let endDateNew = [partEnd[1], partEnd[0]].join('-')

    if (new Date(startDateNew).getTime() <= new Date(endDateNew).getTime()) {
      return result
    } else return false
  }

  /** Bắt sự kiện submit form */
  const save = async () => {
    const { endDate, startDate } = state

    let partStart = startDate.split('-')
    let startDateNew = [partStart[1], partStart[0]].join('-')
    let partEnd = endDate.split('-')
    let endDateNew = [partEnd[1], partEnd[0]].join('-')

    if (isFormValidated()) {
      return props.handleChange({ ...state, startDate: startDateNew, endDate: endDateNew })
    }
  }

  return (
    <React.Fragment>
      <ButtonModal
        modalID={`modal-create-BHXH-${id}`}
        button_name={translate('modal.create')}
        title={translate('human_resource.profile.add_bhxh')}
      />
      <DialogModal
        size='50'
        modalID={`modal-create-BHXH-${id}`}
        isLoading={false}
        formID={`form-create-BHXH-${id}`}
        title={translate('human_resource.profile.add_bhxh')}
        func={save}
        disableSubmit={!isFormValidated()}
      >
        <form className='form-group' id={`form-create-BHXH-${id}`}>
          {/* Đơn vị */}
          <div className={`form-group ${errorOnUnit && 'has-error'}`}>
            <label>
              {translate('human_resource.profile.unit')}
              <span className='text-red'>*</span>
            </label>
            <input type='text' className='form-control' name='company' value={company} onChange={handleUnitChange} autoComplete='off' />
            <ErrorLabel content={errorOnUnit} />
          </div>
          <div className='row'>
            {/* Từ tháng */}
            <div className={`form-group col-sm-6 col-xs-12 ${errorOnStartDate && 'has-error'}`}>
              <label>
                {translate('human_resource.profile.from_month_year')}
                <span className='text-red'>*</span>
              </label>
              <DatePicker
                id={`addBHXH-start-date-${id}`}
                dateFormat='month-year'
                deleteValue={false}
                value={startDate}
                onChange={handleStartDateChange}
              />
              <ErrorLabel content={errorOnStartDate} />
            </div>
            {/* Đến tháng */}
            <div className={`form-group col-sm-6 col-xs-12 ${errorOnEndDate && 'has-error'}`}>
              <label>
                {translate('human_resource.profile.to_month_year')}
                <span className='text-red'>*</span>
              </label>
              <DatePicker
                id={`addBHXH-end-date-${id}`}
                dateFormat='month-year'
                deleteValue={false}
                value={endDate}
                onChange={handleEndDateChange}
              />
              <ErrorLabel content={errorOnEndDate} />
            </div>
          </div>
          {/* Chức vụ */}
          <div className={`form-group ${errorOnPosition && 'has-error'}`}>
            <label>
              {translate('table.position')}
              <span className='text-red'>*</span>
            </label>
            <input
              type='text'
              className='form-control'
              name='position'
              value={position ? position : ''}
              onChange={handlePositionChange}
              autoComplete='off'
            />
            <ErrorLabel content={errorOnPosition} />
          </div>
          {/* Mức lương đóng */}
          <div className={`form-group ${errorOnMoney && 'has-error'}`}>
            <label>
              {translate('human_resource.profile.money')}
              <span className='text-red'>*</span>
            </label>
            <input
              type='Number'
              className='form-control'
              name='money'
              value={money ? money : ''}
              onChange={handleMoneyChange}
              autoComplete='off'
            />
            <ErrorLabel content={errorOnMoney} />
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

const addModal = connect(null, null)(withTranslate(SocialInsuranceAddModal))
export { addModal as SocialInsuranceAddModal }
