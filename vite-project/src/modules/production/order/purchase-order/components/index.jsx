import React, { Component } from 'react'
import PurchaseOrderTable from './purchaseOrderTable'
import './purchaseOrder.css'

function PurchaseOrder() {
  return (
    <div className='box' style={{ minHeight: '450px' }}>
      <div className='box-body'>
        <PurchaseOrderTable />
      </div>
    </div>
  )
}

export default PurchaseOrder
