import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import MarketingCampaignComponent  from './marketingCampaign'
import DiscountManagementTable from '../../../discount/components/discountManagementTable'
function MarketingCampaign(props) {
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
          <a href='#marketing' data-toggle='tab' onClick={() => handleChangeType(1)}>
            {'Quản lý chiến dịch tiếp thị'}
          </a>
        </li>
        <li>
          <a href='#discount' data-toggle='tab' onClick={() => handleChangeType(2)}>
            {'Giảm giá'}
          </a>
        </li>
        
        
      </ul>
      {/* Phiếu thu */}
      {type === 1 && <MarketingCampaignComponent /> }

    
      {type===2 && <DiscountManagementTable />}
 
    </div>
  )
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(MarketingCampaign))
