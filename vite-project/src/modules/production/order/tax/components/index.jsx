import React, { Component } from 'react'
import TaxManagementTable from './taxManagementTable'

function Tax() {
  return (
    <div className='box' style={{ minHeight: '450px' }}>
      <div className='box-body'>
        <TaxManagementTable />
      </div>
    </div>
  )
}

export default Tax
