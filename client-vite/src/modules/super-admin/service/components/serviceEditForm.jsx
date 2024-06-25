import React, { useEffect, useState } from 'react'
import { useTranslate, withTranslate } from 'react-redux-multilingual'
import { connect } from 'react-redux'
import { DialogModal, ErrorLabel } from '../../../../common-components'
import { ServiceActions } from '../redux/actions'
import ValidationHelper from '../../../../helpers/validationHelper'

function ServiceEditForm(props) {
  const translate = useTranslate()
  const [state, setState] = useState({
    status: [
      { id: 1, name: 'disable', value: false },
      { id: 2, name: 'enable', value: true }
    ]
  })

  const save = () => {
    if (isFormValidated()) {
      return props.edit(props.serviceId, {
        email: state.serviceEmail,
        name: state.serviceName,
        active: state.serviceActive
      })
    }
  }

  const isFormValidated = () => {
    const { serviceName, serviceEmail } = state
    if (
      !ValidationHelper.validateName(translate, serviceName, 6, 255).status ||
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

  const handleServiceActiveChange = (e) => {
    const { value } = e.target
    setState({
      ...state,
      serviceActive: value
    })
  }

  useEffect(() => {
    if (props.serviceId !== state.serviceId) {
      setState({
        ...state,
        serviceId: props.serviceId,
        serviceEmail: props.serviceEmail,
        serviceName: props.serviceName,
        serviceActive: props.serviceActive,
        serviceEmailError: undefined,
        serviceNameError: undefined // Khi nhận thuộc tính mới, cần lưu ý reset lại các gợi ý nhắc lỗi, nếu không các lỗi cũ sẽ hiển thị lại
      })
    }
  }, [props.serviceId, props.serviceAttributes])

  const { service } = props
  const { serviceEmail, serviceName, serviceActive, status, serviceNameError, serviceEmailError } = state

  return (
    <DialogModal
      func={save}
      isLoading={service.isLoading}
      modalID='modal-edit-service'
      formID='form-edit-service'
      title={translate('manage_service.edit')}
      disableSubmit={!isFormValidated()}
    >
      {/* Form chỉnh sửa thông tin tài khoản người dùng */}
      <form id='form-edit-service'>
        {/* Tên người dùng */}
        <div className={`form-group ${!serviceNameError ? '' : 'has-error'}`}>
          <label>
            {translate('table.name')}
            <span className='text-red'>*</span>
          </label>
          <input type='text' className='form-control' value={serviceName} onChange={handleServiceName} />
          <ErrorLabel content={serviceNameError} />
        </div>

        {/* Email */}
        <div className={`form-group ${!serviceEmailError ? '' : 'has-error'}`}>
          <label>
            {translate('table.email')}
            <span className='text-red'>*</span>
          </label>
          <input type='email' className='form-control' value={serviceEmail} onChange={handleServiceEmail} />
          <ErrorLabel content={serviceEmailError} />
        </div>

        {/* Status */}
        <div className='form-group'>
          <label>
            {translate('table.status')}
            <span className='text-red'>*</span>
          </label>
          <select className='form-control' style={{ width: '100%' }} value={serviceActive} onChange={handleServiceActiveChange}>
            {status.map((result) => (
              <option key={result.id} value={result.value}>
                {translate(`manage_service.${result.name}`)}
              </option>
            ))}
          </select>
        </div>
      </form>
    </DialogModal>
  )
}

function mapStateToProps(state) {
  const { service } = state
  return { service }
}

const action = {
  edit: ServiceActions.edit
}

export default connect(mapStateToProps, action)(withTranslate(ServiceEditForm))
