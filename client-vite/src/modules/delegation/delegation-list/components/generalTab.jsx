import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import dayjs from 'dayjs'
import { colorfyDelegationStatus } from './functionHelper'

function GeneralTab(props) {
  const [state, setState] = useState({
    delegationID: undefined
  })

  // setState từ props mới
  useEffect(() => {
    if (props.delegationID !== state.delegationID || props.status !== state.status || props.replyStatus !== state.replyStatus) {
      setState({
        ...state,
        delegationID: props.delegationID,
        name: props.name,
        description: props.description,
        delegator: props.delegator,
        delegatee: props.delegatee,
        delegatePrivileges: props.delegatePrivileges,
        delegateType: props.delegateType,
        delegateObject: props.delegateObject,
        delegateTaskRoles: props.delegateTaskRoles,
        status: props.status,
        allPrivileges: props.allPrivileges,
        startDate: props.startDate,
        endDate: props.endDate,
        revokedDate: props.revokedDate,
        revokeReason: props.revokeReason,
        forReceive: props.forReceive,
        replyStatus: props.replyStatus,
        declineReason: props.declineReason,
        policy: props.policy,
        logs: state.logs
      })
    }
  }, [props.delegationID, props.status, props.replyStatus])

  const formatTime = (date) => {
    return dayjs(date).format('DD-MM-YYYY hh:mm A')
  }

  const { translate } = props
  const {
    name,
    description,
    delegator,
    delegateTaskRoles,
    delegatee,
    delegatePrivileges,
    delegateType,
    delegateObject,
    status,
    allPrivileges,
    startDate,
    endDate,
    revokedDate,
    revokeReason,
    forReceive,
    replyStatus,
    declineReason,
    policy
  } = state

  return (
    <div id={props.id} className='tab-pane active'>
      <div className='row'>
        {/* Mã ủy quyền */}
        <div className='form-group col-lg-6 col-md-6 col-ms-12 col-xs-12'>
          <label>{translate('manage_delegation.name')}:</label>
          <span> {name}</span>
        </div>

        {/* Mô tả */}
        <div className='form-group col-lg-6 col-md-6 col-ms-12 col-xs-12'>
          <label>{translate('manage_delegation.description')}:</label>
          <span> {description}</span>
        </div>
      </div>

      {delegateObject ? (
        <div className='row'>
          <div className='form-group col-lg-12 col-md-12 col-ms-12 col-xs-12'>
            <label>{translate('manage_delegation.delegateObjectTask')}:</label>
            <span> {delegateObject.name}</span>
          </div>
        </div>
      ) : null}
      {delegateTaskRoles ? (
        <div className='row'>
          <div className='form-group col-lg-6 col-md-6 col-ms-12 col-xs-12'>
            <label>{translate('manage_delegation.delegateObjectTaskRole')}:</label>
            <span> {delegateTaskRoles ? delegateTaskRoles.map((r) => translate(`task.task_management.${r}`)).join(', ') : ''}</span>
          </div>
        </div>
      ) : null}

      <div className='row'>
        <div className='form-group col-lg-6 col-md-6 col-ms-12 col-xs-12'>
          <label>{forReceive ? translate('manage_delegation.delegator') : translate('manage_delegation.delegate_receiver')}:</label>
          <span> {forReceive ? delegator?.name : delegatee?.name}</span>
        </div>
      </div>

      <div className='row'>
        <div className='form-group col-lg-12 col-md-12 col-ms-12 col-xs-12'>
          <label>{translate('manage_delegation.delegation_period')}:</label>
          <span>
            {' '}
            {formatTime(startDate)} -{' '}
            {(revokedDate && endDate && new Date(revokedDate).getTime() < new Date(endDate).getTime()) || (revokedDate && !endDate)
              ? formatTime(revokedDate)
              : endDate
                ? formatTime(endDate)
                : translate('manage_delegation.end_date_tbd')}
          </span>
        </div>
      </div>

      <div className='row'>
        <div className='form-group col-lg-12 col-md-12 col-ms-12 col-xs-12'>
          <label>{translate('manage_delegation.delegate_policy')}:</label>
          <span> {policy?.name}</span>
        </div>
      </div>

      <div className='row'>
        <div className='form-group col-lg-6 col-md-6 col-ms-12 col-xs-12'>
          <label>{translate('manage_delegation.delegateStatus')}:</label>
          <span style={{ fontWeight: 600 }}>
            {' '}
            {colorfyDelegationStatus(status, translate)} - {colorfyDelegationStatus(replyStatus, translate)}
          </span>
        </div>
        {revokeReason && (
          <div className='form-group col-lg-6 col-md-6 col-ms-12 col-xs-12'>
            <label>{translate('manage_delegation.revoke_reason')}:</label>
            <span> {revokeReason}</span>
          </div>
        )}
      </div>
      {declineReason && (
        <div className='row'>
          <div className='form-group col-lg-12 col-md-12 col-ms-12 col-xs-12'>
            <label>{translate('manage_delegation.reject_reason')}:</label>
            <span> {declineReason}</span>
          </div>
        </div>
      )}
      {delegatePrivileges && delegatePrivileges.length > 0 && (
        <div className='row'>
          <div className='form-group col-lg-12 col-md-12 col-ms-12 col-xs-12'>
            <label>{translate('manage_delegation.delegation_allowed_links')}:</label>
            <table className='table table-hover table-bordered detail-policy-attribute-table not-sort'>
              <thead>
                <tr>
                  <th style={{ width: '30%' }}>
                    <label>{translate('manage_link.url')}</label>
                  </th>
                  <th style={{ width: '30%' }}>
                    <label>{translate('manage_link.category')}</label>
                  </th>
                  <th style={{ width: '30%', textAlign: 'left' }}>
                    <label>{translate('manage_link.description')}</label>
                  </th>
                </tr>
              </thead>
              <tbody>
                {!delegatePrivileges || delegatePrivileges.length <= 0
                  ? null
                  : delegatePrivileges.map((pri, index) => {
                      return (
                        <tr key={index}>
                          <td>{pri.resourceId?.url}</td>

                          <td>{pri.resourceId?.category}</td>
                          <td style={{ textAlign: 'left' }}>{pri.resourceId?.description}</td>
                        </tr>
                      )
                    })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function mapState(state) {
  const { delegation } = state
  return { delegation }
}

const actionCreators = {}
const generalTab = connect(mapState, actionCreators)(withTranslate(GeneralTab))
export { generalTab as GeneralTab }
