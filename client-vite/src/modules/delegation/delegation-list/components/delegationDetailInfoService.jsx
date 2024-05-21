import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'

import { DialogModal } from '../../../../common-components'
import { LogActivityTabService } from './logActivityTabService'
import { GeneralTabService } from './generalTabService'
import 'moment/locale/vi'

function DelegationDetailInfoService(props) {
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
      delegationName: props.delegationName,
      description: props.description,
      delegator: props.delegator,
      delegatee: props.delegatee,
      delegateResources: props.delegateResources,
      status: props.status,
      startDate: props.startDate,
      endDate: props.endDate,
      revokedDate: props.revokedDate,
      revokeReason: props.revokeReason,
      replyStatus: props.replyStatus,
      declineReason: props.declineReason,
      // delegatePolicy: props.delegatePolicy,
      logs: props.logs
    })
  }, [props.delegationID, props.status, props.replyStatus])

  return (
    <DialogModal
      modalID='modal-detail-info-delegation-hooks-Service'
      isLoading={delegation.isLoading}
      title={translate('manage_delegation.detail_info_delegation_task')}
      formID='form-detail-delegation-hooks-Service'
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
          <GeneralTabService
            id='detail_general_information_service'
            delegationID={delegationID}
            delegationName={state.delegationName}
            description={state.description}
            delegator={state.delegator}
            delegatee={state.delegatee}
            delegateResources={state.delegateResources}
            status={state.status}
            startDate={state.startDate}
            endDate={state.endDate}
            revokedDate={state.revokedDate}
            revokeReason={state.revokeReason}
            forReceive={state.forReceive}
            replyStatus={state.replyStatus}
            declineReason={state.declineReason}
            delegatePolicy={state.delegatePolicy}
            logs={state.logs}
          />

          {/* Thông tin thuộc tính subject */}
          <LogActivityTabService
            id='detail_log_activity_service'
            delegationID={delegationID}
            delegationName={state.delegationName}
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

const connectedDelegationDetailInfoService = React.memo(connect(mapStateToProps, null)(withTranslate(DelegationDetailInfoService)))
export { connectedDelegationDetailInfoService as DelegationDetailInfoService }
