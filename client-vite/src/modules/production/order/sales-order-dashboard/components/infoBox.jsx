import React from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { formatCurrency } from '../../../../../helpers/formatCurrency';

function InfoBox(props) {
  console.log("Props received in InfoBox:", props); // Log thông tin props để kiểm tra dữ liệu

  let salesOrdersCounter = {};
  let quoteCounter = {};

  if (props.salesOrders) {
    salesOrdersCounter = props.salesOrders?.salesOrdersCounter || {};
    console.log(salesOrdersCounter)
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
          <span className='info-box-icon bg-aqua'>
            <i className='fa fa-hand-o-right'></i>
          </span>
          <div className='info-box-content' title='Số báo giá'>
            <span className='info-box-text'>Số báo giá</span>
            <span className='info-box-number'>{quoteCounter.count || 0} báo giá</span>
            <a href={`/manage-quote`} target='_blank'>
              Xem thêm <i className='fa fa-arrow-circle-right'></i>
            </a>
          </div>
        </div>
      </div>
      <div className='col-md-4 col-sm-6 col-xs-6'>
        <div className='info-box with-border'>
          <span className='info-box-icon bg-green'>
            <i className='fa fa-hand-o-right'></i>
          </span>
          <div className='info-box-content' title='Tổng tiền mua hàng'>
            <span className='info-box-text'>Số đơn kinh doanh</span>
            <span className='info-box-number'>{salesOrdersCounter.count || 0} đơn</span>
            <a href={`/manage-sales-order`} target='_blank'>
              Xem thêm <i className='fa fa-arrow-circle-right'></i>
            </a>
          </div>
        </div>
      </div>
      <div className='col-md-4 col-sm-6 col-xs-6'>
        <div className='info-box with-border'>
          <span className='info-box-icon bg-red'>
            <i className='fa fa-hand-o-right'></i>
          </span>
          <div className='info-box-content' title='Tổng tiền mua hàng'>
            <span className='info-box-text'>Doanh thu</span>
            <span className='info-box-number'>{formatCurrency(salesOrdersCounter.totalMoney || 0)} vnđ</span>
            <a href={`/manage-payment`} target='_blank'>
              Xem thêm <i className='fa fa-arrow-circle-right'></i>
            </a>
          </div>
        </div>
      </div>
      
    </div>
  );
}

function mapStateToProps(state) {
  const { salesOrders, quotes } = state;
  console.log("mapStateToProps - state:", state); // Log thông tin state để kiểm tra dữ liệu
  return { salesOrders, quotes };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(InfoBox));
