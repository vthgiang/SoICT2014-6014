import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { ErrorLabel } from '../../../../common-components'
import ValidationHelper from '../../../../helpers/validationHelper'

function GeneralTab(props) {
  const [state, setState] = useState({
    name: '',
    description: '',
    nameError: {
      message: undefined,
      status: true
    }
  })

  // setState từ props mới
  useEffect(() => {
    if (props.policyID !== state.policyID) {
      setState({
        ...state,
        policyID: props.policyID,
        name: props.name,
        description: props.description
      })
    }
  }, [props.policyID])

  /**
   * Hàm xử lý khi tên ví dụ thay đổi
   * @param {*} e
   */
  const handlePolicyName = (e) => {
    const { value } = e.target
    const result = ValidationHelper.validateName(translate, value, 6, 255)

    setState({
      ...state,
      name: value,
      nameError: result
    })
    props.handleChange('name', value)
  }

  /**
   * Hàm xử lý khi mô tả ví dụ thay đổi
   * @param {*} e
   */
  const handlePolicyDescription = (e) => {
    const { value } = e.target
    setState({
      ...state,
      description: value
    })
    props.handleChange('description', value)
  }

  const { translate } = props
  const { name, description, nameError } = state

  return (
    <div id={props.id} className='tab-pane active'>
      {/* Tên ví dụ */}
      <div className={`form-group ${nameError.status ? '' : 'has-error'}`}>
        <label>
          {translate('manage_authorization_policy.name')}
          <span className='text-red'>*</span>
        </label>
        <input type='text' className='form-control' value={name} onChange={handlePolicyName} />
        <ErrorLabel content={nameError.message} />
      </div>

      {/* Mô tả ví dụ */}
      <div className='form-group'>
        <label>{translate('manage_authorization_policy.policy_description')}</label>
        <input type='text' className='form-control' value={description} onChange={handlePolicyDescription} />
      </div>
    </div>
  )
}

function mapState(state) {
  const { policy } = state
  return { policy }
}

const actionCreators = {}
const generalTab = connect(mapState, actionCreators)(withTranslate(GeneralTab))
export { generalTab as GeneralTab }
