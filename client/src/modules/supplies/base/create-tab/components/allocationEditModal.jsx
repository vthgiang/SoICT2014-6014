import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components'

import ValidationHelper from '../../../../../helpers/validationHelper'
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions'
import { UserActions } from '../../../../super-admin/user/redux/actions'

function AllocationEditModal(props) {
  const [state, setState] = useState({})
  const [prevProps, setPrevProps] = useState({
    id: null
  })

  // Function format ngày hiện tại thành dạnh dd-mm-yyyy
  const formatDate = (date) => {
    if (!date) return null
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()

    if (month.length < 2) {
      month = '0' + month
    }

    if (day.length < 2) {
      day = '0' + day
    }

    return [day, month, year].join('-')
  }

  // Bắt sự kiện thay đổi "Ngày cấp"
  const handleDateChange = (value) => {
    validateDate(value, true)
  }
  const validateDate = (value, willUpdateState = true) => {
    let { message } = ValidationHelper.validateEmpty(props.translate, value)

    if (willUpdateState) {
      setState({
        ...state,
        errorOnDate: message,
        date: value
      })
    }
    return message === undefined
  }

  // Bắt sự kiện thay đổi "Số lượng"
  const handleQuantityChange = (e) => {
    let value = e.target.value
    validateQuantity(value, true)
  }
  const validateQuantity = (value, willUpdateState = true) => {
    let { message } = ValidationHelper.validateEmpty(props.translate, value)

    if (willUpdateState) {
      setState({
        ...state,
        errorOnQuantity: message,
        quantity: value
      })
    }
    return message === undefined
  }

  // Bắt sự kiện thay đổi "đơn vị đc cấp"
  const handleUnitChange = (e) => {
    let value = e[0] !== 'null' ? e[0] : null
    setState({
      ...state,
      allocationToOrganizationalUnit: value
    })
  }
  const validateUnit = (value, willUpdateState = true) => {
    let { message } = ValidationHelper.validateEmpty(props.translate, value)
    return message === undefined
  }

  // Bắt sự kiện thay đổi "ng dùng đc cấp"
  const handleUserChange = (e) => {
    let value = e[0] !== 'null' ? e[0] : null
    setState({
      ...state,
      allocationToUser: value
    })
  }
  const validateUser = (value, willUpdateState = true) => {
    let { message } = ValidationHelper.validateEmpty(props.translate, value)
    return message === undefined
  }

  // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
  const isFormValidated = () => {
    const { quantity, date, allocationToOrganizationalUnit, allocationToUser } = state
    let result =
      validateQuantity(quantity, false) &&
      validateDate(date, false) &&
      (validateUnit(allocationToOrganizationalUnit, false) || validateUser(allocationToUser, false))
    return result
  }

  // Bắt sự kiện submit form
  const save = async () => {
    if (isFormValidated()) {
      return props.handleChange(state)
    }
  }

  if (prevProps.id !== props.id) {
    setState((state) => {
      return {
        ...state,
        _id: props._id,
        id: props.id,
        date: props.date,
        quantity: props.quantity,
        allocationToOrganizationalUnit: props.allocationToOrganizationalUnit,
        allocationToUser: props.allocationToUser,

        errorOnDate: undefined,
        errorOnQuantity: undefined
      }
    })
    setPrevProps(props)
  }

  const { id } = props
  const { translate, user } = props
  const { date, quantity, allocationToOrganizationalUnit, allocationToUser, errorOnQuantity, errorOnDate } = state

  const getDepartment = () => {
    let { department } = props
    let listUnit = department && department.list
    let unitArr = []

    listUnit.map((item) => {
      unitArr.push({
        value: item._id,
        text: item.name
      })
    })

    return unitArr
  }

  var userList =
    user.list &&
    user.list.map((x) => {
      return { value: x._id, text: x.name + ' - ' + x.email }
    })
  let departmentList = getDepartment()

  return (
    <React.Fragment>
      <DialogModal
        size='75'
        modalID={`modal-edit-allocation-${id}`}
        isLoading={false}
        formID={`form-edit-allocation-${id}`}
        title={translate('supplies.general_information.edit_allocation')}
        func={save}
        disableSubmit={!isFormValidated()}
      >
        {/* Form chỉnh sửa phiếu bảo trì */}
        <form className='form-group' id={`form-edit-allocation-${id}`}>
          <div className='col-md-12'>
            {/* Ngày cấp */}
            <div className='form-group'>
              <label>
                {translate('supplies.allocation_management.date')}
                <span className='text-red'>*</span>
              </label>
              <DatePicker id='create_date' value={date} onChange={handleDateChange} />
              <ErrorLabel content={errorOnDate} />
            </div>

            {/* Số lượng */}
            <div className={`form-group ${errorOnQuantity === undefined ? '' : 'has-error'}`}>
              <label>
                {translate('supplies.allocation_management.quantity')} <span className='text-red'>*</span>
              </label>
              <input
                type='number'
                className='form-control'
                name='quantity'
                min='1'
                value={quantity}
                onChange={handleQuantityChange}
                autoComplete='off'
                placeholder='Số lượng'
              />
              <ErrorLabel content={errorOnQuantity} />
            </div>

            {/* đơn vị */}
            <div className='form-group'>
              <label>{translate('supplies.allocation_management.allocationToOrganizationalUnit')}</label>
              <div>
                <div id='unitBox'>
                  <SelectBox
                    id={`unitSelectBox`}
                    className='form-control select2'
                    style={{ width: '100%' }}
                    items={[{ value: '', text: 'Chọn đơn vị' }, ...departmentList]}
                    onChange={handleUnitChange}
                    value={allocationToOrganizationalUnit}
                    multiple={false}
                  />
                </div>
              </div>
            </div>

            {/* ng dùng*/}
            <div className='form-group'>
              <label>{translate('supplies.allocation_management.allocationToUser')}</label>
              <div>
                <div id='userBox'>
                  <SelectBox
                    id={`userSelectBox`}
                    className='form-control select2'
                    style={{ width: '100%' }}
                    items={[{ value: '', text: 'Chọn người dùng' }, ...userList]}
                    onChange={handleUserChange}
                    value={allocationToUser}
                    multiple={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

function mapState(state) {
  const { auth, user, department } = state
  return { auth, user, department }
}

const actionCreators = {
  getUser: UserActions.get,
  getAllDepartments: DepartmentActions.get
}

const editAllocationModal = connect(mapState, actionCreators)(withTranslate(AllocationEditModal))
export { editAllocationModal as AllocationEditModal }
