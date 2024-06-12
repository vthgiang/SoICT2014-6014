import React from 'react'
import {connect} from 'react-redux'
import {withTranslate} from 'react-redux-multilingual'
import {SelectBox, ErrorLabel} from '@common-components'

function OrderCreateInfo(props) {
  const getCustomerOptions = () => {
    let options = []

    const {list} = props.customers
    if (list) {
      options = [
        {
          value: 'title', //Title không được chọn
          text: '---Chọn khách hàng---'
        }
      ]

      let mapOptions = props.customers.list.map((item) => {
        return {
          value: item._id,
          text: item.code + ' - ' + item.name
        }
      })

      options = options.concat(mapOptions)
    }

    return options
  }

  const getStockOptions = () => {
    let options = []

    const {listStocks} = props.stocks
    if (listStocks) {
      options = [
        {
          value: 'title', //Title không được chọn
          text: '---Chọn kho---'
        }
      ]

      let mapOptions = props.stocks.listStocks.map((item) => {
        return {
          value: item._id,
          text: item.code + ' - ' + item.name
        }
      })

      options = options.concat(mapOptions)
    }

    return options
  }

  let {
    code,
    note,
    customer,
    customerName,
    customerAddress,
    customerPhone,
    priority,
    transportType,
    stockIn,
    stockOut,
  } = props

  let {
    customerError,
    customerPhoneError,
    customerAddressError,
    priorityError,
  } = props

  const {
    handleCustomerChange,
    handleCustomerAddressChange,
    handleCustomerPhoneChange,
    handleNoteChange,
    handlePriorityChange,
    handleTransportTypeChange,
    handleStockInChange,
    handleStockOutChange,
    handleDeliveryTimeChange
  } = props

  return (
    <>
      <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4" style={{padding: 10, height: '100%'}}>
          <fieldset className="scheduler-border" style={{height: '100%'}}>
            <legend className="scheduler-border">Đơn bán hàng</legend>
            <div className="form-group">
              <label>
                Mã vận đơn
                <span className="attention"> * </span>
              </label>
              <input type="text" className="form-control" value={code} disabled={true}/>
            </div>

            <div className={`form-group ${!priorityError ? '' : 'has-error'}`}>
              <label>
                Độ ưu tiên
                <span className="attention"> * </span>
              </label>
              <SelectBox
                id={`select-create-order-priority`}
                className="form-control select2"
                style={{width: '100%'}}
                value={priority}
                items={[
                  {value: 1, text: 'Thấp'},
                  {value: 2, text: 'Trung bình'},
                  {value: 3, text: 'Cao'},
                  {value: 4, text: 'Đặc biệt'}
                ]}
                onChange={handlePriorityChange}
                multiple={false}
              />
              <ErrorLabel content={priorityError}/>
            </div>
            <div className="form-group">
              <label>
                Loại hình vận chuyển
                <span className="attention"> * </span>
              </label>
              <SelectBox
                id={`select-create-order-transport-type`}
                className="form-control select2"
                style={{width: '100%'}}
                value={transportType}
                items={[
                  {value: 1, text: 'Giao hàng'},
                  {value: 2, text: 'Nhận hàng'},
                  {value: 3, text: 'Vận chuyển giữa các kho'}
                ]}
                onChange={handleTransportTypeChange}
                multiple={false}
              />
            </div>
            <div className="form-group">
                <label>
                    Thời gian nhận hàng dự kiến
                    <span className="attention"> * </span>
                </label>
                <input type="datetime-local" className="form-control" onChange={handleDeliveryTimeChange}/>
            </div>
            <div className="form-group">
              <div className="form-group">
                <label>
                  Ghi chú
                  <span className="attention"> </span>
                </label>
                <textarea type="text" className="form-control" value={note} onChange={handleNoteChange}/>
              </div>
            </div>
          </fieldset>
        </div>
        {transportType !== 3 ? (
            <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8" style={{padding: 10, height: '100%'}}>
              <fieldset className="scheduler-border" style={{height: '100%'}}>
                <legend className="scheduler-border">Thông tin khách hàng</legend>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{padding: 0}}>
                  <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                    <div className={`form-group ${!customerError ? '' : 'has-error'}`}>
                      <label>
                        Khách hàng
                        <span className="attention"> * </span>
                      </label>
                      <SelectBox
                        id={`select-order-customer`}
                        className="form-control select2"
                        style={{width: '100%'}}
                        value={customer}
                        items={getCustomerOptions()}
                        onChange={handleCustomerChange}
                        multiple={false}
                      />
                      <ErrorLabel content={customerError}/>
                    </div>
                  </div>
                  <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
                    <div className="form-group">
                      <label>
                        Tên khách hàng <span className="attention"> </span>
                      </label>
                      <input type="text" className="form-control" value={customerName} disabled={true}/>
                    </div>
                  </div>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{padding: 0}}>
                  <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                    <div className={`form-group ${!customerPhoneError ? '' : 'has-error'}`}>
                      <label>
                        Số điện thoại
                        <span className="attention"> * </span>
                      </label>
                      <input type="number" className="form-control" value={customerPhone}
                             onChange={handleCustomerPhoneChange}/>
                      <ErrorLabel content={customerPhoneError}/>
                    </div>
                  </div>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <div className={`form-group ${!customerAddressError ? '' : 'has-error'}`}>
                    <label>
                      Địa chỉ nhận hàng
                      <span className="attention"> * </span>
                    </label>
                    <textarea type="text" className="form-control" value={customerAddress}
                              onChange={handleCustomerAddressChange}/>
                    <ErrorLabel content={customerAddressError}/>
                  </div>
                </div>
              </fieldset>
            </div>
          )
          : (
            <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8" style={{padding: 10, height: '100%'}}>
              <fieldset className="scheduler-border" style={{height: '100%'}}>
                <legend className="scheduler-border">Thông tin kho</legend>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{padding: 0}}>
                  <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                    <div className={`form-group`}>
                      <label>
                        Kho xuất
                        <span className="attention"> * </span>
                      </label>
                      <SelectBox
                        id={`select-order-stock-out`}
                        className="form-control select2"
                        style={{width: '100%'}}
                        value={stockOut.stock}
                        items={getStockOptions()}
                        onChange={handleStockOutChange}
                        multiple={false}
                      />
                      {/*<ErrorLabel content={stockError}/>*/}
                    </div>
                  </div>
                  <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
                    <div className="form-group">
                      <label>
                        Tên kho <span className="attention"> </span>
                      </label>
                      <input type="text" className="form-control" value={stockOut.stockName} disabled={true}/>
                    </div>
                  </div>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <div className={`form-group`}>
                    <label>
                      Địa chỉ kho
                    </label>
                    <input type="text" className="form-control" value={stockOut.stockAddress} disabled={true}/>
                  </div>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{padding: 0, marginTop: 50}}>
                  <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                    <div className={`form-group`}>
                      <label>
                        Kho nhập
                        <span className="attention"> * </span>
                      </label>
                      <SelectBox
                        id={`select-order-stock-in`}
                        className="form-control select2"
                        style={{width: '100%'}}
                        value={stockIn.stock}
                        items={getStockOptions()}
                        onChange={handleStockInChange}
                        multiple={false}
                      />
                      {/*<ErrorLabel content={stockError}/>*/}
                    </div>
                  </div>
                  <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
                    <div className="form-group">
                      <label>
                        Tên kho <span className="attention"> </span>
                      </label>
                      <input type="text" className="form-control" value={stockIn.stockName} disabled={true}/>
                    </div>
                  </div>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <div className={`form-group`}>
                    <label>
                      Địa chỉ kho
                    </label>
                    <input type="text" className="form-control" value={stockIn.stockAddress} disabled={true}/>
                  </div>
                </div>
              </fieldset>
            </div>
          )}
      </div>
    </>
  )
}

function mapStateToProps(state) {
  const {customers} = state.crm
  const {stocks} = state
  return {customers, stocks}
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(OrderCreateInfo))
