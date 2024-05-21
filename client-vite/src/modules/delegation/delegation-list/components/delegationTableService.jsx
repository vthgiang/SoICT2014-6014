import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import dayjs from 'dayjs'
import { RevokeNotification, DeleteNotification, PaginateBar, SmartTable } from '../../../../common-components'

import { DelegationCreateFormService } from './delegationCreateFormService'
import { DelegationEditFormService } from './delegationEditFormService'
import { DelegationDetailInfoService } from './delegationDetailInfoService'
import { DelegationImportForm } from './delegationImortForm'

import { DelegationActions } from '../redux/actions'
import { getTableConfiguration } from '../../../../helpers/tableConfiguration'
import { colorfyDelegationStatus } from './functionHelper'

function DelegationTableService(props) {
  const { delegation, translate, getDelegationsService, deleteServiceDelegations, revokeServiceDelegation } = props

  const getTableId = 'table-manage-delegation1-hooks-Service'
  const defaultConfig = { limit: 5 }
  const getLimit = getTableConfiguration(getTableId, defaultConfig).limit

  // Khởi tạo state
  const [state, setState] = useState({
    delegationName: '',
    pageService: 1,
    perPageService: getLimit,
    tableId: getTableId
  })
  const [selectedData, setSelectedData] = useState()

  const { delegationName, pageService, perPageService, currentRow, currentRowDetail, tableId } = state

  useEffect(() => {
    getDelegationsService({ delegationName, pageService, perPageService, delegateType: 'Service' })
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
    getDelegationsService({
      delegationName,
      perPageService,
      pageService: 1,
      delegateType: 'Service'
    })
    setState({
      ...state,
      pageService: 1
    })
  }

  /**
   * Hàm xử lý khi click chuyển trang
   * @param {*} pageNumber Số trang định chuyển
   */
  const setPage = (pageNumber) => {
    setState({
      ...state,
      pageService: parseInt(pageNumber)
    })

    getDelegationsService({
      delegationName,
      perPageService,
      pageService: parseInt(pageNumber),
      delegateType: 'Service'
    })
  }

  /**
   * Hàm xử lý thiết lập giới hạn hiển thị số bản ghi
   * @param {*} number số bản ghi sẽ hiển thị
   */
  const setLimit = (number) => {
    setState({
      ...state,
      perPageService: parseInt(number),
      pageService: 1
    })
    getDelegationsService({
      delegationName,
      perPageService: parseInt(number),
      pageService: 1,
      delegateType: 'Service'
    })
  }

  /**
   * Hàm xử lý khi click xóa 1 ví dụ
   * @param {*} id của ví dụ cần xóa
   */
  const handleDelete = (id) => {
    deleteServiceDelegations({
      delegationIds: [id]
    })
    getDelegationsService({
      delegationName,
      perPageService,
      delegateType: 'Service',
      pageService: delegation && delegation.listsService && delegation.listsService.length === 1 ? pageService - 1 : pageService
    })
  }

  const handleRevoke = (id) => {
    revokeServiceDelegation({
      delegationId: id,
      reason: window.$(`#revokeReason-${id}`).val()
    })
    getDelegationsService({
      delegationName,
      perPageService,
      delegateType: 'Service',
      pageService: delegation && delegation.listsService && delegation.listsService.length === 1 ? pageService - 1 : pageService
    })
  }

  const onSelectedRowsChange = (value) => {
    setSelectedData(value)
  }

  const handleDeleteOptions = () => {
    deleteDelegations({
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
    window.$('#modal-edit-delegation-hooks-Service').modal('show')
  }

  /**
   * Hàm xử lý khi click xem chi tiết một ví dụ
   * @param {*} delegation thông tin của ví dụ cần xem
   */
  const handleShowDetailInfo = (delegation) => {
    setState({
      ...state,
      currentRowDetail: delegation
    })
    window.$(`#modal-detail-info-delegation-hooks-Service`).modal('show')
  }

  let lists = []
  if (delegation) {
    lists = delegation.listsService
  }

  const totalPage = delegation && Math.ceil(delegation.totalListService / perPageService)
  // convert ISODate to String hh:mm AM/PM
  const formatTime = (date) => {
    return dayjs(date).format('DD-MM-YYYY hh:mm A')
  }

  return (
    <>
      <DelegationEditFormService
        delegateService={currentRow && currentRow.delegateService}
        delegationID={currentRow && currentRow._id}
        delegationName={currentRow && currentRow.delegationName}
        description={currentRow && currentRow.description}
        delegator={currentRow && currentRow.delegator}
        delegatee={currentRow && currentRow.delegatee}
        delegateType={currentRow && currentRow.delegateType}
        delegateResources={currentRow && currentRow.delegateResources}
        status={currentRow && currentRow.status}
        startDate={currentRow && currentRow.startDate}
        endDate={currentRow && currentRow.endDate}
        // delegatePolicy={currentRow && currentRow.delegatePolicy}
        showChooseRevoke={!!(currentRow && currentRow.endDate != null)}
      />
      <DelegationDetailInfoService
        delegationID={currentRowDetail && currentRowDetail._id}
        delegationName={currentRowDetail && currentRowDetail.delegationName}
        description={currentRowDetail && currentRowDetail.description}
        delegator={currentRowDetail && currentRowDetail.delegator}
        delegatee={currentRowDetail && currentRowDetail.delegatee}
        delegateType={currentRowDetail && currentRowDetail.delegateType}
        delegateResources={currentRowDetail && currentRowDetail.delegateResources}
        delegateService={currentRowDetail && currentRowDetail.delegateService}
        status={currentRowDetail && currentRowDetail.status}
        startDate={currentRowDetail && currentRowDetail.startDate}
        endDate={currentRowDetail && currentRowDetail.endDate}
        revokedDate={currentRowDetail && currentRowDetail.revokedDate}
        revokeReason={currentRowDetail && currentRowDetail.revokeReason}
        replyStatus={currentRowDetail && currentRowDetail.replyStatus}
        declineReason={currentRowDetail && currentRowDetail.declineReason}
        // delegatePolicy={currentRowDetail && currentRowDetail.delegatePolicy}
        logs={currentRowDetail && currentRowDetail.logs}
      />

      <DelegationCreateFormService />

      <DelegationImportForm pageService={pageService} perPageService={perPageService} />

      <div className='box-body qlcv'>
        <div className='form-inline'>
          {/* Button thêm mới */}
          <div className='dropdown pull-right' style={{ marginTop: '5px' }}>
            <button
              type='button'
              className='btn btn-success pull-right'
              title={translate('manage_delegation.add_title')}
              onClick={() => window.$('#modal-create-delegation-hooks-Service').modal('show')}
            >
              {translate('manage_delegation.add')}
            </button>{' '}
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
              name='delegationNameService'
              onChange={handleChangeDelegationName}
              placeholder={translate('manage_delegation.delegationName')}
              autoComplete='off'
            />
          </div>
          <div className='form-group'>
            <button
              id='btn-search-service-delegation'
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
          disableCheckbox
          tableId={tableId}
          columnData={{
            index: translate('manage_delegation.index'),
            delegationName: translate('manage_delegation.delegationName'),
            // delegateType: translate('manage_delegation.delegateType'),
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
            delegator: <th>{translate('manage_delegation.delegator')}</th>,
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
                delegateObjectService: <td>{item.delegateService ? item.delegateService.name : ''}</td>,
                delegator: <td>{item?.delegator?.name}</td>,
                delegatee: <td>{item?.delegatee?.name}</td>,
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
                delegateStatus: <td>{colorfyDelegationStatus(item.status, translate)}</td>,
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
          pageTotal={totalPage || 0}
          currentPage={pageService}
          display={lists && lists.length !== 0 && lists.length}
          total={delegation && delegation.totalListService}
          func={setPage}
        />
      </div>
    </>
  )
}

function mapState(state) {
  const { delegation } = state
  return { delegation }
}

const actions = {
  getDelegationsService: DelegationActions.getDelegationsService,
  deleteServiceDelegations: DelegationActions.deleteServiceDelegations,
  revokeServiceDelegation: DelegationActions.revokeServiceDelegation
}

const connectedDelegationTableService = connect(mapState, actions)(withTranslate(DelegationTableService))
export { connectedDelegationTableService as DelegationTableService }
