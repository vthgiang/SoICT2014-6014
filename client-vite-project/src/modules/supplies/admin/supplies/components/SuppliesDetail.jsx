import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal } from '../../../../../common-components'
import { AllocationTab } from '../../../base/detail-tab/allocationTab'
import { PurchaseInvoiceTab } from '../../../base/detail-tab/purchaseInvoiceTab'
import { SuppliesGeneralTab } from '../../../base/detail-tab/suppliesGeneralTab'

function SuppliesDetail(props) {
  const [state, setState] = useState({})
  const [prevProps, setPrevProps] = useState({
    _id: null
  })

  const { translate, suppliesReducer } = props
  const { _id, code, suppliesName, totalAllocation, totalPurchase, price } = state

  if (state._id !== props._id) {
    setState({
      ...state,
      _id: props._id,
      code: props.code,
      suppliesName: props.suppliesName,
      totalAllocation: props.totalAllocation,
      totalPurchase: props.totalPurchase,
      price: props.price
    })
    setPrevProps(props)
  }

  return (
    <React.Fragment>
      <DialogModal
        size='75'
        modalID='modal-view-supplies'
        isLoading={suppliesReducer.isLoading}
        formID='form-view-supplies'
        title={translate('supplies.general_information.view_supplies')}
        hasSaveButton={false}
      >
        <div className='nav-tabs-custom'>
          {/* Nav-tabs */}
          <ul className='nav nav-tabs'>
            <li className='active'>
              <a
                title={translate('supplies.general_information.supplies_information')}
                data-toggle='tab'
                href={`#view_supplies_general${_id}`}
              >
                {translate('supplies.general_information.supplies_information')}
              </a>
            </li>
            <li>
              <a
                title={translate('supplies.general_information.invoice_information')}
                data-toggle='tab'
                href={`#view_purchase_infor${_id}`}
              >
                {translate('supplies.general_information.invoice_information')}
              </a>
            </li>
            <li>
              <a
                title={translate('supplies.general_information.allocation_information')}
                data-toggle='tab'
                href={`#view_allocation_infor${_id}`}
              >
                {translate('supplies.general_information.allocation_information')}
              </a>
            </li>
          </ul>
          <div className='tab-content'>
            {/* Thông tin chung */}
            <SuppliesGeneralTab
              id={`view_supplies_general${_id}`}
              code={code}
              suppliesName={suppliesName}
              totalPurchase={totalPurchase}
              price={price}
              totalAllocation={totalAllocation}
            />

            <PurchaseInvoiceTab id={`view_purchase_infor${_id}`} />

            <AllocationTab id={`view_allocation_infor${_id}`} />
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
const actions = {}

const detailSupplies = connect(mapState, actions)(withTranslate(SuppliesDetail))
export { detailSupplies as SuppliesDetail }
