import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import PaymentVoucher from './payment-voucher/index'
import ReceiptVoucher from './receipt-voucher/index'
import Tax from './tax/index'
import Profit from './profit/index'   

function Payment(props) {
  const [state, setState] = useState({
    type: 1
  })

  const handleChangeType = async (type) => {
    setState({
      ...state,
      type
    })
  }

  const { type } = state
  return (
    <div className='nav-tabs-custom'>
      <ul className='nav nav-tabs'>
        <li className='active'>
          <a href='#payment-in' data-toggle='tab' onClick={() => handleChangeType(1)}>
            {'Phiếu thu'}
          </a>
        </li>
        <li>
          <a href='#payment-out' data-toggle='tab' onClick={() => handleChangeType(2)}>
            {'Phiếu chi'}
          </a>
        </li>
        <li>
          <a href='#taxs' data-toggle='tab' onClick={() => handleChangeType(3)}>
            {'Thuế'}
          </a>
        </li>
        <li>
          <a href='#profit' data-toggle='tab' onClick={() => handleChangeType(4)}>
            {'Lợi nhuận'}
          </a>
        </li>
      </ul>
      {/* Phiếu thu */}
      {type === 1 && <ReceiptVoucher />}

      {/* Phiếu chi */}
      {type === 2 && <PaymentVoucher />}
      {type===3 && <Tax /> }
      {type===4 & <Profit />}
    </div>
  )
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(Payment))
