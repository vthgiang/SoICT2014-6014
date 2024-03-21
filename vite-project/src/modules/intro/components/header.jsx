import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate, IntlActions } from 'react-redux-multilingual'
import { AuthActions } from '../../auth/redux/actions'
import { getStorage, setStorage } from '../../../config'
import moment from 'moment'
import store from '../../../redux/store'
import './intro.css'

const Header = (props) => {
  const [user, setUser] = useState({})
  const { translate } = props
  const _setLanguage = () => {
    window.$('#dx-language-setting').slideToggle()
  }

  const _setVie = () => {
    setStorage('lang', 'vn')
    moment.locale('vi')
    store.dispatch(IntlActions.setLocale('vn'))
  }

  const _setEng = () => {
    setStorage('lang', 'en')
    moment.locale('en')
    store.dispatch(IntlActions.setLocale('en'))
  }

  useEffect(() => {
    const user = getStorage('userId')
    setUser(user)
    if (user) {
      props.refresh()

      const currentRole = getStorage('currentRole')
      props.getLinksOfRole(currentRole).then((res) => {
        setUser(props.auth.user._id)
      })
    }
  }, [user])

  return (
    <header className='fixed-top p-center-h'>
      <h1>DX workplace</h1>
      <span id='dx-language-setting' className='dx-language-setting p-center-h'>
        <a style={{ cursor: 'pointer' }} onClick={_setEng}>
          <img src='/library/dx/images/eng.png' className='img-circle' />
        </a>
        <a style={{ cursor: 'pointer' }} onClick={_setVie}>
          <img src='/library/dx/images/vietnam.png' className='img-circle' />
        </a>
      </span>
      <span className='dx-options'>
        <a href='#dx-intro'>Giới thiệu</a>
        <a href='#dx-service'>Dịch vụ</a>
        <a href='#dx-contact'>Liên hệ</a>
        <a href='#dx-location'>Thông tin</a>
        <a href='#dx-service-signup'>Đăng ký</a>
      </span>
      <span className='dx-language'>
        <button onClick={_setLanguage}>
          <i className='fa fa-language'></i>
        </button>
      </span>
      <span className='dx-auth'>
        {user ? (
          <a href='/home' className='dx-workspace-button' title={translate('intro.auth.start')}>
            {translate('intro.auth.start')}
          </a>
        ) : (
          <a href='/login' className='dx-workspace-button' title={translate('intro.auth.signin')}>
            {translate('intro.auth.signin')}
          </a>
        )}
      </span>
    </header>
  )
}

function mapState(state) {
  const { auth } = state
  return { auth }
}

const mapDispatchToProps = {
  refresh: AuthActions.refresh,
  getLinksOfRole: AuthActions.getLinksOfRole,
  getComponentsOfUserInLink: AuthActions.getComponentOfUserInLink
}

export default connect(mapState, mapDispatchToProps)(withTranslate(Header))
