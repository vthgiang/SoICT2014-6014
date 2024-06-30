import React, {useState} from 'react'
import {withTranslate} from 'react-redux-multilingual'
import {CrmCustomerActions} from '@modules/crm/customer/redux/actions'
import {formatDate, formatToTimeZoneDate} from '@helpers/formatDate'
import {DialogModal, ErrorLabel} from '@common-components'
import ValidationHelper from '@helpers/validationHelper'
import '@modules/crm/customer/components/customer.css'
import {MapContainer} from 'react-leaflet';
import {StockActions} from '@modules/production/warehouse/stock-management/redux/actions.js';

function ScheduleDetail(props) {
  let initialState = {}
  const [state, setState] = useState(initialState)

  const {schedule} = props

  const transportType = {
    1: 'Giao hàng',
    2: 'Nhận hàng',
    3: 'Vận chuyển giữa kho'
  }

  console.log(schedule?.orders)
  // 1. Chưa giao hàng 2. Đang giao hàng 3. Đã giao hàng 4. Thất bại
  const orderStatus = {
    1: 'Chưa giao hàng',
    2: 'Đang giao hàng',
    3: 'Đã giao hàng',
    4: 'Thất bại'
  }

  // 1. Chưa thực hiện; 2 Đang thực hiện; 3. Đã hoàn thành
  const scheduleStatus = {
    1: 'Chưa thực hiện',
    2: 'Đang thực hiện',
    3: 'Đã hoàn thành'
  }
  return (
    <>
      <DialogModal
        modalID={`modal-detail-schedule`}
        isLoading={false}
        formID={`form-detail-schedule`}
        title={'Chi tiết lịch trình'}
        msg_failure={'Lấy dữ liệu thất bại'}
        size="80"
        style={{backgroundColor: 'green'}}
      >
        {schedule && (
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-6">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <strong>Mã lịch trình:</strong>
                      <span> {schedule.code}</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <strong>Trạng thái:</strong>
                      <span> {scheduleStatus[schedule.status]}</span>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <strong>Ngày tạo:</strong>
                      <span> {formatDate(schedule.createdAt)}</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <strong>Ngày cập nhật:</strong>
                      <span> {formatDate(schedule.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <strong>Nhân viên:</strong>
                      <span> {schedule.employee ? schedule.employee.map(employee => employee.fullName).join(', ') : 'Chưa có'}</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <strong>Phương tiện:</strong>
                      <span> {schedule.vehicles && schedule.vehicles.asset.assetName}</span>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <strong>Kho xuất phát:</strong>
                      <span> {schedule.depot.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <strong>Danh sách đơn hàng:</strong>
                  <table className="table table-striped table-bordered table-hover" style={{marginTop: 20}}>
                    <thead>
                    <tr>
                      <th>STT</th>
                      <th>Mã đơn hàng</th>
                      <th>Khách hàng</th>
                      <th>Điểm đến</th>
                      <th>Ngày tạo</th>
                      <th>Ngày cập nhật</th>
                      <th>Trạng thái</th>
                    </tr>
                    </thead>
                    <tbody>
                    {schedule.orders && schedule.orders.length !== 0 ? schedule.orders.map((order, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{order.order.code}</td>
                        <td>{order.order.customer.name}</td>
                        <td>{order.order.address}</td>
                        <td>{formatDate(order.order.createdAt)}</td>
                        <td>{formatDate(order.order.updatedAt)}</td>
                        <td style={order.status === 4 ? {color: 'red'} :
                          order.status === 3 ? {color: 'green'} : {color: 'black'}}
                        >{orderStatus[order.status]}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="7" className="text-center">Không có dữ liệu</td>
                      </tr>
                    )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogModal>
    </>
  )
}

export default withTranslate(ScheduleDetail)
