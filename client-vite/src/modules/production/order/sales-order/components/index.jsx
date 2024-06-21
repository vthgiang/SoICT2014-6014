import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import SalesOrderTable from './salesOrderTable'
import PurchaseOrderTable from '../../purchase-order/components/purchaseOrderTable'
import QuoteManageTable from '../../quote/components/quoteManageTable'
import SLAMangementTable from '../../service-level-agreement/components/slaManagementTable'
function SalesOrder(props) {
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
          <a href='#quote' data-toggle='tab' onClick={() => handleChangeType(1)}>
            {'Báo giá'}
          </a>
        </li>
        <li>
          <a href='#sales-order' data-toggle='tab' onClick={() => handleChangeType(2)}>
            {'Đơn bán'}
          </a>
        </li>
        <li>
          <a href='#purchase-order' data-toggle='tab' onClick={() => handleChangeType(3)}>
            {'Đơn mua'}
          </a>
        </li>
        <li>
          <a href='#sla' data-toggle='tab' onClick={() => handleChangeType(4)}>
            {'Cam kết chất lượng'}
          </a>
        </li>
      </ul>
      {/* Phiếu thu */}
      {type === 1 && <QuoteManageTable />}

      {/* Phiếu chi */}
      {type === 2 && <SalesOrderTable />}
      {type===3 && <PurchaseOrderTable /> }
      {type===4 && <SLAMangementTable />}
    </div>
  )
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(SalesOrder))
