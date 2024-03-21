import React, { Component } from 'react'
import { CarrierMissionManagementTable } from './carrierMissionManagementTable'

class CarrierTodayTransportMission extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <div className='box' style={{ minHeight: '450px' }}>
        <div className='box-body'>
          <CarrierMissionManagementTable />
        </div>
      </div>
    )
  }
}

export default CarrierTodayTransportMission
