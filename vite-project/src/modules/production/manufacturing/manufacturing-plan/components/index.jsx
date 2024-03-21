import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import ManufacturingPlanManagementTable from './manufacturingPlanManagementTable'

function ManufacturingPlan(props) {
  return (
    <div className='box' style={{ minHeight: '450px' }}>
      <div className='box-body'>
        <ManufacturingPlanManagementTable />
      </div>
    </div>
  )
}
export default connect(null, null)(withTranslate(ManufacturingPlan))
