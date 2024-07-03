import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useTranslate } from 'react-redux-multilingual'
import { DialogModal } from '../../../../common-components'
import { GeneralTab } from './generalTab'
import { AttributeTableTab } from './attributeTableTab'
import ValidationHelper from '../../../../helpers/validationHelper'
import { AttributeActions } from '../../attribute/redux/actions'
import { PolicyActions } from '../redux/actions'

export function PolicyCreateForm(props) {
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

  const {
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
      !validateAttributes(requesterAttributes, true) ||
      !validateAttributes(resourceAttributes, true) ||
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
      dispatch(PolicyActions.createPolicy([data]))
    }
  }

  return (
    <DialogModal
      modalID='modal-create-policy-hooks'
      isLoading={policyAuthorization.isLoading}
      formID='form-create-policy-hooks'
      title={translate('manage_authorization_policy.add_title')}
      msg_success={translate('manage_authorization_policy.add_success')}
      msg_failure={translate('manage_authorization_policy.add_fail')}
      func={save}
      disableSubmit={!isFormValidated()}
      size={75}
      maxWidth={850}
    >
      <div className='nav-tabs-custom' style={{ marginTop: '-15px' }}>
        {/* Nav-tabs */}
        <ul className='nav nav-tabs'>
          <li className='active'>
            <a title={translate('manage_authorization_policy.general_information')} data-toggle='tab' href='#create_general'>
              {translate('manage_authorization_policy.general_information')}
            </a>
          </li>
          <li>
            <a title={translate('manage_authorization_policy.attributes_information')} data-toggle='tab' href='#create_attributes'>
              {translate('manage_authorization_policy.attributes_information')}
            </a>
          </li>
        </ul>

        <div className='tab-content'>
          {/* Thông tin chung */}
          <GeneralTab id='create_general' handleChange={handleChange} />

          {/* Thông tin thuộc tính */}
          <AttributeTableTab
            id='create_attributes'
            handleChange={handleChange}
            i={props.i}
            handleChangeAddRowAttribute={handleChangeAddRowAttribute}
          />
        </div>
      </div>
    </DialogModal>
  )
}
