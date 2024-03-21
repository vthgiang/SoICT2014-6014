import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { CrmCustomerActions } from '../../../../crm/customer/redux/actions'
import { QuoteActions } from '../redux/actions'
import { generateCode } from '../../../../../helpers/generateCode'
import { formatToTimeZoneDate } from '../../../../../helpers/formatDate'
import { DialogModal, SelectBox, ButtonModal } from '../../../../../common-components'
import ValidationHelper from '../../../../../helpers/validationHelper'
import QuoteCreateGood from './createQuote/quoteCreateGood'
import QuoteCreateInfo from './createQuote/quoteCreateInfo'
import QuoteCreatePayment from './createQuote/quoteCreatePayment'
import SlasOfGoodDetail from './createQuote/viewDetailOnCreate/slasOfGoodDetail'
import DiscountOfGoodDetail from './createQuote/viewDetailOnCreate/discountOfGoodDetail'
import '../../../../crm/customer/components/customer.css'

function QuoteCreateForm(props) {
  const [state, setState] = useState({
    goods: [],
    approvers: [],
    discountsOfOrderValue: [],
    discountsOfOrderValueChecked: {},
    currentSlasOfGood: [],
    currentDiscountsOfGood: [],
    paymentAmount: 0,
    code: '',
    note: '',
    customerPromotions: [],
    customer: '',
    customerName: '',
    customerAddress: '',
    customerPhone: '',
    customerRepresent: '',
    effectiveDate: '',
    expirationDate: '',
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

  useEffect(() => {
    props.getCustomers({ getAll: true })
  }, [])

  const handleClickCreateCode = () => {
    setState((state) => {
      return { ...state, code: generateCode('QUOTE_') }
    })
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
      let customerPromotions = customerInfo[0].canUsedPromotions
        .map((promo) => ({ ...promo, checked: false, disabled: false }))
        .filter((item) => item.status == 1)
      if (customerInfo.length) {
        setState({
          ...state,
          customer: customerInfo[0]._id,
          customerName: customerInfo[0].name,
          customerAddress: customerInfo[0].address,
          customerPhone: customerInfo[0].mobilephoneNumber,
          customerRepresent: customerInfo[0].represent,
          customerTaxNumber: customerInfo[0].taxNumber,
          customerEmail: customerInfo[0].email,
          customerPromotions
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

  const validateDateStage = (effectiveDate, expirationDate, willUpdateState = true) => {
    let msg = undefined
    let {} = state
    if (effectiveDate && expirationDate) {
      let effDate = new Date(formatToTimeZoneDate(effectiveDate))
      let expDate = new Date(formatToTimeZoneDate(expirationDate))
      if (effDate.getTime() >= expDate.getTime()) {
        msg = 'Ngày bắt đầu phải trước ngày kết thúc'
      } else {
        msg = undefined
      }
    }

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          effectiveDate: effectiveDate,
          expirationDate: expirationDate,
          effectiveDateError: msg,
          expirationDateError: msg
        }
      })
    }
    return msg
  }

  const handleChangeEffectiveDate = (value) => {
    const { expirationDate } = state
    if (!value) {
      value = null
    }

    let { translate } = props
    let { message } = ValidationHelper.validateEmpty(translate, value)
    setState({ ...state, effectiveDateError: message, expirationDateError: undefined })

    if (value) {
      validateDateStage(value, expirationDate, true)
    }
  }

  const handleChangeExpirationDate = (value) => {
    const { effectiveDate } = state
    if (!value) {
      value = null
    }
    let { translate } = props
    let { message } = ValidationHelper.validateEmpty(translate, value)
    setState({ ...state, expirationDateError: message, effectiveDateError: undefined })

    if (value) {
      validateDateStage(effectiveDate, value, true)
    }
  }

  const validateOrganizationalUnit = (value, willUpdateState = true) => {
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
          organizationalUnitError: msg
        }
      })
    }
    return msg
  }

  const handleOrganizationalUnitChange = (value) => {
    setState((state) => {
      return {
        ...state,
        organizationalUnit: value[0]
      }
    })
    validateOrganizationalUnit(value[0], true)
  }

  const validateApprovers = (value, willUpdateState = true) => {
    let msg = undefined
    if (!value.length) {
      msg = 'Giá trị không được để trống'
    } else {
      for (let index = 0; index < value.length; value++) {
        if (value[index] === 'title') {
          msg = 'Không được chọn tiêu đề'
        }
      }
    }
    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          approversError: msg
        }
      })
    }
    return msg
  }

  const handleApproversChange = (value) => {
    setState((state) => {
      return {
        ...state,
        approvers: value
      }
    })
    validateApprovers(value, true)
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

  const setCustomerPromotions = (customerPromotions) => {
    setState((state) => {
      return {
        ...state,
        customerPromotions
      }
    })
  }

  const isValidateQuoteCreateInfo = () => {
    let { customer, customerEmail, customerPhone, customerAddress, effectiveDate, expirationDate, approvers } = state
    let { translate } = props

    if (
      validateCustomer(customer, false) ||
      !ValidationHelper.validateEmail(translate, customerEmail).status ||
      !ValidationHelper.validateEmpty(translate, customerPhone).status ||
      !ValidationHelper.validateEmpty(translate, customerAddress).status ||
      validateApprovers(approvers, false) ||
      validateDateStage(effectiveDate, expirationDate, false) ||
      !ValidationHelper.validateEmpty(translate, effectiveDate).status ||
      !ValidationHelper.validateEmpty(translate, expirationDate).status
    ) {
      return false
    } else {
      return true
    }
  }

  const isValidateQuoteCreateGood = () => {
    let { goods } = state
    if (goods && goods.length) {
      return true
    } else {
      return false
    }
  }

  const isValidateForm = () => {
    if (isValidateQuoteCreateInfo() && isValidateQuoteCreateGood()) {
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
        effectiveDate: dis.effectiveDate,
        expirationDate: dis.expirationDate,
        discountedCash: dis.discountedCash,
        discountedPercentage: dis.discountedPercentage,
        maximumFreeShippingCost: dis.maximumFreeShippingCost,
        loyaltyCoin: dis.loyaltyCoin,
        bonusGoods: dis.bonusGoods
          ? dis.bonusGoods.map((bonus) => {
              return {
                good: bonus.good._id,
                expirationDateOfGoodBonus: bonus.expirationDateOfGoodBonus,
                quantityOfBonusGood: bonus.quantityOfBonusGood
              }
            })
          : undefined,
        discountOnGoods: dis.discountOnGoods
          ? {
              good: dis.discountOnGoods.good._id,
              expirationDate: dis.discountOnGoods.expirationDate,
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
        amountAfterTax: item.amountAfterTax
      }
    })
    return goodMap
  }

  const save = async () => {
    // console.log("isValidateForm()", isValidateForm());
    if (isValidateForm()) {
      let {
        customer,
        customerAddress,
        customerPhone,
        customerRepresent,
        customerEmail,
        code,
        effectiveDate,
        expirationDate,
        shippingFee,
        deliveryTime,
        coin,
        discountsOfOrderValue,
        paymentAmount,
        note,
        approvers
      } = state

      let allCoin = getCoinOfAll() //Lấy tất cả các xu được tặng trong đơn

      let data = {
        code,
        effectiveDate: effectiveDate ? new Date(formatToTimeZoneDate(effectiveDate)) : undefined,
        expirationDate: expirationDate ? new Date(formatToTimeZoneDate(expirationDate)) : undefined,
        customer,
        customerPhone,
        customerAddress,
        customerRepresent,
        customerEmail,
        goods: formatGoodForSubmit(),
        discounts: discountsOfOrderValue.length ? formatDiscountForSubmit(discountsOfOrderValue) : [],
        shippingFee,
        deliveryTime: deliveryTime ? new Date(formatToTimeZoneDate(deliveryTime)) : undefined,
        coin,
        allCoin,
        paymentAmount,
        note,
        approvers: approvers.map((element) => {
          return { approver: element }
        })
      }

      await props.createNewQuote(data)
      let usedCustomerPromotions = customerPromotions.filter((promo) => promo.checked)
      await props.usePromotion(customer, { code: usedCustomerPromotions[0].code })

      setState((state) => {
        return {
          ...state,
          customer: '',
          customerName: '',
          customerAddress: '',
          customerPhone: '',
          customerRepresent: '',
          customerTaxNumbe: '',
          customerEmail: '',
          code: '',
          effectiveDate: '',
          expirationDate: '',
          shippingFee: '',
          deliveryTime: '',
          coin: '',
          goods: [],
          discountsOfOrderValue: [],
          paymentAmount: '',
          note: '',
          approvers: [],
          paymentAmount: '',
          step: 0
        }
      })

      window.$(`#modal-add-quote`).modal('hide')
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
    effectiveDate,
    expirationDate,
    organizationalUnit,
    approvers,
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
    paymentAmount,
    customerPromotions
  } = state

  let {
    customerError,
    customerEmailError,
    customerPhoneError,
    customerAddressError,
    effectiveDateError,
    expirationDateError,
    organizationalUnitError,
    approversError
  } = state

  let enableStepOne = isValidateQuoteCreateInfo()
  let enableStepTwo = isValidateQuoteCreateGood()
  let enableFormSubmit = enableStepOne && enableStepTwo

  console.log('businessDepartments', props.businessDepartments)

  return (
    <React.Fragment>
      <ButtonModal
        onButtonCallBack={handleClickCreateCode}
        modalID={`modal-add-quote`}
        button_name={'Đơn báo giá mới'}
        title={'Đơn báo giá mới'}
      />
      <DialogModal
        modalID={`modal-add-quote`}
        isLoading={false}
        formID={`form-add-quote`}
        title={'Đơn báo giá mới'}
        msg_success={'Thêm đơn thành công'}
        msg_failure={'Thêm đơn không thành công'}
        // disableSubmit={!isFormValidated()}
        // func={save}
        size='100'
        style={{ backgroundColor: 'green' }}
        hasSaveButton={false}
      >
        <div className='nav-tabs-custom'>
          {/* <ul className="nav nav-tabs">
                            <li className={step === 0 ? "active" : ""} key="1">
                                <a data-toggle="tab" onClick={(e) => setCurrentStep(e, 0)} style={{ cursor: "pointer" }}>
                                    Thông tin chung
                                </a>
                            </li>
                            <li className={step === 1 ? "active" : ""} key="2">
                                <a data-toggle="tab" onClick={(e) => setCurrentStep(e, 1)} style={{ cursor: "pointer" }}>
                                    Chọn sản phẩm
                                </a>
                            </li>
                            <li className={step === 2 ? "active" : ""} key="3">
                                <a data-toggle="tab" onClick={(e) => setCurrentStep(e, 2)} style={{ cursor: "pointer" }}>
                                    Chốt báo giá
                                </a>
                            </li>
                        </ul> */}
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
                <span>Chốt báo giá</span>
              </a>
            </li>
          </ul>
          {foreignCurrency.ratio && foreignCurrency.symbol ? (
            <div className='form-group select-currency'>
              <SelectBox
                id={`select-quote-currency-${foreignCurrency.symbol.replace(' ')}`}
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
        <form id={`form-add-quote`}>
          <div className='row row-equal-height' style={{ marginTop: 0 }}>
            {step === 0 && (
              <QuoteCreateInfo
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
                effectiveDate={effectiveDate}
                expirationDate={expirationDate}
                organizationalUnit={organizationalUnit}
                approvers={approvers}
                isUseForeignCurrency={isUseForeignCurrency}
                foreignCurrency={foreignCurrency}
                //handle
                handleCustomerChange={handleCustomerChange}
                handleCustomerAddressChange={handleCustomerAddressChange}
                handleCustomerEmailChange={handleCustomerEmailChange}
                handleCustomerPhoneChange={handleCustomerPhoneChange}
                handleCustomerRepresentChange={handleCustomerRepresentChange}
                handleNoteChange={handleNoteChange}
                handleChangeEffectiveDate={handleChangeEffectiveDate}
                handleChangeExpirationDate={handleChangeExpirationDate}
                handleUseForeignCurrencyChange={handleUseForeignCurrencyChange}
                handleRatioOfCurrencyChange={handleRatioOfCurrencyChange}
                handleSymbolOfForreignCurrencyChange={handleSymbolOfForreignCurrencyChange}
                handleOrganizationalUnitChange={handleOrganizationalUnitChange}
                handleApproversChange={handleApproversChange}
                //Error Status
                customerError={customerError}
                customerEmailError={customerEmailError}
                customerPhoneError={customerPhoneError}
                customerAddressError={customerAddressError}
                effectiveDateError={effectiveDateError}
                expirationDateError={expirationDateError}
                organizationalUnitError={organizationalUnitError}
                approversError={approversError}
              />
            )}
            {step === 1 && (
              <QuoteCreateGood
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
            {step === 2 && (
              <QuoteCreatePayment
                paymentAmount={paymentAmount}
                customerPromotions={customerPromotions}
                listGoods={goods}
                customer={customer}
                customerPhone={customerPhone}
                customerAddress={customerAddress}
                customerName={customerName}
                customerRepresent={customerRepresent}
                customerTaxNumber={customerTaxNumber}
                customerEmail={customerEmail}
                effectiveDate={effectiveDate}
                expirationDate={expirationDate}
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
                setPaymentAmount={(data) => setPaymentAmount(data)}
                setCustomerPromotions={(data) => setCustomerPromotions(data)}
                saveQuote={save}
              />
            )}
          </div>
          {/* <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className={"pull-right"} style={{ padding: 10 }}>
                                <div>
                                    <div>
                                        {step + 1} / {3}
                                    </div>
                                    <div>
                                        {step !== 0 ? (
                                            <button className="btn" onClick={preStep}>
                                                Quay lại
                                            </button>
                                        ) : (
                                            ""
                                        )}
                                        {step === 2 ? (
                                            ""
                                        ) : (
                                            <button className="btn btn-success" onClick={nextStep}>
                                                Tiếp
                                            </button>
                                        )}
                                        {step === 2 ? <button className="btn btn-success">Lưu</button> : ""}
                                    </div>
                                </div>
                            </div>
                        </div> */}
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  const { customers, businessDepartments } = state.crm
  return { customers, businessDepartments }
}

const mapDispatchToProps = {
  getCustomers: CrmCustomerActions.getCustomers,
  createNewQuote: QuoteActions.createNewQuote,
  usePromotion: CrmCustomerActions.usePromotion
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(QuoteCreateForm))
