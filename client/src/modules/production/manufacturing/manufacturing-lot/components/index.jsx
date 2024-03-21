import React, { Component } from 'react'
import { connect } from 'react-redux'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import ManufacturingLotManagementTable from './manufacturingLotManagementTable'
function ManufacturingLot(props) {
  return (
    <div className='box' style={{ minHeight: '450px' }}>
      <div className='box-body'>
        <ManufacturingLotManagementTable />
      </div>
    </div>
  )
}

export default connect(null, null)(withTranslate(ManufacturingLot))
