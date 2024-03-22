import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import ReceiptRequest from './good-receipt-request/index'
import IssueRequest from './good-issue-request/index'
import PurchaseRequest from './good-purchase-request/index'
import { RequestActions } from '../../../common-production/request-management/redux/actions'
import { GoodActions } from '../../../common-production/good-management/redux/actions'
import { LotActions } from '../../../warehouse/inventory-management/redux/actions'
import { UserActions } from '../../../../super-admin/user/redux/actions'
import { StockActions } from '../../../warehouse/stock-management/redux/actions'
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions'
import { LazyLoadComponent } from '../../../../../common-components/index'
import { CrmCustomerActions } from '../../../../crm/customer/redux/actions'
import { PurchaseOrderActions } from '../../purchase-order/redux/actions'
import { SalesOrderActions } from '../../sales-order/redux/actions'

function RequestManagement(props) {
  const [state, setState] = useState({
    currentRole: localStorage.getItem('currentRole'),
    page: 1,
    limit: 5,
    requestType: 1,
    type: 1,
    createdAt: '',
    desiredTime: '',
    code: '',
    status: null,
    requestFrom: 'order'
  })

  useEffect(() => {
    const { page, limit, currentRole } = state
    props.getAllRequestByCondition({ type: state.type, requestType: state.requestType, requestFrom: state.requestFrom })
    props.getAllGoodsByType({ type: 'material' })
    props.getUser()
    props.getAllStocks()
    props.getAllDepartments()
    props.getCustomers()
    props.getAllPurchaseOrders({ page, limit, currentRole, status: 2 })
    props.getAllSalesOrders({ page, limit, currentRole })
  }, [])

  const handleCodeChange = (e) => {
    const { value } = e.target
    setState({
      ...state,
      code: value
    })
  }

  const handleCreatedAtChange = (value) => {
    setState({
      ...state,
      createdAt: value
    })
  }

  const handleDesiredTimeChange = (value) => {
    if (value === '') {
      value = null
    }
    setState({
      ...state,
      desiredTime: value
    })
  }

  const handleStatusChange = (value) => {
    if (value.length === 0) {
      value = null
    }
    setState({
      ...state,
      status: value
    })
  }

  const handleSubmitSearch = () => {
    setState({
      ...state,
      page: 1
    })
    const data = {
      limit: state.limit,
      page: state.page,
      createdAt: state.createdAt,
      desiredTime: state.desiredTime,
      code: state.code,
      status: state.status,
      requestFrom: 'order'
    }
    props.getAllRequestByCondition(data)
  }

  const checkRoleApprover = (request) => {
    const { approvers } = request
    let count = 0
    approvers.forEach((approver) => {
      let approveType = request.status == 2 ? 2 : 3
      if (approver.approveType == approveType) {
        const userId = localStorage.getItem('userId')
        let approverIds = approver.information.map((x) => x.approver._id)
        if (approverIds.includes(userId) && approver.information[approverIds.indexOf(userId)].approvedTime === null) {
          count++
        }
      }
    })
    return count > 0
  }

  const handleFinishedApproval = (request) => {
    const userId = localStorage.getItem('userId')
    const data = {
      approvedUser: userId,
      approveType: request.status == 2 ? 2 : 3
    }
    props.editRequest(request._id, data)
  }

  const checkRoleApproverReceiptRequestToStock = (request) => {
    const { approverReceiptRequestInOrder } = request
    const userId = localStorage.getItem('userId')
    let approverIds = approverReceiptRequestInOrder.map((x) => x.approver)
    if (approverIds.includes(userId) && approverReceiptRequestInOrder[approverIds.indexOf(userId)].approvedTime === null) {
      return true
    }
    return false
  }

  const handleFinishedApprovalReceiptRequestToStock = (request) => {
    const userId = localStorage.getItem('userId')
    const data = {
      approverIdReceiptRequestInOrder: userId
    }
    props.editRequest(request._id, data)
  }

  const handleCancelRequest = (request) => {
    const data = {
      status: 5
    }
    props.editRequest(request._id, data)
  }

  const setLimit = async (limit) => {
    await setState({
      ...state,
      limit: limit,
      page: state.page
    })

    let page = state.page
    props.getAllRequestByCondition({ page, limit })
  }

  const setPage = async (page) => {
    await setState({
      ...state,
      limit: state.limit,
      page: page
    })
    let limit = state.limit
    props.getAllRequestByCondition({ page, limit })
  }

  const handlePurchasingRequest = async () => {
    const requestType = 1
    const type = 1
    const requestFrom = 'order'
    await setState({
      ...state,
      type: type,
      requestType: requestType,
      requestFrom: requestFrom
    })
    await props.getAllRequestByCondition({ type, requestType, requestFrom })
  }

  const handleReceiptRequest = async () => {
    const requestType = 2
    const type = 1
    const requestFrom = 'order'
    await setState({
      ...state,
      type: type,
      requestType: requestType,
      requestFrom: requestFrom
    })
    await props.getAllRequestByCondition({ type, requestType, requestFrom })
  }

  const handleIssueRequest = async () => {
    const requestType = 2
    const type = 2
    const requestFrom = 'order'
    await setState({
      ...state,
      type: type,
      requestType: requestType,
      requestFrom: requestFrom
    })
    await props.getAllRequestByCondition({ type, requestType, requestFrom })
  }

  const { translate } = props
  const { requestType, type } = state

  return (
    <div className='nav-tabs-custom'>
      <ul className='nav nav-tabs'>
        <li className='active'>
          <a href='#good-purchasing-request' data-toggle='tab' onClick={() => handlePurchasingRequest()}>
            {translate('production.request_management.purchase_request')}
          </a>
        </li>
        <li>
          <a href='#good-receipt-request' data-toggle='tab' onClick={() => handleReceiptRequest()}>
            {translate('production.request_management.receipt_request')}
          </a>
        </li>
        <li>
          <a href='#good-issue-request' data-toggle='tab' onClick={() => handleIssueRequest()}>
            {translate('production.request_management.issue_request')}
          </a>
        </li>
        <li>
          <a href='#transport-request' data-toggle='tab' onClick={() => handleIssueRequest()}>
            {translate('production.request_management.transport_request')}
          </a>
        </li>
      </ul>
      <div className='tab-content'>
        <div className='tab-pane active' id='good-purchasing-request'>
          {requestType == 1 && type == 1 && (
            <LazyLoadComponent>
              <PurchaseRequest
                setPage={setPage}
                setLimit={setLimit}
                checkRoleApprover={checkRoleApprover}
                handleFinishedApproval={handleFinishedApproval}
                handleCancelRequest={handleCancelRequest}
                handleCodeChange={handleCodeChange}
                handleCreatedAtChange={handleCreatedAtChange}
                handleDesiredTimeChange={handleDesiredTimeChange}
                handleStatusChange={handleStatusChange}
                handleSubmitSearch={handleSubmitSearch}
                checkRoleApproverReceiptRequestToStock={checkRoleApproverReceiptRequestToStock}
                handleFinishedApprovalReceiptRequestToStock={handleFinishedApprovalReceiptRequestToStock}
              />
            </LazyLoadComponent>
          )}
        </div>
        <div className='tab-pane' id='good-receipt-request'>
          {requestType == 2 && type == 1 && (
            <LazyLoadComponent>
              <ReceiptRequest
                setPage={setPage}
                setLimit={setLimit}
                checkRoleApprover={checkRoleApprover}
                handleFinishedApproval={handleFinishedApproval}
                handleCancelRequest={handleCancelRequest}
                handleCodeChange={handleCodeChange}
                handleCreatedAtChange={handleCreatedAtChange}
                handleDesiredTimeChange={handleDesiredTimeChange}
                handleStatusChange={handleStatusChange}
                handleSubmitSearch={handleSubmitSearch}
                checkRoleApproverReceiptRequestToStock={checkRoleApproverReceiptRequestToStock}
                handleFinishedApprovalReceiptRequestToStock={handleFinishedApprovalReceiptRequestToStock}
              />
            </LazyLoadComponent>
          )}
        </div>
        <div className='tab-pane' id='good-issue-request'>
          {requestType == 2 && type == 2 && (
            <LazyLoadComponent>
              <IssueRequest
                setPage={setPage}
                setLimit={setLimit}
                checkRoleApprover={checkRoleApprover}
                handleFinishedApproval={handleFinishedApproval}
                handleCancelRequest={handleCancelRequest}
                handleCodeChange={handleCodeChange}
                handleCreatedAtChange={handleCreatedAtChange}
                handleDesiredTimeChange={handleDesiredTimeChange}
                handleStatusChange={handleStatusChange}
                handleSubmitSearch={handleSubmitSearch}
                checkRoleApproverReceiptRequestToStock={checkRoleApproverReceiptRequestToStock}
                handleFinishedApprovalReceiptRequestToStock={handleFinishedApprovalReceiptRequestToStock}
              />
            </LazyLoadComponent>
          )}
        </div>
      </div>
    </div>
  )
}
const mapStateToProps = (state) => state

const mapDispatchToProps = {
  getAllRequestByCondition: RequestActions.getAllRequestByCondition,
  getAllGoodsByType: GoodActions.getAllGoodsByType,
  getInventoryByGoodIds: LotActions.getInventoryByGoodIds,
  editRequest: RequestActions.editRequest,
  getUser: UserActions.get,
  getAllStocks: StockActions.getAllStocks,
  editRequest: RequestActions.editRequest,
  getAllDepartments: DepartmentActions.get,
  getCustomers: CrmCustomerActions.getCustomers,
  getAllPurchaseOrders: PurchaseOrderActions.getAllPurchaseOrders,
  getAllSalesOrders: SalesOrderActions.getAllSalesOrders
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(RequestManagement))
