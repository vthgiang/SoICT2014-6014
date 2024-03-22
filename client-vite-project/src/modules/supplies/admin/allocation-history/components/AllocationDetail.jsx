import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal } from '../../../../../common-components'

function AllocationDetail(props) {
  const [state, setState] = useState({})
  const [prevProps, setPrevProps] = useState({
    _id: null
  })

  const { translate, allocationHistoryReducer } = props
  const { _id, supplies, date, quantity, allocationToOrganizationalUnit, allocationToUser } = state

  if (state._id !== props._id) {
    setState({
      ...state,
      _id: props._id,
      supplies: props.supplies,
      allocationToOrganizationalUnit: props.allocationToOrganizationalUnit,
      quantity: props.quantity,
      allocationToUser: props.allocationToUser,
      date: props.date
    })
    setPrevProps(props)
  }

  // Function format dữ liệu Date thành string
  const formatDate = (date, monthYear = false) => {
    if (!date) return null
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()

    if (month.length < 2) {
      month = '0' + month
    }

    if (day.length < 2) {
      day = '0' + day
    }

    if (monthYear === true) {
      return [month, year].join('-')
    } else {
      return [day, month, year].join('-')
    }
  }

  return (
    <React.Fragment>
      <DialogModal
        size='50'
        modalID='modal-view-allocation'
        isLoading={allocationHistoryReducer.isLoading}
        formID='form-view-allocation'
        title={translate('supplies.general_information.view_allocation')}
        hasSaveButton={false}
      >
        {/* Ngày cấp */}
        <div className='form-group'>
          <strong>{translate('supplies.allocation_management.date')}&emsp; </strong>
          {formatDate(date)}
        </div>

        {/* Tên vật tư */}
        <div className='form-group'>
          <strong>{translate('supplies.allocation_management.supplies')}&emsp; </strong>
          {supplies && supplies.suppliesName}
        </div>

        {/* Số lượng */}
        <div className='form-group'>
          <strong>{translate('supplies.allocation_management.quantity')}&emsp; </strong>
          {quantity}
        </div>

        {/* Đơn vị đc cấp */}
        <div className='form-group'>
          <strong>{translate('supplies.allocation_management.allocationToOrganizationalUnit')}&emsp; </strong>
          {allocationToOrganizationalUnit && allocationToOrganizationalUnit.name}
        </div>
        {/* Người dùng đc cấp */}
        <div className='form-group'>
          <strong>{translate('supplies.allocation_management.allocationToUser')}&emsp; </strong>
          {allocationToUser && allocationToUser.email}
        </div>
      </DialogModal>
    </React.Fragment>
  )
}

function mapState(state) {
  const { allocationHistoryReducer } = state
  return { allocationHistoryReducer }
}
const actions = {}

const detailAllocation = connect(mapState, actions)(withTranslate(AllocationDetail))
export { detailAllocation as AllocationDetail }
