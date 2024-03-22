import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DepreciationManager } from './DepreciationManager'

function ManagerDepreciation(props) {
  return (
    <React.Fragment>
      <DepreciationManager />
    </React.Fragment>
  )
}

export default connect(null, null)(withTranslate(ManagerDepreciation))
