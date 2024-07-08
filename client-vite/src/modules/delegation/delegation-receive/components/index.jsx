import React from 'react'
import { connect } from 'react-redux'

import { withTranslate } from 'react-redux-multilingual'

import { DelegationReceiveTable } from './delegationReceiveTable'
import { DelegationReceiveTableTask } from './delegationReceiveTableTask'
import { DelegationReceiveTableResource } from './delegationReceiveTableResource'

function ManageDelegationReceive(props) {
  const { translate } = props

  return (
    <div className='nav-tabs-custom'>
      <ul className='nav nav-tabs'>
        <li className='active'>
          <a title={translate('manage_delegation.delegateTypeRole')} data-toggle='tab' href='#role_delegation'>
            {translate('manage_delegation.delegateTypeRole')}
          </a>
        </li>
        <li>
          <a title={translate('manage_delegation.delegateTypeTask')} data-toggle='tab' href='#task_delegation'>
            {translate('manage_delegation.delegateTypeTask')}
          </a>
        </li>
        <li>
          <a title={translate('manage_delegation.delegateTypeResource')} data-toggle='tab' href='#resource_delegation'>
            {translate('manage_delegation.delegateTypeResource')}
          </a>
        </li>
      </ul>
      <div className='tab-content'>
        <div className='tab-pane active' id='role_delegation'>
          <DelegationReceiveTable />
        </div>

        <div className='tab-pane' id='task_delegation'>
          <DelegationReceiveTableTask />
        </div>

        <div className='tab-pane' id='resource_delegation'>
          <DelegationReceiveTableResource />
        </div>
      </div>
    </div>
  )
}
const mapStateToProps = (state) => state

export default connect(mapStateToProps, null)(withTranslate(ManageDelegationReceive))
