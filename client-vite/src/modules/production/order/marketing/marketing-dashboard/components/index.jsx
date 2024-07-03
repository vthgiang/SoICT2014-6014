import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import MarketingDashboardComponent  from './marketingDashboard'
function MarketingDashboard(props) {
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
      <MarketingDashboardComponent />
  )
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(MarketingDashboard))
