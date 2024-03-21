import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DialogModal, ErrorLabel, DatePicker, SlimScroll } from '../../../../common-components'

import { TimesheetsActions } from '../redux/actions'

const TimesheetsEditForm = (props) => {
  const [state, setState] = useState({})

  /**
   * Function bắt sự kiện thay đổi chấm công nhân viên (checkbox)
   * @param {*} workSession : Dữ liệu ca chấm công
   * @param {*} index : Số thứ tự công thay đổi
   */
  const handleCheckBoxChange = (workSession, index) => {
    let { shift1s, shift2s, shift3s } = state
    if (workSession === 'shift1s') {
      shift1s[index] = !shift1s[index]
      setState({
        ...state,
        shift1s: shift1s
      })
    } else if (workSession === 'shift2s') {
      shift2s[index] = !shift2s[index]
      setState({
        ...state,
        shift2s: shift2s
      })
    } else {
      shift3s[index] = !shift3s[index]
      setState({
        ...state,
        shift3s: shift3s
      })
    }
  }

  /**
   * Function thay đổi số giờ làm của một ngày
   * @param {*} index : số thứ tự ngày cần thay đổi
   */
  const handleHoursChange = (e, index) => {
    let { timekeepingByHours } = state
    const { value } = e.target
    timekeepingByHours[index] = value
    setState({
      ...state,
      timekeepingByHours: timekeepingByHours
    })
  }

  // Bắt sự kiện thay đổi số giờ nghỉ và số giờ tăng ca
  const handleChange = (e) => {
    const { value, name } = e.target
    setState({
      ...state,
      [name]: value
    })
  }

  if (props._id != state._id) {
    setState({
      ...state,
      _id: props._id,
      employeeNumber: props.employeeNumber,
      month: props.month,
      shift1s: props.shift1s,
      shift2s: props.shift2s,
      shift3s: props.shift3s,
      timekeepingType: props.timekeepingType,
      timekeepingByHours: props.timekeepingByHours,
      allDayOfMonth: props.allDayOfMonth,
      totalHoursOff: props.totalHoursOff,
      totalOvertime: props.totalOvertime
    })
  }

  /** Function bắt sự kiện lưu bảng chấm công */
  const save = () => {
    const { month, _id, shift1s, shift2s, shift3s, timekeepingByHours } = state
    let partMonth = month.split('-')
    let monthNew = [partMonth[1], partMonth[0]].join('-')
    props.updateTimesheets(_id, {
      ...state,
      month: monthNew,
      timekeepingByHours: timekeepingByHours,
      timekeepingByShift: { shift1s: shift1s, shift2s: shift2s, shift3s: shift3s }
    })
  }

  const { timesheets, translate, handleMonthChange } = props

  const {
    _id,
    errorOnEmployeeNumber,
    errorOnMonthSalary,
    month,
    employeeNumber,
    timekeepingType,
    allDayOfMonth,
    shift1s,
    shift2s,
    shift3s,
    timekeepingByHours,
    totalHoursOff,
    totalOvertime
  } = state

  return (
    <React.Fragment>
      <DialogModal
        size='50'
        modalID='modal-edit-timesheets'
        isLoading={timesheets.isLoading}
        formID='form-edit-timesheets'
        title={translate('human_resource.timesheets.edit_timesheets')}
        func={save}
        disableSubmit={false}
      >
        <form className='form-group' id='form-edit-timesheets'>
          {/* Mã số nhân viên*/}
          <div className={`form-group ${errorOnEmployeeNumber && 'has-error'}`}>
            <label>
              {translate('human_resource.staff_number')}
              <span className='text-red'>*</span>
            </label>
            <input type='text' className='form-control' name='employeeNumber' value={employeeNumber} disabled />
            <ErrorLabel content={errorOnEmployeeNumber} />
          </div>
          {/* Tháng */}
          <div className={`form-group ${errorOnMonthSalary && 'has-error'}`}>
            <label>
              {translate('human_resource.month')}
              <span className='text-red'>*</span>
            </label>
            <DatePicker id={`edit_month${_id}`} dateFormat='month-year' value={month} onChange={handleMonthChange} disabled={true} />
            <ErrorLabel content={errorOnMonthSalary} />
          </div>

          <div className='row'>
            {/* Số giờ nghỉ phép */}
            <div className='col-sm-6 col-xs-12 form-group'>
              <label>{translate('human_resource.timesheets.total_hours_off')}</label>
              <input
                type='text'
                className='form-control'
                name='totalHoursOff'
                value={totalHoursOff}
                onChange={handleChange}
                autoComplete='off'
              />
            </div>

            {/* Số giờ tăng ca */}
            <div className='col-sm-6 col-xs-12 form-group'>
              <label>{translate('human_resource.timesheets.total_over_time')}</label>
              <input
                type='text'
                className='form-control'
                name='totalOvertime'
                value={totalOvertime}
                onChange={handleChange}
                autoComplete='off'
              />
            </div>
          </div>

          {/* Công các ngày trong tháng */}
          {timekeepingType === 'shift' && (
            <div className='form-group'>
              <label>{translate('human_resource.timesheets.work_date_in_month')}</label>
              <div id='edit-croll-table'>
                <table id='edit-timesheets' className='table table-striped table-bordered table-hover'>
                  <thead>
                    <tr>
                      <th className='col-fixed not-sort' style={{ width: 100 }}>
                        {translate('human_resource.timesheets.shift_work')}
                      </th>
                      {allDayOfMonth.map((x, index) => (
                        <th className='col-fixed not-sort' style={{ width: 60 }} key={index}>{`${x.date} - ${x.day}`}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{translate('human_resource.timesheets.shifts1')}</td>
                      {allDayOfMonth.map((x, index) => (
                        <td key={index}>
                          <div className='checkbox' style={{ textAlign: 'center' }}>
                            <input
                              type='checkbox'
                              onChange={() => handleCheckBoxChange('shift1s', index)}
                              style={{ margin: 'auto', position: 'inherit', width: 17, height: 17 }}
                              checked={shift1s[index]}
                            />
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td>{translate('human_resource.timesheets.shifts2')}</td>
                      {allDayOfMonth.map((x, index) => (
                        <td key={index}>
                          <div className='checkbox' style={{ textAlign: 'center' }}>
                            <input
                              type='checkbox'
                              onChange={() => handleCheckBoxChange('shift2s', index)}
                              style={{ margin: 'auto', position: 'inherit', width: 17, height: 17 }}
                              checked={shift2s[index]}
                            />
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td>{translate('human_resource.timesheets.shifts3')}</td>
                      {allDayOfMonth.map((x, index) => (
                        <td key={index}>
                          <div className='checkbox' style={{ textAlign: 'center' }}>
                            <input
                              type='checkbox'
                              onChange={() => handleCheckBoxChange('shift3s', index)}
                              style={{ margin: 'auto', position: 'inherit', width: 17, height: 17 }}
                              checked={shift3s[index]}
                            />
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {timekeepingType === 'hours' && (
            <div className='form-group'>
              <label>{translate('human_resource.timesheets.date_of_month')}</label>
              <div id='edit-croll-table'>
                <table id='edit-timesheets' className='table table-striped table-bordered'>
                  <thead>
                    <tr>
                      {allDayOfMonth.map((x, index) => (
                        <th className='col-fixed not-sort' style={{ width: 100 }} key={index}>{`${x.date} - ${x.day}`}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {timekeepingByHours.map((x, index) => (
                        <td key={index}>
                          <input
                            type='number'
                            className='form-control'
                            style={{ width: '100%' }}
                            value={x !== 0 ? x : ''}
                            onChange={(e) => handleHoursChange(e, index)}
                          />
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <SlimScroll outerComponentId='edit-croll-table' innerComponentId='edit-timesheets' innerComponentWidth={1500} activate={true} />
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

function mapState(state) {
  const { timesheets } = state
  return { timesheets }
}

const actionCreators = {
  updateTimesheets: TimesheetsActions.updateTimesheets
}

const editForm = connect(mapState, actionCreators)(withTranslate(TimesheetsEditForm))
export { editForm as TimesheetsEditForm }
