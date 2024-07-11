import React, {useState, useEffect} from 'react'
import {withTranslate} from 'react-redux-multilingual'
import {formatDate} from '@helpers/formatDate'
import {DialogModal, ErrorLabel, SelectBox} from '@common-components'
import '@modules/crm/customer/components/customer.css'
import {MapContainer} from 'react-leaflet';
import {StockActions} from '@modules/production/warehouse/stock-management/redux/actions.js';
import {ScheduleActions} from '../redux/actions'
import {useDispatch, useSelector} from 'react-redux'

function ScheduleDetail(props) {
  let dispatch = useDispatch()
  let ontimePredictResults = useSelector(state => state.T3schedule?.predictOntimeDeliveryResults)
  let scheduleById = useSelector(state => state.T3schedule?.schedule?.schedule)
  let draftSchedule = useSelector(state => state.T3schedule?.draftSchedule) || [];
  draftSchedule = draftSchedule.filter(schedule => schedule.code === props.schedule?.code)
  let draftOptions = [
    {
      value: '-1',
      text: 'Chọn lịch trình tự động'
    }
  ]
  draftOptions = draftOptions.concat(draftSchedule.map(draft => {
    return {
      value: draft._id,
      text: `${draft.code.split('_')[0] + '_' + draft.code.split('_')[1]} - ${draft.note.split('_')[0]} - ${draft.value.toFixed(2)}km - ${draft.orders.length} đơn hàng`
    }
  }))

  const {schedule} = props

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

  const displayOntimeStatus = (status) => {
    if (status === 1) return 'Đúng hạn';
    if (status === 0) return 'Trễ hạn';
    return 'Chưa dự báo';
  }

  const handlePredictOntimeDelivery = (schedule) => {
    dispatch(ScheduleActions.predictOntimeDelivery(schedule._id))
    if (ontimePredictResults) {
      dispatch(ScheduleActions.getScheduleById(schedule?._id));
    }
  };

  useEffect(() => {
    if (ontimePredictResults) {
      // Tải lại danh sách đơn hàng mới được dự báo
      schedule && dispatch(ScheduleActions.getScheduleById(schedule?._id));
    }
  }, [ontimePredictResults, dispatch, schedule?._id]);

  const handleSelectDraftSchedule = async (value) => {
    value = value[0];
    let code_t = draftSchedule.find(draft => draft._id == value)?.code.split('_');
    let data = {
      _id: value,
      code: code_t[0] + '_' + code_t[1],
    }
    await dispatch(ScheduleActions.setScheduleFromDraft(data));
    await dispatch(ScheduleActions.getAllSchedule())
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
                <div className="row">
                  <div className="col-md-6">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="form-group">
                        <strong>Khả năng giao hàng đúng hạn:</strong>
                        <span> {schedule.depot ? '90%' : 'Đang lập lịch ...'} </span>
                      </div>
                      {schedule.depot && <div className="dropdown" style={{marginLeft: '20px'}}>
                        <button
                          type="button"
                          className="btn btn-success"
                          data-toggle="modal"
                          onClick={() => handlePredictOntimeDelivery(schedule)}
                        >
                          Dự báo lại
                        </button>
                      </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <strong>Nhân viên:</strong>
                      <span> {schedule.employees ? schedule.employees.map(employee => employee.fullName).join(', ') : 'Chưa có'}</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <strong>Phương tiện:</strong>
                      <span> {schedule.vehicle && schedule.vehicle.asset.assetName}</span>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <strong>Kho xuất phát:</strong>
                      <span> {schedule.depot ? schedule.depot.name : 'Đang lập lịch ...'}</span>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <div className="col-md-3 p-0">
                        <strong>Kế hoạch tự động:</strong>
                      </div>
                      <div className="col-md-8">
                        <SelectBox
                          id={`draftSchedule`}
                          className="form-control select2"
                          style={{width: '100%'}}
                          items={draftOptions}
                          value={schedule.draftSchedule ? schedule.draftSchedule._id : '-1'}
                          onChange={handleSelectDraftSchedule}
                        />
                      </div>
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
                      <th>Khả năng giao đúng hạn</th>
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
                        <td style={ scheduleById?.orders[index]?.estimatedOntime === 1 ? {color: 'green'} :
                          scheduleById?.orders[index]?.estimatedOntime === 0 ? {color: 'red'} : {color: 'black'}}>
                          {displayOntimeStatus(scheduleById?.orders[index]?.estimatedOntime)}
                        </td>
                        <td style={order.status === 4 ? {color: 'red'} :
                          order.status === 3 ? {color: 'green'} : {color: 'black'}}
                        >{orderStatus[order.status]}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="7"
                            className="text-center">{schedule.depot ? 'Không có đơn hàng' : 'Đang lập lịch tự động ...'}</td>
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
