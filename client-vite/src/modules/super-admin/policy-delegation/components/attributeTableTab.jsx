import React, { useState, useEffect } from 'react'
import { AttributeAddForm } from './attributeAddForm'
import './policyAttributeTable.css'
import { useTranslate } from 'react-redux-multilingual'
import { useSelector } from 'react-redux'

export function AttributeTableTab(props) {
  const translate = useTranslate()
  const attribute = useSelector((x) => x.attribute)
  const [state, setState] = useState({
    delegatorAttributes: [],
    delegateObjectAttributes: [],
    userRule: '',
    delegateObjectRule: ''
  })

  useEffect(() => {
    if (props.policyID !== state.policyID) {
      setState({
        ...state,
        policyID: props.policyID,
        delegatorAttributes: props.delegatorAttributes,
        delegateObjectAttributes: props.delegateObjectAttributes,
        delegateeAttributes: props.delegateeAttributes,
        environmentAttributes: props.environmentAttributes,
        delegatorRule: props.delegatorRule,
        delegateObjectRule: props.delegateObjectRule,
        delegateeRule: props.delegateeRule,
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
    delegatorAttributes,
    delegateObjectAttributes,
    delegateeAttributes,
    environmentAttributes,
    delegatorRule,
    delegateObjectRule,
    delegateeRule,
    environmentRule
  } = state

  return (
    <div id={props.id} className='tab-pane'>
      {/* Form thêm thông tin sự cố */}
      <AttributeAddForm
        handleChange={handleChange}
        handleChangeAddRowAttribute={handleChangeAddRowAttribute}
        i={props.i}
        id={`${props.id}-delegator`}
        attributeOwner='delegatorAttributes'
        ruleOwner='delegatorRule'
        translation='manage_delegation_policy.delegator'
        policyID={state.policyID}
        attributes={state.delegatorAttributes}
        rule={state.delegatorRule}
      />

      <AttributeAddForm
        handleChange={handleChange}
        handleChangeAddRowAttribute={handleChangeAddRowAttribute}
        i={props.i}
        id={`${props.id}-delegateObject`}
        attributeOwner='delegateObjectAttributes'
        ruleOwner='delegateObjectRule'
        translation='manage_delegation_policy.delegate_object'
        policyID={state.policyID}
        attributes={state.delegateObjectAttributes}
        rule={state.delegateObjectRule}
      />

      <AttributeAddForm
        handleChange={handleChange}
        handleChangeAddRowAttribute={handleChangeAddRowAttribute}
        i={props.i}
        id={`${props.id}-delegatee`}
        attributeOwner='delegateeAttributes'
        ruleOwner='delegateeRule'
        translation='manage_delegation_policy.delegatee'
        policyID={state.policyID}
        attributes={state.delegateeAttributes}
        rule={state.delegateeRule}
      />

      <AttributeAddForm
        handleChange={handleChange}
        handleChangeAddRowAttribute={handleChangeAddRowAttribute}
        i={props.i}
        id={`${props.id}-environment`}
        attributeOwner='environmentAttributes'
        ruleOwner='environmentRule'
        translation='manage_delegation_policy.environment'
        policyID={state.policyID}
        attributes={state.environmentAttributes}
        rule={state.environmentRule}
      />

      <table className='table table-bordered policy-attribute-table not-sort'>
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
            <th style={{ width: '100px', textAlign: 'center' }}>{translate('table.action')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td rowSpan={!delegatorAttributes || delegatorAttributes.length == 0 ? 1 : delegatorAttributes.length}>
              {translate('manage_delegation_policy.delegator_table')}
            </td>
            {!delegatorAttributes || delegatorAttributes.length == 0 ? (
              <td colSpan={3}>
                <center> {translate('table.no_data')}</center>
              </td>
            ) : (
              <>
                <td rowSpan={delegatorAttributes.length}>{delegatorRule}</td>
                <td>{attribute.lists.map((a) => (a._id == delegatorAttributes[0].attributeId ? a.attributeName : ''))}</td>
                <td>{delegatorAttributes[0].value}</td>
              </>
            )}
            <td rowSpan={!delegatorAttributes || delegatorAttributes.length == 0 ? 1 : delegatorAttributes.length}>
              {!delegatorAttributes || delegatorAttributes.length == 0 ? (
                <a
                  href='#add-attributes'
                  className='text-green'
                  onClick={() => window.$(`#modal-add-attribute-${props.id}-delegator`).modal('show')}
                  title={translate('manage_delegation_policy.add_delegator_attribute')}
                >
                  <i className='material-icons'>add_box</i>
                </a>
              ) : (
                <a
                  onClick={() => window.$(`#modal-add-attribute-${props.id}-delegator`).modal('show')}
                  className='edit text-yellow'
                  style={{ width: '5px' }}
                  title={translate('manage_delegation_policy.edit_delegator_attribute')}
                >
                  <i className='material-icons'>edit</i>
                </a>
              )}
            </td>
          </tr>
          {!delegatorAttributes || delegatorAttributes.length <= 1
            ? null
            : delegatorAttributes.slice(1).map((attr, index) => {
                return (
                  <tr key={index}>
                    <td>{attribute.lists.map((a) => (a._id == attr.attributeId ? a.attributeName : ''))}</td>

                    <td style={{ textAlign: 'left' }}>{attr.value}</td>
                  </tr>
                )
              })}

          <tr>
            <td rowSpan={!delegateObjectAttributes || delegateObjectAttributes.length == 0 ? 1 : delegateObjectAttributes.length}>
              {translate('manage_delegation_policy.delegate_object_table')}
            </td>
            {!delegateObjectAttributes || delegateObjectAttributes.length == 0 ? (
              <td colSpan={3}>
                <center> {translate('table.no_data')}</center>
              </td>
            ) : (
              <>
                <td rowSpan={delegateObjectAttributes.length}>{delegateObjectRule}</td>
                <td>{attribute.lists.map((a) => (a._id == delegateObjectAttributes[0].attributeId ? a.attributeName : ''))}</td>
                <td>{delegateObjectAttributes[0].value}</td>
              </>
            )}
            <td rowSpan={!delegateObjectAttributes || delegateObjectAttributes.length == 0 ? 1 : delegateObjectAttributes.length}>
              {!delegateObjectAttributes || delegateObjectAttributes.length == 0 ? (
                <a
                  href='#add-attributes'
                  className='text-green'
                  onClick={() => window.$(`#modal-add-attribute-${props.id}-delegateObject`).modal('show')}
                  title={translate('manage_delegation_policy.add_delegate_object_attribute')}
                >
                  <i className='material-icons'>add_box</i>
                </a>
              ) : (
                <a
                  onClick={() => window.$(`#modal-add-attribute-${props.id}-delegateObject`).modal('show')}
                  className='edit text-yellow'
                  style={{ width: '5px' }}
                  title={translate('manage_delegation_policy.edit_delegate_object_attribute')}
                >
                  <i className='material-icons'>edit</i>
                </a>
              )}
            </td>
          </tr>
          {!delegateObjectAttributes || delegateObjectAttributes.length <= 1
            ? null
            : delegateObjectAttributes.slice(1).map((attr, index) => {
                return (
                  <tr key={index}>
                    <td>{attribute.lists.map((a) => (a._id == attr.attributeId ? a.attributeName : ''))}</td>

                    <td style={{ textAlign: 'left' }}>{attr.value}</td>
                  </tr>
                )
              })}

          <tr>
            <td rowSpan={!delegateeAttributes || delegateeAttributes.length == 0 ? 1 : delegateeAttributes.length}>
              {translate('manage_delegation_policy.delegatee_table')}
            </td>
            {!delegateeAttributes || delegateeAttributes.length == 0 ? (
              <td colSpan={3}>
                <center> {translate('table.no_data')}</center>
              </td>
            ) : (
              <>
                <td rowSpan={delegateeAttributes.length}>{delegateeRule}</td>
                <td>{attribute.lists.map((a) => (a._id == delegateeAttributes[0].attributeId ? a.attributeName : ''))}</td>
                <td>{delegateeAttributes[0].value}</td>
              </>
            )}
            <td rowSpan={!delegateeAttributes || delegateeAttributes.length == 0 ? 1 : delegateeAttributes.length}>
              {!delegateeAttributes || delegateeAttributes.length == 0 ? (
                <a
                  href='#add-attributes'
                  className='text-green'
                  onClick={() => window.$(`#modal-add-attribute-${props.id}-delegatee`).modal('show')}
                  title={translate('manage_delegation_policy.add_delegatee_attribute')}
                >
                  <i className='material-icons'>add_box</i>
                </a>
              ) : (
                <a
                  onClick={() => window.$(`#modal-add-attribute-${props.id}-delegatee`).modal('show')}
                  className='edit text-yellow'
                  style={{ width: '5px' }}
                  title={translate('manage_delegation_policy.edit_delegatee_attribute')}
                >
                  <i className='material-icons'>edit</i>
                </a>
              )}
            </td>
          </tr>
          {!delegateeAttributes || delegateeAttributes.length <= 1
            ? null
            : delegateeAttributes.slice(1).map((attr, index) => {
                return (
                  <tr key={index}>
                    <td>{attribute.lists.map((a) => (a._id == attr.attributeId ? a.attributeName : ''))}</td>

                    <td style={{ textAlign: 'left' }}>{attr.value}</td>
                  </tr>
                )
              })}

          <tr>
            <td rowSpan={!environmentAttributes || environmentAttributes.length == 0 ? 1 : environmentAttributes.length}>
              {translate('manage_delegation_policy.environment_table')}
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
                  title={translate('manage_delegation_policy.add_environment_attribute')}
                >
                  <i className='material-icons'>add_box</i>
                </a>
              ) : (
                <a
                  onClick={() => window.$(`#modal-add-attribute-${props.id}-environment`).modal('show')}
                  className='edit text-yellow'
                  style={{ width: '5px' }}
                  title={translate('manage_delegation_policy.edit_environment_attribute')}
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
