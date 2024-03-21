import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { formatDate } from '../../../../../../helpers/formatDate'
import { ConfirmNotification, DataTableSetting, DatePicker, PaginateBar, SelectMulti } from '../../../../../../common-components'
import DetailForm from './detailForm'
import EditForm from './editForm'
import CreateDirectlyForm from './createDirectlyForm'
import CreateFromSaleOrderForm from './createFromSaleOrderForm'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import { generateCode } from '../../../../../../helpers/generateCode'
import '../../../../manufacturing/request-management/components/request.css'
import { dataListStatus } from '../../../../manufacturing/request-management/components/common-components/config'

function IssueRequestManagementTable(props) {
  const [state, setState] = useState({
    currentRole: localStorage.getItem('currentRole'),
    createdAt: formatDate(new Date().toISOString()),
    desiredTime: formatDate(new Date().toISOString())
  })

  const handleShowDetailRequest = async (request) => {
    await setState({
      ...state,
      requestDetail: request
    })

    window.$('#modal-detail-info-purchasing-request').modal('show')
  }

  const handleEditRequest = async (request) => {
    let listGoods = []
    listGoods = request.goods.map((good) => {
      return {
        goodId: good.good._id,
        goodObject: good.good,
        quantity: good.quantity
      }
    })

    await setState({
      ...state,
      currentRow: request,
      listGoods: listGoods
    })
    window.$('#modal-edit-request').modal('show')
  }

  const handleClickCreateDirectly = () => {
    const value = generateCode('PDN')
    setState({
      ...state,
      requestCode: value
    })
    window.$('#modal-create-directly-request').modal('show')
  }

  const handleClickCreateFromPurchaseOrder = () => {
    const value = generateCode('PDN')
    setState({
      ...state,
      requestCode: value
    })
    window.$('#modal-create-request-from-sale-order').modal('show')
  }

  const { translate, requestManagements } = props
  let listRequests = []
  if (requestManagements.listRequests) {
    listRequests = requestManagements.listRequests
  }
  const { totalPages, page } = requestManagements
  const { code, createdAt, desiredTime, requestCode } = state
  const listStatus = dataListStatus.listStatusIssue()

  return (
    <React.Fragment>
      {<DetailForm requestDetail={state.requestDetail} />}
      {state.currentRow && state.listGoods && (
        <EditForm
          requestId={state.currentRow._id}
          code={state.currentRow.code}
          desiredTime={state.currentRow.desiredTime}
          description={state.currentRow.description}
          listGoods={state.listGoods}
          stock={state.currentRow.stock._id}
          status={state.currentRow.status}
        />
      )}
      <div className='box-body qlcv'>
        <CreateFromSaleOrderForm code={requestCode} />
        <CreateDirectlyForm code={requestCode} />
        <div className='dropdown pull-right' style={{ marginTop: 5 }}>
          <button
            type='button'
            className='btn btn-success dropdown-toggle pull-right'
            data-toggle='dropdown'
            aria-expanded='true'
            title={'Thêm mới đơn mua nguyên vật liệu'}
          >
            {'Thêm đơn'}
          </button>
          <ul className='dropdown-menu pull-right' style={{ marginTop: 0 }}>
            <li>
              <a style={{ cursor: 'pointer' }} title={`Tạo từ phiếu mua hàng`} onClick={handleClickCreateFromPurchaseOrder}>
                {'Tạo từ phiếu mua hàng'}
              </a>
            </li>
            <li>
              <a style={{ cursor: 'pointer' }} title={`Tạo trực tiếp`} onClick={handleClickCreateDirectly}>
                {'Tạo trực tiếp'}
              </a>
            </li>
          </ul>
        </div>
        <div className='form-inline'>
          <div className='form-group'>
            <label className='form-control-static'>{translate('production.request_management.code')}</label>
            <input
              type='text'
              className='form-control'
              value={code}
              onChange={props.handleCodeChange}
              placeholder='PDN202013021223'
              autoComplete='off'
            />
          </div>
          <div className='form-group'>
            <label>{translate('production.request_management.createdAt')}</label>
            <DatePicker id={`createdAt-purchasing-request`} value={createdAt} onChange={props.handleCreatedAtChange} disabled={false} />
          </div>
        </div>
        <div className='form-inline'>
          <div className='form-group'>
            <label>{translate('production.request_management.status')}</label>
            <SelectMulti
              id={`select-status-purchasing-request`}
              className='form-control select2'
              multiple='multiple'
              options={{
                nonSelectedText: translate('production.request_management.select_status'),
                allSelectedText: translate('production.request_management.select_all')
              }}
              style={{ width: '100%' }}
              items={[
                { value: 1, text: translate('production.request_management.receipt_request_from_manufacturing.1.content') },
                { value: 2, text: translate('production.request_management.receipt_request_from_manufacturing.2.content') },
                { value: 3, text: translate('production.request_management.receipt_request_from_manufacturing.3.content') },
                { value: 4, text: translate('production.request_management.receipt_request_from_manufacturing.4.content') },
                { value: 5, text: translate('production.request_management.receipt_request_from_manufacturing.5.content') }
              ]}
              onChange={props.handleStatusChange}
            />
          </div>
          <div className='form-group'>
            <label>{translate('production.request_management.desiredTime')}</label>
            <DatePicker
              id={`desiredTime-purchasing-request`}
              value={desiredTime}
              onChange={props.handleDesiredTimeChange}
              disabled={false}
            />
          </div>
        </div>
        <div className='form-inline'>
          <div className='form-group'>
            <label className='form-control-static'></label>
            <button
              type='button'
              className='btn btn-success'
              title={translate('production.request_management.search')}
              onClick={props.handleSubmitSearch}
            >
              {translate('production.request_management.search')}
            </button>
          </div>
        </div>
        <table id='purchasing-request-table' className='table table-striped table-bordered table-hover'>
          <thead>
            <tr>
              <th>{translate('production.request_management.index')}</th>
              <th>{translate('production.request_management.code')}</th>
              <th>{translate('production.request_management.creator')}</th>
              <th>{translate('production.request_management.createdAt')}</th>
              <th>{translate('production.request_management.desiredTime')}</th>
              <th>{translate('production.request_management.status')}</th>
              <th>{translate('production.request_management.description')}</th>
              <th style={{ width: '120px', textAlign: 'center' }}>
                {translate('table.action')}
                <DataTableSetting
                  tableId='purchasing-request-table'
                  columnArr={[
                    translate('production.request_management.index'),
                    translate('production.request_management.code'),
                    translate('production.request_management.creator'),
                    translate('production.request_management.createdAt'),
                    translate('production.request_management.desiredTime'),
                    translate('production.request_management.status'),
                    translate('production.request_management.description')
                  ]}
                  limit={state.limit}
                  hideColumnOption={true}
                  setLimit={props.setLimit}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {listRequests &&
              listRequests.length !== 0 &&
              listRequests.map((request, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{request.code}</td>
                  <td>{request.creator && request.creator.name}</td>
                  <td>{formatDate(request.createdAt)}</td>
                  <td>{formatDate(request.desiredTime)}</td>
                  <td>
                    <div>
                      <div className='timeline-index'>
                        <div
                          className='timeline-progress'
                          style={{ width: ((parseInt(request.status) - 1) / (listStatus.length - 1)) * 100 + '%' }}
                        ></div>
                        <div className='timeline-items'>
                          {listStatus.map((status, index) => (
                            <div className={`tooltip-abc${status.value > request.status ? '' : '-completed'}`}>
                              <div className={`timeline-item ${status.value > request.status ? '' : 'active'}`}></div>
                              <span className={`tooltiptext${status.value > request.status ? '' : '-completed'}`}>
                                <p style={{ color: 'white' }}>{status.value > request.status ? status.wait : status.completed}</p>
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{request.description}</td>
                  <td style={{ textAlign: 'center' }}>
                    <a
                      style={{ width: '5px' }}
                      title={translate('production.request_management.request_detail')}
                      onClick={() => {
                        handleShowDetailRequest(request)
                      }}
                    >
                      <i className='material-icons'>view_list</i>
                    </a>
                    {request.status == 1 && (
                      <a
                        className='edit text-yellow'
                        style={{ width: '5px' }}
                        title={translate('production.request_management.request_edit')}
                        onClick={() => handleEditRequest(request)}
                      >
                        <i className='material-icons'>edit</i>
                      </a>
                    )}
                    {/*Phê duyệt yêu cầu*/}
                    {props.checkRoleApprover(request) && (
                      <ConfirmNotification
                        icon='question'
                        title={translate('manage_warehouse.bill_management.approved_true')}
                        content={translate('manage_warehouse.bill_management.approved_true') + ' ' + request.code}
                        name='check_circle_outline'
                        className='text-green'
                        func={() => props.handleFinishedApproval(request)}
                      />
                    )}
                    {request.status == 1 && (
                      <ConfirmNotification
                        icon='question'
                        title={translate('production.request_management.cancel_request')}
                        content={translate('production.request_management.cancel_request') + ' ' + request.code}
                        name='cancel'
                        className='text-red'
                        func={() => props.handleCancelRequest(request)}
                      />
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {requestManagements.isLoading ? (
          <div className='table-info-panel'>{translate('confirm.loading')}</div>
        ) : (
          (typeof listRequests === 'undefined' || listRequests.length === 0) && (
            <div className='table-info-panel'>{translate('confirm.no_data')}</div>
          )
        )}
        <PaginateBar pageTotal={totalPages ? totalPages : 0} currentPage={page} func={props.setPage} />
      </div>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(IssueRequestManagementTable))
