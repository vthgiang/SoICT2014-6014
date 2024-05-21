import React from 'react'
import ScheduleTable from './scheduleTable'

export default function Schedule() {
  return (
    <div className='box' style={{ minHeight: '450px' }}>
      <div className='box-body'>
        <ScheduleTable />
      </div>
    </div>
  )
}
