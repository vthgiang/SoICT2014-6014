import React from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { CompanyActions } from '../../system-admin/company/redux/actions'
import './intro.css'

const Signup = ({ translate, requestService }) => {
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [service, setService] = React.useState('')

  const _handleName = (e) => {
    let { value } = e.target
    setName(value)
  }

  const _handleEmail = (e) => {
    let { value } = e.target
    setEmail(value)
  }

  const _handlePhone = (e) => {
    let { value } = e.target
    setPhone(value)
  }

  const _handleService = (e) => {
    let { value } = e.target
    setService(value)
  }

  const _requestService = () => {
    requestService({ name, email, phone, service })
  }

  return (
    <section id='dx-service-signup' className='dx-container'>
      <div className='row p-center-h'>
        <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6'>
          <h3 className='text-center'>{translate('intro.service_signup.title')}</h3>
          <ul className='dx-services'>
            {translate('intro.service_signup.content').map((content) => (
              <li className='dx-service-item'>
                <i className='fa fa-check'></i>
                {content}
              </li>
            ))}
          </ul>
        </div>
        <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6'>
          <form class='dx-service'>
            <input onChange={_handleName} placeholder={translate('intro.service_signup.form.customer')}></input>
            <input onChange={_handleEmail} placeholder={translate('intro.service_signup.form.email')}></input>
            <input onChange={_handlePhone} placeholder={translate('intro.service_signup.form.phone')}></input>
            <select onChange={_handleService}>
              <option>{translate('intro.service_signup.form.type.choose')}</option>
              <option>{translate('intro.service_signup.form.type.standard')}</option>
              <option>{translate('intro.service_signup.form.type.full')}</option>
            </select>
            <button type='button' className='send' onClick={_requestService}>
              {translate('intro.service_signup.form.send')}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

const mapDispatchToProps = {
  requestService: CompanyActions.requestService
}

export default connect(null, mapDispatchToProps)(withTranslate(Signup))
