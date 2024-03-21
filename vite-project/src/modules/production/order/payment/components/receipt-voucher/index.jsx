import React, { Component } from 'react'
import ReceiptVoucherManagementTable from './receiptVoucherManagementTable'

function ReceiptVoucher() {
  return (
    <div className='box' style={{ minHeight: '450px' }}>
      <div className='box-body'>
        <ReceiptVoucherManagementTable />
      </div>
    </div>
  )
}

export default ReceiptVoucher
