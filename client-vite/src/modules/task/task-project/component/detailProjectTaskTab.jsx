import React, { Component } from 'react'
import { connect } from 'react-redux'

import { withTranslate } from 'react-redux-multilingual'
import moment from 'moment'
import Swal from 'sweetalert2'
import parse from 'html-react-parser'
import dayjs from 'dayjs'
import { performTaskAction } from '../../task-perform/redux/actions'
import { taskManagementActions } from '../../task-management/redux/actions'
import { UserActions } from '../../../super-admin/user/redux/actions'
import { RoleActions } from '../../../super-admin/role/redux/actions'

import { HoursSpentOfEmployeeChart } from '../../task-perform/component/hourSpentOfEmployeeChart'
import { CollaboratedWithOrganizationalUnits } from '../../task-perform/component/collaboratedWithOrganizationalUnits'

import { ModalEditTaskByResponsibleEmployeeProject } from './modalEditTaskByResponsibleEmployeeProject'
import { ModalEditTaskByAccountableEmployeeProject } from './modalEditTaskByAccountableEmployeeProject'
import { getStorage } from '../../../../config'
import { SelectFollowingTaskModal } from '../../task-perform/component/selectFollowingTaskModal'
import getEmployeeSelectBoxItems from '../../organizationalUnitHelper'
import { ShowMoreShowLess } from '../../../../common-components'

import { TaskAddModal } from '../../task-management/component/taskAddModal'
import ModalAddTaskTemplate from '../../task-template/component/addTaskTemplateModal'

import { ProjectActions } from '../../../project/projects/redux/actions'
import { ProjectPhaseActions } from '../../../project/project-phase/redux/actions'
import { ROOT_ROLE } from '../../../../helpers/constants'
import { RequestToCloseProjectTaskModal } from './requestToCloseProjectTaskModal'
import { ModalRequestEditProjectTaskEmployee } from './modalRequestEditProjectTaskEmployee'
import { checkIfAbleToCRUDProject, getCurrentProjectDetails } from '../../../project/projects/components/functionHelper'
import { ModalRequestChangeStatusProjectTask } from './modalRequestChangeStatusProjectTask'

class DetailProjectTaskTab extends Component {
  constructor(props) {
    super(props)

    const { translate } = this.props
    const idUser = getStorage('userId')
    const currentRole = getStorage('currentRole')

    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth()

    this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 }

    this.ROLE = {
      RESPONSIBLE: { name: translate('task.task_management.responsible'), value: 'responsible' },
      ACCOUNTABLE: { name: translate('task.task_management.accountable'), value: 'accountable' },
      CONSULTED: { name: translate('task.task_management.consulted'), value: 'consulted' },
      CREATOR: { name: translate('task.task_management.creator'), value: 'creator' },
      INFORMED: { name: translate('task.task_management.informed'), value: 'informed' },
      PROJECT_MANAGER: { name: 'Người quản lý dự án', value: 'accountable' }
    }

    this.EMPLOYEE_SELECT_BOX = []

    this.state = {
      collapseInfo: false,
      openTimeCounnt: false,
      startTimer: false,
      pauseTimer: false,
      highestIndex: 0,
      currentUser: idUser,
      currentRole,
      dataStatus: this.DATA_STATUS.NOT_AVAILABLE,
      showMore: {},

      currentMonth: `${currentYear}-${currentMonth + 1}`,
      nextMonth: currentMonth > 10 ? `${currentYear + 1}-${currentMonth - 10}` : `${currentYear}-${currentMonth + 2}`,
      dueForEvaluationOfTask: `${currentYear}-${currentMonth + 1}-${7}`
    }

