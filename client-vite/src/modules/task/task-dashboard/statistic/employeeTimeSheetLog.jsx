import React, { Component, Fragment, useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions'
import EmployeeTimeSheetLogTable from './employeeTimeSheetLogTable'

function EmployeeTimeSheetLog(props) {
  const { department, getDepartment } = props

  console.log('parent render')

  useEffect(() => {
    getDepartment()
    console.log('parrent department', department)
  }, [])
  return <EmployeeTimeSheetLogTable />
}

function mapState(state) {
  const { department } = state
  return { department }
}
const actionCreators = {
  getDepartment: DepartmentActions.get
}

export default connect(mapState, actionCreators)(withTranslate(EmployeeTimeSheetLog))
