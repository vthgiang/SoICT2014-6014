import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useTranslate } from 'react-redux-multilingual'
import { DialogModal } from '../../../../common-components'
import { GeneralTab } from './generalTab'
import { AttributeTableTab } from './attributeTableTab'
import ValidationHelper from '../../../../helpers/validationHelper'
import { AttributeActions } from '../../attribute/redux/actions'
import { PolicyActions } from '../redux/actions'

export function PolicyEditForm(props) {
  const translate = useTranslate()
  const policyDelegation = useSelector((x) => x.policyDelegation)
  const dispatch = useDispatch()
  // Khởi tạo state
  const [state, setState] = useState({
    name: '',
    description: '',
    effect: 'Allow',
    effectiveStartTime: Date.now(),
    effectiveEndTime: undefined,
    delegatorAttributes: [],
    delegateObjectAttributes: [],
    delegateeAttributes: [],
    environmentAttributes: [],
    delegatorRule: '',
    delegateObjectRule: '',
    delegateeRule: '',
    environmentRule: ''
  })

  // setState từ props mới
  useEffect(() => {
    if (props.policyID !== state.policyID) {
      setState({
        ...state,
        policyID: props.policyID,
        name: props.name,
        description: props.description,
        effect: props.effect,
        effectiveStartTime: props.effectiveStartTime,
        effectiveEndTime: props.effectiveEndTime,
        delegatorAttributes: props.delegatorAttributes.map((a) => (a = { ...a, addOrder: a._id })),
        delegateObjectAttributes: props.delegateObjectAttributes.map((a) => (a = { ...a, addOrder: a._id })),
        delegateeAttributes: props.delegateeAttributes.map((a) => (a = { ...a, addOrder: a._id })),
        environmentAttributes: props.environmentAttributes.map((a) => (a = { ...a, addOrder: a._id })),
        delegatorRule: props.delegatorRule,
        delegateObjectRule: props.delegateObjectRule,
        delegateeRule: props.delegateeRule,
        environmentRule: props.environmentRule
      })
    }
  }, [props.policyID])

  const {
    policyID,
    name,
    description,
    effect,
    effectiveStartTime,
    effectiveEndTime,
    delegatorRule,
    delegateObjectRule,
    delegateeRule,
    environmentRule,
    delegatorAttributes,
    delegateObjectAttributes,
    delegateeAttributes,
    environmentAttributes
  } = state

  const handleChange = (name, value) => {
    setState({
      ...state,
      [name]: value
    })
  }

  const handleChangeAddRowAttribute = (name, value) => {
    props.handleChangeAddRowAttribute(name, value)
  }

  useEffect(() => {
    dispatch(AttributeActions.getAttributes())
  }, [])

  const validateAttributes = (attributes, notEmpty = false) => {
    if (notEmpty && attributes.length === 0) {
      return false
    }
    if (attributes.length !== 0) {
      for (let i = 0; i < attributes.length; i++) {
        if (
          !ValidationHelper.validateEmpty(translate, attributes[i].attributeId).status ||
          !ValidationHelper.validateEmpty(translate, attributes[i].value).status
        ) {
          return false
        }
      }
    }
    return true
  }

  /**
   * Hàm dùng để kiểm tra xem form đã được validate hay chưa
   */
  const isFormValidated = () => {
    if (
      !ValidationHelper.validateName(translate, name, 6, 255).status ||
      !validateAttributes(delegatorAttributes, true) ||
      !validateAttributes(delegateeAttributes, true) ||
      !validateAttributes(delegateObjectAttributes, true) ||
      !validateAttributes(environmentAttributes)
    ) {
      return false
    }
    return true
  }

  /**
   * Hàm dùng để lưu thông tin của form và gọi service tạo mới ví dụ
   */
  const save = () => {
    const data = {
      name,
      description,
      effect,
      effectiveStartTime,
      effectiveEndTime,
      delegatorRequirements: {
        attributes: delegatorAttributes,
        rule: delegatorRule
      },
      delegateObjectRequirements: {
        attributes: delegateObjectAttributes,
        rule: delegateObjectRule
      },
      delegateeRequirements: {
        attributes: delegateeAttributes,
        rule: delegateeRule
      },
      environmentRequirements: {
        attributes: environmentAttributes,
        rule: environmentRule
      }
    }
    if (isFormValidated() && name) {
      dispatch(PolicyActions.editPolicy(policyID, data))
    }
  }

  return (
    <DialogModal
      modalID='modal-edit-policy-hooks'
      isLoading={policyDelegation.isLoading}
      formID='form-edit-policy-hooks'
      title={translate('manage_delegation_policy.edit_title')}
      disableSubmit={!isFormValidated}
      func={save}
      size={75}
      maxWidth={850}
    >
      <div className='nav-tabs-custom' style={{ marginTop: '-15px' }}>
        {/* Nav-tabs */}
        <ul className='nav nav-tabs'>
          <li className='active'>
            <a title={translate('manage_delegation_policy.general_information')} data-toggle='tab' href='#edit_general'>
              {translate('manage_delegation_policy.general_information')}
            </a>
          </li>
          <li>
            <a title={translate('manage_delegation_policy.attributes_information')} data-toggle='tab' href='#edit_attributes'>
              {translate('manage_delegation_policy.attributes_information')}
            </a>
          </li>
        </ul>

        <div className='tab-content'>
          {/* Thông tin chung */}
          <GeneralTab id='edit_general' handleChange={handleChange} policyID={policyID} name={state.name} description={state.description} />

          {/* Thông tin thuộc tính */}
          <AttributeTableTab
            id='edit_attributes'
            handleChange={handleChange}
            i={props.i}
            handleChangeAddRowAttribute={handleChangeAddRowAttribute}
            policyID={policyID}
            delegatorAttributes={delegatorAttributes}
            delegateObjectAttributes={delegateObjectAttributes}
            delegateeAttributes={delegateeAttributes}
            environmentAttributes={environmentAttributes}
            delegatorRule={delegatorRule}
            delegateObjectRule={delegateObjectRule}
            delegateeRule={delegateeRule}
            environmentRule={environmentRule}
          />
        </div>
      </div>
    </DialogModal>
  )
}
