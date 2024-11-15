import React, { Component } from 'react'
import { DialogModal } from '../../../../../../../common-components'

function ManufacturingWorksOfGoodDetail(props) {
  const { currentManufacturingWorksOfGood } = props
  return (
    <DialogModal
      modalID='modal-create-sales-order-manufacturing-works-of-good-detail'
      isLoading={false}
      formID='form-create-sales-order-manufacturing-works-of-good-detail'
      title={'Yêu cầu sản xuất'}
      size='50'
      hasSaveButton={false}
      hasNote={false}
    >
      <form id='form-create-sales-order-manufacturing-works-of-good-detail'>
        {!currentManufacturingWorksOfGood ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <i className='fa fa-frown-o text-warning' style={{ fontSize: '20px' }}></i> &ensp;
            <span>Không có cam kết nào cho sản phẩm này</span>
          </div>
        ) : (
          <React.Fragment>
            <div className={`form-group`}>
              <strong>Trạng thái :&emsp;</strong>
              <span className='text-success'>Thiết lập yêu cầu</span>
            </div>
            <div className={`form-group`}>
              <strong>Tên nhà máy :&emsp;</strong>
              {currentManufacturingWorksOfGood.name}
            </div>
            <div className={`form-group`}>
              <strong>Mã nhà máy :&emsp;</strong>
              {currentManufacturingWorksOfGood.code}
            </div>
            <div className={`form-group`}>
              <strong>Địa chỉ nhà máy :&emsp;</strong>
              {currentManufacturingWorksOfGood.address}
            </div>
            <div className={`form-group`}>
              <strong>Mô tả nhà máy :&emsp;</strong>
              {currentManufacturingWorksOfGood.description}
            </div>
          </React.Fragment>
        )}
      </form>
    </DialogModal>
  )
}

export default ManufacturingWorksOfGoodDetail
