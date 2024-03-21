import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { SuppliesManagement } from './SuppliesManagement'

function ManageSupplies(props) {
  return (
    <React.Fragment>
      <SuppliesManagement></SuppliesManagement>
    </React.Fragment>
  )
}

export default connect(null, null)(withTranslate(ManageSupplies))
