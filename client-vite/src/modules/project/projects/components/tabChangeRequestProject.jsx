import React, { useState, useEffect, useRef, useCallback } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { ProjectActions } from '../redux/actions'
import { ProjectPhaseActions } from '../../project-phase/redux/actions'
import { UserActions } from '../../../super-admin/user/redux/actions'
import moment from 'moment'
import 'c3/c3.css'
import {
  checkIfAbleToCRUDProject,
  getCurrentProjectDetails,
  processAffectedTasksChangeRequest,
  MILISECS_TO_DAYS,
  MILISECS_TO_HOURS,
  getNewTasksListAfterCR,
  getEndDateOfProject,
  getEstimateCostOfProject,
  renderLongList
} from './functionHelper'
import Swal from 'sweetalert2'
import { taskManagementActions } from '../../../task/task-management/redux/actions'
import ModalChangeRequestInfo from './modalChangeRequestInfo'
import { getStorage } from '../../../../config'
import { ChangeRequestActions } from '../../change-requests/redux/actions'
import ModalCreateChangeRequest from '../../change-requests/components/modalCreateChangeRequest'
import { getTableConfiguration } from '../../../../helpers/tableConfiguration'
import { DataTableSetting, PaginateBar, SelectMulti, SelectBox } from '../../../../common-components'
import _cloneDeep from 'lodash/cloneDeep'

