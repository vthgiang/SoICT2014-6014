import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import moment from 'moment'
import { DatePicker, TimePicker, ErrorLabel, SelectBox } from '../../../../common-components'
import { getStorage } from '../../../../config'

import { CallApiStatus } from '../../../auth/redux/reducers'
import TextareaAutosize from 'react-textarea-autosize'
import { performTaskAction } from './../redux/actions'
import ValidationHelper from '../../../../helpers/validationHelper'
import './taskTimesheetLog.css'
import Swal from 'sweetalert2'
import { htmlToText } from 'html-to-text'
import _isEqual from 'lodash/isEqual'
class TaskTimesheetLog extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentUser: getStorage('userId'),
      time: new Date(),
      showModal: '',
      description: '',
      showEndDate: false,
      disabled: false,
      endDate: this.formatDate(Date.now()),
      dateStop: this.formatDate(Date.now()),
      taskActionStartTimer: '',
      taskActionList: [],
      errorTaskAction: undefined
    }
    this.sendQuery = false
  }

  callApi = () => {
    if (!this.called && this.props.auth.calledAPI === CallApiStatus.FINISHED) {
      this.props.getTimerStatusTask()
      this.called = true
    }
  }

  componentDidUpdate = () => {
    //Timepicker
    window.$('#timepicker').timepicker({
      showInputs: false
    })
  }

  componentDidMount = () => {
    this.setState({ showEndDate: false })
    this.callApi()

    if (this.props.socket.io) {
      this.props.socket.io.on('stop timers', (status) => {
        console.log('stop timers', status)
        if (status && status.stopTimerAllDevices) {
          this.props.stopTimeAllDevices(status)
        }
      })
    }
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    this.callApi() // Khi logout rồi login vào website (hoặc login mới), chưa gọi API lấy task đang được bấm giờ trong componentDidMount -> Cần gọi lại

    if (nextProps.performtasks && nextProps.performtasks.currentTimer) {
      let { taskActions } = nextProps.performtasks.currentTimer
      const { taskActionList } = this.state
      let taskActionsSelectBox = [{ value: '', text: '--- Chọn hành động ---' }]

      if (taskActions) {
        taskActions = taskActions.map((o) => ({ value: o._id, text: htmlToText(o.description) }))
        taskActionsSelectBox = [...taskActionsSelectBox, ...taskActions]
      }
      // Cập nhạt lại selectbox bấm giwof cho hoạt động khi hoạt động có sự thay đổi
      if (!_isEqual(taskActionList, taskActionsSelectBox)) {
        this.setState({
          taskActionList: taskActionsSelectBox
        })
      }

      if (!this.timer) {
        this.setState({
          showEndDate: false
        })

        this.timer = setInterval(
          () =>
            this.setState((state) => {
              return {
                ...state,
                time: new Date()
              }
            }),
          1000
        )
      }
    } else {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    }

    return true
  }

  componentWillUnmount = () => {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
    if (this.props.socket.io) {
      this.props.socket.io.off('stop timers')
    }
  }

  handleStopTimer = (e) => {
    e.stopPropagation()
    const { auth } = this.props
    this.setState((state) => {
      return {
        ...state,
        showModal: auth.user.id
      }
    })
  }

  resumeTimer = () => {
    this.setState((state) => {
      return {
        ...state,
        showModal: '',
        description: ''
      }
    })
  }

  cancelTimer = () => {
    const { performtasks } = this.props

    Swal.fire({
      title: `Hủy bỏ bấm giờ công việc`,
      html: `<h4 class="text-red">Nếu bạn bấm xác nhận thì thời gian bấm giờ hiện tại của công việc sẽ bị hủy</h4>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Đóng'
    }).then((result) => {
      if (result.isConfirmed) {
        const timer = {
          employee: getStorage('userId'),
          type: 'cancel',
          timesheetLog: performtasks.currentTimer.timesheetLogs[0]._id
        }
        this.props.stopTimer(performtasks.currentTimer._id, timer)
        this.setState((state) => {
          return {
            ...state,
            showModal: '',
            taskActionStartTimer: ''
          }
        })
      }
    })
  }

  checkValidateDate = (start, end) => {
    let mStart = moment(start)
    let mEnd = moment(end)
    return mEnd.isAfter(mStart)
  }

  stopTimer = async () => {
    const { performtasks } = this.props
    const { taskActionStartTimer } = this.state
    let stoppedAt = new Date() // mặc định lấy thời điểm hiện tại
    let autoStopped = 1
    let check = true

    // Nếu hẹn giờ tắt bấm giờ
    if (this.state.showEndDate) {
      if (this.state.dateStop && this.state.timeStop) {
        stoppedAt = new Date((this.state.dateStop + ' ' + this.state.timeStop).replace(/-/g, '/'))
        if (!this.checkValidateDate(new Date(), stoppedAt)) {
          check = false
          Swal.fire({
            title: 'Chức năng chỉ cho phép hẹn tắt bấm giờ trong tương lai',
            type: 'warning',
            confirmButtonColor: '#dd4b39',
            confirmButtonText: 'Đóng'
          })
        }
        autoStopped = 2
      }
    }

    const timer = {
      employee: getStorage('userId'),
      startedAt: performtasks.currentTimer.timesheetLogs[0].startedAt,
      description: this.state.description,
      timesheetLog: performtasks.currentTimer.timesheetLogs[0]._id,
      stoppedAt,
      autoStopped,
      taskActionStartTimer
    }
    if (check) {
      await this.props.stopTimer(performtasks.currentTimer._id, timer)
      this.setState((state) => {
        return {
          ...state,
          showModal: '',
          taskActionStartTimer: ''
        }
      })
    }
  }

  getDefaultValue = (value) => {
    this.setState({ timeStop: value })
  }
  handleDateChange = async (value) => {
    let a = value.split('-')
    let dateStop = a[2] + '-' + a[1] + '-' + a[0]
    await this.setState((state) => {
      return {
        ...state,
        dateStop: dateStop
      }
    })
    // this.validateTime()
  }

  handleTimeChange = (value) => {
    this.setState((state) => {
      return {
        ...state,
        timeStop: value
      }
    })
    // this.validateTime()
  }

  validateTime = () => {
    if (this.state.timeStop && this.state.dateStop) {
      const { performtasks } = this.props
      var startedAt = performtasks.currentTimer?.timesheetLogs[0]?.startedAt
      var stoppedAt = this.state.dateStop + ' ' + this.state.timeStop
      var isoDate = new Date(stoppedAt).toISOString()
      var milisec = new Date(isoDate).getTime()
      if (milisec < startedAt) {
        this.setState({
          disabled: true,
          errorOnEndDate: 'Thời điểm kết thúc phải sau khi bắt đầu bấm giờ'
        })
      } else {
        this.setState({
          disabled: false,
          errorOnEndDate: undefined
        })
      }
    }
  }

  endDate = (event) => {
    this.setState({
      showEndDate: event.target.checked
    })
  }

  // Function format ngày hiện tại thành dạnh mm-yyyy
  formatDate = (date) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()

    if (month.length < 2) {
      month = '0' + month
    }

    if (day.length < 2) {
      day = '0' + day
    }

    return [year, month, day].join('-')
  }
  formatDate1 = (date) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()

    if (month.length < 2) {
      month = '0' + month
    }

    if (day.length < 2) {
      day = '0' + day
    }

    return [day, month, year].join('-')
  }

  getDiffTime = (time1, time2) => {
    if (!time1 || !time2) return 0
    let timer1 = new Date(time1)
    let timer2 = new Date(time2)
    let diff = timer1.getTime() - timer2.getTime()

    return diff
  }

  showTiming = (time) => {
    if (time <= 0) {
      return '__:__:__'
    } else {
      return moment.utc(time).format('HH:mm:ss')
    }
  }

  handleSelectTaskAction = (value) => {
    const { translate } = this.props

    value = value[0]
    let { message } = ValidationHelper.validateEmpty(translate, value)

    this.setState({
      ...this.state,
      taskActionStartTimer: value,
      errorTaskAction: message
    })
  }

  render() {
    const { translate, performtasks, auth } = this.props
    const { showEndDate, disabled, errorOnEndDate, currentUser, time, taskActionList, taskActionStartTimer, errorTaskAction } = this.state
    const currentTimer = performtasks.currentTimer
    const a = this.getDiffTime(this.state.time, currentTimer?.timesheetLogs[0].startedAt)

    return (
      <React.Fragment>
        {currentTimer && (
          <React.Fragment>
            <div className='timesheet-box' id={currentUser}>
              <div className='time'>
                <div>
                  <span>
                    <i
                      className='fa fa-cog'
                      aria-hidden='true'
                      style={{ cursor: 'pointer' }}
                      title='Cấu hình bấm giờ'
                      onClick={this.handleStopTimer}
                    ></i>
                    {/* <i className="fa fa-stop-circle-o fa-lg" style={{ color: "red", cursor: "pointer" }} aria-hidden="true" title="Dừng bấm giờ" onClick={this.handleStopTimer}></i> */}
                  </span>
                  <span>&nbsp;&nbsp; {this.showTiming(a)}</span>
                </div>
                {this.state.showModal === auth.user.id && (
                  <i
                    style={{ cursor: 'pointer', color: '#385899', fontSize: '14px' }}
                    className='fa fa-window-minimize'
                    aria-hidden='true'
                    onClick={this.resumeTimer}
                  ></i>
                )}
                {(this.state.showModal === auth.user.id) === false && (
                  <a href={`/task?taskId=${currentTimer._id}`}>
                    <i className='fa fa-arrow-circle-right'></i>
                  </a>
                )}
              </div>
              {this.state.showModal === auth.user.id && (
                <React.Fragment>
                  <h4 className='task-name'>{currentTimer.name}</h4>
                  <form style={{ marginBottom: '5px' }}>
                    <input type='checkbox' id='stoppedAt' name='stoppedAt' onChange={this.endDate} />
                    <label htmlFor='stoppedAt'>&nbsp;Hẹn giờ kết thúc bấm giờ công việc</label>
                  </form>

                  {showEndDate && (
                    <div className={`form-group ${!errorOnEndDate ? '' : 'has-error'}`}>
                      <ErrorLabel content={errorOnEndDate} />
                      <DatePicker
                        id={`date-picker-${currentTimer._id}`}
                        onChange={this.handleDateChange}
                        defaultValue={this.formatDate1(Date.now())}
                      />
                      <TimePicker
                        id={`time-picker-${currentTimer._id}`}
                        onChange={this.handleTimeChange}
                        getDefaultValue={this.getDefaultValue}
                      />
                    </div>
                  )}
                  <div className='form-group task-action'>
                    <label>
                      Bấm giờ cho hoạt động <span className='text-red'>*</span>
                    </label>
                    <SelectBox
                      id={`action-timer-${currentTimer._id}`}
                      className='form-control select2'
                      style={{ width: '100%' }}
                      value={taskActionStartTimer}
                      items={taskActionList}
                      onChange={this.handleSelectTaskAction}
                    />
                    <ErrorLabel content={errorTaskAction} />
                  </div>
                  <label>Mô tả công việc đã làm (*)</label>
                  <TextareaAutosize
                    style={{ width: '100%', marginBottom: '5px' }}
                    placeholder={translate('task.task_perform.enter_description')}
                    minRows={5}
                    maxRows={20}
                    onClick={(e) => {
                      e.stopPropagation()
                      window.$(document).off('focusin.modal')
                    }}
                    onChange={(e) => {
                      let value = e.target.value
                      this.setState((state) => {
                        return { ...state, description: value }
                      })
                    }}
                  />
                  <div style={{ width: '100%' }}>
                    <button
                      className='btn btn-primary'
                      style={{ marginRight: 5, width: `calc(100% / ${2} - 5px) ` }}
                      disabled={disabled || taskActionStartTimer ? false : true}
                      onClick={this.stopTimer}
                    >
                      <i className='fa fa-floppy-o' aria-hidden='true' style={{ color: '#fff', marginRight: '5px' }}></i>Lưu
                    </button>
                    <button className='btn btn-danger' style={{ width: `calc(100% / ${2} - 5px ` }} onClick={this.cancelTimer}>
                      <i className='fa fa-trash' aria-hidden='true' style={{ color: '#fff', marginRight: '5px' }}></i>Hủy bỏ
                    </button>
                    {/* <button className="btn btn-success" style={{ width: `calc(100% / ${3} - 5px) ` }} onClick={this.resumeTimer}><i className="fa fa-arrow-up" aria-hidden="true" style={{ color: "#fff", marginRight: '5px' }}></i>Thu gọn</button> */}
                  </div>
                </React.Fragment>
              )}
            </div>
          </React.Fragment>
        )}
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  const { translate, performtasks, auth, socket } = state
  return { translate, performtasks, auth, socket }
}

const mapDispatchToProps = {
  getTimerStatusTask: performTaskAction.getTimerStatusTask,
  stopTimer: performTaskAction.stopTimerTask,
  stopTimeAllDevices: performTaskAction.stopTimeAllDevices
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TaskTimesheetLog))
