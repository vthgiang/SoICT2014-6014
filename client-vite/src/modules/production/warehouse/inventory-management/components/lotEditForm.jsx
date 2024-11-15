import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { LotActions } from '../redux/actions'
import { BinLocationActions } from '../../bin-location-management/redux/actions'

import { SelectBox, ErrorLabel, DialogModal } from '../../../../../common-components'
function LotEditForm(props) {
  const EMPTY_BIN = {
    binLocation: '',
    quantity: ''
  }

  const [state, setState] = useState({
    currentRole: localStorage.getItem('currentRole'),
    stocks: [],
    binLocations: [],
    binLocation: Object.assign({}, EMPTY_BIN),
    editInfo: false,
    quantity: 0,
    stock: '',
    stockOne: ''
  })

  useEffect(() => {
    const { id } = props
    props.getDetailLot(id)
  }, [])

  if (props.id !== state.id) {
    state.binLocation.binLocation = ''
    state.binLocation.quantity = ''
    setState({
      ...state,
      id: props.id,
      quantity: 0,
      stock: '',
      lot: props.lot,
      binLocations: [],
      stocks: props.lot.stocks,
      errorQuantity: undefined,
      errorBin: undefined
    })
  }

  const handleBinLocationChange = (value) => {
    let binLocation = value[0]
    validateBin(binLocation, true)
  }

  const validateBin = async (value, willUpdateState = true) => {
    const dataBins = await getAllBins()

    let msg = undefined
    const { translate } = props
    let { binLocation } = state
    if (!value) {
      msg = translate('manage_warehouse.category_management.validate_name')
    }
    if (willUpdateState) {
      let binName = dataBins.find((x) => x.value === value)
      binLocation.binLocation = { _id: value, path: binName.text, capacity: binName.capacity, contained: binName.contained }
      await setState({
        ...state,
        binLocation: { ...binLocation },
        errorBin: msg
      })
    }
    return msg === undefined
  }

  const handleQuantityChange = (e) => {
    let value = e.target.value
    validateQuantity(value, true)
  }

  const validateQuantity = (value, willUpdateState = true) => {
    const { quantity, binLocations, binLocation } = state
    let msg = undefined
    const { translate } = props
    let binArr = []
    let totalQuantity = 0

    if (binLocations && binLocations.length) {
      binArr = binLocations.filter((x) => x.binLocation._id !== binLocation.binLocation._id)
    }

    if (binArr.length) {
      for (let i = 0; i < binArr.length; i++) {
        totalQuantity = Number(totalQuantity) + Number(binArr[i].quantity)
      }
    }

    let total = totalQuantity
    if (Number(value) > 0) {
      total = Number(total) + Number(value)
    }

    if (total > quantity) {
      msg = ` ${translate('manage_warehouse.inventory_management.validate_total')} (${quantity}) `
    }

    if (!value) {
      msg = translate('manage_warehouse.inventory_management.validate_number')
    }

    if (value > binLocation.binLocation.capacity) {
      msg = ` ${translate('manage_warehouse.inventory_management.number_over_norm')} (${binLocation.binLocation.capacity}) `
    }
    if (binLocation.binLocation.contained !== null) {
      if (Number(value) > Number(binLocation.binLocation.capacity) - Number(binLocation.binLocation.contained)) {
        msg = ` ${translate('manage_warehouse.inventory_management.bin_contained')} ${Number(binLocation.binLocation.capacity) - Number(binLocation.binLocation.contained)} `
      }
    }

    if (willUpdateState) {
      state.binLocation.quantity = value
      setState({
        ...state,
        errorQuantity: msg
      })
    }
    return msg === undefined
  }

  const isBinLocationsValidated = () => {
    let result = validateBin(state.binLocation.binLocation, false) && validateQuantity(state.binLocation.quantity, false)
    return result
  }

  const handleAddBinLocation = async (e) => {
    const { indexStock, stockOne } = state
    e.preventDefault()
    let binLocations = [...state.binLocations, state.binLocation]
    state.stockOne.binLocations = binLocations
    state.stocks[indexStock] = stockOne
    await setState({
      ...state,
      binLocations: binLocations,
      binLocation: Object.assign({}, EMPTY_BIN)
    })
  }

  const handleClearBinLocation = (e) => {
    e.preventDefault()
    setState({
      ...state,
      binLocation: Object.assign({}, EMPTY_BIN),
      errorQuantity: undefined,
      errorBin: undefined
    })
  }

  const handleEditBinLocation = (binLocation, index) => {
    setState({
      ...state,
      editInfo: true,
      indexInfo: index,
      binLocation: Object.assign({}, binLocation)
    })
  }

  const handleSaveEditBinLocation = async (e) => {
    e.preventDefault()
    const { indexInfo, binLocations, stockOne, indexStock } = state
    let newBinLocations
    if (binLocations) {
      newBinLocations = binLocations.map((item, index) => {
        return index === indexInfo ? state.binLocation : item
      })
    }
    state.stockOne.binLocations = newBinLocations
    state.stocks[indexStock] = stockOne

    await setState({
      ...state,
      editInfo: false,
      binLocations: newBinLocations,
      binLocation: Object.assign({}, EMPTY_BIN)
    })
  }

  const handleCancelEditBinLocation = (e) => {
    e.preventDefault()
    setState({
      ...state,
      editInfo: false,
      binLocation: Object.assign({}, EMPTY_BIN),
      errorQuantity: undefined,
      errorBin: undefined
    })
  }

  const handleDeleteBinLocation = (index) => {
    const { binLocations, indexStock, stockOne } = state
    let newBinLocations
    if (binLocations) {
      newBinLocations = binLocations.filter((item, x) => index !== x)
    }

    state.stockOne.binLocations = newBinLocations
    state.stocks[indexStock] = stockOne

    setState({
      ...state,
      binLocations: newBinLocations
    })
  }

  const handleStockChange = async (value) => {
    if (value[0]) {
      const { stocks } = state
      const array = getAllStocks()

      let stock = value[0]
      let indexStock
      for (let i = 0; i < stocks.length; i++) {
        if (stock === stocks[i].stock._id) {
          indexStock = i
        }
      }
      let data = array.filter((x) => x.value === stock)
      let quantity = data[0].quantity
      let binLocations = data[0].binLocations
      setState({
        ...state,
        indexStock,
        stockOne: stocks[indexStock],
        stock: value[0],
        quantity: quantity,
        binLocations: binLocations,
        binLocation: Object.assign({}, EMPTY_BIN),
        errorQuantity: undefined,
        errorBin: undefined
      })
      await props.getChildBinLocations({ stock: stock, managementLocation: state.currentRole })
    } else {
      setState({
        ...state,
        stock: value[0],
        quantity: 0,
        binLocations: [],
        binLocation: Object.assign({}, EMPTY_BIN),
        errorQuantity: undefined,
        errorBin: undefined
      })
    }
  }

  const save = async () => {
    const { id, stocks } = state
    await props.editLot(id, {
      stocks: stocks
    })
  }

  const getAllStocks = () => {
    const { lot, translate, stocks } = props
    if (lot) {
      state.stocks = lot.stocks
    }
    let stockArr = [{ value: '', text: translate('manage_warehouse.inventory_management.choose_stock') }]

    if (lot) {
      lot.stocks.map((x) => {
        if (stocks.listStocks.length > 0) {
          for (let i = 0; i < stocks.listStocks.length; i++) {
            if (x.stock._id === stocks.listStocks[i]._id) {
              stockArr.push({
                value: x.stock._id,
                text: x.stock.name,
                quantity: x.quantity,
                binLocations: x.binLocations
              })
            }
          }
        }
      })
    }
    return stockArr
  }

  const getAllBins = () => {
    const { binLocations, translate, lot } = props
    let binArr = [{ value: '', text: translate('manage_warehouse.inventory_management.choose_bin') }]
    if (binLocations.listBinLocation.length > 0 && lot) {
      for (let i = 0; i < binLocations.listBinLocation.length; i++) {
        if (binLocations.listBinLocation[i].status == '1' || binLocations.listBinLocation[i].status == '2') {
          let check = 0
          let capacity = 0
          let contained = 0
          for (let j = 0; j < binLocations.listBinLocation[i].enableGoods.length; j++) {
            if (binLocations.listBinLocation[i].enableGoods[j].good._id === lot.good._id) {
              capacity = binLocations.listBinLocation[i].enableGoods[j].capacity
                ? binLocations.listBinLocation[i].enableGoods[j].capacity
                : 0
              contained =
                binLocations.listBinLocation[i].enableGoods[j].contained !== undefined
                  ? binLocations.listBinLocation[i].enableGoods[j].contained
                  : 0
              check = 1
              break
            }
          }
          if (check === 1) {
            // let checkBin = 0;
            // if(state.binLocations.length) {
            //     for( let k = 0; k < state.binLocations.length; k++ ) {
            //         if(state.binLocations[k].binLocation._id === binLocations.listBinLocation[i]._id){
            //             checkBin = 1;
            //             break;
            //         }
            //     }
            // }
            // if(checkBin === 0){
            //     binArr.push({ value: binLocations.listBinLocation[i]._id, text: binLocations.listBinLocation[i].path, capacity: capacity });
            // }
            binArr.push({
              value: binLocations.listBinLocation[i]._id,
              text: binLocations.listBinLocation[i].path,
              capacity: capacity,
              contained: contained
            })
          }
        }
      }
    }
    return binArr
  }

  const isFormValidated = () => {
    const { quantity } = state
    let number = 0
    if (state.binLocations && state.binLocations.length > 0) {
      for (let i = 0; i < state.binLocations.length; i++) {
        number += Number(state.binLocations[i].quantity)
      }
    }

    let difference = Number(quantity) - Number(number)
    if (difference == 0) {
      return true
    }
    return false
  }

  const { translate, binLocations, lots } = props
  const { stock, quantity, errorBin, binLocation, errorQuantity } = state
  const dataStocks = getAllStocks()
  const dataBins = getAllBins()
  let number = 0
  if (state.binLocations && state.binLocations.length > 0) {
    for (let i = 0; i < state.binLocations.length; i++) {
      number += Number(state.binLocations[i].quantity)
    }
  }

  let difference = Number(quantity) - Number(number)

  return (
    <React.Fragment>
      <DialogModal
        modalID={`modal-edit-lot`}
        isLoading={binLocations.isLoading}
        formID={`form-edit-lot`}
        title={translate('manage_warehouse.inventory_management.edit_title')}
        msg_success={translate('manage_warehouse.inventory_management.edit_success')}
        msg_failure={translate('manage_warehouse.inventory_management.edit_faile')}
        disableSubmit={!isFormValidated()}
        func={save}
        size={75}
      >
        <form id={`form-edit-lot`}>
          <div className='row'>
            <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
              <strong>Những kho đang chứa lô hàng {lots.lotDetail.code}</strong>
              <div className='box-body'>
                {lots.lotDetail.stocks !== undefined && lots.lotDetail.stocks.length > 0
                  ? lots.lotDetail.stocks.map((x, index) => (
                      <ul className='todo-list' key={index}>
                        <li>
                          <span className='text'>
                            <a href='/stock-management'>Kho {x.stock.name}</a>
                          </span>
                          <span className='label label-info' style={{ fontSize: '11px' }}>
                            {x.quantity} {lots.lotDetail.good.baseUnit}
                          </span>
                        </li>
                      </ul>
                    ))
                  : []}
              </div>
            </div>
            <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
              <div className={`form-group`}>
                <label>
                  {translate('manage_warehouse.inventory_management.stock')}
                  <span className='attention'> * </span>
                </label>
                <SelectBox
                  id={`select-lot-edit`}
                  className='form-control select2'
                  style={{ width: '100%' }}
                  value={stock ? stock : { value: '', text: translate('manage_warehouse.inventory_management.choose_stock') }}
                  items={dataStocks}
                  onChange={handleStockChange}
                  multiple={false}
                />
              </div>
            </div>
            <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
              <div className='form-group'>
                <label>{translate('manage_warehouse.inventory_management.number')}</label>
                <input type='number' className='form-control' value={quantity} disabled />
              </div>
            </div>
            <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
              <fieldset className='scheduler-border'>
                <legend className='scheduler-border'>{translate('manage_warehouse.inventory_management.bin_location')}</legend>
                {stock ? (
                  difference !== 0 ? (
                    <div
                      className='form-group'
                      style={{ color: 'red', textAlign: 'center' }}
                    >{`Bạn còn ${difference} số lượng chưa sắp xếp vào kho`}</div>
                  ) : (
                    <div className='form-group' style={{ color: 'green', textAlign: 'center' }}>
                      Bạn đã xếp hết lô hàng vào kho
                    </div>
                  )
                ) : (
                  []
                )}
                <div className={`form-group ${!errorBin ? '' : 'has-error'}`}>
                  <label>{translate('manage_warehouse.inventory_management.archive')}</label>
                  <SelectBox
                    id={`select-archive-by-bin-edit`}
                    className='form-control select2'
                    style={{ width: '100%' }}
                    value={
                      binLocation.binLocation
                        ? binLocation.binLocation._id
                        : { value: '', text: translate('manage_warehouse.inventory_management.choose_bin') }
                    }
                    items={dataBins}
                    onChange={handleBinLocationChange}
                    multiple={false}
                  />
                  <ErrorLabel content={errorBin} />
                </div>
                <div className={`form-group ${!errorQuantity ? '' : 'has-error'}`}>
                  <label className='control-label'>{translate('manage_warehouse.inventory_management.number')}</label>
                  <div>
                    <input
                      type='number'
                      className='form-control'
                      value={binLocation.quantity}
                      placeholder={translate('manage_warehouse.good_management.max_quantity')}
                      onChange={handleQuantityChange}
                    />
                  </div>
                  <ErrorLabel content={errorQuantity} />
                </div>

                <div className='pull-right' style={{ marginBottom: '10px' }}>
                  {state.editInfo ? (
                    <React.Fragment>
                      <button className='btn btn-success' onClick={handleCancelEditBinLocation} style={{ marginLeft: '10px' }}>
                        {translate('task_template.cancel_editing')}
                      </button>
                      <button
                        className='btn btn-success'
                        disabled={!isBinLocationsValidated()}
                        onClick={handleSaveEditBinLocation}
                        style={{ marginLeft: '10px' }}
                      >
                        {translate('task_template.save')}
                      </button>
                    </React.Fragment>
                  ) : (
                    <button
                      className='btn btn-success'
                      style={{ marginLeft: '10px' }}
                      disabled={!isBinLocationsValidated()}
                      onClick={handleAddBinLocation}
                    >
                      {translate('task_template.add')}
                    </button>
                  )}
                  <button className='btn btn-primary' style={{ marginLeft: '10px' }} onClick={handleClearBinLocation}>
                    {translate('task_template.delete')}
                  </button>
                </div>

                <table className='table table-bordered'>
                  <thead>
                    <tr>
                      <th title={translate('manage_warehouse.inventory_management.archive')}>
                        {translate('manage_warehouse.inventory_management.archive')}
                      </th>
                      <th title={translate('manage_warehouse.inventory_management.number')}>
                        {translate('manage_warehouse.inventory_management.number')}
                      </th>
                      <th>{translate('task_template.action')}</th>
                    </tr>
                  </thead>
                  <tbody id={`good-manage-by-stock`}>
                    {typeof state.binLocations === 'undefined' || state.binLocations.length === 0 ? (
                      <tr>
                        <td colSpan={3}>
                          <center>{translate('task_template.no_data')}</center>
                        </td>
                      </tr>
                    ) : (
                      state.binLocations.map((x, index) => (
                        <tr key={index}>
                          <td>{x.binLocation.path}</td>
                          <td>{x.quantity}</td>
                          <td>
                            <a
                              href='#abc'
                              className='edit'
                              title={translate('general.edit')}
                              onClick={() => handleEditBinLocation(x, index)}
                            >
                              <i className='material-icons'></i>
                            </a>
                            <a
                              href='#abc'
                              className='delete'
                              title={translate('general.delete')}
                              onClick={() => handleDeleteBinLocation(index)}
                            >
                              <i className='material-icons'></i>
                            </a>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </fieldset>
            </div>
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {
  editLot: LotActions.editLot,
  getChildBinLocations: BinLocationActions.getChildBinLocations,
  getDetailLot: LotActions.getDetailLot
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(LotEditForm))
