import React from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { AuthActions } from '../../auth/redux/actions'
import './intro.css'

const Service = ({ translate }) => {
  return (
    <React.Fragment>
      <section id='dx-service' className='dx-container'>
        <h3 className='text-center'>{translate('intro.service.title')}</h3>
        <p>{translate('intro.service.content')}</p>
        <div className='row p-center'>
          <div className='col-xs-12 col-sm-12 col-md-4 col-lg-4'>
            <div className='dx-card'>
              <div className='dx-card-header'>
                <img className='service-image' src='/library/dx/images/kpi.png' />
              </div>
              <div className='dx-card-body'>
                <h4>{translate('intro.service.kpi.title')}</h4>
                <p>{translate('intro.service.kpi.content')}</p>
              </div>
            </div>
          </div>
          <div className='col-xs-12 col-sm-12 col-md-4 col-lg-4'>
            <div className='dx-card'>
              <div className='dx-card-header'>
                <img className='service-image' src='/library/dx/images/task.png' />
              </div>
              <div className='dx-card-body'>
                <h4>{translate('intro.service.task.title')}</h4>
                <p>{translate('intro.service.task.content')}</p>
              </div>
            </div>
          </div>
          <div className='col-xs-12 col-sm-12 col-md-4 col-lg-4'>
            <div className='dx-card'>
              <div className='dx-card-header'>
                <img className='service-image' src='/library/dx/images/document.png' />
              </div>
              <div className='dx-card-body'>
                <h4>{translate('intro.service.document.title')}</h4>
                <p>{translate('intro.service.document.content')}</p>
              </div>
            </div>
          </div>
          <div className='col-xs-12 col-sm-12 col-md-4 col-lg-4'>
            <div className='dx-card'>
              <div className='dx-card-header'>
                <img className='service-image' src='/library/dx/images/employee.png' />
              </div>
              <div className='dx-card-body'>
                <h4>{translate('intro.service.employee.title')}</h4>
                <p>{translate('intro.service.employee.content')}</p>
              </div>
            </div>
          </div>
          <div className='col-xs-12 col-sm-12 col-md-4 col-lg-4'>
            <div className='dx-card'>
              <div className='dx-card-header'>
                <img className='service-image' src='/library/dx/images/assets.png' />
              </div>
              <div className='dx-card-body'>
                <h4>{translate('intro.service.asset.title')}</h4>
                <p>{translate('intro.service.asset.content')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='dx-container'>
        <div className='row p-center-h'>
          <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6'>
            <h2 className='dx-sologan text-center'>{translate('intro.service.task.title')}</h2>
            <p>{translate('intro.service.task.detail')}</p>
          </div>
          <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6'>
            <img className='dx-intro-image dx-card' src='/library/dx/images/mtask.png' />
          </div>
        </div>
      </section>

      <section className='dx-container'>
        <div className='row p-center-h'>
          <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6'>
            <img className='dx-intro-image dx-card' src='/library/dx/images/mkpi.png' />
          </div>
          <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6'>
            <h2 className='dx-sologan text-center'>{translate('intro.service.kpi.title')}</h2>
            <p>{translate('intro.service.kpi.detail')}</p>
          </div>
        </div>
      </section>

      <section className='dx-container'>
        <div className='row p-center-h'>
          <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6'>
            <h2 className='dx-sologan text-center'>{translate('intro.service.document.title')}</h2>
            <p>{translate('intro.service.document.detail')}</p>
          </div>
          <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6'>
            <img className='dx-intro-image dx-card' src='/library/dx/images/mdocument.png' />
          </div>
        </div>
      </section>

      <section className='dx-container'>
        <div className='row p-center-h'>
          <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6'>
            <img className='dx-intro-image dx-card' src='/library/dx/images/memployee.png' />
          </div>
          <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6'>
            <h2 className='dx-sologan text-center'>{translate('intro.service.employee.title')}</h2>
            <p>{translate('intro.service.employee.detail')}</p>
          </div>
        </div>
      </section>

      <section className='dx-container'>
        <div className='row p-center-h'>
          <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6'>
            <h2 className='dx-sologan text-center'>{translate('intro.service.asset.title')}</h2>
            <p>{translate('intro.service.asset.detail')}</p>
          </div>
          <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6'>
            <img className='dx-intro-image dx-card' src='/library/dx/images/masset.png' />
          </div>
        </div>
      </section>
    </React.Fragment>
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

export default connect(mapState, mapDispatchToProps)(withTranslate(Service))
