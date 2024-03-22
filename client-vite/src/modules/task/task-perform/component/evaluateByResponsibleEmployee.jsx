import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { ErrorLabel, DatePicker, SelectBox, QuillEditor, TimePicker } from '../../../../common-components/index'
import { performTaskAction } from '../redux/actions'
import { managerKpiActions } from '../../../kpi/employee/management/redux/actions'
import { TaskInformationForm } from './taskInformationForm'
import { AutomaticTaskPointCalculator } from './automaticTaskPointCalculator'
import { ModalShowAutoPointInfo } from './modalShowAutoPointInfo'
import { getStorage } from '../../../../config'
import moment from 'moment'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import './scrollBar.css'

// var indexReRender = 0;
function EvaluateByResponsibleEmployee(props) {
  const [state, setState] = useState(initState())
  const [progress, setProgress] = useState(initState().progress)
  const [errorOnProgress, setErrorOnProgress] = useState(undefined)
  const { translate, KPIPersonalManager, user, performtasks } = props
  const { role, id, perform } = props
  const {
    isEval,
    startDate,
    endDate,
    startTime,
    endTime,
    info,
    task,
    point,
    oldAutoPoint,
    autoPoint,
    evaluatingMonth,
    date,
    unit,
    kpi,
    showAutoPointInfo,
    dentaDate,
    prevDate,
    indexReRender,
    evaluation
  } = state
  const { errorOnEndDate, errorOnStartDate, errorOnPoint, errorOnMonth } = state

  function initState() {
    const DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 }

    // let date = formatDate(new Date());
    let { date, id, isEval } = props
    let data = getData(date)

    return {
      errorInfo: {},
      id: id,
      isEval: isEval,
      calcInfo: {},
      task: data.task,
      idUser: data.idUser,
      info: data.info,
      autoPoint: data.calcAuto,
      oldAutoPoint: data.autoPoint,
      date: data.date,
      startDate: data.startDate,
      endDate: data.endDate,
      startTime: data.startTime,
      endTime: data.endTime,
      evaluatingMonth: data.evaluatingMonth,
      storedEvaluatingMonth: data.storedEvaluatingMonth,
      kpi: data.kpi,
      point: data.point,
      progress: data.progress,
      checkSave: data.checkSave,
      prevDate: data.prevDate,
      dentaDate: data.dentaDate,
      dataStatus: DATA_STATUS.NOT_AVAILABLE,
      indexReRender: 0,
      unit: data.unit,
      evaluation: data.evaluation
    }
  }

  useEffect(() => {
    let { idUser, unit } = state
    let { date } = props
    let defaultDepartment = unit
    if (date) {
      props.getAllKpiSetsOrganizationalUnitByMonth(idUser, defaultDepartment, date)
    }
  }, [])

  if (props.id !== state.id) {
    setState({
      ...state,

      id: props.id,

      errorOnEndDate: undefined, // Khi nhận thuộc tính mới, cần lưu ý reset lại các gợi ý nhắc lỗi, nếu không các lỗi cũ sẽ hiển thị lại
      errorOnStartDate: undefined,
      errorOnMonth: undefined,
      errorOnPoint: undefined,
      errorOnInfoDate: undefined,
      errorInfo: {}
    })
    setErrorOnProgress(undefined)
  }

  useEffect(() => {
    let { idUser, unit } = state
    let department = unit
    let date = props.date
    let data = getData(date)
    if (date) {
      props.getAllKpiSetsOrganizationalUnitByMonth(idUser, department, date)
    }

    setState({
      ...state,
      id: props.id,
      isEval: props.isEval,
      task: data.task,
      info: data.info,
      autoPoint: data.calcAuto,
      oldAutoPoint: data.autoPoint,
      date: date,
      startDate: data.startDate,
      endDate: data.endDate,
      startTime: data.startTime,
      endTime: data.endTime,
      evaluatingMonth: data.evaluatingMonth,
      storedEvaluatingMonth: data.storedEvaluatingMonth,
      kpi: data.kpi,
      point: data.point,
      progress: data.progress,
      checkSave: data.checkSave,
      prevDate: data.prevDate,
      dentaDate: data.dentaDate,
      indexReRender: state.indexReRender + 1,
      evaluation: data.evaluation
    })
    setProgress(data.progress)
    setErrorOnProgress(undefined)
  }, [id])

  /**
   * kiểm tra đánh giá tháng hiện tại có chưa
   * @param {*} date
   * @param {*} performtasks
   * @returns
   */
  function checkHasEval(date, performtasks) {
    let splitter = date.split('-')
    let dateOfEval = new Date(splitter[2], splitter[1] - 1, splitter[0])

    let monthOfEval = dateOfEval.getMonth()
    let yearOfEval = dateOfEval.getFullYear()

    let taskId, evaluation
    taskId = performtasks.task?._id
    evaluation = performtasks.task?.evaluations.find(
      (e) => monthOfEval === new Date(e.evaluatingMonth).getMonth() && yearOfEval === new Date(e.evaluatingMonth).getFullYear()
    )

    if (evaluation) return true
    return false
  }

  const checkIsNewEval = (id) => {
    let splitter = id.split('-')
    if (splitter[0].trim() === 'new') {
      return true
    } else return false
  }

  function handleSortMonthEval(evaluations) {
    // sắp xếp đánh giá theo thứ tự tháng
    const sortedEvaluations = evaluations?.sort((a, b) => new Date(b.evaluatingMonth) - new Date(a.evaluatingMonth))
    return sortedEvaluations
  }

  function getPreviousEvaluation(task, date) {
    let evaluations = task.evaluations
    let sortedEvaluations = handleSortMonthEval(evaluations)

    let evalMonth = moment(date, 'DD-MM-YYYY').endOf('month').toDate()
    for (let i in sortedEvaluations) {
      let eva = sortedEvaluations[i]
      if (new Date(eva?.evaluatingMonth) <= evalMonth) {
        return eva
      }
    }
    return null
  }

  /**
   * Hàm xử lý dữ liệu khởi tạo
   *  @dateParam : để truyền vào thông tin ngày đánh giá. khi khởi tạo thì đang cho giá trị storedEvaluateMonth = endDate nên chỉ cần truyền vào 1 tham số này
   *  @evaluatingMonth : giá trị tháng đánh giá. Truyền vào khi thay đổi tháng đánh giá, hoặc thay đổi ngày đánh giá lần này (endDate)
   * */
  function getData(dateParam, evaluatingMonthParam) {
    const { user, performtasks } = props
    let { task, id } = props
    let idUser = getStorage('userId')
    let unit
    if (user.organizationalUnitsOfUser && user.organizationalUnitsOfUser.length > 0) {
      unit = user.organizationalUnitsOfUser[0]._id
    }
    if (dateParam) {
      let checkSave = false
      let date = dateParam
      let endDate = dateParam
      let startDateTask = task.startDate
      let prevDate = formatDate(startDateTask)

      let startTime = formatTime(new Date(startDateTask))
      let endTime = formatTime(new Date())

      let dentaDate = 0
      let evaluation, prevEval

      let splitter = dateParam.split('-')
      if (evaluatingMonthParam) {
        splitter = evaluatingMonthParam.split('-')
      }

      let evaluatingMonth = '',
        storedEvaluatingMonth = ''
      let today = formatDate(new Date())
      let checkHasEvalOfMonth = checkHasEval(today, performtasks)
      evaluatingMonth = `${splitter[1]}-${splitter[2]}`
      storedEvaluatingMonth = moment(evaluatingMonth, 'MM-YYYY').endOf('month').format('DD-MM-YYYY')

      let dateOfEval = new Date(splitter[2], splitter[1] - 1, splitter[0])
      let dateOfPrevEval = new Date(splitter[2], splitter[1] - 1, splitter[0])
      var newMonth = dateOfPrevEval.getMonth() - 1
      if (newMonth < 0) {
        newMonth += 12
        dateOfPrevEval.setYear(dateOfPrevEval.getFullYear() - 1)
      }

      dateOfPrevEval.setDate(15)
      dateOfPrevEval.setMonth(newMonth)

      let monthOfEval = dateOfEval.getMonth()
      let monthOfPrevEval = dateOfPrevEval.getMonth()
      let yearOfEval = dateOfEval.getFullYear()
      let yearOfPrevEval = dateOfPrevEval.getFullYear()

      evaluation = task.evaluations.find(
        (e) => monthOfEval === new Date(e.evaluatingMonth).getMonth() && yearOfEval === new Date(e.evaluatingMonth).getFullYear()
      )

      prevEval = getPreviousEvaluation(task, dateParam)

      if (prevEval) {
        prevDate = formatDate(prevEval.endDate)
        startTime = formatTime(prevEval.endDate)
      }
      let automaticPoint = evaluation && evaluation.results.length !== 0 ? evaluation.results[0].automaticPoint : undefined

      let point = undefined
      let info = {}
      let cloneKpi = []

      let infoTask = task.taskInformations
      for (let i in infoTask) {
        if (infoTask[i].type === 'date') {
          if (!infoTask[i].filledByAccountableEmployeesOnly) {
            info[`${infoTask[i].code}`] = {
              code: infoTask[i].code,
              type: infoTask[i].type
            }
          }
        } else if (infoTask[i].type === 'set_of_values') {
          let splitSetOfValues = infoTask[i].extra.split('\n')
          if (!infoTask[i].filledByAccountableEmployeesOnly) {
            info[`${infoTask[i].code}`] = {
              value: [splitSetOfValues[0]],
              code: infoTask[i].code,
              type: infoTask[i].type
            }
          }
        } else {
          if (infoTask[i].value || infoTask[i].value === 0) {
            info[`${infoTask[i].code}`] = {
              value: infoTask[i].value,
              code: infoTask[i].code,
              type: infoTask[i].type
            }
          }
        }
      }

      let progress = 0
      if (evaluation) {
        progress = evaluation.progress
        if (evaluation.results.length !== 0) {
          let tmp = evaluation.results.find((e) => String(e.employee._id) === String(idUser) && String(e.role) === 'responsible')
          if (tmp) {
            if (tmp.organizationalUnit) {
              unit = tmp.organizationalUnit._id
            }
            let kpi = tmp.kpis

            for (let i in kpi) {
              cloneKpi.push(kpi[i]._id)
            }

            point = tmp.employeePoint ? tmp.employeePoint : undefined
          }
        }
        let infoEval = evaluation.taskInformations
        let chkHasInfo = false
        for (let i in infoEval) {
          if (infoEval[i].value !== undefined) {
            chkHasInfo = true
            break
          }
        }

        if (chkHasInfo) {
          for (let i in infoEval) {
            if (infoEval[i].type === 'date') {
              if (infoEval[i].value) {
                info[`${infoEval[i].code}`] = {
                  value: formatDate(infoEval[i].value),
                  code: infoEval[i].code,
                  type: infoEval[i].type
                }
              } else if (!infoEval[i].filledByAccountableEmployeesOnly) {
                info[`${infoEval[i].code}`] = {
                  code: infoEval[i].code,
                  type: infoEval[i].type
                }
              }
            } else if (infoEval[i].type === 'set_of_values') {
              let splitSetOfValues = infoEval[i].extra.split('\n')
              if (infoEval[i].value) {
                info[`${infoEval[i].code}`] = {
                  value: [infoEval[i].value],
                  code: infoEval[i].code,
                  type: infoEval[i].type
                }
              } else if (!infoEval[i].filledByAccountableEmployeesOnly) {
                info[`${infoEval[i].code}`] = {
                  value: [splitSetOfValues[0]],
                  code: infoEval[i].code,
                  type: infoEval[i].type
                }
              }
            } else {
              if (infoEval[i].value || infoEval[i].value === 0) {
                info[`${infoEval[i].code}`] = {
                  value: infoEval[i].value,
                  code: infoEval[i].code,
                  type: infoEval[i].type
                }
              }
            }
          }
        }
      }

      let startDate = prevDate
      if (evaluation) {
        endDate = formatDate(evaluation.endDate)
        startDate = formatDate(evaluation.startDate)
        startTime = formatTime(evaluation.startDate)
        endTime = formatTime(evaluation.endDate)
      }

      let taskInfo = {
        task: task,
        progress: progress,
        date: endDate,
        time: endTime,
        info: info
      }

      let calcAuto = AutomaticTaskPointCalculator.calcAutoPoint(taskInfo)
      if (isNaN(calcAuto)) calcAuto = undefined
      if (calcAuto < 0) calcAuto = 0

      dentaDate = Math.round((new Date().getTime() - dateOfEval.getTime()) / (1000 * 3600 * 24))

      return {
        task: task,
        unit: unit,
        idUser: idUser,
        kpi: cloneKpi,
        info: info,
        autoPoint: automaticPoint,
        point: point,
        date: date,
        startDate: startDate,
        endDate: endDate,
        startTime: startTime,
        endTime: endTime,
        evaluatingMonth: evaluatingMonth,
        storedEvaluatingMonth: storedEvaluatingMonth,
        progress: progress,
        calcAuto: calcAuto,
        checkSave: checkSave,
        prevDate: prevDate,
        dentaDate: dentaDate,
        evaluation: evaluation
      }
    } else {
      return {
        task: task,
        unit: unit,
        idUser: idUser,
        info: {},
        kpi: []
      }
    }
  }

  // Hàm lấy thông tin task information từ thông tin công việc hiện tại
  function getInfo(dateParam) {
    let info = {}
    let checkSave = false

    let date = dateParam
    if (date) {
      let evaluation
      let task = props.task
      let splitter = dateParam.split('-')
      let dateOfEval = new Date(splitter[2], splitter[1] - 1, splitter[0])
      let monthOfEval = dateOfEval.getMonth()
      let yearOfEval = dateOfEval.getFullYear()

      evaluation = task.evaluations.find(
        (e) => monthOfEval === new Date(e.evaluatingMonth).getMonth() && yearOfEval === new Date(e.evaluatingMonth).getFullYear()
      )
      let automaticPoint = evaluation && evaluation.results.length !== 0 ? evaluation.results[0].automaticPoint : undefined
      let infoTask = task.taskInformations

      for (let i in infoTask) {
        if (infoTask[i].type === 'date') {
          if (infoTask[i].value) {
            info[`${infoTask[i].code}`] = {
              value: formatDate(infoTask[i].value),
              code: infoTask[i].code,
              type: infoTask[i].type
            }
          } else if (!infoTask[i].filledByAccountableEmployeesOnly) {
            info[`${infoTask[i].code}`] = {
              value: formatDate(Date.now()),
              code: infoTask[i].code,
              type: infoTask[i].type
            }
          }
        } else if (infoTask[i].type === 'set_of_values') {
          let splitSetOfValues = infoTask[i].extra.split('\n')
          if (infoTask[i].value) {
            info[`${infoTask[i].code}`] = {
              value: [infoTask[i].value],
              code: infoTask[i].code,
              type: infoTask[i].type
            }
          } else if (!infoTask[i].filledByAccountableEmployeesOnly) {
            info[`${infoTask[i].code}`] = {
              value: [splitSetOfValues[0]],
              code: infoTask[i].code,
              type: infoTask[i].type
            }
          }
        } else {
          if (infoTask[i].value || infoTask[i].value === 0) {
            info[`${infoTask[i].code}`] = {
              value: infoTask[i].value,
              code: infoTask[i].code,
              type: infoTask[i].type
            }
          }
        }
      }

      let progress = task.progress

      let taskInfo = {
        task: task,
        progress: progress,
        date: state.endDate,
        time: state.endTime,
        info: info
      }

      let calcAuto = AutomaticTaskPointCalculator.calcAutoPoint(taskInfo)
      if (isNaN(calcAuto)) calcAuto = undefined
      if (calcAuto < 0) calcAuto = 0

      return {
        info: info,
        autoPoint: automaticPoint,
        progress: progress,
        calcAuto: calcAuto,
        checkSave: checkSave
      }
    } else
      return {
        info: {},
        checkSave: checkSave
      }
  }

  // hàm cập nhật thông tin
  const updateInfo = async () => {
    // indexReRender = indexReRender + 1;
    let data = getInfo(state.storedEvaluatingMonth)
    await setState({
      ...state,

      info: data.info,
      autoPoint: data.calcAuto,
      oldAutoPoint: data.autoPoint,
      progress: data.progress,
      checkSave: data.checkSave,
      indexReRender: state.indexReRender + 1
    })
    setProgress(data.progress)
  }

  // Function format ngày hiện tại thành dạnh dd-mm-yyyy
  function formatDate(date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return [day, month, year].join('-')
  }

  // hàm thay đổi kpi
  const handleKpiChange = (value) => {
    setState({
      ...state,
      kpi: value
    })
  }

  // hàm cập nhật đơn vị
  const handleChangeUnit = (value) => {
    setState({
      ...state,
      unit: value[0],
      kpi: []
    })
    props.getAllKpiSetsOrganizationalUnitByMonth(state.idUser, value[0], state.storedEvaluatingMonth)
  }

  // convert ISODate to String hh:mm AM/PM
  function formatTime(date) {
    var d = new Date(date)
    let time = moment(d).format('hh:mm')
    let suffix = ' AM'
    if (d.getHours() >= 12 && d.getHours() <= 23) {
      suffix = ' PM'
    }
    return time + suffix
  }

  const validateDateTime = (evaluatingMonth, startDate, startTime, endDate, endTime, type) => {
    let { translate } = props
    let { isEval, storedEvaluatingMonth, task } = state

    // init data
    let msg
    if (evaluatingMonth.trim() === '') {
      msg = translate('task.task_management.add_err_empty_end_date')
      return msg
    }

    let endOfMonth = moment(evaluatingMonth, 'MM-YYYY').endOf('month').toDate()
    let startOfMonth = moment(evaluatingMonth, 'MM-YYYY').startOf('month').toDate()
    let monthOfEval = startOfMonth.getMonth()
    let yearOfEval = startOfMonth.getFullYear()

    // convert ISO date
    let startDateISO = convertDateTime(startDate, startTime)
    let endDateISO = convertDateTime(endDate, endTime)

    // tìm đánh giá tháng này
    let monthOfEvalStart = startDateISO.getMonth()
    let yearOfEvalStart = startDateISO.getFullYear()
    let monthOfEvalEnd = endDateISO.getMonth()
    let yearOfEvalEnd = endDateISO.getFullYear()
    let tmpStart = task.evaluations.find(
      (e) => monthOfEvalStart === new Date(e.evaluatingMonth).getMonth() && yearOfEvalStart === new Date(e.evaluatingMonth).getFullYear()
    )
    let tmpEnd = task.evaluations.find(
      (e) => monthOfEvalEnd === new Date(e.evaluatingMonth).getMonth() && yearOfEvalEnd === new Date(e.evaluatingMonth).getFullYear()
    )

    // kiểm tra sâu rỗng
    if (
      (evaluatingMonth.trim() === '' && startDate.trim() === '') ||
      startTime.trim() === '' ||
      endDate.trim() === '' ||
      endTime.trim() === ''
    ) {
      msg = translate('task.task_management.add_err_empty_end_date')
    }
    // kiểm tra ngày bắt đầu so với ngày kết thúc
    else if (startDateISO > endDateISO) {
      msg = translate('task.task_management.add_err_end_date')
    } else if (type === 'start') {
      // kiểm tra điều kiện trong tháng đánh giá
      if (startDateISO < startOfMonth || startDateISO > endOfMonth) {
        msg = 'Khoảng đánh giá phải chứa tháng đánh giá'
      }

      // kiểm tra ngày đánh giá so với các ngày khác
      else if (tmpStart) {
        if (
          !(
            monthOfEval === new Date(tmpStart.evaluatingMonth).getMonth() && yearOfEval === new Date(tmpStart.evaluatingMonth).getFullYear()
          )
        ) {
          if (startDateISO < new Date(tmpStart.endDate)) {
            msg = 'Ngày đánh giá tháng này không được đè lên ngày đánh giá của tháng khác'
          }
        }
      }
    } else if (type === 'end') {
      if (endDateISO < startOfMonth || endDateISO > endOfMonth) {
        msg = 'Khoảng đánh giá phải chứa tháng đánh giá'
      }

      // kiểm tra ngày đánh giá so với các ngày khác
      else if (tmpEnd) {
        if (
          !(monthOfEval === new Date(tmpEnd.evaluatingMonth).getMonth() && yearOfEval === new Date(tmpEnd.evaluatingMonth).getFullYear())
        ) {
          if (endDateISO > new Date(tmpEnd.startDate)) {
            msg = 'Ngày đánh giá tháng này không được đè lên ngày đánh giá của tháng khác'
          }
        }
      }
    }

    return msg
  }

  // hàm cập nhật ngày đánh giá từ
  const handleStartDateChange = (value) => {
    let { translate } = props
    let { evaluatingMonth, endDate, startDate, endTime, startTime } = state

    let err = validateDateTime(evaluatingMonth, value, startTime, endDate, endTime, 'start')

    setState({
      ...state,
      startDate: value,
      errorOnStartDate: err,
      indexReRender: state.indexReRender + 1
    })
  }

  // hàm cập nhật ngày đánh giá hiện tại
  const handleEndDateChange = (value) => {
    // indexReRender = indexReRender + 1;
    let { translate } = props

    let { evaluatingMonth, endDate, startDate, endTime, startTime } = state

    let err = validateDateTime(evaluatingMonth, startDate, startTime, value, endTime, 'end')

    let automaticPoint = state.autoPoint
    let taskInfo = {
      task: state.task,
      progress: state.progress,
      date: value,
      time: state.endTime,
      info: state.info
    }

    automaticPoint = AutomaticTaskPointCalculator.calcAutoPoint(taskInfo)
    if (isNaN(automaticPoint)) automaticPoint = undefined
    if (automaticPoint < 0) automaticPoint = 0

    setState({
      ...state,
      endDate: value,
      autoPoint: automaticPoint,
      // oldAutoPoint: data.autoPoint,
      errorOnEndDate: err,
      indexReRender: state.indexReRender + 1
    })
  }

  const handleStartTimeChange = (value) => {
    let { translate } = props
    let { evaluatingMonth, endDate, startDate, endTime, startTime } = state

    let err = validateDateTime(evaluatingMonth, startDate, value, endDate, endTime, 'start')

    setState({
      ...state,
      startTime: value,
      errorOnStartDate: err
    })
  }

  const handleEndTimeChange = (value) => {
    let { translate } = props

    let { evaluatingMonth, endDate, startDate, endTime, startTime } = state

    let err = validateDateTime(evaluatingMonth, startDate, startTime, endDate, value, 'end')

    let automaticPoint = state.autoPoint
    let taskInfo = {
      task: state.task,
      progress: state.progress,
      date: state.endDate,
      time: value,
      info: state.info
    }

    automaticPoint = AutomaticTaskPointCalculator.calcAutoPoint(taskInfo)
    if (isNaN(automaticPoint)) automaticPoint = undefined
    if (automaticPoint < 0) automaticPoint = 0

    setState({
      ...state,
      endTime: value,
      autoPoint: automaticPoint,
      // oldAutoPoint: data.autoPoint,
      errorOnEndDate: err
    })
  }

  const convertDateTime = (date, time) => {
    let splitter = date.split('-')
    let strDateTime = `${splitter[2]}/${splitter[1]}/${splitter[0]} ${time}`
    return new Date(strDateTime)
  }

  // hàm cập nhật tháng đánh giá
  const handleMonthOfEvaluationChange = (value) => {
    dayjs.extend(isSameOrAfter)
    let { task, idUser } = state
    let splitValue, result, startDateTask, errMonth

    // validate tháng đánh giá đã tồn tại
    if (value.trim() === '') {
      errMonth = 'Hãy chọn tháng đánh giá'
    } else {
      splitValue = value.split('-')
      const newValue = `${splitValue[1]}-${splitValue[0]}`

      const evalDate = moment(newValue).endOf('month').format('DD-MM-YYYY')

      const monthOfEval = dayjs(newValue).format('M') - 1
      const yearOfEval = parseInt(dayjs(newValue).format('YYYY'))

      const tmp = task.evaluations.find(
        (e) => monthOfEval === new Date(e.evaluatingMonth).getMonth() && yearOfEval === new Date(e.evaluatingMonth).getFullYear()
      )
      if (tmp) {
        errMonth = 'Tháng này đã có đánh giá'
      }

      startDateTask = dayjs(task.startDate).format('YYYY-MM') // Lấy năm tháng của ngày bắt đầu công việc vd: 2021-02
      result = dayjs(newValue).isSameOrAfter(dayjs(startDateTask)) // check xem thangs danh gia co lớn hơn hoặc bằng tháng bắt đầu công việc hay không

      if (!result) {
        errMonth = 'Tháng đánh giá phải lớn hơn hoặc bằng tháng bắt đầu công việc'
      }

      let data = getData(evalDate, evalDate)
      props.getAllKpiSetsOrganizationalUnitByMonth(idUser, state.unit, evalDate)

      let automaticPoint = data.autoPoint
      let taskInfo = {
        task: data.task,
        progress: data.progress,
        date: evalDate,
        time: data.endTime,
        info: data.info
      }

      automaticPoint = AutomaticTaskPointCalculator.calcAutoPoint(taskInfo)
      if (isNaN(automaticPoint)) automaticPoint = undefined
      if (automaticPoint < 0) automaticPoint = 0

      setState({
        ...state,
        kpi: [],
        evaluatingMonth: value,
        storedEvaluatingMonth: evalDate,
        endDate: evalDate,
        startDate: data.startDate,
        startTime: data.startTime,
        endTime: data.endTime,
        autoPoint: automaticPoint,
        oldAutoPoint: data.autoPoint,
        errorOnMonth: errMonth,
        indexReRender: state.indexReRender + 1,

        info: data.info,
        point: data.point,
        date: data.date,
        progress: data.progress,
        calcAuto: data.calcAuto,
        checkSave: data.checkSave,
        prevDate: data.prevDate,
        dentaDate: data.dentaDate,
        evaluation: data.evaluation
      })
      if (!errMonth) {
        props.handleChangeMonthEval({ evaluatingMonth: value, date: evalDate, id: state.id })
      }
    }
  }
  const getStartTask = async () => {
    let { translate } = props
    let { task } = state
    let start = task?.startDate
    let startDate = formatDate(new Date(start))
    let startTime = formatTime(new Date(start))

    let { evaluatingMonth, endDate, endTime, idUser } = state
    let err = validateDateTime(evaluatingMonth, startDate, startTime, endDate, endTime, 'start')

    setState({
      ...state,
      errorOnStartDate: err,
      startDate: startDate,
      startTime: startTime,
      indexReRender: state.indexReRender + 1
    })
  }
  const getEndTask = async () => {
    let { translate } = props
    let { task } = state
    let end = task?.endDate
    let endDate = formatDate(new Date(end))
    let endTime = formatTime(new Date(end))

    let { evaluatingMonth, startDate, startTime, idUser } = state

    let err = validateDateTime(evaluatingMonth, startDate, startTime, endDate, endTime, 'end')

    let data = getData(endDate, state.storedEvaluatingMonth)

    let automaticPoint = data.automaticPoint
    let taskInfo = {
      task: data.task,
      progress: state.progress,
      date: endDate,
      time: endTime,
      info: state.info
    }

    automaticPoint = AutomaticTaskPointCalculator.calcAutoPoint(taskInfo)
    if (isNaN(automaticPoint)) automaticPoint = undefined
    if (automaticPoint < 0) automaticPoint = 0

    setState({
      ...state,
      errorOnEndDate: err,
      endDate: endDate,
      endTime: endTime,
      autoPoint: automaticPoint,
      oldAutoPoint: data.autoPoint,
      indexReRender: state.indexReRender + 1
    })
  }

  // hàm cập nhật điểm tự đánh giá
  const handleChangePoint = async (e) => {
    let value = parseInt(e.target.value)
    await setState({
      ...state,
      point: value,
      errorOnPoint: validatePoint(value)
    })
  }

  // hàm cập nhật tiến độ
  const handleChangeProgress = (e) => {
    let { translate } = props
    let value = parseInt(e.target.value)
    let msg
    if (value < 0 || value > 100) {
      msg = translate('task.task_perform.modal_approve_task.err_range')
    }
    setProgress(value)
    setErrorOnProgress(msg)

    let taskInfo = {
      task: state.task,
      progress: value,
      date: state.endDate,
      time: state.endTime,
      info: state.info
    }
    let automaticPoint = AutomaticTaskPointCalculator.calcAutoPoint(taskInfo)
    if (isNaN(automaticPoint)) automaticPoint = undefined
    if (automaticPoint < 0) {
      automaticPoint = 0
    }
    setState({
      ...state,
      autoPoint: automaticPoint,
      showAutoPointInfo: undefined
    })
  }

  // Bắt đầu: Các hàm cập nhật thông tin đánh giá
  const handleChangeNumberInfo = async (e) => {
    let value = parseInt(e.target.value)
    let name = e.target.name
    await setState((state) => {
      state.info[`${name}`] = {
        value: value,
        code: name,
        type: 'number'
      }
      state.errorInfo[name] = validateNumberInfo(value)
      return {
        ...state
      }
    })
    await handleChangeAutoPoint()
  }

  const handleChangeTextInfo = async (e) => {
    let value = e.target.value
    let name = e.target.name
    await setState((state) => {
      state.info[`${name}`] = {
        value: value,
        code: name,
        type: 'text'
      }
      state.errorInfo[name] = validateTextInfo(value)
      return {
        ...state
      }
    })
  }

  const handleInfoDateChange = (value, code) => {
    setState((state) => {
      state.info[`${code}`] = {
        value: value,
        code: code,
        type: 'date'
      }
      state.errorInfo[code] = validateDate(value)
      return {
        ...state
      }
    })
  }

  const handleSetOfValueChange = async (value, code) => {
    setState((state) => {
      state.info[`${code}`] = {
        value: value,
        code: code,
        type: 'set_of_values'
      }
      return {
        ...state
      }
    })
  }

  const handleInfoBooleanChange = (event) => {
    let { name, value } = event.target
    setState((state) => {
      state.info[`${name}`] = {
        value: value,
        code: name,
        type: 'boolean'
      }
      return {
        ...state
      }
    })
  }
  // Kết thúc: cá hàm cập nhật thông tin đánh giá

  // Các hàm validate dữ liệu:
  const validateInfoBoolean = (value, willUpdateState = true) => {
    let { translate } = props
    let msg = undefined
    if (value.indexOf('') !== -1) {
      // msg = translate('task.task_perform.modal_approve_task.err_empty');
    }

    return msg
  }

  const validateTextInfo = (value) => {
    let { translate } = props
    let msg = undefined
    if (value === '') {
      // msg = translate('task.task_perform.modal_approve_task.err_empty')
    }
    return msg
  }

  const validateNumberInfo = (value) => {
    let { translate } = props
    let msg = undefined

    if (isNaN(value)) {
      // msg = translate('task.task_perform.modal_approve_task.err_empty');
    }
    return msg
  }

  const validateDate = (value, willUpdateState = true) => {
    let { translate } = props
    let msg = undefined
    if (value.trim() === '') {
      // msg = translate('task.task_perform.modal_approve_task.err_empty');
    }

    return msg
  }

  const validatePoint = (value) => {
    let { translate } = props
    let msg = undefined
    if (value < 0 || value > 100) {
      msg = translate('task.task_perform.modal_approve_task.err_range')
    }
    if (isNaN(value)) {
      msg = translate('task.task_perform.modal_approve_task.err_empty')
    }
    return msg
  }
  // end

  // hàm validate submit
  const isFormValidated = () => {
    const {
      evaluatingMonth,
      errorOnDate,
      errorOnMonth,
      errorOnStartDate,
      errorOnEndDate,
      errorOnPoint,
      errorOnInfoDate,
      errorOnTextInfo,
      errorOnNumberInfo
    } = state
    var { info } = state

    var check = true
    for (let i in info) {
      if (info[i].value === undefined) {
        check = false
        break
      }
    }

    return evaluatingMonth &&
      evaluatingMonth.trim() !== '' &&
      errorOnMonth === undefined &&
      errorOnStartDate === undefined &&
      errorOnEndDate === undefined &&
      errorOnDate === undefined &&
      errorOnPoint === undefined &&
      errorOnProgress === undefined &&
      errorOnInfoDate === undefined &&
      errorOnTextInfo === undefined &&
      errorOnNumberInfo === undefined
      ? true
      : false
  }

  // Hàm tính điểm tự động
  const calcAutomaticPoint = () => {
    let taskInfo = {
      task: state.task,
      progress: progress,
      date: state.endDate,
      time: state.endTime,
      info: state.info
    }

    let automaticPoint = AutomaticTaskPointCalculator.calcAutoPoint(taskInfo)
    if (isNaN(automaticPoint)) automaticPoint = undefined

    return automaticPoint
  }

  // hàm cập nhật điểm tự động
  const handleChangeAutoPoint = () => {
    let automaticPoint = calcAutomaticPoint()
    if (automaticPoint < 0) {
      automaticPoint = 0
    }
    setState({
      ...state,
      autoPoint: automaticPoint,
      showAutoPointInfo: undefined
    })
  }

  // hàm hiển thị modal thông tin điểm tự động
  const handleShowAutomaticPointInfo = async () => {
    await setState({
      ...state,
      showAutoPointInfo: 1
    })
    window.$(`#modal-automatic-point-info`).modal('show')
  }

  // hàm cập nhật tùy chọn lưu thông tin ra thông tin chung
  const handleChangeSaveInfo = async (e) => {
    let { checked } = e.target
    await setState({
      ...state,
      checkSave: checked
    })
  }

  // hàm format vai trò
  const formatRole = (data) => {
    const { translate } = props
    if (data === 'consulted') return translate('task.task_management.consulted')
    if (data === 'accountable') return translate('task.task_management.accountable')
    if (data === 'responsible') return translate('task.task_management.responsible')
  }

  // hàm submit
  const save = async () => {
    let taskId
    taskId = state.task._id
    let startDateTask = convertDateTime(state.startDate, state.startTime)
    let endDateTask = convertDateTime(state.endDate, state.endTime)
    let data = {
      user: getStorage('userId'),
      progress: progress,
      automaticPoint: state.autoPoint,
      employeePoint: state.point,
      role: 'responsible',

      kpi: state.kpi ? state.kpi : [],
      unit: state.unit,
      evaluatingMonth: state.storedEvaluatingMonth,
      startDate: startDateTask,
      endDate: endDateTask,
      info: state.info,
      checkSave: state.checkSave
    }

    await props.evaluateTaskByResponsibleEmployees(data, taskId)
    setState({
      ...state,
      oldAutoPoint: state.autoPoint
    })
    props.handleChangeShowEval(state.id)
    props.handleChangeEnableAddItem(state.id)
  }

  //  kiểm tra có phải đánh giá này là của tháng hiện tại hay ko
  const checkNote = () => {
    let { date } = props
    let splitter = date.split('-')
    let isoDate = new Date(splitter[2], splitter[1] - 1, splitter[0])
    let now = new Date()

    if (now.getMonth() === isoDate.getMonth() && now.getFullYear() === isoDate.getFullYear()) {
      return false // là tháng hiện tại
    }
    return true // khác tháng hiện tại
  }

  // hàm kiểm tra khác null, undefined - tránh TH chỉ muốn check x là null hoặc undefined nếu chỉ kiểm tra if(!x) -> sai nếu x = 0;
  const checkNullUndefined = (x) => {
    if (x === null || x === undefined) {
      return false
    } else return true
  }

  let listKpi = []
  if (KPIPersonalManager && KPIPersonalManager.kpiSets) {
    listKpi = KPIPersonalManager.kpiSets.kpis
  }

  let listUnits = []
  if (user.organizationalUnitsOfUser && user.organizationalUnitsOfUser.length > 0) {
    listUnits = user.organizationalUnitsOfUser.map((x) => {
      return { value: x._id, text: x.name }
    })
  }

  let taskActions = task.taskActions
  let actionsNotRating
  if (date) {
    let splitter = date.split('-')
    let evaluationsDate = new Date(splitter[2], splitter[1] - 1, splitter[0])
    actionsNotRating = taskActions.filter(
      (item) =>
        item.rating === -1 &&
        new Date(item.createdAt).getMonth() === evaluationsDate.getMonth() &&
        new Date(item.createdAt).getFullYear() === evaluationsDate.getFullYear()
    )
  }

  let checkNoteMonth
  // checkNoteMonth = checkNote();

  let disabled = false
  // if (checkNoteMonth && (dentaDate > 7)) {
  //     disabled = true;
  // }

  let disableSubmit = !isFormValidated()

  return (
    <React.Fragment>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div>
          {/* Thông báo về thời gian đánh giá */}
          <div>
            {checkNoteMonth && dentaDate <= 7 && dentaDate > 0 && (
              <p style={{ color: 'red' }}>
                {translate('task.task_management.note_eval')}:&nbsp;&nbsp; {8 - dentaDate}
              </p>
            )}
            {checkNoteMonth && dentaDate > 7 && <p style={{ color: 'red' }}>{translate('task.task_management.note_not_eval')}</p>}
          </div>

          {/* Nút lưu */}
          {!(checkNoteMonth && dentaDate > 7) && (
            <div className='pull-right'>
              {/* <button disabled={disabled} style={{ marginRight: "5px" }} className="btn btn-primary" onClick={updateInfo}>{translate('task.task_management.btn_get_info')}</button> */}
              <button disabled={disabled || disableSubmit} className='btn btn-success' onClick={save}>
                {translate('task.task_management.btn_save_eval')}
              </button>
            </div>
          )}
        </div>

        <div className='body-evaluation' style={{ height: 'calc(100vh - 186px)', overflow: 'auto' }}>
          {/* Đánh giá từ ngày ... đến ngày ... */}
          <form id={`form-evaluate-task-by-${role}`}>
            <fieldset className='scheduler-border'>
              <legend className='scheduler-border'>{translate('task.task_management.detail_general_info')}</legend>
              <div className='row'>
                <div className='col-md-12'>
                  <div className={`form-group ${errorOnMonth === undefined ? '' : 'has-error'}`}>
                    <label>
                      Tháng đánh giá<span className='text-red'>*</span>
                    </label>
                    <DatePicker
                      id={`create_month_${id}_${perform}`}
                      value={evaluatingMonth}
                      onChange={handleMonthOfEvaluationChange}
                      disabled={isEval}
                      dateFormat={'month-year'}
                    />
                    <ErrorLabel content={errorOnMonth} />
                  </div>
                </div>
              </div>
              {evaluatingMonth && (
                <div className='row'>
                  <div className='col-md-6'>
                    <div className={`form-group ${errorOnStartDate === undefined ? '' : 'has-error'}`}>
                      <label>
                        {translate('task.task_management.eval_from')}
                        <span className='text-red'>*</span>
                        <span className='pull-right' style={{ fontWeight: 'normal', marginLeft: 10 }}>
                          <a style={{ cursor: 'pointer' }} onClick={() => getStartTask()}>
                            Lấy thời điểm bắt đầu công việc
                          </a>
                        </span>
                      </label>
                      <DatePicker
                        id={`start_date_${id}_${perform}`}
                        value={startDate}
                        onChange={handleStartDateChange}
                        disabled={disabled}
                      />
                      <TimePicker
                        id={`time-picker-1-start-time-${id}-${perform}-${props.id}`}
                        value={startTime}
                        onChange={handleStartTimeChange}
                      />
                      <ErrorLabel content={errorOnStartDate} />
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <div className={`form-group ${errorOnEndDate === undefined ? '' : 'has-error'}`}>
                      <label>
                        {translate('task.task_management.eval_to')}
                        <span className='text-red'>*</span>
                        <span className='pull-right' style={{ fontWeight: 'normal', marginLeft: 10 }}>
                          <a style={{ cursor: 'pointer' }} onClick={() => getEndTask()}>
                            Lấy thời điểm kết thúc công việc
                          </a>
                        </span>
                      </label>
                      <DatePicker
                        id={`end_date_${id}_${perform}`}
                        value={endDate}
                        onChange={handleEndDateChange}
                        disabled={disabled}
                        // || (checkNoteMonth && (dentaDate <= 20 && dentaDate > 0))
                      />
                      <TimePicker
                        id={`time-picker-2-end-time-${id}-${perform}-${props.id}`}
                        value={endTime}
                        onChange={handleEndTimeChange}
                      />
                      <ErrorLabel content={errorOnEndDate} />
                    </div>
                  </div>
                </div>
              )}

              {/* Đơn vị đánh giá */}
              <div className='form-group'>
                <label>{translate('task.task_management.unit_evaluate')}</label>
                {
                  <SelectBox
                    id={`select-organizational-unit-evaluate-${perform}-${role}`}
                    className='form-control select2'
                    style={{ width: '100%' }}
                    items={listUnits}
                    onChange={handleChangeUnit}
                    multiple={false}
                    value={unit}
                    disabled={disabled}
                  />
                }
              </div>

              {/* Liên kết KPI */}
              <div className='form-group'>
                <label>{translate('task.task_management.detail_kpi')}</label>
                {
                  <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu -${indexReRender}
                    id={`select-kpi-personal-evaluate-${perform}-${role}`}
                    className='form-control select2'
                    style={{ width: '100%' }}
                    items={
                      KPIPersonalManager && KPIPersonalManager.kpiSets
                        ? KPIPersonalManager.kpiSets.kpis
                            .filter((e) => {
                              return e.type === 0
                            })
                            .map((x) => {
                              return { value: x._id, text: x.name }
                            })
                        : []
                    }
                    onChange={handleKpiChange}
                    multiple={true}
                    value={kpi}
                    disabled={disabled}
                  />
                }
              </div>

              {/* Điểm tự đánh giá */}
              <div className={`form-group ${errorOnPoint === undefined ? '' : 'has-error'}`}>
                <label>
                  {translate('task.task_management.detail_emp_point')} (0 - 100) <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  className='form-control'
                  type='number'
                  name='point'
                  placeholder={translate('task.task_management.enter_emp_point')}
                  onChange={handleChangePoint}
                  value={checkNullUndefined(point) ? point : ''}
                  disabled={disabled}
                />
                <ErrorLabel content={errorOnPoint} />
              </div>
            </fieldset>

            {/* Thông tin công việc */}
            <div>
              <TaskInformationForm
                legendText={translate('task.task_management.info_eval_month')}
                task={task && task}
                evaluationInfo={evaluation ? evaluation : task}
                handleChangeProgress={handleChangeProgress}
                handleInfoBooleanChange={handleInfoBooleanChange}
                handleInfoDateChange={handleInfoDateChange}
                handleSetOfValueChange={handleSetOfValueChange}
                handleChangeNumberInfo={handleChangeNumberInfo}
                handleChangeTextInfo={handleChangeTextInfo}
                handleChangeSaveInfo={handleChangeSaveInfo}
                updateInfo={updateInfo}
                indexReRender={indexReRender}
                disabled={disabled}
                role={role}
                perform={perform}
                id={id}
                value={state}
                progress={progress}
                errorOnProgress={errorOnProgress}
              />
            </div>

            {/* Thông tin điểm tự động */}
            <fieldset className='scheduler-border'>
              <legend className='scheduler-border'>{translate('task.task_management.auto_point_field')}</legend>
              <div style={{ lineHeight: '3' }}>
                <div>
                  <strong>{translate('task.task_management.detail_auto_point')}: &nbsp;</strong>
                  <a style={{ cursor: 'pointer' }} id={`autoPoint-${perform}`} onClick={() => handleShowAutomaticPointInfo()}>
                    {checkNullUndefined(autoPoint) ? autoPoint : translate('task.task_management.detail_not_calc_auto_point')}
                  </a>
                </div>
                <div>
                  <strong>{translate('task.task_management.detail_auto_on_system')}: &nbsp;</strong>
                  <a style={{ color: 'black' }}>
                    {checkNullUndefined(oldAutoPoint) ? oldAutoPoint : translate('task.task_management.detail_not_calc_auto_point')}
                  </a>
                </div>
                <div>
                  <strong>{translate('task.task_management.action_not_rating')}:&nbsp;&nbsp;</strong>
                  {actionsNotRating?.length === 0
                    ? translate('task.task_management.no_action')
                    : actionsNotRating?.map((item, index) => (
                        <div>
                          <span key={index}>
                            ({index + 1})&nbsp;&nbsp;
                            <QuillEditor id={`evaluateByRes${item._id}${props.id}`} quillValueDefault={item.description} isText={true} />
                          </span>
                        </div>
                      ))}
                </div>
              </div>
              {
                // Modal hiển thị thông tin chi tiết điểm tự dộng
                showAutoPointInfo === 1 && (
                  <ModalShowAutoPointInfo task={task} progress={progress} date={endDate} time={endTime} info={info} autoPoint={autoPoint} />
                )
              }
            </fieldset>
          </form>
        </div>
      </div>
    </React.Fragment>
  )
}

const mapState = (state) => {
  const { tasks, performtasks, kpimembers, KPIPersonalManager, user } = state
  return { tasks, performtasks, kpimembers, KPIPersonalManager, user }
}
const getState = {
  getAllKpiSetsOrganizationalUnitByMonth: managerKpiActions.getAllKpiSetsOrganizationalUnitByMonth,
  evaluateTaskByResponsibleEmployees: performTaskAction.evaluateTaskByResponsibleEmployees
}

const evaluateByResponsibleEmployee = connect(mapState, getState)(withTranslate(EvaluateByResponsibleEmployee))
export { evaluateByResponsibleEmployee as EvaluateByResponsibleEmployee }
