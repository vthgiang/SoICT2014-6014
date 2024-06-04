import React, {Component, useEffect, useState} from 'react'
import {connect} from 'react-redux'
import {withTranslate} from 'react-redux-multilingual'
import {GoodActions} from '@modules/production/common-production/good-management/redux/actions'
import {DiscountActions} from '@modules/production/order/discount/redux/actions'
import GoodSelected from './goodCreateSteps/goodSelected'
import '../order.css'

function OrderCreateGood(props) {
  const [state, setState] = useState({
    good: '',
    code: '',
    goodName: '',
    baseUnit: '',
    quantity: ''
  })

  useEffect(() => {
    props.getAllGoodsByType({type: 'product'})
  }, [])

  useEffect(() => {
    //Lấy số lượng hàng tồn kho cho các mặt hàng
    if (props.goods.goodItems.inventoryByGoodId !== state.inventory && state.good !== 'title') {
      setState({
        ...state,
        inventory: props.goods.goodItems.inventoryByGoodId
      })
    }
  }, [props.goods.goodItems.inventoryByGoodId])

  const validateGood = (value, willUpdateState = true) => {
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
          goodError: msg
        }
      })
    }
    return msg
  }

  const handleGoodChange = async (value) => {
    if (value !== 'title') {
      let {listGoodsByType} = props.goods
      const goodInfo = listGoodsByType.filter((item) => item._id === value[0])
      if (goodInfo.length) {
        await setState((state) => {
          return {
            ...state,
            good: goodInfo[0]._id,
            code: goodInfo[0].code,
            goodName: goodInfo[0].name,
            baseUnit: goodInfo[0].baseUnit,
            quantity: 0
          }
        })
      }

      await props.getItemsForGood(value[0])
    } else {
      setState((state) => {
        return {
          ...state,
          good: value[0],
          code: '',
          goodName: '',
          baseUnit: '',
          quantity: 0
        }
      })
    }

    validateGood(value, true)
  }

  const addGood = (good) => {
    let listGoods = props.listGoods
    if (!listGoods.find(item => item.good === good.good)) {
      listGoods.push(good)
    }
    props.setGoods(listGoods)
  }

  const deleteGood = (index) => {
    let listGoods = props.listGoods
    listGoods.splice(index, 1)
    props.setGoods(listGoods)
  }

  const validateQuantity = (value, willUpdateState = true) => {
    let msg = undefined
    if (!value) {
      msg = 'Giá trị không được để trống!'
    } else if (value <= 0) {
      msg = 'Số lượng phải lớn hơn 0'
    }

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          quantity: value,
          quantityError: msg
        }
      })
    }
    return msg
  }

  const handleQuantityChange = (e) => {
    let {value} = e.target
    if (value >= 0) {
      validateQuantity(value, true)
    }
  }


  let {
    good,
    code,
    goodName,
    pricePerBaseUnit,
    baseUnit,
    inventory,
    quantity,
    manufacturingWorks
  } = state

  let {goodError, pricePerBaseUnitError, quantityError} = state

  return (
    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
      <fieldset className="scheduler-border" style={{padding: 10}}>
        <legend className="scheduler-border">Chọn sản phẩm</legend>
        <div style={{padding: 10, backgroundColor: 'white', height: '100%'}}
             className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <GoodSelected
            good={good}
            code={code}
            goodName={goodName}
            pricePerBaseUnit={pricePerBaseUnit}
            baseUnit={baseUnit}
            inventory={inventory}
            quantity={quantity}
            manufacturingWorks={manufacturingWorks}
            handleGoodChange={handleGoodChange}
            handleQuantityChange={handleQuantityChange}
            addGood={addGood}
            //log error
            pricePerBaseUnitError={pricePerBaseUnitError}
            goodError={goodError}
            quantityError={quantityError}
          />
        </div>
      </fieldset>
      <fieldset className="scheduler-border" style={{padding: 10}}>
        <legend className="scheduler-border">Danh sách sản phẩm đã chọn</legend>
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <table className="table table-striped table-bordered table-hover">
            <thead>
            <tr>
              <th style={{width: '15%', textAlign: 'center'}}>Mã sản phẩm</th>
              <th style={{width: '30%', textAlign: 'center'}}>Tên sản phẩm</th>
              <th style={{width: '15%', textAlign: 'center'}}>Đơn vị tính</th>
              <th style={{width: '15%', textAlign: 'center'}}>Số lượng</th>
              <th style={{width: '10%', textAlign: 'center'}}>Thao tác</th>
            </tr>
            </thead>
            <tbody>
            {props.listGoods.map((good, index) => {
              return (
                <tr key={index}>
                  <td style={{textAlign: 'center'}}>{good.code}</td>
                  <td style={{textAlign: 'center'}}>{good.goodName}</td>
                  <td style={{textAlign: 'center'}}>{good.baseUnit}</td>
                  <td style={{textAlign: 'center'}}>{good.quantity}</td>
                  <td>
                    <a onClick={() => deleteGood(index)}><i className="fa fa-trash"
                                                                  style={{color: 'red', cursor: 'pointer'}}></i></a>
                  </td>
                </tr>
              )
            })}
            </tbody>
          </table>
        </div>
      </fieldset>
    </div>
  )
}

function mapStateToProps(state) {
  const {goods, discounts} = state
  return {goods, discounts}
}

const mapDispatchToProps = {
  getAllGoodsByType: GoodActions.getAllGoodsByType,
  getItemsForGood: GoodActions.getItemsForGood,
  getDiscountForOrderValue: DiscountActions.getDiscountForOrderValue
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(OrderCreateGood))
