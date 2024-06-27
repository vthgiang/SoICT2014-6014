import React, { useState, useEffect } from 'react'
import { AttributeAddForm } from './attributeAddForm'
import './policyAttributeTable.css'
import { useTranslate } from 'react-redux-multilingual'
import { useSelector } from 'react-redux'

export function AttributeTableTab(props) {
  const translate = useTranslate()
  const attribute = useSelector((x) => x.attribute)
  const [state, setState] = useState({
    requesterAttributes: [],
    roleAttributes: [],
    userRule: '',
    roleRule: ''
  })

  useEffect(() => {
    if (props.policyID !== state.policyID) {
      setState({
        ...state,
        policyID: props.policyID,
        requesterAttributes: props.requesterAttributes,
        roleAttributes: props.roleAttributes,
        resourceAttributes: props.resourceAttributes,
        environmentAttributes: props.environmentAttributes,
        requesterRule: props.requesterRule,
        roleRule: props.roleRule,
        resourceRule: props.resourceRule,
        environmentRule: props.environmentRule
      })
    }
  }, [props.policyID])

  const handleChange = (name, value) => {
    setState({
      ...state,
      [name]: value
    })
    props.handleChange(name, value)
  }

  const handleChangeAddRowAttribute = (name, value) => {
    props.handleChangeAddRowAttribute(name, value)
  }

  const {
    requesterAttributes,
    roleAttributes,
    resourceAttributes,
    environmentAttributes,
    requesterRule,
    roleRule,
    resourceRule,
    environmentRule
  } = state

  return (
    <div id={props.id} className='tab-pane'>
      {/* Form thêm thông tin sự cố */}
      <AttributeAddForm
        handleChange={handleChange}
        handleChangeAddRowAttribute={handleChangeAddRowAttribute}
        i={props.i}
        id={`${props.id}-requester`}
        attributeOwner='requesterAttributes'
        ruleOwner='requesterRule'
        translation='manage_authorization_policy.requester'
        policyID={state.policyID}
        attributes={state.requesterAttributes}
        rule={state.requesterRule}
      />

      <AttributeAddForm
        handleChange={handleChange}
        handleChangeAddRowAttribute={handleChangeAddRowAttribute}
        i={props.i}
        id={`${props.id}-role`}
        attributeOwner='roleAttributes'
        ruleOwner='roleRule'
        translation='manage_authorization_policy.role'
        policyID={state.policyID}
        attributes={state.roleAttributes}
        rule={state.roleRule}
      />

      <AttributeAddForm
        handleChange={handleChange}
        handleChangeAddRowAttribute={handleChangeAddRowAttribute}
        i={props.i}
        id={`${props.id}-resource`}
        attributeOwner='resourceAttributes'
        ruleOwner='resourceRule'
        translation='manage_authorization_policy.resource'
        policyID={state.policyID}
        attributes={state.resourceAttributes}
        rule={state.resourceRule}
      />

      <AttributeAddForm
        handleChange={handleChange}
        handleChangeAddRowAttribute={handleChangeAddRowAttribute}
        i={props.i}
        id={`${props.id}-environment`}
        attributeOwner='environmentAttributes'
        ruleOwner='environmentRule'
        translation='manage_authorization_policy.environment'
        policyID={state.policyID}
        attributes={state.environmentAttributes}
        rule={state.environmentRule}
      />

      <table className='table table-bordered policy-attribute-table not-sort'>
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
            <th style={{ width: '100px', textAlign: 'center' }}>{translate('table.action')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td rowSpan={!requesterAttributes || requesterAttributes.length == 0 ? 1 : requesterAttributes.length}>
              {translate('manage_authorization_policy.requester_table')}
            </td>
            {!requesterAttributes || requesterAttributes.length == 0 ? (
              <td colSpan={3}>
                <center> {translate('table.no_data')}</center>
              </td>
            ) : (
              <>
                <td rowSpan={requesterAttributes.length}>{requesterRule}</td>
                <td>{attribute.lists.map((a) => (a._id == requesterAttributes[0].attributeId ? a.attributeName : ''))}</td>
                <td>{requesterAttributes[0].value}</td>
              </>
            )}
            <td rowSpan={!requesterAttributes || requesterAttributes.length == 0 ? 1 : requesterAttributes.length}>
              {!requesterAttributes || requesterAttributes.length == 0 ? (
                <a
                  href='#add-attributes'
                  className='text-green'
                  onClick={() => window.$(`#modal-add-attribute-${props.id}-requester`).modal('show')}
                  title={translate('manage_authorization_policy.add_requester_attribute')}
                >
                  <i className='material-icons'>add_box</i>
                </a>
              ) : (
                <a
                  onClick={() => window.$(`#modal-add-attribute-${props.id}-requester`).modal('show')}
                  className='edit text-yellow'
                  style={{ width: '5px' }}
                  title={translate('manage_authorization_policy.edit_requester_attribute')}
                >
                  <i className='material-icons'>edit</i>
                </a>
              )}
            </td>
          </tr>
          {!requesterAttributes || requesterAttributes.length <= 1
            ? null
            : requesterAttributes.slice(1).map((attr, index) => {
                return (
                  <tr key={index}>
                    <td>{attribute.lists.map((a) => (a._id == attr.attributeId ? a.attributeName : ''))}</td>

                    <td style={{ textAlign: 'left' }}>{attr.value}</td>
                  </tr>
                )
              })}

          <tr>
            <td rowSpan={!roleAttributes || roleAttributes.length == 0 ? 1 : roleAttributes.length}>
              {translate('manage_authorization_policy.role_table')}
            </td>
            {!roleAttributes || roleAttributes.length == 0 ? (
              <td colSpan={3}>
                <center> {translate('table.no_data')}</center>
              </td>
            ) : (
              <>
                <td rowSpan={roleAttributes.length}>{roleRule}</td>
                <td>{attribute.lists.map((a) => (a._id == roleAttributes[0].attributeId ? a.attributeName : ''))}</td>
                <td>{roleAttributes[0].value}</td>
              </>
            )}
            <td rowSpan={!roleAttributes || roleAttributes.length == 0 ? 1 : roleAttributes.length}>
              {!roleAttributes || roleAttributes.length == 0 ? (
                <a
                  href='#add-attributes'
                  className='text-green'
                  onClick={() => window.$(`#modal-add-attribute-${props.id}-role`).modal('show')}
                  title={translate('manage_authorization_policy.add_role_attribute')}
                >
                  <i className='material-icons'>add_box</i>
                </a>
              ) : (
                <a
                  onClick={() => window.$(`#modal-add-attribute-${props.id}-role`).modal('show')}
                  className='edit text-yellow'
                  style={{ width: '5px' }}
                  title={translate('manage_authorization_policy.edit_role_attribute')}
                >
                  <i className='material-icons'>edit</i>
                </a>
              )}
            </td>
          </tr>
          {!roleAttributes || roleAttributes.length <= 1
            ? null
            : roleAttributes.slice(1).map((attr, index) => {
                return (
                  <tr key={index}>
                    <td>{attribute.lists.map((a) => (a._id == attr.attributeId ? a.attributeName : ''))}</td>

                    <td style={{ textAlign: 'left' }}>{attr.value}</td>
                  </tr>
                )
              })}

          <tr>
            <td rowSpan={!resourceAttributes || resourceAttributes.length == 0 ? 1 : resourceAttributes.length}>
              {translate('manage_authorization_policy.resource_table')}
            </td>
            {!resourceAttributes || resourceAttributes.length == 0 ? (
              <td colSpan={3}>
                <center> {translate('table.no_data')}</center>
              </td>
            ) : (
              <>
                <td rowSpan={resourceAttributes.length}>{resourceRule}</td>
                <td>{attribute.lists.map((a) => (a._id == resourceAttributes[0].attributeId ? a.attributeName : ''))}</td>
                <td>{resourceAttributes[0].value}</td>
              </>
            )}
            <td rowSpan={!resourceAttributes || resourceAttributes.length == 0 ? 1 : resourceAttributes.length}>
              {!resourceAttributes || resourceAttributes.length == 0 ? (
                <a
                  href='#add-attributes'
                  className='text-green'
                  onClick={() => window.$(`#modal-add-attribute-${props.id}-resource`).modal('show')}
                  title={translate('manage_authorization_policy.add_resource_attribute')}
                >
                  <i className='material-icons'>add_box</i>
                </a>
              ) : (
                <a
                  onClick={() => window.$(`#modal-add-attribute-${props.id}-resource`).modal('show')}
                  className='edit text-yellow'
                  style={{ width: '5px' }}
                  title={translate('manage_authorization_policy.edit_resource_attribute')}
                >
                  <i className='material-icons'>edit</i>
                </a>
              )}
            </td>
          </tr>
          {!resourceAttributes || resourceAttributes.length <= 1
            ? null
            : resourceAttributes.slice(1).map((attr, index) => {
                return (
                  <tr key={index}>
                    <td>{attribute.lists.map((a) => (a._id == attr.attributeId ? a.attributeName : ''))}</td>

                    <td style={{ textAlign: 'left' }}>{attr.value}</td>
                  </tr>
                )
              })}

          <tr>
            <td rowSpan={!environmentAttributes || environmentAttributes.length == 0 ? 1 : environmentAttributes.length}>
              {translate('manage_authorization_policy.environment_table')}
            </td>
            {!environmentAttributes || environmentAttributes.length == 0 ? (
              <td colSpan={3}>
                <center> {translate('table.no_data')}</center>
              </td>
            ) : (
              <>
                <td rowSpan={environmentAttributes.length}>{environmentRule}</td>
                <td>{attribute.lists.map((a) => (a._id == environmentAttributes[0].attributeId ? a.attributeName : ''))}</td>
                <td>{environmentAttributes[0].value}</td>
              </>
            )}
            <td rowSpan={!environmentAttributes || environmentAttributes.length == 0 ? 1 : environmentAttributes.length}>
              {!environmentAttributes || environmentAttributes.length == 0 ? (
                <a
                  href='#add-attributes'
                  className='text-green'
                  onClick={() => window.$(`#modal-add-attribute-${props.id}-environment`).modal('show')}
                  title={translate('manage_authorization_policy.add_environment_attribute')}
                >
                  <i className='material-icons'>add_box</i>
                </a>
              ) : (
                <a
                  onClick={() => window.$(`#modal-add-attribute-${props.id}-environment`).modal('show')}
                  className='edit text-yellow'
                  style={{ width: '5px' }}
                  title={translate('manage_authorization_policy.edit_environment_attribute')}
                >
                  <i className='material-icons'>edit</i>
                </a>
              )}
            </td>
          </tr>
          {!environmentAttributes || environmentAttributes.length <= 1
            ? null
            : environmentAttributes.slice(1).map((attr, index) => {
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
  )
}
