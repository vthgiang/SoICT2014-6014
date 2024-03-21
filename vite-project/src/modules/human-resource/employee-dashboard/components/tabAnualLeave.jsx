import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { LazyLoadComponent } from '../../../../common-components'

import { TrendOfOvertime, AnnualLeaveTrendsChart, AnnualLeaveChartAndTable } from './combinedContent'

const TabAnualLeave = (props) => {
  const { childOrganizationalUnit, defaultUnit, organizationalUnits, idUnits, search_data_props, employeeDashboardData } = props

  return (
    <React.Fragment>
      <LazyLoadComponent>
        <AnnualLeaveTrendsChart
          organizationalUnits={organizationalUnits}
          defaultUnit={defaultUnit}
          childOrganizationalUnit={childOrganizationalUnit}
          idUnits={idUnits.map((x) => x.id)}
          unitName={idUnits.map((x) => x.name)}
          nameData1='Số lượt nghỉ'
          nameData2='Số giờ nghỉ phép'
          nameChart={'Thống kê nghỉ phép'}
          search_data_props={search_data_props}
        />
      </LazyLoadComponent>
      <LazyLoadComponent>
        <AnnualLeaveChartAndTable
          childOrganizationalUnit={childOrganizationalUnit}
          defaultUnit={defaultUnit}
          search_data_props={search_data_props}
          organizationalUnits={organizationalUnits}
          chartData={{
            annualLeaveChartAndTableData: employeeDashboardData.annualLeaveChartAndTableData,
            beforeAndAfterOneWeeks: employeeDashboardData.beforeAndAfterOneWeeks,
            isLoading: employeeDashboardData.isLoading
          }}
        />
      </LazyLoadComponent>
      <LazyLoadComponent>
        <TrendOfOvertime
          defaultUnit={defaultUnit}
          childOrganizationalUnit={childOrganizationalUnit?.filter((item) => organizationalUnits?.includes(item?.id))}
          idUnits={idUnits.map((x) => x.id)}
          unitName={idUnits.map((x) => x.name)}
          organizationalUnits={organizationalUnits}
          nameData1='Số giờ tăng ca'
          nameChart={'Xu hướng tăng ca'}
          search_data_props={search_data_props}
        />
      </LazyLoadComponent>
    </React.Fragment>
  )
}

function mapState(state) {
  const { employeeDashboardData } = state
  return { employeeDashboardData }
}

const tabAnualLeave = connect(mapState, null)(withTranslate(TabAnualLeave))
export { tabAnualLeave as TabAnualLeave }
