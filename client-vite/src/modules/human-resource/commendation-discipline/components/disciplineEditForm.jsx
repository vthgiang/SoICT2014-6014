import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../common-components'

import { DisciplineFromValidator } from './disciplineFormValidator'

import { DisciplineActions } from '../redux/actions'

const DisciplineEditForm = (props) => {
  const [state, setState] = useState({
    employee: '',
    decisionNumber: '',
    organizationalUnit: '',
    startDate: '',
    endDate: '',
    type: '',
    reason: ''
  })

  /**
   * Bắt sự kiện thay đổi cấp ra quyết định
   * @param {*} value : Cấp ra quyết định
   */
  const handleOrganizationalUnitChange = (value) => {
    validateOrganizationalUnit(value[0], true)
  }
  const validateOrganizationalUnit = (value, willUpdateState = true) => {
    const { translate } = props
    let msg = DisciplineFromValidator.validateOrganizationalUnit(value, translate)
    if (willUpdateState) {
      setState((state) => ({
        ...state,
        errorOnOrganizationalUnit: msg,
        organizationalUnit: value
      }))
    }
    return msg === undefined
  }

  /**
   * Bắt sự kiện thay đổi ngày có hiệu lực
   * @param {*} value : Ngày có hiệu lực
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
      errorOnStartDate = translate('human_resource.commendation_discipline.discipline.start_date_before_end_date')
    } else {
      errorOnEndDate = undefined
    }

    setState((state) => ({
      ...state,
      startDate: value,
      errorOnStartDate: errorOnStartDate,
      errorOnEndDate: errorOnEndDate
    }))
  }
  /**
   * Bắt sự kiện thay đổi ngày hết hiệu lực
   * @param {*} value : Ngày có hiệu lực
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
    setState((state) => ({
      ...state,
      endDate: value,
      errorOnStartDate: errorOnStartDate,
      errorOnEndDate: errorOnEndDate
    }))
  }

  /** Bắt sự kiện thay đổi hình thức khen thưởng */
  const handleTypeChange = (e) => {
    let { value } = e.target
    validateType(value, true)
  }
  const validateType = (value, willUpdateState = true) => {
    const { translate } = props
    let msg = DisciplineFromValidator.validateType(value, translate)
    if (willUpdateState) {
      setState((state) => ({
        ...state,
        errorOnType: msg,
        type: value
      }))
    }
    return msg === undefined
  }

  /** Bắt sự kiện thay đổi thành tich(lý do) khen thưởng */
  const handleReasonChange = (e) => {
    let { value } = e.target
    validateReason(value, true)
  }
  const validateReason = (value, willUpdateState = true) => {
    const { translate } = props
    let msg = DisciplineFromValidator.validateReason(value, translate)
    if (willUpdateState) {
      setState((state) => ({
        ...state,
        errorOnReason: msg,
        reason: value
      }))
    }
    return msg === undefined
  }

  /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form */
  const isFormValidated = () => {
    const { organizationalUnit, reason, type, startDate, endDate } = state
    let result = validateOrganizationalUnit(organizationalUnit, false) && validateType(type, false) && validateReason(reason, false)
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
  const save = () => {
    const { _id, endDate, startDate } = state
    let partStart = startDate.split('-')
    let startDateNew = [partStart[2], partStart[1], partStart[0]].join('-')
    let endDateNew = null
    if (endDate) {
      let partEnd = endDate.split('-')
      endDateNew = [partEnd[2], partEnd[1], partEnd[0]].join('-')
    }
    if (isFormValidated()) {
      return props.updateDiscipline(_id, { ...state, startDate: startDateNew, endDate: endDateNew })
    }
  }

  if (state._id != props._id) {
    setState((state) => ({
      ...state,
      _id: props._id,
      employeeNumber: props.employeeNumber,
      decisionNumber: props.decisionNumber,
      organizationalUnit: props.organizationalUnit,
      startDate: props.startDate,
      endDate: props.endDate,
      type: props.type,
      reason: props.reason,
      errorOnOrganizationalUnit: undefined,
      errorOnType: undefined,
      errorOnReason: undefined,
      errorOnStartDate: undefined,
      errorOnEndDate: undefined
    }))
  }
  const { translate, discipline, department, handleMSNVChange, handleNumberChange } = props

  const {
    _id,
    employeeNumber,
    startDate,
    endDate,
    reason,
    decisionNumber,
    organizationalUnit,
    type,
    errorOnEndDate,
    errorOnStartDate,
    errorOnOrganizationalUnit,
    errorOnType,
    errorOnReason
  } = state

  return (
    <React.Fragment>
      <DialogModal
        size='50'
        modalID='modal-edit-discipline'
        isLoading={discipline.isLoading}
        formID='form-edit-discipline'
        title={translate('human_resource.commendation_discipline.discipline.edit_discipline')}
        func={save}
        disableSubmit={!isFormValidated()}
      >
        <form className='form-group' id='form-edit-discipline'>
          {/* Mã số nhân viên */}
          <div className='form-group'>
            <label>
              {translate('human_resource.staff_number')}
              <span className='text-red'>*</span>
            </label>
            <input
              type='text'
              className='form-control'
              name='employeeNumber'
              value={employeeNumber}
              onChange={handleMSNVChange}
              autoComplete='off'
              disabled
            />
          </div>
          <div className='row qlcv-from'>
            {/* Số ra quyết định*/}
            <div className='left col-sm-6 col-xs-12 form-group'>
              <label>
                {translate('human_resource.commendation_discipline.commendation.table.decision_number')}
                <span className='text-red'>*</span>
              </label>
              <input
                type='text'
                className='form-control'
                name='number'
                value={decisionNumber}
                onChange={handleNumberChange}
                autoComplete='off'
                disabled
              />
            </div>
            {/* Cấp ra quyế định */}
            <div className={`right col-sm-6 col-xs-12 form-group ${errorOnOrganizationalUnit && 'has-error'}`}>
              <label>
                {translate('human_resource.commendation_discipline.commendation.table.decision_unit')}
                <span className='text-red'>*</span>
              </label>
              <SelectBox
                id={`edit_discipline${_id}`}
                className='form-control select2'
                style={{ width: '100%' }}
                value={organizationalUnit}
                items={[
                  ...department.list.map((u, i) => {
                    return { value: u._id, text: u.name }
                  }),
                  { value: '', text: translate('human_resource.choose_decision_unit') }
                ]}
                onChange={handleOrganizationalUnitChange}
              />
              <ErrorLabel content={errorOnOrganizationalUnit} />
            </div>
          </div>
          <div className='row qlcv-from'>
            {/* Ngày có hiệu lực*/}
            <div className={`col-sm-6 col-xs-12 form-group ${errorOnStartDate && 'has-error'}`}>
              <label>
                {translate('human_resource.commendation_discipline.discipline.table.start_date')}
                <span className='text-red'>*</span>
              </label>
              <DatePicker id={`edit_discipline_start_date${_id}`} deleteValue={false} value={startDate} onChange={handleStartDateChange} />
              <ErrorLabel content={errorOnStartDate} />
            </div>
            {/* Ngày hết hiệu lực*/}
            <div className={`col-sm-6 col-xs-12 form-group ${errorOnEndDate && 'has-error'}`}>
              <label>{translate('human_resource.commendation_discipline.discipline.table.end_date')}</label>
              <DatePicker id={`edit_discipline_end_date${_id}`} deleteValue={true} value={endDate} onChange={handleEndDateChange} />
              <ErrorLabel content={errorOnEndDate} />
            </div>
          </div>
          {/* Hình thức kỷ luật */}
          <div className={`form-group ${errorOnType && 'has-error'}`}>
            <label>
              {translate('human_resource.commendation_discipline.discipline.table.discipline_forms')}
              <span className='text-red'>*</span>
            </label>
            <input
              type='text'
              className='form-control'
              name='type'
              value={type}
              onChange={handleTypeChange}
              autoComplete='off'
              placeholder={translate('human_resource.commendation_discipline.discipline.table.discipline_forms')}
            />
            <ErrorLabel content={errorOnType} />
          </div>
          {/* Lý do lỷ luật */}
          <div className={`form-group ${errorOnReason === undefined ? '' : 'has-error'}`}>
            <label>
              {translate('human_resource.commendation_discipline.discipline.table.reason_discipline')}
              <span className='text-red'>*</span>
            </label>
            <textarea
              className='form-control'
              rows='3'
              name='reason'
              value={reason}
              onChange={handleReasonChange}
              placeholder='Enter ...'
              autoComplete='off'
            ></textarea>
            <ErrorLabel content={errorOnReason} />
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

function mapState(state) {
  const { discipline, department } = state
  return { discipline, department }
}

const actionCreators = {
  updateDiscipline: DisciplineActions.updateDiscipline
}

const editForm = connect(mapState, actionCreators)(withTranslate(DisciplineEditForm))
export { editForm as DisciplineEditForm }
