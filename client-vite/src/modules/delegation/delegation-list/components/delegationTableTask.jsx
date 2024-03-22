import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { RevokeNotification, DeleteNotification, PaginateBar, SmartTable, ToolTip } from '../../../../common-components'

import { DelegationCreateFormTask } from './delegationCreateFormTask'
import { DelegationEditFormTask } from './delegationEditFormTask'
import { DelegationDetailInfoTask } from './delegationDetailInfoTask'
import { DelegationImportForm } from './delegationImortForm'
import { UserActions } from '../../../super-admin/user/redux/actions'
import { LinkActions } from '../../../super-admin/link/redux/actions'
import { RoleActions } from '../../../super-admin/role/redux/actions'

import { DelegationActions } from '../redux/actions'
import { getTableConfiguration } from '../../../../helpers/tableConfiguration'
import dayjs from 'dayjs'
import { colorfyDelegationStatus } from './functionHelper'
import { performTaskAction } from '../../../task/task-perform/redux/actions'
import { taskManagementActions } from '../../../task/task-management/redux/actions'

function DelegationTableTask(props) {
  const { delegation, translate, user, tasks } = props

  const getTableId = 'table-manage-delegation1-hooks-Task'
  const defaultConfig = { limit: 5 }
  const getLimit = getTableConfiguration(getTableId, defaultConfig).limit

  // Khởi tạo state
  const [state, setState] = useState({
    delegationName: '',
    pageTask: 1,
    perPageTask: getLimit,
    tableId: getTableId
  })
  const [selectedData, setSelectedData] = useState()

  const { delegationName, pageTask, perPageTask, currentRow, curentRowDetail, tableId } = state

  useEffect(() => {
    props.getDelegationsTask({ delegationName, pageTask, perPageTask, delegateType: 'Task' })
    props.getUser()
    props.getRoles()
    props.getLinks({ type: 'active' })
  }, [])

  useEffect(() => {
    props.getDepartment()
    props.getTasksByUser({ type: 'user', organizationUnitId: null })
  }, [])

  /**
   * Hàm xử lý khi tên ví dụ thay đổi
   * @param {*} e
   */
  const handleChangeDelegationName = (e) => {
    const { value } = e.target
    setState({
      ...state,
      delegationName: value
    })
  }

  /**
   * Hàm xử lý khi click nút tìm kiếm
   */
  const handleSubmitSearch = () => {
    props.getDelegationsTask({
      delegationName,
      perPageTask,
      pageTask: 1,
      delegateType: 'Task'
    })
    setState({
      ...state,
      pageTask: 1
    })
  }

  /**
   * Hàm xử lý khi click chuyển trang
   * @param {*} pageNumber Số trang định chuyển
   */
  const setPage = (pageNumber) => {
    setState({
      ...state,
      pageTask: parseInt(pageNumber)
    })

    props.getDelegationsTask({
      delegationName,
      perPageTask,
      pageTask: parseInt(pageNumber),
      delegateType: 'Task'
    })
  }

  /**
   * Hàm xử lý thiết lập giới hạn hiển thị số bản ghi
   * @param {*} number số bản ghi sẽ hiển thị
   */
  const setLimit = (number) => {
    setState({
      ...state,
      perPageTask: parseInt(number),
      pageTask: 1
    })
    props.getDelegationsTask({
      delegationName,
      perPageTask: parseInt(number),
      pageTask: 1,
      delegateType: 'Task'
    })
  }

  /**
   * Hàm xử lý khi click xóa 1 ví dụ
   * @param {*} id của ví dụ cần xóa
   */
  const handleDelete = (id) => {
    props.deleteTaskDelegations({
      delegationIds: [id]
    })
    props.getDelegationsTask({
      delegationName,
      perPageTask,
      delegateType: 'Task',
      pageTask: delegation && delegation.listsTask && delegation.listsTask.length === 1 ? pageTask - 1 : pageTask
    })
  }

  const handleRevoke = (id) => {
    props.revokeTaskDelegation({
      delegationIds: [id],
      reason: window.$(`#revokeReason-${id}`).val()
    })
    props.getDelegationsTask({
      delegationName,
      perPageTask,
      delegateType: 'Task',
      pageTask: delegation && delegation.listsTask && delegation.listsTask.length === 1 ? pageTask - 1 : pageTask
    })
  }

  const onSelectedRowsChange = (value) => {
    setSelectedData(value)
  }

  const handleDeleteOptions = () => {
    props.deleteDelegations({
      delegationIds: selectedData
    })
  }

  /**
   * Hàm xử lý khi click edit một ví vụ
   * @param {*} delegation thông tin của ví dụ cần chỉnh sửa
   */
  const handleEdit = (delegation) => {
    setState({
      ...state,
      currentRow: delegation
    })
    window.$('#modal-edit-delegation-hooks-Task').modal('show')
  }

  /**
   * Hàm xử lý khi click xem chi tiết một ví dụ
   * @param {*} delegation thông tin của ví dụ cần xem
   */
  const handleShowDetailInfo = (delegation) => {
    setState({
      ...state,
      curentRowDetail: delegation
    })
    window.$(`#modal-detail-info-delegation-hooks-Task`).modal('show')
  }

  let lists = []
  if (delegation) {
    lists = delegation.listsTask
    console.log(delegation)
  }

  const totalPage = delegation && Math.ceil(delegation.totalListTask / perPageTask)
  // convert ISODate to String hh:mm AM/PM
  const formatTime = (date) => {
    return dayjs(date).format('DD-MM-YYYY hh:mm A')
  }

  return (
    <React.Fragment>
      {user && user.organizationalUnitsOfUser && (
        <DelegationEditFormTask
          delegateTask={currentRow && currentRow.delegateTask}
          delegationID={currentRow && currentRow._id}
          delegationName={currentRow && currentRow.delegationName}
          description={currentRow && currentRow.description}
          delegator={currentRow && currentRow.delegator}
          delegatee={currentRow && currentRow.delegatee}
          delegateType={currentRow && currentRow.delegateType}
          delegateTaskRoles={currentRow && currentRow.delegateTaskRoles}
          status={currentRow && currentRow.status}
          startDate={currentRow && currentRow.startDate}
          endDate={currentRow && currentRow.endDate}
          delegatePolicy={currentRow && currentRow.delegatePolicy}
          showChooseRevoke={currentRow && currentRow.endDate != null ? true : false}
        />
      )}
      <DelegationDetailInfoTask
        delegationID={curentRowDetail && curentRowDetail._id}
        delegationName={curentRowDetail && curentRowDetail.delegationName}
        description={curentRowDetail && curentRowDetail.description}
        delegator={curentRowDetail && curentRowDetail.delegator}
        delegatee={curentRowDetail && curentRowDetail.delegatee}
        delegatePrivileges={curentRowDetail && curentRowDetail.delegatePrivileges}
        delegateType={curentRowDetail && curentRowDetail.delegateType}
        delegateRole={curentRowDetail && curentRowDetail.delegateRole}
        delegateTask={curentRowDetail && curentRowDetail.delegateTask}
        delegateTaskRoles={curentRowDetail && curentRowDetail.delegateTaskRoles}
        status={curentRowDetail && curentRowDetail.status}
        allPrivileges={curentRowDetail && curentRowDetail.allPrivileges}
        startDate={curentRowDetail && curentRowDetail.startDate}
        endDate={curentRowDetail && curentRowDetail.endDate}
        revokedDate={curentRowDetail && curentRowDetail.revokedDate}
        revokeReason={curentRowDetail && curentRowDetail.revokeReason}
        replyStatus={curentRowDetail && curentRowDetail.replyStatus}
        declineReason={curentRowDetail && curentRowDetail.declineReason}
        delegatePolicy={curentRowDetail && curentRowDetail.delegatePolicy}
        logs={curentRowDetail && curentRowDetail.logs}
      />

      {user && user.organizationalUnitsOfUser && tasks.tasksbyuser && (
        <DelegationCreateFormTask pageTask={pageTask} perPageTask={perPageTask} />
      )}
      <DelegationImportForm pageTask={pageTask} perPageTask={perPageTask} />

      <div className='box-body qlcv'>
        <div className='form-inline'>
          {/* Button thêm mới */}
          <div className='dropdown pull-right' style={{ marginTop: '5px' }}>
            <button
              type='button'
              className='btn btn-success pull-right'
              title={translate('manage_delegation.add_title')}
              onClick={() => window.$('#modal-create-delegation-hooks-Task').modal('show')}
            >
              {translate('manage_delegation.add')}
            </button>{' '}
            {/* <ul className="dropdown-menu pull-right" style={{ marginTop: 0 }}>
                            <li><a style={{ cursor: 'pointer' }}
                                onClick={() => window.$('#modal-create-delegation-hooks').modal('show')}
                                title={translate('manage_delegation.add_one_delegation')}>
                                {translate('manage_delegation.add_role_delegation')}</a></li>
                            <li><a style={{ cursor: 'pointer' }} onClick={() => window.$('#modal-import-file-delegation-hooks').modal('show')} title={translate('manage_delegation.add_multi_delegation')}>
                                {translate('human_resource.salary.add_import')}</a></li>
                        </ul> */}
          </div>
          {selectedData?.length > 0 && (
            <button
              type='button'
              className='btn btn-danger pull-right'
              title={translate('general.delete_option')}
              onClick={() => handleDeleteOptions()}
            >
              {translate('general.delete_option')}
            </button>
          )}

          {/* Tìm kiếm */}
          <div className='form-group'>
            <label className='form-control-static'>{translate('manage_delegation.delegationName')}</label>
            <input
              type='text'
              className='form-control'
              name='delegationNameTask'
              onChange={handleChangeDelegationName}
              placeholder={translate('manage_delegation.delegationName')}
              autoComplete='off'
            />
          </div>
          <div className='form-group'>
            <button
              id='btn-search-task-delegation'
              type='button'
              className='btn btn-success'
              title={translate('manage_delegation.search')}
              onClick={() => handleSubmitSearch()}
            >
              {translate('manage_delegation.search')}
            </button>
          </div>
        </div>

        <SmartTable
          disableCheckbox={true}
          tableId={tableId}
          columnData={{
            index: translate('manage_delegation.index'),
            delegationName: translate('manage_delegation.delegationName'),
            // delegateType: translate('manage_delegation.delegateType'),
            delegateObjectTask: translate('manage_delegation.delegateObjectTask'),
            delegateTaskRoles: translate('manage_delegation.delegateObjectTaskRole'),
            delegatee: translate('manage_delegation.delegatee'),
            delegateStartDate: translate('manage_delegation.delegateStartDate'),
            delegateEndDate: translate('manage_delegation.delegateEndDate'),
            delegateStatus: translate('manage_delegation.delegateStatus')
            // description: translate('manage_delegation.description')
          }}
          tableHeaderData={{
            index: (
              <th className='col-fixed' style={{ width: 60 }}>
                {translate('manage_delegation.index')}
              </th>
            ),
            delegationName: <th>{translate('manage_delegation.delegationName')}</th>,
            // delegateType: <th>{translate('manage_delegation.delegateType')}</th>,
            delegateObjectTask: <th>{translate('manage_delegation.delegateObjectTask')}</th>,
            delegateTaskRoles: <th>{translate('manage_delegation.delegateObjectTaskRole')}</th>,
            delegatee: <th>{translate('manage_delegation.delegatee')}</th>,
            delegateStartDate: <th>{translate('manage_delegation.delegateStartDate')}</th>,
            delegateEndDate: <th>{translate('manage_delegation.delegateEndDate')}</th>,
            delegateStatus: <th>{translate('manage_delegation.delegateStatus')}</th>,
            // description: <th>{translate('manage_delegation.description')}</th>,
            action: <th style={{ width: '120px', textAlign: 'center' }}>{translate('general.action')}</th>
          }}
          tableBodyData={
            lists?.length > 0 &&
            lists.map((item, index) => {
              return {
                id: item?._id,
                index: <td>{index + 1}</td>,
                delegationName: <td>{item?.delegationName}</td>,
                // delegateType: <td>{translate('manage_delegation.delegateType' + item?.delegateType)}</td>,
                delegateObjectTask: <td>{item.delegateTask ? item.delegateTask.name : ''}</td>,
                delegateTaskRoles: (
                  <td>
                    {item.delegateTaskRoles ? item.delegateTaskRoles.map((r) => translate('task.task_management.' + r)).join(', ') : ''}
                  </td>
                ),
                delegatee: <td>{item?.delegatee.name}</td>,
                delegateStartDate: <td>{formatTime(item?.startDate)}</td>,
                delegateEndDate: (
                  <td>
                    {(item.revokedDate && item.endDate && new Date(item.revokedDate).getTime() < new Date(item.endDate).getTime()) ||
                    (item.revokedDate && !item.endDate)
                      ? formatTime(item.revokedDate)
                      : item.endDate
                        ? formatTime(item.endDate)
                        : translate('manage_delegation.end_date_tbd')}
                  </td>
                ),
                delegateStatus: (
                  <td>
                    {colorfyDelegationStatus(item.status, translate)} - {colorfyDelegationStatus(item.replyStatus, translate)}
                  </td>
                ),
                // description: <td>{item?.description}</td>,
                action: (
                  <td style={{ textAlign: 'center' }}>
                    <a
                      className='edit text-green'
                      style={{ width: '5px' }}
                      title={translate('manage_delegation.detail_info_delegation')}
                      onClick={() => handleShowDetailInfo(item)}
                    >
                      <i className='material-icons'>visibility</i>
                    </a>
                    {item.status == 'pending' ? (
                      <a
                        className='edit text-yellow'
                        style={{ width: '5px' }}
                        title={translate('manage_delegation.edit')}
                        onClick={() => handleEdit(item)}
                      >
                        <i className='material-icons'>edit</i>
                      </a>
                    ) : null}
                    {item.status == 'revoked' ? (
                      <DeleteNotification
                        content={translate('manage_delegation.delete')}
                        data={{
                          id: item._id,
                          info: item.delegationName
                        }}
                        func={handleDelete}
                      />
                    ) : (
                      <RevokeNotification
                        content={translate('manage_delegation.revoke_request')}
                        data={{
                          id: item._id,
                          info: item.delegationName
                        }}
                        func={handleRevoke}
                      />
                    )}
                  </td>
                )
              }
            })
          }
          dataDependency={lists}
          onSetNumberOfRowsPerpage={setLimit}
          onSelectedRowsChange={onSelectedRowsChange}
        />

        {/* PaginateBar */}
        {delegation && delegation.isLoading ? (
          <div className='table-info-panel'>{translate('confirm.loading')}</div>
        ) : (
          (typeof lists === 'undefined' || lists.length === 0) && <div className='table-info-panel'>{translate('confirm.no_data')}</div>
        )}
        <PaginateBar
          pageTotal={totalPage ? totalPage : 0}
          currentPage={pageTask}
          display={lists && lists.length !== 0 && lists.length}
          total={delegation && delegation.totalListTask}
          func={setPage}
        />
      </div>
    </React.Fragment>
  )
}

function mapState(state) {
  const { delegation, user, role, link, tasks } = state
  return { delegation, user, role, link, tasks }
}

const actions = {
  getDelegationsTask: DelegationActions.getDelegationsTask,
  deleteTaskDelegations: DelegationActions.deleteTaskDelegations,
  revokeTaskDelegation: DelegationActions.revokeTaskDelegation,
  getUser: UserActions.get,
  getLinks: LinkActions.get,
  getRoles: RoleActions.get,
  getDepartment: UserActions.getDepartmentOfUser,
  getTasksByUser: taskManagementActions.getTasksByUser
}

const connectedDelegationTableTask = connect(mapState, actions)(withTranslate(DelegationTableTask))
export { connectedDelegationTableTask as DelegationTableTask }
