import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { TreeTable, PaginateBar, ToolTip, SelectMulti, DatePicker } from '../../../../common-components'

import { ProjectActions } from '../redux/actions'
import { ProjectPhaseActions } from '../../project-phase/redux/actions'
import { UserActions } from '../../../super-admin/user/redux/actions'
import { getStorage } from '../../../../config'
import { checkIfAbleToCRUDProject, getListDepartments, getListDepartmentsFromListUsers, getUserIdToText, renderLongList, renderProjectTypeText } from './functionHelper'
import { taskManagementActions } from '../../../task/task-management/redux/actions'
import { getTableConfiguration } from '../../../../helpers/tableConfiguration'
import _cloneDeep from 'lodash/cloneDeep'
import Swal from 'sweetalert2'
import dayjs from 'dayjs'
import { ProjectCreateEditFormModal } from '../../project-create/components/projectCreateEditFormModal'
import { ProjectDetailForm } from './detailProject'

import { PROJECT_ACTION_FORM } from '../constants'
import { createUnitKpiActions } from '../../../kpi/organizational-unit/creation/redux/actions'
import { AssetManagerActions } from '../../../asset/admin/asset-information/redux/actions'
import { TagActions } from '../../../bidding/tags/redux/actions'
import { CapacityActions } from '../../../human-resource/capacity/redux/actions'
import { getEmployeeSelectBoxItemsWithEmployeeData } from '../../../task/organizationalUnitHelper'

