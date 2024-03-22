import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal, formatDate } from '../../../../../../../common-components'
import { formatCurrency } from '../../../../../../../helpers/formatCurrency'
import { capitalize } from '../../../../../../../helpers/stringMethod'

function CreateDiscountsForOrder(props) {
  const getDiscountValue = (idCheckBox) => {
    const { listDiscountsByOrderValue } = props.discounts
    // let { listDiscountsByGoodId } = props.goods.goodItems;
    let { goodId } = props

    let hash = idCheckBox.split('-')
    let discountId = hash[0]
    let indexOfDiscounts = hash[1]

    let discount = listDiscountsByOrderValue.find((element) => element._id === discountId)
    let thresholdToBeApplied = discount.discounts[indexOfDiscounts]
    let discountChange = {
      _id: discount._id,
      code: discount.code,
      name: discount.name,
      formality: discount.formality,
      type: discount.type,
      effectiveDate: discount.effectiveDate,
      expirationDate: discount.expirationDate
    }
    switch (parseInt(discount.formality)) {
      case 0: //Khuyến mãi tiền mặt
        discountChange.discountedCash = thresholdToBeApplied.discountedCash
        break
      case 1: //Khuyến mãi %
        discountChange.discountedPercentage = thresholdToBeApplied.discountedPercentage
        break
      case 2: //Tặng xu tích điểm
        discountChange.loyaltyCoin = thresholdToBeApplied.loyaltyCoin
        break
      case 3: //Free ship
        discountChange.maximumFreeShippingCost = thresholdToBeApplied.maximumFreeShippingCost
        break
      case 4: //Tặng hàng
        discountChange.bonusGoods = thresholdToBeApplied.bonusGoods
        break
      case 5: //Áp dụng hàng tồn kho
        discountChange.discountOnGoods = thresholdToBeApplied.discountOnGoods.find((element) => goodId === element.good._id)
        break
      default:
        break
    }
    return discountChange
  }

  const handleDiscountChange = (e) => {
    let { discountsChecked } = props
    const { handleDiscountsChange } = props
    let { discountsProps } = props
    let { id, checked } = e.target

    if (checked === true) {
      let discountValue = getDiscountValue(id)
      discountsProps.push(discountValue)
      handleDiscountsChange(discountsProps)
    } else {
      let filterDiscountsProps = discountsProps.filter((element) => element._id !== id.split('-')[0]) //lọc phần tử có id ra khỏi state
      for (let key in discountsChecked) {
        //Lọc những discount cùng mức do bất đồng bộ chưa lọc được khi nhận discount props
        if (discountsChecked[`${key}`] === false) {
          filterDiscountsProps = filterDiscountsProps.filter((element) => element._id !== key.split('-')[0])
        }
      }
      handleDiscountsChange(filterDiscountsProps)
    }

    discountsChecked[`${id}`] = checked
    props.setDiscountsChecked(discountsChecked)
  }

  const getThresholdToBeAppliedTitle = (discount) => {
    let title = `Đơn hàng có giá trị từ ${
      discount.minimumThresholdToBeApplied >= 0 ? formatCurrency(discount.minimumThresholdToBeApplied) : ' 0 '
    }`
    if (discount.maximumThresholdToBeApplied) {
      title = title + ' đến ' + formatCurrency(discount.maximumThresholdToBeApplied)
    }
    return title
  }

  const getBonusGoodTitle = (bonusGoods) => {
    let dataMap = bonusGoods.map((item) => {
      return item.quantityOfBonusGood + ' ' + item.good.baseUnit + ' ' + item.good.name
    })
    return dataMap.join(', ')
  }

  const getDiscountOnGoodTitle = (discountOnGoods) => {
    const { goodId } = props
    let discount = discountOnGoods.find((element) => goodId === element.good._id)

    let title = `${discount.discountedPrice ? formatCurrency(discount.discountedPrice) : ''} (vnđ)/ ${discount.good.baseUnit} ${
      discount.expirationDate ? 'đối với sản phẩm có hạn sử dụng trước ngày ' + formatDate(discount.expirationDate) : ''
    }`

    return title
  }

  const getNameDiscountForGood = (formality, discount) => {
    let title = getThresholdToBeAppliedTitle(discount)

    switch (parseInt(formality)) {
      case 0:
        title = title + ` được khuyến mãi ${discount.discountedCash ? formatCurrency(discount.discountedCash) : ''} (vnđ)`
        break
      case 1:
        title = title + ` được giảm giá ${discount.discountedPercentage} (%)`
        break
      case 2:
        title = title + ` được tặng ${discount.loyaltyCoin ? formatCurrency(discount.loyaltyCoin) : ''} (xu)`
        break
      case 3:
        title =
          title +
          ` được miễn phí vận chuyển ${
            discount.maximumFreeShippingCost ? ', tối đa ' + formatCurrency(discount.maximumFreeShippingCost) : ''
          } (vnđ)`
        break
      case 4:
        title = title + ` được tặng ${discount.bonusGoods ? getBonusGoodTitle(discount.bonusGoods) : ''}`
        break
      case 5:
        title = title + `, giá sản phẩm chỉ còn ${discount.discountOnGoods ? getDiscountOnGoodTitle(discount.discountOnGoods) : ''}`
        break
      default:
        break
    }
    return capitalize(title)
  }

  const getDiscountOptions = (item) => {
    let { paymentAmount } = props
    let { discountsChecked } = props

    const { discounts, formality } = item
    return (
      <div style={{ paddingLeft: '2rem' }}>
        {discounts.map((discount, index) => {
          let disabled = false
          if (discount.minimumThresholdToBeApplied) {
            if (parseInt(paymentAmount) < discount.minimumThresholdToBeApplied) {
              disabled = true
            }
          }
          if (discount.maximumThresholdToBeApplied) {
            if (parseInt(paymentAmount) > discount.maximumThresholdToBeApplied) {
              disabled = true
            }
          }

          if (paymentAmount === undefined || paymentAmount === '' || paymentAmount === null) {
            disabled = true
          }

          if (disabled && discountsChecked[`${item._id}-${index}`]) {
            let e = {
              target: {
                id: `${item._id}-${index}`,
                checked: false
              }
            }
            handleDiscountChange(e) // unchecked các phần tử bị disable
          }

          return (
            <div className='form-check' style={{ display: 'flex', paddingTop: '10px' }}>
              <input
                type='checkbox'
                className={`form-check-input`}
                id={`${item._id}-${index}`}
                disabled={disabled}
                checked={discountsChecked[`${item._id}-${index}`]}
                onChange={handleDiscountChange}
                style={{ minWidth: '20px' }}
                key={index}
              />
              <label
                className={`form-check-label ${disabled ? 'text-muted' : 'text-success'}`}
                for={`${item._id}-${index}`}
                style={{ fontWeight: `${disabled ? 500 : 600}` }}
              >
                {getNameDiscountForGood(formality, discount)}
              </label>
            </div>
          )
        })}
      </div>
    )
  }
  const handleCustomerPromotionChange = (e) => {
    let { setCustomerPromotions } = props
    let { customerPromotions } = props
    let { id, checked } = e.target
    if (checked) {
      for (let i = 0; i < customerPromotions.length; i++) {
        customerPromotions[i].checked = false
        customerPromotions[i].disabled = true
      }
    } else {
      for (let i = 0; i < customerPromotions.length; i++) {
        customerPromotions[i].disabled = false
      }
    }
    let index = id.split('-')[2]
    customerPromotions[index].checked = checked
    customerPromotions[index].disabled = false
    setCustomerPromotions(customerPromotions)
  }

  const getDiscountCustomertOptions = () => {
    let { customerPromotions } = props
    let { paymentAmount } = props
    let { discountsChecked } = props
    const { setCustomerPromotions } = props
    // tạo giao diện
    return (
      <div style={{ paddingLeft: '2rem' }}>
        {customerPromotions.map((promo, index) => {
          let disabled = promo.disabled
          if (promo.minimumOrderValue) {
            if (parseInt(paymentAmount) < promo.minimumOrderValue) {
              disabled = true
              customerPromotions[index].disabled = true
              customerPromotions[index].checked = false
            }
          }
          if (paymentAmount === undefined || paymentAmount === '' || paymentAmount === null) {
            disabled = true
          }
          return (
            <div className='form-check' style={{ display: 'flex', paddingTop: '10px' }}>
              <input
                type='checkbox'
                className={`form-check-input`}
                id={`cus-promo-${index}`}
                disabled={disabled}
                checked={promo.checked}
                onChange={handleCustomerPromotionChange}
                style={{ minWidth: '20px' }}
                key={index}
              />
              <label
                className={`form-check-label ${disabled ? 'text-muted' : 'text-success'}`}
                for={`cus-promo-${index}`}
                style={{ fontWeight: `${disabled ? 500 : 600}` }}
              >
                {`Khuyến mãi ${promo.value}% cho đơn hàng từ ${promo.minimumOrderValue}, giảm tối đa ${promo.promotionalValueMax} (VNĐ)`}
              </label>
            </div>
          )
        })}
      </div>
    )
  }

  const { listDiscountsByOrderValue } = props.discounts
  return (
    <React.Fragment>
      <a
        style={{
          cursor: 'pointer'
        }}
        data-toggle='modal'
        data-backdrop='static'
        href={'#modal-add-quote-discount-for-order'}
      >
        Chọn khuyến mãi
      </a>
      <DialogModal
        modalID={`modal-add-quote-discount-for-order`}
        isLoading={false}
        title={'Chọn khuyến mãi'}
        hasSaveButton={false}
        hasNote={false}
        size='50'
        style={{ backgroundColor: 'green' }}
      >
        {!listDiscountsByOrderValue.length ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <i className='fa fa-frown-o text-warning' style={{ fontSize: '20px' }}></i> &ensp; <span>Không có khuyến mãi nào</span>
          </div>
        ) : (
          listDiscountsByOrderValue.map((item) => {
            return (
              <div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <i className='fa fa-gift text-warning'></i> &ensp; <strong>{item.name}</strong>
                </div>
                {getDiscountOptions(item)}
              </div>
            )
          })
        )}
        <div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <i className='fa fa-gift text-warning'></i> &ensp; <strong>Khuyến mãi của khách hàng</strong>
          </div>
          {getDiscountCustomertOptions()}
        </div>
      </DialogModal>
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  const { discounts } = state
  return { discounts }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateDiscountsForOrder))
