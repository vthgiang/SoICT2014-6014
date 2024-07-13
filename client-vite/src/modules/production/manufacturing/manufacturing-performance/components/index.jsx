import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { connect, useDispatch, useSelector } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { Responsive, WidthProvider } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import { manufacturingMetricActions } from '../redux/actions'
import DashboardHeader from './common/header'
import DashboardSidebar from './common/sidebar'
import KpiCreateForm from './create-new-kpi/kpiCreateForm'
import { widgetList } from './widget'
import './index.css'

const ResponsiveGridLayout = WidthProvider(Responsive)

const ManufacturingPerformance = (props) => {
  const { manufacturingMetric } = props

  const [editMode, setEditMode] = useState(false)
  const [period, setPeriod] = useState('day')
  const [newAddedKpis, setNewAddedKpis] = useState([])
  const [layouts, setLayouts] = useState([])
  let history = useHistory()

  const gridCols = editMode ? { lg: 12, md: 12, sm: 12, xs: 8, xxs: 4 } : { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }
  
  const displayingKpis = manufacturingMetric.listKpis.filter((kpi) => kpi.dataGrid && Object.keys(kpi.dataGrid).length !== 0)
  const monitoredKpis = displayingKpis.concat(newAddedKpis)

  const handleChangePeriod = (value) => {
    setPeriod(value)
  }

  // const handleDeleteMonitoredKpi = (id) => {
  //   setMonitoredKpis(monitoredKpis.filter((kpi) => kpi._id !== id))
  // }

  const handleDisplayKpi = (kpi) => {
    setNewAddedKpis([...newAddedKpis, kpi])
  }

  const handleRedirectToDetail = (metricId) => {
    localStorage.setItem('metricId', metricId)
    history.push({
      pathname: '/detail-analysis-manufacturing-performance',
      state: { metricId }
    })
  }

  const handleToggleSidebar = () => {
    setEditMode(!editMode)
  }

  const handleLayoutChange = (layout, _) => {
    setLayouts(layout)
  }

  const handleSave = () => {
    const nonMonitoredKpis = manufacturingMetric.listKpis.filter((kpi) => !kpi.dataGrid)
    const monitoredKpis2 = monitoredKpis.map((kpi) => {
      const layout = layouts.find((layout) => layout.i === kpi.dataGrid.i)
      return { 
        ...kpi, 
        dataGrid: layout? layout : kpi.dataGrid
      }
    })

    const newListKpis = [...nonMonitoredKpis, ...monitoredKpis2]

    props.editManufacturingKpis({ listKpis: newListKpis })

    setEditMode(false)
  }

  useEffect(() => {
    const currentRole = localStorage.getItem('currentRole')
    props.getAllManufacturingKpis({ currentRole, period })
        
  }, [period])

  useEffect(() => {
    const currentRole = localStorage.getItem('currentRole')

    props.getAllManufacturingKpis({ currentRole, period: 'day' })

    props.getAllReportElements({ currentRole })
  }, [])

  if (manufacturingMetric.listKpis === 0) {
    return <div className='text-center'>Đang xử lý...</div>
  }

  return (
    <div className='performance-dashboard' style={{ minHeight: '450px' }}>
      <DashboardHeader onToggleSidebar={handleToggleSidebar} onChangePeriod={handleChangePeriod} onSave={handleSave} editMode={editMode} />
      <KpiCreateForm />
      <div className='chart-container'>
        {monitoredKpis.length == 0 ? (
          <div className='no-data-pannel'>Không có dữ liệu</div>
        ) : (
          <div className={`chart-grid ${editMode ? 'editMode' : ''}`}>
            <ResponsiveGridLayout
              className='layout'
              compactType='vertical'
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={gridCols}
              margin={[10, 10]}
              resizeHandles={['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne']}
              rowHeight={editMode ? 11.5 : 15}
              useCSSTransforms={true}
              isDraggable={editMode}
              isResizable={editMode}
              draggableCancel='.cancelSelectorName'
              onLayoutChange={handleLayoutChange}
            >
              {monitoredKpis.map((metric) => {
                const Widget = widgetList[metric.widget]
                return (
                  <div key={metric.dataGrid['i']} className={`item ${editMode ? 'resizable' : ''}`} data-grid={metric.dataGrid}>
                    <Widget
                      key={metric.dataGrid['i']}
                      title={metric.displayName ? metric.displayName : metric.name}
                      values={metric.values}
                      unit={metric.unit}
                      target={metric.target}
                      trend={metric.trend}
                      customize={metric.customize}
                      labels={metric.labels ? metric.labels : []}
                      editMode={editMode}
                      onDelete={() => handleDeleteMonitoredKpi(metric._id)}
                      onRedirectToDetail={() => handleRedirectToDetail(metric._id)}
                    />
                  </div>
                )
              })}
            </ResponsiveGridLayout>
          </div>
        )}
        {editMode && <DashboardSidebar onAddMonitoredKpi={handleDisplayKpi} listKpis={manufacturingMetric.listKpis} />}
      </div>
    </div>
  )
}

function mapStateToProps(state) {
  const manufacturingMetric = state.manufacturingMetric
  return { manufacturingMetric }
}

const mapDispatchToProps = {
  getAllManufacturingKpis: manufacturingMetricActions.getAllManufacturingKpis,
  editManufacturingKpis: manufacturingMetricActions.editManufacturingKpis,
  getAllReportElements: manufacturingMetricActions.getAllReportElements
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManufacturingPerformance))
