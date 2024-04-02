import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import CustomDirection from "../../custom-map/customDirection";
import CustomerMarker from "../../custom-map/customerMarker";
import DepotMarker from "../../custom-map/depotMarker";
import VehicleMarker from "../../custom-map/customVehicle"
import MapControl from "../../custom-map/mapControl";
import TimelineJourney from "./timelineJourney";
import OrdersDeliveryStatusChart from "./ordersDeliveryStatusChart";
import { EmployeeManagerActions } from "../../../../human-resource/profile/employee-management/redux/actions";
import Swal from 'sweetalert2';
import { TreeSelect } from "../../../../../common-components";
import { JourneyActions } from "../redux/actions";
import { ShipperActions } from "../../../shipper/redux/actions";
import moment from "moment";

function DetailJourney(props) {
    const journey = props.location.state.journey;
    const HN_COOR = { lat: 21.028511, lng: 105.804817 };

    const [state, setState] = useState({
        defaultZoom: 13,
        center: HN_COOR,
        isProgress: false,
        showTimeline: false,
        showInputInfo: false,
        isTracking: false,
        changedDrivers: journey?.shippers.map((shipper) => shipper._id),
        isChangeDriver: false,
    });

    const { directions, customers, depots, vehicle, showDepotMarker, defaultZoom, center, changedDrivers, isChangeDriver, ordersStatus} = state;
    const mapContainerStyle = {
        height: "600px",
        width: "auto",
    }
    const { employeesManager, socket, shipper, translate } = props;

    useEffect(() => {
        setState({
            ...state,
            directions: journey.data.directions,
            customers: setCustomersMarker(journey.data.orders),
            depots: setDepotsMarker(journey.depotsTravel),
            vehicle: setVehicleMarker(journey.data.directions[0], journey.data.vehicle),
            ordersStatus: setOrdersStatus(journey.orders),
            showDepotMarker: true,
        });
        props.getAllShipperAvailableForJourney({
            startTime: journey.data.timeWindowJourney.startTime,
            endTime: journey.data.timeWindowJourney.endTime,
            journeyDate: moment(journey.estimatedDeliveryDate).format("YYYY-MM-DD")
        });
    }, []);

    useEffect(() => {
        socket.io.on('delivery progress', data => {
            setState({
                ...state,
                ordersStatus: setOrdersStatus(data.orders)
            })
        });
        return () => props.socket.io.off('delivery progress');
    }, [socket])


    const setCustomersMarker = (orders) => {
        let customersData = [];
        let customerCodeArr = [];
        orders.forEach((order) => {
            if (!customerCodeArr.includes(order.customer.code)) {
                customersData.push(order.customer)
            }
        })
        if(customersData.length > 0) customersData.map((customer) => {
            customer.marker = {
                id: customer.id,
                code: customer.code,
                lat: customer.latitude,
                lng: customer.longitude,
                isShowed: true,
            }
        });
        return customersData;

    }

    const setDepotsMarker = (depotsData) => {
        depotsData.map((depot) => {
            depot.marker = {
                id: depot.id,
                code: depot.code,
                lat: depot.latitude,
                lng: depot.longitude,
                color: 'white',
                isShowed: true,
            }
        });
        return depotsData;
    }

    const setShowMarkerInfo = (marker) => {
        let customers = customers.map((customer) => {
            if (customer.code === marker.code) {
                let showMarker = customer.marker;
                showMarker.isShowInfo = marker.isShowInfo;
                showMarker.infoWindow = marker.infoWindow;
                customer.marker = showMarker;
                return customer;
            } else {
                return customer;
            }
        });
        let depots = depots.map((depot) => {
            if (depot.code === marker.code) {
                let showMarker = depot.marker;
                showMarker.isShowInfo = marker.isShowInfo;
                showMarker.infoWindow = marker.infoWindow;
                depot.marker = showMarker;
                return depot;
            } else {
                return depot;
            }
        });
        setState({
            ...state,
            customers: customers,
            depots: depots,
        });
    }

    const handleChangeShipperForJourney = (value) => {
        setState({
            ...state,
            changedDrivers: value,
            isChangeDriver: true,
        })
    }

    const showConfirmChangeDrivers = () => {
        Swal.fire({
            html: `<h4"><div>Bạn có chắc muốn thay đổi tài xế phụ trách</div></div></h4>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: "Huỷ",
            confirmButtonText: "Xác nhận",
        }).then((result) => {
            if (result.isConfirmed) {
                const journeyId = journey._id;
                var driverIds = changedDrivers;
                props.changeDrivers(journeyId, {
                    changedDrivers: driverIds,
                    oldDrivers: journey.shippers,
                });
                setState({
                    ...state,
                    isChangeDriver: false,
                })
            } else {
                setState({
                    ...state,
                    changedDrivers: journey?.shippers.map((shipper) => shipper._id),
                    isChangeDriver: false,
                })
            }
        })
    }

    const setVehicleMarker = (direction, vehicleInfo) => {
        let vehicleMarker = {
            id: direction.id,
            lat: direction.from.latitude,
            lng: direction.from.longitude,
        }
        vehicleMarker.infoWindow = {
            name: vehicleInfo.name,
            maxVelocity: vehicleInfo.maxVelocity,
            minVelocity: vehicleInfo.minVelocity,
            tonnage: vehicleInfo.maxLoadWeight,
        }
        return vehicleMarker;
    }

    const setOrdersStatus = (orders) => {
        let deliveredNumber = 0, failureNumber = 0, inProcessNumber = 0;
        orders.forEach((order) => {
            if (order.status == 1)
                deliveredNumber += 1;
            else if (order.status == 3)
                failureNumber += 1;
        })
        inProcessNumber = orders.length - deliveredNumber - failureNumber;
        let statusOfOrderList = {
            deliveredNumber: deliveredNumber,
            failureNumber: failureNumber,
            inProcessNumber: inProcessNumber
        }
        return statusOfOrderList;
    }

    const handleShowDetailTotalCost = () => {
        let fixedVehicleCost = journey.data?.fixedVehicleCost;
        let operationVehicleCost = journey.data?.operationVehicleCost;
        let salary = journey.data?.totalDriverFixedSalary;
        let bonus = journey.data?.totalDriverBonusSalary;
        Swal.fire({
            title: '<strong>Chi tiết chi phí chuyến xe</strong>',
            icon: 'info',
            html:
              `<div>
                <p style="font-size: 15px">Chi phí xe cố định: ${fixedVehicleCost} (VND)</p>
                <p style="font-size: 15px">Chi phí vận hành xe: ${operationVehicleCost} (VND)</p>
                <p style="font-size: 15px">Lương cứng nhân viên: ${salary} (VND)</p>
                <p style="font-size: 15px">Lương bonus: ${bonus} (VND)</p>
              </div>`
          })
    }

    let availableShippers = [];
    if (shipper.availableForCurrentJourney) {
        availableShippers = shipper.availableForCurrentJourney.map((shipper) => {
            return {
                _id: shipper.driver._id,
                name: shipper.driver.fullName
            }
        })
    }
    if (journey?.shippers?.length > 0) {
        journey.shippers.forEach((shipper) => {
            availableShippers.push({
                _id: shipper._id,
                name: shipper.fullName
            })
        })
    }

    return (
        <div className="box" style={{ minHeight: "450px" }}>
            <div className="box-header">
                <span className="box-title">Thông tin chi tiết</span>
                <div className="row">
                    <div className="col-md-4">
                        <OrdersDeliveryStatusChart
                            orderStatus={{
                                ordersNumber: journey.totalOrder,
                                deliveredNumber: ordersStatus? ordersStatus.deliveredNumber : 0,
                                failureNumber: ordersStatus? ordersStatus.failureNumber : 0,
                                inProcessNumber: ordersStatus? ordersStatus.inProcessNumber : 0
                            }}
                        />
                    </div>
                    <div className="col-md-6" style={{marginTop: "20px"}}>
                        <div className="row" style={{marginTop: "20px"}}>
                            <div className="col-md-6">
                                <i className="fa fa-usd" aria-hidden="true" style={{ fontSize: "1.5em", marginRight: "4%", width: "20px"}}></i>
                                <span>Tổng chi phí: {journey.data.totalCost} (VND)&nbsp;&nbsp;</span>
                                <span><a onClick={() => handleShowDetailTotalCost()}><i className="fa fa-question-circle-o" aria-hidden="true"></i></a></span>
                            </div>
                            <div className="col-md-6">
                                <i className="fa fa-hourglass-start" aria-hidden="true" style={{ fontSize: "1.5em", marginRight: "4%", width: "20px"}}></i>
                                <span>Thời gian di chuyển: { Math.floor(journey.data.totalTime / 3600) } (h) { Math.floor((journey.data.totalTime % 3600) / 60) } (phút)</span>
                            </div>
                        </div>
                        <div className="row" style={{marginTop: "20px"}}>
                            <div className="col-md-6">
                                <i className="fa fa-usd" aria-hidden="true" style={{ fontSize: "1.5em", marginRight: "4%", width: "20px"}}></i>
                                <span>Lợi nhuận: {journey.data.revenue} (VND)&nbsp;&nbsp;</span>
                            </div>
                            <div className="col-md-6">
                                <i className="fa fa-paper-plane-o" aria-hidden="true" style={{ fontSize: "1.5em", marginRight: "4%", width: "20px"}}></i>
                                <span>Tổng quãng đường: { Math.round( journey.data.totalDistance / 1000 * 100) / 100 } (Km)</span>
                            </div>
                        </div>
                        <div className="row" style={{marginTop: "20px"}}>
                           <div className="col-md-6">
                                <i className="fa fa-truck" aria-hidden="true" style={{ fontSize: "1.5em", marginRight: "4%", width: "20px"}}></i>
                                <span>{ journey.data.vehicle.name }</span>
                           </div>
                           <div className="col-md-6">
                                <i className="fa fa-tachometer" aria-hidden="true" style={{ fontSize: "1.5em", marginRight: "4%" }}></i>
                                <span>{"Tỷ lệ lấp đầy trung bình: " + Math.round((journey.data.fillVolumeRate ? journey.data.fillVolumeRate : 0) * 100) / 100 + " %"}</span>
                           </div>
                        </div>
                        <div className="row" style={{marginTop: "20px"}}>
                            <div className="col-md-6">
                                <i className="fa fa-user" aria-hidden="true" style={{ fontSize: "1.5em", marginRight: "4%", width: "20px"}}></i>
                                <span>Tài xế phụ trách</span>
                            </div>
                            <div className="col-md-6">
                            <i className="fa fa-road" aria-hidden="true" style={{ fontSize: "1.5em", marginRight: "4%", width: "20px"}}></i>
                                <span>Số chuyến: { journey.data.routes.length ? journey.data.routes.length : 0 } (chuyến)</span>
                            </div>
                        </div>
                        <div className="row" style={{marginTop: "20px"}}>
                            <div className="col-md-12">
                                {journey && journey.status == 1 &&
                                    <div style={{marginRight: "20px"}}>
                                        <TreeSelect
                                            data={availableShippers}
                                            value={changedDrivers}
                                            handleChange={handleChangeShipperForJourney}
                                            mode="hierarchical"
                                            style={{width: "60%"}}
                                        />
                                    </div>
                                }
                                {journey && journey.status != 1 &&
                                    <div style={{marginRight: "20px"}}>
                                        { availableShippers ?
                                            availableShippers.map((driver, index) => (
                                                changedDrivers.includes(driver._id) &&
                                                <p key={index} style={{marginLeft: "7%"}}>
                                                    <strong>{driver.name}</strong>
                                                </p>
                                            )) : null
                                        }
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="row" style={{marginTop: "20px"}}>
                            { isChangeDriver &&
                                <button type="button" className="btn btn-sm btn-warning" onClick={showConfirmChangeDrivers}>Thay đổi</button>
                            }
                        </div>
                    </div>
                </div>
                <hr></hr>
            </div>
            <div className="box-body">
                <LoadScript
                    googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY}
                >
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={center}
                        zoom={defaultZoom}
                    >
                        {directions && directions.map((direction, index) => {
                            return (
                                <CustomDirection
                                    key={index + 1}
                                    index={index + 1}
                                    strokeColor={direction.strokeColor}
                                    from={direction.from}
                                    to={direction.to}
                                />
                            );
                        })}
                        {customers && customers.map((customer, index) => {
                            return (
                                <CustomerMarker
                                    key={index + 1}
                                    marker={customer.marker}
                                    setShow={setShowMarkerInfo}
                                >
                                </CustomerMarker>
                            );
                        })}
                        {depots && depots.map((depot, index) => {
                            return (
                                <DepotMarker
                                    key={index + 1}
                                    marker={depot.marker}
                                    setShow={setShowMarkerInfo}
                                    type={"DEPOT"}
                                >
                                </DepotMarker>
                            );
                        })}
                        {vehicle &&
                            <VehicleMarker
                                vehicle={vehicle}
                            />
                        }
                    </GoogleMap>
                </LoadScript>
            </div>
        </div>
    );
}
function mapState (state) {
    const employeesManager = state.employeesManager;
    const socket = state.socket;
    const shipper =  state.shipper;
    return { employeesManager, socket, shipper }
}

const actions = {
    getAllEmployee: EmployeeManagerActions.getAllEmployee,
    changeDrivers: JourneyActions.changeDrivers,
    getAllShipperAvailableForJourney: ShipperActions.getAllShipperAvailableForJourney,
}
export default connect(mapState, actions)(withTranslate(DetailJourney))