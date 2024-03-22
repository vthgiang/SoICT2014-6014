import React, { Component } from 'react'
import { forceCheckOrVisible, LazyLoadComponent } from '../../../../../common-components'
import ManufacturingMillScheduleList from './manufacturing-mill-schedule'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import WorkerScheduleList from './worker-schedule'

function WorkSchedule(props) {
  const { translate } = props
  return (
    <div className='nav-tabs-custom'>
      <ul className='nav nav-tabs'>
        <li className='active'>
          <a href='#list-manufacturing-mill-schedule' data-toggle='tab' onClick={() => forceCheckOrVisible(true, false)}>
            {translate('manufacturing.work_schedule.manufacturing_mill_schedule_list')}
          </a>
        </li>
        <li>
          <a href='#list-workder-schedule' data-toggle='tab' onClick={() => forceCheckOrVisible(true, false)}>
            {translate('manufacturing.work_schedule.worker_schedule_list')}
          </a>
        </li>
      </ul>
      <div className='tab-content'>
        <div className='tab-pane active' id='list-manufacturing-mill-schedule'>
          <LazyLoadComponent>
            <ManufacturingMillScheduleList />
          </LazyLoadComponent>
        </div>
        <div className='tab-pane' id='list-workder-schedule'>
          <LazyLoadComponent>
            <WorkerScheduleList />
          </LazyLoadComponent>
        </div>
      </div>
    </div>
  )
}
export default connect(null, null)(withTranslate(WorkSchedule))
