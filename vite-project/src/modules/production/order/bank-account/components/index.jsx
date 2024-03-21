import React, { Component } from 'react'
import BankAccountManagementTable from './bankAccountManagementTable'

function BankAccount(props) {
  return (
    <div className='box' style={{ minHeight: '450px' }}>
      <div className='box-body'>
        <BankAccountManagementTable />
      </div>
    </div>
  )
}

export default BankAccount
