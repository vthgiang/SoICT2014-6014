import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import { ErrorLabel, SelectBox } from '../../../../../common-components'
import { GoodActions } from '../../good-management/redux/actions'

function GoodComponentRequest(props) {
  const EMPTY_GOOD = {
    goodId: '1',
    goodObject: '',
    quantity: '',
    baseUnit: '',
    type: '0'
  }

  const [state, setState] = useState({
    listGoodsByType: [],
    good: Object.assign({}, EMPTY_GOOD),
    editGood: false,
    indexEditting: ''
  })

  // phần hàng hóa

  const getType = () => {
    let typeArr = []
    typeArr = [
      { value: '0', text: '---Loại hàng hóa---' },
      { value: '1', text: 'Nguyên vật liệu' },
      { value: '2', text: 'Thành phẩm' },
      { value: '3', text: 'Công cụ dụng cụ' },
      { value: '4', text: 'Phế phẩm' }
    ]
    return typeArr
  }

  const handleTypeChange = async (value) => {
    let type = value[0]
    switch (type) {
      case '1':
        await props.getGoodsByType({ type: 'material' })
        break
      case '2':
        await props.getGoodsByType({ type: 'product' })
        break
      case '3':
        await props.getGoodsByType({ type: 'equipment' })
        break
      case '4':
        await props.getGoodsByType({ type: 'waste' })
        break
    }
    validateType(type, true)
  }

  const validateType = (value, willUpdateState = true) => {
    let msg = undefined
    const { translate } = props
    if (value == '0') {
      msg = translate('manage_warehouse.bill_management.validate_type')
    }
    if (willUpdateState) {
      good.type = value
      good.baseUnit = ''
      good.quantity = ''
      setState({
        ...state,
        good: { ...good },
        errorType: msg
      })
    }
    return msg === undefined
  }

  const getAllGoods = () => {
    const { translate, goods } = props
    let listGoodsByType = [
      {
        value: '1',
        text: translate('production.request_management.choose_good')
      }
    ]
    const { listGoods } = goods

    if (listGoods) {
      listGoods.map((item) => {
        listGoodsByType.push({
          value: item._id,
          text: item.code + ' - ' + item.name
        })
      })
    }
    return listGoodsByType
  }

  const handleGoodChange = (value) => {
    const goodId = value[0]
    validateGoodChange(goodId, true)
  }

  const validateGoodChange = (value, willUpdateState = true) => {
    let msg = undefined
    const { translate } = props
    if (value === '1') {
      msg = translate('production.request_management.error_good')
    }

    if (willUpdateState) {
      let { good } = state

      good.goodId = value
      const { goods } = props
      const { listGoods } = goods
      let goodArrFilter = listGoods.filter((x) => x._id === good.goodId)
      if (goodArrFilter) {
        good.goodObject = goodArrFilter[0]
        good.baseUnit = goodArrFilter[0].baseUnit
      }
      setState({
        ...state,
        good: { ...good },
        errorGood: msg
      })
    }
    return msg
  }

  const handleQuantityChange = (e) => {
    let { value } = e.target
    validateQuantityChange(value, true)
  }

  const validateQuantityChange = (value, willUpdateState = true) => {
    let msg = undefined
    const { translate } = props
    if (value === '') {
      msg = translate('production.request_management.error_quantity')
    }
    if (value < 1) {
      msg = translate('production.request_management.error_quantity_input')
    }
    if (willUpdateState) {
      let { good } = state
      good.quantity = value
      setState({
        ...state,
        good: { ...good },
        errorQuantity: msg
      })
    }
    return msg
  }

  const isGoodValidated = () => {
    if (validateGoodChange(state.good.goodId, false) || validateQuantityChange(state.good.quantity, false)) {
      return false
    }
    return true
  }

  const handleClearGood = () => {
    setState({
      ...state,
      good: Object.assign({}, EMPTY_GOOD)
    })
  }

  const handleAddGood = () => {
    let { listGoodsByType, good } = state
    // Lấy các thông tin của good đưa vào goodObject va day good vao listGoods
    const { goods } = props
    const { listGoods } = goods
    let goodArrFilter = listGoods.filter((x) => x._id === good.goodId)
    if (goodArrFilter) {
      good.goodObject = goodArrFilter[0]
    }
    listGoodsByType.push(good)
    // Cập nhật lại good state
    setState({
      ...state,
      listGoodsByType: [...listGoodsByType],
      good: Object.assign({}, EMPTY_GOOD)
    })
    props.onHandleGoodChange(listGoodsByType)
  }

  const handleDeleteGood = (good, index) => {
    let { listGoodsByType } = state
    // Loại bỏ phần tử good ra khỏi listGoodsByType
    listGoodsByType.splice(index, 1)

    setState({
      ...state,
      listGoodsByType: [...listGoodsByType]
    })
    props.onHandleGoodChange(listGoodsByType)
  }

  const handleEditGood = (good, index) => {
    let type = ''
    switch (good.goodObject.type) {
      case 'material':
        type = '1'
        break
      case 'product':
        type = '2'
        break
      case 'equipment':
        type = '3'
        break
      case 'waste':
        type = '4'
        break
    }
    good.type = type
    setState({
      ...state,
      editGood: true,
      good: { ...good },
      indexEditting: index
    })
  }

  const handleCancelEditGood = (e) => {
    e.preventDefault()
    setState({
      ...state,
      editGood: false,
      good: Object.assign({}, EMPTY_GOOD)
    })
  }

  const handleSaveEditGood = () => {
    let { listGoodsByType, good, indexEditting } = state
    listGoodsByType[indexEditting] = state.good
    setState({
      ...state,
      editGood: false,
      good: Object.assign({}, EMPTY_GOOD),
      listGoodsByType: [...listGoodsByType]
    })
    props.onHandleGoodChange(listGoodsByType)
  }

  if (props.requestId !== state.requestId) {
    setState({
      ...state,
      requestId: props.requestId,
      listGoodsByType: props.listGoods
    })
  }
  const { translate, selectBoxName, listGoods } = props
  const { good, errorGood, errorQuantity, listGoodsByType, requestId, errorType } = state
  useEffect(() => {
    if (listGoods) {
      setState({
        ...state,
        listGoodsByType: listGoods
      })
    }
  }, [listGoods]);
  return (
    <React.Fragment>
      <fieldset className='scheduler-border'>
        <legend className='scheduler-border'>
          {translate('production.request_management.good_info')}
          <span className='text-red'>*</span>
        </legend>
        <div className={`form-group ${!errorType ? '' : 'has-error'}`}>
          <label>
            {'Loại hàng hóa'}
            <span className='text-red'> * </span>
          </label>
          <SelectBox
            id={`select-type-${selectBoxName ? selectBoxName : ''}`}
            className='form-control select2'
            style={{ width: '100%' }}
            value={good.type}
            items={getType()}
            onChange={handleTypeChange}
            multiple={false}
          />
          <ErrorLabel content={errorType} />
        </div>
        <div className={`form-group ${!errorGood ? '' : 'has-error'}`}>
          <label>{translate('production.request_management.good_code')}</label>
          <SelectBox
            id={`select-good-purchasing-request-${selectBoxName ? selectBoxName : ''}`}
            className='form-control select2'
            style={{ width: '100%' }}
            value={good.goodId}
            items={getAllGoods()}
            onChange={handleGoodChange}
            multiple={false}
          />
          <ErrorLabel content={errorGood} />
        </div>
        <div className={`form-group`}>
          <label>{translate('production.request_management.good_base_unit')}</label>
          <input type='text' value={good.baseUnit} disabled={true} className='form-control' />
        </div>
        <div className={`form-group ${!errorQuantity ? '' : 'has-error'}`}>
          <label className='control-label'>{translate('production.request_management.quantity')}</label>
          <div>
            <input type='number' className='form-control' placeholder={100} value={good.quantity} onChange={handleQuantityChange} />
          </div>
          <ErrorLabel content={errorQuantity} />
        </div>
        <div className='pull-right' style={{ marginBottom: '10px' }}>
          {state.editGood ? (
            <React.Fragment>
              <p type='button' className='btn btn-success' onClick={handleCancelEditGood} style={{ marginLeft: '10px' }}>
                {translate('production.request_management.cancel_editing_good')}
              </p>
              <p
                type='button'
                className='btn btn-success'
                disabled={!isGoodValidated()}
                onClick={handleSaveEditGood}
                style={{ marginLeft: '10px' }}
              >
                {translate('production.request_management.save_good')}
              </p>
            </React.Fragment>
          ) : (
            <p
              type='button'
              className='btn btn-success'
              style={{ marginLeft: '10px' }}
              disabled={!isGoodValidated()}
              onClick={handleAddGood}
            >
              {translate('production.request_management.add_good')}
            </p>
          )}
          <p type='button' className='btn btn-primary' style={{ marginLeft: '10px' }} onClick={handleClearGood}>
            {translate('production.request_management.delete_good')}
          </p>
        </div>
      </fieldset>
      <table className='table table-striped'>
        <thead>
          <tr>
            <th>{translate('production.request_management.index')}</th>
            <th>{translate('production.request_management.good_code')}</th>
            <th>{translate('production.request_management.good_name')}</th>
            <th>{translate('production.request_management.good_base_unit')}</th>
            <th>{translate('production.request_management.quantity')}</th>
            <th>{translate('table.action')}</th>
          </tr>
        </thead>
        <tbody>
          {!listGoodsByType || listGoodsByType.length === 0 ? (
            <tr>
              <td colSpan={6}>
                <center>{translate('confirm.no_data')}</center>
              </td>
            </tr>
          ) : (
            listGoodsByType.map((good, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{good.goodObject.code}</td>
                  <td>{good.goodObject.name}</td>
                  <td>{good.goodObject.baseUnit}</td>
                  <td>{good.quantity}</td>
                  <td>
                    <a href='#abc' className='edit' title={translate('general.edit')} onClick={() => handleEditGood(good, index)}>
                      <i className='material-icons'></i>
                    </a>
                    <a href='#abc' className='delete' title={translate('general.delete')} onClick={() => handleDeleteGood(good, index)}>
                      <i className='material-icons'></i>
                    </a>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {
  getGoodsByType: GoodActions.getGoodsByType
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GoodComponentRequest))
