import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import ArchiveManagement from '../components/archives'
import BinManagement from '../components/bin-locations'
import { BinLocationActions } from '../redux/actions'

import { LazyLoadComponent, forceCheckOrVisible } from '../../../../../common-components/index'

function BinLocationManagement(props) {
  const [state, setState] = useState({
    currentRole: localStorage.getItem('currentRole'),
    page: 1,
    limit: 5
  })

  const updateStateArchive = async () => {
    let { page, limit, currentRole } = state
    await props.getChildBinLocations({ page, limit, managementLocation: currentRole })
    forceCheckOrVisible(true, false)
  }

  const updateStateBinLocation = async () => {
    await props.getBinLocations()
    forceCheckOrVisible(true, false)
  }

  const { translate } = props

  return (
    <div className='nav-tabs-custom'>
      <ul className='nav nav-tabs'>
        <li className='active'>
          <a href='#bin-locations' data-toggle='tab' onClick={() => updateStateArchive()}>
            {translate('manage_warehouse.bin_location_management.bin_location')}
          </a>
        </li>
        <li>
          <a href='#bin-location-archives' data-toggle='tab' onClick={() => updateStateBinLocation()}>
            {translate('manage_warehouse.bin_location_management.archive')}
          </a>
        </li>
      </ul>
      <div className='tab-content'>
        <div className='tab-pane active' id='bin-locations'>
          <LazyLoadComponent>
            <ArchiveManagement />
          </LazyLoadComponent>
        </div>

        <div className='tab-pane' id='bin-location-archives'>
          {/* <LazyLoadComponent>
            <BinManagement />
          </LazyLoadComponent> */}
          <BinManagement />
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {
  getBinLocations: BinLocationActions.getBinLocations,
  getChildBinLocations: BinLocationActions.getChildBinLocations
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(BinLocationManagement))
