import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

function SuppliesGeneralTab(props) {
  const [state, setState] = useState({})

  const [prevProps, setPrevProps] = useState({
    id: null
  })

  if (prevProps.id !== props.id) {
    setState({
      ...state,
      id: props.id,
      code: props.code,
      suppliesName: props.suppliesName,
      totalPurchase: props.totalPurchase,
      totalAllocation: props.totalAllocation,
      price: props.price
    })
    setPrevProps(props)
  }

  const { id, translate, suppliesReducer } = props

  const { code, totalPurchase, totalAllocation, price, suppliesName } = state

  return (
    <div id={id} className='tab-pane active'>
      <div className='box-body'>
        <div className='row' style={{ paddingRight: '0px', paddingLeft: '0px' }}>
          {/* Thông tin cơ bản */}
          <div className='col-md-6'>
            {/* Mã vật tư */}
            <div className='form-group'>
              <strong>{translate('supplies.supplies_management.code')}&emsp; </strong>
              {code}
            </div>

            {/* Tên vật tư */}
            <div className='form-group'>
              <strong>{translate('supplies.supplies_management.suppliesName')}&emsp; </strong>
              {suppliesName}
            </div>

            {/* Gia tien tham khảo */}
            <div className='form-group'>
              <strong>{translate('supplies.supplies_management.price')}&emsp; </strong>
              {`${price}(VND)`}
            </div>
          </div>
          <div className='col-md-6'>
            {/* So luong mua */}
            <div className='form-group'>
              <strong>{translate('supplies.supplies_management.totalPurchase')}&emsp; </strong>
              {totalPurchase}
            </div>
            {/* So luong đã cấp */}
            <div className='form-group'>
              <strong>{translate('supplies.supplies_management.totalAllocation')}&emsp; </strong>
              {totalAllocation}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function mapState(state) {
  const { suppliesReducer } = state
  return { suppliesReducer }
}
const actions = {}
const suppliesGeneralTab = connect(mapState, actions)(withTranslate(SuppliesGeneralTab))
export { suppliesGeneralTab as SuppliesGeneralTab }
