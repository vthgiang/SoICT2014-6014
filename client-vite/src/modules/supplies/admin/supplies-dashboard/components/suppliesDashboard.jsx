import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import isEqual from 'lodash/isEqual'
import { SuppliesActions } from '../../supplies/redux/actions'
import { SuppliesDashboardActions } from '../redux/actions'
import Swal from 'sweetalert2'
import { DatePicker, SelectBox, SelectMulti } from '../../../../../common-components'
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration'
import BoughtPieChart from './pie-chart/BoughtPieChart'
import ExistPieChart from './pie-chart/ExistPieChart'
import OrganizationUnitSupplyChart from './bar-chart/OrganizationUnitSupplyChart'
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions'
import SupplyOrganizationUnitChart from './bar-chart/SuppliesOrganizationUnitChart'
import BoughtBarChart from './bar-chart/BoughtBarChart'
import ExistBarChart from './bar-chart/ExistBarChart'

const formatTime = (value) => {
  return value.length == 4 ? value : value.slice(3, 7) + '-' + new Number(value.slice(0, 2))
}

function SuppliesDashboard(props) {
  const { translate, department } = props
  let { pieChart, barChart, numberData, suppliesPriceForOrganization } = props.suppliesDashboardReducer
  let { listSupplies, totalList } = props.suppliesReducer
  let childOrganizationalUnit = department?.list?.map((x) => ({ id: x._id, name: x.name }))

  let d = new Date(),
    month = d.getMonth() + 1,
    year = d.getFullYear()
  let startMonth, endMonth, startYear

  if (month > 3) {
    startMonth = month - 3
    startYear = year
  } else {
    startMonth = month - 3 + 12
    startYear = year - 1
  }
  if (startMonth < 10) startMonth = '0' + startMonth
  if (month < 10) {
    endMonth = '0' + month
  } else {
    endMonth = month
  }

  let INFO_SEARCH = {
    typeOfChart: ['Bar'],
    purchaseDateAfter: [startYear, startMonth].join('-'),
    purchaseDateBefore: [year, endMonth].join('-')
  }

  const getMonth = (month) => {
    if (month < 10) {
      return (month = '0' + month)
    }
    return month
  }

  const defaultConfig = { limit: 10 }
  const dashboardSuppliesId = 'dashboard_supplies_by_type'
  const dashboardSupplies = getTableConfiguration(dashboardSuppliesId, defaultConfig).limit

  const [state, setState] = useState({
    suppliesData: [],
    countInvoice: [],
    countAllocation: [],
    valueInvoice: [],

    purchaseDateAfter: new Date(INFO_SEARCH.purchaseDateAfter),
    purchaseDateBefore: new Date(INFO_SEARCH.purchaseDateBefore),
    defaultStartMonth: [startMonth, startYear].join('-'),
    defaultEndMonth: [endMonth, year].join('-'),

    page: 1,
    limit: dashboardSupplies,
    listSupplies: []
  })

  const searchOrganization = useRef({
    organizationName: childOrganizationalUnit[0]?.name,
    supplyIds: listSupplies.map((item) => {
      return item.id
    }),
    organizationId: childOrganizationalUnit[0]?.id,
    startTime: new Date(formatTime([startMonth, startYear].join('-'))),
    endTime: new Date(formatTime([endMonth, year].join('-')))
  })

  useEffect(() => {
    props.getSuppliesDashboard({ endTime: state.purchaseDateBefore, startTime: state.purchaseDateAfter })
    props.searchSupplies({ getAll: 'true' })
    props.getDepartment()
    props.getSuppliesOrganizationDashboard({
      time: {
        startTime: searchOrganization.current.startTime,
        endTime: searchOrganization.current.endTime
      },
      supplyIds: searchOrganization.current.supplyIds,
      organizationId: searchOrganization.current.organizationId
    })
  }, [])

  const handleChangeDateAfter = async (value) => {
    let month = value.length == 4 ? value : value.slice(3, 7) + '-' + new Number(value.slice(0, 2))
    INFO_SEARCH.purchaseDateAfter = month
  }

  const handleChangeDateBefore = async (value) => {
    let month = value.length == 4 ? value : value.slice(3, 7) + '-' + new Number(value.slice(0, 2))
    INFO_SEARCH.purchaseDateBefore = month
  }

  const handleChangeDateOrganizationAfter = (value) => {
    let month = value.length == 4 ? value : value.slice(3, 7) + '-' + new Number(value.slice(0, 2))
    searchOrganization.current = {
      ...searchOrganization.current,
      startTime: new Date(month)
    }
    console.log('DEBUG: organ date 1:', searchOrganization.current)
  }

  const handleChangeDateOrganizationBefore = (value) => {
    let month = value.length == 4 ? value : value.slice(3, 7) + '-' + new Number(value.slice(0, 2))
    searchOrganization.current = {
      ...searchOrganization.current,
      endTime: new Date(month)
    }
    console.log('DEBUG: organ date 2:', searchOrganization.current)
  }

  const handleSearchData = async () => {
    let purchaseDateAfter = new Date(INFO_SEARCH.purchaseDateAfter)
    let purchaseDateBefore = new Date(INFO_SEARCH.purchaseDateBefore)

    if (purchaseDateAfter.getTime() > purchaseDateBefore.getTime()) {
      const { translate } = props
      await Swal.fire({
        title: translate('kpi.evaluation.employee_evaluation.wrong_time'),
        type: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
      })
    } else {
      props.getSuppliesDashboard({ endTime: purchaseDateBefore, startTime: purchaseDateAfter })
      setState({
        ...state,
        purchaseDateBefore: new Date(purchaseDateBefore),
        purchaseDateAfter: new Date(purchaseDateAfter)
      })
      console.log('time: ', {
        startTime: purchaseDateAfter,
        endTime: purchaseDateBefore
      })
    }
  }

  let { purchaseDateAfter, purchaseDateBefore } = INFO_SEARCH
  console.log('DEBUG: pieChart: ', pieChart)
  console.log('DEBUG: bar-chart: ', barChart)
  console.log('DEBUG: numberData: ', numberData)
  console.log('DEBUG: listSupplies: ', listSupplies)
  console.log('DEBUG: childOrganizationalUnit: ', childOrganizationalUnit)

  let format = year == 'true' ? 'year' : 'month-year'
  let startValue = year == 'true' ? purchaseDateAfter.slice(0, 4) : purchaseDateAfter.slice(5, 7) + ' - ' + purchaseDateAfter.slice(0, 4)
  let endValue = year == 'true' ? purchaseDateBefore.slice(0, 4) : purchaseDateBefore.slice(5, 7) + ' - ' + purchaseDateBefore.slice(0, 4)

  const handleSelectSupplies = (value) => {
    searchOrganization.current = {
      ...searchOrganization.current,
      supplyIds: value.toString()
    }
  }

  const handleSelectOrganization = (value) => {
    console.log('DEBUG: organization ', value.toString())
    const organizationNames = childOrganizationalUnit.filter((item) => {
      return item.id == value.toString()
    })
    searchOrganization.current = {
      ...searchOrganization.current,
      organizationId: value.toString(),
      organizationName: organizationNames[0].name
    }
  }

  const handleSearchOrganData = async () => {
    const { organizationId, supplyIds, startTime, endTime } = searchOrganization.current
    const time = {
      startTime,
      endTime
    }
    if (startTime.getTime() > endTime.getTime()) {
      const { translate } = props
      await Swal.fire({
        title: translate('kpi.evaluation.employee_evaluation.wrong_time'),
        type: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
      })
    } else {
      // CAL API: with organizationId, supplyIds, time
      props.getSuppliesOrganizationDashboard({ supplyIds, organizationId, time })
      console.log('DEBUG: suppliesPriceForOrganization', suppliesPriceForOrganization)
    }
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  })
  return (
    <React.Fragment>
      <div className='qlcv'>
        <div className='form-inline'>
          <div className='row'>
            <div className='form-group'>
              <label style={{ width: 'auto', marginLeft: 12, marginRight: 10 }}>{translate('task.task_management.from')}</label>
              <DatePicker
                id={`purchase_after${year}`}
                dateFormat={format}
                value={startValue}
                onChange={handleChangeDateAfter}
                disabled={false}
              />
            </div>
            <div className='form-group'>
              <label style={{ width: 'auto', marginLeft: 12, marginRight: 10 }}>{translate('task.task_management.to')}</label>
              <DatePicker
                id={`purchase_before${year}`}
                dateFormat={format}
                value={endValue}
                onChange={handleChangeDateBefore}
                disabled={false}
              />
            </div>
            <button className='btn btn-success' style={{ marginLeft: 12, marginRight: 10 }} onClick={handleSearchData}>
              {translate('task.task_management.search')}
            </button>
          </div>
        </div>
        <div className='row' style={{ marginTop: 10 }}>
          <div className='col-md-6 col-sm-12 col-xs-12'>
            <div className='info-box'>
              <span className='info-box-icon bg-green'>
                <i className='fa fa-check'></i>
              </span>
              <div className='info-box-content'>
                <span className='info-box-text'>{`Tổng số loại vật tư: ${numberData.supplies.totalSupplies}`}</span>
                <span className='info-box-text'>{`Tổng giá trị tham khảo: ${formatter.format(numberData.supplies.suppliesPrice)}`}</span>
                <a href='/manage-info-asset?status=ready_to_use'>
                  {translate('asset.general_information.view_more')}
                  <i className='fa fa-arrow-circle-right'></i>
                </a>
              </div>
            </div>
          </div>

          <div className='col-md-6 col-sm-12 col-xs-12'>
            <div className='info-box'>
              <span className='info-box-icon bg-aqua'>
                <i className='fa fa-play'></i>
              </span>
              <div className='info-box-content' style={{ paddingBottom: 0 }}>
                <span className='info-box-text'>{`Tổng số hóa đơn mua: ${numberData.purchaseInvoice.totalPurchaseInvoice}`}</span>
                <span className='info-box-text'>{`Tổng giá trị tất cả hóa đơn: ${formatter.format(numberData.purchaseInvoice.purchaseInvoicesPrice)}`}</span>
                <a href='/manage-info-asset?status=in_use'>
                  {translate('asset.general_information.view_more')}
                  <i className='fa fa-arrow-circle-right'></i>
                </a>
              </div>
            </div>
          </div>

          <div className='col-md-6 col-sm-12 col-xs-12'>
            <div className='info-box'>
              <span className='info-box-icon bg-yellow'>
                <i className='fa fa-warning'></i>
              </span>
              <div className='info-box-content' style={{ paddingBottom: 0 }}>
                <span className='info-box-text'>{`Tổng số lượng vật tư đã cấp phát: ${numberData.allocationHistory.allocationHistoryTotal}`}</span>
                <span className='info-box-text'>{`Tổng giá trị vật tư đã cấp phát: ${formatter.format(numberData.allocationHistory.allocationHistoryPrice)}`}</span>
                <a href='/manage-info-asset?status=broken'>
                  {translate('asset.general_information.view_more')}
                  <i className='fa  fa-arrow-circle-o-right'></i>
                </a>
              </div>
            </div>
          </div>

          <div className='col-md-6 col-sm-12 col-xs-12'>
            <div className='info-box'>
              <span className='info-box-icon bg-red'>
                <i className='fa fa-calendar-times-o'></i>
              </span>
              <div className='info-box-content' style={{ paddingBottom: 0 }}>
                <span className='info-box-text'>{`Tổng số yêu cầu vật tư chưa xử lý: ${numberData.purchaseRequest.waitingForApprovalTotal}`}</span>
                <span className='info-box-text'>{`Tổng số yêu cầu vật tư đã chấp nhận: ${numberData.purchaseRequest.approvedTotal}`}</span>
                <span className='info-box-text'>{`Tổng số yêu cầu vật tư     đã từ chối: ${numberData.purchaseRequest.disapprovedTotal}`}</span>
                <a href='/manage-info-asset?status=disposed'>
                  {translate('asset.general_information.view_more')}
                  <i className='fa  fa-arrow-circle-o-right'></i>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className='row' style={{ marginTop: 10 }}>
          {/* Biểu đồ thống kê giá trị vật tư đã mua từ xxx - xxx */}
          <div className='col-xs-12'>
            <div className='box box-solid'>
              <div className='box-header'>
                <div className='box-title'>{`Thống kê giá trị các vật tư đã mua từ 
                                ${[state.purchaseDateAfter.getFullYear(), getMonth(state.purchaseDateAfter.getMonth() + 1)].join('-')} đến 
                                ${[state.purchaseDateBefore.getFullYear(), getMonth(state.purchaseDateBefore.getMonth() + 1)].join('-')}`}</div>
              </div>
              <div className='box-body qlcv'>
                <BoughtBarChart boughtSupplies={pieChart.boughtSupplies} />
              </div>
            </div>
          </div>

          {/* Biểu đồ thống kê giá trị vật tư hiện có từ xxx - xxx */}
          <div className='col-xs-12'>
            <div className='box box-solid'>
              <div className='box-header'>
                <div className='box-title'>{`Thống kê giá trị các vật tư hiện có từ 
                                ${[state.purchaseDateAfter.getFullYear(), getMonth(state.purchaseDateAfter.getMonth() + 1)].join('-')} đến 
                                ${[state.purchaseDateBefore.getFullYear(), getMonth(state.purchaseDateBefore.getMonth() + 1)].join('-')}`}</div>
              </div>
              <div className='box-body qlcv'>
                <ExistBarChart existSupplies={pieChart.existSupplies} />
              </div>
            </div>
          </div>
        </div>

        {/* Biểu đồ thống kê số lượng và giá trị vật tư đã cấp phát từ xxx - xxx */}
        <div className='row box box-solid' style={{ marginTop: 10, marginLeft: 1 }}>
          <div className='box-header'>
            <div className='box-title'>{`Thống kê số lượng và giá trị các vật tư đã cấp phát cho các đơn vị từ 
                        ${[state.purchaseDateAfter.getFullYear(), getMonth(state.purchaseDateAfter.getMonth() + 1)].join('-')} đến 
                        ${[state.purchaseDateBefore.getFullYear(), getMonth(state.purchaseDateBefore.getMonth() + 1)].join('-')}`}</div>
          </div>
          <div className='col-md-12'>
            {barChart.organizationUnitsPriceSupply.length > 0 && (
              <OrganizationUnitSupplyChart organizationUnitsPriceSupply={barChart.organizationUnitsPriceSupply} />
            )}
          </div>
        </div>

        <div className='form-inline' style={{ marginTop: 10 }}>
          <div className='form-group'>
            <label style={{ width: 'auto' }}>Vật tư</label>
            <SelectMulti
              id='multiSelectSupplies'
              items={listSupplies.map((item) => {
                return { value: item.id, text: item.suppliesName }
              })}
              options={{ nonSelectedText: 'Chọn vật tư', allSelectedText: 'Chọn tất cả vật tư' }}
              onChange={handleSelectSupplies}
            ></SelectMulti>
          </div>
          <div className='form-group'>
            <label style={{ width: 'auto' }}>Đơn vị</label>
            <SelectBox
              id={`select-approver`}
              className='form-control select2'
              style={{ width: '100%' }}
              items={childOrganizationalUnit.map((item) => {
                return { value: item.id, text: item.name }
              })}
              onChange={handleSelectOrganization}
              multiple={false}
            />
          </div>
          <div className='form-group'>
            <label style={{ width: 'auto', marginLeft: 12, marginRight: 10 }}>{translate('task.task_management.from')}</label>
            <DatePicker
              id={`organ_after${year}`}
              dateFormat={format}
              value={startValue}
              onChange={handleChangeDateOrganizationAfter}
              disabled={false}
            />
          </div>
          <div className='form-group'>
            <label style={{ width: 'auto', marginLeft: 12, marginRight: 10 }}>{translate('task.task_management.to')}</label>
            <DatePicker
              id={`organ_before${year}`}
              dateFormat={format}
              value={endValue}
              onChange={handleChangeDateOrganizationBefore}
              disabled={false}
            />
          </div>
          <button className='btn btn-success' style={{ marginLeft: 12, marginRight: 10 }} onClick={handleSearchOrganData}>
            {translate('task.task_management.search')}
          </button>
        </div>
        <div className='row box box-primary' style={{ marginTop: 10, marginLeft: 1 }}>
          {searchOrganization.current.organizationName && (
            <div className='box-header with-border'>
              <div className='box-title'>{`Thống kê số lượng và giá trị các vật tư đã cấp phát cho 
                             ${searchOrganization.current.organizationName} từ 
                             ${[searchOrganization.current.startTime.getFullYear(), getMonth(searchOrganization.current.startTime.getMonth() + 1)].join('-')} đến 
                             ${[searchOrganization.current.endTime.getFullYear(), getMonth(searchOrganization.current.endTime.getMonth() + 1)].join('-')}`}</div>
            </div>
          )}
          <div className='box-body qlcv'>
            {suppliesPriceForOrganization.length > 0 && (
              <SupplyOrganizationUnitChart supplyOrganizationUnitPrice={suppliesPriceForOrganization} />
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

function mapState(state) {
  const { suppliesReducer, suppliesDashboardReducer, department } = state
  return { suppliesReducer, suppliesDashboardReducer, department }
}

const mapDispatchToProps = {
  searchSupplies: SuppliesActions.searchSupplies,
  getSuppliesDashboard: SuppliesDashboardActions.getSuppliesDashboard,
  getDepartment: DepartmentActions.get,
  getSuppliesOrganizationDashboard: SuppliesDashboardActions.getSuppliesOrganizationDashboard
}

const dashboardSuppliesConnect = connect(mapState, mapDispatchToProps)(withTranslate(SuppliesDashboard))
export { dashboardSuppliesConnect as SuppliesDashboard }
