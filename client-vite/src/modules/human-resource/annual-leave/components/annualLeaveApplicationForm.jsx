import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DialogModal, ButtonModal, ErrorLabel, DatePicker, TimePicker, SelectBox } from '../../../../common-components'

import { AnnualLeaveActions } from '../redux/actions'
import { UserActions } from '../../../super-admin/user/redux/actions'
import { formatDate } from '../../../../helpers/formatDate'
import ValidationHelper from '../../../../helpers/validationHelper'

function AnnualLeaveApplicationForm(props) {
  const [state, setState] = useState({
    organizationalUnit: '',
    startDate: formatDate(new Date()),
    endDate: formatDate(new Date()),
    reason: '',
    type: false,
    startTime: '',
    endTime: ''
  })

  const applicationStartTime = useRef('')
  const applicationEndTime = useRef('')

  const { translate, user } = props

  const {
    startDate,
    endDate,
    reason,
    organizationalUnit,
    totalHours,
    errorOnTotalHours,
    type,
    errorOnOrganizationalUnit,
    errorOnReason,
    errorOnStartDate,
    errorOnEndDate
  } = state

  useEffect(() => {
    props.getDepartmentOfUser()
  }, [])

  /**
   * Bắt sự kiện thay đổi người nhận
   * @param {*} value : Giá trị người nhận
   */
  const handleOrganizationalUnitChange = (value) => {
    value = value[0]
    const { translate } = props
    const { message } = ValidationHelper.validateEmpty(translate, value)

    setState({
      ...state,
      organizationalUnit: value,
      errorOnOrganizationalUnit: message
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

    let errorOnEndDate
    let partValue = value.split('-')
    let date = new Date([partValue[2], partValue[1], partValue[0]].join('-'))

    let partStartDate = startDate.split('-')
    let d = new Date([partStartDate[2], partStartDate[1], partStartDate[0]].join('-'))

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

  /** Bắt sự kiện chọn xin nghi theo giờ */
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

  /** Bắt sự kiện thay đổi tổng số giờ nghỉ phép */
  const handleTotalHoursChange = (e) => {
    let { value } = e.target
    const { translate } = props
    const { message } = ValidationHelper.validateNumberInputMin(translate, value, 0)
    setState({
      ...state,
      errorOnTotalHours: message,
      totalHours: value
    })
  }

  /** Bắt sự kiện thay đổi lý do xin nghỉ phép */
  const handleReasonChange = (e) => {
    let { value } = e.target
    const { translate } = props
    const { message } = ValidationHelper.validateEmpty(translate, value)
    setState({
      ...state,
      errorOnReason: message,
      reason: value
    })
  }

  /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form */
  const isFormValidated = () => {
    const { organizationalUnit, reason, startDate, endDate, type, totalHours } = state
    const { translate } = props
    let result =
      ValidationHelper.validateEmpty(translate, organizationalUnit).status &&
      ValidationHelper.validateEmpty(translate, reason).status &&
      (type ? ValidationHelper.validateEmpty(translate, totalHours).status : true)

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
    let { startDate, endDate, type, startTime, endTime } = state
    let partStart = startDate.split('-')
    let startDateNew = [partStart[2], partStart[1], partStart[0]].join('-')
    let partEnd = endDate.split('-')
    let endDateNew = [partEnd[2], partEnd[1], partEnd[0]].join('-')

    if (type) {
      if (startTime === '') {
        startTime = applicationStartTime.current.getValue()
      }
      if (endTime === '') {
        endTime = applicationEndTime.current.getValue()
      }
    }

    if (isFormValidated()) {
      return props.createAnnualLeave({
        ...state,
        startTime: startTime,
        endTime: endTime,
        createApplication: true,
        startDate: startDateNew,
        endDate: endDateNew
      })
    }
  }

  return (
    <React.Fragment>
      <ButtonModal
        modalID='modal-aplication-annual-leave'
        button_name={translate('human_resource.annual_leave_personal.create_annual_leave')}
      />
      <DialogModal
        size='50'
        modalID='modal-aplication-annual-leave'
        isLoading={user.isLoading}
        formID='form-aplication-annual-leave'
        title={translate('human_resource.annual_leave_personal.create_annual_leave')}
        func={save}
        disableSubmit={!isFormValidated()}
      >
        <form className='form-group' id='form-aplication-annual-leave'>
          {/* Người nhận */}
          <div className={`form-group ${errorOnOrganizationalUnit && 'has-error'}`}>
            <label>
              {translate('human_resource.unit')}
              <span className='text-red'>*</span>
            </label>
            <SelectBox
              id={`create-application-annual-leave-unit`}
              className='form-control select2'
              style={{ width: '100%' }}
              value={organizationalUnit}
              items={
                user.organizationalUnitsOfUser
                  ? [
                      ...user.organizationalUnitsOfUser.map((y) => {
                        return { value: y._id, text: y.name }
                      }),
                      { value: '', text: translate('human_resource.non_unit') }
                    ]
                  : []
              }
              onChange={handleOrganizationalUnitChange}
            />
            <ErrorLabel content={errorOnOrganizationalUnit} />
          </div>
          <div className='form-group'>
            <input type='checkbox' onChange={() => handleChecked()} />
            <label>{translate('human_resource.annual_leave.type')}</label>
          </div>
          <div className='row'>
            {/* Ngày bắt đầu */}
            <div className={`form-group col-sm-6 col-xs-12 ${errorOnStartDate && 'has-error'}`}>
              <label>
                {translate('human_resource.annual_leave.table.start_date')}
                <span className='text-red'>*</span>
              </label>
              <DatePicker id='application_start_date' deleteValue={false} value={startDate} onChange={handleStartDateChange} />
              {type && <TimePicker id='application_start_time' ref={applicationStartTime} onChange={handleStartTimeChange} />}
              <ErrorLabel content={errorOnStartDate} />
            </div>
            {/* Ngày kết thúc */}
            <div className={`form-group col-sm-6 col-xs-12 ${errorOnEndDate && 'has-error'}`}>
              <label>
                {translate('human_resource.annual_leave.table.end_date')}
                <span className='text-red'>*</span>
              </label>
              <DatePicker id='application_end_date' deleteValue={false} value={endDate} onChange={handleEndDateChange} />
              {type && <TimePicker id='application_end_time' ref={applicationEndTime} onChange={handleEndTimeChange} />}
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
  const { annualLeave, user } = state
  return { annualLeave, user }
}

const actionCreators = {
  createAnnualLeave: AnnualLeaveActions.createAnnualLeave,
  getDepartmentOfUser: UserActions.getDepartmentOfUser
}

const applicationForm = connect(mapState, actionCreators)(withTranslate(AnnualLeaveApplicationForm))
export { applicationForm as AnnualLeaveApplicationForm }
