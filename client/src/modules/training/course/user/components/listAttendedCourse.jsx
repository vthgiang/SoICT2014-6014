import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { CourseDetailForm } from './combinedContent'

import { PaginateBar, DataTableSetting, SelectMulti } from '../../../../../common-components'

import { CourseActions } from '../redux/actions'
import { EducationActions } from '../../../education-program/redux/actions'
const ListAttendedCourse = (props) => {
  const [state, setState] = useState({
    courseId: '',
    name: '',
    type: null,
    page: 0,
    limit: 5
  })

  useEffect(() => {
    props.getListCourse(state)
    props.getListEducation()
  }, [])

  /**
   * Function format dữ liệu Date thành string
   * @param {*} date : Ngày muốn format
   * @param {*} monthYear : true trả về ngày tháng năm, false trả về tháng năm
   */
  const formatDate = (date, monthYear = false) => {
    if (date) {
      let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()

      if (month.length < 2) month = '0' + month
      if (day.length < 2) day = '0' + day

      if (monthYear === true) {
        return [month, year].join('-')
      } else return [day, month, year].join('-')
    }
    return date
  }

  /**
   * Function bắt sự kiện xem thông tin chương trình đào tạo
   * @param {*} value : Giá trị chương trình đào tạo
   */
  const handleView = async (value) => {
    await setState({
      ...state,
      currentViewRow: value
    })
    window.$(`#modal-view-course${value._id}`).modal('show')
  }

  /**
   * Bắt sự kiện thay đổi loại đào tạo để tìm kiếm
   * @param {*} value : Giá trị loại đào tạo
   */
  const handleTypeChange = (value) => {
    if (value.length === 0) {
      value = null
    }
    setState({
      ...state,
      type: value
    })
  }

  /** Bắt sự kiện thay đổi mã khoá đào tạo, tên khoá đào tạo */
  const handleChange = (e) => {
    const { name, value } = e.target
    setState({
      ...state,
      [name]: value
    })
  }

  /** Bắt sự kiện tìm kiếm */
  const handleSunmitSearch = () => {
    props.getListCourse(state)
  }

  /**
   * Function bắt sự kiện thay đổi số dòng hiện thị trên 1 trang
   * @param {*} number
   */
  const setLimit = async (number) => {
    await setState({
      limit: parseInt(number)
    })
    props.getListCourse(state)
  }

  /**
   * Function bắt sự kiện thay đổi trang muốn xem
   * @param {*} pageNumber
   */
  const setPage = async (pageNumber) => {
    let page = (pageNumber - 1) * state.limit
    await setState({
      page: parseInt(page)
    })
    props.getListCourse(state)
  }

  const { translate, course } = props

  const { page, limit, currentViewRow } = state

  let { listCoursesUserPassed } = course
  let pageTotal = course.totalList % limit === 0 ? parseInt(course.totalList / limit) : parseInt(course.totalList / limit + 1)
  let currentPage = parseInt(page / limit + 1)

  return (
    <React.Fragment>
      <div className='box'>
        <div className='box-body qlcv'>
          <div className='form-inline'>
            {/* Mã khoá đào tạo*/}
            <div className='form-group'>
              <label className='form-control-static'>{translate('training.course.table.course_code')}</label>
              <input
                type='text'
                className='form-control'
                name='courseId'
                onChange={handleChange}
                placeholder={translate('training.course.table.course_code')}
                autoComplete='off'
              />
            </div>
            {/* Tên khoá đào tạo  */}
            <div className='form-group'>
              <label className='form-control-static'>{translate('training.course.table.course_name')}</label>
              <input
                type='text'
                className='form-control'
                name='name'
                onChange={handleChange}
                placeholder={translate('training.course.table.course_name')}
                autoComplete='off'
              />
            </div>
          </div>

          <div className='form-inline' style={{ marginBottom: 10 }}>
            {/* Loại đào tạo */}
            <div className='form-group'>
              <label className='form-control-static'>{translate('training.course.table.course_type')}</label>
              <SelectMulti
                id={`multiSelectTypeCourse`}
                multiple='multiple'
                options={{
                  nonSelectedText: translate('training.course.no_course_type'),
                  allSelectedText: translate('training.course.all_course_type')
                }}
                onChange={handleTypeChange}
                items={[
                  { value: 'internal', text: translate('training.course.type.internal') },
                  { value: 'external', text: translate('training.course.type.external') }
                ]}
              ></SelectMulti>
            </div>
            <div className='form-group'>
              <label></label>
              <button type='submit' className='btn btn-success' onClick={() => handleSunmitSearch()}>
                {translate('general.search')}
              </button>
            </div>
          </div>

          <table id='course-table' className='table table-striped table-bordered table-hover'>
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }}>{translate('training.course.table.course_code')}</th>
                <th style={{ textAlign: 'center' }}>{translate('training.course.table.course_name')}</th>
                <th style={{ textAlign: 'center' }} title={translate('training.course.start_date')}>
                  {translate('training.course.table.start_date')}
                </th>
                <th style={{ textAlign: 'center' }} title={translate('training.course.end_date')}>
                  {translate('training.course.table.end_date')}
                </th>
                <th style={{ textAlign: 'center' }} title='Địa điểm đào tạo'>
                  {translate('training.course.table.course_place')}
                </th>
                <th style={{ textAlign: 'center' }}>{translate('training.course.table.offered_by')}</th>
                <th style={{ textAlign: 'center' }}>{translate('training.course.table.course_type')}</th>
                <th style={{ textAlign: 'center' }}>{translate('training.course.table.result')}</th>
                <th style={{ width: '120px', textAlign: 'center' }}>
                  {translate('general.action')}
                  <DataTableSetting
                    tableId='course-table'
                    columnArr={[
                      translate('training.course.table.course_code'),
                      translate('training.course.table.course_name'),
                      translate('training.course.table.start_date'),
                      translate('training.course.table.end_date'),
                      translate('training.course.table.course_place'),
                      translate('training.course.table.offered_by'),
                      translate('training.course.table.course_type'),
                      translate('training.course.table.result')
                    ]}
                    limit={state.limit}
                    setLimit={setLimit}
                    hideColumnOption={true}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {listCoursesUserPassed.length !== 0 &&
                listCoursesUserPassed &&
                listCoursesUserPassed.map((x, index) => (
                  <tr key={index}>
                    <td style={{ textAlign: 'center' }}>{x.courseId}</td>
                    <td style={{ textAlign: 'center' }}>{x.name}</td>
                    <td style={{ textAlign: 'center' }}>{formatDate(x.startDate)}</td>
                    <td style={{ textAlign: 'center' }}>{formatDate(x.endDate)}</td>
                    <td style={{ textAlign: 'center' }}>{x.coursePlace}</td>
                    <td style={{ textAlign: 'center' }}>{x.offeredBy}</td>
                    <td style={{ textAlign: 'center' }}>{translate(`training.course.type.${x.type}`)}</td>
                    <td style={{ textAlign: 'center' }}>{translate('training.course.result.pass')}</td>
                    <td style={{ textAlign: 'center' }}>
                      <a onClick={() => handleView(x)} style={{ width: '5px' }} title={translate('training.course.view_course')}>
                        <i className='material-icons'>view_list</i>
                      </a>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {course.isLoading ? (
            <div className='table-info-panel'>{translate('confirm.loading')}</div>
          ) : (
            (!listCoursesUserPassed || listCoursesUserPassed.length === 0) && (
              <div className='table-info-panel'>{translate('confirm.no_data')}</div>
            )
          )}
          <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={setPage} />
        </div>
        {currentViewRow && (
          <CourseDetailForm
            _id={currentViewRow._id}
            name={currentViewRow.name}
            courseId={currentViewRow.courseId}
            offeredBy={currentViewRow.offeredBy}
            coursePlace={currentViewRow.coursePlace}
            startDate={formatDate(currentViewRow.startDate)}
            endDate={formatDate(currentViewRow.endDate)}
            cost={currentViewRow.cost.number}
            lecturer={currentViewRow.lecturer}
            educationProgram={currentViewRow.educationProgram}
            employeeCommitmentTime={currentViewRow.employeeCommitmentTime}
            type={currentViewRow.type}
            listEmployees={currentViewRow.listEmployees}
            unit={currentViewRow.cost.unit}
          />
        )}
      </div>
    </React.Fragment>
  )
}

function mapState(state) {
  const { course, education } = state
  return { course, education }
}

const actionCreators = {
  getListCourse: CourseActions.getListCourse,
  getListEducation: EducationActions.getListEducation
}

const listAttendedCourse = connect(mapState, actionCreators)(withTranslate(ListAttendedCourse))

export { listAttendedCourse as TabListAttendedCourse }
