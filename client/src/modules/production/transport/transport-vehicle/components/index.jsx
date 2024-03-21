import React, { Component } from 'react'

import { TransportVehicleManagementTable } from './transportVehicleManagementTable'
/**
 * chua khai bao redux 5.3.1.4 redux
 */
class TransportVehicle extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <div className='box' style={{ minHeight: '450px' }}>
        <div className='box-body'>
          <TransportVehicleManagementTable />
        </div>
      </div>
    )
  }
}

export default TransportVehicle
