import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import dayjs from 'dayjs'
import { colorfyDelegationStatus } from './functionHelper'
import { SystemApiActions } from '../../../system-admin/system-api/system-api-management/redux/actions'

function GeneralTabService(props) {
  const [state, setState] = useState({
    delegationID: undefined
  })

  const { systemApis, getSystemApis } = props

  // setState từ props mới
  useEffect(() => {
    setState({
      ...state,
      delegationID: props.delegationID,
      delegationName: props.delegationName,
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
      // delegatePolicy: props.delegatePolicy,
      delegateApis: props.delegateApis,
      logs: state.logs
    })
  }, [props.delegationID, props.status])

  useEffect(() => {
    getSystemApis({
      page: 1,
      perPage: 10000
    })
  }, [])

  const formatTime = (date) => {
    return dayjs(date).format('DD-MM-YYYY hh:mm A')
  }

  const { translate } = props
  const {
    delegationName,
    description,
    delegator,
    delegatee,
    delegateApis,
    status,
    startDate,
    endDate,
    revokedDate,
    revokeReason,
    declineReason
    // delegatePolicy
  } = state

  return (
    <div id={props.id} className='tab-pane active'>
      <div className='row'>
        {/* Mã ủy quyền */}
        <div className='form-group col-lg-6 col-md-6 col-ms-12 col-xs-12'>
          <label>{translate('manage_delegation.delegationName')}:</label>
          <span> {delegationName}</span>
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

      {/* <div class='row'>
        <div className={`form-group col-lg-12 col-md-12 col-ms-12 col-xs-12`}>
          <label>{translate('manage_delegation.delegate_policy')}:</label>
          <span> {delegatePolicy?.policyName}</span>
        </div>
      </div> */}

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
      {delegateApis && delegateApis.length > 0 && (
        <div className='row'>
          <div className='form-group col-lg-12 col-md-12 col-ms-12 col-xs-12'>
            <label>{translate('manage_delegation.delegate_apis')}:</label>
            <table className='table table-hover table-bordered detail-policy-attribute-table not-sort'>
              <thead>
                <tr>
                  <th style={{ width: '30%' }}>
                    <label>{translate('manage_delegation.api.url')}</label>
                  </th>
                  <th style={{ width: '30%' }}>
                    <label>{translate('manage_delegation.api.action')}</label>
                  </th>
                </tr>
              </thead>
              <tbody>
                {delegateApis.map((id, index) => {
                  const api = systemApis.listPaginateApi.find(x => x._id == id)
                  return (
                    <tr key={index}>
                      <td>{api.path}</td>
                      <td>{api.method}</td>
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
  const { systemApis } = state
  return { systemApis }
}

const actionCreators = {
  getSystemApis: SystemApiActions.getSystemApis
}
const generalTabService = connect(mapState, actionCreators)(withTranslate(GeneralTabService))
export { generalTabService as GeneralTabService }
