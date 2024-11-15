import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DialogModal, ErrorLabel, SelectBox, DatePicker, QuillEditor, TreeSelect, TimePicker } from '../../../../common-components'
import { getStorage } from '../../../../config'

import { UserActions } from '../../../super-admin/user/redux/actions'
import { TaskInformationForm } from '../../task-perform/component/taskInformationForm'
import { performTaskAction } from '../../task-perform/redux/actions'
import { taskManagementActions } from '../../task-management/redux/actions'

import { TaskFormValidator } from '../../task-management/component/taskFormValidator'
import { TaskTemplateFormValidator } from '../../task-template/component/taskTemplateFormValidator'

import getEmployeeSelectBoxItems from '../../organizationalUnitHelper'
import Swal from 'sweetalert2'
import moment from 'moment'
import { convertUserIdToUserName } from '../../../project/projects/components/functionHelper'

class ModalEditTaskByAccountableEmployeeProject extends Component {
  constructor(props) {
    super(props)

    let userId = getStorage('userId')

    let { task } = this.props

    let organizationalUnit = task && task.organizationalUnit?._id
    let collaboratedWithOrganizationalUnits =
      task &&
      task.collaboratedWithOrganizationalUnits.map((e) => {
        if (e) return e.organizationalUnit._id
      })

    let statusOptions = []
    statusOptions.push(task && task.status)
    let priorityOptions = []
    priorityOptions.push(task && task.priority)
    let taskName = task && task.name
    let taskDescription = task && task.description
    let progress = task && task.progress
    let formulaProjectTask = task && task.formulaProjectTask
    let formulaProjectMember = task && task.formulaProjectMember
    let parent = task && task.parent ? task.parent._id : ''
    let parentTask = task && task.parent
    let taskProject = task && task.taskProject

    let info = {},
      taskInfo = task && task.taskInformations
    for (let i in taskInfo) {
      if (taskInfo[i].type === 'date') {
        if (taskInfo[i].value) {
          info[`${taskInfo[i].code}`] = {
            value: this.formatDate(taskInfo[i].value),
            code: taskInfo[i].code,
            type: taskInfo[i].type
          }
        } else {
          info[`${taskInfo[i].code}`] = {
            value: this.formatDate(Date.now()),
            code: taskInfo[i].code,
            type: taskInfo[i].type
          }
        }
      } else if (taskInfo[i].type === 'set_of_values') {
        let splitter = taskInfo[i].extra.split('\n')
        if (taskInfo[i].value) {
          info[`${taskInfo[i].code}`] = {
            value: [taskInfo[i].value],
            code: taskInfo[i].code,
            type: taskInfo[i].type
          }
        } else {
          info[`${taskInfo[i].code}`] = {
            value: [splitter[0]],
            code: taskInfo[i].code,
            type: taskInfo[i].type
          }
        }
      } else {
        if (taskInfo[i].value) {
          info[`${taskInfo[i].code}`] = {
            value: taskInfo[i].value,
            code: taskInfo[i].code,
            type: taskInfo[i].type
          }
        }
      }
    }

    let responsibleEmployees =
      task &&
      task.responsibleEmployees.map((employee) => {
        return employee._id
      })
    let accountableEmployees =
      task &&
      task.accountableEmployees.map((employee) => {
        return employee._id
      })
    let consultedEmployees =
      task &&
      task.consultedEmployees.map((employee) => {
        return employee._id
      })
    let informedEmployees =
      task &&
      task.informedEmployees.map((employee) => {
        return employee._id
      })
    let inactiveEmployees = task && task.inactiveEmployees
    let listInactive = {}
    for (let i in inactiveEmployees) {
      if (accountableEmployees.indexOf(inactiveEmployees[i]) !== -1) {
        listInactive[`${inactiveEmployees[i]}`] = {
          value: inactiveEmployees[i],
          role: 'accountable',
          checked: true
        }
      } else if (responsibleEmployees.indexOf(inactiveEmployees[i]) !== -1) {
        listInactive[`${inactiveEmployees[i]}`] = {
          value: inactiveEmployees[i],
          role: 'responsible',
          checked: true
        }
      } else if (consultedEmployees.indexOf(inactiveEmployees[i]) !== -1) {
        listInactive[`${inactiveEmployees[i]}`] = {
          value: inactiveEmployees[i],
          role: 'consulted',
          checked: true
        }
      }
    }

    let startDate = this.formatDate(task.startDate)
    let endDate = this.formatDate(task.endDate)

    let startTime = this.formatTime(task.startDate)
    let endTime = this.formatTime(task.endDate)

    this.state = {
      listInactive: listInactive,
      userId: userId,
      task: task,
      info: info,
      taskName: taskName,
      taskDescription: taskDescription,
      taskDescriptionDefault: taskDescription,
      organizationalUnit: organizationalUnit,
      collaboratedWithOrganizationalUnits: collaboratedWithOrganizationalUnits,
      statusOptions: statusOptions,
      priorityOptions: priorityOptions,
      progress: progress,
      formulaProjectTask,
      formulaProjectMember,
      parent: parent,
      parentTask: parentTask,
      taskProjectName: taskProject,
      startDate: startDate,
      endDate: endDate,
      startTime: startTime,
      endTime: endTime,
      responsibleEmployees: responsibleEmployees,
      accountableEmployees: accountableEmployees,
      consultedEmployees: consultedEmployees,
      informedEmployees: informedEmployees,
      inactiveEmployees: inactiveEmployees,
      errorInfo: {}
    }
  }

