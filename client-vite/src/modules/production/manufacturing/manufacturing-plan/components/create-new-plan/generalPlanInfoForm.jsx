import React, { useEffect, useState } from 'react'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import { connect } from 'react-redux'
import { DatePicker, ErrorLabel, SelectBox } from '../../../../../../common-components'
import { LotActions } from '../../../../warehouse/inventory-management/redux/actions'
import { compareLteDate, formatDate } from '../../../../../../helpers/formatDate'
import { PaymentActions } from '../../../../order/payment/redux/actions'
import SalesOrderDetailForm from '../../../../order/sales-order/components/salesOrderDetailForm'
import { formatCurrency } from '../../../../../../helpers/formatCurrency'
import { SalesOrderActions } from '../../../../order/sales-order/redux/actions'

const PlanInfoForm = (props) => {
  const EMPTY_GOOD = {
    goodId: '1',
    baseUnit: '',
    inventory: '',
    quantity: ''
  }
  
  const { translate, code, salesOrderIds, description, listGoodsSalesOrders, addedAllGoods, listGoods, lots } = props

  const [good, setGood] = useState({ ...EMPTY_GOOD });
  const [currentGoodId, setCurrentGoodId] = useState('1');
  const [approvers, setApprovers] = useState([...props.approvers]);
  const [startDate, setStartDate] = useState(props.startDate);
  const [startDateError, setStartDateError] = useState("");
  const [endDate, setEndDate] = useState(props.endDate)
  const [endDateError, setEndDateError] = useState("");
  const [errorGood, setErrorGood] = useState("");
  const [errorQuantity, setErrorQuantity] = useState("");
  const [errorApprovers, setErrorApprovers] = useState("");
  const [editGood, setEditGood] = useState(false)
  const [indexEditting, setIndexEditting] = useState("")

  const dataStatus = [
    {
      className: 'text-primary',
      text: translate('manufacturing.plan.sales_order.a')
    },
    {
      className: 'text-primary',
      text: translate('manufacturing.plan.sales_order.b')
    },
    {
      className: 'text-warning',
      text: translate('manufacturing.plan.sales_order.c')
    },
    {
      className: 'text-dark',
      text: translate('manufacturing.plan.sales_order.d')
    },
    {
      className: 'text-secondary',
      text: translate('manufacturing.plan.sales_order.e')
    },
    {
      className: 'text-success',
      text: translate('manufacturing.plan.sales_order.f')
    },
    {
      className: 'text-danger',
      text: translate('manufacturing.plan.sales_order.g')
    },
    {
      className: 'text-danger',
      text: translate('manufacturing.plan.sales_order.h')
    },
    {
      className: 'text-danger',
      text: translate('manufacturing.plan.sales_order.i')
    }
  ]

  const dataPriority = [
    {
      className: 'text-primary',
      text: translate('manufacturing.plan.sales_order.0.content')
    },
    {
      className: 'text-muted',
      text: translate('manufacturing.plan.sales_order.1.content')
    },
    {
      className: 'text-primary',
      text: translate('manufacturing.plan.sales_order.2.content')
    },
    {
      className: 'text-success',
      text: translate('manufacturing.plan.sales_order.3.content')
    },
    {
      className: 'text-danger',
      text: translate('manufacturing.plan.sales_order.4.content')
    }
  ]

  const handleStartDateChange = (value) => {
    validateStartDateChange(value, true)
  }

  const validateStartDateChange = (value, willUpdateState = true) => {
    let msg = undefined
    const { translate } = props
    if (!value) {
      msg = translate('manufacturing.plan.choose_start_date')
    }
    if (value && endDate) {
      let obj = compareLteDate(value, endDate)
      if (!obj.status) {
        msg = translate('manufacturing.plan.choose_date_error')
      }
    }
    if (willUpdateState) {
      setStartDate(value)
      setStartDateError(msg)
      setEndDateError(msg)
    }
    props.onStartDateChange(value)
    return msg
  }

  const handleEndDateChange = (value) => {
    validateEndDateChange(value, true)
  }

  const validateEndDateChange = (value, willUpdateState = true) => {
    let msg = undefined
    const { translate } = props
    if (value === '') {
      msg = translate('manufacturing.plan.choose_end_date')
    }
    if (value && endDate) {
      let obj = compareLteDate(startDate, value)
      if (!obj.status) {
        msg = translate('manufacturing.plan.choose_date_error')
      }
    }
    if (willUpdateState) {
      setEndDate(value)
      setEndDateError(msg)
      setStartDateError(msg)
    }
    props.onEndDateChange(value)
    return msg
  }

  const handleDescriptionChange = (e) => {
    const { value } = e.target
    props.onDescriptionChange(value)
  }

  const getListSalesOrdersArr = () => {
    const { translate, salesOrders } = props
    let listSalesOrderArr = []
    const { listSalesOrdersWorks } = salesOrders
    if (listSalesOrdersWorks) {
      listSalesOrdersWorks.map((order) => {
        listSalesOrderArr.push({
          value: order._id,
          text: order.code + ' - ' + translate(`manufacturing.plan.sales_order.${order.priority}.content`)
        })
      })
    }
    return listSalesOrderArr
  }

  const handleSalesOrdersChange = (value) => {
    props.onSalesOrdersChange(value)
  }

  const getListApproversArr = () => {
    const { manufacturingPlan } = props
    let listUsersArr = []
    const { listApprovers } = manufacturingPlan
    if (listApprovers) {
      listApprovers.map((approver) => {
        listUsersArr.push({
          value: approver.userId._id,
          text: approver.userId.name + ' - ' + approver.userId.email
        })
      })
    }

    return listUsersArr
  }

  const handleApproversChange = (value) => {
    if (value.length === 0) {
      value = undefined
    }
    validateApproversChange(value, true)
  }

  const validateApproversChange = (value, willUpdateState = true) => {
    let msg = undefined
    const { translate } = props
    if (!value || !value.length) {
      msg = translate('manufacturing.plan.choose_approvers')
    }
    if (willUpdateState) {
      setApprovers(value)
      setErrorApprovers(msg)
    }
    props.onApproversChange(value)
    return msg
  }

  const getAllGoods = () => {
    const { translate, goods } = props
    let listGoods = [
      {
        value: '1',
        text: translate('manufacturing.plan.choose_good_input')
      }
    ]
    const { listGoodsByRole } = goods

    if (listGoodsByRole) {
      listGoodsByRole.map((item) => {
        listGoods.push({
          value: item._id,
          text: item.code + ' - ' + item.name
        })
      })
    }
    return listGoods
  }

  const handleGoodChange = async (value) => {
    const goodId = value[0]
    if (goodId !== '1' && goodId !== currentGoodId) {
      await props.getInventoryByGoodId({array: [value]})
    }
    validateGoodChange(goodId, true)
  }

  const validateGoodChange = (value, willUpdateState = true) => {
    let msg = undefined
    const { translate } = props
    if (value === '1') {
      msg = translate('manufacturing.plan.error_good')
    } 
    if (willUpdateState) {
      const newGood = good
      newGood.goodId = value

      const { goods } = props
      const { listGoodsByRole } = goods
      let goodArrFilter = listGoodsByRole.filter((x) => x._id === newGood.goodId)
      if (goodArrFilter.length) {
        newGood.baseUnit = goodArrFilter[0].baseUnit
        if (lots.currentInventory) {
          newGood.inventory = lots.currentInventory.inventory
        }
      } else {
        newGood.inventory = ''
        newGood.baseUnit = ''
      }
      setGood({...newGood})
      setErrorGood(msg)
      setCurrentGoodId(value)
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
      msg = translate('manufacturing.plan.error_quantity')
    }
    if (value < 1) {
      msg = translate('manufacturing.plan.error_quantity_input')
    }
    if (willUpdateState) {
      good.quantity = value === '' ? value : Number(value)
      setGood({...good})
      setErrorQuantity(msg)
    }
    return msg
  }

  const isGoodValidated = () => {
    if (validateGoodChange(good.goodId, false) || validateQuantityChange(good.quantity, false)) {
      return false
    }
    return true
  }

  const handleClearGood = (e) => {
    e.preventDefault()
    setGood({...EMPTY_GOOD})
    setCurrentGoodId("1")
  }

  const handleAddGood = (e) => {
    e.preventDefault()
    props.onAddGood(good)
    setGood({...EMPTY_GOOD})
    setCurrentGoodId("1")
  }

  const handleEditGood = (good, index) => {
    good.baseUnit = good.good.baseUnit
    good.goodId = good.good._id
    setEditGood(true)
    setGood({...good})
    setIndexEditting(index)
  }

  const handleCancelEditGood = (e) => {
    e.preventDefault()
    setEditGood(false)
    setGood({...EMPTY_GOOD})
    setCurrentGoodId("1")
  }

  const handleSaveEditGood = (e) => {
    e.preventDefault()
    props.onSaveEditGood(good, indexEditting)
    setEditGood(false)
    setGood({...EMPTY_GOOD})
    setCurrentGoodId("1")
  }

  const handleDeleteGood = (index) => {
    props.onDeleteGood(index)
    setGood({...EMPTY_GOOD})
    setCurrentGoodId("1")
    setEditGood(false)
  }

  // Hàm trả về danh sách đơn hàng đã chọn
  const getListSalesOrdersChoosed = (salesOrderIds) => {
    const { salesOrders } = props
    let listSalesOrderChoosed = []
    const { listSalesOrdersWorks } = salesOrders
    if (listSalesOrdersWorks && listSalesOrdersWorks.length) {
      listSalesOrdersWorks.map((x) => {
        if (salesOrderIds.includes(x._id)) {
          listSalesOrderChoosed.push(x)
        }
      })
      return listSalesOrderChoosed
    }
    return []
  }

  const handleShowDetailSalesOrder = async (data) => {
    await props.getPaymentForOrder({ orderId: data._id, orderType: 1 })
    await props.getSalesOrderDetail(data._id)
    await window.$('#modal-detail-sales-order-2').modal('show')
  }

  useEffect(() => {
    if (lots.currentInventory) {
      setGood({...good, inventory: lots.currentInventory.inventory})
    }
  }, [lots])
  
  const listSalesOrdersChoosed = getListSalesOrdersChoosed(salesOrderIds)

  return (
    <React.Fragment>
      <SalesOrderDetailForm modalID={2} />
      <div className='row'>
        <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
          <div className='form-group'>
            <label>
              {translate('manufacturing.plan.code')}
              <span className='text-red'>*</span>
            </label>
            <input type='text' value={code} disabled={true} className='form-control'></input>
          </div>
          <div className='form-group'>
            <label>{translate('manufacturing.plan.sales_order_code')}</label>
            <SelectBox
              id='select-sales-order'
              className='form-control select'
              style={{ width: '100%' }}
              items={getListSalesOrdersArr()}
              onChange={handleSalesOrdersChange}
              value={salesOrderIds}
              multiple={true}
            />
          </div>
          <div className={`form-group ${!errorApprovers ? '' : 'has-error'}`}>
            <label>
              {translate('manufacturing.plan.approvers')}
              <span className='text-red'>*</span>
            </label>
            <SelectBox
              id='select-approvers-of-plan'
              className='form-control select'
              style={{ width: '100%' }}
              items={getListApproversArr()}
              disabled={false}
              onChange={handleApproversChange}
              value={approvers}
              multiple={true}
            />
            <ErrorLabel content={errorApprovers} />
          </div>
        </div>
        <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
          <div className={`form-group ${!startDateError ? '' : 'has-error'}`}>
            <label>
              {translate('manufacturing.plan.start_date')}
              <span className='text-red'>*</span>
            </label>
            <DatePicker
              id={`maintain_after_start_date`}
              value={startDate}
              onChange={handleStartDateChange}
              disabled={false}
            />
            <ErrorLabel content={startDateError} />
          </div>
          <div className={`form-group ${!endDateError ? '' : 'has-error'}`}>
            <label>
              {translate('manufacturing.plan.end_date')}
              <span className='text-red'>*</span>
            </label>
            <DatePicker
              id={`maintain_after_end_date`}
              // dateFormat={dateFormat}
              value={endDate}
              onChange={handleEndDateChange}
              disabled={false}
            />
            <ErrorLabel content={endDateError} />
          </div>
          <div className='form-group'>
            <label>{translate('manufacturing.plan.description')}</label>
            <textarea type='text' value={description} onChange={handleDescriptionChange} className='form-control'></textarea>
          </div>
        </div>
      </div>
      {listSalesOrdersChoosed && listSalesOrdersChoosed.length > 0 && (
        <div className='row'>
          <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
            <fieldset className='scheduler-border'>
              <legend className='scheduler-border'>{translate('manufacturing.plan.list_order')}</legend>
              <table className='table table-striped'>
                <thead>
                  <tr>
                    <th>{translate('manufacturing.plan.index')}</th>
                    <th>{translate('manufacturing.plan.sales_order.code')}</th>
                    <th>{translate('manufacturing.plan.sales_order.creator')}</th>
                    <th>{translate('manufacturing.plan.sales_order.customer')}</th>
                    <th>{translate('manufacturing.plan.sales_order.total_money')}</th>
                    <th>{translate('manufacturing.plan.sales_order.status')}</th>
                    <th>{translate('manufacturing.plan.sales_order.priority')}</th>
                    <th>{translate('manufacturing.plan.sales_order.intend_deliver_good')}</th>
                    <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {listSalesOrdersChoosed.map((x, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{x.code}</td>
                      <td>{x.creator ? x.creator.name : ''}</td>
                      <td>{x.customer ? x.customer.name : ''}</td>
                      <td>{x.paymentAmount ? formatCurrency(x.paymentAmount) + ' VNĐ' : '---'}</td>
                      <td className={dataStatus[x.status].className}>{dataStatus[x.status].text}</td>
                      <td className={dataPriority[x.priority].className}>{dataPriority[x.priority].text}</td>
                      <td>{x.deliveryTime ? formatDate(x.deliveryTime) : '---'}</td>
                      <td>
                        <a
                          style={{ width: '5px' }}
                          title={translate('manufacturing.plan.sales_order.detail_sales_order')}
                          onClick={() => {
                            handleShowDetailSalesOrder(x)
                          }}
                        >
                          <i className='material-icons'>view_list</i>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </fieldset>
          </div>
        </div>
      )}
      {listGoodsSalesOrders.length > 0 && (
        <div className='row'>
          <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
            <fieldset className='scheduler-border'>
              <legend className='scheduler-border'>{translate('manufacturing.plan.sales_order_info')}</legend>
              <table className='table table-striped'>
                <thead>
                  <tr>
                    <th>{translate('manufacturing.plan.index')}</th>
                    <th>{translate('manufacturing.plan.good_code')}</th>
                    <th>{translate('manufacturing.plan.good_name')}</th>
                    <th>{translate('manufacturing.plan.base_unit')}</th>
                    <th>{translate('manufacturing.plan.quantity_good_inventory')}</th>
                    <th>{translate('manufacturing.plan.quantity_order')}</th>
                  </tr>
                </thead>
                <tbody>
                  {listGoodsSalesOrders.map((x, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{x.good.code}</td>
                      <td>{x.good.name}</td>
                      <td>{x.good.baseUnit}</td>
                      <td>{x.inventory}</td>
                      <td>{x.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!addedAllGoods ? (
                <div className='pull-right' style={{ marginBottom: '10px' }}>
                  <button
                    className='btn btn-primary'
                    style={{ marginLeft: '10px' }}
                    onClick={() => {
                      props.onAddAllGood()
                    }}
                  >
                    {translate('manufacturing.plan.add_to_plan')}
                  </button>
                </div>
              ) : (
                <div className='pull-right' style={{ marginBottom: '10px' }}>
                  <button className='btn btn-primary' style={{ marginLeft: '10px' }} disabled={true}>
                    {translate('manufacturing.plan.added_to_plan')}
                  </button>
                </div>
              )}
            </fieldset>
          </div>
        </div>
      )}

      <div className='row'>
        <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
          <fieldset className='scheduler-border'>
            <legend className='scheduler-border'>{translate('manufacturing.plan.add_good_info')}</legend>
            <div className='row'>
              <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
                <div className={`form-group ${!errorGood ? '' : 'has-error'}`}>
                  <label>{translate('manufacturing.plan.choose_good')}</label>
                  <SelectBox
                    id={`select-good-of-plan`}
                    className='form-control select2'
                    style={{ width: '100%' }}
                    value={good.goodId}
                    items={getAllGoods()}
                    onChange={handleGoodChange}
                    multiple={false}
                  />
                  <ErrorLabel content={errorGood} />
                </div>
              </div>
              <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
                <div className={`form-group`}>
                  <label>{translate('manufacturing.plan.quantity_good_inventory')}</label>
                  <input type='number' value={good.inventory} disabled={true} className='form-control' />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
                <div className={`form-group`}>
                  <label>{translate('manufacturing.plan.base_unit')}</label>
                  <input type='text' value={good.baseUnit} disabled={true} className='form-control' />
                </div>
              </div>
              <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
                <div className={`form-group  ${!errorQuantity ? '' : 'has-error'}`}>
                  <label>{translate('manufacturing.plan.quantity')}</label>
                  <input type='number' value={good.quantity} onChange={handleQuantityChange} className='form-control' />
                  <ErrorLabel content={errorQuantity} />
                </div>
              </div>
            </div>
            <div className='pull-right' style={{ marginBottom: '10px' }}>
              {editGood ? (
                <React.Fragment>
                  <button className='btn btn-success' onClick={handleCancelEditGood} style={{ marginLeft: '10px' }}>
                    {translate('manufacturing.purchasing_request.cancel_editing_good')}
                  </button>
                  <button className='btn btn-success' onClick={handleSaveEditGood} style={{ marginLeft: '10px' }}>
                    {translate('manufacturing.purchasing_request.save_good')}
                  </button>
                </React.Fragment>
              ) : (
                <button className='btn btn-success' style={{ marginLeft: '10px' }} disabled={!isGoodValidated()} onClick={handleAddGood}>
                  {translate('manufacturing.purchasing_request.add_good')}
                </button>
              )}
              <button className='btn btn-primary' style={{ marginLeft: '10px' }} onClick={handleClearGood}>
                {translate('manufacturing.purchasing_request.delete_good')}
              </button>
            </div>
          </fieldset>
          <table className='table table-striped'>
            <thead>
              <tr>
                <th>{translate('manufacturing.plan.index')}</th>
                <th>{translate('manufacturing.plan.good_code')}</th>
                <th>{translate('manufacturing.plan.good_name')}</th>
                <th>{translate('manufacturing.plan.base_unit')}</th>
                <th>{translate('manufacturing.plan.quantity_good_inventory')}</th>
                <th>{translate('manufacturing.plan.quantity')}</th>
                <th>{translate('table.action')}</th>
              </tr>
            </thead>
            <tbody>
              {listGoods && listGoods.length === 0 ? (
                <tr>
                  <td colSpan={7}>{translate('general.no_data')}</td>
                </tr>
              ) : (
                listGoods.map((x, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{x.good.code}</td>
                    <td>{x.good.name}</td>
                    <td>{x.good.baseUnit}</td>
                    <td>{x.inventory}</td>
                    <td>{x.quantity}</td>
                    <td>
                      <a href='#abc' className='edit' title={translate('general.edit')} onClick={() => handleEditGood(x, index)}>
                        <i className='material-icons'></i>
                      </a>
                      <a href='#abc' className='delete' title={translate('general.delete')} onClick={() => handleDeleteGood(index)}>
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
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  const { salesOrders, manufacturingPlan, goods, lots, user } = state
  return { salesOrders, manufacturingPlan, goods, lots, user }
}

const mapDispatchToProps = {
  getInventoryByGoodId: LotActions.getInventoryByGoodId,
  getPaymentForOrder: PaymentActions.getPaymentForOrder,
  getSalesOrderDetail: SalesOrderActions.getSalesOrderDetail
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(PlanInfoForm))
