import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DialogModal } from '../../../../../common-components'

import { CourseActions } from '../../../course/user/redux/actions'
const EducationProgramDetailForm = (props) => {
  const [state, setState] = useState({})

  if (props._id !== state._id || props.programName !== state.programName) {
    setState({
      ...state,
      _id: props._id,
      programName: props.programName,
      educationProgram: props._id,
      programId: props.programId,
      listCourses: props.listCourses,
      totalList: props.totalList,
      detail: props.detail,
      courseId: '',
      type: null,
      page: 0,
      limit: 5
    })
  }

  const { education, course, translate, data } = props

  let { _id, programName, programId, listCourses, page, limit, totalList, search, detail } = state

  if (search === true) {
    listCourses = course.listCourses
    totalList = course.totalList
  }

  return (
    <React.Fragment>
      <DialogModal
        modalID={`modal-view-education${_id}`}
        isLoading={education.isLoading && course.isLoading}
        formID={`form-view-education${_id}`}
        title={`${translate('training.education_program.view_education_program')}`}
        hasSaveButton={false}
        size={25}
        maxWidth={100}
        hasNote={false}
      >
        <form className='form-group' id={`form-view-education${_id}`}>
          <div>
            {translate('training.education_program.education_program_name')}: <b className='text-success'>{programName}</b>
          </div>
          <div>
            {translate('training.education_program.education_program_code')}: <b className='text-success'>{programId}</b>
          </div>
          <div>
            {translate('training.education_program.detail')}: <b className='text-success'>{detail}</b>
          </div>
          <div>
            {translate('training.education_program.table.total_courses')}: <b className='text-success'>{data.totalList}</b>
          </div>
          {education.isLoading || course.isLoading ? (
            <div className='table-info-panel'>{translate('confirm.loading')}</div>
          ) : (
            (!listCourses || listCourses.length === 0) && <div className='table-info-panel'>{translate('confirm.no_data')}</div>
          )}
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

function mapState(state) {
  const { course, education } = state
  return { course, education }
}

const actionCreators = {
  getListCourse: CourseActions.getListCourse
}

const detailForm = connect(mapState, actionCreators)(withTranslate(EducationProgramDetailForm))
export { detailForm as EducationProgramDetailForm }
