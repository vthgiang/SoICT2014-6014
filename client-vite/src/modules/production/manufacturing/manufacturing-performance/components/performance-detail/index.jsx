import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { withTranslate } from 'react-redux-multilingual'
import { Responsive, WidthProvider } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import TrendingChart from './trendingChart'
import ReasonChart from './reasonChart'
import Notification from './notification'
import ImproveActionTable from './improveActionTable'
import ActionCreateForm from './actionCreateForm'

import '../index.css'
import { manufacturingMetricActions } from '../../redux/actions'
import FailureCreateForm from './failureCreateForm'
import ActionEditForm from './actionEditForm'

const ResponsiveGridLayout = WidthProvider(Responsive)

const PerformanceDetail = (props) => {
  const { manufacturingMetric } = props

  const layouts = [
    { i: '1', x: 0, y: 0, w: 5, h: 12, static: true },
    { i: '2', x: 5, y: 0, w: 4, h: 12, static: true },
    { i: '3', x: 9, y: 0, w: 3, h: 24, static: true },
    { i: '4', x: 0, y: 12, w: 9, h: 12, static: true }
  ]

  const metricId = localStorage.getItem('metricId')

  const handleKpiChange = (data) => {
    props.editManufacturingKpi(metricId, data)
  }

  const handleCurrentActionChange = (index) => {
    localStorage.setItem('currentActionIndex', index)
  }

  useEffect(() => {
    const currentRole = localStorage.getItem('currentRole')

    props.getManufacturingKpiById({ metricId, currentRole })
  }, [metricId])

  if (manufacturingMetric.isLoading || !manufacturingMetric.currentKpi) {
    return <div>loading...</div>
  }

  return (
    <>
      <ActionCreateForm onKpiChange={handleKpiChange} actions={manufacturingMetric.currentKpi.actions} />
      <FailureCreateForm failureCauses={manufacturingMetric.currentKpi.failureCauses} onKpiChange={handleKpiChange} />
      <ActionEditForm onKpiChange={handleKpiChange} />
      <div className='performance-dashboard' style={{ minHeight: '450px' }}>
        <ResponsiveGridLayout
          className='layout'
          compactType='horizontal'
          layouts={{ lg: layouts, md: layouts, sm: layouts, xs: layouts, xxs: layouts }}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          resizeHandles={['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne']}
          rowHeight={20}
        >
          <div className='item' key='1'>
            <TrendingChart
              values={manufacturingMetric.currentKpi.values}
              labels={manufacturingMetric.currentKpi.labels}
              target={manufacturingMetric.currentKpi.target}
              customize={manufacturingMetric.currentKpi.customize}
            />
          </div>
          <div className='item' key='2'>
            <ReasonChart failureCauses={manufacturingMetric.currentKpi.failureCauses} onKpiChange={handleKpiChange} />
          </div>
          <div className='item' key='3'>
            <Notification
              alerts={manufacturingMetric.currentKpi.alerts}
              thresholds={manufacturingMetric.currentKpi.thresholds}
              kpiUnit={manufacturingMetric.currentKpi.unit}
            />
          </div>
          <div className='item' key='4'>
            <ImproveActionTable
              actions={manufacturingMetric.currentKpi.actions}
              onCurrentActionChange={(index) => handleCurrentActionChange(index)}
            />
          </div>
        </ResponsiveGridLayout>
      </div>
    </>
  )
}

function mapStateToProps(state) {
  const { manufacturingMetric } = state
  return { manufacturingMetric }
}

const mapDispatchToProps = {
  getManufacturingKpiById: manufacturingMetricActions.getManufacturingKpiById,
  editManufacturingKpi: manufacturingMetricActions.editManufacturingKpi
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(PerformanceDetail))
