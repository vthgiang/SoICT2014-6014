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

function ThirdPartyLogisticsTable() {
  const TableId = '3rd-table'
  const defaultConfig = {limit: 5}
  const Limit = getTableConfiguration(TableId, defaultConfig).limit

  let list3rdPartySchedules = useSelector(state => state.T3schedule.list3rdPartySchedules.schedules) || [];

  console.log(list3rdPartySchedules)
  let dispatch = useDispatch()
  useEffect(() => {
    dispatch(ScheduleActions.getAll3rdPartySchedule({}))
  }, [dispatch])
  const [state, setState] = useState({
    page_tab1: 1,
    page_tab2: 1,
    currentTab: 0,
    limit: Limit,
    tableId: TableId
  })

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

  const setLimit = async (limit) => {
    await setState({
      ...state,
      limit: limit
    })
  }

  const columns = [
    'STT',
    'Mã đơn',
    'Mã đơn bên thứ 3',
    'Loại hình vận chuyển',
    'Khách hàng',
    'Địa chỉ',
    'Trạng thái',
  ]

  // 1. Chưa giao hàng 2. Đang giao hàng 3. Đã giao hàng 4. Thất bại
  const status = {
    1: 'Chưa giao hàng',
    2: 'Đang giao hàng',
    3: 'Đã giao hàng',
    4: 'Thất bại'
  }

  let {page_tab1, page_tab2, limit} = state

  //data nhap
  let listSchedulesTab1 = list3rdPartySchedules.filter(schedule => schedule.status !== 3)
  let pageTotalTab1 = Math.ceil(listSchedulesTab1.length / limit)
  let listSchedulesTab1Paginate = listSchedulesTab1.slice((page_tab1 - 1) * limit, page_tab1 * limit)

  let listSchedulesTab2 = list3rdPartySchedules.filter(schedule => schedule.status === 3)
  let pageTotalTab2 = Math.ceil(listSchedulesTab2.length / limit)
  let listSchedulesTab2Paginate = listSchedulesTab2.slice((page_tab2 - 1) * limit, page_tab2 * limit)

  return (
    <>
      <div className="box" style={{minHeight: '450px'}}>
        <div className="box-body">
          <div className="nav-tabs-custom">
            <div className="box-body qlcv">
              {/* Tim kiem */}
              <div className="form-inline">
                <div className="form-group">
                  <label className="form-control-static">Tìm kiếm</label>
                  <input
                    type="text"
                    className="form-control"
                    name="codeQuery"
                    // onChange={handleOrderCodeChange}
                    placeholder="Mã vận đơn"
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
              </div>
              <Tabs selectedIndex={state.currentTab} onSelect={tabIndex => setState({...state, currentTab: tabIndex})}>
                <TabList>
                  <Tab>Đơn chưa hoàn thành</Tab>
                  <Tab>Đơn đã hoàn thành</Tab>
                </TabList>
                <TabPanel>
                  {/* Danh sach don hang chua hoan thanh */}
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
                    {listSchedulesTab1Paginate && listSchedulesTab1Paginate.length !== 0 ? listSchedulesTab1Paginate.map((order) => {
                      return (
                        <tr>
                          <td className={'text-center'}>{order.order.code}</td>
                          <td className={'text-center'}>{order.order3rd ? order.order3rd : 'Chưa có'}</td>
                          <td className={'text-center'}>{order.order.transportType}</td>
                          <td className={'text-center'}>{order.order.customer}</td>
                          <td className={'text-center'}>{order.order.address}</td>
                          <td className={'text-center'}>{status[order.status]}</td>
                          <td style={{textAlign: 'center'}}>
                            <a onClick={() => handleShowDetailInfo(order._id)}><i
                              className="material-icons">visibility</i></a>
                            <a><i className="material-icons">edit</i></a>
                            <DeleteNotification
                              content={'Xác nhận xóa lịch trình?'}
                              data={{id: order._id}}
                              // func={handleDeleteSchedule}
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
                  <PaginateBar pageTotal={pageTotalTab1} currentPage={page_tab1} func={setPageTab1}/>
                </TabPanel>
                <TabPanel>
                  {/* Danh sach don hang da hoan thanh */}
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
                    {listSchedulesTab1Paginate && listSchedulesTab1Paginate.length !== 0 ? listSchedulesTab1Paginate.map((order) => {
                      return (
                        <tr>
                          <td className={'text-center'}>{order.order.code}</td>
                          <td className={'text-center'}>{order.order3rd ? order.order3rd : 'Chưa có'}</td>
                          <td className={'text-center'}>{order.order.transportType}</td>
                          <td className={'text-center'}>{order.order.customer}</td>
                          <td className={'text-center'}>{order.order.address}</td>
                          <td className={'text-center'}>{status[order.status]}</td>
                          <td style={{textAlign: 'center'}}>
                            <a onClick={() => handleShowDetailInfo(order._id)}><i
                              className="material-icons">visibility</i></a>
                            <a><i className="material-icons">edit</i></a>
                            <DeleteNotification
                              content={'Xác nhận xóa lịch trình?'}
                              data={{id: order._id}}
                              // func={handleDeleteSchedule}
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
                  <PaginateBar pageTotal={pageTotalTab2} currentPage={page_tab2} func={setPageTab2}/>
                </TabPanel>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default withTranslate(ThirdPartyLogisticsTable)
