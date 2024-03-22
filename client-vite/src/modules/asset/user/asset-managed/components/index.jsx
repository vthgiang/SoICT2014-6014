import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { AssetManagement } from '../../../admin/asset-information/components/assetManagement'
import { UseRequestManager } from '../../../admin/use-request/components/UseRequestManager'
import { IncidentManagement } from '../../../admin/incident/components/incidentManagement'

function EmployeeAssetManagement(props) {
  const [state, setState] = useState({
    managedBy: localStorage.getItem('userId'),
    openTab1: 'tab-pane active',
    openTab2: 'tab-pane',
    openTab3: 'tab-pane'
  })

  let { translate } = props
  let { managedBy, openTab1, openTab2, openTab3 } = state

  const openIncidentTab = () => {
    setState((state) => {
      return {
        ...state,
        openTab1: 'tab-pane',
        openTab2: 'tab-pane',
        openTab3: 'tab-pane active'
      }
    })
  }

  const openUseRequestTab = () => {
    setState((state) => {
      return {
        ...state,
        openTab1: 'tab-pane',
        openTab2: 'tab-pane active',
        openTab3: 'tab-pane'
      }
    })
  }

  const openGeneralTab = () => {
    setState((state) => {
      return {
        ...state,
        openTab1: 'tab-pane active',
        openTab2: 'tab-pane',
        openTab3: 'tab-pane'
      }
    })
  }

  return (
    <div className='nav-tabs-custom'>
      <ul className='nav nav-tabs'>
        <li className='active'>
          <a title={translate('menu.manage_info_asset')} data-toggle='tab' onClick={openGeneralTab}>
            {translate('menu.manage_info_asset')}
          </a>
        </li>
        <li>
          <a title={translate('menu.manage_recommend_distribute_asset')} data-toggle='tab' onClick={openUseRequestTab}>
            {translate('menu.manage_recommend_distribute_asset')}
          </a>
        </li>
        <li>
          <a title={translate('menu.manage_incident_asset')} data-toggle='tab' onClick={openIncidentTab}>
            {translate('menu.manage_incident_asset')}
          </a>
        </li>
      </ul>

      <div className='tab-content'>
        <AssetManagement managedBy={managedBy} isActive={openTab1} />
        <UseRequestManager managedBy={managedBy} isActive={openTab2} />
        <IncidentManagement managedBy={managedBy} dataType='get_by_user' isActive={openTab3} />
      </div>
    </div>
  )
}

export default connect(null, null)(withTranslate(EmployeeAssetManagement))
