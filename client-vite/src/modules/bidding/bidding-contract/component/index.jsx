import React from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { ContractManagement } from './contractManagement'

function Contract() {
  return (
    <div>
      {/* <BiddingDashboard /> */}
      <ContractManagement />
    </div>
  )
}

export default connect(null, null)(withTranslate(Contract))
