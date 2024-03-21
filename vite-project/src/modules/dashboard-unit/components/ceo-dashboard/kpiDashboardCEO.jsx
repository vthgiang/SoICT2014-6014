import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { PreviewKpiUnit } from './previewKpiUnit'
import { ProgressKpiUnitChart } from './progressKpiUnit'

const CEOKpiDashboard = () => {
  const [month, setMonth] = useState(() => {
    const d = new Date()
    const month = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1
    return `${month}-${d.getFullYear()}`
  })

  const [saleData, setSaleData] = useState()

  const handleSelectMonth = (value) => {
    setMonth(value)
  }

  return (
    <React.Fragment>
      <div className='qlcv'>
        <PreviewKpiUnit />
        <br />
        <div className='box box-primary'>
          <div className='box-header with-border'>
            <div className='box-title'>Tiến độ thực hiện KPI phòng ban</div>
          </div>
          <ProgressKpiUnitChart />
        </div>
      </div>
    </React.Fragment>
  )
}

function mapState(state) {
  const { dashboardEvaluationEmployeeKpiSet, createKpiUnit } = state
  return { dashboardEvaluationEmployeeKpiSet, createKpiUnit }
}

const actions = {}

const connectedCEOKpiDashboard = connect(mapState, actions)(withTranslate(CEOKpiDashboard))
export { connectedCEOKpiDashboard as CEOKpiDashboard }
