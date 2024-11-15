import React, {useEffect, useState} from 'react'
import {connect, useDispatch, useSelector} from 'react-redux'
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
  DataTableSetting, DeleteNotification,
} from '@common-components'
import OrderCreateForm from './orderCreateForm'
import {getTableConfiguration} from '@helpers/tableConfiguration'
import OrderDetail from '@modules/transport3/order/components/orderDetail';
import OrderEdit from '@modules/transport3/order/components/orderEdit.jsx';

function OrderTable(props) {
  const TableId = 'order-table'
  const defaultConfig = {limit: 10}
  const Limit = getTableConfiguration(TableId, defaultConfig).limit

  let dispatch = useDispatch()
  const currentRole = localStorage.getItem('currentRole')
  const userdepartments = useSelector((state) => state.user.userdepartments)

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

  useEffect(() => {
    dispatch(UserActions.getAllUserSameDepartment(currentRole))
  }, [dispatch])
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
  }

  const setLimit = async (limit) => {
    await setState({
      ...state,
      limit: limit
    })
  }


  const handleOrderCodeChange = (e) => {
    let {value} = e.target
    setState({
      ...state,
      codeQuery: value
    })
  }


  const handleSubmitSearch = () => {
    dispatch(OrderActions.getAllOrder({query: state.codeQuery}))
    setPage(1);
  }

  const handleShowDetailInfo = (request) => {
    setState({
      ...state,
      currentDetail: request,
    });
    window.$(`#modal-detail-order`).modal('show')
  }

  const handleShowEditInfo = (request) => {
    setState({
      ...state,
      currentDetail: request,
    });
    window.$(`#modal-edit-order`).modal('show')
  }

  const createDirectly = () => {
    window.$('#modal-add-order').modal('show')
  }

  const retrainingModel = () => {
    dispatch(OrderActions.retrainingModel())
  }

  let {limit, code, tableId, page} = state
  const {translate, orders} = props

  let {listOrders} = orders

  const columns = [
    'STT',
    'Mã đơn',
    'Loại hình vận chuyển',
    'Khách hàng',
    'Địa chỉ',
    'Độ ưu tiên',
    'Trạng thái',
    'T/g giao hàng dự kiến'
  ]

  const transportType = {
    1: 'Giao hàng',
    2: 'Nhận hàng',
    3: 'Vận chuyển giữa kho'
  }

  const priority = {
    1: 'Thấp',
    2: 'Trung bình',
    3: 'Cao',
    4: 'Đặc biệt'
  }

  const status = {
    1: 'Chờ xác nhận',
    2: 'Đã xác nhận',
    3: 'Đã giao hàng',
  }

  const isManager = () => {
    return !!userdepartments?.managers[currentRole];

  }

  let pageTotal = Math.ceil(listOrders.filter((item) => item.status !== 1).length / limit);
  const listData = listOrders
    .filter((item) => item.status !== 1)
    .sort((a, b) => a.status - b.status)
    .sort((a, b) => b.priority - a.priority)
    .slice((page - 1) * limit, (page - 1) * limit + limit);

  let listNotApproved = listOrders.filter((item) => item.status === 1);

  const handleApproveOrder = (order) => {
    dispatch(OrderActions.approveOrder(order._id));
    dispatch(OrderActions.getAllOrder({query: state.codeQuery}));
  }

  const handleDeleteOrder = (order_id) => {
    dispatch(OrderActions.deleteOrder(order_id));
    dispatch(OrderActions.getAllOrder({query: state.codeQuery}));
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
            {isManager() && <div className="dropdown pull-right" style={{marginTop: 5, marginRight: 10}}>
              <button
                type="button"
                className="btn btn-success dropdown-toggle pull-right"
                aria-expanded="true"
                onClick={() => retrainingModel()}
              >
                Cập nhật mô hình dự báo
              </button>
            </div>}

          </div>
          <OrderCreateForm code={code}/>
          <OrderDetail order={state.currentDetail}/>
          <OrderEdit order={state.currentDetail}/>
          {/* Tim kiem */}
          <div className="form-inline">
            <div className="form-group">
              <label className="form-control-static">Tìm kiếm</label>
              <input
                type="text"
                className="form-control"
                name="codeQuery"
                onChange={handleOrderCodeChange}
                placeholder="Nhập vào mã đơn hoặc tên khách hàng"
                autoComplete="off"
              />
            </div>
            <div className="form-group">
              <button type="button" className="btn btn-success" title="Lọc" onClick={handleSubmitSearch}>
                Tìm kiếm
              </button>
            </div>
          </div>
          {/* Bang Chua Duyet*/}
          <fieldset className="scheduler-border">
            <legend className="scheduler-border">Vận đơn chưa duyệt</legend>
            <table id={tableId} className="table table-striped table-bordered table-hover" style={{marginTop: 20}}>
              <thead>
              <tr>
                {columns.map((column, index) => (
                  <th className={'text-center'} key={index}>{column}</th>
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
                listNotApproved.length !== 0 &&
                listNotApproved.map((item, index) => (
                  <tr key={index}>
                    <td className={'text-center'}>{index + 1 + (page - 1) * limit}</td>
                    <td className={'text-center'}>{item.code ? item.code : ''}</td>
                    <td className={'text-center'}>{item.transportType ? transportType[item.transportType] : ''}</td>
                    <td>{item.customer ? item.customer.name : ''}</td>
                    <td>{item.address ? item.address : ''}</td>
                    <td className={'text-center'}>{item.priority ? priority[item.priority] : ''}</td>
                    <td className={'text-center'}>{item.status ? status[item.status] : ''}</td>
                    <td
                      className={'text-center'}>{item.deliveryTime ? formatDate(new Date(item.deliveryTime * 1000)) : '---'}</td>
                    <td className={'text-center'}>
                      {/*  Phe duyet*/}
                      <a
                        onClick={() => handleApproveOrder(item)}
                        className="edit text-green"
                        style={{width: '5px'}}
                        title="Phê duyệt"
                      >
                        <i className="material-icons">check</i>
                      </a>
                      <a
                        style={{width: '5px'}}
                        title="Chi tiết"
                        onClick={() => handleShowDetailInfo(item)}>
                        <i className="material-icons">view_list</i>
                      </a>
                      {/*  Sua*/}
                        <a
                            onClick={() => handleShowEditInfo(item)}
                            className="edit text-yellow"
                            style={{width: '5px'}}
                            title="Sửa vận đơn"
                        >
                            <i className="material-icons">edit</i>
                        </a>
                      {/*  Xoa*/}
                      <DeleteNotification
                        content={'Xác nhận xóa vận đơn?'}
                        data={{id: item._id}}
                        func={handleDeleteOrder}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.isLoading ? (
              <div className="table-info-panel">{translate('confirm.loading')}</div>
            ) : (
              (typeof listNotApproved === 'undefined' || listNotApproved.length === 0) && (
                <div className="table-info-panel">{translate('confirm.no_data')}</div>
              )
            )}
          </fieldset>
          {/* Bang Da Duyet*/}
          <fieldset className="scheduler-border">
            <legend className="scheduler-border">Danh sách vận đơn</legend>
            <table id={tableId} className="table table-striped table-bordered table-hover" style={{marginTop: 20}}>
              <thead>
              <tr>
                {columns.map((column, index) => (
                  <th className={'text-center'} key={index}>{column}</th>
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
                listData.map((item, index) => (
                  <tr key={index}>
                    <td className={'text-center'}>{index + 1 + (page - 1) * limit}</td>
                    <td className={'text-center'}>{item.code ? item.code : ''}</td>
                    <td className={'text-center'}>{item.transportType ? transportType[item.transportType] : ''}</td>
                    <td>{item.customer ? item.customer.name : ''}</td>
                    <td>{item.address ? item.address : ''}</td>
                    <td className={'text-center'}>{item.priority ? priority[item.priority] : ''}</td>
                    <td className={'text-center'}>{item.status ? status[item.status] : ''}</td>
                    <td
                      className={'text-center'}>{item.deliveryTime ? formatDate(new Date(item.deliveryTime * 1000)) : '---'}</td>
                    <td
                      style={{
                        textAlign: 'center'
                      }}
                    >
                      <a
                        style={{width: '5px'}}
                        title="Chi tiết"
                        onClick={() => handleShowDetailInfo(item)}>
                        <i className="material-icons">view_list</i>
                      </a>
                      {/*  Sua*/}
                      <a
                        onClick={() => handleShowEditInfo(item)}
                        className="edit text-yellow"
                        style={{width: '5px'}}
                        title="Sửa vận đơn"
                      >
                        <i className="material-icons">edit</i>
                      </a>
                      {/*  Xoa*/}
                      <DeleteNotification
                        content={'Xác nhận xóa vận đơn?'}
                        data={{id: item._id}}
                        func={handleDeleteOrder}
                      />
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
            <PaginateBar pageTotal={pageTotal} currentPage={page} func={setPage}/>
          </fieldset>
        </div>
      </div>
    </>
  )
}

function mapStateToProps(state) {
  const {customers} = state.crm
  const {orders, schedules, department, role, auth} = state
  return {orders, schedules, customers, department, role, auth}
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
