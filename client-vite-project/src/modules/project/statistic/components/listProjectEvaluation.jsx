import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { TreeTable, SelectMulti, PaginateBar, ToolTip, DatePicker } from '../../../../common-components'
import { ProjectActions } from '../../projects/redux/actions'
import { UserActions } from '../../../super-admin/user/redux/actions'
import { getStorage } from '../../../../config'
import ModalProjectEvaluation from './modalProjectEvaluation'
import { getTableConfiguration } from '../../../../helpers/tableConfiguration'
import { taskManagementActions } from '../../../task/task-management/redux/actions'
import { renderLongList, renderProjectTypeText } from '../../projects/components/functionHelper'
import _cloneDeep from 'lodash/cloneDeep'
import dayjs from 'dayjs'
import Swal from 'sweetalert2'

function ListProjectEvaluation(props) {
  const tableId = 'project-statistical-table'
  const defaultConfig = { limit: 5, hiddenColumns: [] }
  const limit = getTableConfiguration(tableId, defaultConfig).limit
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
    perPage: limit,
    currentRow: null,
    projectDetail: null,
    data: []
  })
  const { project, translate, user } = props
  const userId = getStorage('userId')
  const {
    projectName,
    projectType,
    startDate,
    endDate,
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

  const handleChangeName = (e) => {
    const { value } = e.target
    setState({
      ...state,
      projectName: value
    })
  }

  const handleSelectProjectType = (value) => {
    setState({
      ...state,
      projectType: value
    })
  }

  const handleChangeMember = (e) => {
    const { value } = e.target
    setState({
      ...state,
      responsibleEmployees: value
    })
  }

  const handleChangeManager = (e) => {
    const { value } = e.target
    setState({
      ...state,
      projectManager: value
    })
  }

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
      projectType: projectType,
      endDate: endDate,
      startDate: startDate,
      page: parseInt(pageNumber),
      perPage: perPage,
      creatorEmployee: creatorEmployee,
      responsibleEmployees: responsibleEmployees,
      projectManager: projectManager,
      userId: userId
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
      projectType: projectType,
      endDate: endDate,
      startDate: startDate,
      page: 1,
      perPage: parseInt(number),
      creatorEmployee: creatorEmployee,
      responsibleEmployees: responsibleEmployees,
      projectManager: projectManager,
      userId: userId
    }

    setState({
      ...state,
      perPage: parseInt(number),
      page: 1
    })
    props.getProjectsDispatch(data)
  }

  const handleShowDetailInfo = (id) => {
    setState({
      ...state,
      projectDetail: project.data.paginate.find((p) => p?._id === id)
    })
    setTimeout(() => {
      window.$(`#modal-show-project-eval-${id}`).modal('show')
    }, 100)
  }

  const totalPage = project && Math.ceil(project.data.totalDocs / perPage)

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
        projectName: projectName,
        endDate: endDate,
        startDate: startDate,
        projectType: projectType,
        page: 1,
        perPage: perPage,
        creatorEmployee: creatorEmployee,
        responsibleEmployees: responsibleEmployees,
        projectManager: projectManager,
        userId: userId
      }

      props.getProjectsDispatch(data)
      setState({
        ...state,
        page: 1
      })
    }
  }

  useEffect(() => {
    let data = []
    if (user?.isLoading === false && project?.isLoading === false) {
      let currentProjects = _cloneDeep(project.data.paginate) // Sao chép ra mảng mới
      for (let n in currentProjects) {
        data[n] = {
          ...currentProjects[n],
          rawData: currentProjects[n],
          name: currentProjects[n]?.name,
          startDate: dayjs(currentProjects[n]?.startDate).format('HH:mm DD/MM/YYYY') || [],
          endDate: dayjs(currentProjects[n].endDate).format('HH:mm DD/MM/YYYY') || [],
          projectType: translate(renderProjectTypeText(currentProjects[n]?.projectType)),
          creator: currentProjects[n]?.creator?.name,
          manager: currentProjects[n]?.projectManager ? (
            <ToolTip dataTooltip={currentProjects[n]?.projectManager.map((o) => o.name)} />
          ) : null,
          member: currentProjects[n]?.responsibleEmployees ? (
            <ToolTip dataTooltip={currentProjects[n]?.responsibleEmployees.map((o) => o.name)} />
          ) : null,
          action: ['view']
        }
      }

      setState({
        ...state,
        data
      })
    }
  }, [user?.isLoading, project?.isLoading, JSON.stringify(project.data.paginate)])

  let column = [
    { name: translate('project.name'), key: 'name' },
    { name: translate('project.projectType'), key: 'projectType' },
    { name: translate('project.startDate'), key: 'startDate' },
    { name: translate('project.endDate'), key: 'endDate' },
    { name: translate('project.creator'), key: 'creator' },
    { name: translate('project.manager'), key: 'manager' },
    { name: translate('project.member'), key: 'member' }
  ]

  return (
    <React.Fragment>
      {/* Modal chi tiết báo cáo dự án */}
      {projectDetail && projectDetail._id && (
        <ModalProjectEvaluation projectDetailId={projectDetail && projectDetail._id} projectDetail={projectDetail} />
      )}

      <div className='box'>
        <div className='box-body qlcv'>
          <div style={{ height: '40px', display: 'flex', justifyContent: 'space-between' }}>
            {/* Lọc */}
            <div>
              <button
                className='btn btn-primary'
                type='button'
                style={{ borderRadius: 0, marginLeft: 10, backgroundColor: 'transparent', borderRadius: '4px', color: '#367fa9' }}
                onClick={() => {
                  window.$('#projects-filter').slideToggle()
                }}
              >
                <i className='fa fa-filter'></i> {translate('general.filter')}{' '}
              </button>
            </div>
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
              ></SelectMulti>
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

            <div className='form-group'>
              <label></label>
              <button type='button' className='btn btn-success' onClick={() => handleUpdateData()}>
                {translate('project.search')}
              </button>
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
          </div>

          <div className='qlcv StyleScrollDiv StyleScrollDiv-y' style={{ maxHeight: '600px' }}>
            <TreeTable
              behaviour='show-children'
              tableSetting={true}
              onSetNumberOfRowsPerPage={setLimit}
              tableId={tableId}
              column={column}
              viewWhenClickName={true}
              data={data}
              titleAction={{
                view: ''
              }}
              funcView={handleShowDetailInfo}
            />
          </div>

          {/* <table id={tableId} className="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>{translate('project.name')}</th>
                                <th>{translate('project.creator')}</th>
                                <th>{translate('project.manager')}</th>
                                <th>{translate('project.member')}</th>
                                <th>{translate('table.action')}
                                    <DataTableSetting
                                        tableId={tableId}
                                        columnArr={[
                                            translate('project.name'),
                                            translate('project.creator'),
                                            translate('project.manager'),
                                            translate('project.member'),
                                        ]}
                                        setLimit={setLimit}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(lists && lists.length !== 0) &&
                                lists.map((projectItem, index) => (
                                    <tr key={index} style={{ cursor: 'pointer' }} onClick={() => handleShowDetailInfo(projectItem)}>
                                        <td style={{ color: '#385898' }}>{projectItem?.name}</td>
                                        <td>{projectItem?.creator?.name}</td>
                                        <td>{projectItem?.projectManager.map(o => o.name).join(", ")}</td>
                                        <td style={{ maxWidth: 400 }}>{renderLongList(projectItem?.responsibleEmployees.map(o => o.name))}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <span className="visibility text-green" style={{ width: '5px' }}><i className="material-icons">visibility</i></span>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table> */}

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
  const { project, user } = state
  return { project, user }
}
const actions = {
  getProjectsDispatch: ProjectActions.getProjectsDispatch,
  deleteProjectDispatch: ProjectActions.deleteProjectDispatch,
  createProjectDispatch: ProjectActions.createProjectDispatch,
  getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
  getTasksByProject: taskManagementActions.getTasksByProject
}

const connectedExampleManagementTable = connect(mapState, actions)(withTranslate(ListProjectEvaluation))
export { connectedExampleManagementTable as ListProjectEvaluation }
