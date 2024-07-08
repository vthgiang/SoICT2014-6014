import React from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

function InfoBoxForecast(props) {
  const { saleForecast, timeFrame } = props;
  let saleForecastCounter = {};

  if (saleForecast) {
    saleForecastCounter = saleForecast;
  }

  if (!saleForecast || Object.keys(saleForecastCounter).length === 0) {
    return <div>Đang tải...</div>;
  }

  const getForecastCount = () => {
    switch (timeFrame) {
      case '1 Month':
        return saleForecastCounter.totalOneMonth || 0;
      case '3 Months':
        return saleForecastCounter.totalThreeMonth || 0;
      case '6 Months':
        return saleForecastCounter.totalSixMonth || 0;
      default:
        return 0;
    }
  };

  return (
    <div className='col-xs-12'>
      <div className='col-md-4 col-sm-6 col-xs-6'>
        <div className='info-box with-border'>
          <span className='info-box-icon bg-aqua'>
            <i className='fa fa-hand-o-right'></i>
          </span>
          <div className='info-box-content' title='Số báo giá'>
            <span className='info-box-text'>Số đơn hàng dự báo ({timeFrame})</span>
            <span className='info-box-number'>{getForecastCount()} Đơn hàng</span>
            <a href={`/manage-quote`} target='_blank'>
              Xem thêm <i className='fa fa-arrow-circle-right'></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return { saleForecast: state.forecasts.countForecasts };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(InfoBoxForecast));
