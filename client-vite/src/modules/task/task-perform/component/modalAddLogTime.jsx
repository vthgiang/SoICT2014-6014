import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal, DatePicker, ErrorLabel, TimePicker } from '../../../../common-components'
import TextareaAutosize from 'react-textarea-autosize'
import { formatDate } from '../../../../helpers/formatDate'
import ValidationHelper from '../../../../helpers/validationHelper'
import { performTaskAction } from '../redux/actions'
import Swal from 'sweetalert2'
import './actionTab.css'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
dayjs.extend(isBetween)
dayjs.extend(isSameOrAfter)

function ModalAddLogTime(props) {
  let { startDate, endDate } = props?.performtasks?.task
  const { translate } = props
  const [state, setState] = useState(() => {
    return {
      addLogTimeStartDate: formatDate(startDate),
      addLogTimeEndDate: formatDate(endDate),
      addLogStartTime: '08:00 AM',
      addLogEndTime: '05:30 PM'
    }
  })

  const checkValidateDate = (start, end) => {
    if (start && end) {
      return dayjs(start).isBefore(dayjs(end))
    }
  }

  const handleChangeStartDateAddLog = (value) => {
    let { addLogTimeEndDate, addLogStartTime, addLogEndTime } = state
    const DateSplit = value.split('-')
    let addLogTimeStartDateConvert = DateSplit[2] + '-' + DateSplit[1] + '-' + DateSplit[0]

    let addLogTimeEndDateConvert
    if (addLogTimeEndDate) {
      const endDateSplit = addLogTimeEndDate.split('-')
      addLogTimeEndDateConvert = endDateSplit[2] + '/' + endDateSplit[1] + '/' + endDateSplit[0]
    }

    let { message } = ValidationHelper.validateEmpty(translate, value)
    if (
      !dayjs(`${addLogTimeEndDateConvert} ${addLogEndTime}`).isSameOrAfter(
        dayjs(`${DateSplit[2]}/${DateSplit[1]}/${DateSplit[0]} ${addLogStartTime}`)
      )
    ) {
      message = 'Thời gian bắt đầu bấm giờ phải bằng hoặc trước thời gian kết thúc bấm giờ'
    }

    const checkDateAddLog = checkValidateDate(dayjs().format('YYYY-MM-DD'), addLogTimeStartDateConvert)

    if (checkDateAddLog) message = 'Thời gian bắt đầu bấm giờ không được chọn ngày trong tương lai'
    setState({
      ...state,
      addLogTimeStartDate: value,
      errorStartDateAddLog: message,
      errorEndDateAddLog: undefined,
      checkDateAddLog
    })
  }

  const handleChangeDateAddStartTime = (value) => {
    let { addLogTimeStartDate, addLogTimeEndDate, addLogEndTime } = state

    const startDateSplit = addLogTimeStartDate.split('-')

    let addLogTimeStartDateConvert = startDateSplit[2] + '/' + startDateSplit[1] + '/' + startDateSplit[0]

    let addLogTimeEndDateConvert
    if (addLogTimeEndDate) {
      const endDateSplit = addLogTimeEndDate.split('-')
      addLogTimeEndDateConvert = endDateSplit[2] + '/' + endDateSplit[1] + '/' + endDateSplit[0]
    }

    let { message } = ValidationHelper.validateEmpty(translate, value)

    if (!dayjs(`${addLogTimeEndDateConvert} ${addLogEndTime}`).isSameOrAfter(dayjs(`${addLogTimeStartDateConvert} ${value}`))) {
      message = 'Thời gian bắt đầu bấm giờ phải bằng hoặc trước thời gian kết thúc bấm giờ'
    }

    setState({
      ...state,
      addLogStartTime: value,
      errorStartDateAddLog: message,
      errorEndDateAddLog: undefined
    })
  }

  const handleChangeEndDateAddLog = (value) => {
    let { addLogTimeStartDate, addLogStartTime, addLogEndTime } = state

    const endDateSplit = value.split('-')
    let addLogTimeEndDateConvert = endDateSplit[2] + '-' + endDateSplit[1] + '-' + endDateSplit[0]

    let addLogTimeStartDateConvert
    if (addLogTimeStartDate) {
      const startDateSplit = addLogTimeStartDate.split('-')
      addLogTimeStartDateConvert = startDateSplit[2] + '/' + startDateSplit[1] + '/' + startDateSplit[0]
    }

    let { message } = ValidationHelper.validateEmpty(translate, value)

    if (
      !dayjs(`${endDateSplit[2]}/${endDateSplit[1]}/${endDateSplit[0]} ${addLogEndTime}`).isSameOrAfter(
        dayjs(`${addLogTimeStartDateConvert} ${addLogStartTime}`)
      )
    ) {
      message = 'Thời gian kết thúc bấm giờ phải bằng hoặc sau thời gian bắt đầu bấm giờ'
    }

    const checkDateAddLog = checkValidateDate(dayjs().format('YYYY-MM-DD'), addLogTimeEndDateConvert)

    if (checkDateAddLog) message = 'Thời gian kết thúc bấm giờ không được chọn ngày trong tương lai'

    setState({
      ...state,
      addLogTimeEndDate: value,
      errorEndDateAddLog: message,
      errorStartDateAddLog: undefined,
      checkDateAddLog
    })
  }

  const handleChangeDateAddEndTime = (value) => {
    let { addLogTimeStartDate, addLogTimeEndDate, addLogStartTime } = state

    const startDateSplit = addLogTimeStartDate.split('-')

    let addLogTimeStartDateConvert = startDateSplit[2] + '/' + startDateSplit[1] + '/' + startDateSplit[0]

    let addLogTimeEndDateConvert
    if (addLogTimeEndDate) {
      const endDateSplit = addLogTimeEndDate.split('-')
      addLogTimeEndDateConvert = endDateSplit[2] + '/' + endDateSplit[1] + '/' + endDateSplit[0]
    }

    let { message } = ValidationHelper.validateEmpty(translate, value)

    if (!dayjs(`${addLogTimeEndDateConvert} ${value}`).isSameOrAfter(dayjs(`${addLogTimeStartDateConvert} ${addLogStartTime}`))) {
      message = 'Thời gian kết thúc bấm giờ phải bằng hoặc trước thời gian bắt đầu bấm giờ'
    }

    setState({
      ...state,
      addLogEndTime: value,
      errorEndDateAddLog: message,
      errorStartDateAddLog: undefined
    })
  }

  const saveAddLogTime = () => {
    const { performtasks } = props
    let { addLogTimeStartDate, addLogTimeEndDate, addLogStartTime, addLogEndTime, addLogDescription } = state
    let startAt, stopAt
    let { startDate, endDate } = performtasks.task

    // Định dạng new Date("2021-02-21 09:40 PM") chạy trên chorme ok, chạy trên firefox invalid date
    // nên chuyển thành định dạng new Date("2021/02/21 09:40 PM")
    if (addLogTimeStartDate && addLogStartTime) {
      const start = addLogTimeStartDate.split('-')
      addLogTimeStartDate = start[2] + '/' + start[1] + '/' + start[0]
      startAt = new Date(addLogTimeStartDate + ' ' + addLogStartTime)
    }

    if (addLogTimeEndDate && addLogEndTime) {
      const end = addLogTimeEndDate.split('-')
      addLogTimeEndDate = end[2] + '/' + end[1] + '/' + end[0]
      stopAt = new Date(addLogTimeEndDate + ' ' + addLogEndTime)
    }

    const timer = {
      employee: localStorage.getItem('userId'),
      addlogStartedAt: startAt,
      addlogDescription: addLogDescription,
      addlogStoppedAt: stopAt,
      taskId: performtasks.task._id,
      autoStopped: 3 // 3: add log timer
    }

    // check xem thời gian bấm giờ nằm trong khoản thời gian bắt đầu và thời gian kết thúc của công việc
    if (
      !(
        dayjs(startAt).isBetween(dayjs(startDate), dayjs(endDate), null, '[]') &&
        dayjs(stopAt).isBetween(dayjs(startDate), dayjs(endDate), null, '[]')
      )
    ) {
      Swal.fire({
        title: 'Thời gian bấm giờ phải trong khoảng thời gian làm việc',
        type: 'warning',
        confirmButtonColor: '#dd4b39',
        confirmButtonText: 'Đóng'
      })
    } else {
      props.stopTimer(performtasks.task._id, timer)
      setState({
        ...state,
        showBoxAddLogTimer: false,
        addLogDescription: ''
      })
    }
  }

  const getDefaultValueStartTime = (value) => {
    setState({
      ...state,
      addLogStartTime: value
    })
  }

  const getDefaultValueEndTime = (value) => {
    setState({
      ...state,
      addLogEndTime: value
    })
  }

  const handleChangeAddLogDescription = (e) => {
    const { value } = e.target
    setState({
      ...state,
      addLogDescription: value
    })
  }

  const isFormValidated = () => {
    const { errorEndDateAddLog, errorStartDateAddLog } = state
    if (errorEndDateAddLog || errorStartDateAddLog) return false
    return true
  }

  const { errorStartDateAddLog, errorEndDateAddLog, addLogStartTime, addLogEndTime } = state
  return (
    <DialogModal
      size='50'
      modalID={`modal-add-log-time`}
      formID='form-add-log-time'
      title={'New Time Log'}
      func={saveAddLogTime}
      disableSubmit={!isFormValidated()}
    >
      <div className='addlog-box'>
        <p style={{ color: '#f96767' }}>
          Lưu ý: Ghi nhật ký thời gian không được phép cho các ngày trong tương lai và phải trong khoảng thời gian thực hiện công việc
        </p>
        <div>
          <div className='row'>
            <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 ${errorStartDateAddLog === undefined ? '' : 'has-error'}`}>
              <label className='control-label'>
                Thời gian bắt đầu bấm giờ<span className='text-red'>*</span>
              </label>
              <DatePicker
                id={`datepicker-startDate`}
                dateFormat='day-month-year'
                value={state.addLogTimeStartDate}
                onChange={handleChangeStartDateAddLog}
              />
              <TimePicker id={`addlog-startTime`} value={addLogStartTime} onChange={handleChangeDateAddStartTime} />
              <ErrorLabel content={errorStartDateAddLog} />
            </div>

            <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 ${errorEndDateAddLog === undefined ? '' : 'has-error'}`}>
              <label className='control-label'>
                Thời gian kết thúc bấm giờ<span className='text-red'>*</span>
              </label>
              <DatePicker id={`addlog-date`} onChange={handleChangeEndDateAddLog} defaultValue={state.addLogTimeEndDate} />
              <TimePicker id={`addlog-endtime`} value={addLogEndTime} onChange={handleChangeDateAddEndTime} />
              <ErrorLabel content={errorEndDateAddLog} />
            </div>
          </div>

          <div className='form-group' style={{ marginTop: '10px' }}>
            <label>Mô tả</label>
            <TextareaAutosize
              style={{ width: '100%', border: '1px solid rgba(70, 68, 68, 0.15)', padding: '5px' }}
              minRows={3}
              maxRows={20}
              onChange={handleChangeAddLogDescription}
            />
          </div>
        </div>
      </div>
    </DialogModal>
  )
}

function mapStateToProps(state) {
  const { performtasks } = state
  return { performtasks }
}

const mapDispatchToProps = {
  stopTimer: performTaskAction.stopTimerTask
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ModalAddLogTime))
