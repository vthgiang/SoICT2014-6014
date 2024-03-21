import React, { Component, useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DatePicker, DialogModal, ErrorLabel, SelectBox, TimePicker } from '../../../../common-components'
import moment from 'moment'
import {
  checkIfHasCommonItems,
  checkIsNullUndefined,
  getSalaryFromUserId,
  numberWithCommas
} from '../../task-management/component/functionHelpers'
import {
  convertUserIdToUserName,
  getCurrentProjectDetails,
  getEstimateHumanCostFromParams,
  getEstimateMemberCost,
  getMaxMinDateInArr,
  getNearestIntegerNumber,
  getNewTasksListAfterCR,
  getProjectParticipants,
  handleWeekendAndWorkTime,
  MILISECS_TO_DAYS,
  MILISECS_TO_HOURS,
  processAffectedTasksChangeRequest,
  getEstimateCostOfProject,
  getEndDateOfProject,
  getRecursiveRelevantTasks
} from '../../../project/projects/components/functionHelper'
import ValidationHelper from '../../../../helpers/validationHelper'
import { TaskFormValidator } from '../../task-management/component/taskFormValidator'
import dayjs from 'dayjs'
import getEmployeeSelectBoxItems from '../../organizationalUnitHelper'
import { getStorage } from '../../../../config'
import { ProjectActions } from '../../../project/projects/redux/actions'
import { UserActions } from '../../../super-admin/user/redux/actions'
import { taskManagementActions } from '../../task-management/redux/actions'
import { RoleActions } from '../../../super-admin/role/redux/actions'
import { ChangeRequestActions } from '../../../project/change-requests/redux/actions'

