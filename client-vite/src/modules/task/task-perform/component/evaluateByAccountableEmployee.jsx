import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import moment from 'moment'
import Swal from 'sweetalert2'
import { getStorage } from '../../../../config'
import { ErrorLabel, DatePicker, SelectBox, QuillEditor, TimePicker, ShowMoreShowLess } from '../../../../common-components/index'
import { performTaskAction } from '../redux/actions'
import { managerKpiActions } from '../../../kpi/employee/management/redux/actions'
import { TaskInformationForm } from './taskInformationForm'
import { AutomaticTaskPointCalculator } from './automaticTaskPointCalculator'
import { ModalShowAutoPointInfo } from './modalShowAutoPointInfo'

let currentTask

function EvaluateByAccountableEmployee(props) {
  const { translate, user, KPIPersonalManager, performtasks } = props
  const { id, perform, role, hasAccountable } = props

  const [state, setState] = useState(initState(props.date))
  const [progress, setProgress] = useState(initState(props.date).progress)
  const [errorOnProgress, setErrorOnProgress] = useState(undefined)

  function initState(date) {
    const data = getData(date)

    return {
      isEval: props.isEval,
      errorInfo: {},
      errorApprovedPoint: {},
      errorContribute: {},
      task: data.task,
      userId: data.userId,
      info: data.info,
      results: data.results,
      empPoint: data.empPoint,
      progress: data.progress,
      autoPoint: data.calcAuto,
      oldAutoPoint: data.automaticPoint,
      date: data.date,
      startDate: data.startDate,
      endDate: data.endDate,
      startTime: data.startTime,
      endTime: data.endTime,
      evaluatingMonth: data.evaluatingMonth,
      storedEvaluatingMonth: data.storedEvaluatingMonth,
      checkSave: data.checkSave,
      prevDate: data.prevDate,
      dentaDate: data.dentaDate,
      indexReRender: 0,
      hasAccountable: data.hasAccountable,
      evaluation: data.evaluation,

      kpi: data.kpi,
      unit: data.unit
    }
  }
  const {
    isEval,
    startDate,
    endDate,
    endTime,
    startTime,
    storedEvaluatingMonth,
    evaluatingMonth,
    task,
    date,
    oldAutoPoint,
    autoPoint,
    errorOnDate,
    errorOnMonth,
    showAutoPointInfo,
    dentaDate,
    prevDate,
    info,
    results,
    empPoint,
    errorInfo,
    errorOnStartDate,
    errorOnEndDate,
    errorApprovedPoint,
    errorContribute,
    errSumContribution,
    indexReRender,
    unit,
    kpi,
    evaluation,
    userId
  } = state

  useEffect(() => {
    if (props.date) {
      props.getAllKpiSetsOrganizationalUnitByMonth(userId, unit, props.date)
    }
  }, [])

  // Nếu props.id thay đổi thì cập nhật lai state
  if (props.id !== state.id) {
    setState({
      ...state,
      id: props.id,
      errorOnStartDate: undefined, // Khi nhận thuộc tính mới, cần lưu ý reset lại các gợi ý nhắc lỗi, nếu không các lỗi cũ sẽ hiển thị lại
      errorOnEndDate: undefined,
      errorOnMonth: undefined,
      errorOnPoint: undefined,
      errorOnProgress: undefined,
      errorInfo: {},
      errorApprovedPoint: {},
      errorContribute: {},
      errSumContribution: undefined,
      errorOnAccountablePoint: undefined,
      errorOnAccountableContribution: undefined,
      errorOnMyPoint: undefined
    })
    setErrorOnProgress(undefined)
  }

  // Sau khi cập nhật id mới, cập nhật lại state
  useEffect(() => {
    const data = getData(props.date)
    if (props.date) {
      props.getAllKpiSetsOrganizationalUnitByMonth(userId, unit, props.date)
    }

    setState({
      ...state,
      id,
      isEval: props.isEval,
      task: data.task,
      userId: data.userId,
      info: data.info,
      results: data.results,
      empPoint: data.empPoint,
      progress: data.progress,
      autoPoint: data.calcAuto,
      oldAutoPoint: data.automaticPoint,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      startDate: data.startDate,
      endDate: data.endDate,
      evaluatingMonth: data.evaluatingMonth,
      storedEvaluatingMonth: data.storedEvaluatingMonth,
      checkSave: data.checkSave,
      prevDate: data.prevDate,
      dentaDate: data.dentaDate,
      errorOnProgress: undefined,
      indexReRender: state.indexReRender + 1,

      kpi: data.kpi,
      unit: data.unit,

      evaluation: data.evaluation
    })
    setProgress(data.progress)
    setErrorOnProgress(undefined)
  }, [id, props.task])

  // Cập nhật state.kpi khi có kết quả truy vấn mới
  useEffect(() => {
    const data = getData(props.date)

    setState({
      ...state,
      kpi: data.kpi
    })
  }, [JSON.stringify(props.KPIPersonalManager.kpiSets)])

  function handleSortMonthEval(evaluations) {
    // sắp xếp đánh giá theo thứ tự tháng
    const sortedEvaluations = evaluations?.sort((a, b) => new Date(b.evaluatingMonth) - new Date(a.evaluatingMonth))
    return sortedEvaluations
  }

  function getPreviousEvaluation(task, date) {
    const { evaluations } = task
    const sortedEvaluations = handleSortMonthEval(evaluations)

    const evalMonth = moment(date, 'DD-MM-YYYY').endOf('month').toDate()
    for (const i in sortedEvaluations) {
      const eva = sortedEvaluations[i]
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
    const { user, KPIPersonalManager } = props
    const { task, hasAccountable } = props
    const idUser = getStorage('userId')
    let unit
    if (user.organizationalUnitsOfUser && user.organizationalUnitsOfUser.length > 0) {
      unit = user.organizationalUnitsOfUser[0]._id
    }

    const statusOptions = []
    statusOptions.push(task && task.status)
    if (dateParam) {
      const checkSave = false
      const date = dateParam
      let endDate = dateParam
      const startDateTask = task.startDate
      let prevDate = formatDate(startDateTask)

      let startTime = formatTime(new Date(startDateTask))
      let endTime = formatTime(new Date())

      let dentaDate = 0
      let evaluations
      let prevEval

      let splitter = dateParam.split('-')
      if (evaluatingMonthParam) {
        splitter = evaluatingMonthParam.split('-')
      }

      const evaluatingMonth = `${splitter[1]}-${splitter[2]}`
      const storedEvaluatingMonth = moment(evaluatingMonth, 'MM-YYYY').endOf('month').format('DD-MM-YYYY')
      const dateOfEval = new Date(splitter[2], splitter[1] - 1, splitter[0])
      const dateOfPrevEval = new Date(splitter[2], splitter[1] - 1, splitter[0])
      let newMonth = dateOfPrevEval.getMonth() - 1
      if (newMonth < 0) {
        newMonth += 12
        dateOfPrevEval.setYear(dateOfPrevEval.getFullYear() - 1)
      }
      dateOfPrevEval.setDate(15)
      dateOfPrevEval.setMonth(newMonth)

      const monthOfEval = dateOfEval.getMonth()
      const monthOfPrevEval = dateOfPrevEval.getMonth()
      const yearOfEval = dateOfEval.getFullYear()
      const yearOfPrevEval = dateOfPrevEval.getFullYear()

      evaluations = task.evaluations.find(
        (e) => monthOfEval === new Date(e.evaluatingMonth).getMonth() && yearOfEval === new Date(e.evaluatingMonth).getFullYear()
      )
      // prevEval = task.evaluations.find(e => ((monthOfPrevEval) === new Date(e.evaluatingMonth).getMonth() && yearOfPrevEval === new Date(e.evaluatingMonth).getFullYear()));
      prevEval = getPreviousEvaluation(task, dateParam)
      if (prevEval) {
        prevDate = formatDate(prevEval.endDate)
        startTime = formatTime(prevEval.endDate)
      }
      const automaticPoint = evaluations && evaluations.results.length !== 0 ? evaluations.results[0].automaticPoint : undefined
      const progress = evaluations ? evaluations.progress : 0

      let cloneKpi = []
      if (hasAccountable === true && KPIPersonalManager && KPIPersonalManager.kpiSets) {
        cloneKpi = KPIPersonalManager.kpiSets.kpis
          .filter((e) => e.type === 1)
          .map((x) => {
            return x._id
          })
      }

      const info = {}

      const infoEval = task.taskInformations
      for (const i in infoEval) {
        if (infoEval[i].type === 'date') {
          if (infoEval[i].value) {
            info[`${infoEval[i].code}`] = {
              value: formatDate(infoEval[i].value),
              code: infoEval[i].code,
              type: infoEval[i].type
            }
          } else {
            info[`${infoEval[i].code}`] = {
              // value: formatDate(Date.now()),
              code: infoEval[i].code,
              type: infoEval[i].type
            }
          }
        } else if (infoEval[i].type === 'set_of_values') {
          const splitSetOfValues = infoEval[i].extra.split('\n')
          if (infoEval[i].value) {
            info[`${infoEval[i].code}`] = {
              value: [infoEval[i].value],
              code: infoEval[i].code,
              type: infoEval[i].type
            }
          } else {
            info[`${infoEval[i].code}`] = {
              value: [splitSetOfValues[0]],
              code: infoEval[i].code,
              type: infoEval[i].type
            }
          }
        } else if (infoEval[i].value || infoEval[i].value === 0) {
          info[`${infoEval[i].code}`] = {
            value: infoEval[i].value,
            code: infoEval[i].code,
            type: infoEval[i].type
          }
        }
      }

      const empPoint = {}
      const results = {}
      let endDateEval
      let timesheetLogs = []
      let duration = 0
      const inactiveEmp = task.inactiveEmployees.map((e) => e._id)

      // if (dateParam.toString().includes("-")) {
      //     endDateEval = convertDateTime(dateParam, state?.endTime);
      // } else {
      //     endDateEval = convertDateTime(state?.endDate, dateParam)
      // }

      if (task?.timesheetLogs?.length > 0) {
        timesheetLogs = task.timesheetLogs
          .filter((item) => {
            const startDateEval = evaluations?.startDate ? new Date(evaluations.startDate) : convertDateTime(prevDate, startTime)
            const startedAt = item?.startedAt && new Date(item?.startedAt)
            const stoppedAt = item?.stoppedAt && new Date(item?.stoppedAt)

            if (
              item?.acceptLog &&
              ((startedAt?.getTime() >= startDateEval?.getTime() && startedAt?.getTime() <= endDateEval?.getTime()) ||
                (stoppedAt?.getTime() >= startDateEval?.getTime() && stoppedAt?.getTime() <= endDateEval?.getTime()))
            ) {
              return true
            }
            return false
          })
          .map((item) => {
            duration += item?.duration
            return item
          })
      }

      for (const i in task.responsibleEmployees) {
        if (inactiveEmp.indexOf(task.responsibleEmployees[i]._id) === -1) {
          let durationResponsible = 0
          timesheetLogs?.length > 0 &&
            timesheetLogs
              .filter((item) => {
                if (item?.acceptLog && item?.creator?._id === task.responsibleEmployees[i]._id) {
                  return true
                }
                return false
              })
              .map((item) => {
                durationResponsible += item?.duration
              })

          results[`approvedPointResponsible${task.responsibleEmployees[i]._id}`] = {
            value: undefined,
            employee: task.responsibleEmployees[i]._id,
            role: 'responsible',
            target: 'Point'
          }
          results[`contributeResponsible${task.responsibleEmployees[i]._id}`] = {
            value: duration ? Number(((durationResponsible / duration) * 100).toFixed(0)) : 0,
            employee: task.responsibleEmployees[i]._id,
            role: 'responsible',
            target: 'Contribution'
          }
        }
      }
      for (const i in task.accountableEmployees) {
        if (inactiveEmp.indexOf(task.accountableEmployees[i]._id) === -1) {
          let durationAccountable = 0
          timesheetLogs
            .filter((item) => {
              if (item?.acceptLog && item?.creator?._id === task.accountableEmployees[i]._id) {
                return true
              }
              return false
            })
            .map((item) => {
              durationAccountable += item?.duration
            })

          results[`approvedPoint${task.accountableEmployees[i]._id}`] = {
            value: undefined,
            employee: task.accountableEmployees[i]._id,
            role: 'accountable',
            target: 'Point'
          }

          const valueContribute = results[`contributeResponsible${task.accountableEmployees[i]._id}`]
            ? 0
            : duration
              ? Number(((durationAccountable / duration) * 100).toFixed(0))
              : 0
          results[`contributeAccountable${task.accountableEmployees[i]._id}`] = {
            value: valueContribute,
            employee: task.accountableEmployees[i]._id,
            role: 'accountable',
            target: 'Contribution'
          }
        }
      }
      for (const i in task.consultedEmployees) {
        if (inactiveEmp.indexOf(task.consultedEmployees[i]._id) === -1) {
          let durationConsulted = 0
          timesheetLogs
            .filter((item) => {
              if (item?.acceptLog && item?.creator?._id === task.consultedEmployees[i]._id) {
                return true
              }
              return false
            })
            .map((item) => {
              durationConsulted += item?.duration
            })

          results[`approvedPointConsulted${task.consultedEmployees[i]._id}`] = {
            value: undefined,
            employee: task.consultedEmployees[i]._id,
            role: 'consulted',
            target: 'Point'
          }

          const valueContribute =
            results[`contributeResponsible${task.consultedEmployees[i]._id}`] ||
            results[`contributeAccountable${task.consultedEmployees[i]._id}`]
              ? 0
              : duration
                ? Number(((durationConsulted / duration) * 100).toFixed(0))
                : 0
          results[`contributeConsulted${task.consultedEmployees[i]._id}`] = {
            value: valueContribute,
            employee: task.consultedEmployees[i]._id,
            role: 'consulted',
            target: 'Contribution'
          }
        }
      }

      if (evaluations) {
        if (evaluations.results.length !== 0) {
          let role = 'accountable'
          if (!hasAccountable) {
            role = 'responsible'
          }

          console.log(evaluations.results[0].employee._id)

          const tmp = evaluations.results.find((e) => String(e?.employee?._id) === String(idUser) && String(e.role) === role)
          if (tmp) {
            if (tmp.organizationalUnit) {
              unit = tmp.organizationalUnit._id
            }
            const kpi = tmp.kpis
            cloneKpi = []
            for (const i in kpi) {
              cloneKpi.push(kpi[i]._id)
            }
          }

          const listResult = evaluations.results
          for (const i in listResult) {
            if (listResult[i].role === 'responsible') {
              empPoint[`responsible${listResult[i].employee._id}`] = listResult[i].employeePoint ? listResult[i].employeePoint : undefined
              results[`approvedPointResponsible${listResult[i].employee._id}`] = {
                value: listResult[i].approvedPoint ? listResult[i].approvedPoint : undefined,
                employee: listResult[i].employee._id,
                role: 'responsible',
                target: 'Point'
              }
              results[`contributeResponsible${listResult[i].employee._id}`] = {
                value: listResult[i].contribution ? listResult[i].contribution : undefined,
                employee: listResult[i].employee._id,
                role: 'responsible',
                target: 'Contribution'
              }
            } else if (listResult[i].role === 'consulted') {
              empPoint[`consulted${listResult[i].employee._id}`] = listResult[i].employeePoint ? listResult[i].employeePoint : undefined
              results[`approvedPointConsulted${listResult[i].employee._id}`] = {
                value: listResult[i].approvedPoint ? listResult[i].approvedPoint : undefined,
                employee: listResult[i].employee._id,
                role: 'consulted',
                target: 'Point'
              }
              results[`contributeConsulted${listResult[i].employee._id}`] = {
                value: listResult[i].contribution ? listResult[i].contribution : undefined,
                employee: listResult[i].employee._id,
                role: 'consulted',
                target: 'Contribution'
              }
            } else if (listResult[i].role === 'accountable') {
              empPoint[`accountable${listResult[i].employee._id}`] = listResult[i].employeePoint ? listResult[i].employeePoint : undefined
              results[`approvedPoint${listResult[i].employee._id}`] = {
                value: listResult[i].approvedPoint ? listResult[i].approvedPoint : undefined,
                employee: listResult[i].employee._id,
                role: 'accountable',
                target: 'Point'
              }
              results[`contributeAccountable${listResult[i].employee._id}`] = {
                value: listResult[i].contribution ? listResult[i].contribution : undefined,
                employee: listResult[i].employee._id,
                role: 'accountable',
                target: 'Contribution'
              }
            }
          }
        }

        const infoEval = evaluations.taskInformations
        let chkHasInfo = false
        for (const i in infoEval) {
          if (infoEval[i].value !== undefined) {
            chkHasInfo = true
            break
          }
        }

        if (chkHasInfo) {
          for (const i in infoEval) {
            if (infoEval[i].type === 'date') {
              if (infoEval[i].value) {
                info[`${infoEval[i].code}`] = {
                  value: formatDate(infoEval[i].value),
                  code: infoEval[i].code,
                  type: infoEval[i].type
                }
              } else {
                info[`${infoEval[i].code}`] = {
                  // value: formatDate(Date.now()),
                  code: infoEval[i].code,
                  type: infoEval[i].type
                }
              }
            } else if (infoEval[i].type === 'set_of_values') {
              const splitSetOfValues = infoEval[i].extra.split('\n')
              if (infoEval[i].value) {
                info[`${infoEval[i].code}`] = {
                  value: [infoEval[i].value],
                  code: infoEval[i].code,
                  type: infoEval[i].type
                }
              } else {
                info[`${infoEval[i].code}`] = {
                  value: [splitSetOfValues[0]],
                  code: infoEval[i].code,
                  type: infoEval[i].type
                }
              }
            } else if (infoEval[i].value || infoEval[i].value === 0) {
              info[`${infoEval[i].code}`] = {
                value: infoEval[i].value,
                code: infoEval[i].code,
                type: infoEval[i].type
              }
            }
          }
        }
      }

      let startDate = prevDate
      if (evaluations) {
        endDate = formatDate(evaluations.endDate)
        startDate = formatDate(evaluations.startDate)
        startTime = formatTime(evaluations.startDate)
        endTime = formatTime(evaluations.endDate)
      }

      const taskInfo = {
        task,
        progress,
        date: endDate,
        time: endTime,
        info
      }

      let calcAuto = AutomaticTaskPointCalculator.calcAutoPoint(taskInfo)
      if (isNaN(calcAuto)) calcAuto = undefined
      if (calcAuto < 0) calcAuto = 0

      dentaDate = Math.round((new Date().getTime() - dateOfEval.getTime()) / (1000 * 3600 * 24))

      return {
        info,
        date,
        startDate,
        endDate,
        startTime,
        endTime,
        evaluatingMonth,
        storedEvaluatingMonth,
        progress,
        task,
        userId: idUser,
        empPoint,
        results,
        automaticPoint,
        statusOptions,
        calcAuto,
        checkSave,
        prevDate,
        dentaDate,
        unit,
        kpi: cloneKpi,
        hasAccountable,
        evaluation: evaluations
      }
    }
    return {
      task,
      hasAccountable,
      unit,
      userId: idUser,
      statusOptions,
      info: {},
      empPoint: {},
      results: {},
      kpi: []
    }
  }

  // hàm lấy thông tin từ thông tin công việc hiện tại
  const getInfo = (dateParam) => {
    const info = {}
    const checkSave = false

    const date = dateParam
    if (date) {
      let evaluation
      const { task } = props
      const splitter = dateParam.split('-')
      const dateOfEval = new Date(splitter[2], splitter[1] - 1, splitter[0])
      const monthOfEval = dateOfEval.getMonth()
      const yearOfEval = dateOfEval.getFullYear()

      evaluation = task.evaluations.find(
        (e) => monthOfEval === new Date(e.evaluatingMonth).getMonth() && yearOfEval === new Date(e.evaluatingMonth).getFullYear()
      )
      const automaticPoint = evaluation && evaluation.results.length !== 0 ? evaluation.results[0].automaticPoint : undefined
      const infoTask = task.taskInformations

      for (const i in infoTask) {
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
          const splitSetOfValues = infoTask[i].extra.split('\n')
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
        } else if (infoTask[i].value || infoTask[i].value === 0) {
          info[`${infoTask[i].code}`] = {
            value: infoTask[i].value,
            code: infoTask[i].code,
            type: infoTask[i].type
          }
        }
      }

      const { progress } = task

      const taskInfo = {
        task,
        progress,
        date: state.endDate,
        time: state.endTime,
        info
      }

      let calcAuto = AutomaticTaskPointCalculator.calcAutoPoint(taskInfo)
      if (isNaN(calcAuto)) calcAuto = undefined
      if (calcAuto < 0) calcAuto = 0

      return {
        info,
        autoPoint: automaticPoint,
        progress,
        calcAuto,
        checkSave
      }
    }
    return {
      info: {},
      checkSave
    }
  }

  // hàm cập nhật thông tin
  const updateInfo = async () => {
    const data = getInfo(state.storedEvaluatingMonth)
    setState({
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
    const d = new Date(date)
    let month = `${d.getMonth() + 1}`
    let day = `${d.getDate()}`
    const year = d.getFullYear()

    if (month.length < 2) month = `0${month}`
    if (day.length < 2) day = `0${day}`

    return [day, month, year].join('-')
  }

  // hàm cập nhật điểm tự đánh giá
  const handleChangePoint = async (e) => {
    const value = parseInt(e.target.value)
    await setState({
      ...state,
      point: value,
      errorOnPoint: validatePoint(value)
    })
  }

  // hàm cập nhật progress
  const handleChangeProgress = async (e) => {
    const { translate } = props
    let msg
    const value = parseInt(e.target.value)
    if (value < 0 || value > 100) {
      msg = translate('task.task_perform.modal_approve_task.err_range')
    }

    setProgress(value)
    setErrorOnProgress(msg)

    const taskInfo = {
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

  // hàm cập nhật điểm tự động
  const handleChangeAutoPoint = async () => {
    const taskInfo = {
      task: state.task,
      progress,
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

  const validateEvaluateResult = (value) => {
    const { translate } = props
    let msg
    if (value < 0 || value > 100) {
      msg = translate('task.task_perform.modal_approve_task.err_range')
    }
    return msg
  }

  const validateEvaluateContribute = (value) => {
    const { translate } = props
    let msg
    const sum = calcSumContribution()
    if (value < 0 || value > 100) {
      msg = translate('task.task_perform.modal_approve_task.err_range')
    }
    return msg
  }

  const validateSumContribute = () => {
    const { translate } = props
    let msg
    const res = calcSumContribution()
    if (res.sum > 100) {
      msg = translate('task.task_perform.modal_approve_task.err_contribute')
    } else if (res.checkAllEvalContribution && res.sum < 100) {
      msg = translate('task.task_perform.modal_approve_task.err_not_enough_contribute')
      // msg = "ko đủ 100 %"
    }
    return msg
  }

  // hàm tính tổng phần trăm đóng góp hiện tại ->> để validate
  const calcSumContribution = () => {
    const { results, task } = state
    let sum = 0
    let numOfContributor = 0
    let checkAllEvalContribution = false

    let numOfMember = 0
    numOfMember = task?.accountableEmployees?.length + task?.responsibleEmployees?.length + task?.consultedEmployees?.length

    for (const i in results) {
      if (results[i].target === 'Contribution') {
        if (results[i].value) {
          sum += results[i].value
          numOfContributor += 1
        }
      }
    }

    if (numOfContributor === numOfMember) {
      checkAllEvalContribution = true
    }

    return { sum, checkAllEvalContribution }
  }

  // begin: các hàm cập nhật đóng góp và điểm phê duyệt
  const handleChangeAccountablePoint = async (e, id) => {
    const value = parseInt(e.target.value)
    const { name } = e.target
    await setState((state) => {
      state.results[`${name}`] = {
        value,
        employee: id,
        role: 'accountable',
        target: 'Point'
      }
      if (id === state.userId) state.empPoint[`accountable${id}`] = value
      state.errorApprovedPoint[`accountable${id}`] = validateEvaluateResult(value)
      return {
        ...state
      }
    })
  }

  const handleChangeAccountableContribution = async (e, id) => {
    const value = parseInt(e.target.value)
    const { name } = e.target
    await setState((state) => {
      state.results[`${name}`] = {
        value,
        employee: id,
        role: 'accountable',
        target: 'Contribution'
      }
      state.errorContribute[`accountable${id}`] = validateEvaluateContribute(value)
      return {
        ...state,
        errSumContribution: validateSumContribute()
      }
    })
  }

  const handleChangeApprovedPointForResponsible = async (e, id) => {
    const value = parseInt(e.target.value)
    const { name } = e.target
    await setState((state) => {
      state.results[`${name}`] = {
        value: isNaN(value) ? undefined : value,
        employee: id,
        role: 'responsible',
        target: 'Point'
      }
      if (props.hasAccountable === false && id === state.userId) state.empPoint[`responsible${id}`] = value
      state.errorApprovedPoint[`responsible${id}`] = validateEvaluateResult(value)
      return {
        ...state
      }
    })
  }

  const handleChangeResponsibleContribution = async (e, id) => {
    const value = parseInt(e.target.value)
    const { name } = e.target
    await setState((state) => {
      state.results[`${name}`] = {
        value: isNaN(value) ? undefined : value,
        employee: id,
        role: 'responsible',
        target: 'Contribution'
      }
      state.errorContribute[`responsible${id}`] = validateEvaluateContribute(value)
      return {
        ...state,
        errSumContribution: validateSumContribute()
      }
    })
  }

  const handleChangeApprovedPointForConsulted = async (e, id) => {
    const value = parseInt(e.target.value)
    const { name } = e.target
    await setState((state) => {
      state.results[`${name}`] = {
        value,
        employee: id,
        role: 'consulted',
        target: 'Point'
      }
      state.errorApprovedPoint[`consulted${id}`] = validateEvaluateResult(value)
      return {
        ...state
      }
    })
  }

  const handleChangeConsultedContribution = async (e, id) => {
    const value = parseInt(e.target.value)
    const { name } = e.target
    await setState((state) => {
      state.results[`${name}`] = {
        value,
        employee: id,
        role: 'consulted',
        target: 'Contribution'
      }
      state.errorContribute[`consulted${id}`] = validateEvaluateContribute(value)
      return {
        ...state,
        errSumContribution: validateSumContribute()
      }
    })
  }

  const handleChangeMyPoint = async (e) => {
    const value = parseInt(e.target.value)
    await setState({
      ...state,
      myPoint: value,
      errorOnMyPoint: validatePoint(value)
    })
  }

  const onContributeChange = async (e, id) => {
    const { name, value } = e.target
    await setState((state) => {
      state.results[`${name}`] = {
        value,
        employee: id
      }
      return {
        ...state
      }
    })
  }

  const onApprovedPointChange = async (e, id) => {
    const { name, value } = e.target
    await setState((state) => {
      state.results[`${name}`] = {
        value,
        employee: id
      }
      return {
        ...state
      }
    })
  }
  // -->end

  // hàm cập nhật thông tin số
  const handleChangeNumberInfo = async (e) => {
    const value = parseInt(e.target.value)
    const { name } = e.target
    await setState((state) => {
      state.info[`${name}`] = {
        value,
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

  // hàm cập nhật ttin văn bản
  const handleChangeTextInfo = async (e) => {
    const { value } = e.target
    const { name } = e.target
    await setState((state) => {
      state.info[`${name}`] = {
        value,
        code: name,
        type: 'text'
      }
      state.errorInfo[name] = validateTextInfo(value)
      return {
        ...state
      }
    })
  }

  // hàm validate thoogn tin ngày tháng
  const handleInfoDateChange = (value, code) => {
    setState((state) => {
      state.info[`${code}`] = {
        value,
        code,
        type: 'date'
      }
      state.errorInfo[code] = validateDate(value)
      return {
        ...state
      }
    })
  }

  // hàm validate ttin boolean
  const handleInfoBooleanChange = (event) => {
    const { name, value } = event.target
    setState((state) => {
      state.info[`${name}`] = {
        value,
        code: name,
        type: 'boolean'
      }
      return {
        ...state
      }
    })
  }

  // hàm validate ngày tháng
  const validateDate = (value, willUpdateState = true) => {
    const { translate } = props
    let msg
    if (value.trim() === '') {
      msg = translate('task.task_perform.modal_approve_task.err_empty')
    }

    return msg
  }

  // hàm validate ttin van bản
  const validateTextInfo = (value) => {
    const { translate } = props
    const msg = undefined
    if (value === '') {
      // msg = translate('task.task_perform.modal_approve_task.err_empty')
    }
    return msg
  }

  // hàm validate số
  const validatePoint = (value) => {
    const { translate } = props
    let msg
    if (value < 0 || value > 100) {
      msg = translate('task.task_perform.modal_approve_task.err_range')
    }
    if (isNaN(value)) {
      msg = translate('task.task_perform.modal_approve_task.err_empty')
    }
    return msg
  }

  // hàm cập nhật ttin số
  const validateNumberInfo = (value) => {
    const { translate } = props
    const msg = undefined

    if (isNaN(value)) {
      // msg = translate('task.task_perform.modal_approve_task.err_empty');
    }
    return msg
  }

  const validateInfoBoolean = (value) => {
    const { translate } = props
    const msg = undefined
    if (value.indexOf('') !== -1) {
      // msg = translate('task.task_perform.modal_approve_task.err_empty');
    }

    return msg
  }

  // hàm cập nhật thông tin tập giá trị
  const handleSetOfValueChange = async (value, code) => {
    setState((state) => {
      state.info[`${code}`] = {
        value,
        code,
        type: 'set_of_values'
      }
      return {
        ...state
      }
    })
  }

  // hàm cập nhật tùy chọn trạng thái lấy thông tin công việc
  const handleChangeSaveInfo = async (e) => {
    const { checked } = e.target
    await setState({
      ...state,
      checkSave: checked
    })
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
    props.getAllKpiSetsOrganizationalUnitByMonth(state.userId, value[0], state.storedEvaluatingMonth)
  }

  // convert ISODate to String hh:mm AM/PM
  function formatTime(date) {
    const d = new Date(date)
    const time = moment(d).format('hh:mm')
    let suffix = ' AM'
    if (d.getHours() >= 12 && d.getHours() <= 23) {
      suffix = ' PM'
    }
    return time + suffix
  }

  const validateDateTime = (evaluatingMonth, startDate, startTime, endDate, endTime, type) => {
    const { translate } = props
    const { isEval, storedEvaluatingMonth, task } = state

    // init data
    let msg
    const endOfMonth = moment(evaluatingMonth, 'MM-YYYY').endOf('month').toDate()
    const startOfMonth = moment(evaluatingMonth, 'MM-YYYY').startOf('month').toDate()
    const monthOfEval = startOfMonth.getMonth()
    const yearOfEval = startOfMonth.getFullYear()

    // convert ISO date
    const startDateISO = convertDateTime(startDate, startTime)
    const endDateISO = convertDateTime(endDate, endTime)

    // tìm đánh giá tháng này
    const monthOfEvalStart = startDateISO.getMonth()
    const yearOfEvalStart = startDateISO.getFullYear()
    const monthOfEvalEnd = endDateISO.getMonth()
    const yearOfEvalEnd = endDateISO.getFullYear()
    const tmpStart = task.evaluations.find(
      (e) => monthOfEvalStart === new Date(e.evaluatingMonth).getMonth() && yearOfEvalStart === new Date(e.evaluatingMonth).getFullYear()
    )
    const tmpEnd = task.evaluations.find(
      (e) => monthOfEvalEnd === new Date(e.evaluatingMonth).getMonth() && yearOfEvalEnd === new Date(e.evaluatingMonth).getFullYear()
    )

    // kiểm tra sâu rỗng
    if (startDate.trim() === '' || startTime.trim() === '' || endDate.trim() === '' || endTime.trim() === '') {
      msg = translate('task.task_management.add_err_empty_end_date')
    }
    // kiểm tra ngày bắt đầu so với ngày kết thúc
    else if (startDateISO > endDateISO) {
      msg = translate('task.task_management.add_err_end_date')
    } else if (type === 'start') {
      // kiểm tra điều kiện trong tháng đánh giá
      if (startDateISO > endOfMonth) {
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
      if (endDateISO < startOfMonth) {
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
    const { translate } = props
    const { evaluatingMonth, endDate, startDate, endTime, startTime } = state

    const err = validateDateTime(evaluatingMonth, value, startTime, endDate, endTime, 'start')

    setState({
      ...state,
      startDate: value,
      errorOnStartDate: err,
      indexReRender: state.indexReRender + 1
    })
  }

  // hàm cập nhật ngày đánh giá hiện tại
  const handleEndDateChange = (value) => {
    const { translate } = props

    const { evaluatingMonth, endDate, startDate, endTime, startTime, userId } = state

    const err = validateDateTime(evaluatingMonth, startDate, startTime, value, endTime, 'end')

    const data = getData(value, state.storedEvaluatingMonth)
    // props.getAllKpiSetsOrganizationalUnitByMonth(userId, unit, value);

    let { automaticPoint } = data
    const taskInfo = {
      task: data.task,
      progress,
      date: value,
      time: state.endTime,
      info: state.info
    }

    automaticPoint = AutomaticTaskPointCalculator.calcAutoPoint(taskInfo)
    if (isNaN(automaticPoint)) automaticPoint = undefined
    if (automaticPoint < 0) automaticPoint = 0

    setState({
      ...state,
      errorOnEndDate: err,
      endDate: value,
      // empPoint: data.empPoint,
      autoPoint: automaticPoint,
      oldAutoPoint: data.automaticPoint,
      indexReRender: state.indexReRender + 1
    })
  }

  const handleStartTimeChange = (value) => {
    const { translate } = props
    const { evaluatingMonth, endDate, startDate, endTime, startTime } = state

    const err = validateDateTime(evaluatingMonth, startDate, value, endDate, endTime, 'start')

    setState({
      ...state,
      startTime: value,
      errorOnStartDate: err
    })
  }

  const handleEndTimeChange = (value) => {
    const { translate } = props

    const { evaluatingMonth, endDate, startDate, endTime, startTime } = state

    const err = validateDateTime(evaluatingMonth, startDate, startTime, endDate, value, 'end')

    const data = getData(value, state.storedEvaluatingMonth)

    let { automaticPoint } = data
    const taskInfo = {
      task: data.task,
      progress,
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
      errorOnEndDate: err,
      oldAutoPoint: data.automaticPoint,
      indexReRender: state.indexReRender + 1
    })
  }

  function convertDateTime(date, time) {
    const splitter = date?.split('-')
    const strDateTime = `${splitter[2]}/${splitter[1]}/${splitter[0]} ${time}`
    return new Date(strDateTime)
  }

  // hàm cập nhật tháng đánh giá
  function handleMonthOfEvaluationChange(value) {
    // indexReRender = indexReRender + 1;
    const { translate } = props
    const { userId, evaluatingMonth, task, endDate, startDate, endTime, startTime } = state
    const evalDate = moment(value, 'MM-YYYY').endOf('month').format('DD-MM-YYYY')
    let err
    //  = validateDateTime(value, startDate, startTime, evalDate, endDate, "end");

    const startDateTask = new Date(task.startDate)
    const endDateTask = new Date(task.endDate)

    const splitter = evalDate.split('-')
    const dateValue = new Date(splitter[2], splitter[1] - 1, splitter[0])

    // validate tháng đánh giá
    let errMonth

    const monthOfEval = dateValue.getMonth()
    const yearOfEval = dateValue.getFullYear()

    const tmp = task.evaluations.find(
      (e) => monthOfEval === new Date(e.evaluatingMonth).getMonth() && yearOfEval === new Date(e.evaluatingMonth).getFullYear()
    )

    if (tmp) {
      errMonth = 'Tháng này đã có đánh giá'
    }
    // validate tháng đánh giá phải trong thời gian làm việc.
    // đưa về cùng ngày - giờ để so sánh tháng năm
    dateValue.setDate(15)
    startDateTask.setDate(15)
    endDateTask.setDate(15)
    dateValue.setHours(0)
    startDateTask.setHours(0)
    endDateTask.setHours(0)
    // tính hiệu giữa ngày đánh giá so với ngày bắt đầu và ngày kết thúc của công việc
    const dst2 = dateValue.getTime() - startDateTask.getTime() // < 0 -> err // denta start task
    const det2 = endDateTask.getTime() - dateValue.getTime() // < 0 -> err // denta end task

    if (dst2 < 0) {
      errMonth = 'Tháng đánh giá phải lớn hơn hoặc bằng tháng bắt đầu'
    } else if (det2 < 0) {
      // errMonth = "Tháng đánh giá phải nhỏ hơn hoặc bằng tháng kết thúc";
    }

    const data = getData(evalDate, evalDate)
    props.getAllKpiSetsOrganizationalUnitByMonth(userId, state.unit, evalDate)

    let { automaticPoint } = data
    const taskInfo = {
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
      oldAutoPoint: data.automaticPoint,
      empPoint: data.empPoint,
      results: data.results,
      errorOnDate: err,
      errorOnMonth: errMonth,
      indexReRender: state.indexReRender + 1,

      info: data.info,
      progress: data.progress,
      date: data.date,
      checkSave: data.checkSave,
      prevDate: data.prevDate,
      dentaDate: data.dentaDate,
      evaluation: data.evaluation
    })
    if (!errMonth) {
      props.handleChangeMonthEval({ evaluatingMonth: value, date: evalDate, id: state.id })
    }
  }
  const getStartTask = async () => {
    const { translate } = props
    const { task } = state
    const start = task?.startDate
    const startDate = formatDate(new Date(start))
    const startTime = formatTime(new Date(start))

    const { evaluatingMonth, endDate, endTime, idUser } = state
    const err = validateDateTime(evaluatingMonth, startDate, startTime, endDate, endTime, 'start')

    setState({
      ...state,
      errorOnStartDate: err,
      startDate,
      startTime,
      indexReRender: state.indexReRender + 1
    })
  }
  const getEndTask = async () => {
    const { translate } = props
    const { task } = state
    const end = task?.endDate
    const endDate = formatDate(new Date(end))
    const endTime = formatTime(new Date(end))

    const { evaluatingMonth, startDate, startTime, userId } = state

    const err = validateDateTime(evaluatingMonth, startDate, startTime, endDate, endTime, 'end')

    const data = getData(endDate, state.storedEvaluatingMonth)

    let { automaticPoint } = data
    const taskInfo = {
      task: data.task,
      progress,
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
      endDate,
      endTime,
      autoPoint: automaticPoint,
      oldAutoPoint: data.automaticPoint,
      indexReRender: state.indexReRender + 1
    })
  }

  // hàm validate submit
  const isFormValidated = () => {
    const {
      evaluatingMonth,
      errorOnMonth,
      errorOnDate,
      errorOnEndDate,
      errorOnStartDate,
      errorOnPoint,
      errorOnAccountablePoint,
      errorOnAccountableContribution,
      errorOnMyPoint,
      errorOnInfoDate,
      errorOnInfoBoolean,
      errorOnNumberInfo,
      errorOnTextInfo,
      errorApprovedPoint,
      errorContribute,
      errSumContribution
    } = state
    const { info, results, empPoint, progress } = state

    let checkErrorContribute = true
    let checkErrorApprovedPoint = true

    if (Object.keys(errorApprovedPoint).length === 0) {
    }
    for (const i in errorApprovedPoint) {
      if (errorApprovedPoint[i]) {
        checkErrorApprovedPoint = false
        break
      }
    }

    for (const i in errorContribute) {
      if (errorContribute[i]) {
        checkErrorContribute = false
        break
      }
    }

    return !!(
      evaluatingMonth &&
      evaluatingMonth.trim() !== '' &&
      checkErrorApprovedPoint &&
      checkErrorContribute &&
      errorOnStartDate === undefined &&
      errorOnEndDate === undefined &&
      errorOnMonth === undefined &&
      errorOnDate === undefined &&
      errorOnPoint === undefined &&
      errorOnInfoDate === undefined &&
      errorOnAccountablePoint === undefined &&
      errorOnProgress === undefined &&
      errorOnAccountableContribution === undefined &&
      errorOnMyPoint === undefined &&
      errSumContribution === undefined &&
      errorOnInfoBoolean === undefined &&
      errorOnNumberInfo === undefined &&
      errorOnTextInfo === undefined
    )
  }

  // hàm hiển thị modal show autopoint
  const handleShowAutomaticPointInfo = async () => {
    await setState({
      ...state,
      showAutoPointInfo: 1
    })
    window.$(`#modal-automatic-point-info`).modal('show')
  }

  // format vai trò multi language
  const formatRole = (data) => {
    const { translate } = props
    if (data === 'consulted') return translate('task.task_management.consulted')
    if (data === 'accountable') return translate('task.task_management.accountable')
    if (data === 'responsible') return translate('task.task_management.responsible')
  }

  // format tháng
  const formatMonth = (date) => {
    const d = new Date(date)
    let month = `${d.getMonth() + 1}`
    let day = `${d.getDate()}`
    const year = d.getFullYear()

    if (month.length < 2) month = `0${month}`
    if (day.length < 2) day = `0${day}`

    return [month, year].join('-')
  }

  const checkHasEval = (date, performtasks) => {
    let monthOfEval
    let yearOfEval
    if (date) {
      const splitter = date.split('-')
      const dateOfEval = new Date(splitter[2], splitter[1] - 1, splitter[0])

      monthOfEval = dateOfEval.getMonth()
      yearOfEval = dateOfEval.getFullYear()
    }

    let taskId
    let evaluation
    taskId = performtasks.task?._id
    evaluation = performtasks.task?.evaluations.find(
      (e) => monthOfEval === new Date(e.evaluatingMonth).getMonth() && yearOfEval === new Date(e.evaluatingMonth).getFullYear()
    )

    if (evaluation) return true
    return false
  }

  // hàm delete
  const deleteEval = async () => {
    const { translate, date, performtasks } = props
    const { storedEvaluatingMonth } = state
    Swal.fire({
      title: translate('task.task_management.delete_eval_title'),
      type: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: translate('general.yes'),
      cancelButtonText: translate('general.no')
    }).then(async (res) => {
      if (res.value) {
        const splitter = storedEvaluatingMonth.split('-')
        const dateOfEval = new Date(splitter[2], splitter[1] - 1, splitter[0])

        const monthOfEval = dateOfEval.getMonth()
        const yearOfEval = dateOfEval.getFullYear()

        // Xóa Evaluation
        let taskId
        let evaluation
        let evaluationId
        taskId = performtasks.task?._id
        evaluation = performtasks.task?.evaluations.find(
          (e) => monthOfEval === new Date(e.evaluatingMonth).getMonth() && yearOfEval === new Date(e.evaluatingMonth).getFullYear()
        )
        evaluationId = evaluation?._id

        await props.deleteEvaluation(taskId, evaluationId)
        props.handleChangeDataStatus(1) // 1 = DATA_STATUS.QUERYING
      }
    })
  }

  // hàm submit
  const save = async () => {
    let taskId
    taskId = state.task._id
    const startDateTask = convertDateTime(state.startDate, state.startTime)
    const endDateTask = convertDateTime(state.endDate, state.endTime)
    const data = {
      user: getStorage('userId'),
      progress,
      automaticPoint: state.autoPoint,
      role: 'accountable',
      hasAccountable: state.hasAccountable,

      evaluatingMonth: state.storedEvaluatingMonth,
      // date: state.date,
      startDate: startDateTask,
      endDate: endDateTask,
      // startDate: state.startDate,
      // endDate: state.endDate,

      info: state.info,
      results: state.results,
      checkSave: state.checkSave,

      kpi: state.kpi,
      unit: state.unit
    }

    await props.evaluateTaskByAccountableEmployees(data, taskId)

    setState({
      ...state,
      oldAutoPoint: state.autoPoint
    })
    // props.handleChangeDataStatus(1); // 1 = DATA_STATUS.QUERYING
    props.handleChangeShowEval(state.id)
    props.handleChangeEnableAddItem(state.id)
  }

  // hàm kiểm tra thông báo
  const checkNote = () => {
    const { date } = props
    const splitter = date.split('-')
    const isoDate = new Date(splitter[2], splitter[1] - 1, splitter[0])
    const now = new Date()

    if (now.getMonth() === isoDate.getMonth() && now.getFullYear() === isoDate.getFullYear()) {
      return false
    }
    return true
  }

  // hàm kiểm tra NULL, UNDEFINED
  const checkNullUndefined = (x) => {
    if (x === null || x === undefined) {
      return false
    }
    return true
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

  const { taskActions } = task
  let actionsNotRating
  if (date) {
    const splitter = date.split('-')
    const evaluationsDate = new Date(splitter[2], splitter[1] - 1, splitter[0])
    actionsNotRating = taskActions.filter(
      (item) =>
        item.rating === -1 &&
        new Date(item.createdAt).getMonth() === evaluationsDate.getMonth() &&
        new Date(item.createdAt).getFullYear() === evaluationsDate.getFullYear()
    )
  }

  let checkNoteMonth
  // checkNoteMonth = checkNote();

  const disabled = false
  // if (checkNoteMonth && (dentaDate > 7)) {
  //     disabled = true;
  // }
  const disableSubmit = !isFormValidated()

  return (
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
        {
          // !(checkNoteMonth && (dentaDate > 7)) &&
          <div className='pull-right'>
            {/* disabled={disabled || disableSubmit} id !== 'new' && */}
            {checkHasEval(storedEvaluatingMonth, performtasks) && !errorOnMonth && role === 'accountable' && (
              <button style={{ marginRight: '5px' }} className='btn btn-danger' onClick={deleteEval}>
                {translate('task.task_management.delete_eval')}
              </button>
            )}
            <button disabled={disabled || disableSubmit} className='btn btn-success' onClick={save}>
              {translate('task.task_management.btn_save_eval')}
            </button>
          </div>
        }
      </div>

      <div className='body-evaluation' style={{ height: 'calc(100vh - 186px)', overflow: 'auto' }}>
        {/* Đánh giá từ ngày ... đến ngày ... */}
        <form id='form-evaluate-task-by-accountable'>
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
                    dateFormat='month-year'
                  />
                  <ErrorLabel content={errorOnMonth} />
                </div>
              </div>
            </div>
            {evaluatingMonth && (
              <div className='row'>
                {/* ngày đánh giá tháng trc hoặc ngày bắt đầu làm việc */}
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
                    <DatePicker id={`start_date_${id}_${perform}`} value={startDate} onChange={handleStartDateChange} disabled={disabled} />
                    <TimePicker
                      id={`time-picker-1-start-time-${id}-${perform}-${props.id}`}
                      value={startTime}
                      onChange={handleStartTimeChange}
                    />
                    <ErrorLabel content={errorOnStartDate} />
                  </div>
                </div>
                {/* ngày đánh giá */}
                <div className={`form-group col-md-6 ${errorOnEndDate === undefined ? '' : 'has-error'}`}>
                  <label>
                    {translate('task.task_management.eval_to')}
                    <span className='text-red'>*</span>
                    <span className='pull-right' style={{ fontWeight: 'normal', marginLeft: 10 }}>
                      <a style={{ cursor: 'pointer' }} onClick={() => getEndTask()}>
                        Lấy thời điểm kết thúc công việc
                      </a>
                    </span>
                  </label>
                  <DatePicker id={`end_date_${perform}-${id}`} value={endDate} onChange={handleEndDateChange} disabled={disabled} />
                  <TimePicker id={`time-picker-2-end-time-${id}-${perform}-${props.id}`} value={endTime} onChange={handleEndTimeChange} />
                  <ErrorLabel content={errorOnEndDate} />
                </div>
              </div>
            )}

            {/* Đơn vị đánh giá */}
            <div className='form-group'>
              <label>{translate('task.task_management.unit_evaluate')}</label>
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
                    hasAccountable
                      ? KPIPersonalManager && KPIPersonalManager.kpiSets
                        ? KPIPersonalManager.kpiSets.kpis
                            .filter((e) => e.type === 1)
                            .map((x) => {
                              return { value: x._id, text: x.name }
                            })
                        : []
                      : KPIPersonalManager && KPIPersonalManager.kpiSets
                        ? KPIPersonalManager.kpiSets.kpis
                            .filter((e) => e.type === 0)
                            .map((x) => {
                              return { value: x._id, text: x.name }
                            })
                        : []
                  }
                  onChange={handleKpiChange}
                  multiple
                  value={kpi}
                  disabled={disabled}
                />
              }
            </div>
          </fieldset>

          {/* Thông tin đánh giá công việc */}
          <div>
            <TaskInformationForm
              legendText={translate('task.task_management.info_eval_month')}
              task={task && task}
              evaluationInfo={evaluation || task}
              handleChangeProgress={handleChangeProgress}
              handleInfoBooleanChange={handleInfoBooleanChange}
              handleInfoDateChange={handleInfoDateChange}
              handleSetOfValueChange={handleSetOfValueChange}
              handleChangeNumberInfo={handleChangeNumberInfo}
              handleChangeTextInfo={handleChangeTextInfo}
              handleChangeSaveInfo={handleChangeSaveInfo}
              updateInfo={updateInfo}
              indexReRender={indexReRender}
              role={role}
              perform={perform}
              id={id}
              value={state}
              progress={progress}
              errorOnProgress={errorOnProgress}
              disabled={disabled}
            />
          </div>

          <div>
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
                  {actionsNotRating?.length === 0 ? (
                    translate('task.task_management.no_action')
                  ) : (
                    <ShowMoreShowLess
                      id={`actionsNotRating${id}`}
                      styleShowMoreLess={{ display: 'inline-block', marginBottom: 15, marginTop: 15 }}
                    >
                      {actionsNotRating?.map((item, index) => (
                        <div className={`item-box ${index > 3 ? 'hide-component' : ''}`}>
                          <span key={index}>
                            ({index + 1})&nbsp;&nbsp;
                            <QuillEditor id={`evaluateByAccountable${item._id}${props.id}`} quillValueDefault={item.description} isText />
                          </span>
                        </div>
                      ))}
                    </ShowMoreShowLess>
                  )}
                </div>
              </div>
              {
                // modal thông tin điểm tự động
                showAutoPointInfo === 1 && (
                  <ModalShowAutoPointInfo task={task} progress={progress} date={endDate} info={info} time={endTime} autoPoint={autoPoint} />
                )
              }
            </fieldset>

            {/* Phần chấm điểm phê duyệt */}
            <fieldset className='scheduler-border'>
              <legend className='scheduler-border'>{translate('task.task_management.evaluate_member')}</legend>

              {
                <table className='table table-striped table-hover not-sort'>
                  <tr style={{ verticalAlign: 'top' }}>
                    <th>
                      <div className='form-group'>
                        <label>{translate('task.task_management.name_employee')}</label>
                      </div>
                    </th>
                    <th>
                      <div className='form-group'>
                        <label>{translate('task.task_management.role_employee')}</label>
                      </div>
                    </th>
                    <th>
                      <div className='form-group'>
                        <label>{translate('task.task_management.detail_emp_point')}</label>
                      </div>
                    </th>
                    <th>
                      <label>% {translate('task.task_management.contribution')} (0 - 100)</label>
                      <div style={{ fontWeight: 'normal' }} className={`form-group ${errSumContribution === undefined ? '' : 'has-error'}`}>
                        <ErrorLabel content={errSumContribution || ''} />
                      </div>
                    </th>
                    <th>
                      <div className='form-group'>
                        <label>{translate('task.task_management.acc_evaluate')} (0 - 100)</label>
                      </div>
                    </th>
                  </tr>

                  {
                    // Chấm điểm phê duyệt cho người thực hiện
                    task &&
                      task.responsibleEmployees.map(
                        (item, index) =>
                          task.inactiveEmployees.indexOf(item._id) === -1 && (
                            <tr key={index} style={{ verticalAlign: 'top' }}>
                              <td>
                                <div style={{ marginTop: 10 }}>{item.name}</div>
                              </td>
                              <td>
                                <div style={{ marginTop: 10 }}>{formatRole('responsible')}</div>
                              </td>
                              <td>
                                <div style={{ marginTop: 10 }}>
                                  {checkNullUndefined(empPoint[`responsible${item._id}`])
                                    ? empPoint[`responsible${item._id}`]
                                    : translate('task.task_management.not_eval')}
                                </div>
                              </td>
                              <td style={{ padding: 5 }}>
                                <div
                                  className={
                                    errorContribute[`responsible${item._id}`] === undefined ? 'form-group' : 'form-group has-error'
                                  }
                                >
                                  <input
                                    className='form-control'
                                    value={
                                      checkNullUndefined(results[`contributeResponsible${item._id}`]?.value)
                                        ? results[`contributeResponsible${item._id}`].value
                                        : ''
                                    }
                                    type='number'
                                    name={`contributeResponsible${item._id}`}
                                    placeholder={`% ${translate('task.task_management.contribution')}`}
                                    onChange={(e) => handleChangeResponsibleContribution(e, item._id)}
                                    disabled={disabled}
                                  />
                                  <ErrorLabel content={errorContribute ? errorContribute[`responsible${item._id}`] : ''} />
                                </div>
                              </td>
                              <td style={{ padding: 5 }}>
                                <div
                                  className={
                                    errorApprovedPoint[`responsible${item._id}`] === undefined ? 'form-group' : 'form-group has-error'
                                  }
                                >
                                  <input
                                    className='form-control'
                                    type='number'
                                    value={
                                      checkNullUndefined(results[`approvedPointResponsible${item._id}`]?.value)
                                        ? results[`approvedPointResponsible${item._id}`].value
                                        : ''
                                    }
                                    name={`approvedPointResponsible${item._id}`}
                                    placeholder={translate('task.task_management.detail_acc_point')}
                                    onChange={(e) => handleChangeApprovedPointForResponsible(e, item._id)}
                                    disabled={disabled}
                                  />
                                  <ErrorLabel content={errorApprovedPoint ? errorApprovedPoint[`responsible${item._id}`] : ''} />
                                </div>
                              </td>
                            </tr>
                          )
                      )
                  }

                  {
                    // Chấm điểm phê duyệt cho người tư vấn
                    task &&
                      task.consultedEmployees &&
                      task.consultedEmployees.map(
                        (item, index) =>
                          task.inactiveEmployees.indexOf(item._id) === -1 && (
                            <tr key={index} style={{ verticalAlign: 'top' }}>
                              <td>
                                <div style={{ marginTop: 10 }}>{item.name}</div>
                              </td>
                              <td>
                                <div style={{ marginTop: 10 }}>{formatRole('consulted')}</div>
                              </td>
                              <td>
                                <div style={{ marginTop: 10 }}>
                                  {checkNullUndefined(empPoint[`consulted${item._id}`])
                                    ? empPoint[`consulted${item._id}`]
                                    : translate('task.task_management.not_eval')}
                                </div>
                              </td>
                              <td style={{ padding: 5 }}>
                                <div
                                  className={errorContribute[`consulted${item._id}`] === undefined ? 'form-group' : 'form-group has-error'}
                                >
                                  <input
                                    className='form-control'
                                    type='number'
                                    value={
                                      checkNullUndefined(results[`contributeConsulted${item._id}`]?.value)
                                        ? results[`contributeConsulted${item._id}`].value
                                        : ''
                                    }
                                    name={`contributeConsulted${item._id}`}
                                    placeholder={`% ${translate('task.task_management.contribution')}`}
                                    onChange={(e) => handleChangeConsultedContribution(e, item._id)}
                                    disabled={disabled}
                                  />
                                  <ErrorLabel content={errorContribute ? errorContribute[`consulted${item._id}`] : ''} />
                                </div>
                              </td>
                              <td style={{ padding: 5 }}>
                                <div
                                  className={
                                    errorApprovedPoint[`consulted${item._id}`] === undefined ? 'form-group' : 'form-group has-error'
                                  }
                                >
                                  <input
                                    className='form-control'
                                    type='number'
                                    value={
                                      checkNullUndefined(results[`approvedPointConsulted${item._id}`]?.value)
                                        ? results[`approvedPointConsulted${item._id}`].value
                                        : ''
                                    }
                                    name={`approvedPointConsulted${item._id}`}
                                    placeholder={translate('task.task_management.detail_acc_point')}
                                    onChange={(e) => handleChangeApprovedPointForConsulted(e, item._id)}
                                    disabled={disabled}
                                  />
                                  <ErrorLabel content={errorApprovedPoint ? errorApprovedPoint[`consulted${item._id}`] : ''} />
                                </div>
                              </td>
                            </tr>
                          )
                      )
                  }

                  {
                    // Chấm điểm phê duyệt cho người phê duyệt
                    task &&
                      task.accountableEmployees.map(
                        (item, index) =>
                          task.inactiveEmployees.indexOf(item._id) === -1 && (
                            <tr key={index} style={{ verticalAlign: 'top' }}>
                              <td>
                                <div style={{ marginTop: 10 }}>{item.name}</div>
                              </td>
                              <td>
                                <div style={{ marginTop: 10 }}>{formatRole('accountable')}</div>
                              </td>
                              <td>
                                <div style={{ marginTop: 10 }}>
                                  <p id={`accountablePoint${item._id}`}>
                                    {checkNullUndefined(empPoint[`accountable${item._id}`])
                                      ? empPoint[`accountable${item._id}`]
                                      : translate('task.task_management.not_eval')}
                                  </p>
                                </div>
                              </td>
                              <td style={{ padding: 5 }}>
                                <div
                                  className={
                                    errorContribute[`accountable${item._id}`] === undefined ? 'form-group' : 'form-group has-error'
                                  }
                                >
                                  <input
                                    className='form-control'
                                    type='number'
                                    value={
                                      checkNullUndefined(results[`contributeAccountable${item._id}`]?.value)
                                        ? results[`contributeAccountable${item._id}`].value
                                        : ''
                                    }
                                    name={`contributeAccountable${item._id}`}
                                    placeholder={`% ${translate('task.task_management.contribution')}`}
                                    onChange={(e) => handleChangeAccountableContribution(e, item._id)}
                                    disabled={disabled}
                                  />
                                  <ErrorLabel content={errorContribute ? errorContribute[`accountable${item._id}`] : ''} />
                                </div>
                              </td>
                              <td style={{ padding: 5 }}>
                                <div
                                  className={
                                    errorApprovedPoint[`accountable${item._id}`] === undefined ? 'form-group' : 'form-group has-error'
                                  }
                                >
                                  <input
                                    className='form-control'
                                    type='number'
                                    value={
                                      checkNullUndefined(results[`approvedPoint${item._id}`]?.value)
                                        ? results[`approvedPoint${item._id}`].value
                                        : ''
                                    }
                                    name={`approvedPoint${item._id}`}
                                    placeholder={translate('task.task_management.detail_acc_point')}
                                    onChange={(e) => handleChangeAccountablePoint(e, item._id)}
                                    disabled={disabled}
                                  />
                                  <ErrorLabel content={errorApprovedPoint ? errorApprovedPoint[`accountable${item._id}`] : ''} />
                                </div>
                              </td>
                            </tr>
                          )
                      )
                  }
                </table>
              }
            </fieldset>
          </div>
        </form>
      </div>
    </div>
  )
}

const mapState = (state) => {
  const { tasks, performtasks, KPIPersonalManager, user } = state
  return { tasks, performtasks, KPIPersonalManager, user }
}
const getState = {
  deleteEvaluation: performTaskAction.deleteEvaluation,
  evaluateTaskByAccountableEmployees: performTaskAction.evaluateTaskByAccountableEmployees,
  getAllKpiSetsOrganizationalUnitByMonth: managerKpiActions.getAllKpiSetsOrganizationalUnitByMonth
}

const evaluateByAccountableEmployee = connect(mapState, getState)(withTranslate(EvaluateByAccountableEmployee))
export { evaluateByAccountableEmployee as EvaluateByAccountableEmployee }
