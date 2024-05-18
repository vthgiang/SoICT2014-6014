import React, { useState } from 'react'
import { connect } from 'react-redux'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import { RequestActions } from '../../../../common-production/request-management/redux/actions'
import { formatDate, formatToTimeZoneDate } from '../../../../../../helpers/formatDate'
import { DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../../../common-components'
import { generateCode } from '../../../../../../helpers/generateCode'
import { UserActions } from '../../../../../super-admin/user/redux/actions'
import GoodComponentRequest from '../../../../common-production/request-management/components/goodComponent'

function EditForm(props) {
  const [state, setState] = useState({
    code: generateCode('GPR'),
    desiredTime: '',
    description: '',
    listGoods: []
  })

  const handleDesiredTimeChange = (value) => {
    if (value.length === 0) {
      value = ''
    }
    setState({
      ...state,
      desiredTime: value
    })
  }

  const handleDescriptionChange = (e) => {
    const { value } = e.target
    setState({
      ...state,
      description: value
    })
  }

  // phần kho
  const handleStockChange = (value) => {
    let stock = value[0]
    validateStock(stock, true)
  }

  const validateStock = (value, willUpdateState = true) => {
    let msg = undefined
    const { translate } = props
    if (!value) {
      msg = translate('production.request_management.validate_stock')
    }
    if (willUpdateState) {
      setState({
        ...state,
        stock: value,
        errorStock: msg
      })
    }
    return msg === undefined
  }

  const getStock = () => {
    const { stocks, translate } = props
    let stockArr = [{ value: '', text: translate('production.request_management.choose_stock') }]

    stocks.listStocks.map((item) => {
      stockArr.push({
        value: item._id,
        text: item.name
      })
    })

    return stockArr
  }

  // Phần người phê duyệt

  const getApprover = () => {
    let mapOptions = []
    const { user } = props
    if (user) {
      mapOptions = [
        {
          value: 'title', //Title không được chọn
          text: '---Chọn người phê duyệt---'
        }
      ]

      user.list.map((user) => {
        mapOptions.push({
          value: user._id,
          text: user.name
        })
      })
    }
    return mapOptions
  }

  const handleApproverChange = (value) => {
    let approver = value[0]
    validateApprover(approver, true)
  }

  const validateApprover = (value, willUpdateState = true) => {
    let msg = undefined
    const { translate } = props
    if (!value) {
      msg = translate('production.request_management.validate_approver_in_order')
    }
    if (willUpdateState) {
      let approvers = []
      let information = []
      information.push({
        approver: value,
        approvedTime: null
      })
      approvers.push({
        information: information,
        approveType: 3
      })
      setState({
        ...state,
        approver: value,
        approvers: approvers,
        errorApprover: msg
      })
    }
    return msg === undefined
  }

  // phần nhà cung cấp

  const getSuplierOptions = () => {
    let mapOptions = []
    const { list } = props.crm.customers
    if (list) {
      mapOptions = [
        {
          value: 'title', //Title không được chọn
          text: '---Chọn nhà cung cấp---'
        }
      ]
      list.map((item) => {
        mapOptions.push({
          value: item._id,
          text: item.name
        })
      })
    }
    return mapOptions
  }

  const handleSupplierChange = async (value) => {
    validateSupplier(value[0], true)
  }

  const validateSupplier = (value, willUpdateState = true) => {
    let msg = undefined
    if (!value || value === '' || value === 'title') {
      msg = 'Giá trị không được bỏ trống!'
    }
    if (willUpdateState) {
      setState({
        ...state,
        supplier: value,
        supplierError: msg
      })
    }
    return msg
  }

  const isFormValidated = () => {
    let { approver, stock, listGoods } = state
    let result = validateApprover(approver, false) && validateStock(stock, false) && listGoods.length > 0
    return result
  }

  const save = () => {
    if (isFormValidated()) {
      let { listGoods } = state
      let goods = listGoods.map((good) => {
        return {
          good: good.goodId,
          quantity: good.quantity
        }
      })
      const data = {
        code: state.code,
        desiredTime: state.desiredTime,
        description: state.description,
        goods: goods,
        stock: state.stock,
        requestType: 2,
        type: 1,
        status: 1,
        approvers: state.approvers,
        supplier: state.supplier
      }
      props.editRequest(state.requestId, data)
    }
  }

  if (props.requestId !== state.requestId) {
    const { listGoods, goods, translate } = props
    const { listGoodsByType } = goods
    let goodOptions = [
      {
        value: '1',
        text: translate('production.request_management.choose_good')
      }
    ]

    loop: for (let i = 0; i < listGoodsByType.length; i++) {
      for (let j = 0; j < listGoods.length; j++) {
        if (listGoods[j].goodId === listGoodsByType[i]._id) {
          continue loop
        }
      }
      goodOptions.push({
        value: listGoodsByType[i]._id,
        text: listGoodsByType[i].code + ' - ' + listGoodsByType[i].name
      })
    }

    setState({
      ...state,
      requestId: props.requestId,
      code: props.code,
      desiredTime: props.desiredTime,
      description: props.description,
      listGoods: listGoods,
      stock: props.stock,
      status: props.status,
      approver: props.approver,
      supplier: props.supplier,
      errorDescription: undefined,
      errorDesiredTime: undefined,
      goodOptions: goodOptions,
      errorGood: undefined,
      errorQuantity: undefined
    })
  }

  const onHandleGoodChange = (data) => {
    setState({
      ...state,
      listGoods: data
    })
  }

  const { translate, requestManagements } = props
  const {
    requestId,
    code,
    desiredTime,
    errorDesiredTime,
    description,
    errorDescription,
    listGoods,
    errorStock,
    stock,
    errorApprover,
    approver,
    supplier,
    supplierError
  } = state
  const dataStock = getStock()
  const dataApprover = getApprover()
  const dataSupplier = getSuplierOptions()

  return (
    <React.Fragment>
      <DialogModal
        modalID={`modal-edit-request`}
        isLoading={requestManagements.isLoading}
        formID='form-edit-request'
        title={translate('production.request_management.add_request')}
        msg_success={translate('production.request_management.create_successfully')}
        msg_failure={translate('production.request_management.create_failed')}
        func={save}
        disableSubmit={!isFormValidated()}
        size={50}
      >
        <form id={`form-edit-request-${requestId}`}>
          <fieldset className='scheduler-border'>
            <legend className='scheduler-border'>{translate('production.request_management.base_infomation')}</legend>
            <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
              <div className='form-group'>
                <label>
                  {translate('production.request_management.code')}
                  <span className='text-red'>*</span>
                </label>
                <input type='text' disabled={true} value={code} className='form-control'></input>
              </div>

              <div className={`form-group ${!errorStock ? '' : 'has-error'}`}>
                <label>
                  {translate('production.request_management.unit_receiving_request')}
                  <span className='text-red'> * </span>
                </label>
                <SelectBox
                  id={`select-stock-${requestId}`}
                  className='form-control select2'
                  style={{ width: '100%' }}
                  value={stock}
                  items={dataStock}
                  onChange={handleStockChange}
                  multiple={false}
                />
                <ErrorLabel content={errorStock} />
              </div>

              <div className={`form-group ${!supplierError ? '' : 'has-error'}`}>
                <label>
                  {'Nhà cung cấp'}
                  <span className='text-red'> * </span>
                </label>
                <SelectBox
                  id={`select-create-purchase-order-directly-supplier`}
                  className='form-control select2'
                  style={{ width: '100%' }}
                  value={supplier}
                  items={dataSupplier}
                  onChange={handleSupplierChange}
                  multiple={false}
                />
                <ErrorLabel content={supplierError} />
              </div>
            </div>
            <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
              <div className={`form-group ${!errorApprover ? '' : 'has-error'}`}>
                <label>
                  {translate('production.request_management.approver_in_order')}
                  <span className='text-red'> * </span>
                </label>
                <SelectBox
                  id={`select-approver-directly-request`}
                  className='form-control select2'
                  style={{ width: '100%' }}
                  value={approver}
                  items={dataApprover}
                  onChange={handleApproverChange}
                  multiple={false}
                />
                <ErrorLabel content={errorApprover} />
              </div>
              <div className={`form-group ${!errorDesiredTime ? '' : 'has-error'}`}>
                <label>
                  {translate('production.request_management.desiredTime')}
                  <span className='text-red'>*</span>
                </label>
                <DatePicker
                  id={`request-edit-desiredTime-${requestId}`}
                  value={formatDate(desiredTime)}
                  onChange={handleDesiredTimeChange}
                  disabled={false}
                />
                <ErrorLabel content={errorDesiredTime} />
              </div>
            </div>
            <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
              <div className={`form-group`}>
                <label>{translate('production.request_management.description')}</label>
                <textarea type='text' className='form-control' value={description} onChange={handleDescriptionChange} />
              </div>
            </div>
          </fieldset>
          <GoodComponentRequest onHandleGoodChange={onHandleGoodChange} requestId={requestId} listGoods={listGoods} />
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {
  editRequest: RequestActions.editRequest,
  getAllUserOfDepartment: UserActions.getAllUserOfDepartment
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(EditForm))