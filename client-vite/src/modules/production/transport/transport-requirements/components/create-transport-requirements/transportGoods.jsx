import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import { ButtonModal, DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../../../common-components'
import { withTranslate } from 'react-redux-multilingual'

import { GoodActions } from '../../../../common-production/good-management/redux/actions'

function TransportGoods(props) {
  const { goods, callBackState, translate } = props

  const [currentGood, setCurrentGood] = useState({})

  const [listAllGoods, setListAllGoods] = useState([])

  const [listGoodsChosen, setListGoodsChosen] = useState([])

  const [errorForm, setErrorForm] = useState({})
  let { errorGood } = errorForm

  useEffect(() => {
    props.getAllGoods()
    setCurrentGood({
      _id: '0',
      quantity: 1,
      currentSelectBoxGoodText: 'Chọn hàng hóa',
      volume: 1,
      weight: 1,
      idGoodSelectBox: '0'
    })
  }, [])

  useEffect(() => {
    setListAllGoods(props.listAllGoods)
  }, [props.listAllGoods])

  const getAllGoods = () => {
    let listGoods = [
      {
        value: '0',
        text: 'Chọn hàng hóa'
      }
    ]
    if (listAllGoods) {
      listAllGoods.map((item) => {
        listGoods.push({
          value: item._id,
          text: item.code + ' - ' + item.name
        })
      })
    }
    return listGoods
  }

  let handleGoodChange = (value) => {
    setErrorForm({
      ...errorForm,
      errorGood: null
    })
    if (value[0] !== '0' && listAllGoods) {
      let filterGood = listAllGoods.filter((r) => r._id === value[0])
      let currentGoodCode = '',
        currentGoodName = ''
      if (filterGood.length > 0) {
        currentGoodCode = filterGood[0].code ? filterGood[0].code : ''
        currentGoodName = filterGood[0].name ? filterGood[0].name : ''
      }
      const currentSelectBoxGoodText = currentGoodCode + ' - ' + currentGoodName
      setCurrentGood({
        ...currentGood,
        _id: value[0],
        name: currentGoodCode,
        code: currentGoodName,
        currentSelectBoxGoodText: currentSelectBoxGoodText,
        idGoodSelectBox: value[0]
      })
    } else {
      if (value[0] !== '0') {
        setCurrentGood({
          ...currentGood,
          idGoodSelectBox: value[0]
        })
      }
    }
  }
  const handleQuantityChange = (e) => {
    let { value } = e.target
    validateQuantityChange(value)
  }

  const validateQuantityChange = (value) => {
    let v = 1
    value = parseInt(value)
    if (value > 0) {
      v = parseInt(value)
    }
    setCurrentGood({
      ...currentGood,
      quantity: v
    })
  }

  const handleWeightChange = (e) => {
    let { value } = e.target
    validateWeightChange(value)
  }

  const validateWeightChange = (value) => {
    let v = 1
    value = parseInt(value)
    if (value > 0) {
      v = parseInt(value)
    }
    setCurrentGood({
      ...currentGood,
      weight: v
    })
  }

  const handleVolumeChange = (e) => {
    let { value } = e.target
    validateVolumeChange(value)
  }

  const validateVolumeChange = (value) => {
    let v = 1
    value = parseInt(value)
    if (value > 0) {
      v = parseInt(value)
    }
    setCurrentGood({
      ...currentGood,
      volume: v
    })
  }
  /**
   * Xử lý khi ấn nút thêm hàng hóa (set state listGoodsChosen để callback)
   */
  const handleAddGood = (e) => {
    e.preventDefault()
    console.log(currentGood)
    if (currentGood.idGoodSelectBox === '0') {
      setErrorForm({
        ...errorForm,
        errorGood: 'Chọn hàng hóa trước'
      })
      return
    }
    let currentListGoods = [...listGoodsChosen]
    let good = {
      _id: currentGood._id,
      code: currentGood.code ? currentGood.code : '',
      name: currentGood.name ? currentGood.name : '',
      quantity: currentGood.quantity,
      volume: currentGood.volume,
      payload: currentGood.weight
    }
    if (currentListGoods && currentListGoods.length !== 0) {
      let flag = false
      for (let i = 0; i < currentListGoods.length; i++) {
        if (String(currentListGoods[i]._id) === String(good._id)) {
          currentListGoods[i].quantity += good.quantity
          currentListGoods[i].payload += good.payload
          currentListGoods[i].volume += good.volume
          flag = true
          break
        }
      }
      if (!flag) {
        currentListGoods.push(good)
      }
      setListGoodsChosen(currentListGoods)
    } else {
      setListGoodsChosen([good])
    }
    // setListGoodsChosen(listGoodsChosen => [...listGoodsChosen, good]);
  }
  const handleDeleteGood = (good) => {
    let currentListGoods = [...listGoodsChosen]
    if (currentListGoods && currentListGoods.length !== 0) {
      let newListGoodsChosen = currentListGoods.filter((r) => String(r._id) !== String(good._id))
      setListGoodsChosen(newListGoodsChosen)
    }
  }
  useEffect(() => {
    if (goods && goods.length !== 0) {
      let goodList = []
      goods.map((good) => {
        goodList.push({
          _id: good?.good?._id,
          code: good?.good.code ? good.good.code : '',
          name: good?.good.name ? good?.good.name : '',
          quantity: good?.quantity,
          volume: good.volume ? good.volume : 10,
          payload: good.payload ? good.payload : 10
        })
      })
      setListGoodsChosen(goodList)
    }
  }, [goods])
  useEffect(() => {
    console.log(listGoodsChosen, ' danh sach hang hoa chon')
    callBackState(listGoodsChosen)
  }, [listGoodsChosen])

  return (
    <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
      <fieldset className='scheduler-border'>
        <legend className='scheduler-border'>{'Thông tin hàng hóa'}</legend>
        <div className='row'>
          <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
            <div className='row'>
              <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
                <div className={`form-group ${!errorGood ? '' : 'has-error'} `}>
                  <label>{'Chọn hàng hóa'}</label>
                  <span className='attention'> * </span>
                  <SelectBox
                    id={`select-good`}
                    className='form-control select2'
                    style={{ width: '100%' }}
                    value={currentGood._id}
                    items={getAllGoods()}
                    onChange={handleGoodChange}
                    multiple={false}
                  />
                  <ErrorLabel content={errorGood} />
                </div>
              </div>
              {/* <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group`}>
                                    <label>{translate("manufacturing.plan.quantity_good_inventory")}</label>
                                    <input type="number" value={good.inventory} disabled={true} className="form-control" />
                                </div>
                            </div> */}
              <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
                <div className={`form-group`}>
                  <label>{'Số lượng'}</label>
                  <input type='number' value={currentGood.quantity} onChange={handleQuantityChange} className='form-control' />
                  {/* <ErrorLabel content={errorQuantity} /> */}
                </div>
              </div>
            </div>
            <div className='row'>
              {/* <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group`}>
                                    <label>{translate("manufacturing.plan.base_unit")}</label>
                                    <input type="text" value={good.baseUnit} disabled={true} className="form-control" />
                                </div>
                            </div> */}
              <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
                <div className={`form-group`}>
                  <label>{'Khối lượng kg'}</label>
                  <input type='number' value={currentGood.weight} onChange={handleWeightChange} className='form-control' />
                  {/* <ErrorLabel content={errorQuantity} /> */}
                </div>
              </div>
              <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
                <div className={`form-group`}>
                  <label>{'Thể tích ' + ' \u33A5'}</label>
                  <input type='number' value={currentGood.volume} onChange={handleVolumeChange} className='form-control' />
                  {/* <ErrorLabel content={errorQuantity} /> */}
                </div>
              </div>
            </div>

            <div className='pull-right' style={{ marginBottom: '10px' }}>
              {/* {this.state.editGood ? ( */}
              {/* <React.Fragment>
                                        <button className="btn btn-success" 
                                        // onClick={this.handleCancelEditGood} 
                                        style={{ marginLeft: "10px" }}>
                                            {"cancel_editing_good"}
                                        </button>
                                        <button className="btn btn-success" 
                                        onClick={this.handleSaveEditGood} 
                                        style={{ marginLeft: "10px" }}>
                                            {"save_good"}
                                        </button>
                                    </React.Fragment> */}
              {/* ) : ( */}
              <button
                className='btn btn-success'
                style={{ marginLeft: '10px' }}
                // disabled={!this.isGoodValidated()}
                onClick={handleAddGood}
              >
                {'Thêm hàng hóa'}
              </button>
              {/* )}
                                <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={this.handleClearGood}>
                                    {translate("manufacturing.purchasing_request.delete_good")}
                                </button> */}
            </div>

            <table className='table table-striped'>
              <thead>
                <tr>
                  <th>{'Số thứ tự'}</th>
                  <th>{'Mã sản phẩm'}</th>
                  <th>{'Tên sản phẩm'}</th>
                  <th>{'Số lượng'}</th>
                  <th>{'Khối lượng'}</th>
                  <th>{'Thể tích'}</th>
                  <th>{'Hành động'}</th>
                  {/* <th>{translate("manufacturing.plan.base_unit")}</th>
                                    <th>{translate("manufacturing.plan.quantity_good_inventory")}</th>
                                    <th>{translate("manufacturing.plan.quantity")}</th>
                                    <th>{translate("table.action")}</th> */}
                </tr>
              </thead>
              <tbody>
                {listGoodsChosen && listGoodsChosen.length === 0 ? (
                  <tr>
                    {/* <td colSpan={7}>{translate("general.no_data")}</td> */}
                    <td colSpan={7}>{'Không có dữ liệu'}</td>
                  </tr>
                ) : (
                  listGoodsChosen.map((x, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{x.code}</td>
                      <td>{x.name}</td>
                      <td>{x.quantity}</td>
                      <td>{x.volume}</td>
                      <td>{x.payload}</td>
                      <td>
                        <a href='#abc' className='delete' title={translate('general.delete')} onClick={() => handleDeleteGood(x)}>
                          <i className='material-icons'></i>
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </fieldset>
    </div>
  )
}

function mapState(state) {
  const listAllGoods = state.goods.listALLGoods
  return { listAllGoods }
}

const actions = {
  getAllGoods: GoodActions.getAllGoods
}

const connectedTransportGoods = connect(mapState, actions)(withTranslate(TransportGoods))
export { connectedTransportGoods as TransportGoods }
