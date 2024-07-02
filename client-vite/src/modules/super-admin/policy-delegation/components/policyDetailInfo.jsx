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
  const policyDelegation = useSelector((x) => x.policyDelegation)
  const attribute = useSelector((x) => x.attribute)

  useEffect(() => {
    if (props.policyID) {
      dispatch(PolicyActions.getDetailedPolicyById(props.policyID))
    }
  }, [props.policyID])

  const {
    name,
    description,
    delegatorRequirements,
    delegateObjectRequirements,
    delegateeRequirements,
    environmentRequirements,
    delegation
  } = policyDelegation.detailedPolicy

  const delegatorAttributes = delegatorRequirements?.attributes
  const delegateObjectAttributes = delegateObjectRequirements?.attributes
  const delegateeAttributes = delegateeRequirements?.attributes
  const environmentAttributes = environmentRequirements?.attributes
  const delegatorRule = delegatorRequirements?.rule
  const delegateObjectRule = delegateObjectRequirements?.rule
  const delegateeRule = delegateeRequirements?.rule
  const environmentRule = environmentRequirements?.rule
  const authorizedRequesters = delegation?.delegators
  const authorizedResources = delegation?.delegatees

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
      isLoading={policyDelegation.isLoading}
      title={translate('manage_delegation_policy.detail_info_policy')}
      formID='form-detail-policy-hooks'
      size={50}
      hasSaveButton={false}
      hasNote={false}
    >
      <div className='nav-tabs-custom' style={{ marginTop: '-15px' }}>
        <ul className='nav nav-tabs'>
          <li className='active'>
            <a title={translate('manage_delegation_policy.policy_information')} data-toggle='tab' href='#policy_information'>
              {translate('manage_delegation_policy.policy_information')}
            </a>
          </li>
          <li>
            <a title={translate('manage_delegation_policy.delegated_information')} data-toggle='tab' href='#delegated_information'>
              {translate('manage_delegation_policy.delegated_information')}
            </a>
          </li>
        </ul>

        <div className='tab-content'>
          <div id='policy_information' className='tab-pane active'>
            {/* Tên ví dụ */}
            <div className='form-group'>
              <label>{translate('manage_delegation_policy.name')}:</label>
              <span> {name}</span>
            </div>

            {/* Mô tả ví dụ */}
            <div className='form-group'>
              <label>{translate('manage_delegation_policy.description')}:</label>
              <span> {description}</span>
            </div>

            <div className='form-group'>
              <label>{translate('manage_delegation_policy.delegation_requirements')}:</label>
              <table className='table table-hover table-bordered detail-policy-attribute-table not-sort'>
                <thead>
                  <tr>
                    <th style={{ width: '20%' }}>
                      <label>{translate('manage_delegation_policy.attribute_owner_table')}</label>
                    </th>
                    <th style={{ width: '20%' }}>
                      <label>{translate('manage_delegation_policy.rule_table')}</label>
                    </th>
                    <th style={{ width: '20%' }}>
                      <label>{translate('manage_delegation_policy.attribute_name')}</label>
                    </th>
                    <th style={{ width: '20%' }}>
                      <label>{translate('manage_delegation_policy.attribute_value')}</label>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td rowSpan={!delegatorAttributes || delegatorAttributes.length == 0 ? 1 : delegatorAttributes.length + 1}>
                      {translate('manage_delegation_policy.delegator_table')}
                    </td>
                    {!delegatorAttributes || delegatorAttributes.length == 0 ? (
                      <td colSpan={3}>
                        <center> {translate('table.no_data')}</center>
                      </td>
                    ) : (
                      <td rowSpan={delegatorAttributes.length + 1}>{delegatorRule}</td>
                    )}
                  </tr>
                  {!delegatorAttributes || delegatorAttributes.length <= 0
                    ? null
                    : delegatorAttributes.map((attr, index) => {
                        return (
                          <tr key={index}>
                            <td>{attribute.lists.map((a) => (a._id == attr.attributeId ? a.attributeName : ''))}</td>

                            <td style={{ textAlign: 'left' }}>{attr.value}</td>
                          </tr>
                        )
                      })}

                  <tr>
                    <td rowSpan={!delegateObjectAttributes || delegateObjectAttributes.length == 0 ? 1 : delegateObjectAttributes.length + 1}>
                      {translate('manage_delegation_policy.delegate_object_table')}
                    </td>
                    {!delegateObjectAttributes || delegateObjectAttributes.length == 0 ? (
                      <td colSpan={3}>
                        <center> {translate('table.no_data')}</center>
                      </td>
                    ) : (
                      <td rowSpan={delegateObjectAttributes.length + 1}>{delegateObjectRule}</td>
                    )}
                  </tr>
                  {!delegateObjectAttributes || delegateObjectAttributes.length <= 0
                    ? null
                    : delegateObjectAttributes.map((attr, index) => {
                        return (
                          <tr key={index}>
                            <td>{attribute.lists.map((a) => (a._id == attr.attributeId ? a.attributeName : ''))}</td>

                            <td style={{ textAlign: 'left' }}>{attr.value}</td>
                          </tr>
                        )
                      })}

                  <tr>
                    <td rowSpan={!delegateeAttributes || delegateeAttributes.length == 0 ? 1 : delegateeAttributes.length + 1}>
                      {translate('manage_delegation_policy.delegatee_table')}
                    </td>
                    {!delegateeAttributes || delegateeAttributes.length == 0 ? (
                      <td colSpan={3}>
                        <center> {translate('table.no_data')}</center>
                      </td>
                    ) : (
                      <td rowSpan={delegateeAttributes.length + 1}>{delegateeRule}</td>
                    )}
                  </tr>
                  {!delegateeAttributes || delegateeAttributes.length <= 0
                    ? null
                    : delegateeAttributes.map((attr, index) => {
                        return (
                          <tr key={index}>
                            <td>{attribute.lists.map((a) => (a._id == attr.attributeId ? a.attributeName : ''))}</td>

                            <td style={{ textAlign: 'left' }}>{attr.value}</td>
                          </tr>
                        )
                      })}

                  <tr>
                    <td rowSpan={!environmentAttributes || environmentAttributes.length == 0 ? 1 : environmentAttributes.length + 1}>
                      {translate('manage_delegation_policy.environment_table')}
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

          <div id='delegated_information' className='tab-pane'>
            Implement later
          </div>
        </div>
      </div>
    </DialogModal>
  )
}
