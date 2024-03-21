import React, { Component, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { SuppliesActions } from '../../../admin/supplies/redux/actions'
import ValidationHelper from '../../../../../helpers/validationHelper'
import { generateCode } from '../../../../../helpers/generateCode'
import { ErrorLabel } from '../../../../../common-components'

function SuppliesTab(props) {
  const [state, setState] = useState({})

  const [prevProps, setPrevProps] = useState({
    id: null
  })

  const { id, translate, suppliesReducer } = props
  const {
    code,
    suppliesName,
    totalPurchase,
    totalAllocation,
    price,
    errorOnCode,
    errorOnSuppliesName,
    errorOnTotalPurchase,
    errorOnTotalAllocation,
    errorOnPrice
  } = state

  const regenerateCode = () => {
    let code = generateCode('VVTM')
    setState((state) => ({
      ...state,
      code: code
    }))
    validateCode(code)
  }

  /**
   * Bắt sự kiện thay đổi mã vật tư
   */
  const handleCodeChange = (e) => {
    const { value } = e.target
    validateCode(value, true)
  }
  const validateCode = (value, willUpdateState = true) => {
    let { message } = ValidationHelper.validateCode(props.translate, value)

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnCode: message,
          code: value
        }
      })
      props.handleChange('code', value)
    }
    return message === undefined
  }

  /**
   * Bắt sự kiện thay đổi tên tài sản
   */
  const handleSuppliesNameChange = (e) => {
    const { value } = e.target
    validateSuppliesName(value, true)
  }
  const validateSuppliesName = (value, willUpdateState = true) => {
    let { message } = ValidationHelper.validateEmpty(props.translate, value)

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnSuppliesName: message,
          suppliesName: value
        }
      })
      props.handleChange('suppliesName', value)
    }
    return message === undefined
  }

  /**
   * Bắt sự kiện thay đổi số lượng đã mua
   */
  const handleTotalPurchaseChange = (e) => {
    const { value } = e.target
    validateTotalPurchase(value, true)
  }
  const validateTotalPurchase = (value, willUpdateState = true) => {
    let { message } = ValidationHelper.validateNumberInputMin(props.translate, value)

    if (willUpdateState) {
      setState({
        ...state,
        errorOnTotalPurchase: message,
        totalPurchase: value
      })
      props.handleChange('totalPurchase', value)
    }
    return message === undefined
  }

  /**
   * Bắt sự kiện thay đổi số lượng đã cấp phát
   */
  const handleTotalAllocationChange = (e) => {
    const { value } = e.target
    validateTotalAllocation(value, true)
  }
  const validateTotalAllocation = (value, willUpdateState = true) => {
    let { message } = ValidationHelper.validateNumberInputMin(props.translate, value)

    if (willUpdateState) {
      setState({
        ...state,
        errorOnTotalAllocation: message,
        totalAllocation: value
      })
      props.handleChange('totalAllocation', value)
    }
    return message === undefined
  }

  /**
   * Bắt sự kiện thay đổi số lượng đã cấp phát
   */
  const handlePriceChange = (e) => {
    const { value } = e.target
    validatePrice(value, true)
  }
  const validatePrice = (value, willUpdateState = true) => {
    let { message } = ValidationHelper.validateNumberInputMin(props.translate, value)

    if (willUpdateState) {
      setState({
        ...state,
        errorOnPrice: message,
        price: value
      })
      props.handleChange('price', value)
    }
    return message === undefined
  }

  if (prevProps.id !== props.id) {
    setState((state) => {
      return {
        ...state,
        id: props.id,

        code: props.code,
        suppliesName: props.suppliesName,
        totalPurchase: props.totalPurchase,
        totalAllocation: props.totalAllocation,
        price: props.price,

        errorOnCode: undefined,
        errorOnSuppliesName: undefined,
        errorOnTotalPurchase: undefined,
        errorOnTotalAllocation: undefined,
        errorOnPrice: undefined
      }
    })
    setPrevProps(props)
  }

  return (
    <div id={id} className='tab-pane active'>
      <div className='row'>
        <div className='col-md-6'>
          {/* Mã vật tư */}
          <div className={`form-group ${!errorOnCode ? '' : 'has-error'} `}>
            <label htmlFor='code'>
              {translate('supplies.supplies_management.code')}
              <span className='text-red'>*</span>
            </label>
            <a style={{ cursor: 'pointer' }} title={translate('asset.asset_lot.generate_asset_lot_code')}>
              <i className='fa fa-plus-square' style={{ color: '#28A745', marginLeft: 5 }} onClick={regenerateCode} />
              <span onClick={regenerateCode}>{translate('asset.asset_lot.generate_asset_lot_code')}</span>
            </a>
            <input
              type='text'
              className='form-control'
              name='code'
              value={code}
              onChange={handleCodeChange}
              placeholder={translate('supplies.supplies_management.code')}
              autoComplete='off'
            />
            <ErrorLabel content={errorOnCode} />
          </div>

          {/* Tên vật tư */}
          <div className={`form-group ${!errorOnSuppliesName ? '' : 'has-error'} `}>
            <label htmlFor='suppliesName'>
              {translate('supplies.supplies_management.suppliesName')}
              <span className='text-red'>*</span>
            </label>
            <input
              type='text'
              className='form-control'
              name='suppliesName'
              value={suppliesName}
              onChange={handleSuppliesNameChange}
              placeholder={translate('supplies.supplies_management.suppliesName')}
              autoComplete='off'
            />
            <ErrorLabel content={errorOnSuppliesName} />
          </div>

          {/* Giá tham khảo */}
          <div className={`form-group ${!errorOnPrice ? '' : 'has-error'} `}>
            <label htmlFor='total'>{translate('supplies.supplies_management.price')} (VND) </label>
            <input
              type='number'
              className='form-control'
              name='price'
              value={price}
              onChange={handlePriceChange}
              placeholder={translate('supplies.supplies_management.price')}
              autoComplete='off'
            />
            <ErrorLabel content={errorOnPrice} />
          </div>
        </div>
        <div className='col-md-6'>
          {/* Số lượng đã mua */}
          <div className={`form-group ${!errorOnTotalPurchase ? '' : 'has-error'} `}>
            <label htmlFor='totalPurchase'>
              {translate('supplies.supplies_management.totalPurchase')} <span className='text-red'>*</span>
            </label>
            <input
              type='number'
              className='form-control'
              name='total'
              value={totalPurchase}
              onChange={handleTotalPurchaseChange}
              placeholder={translate('supplies.supplies_management.totalPurchase')}
              autoComplete='off'
            />
            <ErrorLabel content={errorOnTotalPurchase} />
          </div>

          {/* Số lượng đã cấp phát */}
          <div className={`form-group ${!errorOnTotalAllocation ? '' : 'has-error'} `}>
            <label htmlFor='total'>
              {translate('supplies.supplies_management.totalAllocation')} <span className='text-red'>*</span>
            </label>
            <input
              type='number'
              className='form-control'
              name='totalAllocation'
              value={totalAllocation}
              onChange={handleTotalAllocationChange}
              placeholder={translate('supplies.supplies_management.totalPurchase')}
              autoComplete='off'
            />
            <ErrorLabel content={errorOnTotalAllocation} />
          </div>
        </div>
      </div>
    </div>
  )
}

function mapState(state) {
  const { suppliesReducer } = state
  return { suppliesReducer }
}

const actionCreators = {
  getSuppliesById: SuppliesActions.getSuppliesById
}
const suppliesTab = connect(mapState, actionCreators)(withTranslate(SuppliesTab))
export { suppliesTab as SuppliesTab }
