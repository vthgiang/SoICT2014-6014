import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
//Actions
import { PurchaseOrderActions } from '../redux/actions'
import { purchasingRequestActions } from '../../../manufacturing/purchasing-request/redux/actions'
import { StockActions } from '../../../warehouse/stock-management/redux/actions'
import { CrmCustomerActions } from '../../../../crm/customer/redux/actions'
import { UserActions } from '../../../../super-admin/user/redux/actions'
import { GoodActions } from '../../../common-production/good-management/redux/actions'
import { BillActions } from '../../../warehouse/bill-management/redux/actions'
import { PaymentActions } from '../../payment/redux/actions'
//helpers
import { formatCurrency } from '../../../../../helpers/formatCurrency'
import { formatDate } from '../../../../../helpers/formatDate'
import { generateCode } from '../../../../../helpers/generateCode'
//Component
import { PaginateBar, DataTableSetting, SelectMulti, SelectBox } from '../../../../../common-components'

import PurchaseOrderCreateFormDirectly from './purchaseOrderCreateFormDirectly'
import PurchaseOrderCreateFormFromPurchasingRequest from './purchaseOrderCreateFormFromPurchasingRequest'
import PurchaseDetailForm from './purchaseOrderDetailForm'
import PurchaseOrderEditForm from './purchaseOrderEditForm'
// import GoodReceiptCreateForm from "../../../warehouse/bill-management/components/good-receipts/goodReceiptCreateForm";
import BillDetailForm from '../../../warehouse/bill-management/components/genaral/billDetailForm'
import PurchaseOrderApproveForm from './purchaseOrderApproveForm'
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration'
import { RequestActions } from '../../../common-production/request-management/redux/actions'
import EditForm from '../../request-management/components/good-purchase-request/editForm'

