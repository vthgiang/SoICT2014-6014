import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { PurchaseOrderActions } from '../redux/actions'
import { DialogModal, SelectBox, ErrorLabel, DatePicker } from '../../../../../common-components'
import ValidationHelper from '../../../../../helpers/validationHelper'
import { formatCurrency } from '../../../../../helpers/formatCurrency'
import { formatDate, formatToTimeZoneDate } from '../../../../../helpers/formatDate'
import { UserActions } from '../../../../super-admin/user/redux/actions'
import { UserServices } from '../../../../super-admin/user/redux/services'

function PurchaseOrderEditForm(props) {
  const [state, setState] = useState({
    code: '',
    material: '',
    materials: [],
    approvers: [],
    price: '',
    quantity: '',
    purchaseOrderId: '',
    dbus: ''
  })

  const [error, setError] = useState({})

  useEffect(() => {
    UserServices.get().then((res) => {
      setState({
        ...state,
        dbus: res.data.content
      })
    })
  }, [])

  if (props.purchaseOrderEdit._id !== state.purchaseOrderId) {
    setState((state) => {
      return {
        ...state,
        purchaseOrderId: props.purchaseOrderEdit._id,
        code: props.purchaseOrderEdit.code,
        stock: props.purchaseOrderEdit.stock._id,
        supplier: props.purchaseOrderEdit.supplier ? props.purchaseOrderEdit.supplier._id : undefined,
        approvers: props.purchaseOrderEdit.approvers.map((element) => element.approver._id),
        intendReceiveTime: props.purchaseOrderEdit.intendReceiveTime ? formatDate(props.purchaseOrderEdit.intendReceiveTime) : '',
        discount: props.purchaseOrderEdit.discount,
        desciption: props.purchaseOrderEdit.desciption,
        materials: props.purchaseOrderEdit.materials,
        status: props.purchaseOrderEdit.status,
        purchasingRequest: props.purchaseOrderEdit.purchasingRequest
      }
    })
  }

  const getSuplierOptions = () => {
    let options = []

    const { list } = props.customers
    if (list) {
      options = [
        {
          value: 'title', //Title không được chọn
          text: '---Chọn nhà cung cấp---'
        }
      ]

      let mapOptions = props.customers.list.map((item) => {
        return {
          value: item._id,
          text: item.name
        }
      })

      options = options.concat(mapOptions)
    }

    return options
  }

  const getApproverOptions = () => {
    let options = []
    let user = state.dbus
    if (user) {
      options = [
        {
          value: 'title', //Title không được chọn
          text: '---Chọn người phê duyệt---'
        }
      ]

      let mapOptions = user.map((item) => {
        return {
          value: item._id,
          text: item.name
        }
      })

      options = options.concat(mapOptions)
    }

    return options
  }

  const getStockOptions = () => {
    let options = []
    const { listStocks } = props.stocks

    // if (listStocks.length) {
    if (listStocks) {
      options = [
        {
          value: 'title', //Title không được chọn
          text: '---Chọn kho nhập---'
        }
      ]

      let mapOptions = listStocks.map((item) => {
        return {
          value: item._id,
          text: item.name
        }
      })

      options = options.concat(mapOptions)
    }

    return options
  }

  const getMaterialOptions = () => {
    let options = []
    let { listGoodsByType } = props.goods
    if (listGoodsByType) {
      options = [{ value: 'title', text: '---Chọn nguyên vật liệu---' }]

      let mapOptions = listGoodsByType.map((item) => {
        return {
          value: item._id,
          text: item.code + ' - ' + item.name + ' (' + item.baseUnit + ')'
        }
      })

      options = options.concat(mapOptions)
    }

    return options
  }

  const validateSupplier = (value, willUpdateState = true) => {
    let msg = undefined
    if (!value || value === '' || value === 'title') {
      msg = 'Giá trị không được bỏ trống!'
    }

    if (willUpdateState) {
      setError({
        ...error,
        supplierError: msg
      })
    }

    return msg
  }

  const handleSupplierChange = async (value) => {
    setState({
      ...state,
      supplier: value[0]
    })

    validateSupplier(value[0], true)
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
      setError({
        ...error,
        approversError: msg
      })
    }
    return msg === undefined
  }

  const handleApproversChange = (value) => {
    setState({
      ...state,
      approvers: value
    })
    validateApprovers(value, true)
  }

  const validateStock = (value, willUpdateState = true) => {
    let msg = undefined
    if (!value || value === '' || value === 'title') {
      msg = 'Giá trị không được bỏ trống!'
    }

    if (willUpdateState) {
      setError({
        ...error,
        stockError: msg
      })
    }

    return msg
  }

  const handleStockChange = (value) => {
    setState({
      ...state,
      stock: value[0]
    })
    validateStock(value[0], true)
  }

  const validateStatus = (value, willUpdateState = true) => {
    let msg = undefined
    if (!value || value === '' || value === 'title') {
      msg = 'Giá trị không được bỏ trống!'
    }

    if (willUpdateState) {
      setError({
        ...error,
        statusError: msg
      })
    }

    return msg
  }

  const handleStatusChange = (value) => {
    setState({
      ...state,
      status: value[0]
    })
    validateStatus(value[0], true)
  }

  const handleIntendReceiveTimeChange = (value) => {
    if (!value) {
      value = null
    }

    setState({
      ...state,
      intendReceiveTime: value
    })
    let { translate } = props
    let { message } = ValidationHelper.validateEmpty(translate, value)
    setError({
      ...error,
      intendReceiveTimeError: message
    })
  }

  const validateDiscount = (value, willUpdateState = true) => {
    let msg = undefined
    if (value && parseInt(value) <= 0) {
      msg = 'Giá trị phải lớn hơn 0, có thể bỏ trống!'
    }
    if (willUpdateState) {
      setError({
        ...error,
        discountError: msg
      })
    }
    return msg
  }

  const handleDiscountChange = (e) => {
    let { value } = e.target
    setState({
      ...state,
      discount: value
    })

    validateDiscount(value, true)
  }

  const handleDescriptionChange = (e) => {
    let { value } = e.target
    setState({
      ...state,
      desciption: value
    })
  }

  const validateMaterial = (value, willUpdateState = true) => {
    let msg = undefined
    if (!value) {
      msg = 'Giá trị không được để trống'
    } else if (value === 'title') {
      msg = 'Giá trị không được để trống'
    }

    if (willUpdateState) {
      setError({
        ...error,
        materialError: msg
      })
    }
    return msg
  }

  const handleMaterialChange = (value) => {
    if (value[0] !== 'title') {
      let { listGoodsByType } = props.goods
      const materialInfo = listGoodsByType.filter((item) => item._id === value[0])

      if (materialInfo.length) {
        setState((state) => {
          return {
            ...state,
            material: {
              _id: materialInfo[0]._id,
              code: materialInfo[0].code,
              name: materialInfo[0].name,
              baseUnit: materialInfo[0].baseUnit
            }
          }
        })
      }
    } else {
      setState((state) => {
        return {
          ...state,
          material: {
            _id: 'title',
            code: '',
            name: '',
            baseUnit: ''
          }
        }
      })
    }
    validateMaterial(value[0], true)
  }

  const validateQuantity = (value, willUpdateState = true) => {
    let msg = undefined
    if (!value || value === '') {
      msg = 'Giá trị không được bỏ trống!'
    } else if (parseInt(value) <= 0) {
      msg = 'giá trị phải lớn hơn 0!'
    }
    if (willUpdateState) {
      setError({
        ...error,
        quantityError: msg
      })
    }

    return msg
  }

  const handleQuantityChange = (e) => {
    let { value } = e.target
    setState({
      ...state,
      quantity: value
    })

    validateQuantity(value, true)
  }

  const validatePrice = (value, willUpdateState = true) => {
    let msg = undefined
    if (!value || value === '') {
      msg = 'Giá trị không được bỏ trống!'
    } else if (parseInt(value) < 0) {
      msg = 'giá trị không được nhỏ hơn 0!'
    }
    if (willUpdateState) {
      setError({
        ...error,
        priceError: msg
      })
    }

    return msg
  }

  const handlePriceChange = (e) => {
    let { value } = e.target
    setState({
      ...state,
      price: value
    })
    validatePrice(value, true)
  }

  const handleClearMaterial = (e) => {
    e.preventDefault()
    setState({
      ...state,
      material: {
        _id: 'title',
        code: '',
        name: '',
        baseUnit: ''
      },
      quantity: '',
      price: ''
    })

    setError({
      ...error,
      materialError: undefined,
      quantityError: undefined,
      priceError: undefined
    })
  }

  const getPaymentAmount = (isSubmit = false) => {
    let { materials, discount } = state
    let paymentAmount = 0

    paymentAmount = materials.reduce((accumulator, currentValue) => {
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

  const isSubmitMaterial = () => {
    //Validate để thêm material vào list materials
    let { material, quantity, price } = state
    if (validateMaterial(material, false) || validateQuantity(quantity, false) || validatePrice(price, false)) {
      return false
    } else {
      return true
    }
  }

  const handleAddMaterial = (e) => {
    e.preventDefault()
    if (isSubmitMaterial()) {
      const { material, quantity, price, materials } = state
      let data = {
        material,
        quantity,
        price
      }

      materials.push(data)

      setState({
        ...state,
        materials,
        material: {
          _id: 'title',
          code: '',
          name: '',
          baseUnit: ''
        },
        quantity: '',
        price: ''
      })

      setError({
        ...error,
        materialError: undefined,
        quantityError: undefined,
        priceError: undefined
      })
    }
  }

  const handleDeleteMaterial = (item) => {
    let { materials } = state
    let materialsFilter = materials.filter((element) => element.material !== item.material)
    setState({
      ...state,
      materials: materialsFilter
    })
  }

  const handleMaterialsEdit = (item, index) => {
    setState({
      ...state,
      editMaterials: true,
      indexEditting: index,
      material: item.material,
      quantity: item.quantity,
      price: item.price
    })
    setError({
      ...error,
      materialError: undefined,
      quantityError: undefined,
      priceError: undefined
    })
  }

  const handleSaveEditMaterial = (e) => {
    e.preventDefault()
    if (isSubmitMaterial()) {
      const { material, quantity, price, materials, indexEditting } = state
      let data = {
        material,
        quantity,
        price
      }

      materials[indexEditting] = data

      setState({
        ...state,
        materials,
        material: {
          _id: 'title',
          code: '',
          name: '',
          baseUnit: ''
        },
        quantity: '',
        price: '',
        indexEditting: '',
        editMaterials: false
      })

      setError({
        ...error,
        materialError: undefined,
        quantityError: undefined,
        priceError: undefined
      })
    }
  }

  const handleCancelEditMaterial = (e) => {
    e.preventDefault()
    setState({
      ...state,
      material: {
        _id: 'title',
        code: '',
        name: '',
        baseUnit: ''
      },
      quantity: '',
      price: '',
      indexEditting: '',
      editMaterials: false
    })

    setError({
      ...error,
      materialError: undefined,
      quantityError: undefined,
      priceError: undefined
    })
  }

  const isFormValidated = () => {
    const { translate } = props

    let { stock, supplier, approvers, intendReceiveTime, materials, status } = state
    if (
      validateStock(stock, false) ||
      validateSupplier(supplier, false) ||
      validateStatus(status, false) ||
      ValidationHelper.validateEmpty(translate, intendReceiveTime).message ||
      !approvers.length ||
      !materials.length
    ) {
      return false
    }
    return true
  }

  const formatMaterialsForSubmit = () => {
    let { materials } = state
    let materialsMap = materials.map((element) => {
      return {
        material: element.material,
        quantity: element.quantity,
        price: element.price
      }
    })

    return materialsMap
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
    let { code, stock, supplier, intendReceiveTime, discount, desciption, status, purchaseOrderId } = state
    let materials = await formatMaterialsForSubmit()
    let approvers = await formatApproversForSubmit()
    let data = {
      code,
      stock,
      supplier,
      approvers,
      intendReceiveTime: formatToTimeZoneDate(intendReceiveTime),
      discount,
      desciption,
      materials,
      status,
      paymentAmount: getPaymentAmount(true)
    }
    await props.updatePurchaseOrder(purchaseOrderId, data)
  }

  const {
    code,
    supplier,
    approvers,
    stock,
    intendReceiveTime,
    discount,
    desciption,
    material,
    quantity,
    price,
    materials,
    editMaterials,
    purchasingRequest,
    status,
    purchaseOrderId
  } = state
  const {
    supplierError,
    approversError,
    stockError,
    intendReceiveTimeError,
    discountError,
    materialError,
    quantityError,
    priceError,
    statusError
  } = error

  return (
    <React.Fragment>
      <DialogModal
        modalID={`modal-edit-purchase-order`}
        isLoading={false}
        formID={`form-edit-purchase-order`}
        title={'Chỉnh sửa đơn mua nguyên vật liệu'}
        msg_success={'Chỉnh sửa thành công'}
        msg_failure={'Chỉnh sửa không thành công'}
        disableSubmit={!isFormValidated()}
        func={save}
        size='75'
      >
        <form id={`form-edit-purchase-order`}>
          <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
            <div className='form-group'>
              <label>
                Mã đơn
                <span className='attention'> * </span>
              </label>
              <input type='text' className='form-control' value={code} disabled={true} />
            </div>
            <div className={`form-group`}>
              <label>Đơn đề nghị</label>
              <input
                type='text'
                className='form-control'
                value={purchasingRequest ? purchasingRequest.code : 'Đơn được lên trực tiếp'}
                disabled={true}
              />
              <ErrorLabel content={discountError} />
            </div>
            <div className={`form-group ${!stockError ? '' : 'has-error'}`}>
              <label>
                Kho nhập nguyên vật liệu
                <span className='attention'> * </span>
              </label>
              <SelectBox
                id={`select-edit-purchase-order-stock-${purchaseOrderId}`}
                className='form-control select2'
                style={{ width: '100%' }}
                value={stock}
                items={getStockOptions()}
                onChange={handleStockChange}
                multiple={false}
              />
              <ErrorLabel content={stockError} />
            </div>
            <div className={`form-group ${!supplierError ? '' : 'has-error'}`}>
              <label>
                Nhà cung cấp
                <span className='attention'> * </span>
              </label>
              <SelectBox
                id={`select-edit-purchase-order-supplier-${purchaseOrderId}`}
                className='form-control select2'
                style={{ width: '100%' }}
                value={supplier}
                items={getSuplierOptions()}
                onChange={handleSupplierChange}
                multiple={false}
              />
              <ErrorLabel content={supplierError} />
            </div>
          </div>
          <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
            <div className={`form-group ${!approversError ? '' : 'has-error'}`}>
              <label>
                Người phê duyệt
                <span className='attention'> * </span>
              </label>
              <SelectBox
                id={`select-edit-purchase-order-approvers-${purchaseOrderId}`}
                className='form-control select2'
                style={{ width: '100%' }}
                value={approvers}
                items={getApproverOptions()}
                onChange={handleApproversChange}
                multiple={true}
              />
              <ErrorLabel content={approversError} />
            </div>
            <div className={`form-group ${!statusError ? '' : 'has-error'}`}>
              <label>
                Trạng thái đơn
                <span className='attention'> * </span>
              </label>
              <SelectBox
                id={`select-edit-purchase-order-status-${purchaseOrderId}`}
                className='form-control select2'
                style={{ width: '100%' }}
                value={status}
                items={[
                  {
                    value: 'title',
                    text: '---Chọn trạng thái---'
                  },
                  {
                    value: 1,
                    text: 'Chờ phê duyệt'
                  },
                  {
                    value: 2,
                    text: 'Đã phê duyệt'
                  },
                  {
                    value: 3,
                    text: 'Đã nhập kho'
                  },
                  {
                    value: 4,
                    text: 'Đã hủy'
                  }
                ]}
                onChange={handleStatusChange}
                multiple={false}
              />
              <ErrorLabel content={statusError} />
            </div>
            <div className={`form-group ${!intendReceiveTimeError ? '' : 'has-error'}`}>
              <label>
                Ngày dự kiến nhập hàng
                <span className='attention'> * </span>
              </label>
              <DatePicker
                id={`date_picker_edit_purchase-order_directly_intend_received_time_${purchaseOrderId}`}
                value={intendReceiveTime}
                onChange={handleIntendReceiveTimeChange}
                disabled={false}
              />
              <ErrorLabel content={intendReceiveTimeError} />
            </div>
            <div className={`form-group ${!discountError ? '' : 'has-error'}`}>
              <label>Tiền được khuyến mãi</label>
              <input type='number' className='form-control' value={discount} onChange={handleDiscountChange} />
              <ErrorLabel content={discountError} />
            </div>
          </div>
          <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
            <div className={`form-group`}>
              <label>Ghi chú</label>
              <textarea type='text' className='form-control' value={desciption} onChange={handleDescriptionChange} />
            </div>
          </div>
          <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
            <fieldset className='scheduler-border'>
              <legend className='scheduler-border'>Thông tin nguyên vật liệu</legend>
              <div className='col-xs-12 col-sm-4 col-md-4 col-lg-4'>
                <div className={`form-group ${!materialError ? '' : 'has-error'}`}>
                  <label>
                    Nguyên vật liệu
                    <span className='attention'> * </span>
                  </label>
                  <SelectBox
                    id={`select-edit-purchase-order-directly-material-${purchaseOrderId}`}
                    className='form-control select2'
                    style={{ width: '100%' }}
                    value={material && material._id}
                    items={getMaterialOptions()}
                    onChange={handleMaterialChange}
                    multiple={false}
                  />
                  <ErrorLabel content={materialError} />
                </div>
              </div>
              <div className='col-xs-12 col-sm-4 col-md-4 col-lg-4'>
                <div className={`form-group ${!quantityError ? '' : 'has-error'}`}>
                  <label>
                    Số lượng mua
                    <span className='attention'> * </span>
                  </label>
                  <input type='number' className='form-control' value={quantity} onChange={handleQuantityChange} />
                  <ErrorLabel content={quantityError} />
                </div>
              </div>
              <div className='col-xs-12 col-sm-4 col-md-4 col-lg-4'>
                <div className={`form-group ${!priceError ? '' : 'has-error'}`}>
                  <label>
                    Giá nhập
                    <span className='attention'> * </span>
                  </label>
                  <input type='number' className='form-control' value={price} onChange={handlePriceChange} />
                  <ErrorLabel content={priceError} />
                </div>
              </div>
              <div className={'pull-right'} style={{ padding: 10 }}>
                {editMaterials ? (
                  <React.Fragment>
                    <button className='btn btn-success' onClick={handleCancelEditMaterial} style={{ marginLeft: '10px' }}>
                      Hủy chỉnh sửa
                    </button>
                    <button
                      className='btn btn-success'
                      disabled={!isSubmitMaterial()}
                      onClick={handleSaveEditMaterial}
                      style={{ marginLeft: '10px' }}
                    >
                      Lưu
                    </button>
                  </React.Fragment>
                ) : (
                  <button
                    className='btn btn-success'
                    style={{ marginLeft: '10px' }}
                    disabled={!isSubmitMaterial()}
                    onClick={handleAddMaterial}
                  >
                    {'Thêm'}
                  </button>
                )}
                <button className='btn btn-primary' style={{ marginLeft: '10px' }} onClick={handleClearMaterial}>
                  Xóa trắng
                </button>
              </div>

              <table id={`purchase-order-edit-table-${purchaseOrderId}`} className='table table-bordered not-sort'>
                <thead>
                  <tr>
                    <th title={'STT'}>STT</th>
                    <th title={'Mã đơn'}>Nguyên vật liệu</th>
                    <th title={'Mã đơn'}>Đơn vị tính</th>
                    <th title={'Tổng tiền'}>Số lượng</th>
                    <th title={'Còn'}>Giá nhập</th>
                    <th title={'Số tiền thanh toán'}>Tổng tiền</th>
                    <th title={'Đơn vị tính'}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {materials &&
                    materials.length !== 0 &&
                    materials.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.material ? item.material.name : ''}</td>
                          <td>{item.material ? item.material.baseUnit : ''}</td>
                          <td>{item.quantity}</td>
                          <td>{item.price ? formatCurrency(item.price) : ''}</td>
                          <td style={{ fontWeight: 600 }}>
                            {item.price * item.quantity ? formatCurrency(item.price * item.quantity) : ''}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <a href='#abc' className='edit' title='Sửa' onClick={() => handleMaterialsEdit(item, index)}>
                              <i className='material-icons'>edit</i>
                            </a>
                            <a
                              onClick={() => handleDeleteMaterial(item)}
                              className='delete text-red'
                              style={{ width: '5px' }}
                              title={'Xóa'}
                            >
                              <i className='material-icons'>delete</i>
                            </a>
                          </td>
                        </tr>
                      )
                    })}
                  {materials && materials.length !== 0 && (
                    <tr>
                      <td colSpan={5} style={{ fontWeight: 600 }}>
                        <center>Tổng thanh toán</center>
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
  updatePurchaseOrder: PurchaseOrderActions.updatePurchaseOrder,
  getUser: UserActions.get
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(PurchaseOrderEditForm))
