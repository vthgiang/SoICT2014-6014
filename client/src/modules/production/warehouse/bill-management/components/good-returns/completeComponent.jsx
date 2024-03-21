import React, { useState } from 'react'
import { connect } from 'react-redux'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import { SelectBox, ErrorLabel } from '../../../../../../common-components'

function CompleteComponent(props) {
  const [state, setState] = useState({
    quantityPassedTest: [],
    statusAll: 1
  })

  const handleStatusChange = (value) => {
    const status = value[0]
    validateStatus(status, true)
  }

  const validateStatus = (status, willUpdateState = false) => {
    let msg = undefined
    if (status == 0) {
      msg = 'Bạn phải chọn trạng thái'
    }
    if (willUpdateState) {
      setState({
        ...state,
        statusAll: status,
        errorOnStatus: msg
      })
      props.onDataChange(status)
    }
    return msg === undefined
  }

  const getDataUnPassedLots = (goods) => {
    let unPassedLots = []
    goods.forEach((item) => {
      item.unpassed_quality_control_lots.forEach((lot) => {
        lot.goodName = item.good.name
        lot.baseUnit = item.good.baseUnit
        unPassedLots.push(lot)
      })
    })
    return unPassedLots
  }

  if (props.billId !== state.billId) {
    setState({
      ...state,
      billId: props.billId,
      code: props.billInfor.code,
      listGoods: props.billInfor.goods,
      dataLots: getDataUnPassedLots(props.billInfor.goods)
    })
  }

  const checkLots = (lots, quantity) => {
    if (lots.length === 0) {
      return false
    } else {
      let totalQuantity = 0
      for (let i = 0; i < lots.length; i++) {
        totalQuantity += Number(lots[i].quantity)
      }
      if (Number(quantity) !== Number(totalQuantity)) {
        return false
      }
    }
    return true
  }

  const checkDifferentGood = (lot) => {
    let quantity = lot.quantity
    if (lot.binLocations && lot.binLocations.length > 0) {
      lot.binLocations.forEach((bin) => {
        quantity -= bin.quantity
      })
    }
    return quantity
  }

  const { translate, billInfor, statusQuality, statusLot, statusInventory } = props

  const { status, code, listGoods, dataLots, statusAll, errorOnStatus } = state

  return (
    <React.Fragment>
      <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
        <div className='form-group'>
          <label>{translate('manage_warehouse.bill_management.code')}</label>
          <input type='text' value={code} className='form-control' disabled={true}></input>
        </div>
      </div>
      <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
        <div className={`form-group ${!errorOnStatus ? '' : 'has-error'}`}>
          <label>
            {translate('manage_warehouse.bill_management.status')}
            <span className='text-red'>*</span>
          </label>
          <SelectBox
            id={`select-quality-control-status-bill`}
            className='form-control select2'
            style={{ width: '100%' }}
            value={statusAll}
            items={[
              { value: 0, text: 'Chọn trạng thái' },
              { value: 1, text: 'Chưa hoàn thành' },
              { value: 2, text: 'Đã hoàn thành' }
            ]}
            onChange={handleStatusChange}
            multiple={false}
            disabled={!(statusQuality == 2 && statusLot == 2 && statusInventory == 2)}
          />
          <ErrorLabel content={errorOnStatus} />
        </div>
      </div>
      {typeof listGoods === 'undefined' || listGoods.length === 0 ? (
        ''
      ) : (
        <div className={`form-group`}>
          <label>{'Số hàng hóa không đạt kiểm định'}</label>
          <fieldset className='scheduler-border'>
            {/* Bảng thông tin chi tiết */}
            <table className='table'>
              <thead>
                <tr>
                  <th style={{ width: '5%' }} title={translate('manage_warehouse.bill_management.index')}>
                    {translate('manage_warehouse.bill_management.index')}
                  </th>
                  <th title={translate('manage_warehouse.bill_management.good_code')}>
                    {translate('manage_warehouse.bill_management.good_code')}
                  </th>
                  <th title={translate('manage_warehouse.bill_management.good_name')}>
                    {translate('manage_warehouse.bill_management.good_name')}
                  </th>
                  <th title={translate('manage_warehouse.bill_management.unit')}>{translate('manage_warehouse.bill_management.unit')}</th>
                  <th title={translate('manage_warehouse.bill_management.number')}>
                    {translate('manage_warehouse.bill_management.number')}
                  </th>
                </tr>
              </thead>

              <tbody id={`good-bill-edit`}>
                {listGoods.map((x, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{x.good.code}</td>
                    <td>{x.good.name}</td>
                    <td>{x.good.baseUnit}</td>
                    <td>{parseInt(x.quantity) - parseInt(x.realQuantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </fieldset>
        </div>
      )}
      {typeof listGoods === 'undefined' || listGoods.length === 0 ? (
        ''
      ) : (
        <div className={`form-group`}>
          <label>{'Số lượng hàng hóa chưa đánh lô'}</label>
          <fieldset className='scheduler-border'>
            {/* Bảng thông tin chi tiết */}
            <table className='table'>
              <thead>
                <tr>
                  <th style={{ width: '5%' }} title={translate('manage_warehouse.bill_management.index')}>
                    {translate('manage_warehouse.bill_management.index')}
                  </th>
                  <th title={translate('manage_warehouse.bill_management.good_code')}>
                    {translate('manage_warehouse.bill_management.good_code')}
                  </th>
                  <th title={translate('manage_warehouse.bill_management.good_name')}>
                    {translate('manage_warehouse.bill_management.good_name')}
                  </th>
                  <th title={translate('manage_warehouse.bill_management.unit')}>{translate('manage_warehouse.bill_management.unit')}</th>
                  <th title={translate('manage_warehouse.bill_management.number')}>
                    {translate('manage_warehouse.bill_management.number')}
                  </th>
                </tr>
              </thead>

              <tbody id={`good-bill-edit`}>
                {listGoods.map((x, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{x.good.code}</td>
                    <td>{x.good.name}</td>
                    <td>{x.good.baseUnit}</td>
                    {checkLots(x.lots, x.realQuantity) ? (
                      <td>{x.realQuantity}</td>
                    ) : x.realQuantity == 0 ? (
                      <td>{'Không có hàng hóa đạt kiểm định'}</td>
                    ) : (
                      <td className='tooltip-abc'>
                        <span style={{ color: 'red' }}>{x.realQuantity}</span>
                        <span className='tooltiptext'>
                          <p style={{ color: 'white' }}>{translate('manage_warehouse.bill_management.text')}</p>
                        </span>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </fieldset>
        </div>
      )}
      {typeof listGoods === 'undefined' || listGoods.length === 0 ? (
        ''
      ) : (
        <div className={`form-group`}>
          <label>{'Số lượng hàng hóa chưa xếp hết vào kho'}</label>
          <fieldset className='scheduler-border'>
            <legend className='scheduler-border'>{'Thông tin chi tiết lô hàng'}</legend>
            <div className={`form-group`}>
              {/* Bảng thông tin chi tiết */}
              <table className='table'>
                <thead>
                  <tr>
                    <th style={{ width: '5%' }} title={translate('manage_warehouse.bill_management.index')}>
                      {translate('manage_warehouse.bill_management.index')}
                    </th>
                    <th title='Mã lô hàng'>{'Mã lô hàng'}</th>
                    <th title={translate('manage_warehouse.bill_management.good_name')}>
                      {translate('manage_warehouse.bill_management.good_name')}
                    </th>
                    <th title={translate('manage_warehouse.bill_management.unit')}>{translate('manage_warehouse.bill_management.unit')}</th>
                    <th title={translate('manage_warehouse.bill_management.number')}>
                      {translate('manage_warehouse.bill_management.number')}
                    </th>
                    <th title={'Số lượng chưa xếp vào kho'}>{'Số lượng chưa xếp vào kho'}</th>
                    <th title={'Vị trí lưu trữ/Số lượng'}>{'Vị trí lưu trữ/Số lượng'}</th>
                    <th title={'Ngày hết hạn'}>{'Ngày hết hạn'}</th>
                  </tr>
                </thead>
                <tbody id={`good-bill-edit`}>
                  {typeof dataLots === 'undefined' || dataLots.length === 0 ? (
                    <tr>
                      <td colSpan={7}>
                        <center>{translate('task_template.no_data')}</center>
                      </td>
                    </tr>
                  ) : (
                    dataLots.map((x, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{x.code}</td>
                        <td>{x.goodName}</td>
                        <td>{x.baseUnit}</td>
                        <td>{x.quantity}</td>
                        {checkDifferentGood(x) > 0 ? (
                          <td className='tooltip-abc'>
                            <span style={{ color: 'red' }}>{checkDifferentGood(x)}</span>
                            <span className='tooltiptext'>
                              <p style={{ color: 'white' }}>
                                {'Lô hàng còn ' + checkDifferentGood(x) + x.baseUnit + ' chưa xếp hết vào kho'}
                              </p>
                            </span>
                          </td>
                        ) : (
                          <td>{'Hàng đã xếp hết vào kho'}</td>
                        )}
                        {x.binLocations && x.binLocations.length > 0 ? (
                          <td>
                            {x.binLocations.map((binLocation, index2) => (
                              <div key={index2}>
                                <p>{binLocation.name + '/' + binLocation.quantity + ' ' + x.baseUnit}</p>
                              </div>
                            ))}
                          </td>
                        ) : (
                          <td>{''}</td>
                        )}
                        <td>{x.expirationDate}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </fieldset>
        </div>
      )}
    </React.Fragment>
  )
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CompleteComponent))
