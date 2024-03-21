import React from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { SalaryManagement } from './combinedContent'

const SalaryManager = (props) => {
  return (
    <React.Fragment>
      <SalaryManagement />
    </React.Fragment>
  )
}

export default connect(null, null)(withTranslate(SalaryManager))
