import React, { Component } from 'react'
import SLAMangementTable from './slaManagementTable'

function ServiceLevelAgreement() {
  return (
    <div className='box' style={{ minHeight: '450px' }}>
      <div className='box-body'>
        <SLAMangementTable />
      </div>
    </div>
  )
}

export default ServiceLevelAgreement
