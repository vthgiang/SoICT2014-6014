import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslate } from 'react-redux-multilingual'
import dayjs from 'dayjs'
import { colorfyDelegationStatus } from './functionHelper'

export function GeneralTabResource(props) {
  const dispatch = useDispatch()
  const translate = useTranslate()
  const [state, setState] = useState({
    delegationID: undefined
  })

  // setState từ props mới
  useEffect(() => {
    setState({
      ...state,
      delegationID: props.delegationID,
      name: props.name,
      description: props.description,
      delegator: props.delegator,
      delegatee: props.delegatee,
      delegateType: props.delegateType,
      status: props.status,
      startDate: props.startDate,
      endDate: props.endDate,
      revokedDate: props.revokedDate,
      revokeReason: props.revokeReason,
      declineReason: props.declineReason,
      policy: props.policy,
      delegateResource: props.delegateResource,
      logs: state.logs
    })
  }, [props.delegationID, props.status])

  const formatTime = (date) => {
    return dayjs(date).format('DD-MM-YYYY hh:mm A')
  }

  const {
    name,
    description,
    delegator,
    delegatee,
    delegateResource,
    status,
    startDate,
    endDate,
    revokedDate,
    revokeReason,
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

      <div className='row'>
        <div className='form-group col-lg-6 col-md-6 col-ms-12 col-xs-12'>
          <label>{translate('manage_delegation.delegator')}:</label>
          <span> {delegator?.name} </span>
        </div>

        <div className='form-group col-lg-6 col-md-6 col-ms-12 col-xs-12'>
          <label>{translate('manage_delegation.delegate_receiver')}:</label>
          <span> {delegatee?.name}</span>
        </div>
      </div>

      <div className='row'>
        <div className='form-group col-lg-12 col-md-12 col-ms-12 col-xs-12'>
          <label>{translate('manage_delegation.delegateResource')}:</label>
          <span>
            {' '}
            {delegateResource?.name} - {delegateResource?.type}{' '}
          </span>
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
          <span style={{ fontWeight: 600 }}> {colorfyDelegationStatus(status, translate)}</span>
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
    </div>
  )
}
