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
  const policyAuthorization = useSelector((x) => x.policyAuthorization)
  const dispatch = useDispatch()
  // Khởi tạo state
  const [state, setState] = useState({
    name: '',
    description: '',
    effect: 'Allow',
    effectiveStartTime: Date.now(),
    effectiveEndTime: undefined,
    requesterAttributes: [],
    roleAttributes: [],
    resourceAttributes: [],
    environmentAttributes: [],
    requesterRule: '',
    roleRule: '',
    resourceRule: '',
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
        requesterAttributes: props.requesterAttributes.map((a) => (a = { ...a, addOrder: a._id })),
        roleAttributes: props.roleAttributes.map((a) => (a = { ...a, addOrder: a._id })),
        resourceAttributes: props.resourceAttributes.map((a) => (a = { ...a, addOrder: a._id })),
        environmentAttributes: props.environmentAttributes.map((a) => (a = { ...a, addOrder: a._id })),
        requesterRule: props.requesterRule,
        roleRule: props.roleRule,
        resourceRule: props.resourceRule,
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
    requesterRule,
    roleRule,
    resourceRule,
    environmentRule,
    requesterAttributes,
    roleAttributes,
    resourceAttributes,
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

  const validateAttributes = (attributes) => {
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
      !validateAttributes(requesterAttributes) ||
      !validateAttributes(resourceAttributes) ||
      !validateAttributes(roleAttributes) ||
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
      requesterRequirements: {
        attributes: requesterAttributes,
        rule: requesterRule
      },
      roleRequirements: {
        attributes: roleAttributes,
        rule: roleRule
      },
      resourceRequirements: {
        attributes: resourceAttributes,
        rule: resourceRule
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
      isLoading={policyAuthorization.isLoading}
      formID='form-edit-policy-hooks'
      title={translate('manage_authorization_policy.edit_title')}
      disableSubmit={!isFormValidated}
      func={save}
      size={75}
      maxWidth={850}
    >
      <div className='nav-tabs-custom' style={{ marginTop: '-15px' }}>
        {/* Nav-tabs */}
        <ul className='nav nav-tabs'>
          <li className='active'>
            <a title={translate('manage_authorization_policy.general_information')} data-toggle='tab' href='#edit_general'>
              {translate('manage_authorization_policy.general_information')}
            </a>
          </li>
          <li>
            <a title={translate('manage_authorization_policy.attributes_information')} data-toggle='tab' href='#edit_attributes'>
              {translate('manage_authorization_policy.attributes_information')}
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
            requesterAttributes={requesterAttributes}
            roleAttributes={roleAttributes}
            resourceAttributes={resourceAttributes}
            environmentAttributes={environmentAttributes}
            requesterRule={requesterRule}
            roleRule={roleRule}
            resourceRule={resourceRule}
            environmentRule={environmentRule}
          />
        </div>
      </div>
    </DialogModal>
  )
}
