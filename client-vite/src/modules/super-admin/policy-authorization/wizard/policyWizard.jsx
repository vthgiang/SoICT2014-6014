import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { useTranslate } from 'react-redux-multilingual'
import ValidationHelper from '../../../../helpers/validationHelper'
import { AttributeActions } from '../../attribute/redux/actions'
import { PolicyActions } from '../redux/actions'
import { ChooseRequester } from './chooseRequester'
import { AttributeEditForm } from './attributeEditForm'
import { ChooseResource } from './chooseResource'
import { ChooseRole } from './chooseRole'
import { FinalEditPolicy } from './finalEditPolicy'

export function PolicyWizard(props) {
  const translate = useTranslate()
  const dispatch = useDispatch()
  // Khởi tạo state
  const [state, setState] = useState({
    name: '',
    description: '',
    effect: 'Allow',
    effectiveStartTime: Date.now(),
    effectiveEndTime: undefined,
    // selectedRequesters: [],
    // selectedRoles: [],
    // selectedResources: [],
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
    id,
    i,
    handleChangeAddRowAttribute,
    requesterDescription,
    resourceDescription,
    roleDescription,
    filterRequester,
    filterResource,
    filterRole
  } = props

  const handleChange = (name, value) => {
    setState((state) => ({
      ...state,
      [name]: value
    }))
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
      !ValidationHelper.validateName(translate, state.name, 6, 255).status ||
      !validateAttributes(state.requesterAttributes, true) ||
      !validateAttributes(state.resourceAttributes, true) ||
      !validateAttributes(state.roleAttributes) ||
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
      effect: state.effect,
      effectiveStartTime: state.effectiveStartTime,
      effectiveEndTime: state.effectiveEndTime,
      requesterRequirements: {
        attributes: state.requesterAttributes,
        rule: state.requesterRule
      },
      roleRequirements: {
        attributes: state.roleAttributes,
        rule: state.roleRule
      },
      resourceRequirements: {
        attributes: state.resourceAttributes,
        rule: state.resourceRule
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

  const requesterNext = (requesterAttributes, requesterRule) => {
    let index = i + 1
    requesterAttributes.forEach((x) => {
      x.addOrder = index
      index += 1
    })
    handleChangeAddRowAttribute('i', index)
    setState((state) => ({
      ...state,
      requesterAttributes,
      requesterRule
    }))

    window.$(`#modal-${id}-resource`).modal('show')
  }
  const resourceNext = (resourceAttributes, resourceRule) => {
    let index = i + 1
    resourceAttributes.forEach((x) => {
      x.addOrder = index
      index += 1
    })
    handleChangeAddRowAttribute('i', index)
    setState((state) => ({
      ...state,
      resourceAttributes,
      resourceRule
    }))

    window.$(`#modal-${id}-role`).modal('show')
  }
  const roleNext = (roleAttributes, roleRule) => {
    let index = i + 1
    roleAttributes.forEach((x) => {
      x.addOrder = index
      index += 1
    })
    handleChangeAddRowAttribute('i', index)
    setState((state) => ({
      ...state,
      roleAttributes,
      roleRule
    }))

    window.$(`#modal-${id}-finish-policy`).modal('show')
  }

  const nonFilter = () => true
  return (
    <>
      <ChooseRequester
        id={`${id}-requester`}
        next={requesterNext}
        openEditAttributes={openEditAttributes}
        description={requesterDescription}
        filterObject={filterRequester ?? nonFilter}
        attributeType={['Mixed', 'Authorization']}
      />
      <ChooseResource
        id={`${id}-resource`}
        next={resourceNext}
        openEditAttributes={openEditAttributes}
        description={resourceDescription}
        filterObject={filterResource ?? nonFilter}
        attributeType={['Mixed', 'Authorization']}
      />
      <ChooseRole
        id={`${id}-role`}
        next={roleNext}
        openEditAttributes={openEditAttributes}
        description={roleDescription}
        filterObject={filterRole ?? nonFilter}
        attributeType={['Mixed', 'Authorization']}
      />
      <FinalEditPolicy
        id={`${id}-finish-policy`}
        name={state.name}
        description={state.description}
        effect={state.effect}
        effectiveStartTime={state.effectiveStartTime}
        effectiveEndTime={state.effectiveEndTime}
        requesterAttributes={state.requesterAttributes}
        roleAttributes={state.roleAttributes}
        resourceAttributes={state.resourceAttributes}
        environmentAttributes={state.environmentAttributes}
        requesterRule={state.requesterRule}
        roleRule={state.roleRule}
        resourceRule={state.resourceRule}
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
        attributeType={['Mixed', 'Authorization']}
      />
    </>
  )
}
