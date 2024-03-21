import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal, SelectBox, ErrorLabel } from '../../../../../common-components'
import { PurchaseOrderActions } from '../redux/actions'

function PurchaseOrderApproveForm(props) {
  const [state, setState] = useState({})

  const validateStatus = (value, willUpdateState = true) => {
    let msg = undefined
    if (!value) {
      msg = 'Giá trị không được để trống'
    } else if (value === 'title') {
      msg = 'Giá trị không được để trống'
    }
    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          statusError: msg
        }
      })
    }
    return msg
  }

  const handleStatusChange = (value) => {
    setState((state) => {
      return {
        ...state,
        status: value[0]
      }
    })
    validateStatus(value[0], true)
  }

  const handleNoteChange = (e) => {
    let { value } = e.target
    setState((state) => {
      return {
        ...state,
        note: value
      }
    })
  }

  const isFormValidated = () => {
    const { status } = state
    if (validateStatus(status, false)) {
      return false
    }

    return true
  }

  const save = async () => {
    const { status, note } = state
    const { purchaseOrderApprove } = props
    const userId = localStorage.getItem('userId')

    let data = { status, note, approver: userId }
    await props.approvePurchaseOrder(purchaseOrderApprove._id, data)
    setState({
      status: 'title',
      note: ''
    })
  }

  const { purchaseOrderApprove } = props
  const { status, note, statusError } = state
  return (
    <DialogModal
      modalID='modal-approve-purchase-order'
      isLoading={false}
      formID='form--approve-purchase-order'
      title={`Phê duyệt đơn : ${purchaseOrderApprove && purchaseOrderApprove.code}`}
      size='25'
      hasSaveButton={true}
      hasNote={false}
      disableSubmit={!isFormValidated()}
      func={save}
    >
      <form id='form--approve-purchase-order'>
        <div className={`form-group ${!statusError ? '' : 'has-error'}`}>
          <label>
            Trạng thái phê duyệt
            <span className='attention'> * </span>
          </label>
          <SelectBox
            id={`select-purchase-order-approve-status`}
            className='form-control select2'
            style={{ width: '100%' }}
            value={status}
            items={[
              { value: 'title', text: '---Chọn thái phê duyệt---' },
              { value: 2, text: 'Phê duyệt đơn' },
              { value: 3, text: 'Hủy đơn' }
            ]}
            onChange={handleStatusChange}
            multiple={false}
          />
          <ErrorLabel content={statusError} />
        </div>
        <div className='form-group'>
          <div className='form-group'>
            <label>
              Ghi chú
              <span className='attention'> </span>
            </label>
            <textarea type='text' className='form-control' value={note} onChange={handleNoteChange} />
          </div>
        </div>
      </form>
    </DialogModal>
  )
}

function mapStateToProps(state) {}

const mapDispatchToProps = {
  approvePurchaseOrder: PurchaseOrderActions.approvePurchaseOrder
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(PurchaseOrderApproveForm))