const TabChangeRequestProject = (props) => {
  const tableId = 'project-change-requests-table'
  const defaultConfig = { limit: 5, hiddenColumns: [] }
  const limit = getTableConfiguration(tableId, defaultConfig).limit
  // Khởi tạo state
  const [state, setState] = useState({
    name: null,
    creator: null,
    creationTime: null,
    affectedTask: null,
    status: null,
    page: 1,
    perPage: limit || defaultConfig.limit
  })

  const { translate, project, currentProjectTasks, user, changeRequest } = props
  const currentChangeRequestsList = changeRequest && changeRequest.changeRequests
  const projectDetail = getCurrentProjectDetails(project)
  const currentProjectId = window.location.href.split('?id=')[1].split('#')?.[0]
  const [currentRow, setCurrentRow] = useState()
  const [currentChangeRequestId, setCurrentChangeRequestId] = useState('')
  const { name, creator, creationTime, affectedTask, status, page, perPage } = state
  let lists = []
  let totalPage = 0

  if (changeRequest) {
    lists = changeRequest.changeRequestsPaginate
  }

  totalPage = changeRequest && Math.ceil(changeRequest.totalDocs / perPage)

  const setPage = (pageNumber) => {
    let data = {
      name: name,
      creator: creator,
      creationTime: creationTime,
      affectedTask: affectedTask,
      status: status,
      page: pageNumber,
      perPage: perPage,
      calledId: 'paginate',
      projectId: currentProjectId
    }

    setState({
      ...state,
      page: parseInt(pageNumber)
    })
    props.getListProjectChangeRequestsDispatch(data)
  }

  const setLimit = (number) => {
    let data = {
      name: name,
      creator: creator,
      creationTime: creationTime,
      affectedTask: affectedTask,
      status: status,
      page: page,
      perPage: number,
      calledId: 'paginate',
      projectId: currentProjectId
    }

    setState({
      ...state,
      perPage: parseInt(number),
      page: 1
    })
    props.getListProjectChangeRequestsDispatch(data)
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

  const handleChangeCreator = (e) => {
    const { value } = e.target
    setState({
      ...state,
      creator: value
    })
  }

  const handleSelectStatus = (value) => {
    setState({
      ...state,
      status: value
    })
  }

  const handleSelectCreationTime = (value) => {
    setState({
      ...state,
      creationTime: value[0]
    })
  }

  const handleChangeAffectedTask = (e) => {
    let task = e.target.value
    if (task === '') {
      task = null
    }

    setState({
      ...state,
      affectedTask: task
    })
  }

  const renderStatus = (statusValue) => {
    switch (statusValue) {
      case 0:
        return translate('project.request.not_request')
      case 1:
        return translate('project.request.wait_for_approval')
      case 2:
        return translate('project.request.refused')
      case 3:
        return translate('project.request.approved')
      default:
        return translate('project.request.not_request')
    }
  }

  // Cập nhật lại các yêu cầu thay đổi
  const updateListRequests = (currentChangeRequestsList = [], currentProjectTasks) => {
    // Nếu projectTasks không có gì thì không xử lý tiếp nữa
    if (!currentProjectTasks || currentProjectTasks.length === 0) return
    // Cap nhat lai cac changeRequest
    const requestsPendingListFromDB = currentChangeRequestsList
      .filter((CRItem) => CRItem.requestStatus === 1)
      .map((CRItem) => {
        if (String(CRItem._id) === currentChangeRequestId) {
          return {
            ...CRItem,
            requestStatus: 3
          }
        }
        return CRItem
      })

    // const requestsPendingListFromDB = [...currentChangeRequestsList];
    // console.log('requestsPendingListFromDB', requestsPendingListFromDB)
    let newChangeRequestsList = []
    for (let requestsPendingItem of requestsPendingListFromDB) {
      // console.log('\n---------------------requestsPendingItem', requestsPendingItem)
      const tempCurrentTask = {
        ...requestsPendingItem.currentTask,
        _id: requestsPendingItem.currentTask.task,
        preceedingTasks: requestsPendingItem.currentTask.preceedingTasks.map((preItem) => preItem.task),
        estimateNormalTime:
          Number(requestsPendingItem.currentTask.estimateNormalTime) /
          (projectDetail.unitTime === 'days' ? MILISECS_TO_DAYS : MILISECS_TO_HOURS),
        estimateOptimisticTime:
          Number(requestsPendingItem.currentTask.estimateOptimisticTime) /
          (projectDetail.unitTime === 'days' ? MILISECS_TO_DAYS : MILISECS_TO_HOURS)
      }
      if (requestsPendingItem.type === 'add_task' && requestsPendingItem.requestStatus === 1) {
        const newAffectedTasksList = [
          {
            task: undefined,
            old: undefined,
            new: {
              ...requestsPendingItem.affectedTasksList[0].new
            }
          }
        ]
        const newTasksList = [...currentProjectTasks, tempCurrentTask]
        // console.log('newTasksList', newTasksList);
        newChangeRequestsList.push({
          ...requestsPendingItem,
          baseline: {
            oldEndDate: getEndDateOfProject(currentProjectTasks, false),
            newEndDate: getEndDateOfProject(newTasksList, false),
            oldCost: getEstimateCostOfProject(currentProjectTasks),
            newCost: getEstimateCostOfProject(newTasksList)
          },
          affectedTasksList: newAffectedTasksList
        })
        // console.log('newChangeRequestsList', newChangeRequestsList)
      } else if (requestsPendingItem.type === 'edit_task' && requestsPendingItem.requestStatus === 1) {
        const currentProjectTasksFormatPreceedingTasks = currentProjectTasks.map((taskItem) => {
          return {
            ...taskItem,
            preceedingTasks: taskItem.preceedingTasks.map((taskItemPreItem) => {
              return taskItemPreItem.task
            })
          }
        })
        let allTasksNodeRelationArr = []
        // Hàm đệ quy để lấy tất cả những tasks có liên quan tới task hiện tại
        const getAllRelationTasks = (currentProjectTasksFormatPreceedingTasks, currentTask) => {
          const preceedsContainCurrentTask = currentProjectTasksFormatPreceedingTasks.filter((taskItem) => {
            return taskItem.preceedingTasks.includes(currentTask._id)
          })
          for (let preConItem of preceedsContainCurrentTask) {
            allTasksNodeRelationArr.push(preConItem)
            getAllRelationTasks(currentProjectTasksFormatPreceedingTasks, preConItem)
          }
          if (!preceedsContainCurrentTask || preceedsContainCurrentTask.length === 0) {
            return
          }
        }
        // console.log('currentProjectTasksFormatPreceedingTasks', currentProjectTasksFormatPreceedingTasks)
        // console.log('tempCurrentTask', tempCurrentTask)
        getAllRelationTasks(currentProjectTasksFormatPreceedingTasks, tempCurrentTask)
        // Tìm task cũ để cho vào đầu array
        const currentOldTask = currentProjectTasksFormatPreceedingTasks.find(
          (item) => String(item._id) === (tempCurrentTask._id || tempCurrentTask.task)
        )
        // console.log('currentOldTask', currentOldTask)
        allTasksNodeRelationArr.unshift({
          ...currentOldTask,
          estimateNormalTime: Number(currentOldTask.estimateNormalTime),
          estimateOptimisticTime: Number(currentOldTask.estimateOptimisticTime)
        })
        // console.log('allTasksNodeRelationArr', allTasksNodeRelationArr)
        const allTasksNodeRelationFormattedArr = allTasksNodeRelationArr
        // console.log('allTasksNodeRelationFormattedArr', allTasksNodeRelationFormattedArr)
        const { affectedTasks, newTasksList } = processAffectedTasksChangeRequest(
          projectDetail,
          allTasksNodeRelationFormattedArr,
          tempCurrentTask
        )
        const newAffectedTasksList = affectedTasks.map((affectedItem) => {
          return {
            ...affectedItem,
            old: {
              ...tempCurrentTask,
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
              ...tempCurrentTask,
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
        // console.log('newAffectedTasksList', newAffectedTasksList)
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
        newChangeRequestsList.push({
          ...requestsPendingItem,
          baseline: {
            oldEndDate: getEndDateOfProject(currentProjectTasks, false),
            newEndDate: getEndDateOfProject(newCurrentProjectTasks, false),
            oldCost: getEstimateCostOfProject(currentProjectTasks),
            newCost: getEstimateCostOfProject(newCurrentProjectTasks)
          },
          affectedTasksList: newAffectedTasksList
        })
        // console.log('newChangeRequestsList', newChangeRequestsList)
      } else {
        newChangeRequestsList.push({
          ...requestsPendingItem
        })
        // console.log('newChangeRequestsList', newChangeRequestsList)
      }
    }

    if (newChangeRequestsList.length > 0) {
      // console.log(newChangeRequestsList);
      props.updateStatusProjectChangeRequestDispatch({
        newChangeRequestsList
      })
    }
  }

  const handleApprove = async (changeRequestId) => {
    setCurrentChangeRequestId(changeRequestId)
    const message = 'Bạn có muốn phê duyệt yêu cầu thay đổi này?'
    Swal.fire({
      html: `<h4 style="color: red"><div>${message}</div></h4>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: translate('general.no'),
      confirmButtonText: translate('general.yes')
    })
      .then(async (result) => {
        if (result.value) {
          await props.updateStatusProjectChangeRequestDispatch({
            changeRequestId,
            requestStatus: 3
          })
          setTimeout(async () => {
            await props.getAllTasksByProject(currentProjectId || projectDetail._id)
            await props.getAllPhaseByProject(currentProjectId || projectDetail._id)
            await props.getAllMilestoneByProject(currentProjectId || projectDetail._id)
          }, 20)
        }
      })
      .catch((err) => {
        // console.error('Change request', err)
      })
  }

  const handleCancel = async (changeRequestId) => {
    const message = 'Bạn có muốn từ chối yêu cầu thay đổi này?'
    Swal.fire({
      html: `<h4 style="color: red"><div>${message}</div></h4>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: translate('general.no'),
      confirmButtonText: translate('general.yes')
    }).then(async (result) => {
      if (result.value) {
        await props.updateStatusProjectChangeRequestDispatch({
          changeRequestId,
          requestStatus: 2
        })
        setTimeout(async () => {
          await props.getAllTasksByProject(currentProjectId || projectDetail._id)
          await props.getAllPhaseByProject(currentProjectId || projectDetail._id)
          await props.getAllMilestoneByProject(currentProjectId || projectDetail._id)
        }, 20)
      }
    })
  }

  const handleShowDetailInfo = (changeRequestId) => {
    const currentCRItem = currentChangeRequestsList.find((CRItem) => String(CRItem._id) === String(changeRequestId))
    setCurrentRow(currentCRItem)
    setTimeout(() => {
      window.$(`#modal-change-request-info-${changeRequestId}`).modal('show')
    }, 10)
  }

  const renderActionValueCell = (requestStatus, CRid, creatorObj) => {
    if (
      requestStatus === 1 &&
      checkIfAbleToCRUDProject({ project, user, currentProjectId: currentProjectId || projectDetail._id, isInsideProject: true })
    ) {
      return (
        <td style={{ textAlign: 'center' }}>
          <a className='visibility text-yellow' style={{ width: '5px', cursor: 'pointer' }} onClick={() => handleShowDetailInfo(CRid)}>
            <i className='material-icons'>visibility</i>
          </a>
          <a className='do_not_disturb_on text-red' style={{ width: '5px', cursor: 'pointer' }} onClick={() => handleCancel(CRid)}>
            <i className='material-icons'>do_not_disturb_on</i>
          </a>
          <a className='check_circle text-green' style={{ width: '5px', cursor: 'pointer' }} onClick={() => handleApprove(CRid)}>
            <i className='material-icons'>check_circle</i>
          </a>
        </td>
      )
    }
    return (
      <td style={{ textAlign: 'center' }}>
        <a className='visibility text-yellow' style={{ width: '5px', cursor: 'pointer' }} onClick={() => handleShowDetailInfo(CRid)}>
          <i className='material-icons'>visibility</i>
        </a>
        {String(getStorage('userId')) === String(creatorObj.id) && requestStatus === 1 && (
          <a className='do_not_disturb_on text-red' style={{ width: '5px', cursor: 'pointer' }} onClick={() => handleCancel(CRid)}>
            <i className='material-icons'>do_not_disturb_on</i>
          </a>
        )}
      </td>
    )
  }

  const renderCellColor = (requestStatus) => {
    if (requestStatus === 3) {
      return {
        backgroundColor: 'green'
      }
    }
    if (requestStatus === 2) {
      return {
        backgroundColor: 'red'
      }
    }
    return {}
  }

  const renderTextCellColor = (requestStatus) => {
    if (requestStatus === 3 || requestStatus === 2) {
      return {
        color: 'white',
        fontWeight: 'bold'
      }
    }
    return {
      color: 'black'
    }
  }

  const getTaskName = (currentProjectTasks, taskId) => {
    return currentProjectTasks.find((taskItem) => String(taskItem._id) === taskId)?.name
  }

  const createNormalChangeRequest = () => {
    setTimeout(() => {
      window.$(`#modal-create-change-request`).modal('show')
    }, 10)
  }

  const handleUpdateData = () => {
    let data = {
      name: name,
      creator: creator,
      creationTime: creationTime,
      affectedTask: affectedTask,
      status: status,
      page: page,
      perPage: perPage,
      calledId: 'paginate',
      projectId: currentProjectId
    }
    props.getListProjectChangeRequestsDispatch(data)

    setState({
      ...state,
      page: 1
    })
  }

  useEffect(() => {
    updateListRequests(currentChangeRequestsList, currentProjectTasks)
  }, [JSON.stringify(currentProjectTasks)])

  useEffect(() => {
    props.getListProjectChangeRequestsDispatch({ projectId: currentProjectId, calledId: 'paginate', page, perPage })
  }, [JSON.stringify(currentProjectTasks), JSON.stringify(changeRequest.changeRequests)])

  return (
    <React.Fragment>
      <div className='box'>
        <div className='box-body qlcv'>
          <ModalChangeRequestInfo
            changeRequest={currentRow}
            changeRequestId={currentRow && currentRow._id}
            projectDetail={projectDetail}
            currentProjectTasks={currentProjectTasks}
          />
          <ModalCreateChangeRequest currentProjectTasks={currentProjectTasks} />
          <div style={{ height: '40px', display: 'flex', justifyContent: 'space-between' }}>
            {/* Lọc */}
            <div>
              <button
                className='btn btn-primary'
                type='button'
                style={{marginLeft: 10, backgroundColor: 'transparent', borderRadius: '4px', color: '#367fa9' }}
                onClick={() => {
                  window.$('#change-request-filter').slideToggle()
                }}
              >
                <i className='fa fa-filter'></i>
                {translate('general.filter')}
              </button>
            </div>

            {/* Button thêm mới */}
            <div className='pull-right'>
              <button
                type='button'
                className='btn btn-success pull-right'
                title={translate('project.request.create_request')}
                onClick={createNormalChangeRequest}
                style={{ marginRight: 10 }}
              >
                {translate('project.request.create_request')}
              </button>
            </div>
          </div>

          {/* Lọc danh sách các yêu cầu thay đổi */}
          <div id='change-request-filter' className='form-inline' style={{ display: 'none' }}>
            {/* Tên yêu cầu */}
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

            {/* Trạng thái yêu cầu */}
            <div className='form-group'>
              <label>{translate('task.task_management.status')}</label>
              <SelectMulti
                id='multiSelectRequestStatus'
                defaultValue={[
                  translate('project.request.approved'),
                  translate('project.request.refused'),
                  translate('project.request.wait_for_approval'),
                  translate('project.request.not_request')
                ]}
                items={[
                  { value: '3', text: translate('project.request.approved') },
                  { value: '2', text: translate('project.request.refused') },
                  { value: '1', text: translate('project.request.wait_for_approval') },
                  { value: '0', text: translate('project.request.not_request') }
                ]}
                onChange={handleSelectStatus}
                options={{
                  nonSelectedText: translate('task.task_management.select_status'),
                  allSelectedText: translate('task.task_management.select_all_status')
                }}
              ></SelectMulti>
            </div>

            {/* Người thiết lập */}
            <div className='form-group'>
              <label>{translate('task.task_management.creator')}</label>
              <input
                className='form-control'
                type='text'
                placeholder={translate('task.task_management.search_by_employees')}
                name='name'
                onChange={(e) => handleChangeCreator(e)}
              />
            </div>

            {/* Thời điểm tạo yêu cầu */}
            <div className='form-group'>
              <label>{translate('project.request.create_time')}</label>
              <SelectBox
                id='multiSelectCreatorTime'
                className='form-control select2'
                style={{ width: '100%' }}
                items={[
                  { value: '', text: '--- Chọn ---' },
                  { value: 'currentMonth', text: translate('task.task_management.current_month') },
                  { value: 'currentWeek', text: translate('task.task_management.current_week') }
                ]}
                value={creationTime}
                onChange={handleSelectCreationTime}
                options={{ minimumResultsForSearch: 100 }}
              ></SelectBox>
            </div>

            {/* Công việc bị ảnh hưởng */}
            <div className='form-group'>
              <label>{translate('project.request.affect_task')}</label>
              <input
                className='form-control'
                type='text'
                placeholder={translate('task.task_management.search_by_name')}
                name='name'
                onChange={(e) => handleChangeAffectedTask(e)}
              />
            </div>

            {/* Button tìm kiếm */}
            <div className='form-group'>
              <label></label>
              <button type='button' className='btn btn-success' onClick={() => handleUpdateData()}>
                {translate('project.search')}
              </button>
            </div>
          </div>

          {/* Danh sách các yêu cầu thay đổi */}
          <div>
            <DataTableSetting
              tableId={tableId}
              columnArr={[
                translate('project.request.name'),
                translate('project.request.creator'),
                translate('project.request.create_time'),
                translate('project.request.description'),
                translate('project.request.affect_task'),
                translate('project.request.status')
              ]}
              setLimit={setLimit}
            />
          </div>

          <table id={tableId} className='table table-striped table-bordered table-hover'>
            <thead>
              <tr>
                <th>{translate('project.request.name')}</th>
                <th>{translate('project.request.creator')}</th>
                <th>{translate('project.request.create_time')}</th>
                <th>{translate('project.request.description')}</th>
                <th>{translate('project.request.affect_task')}</th>
                <th>{translate('project.request.status')}</th>
                <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}</th>
              </tr>
            </thead>
            <tbody>
              {currentProjectTasks &&
                lists &&
                lists.length !== 0 &&
                lists.map((CRItem, index) => (
                  <tr key={index}>
                    <td>{CRItem?.name}</td>
                    <td>{CRItem?.creator?.name}</td>
                    <td>{moment(CRItem?.createdAt).format('HH:mm DD/MM/YYYY')}</td>
                    <td>{CRItem?.description}</td>
                    <td style={{ maxWidth: 500 }}>
                      {renderLongList(
                        CRItem?.affectedTasksList?.map((affectedItem) => {
                          return getTaskName(currentProjectTasks, affectedItem?.task) || affectedItem?.new?.name
                        }),
                        5
                      )}
                    </td>
                    <td
                      style={{
                        ...renderTextCellColor(CRItem?.requestStatus),
                        ...renderCellColor(CRItem?.requestStatus),
                        textAlign: 'center',
                        verticalAlign: 'center'
                      }}
                    >
                      {renderStatus(CRItem?.requestStatus)}
                    </td>
                    {renderActionValueCell(CRItem?.requestStatus, CRItem?._id, CRItem?.creator)}
                  </tr>
                ))}
            </tbody>
          </table>

          {/* PaginateBar */}
          {changeRequest && changeRequest.isLoading ? (
            <div className='table-info-panel'>{translate('confirm.loading')}</div>
          ) : (
            (!lists || lists.length === 0) && <div className='table-info-panel'>{translate('confirm.no_data')}</div>
          )}
          <PaginateBar
            pageTotal={totalPage ? totalPage : 0}
            currentPage={page}
            display={lists && lists.length !== 0 && lists.length}
            total={changeRequest && changeRequest.totalDocs}
            func={setPage}
          />
        </div>
      </div>
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  const { project, user, changeRequest, projectPhase } = state
  return { project, user, changeRequest, projectPhase }
}

const mapDispatchToProps = {
  getProjectsDispatch: ProjectActions.getProjectsDispatch,
  deleteProjectDispatch: ProjectActions.deleteProjectDispatch,
  updateStatusProjectChangeRequestDispatch: ChangeRequestActions.updateStatusProjectChangeRequestDispatch,
  getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
  getAllTasksByProject: taskManagementActions.getAllTasksByProject,
  getAllPhaseByProject: ProjectPhaseActions.getAllPhaseByProject,
  getAllMilestoneByProject: ProjectPhaseActions.getAllMilestoneByProject,
  getListProjectChangeRequestsDispatch: ChangeRequestActions.getListProjectChangeRequestsDispatch
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TabChangeRequestProject))
