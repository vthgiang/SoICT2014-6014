import React, { Component } from 'react'
import { DialogModal } from '../../../../../../common-components'

function SlasOfGoodDetail(props) {
  const { slasOfGoodDetail } = props
  return (
    <DialogModal
      modalID='modal-quote-detail-slas-of-good'
      isLoading={false}
      formID='form-quote-detail-slas-of-good'
      title={'Chi tiết cam kết chất lượng'}
      size='50'
      hasSaveButton={false}
      hasNote={false}
    >
      <form id='form-quote-detail-slas-of-good'>
        {!slasOfGoodDetail.length ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <i className='fa fa-frown-o text-warning' style={{ fontSize: '20px' }}></i> &ensp;
            <span>Không có cam kết nào cho sản phẩm này</span>
          </div>
        ) : (
          slasOfGoodDetail.map((item) => (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 600
                }}
              >
                <i className='fa fa-check-square-o text-success'></i>&ensp;
                <div>{item.title}</div>
              </div>

              {item.descriptions.map((des) => (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '5px 0px 5px 20px'
                  }}
                >
                  <i className='fa fa-genderless text-success'></i>&ensp;
                  <div>{des}</div>
                </div>
              ))}
            </div>
          ))
        )}
      </form>
    </DialogModal>
  )
}

export default SlasOfGoodDetail
