import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DialogModal, ErrorLabel, DatePicker, TimePicker, SelectBox } from '../../../../common-components'

import { AnnualLeaveFormValidator } from './annualLeaveFormValidator'

import { AnnualLeaveActions } from '../redux/actions'
import { UserActions } from '../../../super-admin/user/redux/actions'
import { EmployeeManagerActions } from '../../profile/employee-management/redux/actions'

function AnnualLeaveCreateForm(props) {
  const { translate, annualLeave, user, employeesManager, department } = props
  const { typeView } = props

  const createStartTime = useRef('')
  const createEndTime = useRef('')
  const TYPE_VIEW = {
    ADMIN: 'admin',
    MANAGER: 'manager'
  }

  /**
   * Function format ngày hiện tại thành dạnh dd-mm-yyyy
   * @param {*} date : Ngày muốn format
   */
  const formatDate = (date) => {
    if (date) {
      let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()

      if (month.length < 2) month = '0' + month
      if (day.length < 2) day = '0' + day

      return [day, month, year].join('-')
    }
    return date
  }

  const [state, setState] = useState({
    employee: '',
    totalHours: '',
    startDate: formatDate(Date.now()),
    endDate: formatDate(Date.now()),
    type: false,
    startTime: '',
    endTime: '',
    status: 'approved',
    reason: '',
    listAllEmployees: []
  })
  const {
    employee,
    organizationalUnit,
    startDate,
    endDate,
    reason,
    status,
    errorOnOrganizationalUnit,
    errorOnEmployee,
    errorOnReason,
    errorOnStartDate,
    errorOnEndDate,
    totalHours,
    errorOnTotalHours,
    type,
    listAllEmployees,
    listDepartments,
    startTime,
    endTime
  } = state

  useEffect(() => {
    if (typeView === TYPE_VIEW.ADMIN) {
      props.getAllUserOfCompany()
    }
  }, [])

  useEffect(() => {
    if (typeView === TYPE_VIEW.MANAGER) {
      let unit
      if (department?.departmentsThatUserIsManager) {
        unit = department.departmentsThatUserIsManager.map((item) => item?._id)
      }

      if (unit?.length > 0) {
        props.getAllEmployeeOfUnitByIds({
          organizationalUnitIds: unit,
          callApi: true
        })
      }
    }
  }, [department.departmentsThatUserIsManager])

  useEffect(() => {
    let listAllEmployees, organizationalUnit, employee, email

    if (typeView === TYPE_VIEW.MANAGER) {
      if (user?.employeesOfUnitsUserIsManager) {
        listAllEmployees = user.employeesOfUnitsUserIsManager
        if (listAllEmployees?.length > 0) {
          listAllEmployees = listAllEmployees.map((item) => {
            return {
              text: item?.userId?.name,
              value: item?.userId?.email
            }
          })
        }
      }
    } else if (typeView === TYPE_VIEW.ADMIN) {
      if (user?.usercompanys) {
        listAllEmployees = user.usercompanys
        if (listAllEmployees?.length > 0) {
          listAllEmployees = listAllEmployees.map((item) => {
            return {
              text: item?.name,
              value: item?.email
            }
          })
        }
      }
    }

    organizationalUnit = user?.userdepartments?.[0]?.id
    employee = listAllEmployees?.[0]?.value
    email = listAllEmployees?.[0]?.value

    setState({
      ...state,
      organizationalUnit: organizationalUnit,
      listAllEmployees: listAllEmployees,
      employee: employee
    })

    props.getDepartmentOfUser({ email: email })
  }, [user.employeesOfUnitsUserIsManager, user.usercompanys])

  useEffect(() => {
    let listDepartments = [{ _id: '', name: translate('human_resource.non_unit') }]
    if (user?.organizationalUnitsOfUserByEmail) {
      listDepartments = user.organizationalUnitsOfUserByEmail
      if (listDepartments[0]?._id) props.getAllEmployee({ organizationalUnits: [listDepartments[0]?._id] })
      setState({
        ...state,
        organizationalUnit: listDepartments[0]?._id,
        listDepartments: listDepartments
      })
    }
  }, [user.organizationalUnitsOfUserByEmail])

  const validateEmployeeNumber = (value, willUpdateState = true) => {
    let msg = AnnualLeaveFormValidator.validateEmployeeNumber(value, translate)
    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnEmployee: msg,
          employee: value,
          organizationalUnit: ''
        }
      })
    }
    return msg === undefined
  }

  /** Function bắt sự kiện thay đổi mã nhân viên */
  const handleMSNVChange = async (value) => {
    await props.getDepartmentOfUser({ email: value[0] })
    validateEmployeeNumber(value[0], true)
  }

  const validateOrganizationalUnit = (value, willUpdateState = true) => {
    let msg = AnnualLeaveFormValidator.validateEmployeeNumber(value, translate)
    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnOrganizationalUnit: msg,
          organizationalUnit: value
        }
      })
    }
    return msg === undefined
  }

  /** Function bắt sự kiện thay đổi đơn vị */
  const handleOrganizationalUnitChange = (value) => {
    validateOrganizationalUnit(value[0], true)
  }

  /**
   * Bắt sự kiện thay đổi ngày bắt đầu
   * @param {*} value : Giá trị ngày bắt đầu
   */
  const handleStartDateChange = (value) => {
    let { errorOnEndDate, endDate } = state

    let errorOnStartDate
    let partValue = value.split('-')
    let date = new Date([partValue[2], partValue[1], partValue[0]].join('-'))

    let partEndDate = endDate.split('-')
    let d = new Date([partEndDate[2], partEndDate[1], partEndDate[0]].join('-'))

    if (date.getTime() > d.getTime()) {
      errorOnStartDate = translate('human_resource.start_date_before_end_date')
    } else {
      errorOnEndDate = undefined
    }

    setState({
      ...state,
      startDate: value,
      errorOnStartDate: errorOnStartDate,
      errorOnEndDate: errorOnEndDate
    })
  }

  /** Bắt sự kiện chọn xin nghi theo giờ */
  const handleChecked = () => {
    setState({
      ...state,
      type: !state.type,
      endTime: '',
      startTime: '',
      totalHours: ''
    })
  }

  /**
   * Bắt sự kiện thay đổi giờ bắt đầu
   * @param {*} value : Giá trị giờ bắt đầu
   */
  const handleStartTimeChange = (value) => {
    setState((state) => {
      return {
        ...state,
        startTime: value
      }
    })
  }

  /**
   * Bắt sự kiện thay đổi giờ kết thúc
   * @param {*} value : Giá trị giờ kết thúc
   */
  const handleEndTimeChange = (value) => {
    setState((state) => {
      return {
        ...state,
        endTime: value
      }
    })
  }

  /**
   * Bắt sự kiện thay đổi ngày kết thúc
   * @param {*} value : Giá trị ngày kết thúc
   */
  const handleEndDateChange = (value) => {
    let { startDate, errorOnStartDate } = state

    let errorOnEndDate
    let partValue = value.split('-')
    let date = new Date([partValue[2], partValue[1], partValue[0]].join('-'))

    let partStartDate = startDate.split('-')
    let d = new Date([partStartDate[2], partStartDate[1], partStartDate[0]].join('-'))

    if (d.getTime() > date.getTime()) {
      errorOnEndDate = translate('human_resource.start_date_before_end_date')
    } else {
      errorOnStartDate = undefined
    }

    setState({
      ...state,
      endDate: value,
      errorOnStartDate: errorOnStartDate,
      errorOnEndDate: errorOnEndDate
    })
  }

  /** Bắt sự kiện thay đổi tổng số giờ nghỉ phép */
  const handleTotalHoursChange = (e) => {
    let { value } = e.target
    validateTotalHours(value, true)
  }

  const validateTotalHours = (value, willUpdateState = true) => {
    let msg = AnnualLeaveFormValidator.validateTotalHour(value, translate)
    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnTotalHours: msg,
          totalHours: value
        }
      })
    }
    return msg === undefined
  }

  /** Bắt sự kiện thay đổi lý do xin nghỉ phép */
  const handleReasonChange = (e) => {
    let { value } = e.target
    validateReason(value, true)
  }

  const validateReason = (value, willUpdateState = true) => {
    let msg = AnnualLeaveFormValidator.validateReason(value, translate)
    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnReason: msg,
          reason: value
        }
      })
    }
    return msg === undefined
  }

  /** Bắt sự kiện thay đổi trạng thái đơn xin nghỉ phép */
  const handleStatusChange = (e) => {
    let { value } = e.target
    setState({
      ...state,
      status: value
    })
  }

  /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form */
  const isFormValidated = () => {
    let result =
      validateEmployeeNumber(employee, false) &&
      validateReason(reason, false) &&
      validateOrganizationalUnit(organizationalUnit, false) &&
      (type ? validateTotalHours(totalHours, false) : true)

    let partStart = startDate.split('-')
    let startDateNew = [partStart[2], partStart[1], partStart[0]].join('-')
    let partEnd = endDate.split('-')
    let endDateNew = [partEnd[2], partEnd[1], partEnd[0]].join('-')

    if (new Date(startDateNew).getTime() <= new Date(endDateNew).getTime()) {
      return result
    } else return false
  }

  /** Bắt sự kiện submit form */
  const save = () => {
    let employeeID = employeesManager.listEmployeesOfOrganizationalUnits.find((x) => x.emailInCompany === employee)?._id
    let partStart = startDate.split('-')
    let startDateNew = [partStart[2], partStart[1], partStart[0]].join('-')
    let partEnd = endDate.split('-')
    let endDateNew = [partEnd[2], partEnd[1], partEnd[0]].join('-')

    if (type) {
      if (startTime === '') {
        startTime = createStartTime.current.getValue()
      }
      if (endTime === '') {
        endTime = createEndTime.current.getValue()
      }
    }

    if (isFormValidated()) {
      return props.createAnnualLeave({
        ...state,
        startTime: startTime,
        endTime: endTime,
        startDate: startDateNew,
        endDate: endDateNew,
        employee: employeeID,
        organizationalUnit: organizationalUnit
      })
    }
  }

  return (
    <React.Fragment>
      {/* <ButtonModal modalID="modal-create-annual-leave" button_name={translate('human_resource.annual_leave.add_annual_leave')} title={translate('human_resource.annual_leave.add_annual_leave_title')} /> */}
      <DialogModal
        size='50'
        modalID='modal-create-annual-leave'
        isLoading={annualLeave.isLoading}
        formID='form-create-annual-leave'
        title={translate('human_resource.annual_leave.add_annual_leave_title')}
        func={save}
        disableSubmit={!isFormValidated()}
      >
        <form className='form-group' id='form-create-annual-leave'>
          {/* Mã số nhân viên */}
          <div className={`form-group ${errorOnEmployee && 'has-error'}`}>
            <label>
              {translate('human_resource.staff_number')}
              <span className='text-red'>*</span>
            </label>
            <SelectBox
              id={`create-annual-leave-employee`}
              className='form-control select2'
              style={{ width: '100%' }}
              value={employee}
              items={listAllEmployees}
              onChange={handleMSNVChange}
            />
            <ErrorLabel content={errorOnEmployee} />
          </div>
          {/* Đơn vị */}
          <div className={`form-group ${errorOnOrganizationalUnit && 'has-error'}`}>
            <label>
              {translate('human_resource.unit')}
              <span className='text-red'>*</span>
            </label>
            <SelectBox
              id={`create-annual-leave-unit`}
              className='form-control select2'
              disabled={listDepartments?.length > 1 ? false : true}
              style={{ width: '100%' }}
              value={organizationalUnit}
              items={
                listDepartments?.length > 0 &&
                listDepartments.map((y) => {
                  return { value: y._id, text: y.name }
                })
              }
              onChange={handleOrganizationalUnitChange}
            />
            <ErrorLabel content={errorOnOrganizationalUnit} />
          </div>

          <div className='form-group'>
            <input type='checkbox' onChange={() => handleChecked()} />
            <label>{translate('human_resource.annual_leave.type')}</label>
          </div>

          <div className='row'>
            {/* Ngày bắt đầu */}
            <div className={`form-group col-sm-6 col-xs-12 ${errorOnStartDate && 'has-error'}`}>
              <label>
                {translate('human_resource.annual_leave.table.start_date')}
                <span className='text-red'>*</span>
              </label>
              <DatePicker id='create_start_date' deleteValue={false} value={startDate} onChange={handleStartDateChange} />
              {type && (
                <TimePicker
                  id='create_start_time'
                  ref={createStartTime}
                  //getDefaultValue={getDefaultStartTime}
                  onChange={handleStartTimeChange}
                />
              )}
              <ErrorLabel content={errorOnStartDate} />
            </div>
            {/* Ngày kết thúc */}
            <div className={`form-group col-sm-6 col-xs-12 ${errorOnEndDate && 'has-error'}`}>
              <label>
                {translate('human_resource.annual_leave.table.end_date')}
                <span className='text-red'>*</span>
              </label>
              <DatePicker
                id='create_end_date'
                //ref={createStartTime}
                deleteValue={false}
                value={endDate}
                onChange={handleEndDateChange}
              />
              {type && (
                <TimePicker
                  id='create_end_time'
                  ref={createEndTime}
                  //getDefaultValue={getDefaultEndTime}
                  onChange={handleEndTimeChange}
                />
              )}
              <ErrorLabel content={errorOnEndDate} />
            </div>
          </div>
          {/* Tổng giờ nghỉ */}
          {type && (
            <div className={`form-group ${errorOnTotalHours && 'has-error'}`}>
              <label>
                {translate('human_resource.annual_leave.totalHours')} <span className='text-red'>*</span>
              </label>
              <input type='number' className='form-control' value={totalHours} onChange={handleTotalHoursChange} />
              <ErrorLabel content={errorOnTotalHours} />
            </div>
          )}
          {/* Lý do */}
          <div className={`form-group ${errorOnReason && 'has-error'}`}>
            <label>
              {translate('human_resource.annual_leave.table.reason')}
              <span className='text-red'>*</span>
            </label>
            <textarea
              className='form-control'
              rows='3'
              style={{ height: 72 }}
              name='reason'
              value={reason}
              onChange={handleReasonChange}
              placeholder='Enter ...'
              autoComplete='off'
            ></textarea>
            <ErrorLabel content={errorOnReason} />
          </div>
          {/* Trạng thái */}
          <div className='form-group'>
            <label>
              {translate('human_resource.status')}
              <span className='text-red'>*</span>
            </label>
            <select className='form-control' value={status} name='status' onChange={handleStatusChange}>
              <option value='approved'>{translate('human_resource.annual_leave.status.approved')}</option>
              <option value='waiting_for_approval'>{translate('human_resource.annual_leave.status.waiting_for_approval')}</option>
              <option value='disapproved'>{translate('human_resource.annual_leave.status.disapproved')}</option>
            </select>
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

function mapState(state) {
  const { annualLeave, employeesManager, user, department } = state
  return { annualLeave, employeesManager, user, department }
}

const actionCreators = {
  createAnnualLeave: AnnualLeaveActions.createAnnualLeave,
  getAllEmployee: EmployeeManagerActions.getAllEmployee,
  getDepartmentOfUser: UserActions.getDepartmentOfUser,
  getAllEmployeeOfUnitByIds: UserActions.getAllEmployeeOfUnitByIds,
  getAllUserOfCompany: UserActions.getAllUserOfCompany
}

const createForm = connect(mapState, actionCreators)(withTranslate(AnnualLeaveCreateForm))
export { createForm as AnnualLeaveCreateForm }
