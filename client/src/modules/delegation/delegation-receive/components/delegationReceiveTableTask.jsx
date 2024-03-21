import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { PaginateBar, SmartTable, ToolTip, ConfirmNotification } from '../../../../common-components'

import { DelegationDetailInfoTask } from '../../delegation-list/components/delegationDetailInfoTask'

import { DelegationActions } from '../redux/actions'
import { getTableConfiguration } from '../../../../helpers/tableConfiguration'
import dayjs from 'dayjs'
import { colorfyDelegationStatus } from '../../delegation-list/components/functionHelper'

function DelegationReceiveTableTask(props) {
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

  const { delegationReceive, translate } = props
  const { delegationName, pageTask, perPageTask, curentRowDetail, tableId } = state

  useEffect(() => {
    props.getDelegationsTask({ delegationName, pageTask, perPageTask, delegateType: 'Task' })
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

  const onSelectedRowsChange = (value) => {
    setSelectedData(value)
  }

  const confirmDelegation = (id) => {
    props.confirmDelegation({
      delegationId: id
    })
    props.getDelegationsTask({
      delegationName,
      perPageTask,
      delegateType: 'Task',
      pageTask: delegationReceive && delegationReceive.listsTask && delegationReceive.listsTask.length === 1 ? pageTask - 1 : pageTask
    })
  }

  const rejectDelegation = (id) => {
    props.rejectDelegation({
      delegationId: id,
      reason: window.$(`#rejectReason-${id}`).val()
    })
    props.getDelegationsTask({
      delegationName,
      perPageTask,
      delegateType: 'Task',
      pageTask: delegationReceive && delegationReceive.listsTask && delegationReceive.listsTask.length === 1 ? pageTask - 1 : pageTask
    })
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

  let listsTask = []
  if (delegationReceive) {
    listsTask = delegationReceive.listsTask
  }

  const totalPage = delegationReceive && Math.ceil(delegationReceive.totalListTask / perPageTask)
  // convert ISODate to String hh:mm AM/PM
  const formatTime = (date) => {
    return dayjs(date).format('DD-MM-YYYY hh:mm A')
  }

  return (
    <React.Fragment>
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
        forReceive={true}
        replyStatus={curentRowDetail && curentRowDetail.replyStatus}
        declineReason={curentRowDetail && curentRowDetail.declineReason}
        delegatePolicy={curentRowDetail && curentRowDetail.delegatePolicy}
        logs={curentRowDetail && curentRowDetail.logs}
      />

      <div className='box-body qlcv'>
        <div className='form-inline'>
          {/* Button thêm mới */}

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
            delegateType: translate('manage_delegation.delegateType'),
            delegateObjectTask: translate('manage_delegation.delegateObjectTask'),
            delegateTaskRoles: translate('manage_delegation.delegateObjectTaskRole'),
            delegator: translate('manage_delegation.delegator'),
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
            delegator: <th>{translate('manage_delegation.delegator')}</th>,
            delegateStartDate: <th>{translate('manage_delegation.delegateStartDate')}</th>,
            delegateEndDate: <th>{translate('manage_delegation.delegateEndDate')}</th>,
            delegateStatus: <th>{translate('manage_delegation.delegateStatus')}</th>,
            // description: <th>{translate('manage_delegation.description')}</th>,
            action: <th style={{ width: '120px', textAlign: 'center' }}>{translate('general.action')}</th>
          }}
          tableBodyData={
            listsTask?.length > 0 &&
            listsTask.map((item, index) => {
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
                delegator: <td>{item?.delegator.name}</td>,
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
                    {item.replyStatus == 'wait_confirm' || item.replyStatus == 'declined' ? (
                      <ConfirmNotification
                        icon='success'
                        title={translate('manage_delegation.confirm_delegation')}
                        content={`<h4 style='color: green'><div>${translate('manage_delegation.confirm_delegation')}</div> <div>"${item.delegationName}"</div></h4>`}
                        name='thumb_up'
                        className='text-blue'
                        func={() => confirmDelegation(item._id)}
                      />
                    ) : null}
                    {item.replyStatus == 'wait_confirm' || item.replyStatus == 'confirmed' ? (
                      <ConfirmNotification
                        icon='error'
                        title={translate('manage_delegation.reject_reason')}
                        content={`<h4 style='color: red'><div>${translate('manage_delegation.reject_delegation')}</div> <div>"${item.delegationName}"</div></h4>
                                        <br> <div class="form-group">
                                            <label>${translate('manage_delegation.reject_reason')}</label>
                                            <textarea id="rejectReason-${item._id}" class="form-control" placeholder="${translate('manage_delegation.reject_reason_placeholder')}"></textarea>
                                        </div>
                                        `}
                        name='thumb_down'
                        className='text-red'
                        func={() => rejectDelegation(item._id)}
                      />
                    ) : null}
                  </td>
                )
              }
            })
          }
          dataDependency={listsTask}
          onSetNumberOfRowsPerpage={setLimit}
          onSelectedRowsChange={onSelectedRowsChange}
        />

        {/* PaginateBar */}
        {delegationReceive && delegationReceive.isLoading ? (
          <div className='table-info-panel'>{translate('confirm.loading')}</div>
        ) : (
          (typeof listsTask === 'undefined' || listsTask.length === 0) && (
            <div className='table-info-panel'>{translate('confirm.no_data')}</div>
          )
        )}
        <PaginateBar
          pageTotal={totalPage ? totalPage : 0}
          currentPage={pageTask}
          display={listsTask && listsTask.length !== 0 && listsTask.length}
          total={delegationReceive && delegationReceive.totalListTask}
          func={setPage}
        />
      </div>
    </React.Fragment>
  )
}

function mapState(state) {
  const { delegationReceive } = state
  return { delegationReceive }
}

const actions = {
  getDelegationsTask: DelegationActions.getDelegationsTask,
  confirmDelegation: DelegationActions.confirmDelegation,
  rejectDelegation: DelegationActions.rejectDelegation
}

const connectedDelegationReceiveTableTask = connect(mapState, actions)(withTranslate(DelegationReceiveTableTask))
export { connectedDelegationReceiveTableTask as DelegationReceiveTableTask }
