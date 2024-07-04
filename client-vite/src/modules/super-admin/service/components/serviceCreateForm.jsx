import React, { useState } from 'react'
import { connect } from 'react-redux'
import { useTranslate, withTranslate } from 'react-redux-multilingual'
import { DialogModal, ErrorLabel } from '../../../../common-components'
import { ServiceActions } from '../redux/actions'
import ValidationHelper from '../../../../helpers/validationHelper'

function ServiceCreateForm(props) {
  const translate = useTranslate()
  const [state, setState] = useState({})

  const save = () => {
    if (isFormValidated()) {
      return props.create({
        name: state.serviceName,
        email: state.serviceEmail,
        password: state.servicePassword
      })
    }
  }

  const isFormValidated = () => {
    const { serviceName, serviceEmail } = state
    if (
      !ValidationHelper.validateName(translate, serviceName, 6, 255).status ||
      !ValidationHelper.validateEmail(translate, serviceEmail).status ||
      !ValidationHelper.validateEmail(translate, serviceEmail).status
    )
      return false
    return true
  }

  const handleServiceName = (e) => {
    const { value } = e.target
    const { message } = ValidationHelper.validateName(translate, value, 6, 255)
    setState({
      ...state,
      serviceName: value,
      serviceNameError: message
    })
  }

  const handleServiceEmail = (e) => {
    const { value } = e.target
    const { message } = ValidationHelper.validateEmail(translate, value)
    setState({
      ...state,
      serviceEmail: value,
      serviceEmailError: message
    })
  }

  const handleServicePassword = (e) => {
    const { value } = e.target
    const { message } = ValidationHelper.validatePassword(translate, value)
    setState({
      ...state,
      servicePassword: value,
      servicePasswordError: message
    })
  }

  const { service } = props
  const { serviceEmailError, serviceNameError, servicePasswordError } = state

  return (
    <DialogModal
      modalID='modal-create-service'
      isLoading={service.isLoading}
      formID='form-create-service'
      title={translate('manage_service.add_title')}
      func={save}
      disableSubmit={!isFormValidated()}
    >
      {/* Form thêm tài khoản người dùng mới */}
      <form id='form-create-service' onSubmit={() => save(translate('manage_service.add_success'))}>
        {/* Tên người dùng */}
        <div className={`form-group ${!serviceNameError ? '' : 'has-error'}`}>
          <label>
            {translate('table.name')}
            <span className='text-red'>*</span>
          </label>
          <input type='text' className='form-control' onChange={handleServiceName} />
          <ErrorLabel content={serviceNameError} />
        </div>

        {/* Email */}
        <div className={`form-group ${!serviceEmailError ? '' : 'has-error'}`}>
          <label>
            {translate('table.email')}
            <span className='text-red'>*</span>
          </label>
          <input type='email' className='form-control' onChange={handleServiceEmail} />
          <ErrorLabel content={serviceEmailError} />
        </div>

        {/* Password */}
        <div className={`form-group ${!servicePasswordError ? '' : 'has-error'}`}>
          <label>
            {translate('form.password')}
            <span className='text-red'>*</span>
          </label>
          <input type='password' className='form-control' onChange={handleServicePassword} />
          <ErrorLabel content={servicePasswordError} />
        </div>
      </form>
    </DialogModal>
  )
}

function mapStateToProps(state) {
  const { service } = state
  return { service }
}

const mapDispatchToProps = {
  create: ServiceActions.create
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ServiceCreateForm))
