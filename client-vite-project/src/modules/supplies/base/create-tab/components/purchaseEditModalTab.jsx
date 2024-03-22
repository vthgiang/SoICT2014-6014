import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DatePicker, DialogModal, ErrorLabel } from '../../../../../common-components'

import ValidationHelper from '../../../../../helpers/validationHelper'

function PurchaseEditModal(props) {
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

  // Bắt sự kiện thay đổi mã hóa đơn
  const handleCodeInvoiceChange = (e) => {
    const { value } = e.target
    validateCodeInvoice(value, true)
  }
  const validateCodeInvoice = (value, willUpdateState = true) => {
    let { message } = ValidationHelper.validateEmpty(props.translate, value)

    if (willUpdateState) {
      setState({
        ...state,
        codeInvoice: value,
        errorOnCoceInvoice: message
      })
    }
    return message === undefined
  }

  // Bắt sự kiện thay đổi "Ngày mua"
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

  // Bắt sự kiện thay đổi "Nhà cung cấp"
  const handleSupplierChange = (e) => {
    const { value } = e.target
    validateSupplier(value)
  }
  const validateSupplier = (value, willUpdateState = true) => {
    let { message } = ValidationHelper.validateEmpty(props.translate, value)

    if (willUpdateState) {
      setState({
        ...state,
        supplier: value,
        errorOnSupplier: message
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

  // Bắt sự kiện thay đổi "Giá trị dự tính"
  const handlePriceChange = (e) => {
    let value = e.target.value
    validatePrice(value, true)
  }
  const validatePrice = (value, willUpdateState = true) => {
    let { message } = ValidationHelper.validateEmpty(props.translate, value)

    if (willUpdateState) {
      setState({
        ...state,
        price: value,
        errorOnPrice: message
      })
    }
    return message === undefined
  }

  // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
  const isFormValidated = () => {
    const { codeInvoice, quantity, supplier, date, price } = state
    let result =
      validateCodeInvoice(codeInvoice, false) &&
      validateQuantity(quantity, false) &&
      validatePrice(price, false) &&
      validateDate(date, false) &&
      validateSupplier(supplier, false)
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
        index: props.index,
        codeInvoice: props.codeInvoice,
        supplier: props.supplier,
        date: props.date,
        quantity: props.quantity,
        price: props.price,

        errorOnCoceInvoice: undefined,
        errorOnSupplier: undefined,
        errorOnQuantity: undefined,
        errorOnDate: undefined,
        errorOnPrice: undefined
      }
    })
    setPrevProps(props)
  }

  const { id } = props
  const { translate } = props
  const { codeInvoice, date, supplier, quantity, price, errorOnCoceInvoice, errorOnSupplier, errorOnQuantity, errorOnDate, errorOnPrice } =
    state

  return (
    <React.Fragment>
      <DialogModal
        size='75'
        modalID={`modal-edit-invoice-${id}`}
        isLoading={false}
        formID={`form-edit-invoice-${id}`}
        title={translate('supplies.general_information.edit_purchase_invoice')}
        func={save}
        disableSubmit={!isFormValidated()}
      >
        {/* Form chỉnh sửa phiếu bảo trì */}
        <form className='form-group' id={`form-edit-invoice-${id}`}>
          <div className='col-md-12'>
            <div className='col-sm-6'>
              {/* Mã hóa đơn */}
              <div className={`form-group`}>
                <label>
                  {translate('supplies.invoice_management.codeInvoice')}
                  <span className='text-red'>*</span>
                </label>
                <input
                  type='text'
                  className='form-control'
                  name='codeInvoice'
                  value={codeInvoice}
                  onChange={handleCodeInvoiceChange}
                  autoComplete='off'
                  placeholder='Mã hóa đơn'
                />
                <ErrorLabel content={errorOnCoceInvoice} />
              </div>

              {/* Ngày mua */}
              <div className='form-group'>
                <label>
                  {translate('supplies.invoice_management.date')}
                  <span className='text-red'>*</span>
                </label>
                <DatePicker id='create_date' value={date} onChange={handleDateChange} />
                <ErrorLabel content={errorOnDate} />
              </div>
              {/* Nhà cung cấp */}
              <div className={`form-group ${errorOnSupplier === undefined ? '' : 'has-error'}`}>
                <label>
                  {translate('supplies.invoice_management.supplier')} <span className='text-red'>*</span>
                </label>
                <input
                  type='text'
                  className='form-control'
                  name='supplier'
                  value={supplier}
                  onChange={handleSupplierChange}
                  autoComplete='off'
                  placeholder='Nhà cung cấp'
                />
                <ErrorLabel content={errorOnSupplier} />
              </div>
            </div>

            <div className='col-sm-6'>
              {/* Giá */}
              <div className={`form-group ${errorOnPrice === undefined ? '' : 'has-error'}`}>
                <label>
                  {translate('supplies.invoice_management.price')} (VNĐ)<span className='text-red'>*</span>
                </label>
                <input
                  type='number'
                  className='form-control'
                  name='total'
                  value={price}
                  min='1'
                  onChange={handlePriceChange}
                  autoComplete='off'
                  placeholder='Giá'
                />
                <ErrorLabel content={errorOnPrice} />
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
            </div>
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

const editInvoiceModal = connect(null, null)(withTranslate(PurchaseEditModal))

export { editInvoiceModal as PurchaseEditModal }
