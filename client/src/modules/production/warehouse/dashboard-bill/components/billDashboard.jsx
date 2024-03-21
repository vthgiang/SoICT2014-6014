import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import BillDashboardHeader from './billDashboardHeader'
import GoodIssueReceiptByGood from './goodIssueReceiptByGood'
import GoodIssueReceiptByTime from './goodIssueReceiptByTime'
import TopIssueReceipt from './topIssueReceipt'
import TopIssueReceiptLeast from './topIssueReceiptLeast'
import SupplierDashboard from './supplierDashboard'
import CustomerDashboard from './customerDashboard'
import SupplierNumberDashboard from './supplierNumberDashboard'
import CustomerNumberDashboard from './customerNumberDashboard'
import { StockActions } from '../../stock-management/redux/actions'
import { CrmCustomerActions } from '../../../../crm/customer/redux/actions'
import { BillActions } from '../../bill-management/redux/actions'

function DashBoardBills(props) {
  let today = new Date(),
    month = today.getMonth() + 1,
    year = today.getFullYear()
  let endMonth
  if (month < 10) {
    endMonth = '0' + month
  } else {
    endMonth = month
  }

  const INFO_SEARCH = {
    startMonth: year + '-01',
    endMonth: [year, endMonth].join('-'),
    type: '1',
    numberTop: '1',
    numberTopAtLeast: '1'
  }
  const [state, setState] = useState({
    stock: null,
    currentRole: localStorage.getItem('currentRole'),
    startMonth: INFO_SEARCH.startMonth,
    endMonth: INFO_SEARCH.endMonth
  })

  useEffect(() => {
    props.getAllStocks({ managementLocation: state.currentRole })
    props.getCustomers()
    props.getNumberBills({
      managementLocation: state.currentRole,
      startMonth: state.startMonth,
      endMonth: state.endMonth,
      chart: undefined
    })
  }, [])

  const { bills } = props
  const { numberBills } = bills
  console.log(numberBills)
  return (
    <div className='qlcv'>
      <BillDashboardHeader />
      <div className='row'>
        <div className=' col-lg-12 col-md-12 col-md-sm-12 col-xs-12'>
          <GoodIssueReceiptByGood />
        </div>
        <div className=' col-lg-12 col-md-12 col-md-sm-12 col-xs-12'>
          <GoodIssueReceiptByTime />
        </div>

        <div className=' col-lg-6 col-md-6 col-md-sm-12 col-xs-12'>
          <TopIssueReceipt dataChart={numberBills ? numberBills.dataTopIssueReceipt : ''} />
        </div>
        <div className=' col-lg-6 col-md-6 col-md-sm-12 col-xs-12'>
          <TopIssueReceiptLeast dataChart={numberBills ? numberBills.dataTopAtLeastIssueReceipt : ''} />
        </div>

        <div className=' col-lg-6 col-md-6 col-md-sm-12 col-xs-12'>
          <CustomerDashboard dataChart={numberBills ? numberBills.dataBillsIssuedForCustomerByTime : ''} />
        </div>
        <div className=' col-lg-6 col-md-6 col-md-sm-12 col-xs-12'>
          <SupplierDashboard dataChart={numberBills ? numberBills.dataBillsReceiptedFromSupplierByTime : ''} />
        </div>
        <div className=' col-lg-6 col-md-6 col-md-sm-12 col-xs-12'>
          <CustomerNumberDashboard dataChart={numberBills ? numberBills.dataBillsIssuedForCustomerByTime : ''} />
        </div>
        <div className=' col-lg-6 col-md-6 col-md-sm-12 col-xs-12'>
          <SupplierNumberDashboard dataChart={numberBills ? numberBills.dataBillsReceiptedFromSupplierByTime : ''} />
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {
  getAllStocks: StockActions.getAllStocks,
  getCustomers: CrmCustomerActions.getCustomers,
  getNumberBills: BillActions.getNumberBills
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(DashBoardBills))
