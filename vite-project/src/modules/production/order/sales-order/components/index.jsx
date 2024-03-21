import React, { Component } from 'react'
import SalesOrderTable from './salesOrderTable'

function SalesOrder(props) {
  return (
    <div className='box' style={{ minHeight: '450px' }}>
      <div className='box-body'>
        <SalesOrderTable />
      </div>
    </div>
  )
}

export default SalesOrder
