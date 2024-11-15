import dayjs from 'dayjs'
import parse from 'html-react-parser'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import Swal from 'sweetalert2'
import cloneDeep from 'lodash/cloneDeep'
import {
  DatePicker,
  ExportExcel,
  InputTags,
  PaginateBar,
  SelectBox,
  SelectMulti,
  ToolTip,
  Tree,
  TreeTable
} from '../../../../common-components'
import { getStorage } from '../../../../config'
import { getFormatDateFromTime } from '../../../../helpers/stringMethod'
import { getProjectName } from '../../../../helpers/taskModuleHelpers'

import { getTableConfiguration } from '../../../../helpers/tableConfiguration'
import { ProjectActions } from '../../../project/projects/redux/actions'
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions'
import { UserActions } from '../../../super-admin/user/redux/actions'
import { ModalPerform } from '../../task-perform/component/modalPerform'
import { performTaskAction } from '../../task-perform/redux/actions'
import { taskManagementActions } from '../redux/actions'
import { convertDataToExportData, formatPriority, formatStatus, getTotalTimeSheetLogs } from './functionHelpers'
import { TaskAddModal } from './taskAddModal'
import { AddAttributeForm } from './addAttributeForm'
import { TaskDelegation } from './taskDelegation'
import TaskListView from './taskListView'
import TaskManagementImportForm from './taskManagementImportForm'

const list_to_tree = (list) => {
  const map = {}
  let node
  const roots = []
  let i
  const newarr = []
  for (i = 0; i < list.length; i += 1) {
    map[list[i]._id] = i // initialize the map
    list[i].children = [] // initialize the children
  }

  for (i = 0; i < list.length; i += 1) {
    node = list[i]
    if (node.parent) {
      // if you have dangling branches check that map[node.parentId] exists
      if (map[node.parent._id]) {
        list[map[node.parent._id]].children.push(node)
      } else {
        roots.push(node)
      }
    } else {
      roots.push(node)
    }
  }
  const change = (arr) => {
    arr.map((item) => {
      newarr.push(item)
      change(item.children)
      return true
    })
    return newarr
  }
  const flat = change(roots).map((x) => delete x.children && x)
  return flat
}

const getId = (data) => {
  if (data && typeof data === 'object') return data._id
  return data
}

const isIdValidInArr = (id, arr) => {
  if (!arr) return false
  const result = arr.some((n) => n.id === id)
  return result
}

