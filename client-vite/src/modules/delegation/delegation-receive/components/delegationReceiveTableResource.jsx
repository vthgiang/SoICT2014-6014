import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import dayjs from 'dayjs'
import { PaginateBar, SmartTable, ConfirmNotification } from '../../../../common-components'

import { DelegationDetailInfoResource } from '../../delegation-list/components/delegationDetailInfoResource'

import { DelegationActions } from '../redux/actions'
import { getTableConfiguration } from '../../../../helpers/tableConfiguration'
import { colorfyDelegationStatus } from '../../delegation-list/components/functionHelper'

function DelegationReceiveTableResource(props) {
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

  const { delegationReceive, translate } = props
  const { name, page, perPage, curentRowDetail, tableId } = state

  useEffect(() => {
    props.getDelegationsResource({ name, page, perPage, delegateType: 'Resource' })
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
    props.getDelegationsResource({
      name,
      perPage,
      page: 1,
      delegateType: 'Resource'
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

    props.getDelegationsResource({
      name,
      perPage,
      page: parseInt(pageNumber),
      delegateType: 'Resource'
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
    props.getDelegationsResource({
      name,
      perPage: parseInt(number),
      page: 1,
      delegateType: 'Resource'
    })
  }

  const onSelectedRowsChange = (value) => {
    setSelectedData(value)
  }

  const confirmDelegation = (id) => {
    props.confirmDelegation({
      delegationId: id,
      delegateType: 'Resource'
    })
    props.getDelegationsResource({
      name,
      perPage,
      delegateType: 'Resource',
      page: delegationReceive && delegationReceive.listsResource && delegationReceive.listsResource.length === 1 ? page - 1 : page
    })
  }

  const rejectDelegation = (id) => {
    props.rejectDelegation({
      delegationId: id,
      reason: window.$(`#rejectReason-${id}`).val(),
      delegateType: 'Resource'
    })
    props.getDelegationsResource({
      name,
      perPage,
      delegateType: 'Resource',
      page: delegationReceive && delegationReceive.listsResource && delegationReceive.listsResource.length === 1 ? page - 1 : page
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
    window.$(`#modal-detail-info-delegation-hooks-Resource`).modal('show')
  }

  let listsResource = []
  if (delegationReceive) {
    listsResource = delegationReceive.listsResource
  }

  const totalPage = delegationReceive && Math.ceil(delegationReceive.totalList / perPage)
  // convert ISODate to String hh:mm AM/PM
  const formatTime = (date) => {
    return dayjs(date).format('DD-MM-YYYY hh:mm A')
  }

  console.log(delegationReceive)

  return (
    <>
      <DelegationDetailInfoResource
        delegationID={curentRowDetail && curentRowDetail._id}
        name={curentRowDetail && curentRowDetail.name}
        description={curentRowDetail && curentRowDetail.description}
        delegator={curentRowDetail && curentRowDetail.delegator}
        delegatee={curentRowDetail && curentRowDetail.delegatee}
        delegateType={curentRowDetail && curentRowDetail.delegateType}
        delegateObject={curentRowDetail && curentRowDetail.delegateObject}
        status={curentRowDetail && curentRowDetail.status}
        startDate={curentRowDetail && curentRowDetail.startDate}
        endDate={curentRowDetail && curentRowDetail.endDate}
        revokedDate={curentRowDetail && curentRowDetail.revokedDate}
        revokeReason={curentRowDetail && curentRowDetail.revokeReason}
        forReceive
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
            delegateType: translate('manage_delegation.delegateType'),
            delegateResource: translate('manage_delegation.delegateResource'),
            delegator: translate('manage_delegation.delegator'),
            // delegatee: translate('manage_delegation.delegatee'),
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
            delegateResource: <th>{translate('manage_delegation.delegateResource')}</th>,
            delegator: <th>{translate('manage_delegation.delegator')}</th>,
            // delegatee: <th>{translate('manage_delegation.delegatee')}</th>,
            description: <th>{translate('manage_delegation.description')}</th>,
            delegateStartDate: <th>{translate('manage_delegation.delegateStartDate')}</th>,
            delegateEndDate: <th>{translate('manage_delegation.delegateEndDate')}</th>,
            delegateStatus: <th>{translate('manage_delegation.delegateStatus')}</th>,
            action: <th style={{ width: '120px', textAlign: 'center' }}>{translate('general.action')}</th>
          }}
          tableBodyData={
            listsResource?.length > 0 &&
            listsResource.map((item, index) => {
              return {
                id: item?._id,
                index: <td>{index + 1}</td>,
                name: <td>{item?.name}</td>,
                delegateResource: <td>{item.delegateObject ? `${item.delegateObject.name} - ${item.delegateObject.type}` : ''}</td>,
                delegator: <td>{item?.delegator.name}</td>,
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
                    {item.replyStatus == 'wait_confirm' || item.replyStatus == 'declined' ? (
                      <ConfirmNotification
                        icon='success'
                        title={translate('manage_delegation.confirm_delegation')}
                        content={`<h4 style='color: green'><div>${translate('manage_delegation.confirm_delegation')}</div> <div>"${item.name}"</div></h4>`}
                        name='thumb_up'
                        className='text-blue'
                        func={() => confirmDelegation(item._id)}
                      />
                    ) : null}
                    {item.replyStatus == 'wait_confirm' || item.replyStatus == 'confirmed' ? (
                      <ConfirmNotification
                        icon='error'
                        title={translate('manage_delegation.reject_reason')}
                        content={`<h4 style='color: red'><div>${translate('manage_delegation.reject_delegation')}</div> <div>"${item.name}"</div></h4>
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
          dataDependency={listsResource}
          onSetNumberOfRowsPerpage={setLimit}
          onSelectedRowsChange={onSelectedRowsChange}
        />

        {/* PaginateBar */}
        {delegationReceive && delegationReceive.isLoading ? (
          <div className='table-info-panel'>{translate('confirm.loading')}</div>
        ) : (
          (typeof listsResource === 'undefined' || listsResource.length === 0) && (
            <div className='table-info-panel'>{translate('confirm.no_data')}</div>
          )
        )}
        <PaginateBar
          pageTotal={totalPage || 0}
          currentPage={page}
          display={listsResource && listsResource.length !== 0 && listsResource.length}
          total={delegationReceive && delegationReceive.totalListResource}
          func={setPage}
        />
      </div>
    </>
  )
}

function mapState(state) {
  const { delegationReceive } = state
  return { delegationReceive }
}

const actions = {
  getDelegationsResource: DelegationActions.getDelegationsResource,
  confirmDelegation: DelegationActions.confirmDelegation,
  rejectDelegation: DelegationActions.rejectDelegation
}

const connectedDelegationReceiveTableResource = connect(mapState, actions)(withTranslate(DelegationReceiveTableResource))
export { connectedDelegationReceiveTableResource as DelegationReceiveTableResource }
