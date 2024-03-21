import React, { Component } from 'react'
import DiscountManagementTable from './discountManagementTable'

function Discount() {
  return (
    <div className='box' style={{ minHeight: '450px' }}>
      <div className='box-body'>
        <DiscountManagementTable />
      </div>
    </div>
  )
}

export default Discount
