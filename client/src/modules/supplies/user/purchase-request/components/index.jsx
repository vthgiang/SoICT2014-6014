import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { PurchaseRequest } from './PurchaseRequest'

function UserPurchaseRequest(props) {
  return (
    <React.Fragment>
      <PurchaseRequest />
    </React.Fragment>
  )
}

export default connect(null, null)(withTranslate(UserPurchaseRequest))