function PurchaseOrderTable(props) {
  const TableId = 'purchase-order-table'
  const defaultConfig = { limit: 5 }
  const limit = getTableConfiguration(TableId, defaultConfig).limit

  const [state, setState] = useState({
    limit: limit,
    page: 1,
    code: '',
    status: '',
    currentRole: localStorage.getItem('currentRole'),
    tableId: TableId
  })

  useEffect(() => {
    const { page, limit, currentRole } = state
    props.getAllPurchaseOrders({ page, limit, currentRole })
    props.getAllStocks()
    props.getCustomers()
    props.getUser()
    props.getAllGoodsByType({ type: 'material' })
    props.getAllRequestByCondition({ type: 1, requestType: 1, requestFrom: 'order', status: 3 })
  }, [])

  const handleClickCreateCode = () => {
    setState((state) => {
      return { ...state, codeCreate: generateCode('PO_') }
    })
  }

  const createDirectly = () => {
    window.$('#modal-add-purchase-order-directly').modal('show')
  }

  const createFromPurchasingRequest = () => {
    props.getAllPurchasingRequests({ status: 1 })
    window.$('#modal-add-purchase-order-from-puchasing-request').modal('show')
  }

  const setPage = async (page) => {
    const { limit, currentRole } = state
    await setState({
      ...state,
      page: page
    })
    const data = {
      limit,
      page: page,
      currentRole
    }
    props.getAllPurchaseOrders(data)
  }

  const setLimit = async (limit) => {
    const { page, currentRole } = state
    await setState({
      ...state,
      limit: limit
    })
    const data = {
      limit: limit,
      page,
      currentRole
    }
    props.getAllPurchaseOrders(data)
  }

  const reloadPurchaseOrderTable = () => {
    const { page, limit, code, status, supplier, currentRole } = state
    const data = {
      limit,
      page,
      code,
      status,
      supplier,
      currentRole
    }
    props.getAllPurchaseOrders(data)
  }

  const handleCodeChange = (e) => {
    const { value } = e.target
    setState({
      ...state,
      code: value
    })
  }

  const handleStatusChange = (value) => {
    setState({
      ...state,
      status: value
    })
  }

  const handleSupplierChange = (value) => {
    setState({
      ...state,
      supplier: value
    })
  }

  const handleSubmitSearch = () => {
    const { page, limit, code, status, supplier, currentRole } = state
    const data = {
      limit,
      page,
      code,
      status,
      supplier,
      currentRole
    }
    props.getAllPurchaseOrders(data)
  }

  const handleShowDetail = async (data) => {
    await props.getPaymentForOrder({ orderId: data._id, orderType: 2 })
    await setState({
      ...state,
      purchaseOrderDetail: data
    })
    window.$('#modal-detail-purchase-order').modal('show')
  }

  const handleEdit = async (data) => {
    await setState({
      ...state,
      purchaseOrderEdit: data
    })
    window.$('#modal-edit-purchase-order').modal('show')
  }

  const handleEditRequest = async (purchaseOrder) => {
    if (purchaseOrder.purchasingRequest && purchaseOrder.code) {
      let listGoods = []
      listGoods = purchaseOrder.materials.map((material) => {
        return {
          goodId: material.material._id,
          goodObject: material.material,
          quantity: material.quantity
        }
      })
      await setState({
        ...state,
        purchaseOrderId: purchaseOrder._id,
        purchasingRequest: purchaseOrder.purchasingRequest,
        listGoods: listGoods
      })
      window.$('#modal-edit-request').modal('show')
    } else {
      await setState({
        ...state,
        purchaseOrder,
        billCode: generateCode('BIRE')
      })
      window.$('#modal-create-bill-receipt').modal('show')
    }
  }

  const handleShowBillDetail = async (billId) => {
    await props.getDetailBill(billId)
    window.$('#modal-detail-bill').modal('show')
  }

  const checkUserForApprove = (purchaseOrder) => {
    const { approvers } = purchaseOrder
    const userId = localStorage.getItem('userId')
    // if (approvers) {
    let checkApprove = approvers.find((element) => element.approver && element.approver._id === userId)
    // }
    if (checkApprove) {
      return parseInt(checkApprove.status)
      //Trả về trạng thái 1. chưa phê duyệt, 2. Đã phê duyệt, 3. Đã hủy
    }
    return -1
  }

  const handleShowApprove = async (purchaseOrder) => {
    await setState({
      ...state,
      purchaseOrderApprove: purchaseOrder
    })
    window.$('#modal-approve-purchase-order').modal('show')
  }

  const checkCreator = (purchaseOrder) => {
    const { creator } = purchaseOrder
    const userId = localStorage.getItem('userId')
    if (userId === creator._id) {
      return true
    }
    return false
  }

  const {
    code,
    status,
    codeCreate,
    purchaseOrderEdit,
    purchaseOrderDetail,
    purchaseOrderAddBill,
    billCode,
    purchaseOrderApprove,
    tableId,
    purchasingRequest,
    listGoods,
    purchaseOrderId
  } = state

  const { translate, purchaseOrders, requestManagements } = props
  let listRequests = []
  if (requestManagements.listRequests) {
    listRequests = requestManagements.listRequests
  }
  const { totalPages, page, listPurchaseOrders } = purchaseOrders
  const statusConvert = [
    {
      className: 'text-primary',
      text: 'no status'
    },
    {
      className: 'text-primary',
      text: 'Chờ phê duyệt'
    },
    {
      className: 'text-success',
      text: 'Đã phê duyệt'
    },
    {
      className: 'text-warning',
      text: 'Yêu cầu nhập kho'
    },
    {
      className: 'text-success',
      text: 'Đã nhập kho'
    },
    {
      className: 'text-danger',
      text: 'Đã hủy'
    }
  ]
  return (
    <React.Fragment>
      <div className='box-body qlcv'>
        <div className='form-inline'>
          {/*Chọn cách thêm đơn mua nguyên vật liệu*/}
          {/* Button dropdown thêm mới đơn mua nguyên vật liệu */}
          <div className='dropdown pull-right' style={{ marginTop: 5 }}>
            <button
              type='button'
              className='btn btn-success dropdown-toggle pull-right'
              data-toggle='dropdown'
              aria-expanded='true'
              title={'Thêm mới đơn mua nguyên vật liệu'}
              onClick={handleClickCreateCode}
            >
              Thêm đơn
            </button>
            <ul className='dropdown-menu pull-right' style={{ marginTop: 0 }}>
              <li>
                <a style={{ cursor: 'pointer' }} title={`Tạo từ báo giá`} onClick={createFromPurchasingRequest}>
                  Thêm từ đơn đề nghị
                </a>
              </li>
              <li>
                <a style={{ cursor: 'pointer' }} title={`Tạo trực tiếp`} onClick={createDirectly}>
                  Thêm trực tiếp
                </a>
              </li>
            </ul>
          </div>
        </div>
        <PurchaseOrderCreateFormDirectly code={codeCreate} />
        <PurchaseOrderCreateFormFromPurchasingRequest code={codeCreate} listRequests={listRequests} />
        {purchaseOrderDetail && <PurchaseDetailForm purchaseOrderDetail={purchaseOrderDetail} />}
        {purchaseOrderEdit && <PurchaseOrderEditForm purchaseOrderEdit={purchaseOrderEdit} />}
        {purchasingRequest && listGoods && (
          <EditForm
            purchaseOrderId={purchaseOrderId}
            requestId={purchasingRequest._id}
            code={purchasingRequest.code}
            desiredTime={purchasingRequest.desiredTime}
            description={purchasingRequest.description}
            listGoods={listGoods}
            stock={purchasingRequest.stock}
            status={purchasingRequest.status}
            organizationalUnitValue={purchasingRequest.orderUnit}
          />
        )}
        {/* <GoodReceiptCreateForm
                    purchaseOrderAddBill={purchaseOrderAddBill}
                    createdSource={"purchaseOrder"}
                    billCode={billCode}
                    modalName={`Lập phiếu yêu cầu nhập kho cho đơn hàng: ${purchaseOrderAddBill ? purchaseOrderAddBill.code : ""}`}
                    reloadPurchaseOrderTable={reloadPurchaseOrderTable}
                    group={"1"}
                /> */}
        <BillDetailForm />
        <PurchaseOrderApproveForm purchaseOrderApprove={purchaseOrderApprove} />
        <div className='form-inline'>
          <div className='form-group'>
            <label className='form-control-static'>Mã đơn</label>
            <input type='text' className='form-control' value={code} onChange={handleCodeChange} placeholder='Mã đơn' autoComplete='off' />
          </div>
          <div className='form-group'>
            <label className='form-control-static'>Trạng thái đơn</label>
            <SelectBox
              id={`select-filter-status-material-purchase-order`}
              className='form-control select2'
              style={{ width: '100%' }}
              items={[
                {
                  value: 1,
                  text: 'Chờ phê duyệt'
                },
                {
                  value: 2,
                  text: 'Đã phê duyệt'
                },
                {
                  value: 3,
                  text: 'Yêu cầu nhập kho'
                },
                {
                  value: 4,
                  text: 'Đã nhập kho'
                },
                {
                  value: 5,
                  text: 'Đã hủy'
                }
              ]}
              onChange={handleStatusChange}
              value={status}
              multiple={true}
            />
          </div>
          <div className='form-group'>
            <label className='form-control-static'>Nhà cung cấp</label>
            <SelectMulti
              id={`selectMulti-filter-supplier-purchase-order`}
              className='form-control select2'
              style={{ width: '100%' }}
              items={
                props.customers.list.length !== 0
                  ? props.customers.list.map((customerItem) => {
                      return {
                        value: customerItem._id,
                        text: customerItem.name
                      }
                    })
                  : []
              }
              multiple='multiple'
              options={{ nonSelectedText: 'Chọn nhà cung cấp', allSelectedText: 'Đã chọn tất cả' }}
              onChange={handleSupplierChange}
            />
          </div>
          <div className='form-group'>
            <button type='button' className='btn btn-success' title='Lọc' onClick={handleSubmitSearch}>
              Tìm kiếm
            </button>
          </div>
        </div>
        <table id={tableId} className='table table-striped table-bordered table-hover' style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã đơn</th>
              <th>Trạng thái</th>
              <th>Tổng tiền</th>
              <th>Nhà cung cấp</th>
              <th>Người tạo</th>
              <th>Ngày tạo</th>
              <th
                style={{
                  width: '120px',
                  textAlign: 'center'
                }}
              >
                {translate('table.action')}
                <DataTableSetting
                  tableId={tableId}
                  columnArr={['STT', 'Mã đơn', 'Trạng thái', 'Người tạo', 'Tổng tiền']}
                  setLimit={setLimit}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {listPurchaseOrders.length !== 0 &&
              listPurchaseOrders.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.code}</td>
                  <td className={item.status ? statusConvert[item.status].className : ''}>
                    {item.status ? statusConvert[item.status].text : ''}
                  </td>
                  <td>{item.paymentAmount ? formatCurrency(item.paymentAmount) : ''}</td>
                  <td>{item.supplier ? item.supplier.name : ''}</td>
                  <td>{item.creator ? item.creator.name : ''}</td>
                  <td>{item.createdAt ? formatDate(item.createdAt) : ''}</td>
                  <td style={{ textAlign: 'center' }}>
                    <a onClick={() => handleShowDetail(item)}>
                      <i className='material-icons'>view_list</i>
                    </a>
                    {checkUserForApprove(item) === 1 && item.status === 1 && (
                      <a
                        onClick={() => handleShowApprove(item)}
                        className='add text-success'
                        style={{ width: '5px' }}
                        title='Phê duyệt đơn'
                      >
                        <i className='material-icons'>check_circle_outline</i>
                      </a>
                    )}
                    <a onClick={() => handleEdit(item)} className='edit text-yellow' style={{ width: '5px' }} title='Sửa đơn'>
                      <i className='material-icons'>edit</i>
                    </a>
                    {!item.bill && item.status === 2 && checkCreator(item) && (
                      <a
                        onClick={() => handleEditRequest(item)}
                        className='add text-success'
                        style={{ width: '5px' }}
                        title='Tạo yêu cầu phê duyệt nhập kho'
                      >
                        <i className='material-icons'>add</i>
                      </a>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {purchaseOrders.isLoading ? (
          <div className='table-info-panel'>{translate('confirm.loading')}</div>
        ) : (
          (typeof listPurchaseOrders === 'undefined' || listPurchaseOrders.length === 0) && (
            <div className='table-info-panel'>{translate('confirm.no_data')}</div>
          )
        )}
        <PaginateBar pageTotal={totalPages ? totalPages : 0} currentPage={page} func={setPage} />
      </div>
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  const { customers } = state.crm
  const { purchaseOrders, requestManagements } = state
  return { purchaseOrders, customers, requestManagements }
}

const mapDispatchToProps = {
  getAllRequestByCondition: RequestActions.getAllRequestByCondition,
  getAllPurchaseOrders: PurchaseOrderActions.getAllPurchaseOrders,
  getAllPurchasingRequests: purchasingRequestActions.getAllPurchasingRequests,
  getAllStocks: StockActions.getAllStocks,
  getCustomers: CrmCustomerActions.getCustomers,
  getUser: UserActions.get,
  getAllGoodsByType: GoodActions.getAllGoodsByType,
  getDetailBill: BillActions.getDetailBill,
  getPaymentForOrder: PaymentActions.getPaymentForOrder
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(PurchaseOrderTable))
