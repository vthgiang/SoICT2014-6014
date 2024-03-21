import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal } from '../../../../../common-components'
import { AllocationTab } from '../../../base/create-tab/components/allocationTab'
import { PurchaseInvoiceTab } from '../../../base/create-tab/components/purchaseInvoiceTab'
import { SuppliesTab } from '../../../base/create-tab/components/suppliesTab'
import { SuppliesActions } from '../redux/actions'

function SuppliesEditForm(props) {
  const [state, setState] = useState({})

  const [prevProps, setPrevProps] = useState({
    _id: null
  })

  const { translate, suppliesReducer } = props
  const { _id, code, suppliesName, totalPurchase, totalAllocation, price, listPurchaseInvoice, listAllocation } = state

  // Function lưu các trường thông tin vào state
  const handleChange = (name, value) => {
    setState({
      ...state,
      [name]: value
    })
  }

  // Function thêm hoa don
  const handleCreatePurchaseInvoice = (data, addData) => {
    setState({
      ...state,
      listPurchaseInvoice: data
    })
  }

  // Function chỉnh sửa hoas don
  const handleUpdatePurchaseInvoice = (data, editData) => {
    if (editData._id) {
      setState({
        ...state,
        updateInvoices: [...state.updateInvoices, editData]
      })
    } else {
      setState({
        ...state,
        listPurchaseInvoice: data
      })
    }
  }

  // Function xoá hoa don
  const handleDeletePurchaseInvoice = (data, deleteData) => {
    if (deleteData._id) {
      setState({
        ...state,
        deleteInvoices: [...state.deleteInvoices, deleteData],
        updateInvoices: state.updateInvoices.filter((x) => x._id !== deleteData._id)
      })
    } else {
      setState({
        ...state,
        listPurchaseInvoice: data
      })
    }
  }

  // Function thêm thong tin cap phat
  const handleCreateAllocation = (data, addData) => {
    setState({
      ...state,
      listAllocation: data
    })
  }

  // Function chỉnh sửa thong tin cap phat
  const handleUpdateAllocation = (data, editData) => {
    if (editData._id) {
      setState({
        ...state,
        updateAllocations: [...state.updateAllocations, editData]
      })
    } else {
      setState({
        ...state,
        listAllocation: data
      })
    }
  }

  // Function xoá thong tin cap phat
  const handleDeleteAllocation = (data, deleteData) => {
    if (deleteData._id) {
      setState({
        ...state,
        deleteAllocations: [...state.deleteAllocations, deleteData],
        updateAllocations: state.updateAllocations.filter((x) => x._id !== deleteData._id)
      })
    } else {
      setState({
        ...state,
        listAllocation: data
      })
    }
  }

  // function kiểm tra các trường bắt buộc phải nhập
  const validatorInput = (value) => {
    if (value && value.length > 0) {
      return true
    } else {
      return false
    }
  }

  // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
  const isFormValidated = () => {
    let { code, suppliesName, totalAllocation, totalPurchase, price } = state
    if (state !== {}) {
      let result = validatorInput(code) && validatorInput(suppliesName) && totalPurchase >= 0 && totalAllocation >= 0 && price >= 0

      return result
    }
    return true
  }

  const save = async () => {
    let {
      _id,
      code,
      suppliesName,
      totalAllocation,
      totalPurchase,
      price,
      deleteAllocations,
      updateAllocations,
      deleteInvoices,
      updateInvoices
    } = state

    const createInvoices = listPurchaseInvoice ? listPurchaseInvoice.filter((x) => !x._id) : []
    const createAllocations = listAllocation ? listAllocation.filter((x) => !x._id) : []

    const data = {
      suppliesUpdate: {
        _id: _id,
        code: code,
        suppliesName: suppliesName,
        totalAllocation: totalAllocation,
        totalPurchase: totalPurchase,
        price: price
      },
      createAllocations,
      createInvoices,
      updateAllocations,
      updateInvoices,
      deleteAllocations,
      deleteInvoices
    }
    props.updateSupplies(_id, data)
  }

  if (prevProps._id !== props._id) {
    setState({
      ...state,
      _id: props._id,
      code: props.code,
      suppliesName: props.suppliesName,
      totalPurchase: props.totalPurchase,
      totalAllocation: props.totalAllocation,
      price: props.price,
      listPurchaseInvoice: props.listPurchaseInvoice,
      listAllocation: props.listAllocation,

      updateInvoices: [],
      deleteInvoices: [],
      deleteAllocations: [],
      updateAllocations: [],

      errorOnCode: undefined,
      errorOnSuppliesName: undefined,
      errorOnTotalPurchase: undefined,
      errorOnTotalAllocation: undefined,
      errorOnPrice: undefined
    })
    setPrevProps(props)
  }

  return (
    <React.Fragment>
      <DialogModal
        size='75'
        modalID='modal-edit-supplies'
        isLoading={suppliesReducer.isLoading}
        formID='form-edit-supplies'
        title={translate('supplies.general_information.edit_supplies')}
        func={save}
        disableSubmit={!isFormValidated()}
      >
        <div className='nav-tabs-custom' style={{ marginTop: '-15px' }}>
          {/* Nav-tabs */}
          <ul className='nav nav-tabs'>
            <li className='active'>
              <a title={translate('supplies.general_information.supplies_information')} data-toggle='tab' href={`#edit_supplies${_id}`}>
                {translate('supplies.general_information.supplies_information')}
              </a>
            </li>
            <li>
              <a title={translate('supplies.general_information.invoice_information')} data-toggle='tab' href={`#edit_invoice${_id}`}>
                {translate('supplies.general_information.invoice_information')}
              </a>
            </li>
            <li>
              <a title={translate('supplies.general_information.allocation_information')} data-toggle='tab' href={`#edit_allocation${_id}`}>
                {translate('supplies.general_information.allocation_information')}
              </a>
            </li>
          </ul>

          <div className='tab-content'>
            {/* Thông tin chung */}
            <SuppliesTab
              id={`edit_supplies${_id}`}
              code={code}
              suppliesName={suppliesName}
              totalPurchase={totalPurchase}
              totalAllocation={totalAllocation}
              price={price}
              handleChange={handleChange}
            />

            {/* Thông tin hoa don*/}
            <PurchaseInvoiceTab
              id={`edit_invoice${_id}`}
              purchaseInvoice={listPurchaseInvoice}
              handleAddPurchaseInvoice={handleCreatePurchaseInvoice}
              handleEditPurchaseInvoice={handleUpdatePurchaseInvoice}
              handleDeletePurchaseInvoice={handleDeletePurchaseInvoice}
            />

            {/* Thông tin cap phat */}
            <AllocationTab
              id={`edit_allocation${_id}`}
              allocationHistory={listAllocation}
              handleAddAllocation={handleCreateAllocation}
              handleEditAllocation={handleUpdateAllocation}
              handleDeleteAllocation={handleDeleteAllocation}
            />
          </div>
        </div>
      </DialogModal>
    </React.Fragment>
  )
}

function mapState(state) {
  const { suppliesReducer } = state
  return { suppliesReducer }
}

const actionCreators = {
  updateSupplies: SuppliesActions.updateSupplies
}
const editForm = connect(mapState, actionCreators)(withTranslate(SuppliesEditForm))
export { editForm as SuppliesEditForm }
