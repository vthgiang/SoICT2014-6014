import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { split } from 'lodash'
import { ErrorLabel, SelectBox, DatePicker } from '../../../../common-components'
import ValidationHelper from '../../../../helpers/validationHelper'

function GeneralTab(props) {
  const [state, setState] = useState({
    name: '',
    description: '',
    effect: 'Allow',
    effectiveStartTime: Date.now(),
    nameError: {
      message: undefined,
      status: true
    }
  })

  const getDateFormatted = (value) => {
    console.log("ddd", value)
    if (!value) {
      return ''
    }
    const date = new Date(value)
    const d = date.getDate()
    const m = date.getMonth() + 1
    const y = date.getFullYear()
    return `${d}-${m}-${y}`
  }

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
        effectiveEndTime: props.effectiveEndTime
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

  const handlePolicyEffect = (e) => {
    const { value } = e.target
    setState({
      ...state,
      effect: value
    })
    props.handleChange('effect', value)
  }

  const handlePolicyEffectiveStartTime = (value) => {
    const date = new Date()
    const a = split(value, '-')
    date.setDate(a[0])
    date.setMonth(parseInt(a[1], 10) - 1)
    date.setYear(a[2])
    date.setUTCHours(0, 0, 0, 0)
    setState({
      ...state,
      effectiveStartTime: date
    })
    props.handleChange('effectiveStartTime', date)
  }

  const handlePolicyEffectiveEndTime = (value) => {
    const date = new Date()
    const a = split(value, '-')
    date.setDate(a[0])
    date.setMonth(parseInt(a[1], 10) - 1)
    date.setYear(a[2])
    date.setUTCHours(0, 0, 0, 0)
    setState({
      ...state,
      effectiveEndTime: date
    })
    props.handleChange('effectiveEndTime', date)
  }

  const { translate } = props
  const { name, description, effect, effectiveStartTime, effectiveEndTime, nameError } = state

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

      {/* Effect */}
      <div className={`form-group ${nameError.status ? '' : 'has-error'}`}>
        <label>
          {translate('manage_authorization_policy.effect')}
          <span className='text-red'>*</span>
        </label>
        <SelectBox
          id={`select-effect-${props.id}`}
          className='form-control select2'
          style={{ width: '100%' }}
          items={[
            { value: 'Allow', text: 'Allow' },
            { value: 'Deny', text: 'Deny' }
          ]}
          onChange={handlePolicyEffect}
          multiple={false}
          value={effect}
        />
      </div>

      {/* Effective Start Time */}
      <div className={`form-group ${nameError.status ? '' : 'has-error'}`}>
        <label>{translate('manage_authorization_policy.effective_start_time')}</label>
        <DatePicker
          id={`select-effective-start-time-${props.id}`}
          dateFormat='day-month-year'
          value={getDateFormatted(effectiveStartTime)}
          onChange={handlePolicyEffectiveStartTime}
        />
      </div>

      {/* Effective End Time */}
      <div className={`form-group ${nameError.status ? '' : 'has-error'}`}>
        <label>
          {translate('manage_authorization_policy.effective_end_time')}
          <span className='text-red'>*</span>
        </label>
        <DatePicker
          id={`select-effective-end-time-${props.id}`}
          dateFormat='day-month-year'
          value={getDateFormatted(effectiveEndTime)}
          onChange={handlePolicyEffectiveEndTime}
        />
      </div>
    </div>
  )
}

function mapState(state) {
  return {}
}

const actionCreators = {}
const generalTab = connect(mapState, actionCreators)(withTranslate(GeneralTab))
export { generalTab as GeneralTab }
