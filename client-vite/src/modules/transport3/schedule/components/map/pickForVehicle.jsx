import {withTranslate} from 'react-redux-multilingual';
import React, {useEffect, useState} from 'react';
import {SelectBox} from '@modules/production/transport/transportHelper/select-box-id/selectBoxId';

const PickForVehicle = props => {
  let {
    listOrders,
    listStocks,
    currentVehicle,
    schedule,
    nearestDepots,
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
      let lastOrder = currentVehicleOrders[currentVehicleOrders.length - 1];
      let firstOrderInfo = listOrders.find(order => order._id === firstOrder);
      let lastOrderInfo = listOrders.find(order => order._id === lastOrder);
      let nearestDepot;
      let nearestDepotDistance = 0;
      if (firstOrderInfo && lastOrderInfo) {
        listStocks.forEach(stock => {
          if (!stock.lat)
            return;
          let distanceFirst = Math.sqrt(
            Math.pow(firstOrderInfo.lat - stock.lat, 2) + Math.pow(firstOrderInfo.lng - stock.lng, 2)
          );
          let distanceLast = Math.sqrt(
            Math.pow(lastOrderInfo.lat - stock.lat, 2) + Math.pow(lastOrderInfo.lng - stock.lng, 2)
          );
          if (!nearestDepot || (distanceFirst + distanceLast) < nearestDepotDistance) {
            nearestDepot = stock;
            nearestDepotDistance = distanceFirst + distanceLast;
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
  }, [props.totalOrderPicked])

  let nearestDepot = nearestDepots.find(nearestDepot => nearestDepot.vehicle === currentVehicle._id);
  return (
    <>
      <div key={currentVehicle._id}
           className="col-xs-12 col-sm-12 col-md-12 col-lg-12 align-middle d-flex items-center pb-10">
        <div className="col-xs-12 col-sm-6 col-md-4 col-lg-2 d-flex f-col">
          <div className="base-vehicle btn-info">
            {currentVehicle.asset.assetName}
          </div>
          {nearestDepot && nearestDepot.stock &&
            (
              <div className={'d-flex flex-row mt-1'}>
                Kho tối ưu:
                <span className="badge btn-primary ml-1">Kho {nearestDepot.stock.name}</span>
              </div>
            )
          }
        </div>
        <div className={'picking col-lg-10'}>
          {
            new Array(Math.ceil(totalCurrentSelectbox / 5)).fill(0).map((_, index) => {
                let numOfSelectboxInRow = Math.min(5, totalCurrentSelectbox - index * 5);
                let beginIndex = index * 5;
                let isBackRow = index % 2 === 1;
                let isHaveNextRow = index < Math.ceil(totalCurrentSelectbox / 5) - 1;
              console.log(index, isHaveNextRow)
                if (!isBackRow) {
                  return (
                    <ul key={`row-${index}`} className={'l1'}>
                      {
                        new Array(numOfSelectboxInRow).fill(0).map((_, index) => (
                          <li key={`order-${currentVehicle._id}-${index + beginIndex}`}>
                            <SelectBox
                              id={`order-${currentVehicle._id}-${index + beginIndex}`}
                              className={`order-${currentVehicle._id}`}
                              style={{width: '100%'}}
                              items={listOrderItems.filter(order => !allVehicleOrders.includes(order.value) || order.value === currentVehicleOrders[index + beginIndex])}
                              value={currentVehicleOrders[index + beginIndex]}
                              onChange={handleOrderChange(currentVehicle._id, index + beginIndex)}
                            />
                            {isHaveNextRow && index === 4 && (
                                <div className={"ul_l1_li_last_child"}></div>
                                )}
                          </li>
                        ))
                      }
                    </ul>
                  )
                } else {
                  // Back row
                  beginIndex += numOfSelectboxInRow;
                  return (
                    <ul key={`row-${index}`} className={'l2'}>
                      {
                        new Array(numOfSelectboxInRow).fill(0).map((_, index) => (
                          <li key={`order-${currentVehicle._id}-${beginIndex - index - 1}`}>
                            <SelectBox
                              id={`order-${currentVehicle._id}-${beginIndex - index - 1}`}
                              className={`order-${currentVehicle._id}`}
                              style={{width: '100%'}}
                              items={listOrderItems.filter(order => !allVehicleOrders.includes(order.value) || order.value === currentVehicleOrders[beginIndex - index - 1])}
                              value={currentVehicleOrders[beginIndex - index - 1]}
                              onChange={handleOrderChange(currentVehicle._id, beginIndex - index - 1)}
                            />
                          </li>
                        ))
                      }
                    </ul>
                  )
                }
              }
            )
          }

          <ul className={'l1'}>
            {/*{*/}
            {/*  new Array(totalCurrentSelectbox).fill(0).map((_, index) => (*/}
            {/*    <li key={`order-${currentVehicle._id}-${index}`}>*/}
            {/*      <SelectBox*/}
            {/*        id={`order-${currentVehicle._id}-${index}`}*/}
            {/*        className={`order-${currentVehicle._id}`}*/}
            {/*        style={{width: '100%'}}*/}
            {/*        items={listOrderItems.filter(order => !allVehicleOrders.includes(order.value) || order.value === currentVehicleOrders[index])}*/}
            {/*        value={currentVehicleOrders[index]}*/}
            {/*        onChange={handleOrderChange(currentVehicle._id, index)}*/}
            {/*      />*/}
            {/*    </li>*/}
            {/*  ))*/}
            {/*}*/}
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