const ModalRequestEditProjectTaskEmployee = (props) => {
  const {
    task,
    translate,
    progress,
    project,
    id,
    user,
    currentProjectTasks,
    currentProjectPhase = [],
    tasks,
    projectPhase,
    currentProjectMilestone = []
  } = props
  const projectDetail = getCurrentProjectDetails(project, task.taskProject)
  const [state, setState] = useState({
    editTask: {
      startDate: task?.startDate ? moment(task?.startDate).format('DD-MM-YYYY') : moment().format('DD-MM-YYYY'),
      endDate: task?.endDate ? moment(task?.endDate).format('DD-MM-YYYY') : '',
      priority: task?.priority || 3,
      responsibleEmployees: task?.responsibleEmployees?.map((resItem) => resItem._id) || [],
      accountableEmployees: task?.accountableEmployees?.map((accItem) => accItem._id) || [],
      preceedingTasks: task?.preceedingTasks?.map((preItem) => preItem.task._id) || [],
      preceedingMilestones: task?.preceedingMilestones || [],
      estimateNormalTime:
        Number(task?.estimateNormalTime) / (projectDetail?.unitTime === 'days' ? MILISECS_TO_DAYS : MILISECS_TO_HOURS) || '',
      estimateOptimisticTime:
        Number(task?.estimateOptimisticTime) / (projectDetail?.unitTime === 'days' ? MILISECS_TO_DAYS : MILISECS_TO_HOURS) || '',
      taskPhase: task?.taskPhase || '',
      estimateNormalCost: task?.estimateNormalCost || '',
      estimateMaxCost: task?.estimateMaxCost || '',
      estimateAssetCost: task?.estimateAssetCost || '1,000,000',
      estimateHumanCost: numberWithCommas(
        getEstimateHumanCostFromParams(
          projectDetail,
          Number(task?.estimateNormalTime) / (projectDetail?.unitTime === 'days' ? MILISECS_TO_DAYS : MILISECS_TO_HOURS) || '',
          task?.responsibleEmployees?.map((resItem) => resItem._id) || [],
          task?.accountableEmployees?.map((accItem) => accItem._id) || [],
          projectDetail?.unitTime,
          task?.responsibleEmployees?.map((resItem, resIndex) => {
            return {
              userId: resItem._id,
              weight: Number(task?.totalResWeight || 80) / task?.responsibleEmployees?.length
            }
          }) || [],
          task?.accountableEmployees?.map((accItem, accIndex) => {
            return {
              userId: accItem._id,
              weight: Number(task?.totalResWeight ? 100 - Number(task?.totalResWeight) : 20) / task?.accountableEmployees?.length
            }
          }) || []
        )
      ),
      actorsWithSalary: task?.actorsWithSalary,
      totalResWeight: task?.totalResWeight || 80,
      totalAccWeight: task?.totalResWeight ? 100 - Number(task?.totalResWeight) : 20,
      currentResWeightArr:
        task?.responsibleEmployees?.map((resItem, resIndex) => {
          return {
            userId: resItem._id,
            weight: Number(task?.totalResWeight || 80) / task?.responsibleEmployees?.length
          }
        }) || [],
      currentAccWeightArr:
        task?.accountableEmployees?.map((accItem, accIndex) => {
          return {
            userId: accItem._id,
            weight: Number(task?.totalResWeight ? 100 - Number(task?.totalResWeight) : 20) / task?.accountableEmployees?.length
          }
        }) || [],
      currentLatestStartDate: getMaxMinDateInArr(
        task?.preceedingTasks?.map((preceedingItem) => {
          return currentProjectTasks?.find((projectTaskItem) => {
            return String(projectTaskItem._id) === String(preceedingItem.task._id)
          })?.endDate
        }),
        'max'
      )
    },
    currentRole: getStorage('currentRole')
  })
  const [startTime, setStartTime] = useState(task?.startDate ? moment(task?.startDate).format('h:mm A') : '08:00 AM')
  const [endTime, setEndTime] = useState(task?.endDate ? moment(task?.endDate).format('h:mm A') : '05:30 PM')
  const { editTask } = state
  const {
    estimateNormalTime,
    estimateOptimisticTime,
    estimateNormalCost,
    estimateMaxCost,
    estimateAssetCost,
    responsibleEmployees,
    accountableEmployees,
    totalResWeight,
    totalAccWeight,
    currentResWeightArr,
    currentAccWeightArr,
    estimateHumanCost
  } = editTask
  const listUsers = user && user.usersInUnitsOfCompany ? getEmployeeSelectBoxItems(user.usersInUnitsOfCompany) : []
  const timePickerRef = useRef(null)

  const [currentTasksToChoose, setCurrentTasksToChoose] = useState({
    preceeding: []
  })

  const [currentPhaseToChoose, setCurrentPhaseToChoose] = useState({
    phases: []
  })

  const [currentMilestoneToChoose, setCurrentMilestoneToChoose] = useState({
    milestones: []
  })

  useEffect(() => {
    let res = currentProjectTasks
      ? currentProjectTasks
          ?.filter((item) => item._id !== task._id)
          .map((item) => ({
            value: item._id,
            text: item.name
          }))
      : []
    // res.unshift({value: "", text: "Chọn công việc tiền nhiệm"})
    setCurrentTasksToChoose({
      preceeding: res
    })
  }, [JSON.stringify(currentProjectTasks), task._id])

  useEffect(() => {
    let res = currentProjectPhase
      ? currentProjectPhase?.map((item) => ({
          value: item._id,
          text: item.name
        }))
      : []
    res.unshift({ value: '', text: '--Chọn giai đoạn--' })
    setCurrentPhaseToChoose({
      phases: res
    })
  }, [JSON.stringify(currentProjectPhase)])

  useEffect(() => {
    let res = currentProjectMilestone
      ? currentProjectMilestone?.map((item) => ({
          value: item._id,
          text: item.name
        }))
      : []
    setCurrentMilestoneToChoose({
      milestones: res
    })
  }, [JSON.stringify(currentProjectMilestone)])

  const convertDateTime = (date, time) => {
    let splitter = date.split('-')
    let strDateTime = `${splitter[2]}/${splitter[1]}/${splitter[0]} ${time.replace(/CH/g, 'PM').replace(/SA/g, 'AM')}`
    return dayjs(strDateTime).format('YYYY/MM/DD HH:mm:ss')
  }

  const handleChangeTaskStartDate = (value) => {
    validateTaskStartDate(value, true)
  }
  const validateTaskStartDate = (value, willUpdateState = true) => {
    let { translate, project } = props
    let { editTask } = state
    let msg = TaskFormValidator.validateTaskStartDate(value, editTask.endDate, translate)
    const curStartDateTime = convertDateTime(value, startTime)
    const taskItem = curStartDateTime &&
      editTask.estimateNormalTime && {
        startDate: curStartDateTime,
        endDate: undefined,
        estimateNormalTime: Number(editTask.estimateNormalTime)
      }
    const curEndDateTime = taskItem ? handleWeekendAndWorkTime(projectDetail, taskItem).endDate : ''
    const curEndDate = curEndDateTime ? moment(curEndDateTime).format('DD-MM-YYYY') : state.editTask.endDate
    const curEndTime = curEndDateTime ? moment(curEndDateTime).format('h:mm A').replace(/CH/g, 'PM').replace(/SA/g, 'AM') : endTime
    const currentNewTask = {
      ...state.editTask,
      startDate: value,
      endDate: curEndDate
    }
    if (willUpdateState) {
      setEndTime(curEndTime)
      setState({
        ...state,
        editTask: currentNewTask
      })
    }
    return msg === undefined
  }

  const handleStartTimeChange = (value) => {
    const { project } = props
    let { editTask } = state
    const curStartDateTime = convertDateTime(state.editTask.startDate, value)
    const taskItem = curStartDateTime &&
      editTask.estimateNormalTime && {
        startDate: curStartDateTime,
        endDate: undefined,
        estimateNormalTime: Number(editTask.estimateNormalTime)
      }
    const curEndDateTime = taskItem ? handleWeekendAndWorkTime(projectDetail, taskItem).endDate : ''
    const curEndDate = curEndDateTime ? moment(curEndDateTime).format('DD-MM-YYYY') : state.editTask.endDate
    const curEndTime = curEndDateTime ? moment(curEndDateTime).format('h:mm A').replace(/CH/g, 'PM').replace(/SA/g, 'AM') : endTime
    const currentNewTask = {
      ...state.editTask,
      endDate: curEndDate
    }
    setStartTime(value)
    setEndTime(curEndTime)
    setState({
      ...state,
      editTask: currentNewTask
    })
  }

  const handleChangeTaskPriority = (event) => {
    const currentNewTask = {
      ...state.editTask,
      priority: event.target.value
    }
    setState({
      ...state,
      editTask: currentNewTask
    })
  }

  const handleChangeTaskResponsibleEmployees = (value) => {
    validateTaskResponsibleEmployees(value, true)
  }
  const validateTaskResponsibleEmployees = (value, willUpdateState = true) => {
    let { translate, project } = props
    let { message } = ValidationHelper.validateArrayLength(props.translate, value)
    // if (checkIfHasCommonItems(value, editTask.accountableEmployees)) {
    //     message = "Thành viên Thực hiện và Phê duyệt không được trùng nhau"
    // }

    if (willUpdateState) {
      const responsiblesWithSalaryArr = value?.map((valueItem) => {
        return {
          userId: valueItem,
          salary: getSalaryFromUserId(projectDetail?.responsibleEmployeesWithUnit, valueItem),
          weight: Number(totalResWeight) / value.length
        }
      })
      const accountablesWithSalaryArr = state.editTask.accountableEmployees?.map((valueItem) => {
        return {
          userId: valueItem,
          salary: getSalaryFromUserId(projectDetail?.responsibleEmployeesWithUnit, valueItem),
          weight: Number(totalAccWeight) / state.editTask.accountableEmployees.length
        }
      })
      const currentNewTask = {
        ...state.editTask,
        responsibleEmployees: value,
        errorOnResponsibleEmployees: message,
        actorsWithSalary: [...responsiblesWithSalaryArr, ...accountablesWithSalaryArr]
      }
      setState({
        ...state,
        editTask: currentNewTask
      })
    }
    return message === undefined
  }

  const handleChangeTaskAccountableEmployees = (value) => {
    validateTaskAccountableEmployees(value, true)
  }
  const validateTaskAccountableEmployees = (value, willUpdateState = true) => {
    let { translate, project } = props
    let { message } = ValidationHelper.validateArrayLength(props.translate, value)
    // if (checkIfHasCommonItems(value, editTask.responsibleEmployees)) {
    //     message = "Thành viên Thực hiện và Phê duyệt không được trùng nhau"
    // }

    if (willUpdateState) {
      const accountablesWithSalaryArr = value?.map((valueItem) => {
        return {
          userId: valueItem,
          salary: getSalaryFromUserId(projectDetail?.responsibleEmployeesWithUnit, valueItem),
          weight: Number(totalAccWeight) / value.length
        }
      })
      const responsiblesWithSalaryArr = state.editTask.responsibleEmployees?.map((valueItem) => {
        return {
          userId: valueItem,
          salary: getSalaryFromUserId(projectDetail?.responsibleEmployeesWithUnit, valueItem),
          weight: Number(totalResWeight) / state.editTask.responsibleEmployees.length
        }
      })
      const currentNewTask = {
        ...state.editTask,
        accountableEmployees: value,
        errorOnAccountableEmployees: message,
        actorsWithSalary: [...responsiblesWithSalaryArr, ...accountablesWithSalaryArr]
      }
      setState({
        ...state,
        editTask: currentNewTask
      })
    }
    return message === undefined
  }

  // Thay đổi công việc tiền nhiệm
  const handleChangePreceedingTask = (selected) => {
    let message
    // if (checkIfHasCommonItems(selected, editTask.followingTasks)) {
    //     message = "Danh sách công việc Tiền nhiệm và Kế nhiệm không được trùng nhau."
    // }
    const currentNewTask = {
      ...state.editTask,
      preceedingTasks: selected
      // errorOnPreceedFollowTasks: message,
    }
    setState({
      ...state,
      editTask: currentNewTask
    })
  }

  // Thay đổi cột mốc tiền nhiệm
  const handleChangePreceedingMilestone = (selected) => {
    let message
    const currentNewTask = {
      ...state.editTask,
      preceedingMilestones: selected,
      errorOnPreceedMilestones: message
    }
    setState({
      ...state,
      editTask: currentNewTask
    })
  }

  // Thay đổi giai đoạn
  const handleChangeTaskPhase = (selected) => {
    const currentNewTask = {
      ...state.editTask,
      taskPhase: selected[0]
    }
    setState({
      ...state,
      editTask: currentNewTask
    })
  }

  const handleChangeBudget = (event) => {
    let value = event.target.value
    validateBudget(value, true)
  }
  const validateBudget = (value, willUpdateState = true) => {
    let { translate } = props
    let { message } = ValidationHelper.validateNumericInputMandatory(translate, value)

    const newCurrentTask = {
      ...state.editTask,
      estimateMaxCost: value,
      errorOnBudget: message
    }
    if (willUpdateState) {
      setState({
        ...state,
        editTask: newCurrentTask
      })
    }
    return message === undefined
  }

  // Hàm check xem duration có phù hợp không?
  const isDurationNotSuitable = (estimateNormalTime) => {
    if (projectDetail?.unitTime === 'days') return estimateNormalTime > 7 || estimateNormalTime < 1 / 6
    return estimateNormalTime < 4 || estimateNormalTime > 56
  }
  // Hàm thay đổi estimateNormalTime
  const handleChangeEstTimeTask = (value, timeType) => {
    const { editTask } = state
    let message
    if (value?.length === 0 || value?.match(/.*[a-zA-Z]+.*/) || isDurationNotSuitable(Number(value))) {
      message =
        projectDetail?.unitTime === 'days'
          ? 'Không được bỏ trống và chỉ được điền số <= 7 và >= 1/6'
          : 'Không được bỏ trống và chỉ được điền số <= 56 và >= 4'
    }

    if (timeType === 'estimateNormalTime') {
      const curStartDateTime = state.editTask.startDate ? convertDateTime(state.editTask.startDate, startTime) : undefined
      const currentEstimateNormalTime = String(Number(value)) === 'NaN' ? 0 : Number(value)
      const taskItem = curStartDateTime && {
        startDate: curStartDateTime,
        endDate: undefined,
        estimateNormalTime: currentEstimateNormalTime
      }
      const curEndDateTime = taskItem ? handleWeekendAndWorkTime(projectDetail, taskItem).endDate : ''
      const curEndDate = curEndDateTime ? moment(curEndDateTime).format('DD-MM-YYYY') : state.editTask.endDate
      const curEndTime = curEndDateTime ? moment(curEndDateTime).format('h:mm A').replace(/CH/g, 'PM').replace(/SA/g, 'AM') : endTime

      const predictEstimateOptimisticTime =
        String(Number(value)) === 'NaN' || Number(value) === 0 || Number(value) === 1
          ? '0'
          : Number(value) === 2
            ? '1'
            : (Number(value) - 2).toString()

      const newCurrentTask = {
        ...state.editTask,
        estimateNormalTime: value,
        estimateOptimisticTime: predictEstimateOptimisticTime,
        errorOnTimeEst: message,
        endDate: curEndDate
      }
      setEndTime(curEndTime)
      setState({
        ...state,
        editTask: newCurrentTask
      })
      return
    }
    const newCurrentTask = {
      ...state.editTask,
      [timeType]: value,
      errorOnTimeEst: message,
      errorOnMaxTimeEst: TaskFormValidator.validateTimeEst(value, props.translate, true, Number(editTask.estimateNormalTime))
    }
    setState({
      ...state,
      editTask: newCurrentTask
    })
  }

  const handleChangeAssetCost = (event) => {
    let value = event.target.value.toString()
    validateAssetCost(value, true)
  }
  const validateAssetCost = (value, willUpdateState = true) => {
    let { translate } = props
    let { message } = ValidationHelper.validateNumericInputMandatory(translate, value)

    const currentNewTask = {
      ...state.editTask,
      estimateAssetCost: value,
      estimateNormalCost: numberWithCommas(Number(String(estimateHumanCost).replace(/,/g, '')) + Number(value)),
      errorOnAssetCode: message
    }
    if (willUpdateState) {
      setState({
        ...state,
        editTask: currentNewTask
      })
    }
    return message === undefined
  }

  // Hàm thay đổi total trọng số của thành viên Thực Hiện
  const handleChangeTotalResWeight = (event) => {
    let value = event.target.value
    validateTotalResWeight(value, true)
  }
  const validateTotalResWeight = (value, willUpdateState = true) => {
    let message = undefined
    if (value?.length === 0 || value?.match(/.*[a-zA-Z]+.*/)) {
      message = 'Không được bỏ trống và chỉ được điền số'
    } else if (Number(totalAccWeight) + Number(value) !== 100) {
      message = 'Trọng số Thực hiện + Trọng số Phê duyệt phải bằng 100'
    }
    const newCurrentTask = {
      ...state.editTask,
      errorOnTotalWeight: message,
      totalResWeight: value
    }
    if (willUpdateState) {
      setState({
        ...state,
        editTask: newCurrentTask
      })
    }
    return message === undefined
  }

  // Hàm thay đổi total trọng số của thành viên Phê Duyệt
  const handleChangeTotalAccWeight = (event) => {
    let value = event.target.value
    validateTotalAccWeight(value, true)
  }
  const validateTotalAccWeight = (value, willUpdateState = true) => {
    let message = undefined
    if (value?.length === 0 || value?.match(/.*[a-zA-Z]+.*/)) {
      message = 'Không được bỏ trống và chỉ được điền số'
    } else if (Number(totalResWeight) + Number(value) !== 100) {
      message = 'Trọng số Thực hiện + Trọng số Phê duyệt phải bằng 100'
    }
    const newCurrentTask = {
      ...state.editTask,
      errorOnTotalWeight: message,
      totalAccWeight: value
    }
    if (willUpdateState) {
      setState({
        ...state,
        editTask: newCurrentTask
      })
    }
    return message === undefined
  }

  useEffect(() => {
    let resultHumanCost = 0
    const newCurrentResWeightArr = responsibleEmployees.map((resItem, resIndex) => {
      return {
        userId: resItem,
        weight: Number(totalResWeight) / responsibleEmployees.length
      }
    })
    const newCurrentAccWeightArr = accountableEmployees.map((accItem, accIndex) => {
      return {
        userId: accItem,
        weight: Number(totalAccWeight) / accountableEmployees.length
      }
    })
    resultHumanCost += getEstimateHumanCostFromParams(
      projectDetail,
      estimateNormalTime,
      responsibleEmployees,
      accountableEmployees,
      projectDetail?.unitTime,
      newCurrentResWeightArr,
      newCurrentAccWeightArr
    )
    const resultNormalCost = resultHumanCost + Number(String(estimateAssetCost).replace(/,/g, ''))

    const currentNewTask = {
      ...state.editTask,
      currentResWeightArr: newCurrentResWeightArr,
      currentAccWeightArr: newCurrentAccWeightArr,
      estimateHumanCost: numberWithCommas(resultHumanCost),
      estimateNormalCost: numberWithCommas(resultNormalCost),
      estimateMaxCost: numberWithCommas(getNearestIntegerNumber(resultNormalCost))
    }
    setState({
      ...state,
      editTask: currentNewTask
    })
  }, [responsibleEmployees, accountableEmployees, estimateAssetCost, estimateNormalTime, totalResWeight, totalAccWeight])

  // Khi preceedingTasksList có sự thay đổi thì followingTasksList cũng phải thay đổi theo
  useEffect(() => {
    const preceedingTasksEndDateArr = editTask.preceedingTasks.map((preceedingItem) => {
      return currentProjectTasks?.find((projectTaskItem) => String(projectTaskItem._id) === String(preceedingItem)).endDate
    })
    let preceedingMilestonesEndDateArr =
      editTask?.preceedingMilestones?.map((preceedingItem) => {
        return currentProjectMilestone?.find((projectMilestoneItem) => String(projectMilestoneItem._id) === String(preceedingItem)).endDate
      }) || []
    preceedingTasksEndDateArr.push(...preceedingMilestonesEndDateArr)
    const latestStartDate = getMaxMinDateInArr(preceedingTasksEndDateArr, 'max')
    const curStartDate = moment(latestStartDate).format('DD-MM-YYYY')
    const curStartTime = moment(latestStartDate).format('h:mm A')
    const taskItem = editTask.estimateNormalTime && {
      startDate: latestStartDate,
      endDate: undefined,
      estimateNormalTime: Number(editTask.estimateNormalTime)
    }
    const curEndDateTime = taskItem ? handleWeekendAndWorkTime(projectDetail, taskItem).endDate : ''
    const curEndDate = curEndDateTime ? moment(curEndDateTime).format('DD-MM-YYYY') : state.editTask.endDate
    const curEndTime = curEndDateTime ? moment(curEndDateTime).format('h:mm A').replace(/CH/g, 'PM').replace(/SA/g, 'AM') : endTime
    // console.log('curStartDate', curStartDate)
    // console.log('curStartTime', curStartTime)
    ;(editTask.preceedingTasks.length > 0 || editTask.preceedingMilestones.length > 0) && setStartTime(curStartTime)
    ;(editTask.preceedingTasks.length > 0 || editTask.preceedingMilestones.length > 0) && setEndTime(curEndTime)
    ;(editTask.preceedingTasks.length > 0 || editTask.preceedingMilestones.length > 0) &&
      setState({
        ...state,
        editTask: {
          ...state.editTask,
          currentLatestStartDate: latestStartDate,
          startDate: curStartDate,
          endDate: curEndDate
        }
      })
  }, [editTask.preceedingTasks, editTask.preceedingMilestones])

  useEffect(() => {
    const { currentRole } = state
    props.showInfoRole(currentRole)
    props.getAllUserInAllUnitsOfCompany()
    // props.getTasksByProject(task.taskProject);
    // props.getProjectsDispatch({ calledId: "all", userId: getStorage('userId') });
  }, [])

  useEffect(() => {
    const curStartDateTime = convertDateTime(editTask.startDate, startTime)
    // console.log('curStartDateTime', curStartDateTime)
    // console.log('editTask.currentLatestStartDate', editTask.currentLatestStartDate)
    if (
      editTask.currentLatestStartDate &&
      editTask.preceedingTasks.length > 0 &&
      moment(curStartDateTime).isBefore(moment(editTask.currentLatestStartDate).set('second', 0))
    ) {
      setState({
        ...state,
        editTask: {
          ...state.editTask,
          errorOnStartDate: `Thời điểm bắt đầu phải sau thời gian kết thúc của công việc, cột mốc tiền nhiệm: ${moment(editTask.currentLatestStartDate).format('HH:mm DD/MM/YYYY')}`
        }
      })
    } else {
      setState({
        ...state,
        editTask: {
          ...state.editTask,
          errorOnStartDate: undefined
        }
      })
    }
  }, [editTask.currentLatestStartDate, editTask.startDate, startTime])

  const save = async () => {
    const { editTask } = state
    let startDateTask = moment(convertDateTime(editTask.startDate, startTime)).format()
    let endDateTask = moment(convertDateTime(editTask.endDate, endTime)).format()
    const currentProjectTasksFormatPreceedingTasks = currentProjectTasks.map((taskItem) => {
      return {
        ...taskItem,
        preceedingTasks: taskItem.preceedingTasks.map((taskItemPreItem) => {
          return taskItemPreItem.task
        })
      }
    })
    // console.log('currentProjectTasks', currentProjectTasks)
    // console.log('currentProjectTasksFormatPreceedingTasks', currentProjectTasksFormatPreceedingTasks)

    const editTaskFormatted = {
      ...task,
      ...editTask,
      estimateNormalTime: Number(editTask.estimateNormalTime),
      estimateOptimisticTime: Number(editTask.estimateOptimisticTime),
      estimateNormalCost: Number(String(editTask.estimateNormalCost).replace(/,/g, '')),
      estimateMaxCost: Number(String(editTask.estimateMaxCost).replace(/,/g, '')),
      preceedingTasks: editTask.preceedingTasks,
      actorsWithSalary: editTask.actorsWithSalary,
      taskPhase: editTask.taskPhase !== '' ? editTask.taskPhase : null,
      estimateAssetCost: Number(String(editTask.estimateAssetCost).replace(/,/g, '')),
      totalResWeight: Number(editTask.totalResWeight),
      startDate: startDateTask,
      endDate: endDateTask
    }

    // console.log('editTaskFormatted', editTaskFormatted)
    // Hàm đệ quy để lấy tất cả những tasks có liên quan tới task hiện tại
    const allTasksNodeRelationArr = getRecursiveRelevantTasks(currentProjectTasksFormatPreceedingTasks, editTaskFormatted)
    allTasksNodeRelationArr.unshift({
      ...task,
      preceedingTasks: task.preceedingTasks.map((preItem) => preItem.task._id)
    })
    const allTasksNodeRelationFormattedArr = allTasksNodeRelationArr

    const { affectedTasks, newTasksList } = processAffectedTasksChangeRequest(
      projectDetail,
      allTasksNodeRelationFormattedArr,
      editTaskFormatted
    )
    // console.log(affectedTasks, 123);
    const newAffectedTasksList = affectedTasks.map((affectedItem) => {
      return {
        ...affectedItem,
        old: {
          ...task,
          ...affectedItem.old,
          preceedingTasks: affectedItem.old.preceedingTasks?.map((item) => ({
            task: item,
            link: ''
          })),
          estimateNormalTime:
            Number(affectedItem.old.estimateNormalTime) * (projectDetail.unitTime === 'days' ? MILISECS_TO_DAYS : MILISECS_TO_HOURS),
          estimateOptimisticTime:
            Number(affectedItem.old.estimateOptimisticTime) * (projectDetail.unitTime === 'days' ? MILISECS_TO_DAYS : MILISECS_TO_HOURS)
        },
        new: {
          ...task,
          ...affectedItem.new,
          preceedingTasks: affectedItem.new.preceedingTasks?.map((item) => ({
            task: item,
            link: ''
          })),
          estimateNormalTime:
            Number(affectedItem.new.estimateNormalTime) * (projectDetail.unitTime === 'days' ? MILISECS_TO_DAYS : MILISECS_TO_HOURS),
          estimateOptimisticTime:
            Number(affectedItem.new.estimateOptimisticTime) * (projectDetail.unitTime === 'days' ? MILISECS_TO_DAYS : MILISECS_TO_HOURS)
        }
      }
    })
    // console.log('newAffectedTasksList', newAffectedTasksList )
    const currentTask = {
      ...task,
      ...editTaskFormatted,
      task: task._id,
      preceedingTasks: editTaskFormatted.preceedingTasks.map((preItem) => {
        return {
          task: preItem,
          link: ''
        }
      }),
      endDate: newTasksList.find((newTaskItem) => String(newTaskItem._id) === String(task._id))?.endDate,
      totalResWeight: editTask.totalResWeight,
      estimateNormalTime:
        Number(editTaskFormatted.estimateNormalTime) * (projectDetail.unitTime === 'days' ? MILISECS_TO_DAYS : MILISECS_TO_HOURS),
      estimateOptimisticTime:
        Number(editTaskFormatted.estimateOptimisticTime) * (projectDetail.unitTime === 'days' ? MILISECS_TO_DAYS : MILISECS_TO_HOURS)
    }
    // newTasksList ngắn hơn currentProjectTasks vì ta chỉ xét những tasks có liên quan tới task hiện tại
    const newCurrentProjectTasks = currentProjectTasks.map((taskItem) => {
      for (let newTaskItem of newTasksList) {
        if (String(newTaskItem._id) === String(taskItem._id)) {
          return {
            ...taskItem,
            ...newTaskItem
          }
        }
      }
      return taskItem
    })
    // console.log('newCurrentProjectTasks', newCurrentProjectTasks)

    // const newTasksListAfterCR = getNewTasksListAfterCR(projectDetail, newCurrentProjectTasks, editTaskFormatted);
    // console.log('newTasksListAfterCR', newTasksListAfterCR)
    if (newAffectedTasksList.length > 0) {
      await props.createProjectChangeRequestDispatch({
        creator: getStorage('userId'),
        name: `Chỉnh sửa công việc "${task?.name}"`,
        description: `Chỉnh sửa công việc "${task?.name}"`,
        requestStatus: 1,
        type: 'edit_task',
        currentTask,
        baseline: {
          oldEndDate: getEndDateOfProject(currentProjectTasks, false),
          newEndDate: getEndDateOfProject(newCurrentProjectTasks, false),
          oldCost: getEstimateCostOfProject(currentProjectTasks),
          newCost: getEstimateCostOfProject(newCurrentProjectTasks)
        },
        taskProject: projectDetail?._id,
        affectedTasksList: newAffectedTasksList
      })
    }
  }

  const isFormValidated = () => {
    const { editTask } = state
    return (
      editTask?.estimateMaxCost &&
      editTask?.startDate?.trim()?.length > 0 &&
      !editTask?.errorOnPreceedMilestones &&
      editTask?.endDate?.trim()?.length > 0 &&
      editTask?.responsibleEmployees?.length > 0 &&
      editTask?.accountableEmployees?.length > 0 &&
      editTask?.estimateAssetCost &&
      !editTask?.errorOnAccountableEmployees &&
      !editTask?.errorOnAssetCode &&
      !editTask?.errorOnBudget &&
      !editTask?.errorOnEndDate &&
      !editTask?.errorOnMaxTimeEst &&
      !editTask?.errorOnPreceedFollowTasks &&
      !editTask?.errorOnResponsibleEmployees &&
      !editTask?.errorOnStartDate &&
      !editTask?.errorOnTimeEst &&
      !editTask?.errorOnTotalWeight
    )
  }

  return (
    <React.Fragment>
      <DialogModal
        modalID={`modal-request-edit-project-task-accountable-${task?._id}`}
        formID={`form-request-edit-project-task-accountable-${task?._id}`}
        title={`Yêu cầu chỉnh sửa nguồn lực với tư cách phê duyệt`}
        hasSaveButton={true}
        func={save}
        size={100}
        disableSubmit={!isFormValidated()}
      >
        <div>
          {currentProjectTasks && (
            <div className='box'>
              <div className={`col-sm-4 col-md-4 col-xs-12`}>
                {/* Thông tin công việc */}
                <fieldset className='scheduler-border'>
                  <legend className='scheduler-border'>{translate('task.task_management.detail_info')}</legend>
                  <div className='row'>
                    {/* Công việc tiền nhiệm */}
                    {currentTasksToChoose.preceeding.length > 0 && (
                      <div
                        className={`form-group col-md-12 col-xs-12 ${editTask.errorOnPreceedFollowTasks === undefined ? '' : 'has-error'}`}
                      >
                        <label>{translate('project.task_management.preceedingTask')}</label>
                        <SelectBox
                          id={`select-project-preceeding-task-modal-request`}
                          className='form-control select2'
                          style={{ width: '100%' }}
                          items={currentTasksToChoose.preceeding}
                          value={editTask.preceedingTasks}
                          multiple={true}
                          onChange={handleChangePreceedingTask}
                        />
                        <ErrorLabel content={editTask.errorOnPreceedFollowTasks} />
                      </div>
                    )}
                  </div>

                  <div className='row'>
                    {/* Cột mốc tiền nhiệm */}
                    {currentMilestoneToChoose.milestones.length > 0 && (
                      <div className={`form-group col-md-12 col-xs-12`}>
                        <label>{translate('project.task_management.preceedingMilestone')}</label>
                        <SelectBox
                          id={`select-project-preceeding-milestone-modal-request`}
                          className='form-control select2'
                          style={{ width: '100%' }}
                          items={currentMilestoneToChoose.milestones}
                          value={editTask.preceedingMilestones}
                          multiple={true}
                          onChange={handleChangePreceedingMilestone}
                        />
                        <ErrorLabel content={editTask.errorOnPreceedMilestone} />
                      </div>
                    )}
                  </div>

                  <div className='row'>
                    {/* Giai đoạn trong dự án */}
                    <div className={`form-group col-md-12 col-xs-12`}>
                      <label>{translate('project.task_management.phase')}</label>
                      <SelectBox
                        id={`select-project-phase-modal-request`}
                        className='form-control select2'
                        style={{ width: '100%' }}
                        items={currentPhaseToChoose.phases}
                        value={editTask.taskPhase}
                        multiple={false}
                        onChange={handleChangeTaskPhase}
                      />
                    </div>
                  </div>
                </fieldset>

                {/* Chi phí */}
                {editTask.startDate.trim().length > 0 &&
                  editTask.endDate.trim().length > 0 &&
                  editTask.responsibleEmployees.length > 0 &&
                  editTask.accountableEmployees.length > 0 && (
                    <fieldset className='scheduler-border'>
                      <legend className='scheduler-border'>Ước lượng chi phí</legend>
                      <div className={'row'}>
                        {/* Chi phí ước lượng tài sản */}
                        <div
                          className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 form-group ${editTask.errorOnAssetCode === undefined ? '' : 'has-error'}`}
                        >
                          <label className='control-label'>
                            Chi phí ước lượng tài sản<span className='text-red'>*</span> ({projectDetail?.unitCost})
                          </label>
                          <input
                            type='text'
                            className='form-control'
                            value={estimateAssetCost}
                            onChange={handleChangeAssetCost}
                            onFocus={() => {
                              setState({
                                ...state,
                                editTask: {
                                  ...state.editTask,
                                  estimateAssetCost: String(estimateAssetCost).replace(/,/g, '')
                                }
                              })
                            }}
                            onBlur={() => {
                              setState({
                                ...state,
                                editTask: {
                                  ...state.editTask,
                                  estimateAssetCost: numberWithCommas(estimateAssetCost)
                                }
                              })
                            }}
                          />
                        </div>
                        <ErrorLabel content={editTask.errorOnAssetCode} />
                        {/* Chi phí ước lượng nhân lực */}
                        <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 form-group`}>
                          <label className='control-label'>Chi phí ước lượng nhân lực ({projectDetail?.unitCost})</label>
                          <input className='form-control' value={numberWithCommas(editTask.estimateHumanCost)} disabled={true} />
                        </div>
                      </div>
                      <div className={'row'}>
                        {/* Chi phí ước lượng */}
                        <div
                          className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 form-group ${Number(String(estimateNormalCost).replace(/,/g, '')) > Number(String(editTask.estimateMaxCost).replace(/,/g, '')) ? 'has-error' : ''}`}
                        >
                          <label className='control-label'>Chi phí ước lượng tổng ({projectDetail?.unitCost})</label>
                          <input className='form-control' value={numberWithCommas(estimateNormalCost)} disabled={true} />
                          <ErrorLabel
                            content={
                              Number(String(estimateNormalCost).replace(/,/g, '')) >
                                Number(String(editTask.estimateMaxCost).replace(/,/g, '')) && 'Ngân sách đang thấp hơn chi phí ước lượng'
                            }
                          />
                        </div>
                        {/* Ngân sách cho công việc */}
                        <div
                          className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 form-group ${editTask.errorOnBudget === undefined ? '' : 'has-error'}`}
                        >
                          <label>
                            Chi phí thoả hiệp<span className='text-red'>*</span> ({projectDetail?.unitCost})
                          </label>
                          <input
                            type='text'
                            className='form-control'
                            placeholder='Chi phí thoả hiệp'
                            value={editTask.estimateMaxCost}
                            onChange={handleChangeBudget}
                            onFocus={() => {
                              setState({
                                ...state,
                                editTask: {
                                  ...state.editTask,
                                  estimateMaxCost: String(editTask.estimateMaxCost).replace(/,/g, '')
                                }
                              })
                            }}
                            onBlur={() => {
                              setState({
                                ...state,
                                editTask: {
                                  ...state.editTask,
                                  estimateMaxCost: numberWithCommas(editTask.estimateMaxCost)
                                }
                              })
                            }}
                          />
                          <ErrorLabel content={editTask.errorOnBudget} />
                        </div>
                      </div>
                    </fieldset>
                  )}
              </div>

              <div className={`col-sm-8 col-md-8 col-xs-12`}>
                {/* Thời gian */}
                <fieldset className='scheduler-border'>
                  <legend className='scheduler-border'>Ước lượng thời gian</legend>
                  {/* Ngày bắt đầu công việc + Thời gian ước lượng công việc */}
                  <div className='row form-group'>
                    <div className={`col-lg-3 col-md-3 col-ms-12 col-xs-12 ${editTask.errorOnStartDate === undefined ? '' : 'has-error'}`}>
                      <label className='control-label'>
                        Thời điểm bắt đầu<span className='text-red'>*</span>
                      </label>
                      <DatePicker
                        id={`datepicker1-modal-request-${id}-${props.id}`}
                        dateFormat='day-month-year'
                        value={editTask.startDate}
                        onChange={handleChangeTaskStartDate}
                      />
                      <TimePicker
                        ref={timePickerRef}
                        id={`time-picker-1-modal-request-${id}-${props.id}`}
                        value={startTime}
                        onChange={handleStartTimeChange}
                      />
                      <ErrorLabel content={editTask.errorOnStartDate} />
                    </div>
                    <div className={`col-lg-3 col-md-3 col-ms-12 col-xs-12 ${editTask.errorOnTimeEst === undefined ? '' : 'has-error'}`}>
                      <label className='control-label'>
                        Thời gian ước lượng ({translate(`project.unit.${projectDetail?.unitTime}`)})<span className='text-red'>*</span>
                      </label>
                      <input
                        type='text'
                        className='form-control'
                        value={estimateNormalTime}
                        onChange={(e) => {
                          handleChangeEstTimeTask(e.target.value, 'estimateNormalTime')
                        }}
                      />
                      <ErrorLabel content={editTask.errorOnTimeEst} />
                    </div>
                    <div className={`col-lg-3 col-md-3 col-ms-12 col-xs-12 ${editTask.errorOnMaxTimeEst === undefined ? '' : 'has-error'}`}>
                      <label className='control-label'>
                        Thời gian thoả hiệp ({translate(`project.unit.${projectDetail?.unitTime}`)})<span className='text-red'>*</span>
                      </label>
                      <input
                        type='text'
                        className='form-control'
                        value={estimateOptimisticTime}
                        onChange={(e) => {
                          handleChangeEstTimeTask(e.target.value, 'estimateOptimisticTime')
                        }}
                      />
                      <ErrorLabel content={editTask.errorOnMaxTimeEst} />
                    </div>
                    {/* Thời điểm kết thúc công việc */}
                    <div className='row form-group'>
                      <div className={`col-lg-3 col-md-3 col-ms-12 col-xs-12 ${editTask.errorOnEndDate === undefined ? '' : 'has-error'}`}>
                        <label className='control-label'>Thời điểm kết thúc</label>
                        <div>{state.editTask.endDate && state.editTask.estimateNormalTime && `${state.editTask.endDate} ${endTime}`}</div>
                        <ErrorLabel content={editTask.errorOnEndDate} />
                      </div>
                    </div>
                  </div>
                </fieldset>

                {/* Phân định trách nhiệm công việc */}
                <fieldset className='scheduler-border'>
                  <legend className='scheduler-border'>{translate('task.task_management.add_raci')} (RACI)</legend>
                  <div className='row form-group'>
                    {/* Những người thực hiện công việc */}
                    <div
                      className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 ${editTask.errorOnResponsibleEmployees === undefined ? '' : 'has-error'}`}
                    >
                      <label className='control-label'>
                        {translate('task.task_management.responsible')}
                        <span className='text-red'>*</span>
                      </label>
                      {getProjectParticipants(projectDetail) && (
                        <SelectBox
                          id={`responsible-select-box${editTask.taskTemplate}-${id}`}
                          className='form-control select2'
                          style={{ width: '100%' }}
                          items={getProjectParticipants(projectDetail)}
                          onChange={handleChangeTaskResponsibleEmployees}
                          value={editTask.responsibleEmployees}
                          multiple={true}
                          options={{ placeholder: translate('task.task_management.add_resp') }}
                        />
                      )}
                      <ErrorLabel content={editTask.errorOnResponsibleEmployees} />
                    </div>
                    {/* Những người quản lý/phê duyệt công việc */}
                    <div
                      className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 ${editTask.errorOnAccountableEmployees === undefined ? '' : 'has-error'}`}
                    >
                      <label className='control-label'>
                        {translate('task.task_management.accountable')}
                        <span className='text-red'>*</span>
                      </label>
                      {getProjectParticipants(projectDetail) && (
                        <SelectBox
                          id={`accounatable-select-box${editTask.taskTemplate}-${id}`}
                          className='form-control select2'
                          style={{ width: '100%' }}
                          items={getProjectParticipants(projectDetail)}
                          onChange={handleChangeTaskAccountableEmployees}
                          value={editTask.accountableEmployees}
                          multiple={true}
                          options={{ placeholder: translate('task.task_management.add_acc') }}
                        />
                      )}
                      <ErrorLabel content={editTask.errorOnAccountableEmployees} />
                    </div>
                  </div>
                </fieldset>

                {/* Trọng số thành viên viên công việc */}
                <fieldset className='scheduler-border' style={{ lineHeight: 1.5 }}>
                  <legend className='scheduler-border'>Trọng số thành viên viên công việc</legend>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <h4 style={{ width: '50%' }}>
                      <strong>Thành viên thực hiện (%)</strong>
                    </h4>
                    <div
                      className={`col-md-12 ${editTask.errorOnTotalWeight === undefined ? '' : 'has-error'}`}
                      style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
                    >
                      <input
                        type='text'
                        className='form-control'
                        onChange={handleChangeTotalResWeight}
                        value={totalResWeight}
                        style={{ width: '20%' }}
                      />
                      <ErrorLabel content={editTask.errorOnTotalWeight} />
                    </div>
                  </div>
                  <table id='res-emp-weight-table' className='table table-bordered table-hover'>
                    <thead>
                      <tr>
                        <th>Họ và tên</th>
                        <th>Trọng số (%)</th>
                        <th>Lương tháng (VND)</th>
                        <th>Ước lượng chi phí thành viên (VND)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {responsibleEmployees &&
                        responsibleEmployees.length !== 0 &&
                        currentResWeightArr &&
                        currentResWeightArr.length !== 0 &&
                        responsibleEmployees.map((resItem, resIndex) => (
                          <tr key={resIndex}>
                            <td>{convertUserIdToUserName(listUsers, resItem)}</td>
                            <td>{currentResWeightArr?.[resIndex]?.weight}</td>
                            <td>{numberWithCommas(getSalaryFromUserId(projectDetail?.responsibleEmployeesWithUnit, resItem))}</td>
                            <td>
                              {estimateNormalTime &&
                                numberWithCommas(
                                  getEstimateMemberCost(
                                    projectDetail,
                                    resItem,
                                    Number(estimateNormalTime),
                                    projectDetail?.unitTime,
                                    Number(currentResWeightArr?.[resIndex]?.weight)
                                  )
                                )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <h4 style={{ width: '50%' }}>
                      <strong>Thành viên phê duyệt (%)</strong>
                    </h4>
                    <div
                      className={`col-md-12 ${editTask.errorOnTotalWeight === undefined ? '' : 'has-error'}`}
                      style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
                    >
                      <input
                        type='text'
                        className='form-control'
                        onChange={handleChangeTotalAccWeight}
                        value={totalAccWeight}
                        style={{ width: '20%' }}
                      />
                      <ErrorLabel content={editTask.errorOnTotalWeight} />
                    </div>
                  </div>
                  <table id='res-emp-weight-table' className='table table-bordered table-hover'>
                    <thead>
                      <tr>
                        <th>Họ và tên</th>
                        <th>Trọng số (%)</th>
                        <th>Lương tháng (VND)</th>
                        <th>Ước lượng chi phí thành viên (VND)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accountableEmployees &&
                        accountableEmployees.length !== 0 &&
                        currentAccWeightArr &&
                        currentAccWeightArr.length !== 0 &&
                        accountableEmployees.map((accItem, accIndex) => (
                          <tr key={accIndex}>
                            <td>{convertUserIdToUserName(listUsers, accItem)}</td>
                            <td>{currentAccWeightArr?.[accIndex]?.weight}</td>
                            <td>{numberWithCommas(getSalaryFromUserId(projectDetail?.responsibleEmployeesWithUnit, accItem))}</td>
                            <td>
                              {estimateNormalTime &&
                                numberWithCommas(
                                  getEstimateMemberCost(
                                    projectDetail,
                                    accItem,
                                    Number(estimateNormalTime),
                                    projectDetail?.unitTime,
                                    Number(currentAccWeightArr?.[accIndex]?.weight)
                                  )
                                )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </fieldset>
              </div>
            </div>
          )}
        </div>
      </DialogModal>
    </React.Fragment>
  )
}

function mapState(state) {
  const { tasks, user, project, projectPhase } = state
  return { tasks, user, project, projectPhase }
}
const mapDispatchToProps = {
  getProjectsDispatch: ProjectActions.getProjectsDispatch,
  deleteProjectDispatch: ProjectActions.deleteProjectDispatch,
  getListProjectChangeRequestsDispatch: ChangeRequestActions.getListProjectChangeRequestsDispatch,
  getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
  getTasksByProject: taskManagementActions.getTasksByProject,
  showInfoRole: RoleActions.show,
  createProjectChangeRequestDispatch: ChangeRequestActions.createProjectChangeRequestDispatch
}

const modalRequestEditProjectTaskEmployee = connect(mapState, mapDispatchToProps)(withTranslate(ModalRequestEditProjectTaskEmployee))
export { modalRequestEditProjectTaskEmployee as ModalRequestEditProjectTaskEmployee }
