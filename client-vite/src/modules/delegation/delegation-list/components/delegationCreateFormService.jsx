import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import { withTranslate } from 'react-redux-multilingual'
import dayjs from 'dayjs'
import { DialogModal, ErrorLabel, SelectBox, DatePicker, TimePicker, SelectMulti } from '../../../../common-components'
import ValidationHelper from '../../../../helpers/validationHelper'
import { DelegationActions } from '../redux/actions'
import { InternalServiceIdentityActions } from '../../../system-admin/internal-service-identity/redux/actions'
import { ExternalServiceConsumerActions } from '../../../super-admin/external-service-consumer/redux/actions'
import { DelegationFormValidator } from './delegationFormValidator'
import './selectLink.css'
import { generateCode } from '../../../../helpers/generateCode'
import { sendRequest } from '../../../../helpers/requestHelper'

function DelegationCreateFormService(props) {
  const [state, setState] = useState({
    delegationName: '',
    description: '',
    delegationNameError: {
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
    // delegatePolicy: '',
    delegateApis: [],
    apisServiceCanAccess: [],
    allServices: []
  })
  const {
    delegationName,
    description,
    delegationNameError,
    delegatee,
    delegator,
    delegateDuration,
    showChooseRevoke,
    errorDelegatee,
    errorDelegator,
    delegationEnd,
    // delegatePolicy,
    // errorDelegatePolicy,
    delegateApis,
    errorDelegateApis,
    apisServiceCanAccess,
    allServices
  } = state

  const { internalServiceIdentities, externalServiceConsumers } = props
  const { translate, getInternalServiceIdentities, getExternalServiceConsumers, createServiceDelegation } = props

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

  const roundToNearestHour = (date) => {
    date.setMinutes(date.getMinutes() + 30)
    date.getMinutes() >= 30 ? date.setMinutes(30, 0, 0) : date.setMinutes(0, 0, 0)

    return date
  }

  const regenerateTimeAndCode = () => {
    const currentTime = formatTime(roundToNearestHour(new Date()))
    const code = generateCode('UQDV')
    const result = ValidationHelper.validateName(translate, code, 6, 255)

    setState((state) => {
      return {
        ...state,
        delegateDuration: {
          ...state.delegateDuration,
          startTime: currentTime
        },
        delegationName: code,
        delegationNameError: result
      }
    })
  }

  useEffect(() => {
    if (delegationName == '') {
      window.$(`#modal-create-delegation-hooks-Service`).on('shown.bs.modal', regenerateTimeAndCode)
      return () => {
        window.$(`#modal-create-delegation-hooks-Service`).unbind('shown.bs.modal', regenerateTimeAndCode)
      }
    }
  }, [])

  /**
   * Hàm dùng để kiểm tra xem form đã được validate hay chưa
   */
  const isFormValidated = () => {
    if (
      !delegationNameError.status ||
      errorDelegatee !== undefined ||
      errorDelegator !== undefined ||
      (showChooseRevoke && !ValidationHelper.validateEmpty(translate, delegateDuration.endDate).status) ||
      !ValidationHelper.validateEmpty(translate, delegateDuration.startDate).status
    ) {
      return false
    }
    return true
  }

  useEffect(() => {
    getInternalServiceIdentities({
      page: 1,
      perPage: 1000
    })
    getExternalServiceConsumers({
      page: 1,
      perPage: 1000
    })
  }, [])

  const SERVICE_IDENTITY_BASE_API_URL = `${process.env.REACT_APP_SERVICE_IDENTITY_SERVER}/authorization/internal-service-identities`
  useEffect(() => {
    if (delegator) {
      sendRequest(
        {
          url: `${SERVICE_IDENTITY_BASE_API_URL}/internal-service-identities/get-api-service-can-access/${delegator}`,
          method: 'GET'
        },
        false,
        false,
        'system_admin.internal_service_identity'
      ).then((res) => {
        setState({
          ...state,
          apisServiceCanAccess: res.data.content
        })
      })
    }
  }, [delegator])

  useEffect(() => {
    if (internalServiceIdentities?.listInternalServiceIdentity && externalServiceConsumers?.listExternalServiceConsumer) {
      const newAllServices = internalServiceIdentities.listInternalServiceIdentity.concat(
        externalServiceConsumers.listExternalServiceConsumer
      )
      setState({
        ...state,
        allServices: newAllServices
      })
    }
  }, [internalServiceIdentities.listInternalServiceIdentity, externalServiceConsumers.listExternalServiceConsumer])

  // Nhận giá trị từ component cha

  /**
   * Hàm dùng để lưu thông tin của form và gọi service tạo mới ví dụ
   */
  const save = () => {
    const data = {
      delegationName,
      description,
      delegator,
      delegatee,
      delegationStart: convertDateTimeSave(delegateDuration.startDate, delegateDuration.startTime),
      delegationEnd: delegationEnd !== '' ? convertDateTimeSave(delegateDuration.endDate, delegateDuration.endTime) : null,
      // delegatePolicy: delegatePolicy,
      delegateApis
    }
    if (isFormValidated() && delegationName) {
      return createServiceDelegation([data])
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
      delegationName: value,
      delegationNameError: result
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

  const validateDelegator = (value, willUpdateState) => {
    let msg
    if (!value) {
      msg = translate('manage_delegation.no_blank_delegatee')
    }
    if (willUpdateState) {
      setState({
        ...state,
        delegator: value,
        errorDelegator: msg
      })
    }
    return msg === undefined
  }

  const handleDelegator = (value) => {
    validateDelegator(value[0], true)
  }
  // const handleDelegatePolicy = (value) => {
  //   validateDelegatePolicy(value[0], true)
  // }

  // const validateDelegatePolicy = (value, willUpdateState) => {
  //   let msg = undefined
  //   const { translate } = props
  //   if (!value) {
  //     msg = translate('manage_delegation.no_blank_delegate_policy')
  //   }
  //   if (willUpdateState) {
  //     setState({
  //       ...state,
  //       delegatePolicy: value,
  //       errorDelegatePolicy: msg
  //     })
  //   }
  //   return msg === undefined
  // }

  const validateDelegateApis = (value, willUpdateState) => {
    let msg
    if (!value || value.length == 0) {
      msg = translate('manage_delegation.no_blank_delegate_apis')
    }

    if (willUpdateState) {
      setState({
        ...state,
        delegateApis: value,
        errorDelegateApis: msg
      })
    }
    return msg === undefined
  }

  const handleDelegateApis = (value) => {
    validateDelegateApis(value, true)
  }

  const validateServiceStartDate = (value, willUpdateState = true) => {
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

  const handleChangeServiceStartDate = (value) => {
    validateServiceStartDate(value, true)
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

  const validateServiceEndDate = (value, willUpdateState = true) => {
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

  const handleChangeServiceEndDate = (value) => {
    validateServiceEndDate(value, true)
  }

  return (
    <DialogModal
      modalID='modal-create-delegation-hooks-Service'
      formID='modal-create-delegation-hooks-Service'
      title={translate('manage_delegation.service_delegation_title_add')}
      msg_success={translate('manage_delegation.add_success')}
      msg_failure={translate('manage_delegation.add_fail')}
      func={save}
      disableSubmit={!isFormValidated()}
      size={50}
    >
      <form id='modal-create-delegation-hooks-Service' onSubmit={() => save(translate('manage_delegation.add_success'))}>
        <div className='row form-group'>
          {/* Tên ủy quyền */}
          <div
            style={{ marginBottom: '0px' }}
            className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 form-group ${delegationNameError.status ? '' : 'has-error'}`}
          >
            <label>
              {translate('manage_delegation.delegationName')}
              <span className='text-red'>*</span>
            </label>
            <input type='text' className='form-control' value={delegationName} onChange={handleDelegationName} />
            <ErrorLabel content={delegationNameError.message} />
          </div>
          {/* Mô tả ủy quyền */}
          <div style={{ marginBottom: '0px' }} className='col-lg-6 col-md-6 col-ms-12 col-xs-12 form-group'>
            <label>{translate('manage_delegation.delegation_description')}</label>
            <input type='text' className='form-control' value={description} onChange={handleDelegationDescription} />
          </div>
        </div>

        <div className='row form-group'>
          {/* Chọn apis */}
          <div
            style={{ marginBottom: '0px' }}
            className={`col-lg-12 col-md-12 col-ms-12 col-xs-12 form-group ${errorDelegateApis === undefined ? '' : 'has-error'}`}
          >
            <label>
              {translate('manage_delegation.choose_delegate_apis')}
              <span className='text-red'>*</span>
            </label>
            {apisServiceCanAccess && (
              <SelectMulti
                id='select-apis-create'
                className='form-control select2'
                multiple='multiple'
                options={{
                  nonSelectedText: translate('manage_delegation.choose_delegate_apis'),
                  allSelectedText: translate('manage_delegation.select_all_apis'),
                  enableFilter: true,
                  placeholder: translate('manage_delegation.choose_delegate_apis')
                }}
                onChange={handleDelegateApis}
                items={apisServiceCanAccess.map((api) => {
                  return { value: api._id, text: `${api.path} - ${api.method}` }
                })}
              />
            )}
            <ErrorLabel content={errorDelegateApis} />
          </div>
        </div>

        <div className='row form-group'>
          {/* Chọn service gửi */}
          <div
            style={{ marginBottom: '0px' }}
            className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 form-group ${errorDelegatee === undefined ? '' : 'has-error'}`}
          >
            <label>
              {translate('manage_delegation.delegator_service')}
              <span className='text-red'>*</span>
            </label>
            {internalServiceIdentities?.listInternalServiceIdentity && (
              <SelectBox
                id='select-delegator-service-create'
                className='form-control select2'
                style={{ width: '100%' }}
                items={internalServiceIdentities?.listInternalServiceIdentity.map((service) => ({ value: service.id, text: service.name }))}
                onChange={handleDelegator}
                multiple={false}
                options={{ placeholder: translate('manage_delegation.choose_delegator_service') }}
              />
            )}
            <ErrorLabel content={errorDelegatee} />
          </div>
          {/* Chọn service nhận */}
          <div
            style={{ marginBottom: '0px' }}
            className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 form-group ${errorDelegator === undefined ? '' : 'has-error'}`}
          >
            <label>
              {translate('manage_delegation.delegatee_service')}
              <span className='text-red'>*</span>
            </label>
            {allServices && (
              <SelectBox
                id='select-delegatee-service-create'
                className='form-control select2'
                style={{ width: '100%' }}
                items={allServices.map((service) => ({ value: service.id, text: service.name }))}
                onChange={handleDelegatee}
                multiple={false}
                options={{ placeholder: translate('manage_delegation.choose_delegatee_service') }}
              />
            )}
            <ErrorLabel content={errorDelegator} />
          </div>
        </div>

        <div className='row'>
          <div className='col-lg-12 col-md-12 col-ms-12 col-xs-12'>
            <form style={{ marginBottom: '5px' }}>
              <input type='checkbox' id='delegateRevoke-Service' name='delegateRevoke-Service' onChange={chooseRevoke} />
              <label htmlFor='delegateRevoke-Service'>&nbsp;{translate('manage_delegation.choose_revoke')}</label>
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
              id='datepicker1create-service'
              dateFormat='day-month-year'
              value={delegateDuration.startDate}
              onChange={handleChangeServiceStartDate}
              pastDate={false}
            />
            <TimePicker
              id='time-picker-1create-service'
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
                id='datepicker2create-service'
                value={delegateDuration.endDate}
                onChange={handleChangeServiceEndDate}
                pastDate={false}
              />
              <TimePicker
                id='time-picker-2create-service'
                refs='time-picker-2'
                value={delegateDuration.endTime}
                onChange={handleEndTimeChange}
                minuteStep={30}
              />
              <ErrorLabel content={delegateDuration.errorOnEndDate} />
            </div>
          )}
        </div>
      </form>
    </DialogModal>
  )
}

function mapState(state) {
  const { auth, user, policyDelegation, internalServiceIdentities, externalServiceConsumers } = state
  return { auth, user, policyDelegation, internalServiceIdentities, externalServiceConsumers }
}

const actions = {
  // getPolicies: PolicyActions.getPolicies,
  getInternalServiceIdentities: InternalServiceIdentityActions.getInternalServiceIdentities,
  getExternalServiceConsumers: ExternalServiceConsumerActions.getExternalServiceConsumers,
  createServiceDelegation: DelegationActions.createServiceDelegation
}

const connectedDelegationCreateFormService = connect(mapState, actions)(withTranslate(DelegationCreateFormService))
export { connectedDelegationCreateFormService as DelegationCreateFormService }
