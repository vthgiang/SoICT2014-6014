import React from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import ManufacturingMillMangementTable from './manufacturingMillMangementTable'

const ManufacturingMill = () => {
  return (
    <div className='box' style={{ minHeight: '450px' }}>
      <div className='box-body'>
        <ManufacturingMillMangementTable />
      </div>
    </div>
  )
}
export default connect(null, null)(withTranslate(ManufacturingMill))
