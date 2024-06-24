import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { SalesOrderActions } from '../../sales-order/redux/actions'
import { QuoteActions } from '../../quote/redux/actions'

import { DatePicker, SelectBox } from '../../../../../common-components'
import QuoteSummaryChart from './quoteSummaryChart'
import TopCareBarChart from './topCareBarChart'
import SalesOrderStatusChart from './salesOrderStatusChart'
import TopSoldBarChart from './topSoldBarChart'
import InfoBox from './infoBox'
import SalesOfEmployee from './salesOfEmployee'
import { formatToTimeZoneDate } from '../../../../../helpers/formatDate'
// import QuoteSalesMappingAreaChart from "./quoteSalesMappingAreaChart";
// import RevenueAndSalesBarChart from "./revenueAndSalesBarChart";
// import AverageQuoteToSales from "./averageQuoteToSales";

function SalesOrderDashboard(props) {
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
          <InfoBox />

          <div className='col-xs-12'>
            <div className='col-xs-6'>
              <QuoteSummaryChart />
            </div>

            <div className='col-xs-6'>
              <SalesOrderStatusChart />
            </div>
          </div>
          {/* <div className="col-xs-12">
                            <QuoteSalesMappingAreaChart />
                        </div> */}

          {/* <div className="col-xs-12">
                            <RevenueAndSalesBarChart />
                        </div> */}

          <div className='col-xs-12'>
            <div className='col-xs-6'>
              <TopCareBarChart />
            </div>

            <div className='col-xs-6'>
              <TopSoldBarChart />
            </div>
          </div>
          {/* <div className='col-xs-12'>
            <SalesOfEmployee />
          </div> */}
          {/* <div className="col-xs-12">
                            <AverageQuoteToSales />
                        </div> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(SalesOrderDashboard))
