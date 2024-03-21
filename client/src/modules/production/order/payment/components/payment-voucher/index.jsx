import React, { Component } from 'react'
import PaymentVoucherManagementTable from './paymentVoucherManagementTable'

function PaymentVoucher() {
  return (
    <div className='box' style={{ minHeight: '450px' }}>
      <div className='box-body'>
        <PaymentVoucherManagementTable />
      </div>
    </div>
  )
}

export default PaymentVoucher
