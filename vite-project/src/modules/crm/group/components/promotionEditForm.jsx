import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { translate } from 'react-redux-multilingual/lib/utils'
import { ConfirmNotification, DataTableSetting, SelectBox, DatePicker, DialogModal } from '../../../../common-components'
import { formatFunction } from '../../common'
import { CrmGroupActions } from '../redux/actions'

function PromotionEditForm(props) {
  const { groupId, groupPromotionEdit, crm } = props
  const [promotionEdit, setPromotionEdit] = useState()

  // Lấy danh sách thành viên trong nhóm ở store
  let allMembersGroup
  if (crm?.groups?.membersInGroup) {
    allMembersGroup = crm.groups.membersInGroup
  }

  // Viết lại danh sách nhóm cho đúng định dạng để biểu diễn
  allMembersGroup = allMembersGroup.map((e) => {
    return {
      value: e._id,
      text: e.name
    }
  })

  if (!promotionEdit || !promotionEdit.code || promotionEdit.code != groupPromotionEdit.code) {
    setPromotionEdit({ ...groupPromotionEdit })
  }

  // Danh sách các khách hàng ko được hưởng khuyến mãi đó có từ trước khi edit
  let exceptCustomer
  if (promotionEdit && promotionEdit.exceptCustomer) {
    exceptCustomer = promotionEdit.exceptCustomer.map((e) => {
      return {
        value: e._id,
        text: e.name
      }
    })
  }

  // Các hàm thay đổi giá trị các trường thông tin
  const handleChangeValue = async (e) => {
    const value = e.target.value
    setPromotionEdit({ ...promotionEdit, value: value })
  }

  const handleChangeMinimumOrderValue = async (e) => {
    const value = e.target.value
    await setPromotionEdit({ ...promotionEdit, minimumOrderValue: value })
  }

  const handleChangePromotionalValueMax = async (e) => {
    const value = e.target.value
    await setPromotionEdit({ ...promotionEdit, promotionalValueMax: value })
  }

  const handleChangeExpirationDate = async (value) => {
    await setPromotionEdit({ ...promotionEdit, expirationDate: value })
  }

  const handleChangeDescription = async (e) => {
    const value = e.target.value
    await setPromotionEdit({ ...promotionEdit, description: value })
  }

  const handleChangeExceptCustomer = async (value) => {
    await setPromotionEdit({ ...promotionEdit, exceptCustomer: value })
  }

  const save = async () => {
    if (promotionEdit) {
      await props.editPromotion(groupId, { promotion: { ...promotionEdit } })
      // Gọi api để load lại dữ liệu của component cha
      await props.getRefreshData()
    }
  }

  return (
    <DialogModal
      modalID='modal-crm-group-promotion-edit'
      formID='form-crm-group-promotion-edit'
      title={'Chỉnh sửa khuyến mãi nhóm khách hàng'}
      func={save}
      size={50}
    >
      <form id='form-crm-group-promotion-edit' className='qlcv'>
        <div className='row'>
          <div className='col-md-12'>
            <div className={`form-group`}>
              <label style={{ marginRight: '10px' }}>Tên nhóm khách hàng:</label>
              {crm.groups.groupById.groupById && <strong> {crm.groups.groupById.groupById.name}</strong>}
            </div>
          </div>
        </div>
        {promotionEdit && (
          <>
            <div className={`form-group}`}>
              <label>
                {'Giá trị khuyến mại (%)'}
                <span className='text-red'>*</span>
              </label>
              <input type='number' className='form-control' value={promotionEdit.value} onChange={handleChangeValue} />
            </div>

            <div className={`form-group}`}>
              <label>
                {'Giá trị đơn hàng tối thiểu (VNĐ) '}
                <span className='text-red'>*</span>
              </label>
              <input
                type='number'
                className='form-control'
                value={promotionEdit.minimumOrderValue}
                onChange={handleChangeMinimumOrderValue}
              />
            </div>

            <div className={`form-group}`}>
              <label>
                {'Giá trị giảm tối đa (VNĐ) '}
                <span className='text-red'>*</span>
              </label>
              <input
                type='number'
                className='form-control'
                value={promotionEdit.promotionalValueMax}
                onChange={handleChangePromotionalValueMax}
              />
            </div>

            <div className='form-group'>
              <label>{'Ngày hết hạn'}</label>
              <DatePicker
                id='start-date-form-promotion-edit'
                onChange={handleChangeExpirationDate}
                value={formatFunction.formatDate(promotionEdit.expirationDate)}
                disabled={false}
              />
            </div>

            <div className={`form-group}`}>
              <label>
                {'Mô tả  '}
                <span className='text-red'>*</span>
              </label>
              <textarea type='text' className='form-control' value={promotionEdit.description} onChange={handleChangeDescription} />
            </div>

            <div className='form-group'>
              <label className='control-label'>{'Áp dụng với nhóm khách hàng ngoại trừ:'}</label>
              {allMembersGroup && (
                <SelectBox
                  id={`edit-form`}
                  className='form-control select2'
                  style={{ width: '100%' }}
                  items={allMembersGroup}
                  onChange={handleChangeExceptCustomer}
                  value={exceptCustomer}
                  multiple={true}
                  options={{ placeholder: 'Ngoại trừ' }}
                />
              )}
            </div>
          </>
        )}
      </form>
    </DialogModal>
  )
}

function mapStateToProps(state) {
  const { crm, group } = state
  return { crm, group }
}

const mapDispatchToProps = {
  editPromotion: CrmGroupActions.editPromotion
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(PromotionEditForm))
