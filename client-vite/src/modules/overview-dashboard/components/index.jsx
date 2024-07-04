import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { SalesOrderActions } from '../../production/order/sales-order/redux/actions'
import { QuoteActions } from '../../production/order/quote/redux/actions'

import { DatePicker, SelectBox } from '../../../common-components'
import QuoteSummaryChart from '../../production/order/sales-order-dashboard/components/quoteSummaryChart'
import TopCareBarChart from '../../production/order/sales-order-dashboard/components/topCareBarChart'
import SalesOrderStatusChart from '../../production/order/sales-order-dashboard/components/salesOrderStatusChart'
import TopSoldBarChart from '../../production/order/sales-order-dashboard/components/topSoldBarChart'
import InfoBox from '../../production/order/sales-order-dashboard/components/infoBox'

import { formatToTimeZoneDate } from '../../../helpers/formatDate'
import InfoBoxDashboard from './infoBoxDashboard'
// import QuoteSalesMappingAreaChart from "./quoteSalesMappingAreaChart";
// import RevenueAndSalesBarChart from "./revenueAndSalesBarChart";
// import AverageQuoteToSales from "./averageQuoteToSales";

function OverviewDashboard(props) {
  const [state, setState] = useState({
    currentRole: localStorage.getItem('currentRole')
  })

  useEffect(() => {
    const { currentRole } = state
    props.countSalesOrder({ currentRole })
    props.getTopGoodsSold({ currentRole })
    props.getSalesForDepartments()
    props.countQuote({ currentRole })
    props.getTopGoodsCare({ currentRole })
  }, [])

  const handleStartDateChange = (value) => {
    setState((state) => {
      return {
        ...state,
        startDate: value
      }
    })
  }

  const handleEndDateChange = (value) => {
    setState((state) => {
      return {
        ...state,
        endDate: value
      }
    })
  }

  const handleSunmitSearch = () => {
    let { startDate, endDate, currentRole } = state
    let data = {
      currentRole,
      startDate: startDate ? formatToTimeZoneDate(startDate) : '',
      endDate: endDate ? formatToTimeZoneDate(endDate) : ''
    }
    props.countSalesOrder(data)
    props.getTopGoodsSold(data)
    props.getSalesForDepartments(data)
    props.countQuote(data)
    props.getTopGoodsCare(data)
  }

  // console.log("SALES ORDER DASHBOARD", props.salesOrders);
  // console.log("QUOTE DASHBOARD", props.quotes);
  return (
    <React.Fragment>
      <div className='qlcv'>
        <div className='form-inline' style={{ marginBottom: '10px' }}>
          <div className='form-group'>
            <label style={{ width: 'auto' }}>Từ</label>
            <DatePicker id='date_picker_dashboard_start_index' value={state.startDate} onChange={handleStartDateChange} disabled={false} />
          </div>

          {/**Chọn ngày kết thúc */}
          <div className='form-group'>
            <label style={{ width: 'auto' }}>Đến</label>
            <DatePicker id='date_picker_dashboard_end_index' value={state.endDate} onChange={handleEndDateChange} disabled={false} />
          </div>

          <div className='form-group'>
            <button type='button' className='btn btn-success' title='Tìm kiếm' onClick={() => handleSunmitSearch()}>
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
          </div>
          
        </div>
      </div>
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  const { salesOrders, quotes } = state
  return { salesOrders, quotes }
}

const mapDispatchToProps = {
  countSalesOrder: SalesOrderActions.countSalesOrder,
  getTopGoodsSold: SalesOrderActions.getTopGoodsSold,
  getSalesForDepartments: SalesOrderActions.getSalesForDepartments,
  countQuote: QuoteActions.countQuote,
  getTopGoodsCare: QuoteActions.getTopGoodsCare
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(OverviewDashboard));
