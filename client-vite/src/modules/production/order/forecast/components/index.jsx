import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import SalesForecastTable  from './sales-forecast/salesForecastTable'
import MarketingForecastComponent from '../../marketing/marketing-forecast/components/marketingForecast'
function Forecast(props) {
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
          <a href='#sales-forecast' data-toggle='tab' onClick={() => handleChangeType(1)}>
            {'Dự báo doanh số'}
          </a>
        </li>
        <li>
          <a href='#marketing-forecast' data-toggle='tab' onClick={() => handleChangeType(2)}>
            {'Dự báo chiến dịch tiếp thị'}
          </a>
        </li>
        
        
      </ul>
      {/* Phiếu thu */}
      {type === 1 && <SalesForecastTable /> }

    
      {type===2 && <MarketingForecastComponent />}
 
    </div>
  )
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(Forecast))
