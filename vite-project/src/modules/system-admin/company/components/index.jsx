import React, { Component } from 'react'

import { CompanyTable } from './companyTable'

function Company() {
  return (
    <div className='box' style={{ minHeight: '450px' }}>
      <div className='box-body'>
        <CompanyTable />
      </div>
    </div>
  )
}

export default Company
