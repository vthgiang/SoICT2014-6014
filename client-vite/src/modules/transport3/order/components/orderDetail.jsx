import React from 'react'
import {connect} from 'react-redux'
import {withTranslate} from 'react-redux-multilingual'
import {formatToTimeZoneDate} from '@helpers/formatDate'
import {DialogModal} from '@common-components'
import '@modules/crm/customer/components/customer.css'
import {MapContainer} from 'react-leaflet';

function OrderDetail(props) {
  const {order} = props

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

  return (
    <>
      <DialogModal
        modalID={`modal-detail-order`}
        isLoading={false}
        formID={`form-detail-order`}
        title={'Chi tiết vận đơn'}
        msg_failure={'Lấy dữ liệu thất bại'}
        size="80"
        style={{backgroundColor: 'green'}}
      >
        {order && (
          <>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <strong>Mã đơn hàng: </strong>
                  <span>{order.code}</span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <strong>Loại hình vận chuyển: </strong>
                  <span>{transportType[order.transportType]}</span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <strong>Khách hàng: </strong>
                  <span>{order.customer.name}</span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <strong>Địa chỉ: </strong>
                  <span>{order.address}</span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <strong>Độ ưu tiên: </strong>
                  <span>{order.priority}</span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <strong>Trạng thái: </strong>
                  <span>{order.status}</span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <strong>Thời gian giao hàng dự kiến: </strong>
                  <span>{order.deliveryTime ? formatToTimeZoneDate(order.deliveryTime) : ''}</span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <strong>Ghi chú: </strong>
                  <span>{order.note}</span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <strong>Địa chỉ giao hàng</strong>
                  <span>{order.noteAddress}</span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <strong>Thông tin hàng hóa</strong>
                  <table className="table table-bordered">
                    <thead>
                    <tr>
                      <th>STT</th>
                      <th>Mã hàng</th>
                      <th>Tên hàng</th>
                      <th>Đơn vị</th>
                      <th>Số lượng</th>
                    </tr>
                    </thead>
                    <tbody>
                    {order.goods.map((good, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{good.code}</td>
                        <td>{good.goodName}</td>
                        <td>{good.baseUnit}</td>
                        <td>{good.quantity}</td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogModal>
    </>
  )
}

function mapStateToProps(state) {
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(OrderDetail))
