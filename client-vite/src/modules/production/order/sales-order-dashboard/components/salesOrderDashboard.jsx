import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { SalesOrderActions } from '../../sales-order/redux/actions';
import { QuoteActions } from '../../quote/redux/actions';
import moment from 'moment';

import { DatePicker } from '../../../../../common-components';
import QuoteSummaryChart from './quoteSummaryChart';
import TopCareBarChart from './topCareBarChart';
import SalesOrderStatusChart from './salesOrderStatusChart';
import TopSoldBarChart from './topSoldBarChart';
import InfoBox from './infoBox';

const SalesOrderDashboard = (props) => {
  const [state, setState] = useState({
    currentRole: localStorage.getItem('currentRole'),
    startDate: '01-06-2024',
    endDate: '30-06-2024'
  });

  useEffect(() => {
    const { currentRole, startDate, endDate } = state;
    let data = {
      currentRole,
      startDate: moment(startDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
      endDate: moment(endDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
    };

    props.countSalesOrder(data);
    props.getTopGoodsSold(data);
    props.getSalesForDepartments(data);
    props.countQuote(data);
    props.getTopGoodsCare(data);
  }, []);

  const handleStartDateChange = (value) => {
    setState((state) => ({
      ...state,
      startDate: moment(value, 'YYYY-MM-DD').format('DD-MM-YYYY')
    }));
  };

  const handleEndDateChange = (value) => {
    setState((state) => ({
      ...state,
      endDate: moment(value, 'YYYY-MM-DD').format('DD-MM-YYYY')
    }));
  };

  const handleSubmitSearch = () => {
    let { startDate, endDate, currentRole } = state;
    let data = {
      currentRole,
      startDate: startDate ? moment(startDate, 'DD-MM-YYYY').format('YYYY-MM-DD') : '',
      endDate: endDate ? moment(endDate, 'DD-MM-YYYY').format('YYYY-MM-DD') : ''
    };
    props.countSalesOrder(data);
    props.getTopGoodsSold(data);
    props.getSalesForDepartments(data);
    props.countQuote(data);
    props.getTopGoodsCare(data);
  };

  return (
    <React.Fragment>
      <div className='qlcv'>
        <div className='form-inline' style={{ marginBottom: '10px' }}>
          <div className='form-group'>
            <label style={{ width: 'auto' }}>Từ</label>
            <DatePicker
              id='date_picker_dashboard_start_index'
              value={state.startDate}
              onChange={handleStartDateChange}
              format="DD-MM-YYYY"
              disabled={false}
            />
          </div>

          <div className='form-group'>
            <label style={{ width: 'auto' }}>Đến</label>
            <DatePicker
              id='date_picker_dashboard_end_index'
              value={state.endDate}
              onChange={handleEndDateChange}
              format="DD-MM-YYYY"
              disabled={false}
            />
          </div>

          <div className='form-group'>
            <button
              type='button'
              className='btn btn-success'
              title='Tìm kiếm'
              onClick={handleSubmitSearch}
            >
              Tìm kiếm
            </button>
          </div>
        </div>

        <div className='row'>
          <InfoBox />

          <div className='col-xs-12'>
            <div className='col-xs-6'>
              <QuoteSummaryChart />
            </div>

            <div className='col-xs-6'>
              <SalesOrderStatusChart />
            </div>
          </div>
          
          <div className='col-xs-12'>
            <div className='col-xs-6'>
              <TopCareBarChart />
            </div>

            <div className='col-xs-6'>
              <TopSoldBarChart />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

function mapStateToProps(state) {
  const { salesOrders, quotes } = state;
  return { salesOrders, quotes };
}

const mapDispatchToProps = {
  countSalesOrder: SalesOrderActions.countSalesOrder,
  getTopGoodsSold: SalesOrderActions.getTopGoodsSold,
  getSalesForDepartments: SalesOrderActions.getSalesForDepartments,
  countQuote: QuoteActions.countQuote,
  getTopGoodsCare: QuoteActions.getTopGoodsCare
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(SalesOrderDashboard));
