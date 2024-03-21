import React from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import './alert.css'

import store from '../../../redux/store'
import { SocketConstants } from '../../socket/redux/constants'

const ServerDisconnectedAlert = (props) => {
  const { translate } = props

  const reset = () => {
    store.dispatch({ type: SocketConstants.DISCONNECT_SOCKET_IO })
    store.dispatch({ type: 'RESET' })
  }

  const refreshPage = () => {
    window.location.reload(true)
  }

  return (
    <React.Fragment>
      <div className='modal fade' id='alert-error-server-disconnected'>
        <div className='modal-dialog' style={{ marginTop: '100px' }}>
          <div className='modal-header bg bg-red' style={{ fontSize: '18px' }}>
            <i className='icon fa fa-bullhorn' />
            <b style={{ marginLeft: '5px' }}> {translate('general.auth_alert.title')}</b>
          </div>
          <div className='modal-content'>
            <div className='modal-body'>
              <div className='row'>
                <div className='col-xs-4 col-sm-4 col-md-4 col-lg-4'>
                  <div className='box-inner iconWrapper'>
                    <i style={{ fontSize: '70px' }} className='fa fa-frown-o iconAlert' aria-hidden='true'></i>
                  </div>
                </div>
                <div className='col-xs-8 col-sm-8 col-md-8 col-lg-8'>
                  <div className='box-inner'>
                    <h4 style={{ fontWeight: 'bold' }}>{translate('general.server_disconnect')}</h4>
                    <p>Cách khắc phục:</p>
                    <ul>
                      <li>{translate('general.check_connect_again')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className='modal-footer'>
              <div className='row'>
                <div className='col-xs-6 col-sm-6 col-md-6 col-lg-6'></div>
                <div className='col-xs-6 col-sm-6 col-md-6 col-lg-6'>
                  <button className='btn btn-default' data-dismiss='modal' onClick={refreshPage}>
                    Tải lại trang
                  </button>
                  <button style={{ marginLeft: '10px' }} className='btn btn-danger pull-right' data-dismiss='modal' onClick={reset}>
                    {translate('auth.logout')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  return state
}

export default connect(mapStateToProps)(withTranslate(ServerDisconnectedAlert))
