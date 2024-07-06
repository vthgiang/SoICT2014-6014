import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import dayjs from 'dayjs';
import { DatePicker, SelectBox } from "../../../../common-components";
import { RequestActions } from '../../../production/common-production/request-management/redux/actions'
import { ShipperActions } from '../../shipper/redux/actions';
import { vehicleActions } from '../../vehicle/redux/actions';
import { OrdersInfoChart } from "./charts/ordersInfoChart";
import { TransportationCostChart } from "./charts/costChart";
import { OnTimeDeliveryChart } from "./charts/ontimeDeliveryChart";
import { JourneyActions } from '../../scheduling/tracking-route/redux/actions';
import { DeliveryLateDay } from "./charts/deliveryLateDay";

function GeneralStatistic(props) {

    // Khởi tạo state
    const [state, setState] = useState({
        page: 1,
        perPage: 5,
        monthToSearch: dayjs().format("MM-YYYY"),
        inProcessRequests: 0,
        failRequests: 0,
        successRequests: 0,
        isUsingVehicle: 0,
        notUseVehicle: 0,
        totalRequests: 0,
        journeyTotalCostPerDay: "",
        isWorkingShipper: "",
        notWorkingShipper: "",
        totalTransportationCost: "",
    })
    const [selectedData, setSelectedData] = useState()

    const { requestManagements, translate, vehicle, journey, shipper, socket } = props;
    const { page, perPage, totalRequests, monthToSearch, inProcessRequests, failRequests, successRequests, isUsingVehicle,
        notUseVehicle, journeyTotalCostPerDay, isWorkingShipper, notWorkingShipper, totalTransportationCost } = state;

    useEffect(() => {
        props.getAllRequestByCondition({ monthToSearch: monthToSearch, requestType: 4 });
        props.getAllVehicle({});
        props.getCostOfAllJourney({});
        props.getAllShipperWithCondition({ page: 1, perPage: 100 });
    }, []);

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
        if (requestManagements?.listRequests.length > 0) {
            let requests = requestManagements.listRequests;
            let inProcess = requests.filter((request) => request.status == 3);
            let success = requests.filter((request) => request.status == 4);
            let fail = requests.filter((request) => request.status == 5);

            setState({
                ...state,
                inProcessRequests: inProcess.length,
                failRequests: fail.length,
                successRequests: success.length,
                totalRequests: requests.length,
            })
        }
    }, [requestManagements])

    useEffect(() => {
        if (vehicle.listVehicle.length > 0) {
            let listVehicle = vehicle.listVehicle;
            let isUsingVehicle = listVehicle.filter((vehicle) => vehicle.status == 1);
            let notUseVehicle = listVehicle.filter((vehicle) => vehicle.status == 2);

            setState({
                ...state,
                isUsingVehicle: isUsingVehicle.length,
                notUseVehicle: notUseVehicle.length
            })
        }
    }, [vehicle])

    useEffect(() => {
        socket.io.on('request status dashboard', data => {
            console.log(data);
            props.updateRealTimeRequestStatus(data)
        });
        return () => props.socket.io.off('request status dashboard');
    }, [socket])

    useEffect(() => {
        socket.io.on('drivers status dashboard', data => {
            console.log(data);
            props.updateRealTimeShipperStatus(data)
        });
        return () => props.socket.io.off('drivers status dashboard');
    }, [socket])

    useEffect(() => {
        socket.io.on('vehicles status dashboard', data => {
            console.log(data);
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
                                <label style={{ width: "auto" }}>{translate('kpi.organizational_unit.dashboard.month')}</label>
                                <DatePicker
                                    id="monthInTransportationDashboard"
                                    dateFormat="month-year"
                                    value={monthToSearch}
                                    onChange={handleChangeMonthToSearch}
                                    disabled={false}
                                />
                            </div>
                            <button type="button" className="btn btn-success">{translate('general.search')}</button>

                          <label style={{ width: "auto", marginLeft: "60%" }}>Chọn module</label>
                          <SelectBox
                            id={`select-module-transport`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={[{ value: '1', text: 'Transportation' }, { value: '2', text: 'Transport 3' }]}
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
                                <span className="info-box-icon bg-green"><i className="fa fa-shopping-bag" /></span>
                                <div className="info-box-content">
                                    <span className="info-box-text">Tổng số</span>
                                    <a className="info-box-number" style={{ cursor: 'pointer', fontSize: '20px' }}>{totalRequests} đơn</a>
                                </div>
                            </div>
                        </div>

                        {/* Chưa khởi tạo KPI */}
                        <div className="col-md-3 col-sm-6 form-inline">
                            <div className="info-box">
                                <span className="info-box-icon bg-blue"><i className="fa fa-motorcycle" /></span>
                                <div className="info-box-content">
                                    <span className="info-box-text">Số lượng xe</span>
                                    <a className="info-box-number" style={{ cursor: 'pointer', fontSize: '20px' }}>{isUsingVehicle}/{isUsingVehicle + notUseVehicle}</a>
                                    <span>đang hoạt động</span>
                                </div>
                            </div>
                        </div>
                        {/* Chưa khởi tạo KPI */}
                        <div className="col-md-3 col-sm-6 form-inline">
                            <div className="info-box">
                                <span className="info-box-icon bg-aqua"><i className="fa fa-users" /></span>
                                <div className="info-box-content">
                                    <span className="info-box-text">Nhân viên</span>
                                    <a className="info-box-number" style={{ cursor: 'pointer', fontSize: '20px' }}>{isWorkingShipper ? isWorkingShipper : 0} / {shipper.totalList ? shipper.totalList : 0}</a>
                                    <span>đang làm việc</span>
                                </div>
                            </div>
                        </div>
                        {/* Chưa khởi tạo KPI */}
                        <div className="col-md-3 col-sm-6 form-inline">
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
                        </div>
                    </div>
                </section>
            </div>
            {/* Biểu đồ */}
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
                                                transportationRequests={{ inProcessRequests, successRequests, failRequests, totalRequests }}
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
                            <div className="col-md-6">
                                <div className="box-body">
                                    <div className="box box-primary">
                                        <div className="box-header">
                                            <div className="box-title">Tỉ lệ giao hàng đúng hạn</div>
                                        </div>
                                        <div className="box-body">
                                            <OnTimeDeliveryChart
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
                                            <DeliveryLateDay
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
