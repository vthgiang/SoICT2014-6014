import React from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { ManageConfiguration } from './combinedContent'

function ConfigurationManager() {
  return (
    <React.Fragment>
      <ManageConfiguration />
    </React.Fragment>
  )
}

export default connect(null, null)(withTranslate(ConfigurationManager))
