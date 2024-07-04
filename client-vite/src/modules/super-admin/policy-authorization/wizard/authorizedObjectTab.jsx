import React from 'react'
import { useSelector } from 'react-redux'

import { useTranslate } from 'react-redux-multilingual'

export function AuthorizedObjectTab(props) {
  const translate = useTranslate()

  const { requesterAttributes, roleAttributes, resourceAttributes, requesterRule, roleRule, resourceRule } = props

  const allRequester = useSelector((x) => x.requester.list)
  const allResource = useSelector((x) => x.resource.list)
  const allRole = useSelector((x) => x.role.list)
  const attributeList = useSelector((x) => x.attribute.lists.filter((x) => ['Mixed', 'Authorization'].includes(x.type)))
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

  const authorizedRequesters = ruleCheck(allRequester, requesterAttributes, requesterRule)
  const authorizedResources = ruleCheck(allResource, resourceAttributes, resourceRule)
  const authorizedRoles = ruleCheck(allRole, roleAttributes, roleRule)

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
        <label>{translate('manage_authorization_policy.authorized_requester')}:</label>
        <table className='table table-hover table-bordered detail-policy-attribute-table not-sort'>
          <thead>
            <tr>
              <th className='col-fixed'>{translate('manage_authorization_policy.index')}</th>
              <th>{translate('manage_authorization_policy.authorized_requester_name')}</th>
              <th>{translate('manage_authorization_policy.authorized_requester_type')}</th>
              <th>{translate('manage_authorization_policy.attributes_information')}</th>
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
                      <td>
                        <pre>{prettyAttributes(item.attributes)}</pre>
                      </td>
                    </tr>
                  )
                })}
          </tbody>
        </table>
        {(!authorizedRequesters || authorizedRequesters.length === 0) && (
          <div className='table-info-panel'>{translate('confirm.no_data')}</div>
        )}
      </div>
      {/* Authorized resources */}
      <div className='form-group'>
        <label>{translate('manage_authorization_policy.authorized_resource')}:</label>
        <table className='table table-hover table-bordered detail-policy-attribute-table not-sort'>
          <thead>
            <tr>
              <th className='col-fixed'>{translate('manage_authorization_policy.index')}</th>
              <th>{translate('manage_authorization_policy.authorized_resource_name')}</th>
              <th>{translate('manage_authorization_policy.authorized_resource_type')}</th>
              <th>{translate('manage_authorization_policy.attributes_information')}</th>
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
                        <pre>{prettyAttributes(item.attributes)}</pre>
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
      {/* Authorized roles */}
      <div className='form-group'>
        <label>{translate('manage_authorization_policy.authorized_role')}:</label>
        <table className='table table-hover table-bordered detail-policy-attribute-table not-sort'>
          <thead>
            <tr>
              <th className='col-fixed'>{translate('manage_authorization_policy.index')}</th>
              <th>{translate('manage_authorization_policy.authorized_role_name')}</th>
              <th>{translate('manage_authorization_policy.attributes_information')}</th>
            </tr>
          </thead>
          <tbody>
            {!authorizedRoles || authorizedRoles.length <= 0
              ? null
              : authorizedRoles.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td> {item.name}</td>
                      <td>
                        <pre>{prettyAttributes(item.attributes)}</pre>
                      </td>
                    </tr>
                  )
                })}
          </tbody>
        </table>
        {(!authorizedRoles || authorizedRoles.length === 0) && <div className='table-info-panel'>{translate('confirm.no_data')}</div>}
      </div>
    </div>
  )
}
