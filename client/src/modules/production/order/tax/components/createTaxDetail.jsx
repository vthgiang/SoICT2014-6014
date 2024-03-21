import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal, ErrorLabel } from '../../../../../common-components'
import ValidationHelper from '../../../../../helpers/validationHelper'

function CreateTaxDetail(props) {
  const [state, setState] = useState({
    goods: [],
    percent: '',
    key: '',
    goodsDeleted: []
  })

  if (props.data.key !== state.key) {
    setState((state) => {
      return {
        ...state,
        goods: props.data.goods,
        percent: props.data.percent,
        key: props.data.key,
        goodsDeleted: []
      }
    })
  }

  const handleDeleteGoodsTax = (item) => {
    let { goods, goodsDeleted } = state
    goodsDeleted.push(item.value)

    let goodsFilter = goods.filter((element) => element.value !== item.value)
    setState({
      ...state,
      goods: goodsFilter,
      goodsDeleted
    })
  }

  const handlePercentChange = (e) => {
    let { value } = e.target
    validatePercent(value, true)
  }

  const submitChange = () => {
    if (isFormValidated()) {
      let data = state
      props.handleSubmitGoodChange(data)
    }
  }

  const handleRedo = () => {
    if (state.key === props.data.key) {
      setState((state) => {
        return {
          ...state,
          goods: props.data.goods,
          percent: props.data.percent,
          key: props.data.key,
          goodsDeleted: [],
          percentError: undefined
        }
      })
    }
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
      state.percent = value
      setState((state) => {
        return {
          ...state,
          percentError: msg
        }
      })
    }
    return msg
  }

  const isFormValidated = () => {
    const { percent, goods } = state
    let { translate } = props

    if (!goods.length) {
      //Nếu good bị xóa hết thì không cần validate percent
      if (state.percentError) {
        setState((state) => {
          return {
            ...state,
            percentError: undefined
          }
        })
      }
      return true
    }

    if (!ValidationHelper.validateEmpty(translate, percent).status || validatePercent(percent, false)) {
      return false
    }
    return true
  }

  let { goods, percent, percentError } = state
  const { translate } = props

  return (
    <DialogModal
      modalID={`modal-create-tax-detail-good`}
      isLoading={false}
      formID={`form-create-tax-detail-good`}
      title={translate('manage_order.tax.detail_goods')}
      size='75'
      style={{ backgroundColor: 'green' }}
      func={submitChange}
      disableSubmit={!isFormValidated()}
    >
      <div className={`form-group ${!percentError ? '' : 'has-error'}`}>
        <label>
          {translate('manage_order.tax.tax_percent')}
          <span className='attention'> * </span>
        </label>
        <input type='number' className='form-control' placeholder='Nhập %' value={percent} onChange={handlePercentChange} />
        <ErrorLabel content={percentError} />
      </div>
      <table id={`order-table-tax-create`} className='table table-bordered'>
        <thead>
          <tr>
            <th title={'STT'}>{translate('manage_order.tax.index')}</th>
            <th title={'Tên'}>{translate('manage_order.tax.code')}</th>
            <th>{translate('manage_order.tax.name')}</th>
            <th>{translate('manage_order.tax.action')}</th>
          </tr>
        </thead>
        <tbody>
          {goods &&
            goods.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.code}</td>
                  <td>{item.name}</td>
                  <td style={{ textAlign: 'center' }}>
                    <a
                      onClick={() => handleDeleteGoodsTax(item)}
                      className='delete red-yellow'
                      style={{ width: '5px' }}
                      title={translate('manage_order.tax.delete_good')}
                    >
                      <i className='material-icons'>delete</i>
                    </a>
                  </td>
                </tr>
              )
            })}
        </tbody>
      </table>
      <div className={'pull-right'} style={{ padding: 10 }}>
        <button className='btn btn-primary' style={{ marginLeft: '10px' }} onClick={handleRedo}>
          {'Hoàn tác'}
        </button>
      </div>
    </DialogModal>
  )
}

export default connect(null, null)(withTranslate(CreateTaxDetail))
