import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { AuthActions } from '../redux/actions'
import ForgotPassword from './forgotPassword'
import { clearStorage, getStorage } from '../../../config'
import './login.css'

function Login(props) {
  const [state, setState] = useState({
    emailForgot: null,
    newPassword: null,
    confirmNewPassword: null,
    portal: getStorage('portal')
  })
  const { translate, auth } = props
  const handleChange = (e) => {
    const { target } = e
    const { name } = target
    const { value } = target
    setState({
      ...state,
      [name]: value
    })
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    const { email, password, portal } = state
    console.log(state)
    props.login({ email, password, portal })
  }

  return (
    <div className='dx-login-page'>
      <div className='dx-login-box'>
        <h1 className='text-center'>
          <b>{translate('form.signin')}</b>
        </h1>
        {auth.error && (
          <div className='alert alert-danger alert-dismissible text-left'>
            <i className='icon fa fa-ban' /> {translate(`auth.${auth.error}`)}
          </div>
        )}
        <form className='dx-login-form' onSubmit={handleSubmit}>
          <div className='dx-login-line'>
            <label>
              <i className='glyphicon glyphicon-envelope' />
              <span className='dx-login-text'>{translate('form.email')}</span>
            </label>
            <input
              className='dx-login-input'
              name='email'
              onChange={handleChange}
              type='email'
              placeholder={translate('form.email')}
              required
            />
          </div>
          <div className='dx-login-line'>
            <label>
              <i className='glyphicon glyphicon-lock' />
              <span className='dx-login-text'>{translate('form.password')}</span>
            </label>
            <input
              className='dx-login-input'
              name='password'
              onChange={handleChange}
              type='password'
              placeholder={translate('form.password')}
              required
            />
          </div>
          <div className='dx-login-line'>
            <label>
              <i className='glyphicon glyphicon-hdd' />
              <span className='dx-login-text'>{translate('form.portal')}</span>
            </label>
            <input className='dx-login-input' name='portal' onChange={handleChange} type='text' placeholder='Portal' value={state.portal} />
          </div>
          <button type='submit' className='dx-login-submit'>
            <span className='dx-login-text'>{translate('form.signin')}</span>
          </button>
        </form>
        <div>
          <a data-toggle='modal' href='/reset-password'>
            {translate('form.forgot_password')}
          </a>
          <br />
          {/* <ForgotPassword /> */}
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return state
}

const mapDispatchToProps = {
  login: AuthActions.login,
  forgotPassword: AuthActions.forgotPassword
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(Login))
