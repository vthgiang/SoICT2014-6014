import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import SalesOrderDashboard from './salesOrderDashboard'
import ForecastDashboard from '../components/forecast/forecastDashboard'

function Dashboard(props) {
  const [state, setState] = useState({
    type: 1
  })

  const handleChangeType = async (type) => {
    setState({
      ...state,
      type
    })
  }

  const { type } = state
  return (
    <div className='nav-tabs-custom'>
      <ul className='nav nav-tabs'>
        <li className='active'>
          <a href='#quote' data-toggle='tab' onClick={() => handleChangeType(1)}>
            {'Thống kê bán hàng'}
          </a>
        </li>
        <li>
          <a href='#sales-order' data-toggle='tab' onClick={() => handleChangeType(2)}>
            {'Phân tích doanh số'}
          </a>
        </li>
       
      </ul>

      {type === 1 && <SalesOrderDashboard />}

    
      {type === 2 && <ForecastDashboard />}

    </div>
  )
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(Dashboard))
