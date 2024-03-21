import React from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { AuthActions } from '../../auth/redux/actions'
import './intro.css'

const Location = ({ translate }) => {
  return (
    <section id='dx-location' className='dx-container'>
      <div className='row p-center'>
        <div className='col-xs-12 col-sm-12 col-md-8 col-lg-8'>
          <div
            dangerouslySetInnerHTML={{
              __html:
                '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.649329143436!2d105.8440409142974!3d21.006689393908722!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac760a8b09cf%3A0xd78e46d7bbefe566!2zTmfDtSAzMCBU4bqhIFF1YW5nIELhu611LCBCw6FjaCBLaG9hLCBIYWkgQsOgIFRyxrBuZywgSMOgIE7hu5lpLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1603851884788!5m2!1svi!2s" width="100%" height="400" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>'
            }}
          ></div>
        </div>
        <div className='col-xs-12 col-sm-12 col-md-4 col-lg-4'>
          <h3 className='text-center'>{translate('intro.address.title')}</h3>
          <ul className='dx-locations'>
            <li className='dx-location-item'>
              <i className='fa fa-map-marker'></i>
              {translate('intro.address.content.location')}
            </li>
            <li className='dx-location-item'>
              <i className='fa fa-phone'></i>
              {translate('intro.address.content.phone')}
            </li>
            <li className='dx-location-item'>
              <i className='fa fa-envelope'></i>
              {translate('intro.address.content.email')}
            </li>
          </ul>
        </div>
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

export default connect(mapState, mapDispatchToProps)(withTranslate(Location))
