import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { withTranslate } from 'react-redux-multilingual';
import { SalesOrderActions } from '../../production/order/sales-order/redux/actions';
import { QuoteActions } from '../../production/order/quote/redux/actions';

import { DatePicker } from '../../../common-components';
import SalesOrderStatusChart from '../../production/order/sales-order-dashboard/components/salesOrderStatusChart';
import InfoBoxDashboard from './infoBoxDashboard';
import { OnTimeDeliveryChart } from '../../transport3/dashboard/components/charts/ontimeDeliveryChart';
import { formatToTimeZoneDate } from '../../../helpers/formatDate';

function OverviewDashboard(props) {
  const [state, setState] = useState({
    currentRole: localStorage.getItem('currentRole'),
    startDate: moment('01-06-2024', 'DD-MM-YYYY').format('YYYY-MM-DD'),
    endDate: moment('30-06-2024', 'DD-MM-YYYY').format('YYYY-MM-DD')
  });
  const [monthToSearch, setMonthToSearch] = useState(moment().format('MM-YYYY'));

  useEffect(() => {
    const { currentRole, startDate, endDate } = state;
    let data = {
      currentRole,
      startDate,
      endDate
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
      startDate: moment(value, 'DD-MM-YYYY').format('YYYY-MM-DD')
    }));
  };

  const handleEndDateChange = (value) => {
    setState((state) => ({
      ...state,
      endDate: moment(value, 'DD-MM-YYYY').format('YYYY-MM-DD')
    }));
  };

  const handleSubmitSearch = () => {
    let { startDate, endDate, currentRole } = state;
    let data = {
      currentRole,
      startDate,
      endDate
    };
    const updatedMonthToSearch = endDate ? moment(endDate, 'YYYY-MM-DD').format('MM-YYYY') : moment().format('MM-YYYY');
    setMonthToSearch(updatedMonthToSearch);
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
              value={moment(state.startDate, 'YYYY-MM-DD').format('DD-MM-YYYY')}
              onChange={handleStartDateChange}
              format='DD-MM-YYYY'
              disabled={false}
            />
          </div>

          <div className='form-group'>
            <label style={{ width: 'auto' }}>Đến</label>
            <DatePicker
              id='date_picker_dashboard_end_index'
              value={moment(state.endDate, 'YYYY-MM-DD').format('DD-MM-YYYY')}
              onChange={handleEndDateChange}
              format='DD-MM-YYYY'
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
          <InfoBoxDashboard />

          <div className='col-xs-12'>
            <div className='col-xs-6'>
              <SalesOrderStatusChart />
            </div>
            <div className='col-xs-6'>
              <div className='box'>
                <div className='box-header with-border' style={{ paddingTop: '30px' }}>
                  <OnTimeDeliveryChart monthToSearch={monthToSearch} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

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

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(OverviewDashboard));
