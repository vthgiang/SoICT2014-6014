import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import ErrorRate from './ErrorRate'
import ErrorByRepoter from './ErrorByRepoter'
import { qualityDashboardActions } from '../redux/actions'

const ManufacturingQualityDashboard = (props) => {
  const { translate, qualityDasboard } = props

  useEffect(() => {
    props.getNumberCreatedInspection()
    props.getErrorNumByReporter()
    props.getErrorNumByGroup()
  }, [])

  return (
    <div className='row' style={{ marginTop: 10 }}>
      <div className='col-md-3 col-sm-3 col-xs-3'>
        <div className='info-box'>
          <span className='info-box-icon bg-aqua'>
            <i className='fa fa-file-text'></i>
          </span>
          <div className='info-box-content' title={translate('manufacturing.quality.dashboard.num_inspection')}>
            <span className='info-box-text'>{translate('manufacturing.quality.dashboard.num_inspection')}</span>
            <span className='info-box-number'>{qualityDasboard.numberCreatedInspection}</span>
            <a href='#' target='_blank'>
              {translate('manufacturing.dashboard.see_more')} <i className='fa fa-arrow-circle-right'></i>
            </a>
          </div>
        </div>
      </div>
      <div className='col-md-3 col-sm-3 col-xs-3'>
        <div className='info-box'>
          <span className='info-box-icon bg-blue'>
            <i className='fa fa-certificate'></i>
          </span>
          <div className='info-box-content' title={translate('manufacturing.quality.dashboard.num_criteria')}>
            <span className='info-box-text'>{translate('manufacturing.quality.dashboard.num_criteria')}</span>
            <span className='info-box-number'>6</span>
            <a href='#' target='_blank'>
              {translate('manufacturing.dashboard.see_more')} <i className='fa fa-arrow-circle-right'></i>
            </a>
          </div>
        </div>
      </div>
      <div className='col-md-3 col-sm-3 col-xs-3'>
        <div className='info-box'>
          <span className='info-box-icon bg-green'>
            <i className='fa fa-check-circle-o'></i>
          </span>
          <div className='info-box-content' title={translate('manufacturing.quality.dashboard.passed_num')}>
            <span className='info-box-text'>{translate('manufacturing.quality.dashboard.passed_num')}</span>
            <span className='info-box-number'>450</span>
            <a href='#' target='_blank'>
              {translate('manufacturing.dashboard.see_more')} <i className='fa fa-arrow-circle-right'></i>
            </a>
          </div>
        </div>
      </div>
      <div className='col-md-3 col-sm-3 col-xs-3'>
        <div className='info-box'>
          <span className='info-box-icon bg-red'>
            <i className='fa fa-exclamation'></i>
          </span>
          <div className='info-box-content' title={translate('manufacturing.quality.dashboard.error_num')}>
            <span className='info-box-text'>{translate('manufacturing.quality.dashboard.error_num')}</span>
            <span className='info-box-number'>27</span>
            <a href='#' target='_blank'>
              {translate('manufacturing.dashboard.see_more')} <i className='fa fa-arrow-circle-right'></i>
            </a>
          </div>
        </div>
      </div>
      <div className='col-md-6 col-sm-6 col-xs-6'>
        <div className='box'>
          <div className='box-header with-border'>
            <i className='fa fa-bar-chart-o' />
            <h3 className='box-title'>{translate('manufacturing.quality.dashboard.error_rate')}</h3>
            <ErrorRate />
          </div>
        </div>
      </div>
      <div className='col-md-6 col-sm-6 col-xs-6'>
        <div className='box'>
          <div className='box-header with-border'>
            <i className='fa fa-bar-chart-o' />
            <h3 className='box-title'>{translate('manufacturing.quality.dashboard.error_num_by_reporter')}</h3>
            <ErrorByRepoter />
          </div>
        </div>
      </div>
    </div>
  )
}

function mapStateToProps(state) {
  const { qualityDasboard } = state
  return { qualityDasboard }
}

const mapDispatchToProps = {
  getNumberCreatedInspection: qualityDashboardActions.getNumberCreatedInspection,
  getErrorNumByReporter: qualityDashboardActions.getErrorNumByReporter,
  getErrorNumByGroup: qualityDashboardActions.getErrorNumByGroup
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManufacturingQualityDashboard))
