import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { useTranslate } from 'react-redux-multilingual'
import { SelectBox } from '../../../../common-components'
import './policyWizard.css'
import { POLICY_ATTRIBUTE_RULE_CHECK } from '../../../../helpers/constants'

export function ProposedRequirement(props) {
  const translate = useTranslate()
  const EQUALS = 'EQUALS'
  const CONTAINS = 'CONTAINS'
  const BELONGS = 'BELONGS'
  // Khởi tạo state
  const [state, setState] = useState({
    selectedObjects: [],
    equalAttributes: [],
    containAttributes: [],
    belongAttributes: [],
    emptyAttributesError: '',
    errorRule: '',
    selectedRule: ''
  })
  const attributeList = useSelector((x) => x.attribute.lists)
  const { updateRequirement, selectedObjects, title } = props
  const hasEmptyAttributes = (selectedObjects = []) => {
    for (let i = 0; i < selectedObjects.length; i++) {
      if (!selectedObjects[i].attributes || !selectedObjects[i].attributes.length) {
        setState((state) => ({
          ...state,
          emptyAttributesError: `Assigns attributes to ${selectedObjects[i].name} to automatically suggest requirements. Otherwise, you will edit the requirements yourself in the “Edit policy” step.`
        }))
        return true
      }
    }
    return false
  }

  const calculateSuggestRequirement = (selectedObjects = []) => {
    if (hasEmptyAttributes(selectedObjects) || !selectedObjects || selectedObjects.length == 0) {
      return {
        canEqual: false,
        equalAttributes: [],
        canContain: false,
        containAttributes: [],
        canBelong: false,
        belongAttributes: []
      }
    }
    let canEqual = true
    let canContain = true
    let canBelong = true
    const attributeIds = new Set()
    const keyValue = []
    selectedObjects.forEach((x) => {
      x.attributes?.forEach((y) => {
        attributeIds.add(y.attributeId)
        keyValue.push({ id: y.attributeId, value: y.value })
      })
    })

    const totalObjects = selectedObjects.length
    const equalAttributes = []
    const containAttributes = []
    const belongAttributes = []
    attributeIds.forEach((id) => {
      const values = keyValue.filter((x) => x.id == id).map((x) => x.value)
      const uniqueValues = new Set(values)
      if (values.length < totalObjects) {
        canEqual = false
      }
      if (uniqueValues.size > 1) {
        canEqual = false
        canBelong = false
      }
      if (uniqueValues.size == 1) {
        const attribute = { attributeId: id, value: uniqueValues.values().next().value }
        if (values.length == totalObjects) {
          equalAttributes.push(attribute)
          containAttributes.push(attribute)
        }
        belongAttributes.push(attribute)
      }
    })

    canContain = containAttributes.length > 0

    return {
      canEqual,
      equalAttributes,
      canContain,
      containAttributes,
      canBelong,
      belongAttributes
    }
  }

  const getProposedAttributesByRule = (rule) => {
    if (rule === EQUALS) {
      return state.canEqual ? state.equalAttributes : []
    }
    if (rule === BELONGS) {
      return state.canBelong ? state.belongAttributes : []
    }
    if (rule === CONTAINS) {
      return state.canContain ? state.containAttributes : []
    }
    return []
  }

  useEffect(() => {
    setState((state) => ({
      ...state,
      emptyAttributesError: '',
      errorRule: '',
      selectedRule: ''
    }))
    const { canEqual, equalAttributes, canContain, containAttributes, canBelong, belongAttributes } =
      calculateSuggestRequirement(selectedObjects)
    let selectedRule = ''
    let errorRule = ''
    if (canEqual) {
      selectedRule = EQUALS
      updateRequirement(selectedRule, equalAttributes)
    } else if (canContain) {
      selectedRule = CONTAINS
      updateRequirement(selectedRule, containAttributes)
    } else if (canBelong) {
      selectedRule = BELONGS
      updateRequirement(selectedRule, belongAttributes)
    } else {
      if (selectedObjects?.length) {
        errorRule = 'Impossible to proposed requirement with all rules'
      }
      selectedRule = ''
      updateRequirement(selectedRule, [])
    }
    setState((state) => ({
      ...state,
      canEqual,
      equalAttributes,
      canContain,
      containAttributes,
      canBelong,
      belongAttributes,
      selectedRule,
      errorRule,
      selectedObjects
    }))
  }, [selectedObjects])

  const getAttributeNameById = (id) => {
    const attributeName = attributeList.find((x) => x._id === id)?.attributeName
    return attributeName
  }

  const handleChangeAttributeRule = (e) => {
    validateAttributeRule(e[0])
  }

  const validateAttributeRule = (value, willUpdateState = true) => {
    let msg
    if (!value) {
      msg = translate('manage_authorization_policy.rule_not_selected')
    }
    if (willUpdateState) {
      let { selectedRule } = state
      selectedRule = value
      if (selectedRule === EQUALS && !state.canEqual) {
        msg = 'Impossible to proposed requirement with EQUALS rule'
      }
      if (selectedRule === BELONGS && !state.canBelong) {
        msg = 'Impossible to proposed requirement with BELONGS rule'
      }
      if (selectedRule === CONTAINS && !state.canContain) {
        msg = 'Impossible to proposed requirement with CONTAINS rule'
      }
      setState((state) => {
        return {
          ...state,
          selectedRule,
          errorRule: msg
        }
      })
      updateRequirement(selectedRule, getProposedAttributesByRule(selectedRule))
    }
    return msg === undefined
  }

  return (
    <div className='row'>
      <div className='form-group col-sm-12 authorization-wizard-row'>
        {state.emptyAttributesError && <div className='authorization-wizard-description text-red'>{state.emptyAttributesError}</div>}
        <label>
          <div className='authorization-wizard-title'>{title}</div>
          <div className='authorization-wizard-description'>{translate('manage_authorization_policy.wizard.requirement_description')}</div>
          <div className='authorization-wizard-description'>{translate('manage_authorization_policy.wizard.requirement_note')}</div>
        </label>
        {/* Select rule */}
        <div className='col-sm-5'>
          <label>
            <div className='authorization-wizard-subtitle'>{translate('manage_authorization_policy.add_rule')}</div>
            <div className='authorization-wizard-description'>{translate('manage_authorization_policy.wizard.rule_description')}</div>
          </label>
          <SelectBox
            id={`modal-proposed-rule-${props.id}`}
            className='form-control select2'
            style={{ width: '100%' }}
            value={state.selectedRule}
            items={POLICY_ATTRIBUTE_RULE_CHECK.map((rule) => {
              return { value: rule.name, text: `${rule.value} (${translate(`manage_authorization_policy.rule.${rule.name}`)})` }
            })}
            onChange={handleChangeAttributeRule}
            multiple={false}
            options={{ placeholder: translate('manage_authorization_policy.rule_select') }}
          />
          {state.errorRule && <div className='authorization-wizard-description text-red'>{state.errorRule}</div>}
        </div>
        <div className='col-sm-7'>
          <label>
            <div className='authorization-wizard-subtitle'>{translate('manage_authorization_policy.wizard.proposed_attributes')}</div>
          </label>
          <table className='table table-hover table-striped table-bordered'>
            <thead>
              <tr>
                <th>{translate('manage_authorization_policy.wizard.name')}</th>
                <th>{translate('manage_authorization_policy.wizard.value')}</th>
              </tr>
            </thead>
            <tbody>
              {getProposedAttributesByRule(state.selectedRule).map((x) => (
                <tr key={x.attributeId + x.value}>
                  <td>{getAttributeNameById(x.attributeId)}</td>
                  <td>{x.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
