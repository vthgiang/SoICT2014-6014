import React, { useState } from 'react'
import { connect } from 'react-redux'
import { AuthActions } from '../redux/actions'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal, ErrorLabel } from '../../../common-components'
import ValidationHelper from '../../../helpers/validationHelper'
import { toast } from 'react-toastify'

function CreatePassword2(props) {
  const [state, setState] = useState({
    oldPasswordError: undefined,
    password2NewError: undefined,
    confirmPassword2Error: undefined
  })
  const { oldPasswordError, password2NewError, confirmPassword2Error } = state
  const { translate } = props

  const handleChangeOldPassword = (e) => {
    let { value } = e.target
    let { translate } = props
    let { message } = ValidationHelper.validatePassword(translate, value)

    setState({
      ...state,
      oldPassword: value,
      oldPasswordError: message
    })
  }

  const hanleChangeNewPwd2 = (e) => {
    let { value } = e.target
    let { translate } = props
    let { message } = ValidationHelper.validateEmpty(translate, value)

    setState({
      ...state,
      newPassword2: value,
      password2NewError: message
    })
  }

  const handleChangeConfirmPwd2 = (e) => {
    let { value } = e.target
    let { translate } = props
    let { message } = ValidationHelper.validateEmpty(translate, value)

    setState({
      ...state,
      confirmNewPassword2: value,
      confirmPassword2Error: message
    })
  }

  const isFormValidated = () => {
    const { oldPassword, newPassword2, confirmNewPassword2 } = state
    let { translate } = props
    if (
      !ValidationHelper.validatePassword(translate, oldPassword).status ||
      !ValidationHelper.validateEmpty(translate, newPassword2).status ||
      !ValidationHelper.validateEmpty(translate, confirmNewPassword2).status
    )
      return false
    return true
  }

  const save = () => {
    const { translate } = props
    const { oldPassword, newPassword2, confirmNewPassword2 } = state
    if (newPassword2 !== confirmNewPassword2) {
      toast.error(translate('auth.validator.confirm_password2_invalid'))
    }
    if (isFormValidated()) {
      return props.createPassword2({
        oldPassword,
        newPassword2,
        confirmNewPassword2
      })
    }
  }
  return (
    <DialogModal
      modalID='modal-create-pwd2'
      isLoading={false}
      formID='modal-create-pwd2'
      title={'Đổi mật khẩu cấp 2'}
      size={50}
      func={save}
      disableSubmit={!isFormValidated()}
    >
      <div style={{ padding: '10px 20px 10px 20px' }}>
        <div className={`form-group ${!oldPasswordError ? '' : 'has-error'}`}>
          <label>
            {translate('auth.security.password')}
            <span className='text-red'>*</span>
          </label>
          <input className='form-control' type='password' onChange={handleChangeOldPassword} placeholder='Nhập mật khẩu' />
          <ErrorLabel content={oldPasswordError} />
        </div>
        <div className={`form-group ${!password2NewError ? '' : 'has-error'}`}>
          <label>
            {translate('auth.security.new_password2')}
            <span className='text-red'>*</span>
          </label>
          <input className='form-control' type='password' onChange={hanleChangeNewPwd2} placeholder='Nhập mật khẩu cấp 2 mới' />
          <ErrorLabel content={password2NewError} />
        </div>
        <div className={`form-group ${!confirmPassword2Error ? '' : 'has-error'}`}>
          <label>
            {translate('auth.security.re_enter_new_password2')}
            <span className='text-red'>*</span>
          </label>
          <input className='form-control' type='password' onChange={handleChangeConfirmPwd2} placeholder='Nhập lại mật khẩu cấp 2 mới' />
          <ErrorLabel content={confirmPassword2Error} />
        </div>
      </div>
    </DialogModal>
  )
}

const mapStateToProps = (state) => {
  return state
}

const mapDispatchToProps = {
  createPassword2: AuthActions.createPassword2
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreatePassword2))
