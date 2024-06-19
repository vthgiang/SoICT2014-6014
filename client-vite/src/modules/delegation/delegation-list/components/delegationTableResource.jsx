import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import dayjs from 'dayjs'
import { RevokeNotification, DeleteNotification, PaginateBar, SmartTable } from '../../../../common-components'

import { DelegationCreateFormResource } from './delegationCreateFormResource'
import { DelegationEditFormResource } from './delegationEditFormResource'
import { DelegationDetailInfoResource } from './delegationDetailInfoResource'
import { DelegationImportForm } from './delegationImortForm'

import { DelegationActions } from '../redux/actions'
import { getTableConfiguration } from '../../../../helpers/tableConfiguration'
import { colorfyDelegationStatus } from './functionHelper'

function DelegationTableResource(props) {
  const { delegation, translate, getDelegationsResource, deleteResourceDelegations, revokeResourceDelegation } = props

  const getTableId = 'table-manage-delegation1-hooks-Resource'
  const defaultConfig = { limit: 5 }
  const getLimit = getTableConfiguration(getTableId, defaultConfig).limit

  // Khởi tạo state
  const [state, setState] = useState({
    name: '',
    page: 1,
    perPage: getLimit,
    tableId: getTableId
  })
  const [selectedData, setSelectedData] = useState()

  const { name, page, perPage, currentRow, currentRowDetail, tableId } = state

  useEffect(() => {
    getDelegationsResource({ name, page, perPage })
  }, [])

  /**
   * Hàm xử lý khi tên ví dụ thay đổi
   * @param {*} e
   */
  const handleChangeDelegationName = (e) => {
    const { value } = e.target
    setState({
      ...state,
      name: value
    })
  }

  /**
   * Hàm xử lý khi click nút tìm kiếm
   */
  const handleSubmitSearch = () => {
    getDelegationsResource({
      name,
      perPage,
      page: 1
    })
    setState({
      ...state,
      page: 1
    })
  }

  /**
   * Hàm xử lý khi click chuyển trang
   * @param {*} pageNumber Số trang định chuyển
   */
  const setPage = (pageNumber) => {
    setState({
      ...state,
      page: parseInt(pageNumber)
    })

    getDelegationsResource({
      name,
      perPage,
      page: parseInt(pageNumber)
    })
  }

  /**
   * Hàm xử lý thiết lập giới hạn hiển thị số bản ghi
   * @param {*} number số bản ghi sẽ hiển thị
   */
  const setLimit = (number) => {
    setState({
      ...state,
      perPage: parseInt(number),
      page: 1
    })
    getDelegationsResource({
      name,
      perPage: parseInt(number),
      page: 1
    })
  }

  /**
   * Hàm xử lý khi click xóa 1 ví dụ
   * @param {*} id của ví dụ cần xóa
   */
  const handleDelete = (id) => {
    deleteResourceDelegations({
      delegationIds: [id]
    })
    getDelegationsResource({
      name,
      perPage,
      page: delegation && delegation.listsResource && delegation.listsResource.length === 1 ? page - 1 : page
    })
  }

  const handleRevoke = (id) => {
    revokeResourceDelegation({
      delegationIds: [id],
      reason: window.$(`#revokeReason-${id}`).val()
    })
    getDelegationsResource({
      name,
      perPage,
      page: delegation && delegation.listsResource && delegation.listsResource.length === 1 ? page - 1 : page
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
    window.$('#modal-edit-delegation-hooks-Resource').modal('show')
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
    window.$(`#modal-detail-info-delegation-hooks-Resource`).modal('show')
  }

  let lists = []
  if (delegation) {
    lists = delegation.listsResource
  }

  const totalPage = delegation && Math.ceil(delegation.totalListResource / perPage)
  // convert ISODate to String hh:mm AM/PM
  const formatTime = (date) => {
    return dayjs(date).format('DD-MM-YYYY hh:mm A')
  }

  return (
    <>
      <DelegationEditFormResource
        delegationID={currentRow && currentRow._id}
        name={currentRow && currentRow.name}
        description={currentRow && currentRow.description}
        delegator={currentRow && currentRow.delegator}
        delegatee={currentRow && currentRow.delegatee}
        delegateType={currentRow && currentRow.delegateType}
        delegateResource={currentRow && currentRow.delegateObject}
        status={currentRow && currentRow.status}
        startDate={currentRow && currentRow.startDate}
        endDate={currentRow && currentRow.endDate}
        policy={currentRow && currentRow.policy}
        showChooseRevoke={!!(currentRow && currentRow.endDate != null)}
      />
      <DelegationDetailInfoResource
        delegationID={currentRowDetail && currentRowDetail._id}
        name={currentRowDetail && currentRowDetail.name}
        description={currentRowDetail && currentRowDetail.description}
        delegator={currentRowDetail && currentRowDetail.delegator}
        delegatee={currentRowDetail && currentRowDetail.delegatee}
        delegateType={currentRowDetail && currentRowDetail.delegateType}
        delegateResource={currentRowDetail && currentRowDetail.delegateObject}
        status={currentRowDetail && currentRowDetail.status}
        startDate={currentRowDetail && currentRowDetail.startDate}
        endDate={currentRowDetail && currentRowDetail.endDate}
        revokedDate={currentRowDetail && currentRowDetail.revokedDate}
        revokeReason={currentRowDetail && currentRowDetail.revokeReason}
        replyStatus={currentRowDetail && currentRowDetail.replyStatus}
        declineReason={currentRowDetail && currentRowDetail.declineReason}
        policy={currentRowDetail && currentRowDetail.policy}
        logs={currentRowDetail && currentRowDetail.logs}
      />

      <DelegationCreateFormResource />

      <DelegationImportForm page={page} perPage={perPage} />

      <div className='box-body qlcv'>
        <div className='form-inline'>
          {/* Button thêm mới */}
          <div className='dropdown pull-right' style={{ marginTop: '5px' }}>
            <button
              type='button'
              className='btn btn-success pull-right'
              title={translate('manage_delegation.add_title')}
              onClick={() => window.$('#modal-create-delegation-hooks-Resource').modal('show')}
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
            <label className='form-control-static'>{translate('manage_delegation.name')}</label>
            <input
              type='text'
              className='form-control'
              name='nameResource'
              onChange={handleChangeDelegationName}
              placeholder={translate('manage_delegation.name')}
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
            name: translate('manage_delegation.name'),
            // delegator: translate('manage_delegation.delegator'),
            delegatee: translate('manage_delegation.delegatee'),
            delegateResource: translate('manage_delegation.delegateResource'),
            description: translate('manage_delegation.description'),
            delegateStartDate: translate('manage_delegation.delegateStartDate'),
            delegateEndDate: translate('manage_delegation.delegateEndDate'),
            delegateStatus: translate('manage_delegation.delegateStatus')
          }}
          tableHeaderData={{
            index: (
              <th className='col-fixed' style={{ width: 60 }}>
                {translate('manage_delegation.index')}
              </th>
            ),
            name: <th>{translate('manage_delegation.name')}</th>,
            // delegator: <th>{translate('manage_delegation.delegator')}</th>,
            delegatee: <th>{translate('manage_delegation.delegatee')}</th>,
            delegateResource: <th>{translate('manage_delegation.delegateResource')}</th>,
            description: <th>{translate('manage_delegation.description')}</th>,
            delegateStartDate: <th>{translate('manage_delegation.delegateStartDate')}</th>,
            delegateEndDate: <th>{translate('manage_delegation.delegateEndDate')}</th>,
            delegateStatus: <th>{translate('manage_delegation.delegateStatus')}</th>,
            action: <th style={{ width: '120px', textAlign: 'center' }}>{translate('general.action')}</th>
          }}
          tableBodyData={
            lists?.length > 0 &&
            lists.map((item, index) => {
              return {
                id: item?._id,
                index: <td>{index + 1}</td>,
                name: <td>{item?.name}</td>,
                delegateResource: <td>{item.delegateObject ? `${item.delegateObject.name} - ${item.delegateObject.type}` : ''}</td>,
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
                delegateStatus: (
                  <td>
                    {colorfyDelegationStatus(item.status, translate)} - {colorfyDelegationStatus(item.replyStatus, translate)}
                  </td>
                ),
                description: <td>{item?.description}</td>,
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
                          info: item.name
                        }}
                        func={handleDelete}
                      />
                    ) : (
                      <RevokeNotification
                        content={translate('manage_delegation.revoke_request')}
                        data={{
                          id: item._id,
                          info: item.name
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
          currentPage={page}
          display={lists && lists.length !== 0 && lists.length}
          total={delegation && delegation.totalListResource}
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
  getDelegationsResource: DelegationActions.getDelegationsResource,
  deleteResourceDelegations: DelegationActions.deleteResourceDelegations,
  revokeResourceDelegation: DelegationActions.revokeResourceDelegation
}

const connectedDelegationTableResource = connect(mapState, actions)(withTranslate(DelegationTableResource))
export { connectedDelegationTableResource as DelegationTableResource }
