import React from 'react'
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ContractManagement } from './contractManagement';

const Contract = () => {
  return (
    <div>
      <ContractManagement />
    </div>
  )
}

export default connect(null, null)(withTranslate(Contract));
