import React from 'react'
import OrderTable from './orderTable'

export default function Order() {
  return (
    <div className='box' style={{ minHeight: '450px' }}>
      <div className='box-body'>
        <OrderTable />
      </div>
    </div>
  )
}
