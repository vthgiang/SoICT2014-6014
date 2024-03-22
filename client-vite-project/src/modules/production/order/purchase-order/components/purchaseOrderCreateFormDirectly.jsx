import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { PurchaseOrderActions } from '../redux/actions'
import { DialogModal, SelectBox, ErrorLabel, DatePicker } from '../../../../../common-components'
import ValidationHelper from '../../../../../helpers/validationHelper'
import { formatCurrency } from '../../../../../helpers/formatCurrency'
import { formatToTimeZoneDate } from '../../../../../helpers/formatDate'
import { UserActions } from '../../../../super-admin/user/redux/actions'

function PurchaseOrderCreateFormDirectly(props) {
  const [state, setState] = useState({
    code: '',
    good: '',
    goods: [],
    approvers: [],
    price: '',
    quantity: ''
  })

  const EMPTY_GOOD = {
    _id: 'title',
    code: '',
    name: '',
    baseUnit: ''
  }

  if (props.code !== state.code) {
    setState({
      ...state,
      code: props.code
    })
  }

  useEffect(() => {
    props.getUser()
  }, [])

  const getSuplierOptions = () => {
    let mapOptions = []
    const { list } = props.customers
    if (list) {
      mapOptions = [
        {
          value: 'title', //Title không được chọn
          text: '---Chọn nhà cung cấp---'
        }
      ]
      list.map((item) => {
        mapOptions.push({
          value: item._id,
          text: item.name
        })
      })
    }
    return mapOptions
  }

  const getApproverOptions = () => {
    let mapOptions = []
    const { user } = props
    if (user) {
      mapOptions = [
        {
          value: 'title', //Title không được chọn
          text: '---Chọn người phê duyệt---'
        }
      ]

      user.list.map((user) => {
        mapOptions.push({
          value: user._id,
          text: user.name
        })
      })
    }
    return mapOptions
  }

  const getStockOptions = () => {
    let mapOptions = []
    const { listStocks } = props.stocks

    if (listStocks.length) {
      mapOptions = [
        {
          value: 'title', //Title không được chọn
          text: '---Chọn kho nhập---'
        }
      ]
      listStocks.map((item) => {
        mapOptions.push({
          value: item._id,
          text: item.name
        })
      })
    }
    return mapOptions
  }

  const getGoodData = () => {
    let mapOptions = []
    let { listGoodsByType } = props.goods
    if (listGoodsByType) {
      mapOptions = [
        {
          value: 'title',
          text: '---Chọn nguyên vật liệu---'
        }
      ]
      listGoodsByType.map((item) => {
        mapOptions.push({
          value: item._id,
          text: item.code + ' - ' + item.name + ' (' + item.baseUnit + ')'
        })
      })
    }
    return mapOptions
  }

  const handleSupplierChange = async (value) => {
    validateSupplier(value[0], true)
  }

  const validateSupplier = (value, willUpdateState = true) => {
    let msg = undefined
    if (!value || value === '' || value === 'title') {
      msg = 'Giá trị không được bỏ trống!'
    }
    if (willUpdateState) {
      setState({
        ...state,
        supplier: value,
        supplierError: msg
      })
    }
    return msg
  }

  const handleApproversChange = (value) => {
    validateApprovers(value, true)
  }

  const validateApprovers = (value, willUpdateState = true) => {
    let msg = undefined
    if (!value.length) {
      msg = 'Người phê duyệt không được để trống'
    } else {
      for (let index = 0; index < value.length; index++) {
        if (!value[index] || value[index] === '' || value[index] === 'title') {
          msg = 'Không được chọn tiêu đề!'
        }
      }
    }
    if (willUpdateState) {
      setState({
        ...state,
        approvers: value,
        approversError: msg
      })
    }
    return msg === undefined
  }

  const handleStockChange = (value) => {
    validateStock(value[0], true)
  }

  const validateStock = (value, willUpdateState = true) => {
    let msg = undefined
    if (!value || value === '' || value === 'title') {
      msg = 'Giá trị không được bỏ trống!'
    }
    if (willUpdateState) {
      setState({
        ...state,
        stock: value,
        stockError: msg
      })
    }

    return msg
  }

  const handleIntendReceiveTimeChange = (value) => {
    if (!value) {
      value = null
    }
    let { translate } = props
    let { message } = ValidationHelper.validateEmpty(translate, value)
    setState({
      ...state,
      intendReceiveTime: value,
      intendReceiveTimeError: message
    })
  }

  const handleDiscountChange = (e) => {
    let { value } = e.target
    validateDiscount(value, true)
  }

  const validateDiscount = (value, willUpdateState = true) => {
    let msg = undefined
    if (value && parseInt(value) <= 0) {
      msg = 'Giá trị phải lớn hơn 0, có thể bỏ trống!'
    }
    if (willUpdateState) {
      setState({
        ...state,
        discountError: msg,
        discount: value
      })
    }
    return msg
  }

  const handleDescriptionChange = (e) => {
    let { value } = e.target
    setState({
      ...state,
      desciption: value
    })
  }

  const handleGoodChange = (value) => {
    validateGood(value[0], true)
  }

  const validateGood = (value, willUpdateState = true) => {
    let msg = undefined
    if (!value) {
      msg = 'Giá trị không được để trống'
    } else if (value === 'title') {
      msg = 'Giá trị không được để trống'
    }

    if (willUpdateState) {
      let { listGoodsByType } = props.goods
      const goodInfo = listGoodsByType.filter((item) => item._id === value)
      setState({
        ...state,
        good: {
          _id: goodInfo[0]._id,
          code: goodInfo[0].code,
          name: goodInfo[0].name,
          baseUnit: goodInfo[0].baseUnit
        },
        goodError: msg
      })
    }
    return msg
  }

  const handleQuantityChange = (e) => {
    let { value } = e.target
    validateQuantity(value, true)
  }

  const validateQuantity = (value, willUpdateState = true) => {
    let msg = undefined
    if (!value || value === '') {
      msg = 'Giá trị không được bỏ trống!'
    } else if (parseInt(value) <= 0) {
      msg = 'giá trị phải lớn hơn 0!'
    }
    if (willUpdateState) {
      setState({
        ...state,
        quantity: value,
        quantityError: msg
      })
    }

    return msg
  }

  const handlePriceChange = (e) => {
    let { value } = e.target
    validatePrice(value, true)
  }

  const validatePrice = (value, willUpdateState = true) => {
    let msg = undefined
    if (!value || value === '') {
      msg = 'Giá trị không được bỏ trống!'
    } else if (parseInt(value) < 0) {
      msg = 'giá trị không được nhỏ hơn 0!'
    }
    if (willUpdateState) {
      setState({
        ...state,
        price: value,
        priceError: msg
      })
    }

    return msg
  }

  const handleClearGood = (e) => {
    e.preventDefault()
    setState({
      ...state,
      good: Object.assign({}, EMPTY_GOOD),
      quantity: '',
      price: '',
      goodError: undefined,
      quantityError: undefined,
      priceError: undefined
    })
  }

  const getPaymentAmount = (isSubmit = false) => {
    let { goods, discount } = state
    let paymentAmount = 0

    paymentAmount = goods.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.price * currentValue.quantity
    }, 0)

    if (discount) {
      paymentAmount = paymentAmount - discount >= 0 ? paymentAmount - discount : 0
    }
    if (isSubmit) {
      return paymentAmount
    }
    return formatCurrency(paymentAmount)
  }

  const isSubmitGood = () => {
    //Validate để thêm good vào list goods
    let { good, quantity, price } = state
    if (validateGood(good, false) || validateQuantity(quantity, false) || validatePrice(price, false)) {
      return false
    } else {
      return true
    }
  }

  const handleAddGood = (e) => {
    e.preventDefault()
    if (isSubmitGood()) {
      const { good, quantity, price, goods } = state
      let data = {
        good,
        quantity,
        price
      }
      goods.push(data)
      setState({
        ...state,
        goods,
        good: Object.assign({}, EMPTY_GOOD),
        quantity: '',
        price: '',
        goodError: undefined,
        quantityError: undefined,
        priceError: undefined
      })
    }
  }

  const handleDeleteGood = (item) => {
    let { goods } = state
    let goodsFilter = goods.filter((element) => element.good !== item.good)
    setState({
      ...state,
      goods: goodsFilter
    })
  }

  const handleGoodsEdit = (item, index) => {
    setState({
      ...state,
      editGoods: true,
      indexEditting: index,
      good: item.good,
      quantity: item.quantity,
      price: item.price,
      goodError: undefined,
      quantityError: undefined,
      priceError: undefined
    })
  }

  const handleSaveEditGood = (e) => {
    e.preventDefault()
    if (isSubmitGood()) {
      const { good, quantity, price, goods, indexEditting } = state
      let data = {
        good,
        quantity,
        price
      }

      goods[indexEditting] = data

      setState({
        ...state,
        goods,
        good: Object.assign({}, EMPTY_GOOD),
        quantity: '',
        price: '',
        indexEditting: '',
        editGoods: false,
        goodError: undefined,
        quantityError: undefined,
        priceError: undefined
      })
    }
  }

  const handleCancelEditGood = (e) => {
    e.preventDefault()
    setState({
      ...state,
      good: Object.assign({}, EMPTY_GOOD),
      quantity: '',
      price: '',
      indexEditting: '',
      editGoods: false,
      goodError: undefined,
      quantityError: undefined,
      priceError: undefined
    })
  }

  const isFormValidated = () => {
    // const { translate } = props;

    // let { stock, supplier, approvers, intendReceiveTime, goods } = state;
    // if (
    //     validateStock(stock, false) ||
    //     validateSupplier(supplier, false) ||
    //     ValidationHelper.validateEmpty(translate, intendReceiveTime).message ||
    //     !approvers.length ||
    //     !goods.length
    // ) {
    //     return false;
    // }
    return true
  }

  const formatGoodsForSubmit = () => {
    let { goods } = state
    let goodsMap = goods.map((element) => {
      return {
        good: element.good,
        quantity: element.quantity,
        price: element.price
      }
    })

    return goodsMap
  }

  const formatApproversForSubmit = () => {
    let { approvers } = state
    let approversMap = approvers.map((element) => {
      return {
        approver: element
      }
    })

    return approversMap
  }

  const save = async () => {
    let { code, stock, supplier, intendReceiveTime, discount, desciption } = state
    let goods = await formatGoodsForSubmit()
    let approvers = await formatApproversForSubmit()
    let data = {
      code,
      stock,
      supplier,
      approvers,
      intendReceiveTime: formatToTimeZoneDate(intendReceiveTime),
      discount,
      desciption,
      goods,
      paymentAmount: getPaymentAmount(true),
      status: 1
    }
    await props.createPurchaseOrder(data)

    setState({
      ...state,
      stock: 'title',
      supplier: 'title',
      approvers: [],
      intendReceiveTime: '',
      discount: '',
      desciption: '',
      goods: [],
      quantity: '',
      good: 'title',
      price: ''
    })
  }

  const { code, supplier, approvers, stock, intendReceiveTime, discount, desciption, good, quantity, price, goods, editGoods } = state
  const { supplierError, approversError, stockError, intendReceiveTimeError, discountError, goodError, quantityError, priceError } = state

  const dataApprover = getApproverOptions()
  const dataGood = getGoodData()
  const dataStock = getStockOptions()
  const dataSupplier = getSuplierOptions()

  return (
    <React.Fragment>
      <DialogModal
        modalID={`modal-add-purchase-order-directly`}
        isLoading={false}
        formID={`form-add-purchase-order-directly`}
        title={'Tạo đơn mua nguyên vật liệu'}
        msg_success={'Tạo thành công'}
        msg_failure={'Tạo không thành công'}
        disableSubmit={!isFormValidated()}
        func={save}
        size='75'
      >
        <form id={`form-add-purchase-order-directly`}>
          <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
            <div className='form-group'>
              <label>
                {'Mã đơn'}
                <span className='text-red'> * </span>
              </label>
              <input type='text' className='form-control' value={code ? code : ''} disabled={true} />
            </div>
            <div className={`form-group ${!stockError ? '' : 'has-error'}`}>
              <label>
                {'Kho nhập nguyên vật liệu'}
                <span className='text-red'> * </span>
              </label>
              <SelectBox
                id={`select-create-purchase-order-directly-stock`}
                className='form-control select2'
                style={{ width: '100%' }}
                value={stock}
                items={dataStock}
                onChange={handleStockChange}
                multiple={false}
              />
              <ErrorLabel content={stockError} />
            </div>
            <div className={`form-group ${!supplierError ? '' : 'has-error'}`}>
              <label>
                {'Nhà cung cấp'}
                <span className='text-red'> * </span>
              </label>
              <SelectBox
                id={`select-create-purchase-order-directly-supplier`}
                className='form-control select2'
                style={{ width: '100%' }}
                value={supplier}
                items={dataSupplier}
                onChange={handleSupplierChange}
                multiple={false}
              />
              <ErrorLabel content={supplierError} />
            </div>
          </div>
          <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
            <div className={`form-group ${!approversError ? '' : 'has-error'}`}>
              <label>
                {'Người phê duyệt'}
                <span className='text-red'> * </span>
              </label>
              <SelectBox
                id={`select-create-purchase-order-directly-approvers`}
                className='form-control select2'
                style={{ width: '100%' }}
                value={approvers}
                items={dataApprover}
                onChange={handleApproversChange}
                multiple={true}
              />
              <ErrorLabel content={approversError} />
            </div>
            <div className={`form-group ${!intendReceiveTimeError ? '' : 'has-error'}`}>
              <label>
                {'Ngày dự kiến nhập hàng'}
                <span className='text-red'> * </span>
              </label>
              <DatePicker
                id='date_picker_create_purchase-order_directly_intend_received_time'
                value={intendReceiveTime}
                onChange={handleIntendReceiveTimeChange}
                disabled={false}
              />
              <ErrorLabel content={intendReceiveTimeError} />
            </div>
            <div className={`form-group ${!discountError ? '' : 'has-error'}`}>
              <label>{'Tiền được khuyến mãi'}</label>
              <input type='number' className='form-control' value={discount ? discount : ''} onChange={handleDiscountChange} />
              <ErrorLabel content={discountError} />
            </div>
          </div>
          <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
            <div className={`form-group`}>
              <label>{'Ghi chú'}</label>
              <textarea type='text' className='form-control' value={desciption} onChange={handleDescriptionChange} />
            </div>
          </div>
          <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
            <fieldset className='scheduler-border'>
              <legend className='scheduler-border'>{'Thông tin nguyên vật liệu'}</legend>
              <div className='col-xs-12 col-sm-4 col-md-4 col-lg-4'>
                <div className={`form-group ${!goodError ? '' : 'has-error'}`}>
                  <label>
                    {'Nguyên vật liệu'}
                    <span className='text-red'> * </span>
                  </label>
                  <SelectBox
                    id={`select-create-purchase-order-directly-good`}
                    className='form-control select2'
                    style={{ width: '100%' }}
                    value={good._id}
                    items={dataGood}
                    onChange={handleGoodChange}
                    multiple={false}
                  />
                  <ErrorLabel content={goodError} />
                </div>
              </div>
              <div className='col-xs-12 col-sm-4 col-md-4 col-lg-4'>
                <div className={`form-group ${!quantityError ? '' : 'has-error'}`}>
                  <label>
                    {'Số lượng mua'}
                    <span className='text-red'> * </span>
                  </label>
                  <input type='number' className='form-control' value={quantity} onChange={handleQuantityChange} />
                  <ErrorLabel content={quantityError} />
                </div>
              </div>
              <div className='col-xs-12 col-sm-4 col-md-4 col-lg-4'>
                <div className={`form-group ${!priceError ? '' : 'has-error'}`}>
                  <label>
                    {'Giá nhập'}
                    <span className='text-red'> * </span>
                  </label>
                  <input type='number' className='form-control' value={price} onChange={handlePriceChange} />
                  <ErrorLabel content={priceError} />
                </div>
              </div>
              <div className={'pull-right'} style={{ padding: 10 }}>
                {editGoods ? (
                  <React.Fragment>
                    <button className='btn btn-success' onClick={handleCancelEditGood} style={{ marginLeft: '10px' }}>
                      {'Hủy chỉnh sửa'}
                    </button>
                    <button
                      className='btn btn-success'
                      disabled={!isSubmitGood()}
                      onClick={handleSaveEditGood}
                      style={{ marginLeft: '10px' }}
                    >
                      {'Lưu'}
                    </button>
                  </React.Fragment>
                ) : (
                  <button className='btn btn-success' style={{ marginLeft: '10px' }} disabled={!isSubmitGood()} onClick={handleAddGood}>
                    {'Thêm'}
                  </button>
                )}
                <button className='btn btn-primary' style={{ marginLeft: '10px' }} onClick={handleClearGood}>
                  {'Xóa trắng'}
                </button>
              </div>

              <table id={`purchase-order-create-directly-table`} className='table table-bordered not-sort'>
                <thead>
                  <tr>
                    <th title={'STT'}>{'STT'}</th>
                    <th title={'Mã đơn'}>{'Nguyên vật liệu'}</th>
                    <th title={'Mã đơn'}>{'Đơn vị tính'}</th>
                    <th title={'Tổng tiền'}>{'Số lượng'}</th>
                    <th title={'Còn'}>{'Giá nhập'}</th>
                    <th title={'Số tiền thanh toán'}>{'Tổng tiền'}</th>
                    <th title={'Đơn vị tính'}>{'Hành động'}</th>
                  </tr>
                </thead>
                <tbody>
                  {goods.length !== 0 &&
                    goods.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.good ? item.good.name : ''}</td>
                          <td>{item.good ? item.good.baseUnit : ''}</td>
                          <td>{item.quantity}</td>
                          <td>{item.price ? formatCurrency(item.price) : ''}</td>
                          <td style={{ fontWeight: 600 }}>
                            {item.price * item.quantity ? formatCurrency(item.price * item.quantity) : ''}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <a href='#abc' className='edit' title='Sửa' onClick={() => handleGoodsEdit(item, index)}>
                              <i className='material-icons'>edit</i>
                            </a>
                            <a onClick={() => handleDeleteGood(item)} className='delete text-red' style={{ width: '5px' }} title={'Xóa'}>
                              <i className='material-icons'>delete</i>
                            </a>
                          </td>
                        </tr>
                      )
                    })}
                  {goods.length !== 0 && (
                    <tr>
                      <td colSpan={5} style={{ fontWeight: 600 }}>
                        <center>{'Tổng thanh toán'}</center>
                      </td>
                      <td style={{ fontWeight: 600 }}>{getPaymentAmount()}</td>
                      <td></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </fieldset>
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  const { customers } = state.crm
  const { stocks, user, goods } = state
  return { stocks, customers, user, goods }
}

const mapDispatchToProps = {
  createPurchaseOrder: PurchaseOrderActions.createPurchaseOrder,
  getUser: UserActions.get
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(PurchaseOrderCreateFormDirectly))