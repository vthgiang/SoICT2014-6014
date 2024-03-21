import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { SalesOrderActions } from '../redux/actions'
import { DiscountActions } from '../../discount/redux/actions'
import { formatToTimeZoneDate, formatDate } from '../../../../../helpers/formatDate'
import { DialogModal, SelectBox } from '../../../../../common-components'
import ValidationHelper from '../../../../../helpers/validationHelper'
import SalesOrderCreateGood from './editSalesOrder/salesOrderCreateGood'
import SalesOrderCreateInfo from './editSalesOrder/salesOrderCreateInfo'
import SalesOrderCreatePayment from './editSalesOrder/salesOrderCreatePayment'
import SlasOfGoodDetail from './editSalesOrder/viewDetailOnCreate/slasOfGoodDetail'
import DiscountOfGoodDetail from './editSalesOrder/viewDetailOnCreate/discountOfGoodDetail'
import ManufacturingWorksOfGoodDetail from './editSalesOrder/viewDetailOnCreate/manufacturingWorksOfGoodDetail'

function SalesOrderEditForm(props) {
  const [state, setState] = useState({
    goods: [],
    discountsOfOrderValue: [],
    discountsOfOrderValueChecked: {},
    currentSlasOfGood: [],
    currentDiscountsOfGood: [],
    paymentAmount: 0,
    code: '',
    note: '',
    customer: '',
    customerName: '',
    customerAddress: '',
    customerPhone: '',
    customerRepresent: '',
    priority: '',
    shippingFee: '',
    deliveryTime: '',
    coin: '',
    step: 0,
    isUseForeignCurrency: false,
    foreignCurrency: {
      symbol: '', // ký hiệu viết tắt
      ratio: '' // tỷ lệ chuyển đổi
    },
    standardCurrency: {
      symbol: 'vnđ', // ký hiệu viết tắt
      ratio: '1' // tỷ lệ chuyển đổi
    },
    currency: {
      type: 'standard',
      symbol: '',
      ratio: '1'
    }
  })

  // console.log("extProps.salesOrderDetail", props.salesOrderDetail);
  if (props.salesOrderDetail._id !== state.salesOrderId) {
    setState((state) => {
      return {
        ...state,
        step: 0,
        salesOrderId: props.salesOrderDetail._id,
        code: props.salesOrderDetail.code,
        customer: props.salesOrderDetail.customer._id,
        customerName: props.salesOrderDetail.customer.name,
        customerPhone: props.salesOrderDetail.customerPhone,
        customerTaxNumber: props.salesOrderDetail.customer.taxNumber,
        customerRepresent: props.salesOrderDetail.customerRepresent,
        customerAddress: props.salesOrderDetail.customerAddress,
        customerEmail: props.salesOrderDetail.customerEmail,
        priority: props.salesOrderDetail.priority,
        deliveryTime: props.salesOrderDetail.deliveryTime ? formatDate(props.salesOrderDetail.deliveryTime) : '',
        discountsOfOrderValue: props.salesOrderDetail.discounts,
        discountsOfOrderValueChecked: Object.assign({}),
        note: props.salesOrderDetail.note,
        paymentAmount: props.salesOrderDetail.paymentAmount,
        shippingFee: props.salesOrderDetail.shippingFee,
        coin: props.salesOrderDetail.coin,
        status: props.salesOrderDetail.status,
        goods: props.salesOrderDetail.goods
          ? props.salesOrderDetail.goods.map((item) => {
              return {
                good: item.good,
                pricePerBaseUnit: item.pricePerBaseUnit,
                pricePerBaseUnitOrigin: item.pricePerBaseUnitOrigin,
                salesPriceVariance: item.salesPriceVariance,
                quantity: item.quantity,
                slasOfGood: item.serviceLevelAgreements,
                taxs: item.taxs,
                manufacturingWorks: item.manufacturingWorks,
                manufacturingPlan: item.manufacturingPlan,
                note: item.note,
                amount: item.amount,
                amountAfterDiscount: item.amountAfterDiscount,
                amountAfterTax: item.amountAfterTax,
                discountsOfGood: item.discounts.length
                  ? item.discounts.map((dis) => {
                      return {
                        _id: dis._id,
                        code: dis.code,
                        type: dis.type,
                        formality: dis.formality,
                        name: dis.name,
                        effectiveDate: dis.effectiveDate ? formatDate(dis.effectiveDate) : undefined,
                        expirationDate: dis.expirationDate ? formatDate(dis.expirationDate) : undefined,
                        discountedCash: dis.discountedCash,
                        discountedPercentage: dis.discountedPercentage,
                        maximumFreeShippingCost: dis.maximumFreeShippingCost,
                        loyaltyCoin: dis.loyaltyCoin,
                        bonusGoods: dis.bonusGoods
                          ? dis.bonusGoods.map((bonus) => {
                              return {
                                good: bonus.good,
                                expirationDateOfGoodBonus: bonus.expirationDateOfGoodBonus
                                  ? formatDate(bonus.expirationDateOfGoodBonus)
                                  : undefined,
                                quantityOfBonusGood: bonus.quantityOfBonusGood
                              }
                            })
                          : undefined,
                        discountOnGoods: dis.discountOnGoods
                          ? {
                              good: dis.discountOnGoods.good,
                              expirationDate: dis.discountOnGoods.expirationDate
                                ? formatDate(dis.discountOnGoods.expirationDate)
                                : undefined,
                              discountedPrice: dis.discountOnGoods.discountedPrice
                            }
                          : undefined
                      }
                    })
                  : []
              }
            })
          : []
      }
    })
  }

  useEffect(() => {
    // console.log("state", state.code, state.salesOrderCode);
    if (state.code !== state.salesOrderCode) {
      getDiscountOfOrderValueChecked()
      setState({
        ...state,
        salesOrderCode: state.code
      })
    }
  }, [state.code])

  const getDiscountOfOrderValueChecked = () => {
    const { listDiscountsByOrderValue } = props.discounts
    let { discountsOfOrderValue, discountsOfOrderValueChecked } = state
    let amountAfterApplyTax = getAmountAfterApplyTax()

    if (discountsOfOrderValue) {
      discountsOfOrderValue.forEach((element) => {
        //checked các khuyến mãi đã có trong danh mục
        let discount = listDiscountsByOrderValue.find((dis) => dis._id === element._id)
        if (discount) {
          let checked = getDiscountsCheckedForEditSalesOrder(discount, amountAfterApplyTax)
          discountsOfOrderValueChecked[`${checked.id}`] = checked.status
        }
      })

      setState({
        ...state,
        discountsOfOrderValueChecked
      })
    }
  }

  const getDiscountsCheckedForEditSalesOrder = (item, orderValue) => {
    let checked = { id: '', status: false }
    item.discounts.forEach((discount, index) => {
      let disabled = false
      if (discount.minimumThresholdToBeApplied) {
        if (parseInt(orderValue) < discount.minimumThresholdToBeApplied) {
          disabled = true
        }
      }
      if (discount.maximumThresholdToBeApplied) {
        if (parseInt(orderValue) > discount.maximumThresholdToBeApplied) {
          disabled = true
        }
      }
      if (!disabled) {
        checked = { id: `${item._id}-${index}`, status: true }
      }
    })

    return checked
  }

  const getAmountAfterApplyTax = () => {
    let { goods } = state
    let amountAfterApplyTax = goods.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.amountAfterTax
    }, 0)

    // setState({ amountAfterApplyTax });
    return amountAfterApplyTax
  }

  const validateCustomer = (value, willUpdateState = true) => {
    let msg = undefined
    if (!value) {
      msg = 'Giá trị không được để trống'
    } else if (value[0] === 'title') {
      msg = 'Giá trị không được để trống'
    }
    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          customerError: msg
        }
      })
    }
    return msg
  }

  const handleCustomerChange = (value) => {
    if (value[0] !== 'title') {
      let customerInfo = props.customers.list.filter((item) => item._id === value[0])
      if (customerInfo.length) {
        setState({
          ...state,
          customer: customerInfo[0]._id,
          customerName: customerInfo[0].name,
          customerAddress: customerInfo[0].address,
          customerPhone: customerInfo[0].mobilephoneNumber,
          customerRepresent: customerInfo[0].represent,
          customerTaxNumber: customerInfo[0].taxNumber,
          customerEmail: customerInfo[0].email
        })
      }
    } else {
      setState((state) => {
        return {
          ...state,
          customer: value[0],
          customerName: '',
          customerAddress: '',
          customerPhone: '',
          customerRepresent: '',
          customerTaxNumber: '',
          customerEmail: ''
        }
      })
    }

    validateCustomer(value, true)
  }

  const handleCustomerEmailChange = (e) => {
    let { value } = e.target
    let { translate } = props
    let { message } = ValidationHelper.validateEmail(translate, value)
    setState({
      ...state,
      customerEmail: value,
      customerEmailError: message
    })
  }

  const handleCustomerPhoneChange = (e) => {
    let { value } = e.target
    let { translate } = props
    let { message } = ValidationHelper.validateEmpty(translate, value)
    setState({
      ...state,
      customerPhone: value,
      customerPhoneError: message
    })
  }

  const handleCustomerAddressChange = (e) => {
    let { value } = e.target
    let { translate } = props
    let { message } = ValidationHelper.validateEmpty(translate, value)
    setState({
      ...state,
      customerAddress: value,
      customerAddressError: message
    })
  }

  const handleCustomerRepresentChange = (e) => {
    let { value } = e.target
    setState((state) => {
      return {
        ...state,
        customerRepresent: value
      }
    })
  }

  const handleNoteChange = (e) => {
    let { value } = e.target
    setState((state) => {
      return {
        ...state,
        note: value
      }
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
      setState((state) => {
        return {
          ...state,
          priorityError: msg
        }
      })
    }
    return msg
  }

  const handlePriorityChange = (value) => {
    setState((state) => {
      return {
        ...state,
        priority: value[0]
      }
    })
    validatePriority(value[0], true)
  }

  const setCurrentStep = (e, step) => {
    e.preventDefault()
    setState({
      ...state,
      step
    })
  }

  const setGoods = (goods) => {
    setState((state) => {
      return {
        ...state,
        goods
      }
    })
  }

  const handleUseForeignCurrencyChange = (e) => {
    const { checked } = e.target
    setState((state) => {
      return {
        ...state,
        isUseForeignCurrency: checked
      }
    })
    if (!checked) {
      setState((state) => {
        return {
          ...state,
          foreignCurrency: {
            ratio: '',
            symbol: ''
          },
          currency: {
            type: 'standard',
            symbol: 'vnđ',
            ratio: '1'
          }
        }
      })
    }
  }

  const handleRatioOfCurrencyChange = (e) => {
    let { foreignCurrency } = state
    let { value } = e.target
    setState((state) => {
      return {
        ...state,
        foreignCurrency: {
          ratio: value,
          symbol: foreignCurrency.symbol
        }
      }
    })
  }

  const handleSymbolOfForreignCurrencyChange = (e) => {
    let { foreignCurrency } = state
    let { value } = e.target
    setState((state) => {
      return {
        ...state,
        foreignCurrency: {
          ratio: foreignCurrency.ratio,
          symbol: value
        }
      }
    })
  }

  const handleChangeCurrency = (value) => {
    let { foreignCurrency, standardCurrency } = state
    setState((state) => {
      return {
        ...state,
        currency: {
          type: value[0],
          symbol: value[0] === 'standard' ? standardCurrency.symbol : foreignCurrency.symbol,
          ratio: foreignCurrency.ratio
        }
      }
    })
  }

  const handleDiscountsOfOrderValueChange = (data) => {
    setState((state) => {
      return {
        ...state,
        discountsOfOrderValue: data
      }
    })
  }

  const setDiscountsOfOrderValueChecked = (discountsOfOrderValueChecked) => {
    setState((state) => {
      return {
        ...state,
        discountsOfOrderValueChecked
      }
    })
  }

  const handleShippingFeeChange = (e) => {
    const { value } = e.target
    setState((state) => {
      return {
        ...state,
        shippingFee: value
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

  const setCurrentSlasOfGood = (data) => {
    setState((state) => {
      return {
        ...state,
        currentSlasOfGood: data
      }
    })
  }

  const setCurrentDiscountsOfGood = (data) => {
    setState((state) => {
      return {
        ...state,
        currentDiscountsOfGood: data
      }
    })
  }

  const setCurrentManufacturingWorksOfGoods = (manufacturingWorks, manufacturingPlan) => {
    setState((state) => {
      return {
        ...state,
        currentManufacturingWorksOfGood: manufacturingWorks,
        currentManufacturingPlanOfGood: manufacturingPlan
      }
    })
  }

  const handleCoinChange = (coin) => {
    setState((state) => {
      return {
        ...state,
        coin: state.coin ? '' : coin //Nếu đang checked thì bỏ checked
      }
    })
  }

  const getCoinOfAll = () => {
    let coinOfAll = 0
    let { goods } = state
    let { discountsOfOrderValue } = state

    goods.forEach((good) => {
      good.discountsOfGood.forEach((discount) => {
        if (discount.formality == '2') {
          coinOfAll += discount.loyaltyCoin
        }
      })
    })

    discountsOfOrderValue.forEach((discount) => {
      if (discount.formality == '2') {
        coinOfAll += discount.loyaltyCoin
      }
    })
    return coinOfAll
  }

  const setPaymentAmount = (paymentAmount) => {
    setState((state) => {
      return {
        ...state,
        paymentAmount
      }
    })
  }

  const isValidateSalesOrderCreateInfo = () => {
    let { customer, customerEmail, customerPhone, customerAddress, priority } = state
    let { translate } = props

    if (
      validateCustomer(customer, false) ||
      validatePriority(priority, false) ||
      !ValidationHelper.validateEmail(translate, customerEmail).status ||
      !ValidationHelper.validateEmpty(translate, customerPhone).status ||
      !ValidationHelper.validateEmpty(translate, customerAddress).status
    ) {
      return false
    } else {
      return true
    }
  }

  const isValidateSalesOrderCreateGood = () => {
    let { goods } = state
    if (goods && goods.length) {
      return true
    } else {
      return false
    }
  }

  const isValidateForm = () => {
    if (isValidateSalesOrderCreateInfo() && isValidateSalesOrderCreateGood()) {
      return true
    } else {
      return false
    }
  }

  const formatDiscountForSubmit = (discounts) => {
    let discountsMap = discounts.map((dis) => {
      return {
        _id: dis._id,
        code: dis.code,
        type: dis.type,
        formality: dis.formality,
        name: dis.name,
        effectiveDate: dis.effectiveDate ? new Date(formatToTimeZoneDate(dis.effectiveDate)) : undefined,
        expirationDate: dis.expirationDate ? new Date(formatToTimeZoneDate(dis.expirationDate)) : undefined,
        discountedCash: dis.discountedCash,
        discountedPercentage: dis.discountedPercentage,
        maximumFreeShippingCost: dis.maximumFreeShippingCost,
        loyaltyCoin: dis.loyaltyCoin,
        bonusGoods: dis.bonusGoods
          ? dis.bonusGoods.map((bonus) => {
              return {
                good: bonus.good._id,
                expirationDateOfGoodBonus: bonus.expirationDateOfGoodBonus
                  ? new Date(formatToTimeZoneDate(bonus.expirationDateOfGoodBonus))
                  : undefined,
                quantityOfBonusGood: bonus.quantityOfBonusGood
              }
            })
          : undefined,
        discountOnGoods: dis.discountOnGoods
          ? {
              good: dis.discountOnGoods.good._id,
              expirationDate: dis.discountOnGoods.expirationDate
                ? new Date(formatToTimeZoneDate(dis.discountOnGoods.expirationDate))
                : undefined,
              discountedPrice: dis.discountOnGoods.discountedPrice
            }
          : undefined
      }
    })

    return discountsMap
  }

  const formatGoodForSubmit = () => {
    let { goods } = state
    let goodMap = goods.map((item) => {
      return {
        good: item.good._id,
        pricePerBaseUnit: item.pricePerBaseUnit,
        pricePerBaseUnitOrigin: item.pricePerBaseUnitOrigin,
        salesPriceVariance: item.salesPriceVariance,
        quantity: item.quantity,
        serviceLevelAgreements: item.slasOfGood,
        taxs: item.taxs,
        discounts: item.discountsOfGood.length ? formatDiscountForSubmit(item.discountsOfGood) : [],
        note: item.note,
        amount: item.amount,
        amountAfterDiscount: item.amountAfterDiscount,
        amountAfterTax: item.amountAfterTax,
        manufacturingWorks: item.manufacturingWorks ? item.manufacturingWorks._id : undefined,
        manufacturingPlan: item.manufacturingPlan
      }
    })
    return goodMap
  }

  const save = async (e) => {
    e.preventDefault()
    if (isValidateForm()) {
      let {
        customer,
        customerAddress,
        customerPhone,
        customerRepresent,
        customerEmail,
        priority,
        code,
        shippingFee,
        deliveryTime,
        coin,
        discountsOfOrderValue,
        paymentAmount,
        note,
        salesOrderId
      } = state

      let allCoin = getCoinOfAll() //Lấy tất cả các xu được tặng trong đơn

      let data = {
        code,
        customer,
        customerPhone,
        customerAddress,
        customerRepresent,
        customerEmail,
        priority,
        goods: formatGoodForSubmit(),
        discounts: discountsOfOrderValue.length ? formatDiscountForSubmit(discountsOfOrderValue) : [],
        shippingFee,
        deliveryTime: deliveryTime ? new Date(formatToTimeZoneDate(deliveryTime)) : undefined,
        coin,
        allCoin,
        paymentAmount,
        note
      }

      await props.editSalesOrder(salesOrderId, data)

      setState((state) => {
        return {
          ...state,
          step: 0
        }
      })

      window.$(`#modal-edit-sales-order`).modal('hide')
    }
  }

  let {
    code,
    note,
    customer,
    customerName,
    customerAddress,
    customerPhone,
    customerRepresent,
    customerTaxNumber,
    customerEmail,
    priority,
    step,
    goods,
    shippingFee,
    coin,
    deliveryTime,
    isUseForeignCurrency,
    foreignCurrency,
    currency,
    standardCurrency,
    discountsOfOrderValue,
    discountsOfOrderValueChecked,
    currentSlasOfGood,
    currentDiscountsOfGood,
    currentManufacturingWorksOfGood,
    currentManufacturingPlanOfGood,
    paymentAmount
  } = state

  let { customerError, customerEmailError, customerPhoneError, customerAddressError, priorityError } = state

  let enableStepOne = isValidateSalesOrderCreateInfo()
  let enableStepTwo = isValidateSalesOrderCreateGood()
  let enableFormSubmit = enableStepOne && enableStepTwo

  return (
    <React.Fragment>
      <DialogModal
        modalID={`modal-edit-sales-order`}
        isLoading={false}
        formID={`form-add-sales-order`}
        title={'Chỉnh sửa đơn bán hàng'}
        size='100'
        style={{ backgroundColor: 'green' }}
        hasSaveButton={false}
      >
        <div className='nav-tabs-custom'>
          <ul className='breadcrumbs'>
            <li key='1'>
              <a
                className={`${step >= 0 ? 'quote-active-tab' : 'quote-defaul-tab'}`}
                onClick={(e) => setCurrentStep(e, 0)}
                style={{ cursor: 'pointer' }}
              >
                <span>Thông tin chung</span>
              </a>
            </li>
            <li key='2'>
              <a
                className={`${step >= 1 ? 'quote-active-tab' : 'quote-defaul-tab'} 
                                    ${enableStepOne ? '' : 'disable-onclick-prevent'}`}
                onClick={(e) => setCurrentStep(e, 1)}
                style={{ cursor: 'pointer' }}
              >
                <span>Chọn sản phẩm</span>
              </a>
            </li>
            <li key='3'>
              <a
                className={`${step >= 2 ? 'quote-active-tab' : 'quote-defaul-tab'} 
                                    ${enableStepOne && enableStepTwo ? '' : 'disable-onclick-prevent'}`}
                onClick={(e) => setCurrentStep(e, 2)}
                style={{ cursor: 'pointer' }}
              >
                <span>Chốt đơn</span>
              </a>
            </li>
          </ul>
          {foreignCurrency.ratio && foreignCurrency.symbol ? (
            <div className='form-group select-currency'>
              <SelectBox
                id={`select-sales-order-currency-${foreignCurrency.symbol.replace(' ')}`}
                className='form-control select2'
                style={{ width: '100%' }}
                value={currency.type}
                items={[
                  { text: 'vnđ', value: 'standard' },
                  { text: `${foreignCurrency.symbol}`, value: 'foreign' }
                ]}
                onChange={handleChangeCurrency}
                multiple={false}
              />
            </div>
          ) : (
            ''
          )}
        </div>
        <SlasOfGoodDetail currentSlasOfGood={currentSlasOfGood} />
        <DiscountOfGoodDetail currentDiscounts={currentDiscountsOfGood} />
        <ManufacturingWorksOfGoodDetail
          currentManufacturingWorksOfGood={currentManufacturingWorksOfGood}
          currentManufacturingPlanOfGood={currentManufacturingPlanOfGood}
        />
        <form id={`form-add-sales-order`}>
          <div className='row row-equal-height' style={{ marginTop: 0 }}>
            {step === 0 && (
              <SalesOrderCreateInfo
                //state
                code={code}
                note={note}
                customer={customer}
                customerName={customerName}
                customerAddress={customerAddress}
                customerPhone={customerPhone}
                customerRepresent={customerRepresent}
                customerTaxNumber={customerTaxNumber}
                customerEmail={customerEmail}
                priority={priority}
                isUseForeignCurrency={isUseForeignCurrency}
                foreignCurrency={foreignCurrency}
                //handle
                handleCustomerChange={handleCustomerChange}
                handleCustomerAddressChange={handleCustomerAddressChange}
                handleCustomerEmailChange={handleCustomerEmailChange}
                handleCustomerPhoneChange={handleCustomerPhoneChange}
                handleCustomerRepresentChange={handleCustomerRepresentChange}
                handleNoteChange={handleNoteChange}
                handleUseForeignCurrencyChange={handleUseForeignCurrencyChange}
                handleRatioOfCurrencyChange={handleRatioOfCurrencyChange}
                handleSymbolOfForreignCurrencyChange={handleSymbolOfForreignCurrencyChange}
                handlePriorityChange={handlePriorityChange}
                //Error Status
                customerError={customerError}
                customerEmailError={customerEmailError}
                customerPhoneError={customerPhoneError}
                customerAddressError={customerAddressError}
                priorityError={priorityError}
              />
            )}
            {step === 1 && (
              <SalesOrderCreateGood
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
                setCurrentManufacturingWorksOfGoods={(manufacturingWorks, manufacturingPlan) => {
                  setCurrentManufacturingWorksOfGoods(manufacturingWorks, manufacturingPlan)
                }}
              />
            )}
            {step === 2 && (
              <SalesOrderCreatePayment
                paymentAmount={paymentAmount}
                listGoods={goods}
                customer={customer}
                customerPhone={customerPhone}
                customerAddress={customerAddress}
                customerName={customerName}
                customerRepresent={customerRepresent}
                customerTaxNumber={customerTaxNumber}
                customerEmail={customerEmail}
                priority={priority}
                code={code}
                shippingFee={shippingFee}
                deliveryTime={deliveryTime}
                coin={coin}
                note={note}
                discountsOfOrderValue={discountsOfOrderValue}
                discountsOfOrderValueChecked={discountsOfOrderValueChecked}
                enableFormSubmit={enableFormSubmit}
                handleDiscountsOfOrderValueChange={(data) => handleDiscountsOfOrderValueChange(data)}
                setDiscountsOfOrderValueChecked={(checked) => setDiscountsOfOrderValueChecked(checked)}
                handleShippingFeeChange={handleShippingFeeChange}
                handleDeliveryTimeChange={handleDeliveryTimeChange}
                handleCoinChange={handleCoinChange}
                setCurrentSlasOfGood={(data) => {
                  setCurrentSlasOfGood(data)
                }}
                setCurrentDiscountsOfGood={(data) => {
                  setCurrentDiscountsOfGood(data)
                }}
                setCurrentManufacturingWorksOfGoods={(manufacturingWorks, manufacturingPlan) => {
                  setCurrentManufacturingWorksOfGoods(manufacturingWorks, manufacturingPlan)
                }}
                setPaymentAmount={(data) => setPaymentAmount(data)}
                saveSalesOrder={save}
              />
            )}
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  const { discounts, salesOrders } = state
  const { customers } = state.crm
  const { salesOrderDetail } = salesOrders
  return { discounts, customers, salesOrderDetail }
}

const mapDispatchToProps = {
  getDiscountForOrderValue: DiscountActions.getDiscountForOrderValue,
  editSalesOrder: SalesOrderActions.editSalesOrder
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(SalesOrderEditForm))
