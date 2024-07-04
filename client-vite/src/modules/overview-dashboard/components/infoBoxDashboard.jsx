import React from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { formatCurrency } from '../../../helpers/formatCurrency';

function InfoBox(props) {
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
      
    </div>
  );
}

function mapStateToProps(state) {
  const { salesOrders, quotes } = state;
  return { salesOrders, quotes };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(InfoBox));
