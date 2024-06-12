import {withTranslate} from 'react-redux-multilingual';
import React, {useEffect, useState} from 'react';
import {SelectBox} from '@modules/production/transport/transportHelper/select-box-id/selectBoxId';

const PickForVehicle = props => {
  let {
    listOrders,
    listStocks,
    currentVehicle,
    schedule,
    handleOrderChange,
    handleDeleteVehicle,
    handleSetNearestDepot
  } = props;
  let totalOrderPicked = 0, allVehicleOrders = 0, currentVehicleOrders = 0, totalCurrentSelectbox = 0;

  for (let key in schedule) {
    totalOrderPicked += schedule[key].orders.length;
  }
  allVehicleOrders = Object.values(schedule).map(vehicle => vehicle.orders).flat();
  currentVehicleOrders = schedule[currentVehicle._id] ? schedule[currentVehicle._id].orders : [];
  totalCurrentSelectbox = totalOrderPicked === listOrders.length ? currentVehicleOrders.length : currentVehicleOrders.length + 1;

  const transportType = {
    1: 'Giao hàng',
    2: 'Nhận hàng'
  }

  let listOrderItems = [
    {
      value: '--',
      text: '--Chọn đơn hàng--'
    },
    ...listOrders.map(order => ({
      value: order._id,
      text: order.code + ' - ' + order.customer.name + ' - ' + transportType[order.transportType]
    }))
  ];


  const checkNearestDepot = () => {
    if (listOrders.length === allVehicleOrders.length && !(currentVehicleOrders.length === 0 && totalCurrentSelectbox === 0)) {
      let firstOrder = currentVehicleOrders[0];
      let firstOrderInfo = listOrders.find(order => order._id === firstOrder);
      let nearestDepot;
      let nearestDepotDistance = 0;
      if (firstOrderInfo) {
        listStocks.forEach(stock => {
          if (!stock.lat)
            return;
          let distance = Math.sqrt(
            Math.pow(firstOrderInfo.lat - stock.lat, 2) + Math.pow(firstOrderInfo.lng - stock.lng, 2)
          );
          if (nearestDepotDistance === 0 || distance < nearestDepotDistance) {
            nearestDepot = stock;
            nearestDepotDistance = distance;
          }
        });
      }
      if (nearestDepot) {
        handleSetNearestDepot(currentVehicle._id, nearestDepot);
      }
    }
  }

  useEffect(() => {
    checkNearestDepot();
  }, [props.state.schedule]);
  return (
    <>
      <div key={currentVehicle._id}
           className="col-xs-12 col-sm-12 col-md-12 col-lg-12 align-middle d-flex items-center pb-10">
        <div className="col-xs-12 col-sm-6 col-md-4 col-lg-2 d-flex f-col">
          <div className="base-vehicle btn-info">
            {currentVehicle.assetName}
          </div>
        </div>
        <div className={'picking col-lg-10'}>
          <ul className={'l1'}>
            {
              new Array(totalCurrentSelectbox).fill(0).map((_, index) => (
                <li key={`order-${currentVehicle._id}-${index}`}>
                  <SelectBox
                    id={`order-${currentVehicle._id}-${index}`}
                    className={`order-${currentVehicle._id}`}
                    style={{width: '100%'}}
                    items={listOrderItems.filter(order => !allVehicleOrders.includes(order.value) || order.value === currentVehicleOrders[index])}
                    value={currentVehicleOrders[index]}
                    onChange={handleOrderChange(currentVehicle._id, index)}
                  />
                </li>
              ))
            }
            {currentVehicleOrders.length === 0 && totalCurrentSelectbox === 0 &&
              (<>
                <p className="text-danger d-flex items-center mr-2">Xe chưa chọn đơn hàng nào. Bạn có muốn xóa xe
                  này?</p>
                <button className="btn btn-danger" onClick={event => {
                  event.preventDefault();
                  handleDeleteVehicle(currentVehicle._id)
                }}>Xóa
                </button>
              </>)
            }
          </ul>
        </div>
      </div>
    </>
  )
}

export default withTranslate(PickForVehicle);
