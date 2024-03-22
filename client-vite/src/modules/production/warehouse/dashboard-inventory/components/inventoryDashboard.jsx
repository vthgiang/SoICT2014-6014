import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import InventoryDashboardHeader from './inventoryDashboardHeader'
import QuantityInventoryDashboard from './quantityInventoryDashboard'
import QuantityExpirationDate from './quantityExpirationDate'
import DetailQuantityOfGood from './detailQuantityOfGood'
import NormDasdboard from './normDasdboard'
import DetailQuantityOfGoodByMonth from './detailQuantityOfGoodByMonth'

function DashBoardInventories(props) {
  const [state, setState] = useState({
    stock: null,
    actionSearch: true
  })
  const { stock, actionSearch } = state

  return (
    <div className='qlcv'>
      <InventoryDashboardHeader />
      <div className='row'>
        <div className=' col-lg-12 col-md-12 col-md-sm-12 col-xs-12'>
          <QuantityInventoryDashboard actionSearch={actionSearch} />
        </div>
        <div className=' col-lg-12 col-md-12 col-md-sm-12 col-xs-12'>
          <DetailQuantityOfGoodByMonth />
        </div>
        <div className=' col-lg-6 col-md-6 col-md-sm-12 col-xs-12'>
          <QuantityExpirationDate />
        </div>
        <div className=' col-lg-6 col-md-6 col-md-sm-12 col-xs-12'>
          <DetailQuantityOfGood />
        </div>
        {/* <div className=" col-lg-6 col-md-6 col-md-sm-12 col-xs-12">
                    <NormDasdboard />
                </div> */}
      </div>
    </div>
  )
}

export default connect(null, null)(withTranslate(DashBoardInventories))
