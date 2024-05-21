import {withTranslate} from 'react-redux-multilingual';
import React, {useEffect, useState} from 'react';
import {SelectBox} from '@modules/production/transport/transportHelper/select-box-id/selectBoxId';
import {useDispatch, useSelector} from 'react-redux';
import {ScheduleActions} from '@modules/transport3/schedule/redux/actions';

const PickForVehicle = props => {
  const dispatch = useDispatch();
  const depots = useSelector(state => state.T3schedule.depots);
  let {listOrders, currentVehicle, schedule, handleOrderChange} = props;
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

  return (
    <>
      <div key={currentVehicle._id}
           className="col-xs-12 col-sm-12 col-md-12 col-lg-12 align-middle d-flex items-center pb-10">
        <div className="col-xs-12 col-sm-6 col-md-4 col-lg-2 d-flex f-col">
          <div className="base-vehicle btn-info">
            {currentVehicle.assetName}
          </div>
          {listOrders.length === allVehicleOrders.length &&
            !(currentVehicleOrders.length === 0 && totalCurrentSelectbox === 0) &&
            <button className="btn btn-primary w-2/3 m-auto mt-2" onClick={event => {
              event.preventDefault();
              let firstOrder = currentVehicleOrders[0];
              let firstOrderInfo = listOrders.find(order => order._id === firstOrder);
              dispatch(ScheduleActions.getNearestDepot(firstOrderInfo.lat, firstOrderInfo.lng));
            }}>Tìm kho gần nhất
            </button>}
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
                  props.handleDeleteVehicle(currentVehicle._id)
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
