import React, { useEffect, useState } from 'react'
import { useTranslate } from 'react-redux-multilingual'
import { DialogModal } from '../../../../common-components'
import ValidationHelper from '../../../../helpers/validationHelper'
import { GeneralTab } from '../components/generalTab'
import { AttributeTableTab } from '../components/attributeTableTab'
import { AuthorizedObjectTab } from './authorizedObjectTab'

export function FinalEditPolicy(props) {
  const translate = useTranslate()
  // Khởi tạo state
  const [state, setState] = useState({
    index: 0
  })

  useEffect(() => {
    setState((state) => ({
      ...state,
      index: state.index + 1
    }))
  }, [props])
  
  const { id, next } = props
  const {
    name,
    description,
    delegatorAttributes,
    delegateObjectAttributes,
    delegateeAttributes,
    environmentAttributes,
    delegatorRule,
    delegateObjectRule,
    delegateeRule,
    environmentRule,
    i,
    handleChange,
    handleChangeAddRowAttribute
  } = props

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
      !validateAttributes(delegateObjectAttributes) ||
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
    next()
  }

  return (
    <DialogModal
      modalID={`modal-${id}`}
      isLoading={false}
      formID={`form-${id}`}
      title={translate('manage_delegation_policy.add_title')}
      msg_success={translate('manage_delegation_policy.add_success')}
      msg_failure={translate('manage_delegation_policy.add_fail')}
      func={save}
      disableSubmit={!isFormValidated()}
      size={75}
      maxWidth={850}
    >
      <div className='nav-tabs-custom' style={{ marginTop: '-15px' }}>
        {/* Nav-tabs */}
        <ul className='nav nav-tabs'>
          <li className='active'>
            <a title={translate('manage_delegation_policy.general_information')} data-toggle='tab' href={`#${id}-create-general`}>
              {translate('manage_delegation_policy.general_information')}
            </a>
          </li>
          <li>
            <a title={translate('manage_delegation_policy.attributes_information')} data-toggle='tab' href={`#${id}-create-attributes`}>
              {translate('manage_delegation_policy.attributes_information')}
            </a>
          </li>
          <li>
            <a title={translate('manage_delegation_policy.authorized_information')} data-toggle='tab' href={`#${id}-authorized-object`}>
              {translate('manage_delegation_policy.authorized_information')}
            </a>
          </li>
        </ul>

        <div className='tab-content'>
          {/* Thông tin chung */}
          <GeneralTab
            id={`${id}-create-general`}
            policyID={`${id}-${state.index}`}
            handleChange={handleChange}
            name={name}
            description={description}
          />

          {/* Thông tin thuộc tính */}
          <AttributeTableTab
            id={`${id}-create-attributes`}
            policyID={`${id}-${state.index}`}
            i={i}
            handleChange={handleChange}
            handleChangeAddRowAttribute={handleChangeAddRowAttribute}
            delegatorAttributes={delegatorAttributes}
            delegateObjectAttributes={delegateObjectAttributes}
            delegateeAttributes={delegateeAttributes}
            environmentAttributes={environmentAttributes}
            delegatorRule={delegatorRule}
            delegateObjectRule={delegateObjectRule}
            delegateeRule={delegateeRule}
            environmentRule={environmentRule}
          />

          <AuthorizedObjectTab
            id={`${id}-authorized-object`}
            delegatorAttributes={delegatorAttributes}
            delegateObjectAttributes={delegateObjectAttributes}
            delegateeAttributes={delegateeAttributes}
            delegatorRule={delegatorRule}
            delegateObjectRule={delegateObjectRule}
            delegateeRule={delegateeRule}
          />
        </div>
      </div>
    </DialogModal>
  )
}