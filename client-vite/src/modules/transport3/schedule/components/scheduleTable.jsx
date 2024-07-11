import React, {useEffect, useState} from 'react'
import {connect, useDispatch, useSelector} from 'react-redux'
import {withTranslate} from 'react-redux-multilingual'
import 'react-tabs/style/react-tabs.css';
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
import {color} from 'd3'
import OntimeDeliveryResults from './ontimeDeliveryResults';
import ProgressBar from '@ramonak/react-progress-bar';
import ScheduleDetail from '@modules/transport3/schedule/components/scheduleDetail.jsx';
import {Tab, TabList, TabPanel, Tabs} from 'react-tabs';
import {OrderActions} from '@modules/transport3/order/redux/actions.js';

function ScheduleTable(props) {
  const TableId = 'schedule-table'
  const defaultConfig = {limit: 5}
  const Limit = getTableConfiguration(TableId, defaultConfig).limit
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  let listSchedules = useSelector(state => state.T3schedule.listSchedules.schedules) || [];

  let dispatch = useDispatch()
  useEffect(() => {
    dispatch(ScheduleActions.getAllStocksWithLatlng())
    dispatch(ScheduleActions.getAllSchedule())
    dispatch(ScheduleActions.getDraftSchedule())
  }, [dispatch])
  const [state, setState] = useState({
    page_tab1: 1,
    page_tab2: 1,
    page_tab3: 1,
    page_tab4: 1,
    page_tab5: 1,
    page_tab6: 1,
    currentTab: 0,
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
  const setPageTab1 = (page) => {
    setState({
      ...state,
      page_tab1: page
    })
  }

  const setPageTab2 = (page) => {
    setState({
      ...state,
      page_tab2: page
    })
  }

  const setPageTab3 = (page) => {
    setState({
      ...state,
      page_tab3: page
    })
  }

  const setPageTab4 = (page) => {
    setState({
      ...state,
      page_tab4: page
    })
  }

  const setPageTab5 = (page) => {
    setState({
      ...state,
      page_tab5: page
    })
  }

  const setPageTab6 = (page) => {
    setState({
      ...state,
      page_tab6: page
    })
  }

  const setLimit = async (limit) => {
    await setState({
      ...state,
      limit: limit
    })
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

  const handleShowDetailInfo = (schedule_id) => {
    setState({
      ...state,
      currentDetail: listSchedules?.find(schedule => schedule._id === schedule_id)
    });
    window.$(`#modal-detail-schedule`).modal('show')
  }

  const handleSubmitSearch = async () => {
    await dispatch(ScheduleActions.getAllSchedule({query: state.codeQuery}))
    setPageTab1(1);
    setPageTab2(1);
    setPageTab3(1);
    setPageTab4(1);
    setPageTab5(1);
    setPageTab6(1);
  }

  const handleOrderCodeChange = (e) => {
    let {value} = e.target
    setState({
      ...state,
      codeQuery: value
    })
  }

  const handleDeleteSchedule = async (scheduleId) => {
    await dispatch(ScheduleActions.deleteSchedule(scheduleId))
    await dispatch(ScheduleActions.getAllSchedule({query: state.codeQuery}))
  }

  let {page_tab1, page_tab2, page_tab3, page_tab4, page_tab5, page_tab6, limit} = state
  console.log('listSchedules', listSchedules)

  //data nhap
  let listSchedulesTab1 = listSchedules.filter(schedule => schedule.depot === null || schedule.orders.length === 0)
  let pageTotalTab1 = Math.ceil(listSchedulesTab1.length / limit)
  let listSchedulesTab1Paginate = listSchedulesTab1.slice((page_tab1 - 1) * limit, page_tab1 * limit)

  //data chua tinh toan
  let listSchedulesTab2 = listSchedules.filter(schedule => !listSchedulesTab1.includes(schedule) && schedule.orders[0].estimatedOntime === undefined)
  let pageTotalTab2 = Math.ceil(listSchedulesTab2.length / limit)
  let listSchedulesTab2Paginate = listSchedulesTab2.slice((page_tab2 - 1) * limit, page_tab2 * limit)

  //data chua giao hang
  let listSchedulesTab3 = listSchedules.filter(schedule => !listSchedulesTab2.includes(schedule) && schedule.status === 1)
  let pageTotalTab3 = Math.ceil(listSchedulesTab3.length / limit)
  let listSchedulesTab3Paginate = listSchedulesTab3.slice((page_tab3 - 1) * limit, page_tab3 * limit)

  //data dang giao hang
  let listSchedulesTab4 = listSchedules.filter(schedule => !listSchedulesTab2.includes(schedule) && schedule.status === 2)
  let pageTotalTab4 = Math.ceil(listSchedulesTab4.length / limit)
  let listSchedulesTab4Paginate = listSchedulesTab4.slice((page_tab4 - 1) * limit, page_tab4 * limit)

  //data da giao hang
  let listSchedulesTab5 = listSchedules.filter(schedule => !listSchedulesTab2.includes(schedule) && schedule.status === 3)
  let pageTotalTab5 = Math.ceil(listSchedulesTab5.length / limit)
  let listSchedulesTab5Paginate = listSchedulesTab5.slice((page_tab5 - 1) * limit, page_tab5 * limit)

  //data that bai
  let listSchedulesTab6 = listSchedules.filter(schedule => !listSchedulesTab2.includes(schedule) && schedule.status === 4)
  let pageTotalTab6 = Math.ceil(listSchedulesTab6.length / limit)
  let listSchedulesTab6Paginate = listSchedulesTab6.slice((page_tab6 - 1) * limit, page_tab6 * limit)

  return (
    <>
      <ScheduleCreateForm code={state.code}/>
      <ScheduleDetail schedule={state.currentDetail}/>
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
              <label className="form-control-static">Tìm kiếm</label>
              <input
                type="text"
                className="form-control"
                name="codeQuery"
                onChange={handleOrderCodeChange}
                placeholder="Mã lịch trình, Kho xuất phát, Nhân viên, Phương tiện"
                autoComplete="off"
              />
            </div>
            <div className="form-group">
              <button type="button" className="btn btn-success" title="Lọc" onClick={handleSubmitSearch}>
                Tìm kiếm
              </button>
            </div>
          </div>
          <div>
            *: Dự báo khả năng giao hàng đúng hạn
          </div>
          <Tabs selectedIndex={state.currentTab} onSelect={tabIndex => setState({...state, currentTab: tabIndex})}>
            <TabList>
              <Tab>Kế hoạch nháp</Tab>
              <Tab>Kế hoạch chưa tính toán khả năng đúng hạn</Tab>
              <Tab>Kế hoạch chưa giao hàng</Tab>
              <Tab>Kế hoạch đang giao hàng</Tab>
              <Tab>Kế hoạch đã giao hàng</Tab>
              <Tab>Kế hoạch thất bại</Tab>
            </TabList>
            <TabPanel>
              {/* Ke hoach nhap */}
              <table id={state.tableId} className="table table-striped table-bordered table-hover"
                     style={{marginTop: 20}}>
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
                {listSchedulesTab1Paginate && listSchedulesTab1Paginate.length !== 0 ? listSchedulesTab1Paginate.map((schedule, index) => {
                  const totalOrders = schedule.orders.length;
                  const ontimeOrders = schedule.orders.filter(order => order.estimatedOntime === 1).length;
                  const completionPercentage = totalOrders === 0 ? 0 : Math.round((ontimeOrders / totalOrders) * 100);
                  return (
                    <tr key={index}>
                      <td className={'text-center'}>{index + 1 + (page_tab1 - 1) * limit}</td>
                      <td className={'text-center'}>{schedule.code}</td>
                      <td className={'text-center'}>{schedule.depot ? schedule.depot.name : 'Chưa có'}</td>
                      <td
                        className={'text-center'}>{schedule.employees ? schedule.employees.map(employee => employee.fullName).join(', ') : 'Chưa có'}</td>
                      <td className={'text-center'}>{schedule.vehicle && schedule.vehicle.asset.assetName}</td>
                      <td className={'text-center'}>{status[schedule.status]}</td>
                      <td>
                        <ProgressBar
                          completed={completionPercentage}
                          customLabel={`${ontimeOrders}/${totalOrders}`}
                        />
                      </td>
                      <td className={'text-center'}>
                        {schedule.orders && schedule.orders.length}
                      </td>
                      <td>{formatDate(schedule.createdAt)}</td>
                      <td style={{textAlign: 'center'}}>
                        <a onClick={() => handleShowDetailInfo(schedule._id)}><i
                          className="material-icons">visibility</i></a>
                        <a><i className="material-icons">edit</i></a>
                        <DeleteNotification
                          content={'Xác nhận xóa lịch trình?'}
                          data={{id: schedule._id}}
                          func={handleDeleteSchedule}
                        />
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
              <PaginateBar pageTotal={pageTotalTab1} currentPage={page_tab1} func={setPageTab1}/>
            </TabPanel>
            <TabPanel>
              {/* Ke hoach chua tinh toan */}
              <table id={state.tableId} className="table table-striped table-bordered table-hover"
                     style={{marginTop: 20}}>
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
                {listSchedulesTab2Paginate && listSchedulesTab2Paginate.length !== 0 ? listSchedulesTab2Paginate.map((schedule, index) => {
                  const totalOrders = schedule.orders.length;
                  const ontimeOrders = schedule.orders.filter(order => order.estimatedOntime === 1).length;
                  const completionPercentage = totalOrders === 0 ? 0 : Math.round((ontimeOrders / totalOrders) * 100);
                  return (
                    <tr key={index}>
                      <td className={'text-center'}>{index + 1 + (page_tab1 - 1) * limit}</td>
                      <td className={'text-center'}>{schedule.code}</td>
                      <td className={'text-center'}>{schedule.depot ? schedule.depot.name : 'Chưa có'}</td>
                      <td
                        className={'text-center'}>{schedule.employees ? schedule.employees.map(employee => employee.fullName).join(', ') : 'Chưa có'}</td>
                      <td className={'text-center'}>{schedule.vehicle && schedule.vehicle.asset.assetName}</td>
                      <td className={'text-center'}>{status[schedule.status]}</td>
                      <td>
                        <ProgressBar
                          completed={completionPercentage}
                          customLabel={`${ontimeOrders}/${totalOrders}`}
                        />
                      </td>
                      <td className={'text-center'}>
                        {schedule.orders && schedule.orders.length}
                      </td>
                      <td>{formatDate(schedule.createdAt)}</td>
                      <td style={{textAlign: 'center'}}>
                        <a onClick={() => handleShowDetailInfo(schedule._id)}><i
                          className="material-icons">visibility</i></a>
                        <a><i className="material-icons">edit</i></a>
                        <DeleteNotification
                          content={'Xác nhận xóa lịch trình?'}
                          data={{id: schedule._id}}
                          func={handleDeleteSchedule}
                        />
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
              <PaginateBar pageTotal={pageTotalTab2} currentPage={page_tab2} func={setPageTab2}/>
            </TabPanel>
            <TabPanel>
              {/* Ke hoach chua giao hang */}
              <table id={state.tableId} className="table table-striped table-bordered table-hover"
                     style={{marginTop: 20}}>
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
                {listSchedulesTab3Paginate && listSchedulesTab3Paginate.length !== 0 ? listSchedulesTab3Paginate.map((schedule, index) => {
                  const totalOrders = schedule.orders.length;
                  const ontimeOrders = schedule.orders.filter(order => order.estimatedOntime === 1).length;
                  const completionPercentage = totalOrders === 0 ? 0 : Math.round((ontimeOrders / totalOrders) * 100);
                  return (
                    <tr key={index}>
                      <td className={'text-center'}>{index + 1 + (page_tab1 - 1) * limit}</td>
                      <td className={'text-center'}>{schedule.code}</td>
                      <td className={'text-center'}>{schedule.depot ? schedule.depot.name : 'Chưa có'}</td>
                      <td
                        className={'text-center'}>{schedule.employees ? schedule.employees.map(employee => employee.fullName).join(', ') : 'Chưa có'}</td>
                      <td className={'text-center'}>{schedule.vehicle && schedule.vehicle.asset.assetName}</td>
                      <td className={'text-center'}>{status[schedule.status]}</td>
                      <td>
                        <ProgressBar
                          completed={completionPercentage}
                          customLabel={`${ontimeOrders}/${totalOrders}`}
                        />
                      </td>
                      <td className={'text-center'}>
                        {schedule.orders && schedule.orders.length}
                      </td>
                      <td>{formatDate(schedule.createdAt)}</td>
                      <td style={{textAlign: 'center'}}>
                        <a onClick={() => handleShowDetailInfo(schedule._id)}><i
                          className="material-icons">visibility</i></a>
                        <a><i className="material-icons">edit</i></a>
                        <DeleteNotification
                          content={'Xác nhận xóa lịch trình?'}
                          data={{id: schedule._id}}
                          func={handleDeleteSchedule}
                        />
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
              <PaginateBar pageTotal={pageTotalTab3} currentPage={page_tab3} func={setPageTab3}/>
            </TabPanel>
            <TabPanel>
              {/* Ke hoach dang giao hang */}
              <table id={state.tableId} className="table table-striped table-bordered table-hover"
                     style={{marginTop: 20}}>
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
                {listSchedulesTab4Paginate && listSchedulesTab4Paginate.length !== 0 ? listSchedulesTab4Paginate.map((schedule, index) => {
                  const totalOrders = schedule.orders.length;
                  const ontimeOrders = schedule.orders.filter(order => order.estimatedOntime === 1).length;
                  const completionPercentage = totalOrders === 0 ? 0 : Math.round((ontimeOrders / totalOrders) * 100);
                  return (
                    <tr key={index}>
                      <td className={'text-center'}>{index + 1 + (page_tab1 - 1) * limit}</td>
                      <td className={'text-center'}>{schedule.code}</td>
                      <td className={'text-center'}>{schedule.depot ? schedule.depot.name : 'Chưa có'}</td>
                      <td
                        className={'text-center'}>{schedule.employees ? schedule.employees.map(employee => employee.fullName).join(', ') : 'Chưa có'}</td>
                      <td className={'text-center'}>{schedule.vehicle && schedule.vehicle.asset.assetName}</td>
                      <td className={'text-center'}>{status[schedule.status]}</td>
                      <td>
                        <ProgressBar
                          completed={completionPercentage}
                          customLabel={`${ontimeOrders}/${totalOrders}`}
                        />
                      </td>
                      <td className={'text-center'}>
                        {schedule.orders && schedule.orders.length}
                      </td>
                      <td>{formatDate(schedule.createdAt)}</td>
                      <td style={{textAlign: 'center'}}>
                        <a onClick={() => handleShowDetailInfo(schedule._id)}><i
                          className="material-icons">visibility</i></a>
                        <a><i className="material-icons">edit</i></a>
                        <DeleteNotification
                          content={'Xác nhận xóa lịch trình?'}
                          data={{id: schedule._id}}
                          func={handleDeleteSchedule}
                        />
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
              <PaginateBar pageTotal={pageTotalTab4} currentPage={page_tab4} func={setPageTab4}/>
            </TabPanel>
            <TabPanel>
              {/* Ke hoach da giao hang */}
              <table id={state.tableId} className="table table-striped table-bordered table-hover"
                     style={{marginTop: 20}}>
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
                {listSchedulesTab5Paginate && listSchedulesTab5Paginate.length !== 0 ? listSchedulesTab5Paginate.map((schedule, index) => {
                  const totalOrders = schedule.orders.length;
                  const ontimeOrders = schedule.orders.filter(order => order.estimatedOntime === 1).length;
                  const completionPercentage = totalOrders === 0 ? 0 : Math.round((ontimeOrders / totalOrders) * 100);
                  return (
                    <tr key={index}>
                      <td className={'text-center'}>{index + 1 + (page_tab1 - 1) * limit}</td>
                      <td className={'text-center'}>{schedule.code}</td>
                      <td className={'text-center'}>{schedule.depot ? schedule.depot.name : 'Chưa có'}</td>
                      <td
                        className={'text-center'}>{schedule.employees ? schedule.employees.map(employee => employee.fullName).join(', ') : 'Chưa có'}</td>
                      <td className={'text-center'}>{schedule.vehicle && schedule.vehicle.asset.assetName}</td>
                      <td className={'text-center'}>{status[schedule.status]}</td>
                      <td>
                        <ProgressBar
                          completed={completionPercentage}
                          customLabel={`${ontimeOrders}/${totalOrders}`}
                        />
                      </td>
                      <td className={'text-center'}>
                        {schedule.orders && schedule.orders.length}
                      </td>
                      <td>{formatDate(schedule.createdAt)}</td>
                      <td style={{textAlign: 'center'}}>
                        <a onClick={() => handleShowDetailInfo(schedule._id)}><i
                          className="material-icons">visibility</i></a>
                        <a><i className="material-icons">edit</i></a>
                        <DeleteNotification
                          content={'Xác nhận xóa lịch trình?'}
                          data={{id: schedule._id}}
                          func={handleDeleteSchedule}
                        />
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
              <PaginateBar pageTotal={pageTotalTab5} currentPage={page_tab5} func={setPageTab5}/>
            </TabPanel>
            <TabPanel>
              {/* Ke hoach da giao hang */}
              <table id={state.tableId} className="table table-striped table-bordered table-hover"
                     style={{marginTop: 20}}>
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
                {listSchedulesTab6Paginate && listSchedulesTab6Paginate.length !== 0 ? listSchedulesTab6Paginate.map((schedule, index) => {
                  const totalOrders = schedule.orders.length;
                  const ontimeOrders = schedule.orders.filter(order => order.estimatedOntime === 1).length;
                  const completionPercentage = totalOrders === 0 ? 0 : Math.round((ontimeOrders / totalOrders) * 100);
                  return (
                    <tr key={index}>
                      <td className={'text-center'}>{index + 1 + (page_tab1 - 1) * limit}</td>
                      <td className={'text-center'}>{schedule.code}</td>
                      <td className={'text-center'}>{schedule.depot ? schedule.depot.name : 'Chưa có'}</td>
                      <td
                        className={'text-center'}>{schedule.employees ? schedule.employees.map(employee => employee.fullName).join(', ') : 'Chưa có'}</td>
                      <td className={'text-center'}>{schedule.vehicle && schedule.vehicle.asset.assetName}</td>
                      <td className={'text-center'}>{status[schedule.status]}</td>
                      <td>
                        <ProgressBar
                          completed={completionPercentage}
                          customLabel={`${ontimeOrders}/${totalOrders}`}
                        />
                      </td>
                      <td className={'text-center'}>
                        {schedule.orders && schedule.orders.length}
                      </td>
                      <td>{formatDate(schedule.createdAt)}</td>
                      <td style={{textAlign: 'center'}}>
                        <a onClick={() => handleShowDetailInfo(schedule._id)}><i
                          className="material-icons">visibility</i></a>
                        <a><i className="material-icons">edit</i></a>
                        <DeleteNotification
                          content={'Xác nhận xóa lịch trình?'}
                          data={{id: schedule._id}}
                          func={handleDeleteSchedule}
                        />
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
              <PaginateBar pageTotal={pageTotalTab6} currentPage={page_tab6} func={setPageTab6}/>
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </>
  )
}

export default withTranslate(ScheduleTable)
