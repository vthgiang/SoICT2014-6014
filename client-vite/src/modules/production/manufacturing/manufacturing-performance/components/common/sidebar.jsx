import React, { useState } from 'react'
import { withTranslate } from 'react-redux-multilingual'
import { connect } from 'react-redux'
import { SelectBox } from '.././../../../../../common-components'
import ThemeSelector from './themeSelector'
import { widgetIcons, themes } from './config'
import styles from './index.module.css'

const DashboardSidebar = (props) => {
  const { translate, listKpis, onAddMonitoredKpi } = props
  const [kpi, setKpi] = useState({
    id: '1',
    displayName: '',
    widgetIcon: 1,
    theme: 1,
    showTarget: false,
    showTrend: false
  })

  const getMetricArr = () => {
    let metricArr = [
      {
        value: '1',
        text: translate('manufacturing.performance.choose_kpi')
      }
    ]

    listKpis.forEach((item) => {
      metricArr.push({
        value: item._id,
        text: item.name
      })
    })
    return metricArr
  }

  const handleInputChange = (e) => {
    const name = e.target.name
    const value = e.target.type == 'checkbox' ? e.target.checked : e.target.value
    setKpi({
      ...kpi,
      [name]: value
    })
  }

  const handleSelectChange = (name, value) => {
    setKpi({
      ...kpi,
      [name]: value
    })
  }

  const save = () => {
    const selectedKpi = listKpis.find((item) => item._id == kpi.id)
    const newKpi = {
      ...selectedKpi,
      displayName: kpi.displayName,
      customize: {
        theme: themes[kpi.theme - 1].colors
      },
      widget: widgetIcons[kpi.widgetIcon - 1].key,
      showTarget: kpi.showTarget,
      showTrend: kpi.showTrend,
      dataGrid: {
        i: listKpis.length + 1,
        x: 0,
        y: 99999,
        w: 6,
        h: 14
      }
    }
    onAddMonitoredKpi(newKpi)
  }

  return (
    <div className={styles.sidebar}>
      <div className='row'>
        <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
          <div className='form-group'>
            <label className='form-control-static'>{translate('manufacturing.performance.kpi')}</label>
            <SelectBox
              id='select-kpi'
              className='form-control select2'
              style={{ width: '100%' }}
              items={getMetricArr()}
              value={kpi.id}
              onChange={(value) => handleSelectChange('id', value)}
            />
          </div>
        </div>
        <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
          <div className='form-group'>
            <label className='form-control-static'>{translate('manufacturing.performance.display_name')}</label>
            <input type='text' name='displayName' className='form-control' value={kpi.displayName} onChange={handleInputChange} />
          </div>
        </div>
        <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
          <div className='form-group'>
            <label className='form-control-static'>{translate('manufacturing.performance.chart_type')}</label>
            <div className={styles['chart_icon-list']}>
              {widgetIcons.map((item) => (
                <div
                  key={item.id}
                  className={`${styles['chart_icon-item']} ${kpi.widgetIcon == item.id ? styles.selected : ''}`}
                  onClick={() => handleSelectChange('widgetIcon', item.id)}
                >
                  <i className='material-icons'>{item.icon}</i>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
          <div className='form-group'>
            <label className='form-control-static'>{translate('manufacturing.performance.color')}</label>
            <ThemeSelector themes={themes} onSelect={(value) => setTheme('theme', value)} selectedTheme={kpi.theme} />
          </div>
        </div>
        <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
          <label className='form-control-static'>{translate('manufacturing.performance.display_options')}</label>
        </div>
        <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
          <div className='form-group'>
            <input type='checkbox' name='showTarget' className='form-control' checked={kpi.showTarget} onChange={handleInputChange} />
            <span className='form-control-static'>{translate('manufacturing.performance.show_target')}</span>
          </div>
        </div>
        <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
          <div className='form-group'>
            <input type='checkbox' name='showTrend' className='form-control' onChange={handleInputChange} />
            <span className='form-control-static'>{translate('manufacturing.performance.show_trend')}</span>
          </div>
        </div>
        <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
          <div className='form-group'>
            <button className='btn btn-success pull-right' onClick={save}>
              {translate('manufacturing.performance.visualize')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default connect(null, null)(withTranslate(DashboardSidebar))