    this.props.getAllUserInAllUnitsOfCompany()
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.id !== this.state.id) {
      this.setState((state) => {
        return {
          ...state,
          id: nextProps.id,
          dataStatus: this.DATA_STATUS.QUERYING,
          editCollaboratedTask: false
        }
      })

      return true
    }

    if (this.state.dataStatus === this.DATA_STATUS.QUERYING) {
      if (!nextProps.user.usersInUnitsOfCompany) return false
      if (!nextProps.tasks.task) {
        return false
      }
      // Dữ liệu đã về
      const { task } = nextProps

      if (task && task.organizationalUnit) this.props.getChildrenOfOrganizationalUnits(task.organizationalUnit._id)

      const roles = []
      if (task) {
        const userId = getStorage('userId')
        let tmp = task.responsibleEmployees.find((item) => item._id === userId)
        if (tmp) {
          roles.push(this.ROLE.RESPONSIBLE)
        }

        tmp = task.accountableEmployees && task.accountableEmployees.find((item) => item._id === userId)
        if (tmp) {
          roles.push(this.ROLE.ACCOUNTABLE)
        }

        tmp = task.consultedEmployees && task.consultedEmployees.find((item) => item._id === userId)
        if (tmp) {
          roles.push(this.ROLE.CONSULTED)
        }

        tmp = task.informedEmployees && task.informedEmployees.find((item) => item._id === userId)
        if (tmp) {
          roles.push(this.ROLE.INFORMED)
        }

        if (
          checkIfAbleToCRUDProject({
            project: this.props.project,
            user: this.props.user,
            currentProjectId: task.taskProject,
            isInsideProject: true
          })
        ) {
          roles.push(this.ROLE.PROJECT_MANAGER)
        }

        if (userId === task.creator._id) {
          roles.push(this.ROLE.CREATOR)
        }
      }

      let currentRole
      if (roles.length > 0) {
        currentRole = roles[0].value
        if (this.props.onChangeTaskRole) {
          this.props.onChangeTaskRole(currentRole)
        }
      }

      this.setState((state) => {
        return {
          ...state,
          dataStatus: this.DATA_STATUS.FINISHED,
          roles,
          currentRole: roles.length > 0 ? roles[0].value : null
        }
      })
      return false
    }
    return true
  }

  componentDidMount() {
    const { currentRole } = this.state
    console.log('this.props.task', this.props.task)
    // this.props.getProjectsDispatch({ calledId: "" });
    this.props.showInfoRole(currentRole)
    this.props.getAllTasksByProject(this.props.task?.taskProject)
    this.props.getAllPhaseByProject(this.props.task?.taskProject)

    this.props.getProjectsDispatch({ calledId: 'user_all', userId: getStorage('userId') })
  }

  handleChangeCollapseInfo = async () => {
    await this.setState((state) => {
      return {
        ...state,
        collapseInfo: !state.collapseInfo
      }
    })
  }

  handleChangeShowMoreEvalItem = async (id) => {
    await this.setState((state) => {
      state.showMore[id] = !state.showMore[id]
      return {
        ...state
      }
    })
  }

  startTimer = async (taskId, overrideTSLog = 'no') => {
    const userId = getStorage('userId')
    const timer = {
      creator: userId,
      overrideTSLog
    }
    this.props.startTimer(taskId, timer).catch((err) => {
      const warning = Array.isArray(err.response.data.messages) ? err.response.data.messages : [err.response.data.messages]
      if (warning[0] === 'time_overlapping') {
        Swal.fire({
          title: `Bạn đã hẹn tắt bấm giờ cho công việc [ ${warning[1]} ]`,
          html: `<h4 class="text-red">Lưu lại những giờ đã bấm được cho công việc [ ${warning[1]} ] và bấm giờ công việc mới</h4>`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Bấm giờ mới',
          cancelButtonText: 'Hủy'
        }).then((result) => {
          if (result.isConfirmed) {
            const timer = {
              creator: userId,
              overrideTSLog: 'yes'
            }
            this.props.startTimer(taskId, timer)
          }
        })
      }
    })
  }

  formatPriority = (data) => {
    const { translate } = this.props
    if (data === 1) return translate('task.task_management.low')
    if (data === 2) return translate('task.task_management.average')
    if (data === 3) return translate('task.task_management.standard')
    if (data === 4) return translate('task.task_management.high')
    if (data === 5) return translate('task.task_management.urgent')
  }

  formatStatus = (data) => {
    const { translate } = this.props
    if (data === 'inprocess') return translate('task.task_management.inprocess')
    if (data === 'wait_for_approval') return translate('task.task_management.wait_for_approval')
    if (data === 'finished') return translate('task.task_management.finished')
    if (data === 'delayed') return translate('task.task_management.delayed')
    if (data === 'canceled') return translate('task.task_management.canceled')
  }

  // convert ISODate to String dd-mm-yyyy
  formatDate(date) {
    const d = new Date(date)
    let month = `${d.getMonth() + 1}`
    let day = `${d.getDate()}`
    const year = d.getFullYear()

    if (month.length < 2) month = `0${month}`
    if (day.length < 2) day = `0${day}`

    return [day, month, year].join('-')
  }

  handleShowEdit = async (id, role, checkHasAccountable) => {
    await this.setState((state) => {
      return {
        ...state,
        showEdit: id
      }
    })

    let modalId = `#modal-edit-project-task-by-${role}-${id}`
    if (checkHasAccountable === false && role === 'responsible') {
      modalId = `#modal-edit-project-task-by-${role}-${id}-has-not-accountable`
    }
    window.$(modalId).modal('show')
  }

  handleShowRequestCloseTask = async (id) => {
    await this.setState((state) => {
      return {
        ...state,
        showRequestClose: id
      }
    })

    const modalId = `#modal-request-close-task-${id}`
    window.$(modalId).modal('show')
  }

  handleOpenTaskAgain = (id) => {
    const { translate } = this.props

    Swal.fire({
      title: translate('task.task_management.confirm_open_task'),
      type: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
    }).then((res) => {
      if (res.value) {
        this.props.openTaskAgain(id)
      }
    })
  }

  handleEndTask = async (id, status, codeInProcess, typeOfTask) => {
    await this.setState((state) => {
      return {
        ...state,
        showEndTask: id
      }
    })

    window.$(`#modal-select-following-task`).modal('show')
  }

  handleShowEvaluate = async (id, role) => {
    await this.setState((state) => {
      return {
        ...state,
        showEvaluate: id
      }
    })
    // window.$(`#modal-evaluate-task-by-${role}-${id}-evaluate`).modal('show');
    window.$(`#task-project-evaluation-modal-${id}-`).modal('show')
  }

  handleCopyTask = (id, role) => {
    this.setState((state) => {
      return {
        ...state,
        showCopy: `copy-task-${id}`
      }
    })
    window.$(`#addNewTask-copy-task-${id}`).modal('show')
  }

  handleSaveAsTemplate = async (id, role) => {
    await this.setState((state) => {
      return {
        ...state,
        showSaveAsTemplate: id
      }
    })
    window.$(`#modal-add-task-template-${id}`).modal('show')
  }

  refresh = async () => {
    this.props.getTaskById(this.state.id)
    this.props.getSubTask(this.state.id)
    this.props.getTimesheetLogs(this.state.id)
    this.props.getTaskLog(this.state.id)
    await this.setState((state) => {
      return {
        ...state,
        showEdit: undefined,
        showEndTask: undefined,
        showEvaluate: undefined,
        dataStatus: this.DATA_STATUS.QUERYING
      }
    })
  }

  changeRole = (role) => {
    this.setState((state) => {
      return {
        ...state,
        currentRole: role
      }
    })
    this.props.onChangeTaskRole(role)
  }

  confirmTask = (task) => {
    if (task) {
      this.props.confirmTask(task._id)
    }
  }

  /** Kiểm tra nhân viên chưa xác nhận công việc */
  checkConfirmTask = (task) => {
    const { currentUser } = this.state

    let checkConfirmOtherUser = false
    let checkConfirmCurrentUser = false
    let listEmployee
    let listEmployeeNotConfirm = []
    let confirmedByEmployeesId
    let listEmployeeId

    if (task && task.responsibleEmployees && task.accountableEmployees && task.consultedEmployees && task.confirmedByEmployees) {
      listEmployee = task.responsibleEmployees.concat(task.accountableEmployees).concat(task.consultedEmployees)
      confirmedByEmployeesId = task.confirmedByEmployees.map((item) => item._id)
      listEmployeeId = listEmployee.map((item) => item._id)

      listEmployeeNotConfirm = listEmployee.filter((item) => {
        if (!confirmedByEmployeesId.includes(item._id)) {
          return true
        }
      })
      // Lọc các phần tử trùng lặp
      let idArray = listEmployeeNotConfirm.map((item) => item._id)
      idArray = idArray.map((item, index, array) => {
        if (array.indexOf(item) === index) {
          return index
        }
        return false
      })
      idArray = idArray.filter((item) => listEmployeeNotConfirm[item])
      listEmployeeNotConfirm = idArray.map((item) => {
        return listEmployeeNotConfirm[item]
      })

      if (listEmployeeId.includes(currentUser) && !confirmedByEmployeesId.includes(currentUser)) {
        checkConfirmCurrentUser = true
      }
    }

    if (listEmployeeNotConfirm.length !== 0) {
      checkConfirmOtherUser = true
    }

    listEmployeeNotConfirm = listEmployeeNotConfirm.filter((item) => item.active)

    return {
      listEmployeeNotConfirm,
      checkConfirmCurrentUser,
      checkConfirmOtherUser,
      checkConfirm: checkConfirmOtherUser || checkConfirmCurrentUser
    }
  }

  /** Kiểm tra hoạt động chưa có đánh giá */
  checkEvaluationTaskAction = (task) => {
    if (task) {
      const { taskActions } = task
      if (taskActions) {
        const rated = taskActions.filter((task) => task.rating === -1)
        return {
          checkEvaluationTaskAction: rated.length !== 0,
          numberOfTaskActionNotEvaluate: rated.length
        }
      }
    }
    return {
      checkEvaluationTaskAction: false
    }
  }

  /** Kiểm tra nhân viên chưa liên kết KPI */
  checkEvaluationTaskAndKpiLink = (task) => {
    const { currentMonth, nextMonth } = this.state

    let evaluations = []
    let checkEvaluationTask = false
    let listEmployeeNotKpiLink = []
    let responsibleEmployeesNotKpiLink = []
    let accountableEmployeesNotKpiLink = []
    let consultedEmployeesNotKpiLink = []

    if (task && task.evaluations) {
      evaluations = task.evaluations.filter(
        (item) => new Date(item.evaluatingMonth) >= new Date(currentMonth) && new Date(item.evaluatingMonth) < new Date(nextMonth)
      )

      if (evaluations.length === 0) {
        // Check đánh giá trong tháng
        checkEvaluationTask = true
      } else {
        // Nhân viên chưa liên kết KPI
        if (evaluations[0].results && evaluations[0].results.length !== 0) {
          if (task.responsibleEmployees) {
            responsibleEmployeesNotKpiLink = task.responsibleEmployees.filter((item) => {
              for (let i = 0; i < evaluations[0].results.length; i++) {
                if (
                  evaluations[0].results[i].employee &&
                  item._id === evaluations[0].results[i].employee._id &&
                  evaluations[0].results[i].role === 'responsible'
                ) {
                  if (evaluations[0].results[i].kpis && evaluations[0].results[i].kpis.length !== 0) {
                    return false
                  }
                }
              }
              return true
            })
          }
          if (task.accountableEmployees) {
            accountableEmployeesNotKpiLink = task.accountableEmployees.filter((item) => {
              for (let i = 0; i < evaluations[0].results.length; i++) {
                if (
                  evaluations[0].results[i].employee &&
                  item._id === evaluations[0].results[i].employee._id &&
                  evaluations[0].results[i].role === 'accountable'
                ) {
                  if (evaluations[0].results[i].kpis && evaluations[0].results[i].kpis.length !== 0) {
                    return false
                  }
                }
              }
              return true
            })
          }
          if (task.consultedEmployees) {
            consultedEmployeesNotKpiLink = task.consultedEmployees.filter((item) => {
              for (let i = 0; i < evaluations[0].results.length; i++) {
                if (
                  evaluations[0].results[i].employee &&
                  item._id === evaluations[0].results[i].employee._id &&
                  evaluations[0].results[i].role === 'consulted'
                ) {
                  if (evaluations[0].results[i].kpis && evaluations[0].results[i].kpis.length !== 0) {
                    return false
                  }
                }
              }
              return true
            })
          }

          listEmployeeNotKpiLink = responsibleEmployeesNotKpiLink
            .concat(accountableEmployeesNotKpiLink)
            .concat(consultedEmployeesNotKpiLink)
        }
      }
    }

    // Loc phần tử lặp
    let idArray = listEmployeeNotKpiLink.map((item) => item._id)
    idArray = idArray.map((item, index, array) => {
      if (array.indexOf(item) === index) {
        return index
      }
      return false
    })
    idArray = idArray.filter((item) => listEmployeeNotKpiLink[item])
    listEmployeeNotKpiLink = idArray.map((item) => {
      return listEmployeeNotKpiLink[item]
    })
    listEmployeeNotKpiLink = listEmployeeNotKpiLink.filter((item) => item.active)

    return {
      checkEvaluationTask,
      checkKpiLink: listEmployeeNotKpiLink.length !== 0,
      listEmployeeNotKpiLink
    }
  }

  /** Kiểm tra thời hạn đánh giá */
  checkDeadlineForEvaluation = (task) => {
    const { dueForEvaluationOfTask, currentMonth } = this.state

    let checkDeadlineForEvaluation = false
    let deadlineForEvaluation
    let evaluations
    const currentDate = new Date()
    const lastMonth = `${currentDate.getFullYear()}-${currentDate.getMonth()}`

    if (task && task.evaluations) {
      // Check evaluations tháng trước
      evaluations = task.evaluations.filter(
        (item) => new Date(item.evaluatingMonth) >= new Date(lastMonth) && new Date(item.evaluatingMonth) < new Date(currentMonth)
      )

      if (evaluations.length !== 0) {
        // Check số ngày đến hạn đánh giá
        deadlineForEvaluation = (new Date(dueForEvaluationOfTask).getTime() - currentDate.getTime()) / (3600 * 24 * 1000)
        if (deadlineForEvaluation > 0) {
          checkDeadlineForEvaluation = true

          if (deadlineForEvaluation < 1) {
            if (deadlineForEvaluation * 24 < 1) {
              deadlineForEvaluation = `${Math.floor(deadlineForEvaluation * 24 * 60)} ${this.props.translate('task.task_management.warning_minutes')}`
            } else {
              deadlineForEvaluation = `${Math.floor(deadlineForEvaluation * 24)} ${this.props.translate('task.task_management.warning_hours')}`
            }
          } else {
            deadlineForEvaluation = `${Math.floor(deadlineForEvaluation)} ${this.props.translate('task.task_management.warning_days')}`
          }
        }
      }
    }

    return {
      checkDeadlineForEvaluation,
      deadlineForEvaluation
    }
  }

  /** Kiểm tra đơn vị chưa xác nhận phân công công việc */
  checkConfirmAssginOfOrganizationalUnit = (task) => {
    const unitHasNotConfirm = []

    if (task && task.collaboratedWithOrganizationalUnits) {
      if (task.collaboratedWithOrganizationalUnits.length !== 0) {
        task.collaboratedWithOrganizationalUnits.map((item) => {
          if (!item.isAssigned) {
            unitHasNotConfirm.push(item.organizationalUnit && item.organizationalUnit.name)
          }
        })
      }
    }

    return {
      checkConfirm: unitHasNotConfirm.length !== 0,
      unitHasNotConfirm
    }
  }

  calculateHoursSpentOnTask = async (taskId, timesheetLogs, month, evaluate, startDate, endDate) => {
    let results = evaluate && evaluate.results
    results.map((item) => {
      item.hoursSpent = 0
    })

    for (const i in timesheetLogs) {
      const log = timesheetLogs[i]
      const startedAt = new Date(log.startedAt)
      const stoppedAt = new Date(log.stoppedAt)

      if (startedAt.getTime() >= new Date(startDate).getTime() && stoppedAt.getTime() <= new Date(endDate).getTime()) {
        const { creator, duration } = log
        let check = true
        let newResults = []

        newResults = results.map((item) => {
          if (item.employee && creator._id === item.employee._id) {
            check = false
            return {
              ...item,
              employee: item.employee._id,
              hoursSpent: duration + item.hoursSpent
            }
          }
          return item
        })

        if (check) {
          const employeeHoursSpent = {
            employee: creator,
            hoursSpent: duration
          }

          newResults.push(employeeHoursSpent)
        }

        results = [...newResults]
      }
    }

    const data = {
      evaluateId: evaluate._id,
      timesheetLogs: results.map((item) => {
        return {
          employee: item.employee && item.employee,
          hoursSpent: item.hoursSpent
        }
      })
    }

    await this.props.editHoursSpentInEvaluate(data, taskId)
  }

  getTaskActionsNotPerform = (taskActions) => {
    return taskActions.filter((action) => !action.creator).length
  }

  /**
   * Kiểm tra role hiện tại có phải trưởng đơn vị ko
   * Nếu có, tạo SelectBox tất cả nhân viên của đơn vị
   * Ngược lại, trả về mảng rỗng
   */
  setSelectBoxOfUserSameDepartmentCollaborated = (task) => {
    const { user } = this.props
    const { currentUser } = this.state
    let usersInUnitsOfCompany
    let unitThatCurrentUserIsManager
    let employeeSelectBox = []

    if (user) {
      usersInUnitsOfCompany = user.usersInUnitsOfCompany
    }

    if (usersInUnitsOfCompany && usersInUnitsOfCompany.length !== 0) {
      unitThatCurrentUserIsManager = usersInUnitsOfCompany.filter((unit) => {
        let check = false
        const unitCollaborated =
          task?.collaboratedWithOrganizationalUnits?.length > 0 &&
          task.collaboratedWithOrganizationalUnits.map((item) => item.organizationalUnit && item.organizationalUnit?._id)

        if (unitCollaborated?.length > 0 && unitCollaborated.includes(unit.id) && unit.managers) {
          const employee = Object.values(unit.managers)
          if (employee && employee.length !== 0) {
            employee.map((employee) => {
              employee.members &&
                employee.members.map((item) => {
                  if (item._id == currentUser) check = true
                })
            })
          }
        }

        return check
      })
    }

    if (unitThatCurrentUserIsManager && unitThatCurrentUserIsManager.length !== 0) {
      unitThatCurrentUserIsManager.map((item) => {
        let temporary = []
        temporary = getEmployeeSelectBoxItems([item])
        temporary[0] = {
          ...temporary[0],
          id: item.id
        }
        employeeSelectBox = employeeSelectBox.concat(temporary[0])
      })
    }

    // employeeSelectBox rỗng = user hiện tại không phải trưởng đơn vị các đơn vị phối hợp
    return employeeSelectBox
  }

  remindEvaluateTaskOnThisMonth = (task) => {
    const startDate = new Date(task?.startDate)
    const endDate = new Date(task?.endDate)

    const endOfMonth = new moment().endOf('month').toDate()
    const today = new Date()
    let check

    // kiểm tra đánh giá tháng hiện tại
    const denta = Math.abs(endOfMonth.getTime() - today.getTime())
    const dentaDate = denta / (24 * 60 * 60 * 1000)

    if (dentaDate <= 7) {
      check = true
    }
    return check
  }

  /** sắp xếp đánh giá theo thứ tự tháng */
  handleSortMonthEval = (evaluations) => {
    const sortedEvaluations = evaluations.sort((a, b) => new Date(b.evaluatingMonth) - new Date(a.evaluatingMonth))
    return sortedEvaluations
  }

  // convert ISODate to String hh:mm AM/PM
  formatTime(date) {
    return dayjs(date).format('DD-MM-YYYY hh:mm A')
  }

  handleShowChangeRequestEditTask = (id) => {
    this.setState((state) => {
      return {
        ...state,
        showEdit: id
      }
    })
    setTimeout(() => {
      window.$(`#modal-request-edit-project-task-accountable-${id}`).modal('show')
    }, 10)
  }

  handleShowChangeStatusTask = (id) => {
    setTimeout(() => {
      window.$(`#modal-request-change-currentStatus-project-task-${id}`).modal('show')
    })
  }

  render() {
    const { tasks, performtasks, user, translate, role, project, projectPhase } = this.props
    const { showToolbar, id, isProcess } = this.props // props form parent component ( task, id, showToolbar, onChangeTaskRole() )
    const {
      currentUser,
      roles,
      currentRole,
      collapseInfo,
      showEdit,
      showEndTask,
      showEvaluate,
      showRequestClose,
      showMore,
      showCopy,
      showSaveAsTemplate
    } = this.state

    let task
    const currentProjectTasks = this.props.tasks && this.props.tasks.tasksByProject
    const currentProjectPhase = this.props.projectPhase && this.props.projectPhase.phases
    const currentProjectMilestone = this.props.projectPhase && this.props.projectPhase.milestones
    let codeInProcess
    let typeOfTask
    let statusTask
    let checkInactive = true
    let evaluations
    let evalList = []
    // Các biến dùng trong phần Nhắc Nhở
    let warning = false
    let checkEvaluate
    let checkConfirmTask
    let checkEvaluationTaskAction
    let checkEvaluationTaskAndKpiLink
    let checkDeadlineForEvaluation
    let checkConfirmAssginOfOrganizationalUnit
    // Các biến dùng cho biểu đồ đóng góp thời gian
    let hoursSpentOfEmployeeInTask
    const hoursSpentOfEmployeeInEvaluation = {}
    // Các biến check trưởng đơn vị phối hợp
    let employeeCollaboratedWithUnitSelectBox

    if (isProcess) {
      task = this.props.task
    } else if (Object.entries(performtasks).length > 0) {
      task = performtasks.task
    }

    if (task) {
      codeInProcess = task.codeInProcess
      if (codeInProcess) {
        const splitter = codeInProcess.split('_')
        typeOfTask = splitter[0]
      }
    }

    // kiểm tra công việc chỉ có người thực hiện
    let checkHasAccountable = true
    if (task && task.accountableEmployees && task.accountableEmployees.length === 0) {
      checkHasAccountable = false
    }

    if (task) {
      statusTask = task.status
    }
    if (task) {
      checkInactive = task.inactiveEmployees && task.inactiveEmployees.indexOf(currentUser) === -1
    } // return true if user is active user
    if (task && task.evaluations && task.evaluations.length !== 0) {
      evaluations = task.evaluations // .reverse()
    }

    // thêm giá trị prevDate vào evaluation
    if (evaluations && evaluations.length > 0) {
      for (let i = 0; i < evaluations.length; i++) {
        let prevEval
        const { startDate } = task
        let prevDate = startDate
        const splitter = this.formatDate(evaluations[i].evaluatingMonth).split('-')

        const dateOfEval = new Date(splitter[2], splitter[1] - 1, splitter[0])
        const dateOfPrevEval = new Date(splitter[2], splitter[1] - 1, splitter[0])
        let newMonth = dateOfPrevEval.getMonth() - 1
        if (newMonth < 0) {
          newMonth += 12
          dateOfPrevEval.setYear(dateOfPrevEval.getFullYear() - 1)
        }
        dateOfPrevEval.setDate(15)
        dateOfPrevEval.setMonth(newMonth)

        const monthOfPrevEval = dateOfPrevEval.getMonth()
        const yearOfPrevEval = dateOfPrevEval.getFullYear()

        prevEval = evaluations.find(
          (e) => monthOfPrevEval === new Date(e.evaluatingMonth).getMonth() && yearOfPrevEval === new Date(e.evaluatingMonth).getFullYear()
        )
        if (prevEval) {
          prevDate = prevEval.evaluatingMonth
        } else {
          const strPrevMonth = `${monthOfPrevEval + 1}-${yearOfPrevEval}`
          // trong TH k có đánh giá tháng trước, so sánh tháng trước với tháng start date
          if (
            !(
              (
                (yearOfPrevEval === new Date(startDate).getFullYear() && monthOfPrevEval < new Date(startDate).getMonth()) || // bắt đầu tháng bất kì khác tháng 1
                yearOfPrevEval < new Date(startDate).getFullYear()
              ) // TH bắt đầu là tháng 1 - chọn đánh giá tháng 1
            )
          ) {
            prevDate = moment(strPrevMonth, 'MM-YYYY').endOf('month').toDate()
          }
        }
        evalList.push({ ...evaluations[i], prevDate })
      }
    }

    evalList = this.handleSortMonthEval(evalList)

    // Xử lý dữ liệu phần Nhắc nhở
    checkEvaluate = this.remindEvaluateTaskOnThisMonth(task)
    checkConfirmTask = this.checkConfirmTask(task)
    checkEvaluationTaskAction = this.checkEvaluationTaskAction(task)
    checkEvaluationTaskAndKpiLink = this.checkEvaluationTaskAndKpiLink(task)
    checkDeadlineForEvaluation = this.checkDeadlineForEvaluation(task)
    checkConfirmAssginOfOrganizationalUnit = this.checkConfirmAssginOfOrganizationalUnit(task)
    warning =
      (statusTask === 'inprocess' &&
        ((checkConfirmTask && checkConfirmTask.checkConfirm) ||
          (checkEvaluationTaskAction && checkEvaluationTaskAction.checkEvaluationTaskAction) ||
          (checkDeadlineForEvaluation && checkDeadlineForEvaluation.checkDeadlineForEvaluation) ||
          (checkInactive &&
            codeInProcess &&
            (currentRole === 'accountable' || (currentRole === 'responsible' && checkHasAccountable === false))))) ||
      checkConfirmAssginOfOrganizationalUnit.checkConfirm ||
      (currentRole === 'accountable' && task?.requestToCloseTask?.requestStatus === 1)

    // Xử lý dữ liệu biểu đồ đóng góp thời gian công việc
    if (task && task.hoursSpentOnTask) {
      hoursSpentOfEmployeeInTask = {}
      for (let i = 0; i < task.timesheetLogs.length; i++) {
        const tsheetlog = task.timesheetLogs[i]

        if (tsheetlog && tsheetlog.stoppedAt && tsheetlog.creator) {
          const times = hoursSpentOfEmployeeInTask[tsheetlog.creator.name] ? hoursSpentOfEmployeeInTask[tsheetlog.creator.name] : 0

          if (tsheetlog.acceptLog) {
            hoursSpentOfEmployeeInTask[tsheetlog.creator.name] = times + tsheetlog.duration
          }
        }
      }
    }

    if (task && task.evaluations && task.evaluations.length !== 0) {
      task.evaluations.map((item) => {
        if (item.results && item.results.length !== 0) {
          hoursSpentOfEmployeeInEvaluation[item.evaluatingMonth] = {}

          item.results.map((result) => {
            if (result.employee) {
              if (!hoursSpentOfEmployeeInEvaluation[item.evaluatingMonth][result.employee.name]) {
                if (result.hoursSpent) {
                  hoursSpentOfEmployeeInEvaluation[item.evaluatingMonth][result.employee.name] = Number.parseFloat(result.hoursSpent)
                }
              } else {
                hoursSpentOfEmployeeInEvaluation[item.evaluatingMonth][result.employee.name] =
                  hoursSpentOfEmployeeInEvaluation[item.evaluatingMonth][result.employee.name] + result.hoursSpent
                    ? Number.parseFloat(result.hoursSpent)
                    : 0
              }
            }
          })
        } else {
          hoursSpentOfEmployeeInEvaluation[item.evaluatingMonth] = null
        }
      })
    }

    // Xử lý phần đơn vị phối hợp
    if (task) {
      employeeCollaboratedWithUnitSelectBox = this.setSelectBoxOfUserSameDepartmentCollaborated(task)
    }

    const checkCurrentRoleIsManager =
      role && role.item && role.item.parents.length > 0 && role.item.parents.filter((o) => o.name === ROOT_ROLE.MANAGER)

    const projectDetail = getCurrentProjectDetails(this.props.project, task?.taskProject)

    return (
      <>
        {showToolbar && (
          <div style={{ marginLeft: '-10px' }}>
            <a className='btn btn-app' onClick={this.refresh} title='Refresh'>
              <i className='fa fa-refresh' style={{ fontSize: '16px' }} aria-hidden='true' />
              {translate('task.task_management.detail_refresh')}
            </a>

            {(currentRole === 'responsible' || currentRole === 'accountable') && checkInactive && (
              <a
                className='btn btn-app'
                onClick={() => this.handleShowEdit(id, currentRole, checkHasAccountable)}
                title='Chỉnh sửa thông tin chung'
              >
                <i className='fa fa-edit' style={{ fontSize: '16px' }} />
                {translate('task.task_management.detail_edit')}
              </a>
            )}
            {currentRole === 'accountable' && task && statusTask !== 'finished' && checkHasAccountable && (
              <a className='btn btn-app' onClick={() => this.handleShowChangeRequestEditTask(id)} title='Yêu cầu cập nhật nguồn lực'>
                <i className='fa fa-wrench' style={{ fontSize: '16px' }} />
                Yêu cầu cập nhật nguồn lực
              </a>
            )}
            {task &&
              statusTask !== 'finished' &&
              statusTask !== 'delayed' &&
              statusTask !== 'canceled' &&
              currentRole === 'accountable' &&
              checkInactive &&
              checkHasAccountable && (
                <a className='btn btn-app' onClick={() => this.handleShowChangeStatusTask(id)} title='Yêu cầu hoãn huỷ'>
                  <i className='fa fa-power-off' style={{ fontSize: '16px' }} />
                  Yêu cầu hoãn huỷ
                </a>
              )}
            {performtasks?.task?.status !== 'finished' && (
              <>
                {(currentRole === 'consulted' || currentRole === 'responsible' || currentRole === 'accountable') && checkInactive && (
                  <a
                    className='btn btn-app'
                    onClick={() => !performtasks.currentTimer && this.startTimer(task._id, currentUser)}
                    title='Bắt đầu thực hiện công việc'
                    disabled={performtasks.currentTimer}
                  >
                    <i className='fa fa-clock-o' style={{ fontSize: '16px' }} aria-hidden='true' />
                    {translate('task.task_management.detail_start_timer')}
                  </a>
                )}
              </>
            )}

            {/* {((currentRole === "consulted" || currentRole === "responsible" || currentRole === "accountable") && checkInactive) &&
                            <React.Fragment>
                                <a className="btn btn-app" onClick={() => this.handleShowEvaluate(id, currentRole)} title="Đánh giá theo dự án">
                                    <i className="fa fa-calendar-check-o" style={{ fontSize: "16px" }}></i>Đánh giá theo dự án
                                </a>
                            </React.Fragment>
                        } */}
            {/* {((currentRole === "responsible" || currentRole === "accountable") && checkInactive) &&
                            <React.Fragment>
                                <a className="btn btn-app" onClick={() => this.handleCopyTask(id, currentRole)} title={translate('task.task_management.detail_copy_task')}>
                                    <i className="fa fa-clone" style={{ fontSize: "16px" }}></i>{translate('task.task_management.detail_copy_task')}
                                </a>
                            </React.Fragment>
                        }
                        {((currentRole === "accountable" || currentRole === "responsible") && checkInactive) && checkCurrentRoleIsManager && checkCurrentRoleIsManager.length > 0 &&
                            <React.Fragment>
                                <a className="btn btn-app" onClick={() => this.handleSaveAsTemplate(id, currentRole)} title={translate('task.task_management.detail_save_as_template')}>
                                    <i className="fa fa-floppy-o" style={{ fontSize: "16px" }}></i>{translate('task.task_management.detail_save_as_template')}
                                </a>
                            </React.Fragment>
                        } */}

            {task &&
              statusTask !== 'finished' &&
              (currentRole === 'responsible' || currentRole === 'accountable') &&
              checkInactive &&
              checkHasAccountable && (
                <a className='btn btn-app' onClick={() => this.handleShowRequestCloseTask(id)} title='Đánh giá kết thúc công việc'>
                  <i className='fa fa-calendar-check-o' style={{ fontSize: '16px' }} />
                  Đánh giá kết thúc công việc
                </a>
              )}

            {task && statusTask !== 'inprocess' && statusTask !== 'wait_for_approval' && checkInactive && (
              <a
                className='btn btn-app'
                onClick={() => this.handleOpenTaskAgain(id)}
                title={translate('task.task_perform.open_task_again')}
              >
                <i className='fa fa-rocket' style={{ fontSize: '16px' }} />
                {translate('task.task_perform.open_task_again')}
              </a>
            )}

            {collapseInfo === false ? (
              <a
                className='btn btn-app'
                data-toggle='collapse'
                href='#info'
                onClick={this.handleChangeCollapseInfo}
                role='button'
                aria-expanded='false'
                aria-controls='info'
              >
                <i className='fa fa-info' style={{ fontSize: '16px' }} />
                {translate('task.task_management.detail_hide_info')}
              </a>
            ) : (
              <a
                className='btn btn-app'
                data-toggle='collapse'
                href='#info'
                onClick={this.handleChangeCollapseInfo}
                role='button'
                aria-expanded='false'
                aria-controls='info'
              >
                <i className='fa fa-info' style={{ fontSize: '16px' }} />
                {translate('task.task_management.detail_show_info')}
              </a>
            )}

            {roles && roles.length > 1 && (
              <div className='dropdown' style={{ margin: '10px 0px 0px 10px', display: 'inline-block' }}>
                <a className='btn btn-app' style={{ margin: '-10px 0px 0px 0px' }} data-toggle='dropdown'>
                  <i className='fa fa-user' style={{ fontSize: '16px' }} />
                  {translate('task.task_management.detail_choose_role')}
                </a>
                <ul className='dropdown-menu'>
                  {roles.map((item, index) => {
                    return (
                      <li className={item.value === currentRole ? 'active' : undefined} key={index}>
                        <a onClick={() => this.changeRole(item.value)}>{item.name}</a>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </div>
        )}

        <div>
          <div id='info' className='collapse in'>
            {/* Thông tin chung */}
            {/* Nhắc nhở */}
            {task && warning && (
              <div className='description-box warning'>
                <h4>{translate('task.task_management.warning')}</h4>

                {/* Phê duyệt yêu cầu kết thúc công việc */}
                {currentRole === 'accountable' && task?.requestToCloseTask?.requestStatus === 1 && (
                  <div>
                    <strong>Công việc đang chờ phê duyệt yêu cầu kết thúc:</strong>
                    <a style={{ cursor: 'pointer' }} onClick={() => this.handleShowRequestCloseTask(id)}>
                      Phê duyệt yêu cầu
                    </a>
                  </div>
                )}

                {/* Kích hoạt công việc phía sau trong quy trình */}
                {statusTask === 'inprocess' &&
                  checkInactive &&
                  codeInProcess &&
                  (currentRole === 'accountable' || (currentRole === 'responsible' && checkHasAccountable === false)) && (
                    <div>
                      <strong>{translate('task.task_perform.is_task_process')}:</strong>
                      <a style={{ cursor: 'pointer' }} onClick={() => this.handleEndTask(id, 'inprocess', codeInProcess, typeOfTask)}>
                        {translate('task.task_perform.following_task')}
                      </a>
                    </div>
                  )}

                {/* Số hoạt động chưa thực hiện */}
                {this.getTaskActionsNotPerform(task.taskActions) > 0 && (
                  <div>
                    <strong>{translate('task.task_perform.actions_not_perform')}</strong>
                    <span className='text-red'>{this.getTaskActionsNotPerform(task.taskActions)}</span>
                  </div>
                )}

                {/* Xác nhận công việc */}
                {checkConfirmTask && checkConfirmTask.checkConfirmCurrentUser && (
                  <div>
                    <strong>
                      {translate('task.task_management.you_need')}{' '}
                      <a style={{ cursor: 'pointer' }} onClick={() => this.confirmTask(task)}>
                        {translate('task.task_management.confirm_task')}
                      </a>
                    </strong>
                  </div>
                )}
                {checkConfirmTask && checkConfirmTask.checkConfirmOtherUser && (
                  <div>
                    <strong>{translate('task.task_management.not_confirm')}:</strong>
                    {checkConfirmTask.listEmployeeNotConfirm.length !== 0 &&
                      checkConfirmTask.listEmployeeNotConfirm.map((item, index) => {
                        const seperator = index !== 0 ? ', ' : ''
                        return (
                          <span key={index}>
                            {seperator}
                            {item.name}
                          </span>
                        )
                      })}
                  </div>
                )}

                {/* Chưa có đánh giá */}
                {/* {
                                    task.status === "inprocess" && checkEvaluationTaskAndKpiLink && checkEvaluationTaskAndKpiLink.checkEvaluationTask
                                    && <div><strong>{translate('task.task_management.not_have_evaluation')}</strong></div>
                                } */}

                {/* Nhắc nhở đánh giá */}
                {/* {
                                    task.status === "inprocess" && checkEvaluationTaskAndKpiLink && checkEvaluationTaskAndKpiLink.checkEvaluationTask && checkEvaluate
                                    && <div><strong>{translate("task.task_management.warning_evaluate")}</strong></div>
                                } */}

                {/* Chưa liên kết KPI */}
                {/* {
                                    task.status === "inprocess" && checkEvaluationTaskAndKpiLink && checkEvaluationTaskAndKpiLink.checkKpiLink
                                    && <div>
                                        <strong>{translate('task.task_management.detail_not_kpi')}:</strong>
                                        {
                                            checkEvaluationTaskAndKpiLink.listEmployeeNotKpiLink.length !== 0
                                            && checkEvaluationTaskAndKpiLink.listEmployeeNotKpiLink.map((item, index) => {
                                                let seperator = index !== 0 ? ", " : "";
                                                return <span key={index}>{seperator}{item.name}</span>
                                            })
                                        }
                                    </div>
                                } */}

                {/* Chưa đánh giá hoạt động */}
                {checkEvaluationTaskAction && checkEvaluationTaskAction.checkEvaluationTaskAction && (
                  <div>
                    <strong>{translate('task.task_management.action_not_rating')}:</strong>
                    <span style={{ color: 'red' }}>{checkEvaluationTaskAction.numberOfTaskActionNotEvaluate}</span>
                  </div>
                )}

                {/* Chưa xác nhận phân công công việc */}
                {checkConfirmAssginOfOrganizationalUnit && checkConfirmAssginOfOrganizationalUnit.checkConfirm && (
                  <div>
                    <strong>{translate('task.task_management.unit_not_confirm_assigned_task')}:</strong>
                    {checkConfirmAssginOfOrganizationalUnit.unitHasNotConfirm &&
                      checkConfirmAssginOfOrganizationalUnit.unitHasNotConfirm.length !== 0 &&
                      checkConfirmAssginOfOrganizationalUnit.unitHasNotConfirm.map((item, index) => {
                        const seperator = index !== 0 ? ', ' : ''
                        return (
                          <span key={index}>
                            {seperator}
                            {item}
                          </span>
                        )
                      })}
                  </div>
                )}

                {/* Thời hạn chỉnh sửa thông tin */}
                {checkDeadlineForEvaluation && checkDeadlineForEvaluation.checkDeadlineForEvaluation && (
                  <div>
                    <strong>{translate('task.task_management.left_can_edit_task')}:</strong>
                    <span style={{ color: 'red' }}>{checkDeadlineForEvaluation.deadlineForEvaluation}</span>
                  </div>
                )}
              </div>
            )}

            {/* Phân công công việc cho nhân viên */}
            {employeeCollaboratedWithUnitSelectBox &&
              employeeCollaboratedWithUnitSelectBox.length !== 0 &&
              employeeCollaboratedWithUnitSelectBox.map((item) => (
                <CollaboratedWithOrganizationalUnits key={item.id} task={task} employeeSelectBox={item} unitId={item.id} />
              ))}

            {/* Các trường thông tin cơ bản */}
            {task && (
              <div className='description-box'>
                <h4>{translate('task.task_management.detail_general_info')}</h4>

                <div>
                  <strong>{translate('task.task_management.detail_link')}:</strong>{' '}
                  <a href={`/task?taskId=${task._id}`} target='_blank'>
                    {task.name}
                  </a>
                </div>
                <div>
                  <strong>Dự án:</strong>{' '}
                  {task &&
                    task.taskProject &&
                    this.props.project.data.list.length !== 0 &&
                    this.props.project.data.list.find((projectItem) => String(projectItem._id) === String(task?.taskProject)).name}
                </div>
                <div>
                  <strong>{translate('task.task_management.detail_time')}:</strong> {this.formatTime(task && task.startDate)}{' '}
                  <i className='fa fa-fw fa-caret-right' /> {this.formatTime(task && task.endDate)}{' '}
                </div>
                {/* <div><strong>{translate('task.task_management.unit_manage_task')}:</strong> {task && task.organizationalUnit ? task.organizationalUnit.name : translate('task.task_management.err_organizational_unit')}</div> */}
                {/* <div>
                                    <strong>{translate('task.task_management.collaborated_with_organizational_units')}: </strong>
                                    <span>
                                        {task.collaboratedWithOrganizationalUnits.length !== 0
                                            ? <span>
                                                {
                                                    task.collaboratedWithOrganizationalUnits.map((item, index) => {
                                                        let seperator = index !== 0 ? ", " : "";
                                                        return <span key={index}>{seperator}{item.organizationalUnit && item.organizationalUnit.name}</span>
                                                    })
                                                }
                                            </span>
                                            : <span>{translate('task.task_management.not_collaborated_with_organizational_units')}</span>
                                        }
                                    </span>
                                </div> */}
                {/* <div><strong>{translate('task.task_management.detail_priority')}:</strong> {task && this.formatPriority(task.priority)}</div> */}
                <div>
                  <strong>{translate('task.task_management.detail_status')}:</strong> {task && this.formatStatus(task.status)}
                </div>
                <div>
                  <strong>{translate('task.task_management.detail_progress')}:</strong> {task && task.progress}%
                </div>
                {task &&
                  task.taskInformations &&
                  task.taskInformations.length !== 0 &&
                  task.taskInformations.map((info, key) => {
                    if (info.type === 'date') {
                      return (
                        <div key={key}>
                          <strong>{info.name}:</strong>{' '}
                          {info.value ? this.formatDate(info.value) : translate('task.task_management.detail_not_hasinfo')}
                        </div>
                      )
                    }
                    return (
                      <div key={key}>
                        <strong>{info.name}:</strong>
                        {info.value
                          ? info.value
                          : Number(info.value) === 0
                            ? info.value
                            : translate('task.task_management.detail_not_hasinfo')}
                      </div>
                    )
                  })}

                {/* Mô tả công việc */}
                <div>
                  <strong>{translate('task.task_management.detail_description')}:</strong>
                  <ShowMoreShowLess id='task-description' isHtmlElement characterLimit={200}>
                    {task && parse(task.description)}
                  </ShowMoreShowLess>
                </div>
              </div>
            )}

            <div>
              {/* Vai trò */}
              {task && (
                <div className='description-box'>
                  <h4>{translate('task.task_management.role')}</h4>

                  {/* Người thực hiện */}
                  <strong>{translate('task.task_management.responsible')}:</strong>
                  <span>
                    {task &&
                      task.responsibleEmployees &&
                      task.responsibleEmployees.length !== 0 &&
                      task.responsibleEmployees.map((item, index) => {
                        const seperator = index !== 0 ? ', ' : ''
                        if (task.inactiveEmployees.indexOf(item._id) !== -1) {
                          // tìm thấy item._id
                          return (
                            <span key={index}>
                              <strike>
                                {seperator}
                                {item.name}
                              </strike>
                            </span>
                          )
                        }
                        return (
                          <span key={index}>
                            {seperator}
                            {item.name}
                          </span>
                        )
                      })}
                  </span>
                  <br />

                  {/* Người phê duyệt */}
                  <strong>{translate('task.task_management.accountable')}:</strong>
                  <span>
                    {task &&
                      task.accountableEmployees &&
                      task.accountableEmployees.length !== 0 &&
                      task.accountableEmployees.map((item, index) => {
                        const seperator = index !== 0 ? ', ' : ''
                        if (task.inactiveEmployees.indexOf(item._id) !== -1) {
                          // tìm thấy item._id
                          return (
                            <span key={index}>
                              <strike>
                                {seperator}
                                {item.name}
                              </strike>
                            </span>
                          )
                        }
                        return (
                          <span key={index}>
                            {seperator}
                            {item.name}
                          </span>
                        )
                      })}
                  </span>
                  <br />

                  {task && task.consultedEmployees && task.consultedEmployees.length !== 0 && (
                    <div>
                      {/* Người hỗ trợ */}
                      <strong>{translate('task.task_management.consulted')}:</strong>
                      <span>
                        {task &&
                          task.consultedEmployees.length !== 0 &&
                          task.consultedEmployees.map((item, index) => {
                            const seperator = index !== 0 ? ', ' : ''
                            if (task.inactiveEmployees.indexOf(item._id) !== -1) {
                              // tìm thấy item._id
                              return (
                                <span key={index}>
                                  <strike>
                                    {seperator}
                                    {item.name}
                                  </strike>
                                </span>
                              )
                            }
                            return (
                              <span key={index}>
                                {seperator}
                                {item.name}
                              </span>
                            )
                          })}
                      </span>
                      <br />
                    </div>
                  )}
                  {task && task.informedEmployees && task.informedEmployees.length !== 0 && (
                    <div>
                      {/* Người quan sát */}
                      <strong>{translate('task.task_management.informed')}:</strong>
                      <span>
                        {task &&
                          task.informedEmployees.length !== 0 &&
                          task.informedEmployees.map((item, index) => {
                            const seperator = index !== 0 ? ', ' : ''
                            if (task.inactiveEmployees.indexOf(item._id) !== -1) {
                              // tìm thấy item._id
                              return (
                                <span key={index}>
                                  <strike>
                                    {seperator}
                                    {item.name}
                                  </strike>
                                </span>
                              )
                            }
                            return (
                              <span key={index}>
                                {seperator}
                                {item.name}
                              </span>
                            )
                          })}
                      </span>
                      <br />
                    </div>
                  )}

                  {hoursSpentOfEmployeeInTask && JSON.stringify(hoursSpentOfEmployeeInTask) !== '{}' && (
                    <div>
                      <strong>Tổng thời gian đóng góp:</strong>
                      <HoursSpentOfEmployeeChart refs='totalTime' data={hoursSpentOfEmployeeInTask} />
                    </div>
                  )}
                </div>
              )}

              {/* Đánh giá công việc */}
              <div>
                {evalList &&
                  evalList.map((eva, keyEva) => {
                    return (
                      <div key={keyEva} className='description-box'>
                        <h4>
                          {translate('task.task_management.detail_eval')}&nbsp;{this.formatDate(eva.startDate)}{' '}
                          <i className='fa fa-fw fa-caret-right' /> {this.formatDate(eva.endDate)}
                        </h4>
                        <a style={{ cursor: 'pointer' }} onClick={() => this.handleChangeShowMoreEvalItem(eva._id)}>
                          {showMore[eva._id] ? (
                            <p>
                              Nhấn chuột để ẩn chi tiết&nbsp;&nbsp;
                              <i className='fa fa-angle-double-up' />
                            </p>
                          ) : (
                            <p>
                              Nhấn chuột để xem chi tiết&nbsp;&nbsp;
                              <i className='fa fa-angle-double-down' />
                            </p>
                          )}
                        </a>
                        {showMore[eva._id] && (
                          <div>
                            {eva.results.length !== 0 && (
                              <div>
                                <div>
                                  <strong>{translate('task.task_management.detail_point')}</strong> (
                                  {translate('task.task_management.detail_auto_point')} -{' '}
                                  {translate('task.task_management.detail_emp_point')} -{' '}
                                  {translate('task.task_management.detail_acc_point')})
                                </div>
                                <ul>
                                  {eva.results.length !== 0 ? (
                                    eva.results.map((res, index) => {
                                      if (res.employee && task.inactiveEmployees.indexOf(res.employee._id) !== -1) {
                                        return (
                                          <li key={index}>
                                            <strike>{res.employee.name}</strike>: &nbsp;&nbsp;{' '}
                                            {res.automaticPoint !== null && res.automaticPoint !== undefined
                                              ? res.automaticPoint
                                              : translate('task.task_management.detail_not_auto')}{' '}
                                            - {res.employeePoint ? res.employeePoint : translate('task.task_management.detail_not_emp')} -{' '}
                                            {res.approvedPoint ? res.approvedPoint : translate('task.task_management.detail_not_acc')}
                                          </li>
                                        )
                                      }
                                      return (
                                        <li key={index}>
                                          {res.employee && res.employee.name}: &nbsp;&nbsp;{' '}
                                          {res.automaticPoint !== null && res.automaticPoint !== undefined
                                            ? res.automaticPoint
                                            : translate('task.task_management.detail_not_auto')}{' '}
                                          - {res.employeePoint ? res.employeePoint : translate('task.task_management.detail_not_emp')} -{' '}
                                          {res.approvedPoint ? res.approvedPoint : translate('task.task_management.detail_not_acc')}
                                        </li>
                                      )
                                    })
                                  ) : (
                                    <li>{translate('task.task_management.detail_not_eval')}</li>
                                  )}
                                </ul>
                              </div>
                            )}
                            <div>
                              <div>
                                <strong>{translate('task.task_management.detail_info')}</strong>
                              </div>
                              <ul>
                                <li>
                                  {translate('task.task_management.detail_progress')}: &nbsp;&nbsp;{' '}
                                  {eva.progress !== null && eva.progress !== undefined
                                    ? `${eva.progress}%`
                                    : translate('task.task_management.detail_not_eval_on_month')}
                                </li>
                                {eva.taskInformations.map((info, key) => {
                                  if (info.type === 'date') {
                                    return (
                                      <li key={key}>
                                        {info.name}: &nbsp;&nbsp;{' '}
                                        {info.value
                                          ? this.formatDate(info.value)
                                          : translate('task.task_management.detail_not_eval_on_month')}
                                      </li>
                                    )
                                  }
                                  return (
                                    <li key={key}>
                                      {info.name}: &nbsp;&nbsp;{' '}
                                      {info.value
                                        ? info.value
                                        : Number(info.value) === 0
                                          ? info.value
                                          : translate('task.task_management.detail_not_eval_on_month')}
                                    </li>
                                  )
                                })}
                              </ul>
                            </div>

                            {/* KPI */}
                            {/* {(eva.results.length !== 0) ?
                                                            (
                                                                eva.results.map((item, key) => {
                                                                    return (
                                                                        <div key={key}>
                                                                            <strong>KPI {item.employee && item.employee.name}:</strong>
                                                                            {(item.kpis.length !== 0) ?
                                                                                <ul>
                                                                                    {
                                                                                        item.kpis.map((kpi, keyKpi) => {
                                                                                            return <li key={keyKpi}>{kpi.name}</li>
                                                                                        })
                                                                                    }
                                                                                </ul>
                                                                                : <span>{translate('task.task_management.detail_not_kpi')}</span>
                                                                            }
                                                                        </div>)
                                                                })
                                                            ) : <div><strong>{translate('task.task_management.detail_all_not_kpi')}</strong></div>
                                                        } */}

                            {/* Thời gian bấm giờ */}
                            <strong>Thời gian đóng góp:</strong>
                            {showToolbar && (
                              <a
                                style={{ cursor: 'pointer' }}
                                onClick={() =>
                                  this.calculateHoursSpentOnTask(
                                    task._id,
                                    task.timesheetLogs,
                                    eva.evaluatingMonth,
                                    eva,
                                    eva.startDate,
                                    eva.endDate
                                  )
                                }
                                title='Cập nhật thời gian bấm giờ'
                              >
                                Nhấn chuột để cập nhật dữ liệu <i className='fa fa-fw fa-clock-o' />
                              </a>
                            )}
                            {eva.results.length !== 0 &&
                              hoursSpentOfEmployeeInEvaluation[eva.evaluatingMonth] &&
                              JSON.stringify(hoursSpentOfEmployeeInEvaluation[eva.evaluatingMonth]) !== '{}' && (
                                <HoursSpentOfEmployeeChart
                                  refs={`evaluationBox${eva.evaluatingMonth}`}
                                  data={hoursSpentOfEmployeeInEvaluation[eva.evaluatingMonth]}
                                />
                              )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                {task && (!task.evaluations || task.evaluations.length === 0) && (
                  <dt>{translate('task.task_management.detail_none_eval')}</dt>
                )}
              </div>
            </div>
          </div>
        </div>
        {id && showEdit === id && currentRole === 'responsible' && checkHasAccountable === true && (
          <ModalEditTaskByResponsibleEmployeeProject
            id={id}
            task={task && task}
            role={currentRole}
            title={translate('task.task_management.detail_resp_edit')}
            perform={`edit-${currentRole}`}
          />
        )}

        {id && showEdit === id && currentRole === 'responsible' && checkHasAccountable === false && (
          <ModalEditTaskByAccountableEmployeeProject
            id={id}
            task={task && task}
            role={currentRole}
            hasAccountable={false}
            title={translate('task.task_management.detail_resp_edit')}
            perform={`edit-${currentRole}-hasnot-accountable`}
          />
        )}

        {id && showEdit === id && currentRole === 'accountable' && (
          <ModalEditTaskByAccountableEmployeeProject
            id={id}
            task={task && task}
            hasAccountable
            role={currentRole}
            title={translate('task.task_management.detail_acc_edit')}
            perform={`edit-${currentRole}`}
          />
        )}

        {id && showEdit === id && currentRole === 'accountable' && (
          <ModalRequestEditProjectTaskEmployee
            id={id}
            task={task && task}
            currentProjectTasks={currentProjectTasks && currentProjectTasks}
            currentProjectPhase={currentProjectPhase && currentProjectPhase}
            currentProjectMilestone={currentProjectMilestone && currentProjectMilestone}
            projectDetail={projectDetail && projectDetail}
          />
        )}

        {/* {
                    (id && showEvaluate === id) &&
                    <EvaluationProjectModal
                        id={id}
                        task={task && task}
                        hasAccountable={checkHasAccountable}
                        role={currentRole}
                        title={translate('task.task_management.detail_cons_eval')}
                        perform='evaluate'
                    />
                } */}
        {id && showEndTask === id && (
          <SelectFollowingTaskModal
            id={id}
            task={task && task}
            role={currentRole}
            typeOfTask={typeOfTask}
            codeInProcess={codeInProcess}
            title={translate('task.task_perform.choose_following_task')}
            perform='selectFollowingTask'
            refresh={this.refresh}
          />
        )}
        {
          // (id && showCopy === `copy-task-${id}`) &&
          <TaskAddModal id={`copy-task-${id}`} task={task} />
        }
        {showSaveAsTemplate && <ModalAddTaskTemplate savedTaskAsTemplate savedTaskItem={task} savedTaskId={showSaveAsTemplate} />}

        {id && showRequestClose === id && (currentRole === 'responsible' || currentRole === 'accountable') && checkHasAccountable && (
          <RequestToCloseProjectTaskModal id={id} task={task && task} role={currentRole} hasAccountable={checkHasAccountable} />
        )}
        {id && currentRole === 'accountable' && checkHasAccountable && (
          <ModalRequestChangeStatusProjectTask
            id={id}
            task={task && task}
            currentProjectTasks={currentProjectTasks && currentProjectTasks}
          />
        )}
      </>
    )
  }
}

function mapStateToProps(state) {
  const { tasks, performtasks, user, role, project, projectPhase } = state
  return { tasks, performtasks, user, role, project, projectPhase }
}

const actionGetState = {
  // dispatchActionToProps
  getTaskById: performTaskAction.getTaskById,
  getSubTask: taskManagementActions.getSubTask,
  startTimer: performTaskAction.startTimerTask,
  stopTimer: performTaskAction.stopTimerTask,
  getTimesheetLogs: performTaskAction.getTimesheetLogs,
  getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
  getTaskLog: performTaskAction.getTaskLog,
  editHoursSpentInEvaluate: performTaskAction.editHoursSpentInEvaluate,
  confirmTask: performTaskAction.confirmTask,
  getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
  getProjectsDispatch: ProjectActions.getProjectsDispatch,
  openTaskAgain: performTaskAction.openTaskAgain,
  getAllTasksByProject: taskManagementActions.getAllTasksByProject,
  getAllPhaseByProject: ProjectPhaseActions.getAllPhaseByProject,

  showInfoRole: RoleActions.show
}

const detailTask = connect(mapStateToProps, actionGetState)(withTranslate(DetailProjectTaskTab))

export { detailTask as DetailProjectTaskTab }
