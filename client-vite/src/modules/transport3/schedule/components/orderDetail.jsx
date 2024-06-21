import React, {useState} from 'react'
import {connect} from 'react-redux'
import {withTranslate} from 'react-redux-multilingual'
import {CrmCustomerActions} from '@modules/crm/customer/redux/actions'
import {OrderActions} from '../redux/actions'
import {formatToTimeZoneDate} from '@helpers/formatDate'
import {DialogModal, ErrorLabel} from '@common-components'
import ValidationHelper from '@helpers/validationHelper'
import OrderCreateGood from './createOrder/orderCreateGood'
import OrderCreateInfo from './createOrder/orderCreateInfo'
import OrderCreateLocation from './createOrder/orderCreateLocation.jsx'
import '@modules/crm/customer/components/customer.css'
import {MapContainer} from 'react-leaflet';
import {StockActions} from '@modules/production/warehouse/stock-management/redux/actions.js';

function OrderDetail(props) {
  let initialState = {}
  const [state, setState] = useState(initialState)

  const {schedule} = props

  const transportType = {
    1: 'Giao hàng',
    2: 'Nhận hàng',
    3: 'Vận chuyển giữa kho'
  }

  return (
    <>
      <DialogModal
        modalID={`modal-detail-schedule`}
        isLoading={false}
        formID={`form-detail-schedule`}
        title={'Chi tiết vận đơn'}
        msg_failure={'Lấy dữ liệu thất bại'}
        size="80"
        style={{backgroundColor: 'green'}}
      >
        {schedule && (
          <>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <strong>Mã đơn hàng: </strong>
                  <span>{schedule.code}</span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <strong>Loại hình vận chuyển: </strong>
                  <span>{transportType[schedule.transportType]}</span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <strong>Khách hàng: </strong>
                  <span>{schedule.customer.name}</span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <strong>Địa chỉ: </strong>
                  <span>{schedule.address}</span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <strong>Độ ưu tiên: </strong>
                  <span>{schedule.priority}</span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <strong>Trạng thái: </strong>
                  <span>{schedule.status}</span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <strong>Thời gian giao hàng dự kiến: </strong>
                  <span>{schedule.deliveryTime ? formatToTimeZoneDate(schedule.deliveryTime) : ''}</span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <strong>Ghi chú: </strong>
                  <span>{schedule.note}</span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <strong>Địa chỉ giao hàng</strong>
                  <span>{schedule.noteAddress}</span>
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
                    {schedule.goods.map((good, index) => (
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
