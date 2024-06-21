import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { generateCode } from '../../../../../../helpers/generateCode'
import { GoodActions } from '../../../../common-production/good-management/redux/actions'
import { PaymentActions } from '../../redux/actions'
import { DialogModal, SelectMulti, ButtonModal, ErrorLabel, SelectBox } from '../../../../../../common-components'
import ValidationHelper from '../../../../../../helpers/validationHelper'
import CreateTaxDetail from './createTaxDetail'

function TaxCreateForm(props) {
  let EMPTY_GOOD = {
    goods: [],
    percent: ''
  }

  const [state, setState] = useState({
    taxName: '',
    code: '',
    description: '',
    creator: {
      name: '',
      id: ''
    },
    goodsSelected: Object.assign({}, EMPTY_GOOD),
    allGoodsSelected: [],
    type: 'product',
    goodOptionsState: [],
    isSelectAll: true
  })

  useEffect(() => {
    // let creator = {};
    // creator.id = props.auth.user._id;
    // creator.name = props.auth.user.name;
    props.getAllGoodsByType({ type: state.type })
    // setState({
    //     creator,
    // });
  }, [])

  const getAllGoods = () => {
    const { translate, goods } = props
    const { isSelectAll } = state
    let listGoods = [
      isSelectAll
        ? {
            value: 'all',
            text: 'CHỌN TẤT CẢ'
          }
        : {
            value: 'unselected',
            text: 'BỎ CHỌN TẤT CẢ'
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

  const handleClickCreateCode = () => {
    setState({
      ...state,
      code: generateCode('TAX_')
    })
  }

  const handleTaxNameChange = (e) => {
    let { value = '' } = e.target

    let { translate } = props
    let { message } = ValidationHelper.validateName(translate, value, 1, 255)
    setState((state) => {
      return {
        ...state,
        taxName: value,
        nameTaxError: message
      }
    })
    // clgt dcm gg
  }

  const handleDescriptionChange = (e) => {
    let { value = '' } = e.target
    setState((state) => {
      return {
        ...state,
        description: value
      }
    })
  }

  const handlePercentChange = (e) => {
    let { value } = e.target
    validatePercent(value, true)
  }

  const handleGoodsChange = async (goods) => {
    let { goodOptionsState, allGoodsSelected } = state

    let checkSelectedAll = []
    if (goods) {
      checkSelectedAll = await goods.filter((item) => {
        return item === 'all' || item === 'unselected'
      })
    }

    if (checkSelectedAll.length && checkSelectedAll[0] === 'all' && goods) {
      if (goodOptionsState) {
        if (!goodOptionsState.length && !allGoodsSelected.length) {
          goods = await getAllGoods().map((item) => {
            return item.value
          })
        } else {
          goods = await goodOptionsState.map((item) => {
            return item.value
          })
        }
      }

      goods.splice(0, 1) //lấy phần tử all ra khỏi mảng
    } else if (checkSelectedAll.length && checkSelectedAll[0] === 'unselected' && goods) {
      goods = []
    }

    if (goods && goods.length === getAllGoods().length - 1) {
      //Tất cả các mặt hàng đã được chọn
      setState({
        ...state,
        isSelectAll: false
      })
    } else if (!state.isSelectAll) {
      setState({
        ...state,
        isSelectAll: true
      })
    }

    state.goodsSelected.goods = goods
    await setState((state) => {
      return {
        ...state,
        goodsError: validateGoods(goods, true)
      }
    })
  }

  const filterOption = (goodsSelectedNeedFilter) => {
    let { goodOptionsState, allGoodsSelected } = state
    //Nếu chưa có goodOptionsState thì thêm vào
    if (!goodOptionsState.length && !allGoodsSelected.length) {
      goodOptionsState = getAllGoods()
      // goodOptionsState.splice(0, 1);
    }

    //Lọc bỏ những option đã được chọn
    let optionsFilter = goodOptionsState.filter((good) => {
      let check = false
      goodsSelectedNeedFilter.goods.forEach((e) => {
        if (e === good.value) {
          check = true
        }
      })
      if (!check) {
        return good
      }
    })

    if (optionsFilter.length === 1) {
      //Nếu không còn phần tử nào thì lấy phần tử chọn tất cả ra khỏi mảng
      optionsFilter = []
    }
    return optionsFilter
  }

  const handleSubmitGoods = (e) => {
    e.preventDefault()

    let { goodsSelected, allGoodsSelected, goodOptionsState } = state

    goodOptionsState = filterOption(goodsSelected) //Lọc bỏ những options đã được chọn

    goodsSelected.key = goodsSelected.goods[0] //Thêm key để có thể xóa
    allGoodsSelected.push(goodsSelected)

    setState({
      ...state,
      allGoodsSelected,
      goodsSelected: Object.assign({}, EMPTY_GOOD),
      goodOptionsState,
      isSelectAll: true
    })
  }

  const handleClearGood = (e) => {
    e.preventDefault()
    setState((state) => {
      return {
        ...state,
        goodsSelected: Object.assign({}, EMPTY_GOOD),
        isSelectAll: true,
        goodsError: undefined,
        percentError: undefined
      }
    })
  }

  const reOptionsSelected = (item) => {
    let { goodOptionsState } = state
    //Các mặt hàng bị xóa được trả về option, có thể tiếp tục lựa chọn mặt hàng này
    let OptionsOfReOption = item.goods.map((good) => {
      let option = {}
      props.goods.listGoodsByType.forEach((item) => {
        if (item._id === good) {
          option = {
            value: item._id,
            text: item.name,
            code: item.code
          }
        }
      })
      return option
    })

    //Thêm lại các phần tử vừa bị xóa vào select option
    if (goodOptionsState.length === 0) {
      goodOptionsState.push({
        value: 'all',
        text: 'CHỌN TẤT CẢ'
      })
    }
    goodOptionsState = goodOptionsState.concat(OptionsOfReOption)
    return goodOptionsState
  }

  const handleDeleteGoodsTaxCollection = (item) => {
    let { allGoodsSelected, goodOptionsState } = state

    goodOptionsState = reOptionsSelected(item)

    //Xóa các phần tử bị xóa
    let collections = allGoodsSelected.filter((collection) => {
      return collection.key !== item.key
    })

    setState((state) => {
      return {
        ...state,
        allGoodsSelected: collections,
        goodOptionsState
      }
    })
  }

  const handleEditGoodsTaxCollection = (item, index) => {
    let { goodOptionsState } = state
    goodOptionsState = reOptionsSelected(item)
    setState({
      ...state,
      editGoodsTaxCollection: true,
      goodOptionsState,
      goodsSelected: { ...item },
      indexEditting: index
    })
  }

  const handleCancelEditGoodTaxCollection = (e) => {
    e.preventDefault()
    let { goodOptionsState, allGoodsSelected, indexEditting } = state
    goodOptionsState = filterOption(allGoodsSelected[indexEditting])
    setState({
      ...state,
      editGoodsTaxCollection: false,
      goodsSelected: Object.assign({}, EMPTY_GOOD),
      goodOptionsState,
      isSelectAll: true,
      goodsError: undefined,
      percentError: undefined
    })
  }

  const handleSaveEditGoodTaxCollection = () => {
    let { goodsSelected, indexEditting, goodOptionsState, allGoodsSelected } = state
    goodOptionsState = filterOption(goodsSelected) //Lọc bỏ những options đã được chọn
    allGoodsSelected[indexEditting] = goodsSelected
    setState({
      ...state,
      allGoodsSelected,
      goodsSelected: Object.assign({}, EMPTY_GOOD),
      goodOptionsState,
      isSelectAll: true,
      editGoodsTaxCollection: false
    })
  }

  const handleSubmitGoodChange = (data) => {
    let { allGoodsSelected, goodOptionsState } = state
    if (data.goods.length === 0) {
      handleDeleteGoodsTaxCollection({ key: data.key, goods: data.goodsDeleted, percent: data.percent }) // Xóa luôn collection
    } else {
      //Các mặt hàng bị xóa được trả về option, có thể tiếp tục lựa chọn mặt hàng này
      let OptionsOfReOption = data.goodsDeleted.map((good) => {
        let option = {}
        props.goods.listGoodsByType.forEach((item) => {
          if (item._id === good) {
            option = {
              value: item._id,
              text: item.name,
              code: item.code
            }
          }
        })
        return option
      })
      goodOptionsState = goodOptionsState.concat(OptionsOfReOption)

      let collections = allGoodsSelected.map((collection) => {
        if (collection.key === data.key) {
          return {
            key: collection.key,
            goods: data.goods.map((good) => good.value), //lấy id các mặt hàng không bị xóa
            percent: data.percent
          }
        } else return collection
      })

      setState((state) => {
        return {
          ...state,
          allGoodsSelected: collections,
          goodOptionsState
        }
      })
    }
  }

  const validateGoods = (goods, willUpdateState = true) => {
    let msg = undefined
    if (!goods || goods.length === 0) {
      const { translate } = props
      msg = translate('manage_order.tax.choose_at_least_one_item')
    }
    return msg
  }

  const isGoodsValidated = () => {
    let percent, goods
    if (state.goodsSelected) {
      percent = state.goodsSelected.percent
      goods = state.goodsSelected.goods
    }
    let { translate } = props
    if (!ValidationHelper.validateEmpty(translate, percent).status || validateGoods(goods, false) || validatePercent(percent, false)) {
      return false
    }
    return true
  }

  const isFormValidated = () => {
    const { taxName, allGoodsSelected, percent } = state
    let { translate } = props
    if (!ValidationHelper.validateEmpty(translate, taxName).status || validateGoods(allGoodsSelected, false)) {
      return false
    }
    return true
  }

  const validatePercent = (value, willUpdateState = true) => {
    let msg = undefined
    const { translate } = props
    if (!value) {
      msg = translate('manage_order.tax.percent_is_not_null')
    } else if (value < 0) {
      msg = translate('manage_order.tax.percent_greater_than_or_equal_zero')
    }
    if (willUpdateState) {
      state.goodsSelected.percent = value
      setState((state) => {
        return {
          //cái dcm gg
          ...state,
          percentError: msg
        }
      })
    }
    return msg
  }

  const showGoodDetail = async (item) => {
    //Gán mã code và name vào để hiển thị table
    let data = {
      key: item.key,
      percent: item.percent
    }

    data.goods = item.goods.map((good) => {
      let option = {}
      props.goods.listGoodsByType.forEach((item) => {
        if (item._id === good) {
          option = {
            value: item._id,
            name: item.name,
            code: item.code
          }
        }
      })
      return option
    })

    await setState((state) => {
      return {
        ...state,
        currentRow: data
      }
    })
    window.$('#modal-create-tax-detail-good').modal('show')
  }

  const save = async () => {
    if (isFormValidated()) {
      let { allGoodsSelected } = state
      let dataGoods = []
      allGoodsSelected.forEach((e) => {
        e.goods.forEach((good) => {
          dataGoods.push({ good: good, percent: parseInt(e.percent) })
        })
      })
      const data = {
        code: state.code,
        name: state.taxName,
        description: state.description,
        goods: dataGoods
      }
      await props.createNewTax(data)
      await props.reloadState()
      setState((state) => {
        return {
          ...state,
          taxName: '',
          code: '',
          description: '',
          creator: {
            name: '',
            id: ''
          },
          goodsSelected: Object.assign({}, EMPTY_GOOD),
          allGoodsSelected: [],
          type: 'product',
          goodOptionsState: []
        }
      })
    }
  }

  const {
    taxName,
    code,
    description,
    goodsSelected,
    allGoodsSelected,
    currentRow,
    nameTaxError,
    percentError,
    goodsError,
    goodOptionsState,
    editGoodsTaxCollection
  } = state

  const { translate } = props

  return (
    <React.Fragment>
      <ButtonModal
        onButtonCallBack={handleClickCreateCode}
        modalID={`modal-add-tax`}
        button_name={translate('manage_order.tax.add_new_tax')}
        title={translate('manage_order.tax.add_new_tax')}
      />
      <DialogModal
        modalID={`modal-add-tax`}
        isLoading={false}
        formID={`form-add-tax`}
        title={translate('manage_order.tax.add_new_tax')}
        msg_success={translate('manage_order.tax.add_successfully')}
        msg_failure={translate('manage_order.tax.add_failed')}
        disableSubmit={!isFormValidated()}
        func={save}
        size='50'
        style={{ backgroundColor: 'green' }}
      >
        {currentRow && (
          <CreateTaxDetail data={currentRow} handleSubmitGoodChange={(dataChagneSubmit) => handleSubmitGoodChange(dataChagneSubmit)} />
        )}

        <form id={`form-add-tax`}>
          <div className='form-group'>
            <label>
              {translate('manage_order.tax.tax_code')}
              <span className='attention'> </span>
            </label>
            <input type='text' className='form-control' value={code} disabled={true} />
          </div>
          <div className={`form-group ${!nameTaxError ? '' : 'has-error'}`}>
            <label>
              {translate('manage_order.tax.tax_name')}
              <span className='attention'> * </span>
            </label>
            <input type='text' className='form-control' value={taxName} onChange={handleTaxNameChange} />
            <ErrorLabel content={nameTaxError} />
          </div>
          <div className='form-group'>
            <label>
              {translate('manage_order.tax.description')}
              <span className='attention'> </span>
            </label>
            <textarea type='text' className='form-control' value={description} onChange={handleDescriptionChange} />
          </div>

          <fieldset className='scheduler-border'>
            <legend className='scheduler-border'>{translate('manage_order.tax.goods')}</legend>
            <div className={`form-group ${!goodsError ? '' : 'has-error'}`}>
              <label>
                {translate('manage_order.tax.select_goods')}
                <span className='attention'> * </span>
              </label>
              <SelectBox
                id={`select-create-multi-good-tax`}
                className='form-control select2'
                style={{ width: '100%' }}
                items={goodOptionsState && !goodOptionsState.length && !allGoodsSelected.length ? getAllGoods() : goodOptionsState}
                onChange={handleGoodsChange}
                multiple={true}
                value={goodsSelected && goodsSelected.goods}
              />
              <ErrorLabel content={goodsError} />
            </div>
            <div className={`form-group ${!percentError ? '' : 'has-error'}`}>
              <label>
                {translate('manage_order.tax.tax_percent')}
                <span className='attention'> * </span>
              </label>
              <input
                type='number'
                className='form-control'
                placeholder='Nhập %'
                value={goodsSelected && goodsSelected.percent}
                onChange={handlePercentChange}
              />
              <ErrorLabel content={percentError} />
            </div>
            <div className={'pull-right'} style={{ padding: 10 }}>
              {editGoodsTaxCollection ? (
                <React.Fragment>
                  <button className='btn btn-success' onClick={handleCancelEditGoodTaxCollection} style={{ marginLeft: '10px' }}>
                    Hủy chỉnh sửa
                  </button>
                  <button
                    className='btn btn-success'
                    disabled={!isGoodsValidated()}
                    onClick={handleSaveEditGoodTaxCollection}
                    style={{ marginLeft: '10px' }}
                  >
                    Lưu
                  </button>
                </React.Fragment>
              ) : (
                <button
                  className='btn btn-success'
                  style={{ marginLeft: '10px' }}
                  disabled={!isGoodsValidated()}
                  onClick={handleSubmitGoods}
                >
                  {translate('manage_order.tax.add')}
                </button>
              )}
              <button className='btn btn-primary' style={{ marginLeft: '10px' }} onClick={handleClearGood}>
                {translate('manage_order.tax.reset')}
              </button>
            </div>
            <table id={`order-table-tax-create`} className='table table-bordered'>
              <thead>
                <tr>
                  <th title={translate('manage_order.tax.index')}>{translate('manage_order.tax.index')}</th>
                  <th title={translate('manage_order.tax.tax_percent')}>{translate('manage_order.tax.tax_percent')}</th>
                  <th title={translate('manage_order.tax.goods')}>{translate('manage_order.tax.goods')}</th>
                  <th title={translate('manage_order.tax.action')}>{translate('manage_order.tax.action')}</th>
                </tr>
              </thead>
              <tbody>
                {allGoodsSelected &&
                  allGoodsSelected.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.percent}</td>
                        <td>
                          <a onClick={() => showGoodDetail(item)}>{translate('manage_order.tax.view_deatail')}</a>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <a href='#abc' className='edit' title='Sửa' onClick={() => handleEditGoodsTaxCollection(item, index)}>
                            <i className='material-icons'>edit</i>
                          </a>
                          {!editGoodsTaxCollection ? (
                            <a
                              onClick={() => handleDeleteGoodsTaxCollection(item)}
                              className='delete text-red'
                              style={{ width: '5px' }}
                              title={translate('manage_order.tax.delete_list_goods')}
                            >
                              <i className='material-icons'>delete</i>
                            </a>
                          ) : (
                            ''
                          )}
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </fieldset>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  const { auth, goods } = state
  return { auth, goods }
}

const mapDispatchToProps = {
  getAllGoodsByType: GoodActions.getAllGoodsByType,
  createNewTax: PaymentActions.createNewTax
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TaxCreateForm))
