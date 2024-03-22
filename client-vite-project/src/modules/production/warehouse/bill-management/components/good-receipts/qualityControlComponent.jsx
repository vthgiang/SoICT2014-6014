import React, { useState } from 'react'
import { connect } from 'react-redux'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import { SelectBox, ErrorLabel } from '../../../../../../common-components'

function QualityControlComponent(props) {
  const [state, setState] = useState({
    quantityPassedTest: []
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
        statusQuality: status,
        errorOnStatus: msg
      })
      props.onDataChange(status)
    }
    return msg === undefined
  }

  const handleDescriptionChange = (e) => {
    const { value } = e.target
    setState({
      ...state,
      content: value
    })
  }

  const handleQualityControlEachProduct = (index, value) => {
    const data = [...listGoods]
    data[index].realQuantity = value.toString()
    setState({
      ...state,
      listGoods: data
    })
    checkLots(data[index].quantity, index)
  }

  if (props.billId !== state.billId) {
    setState({
      ...state,
      billId: props.billId,
      code: props.billInfor.code,
      listGoods: props.billInfor.goods,
      statusQuality: props.statusQuality
    })
  }

  const checkLots = (quantity, index) => {
    if (listGoods[index].realQuantity > quantity || listGoods[index].realQuantity < 0 || listGoods[index].realQuantity === '') {
      return [false, 'Số lượng kiểm định phải nhỏ hơn số lượng gốc và lớn hơn 0, không được để trống']
    }
    return [true, '']
  }
  const { translate, bills, billInfor } = props

  const { statusQuality, content, code, listGoods, errorOnStatus } = state

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
            value={statusQuality}
            items={[
              { value: 0, text: 'Chọn trạng thái' },
              { value: 1, text: 'Chưa kiểm định hàng hóa xong' },
              { value: 2, text: 'Đã kiểm định hàng hóa xong' }
            ]}
            onChange={handleStatusChange}
            multiple={false}
          />
          <ErrorLabel content={errorOnStatus} />
        </div>
      </div>
      {typeof listGoods === 'undefined' || listGoods.length === 0 ? (
        ''
      ) : (
        <div className={`form-group`}>
          <label>
            {translate('manage_warehouse.bill_management.quality_control_of_each_goods')}
            <span className='text-red'>*</span>
          </label>
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
                  <th title={translate('manage_warehouse.bill_management.quantity_passed_test')}>
                    {translate('manage_warehouse.bill_management.quantity_passed_test')}
                  </th>
                  <th title={translate('manage_warehouse.bill_management.note')}>
                    {translate('manage_warehouse.bill_management.description')}
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
                    <td>{x.quantity}</td>
                    <td>
                      {checkLots(x.quantity, index)[0] ? (
                        <input
                          placeholder='Nhập số lượng đạt kiểm định'
                          style={{ border: 'green 1px solid' }}
                          type='number'
                          value={x.realQuantity}
                          className='form-control'
                          onChange={(e) => handleQualityControlEachProduct(index, e.target.value)}
                        />
                      ) : (
                        <div className='tooltip-abc'>
                          <input
                            placeholder='Nhập số lượng đạt kiểm định'
                            style={{ border: 'red 1px solid', paddingBottom: '15px', color: 'red' }}
                            type='number'
                            value={x.realQuantity}
                            className='form-control'
                            onChange={(e) => handleQualityControlEachProduct(index, e.target.value)}
                          />
                          <span className='tooltiptext'>
                            <p style={{ color: 'white' }}>{checkLots(x.quantity, index)[1]}</p>
                          </span>
                        </div>
                      )}
                    </td>
                    <td>{x.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </fieldset>
        </div>
      )}
      <div className='form-group'>
        <label>{translate('manage_warehouse.bill_management.description')}</label>
        <textarea type='text' value={content} onChange={handleDescriptionChange} className='form-control'></textarea>
      </div>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(QualityControlComponent))
