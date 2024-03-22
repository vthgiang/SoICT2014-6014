import React, { useState, useEffect } from 'react'
import { withTranslate } from 'react-redux-multilingual'
import { connect } from 'react-redux'
import { SelectBox, ErrorLabel } from '../../../../../../common-components'
import { generateCode } from '../../../../../../helpers/generateCode'
import { LotActions } from '../../../inventory-management/redux/actions'
import { BillActions } from '../../../bill-management/redux/actions'
import { GoodActions } from '../../../../common-production/good-management/redux/actions'
import GoodBaseInformationComponent from '../../components/genaral/goodBaseInformationComponent'
import { RequestActions } from '../../../../common-production/request-management/redux/actions'
import { datasBillType } from '../genaral/config'

function BaseInformationComponent(props) {
  const EMPTY_GOOD = {
    good: '',
    quantity: 0,
    returnQuantity: 0,
    damagedQuantity: 0,
    realQuantity: 0,
    description: '',
    lots: [],
    group: 1,
    isHaveDataStep1: 0
  }

  const [state, setState] = useState({
    currentRole: localStorage.getItem('currentRole'),
    code: generateCode('BIRE'),
    listGood: [],
    good: Object.assign({}, EMPTY_GOOD),
    customer: '',
    status: '1',
    fromStock: '',
    toStock: '',
    type: '',
    description: ''
  })

  const handleDescriptionChange = (e) => {
    let value = e.target.value
    setState({
      ...state,
      description: value
    })
  }

  // Nguồn gốc hàng hóa

  const handleBillTypeChange = (value) => {
    validateBillTypeProduct(value[0], true)
  }

  const validateBillTypeProduct = (value, willUpdateState = true) => {
    let msg = undefined
    const { translate } = props
    if (value === '0') {
      msg = translate('manage_warehouse.good_management.validate_source_product')
    }
    if (willUpdateState) {
      setState({
        ...state,
        errorOnBillType: msg,
        type: value
      })
    }
    return msg === undefined
  }

  // Phần kho

  const getFromStock = () => {
    const { stocks, translate } = props
    let stockArr = [{ value: '', text: translate('manage_warehouse.bill_management.choose_stock') }]
    stocks.listStocks.map((item) => {
      let checkIncludeRole = 0
      item.managementLocation.forEach((item2) => {
        if (item2.role.id === state.currentRole) {
          checkIncludeRole++
        }
      })
      if (checkIncludeRole > 0) {
        stockArr.push({
          value: item._id,
          text: item.name
        })
      }
    })

    return stockArr
  }

  const handleStockChange = (value) => {
    let fromStock = value[0]
    validateStock(fromStock, true)
  }

  const validateStock = (value, willUpdateState = true) => {
    let msg = undefined
    const { translate } = props
    if (!value) {
      msg = translate('manage_warehouse.bill_management.validate_stock')
    }
    if (willUpdateState) {
      setState({
        ...state,
        fromStock: value,
        errorFromStock: msg
      })
    }
    return msg === undefined
  }

  const getToStock = () => {
    const { stocks, translate } = props
    let stockArr = [{ value: '', text: translate('manage_warehouse.bill_management.choose_stock') }]
    stocks.listStocks.map((item) => {
      if (item._id !== state.fromStock) {
        stockArr.push({
          value: item._id,
          text: item.name
        })
      }
    })

    return stockArr
  }

  const handleToStockChange = (value) => {
    let toStock = value[0]
    validateToStock(toStock, true)
  }

  const validateToStock = (value, willUpdateState = true) => {
    let msg = undefined
    const { translate } = props
    if (!value) {
      msg = translate('manage_warehouse.bill_management.validate_stock')
    }
    if (willUpdateState) {
      setState({
        ...state,
        toStock: value,
        errorToStock: msg
      })
    }
    return msg === undefined
  }

  // Nhà cung cấp

  const getSupplier = () => {
    const { crm, translate } = props
    let supplierArr = [{ value: '', text: translate('manage_warehouse.bill_management.choose_supplier') }]

    crm.customers.list.map((item) => {
      supplierArr.push({
        value: item._id,
        text: item.name
      })
    })
    return supplierArr
  }

  const handleSupplierChange = (value) => {
    let supplier = value[0]
    validateSupplier(supplier, true)
  }

  const validateSupplier = (value, willUpdateState = true) => {
    let msg = undefined
    const { translate } = props
    if (!value) {
      msg = translate('manage_warehouse.bill_management.validate_customer')
    }
    if (willUpdateState) {
      setState({
        ...state,
        supplier: value,
        errorSuppler: msg
      })
    }
    return msg === undefined
  }

  // Phần nhà máy sản xuất

  const getListWorks = () => {
    const { translate, manufacturingWorks } = props
    let listWorksArray = [
      {
        value: '',
        text: translate('production.request_management.choose_manufacturing_works')
      }
    ]

    const { listWorks } = manufacturingWorks

    if (listWorks) {
      listWorks.map((item) => {
        listWorksArray.push({
          value: item._id,
          text: item.name,
          organizationalUnit: item.organizationalUnit._id
        })
      })
    }
    return listWorksArray
  }

  const handleManufacturingWorksChange = (value) => {
    const worksValue = value[0]
    validateManufacturingWorks(worksValue, true)
  }

  const validateManufacturingWorks = (value, willUpdateState) => {
    let msg = undefined
    const { translate } = props
    if (value === undefined || value === '') {
      msg = translate('production.request_management.validate_manufacturing_works')
    }
    if (willUpdateState) {
      setState({
        ...state,
        worksValue: value,
        worksValueError: msg,
        teamLeaderValue: '',
        supplier: ''
      })
    }
    return msg === undefined
  }

  // Phần đơn yêu cầu

  const getRequest = () => {
    const { translate, requestManagements } = props
    let requestArr = [{ value: '', text: 'Chọn yêu cầu' }]
    if (requestManagements.listRequests) {
      requestManagements.listRequests.map((item) => {
        requestArr.push({
          value: item._id,
          text: item.code
        })
      })
    }
    return requestArr
  }

  const handleRequestChange = (value) => {
    const requestValue = value[0]
    validateRequest(requestValue, true)
  }

  const validateRequest = (value, willUpdateState) => {
    let msg = undefined
    const { requestManagements } = props
    if (value === undefined || value === '') {
      msg = 'Bạn phải chọn yêu cầu'
    }
    if (willUpdateState) {
      let request = requestManagements.listRequests.find((element) => element._id === value)
      setState({
        ...state,
        requestValue: value,
        requestValueError: msg,
        listGood: request.goods,
        fromStock: state.type !== '3' ? request.stock._id : request.toStock._id,
        toStock: state.type !== '3' ? '' : request.stock._id,
        worksValue: request.manufacturingWork ? request.manufacturingWork._id : '',
        supplier: request.supplier ? request.supplier._id : '',
        sourceType: request.supplier ? '2' : '1',
        requestId: request._id
      })
    }
    return msg === undefined
  }

  // Phần hàng hóa

  const handleGoodChange = (data) => {
    setState({
      ...state,
      listGood: data
    })
  }

  // Phần dữ liệu

  if (props.isHaveDataStep1 !== state.isHaveDataStep1) {
    setState({
      ...state,
      fromStock: props.fromStock,
      toStock: props.toStock,
      code: props.code,
      type: props.type,
      listGood: props.listGood,
      worksValue: props.manufacturingWork,
      requestValue: props.requestValue,
      supplier: props.supplier,
      description: props.description,
      isHaveDataStep1: props.isHaveDataStep1
    })
  }

  useEffect(() => {
    if (state.type !== '3') props.getAllRequestByCondition({ requestType: 3, type: 1, requestFrom: 'stock' })
    else props.getAllRequestByCondition({ requestType: 3, type: 4, requestFrom: 'stock' })
  }, [state.type])

  useEffect(() => {
    if (isFormValidated()) {
      let data = {
        code: state.code,
        fromStock: state.fromStock,
        toStock: state.toStock,
        group: state.group,
        type: state.type,
        listGood: state.listGood,
        manufacturingWork: state.worksValue,
        requestValue: state.requestValue,
        supplier: state.supplier,
        description: state.description
      }
      props.onDataChange(data)
    }
  }, [state.fromStock, state.toStock, state.worksValue, state.type, state.supplier, state.listGood, state.description, state.requestValue])

  const isFormValidated = () => {
    let { fromStock, listGood } = state
    let result =
      validateStock(fromStock, false) &&
      validateBillTypeProduct(state.type, false) &&
      (validateManufacturingWorks(state.worksValue, false) || validateSupplier(state.supplier, false)) &&
      listGood.length > 0
    return result
  }

  const { translate, createType } = props
  const {
    listGood,
    good,
    code,
    supplier,
    worksValue,
    fromStock,
    toStock,
    errorFromStock,
    errorToStock,
    errorType,
    errorSupplier,
    worksValueError,
    errorOnBillType,
    type,
    description,
    requestValue,
    errorOnRequest,
    isHaveDataStep1
  } = state

  const dataBillType = datasBillType.goodReceiptBillType()

  const dataCustomer = getSupplier()
  const dataManufacturingWorks = getListWorks()
  const dataFromStock = getFromStock()
  const dataToStock = getToStock()
  const dataRequest = getRequest()
  return (
    <React.Fragment>
      <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
        <fieldset className='scheduler-border'>
          <legend className='scheduler-border'>{translate('manage_warehouse.bill_management.infor')}</legend>
          <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
            <div className={`form-group`}>
              <label>{translate('manage_warehouse.bill_management.code')}</label>
              <input type='text' className='form-control' value={code} disabled />
            </div>
            <div className={`form-group ${!errorToStock ? '' : 'has-error'}`}>
              <label>
                {'Chọn kho'}
                <span className='text-red'> * </span>
              </label>
              <SelectBox
                id={`select-from-stock-bill-receipt-create`}
                className='form-control select2'
                style={{ width: '100%' }}
                value={fromStock}
                items={dataFromStock}
                onChange={handleStockChange}
                multiple={false}
                disabled={createType === 2 || createType === 3}
              />
              <ErrorLabel content={errorToStock} />
            </div>
          </div>
          <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
            <div className={`form-group ${!errorOnBillType ? '' : 'has-error'}`}>
              <label>{'Loại phiếu'}</label>
              <span className='text-red'> * </span>
              <SelectBox
                id={`select-source-type`}
                className='form-control select2'
                style={{ width: '100%' }}
                value={type}
                items={dataBillType}
                onChange={handleBillTypeChange}
                multiple={false}
              />
              <ErrorLabel content={errorOnBillType} />
            </div>
            {createType === 2 && (
              <div className={`form-group ${!errorOnRequest ? '' : 'has-error'}`}>
                <label>{'Phiếu yêu cầu'}</label>
                <span className='text-red'> * </span>
                <SelectBox
                  id={`select-request`}
                  className='form-control select2'
                  style={{ width: '100%' }}
                  value={requestValue}
                  items={dataRequest}
                  onChange={handleRequestChange}
                  multiple={false}
                />
                <ErrorLabel content={errorOnRequest} />
              </div>
            )}
            {type == '3' && (
              <div className={`form-group ${!errorToStock ? '' : 'has-error'}`}>
                <label>
                  {'Kho gửi hàng đến'}
                  <span className='text-red'> * </span>
                </label>
                <SelectBox
                  id={`select-to-stock-bill-receipt-create`}
                  className='form-control select2'
                  style={{ width: '100%' }}
                  value={toStock}
                  items={dataToStock}
                  onChange={handleToStockChange}
                  multiple={false}
                  disabled={createType === 2 || createType === 3}
                />
                <ErrorLabel content={errorToStock} />
              </div>
            )}
            {type === '2' ? (
              <div className={`form-group ${!errorSupplier ? '' : 'has-error'}`}>
                <label>
                  {translate('manage_warehouse.bill_management.supplier')}
                  <span className='text-red'> * </span>
                </label>
                <SelectBox
                  id={`select-customer-receipt-create`}
                  className='form-control select2'
                  style={{ width: '100%' }}
                  value={supplier}
                  items={dataCustomer}
                  onChange={handleSupplierChange}
                  multiple={false}
                  disabled={createType === 2 || createType === 3}
                />
                <ErrorLabel content={errorSupplier} />
              </div>
            ) : null}
            {type === '1' ? (
              <div className={`form-group ${!worksValueError ? '' : 'has-error'}`}>
                <label>
                  {translate('production.request_management.manufacturing_works')}
                  <span className='text-red'>*</span>
                </label>
                <SelectBox
                  id={`select-works`}
                  className='form-control select2'
                  style={{ width: '100%' }}
                  value={worksValue}
                  items={dataManufacturingWorks}
                  onChange={handleManufacturingWorksChange}
                  multiple={false}
                  disabled={createType === 2 || createType === 3}
                />
                <ErrorLabel content={worksValueError} />
              </div>
            ) : null}
          </div>
          <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
            <div className='form-group'>
              <label>{translate('manage_warehouse.bill_management.description')}</label>
              <textarea type='text' className='form-control' value={description} onChange={handleDescriptionChange} />
            </div>
          </div>
        </fieldset>
      </div>
      <GoodBaseInformationComponent
        group={'1'}
        isHaveDataStep1={isHaveDataStep1}
        listGood={listGood}
        createType={createType}
        onDataChange={handleGoodChange}
      />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {
  getLotsByGood: LotActions.getLotsByGood,
  createBill: BillActions.createBill,
  getGoodsByType: GoodActions.getGoodsByType,
  getAllRequestByCondition: RequestActions.getAllRequestByCondition
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(BaseInformationComponent))
