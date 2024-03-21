import React, { Component } from 'react'

import { TransportDepartmentManagementTable } from '../components/transportDepartmentManagementTable'
class TransportDepartment extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <div className='box' style={{ minHeight: '450px' }}>
        <div className='box-body'>
          <TransportDepartmentManagementTable />
        </div>
      </div>
    )
  }
}

export default TransportDepartment
