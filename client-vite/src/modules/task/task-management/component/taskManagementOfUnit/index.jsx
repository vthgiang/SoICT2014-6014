/* eslint-disable no-param-reassign */
import parse from 'html-react-parser'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import Swal from 'sweetalert2'
import { PaginateBar, ToolTip, TreeTable } from '../../../../../common-components'
import { getStorage } from '../../../../../config'
import { getFormatDateFromTime } from '../../../../../helpers/stringMethod'
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration'
import { DashboardEvaluationEmployeeKpiSetAction } from '../../../../kpi/evaluation/dashboard/redux/actions'
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions'
import { UserActions } from '../../../../super-admin/user/redux/actions'
import { ModalPerform } from '../../../task-perform/component/modalPerform'
import { taskManagementActions } from '../../redux/actions'
import { convertDataToExportData, formatPriority, formatStatus, getTotalTimeSheetLogs } from '../functionHelpers'
import TableHeaderComponent from './tableHeader'
import TaskFilterForm from './taskFilterForm'

function initState() {
  const tableId = 'tree-table-task-management-of-unit'
  const defaultConfig = { limit: 20, hiddenColumns: ['3', '7', '8'] }
  const { limit } = getTableConfiguration(tableId, defaultConfig)

  return {
    organizationalUnit: null,
    perPage: limit,
    currentPage: 1,
    tableId,
    selectedData: [],
    currentTab: 'responsible',
    status: ['inprocess', 'wait_for_approval'],
    priority: [],
    special: [],
    name: '',
    startDate: '',
    endDate: '',
    organizationalUnitRole: ['management', 'collabration'],
    tags: []
  }
}

const formatMonth = (value) => {
  return value === '' ? null : `${value.slice(3, 7)}-${value.slice(0, 2)}`
}

const getStatusColor = (status) => {
  switch (status) {
    case 'inprocess':
      return '#385898'
    case 'canceled':
      return '#e86969'
    case 'delayed':
      return '#db8b0b'
    case 'finished':
      return '#31b337'
    default:
      return '#333'
  }
}

const getPriorityColor = (priority) => {
  switch (priority) {
    case 5:
      return '#ff0707'
    case 4:
      return '#ff5707'
    case 3:
      return '#28A745'
    case 2:
      return '#ffa707'
    default:
      return '#808080'
  }
}

