import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { CrmStatusActions } from '../../status/redux/actions'
import { DialogModal, ErrorLabel } from '../../../../common-components'
import { CrmCareTypeActions } from '../../careType/redux/action'
import { CrmCustomerRankPointActions } from '../../customerRankPoint/redux/action'

function CustomerRankPointEditForm(props) {
  const { translate, data } = props
  const { name, description, _id, point } = data

  const [customerRankPointEdit, setCustomerRankPointEdit] = useState({ id: _id, name, description, point })

  if (customerRankPointEdit.id != data._id) {
    setCustomerRankPointEdit({ id: data._id, name: data.name, description: data.description, point: point })
  }
  const handleChangeName = async (e) => {
    const { value } = e.target
    await setCustomerRankPointEdit({ ...customerRankPointEdit, name: value })
  }

  const handleChangeDescription = async (e) => {
    const { value } = e.target
    await setCustomerRankPointEdit({ ...customerRankPointEdit, description: value })
  }
  const handleChangePoint = async (e) => {
    const { value } = e.target
    await setCustomerRankPointEdit({ ...customerRankPointEdit, point: value })
  }

  const save = () => {
    props.editCustomerRankPoint(customerRankPointEdit.id, customerRankPointEdit)
  }

  return (
    <React.Fragment>
      <DialogModal
        modalID={`modal-crm-customer-rankPoint-edit`}
        isLoading={false}
        formID='form-crm-customer-rankPoint-edit'
        title='Chỉnh sửa phân hạng khách hàng'
        func={save}
        size={50}
        // disableSubmit={!this.isFormValidated()}
      >
        {/* Form chỉnh sửa trạng thái khách hàng */}
        <form id='form-crm-customer-rankPoint-edit'>
          {/* Tên  */}
          <div className={`form-group`}>
            <label>
              {'Tên phân hạng khách hàng'}
              <span className='attention'> * </span>
            </label>
            <input
              type='text'
              className='form-control'
              value={customerRankPointEdit.name ? customerRankPointEdit.name : ''}
              onChange={handleChangeName}
            />
            {/* <ErrorLabel content={groupCodeEditFormError} /> */}
          </div>
          {/* Số điểm tối thiểu  */}
          <div className={`form-group`}>
            <label>
              {'Số điểm tối thiểu'}
              <span className='attention'> * </span>
            </label>
            <input
              type='number'
              className='form-control'
              value={customerRankPointEdit.point ? customerRankPointEdit.point : ''}
              onChange={handleChangePoint}
            />
            {/* <ErrorLabel content={groupCodeEditFormError} /> */}
          </div>

          {/* Mô tả */}
          <div className={`form-group`}>
            <label>
              {'Mô tả phân nhóm khách hàng'}
              <span className='attention'> * </span>
            </label>
            <input
              type='text'
              className='form-control'
              value={customerRankPointEdit.description ? customerRankPointEdit.description : ''}
              onChange={handleChangeDescription}
            />
            {/* <ErrorLabel content={groupNameEditFormError} /> */}
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

const mapDispatchToProps = {
  editCustomerRankPoint: CrmCustomerRankPointActions.editCustomerRankPoint
}

export default connect(null, mapDispatchToProps)(withTranslate(CustomerRankPointEditForm))
