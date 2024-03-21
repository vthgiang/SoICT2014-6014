import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DialogModal } from '../../../../../common-components'

import { EmployeeManagerActions } from '../../../../human-resource/profile/employee-management/redux/actions'
import { CourseActions } from '../redux/actions'

const CourseRegister = (props) => {
  const [state, setState] = useState({
    ...props,
    addEmployees: [],
    isRegistered: props.registeredEmployees.find((i) => i.user == localStorage.getItem('userId'))?.registerType || 0
  })

  useEffect(() => {
    const { applyForOrganizationalUnits, applyForPositions } = state
    props.getAllEmployee({ organizationalUnits: applyForOrganizationalUnits, position: applyForPositions })
  }, [])

  const save = () => {
    let { startDate, endDate, listEmployees } = state

    let partStart = startDate.split('-')
    let startDateNew = [partStart[2], partStart[1], partStart[0]].join('-')
    let partEnd = endDate.split('-')
    let endDateNew = [partEnd[2], partEnd[1], partEnd[0]].join('-')

    const subscriber = {
      user: localStorage.getItem('userId'),
      registerType: 1
    }

    listEmployees = listEmployees.concat(state.addEmployees)
    props.updateCourse(state._id, {
      ...state,
      subscriber: subscriber,
      listEmployees: listEmployees,
      startDate: startDateNew,
      endDate: endDateNew
    })
  }

  if (props._id !== state._id || props.registeredEmployees.length !== state.registeredEmployees.length) {
    setState({
      ...state,
      _id: props._id,
      unit: props.unit,
      name: props.name,
      courseId: props.courseId,
      offeredBy: props.offeredBy,
      coursePlace: props.coursePlace,
      startDate: props.startDate,
      endDate: props.endDate,
      cost: props.cost,
      lecturer: props.lecturer,
      applyForOrganizationalUnits: props.applyForOrganizationalUnits,
      applyForPositions: props.applyForPositions,
      educationProgram: props.educationProgram,
      employeeCommitmentTime: props.employeeCommitmentTime,
      type: props.type,
      listEmployees: props.listEmployees,
      addEmployees: [],
      registeredEmployees: props.registeredEmployees,
      errorOnCourseName: undefined,
      errorOnCoursePlace: undefined,
      errorOnOfferedBy: undefined,
      errorOnCost: undefined,
      errorOnEmployeeCommitmentTime: undefined,
      errorOnEducationProgram: undefined,
      errorOnStartDate: undefined,
      errorOnEndDate: undefined,
      isRegistered: props.registeredEmployees.find((i) => i.user == localStorage.getItem('userId'))?.registerType || 0
    })
  }

  const { education, translate, course, employeesManager } = props

  const {
    _id,
    name,
    courseId,
    type,
    offeredBy,
    coursePlace,
    startDate,
    unit,
    listEmployees,
    endDate,
    cost,
    lecturer,
    employeeCommitmentTime,
    educationProgram,
    isRegistered
  } = state

  let listEducations = education.listAll,
    employeeInfors = [],
    userlist = []

  if (employeesManager.listEmployeesOfOrganizationalUnits.length !== 0) {
    userlist = employeesManager.listEmployeesOfOrganizationalUnits
  }

  if (listEmployees.length !== 0) {
    for (let n in listEmployees) {
      userlist = userlist.filter((x) => x._id !== listEmployees[n]._id)
      let employeeInfor = employeesManager.listEmployeesOfOrganizationalUnits.filter((x) => x._id === listEmployees[n]._id)
      employeeInfor[0] = { ...employeeInfor[0], result: listEmployees[n].result }
      employeeInfors = employeeInfor.concat(employeeInfors)
    }
  }

  const DisplayStatus = () => {
    switch (state.isRegistered) {
      case 0: {
        return (
          <div>
            {translate('training.course.status.register')}:{' '}
            <span style={{ fontWeight: 'bold' }}>{translate('training.course.status.is_not_registered')}</span>
          </div>
        )
      }
      case 1: {
        return (
          <div>
            {translate('training.course.status.register')}:{' '}
            <span style={{ fontWeight: 'bold' }} className='text-yellow'>
              {translate('training.course.status.waiting_for_approval')}
            </span>
          </div>
        )
      }
      case 2: {
        return (
          <div>
            {translate('training.course.status.register')}:{' '}
            <span style={{ fontWeight: 'bold' }} className='text-green'>
              {translate('training.course.status.success')}
            </span>
          </div>
        )
      }
      case 3: {
        return (
          <div>
            {translate('training.course.status.register')}:{' '}
            <span style={{ fontWeight: 'bold' }} className='text-green'>
              {translate('training.course.status.reject')}
            </span>
          </div>
        )
      }
      default: {
        break
      }
    }
  }
  return (
    <React.Fragment>
      <DialogModal
        modalID={`modal-edit-course${_id}`}
        isLoading={course.isLoading}
        formID={`form-edit-course${_id}`}
        title={translate('training.course.register')}
        func={save}
        size={25}
        maxWidth={850}
        saveText={isRegistered == 1 ? translate('training.course.cancel_register') : translate('training.course.register')}
        disableSubmit={isRegistered === 2 || isRegistered === 3}
      >
        <div>
          {translate('training.course.table.course_code')}:{' '}
          <span style={{ fontWeight: 'bold' }} className='text-success'>
            {courseId}
          </span>
        </div>
        <div>
          {translate('training.course.table.course_name')}:{' '}
          <span style={{ fontWeight: 'bold' }} className='text-success'>
            {name}
          </span>
        </div>
        <div>
          {translate('training.course.start_date')}:{' '}
          <span style={{ fontWeight: 'bold' }} className='text-success'>
            {startDate}
          </span>
        </div>
        <div>
          {translate('training.course.end_date')}:{' '}
          <span style={{ fontWeight: 'bold' }} className='text-success'>
            {endDate}
          </span>
        </div>
        <div>
          {translate('training.course.table.course_place')}:{' '}
          <span style={{ fontWeight: 'bold' }} className='text-success'>
            {coursePlace}
          </span>
        </div>
        <div>
          {translate('training.course.table.offered_by')}:{' '}
          <span style={{ fontWeight: 'bold' }} className='text-success'>
            {offeredBy}
          </span>
        </div>
        <div>
          {translate('training.course.table.lecturer')}:{' '}
          <span style={{ fontWeight: 'bold' }} className='text-success'>
            {lecturer}
          </span>
        </div>
        <div>
          {translate('training.course.table.course_type')}:{' '}
          <span style={{ fontWeight: 'bold' }} className='text-success'>
            {type}
          </span>
        </div>
        <div>
          {translate('training.course.table.education_program')}:{' '}
          <span style={{ fontWeight: 'bold' }} className='text-success'>
            {educationProgram.name}
          </span>
        </div>
        <div>
          {translate('training.course.table.cost')}:{' '}
          <span style={{ fontWeight: 'bold' }} className='text-success'>
            {cost}
          </span>
        </div>
        <div>
          {translate('training.course.table.employee_commitment_time')}:{' '}
          <span style={{ fontWeight: 'bold' }} className='text-success'>
            {employeeCommitmentTime}
          </span>
        </div>
        <DisplayStatus />
      </DialogModal>
    </React.Fragment>
  )
}

function mapState(state) {
  const { course, education, employeesManager } = state
  return { course, education, employeesManager }
}

const actionCreators = {
  updateCourse: CourseActions.updateCourse,
  getAllEmployee: EmployeeManagerActions.getAllEmployee
}

const courseRegister = connect(mapState, actionCreators)(withTranslate(CourseRegister))
export { courseRegister as CourseRegister }
