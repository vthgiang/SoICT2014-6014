import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { AssetAssignedManager } from './AssetAssignedManager'
import { AssetCrashManager } from './AssetCrashManager'

function ManagerAssetAssignedCrash(props) {
  const { translate } = props
  return (
    <div className='nav-tabs-custom'>
      <ul className='nav nav-tabs'>
        <li className='active'>
          <a title={translate('menu.manage_assigned_asset')} data-toggle='tab' href='#assetassigned'>
            {translate('menu.manage_assigned_asset')}
          </a>
        </li>
        <li>
          <a title={translate('asset.incident.incident')} data-toggle='tab' href='#assetcrash'>
            {translate('asset.incident.incident')}
          </a>
        </li>
      </ul>
      <div className='tab-content' style={{ padding: 0 }}>
        <AssetAssignedManager />
        <AssetCrashManager />
      </div>
    </div>
  )
}

export default connect(null, null)(withTranslate(ManagerAssetAssignedCrash))
