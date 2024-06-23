import React, {useState} from 'react'
import {connect} from 'react-redux'
import {withTranslate} from 'react-redux-multilingual'
import {CrmCustomerActions} from '@modules/crm/customer/redux/actions'
import {OrderActions} from '../redux/actions'
import {formatToTimeZoneDate} from '@helpers/formatDate'
import {DialogModal, ErrorLabel} from '@common-components'
import ValidationHelper from '@helpers/validationHelper'
import OrderCreateGood from './createOrder/orderCreateGood'
import OrderCreateInfo from './createOrder/orderCreateInfo'
import OrderCreateLocation from './createOrder/orderCreateLocation.jsx'
import '@modules/crm/customer/components/customer.css'
import {MapContainer} from 'react-leaflet';
import {StockActions} from '@modules/production/warehouse/stock-management/redux/actions.js';

function OrderCreateForm(props) {
  let initialState = {
    goods: [],
    code: '',
    note: '',
    customer: '',
    customerName: '',
    customerAddress: '',
    stockIn: {
      stock: '',
      stockName: '',
      stockAddress: '',
    },
    stockOut: {
      stock: '',
      stockName: '',
      stockAddress: '',
    },
    lat: 0,
    lng: 0,
    address: '',
    noteAddress: '',
    customerPhone: '',
    deliveryTime: '',
    priority: 2,
    transportType: 1,
    step: 0
  }
  const [state, setState] = useState(initialState)

  if (props.code !== state.code) {
    setState({
      ...state,
      code: props.code
    })
  }
  const handleAddressChange = (location) => {
    setState({
      ...state,
      lat: location.y,
      lng: location.x,
      address: location.label
    });
  }

  const validateCustomer = (value, willUpdateState = true) => {
    let msg = undefined
    if (!value) {
      msg = 'Giá trị không được để trống'
    } else if (value[0] === 'title') {
      msg = 'Giá trị không được để trống'
    }
    if (willUpdateState) {
      setState(state => {
        return {
          ...state,
          customerError: msg
        }
      })
    }
    return msg
  }

  const handleCustomerChange = (value) => {
    if (value[0] !== '' && value[0] !== 'title') {
      let customerInfo = props.customers.list.filter((item) => item._id === value[0])
      if (customerInfo.length) {
        setState({
          ...state,
          customer: customerInfo[0]._id,
          customerName: customerInfo[0].name,
          customerAddress: customerInfo[0].address,
          customerPhone: customerInfo[0].mobilephoneNumber,
          address: '',
          lat: 0,
          lng: 0,
          noteAddress: '',
          note: ''
        })
      }
    } else {
      setState((state) => {
        return {
          ...state,
          ...initialState
        }
      })
    }
    validateCustomer(value, true)
  }

  const handleStockInChange = (value) => {
    if (value[0] !== '' && value[0] !== 'title') {
      let stockInfo = props.stocks.listStocks.filter((item) => item._id === value[0])
      if (stockInfo.length) {
        setState({
          ...state,
          stockIn: {
            stock: stockInfo[0]._id,
            stockName: stockInfo[0].name,
            stockAddress: stockInfo[0].address
          }
        })
      }
    } else {
      setState((state) => {
        return {
          ...state,
          stockIn: {
            stock: '',
            stockName: '',
            stockAddress: ''
          }
        }
      })
    }
  }

  const handleStockOutChange = (value) => {
    if (value[0] !== '' && value[0] !== 'title') {
      let stockInfo = props.stocks.listStocks.filter((item) => item._id === value[0])
      if (stockInfo.length) {
        setState({
          ...state,
          stockOut: {
            stock: stockInfo[0]._id,
            stockName: stockInfo[0].name,
            stockAddress: stockInfo[0].address
          }
        })
      }
    } else {
      setState((state) => {
        return {
          ...state,
          stockOut: {
            stock: '',
            stockName: '',
            stockAddress: ''
          }
        }
      })
    }
  }

  const handleCustomerPhoneChange = (e) => {
    let {value} = e.target
    let {translate} = props
    let {message} = ValidationHelper.validateEmpty(translate, value)
    setState({
      ...state,
      customerPhone: value,
      customerPhoneError: message
    })
  }

  const handleCustomerAddressChange = (e) => {
    let {value} = e.target
    let {translate} = props
    let {message} = ValidationHelper.validateEmpty(translate, value)
    setState({
      ...state,
      customerAddress: value,
      customerAddressError: message
    })
  }

  const handleNoteChange = (e) => {
    let {value} = e.target
    setState((state) => {
      return {
        ...state,
        note: value
      }
    })
  }

  const handleTransportTypeChange = (value) => {
    setState({
      ...state,
      transportType: parseInt(value[0])
    })
  }

  const validatePriority = (value, willUpdateState = true) => {
    let msg = undefined
    if (!value) {
      msg = 'Giá trị không được để trống'
    } else if (value === 'title') {
      msg = 'Giá trị không được để trống'
    }
    if (willUpdateState) {
      setState({
        ...state,
        priorityError: msg
      })
    }
    return msg
  }

  const handlePriorityChange = (value) => {
    setState({
      ...state,
      priority: value[0]
    })
    validatePriority(value[0], true)
  }

  const setCurrentStep = (e, step) => {
    e.preventDefault()
    if (transportType === 3 && step === 1) {
      setState({
        ...state,
        step: 2
      })
    }
    setState({
      ...state,
      step
    })
  }

  const setGoods = (goods) => {
    setState((state) => {
      return {
        ...state,
        goods: goods
      }
    })
  }

  const handleDeliveryTimeChange = (value) => {
    setState((state) => {
      return {
        ...state,
        deliveryTime: value
      }
    })
  }

  const handleNoteAddressChange = (e) => {
    let {value} = e.target
    setState({
      ...state,
      noteAddress: value
    })
  }

  const isValidateOrderCreateGood = () => {
    let {goods} = state
    return !!(goods && goods.length);
  }

  const isValidateForm = () => {
    return !!isValidateOrderCreateGood();
  }

  const save = async () => {
    let {
      code,
      customer,
      customerPhone,
      address,
      noteAddress,
      lat,
      lng,
      priority,
      note,
      deliveryTime,
      goods,
      stockIn,
      stockOut,
      transportType
    } = state

    let data = {
      code,
      customer,
      customerPhone,
      address,
      noteAddress,
      lat,
      lng,
      priority,
      note,
      deliveryTime,
      goods,
      stockIn,
      stockOut,
      transportType
    }

    await props.createNewOrder(data)
    setState((state) => {
      return {
        ...state,
        ...initialState
      }
    })

    window.$(`#modal-add-order`).modal('hide')
    await props.getAllOrder()
  }

  let {
    code,
    note,
    customer,
    customerName,
    customerAddress,
    address,
    noteAddress,
    customerPhone,
    stockIn,
    stockOut,
    priority,
    transportType,
    step,
    goods,
    deliveryTime,
    isUseForeignCurrency,
    foreignCurrency,
    currency,
    standardCurrency,
    lat,
    lng
  } = state

  let {
    customerError,
    customerEmailError,
    customerPhoneError,
    customerAddressError,
    priorityError,
    organizationalUnitError,
    approversError
  } = state

  let enableStepOne = true
  let enableStepTwo = isValidateOrderCreateGood() || true
  let enableFormSubmit = enableStepOne && enableStepTwo

  return (
    <>
      <DialogModal
        modalID={`modal-add-order`}
        isLoading={false}
        formID={`form-add-order`}
        title={'Đơn hàng mới'}
        msg_success={'Thêm vận đơn thành công'}
        msg_failure={'Thêm vận đơn không thành công'}
        size="100"
        style={{backgroundColor: 'green'}}
        hasSaveButton={enableFormSubmit}
        func={save}
      >
        <div className="nav-tabs-custom">
          <ul className="breadcrumbs">
            <li key="1">
              <a
                className={`${step >= 0 ? 'quote-active-tab' : 'quote-defaul-tab'}`}
                onClick={(e) => setCurrentStep(e, 0)}
                style={{cursor: 'pointer'}}
              >
                <span>Thông tin khách hàng</span>
              </a>
            </li>
            {transportType !== 3 &&
              <li key="2">
                <a
                  className={`${step >= 1 ? 'quote-active-tab' : 'quote-defaul-tab'} 
                                    ${enableStepOne ? '' : 'disable-onclick-prevent'}`}
                  onClick={(e) => setCurrentStep(e, 1)}
                  style={{cursor: 'pointer'}}
                >
                  <span>Thiết lập địa chỉ</span>
                </a>
              </li>}
            <li key="3">
              <a
                className={`${step >= 2 ? 'quote-active-tab' : 'quote-defaul-tab'} 
                                    ${enableStepOne && enableStepTwo ? '' : 'disable-onclick-prevent'}`}
                onClick={(e) => setCurrentStep(e, 2)}
                style={{cursor: 'pointer'}}
              >
                <span>Danh sách hàng hóa</span>
              </a>
            </li>
          </ul>
        </div>
        <form id={`form-add-order`}>
          <div className="row row-equal-height" style={{marginTop: 0}}>
            {step === 0 && (
              <OrderCreateInfo
                //state
                code={code}
                note={note}
                customer={customer}
                customerName={customerName}
                customerAddress={customerAddress}
                customerPhone={customerPhone}
                priority={priority}
                transportType={transportType}
                stockIn={stockIn}
                stockOut={stockOut}
                //handle
                handleCustomerChange={handleCustomerChange}
                handleCustomerAddressChange={handleCustomerAddressChange}
                handleCustomerPhoneChange={handleCustomerPhoneChange}
                handleNoteChange={handleNoteChange}
                handlePriorityChange={handlePriorityChange}
                handleTransportTypeChange={handleTransportTypeChange}
                handleStockInChange={handleStockInChange}
                handleStockOutChange={handleStockOutChange}
                handleDeliveryTimeChange={handleDeliveryTimeChange}
                //Error Status
                customerError={customerError}
                customerEmailError={customerEmailError}
                customerPhoneError={customerPhoneError}
                customerAddressError={customerAddressError}
                priorityError={priorityError}
                organizationalUnitError={organizationalUnitError}
                approversError={approversError}
              />
            )}
            {step === 1 && (
              <div className={`d-flex flex-row`} style={{padding: 10, width: '100%'}}>
                <MapContainer className={"leaflet-container-order"}
                  center={[lat === 0 ? 21.0227396 : lat, lng === 0 ? 105.8369637 : lng]}
                  zoom={13} scrollWheelZoom={true}>
                  <OrderCreateLocation handleAddressChange={handleAddressChange}
                                       customerAddress={state.customerAddress}
                                       address={address}
                                       lat={lat}
                                       lng={lng}
                  />
                </MapContainer>
                <div className="col-lg-4" style={{padding: 10, height: '100%', marginLeft: 30}}>
                  <div className={`form-group`}>
                    <label>
                      Địa chỉ khách hàng
                      <span className="attention"> * </span>
                    </label>
                    <input type="text" className="form-control" value={address} disabled="true"/>
                  </div>
                  <div className="form-group">
                    <label>
                      Ghi chú địa chỉ
                    </label>
                    <textarea className="form-control" value={noteAddress} onChange={handleNoteAddressChange}/>
                  </div>
                </div>
              </div>
            )}
            {step === 2 && (
              <OrderCreateGood
                listGoods={goods}
                setGoods={setGoods}
                isUseForeignCurrency={isUseForeignCurrency}
                foreignCurrency={foreignCurrency}
                standardCurrency={standardCurrency}
                currency={currency}
                setCurrentSlasOfGood={(data) => {
                  setCurrentSlasOfGood(data)
                }}
                setCurrentDiscountsOfGood={(data) => {
                  setCurrentDiscountsOfGood(data)
                }}
              />
            )}
          </div>
        </form>
      </DialogModal>
    </>
  )
}

function mapStateToProps(state) {
  const {customers} = state.crm
  const {stocks} = state
  return {customers, stocks}
}

const mapDispatchToProps = {
  getCustomers: CrmCustomerActions.getCustomers,
  usePromotion: CrmCustomerActions.usePromotion,
  createNewOrder: OrderActions.createNewOrder,
  getAllOrder: OrderActions.getAllOrder,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(OrderCreateForm))
