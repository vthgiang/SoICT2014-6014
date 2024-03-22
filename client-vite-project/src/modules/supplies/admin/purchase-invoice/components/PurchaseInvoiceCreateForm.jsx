import React, { Component, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { ButtonModal, DatePicker, DialogModal, ErrorLabel, SelectBox, UploadFile } from '../../../../../common-components'
import { generateCode } from '../../../../../helpers/generateCode'
import { convertJsonObjectToFormData } from '../../../../../helpers/jsonObjectToFormDataObjectConverter'

import { UserActions } from '../../../../super-admin/user/redux/actions'

import ValidationHelper from '../../../../../helpers/validationHelper'
import { PurchaseInvoiceActions } from '../redux/actions'
import { SuppliesActions } from '../../supplies/redux/actions'

function PurchaseInvoiceCreateForm(props) {
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
  const [state, setState] = useState({
    codeInvoice: '',
    date: formatDate(Date.now()),
    supplies: '',
    supplier: '',
    quantity: 0,
    price: 0
  })

  const regenerateCode = () => {
    let code = generateCode('DNMS')
    setState((state) => ({
      ...state,
      codeInvoice: code
    }))
  }

  useEffect(() => {
    props.searchSupplies(getAll)
  }, [])

  const { _id, translate, purchaseInvoiceReducer, user, auth, suppliesReducer } = props
  const {
    codeInvoice,
    date,
    supplies,
    supplier,
    quantity,
    price,
    errorOnCoceInvoice,
    errorOnSupplies,
    errorOnSupplier,
    errorOnQuantity,
    errorOnDate,
    errorOnPrice
  } = state

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

  // Bắt sự kiện thay đổi "vật tư mua"
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
    const { codeInvoice, supplies, quantity, supplier, date, price } = state
    let result =
      validateSupplies(supplies, false) &&
      validateCodeInvoice(codeInvoice, false) &&
      validateQuantity(quantity, false) &&
      validatePrice(price, false) &&
      validateDate(date, false) &&
      validateSupplier(supplier, false)
    return result
  }

  // Bắt sự kiện submit form
  const save = () => {
    let { date, codeInvoice, supplies, supplier, quantity, price } = state
    let dateData = date.split('-')
    let formData
    let dataToSubmit = {
      codeInvoice: codeInvoice,
      supplies: supplies,
      supplier: supplier,
      quantity: quantity,
      price: price,
      date: new Date(`${dateData[2]}-${dateData[1]}-${dateData[0]}`)
    }
    if (isFormValidated()) {
      return props.createPurchaseInvoices(dataToSubmit)
    }
  }

  const getSupplies = () => {
    let { suppliesReducer } = props
    let listSupplies = suppliesReducer && suppliesReducer.listSupplies
    let suppliesArr = []

    listSupplies.map((item) => {
      suppliesArr.push({
        value: item._id,
        text: item.suppliesName
      })
    })

    return suppliesArr
  }

  let suppliesList = getSupplies()
  return (
    <React.Fragment>
      <DialogModal
        size='50'
        modalID='modal-create-purchase-invoice'
        isLoading={purchaseInvoiceReducer.isLoading}
        formID='form-create-purchase-invoice'
        title={translate('supplies.general_information.add_purchase_invoice')}
        func={save}
        disableSubmit={!isFormValidated()}
      >
        {/* Form thêm mới hóa đơn mua sắm vật tư */}
        <form className='form-group' id='form-create-purchase-invoice'>
          <div className='col-md-12'>
            <div className='col-sm-6'>
              {/* Mã hóa đơn */}
              <div className={`form-group`}>
                <label>
                  {translate('supplies.invoice_management.codeInvoice')}
                  <span className='text-red'>*</span>
                </label>
                <a style={{ cursor: 'pointer' }} title={translate('asset.asset_lot.generate_asset_lot_code')}>
                  <i className='fa fa-plus-square' style={{ color: '#28A745', marginLeft: 5 }} onClick={regenerateCode} />
                  <span onClick={regenerateCode}>{translate('asset.asset_lot.generate_asset_lot_code')}</span>
                </a>
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

              {/* vật tư mua */}
              <div className={`form-group ${errorOnSupplies === undefined ? '' : 'has-error'}`}>
                <label>
                  {translate('supplies.invoice_management.supplies')}
                  <span className='text-red'>*</span>
                </label>
                <div>
                  <div id='suppliesBox'>
                    <SelectBox
                      id={`suppliesSelectBox`}
                      className='form-control select2'
                      style={{ width: '100%' }}
                      items={[{ value: null, text: 'Chọn vật tư' }, ...suppliesList]}
                      onChange={handleSuppliesChange}
                      value={supplies}
                      multiple={false}
                    />
                  </div>
                </div>
                <ErrorLabel content={errorOnSupplies} />
              </div>
            </div>

            <div className='col-sm-6'>
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

function mapState(state) {
  const { purchaseInvoiceReducer, auth, user, suppliesReducer } = state
  return { purchaseInvoiceReducer, auth, user, suppliesReducer }
}

const actionCreators = {
  getUser: UserActions.get,
  createPurchaseInvoices: PurchaseInvoiceActions.createPurchaseInvoices,
  searchSupplies: SuppliesActions.searchSupplies
}

const createInvoiceForm = connect(mapState, actionCreators)(withTranslate(PurchaseInvoiceCreateForm))
export { createInvoiceForm as PurchaseInvoiceCreateForm }
