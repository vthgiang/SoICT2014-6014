import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import ManufacturingMillScheduleManagentTable from './manufacturingMillScheduleManagentTable'

function ManufacturingMillScheduleList(props) {
  return (
    <div style={{ minHeight: '450px' }}>
      <div className='box-body'>
        <ManufacturingMillScheduleManagentTable />
      </div>
    </div>
  )
}
export default connect(null, null)(withTranslate(ManufacturingMillScheduleList))
