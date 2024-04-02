import React from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from "react-redux";
import { JourneyActions } from '../../../scheduling/tracking-route/redux/actions'
import { DataTableSetting, DialogModal } from '../../../../../common-components';
import { useEffect, useState } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import CustomDirection from "../../../scheduling/custom-map/customDirection";
import CustomerMarker from "../../../scheduling/custom-map/customerMarker";
import DepotMarker from "../../../scheduling/custom-map/depotMarker";
import VehicleMarker from "../../../scheduling/custom-map/customVehicle";
import moment from "moment";
import Swal from "sweetalert2";

function DetailDeliveryTask(props) {
    const HN_COOR = { lat: 21.028511, lng: 105.804817 };

    const [state, setState] = useState({
        defaultZoom: 13,
        center: HN_COOR,
        tableId: "detail-delivery-task-table",
        detailJourney: null,
        isShowMap: false
    })

    const { translate, journey, socket } = props;
    const { tableId, directions, customers, depots, vehicle, showDepotMarker, detailJourney, defaultZoom, center, isShowMap, orders} = state;

    useEffect(() => {
        props.getJourneysByCondition({journeyCode: props.detailJourneyCode})
    },[props.detailJourneyCode])

    useEffect(() => {
        setState({
            ...state,
            detailJourney: journey.lists[0]
        })
    }, [journey]);

    useEffect(() => {
        if (detailJourney) {
            setState({
                ...state,
                directions: detailJourney.data.directions,
                customers: setCustomersMarker(detailJourney.data.orders),
                depots: setDepotsMarker(detailJourney.depotsTravel),
                vehicle: setVehicleMarker(detailJourney.data.directions[0], detailJourney.data.vehicle),
                orders: orderProcess(detailJourney),
                showDepotMarker: true,
            });
        }
    }, [detailJourney]);

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
    const mapContainerStyle = {
        height: "600px",
        width: "100%",
    }
    const orderProcess = (detailJourney) => {
        let orders = detailJourney.orders;
        let ordersInfo = []
        if (orders.length == 0) {
            return [];
        } else {
            orders.forEach((orderData) => {
                ordersInfo.push({
                    _id: orderData.order._id,
                    code: orderData.order.code,
                    destination: orderData.destinationPlace,
                    estimatedTimeArrive: moment(orderData.estimateTimeService).format('HH:mm:ss'),
                    status: orderData.status
                })
            })
        }

        return ordersInfo;
    }

    const handleDeliverySuccess = (orderSuccess) => {
        if (detailJourney) {
            let messageConfirm = "Giao hàng thành công"
            Swal.fire({
                html: `<h4"><div>${messageConfirm}</div></div></h4>`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: "Huỷ",
                confirmButtonText: "Xác nhận",
            }).then((result) => {
                if (result.isConfirmed) {
                    let updateData = {
                        successOrderId: orderSuccess._id
                    }
                    props.updateJourney(detailJourney._id, updateData)
                } else {

                }
            })
        }
    }

    const handleDeliveryFailure = (failureOrder) => {
        if (detailJourney) {
            let messageConfirm = "Giao hàng thất bại"
            Swal.fire({
                html: `<h4"><div>${messageConfirm}</div></div></h4>`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: "Huỷ",
                confirmButtonText: "Xác nhận",
            }).then((result) => {
                if (result.isConfirmed) {
                    let updateData = {
                        failureOrderId: failureOrder._id
                    }
                    props.updateJourney(detailJourney._id, updateData)
                } else {

                }
            })
        }
    }

    const handleUpdateStatusJourney = (journeyId ,status) => {
        let messageConfirm = "";
        if (status == 2) {
            messageConfirm = "Bắt đầu thực hiện lộ trình giao hàng";
        } else messageConfirm = "Kết thúc thực hiện lộ trình giao hàng";

        Swal.fire({
            html: `<h4"><div>${messageConfirm}</div></div></h4>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: "Huỷ",
            confirmButtonText: "Xác nhận",
        }).then((result) => {
            if (result.isConfirmed) {
                let updateData = {
                    status: status
                }
                props.updateJourney(journeyId, updateData)
            } else {

            }
        })

    }

    const handleShowMap =  () => {
        setState({
            ...state,
            isShowMap: !isShowMap
        })
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-detail-delivery-task`} isLoading={journey.isLoading}
                title="Chi tiết lộ trình"
                formID={`form-detail-delivery-task`}
                size={75}
                maxWidth={500}
                hasSaveButton={false}
                hasNote={false}
            >
                <div className="box-body">
                    <div className="row">
                        {
                            isShowMap &&
                            <div className="col-md-12">
                                <LoadScript
                                    googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY}
                                >
                                    <GoogleMap
                                        mapContainerStyle={mapContainerStyle}
                                        center={center}
                                        zoom={defaultZoom}
                                    >
                                        {directions && directions.map((direction, index) => {
                                            if (direction.isShowed === true)
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
                                            if (customer.marker.isShowed === true)
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
                                            if (depot.marker.isShowed === true)
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
                        }
                        <div className="col-md-12" style={{marginTop: "20px"}}>
                            <div className="form-inline">
                                <div className="form-group">
                                    <label htmlFor="journey-detail-table">{translate('manage_transportation.shipper.order_table_label')}</label>
                                </div>
                                <div className="form-group" style={{float: "right"}}>
                                    {  detailJourney && detailJourney.status == 1 &&
                                        <button className="btn btn-sm btn-info" onClick={() => handleUpdateStatusJourney(detailJourney._id, 2)}>{translate('manage_transportation.shipper.start_doing')}</button>
                                    }
                                    { detailJourney && detailJourney.status == 2 &&
                                        <button className="btn btn-sm btn-danger" onClick={() => handleUpdateStatusJourney(detailJourney._id, 3)}>{translate('manage_transportation.shipper.end_doing')}</button>
                                    }
                                    {
                                        isShowMap ?
                                        <button className="btn btn-sm btn-warning" onClick={handleShowMap} style={{marginLeft: "5px"}}>{translate('manage_transportation.shipper.hide_map_button')}</button> :
                                        <button className="btn btn-sm btn-success" onClick={handleShowMap} style={{marginLeft: "5px"}}>{translate('manage_transportation.shipper.show_map_button')}</button>
                                    }
                                </div>
                            </div>
                            <table className="table table-hover table-striped table-bordered" id={tableId} style={{ marginTop: '10px' }}>
                                <thead>
                                    <tr>
                                        <th>{translate('manage_transportation.shipper.index')}</th>
                                        <th>{translate('manage_transportation.shipper.order_code')}</th>
                                        <th>{translate('manage_transportation.shipper.destination_place')}</th>
                                        <th>{translate('manage_transportation.shipper.estimated_time_arrive')}</th>
                                        <th>{translate('manage_transportation.shipper.order_status')}</th>
                                        <th style={{ width: '120px', textAlign: 'center' }}>{translate('general.action')}
                                            <DataTableSetting
                                                tableId={tableId}
                                                columnArr={[
                                                    translate('manage_transportation.shipper.index'),
                                                    translate('manage_transportation.shipper.order_code'),
                                                    translate('manage_transportation.shipper.destination_place'),
                                                    translate('manage_transportation.shipper.estimated_time_arrive'),
                                                    translate('manage_transportation.shipper.order_status')
                                                ]}
                                            />
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(orders) ?
                                        orders.map((order, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{order.code}</td>
                                                <td>{order.destination}</td>
                                                <td>{order.estimatedTimeArrive}</td>
                                                <td>
                                                    { order.status == 2 && <span className="">Chưa giao</span> }
                                                    { order.status == 1 && <span className="text-green">Đã giao</span> }
                                                    { order.status == 3 && <span className="text-red">Giao thất bại</span> }
                                                </td>
                                                <td style={{ textAlign: "center" }}>
                                                    { order.status == 2 && detailJourney.status == 2 &&
                                                        <>
                                                            <a className="text-green" title={translate('manage_transportation.shipper.report_success')} onClick={() => handleDeliverySuccess(order)}><i className="material-icons">check_circle</i></a>
                                                            <a className="text-red" title={translate('manage_transportation.shipper.report_failure')} onClick={() => handleDeliveryFailure(order)}><i className="material-icons">cancel</i></a>
                                                        </>
                                                    }
                                                </td>
                                            </tr>
                                        )) : null
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    const shipper = state.shipper;
    const journey = state.journey;
    const socket = state.socket;
    return { shipper, journey, socket}
}

const mapActions = {
    getJourneysByCondition: JourneyActions.getJourneysByCondition,
    updateJourney: JourneyActions.updateJourney,
    refreshJourneyData: JourneyActions.refreshJourneyData
}
export default connect(mapState, mapActions)(withTranslate(DetailDeliveryTask));