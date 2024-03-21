import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { PurchaseRequestManager } from './PurchaseRequestManager'

function ManagerRecommendProcure(props) {
  return (
    <React.Fragment>
      <PurchaseRequestManager />
    </React.Fragment>
  )
}

export default connect(null, null)(withTranslate(ManagerRecommendProcure))
