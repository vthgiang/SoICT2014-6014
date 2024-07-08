import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {withTranslate} from 'react-redux-multilingual'
import {SelectBox, ErrorLabel} from '@common-components'
import {OrderActions} from '@modules/transport3/order/redux/actions';
import {vehicleActions} from '@modules/transport3/vehicle/redux/actions';

const ScheduleCreateInfo = (props) => {
  const dispatch = useDispatch();
  const listSchedules = useSelector(state => state.T3schedule.listSchedules.schedules) || [];
  const listOrdered = listSchedules.map(schedule => schedule.orders).flat().map(order => order.order._id);
  const listOrders = useSelector(state => state.orders.listOrders)
    .filter(order => order.status === 2 && order.transportType !== 3).filter(order => !listOrdered.includes(order._id));
  const listVehicle = useSelector(state => state.T3vehicle.listVehicle)

  useEffect(() => {
    dispatch(OrderActions.getAllOrder());
    dispatch(vehicleActions.getAllVehicle())
  }, []);
  const transportType = {
    1: 'Giao hàng',
    2: 'Nhận hàng'
  }

  return (
    <>
      <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{padding: 10, height: '100%'}}>
          <fieldset className="scheduler-border" style={{height: '100%'}}>
            <legend className="scheduler-border">Thông tin chung</legend>
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <div className="form-group">
                  <label>Mã lịch vận chuyển</label>
                  <input type="text" className="form-control" value={props.code} disabled/>
                </div>
              </div>
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <div className="form-group">
                  <label>Ghi chú</label>
                  <textarea className="form-control" rows="1" placeholder="Ghi chú" value={props.note}
                            onChange={props.handleNoteChange}/>
                </div>
              </div>
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <div className="form-group">
                  <label>
                    Vận đơn
                    <span className="attention"> * </span>
                  </label>
                  <SelectBox
                    id={`order`}
                    className="form-control select2"
                    style={{width: '100%'}}
                    items={listOrders.map(order => (
                      {
                        value: order._id,
                        text: order.code + ' - ' + order.customer.name + ' - ' + transportType[order.transportType]
                      }
                    ))
                    }
                    value={props.orders}
                    onChange={props.handleOrderChange}
                    multiple={true}
                    options={{placeholder: 'Chọn vận đơn'}}
                  />
                </div>
              </div>
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <div className="form-group">
                  <label>Phương tiện</label>
                  <SelectBox
                    id={`vehicle`}
                    className="form-control select2"
                    style={{width: '100%'}}
                    items={
                      listVehicle.map(vehicle => (
                        {
                          value: vehicle._id,
                          text: vehicle.code + ' - ' + vehicle.asset.assetName
                        }
                      ))
                    }
                    value={props.vehicles}
                    onChange={props.handleVehicleChange}
                    multiple={true}
                    options={{placeholder: 'Chọn phương tiện'}}
                  />
                </div>
              </div>
            </div>

          </fieldset>
        </div>
      </div>
    </>
  )
}

export default withTranslate(ScheduleCreateInfo);

