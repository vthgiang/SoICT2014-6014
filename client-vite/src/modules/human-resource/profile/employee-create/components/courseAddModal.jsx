import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal, ErrorLabel, ButtonModal, SelectBox } from '../../../../../common-components'

import { CourseFormValidator } from '../../../../training/course/components/courseFormValidator'

function CourseAddModal(props) {
  const [state, setState] = useState({
    result: 'failed',
    course: '',
    nameCourse: ''
  })

  const { listCourses } = props.course
  const { translate, id, roles } = props
  const { errorOnCourseId, course, result, nameCourse } = state

  // Bắt sự kiện thay đổi kết quả đào tạo
  const handleResultChange = (value) => {
    setState((state) => {
      return {
        ...state,
        result: value[0]
      }
    })
  }

  // Bắt sự kiện thay đổi mã khoá đào tạo
  const handleCourseIdChange = (value) => {
    validateCourseId(value[0], true)
    let nameCourse = ''
    props.course.listCourses.forEach((x) => {
      if (x._id === value[0]) {
        nameCourse = x.name
      }
    })
    setState((state) => {
      return {
        ...state,
        nameCourse: nameCourse
      }
    })
  }

  const validateCourseId = (value, willUpdateState = true) => {
    let msg = CourseFormValidator.validateCourseId(value, props.translate)
    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnCourseId: msg,
          course: value
        }
      })
    }
    return msg === undefined
  }

  // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
  const isFormValidated = () => {
    return validateCourseId(state.course, false)
  }

  // Bắt sự kiện submit form
  const save = async () => {
    if (isFormValidated()) {
      props.handleChange(state)
    }
  }

  return (
    <React.Fragment>
      <ButtonModal modalID={`modal-create-course-${id}`} button_name={translate('modal.create')} title='Thêm mới khoá đào tạo' />
      <DialogModal
        size='50'
        modalID={`modal-create-course-${id}`}
        isLoading={false}
        formID={`form-create-course-${id}`}
        title='Thêm mới khoá đào tạo'
        func={save}
        disableSubmit={!isFormValidated()}
        maxWidth={500}
      >
        <form className='form-group' id={`form-create-course-${id}`}>
          {(!roles || roles.length == 0) && (
            <div className='col-sm-12 col-xs-12 form-group'>
              <span className='text-red'>Nhân viên chưa thuộc phòng ban nào</span>
            </div>
          )}
          <div className={`col-sm-12 col-xs-12 form-group ${errorOnCourseId && 'has-error'}`}>
            <label>
              Mã khoá đào tạo<span className='text-red'>*</span>
            </label>
            <SelectBox
              id={`create_courseID_course${id}`}
              disabled={!roles || roles.length == 0}
              className='form-control select2'
              style={{ width: '100%' }}
              value={course}
              items={[
                ...listCourses.map((u, i) => {
                  return { value: u._id, text: u.courseId }
                }),
                { value: '', text: 'Chọn khoá đào tạo' }
              ]}
              onChange={handleCourseIdChange}
            />
            <ErrorLabel content={errorOnCourseId} />
          </div>
          <div className={`form-group col-sm-12 col-xs-12`}>
            <label>
              Tên khoá đào tạo<span className='text-red'>*</span>
            </label>
            <input type='text' className='form-control' value={nameCourse} placeholder='Tên khoá đào tạo' disabled />
          </div>
          <div className={`form-group col-sm-12 col-xs-12`}>
            <label>
              Kết quả<span className='text-red'>*</span>
            </label>
            <SelectBox
              id={`create_result_course${id}`}
              className='form-control select2'
              style={{ width: '100%' }}
              value={result}
              items={[
                { value: 'pass', text: 'Đạt' },
                { value: 'failed', text: 'Không đạt' }
              ]}
              onChange={handleResultChange}
            />
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

const addModal = connect(mapState, null)(withTranslate(CourseAddModal))
export { addModal as CourseAddModal }