function ListProjectNew(props) {
  const tableId = 'project-table'
  const defaultConfig = { limit: 5, hiddenColumns: [] }
  const limit = getTableConfiguration(tableId, defaultConfig).limit
  // Khởi tạo state
  const [state, setState] = useState({
    projectName: '',
    startDate: '',
    endDate: '',
    page: 1,
    responsibleEmployees: null,
    projectManager: null,
    perPage: limit || defaultConfig.limit,
    currentRow: null,
    projectDetail: null,
    data: []
  })

  const { project, translate, user, assetsManager } = props
  const userId = getStorage('userId')
  const currentRole = getStorage('currentRole')
  const { projectName, startDate, endDate, page, responsibleEmployees, projectManager, perPage, currentRow, projectDetail, data } = state

  const listUsers = user && user.usersInUnitsOfCompany ? getEmployeeSelectBoxItemsWithEmployeeData(user.usersInUnitsOfCompany) : []
  const idToText = listUsers && listUsers?.length > 0 ? getUserIdToText(listUsers) : {}

  let column = [
    { name: translate('project.name'), key: 'name' },
    { name: translate('project.startDateProject'), key: 'startDate' },
    { name: translate('project.endDateProject'), key: 'endDate' },
    { name: translate('project.manager'), key: 'manager' },
    { name: translate('project.memberProject'), key: 'member' },
    { name: 'Tài sản', key: 'asset' },
    { name: 'Trạng thái', key: 'status' },
    { name: 'Link đến trang phân bổ', key: 'proposalLink' }
  ]

  useEffect(() => {
    props.getAllUserInAllUnitsOfCompany()
    props.getAllOrganizationalUnitKpiSet(null, 1)
    props.getAllAsset({
      status: ['in_use', 'ready_to_use']
    })
    props.getListTag()
    props.getListCapacity()
    props.getProjectsDispatch({ calledId: 'paginate', page, perPage, userId, currentRole })
    // props.getProjectsDispatch({ calledId: 'user_all', userId })
  }, [])

  useEffect(() => {
    let data = []
    if (user?.isLoading === false && project?.isLoading === false && assetsManager?.isLoading === false) {
      // console.log("project: ", project?.data?.paginate)
      let currentProjects = _cloneDeep(project.data.paginate) // Sao chép ra mảng mới
      for (let n in currentProjects) {
        // console.log("currentProject: ", n, currentProjects[n]) 
        data[n] = {
          ...currentProjects[n],
          rawData: currentProjects[n],
          name: currentProjects[n]?.name,
          startDate: dayjs(currentProjects[n]?.startDate).format('HH:mm DD/MM/YYYY') || [],
          endDate: dayjs(currentProjects[n].endDate).format('HH:mm DD/MM/YYYY') || [],
          manager: currentProjects[n]?.projectManager ? (
            <ToolTip dataTooltip={currentProjects[n]?.projectManager.map((item) => idToText[item?._id] ? idToText[item?._id] : item?.name)} />
          ) : null,
          member: currentProjects[n]?.responsibleEmployees ? (
            <ToolTip dataTooltip={currentProjects[n]?.responsibleEmployees.map((item) => idToText[item?._id] ? idToText[item?._id] : item?.name)} />
          ) : null,
          asset: currentProjects[n]?.assets ? <ToolTip dataTooltip={currentProjects[n]?.assets.map((item) => item?.assetName)} /> : null,
          action: ['view'],
          proposalLink: (<a 
                          className="cursor-pointer ml-2 underline" 
                          aria-haspopup="true"
                          aria-expanded="true"
                          href={`/project/project-proposal?id=${currentProjects[n]?._id}`}
                        > Link
                        </a>),
          status: currentProjects[n]?.proposals?.assignment ? <span className="text-green-500">{'Đã có dự liệu phân bổ'}</span> : <span className="text-red-500">{'Chưa có dữ liệu phân bổ'}</span>,
        
        }

        if (checkIfAbleToCRUDProject({ project, user, currentProjectId: currentProjects[n]._id })) {
          data[n] = { ...data[n], action: ['view', 'edit', 'delete'] }
        }
      }

      // console.log("data: ", data)
      setState({
        ...state,
        data: data
      })
    }
  }, [user?.isLoading, project?.isLoading, JSON.stringify(project.data.paginate), currentRow])

  // Sau khi add project mới hoặc edit project thì call lại tất cả list project
  const handleAfterCreateProject = () => {
    let params = {
      calledId: 'paginate',
      projectName: projectName,
      endDate: endDate,
      startDate: startDate,
      page: page,
      perPage: perPage,
      responsibleEmployees: responsibleEmployees,
      projectManager: projectManager,
      userId: userId
    }
    props.getProjectsDispatch({ calledId: 'paginate', page, perPage, userId, currentRole })
  }

  // Thay đổi tên dự án
  const handleChangeName = (e) => {
    const { value } = e.target
    setState({
      ...state,
      projectName: value
    })
  }

  // Thay đổi thành viên tham gia
  const handleChangeMember = (e) => {
    const { value } = e.target
    setState({
      ...state,
      responsibleEmployees: value
    })
  }

  // Thay đổi người quản lý
  const handleChangeManager = (e) => {
    const { value } = e.target
    setState({
      ...state,
      projectManager: value
    })
  }

  const handleChangeStartDate = (value) => {
    let month
    if (value === '') {
      month = null
    } else {
      month = value.slice(3, 7) + '-' + value.slice(0, 2)
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
      month = value.slice(3, 7) + '-' + value.slice(0, 2)
    }

    setState((state) => {
      return {
        ...state,
        endDate: month
      }
    })
  }

  const setPage = (pageNumber) => {
    let data = {
      calledId: 'paginate',
      projectName: projectName,
      endDate: endDate,
      startDate: startDate,
      page: pageNumber,
      perPage: perPage,
      responsibleEmployees: responsibleEmployees,
      projectManager: projectManager,
      userId: userId,
      currentRole: currentRole
    }

    setState({
      ...state,
      page: parseInt(pageNumber)
    })

    props.getProjectsDispatch(data)
  }

  const setLimit = (number) => {
    let data = {
      calledId: 'paginate',
      projectName: projectName,
      endDate: endDate,
      startDate: startDate,
      page: 1,
      perPage: number,
      responsibleEmployees: responsibleEmployees,
      projectManager: projectManager,
      userId: userId,
      currentRole: currentRole
    }

    setState({
      ...state,
      perPage: parseInt(number),
      page: 1
    })
    props.getProjectsDispatch(data)
  }

  // Hiển thị thông tin dự án
  const handleShowDetailInfo = (id) => {
    setState({
      ...state,
      projectDetail: project.data.paginate.find((p) => p?._id === id)
    })
    // props.getAllTasksByProject(id)
    // props.getAllPhaseByProject(id)
    setTimeout(() => {
      window.$(`#modal-detail-project-${id}`).modal('show')
    }, 10)
  }

  // Mở modal thay đổi thông tin
  const handleEdit = (id) => {
    setState({
      ...state,
      currentRow: project.data.paginate.find((p) => p?._id === id)
    })
    // props.getAllTasksByProject(id)
    setTimeout(() => {
      window.$(`#modal-edit-project-new-${id}`).modal('show')
    }, 10)
  }

  // Xoá dự án
  const handleDelete = (id) => {
    let data = {
      calledId: 'paginate',
      projectName: projectName,
      endDate: endDate,
      startDate: startDate,
      page: project && project.lists && project.lists.length === 1 ? page - 1 : page,
      perPage: perPage,
      responsibleEmployees: responsibleEmployees,
      projectManager: projectManager,
      userId: userId,
      currentRole: currentRole
    }

    let currentProject = project.data.paginate.find((p) => p?._id === id)
    Swal.fire({
      title: `Bạn có chắc chắn muốn xóa dự án "${currentProject.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: props.translate('general.no'),
      confirmButtonText: props.translate('general.yes')
    }).then((result) => {
      if (result.value) {
        props.deleteProjectDispatch(id)
        props.getProjectsDispatch(data)
      }
    })
  }

  // Mở modal tạo dự án
  const handleOpenCreateForm = () => {
    window.$('#modal-create-project-new').modal('show')
  }

  const handleUpdateData = () => {
    let startMonth, endMonth
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
      let data = {
        calledId: 'paginate',
        projectName,
        endDate: endDate,
        startDate: startDate,
        page: 1,
        perPage: perPage,
        responsibleEmployees: responsibleEmployees,
        projectManager: projectManager,
        userId: userId,
        currentRole: currentRole
      }

      props.getProjectsDispatch(data)
      setState({
        ...state,
        page: 1
      })
    }
  }

  const totalPage = project && Math.ceil(project.data.totalDocs / perPage)

  return (
    <React.Fragment>
      <ProjectDetailForm
        projectDetailId={projectDetail && projectDetail._id}
        projectDetail={projectDetail}
        currentProjectTasks={projectDetail?.proposals?.tasks}
      // currentProjectPhase={projectPhase && projectPhase.phases}
      />

      {/* <ProjectEditForm
        currentProjectTasks={tasks && tasks.tasksByProject}
        currentProjectPhase={projectPhase && projectPhase.phases}
        projectEditId={currentRow && currentRow._id}
        projectEdit={currentRow}
        handleAfterCreateProject={handleAfterCreateProject}
      /> */}
      <ProjectCreateEditFormModal
        handleAfterCreateProject={handleAfterCreateProject}
        submitFunction={props.createProjectDispatch}
        actionType={PROJECT_ACTION_FORM.CREATE}
      // setParentState={setState}
      // parentState={state}
      />

      <ProjectCreateEditFormModal
        handleAfterCreateProject={handleAfterCreateProject}
        submitFunction={props.editProjectDispatch}
        actionType={PROJECT_ACTION_FORM.EDIT}
        projectEditId={currentRow && currentRow._id}
        projectEdit={currentRow}
      // setParentState={setState}
      // parentState={state}
      />

      <div className='box'>
        <div className='box-body qlcv'>
          <div style={{ height: '40px', display: 'flex', justifyContent: 'space-between' }}>
            {/* Lọc */}
            <div>
              <button
                className='btn btn-primary'
                type='button'
                style={{ marginLeft: 10, backgroundColor: 'transparent', borderRadius: '4px', color: '#367fa9' }}
                onClick={() => {
                  window.$('#projects-filter').slideToggle()
                }}
              >
                <i className='fa fa-filter'></i> {translate('general.filter')}{' '}
              </button>
            </div>

            {/* Button thêm mới */}
            {checkIfAbleToCRUDProject({ project, user }) && (
              <div className='dropdown pull-right' style={{ marginTop: 5 }}>
                <button
                  type='button'
                  className='btn btn-success dropdown-toggle pull-right'
                  onClick={handleOpenCreateForm}
                  data-toggle='dropdown'
                  aria-expanded='true'
                  title={translate('project.add_btn_new')}
                >
                  {translate('project.add_btn_new')}
                </button>
              </div>
            )}
          </div>

          <div id='projects-filter' className='form-inline' style={{ display: 'none' }}>
            {/* Tên dự án */}
            <div className='form-group'>
              <label>{translate('project.name')}</label>
              <input
                className='form-control'
                type='text'
                placeholder={translate('project.search_by_name')}
                name='name'
                onChange={(e) => handleChangeName(e)}
              />
            </div>

            {/* Thành viên dự án */}
            <div className='form-group'>
              <label>{translate('project.member')}</label>
              <input
                className='form-control'
                type='text'
                placeholder={translate('project.search_by_employees')}
                name='name'
                onChange={(e) => handleChangeMember(e)}
              />
            </div>

            {/* Người quản trị */}
            <div className='form-group'>
              <label>{translate('project.manager')}</label>
              <input
                className='form-control'
                type='text'
                placeholder={translate('project.search_by_employees')}
                name='name'
                onChange={(e) => handleChangeManager(e)}
              />
            </div>

            {/* Ngày bắt đầu */}
            <div className='form-group'>
              <label>{translate('project.col_start_time')}</label>
              <DatePicker id='start-date' dateFormat='month-year' value={''} onChange={handleChangeStartDate} disabled={false} />
            </div>

            {/* Ngày kết thúc */}
            <div className='form-group'>
              <label>{translate('project.col_expected_end_time')}</label>
              <DatePicker id='end-date' dateFormat='month-year' value={''} onChange={handleChangeEndDate} disabled={false} />
            </div>

            <div className='form-group'>
              <label></label>
              <button type='button' className='btn btn-success' onClick={() => handleUpdateData()}>
                {translate('project.search')}
              </button>
            </div>
          </div>
          {/* Danh sách các dự án */}
          <div className='qlcv StyleScrollDiv StyleScrollDiv-y mt-4' style={{ maxHeight: '600px' }}>
            <TreeTable
              behaviour='show-children'
              tableSetting={true}
              tableId={tableId}
              viewWhenClickName={true}
              column={column}
              data={data}
              onSetNumberOfRowsPerPage={setLimit}
              titleAction={{
                view: '',
                edit: '',
                delete: ''
              }}
              funcView={handleShowDetailInfo}
              funcEdit={handleEdit}
              funcDelete={handleDelete}
            />
          </div>

          {/* PaginateBar */}

          <PaginateBar
            pageTotal={totalPage ? totalPage : 0}
            currentPage={page}
            display={data && data.length !== 0 && data.length}
            total={project && project.data.totalDocs}
            func={setPage}
          />
        </div>
      </div>
    </React.Fragment>
  )
}

function mapState(state) {
  const { project, user, tasks, projectPhase, createKpiUnit, assetsManager, tag, capacity } = state
  return { project, user, tasks, projectPhase, createKpiUnit, assetsManager, tag, capacity }
}
const actions = {
  getProjectsDispatch: ProjectActions.getProjectsDispatch,
  deleteProjectDispatch: ProjectActions.deleteProjectDispatch,
  createProjectDispatch: ProjectActions.createProjectDispatch,
  getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
  getAllTasksByProject: taskManagementActions.getAllTasksByProject,
  getAllPhaseByProject: ProjectPhaseActions.getAllPhaseByProject,
  editProjectDispatch: ProjectActions.editProjectDispatch,
  getCurrentKPIUnit: createUnitKpiActions.getCurrentKPIUnit,
  getAllOrganizationalUnitKpiSet: createUnitKpiActions.getAllOrganizationalUnitKpiSet,
  getAllAsset: AssetManagerActions.getAllAsset,
  getListTag: TagActions.getListTag,
  getListCapacity: CapacityActions.getListCapacity
}

const connectedExampleManagementTable = connect(mapState, actions)(withTranslate(ListProjectNew))
export { connectedExampleManagementTable as ListProjectNew }
