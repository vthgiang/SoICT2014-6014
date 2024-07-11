import React from 'react';
import { useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { formatCurrency } from '../../../helpers/formatCurrency';
import { ScheduleActions } from '../../transport3/schedule/redux/actions';
import { withRouter } from 'react-router-dom';

function InfoBox(props) {
  let dispatch = useDispatch()
  let salesOrdersCounter = {};
  let quoteCounter = {};

  if (props.salesOrders) {
    salesOrdersCounter = props.salesOrders?.salesOrdersCounter || {};
  }

  if (props.quotes) {
    quoteCounter = props.quotes?.quoteCounter || {};
  }

  if (!props.salesOrders || !props.quotes) {
    return <div>Đang tải...</div>;
  }

  const listSchedules = useSelector(state => state.T3schedule.listSchedules?.schedules)

  useEffect(() => {
    dispatch(ScheduleActions.getAllSchedule())
  }, [dispatch])

  const sumOfOrderCount = () => {
    let orderCount = 0
    let lateOrderCount = 0
    listSchedules?.forEach(schedule => {
      schedule.orders?.forEach(order => {
        orderCount += 1
        if(order.timeArrive > order.estimateTimeArrive){
          lateOrderCount += 1
        }
      })
    });
    return [orderCount, lateOrderCount]
  }

  const [orderCount, lateOrderCount] = sumOfOrderCount();

  const handleShowDetailDashboard = () => {
    props.history.push('/manage-transport3-dashboard')
  }

  return (
    <div className='col-xs-12'>
      
      <div className='col-md-4 col-sm-6 col-xs-6'>
        <div className='info-box with-border'>
          <span className='info-box-icon bg-green'>
            <i className='fa fa-hand-o-right'></i>
          </span>
          <div className='info-box-content' title='Tổng tiền mua hàng'>
            <span className='info-box-text'>Số đơn kinh doanh</span>
            <span className='info-box-number'>{salesOrdersCounter.count || 0} đơn</span>
          </div>
        </div>
      </div>
      <div className='col-md-4 col-sm-6 col-xs-6'>
        <div className='info-box with-border'>
          <span className='info-box-icon bg-red'>
            <i className='fa fa-hand-o-right'></i>
          </span>
          <div className='info-box-content' title='Tổng tiền mua hàng'>
            <span className='info-box-text'>Doanh số</span>
            <span className='info-box-number'>{formatCurrency(salesOrdersCounter.totalMoney || 0)} vnđ</span>
            
          </div>
        </div>
      </div>
      <div className='col-md-4 col-sm-6 col-xs-6'>
        <div className='info-box with-border'>
          <span className='info-box-icon bg-orange'>
            <i className='fa fa-hand-o-right'></i>
          </span>
          <div className='info-box-content' title='Tổng tiền mua hàng'>
            <span className='info-box-text'>Đơn hàng</span>
            <span className='info-box-number'>{lateOrderCount || 0} / {orderCount || 0}</span>
            <span>trễ hạn</span>
            <button 
              style={{position: 'absolute', top: '10px', right: '30px'}}
              onClick={()=> handleShowDetailDashboard()}
            >Xem chi tiết
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
}

function mapStateToProps(state) {
  const { salesOrders, quotes } = state;
  return { salesOrders, quotes };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(withRouter(InfoBox)));
