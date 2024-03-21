import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DialogModal, ErrorLabel, DatePicker, TimePicker, SelectBox } from '../../../../common-components'

import { AnnualLeaveFormValidator } from './annualLeaveFormValidator'

import { AnnualLeaveActions } from '../redux/actions'
import isEqual from 'lodash/isEqual'

function AnnualLeaveEditForm(props) {
  /**
   * Function format ngày hiện tại thành dạnh dd-mm-yyyy
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
    startDate: formatDate(Date.now()),
    endDate: formatDate(Date.now()),
    employeeNumber: '',
    type: false
  })

  useEffect(() => {
    if (props.requestToChange) {
      setState({
        _id: props._id,
        employee: props.employee,
        employeeNumber: props.employeeNumber,
        organizationalUnit: props.organizationalUnit,
        startDate: formatDate(props?.requestToChange?.startDate),
        endDate: formatDate(props?.requestToChange?.endDate),
        type: props?.requestToChange?.type,
        startTime: props?.requestToChange?.startTime,
        endTime: props?.requestToChange?.endTime,
        reason: props?.requestToChange?.reason,
        status: props.status,
        totalHours: props?.requestToChange?.totalHours ? props.requestToChange.totalHours : ''
      })
    } else {
      setState({
        ...state,
        _id: props._id,
        employee: props.employee,
        employeeNumber: props.employeeNumber,
        organizationalUnit: props.organizationalUnit,
        endDate: props.endDate,
        startDate: props.startDate,
        reason: props.reason,
        status: props.status,
        type: props.type,
        startTime: props.startTime,
        endTime: props.endTime,
        totalHours: props.totalHours ? props.totalHours : '',
        errorOnReason: undefined,
        errorOnStartDate: undefined,
        errorOnEndDate: undefined,
        errorOnTotalHours: undefined
      })
    }
  }, [props._id])

  const { translate, annualLeave, department } = props

  const {
    _id,
    employeeNumber,
    organizationalUnit,
    startDate,
    endDate,
    reason,
    status,
    errorOnReason,
    errorOnStartDate,
    errorOnEndDate,
    endTime,
    startTime,
    totalHours,
    errorOnTotalHours,
    type
  } = state

  const editStartTime = useRef('')
  const editEndTime = useRef('')

  /** Bắt sự kiện chọn xin nghỉ theo giờ */
  const handleChecked = () => {
    setState({
      ...state,
      type: !state.type,
      endTime: '',
      startTime: '',
      totalHours: ''
    })
  }

  /**
   * Bắt sự kiện thay đổi giờ bắt đầu
   * @param {*} value : Giá trị giờ bắt đầu
   */
  const handleStartTimeChange = (value) => {
    setState((state) => {
      return {
        ...state,
        startTime: value
      }
    })
  }

  /**
   * Bắt sự kiện thay đổi giờ kết thúc
   * @param {*} value : Giá trị giờ kết thúc
   */
  const handleEndTimeChange = (value) => {
    setState((state) => {
      return {
        ...state,
        endTime: value
      }
    })
  }

  /**
   * Bắt sự kiện thay đổi ngày bắt đầu
   * @param {*} value : Giá trị ngày bắt đầu
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
      errorOnStartDate = translate('human_resource.start_date_before_end_date')
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
   * Bắt sự kiện thay đổi ngày kết thúc
   * @param {*} value : Giá trị ngày kết thúc
   */
  const handleEndDateChange = (value) => {
    const { translate } = props
    let { startDate, errorOnStartDate } = state
    let partValue = value.split('-')
    let date = new Date([partValue[2], partValue[1], partValue[0]].join('-'))

    let partStartDate = startDate.split('-')
    let d = new Date([partStartDate[2], partStartDate[1], partStartDate[0]].join('-'))
    let errorOnEndDate
    if (d.getTime() > date.getTime()) {
      errorOnEndDate = translate('human_resource.start_date_before_end_date')
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

  /** Bắt sự kiện thay đổi tổng số giờ nghỉ phép */
  const handleTotalHoursChange = (e) => {
    let { value } = e.target
    validateTotalHours(value, true)
  }
  const validateTotalHours = (value, willUpdateState = true) => {
    const { translate } = props

    let msg = AnnualLeaveFormValidator.validateTotalHour(value, translate)
    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnTotalHours: msg,
          totalHours: value
        }
      })
    }
    return msg === undefined
  }

  /** Bắt sự kiện thay đổi lý do xin nghỉ phép */
  const handleReasonChange = (e) => {
    let { value } = e.target
    validateReason(value, true)
  }

  const validateReason = (value, willUpdateState = true) => {
    const { translate } = props
    let msg = AnnualLeaveFormValidator.validateReason(value, translate)
    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnReason: msg,
          reason: value
        }
      })
    }
    return msg === undefined
  }

  /** Bắt sự kiện thay đổi trạng thái đơn xin nghỉ phép */
  const handleStatusChange = (e) => {
    let { value } = e.target
    setState({
      ...state,
      status: value
    })
  }

  /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form */
  const isFormValidated = () => {
    const { startDate, endDate, reason, type, totalHours } = state
    let result = validateReason(reason, false) && (type ? validateTotalHours(totalHours, false) : true)
    let partStart = startDate.split('-')
    let startDateNew = [partStart[2], partStart[1], partStart[0]].join('-')
    let partEnd = endDate.split('-')
    let endDateNew = [partEnd[2], partEnd[1], partEnd[0]].join('-')
    if (new Date(startDateNew).getTime() <= new Date(endDateNew).getTime()) {
      return result
    } else return false
  }

  /** Bắt sự kiện submit form */
  const save = () => {
    let { startDate, endDate, _id, type, startTime, endTime } = state
    let partStart = startDate.split('-')
    let startDateNew = [partStart[2], partStart[1], partStart[0]].join('-')
    let partEnd = endDate.split('-')
    let endDateNew = [partEnd[2], partEnd[1], partEnd[0]].join('-')
    if (type) {
      if (startTime === '') {
        startTime = editStartTime.current.getValue()
      }
      if (endTime === '') {
        endTime = editEndTime.current.getValue()
      }
    }

    if (isFormValidated()) {
      return props.updateAnnualLeave(_id, {
        ...state,
        startTime: startTime,
        endTime: endTime,
        startDate: startDateNew,
        endDate: endDateNew,
        approvedApplication: true
      })
    }
  }

  let title = props?.requestToChange ? 'Phê duyệt yêu cầu chỉnh sửa nghỉ phép' : translate('human_resource.annual_leave.edit_annual_leave')
  return (
    <React.Fragment>
      <DialogModal
        size='50'
        modalID='modal-edit-sabbtical'
        isLoading={annualLeave.isLoading}
        formID='form-edit-sabbtical'
        title={title}
        func={save}
        disableSubmit={!isFormValidated()}
      >
        <form className='form-group' id='form-edit-sabbtical'>
          {/* Mã số nhân viên*/}
          <div className='form-group'>
            <label>
              {translate('human_resource.staff_number')}
              <span className='text-red'>*</span>
            </label>
            <input type='text' className='form-control' name='employeeNumber' value={employeeNumber} disabled />
          </div>
          {/* Đơn vị */}
          <div className='form-group'>
            <label>
              {translate('human_resource.unit')}
              <span className='text-red'>*</span>
            </label>
            <SelectBox
              id={`edit-annaul-leave-unit`}
              className='form-control select2'
              disabled={true}
              style={{ width: '100%' }}
              value={organizationalUnit}
              items={department.list.map((y) => {
                return { value: y._id, text: y.name }
              })}
              //onChange={handleOrganizationalUnitChange}
            />
          </div>
          <div className='form-group'>
            <input type='checkbox' checked={type} onChange={() => handleChecked()} />
            <label>{translate('human_resource.annual_leave.type')}</label>
          </div>
          <div className='row'>
            {/* Ngày bắt đầu */}
            <div className={`form-group col-sm-6 col-xs-12 ${errorOnStartDate && 'has-error'}`}>
              <label>
                {translate('human_resource.annual_leave.table.start_date')}
                <span className='text-red'>*</span>
              </label>
              <DatePicker id={`edit_start_date${_id}`} deleteValue={false} value={startDate} onChange={handleStartDateChange} />
              <div className='help-block' style={{ color: '#e06a6a' }}>
                {!isEqual(state.startDate, props.startDate) ? ` Giá trị cũ ${props.startDate}` : ''}
              </div>
              {type && (
                <>
                  <TimePicker id='edit_start_time' ref={editStartTime} value={startTime} onChange={handleStartTimeChange} />
                  <div className='help-block' style={{ color: '#e06a6a' }}>
                    {!isEqual(state.startTime, props.startTime) ? ` Giá trị cũ ${props.startTime}` : ''}
                  </div>
                </>
              )}
              <ErrorLabel content={errorOnStartDate} />
            </div>
            {/* Ngày kết thúc */}
            <div className={`form-group col-sm-6 col-xs-12 ${errorOnEndDate && 'has-error'}`}>
              <label>
                {translate('human_resource.annual_leave.table.end_date')}
                <span className='text-red'>*</span>
              </label>
              <DatePicker id={`edit_end_date${_id}`} deleteValue={false} value={endDate} onChange={handleEndDateChange} />
              <div className='help-block' style={{ color: '#e06a6a' }}>
                {!isEqual(state.endDate, props.endDate) ? ` Giá trị cũ ${props.endDate}` : ''}
              </div>
              {type && (
                <>
                  <div className='help-block' style={{ color: '#e06a6a' }}>
                    {!isEqual(state.endTime, props.endTime) ? ` Giá trị cũ ${props.endTime}` : ''}
                  </div>
                  <TimePicker id='edit_end_time' ref={editEndTime} value={endTime} onChange={handleEndTimeChange} />
                </>
              )}
              <ErrorLabel content={errorOnEndDate} />
            </div>
          </div>
          {/* Tổng giờ nghỉ */}
          {type && (
            <div className={`form-group ${errorOnTotalHours && 'has-error'}`}>
              <label>
                {translate('human_resource.annual_leave.totalHours')} <span className='text-red'>*</span>
              </label>
              <input type='number' className='form-control' value={totalHours} onChange={handleTotalHoursChange} />
              <ErrorLabel content={errorOnTotalHours} />
              <div className='help-block' style={{ color: '#e06a6a' }}>
                {!isEqual(state.totalHours, props.totalHours) ? ` Giá trị cũ ${props.totalHours}` : ''}
              </div>
            </div>
          )}
          {/* Lý do */}
          <div className={`form-group ${errorOnReason && 'has-error'}`}>
            <label>
              {translate('human_resource.annual_leave.table.reason')}
              <span className='text-red'>*</span>
            </label>
            <textarea
              className='form-control'
              rows='3'
              style={{ height: 72 }}
              name='reason'
              value={reason}
              onChange={handleReasonChange}
            ></textarea>
            <ErrorLabel content={errorOnReason} />
            <div className='help-block' style={{ color: '#e06a6a' }}>
              {!isEqual(state.reason, props.reason) ? ` Giá trị cũ ${props.reason}` : ''}
            </div>
          </div>
          {/* Trạng thái */}
          <div className='form-group'>
            <label>
              {translate('human_resource.status')}
              <span className='text-red'>*</span>
            </label>
            <select className='form-control' value={status} name='status' onChange={handleStatusChange}>
              <option value='approved'>{translate('human_resource.annual_leave.status.approved')}</option>
              <option value='waiting_for_approval'>{translate('human_resource.annual_leave.status.waiting_for_approval')}</option>
              <option value='disapproved'>{translate('human_resource.annual_leave.status.disapproved')}</option>
            </select>
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

function mapState(state) {
  const { annualLeave, department } = state
  return { annualLeave, department }
}

const actionCreators = {
  updateAnnualLeave: AnnualLeaveActions.updateAnnualLeave
}

const editSabbatical = connect(mapState, actionCreators)(withTranslate(AnnualLeaveEditForm))
export { editSabbatical as AnnualLeaveEditForm }