function TaskManagement(props) {
  const [state, setState] = useState(() => initState())

  const { tasks, user, translate, project } = props
  const {
    currentTaskId,
    currentPage,
    currentTab,
    parentTask,
    status,
    tableId,
    selectedData,
    creatorTime,
    projectSearch,
    tags,
    data,
    currentTaskIdAttribute,
    currentTaskIdDelegation
  } = state

  function initState() {
    const userId = getStorage('userId')
    const tableId = 'tree-table-task-management'
    const defaultConfig = { limit: 20, hiddenColumns: ['3', '4', '5', '8', '9'] }
    const { limit } = getTableConfiguration(tableId, defaultConfig)
    // lấy giá trị từ dashboard công việc cá nhân
    const stateFromTaskDashboard = JSON.parse(localStorage.getItem('stateFromTaskDashboard'))
    localStorage.removeItem('stateFromTaskDashboard')

    return {
      displayType: 'table',
      perPage: limit,
      currentPage: 1,
      tableId,
      selectedData: [],
      currentTab:
        stateFromTaskDashboard && stateFromTaskDashboard.roles && stateFromTaskDashboard.roles.length > 0
          ? stateFromTaskDashboard.roles
          : ['responsible', 'accountable'],
      organizationalUnit: [],
      status:
        stateFromTaskDashboard && stateFromTaskDashboard.status && stateFromTaskDashboard.status.length > 0
          ? stateFromTaskDashboard.status
          : ['inprocess', 'wait_for_approval'],
      priority: [],
      special: [],
      name: '',
      startDate: stateFromTaskDashboard && stateFromTaskDashboard.startDate ? stateFromTaskDashboard.startDate : '',
      endDate: stateFromTaskDashboard && stateFromTaskDashboard.endDate ? stateFromTaskDashboard.endDate : '',
      startDateAfter: '',
      endDateBefore: '',
      startTimer: false,
      pauseTimer: false,
      timer: {
        startedAt: '',
        creator: userId,
        task: ''
      },
      monthTimeSheetLog: '',
      tags: [],
      i: 0
    }
  }
  // useEffect(() => {
  //     window.$(`#modelPerformTask${currentTaskId}`).modal('show')
  // }, [currentTaskId])

  useEffect(() => {
    window.$(`#${currentTaskIdAttribute}-attribute-form`).modal('show')
  }, [currentTaskIdAttribute])

  useEffect(() => {
    if (currentTaskIdDelegation) {
      props.getTaskById(currentTaskIdDelegation) // props.id // đổi thành nextProps.id để lấy dữ liệu về sớm hơn
    }
    window.$(`#modal-task-delegation-${currentTaskIdDelegation}`).modal('show')
  }, [currentTaskIdDelegation])

  useEffect(() => {
    const { perPage, currentPage } = state
    const data = {
      role: state.currentTab,
      unit: [],
      number: currentPage,
      perPage,
      status: state.status,
      priority: null,
      special: null,
      name: null,
      startDate: null,
      endDate: null,
      responsibleEmployees: null,
      accountableEmployees: null,
      creatorEmployees: null,
      creatorTime: null,
      projectSearch: null,
      startDateAfter: null,
      endDateBefore: null,
      aPeriodOfTime: false,
      tags: []
    }

    props.getDepartment()
    props.getAllDepartment()
    props.getPaginateTasks(data)
    props.getProjectsDispatch({ calledId: '' })
  }, [])

  const setLimit = (limit) => {
    if (Number(limit) !== state.perPage) {
      setState({
        ...state,
        perPage: Number(limit)
      })
      handleGetDataPerPage(Number(limit))
    }
  }

  const onSelectedRowsChange = (value) => {
    setState((state) => {
      return {
        ...state,
        selectedData: value
      }
    })
  }

  const startTimer = async (taskId, overrideTSLog = 'no') => {
    const userId = getStorage('userId')
    const timer = {
      creator: userId,
      overrideTSLog
    }
    props.startTimer(taskId, timer).catch((err) => {
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
            props.startTimer(taskId, timer)
          }
        })
      }
    })
  }

  // Hàm xử lý trạng thái lưu kho
  const handleStore = async (id) => {
    await props.editArchivedOfTask(id)
  }

  // Hàm xóa một công việc theo id
  const handleDelete = async (id) => {
    const { tasks, translate } = props
    if (!Array.isArray(id)) {
      const currentTasks = tasks.tasks.find((task) => task._id === id)
      const { progress } = currentTasks
      const action = currentTasks.taskActions.filter((item) => item.creator) // Nếu công việc theo mẫu, chưa hoạt động nào được xác nhận => cho xóa
      Swal.fire({
        title: `Bạn có chắc chắn muốn xóa công việc "${currentTasks.name}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: props.translate('general.no'),
        confirmButtonText: props.translate('general.yes')
      }).then((result) => {
        if (result.value) {
          props.deleteTaskById(id)
        }
      })
    } else
      Swal.fire({
        title: `Bạn có chắc chắn muốn xóa các công việc đã chọn?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: props.translate('general.no'),
        confirmButtonText: props.translate('general.yes')
      }).then((result) => {
        if (result.value) {
          props.deleteTaskById(id)
        }
      })
  }

  const handleGetDataPagination = (index) => {
    const {
      organizationalUnit,
      status,
      priority,
      special,
      name,
      startDate,
      endDate,
      responsibleEmployees,
      accountableEmployees,
      creatorEmployees,
      creatorTime,
      projectSearch,
      tags,
      perPage
    } = state

    if (state.currentPage !== index) {
      const data = {
        role: state.currentTab,
        unit: organizationalUnit,
        number: index,
        perPage,
        status,
        priority,
        special,
        name,
        startDate,
        endDate,
        responsibleEmployees,
        accountableEmployees,
        creatorEmployees,
        creatorTime,
        projectSearch,
        startDateAfter: null,
        endDateBefore: null,
        aPeriodOfTime: false,
        tags
      }

      props.getPaginateTasks(data)
    }

    setState({
      ...state,
      currentPage: index
    })
  }

  const handleGetDataPerPage = (perPage) => {
    const {
      organizationalUnit,
      status,
      priority,
      special,
      name,
      startDate,
      endDate,
      startDateAfter,
      endDateBefore,
      responsibleEmployees,
      accountableEmployees,
      creatorEmployees,
      creatorTime,
      projectSearch,
      tags
    } = state

    const data = {
      role: state.currentTab,
      unit: organizationalUnit,
      number: 1,
      perPage,
      status,
      priority,
      special,
      name,
      startDate,
      endDate,
      responsibleEmployees,
      accountableEmployees,
      creatorEmployees,
      creatorTime,
      projectSearch,
      startDateAfter: null,
      endDateBefore: null,
      aPeriodOfTime: false,
      tags
    }

    props.getPaginateTasks(data)

    setState({
      ...state,
      currentPage: 1,
      perPage
    })
  }

  function handleUpdateData() {
    const { translate } = props
    const {
      organizationalUnit,
      status,
      priority,
      special,
      name,
      startDate,
      endDate,
      responsibleEmployees,
      perPage,
      accountableEmployees,
      creatorEmployees,
      creatorTime,
      projectSearch,
      tags
    } = state
    let startMonth
    let endMonth

    if (startDate && endDate) {
      startMonth = new Date(startDate)
      endMonth = new Date(endDate)
    }

    if (startMonth && endMonth && startMonth.getTime() > endMonth.getTime()) {
      Swal.fire({
        title: translate('kpi.evaluation.employee_evaluation.wrong_time'),
        type: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
      })
    } else {
      const data = {
        role: state.currentTab,
        unit: organizationalUnit,
        number: 1,
        perPage,
        status,
        priority,
        special,
        name,
        startDate,
        endDate,
        responsibleEmployees,
        accountableEmployees,
        creatorEmployees,
        creatorTime,
        projectSearch,
        startDateAfter: null,
        endDateBefore: null,
        aPeriodOfTime: false,
        tags
      }

      props.getPaginateTasks(data)
    }
    setState({
      ...state,
      currentPage: 1
    })
  }

  const handleShowModal = (id) => {
    const { tasks } = props
    const taskLength = tasks?.tasks?.length
    let taskName
    for (let i = 0; i < taskLength; i++) {
      if (tasks.tasks[i]._id === id) {
        taskName = tasks.tasks[i].name
        break
      }
    }
    setState({
      ...state,
      currentTaskId: id,
      taskName
    })
    setTimeout(() => {
      window.$(`#modelPerformTask${id}`).modal('show')
    }, 500)
  }

  /**
   * Mở modal thêm task mới
   * @id task cha của task sẽ thêm (là "" nếu không có cha)
   */
  const handleAddTask = (id) => {
    setState({
      ...state,
      parentTask: id
    })
    window.$(`#addNewTask-undefined`).modal('show')
  }

  const handleRoleChange = (value) => {
    setState({
      ...state,
      currentTab: value
    })
  }

  const handleSelectOrganizationalUnit = (value) => {
    setState({
      ...state,
      organizationalUnit: value
    })
  }

  const handleSelectStatus = (value) => {
    setState({
      ...state,
      status: value
    })
  }

  const handleSelectPriority = (value) => {
    setState({
      ...state,
      priority: value
    })
  }

  const handleSelectSpecial = (value) => {
    setState({
      ...state,
      special: value
    })
  }

  const handleChangeName = (e) => {
    let name = e.target.value
    if (name === '') {
      name = null
    }

    setState({
      ...state,
      name
    })
  }

  const handleChangeStartDate = (value) => {
    let month
    if (value === '') {
      month = null
    } else {
      month = `${value.slice(3, 7)}-${value.slice(0, 2)}`
    }

    setState((state) => {
      return {
        ...state,
        startDate: month
      }
    })
  }

  const handleChangeEndDate = (value) => {
    let month
    if (value === '') {
      month = null
    } else {
      month = `${value.slice(3, 7)}-${value.slice(0, 2)}`
    }

    setState((state) => {
      return {
        ...state,
        endDate: month
      }
    })
  }

  const handleDisplayType = (displayType) => {
    setState({
      ...state,
      displayType
    })
    switch (displayType) {
      case 'table':
        window.$('#tree-table-container').show()
        window.$('#tasks-list-tree').hide()
        window.$('#tasks-list').hide()
        break
      case 'list':
        window.$('#tasks-list').show()
        window.$('#tree-table-container').hide()
        window.$('#tasks-list-tree').hide()
        break
      default:
        window.$('#tree-table-container').hide()
        window.$('#tasks-list-tree').show()
        window.$('#tasks-list').hide()
        break
    }
  }

  const handleShowTask = (e, data) => {
    const id = data && data.node && data.node.original ? data.node.original._id : ''
    const idValid = tasks?.tasks ? tasks.tasks.some((t) => t._id === id) : null

    if (id && idValid) {
      setState({
        ...state,
        currentTaskId: id
      })
      window.$(`#modelPerformTask${id}`).modal('show')
    }
  }

  const handleChangeResponsibleEmployees = (e) => {
    const { value } = e.target
    setState({
      ...state,
      responsibleEmployees: value
    })
  }

  const handleChangeAccountableEmployees = (e) => {
    const { value } = e.target
    setState({
      ...state,
      accountableEmployees: value
    })
  }

  const handleChangeCreatorEmployees = (e) => {
    const { value } = e.target
    setState({
      ...state,
      creatorEmployees: value
    })
  }

  const handleSelectCreatorTime = (value) => {
    setState({
      ...state,
      creatorTime: value[0]
    })
  }

  const handleSelectTaskProject = (value) => {
    setState({
      ...state,
      projectSearch: value
    })
  }

  const handleTaskTags = (value) => {
    setState({
      ...state,
      tags: value
    })
  }

  const checkTaskRequestToClose = (task) => {
    const { translate } = props
    let statusColor = ''
    switch (task.status) {
      case 'inprocess':
        statusColor = '#385898'
        break
      case 'canceled':
        statusColor = '#e86969'
        break
      case 'delayed':
        statusColor = '#db8b0b'
        break
      case 'finished':
        statusColor = '#31b337'
        break
      default:
        statusColor = '#333'
    }
    if (task.requestToCloseTask && task.requestToCloseTask.requestStatus === 1) {
      return (
        <div>
          <span style={{ color: '#385898' }}>{translate('task.task_management.inprocess')}</span>&nbsp; - &nbsp;
          <span style={{ color: '#333' }}>{translate('task.task_management.requested_to_close')}</span>
        </div>
      )
    }
    return (
      <div>
        <span style={{ color: statusColor }}>{formatStatus(translate, task.status)}</span>
      </div>
    )
  }

  const convertPriorityData = (priority) => {
    const { translate } = props
    let priorityColor = ''
    switch (priority) {
      case 5:
        priorityColor = '#ff0707'
        break
      case 4:
        priorityColor = '#ff5707'
        break
      case 3:
        priorityColor = '#28A745'
        break
      case 2:
        priorityColor = '#ffa707'
        break
      default:
        priorityColor = '#808080'
    }
    return (
      <div>
        <span style={{ color: priorityColor }}> {formatPriority(translate, priority)}</span>
      </div>
    )
  }

  const convertProgressData = (progress = 0, startDate, endDate) => {
    const now = dayjs(new Date())
    const end = dayjs(endDate)
    const start = dayjs(startDate)
    const period = end.diff(start)
    const upToNow = now.diff(start)
    let barColor = ''
    if (now.diff(end) > 0) barColor = 'red'
    else if ((period * progress) / 100 - upToNow >= 0) barColor = 'lime'
    else barColor = 'gold'
    return (
      <div
        className='progress'
        style={{ backgroundColor: 'rgb(221, 221, 221)', textAlign: 'right', borderRadius: '3px', position: 'relative' }}
      >
        <span style={{ position: 'absolute', right: '1px', fontSize: '13px', marginRight: '5px' }}>{`${progress}%`}</span>
        <div
          role='progressbar'
          className='progress-bar'
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          style={{ width: `${`${progress}%`}`, maxWidth: '100%', minWidth: '0%', backgroundColor: barColor }}
        />
      </div>
    )
  }

  const handleOpenModalImport = () => {
    window.$('#modal_import_tasks').modal('show')
  }

  /**
   * Function kiểm tra action tương ứng cho các dòng đã chọn
   * @param {*} action : action cần kiểm tra
   */

  const validateAction = (action) => {
    const { selectedData, data } = state
    if (selectedData.length === 0) return false
    for (let i = 0; i < selectedData.length; i++) {
      const actions = data.find((x) => x._id === selectedData[i])?.action
      if (!actions || actions.length === 0) return false
      if (!actions.flat(2).includes(action)) return false
    }
    return true
  }

  let units = []

  useEffect(() => {
    if (!props?.tasks?.loadingPaginateTasks || !props?.project?.isLoading) {
      const currentTasks = cloneDeep(props.tasks.tasks)
      const data = []
      let dataTree = []

      if (currentTasks && currentTasks.length) {
        const idTaskProjectRoot = 'task-project-root'
        for (const n in currentTasks) {
          data[n] = {
            ...currentTasks[n],
            rawData: currentTasks[n],
            name: currentTasks[n].name,
            description: currentTasks[n].description ? parse(currentTasks[n].description) : null,
            organization: currentTasks[n].organizationalUnit
              ? currentTasks[n].organizationalUnit.name
              : translate('task.task_management.err_organizational_unit'),
            project: currentTasks[n].taskProject ? getProjectName(currentTasks[n].taskProject, project.data && project.data.list) : null,
            priority: convertPriorityData(currentTasks[n].priority),
            responsibleEmployees: currentTasks[n].responsibleEmployees ? (
              <ToolTip dataTooltip={currentTasks[n].responsibleEmployees.map((o) => o.name)} />
            ) : null,
            accountableEmployees: currentTasks[n].accountableEmployees ? (
              <ToolTip dataTooltip={currentTasks[n].accountableEmployees.map((o) => o.name)} />
            ) : null,
            creatorEmployees: currentTasks[n].creator ? currentTasks[n].creator.name : null,
            startDate: getFormatDateFromTime(currentTasks[n].startDate, 'dd-mm-yyyy'),
            endDate: getFormatDateFromTime(currentTasks[n].endDate, 'dd-mm-yyyy'),
            status: checkTaskRequestToClose(currentTasks[n]),
            progress: convertProgressData(currentTasks[n].progress, currentTasks[n].startDate, currentTasks[n].endDate),
            totalLoggedTime: getTotalTimeSheetLogs(currentTasks[n].timesheetLogs),
            parent: currentTasks[n].parent ? currentTasks[n].parent._id : null,
            attributes: currentTasks[n].attributes ? currentTasks[n].attributes : [],
            isAutomaticallyCreated: currentTasks[n]?.isAutomaticallyCreated
          }
          let archived = null
          if (currentTasks[n].status === 'finished' || currentTasks[n].status === 'delayed' || currentTasks[n].status === 'canceled') {
            if (currentTasks[n].isArchived === true) {
              archived = 'restore'
            } else archived = 'store'
          }

          if (
            (currentTasks[n].creator && currentTasks[n].creator._id === userId) ||
            currentTasks[n].informedEmployees.filter((o) => o._id === userId).length > 0
          ) {
            let del = null
            if (currentTasks[n].creator._id === userId) {
              del = 'delete'
            }
            data[n] = { ...data[n], action: ['edit', ['add', archived, del, ['addAttribute', 'delegate']]] }
          }
          if (
            (currentTasks[n].responsibleEmployees && currentTasks[n].responsibleEmployees.find((e) => e._id === userId)) ||
            (currentTasks[n].consultedEmployees && currentTasks[n].consultedEmployees.filter((o) => o._id === userId).length > 0)
          ) {
            data[n] = { ...data[n], action: ['edit', 'startTimer', ['add', archived, ['delegate']]] }
          }
          if (currentTasks[n].accountableEmployees && currentTasks[n].accountableEmployees.filter((o) => o._id === userId).length > 0) {
            data[n] = { ...data[n], action: ['edit', 'startTimer', ['add', archived, 'delete', ['addAttribute', 'delegate']]] }
          }
        }

        let convertDataProject = []
        if (project?.data?.list?.length)
          convertDataProject =
            project &&
            project.data &&
            project.data.list.map((p) => {
              return {
                ...p,
                id: `pj${p._id}`,
                parent: `pj${getId(p.parent)}`,
                isTask: false
              }
            })

        const convertDataTask = currentTasks
          ? currentTasks.map((t) => {
              return {
                ...t,
                id: `t${t._id}`,
                parent: `t${getId(t.parent)}`,
                taskProject: `pj${getId(t.taskProject)}`,
                isTask: true
              }
            })
          : []

        const getDataTree = [...convertDataProject, ...convertDataTask]
        const idProjectNull = 'project_null'
        dataTree = [
          ...dataTree,
          {
            _id: idProjectNull,
            id: idProjectNull,
            icon: 'glyphicon glyphicon-folder-open',
            text: 'Không có chủ đề',
            state: { opened: true },
            parent: '#'
          }
        ]
        for (let i = 0; i < getDataTree.length; i++) {
          const node = getDataTree[i]
          if (node.parent || node.taskProject) {
            // Có thông tin về dự án cha/công việc cha
            dataTree = [
              ...dataTree,
              {
                ...node,
                id: node.id,
                icon: node.isTask ? 'fa fa-file-text-o' : 'glyphicon glyphicon-folder-open',
                text: node.name,
                state: { opened: true },
                parent: isIdValidInArr(getId(node.parent), getDataTree)
                  ? getId(node.parent)
                  : isIdValidInArr(getId(node.taskProject), getDataTree)
                    ? getId(node.taskProject)
                    : !node.code
                      ? idProjectNull
                      : '#'
              }
            ]
          } // Không có cả thông tin về dự án or công việc cha
          else if (!node.code) {
            // node này là một công việc - tại thời điểm này (17/12/2020) chỉ có dự án mới có mã code
            dataTree = [
              ...dataTree,
              {
                ...node,
                id: node.id,
                icon: 'fa fa-file-text-o',
                text: node.name,
                state: { opened: true },
                parent: '#'
              }
            ]
          } else {
            // node này là một dự án
            dataTree = [
              ...dataTree,
              {
                ...node,
                id: node.id,
                icon: 'glyphicon glyphicon-folder-open',
                text: node.name,
                state: { opened: true },
                parent: '#'
              }
            ]
          }
        }
      }

      setState({
        ...state,
        data,
        dataTree,
        currentTasks
      })
    }
  }, [JSON.stringify(props?.tasks?.tasks), JSON.stringify(props?.project?.data?.list)])

  const checkHasComponent = (name) => {
    const { auth } = props
    let result = false
    auth?.components?.length &&
      auth.components.forEach((component) => {
        if (component.name === name) result = true
      })
    return result
  }

  const handleChangeAddRowAttribute = (name, value) => {
    setState({
      ...state,
      [name]: value
    })
  }

  const handleAddAttribute = (id, attributes) => {
    setState({
      ...state,
      currentTaskIdAttribute: id,
      attributes: attributes.map((a) => (a = { ...a, addOrder: a._id }))
    })
    window.$(`#${id}-attribute-form`).modal('show')
  }

  const handleDelegate = (id) => {
    const { tasks } = props
    const taskLength = tasks?.tasks?.length
    let taskName
    for (let i = 0; i < taskLength; i++) {
      if (tasks.tasks[i]._id === id) {
        taskName = tasks.tasks[i].name
        break
      }
    }
    setState({
      ...state,
      currentTaskIdDelegation: id,
      taskNameDelegation: taskName
    })
    window.$(`#modal-task-delegation-${id}`).modal('show')
  }

  const { currentTasks } = state
  // kiểm tra vai trò của người dùng
  let userId = getStorage('userId')

  if (user) units = user.organizationalUnitsOfUser

  // khởi tạo dữ liệu TreeTable
  const column = [
    { name: translate('task.task_management.col_name'), key: 'name' },
    { name: translate('task.task_management.detail_description'), key: 'description' },
    { name: translate('task.task_management.col_organization'), key: 'organization' },
    { name: translate('task.task_management.col_project'), key: 'project' },
    { name: translate('task.task_management.col_priority'), key: 'priority' },
    { name: translate('task.task_management.responsible'), key: 'responsibleEmployees' },
    { name: translate('task.task_management.accountable'), key: 'accountableEmployees' },
    { name: translate('task.task_management.creator'), key: 'creatorEmployees' },
    { name: translate('task.task_management.col_start_date'), key: 'startDate' },
    { name: translate('task.task_management.col_end_date'), key: 'endDate' },
    { name: translate('task.task_management.col_status'), key: 'status' },
    { name: translate('task.task_management.col_progress'), key: 'progress' },
    { name: translate('task.task_management.col_logged_time'), key: 'totalLoggedTime' }
  ]

  let listProject = []
  if (project && project.data && project.data.list) {
    project.data.list.forEach((x) => {
      listProject = [...listProject, { value: x._id, text: x.name }]
    })
  }

  let exportData
  if (state.currentTasks) exportData = convertDataToExportData(translate, state.currentTasks, translate('menu.task_management'))
  return (
    <div className='box'>
      <div className='box-body qlcv'>
        <div style={{ height: '40px', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <button
              className='btn btn-primary'
              type='button'
              style={{ marginLeft: 10, backgroundColor: 'transparent', borderRadius: '4px', color: '#367fa9' }}
              title='Dạng bảng'
              onClick={() => handleDisplayType('table')}
            >
              <i className='fa fa-table' /> Dạng bảng
            </button>
            <button
              className='btn btn-primary'
              type='button'
              style={{ marginLeft: 10, backgroundColor: 'transparent', borderRadius: '4px', color: '#367fa9' }}
              title='Dạng cây'
              onClick={() => handleDisplayType('tree')}
            >
              <i className='fa fa-sitemap' /> Dạng cây
            </button>
            <button
              className='btn btn-primary'
              type='button'
              style={{ marginLeft: 10, backgroundColor: 'transparent', borderRadius: '4px', color: '#367fa9' }}
              title='Dạng danh sách'
              onClick={() => handleDisplayType('list')}
            >
              <i className='fa fa-list' /> Dạng danh sách
            </button>
            <button
              className='btn btn-primary'
              type='button'
              style={{ marginLeft: 10, backgroundColor: 'transparent', borderRadius: '4px', color: '#367fa9' }}
              onClick={() => {
                window.$('#tasks-filter').slideToggle()
              }}
            >
              <i className='fa fa-filter' /> Lọc
            </button>
          </div>

          <div style={{ display: 'flex', marginBottom: 6 }}>
            {currentTab !== 'informed' && (
              <>
                {checkHasComponent('button-import-task') ? (
                  <div className='dropdown'>
                    <button
                      type='button'
                      className='btn btn-success dropdown-toggler'
                      data-toggle='dropdown'
                      aria-expanded='true'
                      title='Thêm'
                    >
                      {translate('task_template.add')}
                    </button>
                    <ul className='dropdown-menu pull-right'>
                      <li>
                        <a
                          href='#'
                          title='ImportForm'
                          onClick={() => {
                            handleAddTask('')
                          }}
                        >
                          {translate('task_template.add')}
                        </a>
                      </li>
                      <li>
                        <a href='#' title='Import file excell' onClick={handleOpenModalImport}>
                          {translate('task_template.import')}
                        </a>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <button
                    type='button'
                    onClick={() => {
                      handleAddTask('')
                    }}
                    className='btn btn-success pull-right'
                    title={translate('task.task_management.add_title')}
                  >
                    {translate('task.task_management.add_task')}
                  </button>
                )}
              </>
            )}

            {exportData && (
              <ExportExcel id='list-task-employee' buttonName='Báo cáo' exportData={exportData} style={{ marginLeft: '10px' }} />
            )}
          </div>

          <TaskManagementImportForm />
          <TaskAddModal currentTasks={currentTasks && currentTasks.length !== 0 && list_to_tree(currentTasks)} parentTask={parentTask} />
        </div>

        {selectedData && selectedData.length > 0 && (
          <div className='form-inline' style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              disabled={!validateAction('delete')}
              style={{ margin: '5px' }}
              type='button'
              className='btn btn-danger pull-right'
              title={translate('general.delete_option')}
              onClick={() => handleDelete(selectedData)}
            >
              {translate('general.delete_option')}
            </button>
            <button
              disabled={!(validateAction('store') || validateAction('restore'))}
              style={{ margin: '5px' }}
              type='button'
              className='btn btn-info pull-right'
              title={translate('task.task_management.edit_status_archived_of_task')}
              onClick={() => handleStore(selectedData)}
            >
              {translate('task.task_management.edit_status_archived_of_task')}
            </button>
          </div>
        )}

        <div id='tasks-filter' className='form-inline' style={{ display: 'none' }}>
          <div className='form-group'>
            <label>{translate('task.task_management.department')}</label>
            {units && (
              <SelectMulti
                id='multiSelectUnit1'
                defaultValue={units.map((item) => item._id)}
                items={units.map((item) => {
                  return { value: item._id, text: item.name }
                })}
                onChange={handleSelectOrganizationalUnit}
                options={{
                  nonSelectedText: translate('task.task_management.select_department'),
                  allSelectedText: translate(`task.task_management.select_all_department`)
                }}
              />
            )}
          </div>
          <div className='form-group'>
            <label>{translate('task.task_management.status')}</label>
            <SelectMulti
              id='multiSelectStatus'
              value={status}
              items={[
                { value: 'inprocess', text: translate('task.task_management.inprocess') },
                { value: 'wait_for_approval', text: translate('task.task_management.wait_for_approval') },
                { value: 'finished', text: translate('task.task_management.finished') },
                { value: 'delayed', text: translate('task.task_management.delayed') },
                { value: 'canceled', text: translate('task.task_management.canceled') }
              ]}
              onChange={handleSelectStatus}
              options={{
                nonSelectedText: translate('task.task_management.select_status'),
                allSelectedText: translate('task.task_management.select_all_status')
              }}
            />
          </div>
          <div className='form-group'>
            <label>{translate('task.task_management.priority')}</label>
            <SelectMulti
              id='multiSelectPriority'
              defaultValue={[
                translate('task.task_management.urgent'),
                translate('task.task_management.high'),
                translate('task.task_management.standard'),
                translate('task.task_management.average'),
                translate('task.task_management.low')
              ]}
              items={[
                { value: '5', text: translate('task.task_management.urgent') },
                { value: '4', text: translate('task.task_management.high') },
                { value: '3', text: translate('task.task_management.standard') },
                { value: '2', text: translate('task.task_management.average') },
                { value: '1', text: translate('task.task_management.low') }
              ]}
              onChange={handleSelectPriority}
              options={{
                nonSelectedText: translate('task.task_management.select_priority'),
                allSelectedText: translate('task.task_management.select_all_priority')
              }}
            />
          </div>

          <div className='form-group'>
            <label>{translate('task.task_management.name')}</label>
            <input
              className='form-control'
              type='text'
              placeholder={translate('task.task_management.search_by_name')}
              name='name'
              onChange={(e) => handleChangeName(e)}
            />
          </div>

          <div className='form-group'>
            <label>{translate('task.task_management.special')}</label>
            <SelectMulti
              id='multiSelectCharacteristic'
              defaultValue={[translate('task.task_management.store'), translate('task.task_management.current_month')]}
              items={[
                { value: 'stored', text: translate('task.task_management.stored') },
                { value: 'currentMonth', text: translate('task.task_management.current_month') },
                { value: 'request_to_close', text: 'Chưa phê duyệt kết thúc' }
              ]}
              onChange={handleSelectSpecial}
              options={{
                nonSelectedText: translate('task.task_management.select_special'),
                allSelectedText: translate('task.task_management.select_all_special')
              }}
            />
          </div>

          <div className='form-group'>
            <label>{translate('task.task_management.role')}</label>
            <SelectMulti
              id='select-task-role'
              items={[
                { value: 'responsible', text: translate('task.task_management.responsible') },
                { value: 'accountable', text: translate('task.task_management.accountable') },
                { value: 'consulted', text: translate('task.task_management.consulted') },
                { value: 'creator', text: translate('task.task_management.creator') },
                { value: 'informed', text: translate('task.task_management.informed') }
              ]}
              value={currentTab}
              onChange={handleRoleChange}
              options={{
                nonSelectedText: translate('task.task_management.select_role'),
                allSelectedText: translate('task.task_management.select_all_role')
              }}
            />
          </div>

          <div className='form-group'>
            <label>{translate('task.task_management.col_project')}</label>
            {listProject && (
              <SelectBox
                id='select-project-search'
                className='form-control select2'
                style={{ width: '100%' }}
                items={listProject}
                value={projectSearch}
                onChange={handleSelectTaskProject}
                multiple
                options={{ placeholder: 'Chọn dự án' }}
              />
            )}
          </div>

          {/* Người thực hiện */}
          <div className='form-group'>
            <label>{translate('task.task_management.responsible')}</label>
            <input
              className='form-control'
              type='text'
              placeholder={translate('task.task_management.search_by_employees')}
              name='name'
              onChange={(e) => handleChangeResponsibleEmployees(e)}
            />
          </div>

          {/* Người phê duyệt */}
          <div className='form-group'>
            <label>{translate('task.task_management.accountable')}</label>
            <input
              className='form-control'
              type='text'
              placeholder={translate('task.task_management.search_by_employees')}
              name='name'
              onChange={(e) => handleChangeAccountableEmployees(e)}
            />
          </div>

          {/* Người thiết lập */}
          <div className='form-group'>
            <label>{translate('task.task_management.creator')}</label>
            <input
              className='form-control'
              type='text'
              placeholder={translate('task.task_management.search_by_employees')}
              name='name'
              onChange={(e) => handleChangeCreatorEmployees(e)}
            />
          </div>

          <div className='form-group'>
            <label>{translate('task.task_management.start_date')}</label>
            <DatePicker id='start-date' dateFormat='month-year' value='' onChange={handleChangeStartDate} disabled={false} />
          </div>

          <div className='form-group'>
            <label>{translate('task.task_management.end_date')}</label>
            <DatePicker id='end-date' dateFormat='month-year' value='' onChange={handleChangeEndDate} disabled={false} />
          </div>

          <div className='form-group'>
            <label>{translate('task.task_management.creator_time')}</label>
            <SelectBox
              id='multiSelectCreatorTime'
              className='form-control select2'
              style={{ width: '100%' }}
              items={[
                { value: '', text: '--- Chọn ---' },
                { value: 'currentMonth', text: translate('task.task_management.current_month') },
                { value: 'currentWeek', text: translate('task.task_management.current_week') }
              ]}
              value={creatorTime}
              onChange={handleSelectCreatorTime}
              options={{ minimumResultsForSearch: 100 }}
            />
          </div>

          <div className='form-group'>
            <label>Tags</label>
            <InputTags id='task-personal' onChange={handleTaskTags} value={tags} />
          </div>

          <div className='form-group'>
            <label />
            <button type='button' className='btn btn-success' onClick={() => handleUpdateData()}>
              {translate('task.task_management.search')}
            </button>
          </div>
        </div>

        {currentTaskId && <ModalPerform units={units} id={currentTaskId} taskName={state?.taskName ? state?.taskName : ''} />}

        {currentTaskIdAttribute && state.attributes && (
          <AddAttributeForm
            handleChangeAddRowAttribute={handleChangeAddRowAttribute}
            i={state.i}
            id={state.currentTaskIdAttribute}
            attributeOwner='taskAttributes'
            translation='manage_policy.task'
            taskID={state.currentTaskIdAttribute}
            taskAttributes={state.attributes}
          />
        )}

        {user && user.organizationalUnitsOfUser && currentTaskIdDelegation && (
          <TaskDelegation id={currentTaskIdDelegation} taskId={currentTaskIdDelegation} taskName={state.taskNameDelegation} />
        )}
        {/* Dạng bảng */}
        <div id='tree-table-container' style={{ marginTop: '20px' }}>
          {tasks?.loadingPaginateTasks ? (
            <div className='table-info-panel'>{translate('general.loading')}</div>
          ) : (
            <TreeTable
              tableId={tableId}
              tableSetting
              allowSelectAll
              behaviour='show-children'
              column={column}
              data={data || []}
              onSetNumberOfRowsPerPage={setLimit}
              onSelectedRowsChange={onSelectedRowsChange}
              viewWhenClickName
              titleAction={{
                edit: translate('task.task_management.action_edit'),
                delete: translate('task.task_management.action_delete'),
                store: translate('task.task_management.action_store'),
                restore: translate('task.task_management.action_restore'),
                add: translate('task.task_management.action_add'),
                startTimer: translate('task.task_management.action_start_timer'),
                addAttribute: translate('task.task_management.action_add_attribute'),
                delegate: translate('task.task_management.action_delegate')
              }}
              funcEdit={handleShowModal}
              funcAdd={handleAddTask}
              funcStartTimer={startTimer}
              funcStore={handleStore}
              funcDelete={handleDelete}
              funcAddAttribute={handleAddAttribute}
              funcDelegate={handleDelegate}
            />
          )}
        </div>

        {/* Dạng cây */}
        <div id='tasks-list-tree' style={{ display: 'none', marginTop: '30px' }}>
          <Tree id='tasks-list-treeview' plugins={false} onChanged={handleShowTask} data={state?.dataTree ? state.dataTree : []} />
        </div>

        <div id='tasks-list' style={{ display: 'none', marginTop: '30px' }}>
          {tasks?.loadingPaginateTasks ? (
            <span>{translate('general.loading')}</span>
          ) : currentTasks?.length ? (
            <TaskListView
              data={state.currentTasks}
              project={project}
              funcEdit={handleShowModal}
              funcAdd={handleAddTask}
              funcStartTimer={startTimer}
              funcStore={handleStore}
              funcDelete={handleDelete}
            />
          ) : (
            <span>{translate('confirm.no_data')}</span>
          )}
        </div>

        <PaginateBar
          display={tasks.tasks?.length}
          total={tasks.totalCount}
          pageTotal={tasks.pages}
          currentPage={currentPage}
          func={handleGetDataPagination}
        />
      </div>
    </div>
  )
}

function mapState(state) {
  const { tasks, user, department, project, auth } = state
  return { tasks, user, department, project, auth }
}

const actionCreators = {
  getPaginateTasks: taskManagementActions.getPaginateTasks,
  editArchivedOfTask: performTaskAction.editArchivedOfTask,
  getDepartment: UserActions.getDepartmentOfUser,
  startTimer: performTaskAction.startTimerTask,
  deleteTaskById: taskManagementActions.deleteTask,
  getAllDepartment: DepartmentActions.get,
  getProjectsDispatch: ProjectActions.getProjectsDispatch,
  getTaskById: performTaskAction.getTaskById
}
export default connect(mapState, actionCreators)(withTranslate(TaskManagement))
