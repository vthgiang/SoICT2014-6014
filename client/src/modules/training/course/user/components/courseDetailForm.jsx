import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DialogModal } from '../../../../../common-components'

const CourseDetailForm = (props) => {
  const [state, setState] = useState({
    ...props
  })

  if (props._id !== state._id) {
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
      educationProgram: props.educationProgram,
      employeeCommitmentTime: props.employeeCommitmentTime,
      type: props.type,
      listEmployees: props.listEmployees,
      addEmployees: []
    })
  }
  const { course, translate } = props

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
    educationProgram
  } = state

  let formater = new Intl.NumberFormat()
  let failedNumber = 0,
    passNumber = 0,
    total = 0

  if (listEmployees && listEmployees.length !== 0) {
    total = listEmployees.length
    listEmployees.forEach((x) => {
      if (x.result === 'failed') {
        failedNumber += 1
      } else {
        passNumber += 1
      }
    })
  }

  return (
    <React.Fragment>
      <DialogModal
        modalID={`modal-view-course${_id}`}
        isLoading={course.isLoading}
        formID={`form-view-course${_id}`}
        title={`${translate('training.course.view_course')}: ${name} - ${courseId}`}
        hasSaveButton={false}
        size={25}
        maxWidth={850}
        hasNote={false}
      >
        <form className='form-group' id={`form-view-course${_id}`}>
          <div className='form-group'>
            <span>{translate('training.course.study_at')}</span>
            <span className='text-success' style={{ fontWeight: 'bold' }}>
              &nbsp;{coursePlace}
            </span>
            <span>,&nbsp;{translate('training.course.from')}</span>
            <span className='text-success' style={{ fontWeight: 'bold' }}>
              &nbsp;{startDate}&nbsp;
            </span>
            <span>{translate('training.course.to')}</span>
            <span className='text-success' style={{ fontWeight: 'bold' }}>
              &nbsp;{endDate}&nbsp;
            </span>
            {lecturer && (
              <span>
                {translate('training.course.with_lecturer')}
                <span className='text-success' style={{ fontWeight: 'bold' }}>
                  {' '}
                  {lecturer}
                </span>
              </span>
            )}
          </div>
          <div className='form-group'>
            <span>
              {translate('training.course.offered_by')}{' '}
              <span className='text-success' style={{ fontWeight: 'bold' }}>
                {offeredBy}
              </span>{' '}
              - {translate('training.course.table.education_program')}{' '}
              <span className='text-success' style={{ fontWeight: 'bold' }}>
                {educationProgram.name}
              </span>
            </span>
          </div>
          <div className='form-group'>
            <span>
              {translate('training.course.belong_type')}{' '}
              <span className='text-success' style={{ fontWeight: 'bold' }}>
                {translate(`training.course.type.${type}`)}
              </span>{' '}
              {translate('training.course.with_cost')}{' '}
              <span className='text-success' style={{ fontWeight: 'bold' }}>
                {formater.format(cost)} {unit}
              </span>{' '}
              {translate('training.course.commitment_time')}{' '}
              <span className='text-success' style={{ fontWeight: 'bold' }}>
                {employeeCommitmentTime} {translate('training.course.month')}
              </span>
            </span>
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

function mapState(state) {
  const { course } = state
  return { course }
}

const detailForm = connect(mapState, null)(withTranslate(CourseDetailForm))
export { detailForm as CourseDetailForm }
