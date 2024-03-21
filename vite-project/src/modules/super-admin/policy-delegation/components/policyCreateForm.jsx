import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import { ButtonModal, DialogModal, ErrorLabel } from '../../../../common-components'
import { GeneralTab } from './generalTab'
import { DelegationTab } from './delegationTab'
import { ResourceTab } from './resourceTab'
import { withTranslate } from 'react-redux-multilingual'
import ValidationHelper from '../../../../helpers/validationHelper'
import { AttributeActions } from '../../attribute/redux/actions'
import { PolicyActions } from '../redux/actions'

function PolicyCreateForm(props) {
  // Khởi tạo state
  const [state, setState] = useState({
    policyName: '',
    description: '',
    delegatorAttributes: [],
    delegateeAttributes: [],
    delegatedObjectAttributes: [],
    resourceAttributes: [],
    delegatorRule: '',
    delegateeRule: '',
    delegatedObjectRule: '',
    resourceRule: '',
    delegateType: 'Role'
  })

  const { translate, policyDelegation, page, perPage } = props
  const {
    delegateType,
    policyName,
    description,
    delegatorRule,
    delegateeRule,
    delegatedObjectRule,
    resourceRule,
    delegatorAttributes,
    delegateeAttributes,
    delegatedObjectAttributes,
    resourceAttributes
  } = state

  const handleChange = (name, value) => {
    setState({
      ...state,
      [name]: value
    })
  }

  console.log(state)
  const handleChangeAddRowAttribute = (name, value) => {
    props.handleChangeAddRowAttribute(name, value)
  }

  useEffect(() => {
    props.getAttribute()
  }, [])
  /**
   * Hàm dùng để kiểm tra xem form đã được validate hay chưa
   */
  const isFormValidated = () => {
    if (
      !ValidationHelper.validateName(translate, policyName, 6, 255).status ||
      !validateDelegatorAttributes() ||
      !validateDelegateeAttributes() ||
      !validateDelegatedObjectAttributes() ||
      !validateResourceAttributes()
    ) {
      return false
    }
    return true
  }

  const validateDelegatorAttributes = () => {
    var delegatorAttributes = state.delegatorAttributes
    let result = true

    if (delegatorAttributes.length !== 0) {
      for (let n in delegatorAttributes) {
        if (
          !ValidationHelper.validateEmpty(props.translate, delegatorAttributes[n].attributeId).status ||
          !ValidationHelper.validateEmpty(props.translate, delegatorAttributes[n].value).status
        ) {
          result = false
          break
        }
      }
    }
    return result
  }
  const validateDelegatedObjectAttributes = () => {
    var delegatedObjectAttributes = state.delegatedObjectAttributes
    let result = true

    if (delegatedObjectAttributes.length !== 0) {
      for (let n in delegatedObjectAttributes) {
        if (
          !ValidationHelper.validateEmpty(props.translate, delegatedObjectAttributes[n].attributeId).status ||
          !ValidationHelper.validateEmpty(props.translate, delegatedObjectAttributes[n].value).status
        ) {
          result = false
          break
        }
      }
    }
    return result
  }

  const validateDelegateeAttributes = () => {
    var delegateeAttributes = state.delegateeAttributes
    let result = true

    if (delegateeAttributes.length !== 0) {
      for (let n in delegateeAttributes) {
        if (
          !ValidationHelper.validateEmpty(props.translate, delegateeAttributes[n].attributeId).status ||
          !ValidationHelper.validateEmpty(props.translate, delegateeAttributes[n].value).status
        ) {
          result = false
          break
        }
      }
    }
    return result
  }

  const validateResourceAttributes = () => {
    var resourceAttributes = state.resourceAttributes
    let result = true

    if (resourceAttributes.length !== 0) {
      for (let n in resourceAttributes) {
        if (
          !ValidationHelper.validateEmpty(props.translate, resourceAttributes[n].attributeId).status ||
          !ValidationHelper.validateEmpty(props.translate, resourceAttributes[n].value).status
        ) {
          result = false
          break
        }
      }
    }
    return result
  }

  /**
   * Hàm dùng để lưu thông tin của form và gọi service tạo mới ví dụ
   */
  const save = () => {
    const data = {
      policyName: policyName,
      description: description,
      delegateType: delegateType,
      delegator: {
        delegatorAttributes: delegatorAttributes,
        delegatorRule: delegatorAttributes.length > 0 ? delegatorRule : ''
      },
      delegatee: {
        delegateeAttributes: delegateeAttributes,
        delegateeRule: delegateeAttributes.length > 0 ? delegateeRule : ''
      },
      delegatedObject: {
        delegatedObjectAttributes: delegatedObjectAttributes,
        delegatedObjectRule: delegatedObjectAttributes.length > 0 ? delegatedObjectRule : ''
      },
      resource: {
        resourceAttributes: resourceAttributes,
        resourceRule: resourceAttributes.length > 0 ? resourceRule : ''
      }
    }
    if (isFormValidated() && policyName) {
      props.createPolicy([data])
    }
  }

  return (
    <React.Fragment>
      <DialogModal
        modalID='modal-create-policy-hooks'
        isLoading={policyDelegation.isLoading}
        formID='form-create-policy-hooks'
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
              <a title={translate('manage_delegation_policy.general_information')} data-toggle='tab' href={`#create_general`}>
                {translate('manage_delegation_policy.general_information')}
              </a>
            </li>
            <li>
              <a title={translate('manage_delegation_policy.delegation_information')} data-toggle='tab' href={`#create_delegation`}>
                {translate('manage_delegation_policy.delegation_information')}
              </a>
            </li>
            {/* <li><a title={translate('manage_delegation_policy.resource_information')} data-toggle="tab" href={`#create_resource`}>{translate('manage_delegation_policy.resource_information')}</a></li> */}
          </ul>

          <div className='tab-content'>
            {/* Thông tin chung */}
            <GeneralTab id={`create_general`} handleChange={handleChange} />

            {/* Thông tin thuộc tính subject */}
            <DelegationTab
              id={`create_delegation`}
              handleChange={handleChange}
              i={props.i}
              handleChangeAddRowAttribute={handleChangeAddRowAttribute}
              delegateType={delegateType}
            />

            {/* Thông tin thuộc tính resource */}
            {/* <ResourceTab
                            id={`create_resource`}
                            handleChange={handleChange}
                            i={props.i}
                            handleChangeAddRowAttribute={handleChangeAddRowAttribute}
                        /> */}
          </div>
        </div>
      </DialogModal>
    </React.Fragment>
  )
}

function mapState(state) {
  const policyDelegation = state.policyDelegation
  return { policyDelegation }
}

const actions = {
  createPolicy: PolicyActions.createPolicy,
  getAttribute: AttributeActions.getAttributes
}

const connectedPolicyCreateForm = connect(mapState, actions)(withTranslate(PolicyCreateForm))
export { connectedPolicyCreateForm as PolicyCreateForm }
