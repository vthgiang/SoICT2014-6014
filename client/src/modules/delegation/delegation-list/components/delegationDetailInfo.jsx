import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import { GeneralTab } from './generalTab'
import { LogActivityTab } from './logActivityTab'

import { DialogModal } from '../../../../common-components'

const DelegationDetailInfo = (props) => {
  const [state, setState] = useState({})

  const { translate, delegation } = props
  const { delegationID } = state

  // Nhận giá trị từ component cha
  useEffect(() => {
    if (
      props.delegationID !== state.delegationID ||
      props.status !== state.status ||
      props.replyStatus !== state.replyStatus ||
      props.logs !== state.logs
    ) {
      setState({
        ...state,
        delegationID: props.delegationID,
        delegationName: props.delegationName,
        description: props.description,
        delegator: props.delegator,
        delegatee: props.delegatee,
        delegatePrivileges: props.delegatePrivileges,
        delegateType: props.delegateType,
        delegateRole: props.delegateRole,
        delegateTask: props.delegateTask,
        status: props.status,
        allPrivileges: props.allPrivileges,
        startDate: props.startDate,
        endDate: props.endDate,
        revokedDate: props.revokedDate,
        revokeReason: props.revokeReason,
        forReceive: props.forReceive,
        replyStatus: props.replyStatus,
        declineReason: props.declineReason,
        delegatePolicy: props.delegatePolicy,
        logs: props.logs
      })
    }
  }, [props.delegationID, props.status, props.replyStatus, props.logs])

  return (
    <React.Fragment>
      <DialogModal
        modalID={`modal-detail-info-delegation-hooks-Role`}
        isLoading={delegation.isLoading}
        title={translate('manage_delegation.detail_info_delegation')}
        formID={`form-detail-delegation-hooks-Role`}
        size={50}
        hasSaveButton={false}
        hasNote={false}
      >
        <div className='nav-tabs-custom' style={{ marginTop: '-15px' }}>
          {/* Nav-tabs */}
          <ul className='nav nav-tabs'>
            <li className='active'>
              <a title={translate('manage_delegation.general_information')} data-toggle='tab' href={`#detail_general_information`}>
                {translate('manage_delegation.general_information')}
              </a>
            </li>
            <li>
              <a title={translate('manage_delegation.log_activity')} data-toggle='tab' href={`#detail_log_activity`}>
                {translate('manage_delegation.log_activity')}
              </a>
            </li>
          </ul>

          <div className='tab-content'>
            {/* Thông tin chung */}
            <GeneralTab
              id={`detail_general_information`}
              delegationID={delegationID}
              delegationName={state.delegationName}
              description={state.description}
              delegator={state.delegator}
              delegatee={state.delegatee}
              delegatePrivileges={state.delegatePrivileges}
              delegateType={state.delegateType}
              delegateRole={state.delegateRole}
              delegateTask={state.delegateTask}
              status={state.status}
              allPrivileges={state.allPrivileges}
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
            <LogActivityTab
              id={`detail_log_activity`}
              delegationID={delegationID}
              delegationName={state.delegationName}
              description={state.description}
              delegator={state.delegator}
              delegatee={state.delegatee}
              delegatePrivileges={state.delegatePrivileges}
              delegateType={state.delegateType}
              delegateRole={state.delegateRole}
              delegateTask={state.delegateTask}
              status={state.status}
              allPrivileges={state.allPrivileges}
              startDate={state.startDate}
              endDate={state.endDate}
              revokedDate={state.revokedDate}
              revokeReason={state.revokeReason}
              logs={state.logs}
            />
          </div>
        </div>
        {/* <form id={`form-detail-delegation-hooks`}>
                    <div className={`form-group`}>
                        <label>{translate('manage_delegation.delegationName')}:</label>
                        <span> {delegationName}</span>
                    </div>

                    <div className={`form-group`}>
                        <label>{translate('manage_delegation.description')}:</label>
                        <span> {description}</span>
                    </div>
                </form> */}
      </DialogModal>
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  const delegation = state.delegation
  return { delegation }
}

const connectedDelegationDetailInfo = React.memo(connect(mapStateToProps, null)(withTranslate(DelegationDetailInfo)))
export { connectedDelegationDetailInfo as DelegationDetailInfo }
