import React from 'react'
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { BiddingDashboard } from '../../bidding-dashboard/component';
import { ContractManagement } from './contractManagement';

const Contract = () => {
  return (
    <div>
      {/* <BiddingDashboard /> */}
      <ContractManagement />
    </div>
  )
}

export default connect(null, null)(withTranslate(Contract));
