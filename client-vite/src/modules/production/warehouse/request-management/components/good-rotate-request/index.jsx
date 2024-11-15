import React, { useState } from 'react'
import { connect } from 'react-redux'
import { formatDate } from '../../../../../../helpers/formatDate'
import { ConfirmNotification, DataTableSetting, DatePicker, PaginateBar, SelectMulti } from '../../../../../../common-components'
import DetailForm from '../common-components/detailForm'
import EditForm from './editForm'
import CreateForm from './createForm'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import { RequestActions } from '../../../../common-production/request-management/redux/actions'
import GoodIssueCreateFormModal from '../../../bill-management/components/good-issues/goodIssueCreateFormModal'
import GoodReceiptCreateFormModal from '../../../bill-management/components/good-receipts/goodReceiptCreateFormModal'
import ApproveForm from '../common-components/approveForm'
import { dataListStatus } from '../common-components/config'

function GoodRotateRequestManagementTable(props) {
  const [state, setState] = useState({
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

  const checkRoleApproverInToStock = (request) => {
    const { approvers } = request
    let count = 0
    approvers.forEach((approver) => {
      if (approver.approveType == 5) {
        const userId = localStorage.getItem('userId')
        let approverIds = approver.information.map((x) => x.approver._id)
        if (approverIds.includes(userId) && approver.information[approverIds.indexOf(userId)].approvedTime === null) {
          count++
        }
      }
    })
    return count > 0
  }

  const handleShowApproveInToStock = async (request) => {
    await setState({
      ...state,
      requestApprove: request,
      fromStock: false
    })
    await window.$('#modal-approve-form').modal('show')
  }

  const handleShowApproveInFromStock = async (request) => {
    await setState({
      ...state,
      requestApprove: request,
      fromStock: true
    })
    await window.$('#modal-approve-form').modal('show')
  }

  const handleCreateIssueBill = async (request) => {
    await setState({
      ...state,
      issueRequest: request
    })
    window.$('#modal-create-new-issue-bill').modal('show')
  }

  const handleCreateReceiptBill = async (request) => {
    await setState({
      ...state,
      receiptRequest: request
    })
    window.$('#modal-create-new-receipt-bill').modal('show')
  }

  const getSourceRequest = (requestType, type) => {
    if (requestType == 3 && type == 3) return 'Đề nghị tạo từ trong kho'
  }

  const getListStatus = (request) => {
    let listStatus = []
    if (request.requestType == 3 && request.type == 4) {
      listStatus = dataListStatus.listStatusRotate()
    }
    return listStatus
  }

  const { translate, requestManagements } = props
  let listRequests = []
  if (requestManagements.listRequests) {
    listRequests = requestManagements.listRequests
  }
  const { totalPages, page } = requestManagements
  const { code, createdAt, planCode, desiredTime, fromStock } = state

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
          fromStock={state.currentRow.stock._id}
          toStock={state.currentRow.toStock._id}
          status={state.currentRow.status}
          approverInFromStock={state.currentRow.approvers ? state.currentRow.approvers.filter((x) => x.approveType == 4) : []}
          approverInToStock={state.currentRow.approvers ? state.currentRow.approvers.filter((x) => x.approveType == 5) : []}
          stockRequestType={props.stockRequestType}
        />
      )}
      <GoodReceiptCreateFormModal
        createType={4} // 3: create from request in request screen
        requestId={state.receiptRequest ? state.receiptRequest._id : ''}
        request={state.receiptRequest}
      />
      <GoodIssueCreateFormModal
        createType={4} // 3: create from request in request screen
        requestId={state.issueRequest ? state.issueRequest._id : ''}
        request={state.issueRequest}
      />
      <ApproveForm
        requestId={state.requestApprove ? state.requestApprove._id : ''}
        requestApprove={state.requestApprove}
        fromStock={fromStock}
        createGoodTakesType={5}
      />
      <div className='box-body qlcv'>
        <CreateForm stockRequestType={props.stockRequestType} />
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
                { value: 1, text: translate('production.request_management.receipt_request_from_order.1.content') },
                { value: 2, text: translate('production.request_management.receipt_request_from_order.2.content') },
                { value: 5, text: translate('production.request_management.receipt_request_from_order.5.content') }
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
              <th>{translate('production.request_management.source_request')}</th>
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
                    translate('production.request_management.source_request'),
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
                  <td>{getSourceRequest(request.requestType, request.type)}</td>
                  <td>{formatDate(request.desiredTime)}</td>
                  <td>
                    <div>
                      <div className='timeline-index'>
                        <div
                          className='timeline-progress'
                          style={{ width: ((parseInt(request.status) - 1) / (getListStatus(request).length - 1)) * 100 + '%' }}
                        ></div>
                        <div className='timeline-items'>
                          {getListStatus(request).map((status, index) => (
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
                      <a
                        onClick={() => handleShowApproveInFromStock(request)}
                        className='add text-success'
                        style={{ width: '5px' }}
                        title='Phê duyệt đơn'
                      >
                        <i className='material-icons'>check_circle_outline</i>
                      </a>
                    )}
                    {checkRoleApproverInToStock(request) && (
                      <a
                        onClick={() => handleShowApproveInToStock(request)}
                        className='add text-success'
                        style={{ width: '5px' }}
                        title='Phê duyệt đơn'
                      >
                        <i className='material-icons'>check_circle_outline</i>
                      </a>
                    )}
                    {request.status == 2 && (
                      <a
                        onClick={() => handleCreateIssueBill(request)}
                        className='add text-success'
                        style={{ width: '5px' }}
                        title='Tạo phiếu xuất kho'
                      >
                        <i className='material-icons'>add</i>
                      </a>
                    )}
                    {
                      // request.status == 4 &&
                      <a
                        onClick={() => handleCreateReceiptBill(request)}
                        className='add text-success'
                        style={{ width: '5px' }}
                        title='Tạo phiếu nhập kho'
                      >
                        <i className='material-icons'>add</i>
                      </a>
                    }
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

const mapDispatchToProps = {
  editRequest: RequestActions.editRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GoodRotateRequestManagementTable))
