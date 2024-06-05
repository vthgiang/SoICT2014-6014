import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import {withTranslate} from 'react-redux-multilingual'
//Actions
import {OrderActions} from '../redux/actions'
import {RoleActions} from '@modules/super-admin/role/redux/actions'
import {StockActions} from '@modules/production/warehouse/stock-management/redux/actions'
import {UserActions} from '@modules/super-admin/user/redux/actions'
import {GoodActions} from '@modules/production/common-production/good-management/redux/actions'
import {LotActions} from '@modules/production/warehouse/inventory-management/redux/actions'
import {CrmCustomerActions} from '@modules/crm/customer/redux/actions'

//Helper Function
import {formatDate} from '@helpers/formatDate'
import {generateCode} from '@helpers/generateCode'
//Components Import
import {
  PaginateBar,
  DataTableSetting,
  SelectMulti,
} from '@common-components'
import OrderCreateForm from './orderCreateForm'
import {getTableConfiguration} from '@helpers/tableConfiguration'
import OrderDetail from '@modules/transport3/order/components/orderDetail.jsx';

function OrderTable(props) {
  const TableId = 'order-table'
  const defaultConfig = {limit: 5}
  const Limit = getTableConfiguration(TableId, defaultConfig).limit

  const [state, setState] = useState({
    currentRole: localStorage.getItem('currentRole'),
    page: 1,
    limit: Limit,
    code: '',
    status: null,
    tableId: TableId
  })

  useEffect(() => {
    const {page, limit, currentRole} = state
    props.getCustomers({getAll: true})

    props.getAllStocks({managementLocation: currentRole})
    props.getUser()
    props.getGoodsByType({type: 'product'})
    props.getAllOrder()
  }, [])

  const handleClickCreateCode = () => {
    setState((state) => {
      return {...state, code: generateCode('TP_')}
    })
  }

  const setPage = async (page) => {
    await setState({
      ...state,
      page: page
    })
    const data = {
      limit: state.limit,
      page: page,
      currentRole: state.currentRole
    }
  }

  const setLimit = async (limit) => {
    await setState({
      ...state,
      limit: limit
    })
    const data = {
      limit: limit,
      page: state.page,
      currentRole: state.currentRole
    }
  }


  const handleOrderCodeChange = (e) => {
    let {value} = e.target
    setState({
      ...state,
      codeQuery: value
    })
  }


  const handleSubmitSearch = () => {
    let {limit, page, codeQuery, status, customer} = state
    const data = {
      limit,
      page,
      code: codeQuery,
      status,
      customer,
      currentRole: state.currentRole
    }
  }

  const handleShowDetailInfo = (request) => {
    setState({
      ...state,
      currentDetail: request,
    });
    window.$(`#modal-detail-order`).modal('show')
  }

  const createDirectly = () => {
    window.$('#modal-add-order').modal('show')
  }

  let {limit, code, tableId} = state
  const {translate, orders} = props
  const {totalPages, page} = orders

  let {listOrders} = orders

  const columns = [
    'STT',
    'Mã đơn',
    'Loại hình vận chuyển',
    'Khách hàng',
    'Địa chỉ',
    'Độ ưu tiên',
    'Trạng thái',
    'T/g giao hàng dự kiến',
  ]

  const transportType = {
    1: 'Giao hàng',
    2: 'Nhận hàng',
    3: 'Vận chuyển giữa kho'
  }

  return (
    <>
      <div className="nav-tabs-custom">
        <div className="box-body qlcv">
          <div className="form-inline">
            <div className="dropdown pull-right" style={{marginTop: 5}}>
              <button
                type="button"
                className="btn btn-success dropdown-toggle pull-right"
                data-toggle="dropdown"
                aria-expanded="true"
                title={'Đơn hàng mới'}
                onClick={handleClickCreateCode}
              >
                Thêm vận đơn mới
              </button>
              <ul className="dropdown-menu pull-right" style={{marginTop: 0}}>
                <li>
                  <a style={{cursor: 'pointer'}} title={`Thêm từ đơn hàng`}>
                    Thêm từ đơn hàng
                  </a>
                </li>
                <li>
                  <a style={{cursor: 'pointer'}} title={`Thêm trực tiếp`} onClick={createDirectly}>
                    Thêm trực tiếp
                  </a>
                </li>
                <li>
                  <a style={{cursor: 'pointer'}} title={`Thêm từ file`}>
                    Thêm từ file
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <OrderCreateForm code={code}/>
          <OrderDetail order={state.currentDetail}/>
          {/* Tim kiem */}
          <div className="form-inline">
            <div className="form-group">
              <label className="form-control-static">Mã đơn</label>
              <input
                type="text"
                className="form-control"
                name="codeQuery"
                onChange={handleOrderCodeChange}
                placeholder="Nhập vào mã đơn"
                autoComplete="off"
              />
            </div>
            <div className="form-group">
              <button type="button" className="btn btn-success" title="Lọc" onClick={handleSubmitSearch}>
                Tìm kiếm
              </button>
            </div>
          </div>
          {/* Bang */}
          <table id={tableId} className="table table-striped table-bordered table-hover" style={{marginTop: 20}}>
            <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column}</th>
              ))}
              <th
                style={{
                  width: '120px',
                  textAlign: 'center'
                }}
              >
                {translate('table.action')}
                <DataTableSetting
                  tableId={tableId}
                  columnArr={columns}
                  setLimit={setLimit}
                />
              </th>
            </tr>
            </thead>
            <tbody>
            {typeof listOrders !== 'undefined' &&
              listOrders.length !== 0 &&
              listOrders.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1 + (page - 1) * limit}</td>
                  <td>{item.code ? item.code : ''}</td>
                  <td>{item.transportType ? transportType[item.transportType] : ''}</td>
                  <td>{item.customer ? item.customer.name : ''}</td>
                  <td>{item.address ? item.address : ''}</td>
                  <td>{item.priority ? item.priority : ''}</td>
                  <td>{item.status ? item.status : ''}</td>
                  <td>{item.deliveryTime ? formatDate(item.deliveryTime) : '---'}</td>
                  <td
                    style={{
                      textAlign: 'center'
                    }}
                  >
                    <a onClick={() => handleShowDetailInfo(item)}>
                      <i className="material-icons">view_list</i>
                    </a>
                    {/* Sửa đơn sau khi đã phê duyệt */}
                    {/*{item.status !== 1 && item.status !== 8 && item.status !== 7 && (*/}
                    {/*  <a*/}
                    {/*    onClick={() => handleEditOrderAfterApprove(item)}*/}
                    {/*    className='edit text-yellow'*/}
                    {/*    style={{ width: '5px' }}*/}
                    {/*    title='Sửa đơn'*/}
                    {/*  >*/}
                    {/*    <i className='material-icons'>edit</i>*/}
                    {/*  </a>*/}
                    {/*)}*/}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.isLoading ? (
            <div className="table-info-panel">{translate('confirm.loading')}</div>
          ) : (
            (typeof listOrders === 'undefined' || listOrders.length === 0) && (
              <div className="table-info-panel">{translate('confirm.no_data')}</div>
            )
          )}
          <PaginateBar pageTotal={totalPages ? totalPages : 0} currentPage={page} func={setPage}/>
        </div>
      </div>
    </>
  )
}

function mapStateToProps(state) {
  const {customers} = state.crm
  const {orders, department, role, auth} = state
  return {orders, customers, department, role, auth}
}

const mapDispatchToProps = {
  getAllRoles: RoleActions.get,
  getCustomers: CrmCustomerActions.getCustomers,
  getAllStocks: StockActions.getAllStocks,
  getUser: UserActions.get,
  getGoodsByType: GoodActions.getGoodsByType,
  getInventoryByGoodIds: LotActions.getInventoryByGoodIds,
  getAllOrder: OrderActions.getAllOrder
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(OrderTable))
