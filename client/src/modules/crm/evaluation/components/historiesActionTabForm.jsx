import React from 'react'
import PropTypes from 'prop-types'
import { SelectBox } from '../../../../common-components'

HistoriesActionTabForm.propTypes = {}

function HistoriesActionTabForm(props) {
  const { id } = props
  return (
    <div className='tab-pane' id={id}>
      <div className='description-box'>
        <div className='form-inline' style={{ marginBottom: '2px' }}>
          <div className='form-group form-inline unitSearch'>
            <label>
              <span>Chọn thời gian</span>
            </label>
            {
              <SelectBox
                id={`customer-group-edit-form`}
                className='form-control select2'
                style={{ width: '100%' }}
                items={[
                  { value: 1, text: 'Hôm nay' },
                  { value: 2, text: 'Tuần này' },
                  { value: 3, text: 'Tháng này' }
                ]}
                value={1}
                //  onChange={this.handleChangeCustomerGroup}
                multiple={false}
              />
            }
          </div>
        </div>

        <div className='histories-timeline-container' style={{ marginTop: '15px' }}>
          {
            <div className='histories-timeline-item'>
              <div className='histories-timeline-item__content'>
                <time>9:00 AM 25/03/2021</time>
                <p style={{ fontSize: '14px' }}>
                  {'Đã hoàn thành hoạt động : Gọi điện cho khách hàng Nguyễn Văn Thái'}
                  <br />
                  Nội dung : Gọi điện tư vấn sản phẩm
                </p>
                {false && (
                  <div>
                    <label>Nội dung thay đổi :</label>
                    <p>Khách hài long với tư vấn và xác định muốn xem báo giá</p>
                  </div>
                )}
                {/* <p className='pointer' onClick ={()=>handleSeeDetail(index)}>{detailStatus[index]==false ? '>> xem chi tiết': '<< đóng'}</p> */}

                <span className='circle' />
              </div>
            </div>
          }
          {
            <div className='histories-timeline-item'>
              <div className='histories-timeline-item__content' style={{ textAlign: 'center' }}>
                <time>10:00 AM 25/03/2021</time>
                <p style={{ fontSize: '14px' }}>
                  {'Đã hoàn thành hoạt động : Gọi điện cho khách hàng Nguyễn Văn Thái'}
                  <br />
                  Nội dung : Gọi điện tư vấn sản phẩm
                </p>
                {false && (
                  <div>
                    <label>Nội dung thay đổi :</label>
                    <p>Khách hài long với tư vấn và xác định muốn xem báo giá</p>
                  </div>
                )}
                {/* <p className='pointer' onClick ={()=>handleSeeDetail(index)}>{detailStatus[index]==false ? '>> xem chi tiết': '<< đóng'}</p> */}

                <span className='circle' />
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default HistoriesActionTabForm
