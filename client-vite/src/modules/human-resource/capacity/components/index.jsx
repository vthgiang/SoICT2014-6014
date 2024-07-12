import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
// import { CapacityActions } from '../redux/actions'
import './capacity.css'

import CapacityTable from './capacityTable'

class Capacity extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className='box' style={{ minHeight: '450px' }}>
        <div className='box-body'>
          <CapacityTable />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {
  // getListCapacity: CapacityActions.getListCapacity,
  // deleteCapacity: CapacityActions.deleteCapacity
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(Capacity))
