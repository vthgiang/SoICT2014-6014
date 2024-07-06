import React, { useState, useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import dayjs from 'dayjs';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { DatePicker, SelectBox } from "../../../../common-components";
import { RequestActions } from "../../../production/common-production/request-management/redux/actions";
import { ShipperActions } from "../../../transportation/shipper/redux/actions";
import { vehicleActions } from "../../../transportation/vehicle/redux/actions";
import { UserActions } from '@modules/super-admin/user/redux/actions'
import { OrderActions } from '@modules/transport3/order/redux/actions'
import { ScheduleActions } from '@modules/transport3/schedule/redux/actions';
import { OrdersInfoChart } from "./charts/ordersInfoChart";
import { TransportationCostChart } from "./charts/costChart";
import { OnTimeDeliveryChart } from "./charts/ontimeDeliveryChart";
import { LateProducts } from "./charts/lateProductsChart";
import { JourneyActions } from "../../../transportation/scheduling/tracking-route/redux/actions";
import { DeliveryLateDay } from "./charts/deliveryLateDay";
import { RouteTable } from "./routeTable";
import { LateStocks } from "./charts/lateStocksChart";
import { DayOfWeek } from "./charts/dayOfWeekChart";

function GeneralStatistic(props) {
    let dispatch = useDispatch()
    const currentRole = localStorage.getItem('currentRole')
    const userdepartments = useSelector((state) => state.user.userdepartments)
    const listOrders = useSelector(state => state.orders.listOrders)
    const listSchedules = useSelector(state => state.T3schedule.listSchedules?.schedules)

    // Khởi tạo state
    const [state, setState] = useState({
        currentRole: localStorage.getItem('currentRole'),
        page: 1,
        perPage: 5,
        monthToSearch: dayjs().format("MM-YYYY"),
        journeyTotalCostPerDay: "",
        isWorkingShipper: "",
        notWorkingShipper: "",
        totalTransportationCost: "",
    })
    const [selectedData, setSelectedData] = useState()

    const { requestManagements, translate, journey, shipper, socket } = props;
    const { page, perPage, monthToSearch, journeyTotalCostPerDay, isWorkingShipper, notWorkingShipper, totalTransportationCost } = state;

    useEffect(() => {
        const { currentRole } = state
        props.getAllRequestByCondition({ monthToSearch: monthToSearch, requestType: 4 });
        props.getAllVehicle({});
        props.getCostOfAllJourney({});
        props.getAllShipperWithCondition({ page: 1, perPage: 100 });
    }, []);

    useEffect(() => {
        dispatch(UserActions.getAllUserSameDepartment(currentRole))
        dispatch(OrderActions.getAllOrder())
        dispatch(ScheduleActions.getAllSchedule())
    }, [dispatch])

    const ordersOfSchedulesCount = () => {
        let orderCount = 0
        listSchedules?.forEach(schedule => {
            orderCount += schedule.orders?.length || 0
        });
        return orderCount
    }

    const estimateLateOrderCount = () => {
        let orderCount = 0
        listSchedules?.forEach(schedule => {
            schedule.orders?.forEach(order => {
                if((order.status == 1 || order.status == 2) && order.estimatedOntime == 0)
                    orderCount +=1
            })
        });
        return orderCount
    }

    const processingOrderCount = () => {
        let orderCount = 0
        listSchedules?.forEach(schedule => {
            schedule.orders?.forEach(order => {
                if(order.status == 2)
                    orderCount +=1
            })
        });
        return orderCount 
    }

    useEffect(() => {
        if (journey.journeyWithCost) {
            setState({
                ...state,
                journeyTotalCostPerDay: journey.journeyWithCost.costPerDay,
                totalTransportationCost: journey.journeyWithCost.totalCost,
            })
        }
    }, [journey]);

    useEffect(() => {
        if (shipper.totalList) {
            let isWorkingShipper = shipper.lists.filter((shipper) => shipper.status == 2);
            setState({
                ...state,
                isWorkingShipper: isWorkingShipper.length,
                notWorkingShipper: shipper.totalList - isWorkingShipper.length,
            })
        }
    }, [shipper])

    useEffect(() => {
        socket.io.on('request status dashboard', data => {
            props.updateRealTimeRequestStatus(data)
        });
        return () => props.socket.io.off('request status dashboard');
    }, [socket])

    useEffect(() => {
        socket.io.on('drivers status dashboard', data => {
            props.updateRealTimeShipperStatus(data)
        });
        return () => props.socket.io.off('drivers status dashboard');
    }, [socket])

    useEffect(() => {
        socket.io.on('vehicles status dashboard', data => {
            props.updateRealTimeVehicleStatus(data)
        });
        return () => props.socket.io.off('vehicles status dashboard');
    }, [socket])

    const handleChangeMonthToSearch = (value) => {
        setState({
            ...state,
            monthToSearch: value ? value : dayjs().format("MM-YYYY")
        })
    }


    let lists = [];
    const isManager = () => {
        if (userdepartments?.managers[currentRole]) {
          return true
        }
        return false
      }

    // const totalPage = example && Math.ceil(requestManagements.totalDocs / perPage);
    const handleChangeModule = (value) => {
      localStorage.setItem('module-transport', value);
      if(value == 1){
        // navigate to transportation dashboard
        window.location.href = '/transportation-dashboard';
      }else{
        window.location.href = '/manage-transport3-dashboard';
      }
    }
    return (
        <React.Fragment>
            {/* Chỉ số tổng hợp ở đầu trang */}
            <div className="box-body qlcv">
                <section>
                    <div className="qlcv" style={{ marginBottom: "10px" }}>
                      <div className="form-inline">
                        <div className="form-group">
                          <label style={{width: 'auto'}}>{translate('kpi.organizational_unit.dashboard.month')}</label>
                          <DatePicker
                            id="monthInTransportationDashboard"
                            dateFormat="month-year"
                            value={monthToSearch}
                            onChange={handleChangeMonthToSearch}
                            disabled={false}
                          />
                        </div>
                        <button type="button" className="btn btn-success">{translate('general.search')}</button>
                        <label style={{width: 'auto', marginLeft: '60%'}}>Chọn module</label>
                        <SelectBox
                          id={`select-module-transport`}
                          className="form-control select2"
                          style={{width: '100%'}}
                          items={[{value: '1', text: 'Transportation'}, {value: '2', text: 'Transport 3'}]}
                          onChange={handleChangeModule}
                          value={localStorage.getItem('module-transport') ? localStorage.getItem('module-transport') : '1'}
                          multiple={false}
                        />
                      </div>
                    </div>

                  <div className="row">
                    {/* Số đơn vị con */}
                    <div className="col-md-3 col-sm-6 form-inline">
                      <div className="info-box">
                        <span className="info-box-icon bg-green"><i className="fa fa-shopping-bag"/></span>
                        <div className="info-box-content">
                          <span className="info-box-text">Tổng số</span>
                          <a className="info-box-number"
                             style={{cursor: 'pointer', fontSize: '20px'}}>{listOrders.length} đơn</a>
                        </div>
                            </div>
                        </div>

                        {/* Chưa khởi tạo KPI */}
                        <div className="col-md-3 col-sm-6 form-inline">
                            <div className="info-box">
                                <span className="info-box-icon bg-blue"><i className="fa fa-motorcycle" /></span>
                                <div className="info-box-content">
                                    <span className="info-box-text">Đơn hàng</span>
                                    <a className="info-box-number" style={{ cursor: 'pointer', fontSize: '20px' }}>{ordersOfSchedulesCount()}/{listOrders.length}</a>
                                    <span>đã được lập kế hoạch</span>
                                </div>
                            </div>
                        </div>
                        {/* Chưa khởi tạo KPI */}
                        {/* <div className="col-md-3 col-sm-6 form-inline">
                            <div className="info-box">
                                <span className="info-box-icon bg-aqua"><i className="fa fa-users" /></span>
                                <div className="info-box-content">
                                    <span className="info-box-text">Nhân viên</span>
                                    <a className="info-box-number" style={{ cursor: 'pointer', fontSize: '20px' }}>{isWorkingShipper ? isWorkingShipper : 0} / {shipper.totalList ? shipper.totalList : 0}</a>
                                    <span>đang làm việc</span>
                                </div>
                            </div>
                        </div> */}
                        {/* Chưa khởi tạo KPI */}
                        {/* <div className="col-md-3 col-sm-6 form-inline">
                            <div className="info-box">
                                <span className="info-box-icon bg-yellow"><i className="fa fa-usd" /></span>
                                <div className="info-box-content">
                                    <span className="info-box-text">Chi phí / Lợi nhuận</span>
                                    <a className="info-box-number" style={{ cursor: 'pointer', fontSize: '15px' }}>
                                        {totalTransportationCost ? Math.round((totalTransportationCost[0]?.vehicleCost + totalTransportationCost[0]?.shipperCost) * 10) / 10 : 0} /
                                        {totalTransportationCost ? Math.round((totalTransportationCost[0]?.revenue) * 10) / 10 : 0} VNĐ
                                    </a>
                                </div>
                            </div>
                        </div> */}
                        <div className="col-md-3 col-sm-6 form-inline">
                            <div className="info-box">
                                <span className="info-box-icon bg-aqua"><i className="fa fa-users" /></span>
                                <div className="info-box-content">
                                    <span className="info-box-text">Đơn hàng</span>
                                    <a className="info-box-number" style={{ cursor: 'pointer', fontSize: '20px' }}>{processingOrderCount()} / {ordersOfSchedulesCount()}</a>
                                    <span>chưa hoặc đang được giao</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6 form-inline">
                            <div className="info-box">
                                <span className="info-box-icon bg-aqua"><i className="fa fa-users" /></span>
                                <div className="info-box-content">
                                    <span className="info-box-text">Đơn hàng</span>
                                    <a className="info-box-number" style={{ cursor: 'pointer', fontSize: '20px' }}>{estimateLateOrderCount()}/ {processingOrderCount()}</a>
                                    <span>có khả năng trễ hạn</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Tabs>
                <TabList>
                <Tab>Dashboard tổng quan</Tab>
                <Tab>Dashboard quản lý thông tin dự báo</Tab>
                </TabList>

                <TabPanel>
                <div className="row">
                            <div className="col-md-12">
                                <div className="box box-primary">
                                    <div className="box-header with-border">
                                        <div className="box-title">Biểu đồ thông tin vận chuyển</div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="box-body">
                                                <div className="box box-primary">
                                                    <div className="box-header">
                                                        <div className="box-title">Trạng thái đơn hàng</div>
                                                    </div>
                                                    <div className="box-body">
                                                        <OrdersInfoChart
                                                            monthToSearch={monthToSearch}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="box-body">
                                                <div className="box box-primary">
                                                    <div className="box-header">
                                                        <div className="box-title">Chi phí vận chuyển</div>
                                                    </div>
                                                    <div className="box-body">
                                                        <TransportationCostChart
                                                            journeyTotalCostPerDay={journeyTotalCostPerDay}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <RouteTable/>
                </TabPanel>
                <TabPanel>
                <div className="row">
                            <div className="col-md-12">
                                <div className="box box-primary">
                                    <div className="box-header with-border">
                                        <div className="box-title">Biểu đồ theo dõi thông tin giao hàng đúng hạn</div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="box-body">
                                                <div className="box box-primary">
                                                    <div className="box-header">
                                                        <div className="box-title">Tỉ lệ giao hàng đúng hạn</div>
                                                    </div>
                                                    <div className="box-body">
                                                        <OnTimeDeliveryChart monthToSearch={monthToSearch}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="box-body">
                                                <div className="box box-primary">
                                                    <div className="box-header">
                                                        <div className="box-title">Số ngày trễ hạn trung bình</div>
                                                    </div>
                                                    <div className="box-body">
                                                        <DeliveryLateDay monthToSearch={monthToSearch}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="box-body">
                                                <div className="box box-primary">
                                                    <div className="box-header">
                                                        <div className="box-title">TOP sản phẩm thường xuyên bị giao trễ hạn</div>
                                                    </div>
                                                    <div className="box-body">
                                                        <LateProducts monthToSearch={monthToSearch}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {isManager() && <div className="col-md-6">
                                            <div className="box-body">
                                                <div className="box box-primary">
                                                    <div className="box-header">
                                                        <div className="box-title">TOP kho hàng có sản phẩm thường xuyên bị giao trễ hạn</div>
                                                    </div>
                                                    <div className="box-body">
                                                        <LateStocks monthToSearch={monthToSearch}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>}
                                        {!isManager() && <div className="col-md-6">
                                            <div className="box-body">
                                                <div className="box box-primary">
                                                    <div className="box-header">
                                                        <div className="box-title">TOP ngày trong tuần thường xuyên có đơn hàng bị giao trễ hạn</div>
                                                    </div>
                                                    <div className="box-body">
                                                        <DayOfWeek monthToSearch={monthToSearch}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>}
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                </TabPanel>
            </Tabs>
        </React.Fragment>
    )
}

function mapState(state) {
    const requestManagements = state.requestManagements;
    const vehicle = state.vehicle;
    const journey = state.journey;
    const shipper = state.shipper;
    const socket = state.socket;
    return { requestManagements, vehicle, journey, socket, shipper }
}
const mapDispatchToProps = {
    getAllRequestByCondition: RequestActions.getAllRequestByCondition,
    updateRealTimeRequestStatus: RequestActions.updateRealTimeStatus,
    getAllVehicle: vehicleActions.getAllVehicle,
    updateRealTimeVehicleStatus: vehicleActions.updateRealTimeVehicleStatus,
    getCostOfAllJourney: JourneyActions.getCostOfAllJourney,
    getAllShipperWithCondition: ShipperActions.getAllShipperWithCondition,
    updateRealTimeShipperStatus: ShipperActions.updateRealTimeShipperStatus
}

const connectedGeneralStatistic = connect(mapState, mapDispatchToProps)(withTranslate(GeneralStatistic));
export { connectedGeneralStatistic as GeneralStatistic };
