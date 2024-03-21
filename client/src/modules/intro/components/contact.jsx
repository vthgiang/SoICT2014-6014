import React from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { AuthActions } from '../../auth/redux/actions'
import './intro.css'

const Contact = ({ translate }) => {
  return (
    <section id='dx-contact' className='dx-container'>
      <div className='row'>
        <h3 className='dx-contact'>{translate('intro.contact.title')}</h3>
        <p class='dx-contact'>{translate('intro.contact.company')}</p>
        <form className='dx-contact'>
          <input placeholder={translate('intro.contact.form.name')}></input>
          <input placeholder={translate('intro.contact.form.email')}></input>
          <textarea placeholder={translate('intro.contact.form.content')}></textarea>
          <button className='dx-contact'>{translate('intro.contact.form.send')}</button>
        </form>
      </div>
    </section>
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

export default connect(mapState, mapDispatchToProps)(withTranslate(Contact))
