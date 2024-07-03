import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'

import { DialogModal } from '../../../../common-components'
import { LogActivityTab } from './logActivityTab'
import { GeneralTabResource } from './generalTabResource'
import 'moment/locale/vi'

function DelegationDetailInfoResource(props) {
  const [state, setState] = useState({
    showEvaluations: []
  })

  const { translate, delegation } = props
  const { delegationID } = state

  // Nhận giá trị từ component cha
  useEffect(() => {
    setState({
      ...state,
      delegationID: props.delegationID,
      name: props.name,
      description: props.description,
      delegator: props.delegator,
      delegatee: props.delegatee,
      delegateResource: props.delegateResource,
      status: props.status,
      startDate: props.startDate,
      endDate: props.endDate,
      revokedDate: props.revokedDate,
      revokeReason: props.revokeReason,
      replyStatus: props.replyStatus,
      declineReason: props.declineReason,
      policy: props.policy,
      logs: props.logs
    })
  }, [props.delegationID, props.status, props.replyStatus])

  return (
    <DialogModal
      modalID='modal-detail-info-delegation-hooks-Resource'
      isLoading={delegation.isLoading}
      title={translate('manage_delegation.detail_info_delegation_task')}
      formID='form-detail-delegation-hooks-Resource'
      size={props.size ? props.size : 50}
      hasSaveButton={false}
      hasNote={false}
    >
      <div className='nav-tabs-custom' style={{ marginTop: '-15px' }}>
        {/* Nav-tabs */}
        <ul className='nav nav-tabs'>
          <li className='active'>
            <a title={translate('manage_delegation.general_information')} data-toggle='tab' href='#detail_general_information_service'>
              {translate('manage_delegation.general_information')}
            </a>
          </li>
          <li>
            <a title={translate('manage_delegation.log_activity')} data-toggle='tab' href='#detail_log_activity_service'>
              {translate('manage_delegation.log_activity')}
            </a>
          </li>
        </ul>

        <div className='tab-content'>
          {/* Thông tin chung */}
          <GeneralTabResource
            id='detail_general_information_service'
            delegationID={delegationID}
            name={state.name}
            description={state.description}
            delegator={state.delegator}
            delegatee={state.delegatee}
            delegateResource={state.delegateResource}
            status={state.status}
            startDate={state.startDate}
            endDate={state.endDate}
            revokedDate={state.revokedDate}
            revokeReason={state.revokeReason}
            forReceive={state.forReceive}
            replyStatus={state.replyStatus}
            declineReason={state.declineReason}
            policy={state.policy}
            logs={state.logs}
          />

          {/* Thông tin thuộc tính subject */}
          <LogActivityTab
            id='detail_log_activity_service'
            delegationID={delegationID}
            name={state.name}
            description={state.description}
            delegator={state.delegator}
            delegatee={state.delegatee}
            delegateType={state.delegateType}
            status={state.status}
            startDate={state.startDate}
            endDate={state.endDate}
            revokedDate={state.revokedDate}
            revokeReason={state.revokeReason}
            logs={state.logs}
          />
        </div>
      </div>
    </DialogModal>
  )
}

function mapStateToProps(state) {
  const { delegation } = state
  return { delegation }
}

const connectedDelegationDetailInfoResource = React.memo(connect(mapStateToProps, null)(withTranslate(DelegationDetailInfoResource)))
export { connectedDelegationDetailInfoResource as DelegationDetailInfoResource }
