import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { MaintainanceManagement } from './maintainanceManagement'

function MaintainanceManager(props) {
  return (
    <React.Fragment>
      <MaintainanceManagement />
    </React.Fragment>
  )
}

export default connect(null, null)(withTranslate(MaintainanceManager))
