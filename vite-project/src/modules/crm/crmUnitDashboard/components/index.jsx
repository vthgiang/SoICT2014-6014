import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import c3 from 'c3'
import 'c3/c3.css'
import C3Chart from 'react-c3js'
import 'c3/c3.css'
import { CrmEvaluationActions } from '../../evaluation/redux/action'
import { useEffect } from 'react'
import { CrmStatusActions } from '../../status/redux/actions'
import { CrmGroupActions } from '../../group/redux/actions'
import { CrmUnitActions } from '../../crmUnitConfiguration/redux/actions'

/**
 * Dashboard phần hoạt động đơn vị quản lý khách hàng
 */
function CrmDashBoardUnit(props) {
  const { user, crm, auth } = props
  const { evaluations, status, groups } = crm
  let customerCareInfoByUnit
  if (evaluations && evaluations.customerCareInfoByUnit) customerCareInfoByUnit = evaluations.customerCareInfoByUnit
  useEffect(() => {
    props.getCustomerCareInfoByUnit()
    props.getCrmUnits()
  }, [])

  // tạo dữ liệu cho các biểu đồ

  let customerDataByGroup = []
  let customerDataByStatus = []
  let x = ['x']
  let customerRetentionRateData = ['Tỉ lệ khách hàng quay trở lại (%)']
  let numberOfNewCustomersData = ['Số khách hàng mới (người)']

  if (customerCareInfoByUnit) {
    customerDataByGroup = customerCareInfoByUnit.customerDataByGroup
    customerDataByStatus = customerCareInfoByUnit.customerDataByStatus

    x = x.concat(customerCareInfoByUnit.x.reverse())
    customerRetentionRateData = customerRetentionRateData.concat(customerCareInfoByUnit.customerRetentionRateData.reverse())
    numberOfNewCustomersData = numberOfNewCustomersData.concat(customerCareInfoByUnit.numberOfNewCustomersData.reverse())
  }
  const customerByStatusGraph = {
    columns: customerDataByStatus,
    type: 'pie'
  }
  const customerByGroupGraph = {
    columns: customerDataByGroup,
    type: 'pie'
  }
  const data = {
    x: 'x',
    xFormat: '%m/%Y',
    columns: [x, numberOfNewCustomersData, customerRetentionRateData]
  }
  const axis = {
    x: {
      type: 'timeseries',
      tick: {
        format: '%m/%Y'
      }
    }
  }
  // lấy tháng hiện tại
  const now = new Date()
  const month = now.getMonth() + 1
  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-3 col-sm-6 col-xs-12'>
          <div className='info-box'>
            <span className='info-box-icon bg-aqua'>
              <i class='fa fa-users' />
            </span>
            <div className='info-box-content'>
              <span className='info-box-text'>{'Số khách hàng quản lý'}</span>
              <span className='info-box-number'>{customerCareInfoByUnit ? customerCareInfoByUnit.totalManagedCustomer : 0}</span>
            </div>
          </div>
        </div>
        <div className='col-md-3 col-sm-6 col-xs-12'>
          <div className='info-box'>
            <span className='info-box-icon bg-yellow'>
              <i className='fa fa-handshake-o' />
            </span>
            <div className='info-box-content'>
              <span className='info-box-text'>{`Tổng sô hoạt động tháng ${month}`}</span>
              <span className='info-box-number'>{customerCareInfoByUnit ? customerCareInfoByUnit.totalCareActions : `0`}</span>
            </div>
          </div>
        </div>

        <div className='clearfix visible-sm-block' />
        <div className='col-md-3 col-sm-6 col-xs-12'>
          <div className='info-box'>
            <span className='info-box-icon bg-green'>
              <i className='fa fa-check-circle-o' />
            </span>
            <div className='info-box-content'>
              <span className='info-box-text'>{'Số hoạt động đã hoàn thành'}</span>
              <span className='info-box-number'>{customerCareInfoByUnit ? customerCareInfoByUnit.numberOfCompletionCareAction : `0`}</span>
            </div>
          </div>
        </div>
        <div className='col-md-3 col-sm-6 col-xs-12'>
          <div className='info-box'>
            <span className='info-box-icon bg-red'>
              <i className='fa fa-exclamation' />
            </span>
            <div className='info-box-content'>
              <span className='info-box-text'>{'Số hoạt động quá hạn'}</span>
              <span className='info-box-number'>{customerCareInfoByUnit ? customerCareInfoByUnit.numberOfOverdueCareAction : `0`}</span>
            </div>
          </div>
        </div>
      </div>
      <div className='row' style={{ marginTop: '60px', textAlign: 'center' }}>
        <div className='col-xs-6 col-sm-6 col-md-6 col-lg-6'>
          <div className='box box-primary'>
            <div className='box-header with-border'>
              <div className='box-title'>
                <label>
                  {' '}
                  <span>Biểu đồ khách hàng theo nhóm </span>
                </label>
              </div>
            </div>
            <div className='box-body qlcv'>
              <C3Chart data={customerByGroupGraph} />
            </div>
          </div>
        </div>
        <div className='col-xs-6 col-sm-6 col-md-6 col-lg-6'>
          <div className='box box-primary'>
            <div className='box-header with-border'>
              <div className='box-title'>
                <label>
                  {' '}
                  <span>Biểu đồ khách hàng theo trạng thái</span>
                </label>
              </div>
            </div>
            <div className='box-body qlcv'>
              <C3Chart data={customerByStatusGraph} />
            </div>
          </div>
        </div>
      </div>
      <div className='row' style={{ marginTop: '10px', textAlign: 'center' }}>
        <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
          <div className='box box-primary'>
            <div className='box-header with-border'>
              <div className='box-title'>
                <label>
                  {' '}
                  <span>Biểu đồ đánh giá hoạt động CSKH của đơn vị</span>
                </label>
              </div>
            </div>
            <div className='box-body qlcv'>
              <C3Chart data={data} axis={axis} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function mapStateToProps(state) {
  const { crm, user, auth } = state
  return { crm, user, auth }
}

const mapDispatchToProps = {
  getCustomerCareInfoByUnit: CrmEvaluationActions.getCustomerCareInfoByUnit,
  getStatus: CrmStatusActions.getStatus,
  getGroups: CrmGroupActions.getGroups,
  getCrmUnits: CrmUnitActions.getCrmUnits
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CrmDashBoardUnit))
