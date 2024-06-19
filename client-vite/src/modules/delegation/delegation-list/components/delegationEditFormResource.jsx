import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useTranslate } from 'react-redux-multilingual'
import dayjs from 'dayjs'
import { DialogModal, ErrorLabel, SelectBox, DatePicker, TimePicker } from '../../../../common-components'
import ValidationHelper from '../../../../helpers/validationHelper'
import { DelegationActions } from '../redux/actions'
import { RequesterActions } from '../../../system-admin/requester-management/redux/actions'
import { PolicyActions } from '../../../super-admin/policy-delegation/redux/actions'
import { DelegationFormValidator } from './delegationFormValidator'
import './selectLink.css'
import { sendRequest } from '../../../../helpers/requestHelper'

export function DelegationEditFormResource(props) {
  const dispatch = useDispatch()
  const translate = useTranslate()
  const [state, setState] = useState({
    delegationID: '',
    name: '',
    description: '',
    nameError: {
      message: undefined,
      status: true
    },
    delegatee: '',
    delegator: '',
    delegateDuration: {
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '11:30 PM'
    },
    showChooseRevoke: false,
    delegationStart: '',
    delegationEnd: '',
    policy: '',
    delegateResource: undefined,
    accessibleResources: []
  })
  const {
    delegationID,
    name,
    description,
    nameError,
    delegatee,
    delegator,
    delegateDuration,
    showChooseRevoke,
    errorDelegatee,
    errorDelegator,
    delegationEnd,
    policy,
    errorDelegatePolicy,
    delegateResource,
    errorDelegateResource,
    accessibleResources
  } = state

  useEffect(() => {
    if (props.delegationID !== state.delegationID) {
      setState({
        ...state,
        delegationID: props.delegationID,
        name: props.name,
        description: props.description,
        delegator: props.delegator?._id ?? props.delegator,
        delegatee: props.delegatee?._id ?? props.delegatee,
        delegateResource: props.delegateResource?._id ?? props.delegateResource,
        status: props.status,
        delegateDuration: {
          startDate: formatDate(props.startDate),
          endDate: props.endDate ? formatDate(props.endDate) : '',
          startTime: formatTime(props.startDate),
          endTime: props.endDate ? formatTime(props.endDate) : '11:59 PM',
          errorOnStartDate: undefined,
          errorOnEndDate: undefined
        },
        revokedDate: props.revokedDate,
        revokeReason: props.revokeReason,
        showChooseRevoke: props.showChooseRevoke,
        policy: props.policy?._id ?? props.policy,
        logs: props.logs
      })
      window.$('#delegateRevokeEdit-Resource').prop('checked', props.showChooseRevoke)
    }
  }, [props.delegationID])

  /**
   * Hàm dùng để kiểm tra xem form đã được validate hay chưa
   */
  const isFormValidated = () => {
    if (
      !nameError.status ||
      !validateDelegateResource(delegateResource, false) ||
      !validateDelegatee(delegatee, false) ||
      (showChooseRevoke && !ValidationHelper.validateEmpty(translate, delegateDuration.endDate).status) ||
      !ValidationHelper.validateEmpty(translate, delegateDuration.startDate).status ||
      !validateDelegatePolicy(state.policy, false)
    ) {
      return false
    }
    return true
  }

  const requesters = useSelector((x) => x.requester?.listPaginate)
  const auth = useSelector((x) => x.auth)
  const delegationPolicies = useSelector((x) => x.policyDelegation.listPaginate)

  useEffect(() => {
    if (!requesters.length) {
      dispatch(
        RequesterActions.get({
          page: 1,
          perPage: 10000
        })
      )
    }

    if (!delegationPolicies.length) {
      dispatch(
        PolicyActions.getPolicies({
          page: 1,
          perPage: 10000
        })
      )
    }
  }, [])

  useEffect(() => {
    if (requesters) {
      const delegatorId = requesters.find((x) => x.refId == auth.user?._id)?.id
      setState({
        ...state,
        delegator: delegatorId
      })
    }
  }, [requesters])

  // get accessible resources
  const REQUESTER_SERVICE_BASE_API_URL = `${process.env.REACT_APP_SERVER}/requester`
  useEffect(() => {
    if (delegator) {
      sendRequest(
        {
          url: `${REQUESTER_SERVICE_BASE_API_URL}/accessible-resources/${delegator}`,
          method: 'GET'
        },
        false,
        false,
        'system_admin.accessible_resources'
      ).then((res) => {
        setState({
          ...state,
          accessibleResources: res.data.content
        })
      })
    }
  }, [delegator])

  const convertDateTime = (date, time) => {
    const splitter = date.split('-')
    const strDateTime = `${splitter[2]}/${splitter[1]}/${splitter[0]} ${time}`
    return dayjs(strDateTime).format('YYYY/MM/DD HH:mm:ss')
  }

  const convertDateTimeSave = (date, time) => {
    const splitter = date.split('-')
    const strDateTime = `${splitter[2]}/${splitter[1]}/${splitter[0]} ${time}`
    return new Date(strDateTime)
  }

  // convert ISODate to String hh:mm AM/PM
  const formatTime = (date) => {
    return dayjs(date).format('h:mm A')
  }

  const formatDate = (date) => {
    const d = new Date(date)
    let month = `${d.getMonth() + 1}`
    let day = `${d.getDate()}`
    const year = d.getFullYear()

    if (month.length < 2) month = `0${month}`
    if (day.length < 2) day = `0${day}`
    return [day, month, year].join('-')
  }

  const save = () => {
    const data = {
      name,
      description,
      delegator,
      delegatee,
      startDate: convertDateTimeSave(delegateDuration.startDate, delegateDuration.startTime),
      endDate: delegationEnd != '' ? convertDateTimeSave(delegateDuration.endDate, delegateDuration.endTime) : null,
      policy,
      delegateObject: delegateResource
    }
    if (isFormValidated() && name) {
      dispatch(DelegationActions.editResourceDelegation(delegationID, data))
    }
  }

  const chooseRevoke = (event) => {
    setState({
      ...state,
      showChooseRevoke: event.target.checked
    })
  }

  /**
   * Hàm xử lý khi tên ví dụ thay đổi
   * @param {*} e
   */
  const handleDelegationName = (e) => {
    const { value } = e.target
    const result = ValidationHelper.validateName(translate, value, 6, 255)

    setState({
      ...state,
      name: value,
      nameError: result
    })
  }

  /**
   * Hàm xử lý khi mô tả ví dụ thay đổi
   * @param {*} e
   */
  const handleDelegationDescription = (e) => {
    const { value } = e.target
    setState({
      ...state,
      description: value
    })
  }

  const validateDelegatee = (value, willUpdateState) => {
    let msg
    if (!value) {
      msg = translate('manage_delegation.no_blank_delegatee')
    }
    if (willUpdateState) {
      setState({
        ...state,
        delegatee: value,
        errorDelegatee: msg
      })
    }
    return msg === undefined
  }

  const handleDelegatee = (value) => {
    validateDelegatee(value[0], true)
  }

  const handleDelegatePolicy = (value) => {
    validateDelegatePolicy(value[0], true)
  }

  const validateDelegatePolicy = (value, willUpdateState) => {
    let msg
    if (!value) {
      msg = translate('manage_delegation.no_blank_delegate_policy')
    }
    if (willUpdateState) {
      setState({
        ...state,
        policy: value,
        errorDelegatePolicy: msg
      })
    }
    return msg === undefined
  }

  const validateDelegateResource = (value, willUpdateState) => {
    let msg
    if (!value) {
      msg = translate('manage_delegation.no_blank_delegate_task')
    }

    if (willUpdateState) {
      setState({
        ...state,
        delegateResource: value,
        errorDelegateResource: msg
      })
    }
    return msg === undefined
  }

  const handleDelegateResource = (value) => {
    validateDelegateResource(value[0], true)
  }

  const validateResourceStartDate = (value, willUpdateState = true) => {
    let msg = DelegationFormValidator.validateTaskStartDate(value, delegateDuration.endDate, translate)
    const startDate = convertDateTime(value, delegateDuration.startTime)
    const endDate = convertDateTime(delegateDuration.endDate, delegateDuration.endTime)

    if (startDate >= endDate) {
      msg = translate('task.task_management.add_err_end_date')
    }
    if (willUpdateState) {
      setState({
        ...state,
        delegateDuration: {
          ...state.delegateDuration,
          startDate: value,
          errorOnStartDate: msg
        },
        delegationStart: startDate
      })
      delegateDuration.startDate = value
      delegateDuration.errorOnStartDate = msg
      if (!msg && delegateDuration.endDate) {
        setState({
          ...state,
          delegateDuration: {
            ...state.delegateDuration,
            errorOnEndDate: msg
          }
        })
      }
    }
    return msg === undefined
  }

  const handleChangeResourceStartDate = (value) => {
    validateResourceStartDate(value, true)
  }

  const handleStartTimeChange = (value) => {
    const startDate = convertDateTime(state.delegateDuration.startDate, value)
    const endDate = convertDateTime(state.delegateDuration.endDate, state.delegateDuration.endTime)
    let err
    let resetErr

    if (value.trim() === '') {
      err = translate('task.task_management.add_err_empty_end_date')
    } else if (startDate >= endDate) {
      err = translate('task.task_management.add_err_end_date')
      resetErr = undefined
    }
    setState({
      ...state,
      delegateDuration: {
        ...state.delegateDuration,
        startTime: value,
        errorOnStartDate: err,
        errorOnEndDate: resetErr
      },
      delegationStart: startDate
    })
  }

  const handleEndTimeChange = (value) => {
    const startDate = convertDateTime(state.delegateDuration.startDate, state.delegateDuration.startTime)
    const endDate = convertDateTime(state.delegateDuration.endDate, value)
    let err
    let resetErr

    // if (value.trim() === "") {
    //     err = translate('task.task_management.add_err_empty_end_date');
    // }
    // else
    if (startDate >= endDate) {
      err = translate('task.task_management.add_err_end_date')
      resetErr = undefined
    }
    setState({
      ...state,
      delegateDuration: {
        ...state.delegateDuration,
        endTime: value,
        errorOnEndDate: err,
        errorOnStartDate: resetErr
      },
      delegationEnd: endDate
    })
  }

  const validateResourceEndDate = (value, willUpdateState = true) => {
    let msg = DelegationFormValidator.validateDelegationEndDate(delegateDuration.startDate, value, translate)
    const endDate = convertDateTime(value, delegateDuration.endTime)
    const startDate = convertDateTime(delegateDuration.startDate, delegateDuration.startTime)

    if (startDate >= endDate) {
      msg = translate('task.task_management.add_err_end_date')
    }
    if (willUpdateState) {
      setState({
        ...state,
        delegateDuration: {
          ...state.delegateDuration,
          endDate: value,
          errorOnEndDate: msg
        }
      })
      delegateDuration.endDate = value
      delegateDuration.errorOnEndDate = msg
      if (!msg && delegateDuration.startDate) {
        setState({
          ...state,
          delegateDuration: {
            ...delegateDuration,
            errorOnStartDate: msg
          }
        })
      }
    }
    setState({
      ...state,
      delegationEnd: endDate
    })
    return msg === undefined
  }

  const handleChangeResourceEndDate = (value) => {
    validateResourceEndDate(value, true)
  }

  return (
    <DialogModal
      modalID='modal-edit-delegation-hooks-Resource'
      formID='modal-edit-delegation-hooks-Resource'
      title={translate('manage_delegation.resource_delegation_title_edit')}
      msg_success={translate('manage_delegation.add_success')}
      msg_failure={translate('manage_delegation.add_fail')}
      func={save}
      disableSubmit={!isFormValidated()}
      size={50}
    >
      <form id='modal-edit-delegation-hooks-Resource' onSubmit={() => save(translate('manage_delegation.add_success'))}>
        <div className='row form-group'>
          {/* Tên ủy quyền */}
          <div
            style={{ marginBottom: '0px' }}
            className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 form-group ${nameError.status ? '' : 'has-error'}`}
          >
            <label>
              {translate('manage_delegation.name')}
              <span className='text-red'>*</span>
            </label>
            <input type='text' className='form-control' value={name} onChange={handleDelegationName} />
            <ErrorLabel content={nameError.message} />
          </div>
          {/* Mô tả ủy quyền */}
          <div style={{ marginBottom: '0px' }} className='col-lg-6 col-md-6 col-ms-12 col-xs-12 form-group'>
            <label>{translate('manage_delegation.delegation_description')}</label>
            <input type='text' className='form-control' value={description} onChange={handleDelegationDescription} />
          </div>
        </div>

        <div className='row form-group'>
          {/* Chọn resource */}
          <div
            style={{ marginBottom: '0px' }}
            className={`col-lg-12 col-md-12 col-ms-12 col-xs-12 form-group ${errorDelegateResource === undefined ? '' : 'has-error'}`}
          >
            <label>
              {translate('manage_delegation.choose_delegate_resource')}
              <span className='text-red'>*</span>
            </label>
            {accessibleResources && (
              <SelectBox
                id='select-resource-edit'
                className='form-control select2'
                multiple={false}
                style={{ width: '100%' }}
                options={{ placeholder: translate('manage_delegation.choose_delegate_resource') }}
                onChange={handleDelegateResource}
                value={delegateResource}
                items={accessibleResources.map((x) => {
                  return { value: x._id, text: `${x.name} - ${x.type}` }
                })}
              />
            )}
            <ErrorLabel content={errorDelegateResource} />
          </div>
        </div>

        <div className='row form-group'>
          {/* Chọn delegatee */}
          <div
            style={{ marginBottom: '0px' }}
            className={`col-lg-12 col-md-12 col-ms-12 col-xs-12 form-group ${errorDelegator === undefined ? '' : 'has-error'}`}
          >
            <label>
              {translate('manage_delegation.delegatee')}
              <span className='text-red'>*</span>
            </label>
            {requesters && (
              <SelectBox
                id='select-delegatee-resource-edit'
                className='form-control select2'
                style={{ width: '100%' }}
                items={requesters.filter((x) => x.id !== delegator).map((x) => ({ value: x.id, text: `${x.name} (${x.type})` }))}
                onChange={handleDelegatee}
                multiple={false}
                value={delegatee}
                options={{ placeholder: translate('manage_delegation.choose_delegatee') }}
              />
            )}
            <ErrorLabel content={errorDelegator} />
          </div>
        </div>

        <div className='row'>
          <div className='col-lg-12 col-md-12 col-ms-12 col-xs-12'>
            <form style={{ marginBottom: '5px' }}>
              <input type='checkbox' id='delegateRevokeEdit-Resource' name='delegateRevokeEdit-Resource' onChange={chooseRevoke} />
              <label htmlFor='delegateRevokeEdit-Resource'>&nbsp;{translate('manage_delegation.choose_revoke')}</label>
            </form>
          </div>
        </div>
        <div className='row form-group'>
          <div
            style={{ marginBottom: '0px' }}
            className={`${showChooseRevoke ? 'col-lg-6 col-md-6' : 'col-lg-12 col-md-12'} col-ms-12 col-xs-12 form-group ${delegateDuration.errorOnStartDate === undefined ? '' : 'has-error'}`}
          >
            <label className='control-label'>
              {translate('manage_delegation.start_date')}
              <span className='text-red'>*</span>
            </label>
            <DatePicker
              id='datepicker1edit-resource'
              dateFormat='day-month-year'
              value={delegateDuration.startDate}
              onChange={handleChangeResourceStartDate}
              pastDate={false}
            />
            <TimePicker
              id='time-picker-1edit-resource'
              refs='time-picker-1'
              value={delegateDuration.startTime}
              onChange={handleStartTimeChange}
              minuteStep={30}
            />
            <ErrorLabel content={delegateDuration.errorOnStartDate} />
          </div>
          {showChooseRevoke && (
            <div
              style={{ marginBottom: '0px' }}
              className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 form-group ${delegateDuration.errorOnEndDate === undefined ? '' : 'has-error'}`}
            >
              <label className='control-label'>{translate('manage_delegation.end_date')}</label>
              <DatePicker
                id='datepicker2edit-resource'
                value={delegateDuration.endDate}
                onChange={handleChangeResourceEndDate}
                pastDate={false}
              />
              <TimePicker
                id='time-picker-2edit-resource'
                refs='time-picker-2'
                value={delegateDuration.endTime}
                onChange={handleEndTimeChange}
                minuteStep={30}
              />
              <ErrorLabel content={delegateDuration.errorOnEndDate} />
            </div>
          )}
        </div>

        <div className='row form-group'>
          {/* Chọn chính sách ủy quyền */}
          <div
            style={{ marginBottom: '0px' }}
            className={`col-lg-12 col-md-12 col-ms-12 col-xs-12 form-group ${errorDelegatePolicy === undefined ? '' : 'has-error'}`}
          >
            <label>
              {translate('manage_delegation.delegate_policy')}
              <span className='text-red'>*</span>
            </label>
            <SelectBox
              id='select-delegate-policy-edit-resource'
              className='form-control select2'
              style={{ width: '100%' }}
              items={delegationPolicies
                // .filter((p) => p.delegateType == 'Task')
                .map((policy) => {
                  return { value: policy ? policy._id : null, text: policy ? policy.name : '' }
                })}
              value={policy}
              onChange={handleDelegatePolicy}
              multiple={false}
              options={{ placeholder: translate('manage_delegation.choose_delegate_policy') }}
            />
            <ErrorLabel content={errorDelegatePolicy} />
          </div>
        </div>
      </form>
    </DialogModal>
  )
}
