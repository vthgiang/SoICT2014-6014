import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import ManufacturingCommandManagementTable from './manufacturingCommandManagementTable'
import ManufacturingCommandManagementGantt from './manufacturingCommandManagementGantt'

function ManufacturingCommand(props) {
  const {translate} = props

  const [activeTab, setActiveTab] = useState(0);

  const handleActiveTab = (activeTab) => {
    setActiveTab(activeTab)
  } 

  return (
    <div className='box' style={{ minHeight: '450px' }}>
      <div className='box-body'>
        
        <div className='nav-tabs-custom'>
          <ul className='nav nav-tabs'>
            <li className='active'>
              <a href='#manufacturing-command-gantt' data-toggle='tab' onClick={() => handleActiveTab(0)}>
                {translate('manufacturing.command.gantt_chart')}
              </a>
            </li>
            <li>
              <a href='#manufacturing-command-list' data-toggle='tab' onClick={() => handleActiveTab(1)}>
                {translate('manufacturing.command.list')}
              </a>
            </li>
          </ul>
            <div className='tab-content active'>
              <div className='tab-pane active' id='manufacturing-command-gantt'>
                {activeTab === 0 && (
                  <ManufacturingCommandManagementGantt />
                )}
              </div>
              <div className='tab-pane' id='manufacturing-command-list'>
                {/* {activeTab === 1 && (
                  <ManufacturingCommandManagementTable />
                )} */}
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}
export default connect(null, null)(withTranslate(ManufacturingCommand))
