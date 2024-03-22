import React, { Component, useEffect, useState } from 'react'
import { DialogModal, ErrorLabel, SelectBox, DatePicker } from '../../../../../common-components'
import { connect } from 'react-redux'
import { formatToTimeZoneDate } from '../../../../../helpers/formatDate'
import { formatDate } from '../../../../../helpers/formatDate'
import { withTranslate } from 'react-redux-multilingual'

//lỗi 2 lần edit liên tiếp
function CreateBonusGoods(props) {
  let EMPTY_GOOD = {
    goodId: '1',
    goodObject: '',
    quantityOfBonusGood: '',
    expirationDateOfGoodBonus: ''
  }

  const [state, setState] = useState({
    good: Object.assign({}, EMPTY_GOOD),
    goodOptions: [],
    listGoods: [],
    editState: true
  })

  if (props.discountType !== state.discountType || props.formality !== state.formality) {
    setState((state) => {
      return {
        ...state,
        goodOptions: [],
        listGoods: [],
        good: {
          goodId: '1',
          goodObject: '',
          quantityOfBonusGood: '',
          expirationDateOfGoodBonus: ''
        },
        discountType: props.discountType,
        formality: props.formality
      }
    })
  }

  useEffect(() => {
    let enableIndexEdit = props.indexEdittingDiscount || state.discountCode !== props.discountCode
    let bonusGoodsIsNotNull = props.bonusGoods && props.bonusGoods.length

    if (props.editDiscountDetail && enableIndexEdit && bonusGoodsIsNotNull) {
      let { listGoods, goodOptions } = state
      goodOptions = []
      listGoods = []
      // Lấy các thông tin của good đưa vào goodObject va day good vao listGoods
      const { goods } = props
      const { listGoodsByType } = goods
      listGoods = props.bonusGoods.map((item) => {
        let good = {}
        let goodArrFilter = listGoodsByType.filter((x) => x._id === item.good._id)
        if (goodArrFilter) {
          good.goodObject = goodArrFilter[0]
          good.goodId = item.good._id
          good.quantityOfBonusGood = item.quantityOfBonusGood
          good.expirationDateOfGoodBonus = formatDate(item.expirationDateOfGoodBonus)
          good.baseUnit = item.baseUnit
        }

        // filter good ra khoi getAllGoods() va gan state vao goodOption
        if (goodOptions.length === 0) {
          goodOptions = getAllGoods().filter((x) => x.value !== good.goodId)
        } else {
          // Nếu state đang là goodOptions thi vẫn phải filter những thằng còn lại
          goodOptions = goodOptions.filter((x) => x.value !== item.good._id)
        }
        return good
      })

      // Cập nhật lại good state
      setState((state) => ({
        ...state,
        listGoods: [...listGoods],
        goodOptions: [...goodOptions],
        editState: false,
        discountCode: props.discountCode
      }))
    }
  }, [props.discountCode])

  const getAllGoods = () => {
    const { translate, goods } = props
    let listGoods = [
      {
        value: '1',
        text: '---Chọn các mặt hàng---'
      }
    ]

    const { listGoodsByType } = goods

    if (listGoodsByType) {
      listGoodsByType.map((item) => {
        listGoods.push({
          value: item._id,
          text: item.code + '-' + item.name
        })
      })
    }

    return listGoods
  }

  const handleGoodChange = (value) => {
    const goodId = value[0]
    validateGoodChange(goodId, true)
  }

  const validateGoodChange = (value, willUpdateState = true) => {
    let msg = undefined
    const { translate } = props
    if (value === '1') {
      msg = 'Vui lòng không chọn mặt hàng này'
    }

    if (willUpdateState) {
      let { good } = state

      good.goodId = value

      const { goods } = props
      const { listGoodsByType } = goods
      let goodArrFilter = listGoodsByType.filter((x) => x._id === good.goodId)
      if (goodArrFilter) {
        good.goodObject = goodArrFilter[0]
      }

      setState((state) => ({
        ...state,
        good: { ...good },
        goodError: msg
      }))
    }
    return msg
  }

  const handleClearGood = async (e) => {
    e.preventDefault()

    await setState((state) => {
      return {
        ...state,
        good: Object.assign({}, EMPTY_GOOD)
      }
    })
  }

  const handleQuantityOfBonusGood = (e) => {
    let { value } = e.target
    validateQuantityChange(value, true)
  }

  const validateQuantityChange = (value, willUpdateState = true) => {
    let msg = undefined
    const { translate } = props
    if (value === '') {
      msg = 'Giá trị không được để trống'
    } else if (value < 1) {
      msg = 'Số lượng phải lớn hơn 0'
    }
    if (willUpdateState) {
      let { good } = state
      good.quantityOfBonusGood = value
      setState((state) => ({
        ...state,
        good: { ...good },
        quantityOfBonusGoodError: msg
      }))
    }
    return msg
  }

  const handleChangeExpirationDate = (value) => {
    if (!value) {
      value = null
    }
    let { good } = state
    good.expirationDateOfGoodBonus = value
    setState({
      ...state,
      good: { ...good }
    })
  }

  const handleAddGood = (e) => {
    e.preventDefault()
    let { listGoods, good } = state
    // Lấy các thông tin của good đưa vào goodObject va day good vao listGoods
    const { goods } = props
    const { listGoodsByType } = goods
    let goodArrFilter = listGoodsByType.filter((x) => x._id === good.goodId)
    if (goodArrFilter) {
      good.goodObject = goodArrFilter[0]
    }

    listGoods.push(good)

    // filter good ra khoi getAllGoods() va gan state vao goodOption
    let { goodOptions } = state
    if (goodOptions.length === 0) {
      goodOptions = getAllGoods().filter((x) => x.value !== good.goodId)
    } else {
      // Nếu state đang là goodOptions thi vẫn phải filter những thằng còn lại
      goodOptions = goodOptions.filter((x) => x.value !== good.goodId)
    }

    // Cập nhật lại good state

    good = Object.assign({}, EMPTY_GOOD)

    setState((state) => ({
      ...state,
      listGoods: [...listGoods],
      goodOptions: [...goodOptions],
      good: { ...good }
    }))
  }

  //DELETE AND EDIT
  const handleDeleteGood = (good, index) => {
    let { listGoods, goodOptions } = state
    // Loại bỏ phần tử good ra khỏi listGoods
    listGoods.splice(index, 1)

    setState((state) => ({
      ...state,
      listGoods: [...listGoods],
      goodOptions: [
        ...goodOptions,
        {
          value: good.goodId,
          text: good.goodObject.code + ' - ' + good.goodObject.name
        }
      ]
    }))
  }

  const handleEditGood = (good, index) => {
    let { goodOptions } = state
    setState({
      ...state,
      editGood: true,
      good: { ...good },
      goodOptions: [
        ...goodOptions,
        {
          value: good.goodId,
          text: good.goodObject.code + ' - ' + good.goodObject.name
        }
      ],
      indexEditting: index
    })
  }

  const handleCancelEditGood = (e) => {
    e.preventDefault()
    let { listGoods, indexEditting, goodOptions } = state
    goodOptions = goodOptions.filter((x) => x.value !== listGoods[indexEditting].goodId)
    setState({
      ...state,
      editGood: false,
      good: Object.assign({}, EMPTY_GOOD),
      goodOptions: goodOptions
    })
  }

  const handleSaveEditGood = () => {
    let { listGoods, good, indexEditting, goodOptions } = state
    goodOptions = goodOptions.filter((x) => x.value !== good.goodId)
    listGoods[indexEditting] = state.good
    setState({
      ...state,
      editGood: false,
      good: Object.assign({}, EMPTY_GOOD),
      goodOptions: goodOptions,
      listGoods: [...listGoods]
    })
  }

  const submitChange = () => {
    let { listGoods } = state
    let dataSubmit = listGoods.map((good) => {
      return {
        good: {
          _id: good.goodId,
          name: good.goodObject.name,
          code: good.goodObject.code,
          baseUnit: good.goodObject.baseUnit
        },
        expirationDateOfGoodBonus: good.expirationDateOfGoodBonus,
        quantityOfBonusGood: good.quantityOfBonusGood
      }
    })

    props.handleSubmitBonusGoods(dataSubmit)
    setState({
      ...state,
      listGoods: [],
      goodOptions: []
    })
  }

  const isGoodValidated = () => {
    if (validateGoodChange(state.good.goodId, false) || validateQuantityChange(state.good.quantityOfBonusGood, false)) {
      return false
    }
    return true
  }

  const isFormValidated = () => {
    const { listGoods } = state
    if (listGoods.length === 0) {
      return false
    }
    return true
  }

  const { translate } = props
  const { actionType } = props
  const { goodOptions, good, listGoods, quantityOfBonusGoodError } = state
  const { goodId, expirationDateOfGoodBonus, quantityOfBonusGood, baseUnit } = good
  return (
    <DialogModal
      modalID={`modal-${actionType}-discount-bonus-goods`}
      isLoading={false}
      formID={`form-${actionType}-discount-bonus-goods`}
      title={'Các mặt hàng được tặng'}
      size='75'
      style={{ backgroundColor: 'green' }}
      func={submitChange}
      disableSubmit={!isFormValidated()}
    >
      <form id={`form-${actionType}-discount-bonus-goods`}>
        <fieldset className='scheduler-border'>
          <legend className='scheduler-border'>Thêm hàng tặng kèm</legend>
          <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
            <div className={`form-group`}>
              <label className='control-label'>
                Chọn hàng tặng kèm <span className='attention'> * </span>
              </label>
              <SelectBox
                id={`select-${actionType}-discount-bonus-goods`}
                className='form-control select2'
                style={{ width: '100%' }}
                value={goodId}
                items={goodOptions.length ? goodOptions : getAllGoods()}
                onChange={handleGoodChange}
                multiple={false}
              />
            </div>
          </div>
          <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
            <div className='form-group'>
              <label>Hạn sử dụng của hàng tặng</label>
              <DatePicker
                id={`date_picker_${actionType}_discount_expirationDateOfGoodBonus`}
                value={expirationDateOfGoodBonus}
                onChange={handleChangeExpirationDate}
                disabled={false}
              />
            </div>
          </div>
          <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
            <div className={`form-group `}>
              <label className='control-label'>Đơn vị tính</label>
              <div>
                <input type='text' className='form-control' value={good.goodId !== '1' ? good.goodObject.baseUnit : ''} disabled='true' />
              </div>
            </div>
          </div>
          <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
            <div className={`form-group ${!quantityOfBonusGoodError ? '' : 'has-error'}`}>
              <label className='control-label'>
                Số lượng <span className='attention'> * </span>
              </label>
              <div>
                <input
                  type='number'
                  className='form-control'
                  placeholder={'vd: 5'}
                  value={quantityOfBonusGood}
                  onChange={handleQuantityOfBonusGood}
                />
              </div>
              <ErrorLabel content={quantityOfBonusGoodError} />
            </div>
          </div>

          <div className='pull-right' style={{ marginBottom: '10px' }}>
            {state.editGood ? (
              <React.Fragment>
                <button className='btn btn-success' onClick={handleCancelEditGood} style={{ marginLeft: '10px' }}>
                  Hủy chỉnh sửa
                </button>
                <button
                  className='btn btn-success'
                  disabled={!isGoodValidated()}
                  onClick={handleSaveEditGood}
                  style={{ marginLeft: '10px' }}
                >
                  Lưu
                </button>
              </React.Fragment>
            ) : (
              <button className='btn btn-success' style={{ marginLeft: '10px' }} disabled={!isGoodValidated()} onClick={handleAddGood}>
                Thêm
              </button>
            )}
            <button className='btn btn-primary' style={{ marginLeft: '10px' }} onClick={handleClearGood}>
              Xóa trắng
            </button>
          </div>
        </fieldset>
        <table className='table table-striped'>
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã mặt hàng</th>
              <th>Tên mặt hàng</th>
              <th>Hạn sử dụng</th>
              <th>Đơn vị tính</th>
              <th>Số lượg</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {!listGoods || listGoods.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <center>Chưa có dữ liệu</center>
                </td>
              </tr>
            ) : (
              listGoods.map((good, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{good.goodObject.code}</td>
                    <td>{good.goodObject.name}</td>
                    <td>{good.expirationDateOfGoodBonus}</td>
                    <td>{good.goodObject.baseUnit}</td>
                    <td>{good.quantityOfBonusGood}</td>
                    <td>
                      <a href='#abc' className='edit' title='Sửa' onClick={() => handleEditGood(good, index)}>
                        <i className='material-icons'>edit</i>
                      </a>
                      <a href='#abc' className='delete' title='Xóa' onClick={() => handleDeleteGood(good, index)}>
                        <i className='material-icons'>delete</i>
                      </a>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </form>
    </DialogModal>
  )
}

function mapStateToProps(state) {
  const { goods } = state
  return { goods }
}

export default connect(mapStateToProps, null)(withTranslate(CreateBonusGoods))
