import React, {useEffect, useState} from 'react'
import {connect, useDispatch, useSelector} from 'react-redux'
import {withTranslate} from 'react-redux-multilingual'

//Helper Function
import {formatDate} from '@helpers/formatDate'
import {generateCode} from '@helpers/generateCode'
//Components Import
import {
  PaginateBar,
  DataTableSetting,
  SelectMulti, DeleteNotification,
} from '@common-components'
import {getTableConfiguration} from '@helpers/tableConfiguration'
import ScheduleCreateForm from './scheduleCreateForm';
import {ScheduleActions} from '@modules/transport3/schedule/redux/actions';
import OrderCreateForm from '@modules/transport3/order/components/orderCreateForm.jsx';
import OrderDetail from '@modules/transport3/order/components/orderDetail.jsx';
import { color } from 'd3'
import OntimeDeliveryResults from './ontimeDeliveryResults';
import ProgressBar from "@ramonak/react-progress-bar";

function ScheduleTable(props) {
  const TableId = 'schedule-table'
  const defaultConfig = {limit: 5}
  const Limit = getTableConfiguration(TableId, defaultConfig).limit
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  let listSchedules = useSelector(state => state.T3schedule.listSchedules.schedules)
  let ontimePredictResults = useSelector(state => state.T3schedule.predictOntimeDeliveryResults.predict_ontime)

  let dispatch = useDispatch()
  useEffect(() => {
    dispatch(ScheduleActions.getAllStocksWithLatlng())
    dispatch(ScheduleActions.getAllSchedule())
  }, [dispatch])
  const [state, setState] = useState({
    page: 1,
    code: generateCode('SC_'),
    limit: Limit,
    tableId: TableId
  })

  const handleCodeChange = (e) => {
    setState({
      ...state,
      code: generateCode('SC_')
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

  const handlePredictOntimeDelivery = (schedule) => {
    window.$(`#modal-ontime-delivery-results`).modal('show')
    setSelectedSchedule(schedule);
    dispatch(ScheduleActions.predictOntimeDelivery(schedule._id))
  }

  const columns = [
    'STT',
    'Mã lịch trình',
    'Kho xuất phát',
    'Nhân viên',
    'Phương tiện',
    'Trạng thái',
    'Khả năng giao đúng hạn',
    'Số đơn hàng',
    'Ngày tạo',
  ]

  // 1. Chưa giao hàng 2. Đang giao hàng 3. Đã giao hàng 4. Thất bại
  const status = {
    1: 'Chưa giao hàng',
    2: 'Đang giao hàng',
    3: 'Đã giao hàng',
    4: 'Thất bại'
  }

  const handleShowDetailInfo = (id) => {

  }
  let {totalPages, page} = state

  return (
    <>
      <ScheduleCreateForm code={state.code}/>
      <div className="nav-tabs-custom">
        <div className="box-body qlcv">
          <div className="form-inline">
            <div className="dropdown pull-right" style={{marginTop: 5}}>
              <button
                type="button"
                className="btn btn-success"
                data-toggle="modal"
                data-target="#modal-add-schedule"
                onClick={handleCodeChange}
              >
                Thêm lịch mới
              </button>
            </div>
            {/* <div className="dropdown pull-right" style={{ marginTop: 5 }}>
              <button
                type="button"
                className="btn btn-success dropdown-toggle pull-right"
                aria-expanded="true"
                onClick={() => retrainingModel()}
              >
                Cập nhật mô hình dự báo
              </button>
            </div> */}
          </div>
          {/* Tim kiem */}
          <div className="form-inline">
            <div className="form-group">
              <label className="form-control-static">Mã lịch trình:</label>
              <input
                type="text"
                className="form-control"
                name="codeQuery"
                // onChange={handleOrderCodeChange}
                placeholder="Nhập vào mã lịch trình"
                autoComplete="off"
              />
            </div>
            <div className="form-group">
              <button type="button" className="btn btn-success" title="Lọc">
                Tìm kiếm
              </button>
            </div>
          </div>
            <div>
              *: Dự báo khả năng giao hàng đúng hạn
            </div>
          {/* Bang */}
          <table id={state.tableId} className="table table-striped table-bordered table-hover" style={{marginTop: 20}}>
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
                {'Hành động'}
                <DataTableSetting
                  tableId={state.tableId}
                  columnArr={columns}
                  setLimit={setLimit}
                />
              </th>
            </tr>
            </thead>
            <tbody>
            {listSchedules && listSchedules.length !== 0 ? listSchedules.map((schedule, index) => {
              const totalOrders = schedule.orders.length;
              const ontimeOrders = schedule.orders.filter(order => order.estimatedOntime === 1).length;
              const completionPercentage = totalOrders === 0 ? 0 : Math.round((ontimeOrders / totalOrders) * 100);
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{schedule.code}</td>
                  <td>{schedule.depot.name}</td>
                  <td>{schedule.employee ? schedule.employee.map(employee => employee.fullName).join(', ') : 'Chưa có'}</td>
                  <td>{schedule.vehicles && schedule.vehicles.asset.assetName}</td>
                  <td>{status[schedule.status]}</td>
                  <td>
                    <ProgressBar
                      completed={completionPercentage}
                      customLabel={`${ontimeOrders}/${totalOrders}`}
                    />
                  </td>
                  <td>
                    {schedule.orders && schedule.orders.length}
                  </td>
                  <td>{formatDate(schedule.createdAt)}</td>
                  <td>
                    <td style={{textAlign: 'center'}}>
                      <a onClick={() => handleShowDetailInfo(schedule._id)}><i
                        className="material-icons">visibility</i></a>
                      <a><i className="material-icons">edit</i></a>
                      <DeleteNotification
                        content={'Xác nhận xóa lịch trình?'}
                        data={{id: schedule._id}}
                        // func={handleDeleteVehicle}
                      />
                      {/*<button*/}
                      {/*  onClick={()=> handlePredictOntimeDelivery(schedule)}*/}
                      {/*>*/}
                      {/*  Dự báo**/}
                      {/*</button>*/}
                    </td>
                  </td>
                </tr>
              )
            }) : <tr>
              <td colSpan={columns.length + 1}>
                <center>Không có dữ liệu</center>
              </td>
            </tr>}
            </tbody>
          </table>
          <OntimeDeliveryResults 
              schedule={selectedSchedule}

          />
          <PaginateBar pageTotal={totalPages ? totalPages : 0} currentPage={page} func={setPage}/>
        </div>
      </div>
    </>
  )
}

export default withTranslate(ScheduleTable)
