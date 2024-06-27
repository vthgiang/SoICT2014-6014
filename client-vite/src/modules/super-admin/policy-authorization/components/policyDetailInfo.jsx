import React, { useState, useEffect } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import './policyAttributeTable.css'

import { useTranslate } from 'react-redux-multilingual'
import { DialogModal } from '../../../../common-components'
import { PolicyActions } from '../redux/actions'

export function PolicyDetailInfo(props) {
  const translate = useTranslate()
  const dispatch = useDispatch()
  const policyAuthorization = useSelector((x) => x.policyAuthorization)
  const attribute = useSelector((x) => x.attribute)

  useEffect(() => {
    if (props.policyID) {
      dispatch(PolicyActions.getDetailedPolicyById(props.policyID))
    }
  }, [props.policyID])

  const {
    name,
    description,
    effect,
    effectiveStartTime,
    effectiveEndTime,
    requesterRequirements,
    roleRequirements,
    resourceRequirements,
    environmentRequirements,
    authorization
  } = policyAuthorization.detailedPolicy

  const requesterAttributes = requesterRequirements?.attributes
  const roleAttributes = roleRequirements?.attributes
  const resourceAttributes = resourceRequirements?.attributes
  const environmentAttributes = environmentRequirements?.attributes
  const requesterRule = requesterRequirements?.rule
  const roleRule = roleRequirements?.rule
  const resourceRule = resourceRequirements?.rule
  const environmentRule = environmentRequirements?.rule
  const authorizedRequesters = authorization?.requesters
  const authorizedResources = authorization?.resources

  const prettyAttributes = (attributes) => {
    let str = ''
    const attributeList = attribute.lists
    for (let i = 0; i < attributes.length; i++) {
      const attributeName = attributeList.find((x) => x._id === attributes[i].attributeId)?.attributeName
      str += `${attributeName}: ${attributes[i].value}\n`
    }
    return str.trim()
  }

  const prettyAdditionalInfo = (additionalInfo) => {
    let str = ''
    for (const k in additionalInfo) {
      str += `${k}: ${additionalInfo[k]}\n`
    }
    return str.trim()
  }

  return (
    <DialogModal
      modalID='modal-detail-info-policy-hooks'
      isLoading={policyAuthorization.isLoading}
      title={translate('manage_authorization_policy.detail_info_policy')}
      formID='form-detail-policy-hooks'
      size={50}
      hasSaveButton={false}
      hasNote={false}
    >
      <div className='nav-tabs-custom' style={{ marginTop: '-15px' }}>
        <ul className='nav nav-tabs'>
          <li className='active'>
            <a title={translate('manage_authorization_policy.policy_information')} data-toggle='tab' href='#policy_information'>
              {translate('manage_authorization_policy.policy_information')}
            </a>
          </li>
          <li>
            <a title={translate('manage_authorization_policy.authorized_information')} data-toggle='tab' href='#authorized_information'>
              {translate('manage_authorization_policy.authorized_information')}
            </a>
          </li>
        </ul>

        <div className='tab-content'>
          <div id='policy_information' className='tab-pane active'>
            {/* Tên ví dụ */}
            <div className='form-group'>
              <label>{translate('manage_authorization_policy.name')}:</label>
              <span> {name}</span>
            </div>

            {/* Mô tả ví dụ */}
            <div className='form-group'>
              <label>{translate('manage_authorization_policy.description')}:</label>
              <span> {description}</span>
            </div>

            {/* Effect */}
            <div className='form-group'>
              <label>{translate('manage_authorization_policy.description')}:</label>
              <span> {effect}</span>
            </div>

            {/* effectiveStartTime */}
            <div className='form-group'>
              <label>{translate('manage_authorization_policy.description')}:</label>
              <span> {effectiveStartTime}</span>
            </div>

            {/* effectiveEndTime */}
            <div className='form-group'>
              <label>{translate('manage_authorization_policy.description')}:</label>
              <span> {effectiveEndTime}</span>
            </div>

            <div className='form-group'>
              <label>{translate('manage_authorization_policy.requester_information')}:</label>
              <table className='table table-hover table-bordered detail-policy-attribute-table not-sort'>
                <thead>
                  <tr>
                    <th style={{ width: '20%' }}>
                      <label>{translate('manage_authorization_policy.attribute_owner_table')}</label>
                    </th>
                    <th style={{ width: '20%' }}>
                      <label>{translate('manage_authorization_policy.rule_table')}</label>
                    </th>
                    <th style={{ width: '20%' }}>
                      <label>{translate('manage_authorization_policy.attribute_name')}</label>
                    </th>
                    <th style={{ width: '20%' }}>
                      <label>{translate('manage_authorization_policy.attribute_value')}</label>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td rowSpan={!requesterAttributes || requesterAttributes.length == 0 ? 1 : requesterAttributes.length + 1}>
                      {translate('manage_authorization_policy.requester_table')}
                    </td>
                    {!requesterAttributes || requesterAttributes.length == 0 ? (
                      <td colSpan={3}>
                        <center> {translate('table.no_data')}</center>
                      </td>
                    ) : (
                      <td rowSpan={requesterAttributes.length + 1}>{requesterRule}</td>
                    )}
                  </tr>
                  {!requesterAttributes || requesterAttributes.length <= 0
                    ? null
                    : requesterAttributes.map((attr, index) => {
                        return (
                          <tr key={index}>
                            <td>{attribute.lists.map((a) => (a._id == attr.attributeId ? a.attributeName : ''))}</td>

                            <td style={{ textAlign: 'left' }}>{attr.value}</td>
                          </tr>
                        )
                      })}

                  <tr>
                    <td rowSpan={!roleAttributes || roleAttributes.length == 0 ? 1 : roleAttributes.length + 1}>
                      {translate('manage_authorization_policy.role_table')}
                    </td>
                    {!roleAttributes || roleAttributes.length == 0 ? (
                      <td colSpan={3}>
                        <center> {translate('table.no_data')}</center>
                      </td>
                    ) : (
                      <td rowSpan={roleAttributes.length + 1}>{roleRule}</td>
                    )}
                  </tr>
                  {!roleAttributes || roleAttributes.length <= 0
                    ? null
                    : roleAttributes.map((attr, index) => {
                        return (
                          <tr key={index}>
                            <td>{attribute.lists.map((a) => (a._id == attr.attributeId ? a.attributeName : ''))}</td>

                            <td style={{ textAlign: 'left' }}>{attr.value}</td>
                          </tr>
                        )
                      })}

                  <tr>
                    <td rowSpan={!resourceAttributes || resourceAttributes.length == 0 ? 1 : resourceAttributes.length + 1}>
                      {translate('manage_authorization_policy.resource_table')}
                    </td>
                    {!resourceAttributes || resourceAttributes.length == 0 ? (
                      <td colSpan={3}>
                        <center> {translate('table.no_data')}</center>
                      </td>
                    ) : (
                      <td rowSpan={resourceAttributes.length + 1}>{resourceRule}</td>
                    )}
                  </tr>
                  {!resourceAttributes || resourceAttributes.length <= 0
                    ? null
                    : resourceAttributes.map((attr, index) => {
                        return (
                          <tr key={index}>
                            <td>{attribute.lists.map((a) => (a._id == attr.attributeId ? a.attributeName : ''))}</td>

                            <td style={{ textAlign: 'left' }}>{attr.value}</td>
                          </tr>
                        )
                      })}

                  <tr>
                    <td rowSpan={!environmentAttributes || environmentAttributes.length == 0 ? 1 : environmentAttributes.length + 1}>
                      {translate('manage_authorization_policy.environment_table')}
                    </td>
                    {!environmentAttributes || environmentAttributes.length == 0 ? (
                      <td colSpan={3}>
                        <center> {translate('table.no_data')}</center>
                      </td>
                    ) : (
                      <td rowSpan={environmentAttributes.length + 1}>{environmentRule}</td>
                    )}
                  </tr>
                  {!environmentAttributes || environmentAttributes.length <= 0
                    ? null
                    : environmentAttributes.map((attr, index) => {
                        return (
                          <tr key={index}>
                            <td>{attribute.lists.map((a) => (a._id == attr.attributeId ? a.attributeName : ''))}</td>

                            <td style={{ textAlign: 'left' }}>{attr.value}</td>
                          </tr>
                        )
                      })}
                </tbody>
              </table>
            </div>
          </div>

          <div id='authorized_information' className='tab-pane'>
            <div className='form-group'>
              <label>{translate('manage_authorization_policy.authorized_requester')}:</label>
              <table className='table table-hover table-bordered detail-policy-attribute-table not-sort'>
                <thead>
                  <tr>
                    <th className='col-fixed'>{translate('manage_authorization_policy.index')}</th>
                    <th>{translate('manage_authorization_policy.authorized_requester_name')}</th>
                    <th>{translate('manage_authorization_policy.authorized_requester_type')}</th>
                  </tr>
                </thead>
                <tbody>
                  {!authorizedRequesters || authorizedRequesters.length <= 0
                    ? null
                    : authorizedRequesters.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td> {item.name}</td>
                            <td> {item.type}</td>
                          </tr>
                        )
                      })}
                </tbody>
              </table>
              {(!authorizedRequesters || authorizedRequesters.length === 0) && (
                <div className='table-info-panel'>{translate('confirm.no_data')}</div>
              )}
            </div>

            <div className='form-group'>
              <label>{translate('manage_authorization_policy.authorized_resource')}:</label>
              <table className='table table-hover table-bordered detail-policy-attribute-table not-sort'>
                <thead>
                  <tr>
                    <th className='col-fixed'>{translate('manage_authorization_policy.index')}</th>
                    <th>{translate('manage_authorization_policy.authorized_resource_name')}</th>
                    <th>{translate('manage_authorization_policy.authorized_resource_type')}</th>
                    <th>{translate('manage_authorization_policy.authorized_resource_additional_info')}</th>
                  </tr>
                </thead>
                <tbody>
                  {!authorizedResources || authorizedResources.length <= 0
                    ? null
                    : authorizedResources.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>

                            <td> {item.name}</td>
                            <td> {item.type}</td>
                            <td>
                              <pre>{prettyAdditionalInfo(item.additionalInfo)}</pre>
                            </td>
                          </tr>
                        )
                      })}
                </tbody>
              </table>
              {(!authorizedResources || authorizedResources.length === 0) && (
                <div className='table-info-panel'>{translate('confirm.no_data')}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DialogModal>
  )
}
