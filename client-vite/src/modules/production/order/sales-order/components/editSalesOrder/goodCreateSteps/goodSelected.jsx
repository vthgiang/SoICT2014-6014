import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { SelectBox, ErrorLabel } from '../../../../../../../common-components'

function GoodSelected(props) {
  const getGoodOptions = () => {
    let options = []
    let { listGoodsByType } = props.goods
    if (listGoodsByType) {
      options = [{ value: 'title', text: '---Chọn mặt hàng---' }]

      let mapOptions = listGoodsByType.map((item) => {
        return {
          value: item._id,
          text: item.code + ' - ' + item.name
        }
      })

      options = options.concat(mapOptions)
    }
    return options
  }

  const getManufacturingWorksOptions = () => {
    let options = []
    let { listManufacturingWorks } = props.goods.goodItems
    if (listManufacturingWorks) {
      options = [{ value: 'title', text: '---Chọn nhà máy để yêu cầu---' }]

      let mapOptions = listManufacturingWorks.map((item) => {
        return {
          value: item._id,
          text: item.code + ' - ' + item.name
        }
      })

      options = options.concat(mapOptions)
    }
    return options
  }

  let { good, goodName, pricePerBaseUnit, baseUnit, inventory, quantity, manufacturingWorks, manufacturingPlan } = props
  let { pricePerBaseUnitError, goodError, quantityError } = props
  const { handleGoodChange, handlePriceChange, handleQuantityChange, handleManufacturingWorkChange } = props

  return (
    <React.Fragment>
      <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6' style={{ padding: 10, height: '100%' }}>
        <div className={`form-group ${!goodError ? '' : 'has-error'}`}>
          <label>
            Sản phẩm
            <span className='attention'> * </span>
          </label>
          <SelectBox
            id={`select-good-edit-sales-order-edit`}
            className='form-control select2'
            style={{ width: '100%' }}
            value={good}
            items={getGoodOptions()}
            onChange={handleGoodChange}
            multiple={false}
          />
          <ErrorLabel content={goodError} />
        </div>

        <div className='form-group'>
          <label>
            Tên sản phẩm
            <span className='attention'> * </span>
          </label>
          <input type='text' className='form-control' value={goodName} />
        </div>

        <div className='form-group'>
          <label>
            Đơn vị tính
            <span className='attention'> * </span>
          </label>
          <input type='text' className='form-control' value={baseUnit} disabled='true' />
        </div>

        {/* <div className={`form-group`}>
                        <label>Yêu cầu sản xuất</label>
                        <SelectBox
                            id={`select-manufacturing-works-code-sales-order-edit`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            value={manufacturingWorks ? manufacturingWorks._id : "title"}
                            items={getManufacturingWorksOptions()}
                            onChange={handleManufacturingWorkChange}
                            multiple={false}
                            disabled={manufacturingPlan}
                        />
                    </div> */}
      </div>
      <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6' style={{ padding: 10, height: '100%' }}>
        <div className={`form-group ${!pricePerBaseUnitError ? '' : 'has-error'}`}>
          <label>
            Đơn giá
            <span className='attention'> * </span>
          </label>
          <input type='number' className='form-control' value={pricePerBaseUnit} onChange={handlePriceChange} />
          <ErrorLabel content={pricePerBaseUnitError} />
        </div>
        <div className='form-group'>
          <label>
            Số lượng còn trong kho
            <span className='attention'> * </span>
          </label>
          <input type='text' className='form-control' value={inventory ? inventory + ' ' + baseUnit : '0'} disabled={true} />
        </div>

        <div className={`form-group ${!quantityError ? '' : 'has-error'}`}>
          <label>
            Số lượng
            <span className='attention'> * </span>
          </label>
          <input type='number' className='form-control' value={quantity} onChange={handleQuantityChange} />
          <ErrorLabel content={quantityError} />
        </div>
      </div>
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  const { goods } = state
  return { goods }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GoodSelected))
