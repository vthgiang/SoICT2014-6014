import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { UseRequestManager } from './UseRequestManager'

function ManagerRecommendDistribute(props) {
  return (
    <React.Fragment>
      <UseRequestManager />
    </React.Fragment>
  )
}

export default connect(null, null)(withTranslate(ManagerRecommendDistribute))
