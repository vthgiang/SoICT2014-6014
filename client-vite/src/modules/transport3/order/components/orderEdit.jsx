import React, {useEffect} from 'react'
import {withTranslate} from 'react-redux-multilingual'
import {formatDate} from '@helpers/formatDate'
import {DatePicker, DialogModal, SelectBox} from '@common-components'
import '@modules/crm/customer/components/customer.css'
import 'leaflet/dist/leaflet.css';
import GoodComponentRequest
  from '@modules/production/common-production/request-management/components/goodComponent.jsx';
import {useDispatch} from 'react-redux';
import {OrderActions} from '@modules/transport3/order/redux/actions';

const OrderEdit = (props) => {
  const {order} = props
  const dispatch = useDispatch()
  const [state, setState] = React.useState({
    priority: order?.priority,
    status: order?.status,
    deliveryTime: order?.deliveryTime,
    listGoods: order?.goods.map(good => {
      return {
        goodId: good.good,
        goodObject: {
          code: good.code,
          name: good.goodName,
          baseUnit: good.baseUnit,
        },
        quantity: good.quantity,
      }
    }),
    note: order?.note,
    noteAddress: order?.noteAddress
  });

  useEffect(() => {
    setState({
      priority: order?.priority,
      status: order?.status,
      deliveryTime: order?.deliveryTime,
      listGoods: order?.goods.map(good => {
        return {
          goodId: good.good,
          goodObject: {
            code: good.code,
            name: good.goodName,
            baseUnit: good.baseUnit,
          },
          quantity: good.quantity,
        }
      }),
      note: order?.note,
      noteAddress: order?.noteAddress
    })
  }, [order]);

  const transportType = {
    1: 'Giao hàng',
    2: 'Nhận hàng',
    3: 'Vận chuyển giữa kho'
  }

  const handlePriorityChange = (value) => {
    setState({
      ...state,
      priority: value[0]
    })
  }

  const handleStatusChange = (value) => {
    setState({
      ...state,
      status: value[0]
    })
  }

  const handleDeliveryTimeChange = (value) => {
    // format dd-mm-yyyy to timestamp
    let date = value.split('-')
    let newDate = new Date(date[2], date[1] - 1, date[0])
    setState({
      ...state,
      deliveryTime: newDate.getTime() / 1000
    })
  }

  const handleGoodsChange = (goods) => {
    setState({
      ...state,
      listGoods: goods
    })
  }

  const handleNoteChange = (e) => {
    console.log(e.target.value)
    setState({
      ...state,
      note: e.target.value
    })
  }

  const handleNoteAddressChange = (e) => {
    setState({
      ...state,
      noteAddress: e.target.value
    })
  }

  const handleEditOrder = () => {
    let data = {
      priority: state.priority,
      status: state.status,
      deliveryTime: state.deliveryTime,
      note: state.note,
      noteAddress: state.noteAddress,
      goods: state.listGoods.map(good => {
        return {
          good: good.goodId,
          quantity: parseInt(good.quantity),
          goodName: good.goodObject.name,
          code: good.goodObject.code,
          baseUnit: good.goodObject.baseUnit
        }
      })
    }
    dispatch(OrderActions.updateOrder(order._id, data))
    dispatch(OrderActions.getAllOrder())
  }

  return (
    <>
      <DialogModal
        modalID={`modal-edit-order`}
        isLoading={false}
        formID={`form-edit-order`}
        title={'Chỉnh sửa vận đơn'}
        msg_failure={'Lấy dữ liệu thất bại'}
        size="80"
        style={{backgroundColor: 'green'}}
        hasSaveButton={true}
        func={handleEditOrder}
      >
        {order && (
          <>
            <div className="row">
              <div className="col-md-6">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <strong>Mã đơn hàng: </strong>
                      <input type="text" className="form-control" value={order.code} disabled={true}
                             style={{width: '50%'}}/>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <strong>Loại hình vận chuyển: </strong>
                      <input type="text" className="form-control" value={transportType[order.transportType]}
                             disabled={true} style={{width: '50%'}}/>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <strong>Khách hàng: </strong>
                      <input type="text" className="form-control" value={order.customer.name} disabled={true}
                             style={{width: '50%'}}/>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <strong>Địa chỉ: </strong>
                      <input type="text" className="form-control" value={order.address} disabled={true}/>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <strong>Độ ưu tiên: </strong>
                      <SelectBox
                        id={`select-edit-order-priority`}
                        className="form-control select2"
                        style={{width: '50%'}}
                        value={state.priority}
                        items={[
                          {value: 1, text: 'Thấp'},
                          {value: 2, text: 'Trung bình'},
                          {value: 3, text: 'Cao'},
                          {value: 4, text: 'Đặc biệt'}
                        ]}
                        onChange={handlePriorityChange}
                        multiple={false}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <strong>Ghi chú địa chỉ: </strong>
                      <input type="text" className="form-control" value={state.noteAddress}
                             onChange={handleNoteAddressChange}/>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <strong>Ghi chú vận đơn: </strong>
                      <input type="text" className="form-control" value={state.note} onChange={handleNoteChange}/>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <strong>Thời gian giao hàng dự kiến: </strong>
                      <DatePicker
                        id={`edit-order-delivery-time`}
                        value={state.deliveryTime ? formatDate(new Date(state.deliveryTime * 1000)) : '---'}
                        onChange={handleDeliveryTimeChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <strong>Trạng thái: </strong>
                      <SelectBox
                        id={`select-edit-order-status`}
                        className="form-control select2"
                        style={{width: '50%'}}
                        value={state.status}
                        items={[
                          {value: 1, text: 'Chờ xác nhận'},
                          {value: 2, text: 'Đã xác nhận'},
                          {value: 3, text: 'Đã giao hàng'},
                        ]}
                        onChange={handleStatusChange}
                        multiple={false}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <strong>Thời gian tạo: </strong>
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <GoodComponentRequest
                    listGoods={state.listGoods}
                    isEdit={true}
                    onHandleGoodChange={handleGoodsChange}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </DialogModal>
    </>
  )
}

export default withTranslate(OrderEdit)
