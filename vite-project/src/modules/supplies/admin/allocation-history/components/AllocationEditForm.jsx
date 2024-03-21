import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import { DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components'
import ValidationHelper from '../../../../../helpers/validationHelper'
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions'
import { UserActions } from '../../../../super-admin/user/redux/actions'
import { SuppliesActions } from '../../supplies/redux/actions'
import { AllocationHistoryActions, PurchaseInvoiceActions } from '../redux/actions'

function AllocationEditForm(props) {
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
  const getAll = true

  // Khởi tạo state
  const [state, setState] = useState({})

  useEffect(() => {
    props.searchSupplies(getAll)
    props.getUser()
    props.getAllDepartments()
  }, [])

  const { id, translate, allocationHistoryReducer, suppliesReducer, user, department } = props
  const {
    _id,
    date,
    supplies,
    supplier,
    quantity,
    allocationToOrganizationalUnit,
    allocationToUser,
    errorOnSupplies,
    errorOnQuantity,
    errorOnDate,
    errorOnUnit,
    errorOnUser
  } = state

  // setState từ props mới
  const [prevProps, setPrevProps] = useState({
    id: null
  })

  if (prevProps.id !== props.id) {
    setState((state) => {
      return {
        ...state,
        _id: props._id,
        id: props.id,
        index: props.index,
        supplies: props.supplies,
        date: props.date,
        quantity: props.quantity,
        allocationToOrganizationalUnit: props.allocationToOrganizationalUnit,
        allocationToUser: props.allocationToUser,

        errorOnQuantity: undefined,
        errorOnDate: undefined,
        errorOnSupplies: undefined,
        errorOnUnit: undefined,
        errorOnUser: undefined
      }
    })
    setPrevProps(props)
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

  // Bắt sự kiện thay đổi "vật tư cấp"
  const handleSuppliesChange = (e) => {
    let value = e[0] !== 'null' ? e[0] : null
    validateSupplies(value, true)
  }
  const validateSupplies = (value, willUpdateState = true) => {
    let { message } = ValidationHelper.validateEmpty(props.translate, value)

    if (willUpdateState) {
      setState({
        ...state,
        errorOnSupplies: message,
        supplies: value
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

  // function kiểm tra các trường bắt buộc phải nhập
  const validatorInput = (value) => {
    if (value && value.length > 0) {
      return true
    } else {
      return false
    }
  }

  // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
  const isFormValidated = () => {
    const { supplies, quantity, date, allocationToOrganizationalUnit, allocationToUser } = state
    let result =
      validateSupplies(supplies, false) &&
      validateQuantity(quantity, false) &&
      validateDate(date, false) &&
      (validateUnit(allocationToOrganizationalUnit, false) || validateUser(allocationToUser, false))
    return result
  }

  // Bắt sự kiện submit form
  const save = () => {
    let { date, supplies, quantity, allocationToOrganizationalUnit, allocationToUser } = state
    let dataToSubmit = {
      supplies: supplies,
      quantity: quantity,
      allocationToOrganizationalUnit: allocationToOrganizationalUnit,
      allocationToUser: allocationToUser,
      date: date
    }
    return props.updateAllocation(id, dataToSubmit)
  }

  return (
    <React.Fragment>
      <DialogModal
        modalID={`modal-edit-allocation`}
        isLoading={allocationHistoryReducer.isLoading}
        formID={`form-edit-allocation`}
        title={translate('supplies.general_information.edit_allocation')}
        disableSubmit={!isFormValidated()}
        func={save}
        size={50}
        maxWidth={500}
      >
        <form className='form-group' id='form-edit-allocation'>
          <div className='col-md-12'>
            {/* Ngày cấp */}
            <div className={`form-group ${errorOnDate === undefined ? '' : 'has-error'}`}>
              <label>
                {translate('supplies.allocation_management.date')}
                <span className='text-red'>*</span>
              </label>
              <DatePicker id='create_date' value={date} onChange={handleDateChange} />
              <ErrorLabel content={errorOnDate} />
            </div>

            {/* vật tư cấp */}
            <div className={`form-group ${errorOnSupplies === undefined ? '' : 'has-error'}`}>
              <label>
                {translate('supplies.invoice_management.supplies')}
                <span className='text-red'>*</span>
              </label>
              <div>
                <div id={`suppliesBox-${id}`}>
                  <SelectBox
                    id={`suppliesSelectBox-${id}`}
                    className='form-control select2'
                    style={{ width: '100%' }}
                    items={[
                      { value: null, text: 'Không có vật tư' },
                      ...suppliesReducer.listSupplies.map((x) => {
                        return { value: x.id, text: x.code + ' - ' + x.suppliesName }
                      })
                    ]}
                    onChange={handleSuppliesChange}
                    value={supplies ?? null}
                    multiple={false}
                  />
                </div>
              </div>
              <ErrorLabel content={errorOnSupplies} />
            </div>

            {/* Số lượng */}
            <div className={`form-group ${errorOnQuantity === undefined ? '' : 'has-error'}`}>
              <label>
                {translate('supplies.invoice_management.quantity')} <span className='text-red'>*</span>
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
                <div id={`unitBox-${id}`}>
                  <SelectBox
                    id={`unitSelectBox-${id}`}
                    className='form-control select2'
                    style={{ width: '100%' }}
                    items={[
                      { value: null, text: 'Không có đơn vị được cấp phát' },
                      ...department.list.map((x) => {
                        return { value: x._id, text: x.name }
                      })
                    ]}
                    value={allocationToOrganizationalUnit ?? null}
                    onChange={handleUnitChange}
                    multiple={false}
                  />
                </div>
              </div>
            </div>

            {/* ng dùng*/}
            <div className='form-group'>
              <label>{translate('supplies.allocation_management.allocationToUser')}</label>
              <div>
                <div id={`userBox-${id}`}>
                  <SelectBox
                    id={`userSelectBox-${id}`}
                    className='form-control select2'
                    style={{ width: '100%' }}
                    value={allocationToUser ?? null}
                    items={[
                      { value: null, text: 'Chưa có người được giao sử dụng' },
                      ...user.list.map((x) => {
                        return { value: x.id, text: x.name + ' - ' + x.email }
                      })
                    ]}
                    onChange={handleUserChange}
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
  const { allocationHistoryReducer, suppliesReducer, user, department, auth } = state
  return { allocationHistoryReducer, suppliesReducer, user, department, auth }
}

const actionCreators = {
  searchSupplies: SuppliesActions.searchSupplies,
  updateAllocation: AllocationHistoryActions.updateAllocation,

  getUser: UserActions.get,
  getAllDepartments: DepartmentActions.get
}

const connectedAllocationEditForm = connect(mapState, actionCreators)(withTranslate(AllocationEditForm))
export { connectedAllocationEditForm as AllocationEditForm }