  componentDidMount() {
    this.props.getAllUserSameDepartment(localStorage.getItem('currentRole'))
    // unit, number, perPage, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore, aPeriodOfTime = false, calledId = null
    this.props.getPaginateTasksByUser([], '1', '5', [], [], [], null, null, null, null, null, false, 'listSearch')
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.id !== prevState.id) {
      return {
        ...prevState,
        id: nextProps.id,

        errorOnDate: undefined, // Khi nhận thuộc tính mới, cần lưu ý reset lại các gợi ý nhắc lỗi, nếu không các lỗi cũ sẽ hiển thị lại
        errorOnPoint: undefined,
        errorOnInfoDate: undefined,
        errorOnProgress: undefined,
        errorTaskName: undefined,
        errorTaskDescription: undefined,
        errorOnFormulaTask: undefined,
        errorOnFormulaMember: undefined,
        errorInfo: {},
        errorOnStartDate: undefined,
        errorOnEndDate: undefined
      }
    } else {
      return null
    }
  }

  // Function format ngày hiện tại thành dạnh dd-mm-yyyy
  formatDate = (date) => {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return [day, month, year].join('-')
  }

  // convert ISODate to String hh:mm AM/PM
  formatTime(date) {
    var d = new Date(date)
    let time = moment(d).format('hh:mm')
    let suffix = ' AM'
    if (d.getHours() >= 12 && d.getHours() <= 23) {
      suffix = ' PM'
    }
    return time + suffix
  }

  handleChangeProgress = async (e) => {
    let value = parseInt(e.target.value)
    this.setState((state) => {
      return {
        ...state,
        progress: value,
        errorOnProgress: this.validatePoint(value)
      }
    })
  }

  handleChangeNumberInfo = async (e) => {
    let value = parseInt(e.target.value)
    let name = e.target.name
    await this.setState((state) => {
      state.info[`${name}`] = {
        value: value,
        code: name,
        type: 'number'
      }
      state.errorInfo[name] = this.validateNumberInfo(value)
      return {
        ...state
      }
    })
  }

  handleChangeTextInfo = async (e) => {
    let value = e.target.value
    let name = e.target.name
    await this.setState((state) => {
      state.info[`${name}`] = {
        value: value,
        code: name,
        type: 'text'
      }
      state.errorInfo[name] = this.validateTextInfo(value)
      return {
        ...state
      }
    })
  }

  handleInfoDateChange = (value, code) => {
    this.setState((state) => {
      state.info[`${code}`] = {
        value: value,
        code: code,
        type: 'date'
      }
      state.errorInfo[code] = this.validateDate(value)
      return {
        ...state
      }
    })
  }

  handleSetOfValueChange = async (value, code) => {
    this.setState((state) => {
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

  handleInfoBooleanChange = (event) => {
    let { name, value } = event.target
    this.setState((state) => {
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

  validateInfoBoolean = (value, willUpdateState = true) => {
    let { translate } = this.props
    let msg = undefined
    if (value.indexOf('') !== -1) {
      msg = translate('task.task_perform.modal_approve_task.err_empty')
    }

    return msg
  }

  validateTextInfo = (value) => {
    let { translate } = this.props
    let msg = undefined
    if (value === '') {
      msg = translate('task.task_perform.modal_approve_task.err_empty')
    }
    return msg
  }

  validateNumberInfo = (value) => {
    let { translate } = this.props
    let msg = undefined

    if (isNaN(value)) {
      msg = translate('task.task_perform.modal_approve_task.err_empty')
    }
    return msg
  }

  validateDate = (value, willUpdateState = true) => {
    let msg = undefined
    if (value.trim() === '') {
      msg = 'Ngày đánh giá bắt buộc phải chọn'
    }

    return msg
  }

  validatePoint = (value) => {
    let { translate } = this.props
    let msg = undefined
    if (value < 0 || value > 100) {
      msg = translate('task.task_perform.modal_approve_task.err_range')
    }
    if (isNaN(value)) {
      msg = translate('task.task_perform.modal_approve_task.err_empty')
    }
    return msg
  }

  handleChangeListInfo = async (data) => {
    await this.setState({ listInfo: data })
  }

  changeActiveEmployees = async (listInactive) => {
    let inactiveEmployees = []
    for (let i in listInactive) {
      if (listInactive[i].checked === true) {
        inactiveEmployees.push(listInactive[i].value)
      }
    }
    await this.setState((state) => {
      return {
        ...state,
        inactiveEmployees: inactiveEmployees
      }
    })
  }

  handleChangeActiveAccountable = async (e, id) => {
    let { task } = this.state
    let target = e.target
    let { value, name, checked } = target

    let numOfResponsible = this.state.responsibleEmployees.length
    let numOfAccountable = this.state.accountableEmployees.length

    await this.setState((state) => {
      state.listInactive[`${id}`] = {
        value: value,
        checked: checked,
        role: 'accountable'
      }
      return {
        ...state
      }
    })

    let numOfInactiveResp = 0,
      numOfInactiveAcc = 0,
      listInactive = this.state.listInactive

    for (let i in listInactive) {
      if (listInactive[i].checked === true) {
        if (task.responsibleEmployees.map((e) => e._id).indexOf(listInactive[i].value) !== -1) numOfInactiveResp = numOfInactiveResp + 1
        if (task.accountableEmployees.map((e) => e._id).indexOf(listInactive[i].value) !== -1) numOfInactiveAcc = numOfInactiveAcc + 1
      }
    }

    if (numOfAccountable === numOfInactiveAcc) {
      let { translate } = this.props
      Swal.fire({
        title: translate('task.task_perform.err_has_accountable'),
        type: 'Warning',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: translate('task.task_perform.confirm')
      }).then((res) => {
        this.setState((state) => {
          state.listInactive[`${id}`] = {
            value: value,
            checked: false,
            role: 'accountable'
          }
          return {
            ...state
          }
        })
      })
    } else if (numOfInactiveResp === numOfResponsible) {
      let { translate } = this.props
      Swal.fire({
        title: translate('task.task_perform.err_has_responsible'),
        type: 'Warning',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: translate('task.task_perform.confirm')
      }).then((res) => {
        this.setState((state) => {
          state.listInactive[`${id}`] = {
            value: value,
            checked: false,
            role: 'accountable'
          }
          return {
            ...state
          }
        })
      })
    }
  }

  handleChangeActiveResponsible = async (e, id) => {
    let { task } = this.state
    let target = e.target
    let { value, name, checked } = target

    let numOfResponsible = task.responsibleEmployees.length
    let numOfAccountable = task.accountableEmployees.length

    await this.setState((state) => {
      state.listInactive[`${id}`] = {
        value: value,
        checked: checked,
        role: 'responsible'
      }
      return {
        ...state
      }
    })

    let numOfInactiveResp = 0,
      numOfInactiveAcc = 0,
      listInactive = this.state.listInactive

    for (let i in listInactive) {
      if (listInactive[i].checked === true) {
        if (task.responsibleEmployees.map((e) => e._id).indexOf(listInactive[i].value) !== -1) numOfInactiveResp = numOfInactiveResp + 1
        if (task.accountableEmployees.map((e) => e._id).indexOf(listInactive[i].value) !== -1) numOfInactiveAcc = numOfInactiveAcc + 1
      }
    }

    if (numOfInactiveResp === numOfResponsible) {
      let { translate } = this.props
      Swal.fire({
        title: translate('task.task_perform.err_has_responsible'),
        type: 'Warning',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: translate('task.task_perform.confirm')
      }).then((res) => {
        this.setState((state) => {
          state.listInactive[`${id}`] = {
            value: value,
            checked: false,
            role: 'responsible'
          }
          return {
            ...state
          }
        })
      })
    } else if (numOfAccountable === numOfInactiveAcc) {
      let { translate } = this.props
      Swal.fire({
        title: translate('task.task_perform.err_has_accountable'),
        type: 'Warning',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: translate('task.task_perform.confirm')
      }).then((res) => {
        this.setState((state) => {
          state.listInactive[`${id}`] = {
            value: value,
            checked: false,
            role: 'responsible'
          }
          return {
            ...state
          }
        })
      })
    }
  }

  handleChangeActiveConsulted = async (e, id) => {
    let { task } = this.state
    let target = e.target
    let { value, name, checked } = target

    let numOfResponsible = this.state.responsibleEmployees.length
    let numOfAccountable = this.state.accountableEmployees.length

    await this.setState((state) => {
      state.listInactive[`${id}`] = {
        value: value,
        checked: checked,
        role: 'consulted'
      }
      return {
        ...state
      }
    })

    let numOfInactiveResp = 0,
      numOfInactiveAcc = 0,
      listInactive = this.state.listInactive

    for (let i in listInactive) {
      if (listInactive[i].checked === true) {
        if (task.responsibleEmployees.map((e) => e._id).indexOf(listInactive[i].value) !== -1) numOfInactiveResp = numOfInactiveResp + 1
        if (task.accountableEmployees.map((e) => e._id).indexOf(listInactive[i].value) !== -1) numOfInactiveAcc = numOfInactiveAcc + 1
      }
    }

    if (numOfAccountable === numOfInactiveAcc) {
      let { translate } = this.props
      Swal.fire({
        title: translate('task.task_perform.err_has_accountable'),
        type: 'Warning',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: translate('task.task_perform.confirm')
      }).then((res) => {
        numOfInactiveResp = numOfInactiveResp - 1
        numOfInactiveAcc = numOfInactiveAcc - 1
        this.setState((state) => {
          state.listInactive[`${id}`] = {
            value: value,
            checked: false,
            role: 'consulted'
          }
          return {
            ...state
          }
        })
      })
    } else if (numOfInactiveResp === numOfResponsible) {
      let { translate } = this.props
      Swal.fire({
        title: translate('task.task_perform.err_has_responsible'),
        type: 'Warning',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: translate('task.task_perform.confirm')
      }).then((res) => {
        numOfInactiveResp = numOfInactiveResp - 1
        numOfInactiveAcc = numOfInactiveAcc - 1
        this.setState((state) => {
          state.listInactive[`${id}`] = {
            value: value,
            checked: false,
            role: 'consulted'
          }
          return {
            ...state
          }
        })
      })
    }
  }

  handleTaskNameChange = (event) => {
    let value = event.target.value
    this.validateTaskName(value, true)
  }

  validateTaskName = (value, willUpdateState) => {
    let { translate } = this.props
    let errorMessage = undefined
    if (value === '') {
      errorMessage = translate('task.task_perform.modal_approve_task.err_empty')
    }
    if (willUpdateState) {
      this.setState((state) => {
        return {
          ...state,
          taskName: value,
          errorTaskName: errorMessage
        }
      })
    }
    return errorMessage === undefined
  }

  handleTaskDescriptionChange = (value, imgs) => {
    this.validateTaskDescription(value, true)
  }

  validateTaskDescription = (value, willUpdateState) => {
    let { translate } = this.props
    let errorMessage = undefined
    // if (value === "") {
    //     errorMessage = translate('task.task_perform.modal_approve_task.err_empty');
    // }
    if (willUpdateState) {
      this.setState((state) => {
        return {
          ...state,
          taskDescription: value,
          errorTaskDescription: errorMessage
        }
      })
    }
    return errorMessage === undefined
  }

  handleChangeTaskStartDate = (value) => {
    this.validateTaskStartDate(value, true)
  }
  validateTaskStartDate = (value, willUpdateState = true) => {
    let { translate } = this.props
    let msg = TaskFormValidator.validateTaskStartDate(value, this.state.endDate, this.props.translate)

    if (value === '') {
      msg = translate('task.task_perform.modal_approve_task.err_empty')
    } else {
      let startDate = this.convertDateTime(value, this.state.startTime)
      let endDate = this.convertDateTime(this.state.endDate, this.state.endTime)
      if (startDate > endDate) {
        msg = translate('task.task_management.add_err_end_date')
      }
    }
    if (willUpdateState) {
      this.setState((state) => {
        return {
          ...state,
          startDate: value,
          errorOnStartDate: msg
        }
      })
    }
    return msg === undefined
  }

  handleChangeTaskEndDate = (value) => {
    this.validateTaskEndDate(value, true)
  }
  validateTaskEndDate = (value, willUpdateState = true) => {
    let { translate } = this.props
    let msg = TaskFormValidator.validateTaskEndDate(this.state.startDate, value, this.props.translate)

    if (value === '') {
      msg = translate('task.task_perform.modal_approve_task.err_empty')
    } else {
      let startDate = this.convertDateTime(this.state.startDate, this.state.startTime)
      let endDate = this.convertDateTime(value, this.state.endTime)
      if (startDate > endDate) {
        msg = translate('task.task_management.add_err_end_date')
      }
    }
    if (willUpdateState) {
      this.state.endDate = value
      this.state.errorOnEndDate = msg
      this.setState((state) => {
        return {
          ...state
        }
      })
    }
    return msg === undefined
  }

  handleChangeTaskFormula = (event) => {
    let value = event.target.value
    this.validateTaskFormula(value, true)
  }

  validateTaskFormula = (value, willUpdateState = true) => {
    let { translate } = this.props
    let msg = TaskTemplateFormValidator.validateTaskTemplateFormula(value)

    if (value === '') {
      msg = translate('task.task_perform.modal_approve_task.err_empty')
    }
    if (willUpdateState) {
      this.setState((state) => {
        return {
          ...state,
          formulaProjectTask: value,
          errorOnFormulaTask: msg
        }
      })
    }
    return msg === undefined
  }

  handleChangeMemberFormula = (event) => {
    let value = event.target.value
    this.validateMemberFormula(value, true)
  }

  validateMemberFormula = (value, willUpdateState = true) => {
    let { translate } = this.props
    let msg = TaskTemplateFormValidator.validateTaskTemplateFormula(value)

    if (value === '') {
      msg = translate('task.task_perform.modal_approve_task.err_empty')
    }
    if (willUpdateState) {
      this.setState((state) => {
        return {
          ...state,
          formulaProjectMember: value,
          errorOnFormulaMember: msg
        }
      })
    }
    return msg === undefined
  }

  handleTaskProgressChange = (event) => {
    let value = event.target.value
    this.validateTaskProgress(value, true)
  }

  validateTaskProgress = (value, willUpdateState) => {
    let { translate } = this.props
    let errorMessage = undefined
    if (value === '') {
      errorMessage = translate('task.task_perform.modal_approve_task.err_empty')
    }
    if (value !== undefined && isNaN(value)) {
      errorMessage = translate('task.task_perform.err_nan')
    }
    if (value < 0 || value > 100) {
      errorMessage = translate('task.task_perform.modal_approve_task.err_range')
    }
    if (willUpdateState) {
      this.setState((state) => {
        return {
          ...state,
          taskProgress: value,
          errorTaskProgress: errorMessage
        }
      })
    }
    return errorMessage === undefined
  }

  isFormValidated = () => {
    let { info, errorInfo } = this.state
    let check = true
    if (Object.keys(errorInfo).length !== 0) {
      for (let i in errorInfo) {
        if (errorInfo[i]) {
          check = false
          return
        }
      }
    }
    // check &&
    return (
      this.validateTaskName(this.state.taskName, false) &&
      this.validateTaskDescription(this.state.taskDescription, false) &&
      this.state.errorOnProgress === undefined &&
      this.state.errorOnEndDate === undefined &&
      this.state.errorOnStartDate === undefined &&
      check
    )
  }

  onSearch = async (txt) => {
    await this.props.getPaginateTasksByUser([], '1', '5', [], [], [], txt, null, null, null, null, false, 'listSearch')

    await this.setState((state) => {
      return {
        ...state,
        parent: state.parentTask ? state.parentTask._id : ''
      }
    })
  }

  handleSelectedPriority = (value) => {
    this.setState((state) => {
      return {
        ...state,
        priorityOptions: value
      }
    })
  }

  handleChangeCollaboratedWithOrganizationalUnits = async (value) => {
    await this.setState((state) => {
      return {
        ...state,
        collaboratedWithOrganizationalUnits: value
      }
    })
  }

  handleSelectedStatus = (value) => {
    this.setState((state) => {
      return {
        ...state,
        statusOptions: value
      }
    })
  }

  handleSelectedParent = async (value) => {
    let val = value[0]

    await this.setState((state) => {
      return {
        ...state,
        parent: val
      }
    })
  }

  handleSelectedResponsibleEmployee = (value) => {
    this.setState((state) => {
      return {
        ...state,
        responsibleEmployees: value
      }
    })
  }
  handleSelectedAccountableEmployee = (value) => {
    this.setState((state) => {
      return {
        ...state,
        accountableEmployees: value
      }
    })
  }
  handleSelectedConsultedEmployee = (value) => {
    this.setState((state) => {
      return {
        ...state,
        consultedEmployees: value
      }
    })
  }
  handleSelectedInformEmployee = (value) => {
    this.setState((state) => {
      return {
        ...state,
        informedEmployees: value
      }
    })
  }

  save = () => {
    let listInactive = this.state.listInactive,
      taskId,
      inactiveEmployees = []
    taskId = this.props.id
    for (let i in listInactive) {
      if (listInactive[i].checked !== undefined && listInactive[i].checked === true) {
        inactiveEmployees.push(listInactive[i].value)
      }
    }
    let startDateTask = this.convertDateTime(this.state.startDate, this.state.startTime)
    let endDateTask = this.convertDateTime(this.state.endDate, this.state.endTime)
    let data = {
      listInfo: this.state.listInfo,

      name: this.state.taskName,
      description: this.state.taskDescription,
      imageDescriptions: this.state.imageDescriptions,
      status: this.state.statusOptions,
      priority: this.state.priorityOptions,
      formula: this.state.formula,
      formulaProjectTask: this.state.formulaProjectTask,
      formulaProjectMember: this.state.formulaProjectMember,
      parent: this.state.parent,
      user: this.state.userId,
      progress: this.state.progress,
      date: this.formatDate(Date.now()),
      tags: this.state.tags,

      startDate: startDateTask,
      endDate: endDateTask,

      collaboratedWithOrganizationalUnits: this.state.collaboratedWithOrganizationalUnits,
      accountableEmployees: this.state.accountableEmployees,
      consultedEmployees: this.state.consultedEmployees,
      responsibleEmployees: this.state.responsibleEmployees,
      informedEmployees: this.state.informedEmployees,
      inactiveEmployees: inactiveEmployees,
      taskProject: this.state.taskProjectName,
      info: this.state.info || [],
      taskOutputs: this.state.taskOutPuts || []
    }
    this.props.editTaskByAccountableEmployees(data, taskId)
  }

  formatPriority = (data) => {
    const { translate } = this.props
    if (data === 1) return translate('task.task_management.low')
    if (data === 2) return translate('task.task_management.average')
    if (data === 3) return translate('task.task_management.standard')
    if (data === 4) return translate('task.task_management.high')
    if (data === 5) return translate('task.task_management.urgent')
  }

  formatRole = (data) => {
    const { translate } = this.props
    if (data === 'consulted') return translate('task.task_management.consulted')
    if (data === 'accountable') return translate('task.task_management.accountable')
    if (data === 'responsible') return translate('task.task_management.responsible')
  }

  formatStatus = (data) => {
    const { translate } = this.props
    if (data === 'inprocess') return translate('task.task_management.inprocess')
    else if (data === 'wait_for_approval') return translate('task.task_management.wait_for_approval')
    else if (data === 'finished') return translate('task.task_management.finished')
    else if (data === 'delayed') return translate('task.task_management.delayed')
    else if (data === 'canceled') return translate('task.task_management.canceled')
  }

  handleTaskProject = (value) => {
    value = value.toString()
    this.setState({
      taskProjectName: value
    })
  }

  handleStartTimeChange = (value) => {
    let { translate } = this.props
    let startDate = this.convertDateTime(this.state.startDate, value)
    let endDate = this.convertDateTime(this.state.endDate, this.state.endTime)
    let err
    if (value.trim() === '') {
      err = translate('task.task_management.add_err_empty_end_date')
    } else if (startDate > endDate) {
      err = translate('task.task_management.add_err_end_date')
    }
    this.setState((state) => {
      return {
        ...state,
        startTime: value,
        errorOnStartDate: err
      }
    })
  }

  handleEndTimeChange = (value) => {
    let { translate } = this.props
    let startDate = this.convertDateTime(this.state.startDate, this.state.startTime)
    let endDate = this.convertDateTime(this.state.endDate, value)
    let err
    if (value.trim() === '') {
      err = translate('task.task_management.add_err_empty_end_date')
    } else if (startDate > endDate) {
      err = translate('task.task_management.add_err_end_date')
    }
    this.setState((state) => {
      return {
        ...state,
        endTime: value,
        errorOnEndDate: err
      }
    })
  }

  convertDateTime = (date, time) => {
    let splitter = date.split('-')
    let strDateTime = `${splitter[2]}-${splitter[1]}-${splitter[0]} ${time}`
    // console.log('str Date time', strDateTime);
    return new Date(strDateTime)
  }

  render() {
    // console.log('new edit Task', this.state);

    const { user, tasktemplates, department, translate, project } = this.props
    const {
      task,
      organizationalUnit,
      collaboratedWithOrganizationalUnits,
      errorOnEndDate,
      errorOnStartDate,
      errorTaskName,
      errorTaskDescription,
      errorOnFormulaTask,
      errorOnFormulaMember,
      taskName,
      taskDescription,
      statusOptions,
      priorityOptions,
      taskDescriptionDefault,
      startDate,
      endDate,
      startTime,
      endTime,
      formulaProjectTask,
      formulaProjectMember,
      responsibleEmployees,
      accountableEmployees,
      consultedEmployees,
      informedEmployees,
      inactiveEmployees,
      parent,
      parentTask,
      taskProjectName
    } = this.state

    const { tasks, perform, id, role, title, hasAccountable } = this.props

    let departmentUsers, usercompanys
    if (user.userdepartments) departmentUsers = user.userdepartments
    if (user.usercompanys) usercompanys = user.usercompanys

    // list công việc liên quan.
    let listParentTask = [{ value: '', text: `--${translate('task.task_management.add_parent_task')}--` }]

    if (tasks.listSearchTasks) {
      let arr = tasks.listSearchTasks.map((x) => {
        return { value: x._id, text: x.name }
      })

      if (parentTask) {
        // kiểm tra parent cũ có trong list search hay không
        let hasParentItem = arr.find((e) => e.value === parentTask._id)

        //không có parent trong arr
        !hasParentItem && listParentTask.unshift({ value: parentTask._id, text: parentTask.name })
        for (let i in arr) {
          if (arr[i].value === parentTask._id) {
            listParentTask.unshift({ value: parentTask._id, text: parentTask.name })
          } else listParentTask.push({ value: arr[i].value, text: arr[i].text })
        }
      } else {
        listParentTask = [...listParentTask, ...arr]
      }
    }

    let priorityArr = [
      { value: 1, text: translate('task.task_management.low') },
      { value: 2, text: translate('task.task_management.average') },
      { value: 3, text: translate('task.task_management.standard') },
      { value: 4, text: translate('task.task_management.high') },
      { value: 5, text: translate('task.task_management.urgent') }
    ]
    let statusArr = [
      { value: 'inprocess', text: translate('task.task_management.inprocess') },
      { value: 'wait_for_approval', text: translate('task.task_management.wait_for_approval') },
      { value: 'finished', text: translate('task.task_management.finished') },
      { value: 'delayed', text: translate('task.task_management.delayed') },
      { value: 'canceled', text: translate('task.task_management.canceled') }
    ]

    let usersOfChildrenOrganizationalUnit
    if (user && user.usersOfChildrenOrganizationalUnit) {
      usersOfChildrenOrganizationalUnit = user.usersOfChildrenOrganizationalUnit
    }
    let unitMembers = getEmployeeSelectBoxItems(usersOfChildrenOrganizationalUnit)
    const listUsers = user && user.usersInUnitsOfCompany ? getEmployeeSelectBoxItems(user.usersInUnitsOfCompany) : []

    return (
      <div>
        <React.Fragment>
          <DialogModal
            size={75}
            maxWidth={750}
            modalID={
              hasAccountable ? `modal-edit-project-task-by-${role}-${id}` : `modal-edit-project-task-by-${role}-${id}-has-not-accountable`
            }
            formID={`form-edit-task-${role}-${id}`}
            title={title}
            isLoading={false}
            func={this.save}
            disableSubmit={!this.isFormValidated()}
          >
            <form id={`form-edit-task-${role}-${id}`}>
              {/*Thông tin cơ bản*/}
              <fieldset className='scheduler-border'>
                <legend className='scheduler-border'>{translate('task.task_management.edit_basic_info')}</legend>
                <div>
                  <div className={`form-group ${errorTaskName === undefined ? '' : 'has-error'}`}>
                    <label>
                      {translate('task.task_management.name')}
                      <span className='text-red'>*</span>
                    </label>
                    <input type='text' value={taskName} className='form-control' onChange={this.handleTaskNameChange} />
                    <ErrorLabel content={errorTaskName} />
                  </div>
                  <div className={`form-group ${errorTaskDescription === undefined ? '' : 'has-error'}`}>
                    <label>{translate('task.task_management.detail_description')}</label>
                    <QuillEditor
                      id={`task-edit-by-accountable-${this.props.id}`}
                      table={false}
                      embeds={false}
                      quillValueDefault={taskDescriptionDefault}
                      getTextData={this.handleTaskDescriptionChange}
                      maxHeight={180}
                      placeholder={'Mô tả công việc'}
                    />
                    <ErrorLabel content={errorTaskDescription} />
                  </div>

                  <div className='form-group'>
                    <label>{translate('task.task_management.project')}</label>
                    <input
                      className='form-control'
                      value={
                        task &&
                        task.taskProject &&
                        this.props.project.data.list.length !== 0 &&
                        this.props.project.data.list.find((projectItem) => String(projectItem._id) === String(task.taskProject))?.name
                      }
                      disabled={true}
                    />
                  </div>
                </div>
              </fieldset>

              {/*Thông tin chi tiết*/}
              <fieldset className='scheduler-border'>
                <legend className='scheduler-border'>{translate('task.task_management.edit_detail_info')}</legend>
                {/* <div> */}

                <div className='row form-group'>
                  <div className='col-lg-6 col-md-6 col-ms-12 col-xs-12'>
                    <label>{translate('task.task_management.detail_status')}</label>
                    {
                      <SelectBox
                        id={`select-status-${perform}-${role}`}
                        className='form-control select2'
                        style={{ width: '100%' }}
                        items={statusArr}
                        multiple={false}
                        value={statusOptions[0]}
                        onChange={this.handleSelectedStatus}
                      />
                    }
                  </div>

                  {/*Mức ưu tiên*/}
                  <div className='col-lg-6 col-md-6 col-ms-12 col-xs-12'>
                    <label>{translate('task.task_management.detail_priority')}</label>
                    {
                      <SelectBox
                        id={`select-priority-${perform}-${role}`}
                        className='form-control select2'
                        style={{ width: '100%' }}
                        items={priorityArr}
                        multiple={false}
                        value={priorityOptions[0]}
                        onChange={this.handleSelectedPriority}
                      />
                    }
                  </div>
                </div>

                {/* </div> */}
                {/* <div className="row form-group">
                                    <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 ${errorOnStartDate === undefined ? "" : "has-error"}`}>
                                        <label className="control-label">{translate('task.task_management.start_date')}<span className="text-red">*</span></label>
                                        <DatePicker
                                            id={`datepicker2-startdate-${id}`}
                                            value={startDate}
                                            onChange={this.handleChangeTaskStartDate}
                                        />
                                        < TimePicker
                                            id={`time-picker-1-start-time${id}`}
                                            value={startTime}
                                            onChange={this.handleStartTimeChange}
                                        />
                                        <ErrorLabel content={errorOnStartDate} />
                                    </div>
                                    <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 ${errorOnEndDate === undefined ? "" : "has-error"}`}>
                                        <label className="control-label">{translate('task.task_management.end_date')}<span className="text-red">*</span></label>
                                        <DatePicker
                                            id={`datepicker2-enddate-${id}`}
                                            value={endDate}
                                            onChange={this.handleChangeTaskEndDate}
                                        />
                                        < TimePicker
                                            id={`time-picker-2-end-time-${id}`}
                                            value={endTime}
                                            onChange={this.handleEndTimeChange}
                                        />
                                        <ErrorLabel content={errorOnEndDate} />
                                    </div>
                                </div> */}
                {/**Công thức tính của công việc */}
                <div className={` form-group ${errorOnFormulaTask === undefined ? '' : 'has-error'}`}>
                  <label className='control-label' htmlFor='inputProjectTaskFormula'>
                    Công thức tính điểm công việc tự động<span className='text-red'>*</span>
                  </label>
                  <input
                    type='text'
                    className='form-control'
                    id='inputProjectTaskFormula'
                    placeholder='taskTimePoint + taskQualityPoint + taskCostPoint'
                    value={formulaProjectTask}
                    onChange={this.handleChangeTaskFormula}
                  />
                  <ErrorLabel content={errorOnFormulaTask} />

                  <br />
                  <div>
                    <span style={{ fontWeight: 800 }}>Ví dụ: </span>taskTimePoint + taskQualityPoint + taskCostPoint
                  </div>
                  <br />
                  <div>
                    <span style={{ fontWeight: 800 }}>{translate('task_template.parameters')}:</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: 600 }}>taskTimePoint</span> - Điểm yếu tố tiến độ của công việc
                  </div>
                  <div>
                    <span style={{ fontWeight: 600 }}>taskQualityPoint</span> - Điểm yếu tố chất lượng của công việc
                  </div>
                  <div>
                    <span style={{ fontWeight: 600 }}>taskCostPoint</span> - Điểm yếu tố chi phí của công việc
                  </div>
                  <div>
                    <span style={{ fontWeight: 600 }}>p1, p2,...</span> - Thông tin công việc kiểu số
                  </div>
                </div>
                {/**Công thức tính của thành viên công việc */}
                <div className={` form-group ${errorOnFormulaMember === undefined ? '' : 'has-error'}`}>
                  <label className='control-label' htmlFor='inputProjectMemberFormula'>
                    Công thức tính điểm thành viên công việc tự động<span className='text-red'>*</span>
                  </label>
                  <input
                    type='text'
                    className='form-control'
                    id='inputProjectMemberFormula'
                    placeholder='memberTimePoint + memberQualityPoint + memberCostPoint + memberTimedistributionPoint'
                    value={formulaProjectMember}
                    onChange={this.handleChangeMemberFormula}
                  />
                  <ErrorLabel content={errorOnFormulaMember} />

                  <br />
                  <div>
                    <span style={{ fontWeight: 800 }}>Ví dụ: </span>memberTimePoint + memberQualityPoint + memberCostPoint +
                    memberTimedistributionPoint
                  </div>
                  <br />
                  <div>
                    <span style={{ fontWeight: 800 }}>{translate('task_template.parameters')}:</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: 600 }}>memberTimePoint</span> - Điểm yếu tố tiến độ của công việc
                  </div>
                  <div>
                    <span style={{ fontWeight: 600 }}>memberQualityPoint</span> - Điểm yếu tố chất lượng của công việc
                  </div>
                  <div>
                    <span style={{ fontWeight: 600 }}>memberCostPoint</span> - Điểm yếu tố chi phí của thành viên trong công việc
                  </div>
                  <div>
                    <span style={{ fontWeight: 600 }}>memberTimedistributionPoint</span> - Điểm yếu tố phân bố thời gian hợp lý của thành
                    viên trong công việc
                  </div>
                  <div>
                    <span style={{ fontWeight: 600 }}>p1, p2,...</span> - Thông tin công việc kiểu số
                  </div>
                </div>
              </fieldset>

              <TaskInformationForm
                task={task && task}
                handleChangeProgress={this.handleChangeProgress}
                handleInfoBooleanChange={this.handleInfoBooleanChange}
                handleInfoDateChange={this.handleInfoDateChange}
                handleSetOfValueChange={this.handleSetOfValueChange}
                handleChangeNumberInfo={this.handleChangeNumberInfo}
                handleChangeTextInfo={this.handleChangeTextInfo}
                handleChangeListInfo={this.handleChangeListInfo}
                role={role}
                perform={perform}
                value={this.state}
                progress={this.state.progress ? this.state.progress : ''}
              />
              <fieldset className='scheduler-border'>
                <legend className='scheduler-border'>{translate('task.task_management.edit_member_info')}</legend>

                {/*Người thực hiện*/}
                {/* <div className="form-group">
                                    <label>{translate('task.task_management.responsible')}</label>
                                    {unitMembers &&
                                        <SelectBox
                                            id={`select-responsible-employee-${perform}-${role}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={unitMembers}
                                            onChange={this.handleSelectedResponsibleEmployee}
                                            multiple={true}
                                            value={responsibleEmployees}
                                        />
                                    }
                                </div> */}

                {/*Người phê duyệt*/}
                {/* <div className="form-group">
                                    <label>{translate('task.task_management.accountable')}</label>
                                    {unitMembers &&
                                        <SelectBox
                                            id={`select-accountable-employee-${perform}-${role}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={unitMembers}
                                            onChange={this.handleSelectedAccountableEmployee}
                                            multiple={true}
                                            value={accountableEmployees}
                                        />
                                    }
                                </div> */}

                {/*Người tư vấn */}
                <div className='form-group'>
                  <label>{translate('task.task_management.consulted')}</label>
                  {usercompanys && (
                    <SelectBox
                      id={`select-consulted-employee-${perform}-${role}`}
                      className='form-control select2'
                      style={{ width: '100%' }}
                      items={usercompanys.map((x) => {
                        return { value: x._id, text: x.name }
                      })}
                      onChange={this.handleSelectedConsultedEmployee}
                      multiple={true}
                      value={consultedEmployees}
                    />
                  )}
                </div>

                {/*Người giám sát*/}
                <div className='form-group'>
                  <label>{translate('task.task_management.informed')}</label>
                  {usercompanys && (
                    <SelectBox
                      id={`select-informed-employee-${perform}-${role}`}
                      className='form-control select2'
                      style={{ width: '100%' }}
                      items={usercompanys.map((x) => {
                        return { value: x._id, text: x.name }
                      })}
                      onChange={this.handleSelectedInformEmployee}
                      multiple={true}
                      value={informedEmployees}
                    />
                  )}
                </div>
              </fieldset>
            </form>
          </DialogModal>
        </React.Fragment>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { tasks, user, tasktemplates, performtasks, department, project } = state
  return { tasks, user, tasktemplates, performtasks, department, project }
}

const actionGetState = {
  //dispatchActionToProps
  getAllUserSameDepartment: UserActions.getAllUserSameDepartment,
  editTaskByAccountableEmployees: performTaskAction.editTaskByAccountableEmployees,
  getPaginateTasksByUser: taskManagementActions.getPaginateTasksByUser
}

const modalEditTaskByAccountableEmployee = connect(
  mapStateToProps,
  actionGetState
)(withTranslate(ModalEditTaskByAccountableEmployeeProject))
export { modalEditTaskByAccountableEmployee as ModalEditTaskByAccountableEmployeeProject }
