import React from 'react'
import { useSelector } from 'react-redux'

import { useTranslate } from 'react-redux-multilingual'

export function AuthorizedObjectTab(props) {
  const translate = useTranslate()

  const { delegatorAttributes, delegateObjectAttributes, delegateeAttributes, delegatorRule, delegateObjectRule, delegateeRule } = props

  const allRequester = useSelector((x) => x.requester.list)
  const allResource = useSelector((x) => x.resource.list)
  const attributeList = useSelector((x) => x.attribute.lists.filter((x) => ['Mixed', 'Delegation'].includes(x.type)))
  const attributeIdList = attributeList.map((x) => x._id)

  const ruleCheck = (objects, policyAttributes, policyRule) => {
    let satisfied = []
    let count = 0
    if (!policyAttributes || policyAttributes.length === 0 || !policyRule) {
      return satisfied
    }

    // Kiểm tra rule EQUALS
    // 1. Nếu rule là EQUALS
    if (policyRule === 'EQUALS') {
      // 2. Với mỗi user lấy ra những element có tập thuộc tính giống hệt trong chính sách (số lượng thuộc tính == và giá trị giống)
      objects.forEach((element) => {
        const attributes = element.attributes.filter((x) => attributeIdList.includes(x.attributeId.toString()))
        // Kiểm tra length
        if (attributes.length > 0 && attributes.length === policyAttributes.length) {
          attributes.forEach((uAttr) => {
            policyAttributes.forEach((pAttr) => {
              // Kiểm tra id thuộc tính và value
              if (pAttr.attributeId === uAttr.attributeId && pAttr.value === uAttr.value) {
                count++
              }
            })
          })
          if (count === policyAttributes.length) {
            // Nếu count bằng với length policy attribute thì add element vào array
            satisfied = [...satisfied, element]
          }
          // Reset count
          count = 0
        }
      })
    }

    // Kiểm tra rule BELONGS
    // 1. Nếu rule là BELONGS
    if (policyRule === 'BELONGS') {
      // 2. Với mỗi element lấy ra những element mà thuộc tính là tập con thuộc tính trong chính sách (số lượng thuộc tính <= và giá trị giống)
      objects.forEach((element) => {
        const attributes = element.attributes.filter((x) => attributeIdList.includes(x.attributeId.toString()))
        // Kiểm tra length
        if (attributes.length > 0 && attributes.length <= policyAttributes.length) {
          attributes.forEach((uAttr) => {
            policyAttributes.forEach((pAttr) => {
              // Kiểm tra id thuộc tính và value
              if (pAttr.attributeId === uAttr.attributeId && pAttr.value === uAttr.value) {
                count++
              }
            })
          })
          if (count === attributes.length) {
            // Nếu count == với length element attribute thì add element vào array
            satisfied = [...satisfied, element]
          }
          // Reset count
          count = 0
        }
      })
    }

    // Kiểm tra rule CONTAINS
    // 1. Nếu rule là CONTAINS
    if (policyRule === 'CONTAINS') {
      // 2. Với mỗi element lấy ra những element mà thuộc tính là tập cha thuộc tính trong chính sách (số lượng thuộc tính >= và giá trị giống)
      objects.forEach((element) => {
        const attributes = element.attributes.filter((x) => attributeIdList.includes(x.attributeId.toString()))
        // Kiểm tra length
        if (attributes.length > 0 && attributes.length >= policyAttributes.length) {
          attributes.forEach((uAttr) => {
            policyAttributes.forEach((pAttr) => {
              // Kiểm tra id thuộc tính và value
              if (pAttr.attributeId === uAttr.attributeId && pAttr.value === uAttr.value) {
                count++
              }
            })
          })
          if (count === policyAttributes.length) {
            // Nếu count == với length policy attribute thì add element vào array
            satisfied = [...satisfied, element]
          }
          // Reset count
          count = 0
        }
      })
    }

    return satisfied
  }

  const authorizedDelegators = ruleCheck(allRequester, delegatorAttributes, delegatorRule)
  const authorizedDelegatees = ruleCheck(allRequester, delegateeAttributes, delegateeRule)
  const authorizedDelegateObjects = ruleCheck(allResource, delegateObjectAttributes, delegateObjectRule)

  const prettyAttributes = (attributes) => {
    let str = ''
    for (let i = 0; i < attributes.length; i++) {
      const attributeName = attributeList.find((x) => x._id === attributes[i].attributeId)?.attributeName
      if (attributeName) {
        str += `${attributeName}: ${attributes[i].value}\n`
      }
    }
    return str
  }
  
  return (
    <div id={props.id} className='tab-pane'>
      {/* Authorized requesters */}
      <div className='form-group'>
        <label>{translate('manage_delegation_policy.authorized_delegator')}:</label>
        <table className='table table-hover table-bordered detail-policy-attribute-table not-sort'>
          <thead>
            <tr>
              <th className='col-fixed'>{translate('manage_delegation_policy.index')}</th>
              <th>{translate('manage_delegation_policy.authorized_delegator_name')}</th>
              <th>{translate('manage_delegation_policy.authorized_delegator_type')}</th>
              <th>{translate('manage_delegation_policy.attributes_information')}</th>
            </tr>
          </thead>
          <tbody>
            {!authorizedDelegators || authorizedDelegators.length <= 0
              ? null
              : authorizedDelegators.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td> {item.name}</td>
                      <td> {item.type}</td>
                      <td>
                        <pre>{prettyAttributes(item.attributes)}</pre>
                      </td>
                    </tr>
                  )
                })}
          </tbody>
        </table>
        {(!authorizedDelegators || authorizedDelegators.length === 0) && (
          <div className='table-info-panel'>{translate('confirm.no_data')}</div>
        )}
      </div>
      {/* Authorized resources */}
      <div className='form-group'>
        <label>{translate('manage_delegation_policy.authorized_delegatee')}:</label>
        <table className='table table-hover table-bordered detail-policy-attribute-table not-sort'>
          <thead>
            <tr>
              <th className='col-fixed'>{translate('manage_delegation_policy.index')}</th>
              <th>{translate('manage_delegation_policy.authorized_delegatee_name')}</th>
              <th>{translate('manage_delegation_policy.authorized_delegatee_type')}</th>
              <th>{translate('manage_delegation_policy.attributes_information')}</th>
            </tr>
          </thead>
          <tbody>
            {!authorizedDelegatees || authorizedDelegatees.length <= 0
              ? null
              : authorizedDelegatees.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>

                      <td> {item.name}</td>
                      <td> {item.type}</td>
                      <td>
                        <pre>{prettyAttributes(item.attributes)}</pre>
                      </td>
                    </tr>
                  )
                })}
          </tbody>
        </table>
        {(!authorizedDelegatees || authorizedDelegatees.length === 0) && (
          <div className='table-info-panel'>{translate('confirm.no_data')}</div>
        )}
      </div>
      {/* Authorized roles */}
      <div className='form-group'>
        <label>{translate('manage_delegation_policy.authorized_delegateObject')}:</label>
        <table className='table table-hover table-bordered detail-policy-attribute-table not-sort'>
          <thead>
            <tr>
              <th className='col-fixed'>{translate('manage_delegation_policy.index')}</th>
              <th>{translate('manage_delegation_policy.authorized_delegateObject_name')}</th>
              <th>{translate('manage_delegation_policy.authorized_delegateObject_type')}</th>
              <th>{translate('manage_delegation_policy.attributes_information')}</th>
            </tr>
          </thead>
          <tbody>
            {!authorizedDelegateObjects || authorizedDelegateObjects.length <= 0
              ? null
              : authorizedDelegateObjects.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td> {item.name}</td>
                      <td> {item.type}</td>
                      <td>
                        <pre>{prettyAttributes(item.attributes)}</pre>
                      </td>
                    </tr>
                  )
                })}
          </tbody>
        </table>
        {(!authorizedDelegateObjects || authorizedDelegateObjects.length === 0) && <div className='table-info-panel'>{translate('confirm.no_data')}</div>}
      </div>
    </div>
  )
}
