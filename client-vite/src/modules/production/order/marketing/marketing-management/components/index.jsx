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
   <MarketingCampaignComponent /> 
  )
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(MarketingCampaign))