function TaskManagementOfUnit(props) {
  const [state, setState] = useState(initState)
  const {
    tasks,
    user,
    translate,
    dashboardEvaluationEmployeeKpiSet,
    getDepartment,
    getAllDepartment,
    getChildrenOfOrganizationalUnitsAsTree,
    getPaginatedTasksByOrganizationalUnit,
    deleteTaskById
  } = props
  const {
    selectBoxUnit,
    currentTaskId,
    currentPage,
    startDate,
    endDate,
    perPage,
    status,
    tags,
    organizationalUnit,
    tableId,
    selectedData,
    organizationalUnitRole,
    responsibleEmployees,
    accountableEmployees,
    creatorEmployees,
    priority,
    special,
    name
  } = state

  const userId = getStorage('userId')

  let currentOrganizationalUnit
  let currentOrganizationalUnitLoading

  // khởi tạo dữ liệu TreeTable
  const column = [
    { name: translate('task.task_management.col_name'), key: 'name' },
    { name: translate('task.task_management.detail_description'), key: 'description' },
    { name: translate('task.task_management.col_organization'), key: 'organization' },
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

  useEffect(() => {
    getDepartment()
    getAllDepartment()
    getChildrenOfOrganizationalUnitsAsTree(localStorage.getItem('currentRole'))
  }, [])

  useEffect(() => {
    if (organizationalUnit && !dashboardEvaluationEmployeeKpiSet?.childrenOrganizationalUnitLoading) {
      setState((prevState) => ({
        ...prevState,
        organizationalUnit: null
      }))
    } else if (!organizationalUnit && dashboardEvaluationEmployeeKpiSet?.childrenOrganizationalUnit) {
      const childrenOrganizationalUnit = []
      const queue = []
      const currentOrganizationalUnit = dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit

      if (currentOrganizationalUnit) {
        childrenOrganizationalUnit.push(currentOrganizationalUnit)
        queue.push(currentOrganizationalUnit)
        while (queue.length > 0) {
          const unit = queue.shift()
          if (unit.children) {
            unit.children.forEach((child) => {
              queue.push(child)
              childrenOrganizationalUnit.push(child)
            })
          }
        }
      }

      const units = childrenOrganizationalUnit.map((item) => item.id)
      const selectedUnit = units[0]

      setState((prevState) => ({
        ...prevState,
        organizationalUnit: [selectedUnit],
        selectBoxUnit: childrenOrganizationalUnit
      }))

      const data = {
        unit: [selectedUnit],
        page: currentPage,
        perPage,
        status,
        priority: [],
        special: [],
        name: null,
        startDate: null,
        endDate: null,
        responsibleEmployees,
        accountableEmployees,
        creatorEmployees,
        organizationalUnitRole
      }

      getPaginatedTasksByOrganizationalUnit(data)
    }
  }, [
    organizationalUnit,
    dashboardEvaluationEmployeeKpiSet?.childrenOrganizationalUnitLoading,
    dashboardEvaluationEmployeeKpiSet?.childrenOrganizationalUnit,
    currentPage,
    perPage,
    status,
    responsibleEmployees,
    accountableEmployees,
    creatorEmployees,
    organizationalUnitRole
  ])

  const currentTasks = tasks && tasks.tasks
  const units = user && user.organizationalUnitsOfUser
  const data = []

  const handleGetDataPerPage = (perPageParam) => {
    const data = {
      unit: organizationalUnit,
      page: 1,
      perPageParam,
      status,
      priority,
      special,
      name,
      startDate,
      endDate,
      responsibleEmployees,
      accountableEmployees,
      creatorEmployees,
      organizationalUnitRole,
      tags
    }
    getPaginatedTasksByOrganizationalUnit(data)

    setState({
      ...state,
      currentPage: 1,
      perPage
    })
  }

  const handleGetDataPagination = (index) => {
    if (state.currentPage !== index) {
      const data = {
        unit: organizationalUnit,
        page: index,
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
        organizationalUnitRole,
        tags
      }
      getPaginatedTasksByOrganizationalUnit(data)
    }
    setState({
      ...state,
      currentPage: index
    })
  }

  const setLimit = (limit) => {
    if (Number(limit) !== state.perPage) {
      // Cập nhật số dòng trang trên một trang hiển thị
      setState({
        ...state,
        perPage: Number(limit)
      })
      handleGetDataPerPage(Number(limit))
    }
  }

  const onSelectedRowsChange = (value) => {
    setState((newState) => {
      return {
        ...newState,
        selectedData: value
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
        break
      default:
        window.$('#tree-table-container').hide()
        window.$('#tasks-list-tree').show()
        break
    }
  }

  const handleUpdateData = () => {
    const startMonth = startDate && new Date(startDate)
    const endMonth = endDate && new Date(endDate)

    if (startMonth && endMonth && startMonth.getTime() > endMonth.getTime()) {
      Swal.fire({
        title: translate('kpi.evaluation.employee_evaluation.wrong_time'),
        type: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
      })
    } else if (organizationalUnit && organizationalUnit.length !== 0) {
      getPaginatedTasksByOrganizationalUnit({
        unit: organizationalUnit,
        page: 1,
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
        organizationalUnitRole,
        tags
      })
    }
  }

  const handleShowModal = (id) => {
    const task = tasks?.tasks?.find((task) => task._id === id)
    const taskName = task ? task.name : ''

    setState((prevState) => ({
      ...prevState,
      currentTaskId: id,
      taskName
    }))

    setTimeout(() => {
      window.$(`#modelPerformTask${id}`).modal('show')
    }, 500)
  }

  const handleSelectOrganizationalUnit = (value) => {
    setState({
      ...state,
      organizationalUnit: value
    })
  }

  const handleSelectOrganizationalUnitRole = (value) => {
    setState({
      ...state,
      organizationalUnitRole: value
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
    const name = e.target.value || null

    setState((prevState) => ({
      ...prevState,
      name
    }))
  }

  const handleChangeStartDate = (value) => {
    setState((prevState) => ({
      ...prevState,
      startDate: formatMonth(value)
    }))
  }

  const handleChangeEndDate = (value) => {
    setState((prevState) => ({
      ...prevState,
      endDate: formatMonth(value)
    }))
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

  const handleTaskTags = (value) => {
    setState({
      ...state,
      tags: value
    })
  }

  const showConfirmationDialog = (title, onConfirm) => {
    Swal.fire({
      title,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: translate('general.no'),
      confirmButtonText: translate('general.yes')
    }).then((result) => {
      if (result.value) {
        onConfirm()
      }
    })
  }

  const handleDelete = async (id) => {
    if (!Array.isArray(id)) {
      const currentTask = tasks.tasks.find((task) => task._id === id)
      const title = `Bạn có chắc chắn muốn xóa công việc "${currentTask.name}"?`
      showConfirmationDialog(title, () => deleteTaskById(id))
    } else {
      const title = 'Bạn có chắc chắn muốn xóa các công việc đã chọn?'
      showConfirmationDialog(title, () => deleteTaskById(id))
    }
  }

  const checkTaskRequestToClose = (task) => {
    const statusColor = getStatusColor(task.status)

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
    const priorityColor = getPriorityColor(priority)

    return (
      <div>
        <span style={{ color: priorityColor }}>{formatPriority(translate, priority)}</span>
      </div>
    )
  }

  const convertProgressData = (progress = 0, startDate, endDate) => {
    const now = moment()
    const start = moment(startDate)
    const end = moment(endDate)

    const totalDuration = end.diff(start)
    const elapsedDuration = now.diff(start)

    let barColor = ''
    if (now.isAfter(end)) {
      barColor = 'red'
    } else if ((totalDuration * progress) / 100 >= elapsedDuration) {
      barColor = 'lime'
    } else {
      barColor = 'gold'
    }

    return (
      <div>
        <div
          className='progress'
          style={{
            backgroundColor: 'rgb(221, 221, 221)',
            textAlign: 'right',
            borderRadius: '3px',
            position: 'relative'
          }}
        >
          <span style={{ position: 'absolute', right: '1px', fontSize: '13px', marginRight: '5px' }}>{`${progress}%`}</span>
          <div
            role='progressbar'
            className='progress-bar'
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            style={{ width: `${progress}%`, maxWidth: '100%', minWidth: '0%', backgroundColor: barColor }}
          />
        </div>
      </div>
    )
  }

  const validateAction = (action) => {
    if (selectedData.length === 0) return false

    return selectedData.every((id) => {
      const actions = data.find((item) => item._id === id)?.action
      return actions && actions.length > 0 && actions.flat(2).includes(action)
    })
  }

  if (currentTasks && currentTasks.length !== 0) {
    const dataTemp = currentTasks

    dataTemp.forEach((task, index) => {
      data[index] = {
        ...task,
        rawData: task,
        name: task.name,
        description: task.description ? parse(task.description) : '',
        organization: task.organizationalUnit ? task.organizationalUnit.name : translate('task.task_management.err_organizational_unit'),
        priority: convertPriorityData(task.priority),
        responsibleEmployees: task.responsibleEmployees ? <ToolTip dataTooltip={task.responsibleEmployees.map((o) => o.name)} /> : null,
        accountableEmployees: task.accountableEmployees ? <ToolTip dataTooltip={task.accountableEmployees.map((o) => o.name)} /> : null,
        creatorEmployees: task.creator?.name,
        startDate: getFormatDateFromTime(task.startDate, 'dd-mm-yyyy'),
        endDate: getFormatDateFromTime(task.endDate, 'dd-mm-yyyy'),
        status: checkTaskRequestToClose(task),
        progress: convertProgressData(task.progress, task.startDate, task.endDate),
        totalLoggedTime: getTotalTimeSheetLogs(task.timesheetLogs),
        parent: task.parent?._id,
        action: []
      }
    })

    data.forEach((task, index) => {
      const tempTask = dataTemp[index]
      const userActions = []

      if (tempTask.creator?._id === userId || tempTask.informedEmployees.includes(userId)) {
        if (tempTask.creator?._id === userId) {
          userActions.push('delete')
        }
        userActions.push('edit')
      }

      if (tempTask.responsibleEmployees?.some((e) => e._id === userId) || tempTask.consultedEmployees?.includes(userId)) {
        userActions.push('edit')
      }

      if (tempTask.accountableEmployees?.some((o) => o._id === userId)) {
        userActions.push('edit', 'delete')
      }

      task.action = [...new Set(userActions)] // Remove duplicates
    })
  }

  if (dashboardEvaluationEmployeeKpiSet) {
    currentOrganizationalUnit = dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit
    currentOrganizationalUnitLoading = dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnitLoading
  }

  const exportData = convertDataToExportData(translate, currentTasks, translate('menu.task_management_of'))

  const currentOrganizationalUnitComponent = () => {
    return (
      <div className='box'>
        <div className='box-body qlcv'>
          <TableHeaderComponent handleDisplayType={handleDisplayType} exportData={exportData} />
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
            </div>
          )}

          <TaskFilterForm
            translate={translate}
            selectBoxUnit={state.selectBoxUnit}
            organizationalUnit={state.organizationalUnit}
            handleSelectOrganizationalUnit={handleSelectOrganizationalUnit}
            organizationalUnitRole={state.organizationalUnitRole}
            handleSelectOrganizationalUnitRole={handleSelectOrganizationalUnitRole}
            status={state.status}
            handleSelectStatus={handleSelectStatus}
            handleSelectPriority={handleSelectPriority}
            handleSelectSpecial={handleSelectSpecial}
            handleChangeName={handleChangeName}
            handleChangeResponsibleEmployees={handleChangeResponsibleEmployees}
            handleChangeAccountableEmployees={handleChangeAccountableEmployees}
            handleChangeCreatorEmployees={handleChangeCreatorEmployees}
            handleChangeStartDate={handleChangeStartDate}
            handleChangeEndDate={handleChangeEndDate}
            handleTaskTags={handleTaskTags}
            tags={state.tags}
            handleUpdateData={handleUpdateData}
          />

          {/* Dạng bảng */}
          <div id='tree-table-container'>
            <TreeTable
              tableId={tableId}
              tableSetting
              allowSelectAll
              behaviour='show-children'
              column={column}
              data={data}
              onSetNumberOfRowsPerPage={setLimit}
              onSelectedRowsChange={onSelectedRowsChange}
              viewWhenClickName
              titleAction={{
                edit: translate('task.task_management.action_edit'),
                delete: translate('task.task_management.action_delete')
              }}
              funcEdit={handleShowModal}
              funcDelete={handleDelete}
            />
          </div>

          {/* Dạng cây */}
          {/* <div id="tasks-list-tree" style={{ display: 'none', marginTop: '30px' }}>
                            <Tree id="tasks-list-treeview"
                                plugins={false}
                                onChanged={handleShowTask}
                                data={dataTree}
                            />
                        </div> */}

          {currentTaskId && <ModalPerform units={units} id={currentTaskId} taskName={state?.taskName ? state?.taskName : ''} />}

          {/* Paginate */}
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

  if (currentOrganizationalUnit) {
    return currentOrganizationalUnitComponent()
  }

  if (currentOrganizationalUnitLoading) {
    return (
      <div className='box'>
        <div className='box-body'>
          <h4>{translate('general.not_org_unit')}</h4>
        </div>
      </div>
    )
  }
}

function mapState(state) {
  const { tasks, user, department, dashboardEvaluationEmployeeKpiSet } = state
  return { tasks, user, department, dashboardEvaluationEmployeeKpiSet }
}

const actionCreators = {
  getPaginatedTasksByOrganizationalUnit: taskManagementActions.getPaginatedTasksByOrganizationalUnit,
  getDepartment: UserActions.getDepartmentOfUser,
  getAllDepartment: DepartmentActions.get,
  getChildrenOfOrganizationalUnitsAsTree: DashboardEvaluationEmployeeKpiSetAction.getChildrenOfOrganizationalUnitsAsTree,
  deleteTaskById: taskManagementActions.deleteTask
}

export default connect(mapState, actionCreators)(withTranslate(TaskManagementOfUnit))
