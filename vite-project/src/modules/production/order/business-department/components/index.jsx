import React, { Component } from 'react'
import BusinessDepartmentManagementTable from './businessDepartmentManagementTable'

function BusinessDepartment(props) {
  return (
    <div className='box' style={{ minHeight: '450px' }}>
      <div className='box-body'>
        <BusinessDepartmentManagementTable />
      </div>
    </div>
  )
}

export default BusinessDepartment
