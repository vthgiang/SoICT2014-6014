import React, {useEffect, useState} from 'react'
import {withTranslate} from 'react-redux-multilingual'
import {useDispatch, useSelector} from 'react-redux';
import PickInMap from '@modules/transport3/schedule/components/map/pickInMap';
import {MapContainer, useMap} from 'react-leaflet';
import PickForVehicle from '@modules/transport3/schedule/components/map/pickForVehicle';

const SchedulePickLocation = (props) => {
  const [state, setState] = useState({
    totalOrderPicked: 0,
    typeRoute: false,
    schedule: props.schedule,
    nearestDepots: [],
    lat: 21,
    lng: 105
  })

  useEffect(() => {
    props.handleScheduleChange(state.schedule)
  }, [state.totalOrderPicked])

  useEffect(() => {
    props.handleNearestDepotsChange(state.nearestDepots)
  }, [state.nearestDepots])
  let listOrders = useSelector(state => state.orders.listOrders)
    .filter(order => order.status === 2 && order.transportType !== 3 && props.orders.includes(order._id));
  let listVehicle = useSelector(state => state.T3vehicle.listVehicle)
    .filter(vehicle => props.vehicles.includes(vehicle._id));
  let listStocks = useSelector(state => state.T3schedule.listStocsWithLatLng)

  const transportType = {
    1: 'Giao hàng',
    2: 'Nhận hàng'
  }

  const handleClickLocation = (e) => {
    e.preventDefault()
    let order = listOrders.find(order => order._id === e.target.dataset.key)
    setState({
      ...state,
      lat: order.lat,
      lng: order.lng
    })
  }

  const handleOrderChange = (vehicleId, index) => (value) => {
    let schedule = state.schedule;
    let orderId = value[0];

    // catch no order selected
    if (orderId === '--') {
      setTimeout(() => {
        schedule[vehicleId].orders.splice(index, 1);
        setState({
          ...state,
          schedule: schedule,
          totalOrderPicked: Object.values(schedule).map(vehicle => vehicle.orders).flat().length,
          nearestDepots: []
        })
      }, 10)
      // delay to wait for selectbox value change
      return;
    }

    // remove order from vehicle
    for (let key in schedule) {
      schedule[key].orders = schedule[key].orders.filter(order => order !== orderId);
    }

    // init vehicle if not exist
    !schedule[vehicleId] && (schedule[vehicleId] = {orders: []});

    // add order to vehicle
    schedule[vehicleId].orders[index > schedule[vehicleId].orders.length ? schedule[vehicleId].orders.length : index] = orderId;

    setState({
      ...state,
      schedule: schedule,
      totalOrderPicked: Object.values(schedule).map(vehicle => vehicle.orders).flat().length,
      nearestDepots: []
    })
  }

  const handleDeleteVehicle = (vehicleId) => {
    props.handleVehicleChange(props.vehicles.filter(vehicle => vehicle !== vehicleId));
    let schedule = state.schedule;
    delete schedule[vehicleId];
    setState({
      ...state,
      schedule: schedule
    })
  }

  const handleSetNearestDepot = (vehicleId, stockId) => {
    let nearestDepots = state.nearestDepots;
    if (nearestDepots.find(nearestDepot => nearestDepot.vehicle === vehicleId)) {
      nearestDepots = nearestDepots.filter(nearestDepot => nearestDepot.vehicle !== vehicleId);
    }
    nearestDepots.push({vehicle: vehicleId, stock: stockId});
    setState({
      ...state,
      nearestDepots: nearestDepots
    })
  }

  const handleTypeRouteChange = (e) => {
    setState({
      ...state,
      typeRoute: e.target.checked
    })
  }

  return (
    <>
      <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{height: '100vh'}}>
        <div className="col-xs-6 col-sm-6 col-md-4 col-lg-4" style={{padding: 10, height: '6x0%'}}>
          <fieldset className="scheduler-border" style={{height: '100%'}}>
            <legend className="scheduler-border">Danh sách địa điểm</legend>
            {listOrders.map((order) => (
              <button
                key={order._id}
                data-key={order._id}
                className={`btn ${order.transportType === 1 ? 'btn-primary' : 'btn-adn'}`}
                style={{width: '100%', marginBottom: 10}}
                onClick={handleClickLocation}>
                {order.code + ' - ' + order.customer.name + ' - ' + transportType[order.transportType]}
              </button>
            ))}
          </fieldset>
        </div>
        <div className="col-xs-6 col-sm-6 col-md-8 col-lg-8" style={{padding: 10, height: '60%'}}>
          <fieldset className="map-wrapper scheduler-border" style={{height: '100%'}}>
            <legend className="scheduler-border">Bản đồ</legend>
            <span style={{fontSize: 18, marginRight: 10}}>Kiểu hiển thị tuyến đường:</span>
            <b>Line</b>
            <label className="switch">
              <input type="checkbox" id="typeRoute" onChange={handleTypeRouteChange} checked={state.typeRoute}/>
              <span className="slider round"></span>
            </label>
            <b>Router</b>
            <MapContainer zoom={11} style={{height: '90%', width: "100%"}}>
              <PickInMap lat={state.lat} lng={state.lng} listOrders={listOrders} listVehicle={listVehicle}
                         listStocks={listStocks} nearestDepots={state.nearestDepots} typeRoute={state.typeRoute}
                         schedule={state.schedule} state={state}/>
            </MapContainer>
          </fieldset>
        </div>
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{padding: 10}}>
          <fieldset className="scheduler-border">
            <legend className="scheduler-border">Danh sách xe</legend>
            {listVehicle.map((vehicle) => (
              <PickForVehicle
                key={vehicle._id}
                listOrders={listOrders}
                listStocks={listStocks}
                currentVehicle={vehicle}
                schedule={state.schedule}
                totalOrderPicked={state.totalOrderPicked}
                nearestDepots={state.nearestDepots}
                handleOrderChange={handleOrderChange}
                handleDeleteVehicle={handleDeleteVehicle}
                handleSetNearestDepot={handleSetNearestDepot}
              />
            ))}
          </fieldset>
        </div>
      </div>
    </>
  );
}

export default withTranslate(SchedulePickLocation);
