import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { useTranslate } from 'react-redux-multilingual'
import ValidationHelper from '../../../../helpers/validationHelper'
import { PolicyActions } from '../redux/actions'
import { ChooseRequester } from './chooseRequester'
import { AttributeEditForm } from './attributeEditForm'
import { ChooseResource } from './chooseResource'
import { FinalEditPolicy } from './finalEditPolicy'

export function PolicyWizard(props) {
  const translate = useTranslate()
  const dispatch = useDispatch()
  // Khởi tạo state
  const [state, setState] = useState({
    name: '',
    description: '',
    // selectedRequesters: [],
    // selectedRoles: [],
    // selectedResources: [],
    delegatorAttributes: [],
    delegateObjectAttributes: [],
    delegateeAttributes: [],
    environmentAttributes: [],
    delegatorRule: '',
    delegateObjectRule: '',
    delegateeRule: '',
    environmentRule: ''
  })

  const {
    id,
    i,
    handleChangeAddRowAttribute,
    delegatorDescription,
    delegateeDescription,
    delegateObjectDescription,
    filterDelegator,
    filterDelegatee,
    filterDelegateObject
  } = props

  const handleChange = (name, value) => {
    setState((state) => ({
      ...state,
      [name]: value
    }))
  }

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
      !ValidationHelper.validateName(translate, state.name, 6, 255).status ||
      !validateAttributes(state.delegatorAttributes, true) ||
      !validateAttributes(state.delegateeAttributes, true) ||
      !validateAttributes(state.delegateObjectAttributes) ||
      !validateAttributes(state.environmentAttributes)
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
      name: state.name,
      description: state.description,
      delegatorRequirements: {
        attributes: state.delegatorAttributes,
        rule: state.delegatorRule
      },
      delegateObjectRequirements: {
        attributes: state.delegateObjectAttributes,
        rule: state.delegateObjectRule
      },
      delegateeRequirements: {
        attributes: state.delegateeAttributes,
        rule: state.delegateeRule
      },
      environmentRequirements: {
        attributes: state.environmentAttributes,
        rule: state.environmentRule
      }
    }
    if (isFormValidated() && state.name) {
      dispatch(PolicyActions.createPolicy([data]))
    }
  }
  const openEditAttributes = (object, objectType) => {
    let index = i + 1
    object?.attributes?.forEach((x) => {
      x.addOrder = index
      index += 1
    })
    handleChangeAddRowAttribute('i', index)
    setState((state) => ({
      ...state,
      currentObject: object,
      currentObjectType: objectType
    }))

    window.$(`#modal-${id}-edit-attributes`).modal('show')
  }

  const delegatorNext = (delegatorAttributes, delegatorRule) => {
    let index = i + 1
    delegatorAttributes.forEach((x) => {
      x.addOrder = index
      index += 1
    })
    handleChangeAddRowAttribute('i', index)
    setState((state) => ({
      ...state,
      delegatorAttributes,
      delegatorRule
    }))

    window.$(`#modal-${id}-delegatee`).modal('show')
  }
  const delegateeNext = (delegateeAttributes, delegateeRule) => {
    let index = i + 1
    delegateeAttributes.forEach((x) => {
      x.addOrder = index
      index += 1
    })
    handleChangeAddRowAttribute('i', index)
    setState((state) => ({
      ...state,
      delegateeAttributes,
      delegateeRule
    }))

    window.$(`#modal-${id}-delegateObject`).modal('show')
  }
  const delegateObjectNext = (delegateObjectAttributes, delegateObjectRule) => {
    let index = i + 1
    delegateObjectAttributes.forEach((x) => {
      x.addOrder = index
      index += 1
    })
    handleChangeAddRowAttribute('i', index)
    setState((state) => ({
      ...state,
      delegateObjectAttributes,
      delegateObjectRule
    }))

    window.$(`#modal-${id}-finish-policy`).modal('show')
  }

  const nonFilter = () => true
  return (
    <>
      <ChooseRequester
        id={`${id}-delegator`}
        next={delegatorNext}
        openEditAttributes={openEditAttributes}
        description={delegatorDescription}
        translation='delegator'
        filterObject={filterDelegator ?? nonFilter}
        attributeType={['Mixed', 'Delegation']}
      />
      <ChooseRequester
        id={`${id}-delegatee`}
        next={delegateeNext}
        openEditAttributes={openEditAttributes}
        translation='delegatee'
        description={delegateeDescription}
        filterObject={filterDelegatee ?? nonFilter}
        attributeType={['Mixed', 'Delegation']}
      />
      <ChooseResource
        id={`${id}-delegateObject`}
        next={delegateObjectNext}
        openEditAttributes={openEditAttributes}
        translation='delegateObject'
        description={delegateObjectDescription}
        filterObject={filterDelegateObject ?? nonFilter}
        attributeType={['Mixed', 'Delegation']}
      />
      <FinalEditPolicy
        id={`${id}-finish-policy`}
        name={state.name}
        description={state.description}
        delegatorAttributes={state.delegatorAttributes}
        delegateObjectAttributes={state.delegateObjectAttributes}
        delegateeAttributes={state.delegateeAttributes}
        environmentAttributes={state.environmentAttributes}
        delegatorRule={state.delegatorRule}
        delegateObjectRule={state.delegateObjectRule}
        delegateeRule={state.delegateeRule}
        environmentRule={state.environmentRule}
        handleChange={handleChange}
        handleChangeAddRowAttribute={handleChangeAddRowAttribute}
        i={i}
        next={save}
      />
      <AttributeEditForm
        id={`${id}-edit-attributes`}
        object={state.currentObject}
        objectType={state.currentObjectType}
        i={i}
        handleChange={handleChange}
        handleChangeAddRowAttribute={handleChangeAddRowAttribute}
        attributeType={['Mixed', 'Delegation']}
      />
    </>
  )
}
