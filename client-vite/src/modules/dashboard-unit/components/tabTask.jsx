import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { TaskOrganizationalUnitsChart } from './combinedContent'
import { CurrentTaskTimesheetLogInOrganizationalUnit } from '../../task/task-dashboard/task-organization-dashboard/currentTaskTimesheetLogInOrganizationalUnit'
function TabTask(props) {
  const { childOrganizationalUnit, organizationalUnits, month } = props

  return (
    <React.Fragment>
      <div className='row'>
        <div className='col-md-12'>
          <TaskOrganizationalUnitsChart childOrganizationalUnit={childOrganizationalUnit} month={month} />
        </div>
      </div>

      <div className='row'>
        <div className='col-md-12'>
          <CurrentTaskTimesheetLogInOrganizationalUnit
            organizationalUnitIds={organizationalUnits}
            listUnitSelect={childOrganizationalUnit?.map((item) => {
              return { text: item?.name, value: item?.id }
            })}
            getUnitName={props.getUnitName}
            showUnitTask={props.showUnitGeneraTask}
          />
        </div>
      </div>
    </React.Fragment>
  )
}

const tabTask = React.memo(connect(null, null)(withTranslate(TabTask)))
export { tabTask as TabTask }
