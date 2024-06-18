import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import _cloneDeep from 'lodash/cloneDeep'
import Swal from 'sweetalert2'
import dayjs from 'dayjs'
import { TreeTable, PaginateBar, ToolTip, SelectMulti, DatePicker } from '../../../../common-components'
import ProjectCreateForm from './createProject'
import ProjectEditForm from './editProject'
import { ProjectDetailForm } from './detailProject'
import { ProjectActions } from '../redux/actions'
import { ProjectPhaseActions } from '../../project-phase/redux/actions'
import { UserActions } from '../../../super-admin/user/redux/actions'
import { getStorage } from '../../../../config'
import { checkIfAbleToCRUDProject, renderProjectTypeText } from './functionHelper'
import { taskManagementActions } from '../../../task/task-management/redux/actions'
import { getTableConfiguration } from '../../../../helpers/tableConfiguration'

function ListProject(props) {
  const tableId = 'project-table'
  const defaultConfig = { limit: 5, hiddenColumns: [] }
  const { limit } = getTableConfiguration(tableId, defaultConfig)
  // Khởi tạo state
  const [state, setState] = useState({
    projectName: '',
    projectType: '',
    startDate: '',
    endDate: '',
    page: 1,
    creatorEmployee: null,
    responsibleEmployees: null,
    projectManager: null,
    perPage: limit || defaultConfig.limit,
    currentRow: null,
    projectDetail: null,
    data: []
  })

  const { project, translate, user, tasks, projectPhase } = props
  const userId = getStorage('userId')
  const {
    projectName,
    startDate,
    endDate,
    projectType,
    page,
    creatorEmployee,
    responsibleEmployees,
    projectManager,
    perPage,
    currentRow,
    projectDetail,
    data
  } = state

  useEffect(() => {
    props.getProjectsDispatch({ calledId: 'paginate', page, perPage, userId })
    props.getProjectsDispatch({ calledId: 'user_all', userId })
    props.getAllUserInAllUnitsOfCompany()
  }, [])

  useEffect(() => {
    const data = []
    if (user?.isLoading === false && project?.isLoading === false) {
      const currentProjects = _cloneDeep(project.data.paginate) // Sao chép ra mảng mới
      for (const n in currentProjects) {
        data[n] = {
          ...currentProjects[n],
          rawData: currentProjects[n],
          name: currentProjects[n]?.name,
          projectType: translate(renderProjectTypeText(currentProjects[n]?.projectType)),
          startDate: dayjs(currentProjects[n]?.startDate).format('HH:mm DD/MM/YYYY') || [],
          endDate: dayjs(currentProjects[n].endDate).format('HH:mm DD/MM/YYYY') || [],
          creator: currentProjects[n]?.creator?.name,
          manager: currentProjects[n]?.projectManager ? (
            <ToolTip dataTooltip={currentProjects[n]?.projectManager.map((o) => o.name)} />
          ) : null,
          member: currentProjects[n]?.responsibleEmployees ? (
            <ToolTip dataTooltip={currentProjects[n]?.responsibleEmployees.map((o) => o.name)} />
          ) : null,
          action: ['view']
        }

        if (checkIfAbleToCRUDProject({ project, user, currentProjectId: currentProjects[n]._id })) {
          data[n] = { ...data[n], action: ['view', 'edit', 'delete'] }
        }
      }

      setState({
        ...state,
        data
      })
    }
  }, [user?.isLoading, project?.isLoading, JSON.stringify(project.data.paginate)])

  // Sau khi add project mới hoặc edit project thì call lại tất cả list project
  const handleAfterCreateProject = () => {
    const data = {
      calledId: 'paginate',
      projectName,
      projectType,
      endDate,
      startDate,
      page,
      perPage,
      creatorEmployee,
      responsibleEmployees,
      projectManager,
      userId
    }
    props.getProjectsDispatch(data)
  }

  // Thay đổi tên dự án
  const handleChangeName = (e) => {
    const { value } = e.target
    setState({
      ...state,
      projectName: value
    })
  }

  // Thay đổi hình thức quản lý dự án
  const handleSelectProjectType = (value) => {
    setState({
      ...state,
      projectType: value
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

  // Thay đổi người thiết lập
  const handleChangeCreator = (e) => {
    const { value } = e.target
    setState({
      ...state,
      creatorEmployee: value
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

  const setPage = (pageNumber) => {
    const data = {
      calledId: 'paginate',
      projectName,
      projectType,
      endDate,
      startDate,
      page: pageNumber,
      perPage,
      creatorEmployee,
      responsibleEmployees,
      projectManager,
      userId
    }

    setState({
      ...state,
      page: parseInt(pageNumber)
    })

    props.getProjectsDispatch(data)
  }

  const setLimit = (number) => {
    const data = {
      calledId: 'paginate',
      projectName,
      projectType,
      endDate,
      startDate,
      page: 1,
      perPage: number,
      creatorEmployee,
      responsibleEmployees,
      projectManager,
      userId
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
    props.getAllTasksByProject(id)
    props.getAllPhaseByProject(id)
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
    props.getAllTasksByProject(id)
    setTimeout(() => {
      window.$(`#modal-edit-project-${id}`).modal('show')
    }, 10)
  }

  // Xoá dự án
  const handleDelete = (id) => {
    const data = {
      calledId: 'paginate',
      projectName,
      projectType,
      endDate,
      startDate,
      page: project && project.lists && project.lists.length === 1 ? page - 1 : page,
      perPage,
      creatorEmployee,
      responsibleEmployees,
      projectManager,
      userId
    }

    const currentProject = project.data.paginate.find((p) => p?._id === id)
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
    window.$('#modal-create-project').modal('show')
  }

  const handleUpdateData = () => {
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
        calledId: 'paginate',
        projectName,
        endDate,
        startDate,
        projectType,
        page: 1,
        perPage,
        creatorEmployee,
        responsibleEmployees,
        projectManager,
        userId
      }

      props.getProjectsDispatch(data)
      setState({
        ...state,
        page: 1
      })
    }
  }

  // Khởi tạo danh sách các cột
  const column = [
    { name: translate('project.name'), key: 'name' },
    { name: translate('project.projectType'), key: 'projectType' },
    { name: translate('project.startDate'), key: 'startDate' },
    { name: translate('project.endDate'), key: 'endDate' },
    { name: translate('project.creator'), key: 'creator' },
    { name: translate('project.manager'), key: 'manager' },
    { name: translate('project.member'), key: 'member' }
  ]

  const totalPage = project && Math.ceil(project.data.totalDocs / perPage)

  return (
    <>
      <ProjectDetailForm
        projectDetailId={projectDetail && projectDetail._id}
        projectDetail={projectDetail}
        currentProjectTasks={tasks && tasks.tasksByProject}
        currentProjectPhase={projectPhase && projectPhase.phases}
      />

      <ProjectEditForm
        currentProjectTasks={tasks && tasks.tasksByProject}
        currentProjectPhase={projectPhase && projectPhase.phases}
        projectEditId={currentRow && currentRow._id}
        projectEdit={currentRow}
        handleAfterCreateProject={handleAfterCreateProject}
      />
      <ProjectCreateForm handleAfterCreateProject={handleAfterCreateProject} />

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
                <i className='fa fa-filter' /> {translate('general.filter')}{' '}
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

            {/* Hình thức quản lý */}
            <div className='form-group'>
              <label>{translate('project.projectType')}</label>
              <SelectMulti
                id='multiSelectProjectType'
                defaultValue={[translate('project.cpm'), translate('project.simple')]}
                items={[
                  { value: '2', text: translate('project.cpm') },
                  { value: '1', text: translate('project.simple') }
                ]}
                onChange={handleSelectProjectType}
                options={{ nonSelectedText: translate('project.select_type'), allSelectedText: translate('project.select_all_type') }}
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

            {/* Người tạo dự án */}
            <div className='form-group'>
              <label>{translate('project.creator')}</label>
              <input
                className='form-control'
                type='text'
                placeholder={translate('project.search_by_employees')}
                name='name'
                onChange={(e) => handleChangeCreator(e)}
              />
            </div>

            {/* Ngày bắt đầu */}
            <div className='form-group'>
              <label>{translate('project.col_start_time')}</label>
              <DatePicker id='start-date' dateFormat='month-year' value='' onChange={handleChangeStartDate} disabled={false} />
            </div>

            {/* Ngày kết thúc */}
            <div className='form-group'>
              <label>{translate('project.col_expected_end_time')}</label>
              <DatePicker id='end-date' dateFormat='month-year' value='' onChange={handleChangeEndDate} disabled={false} />
            </div>

            <div className='form-group'>
              <label />
              <button type='button' className='btn btn-success' onClick={() => handleUpdateData()}>
                {translate('project.search')}
              </button>
            </div>
          </div>
          {/* Danh sách các dự án */}
          <div className='qlcv StyleScrollDiv StyleScrollDiv-y' style={{ maxHeight: '600px' }}>
            <TreeTable
              behaviour='show-children'
              tableSetting
              tableId={tableId}
              viewWhenClickName
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

          <PaginateBar
            pageTotal={totalPage || 0}
            currentPage={page}
            display={data && data.length !== 0 && data.length}
            total={project && project.data.totalDocs}
            func={setPage}
          />
        </div>
      </div>
    </>
  )
}

function mapState(state) {
  const { project, user, tasks, projectPhase } = state
  return { project, user, tasks, projectPhase }
}
const actions = {
  getProjectsDispatch: ProjectActions.getProjectsDispatch,
  deleteProjectDispatch: ProjectActions.deleteProjectDispatch,
  createProjectDispatch: ProjectActions.createProjectDispatch,
  getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
  getAllTasksByProject: taskManagementActions.getAllTasksByProject,
  getAllPhaseByProject: ProjectPhaseActions.getAllPhaseByProject
}

const connectedExampleManagementTable = connect(mapState, actions)(withTranslate(ListProject))
export { connectedExampleManagementTable as ListProject }