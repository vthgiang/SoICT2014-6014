import React, { Component } from 'react'

import { TransportManageRouteMainPage } from '../components/transportManageRouteMainPage'
import { TransportProcessMainPage } from '../components/transportProcessMainPage'

class TransportRoute extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <div className='box' style={{ minHeight: '450px' }}>
        <div className='box-body'>
          <TransportProcessMainPage />
        </div>
      </div>
    )
  }
}

export default TransportRoute
