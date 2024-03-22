import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { GoodActions } from '../../../common-production/good-management/redux/actions'
function InventoryDashboardHeader(props) {
  useEffect(() => {
    props.getNumberGoods()
  }, [])

  const { translate, goods } = props
  const { numberGoods } = goods

  return (
    <React.Fragment>
      <div className='row' style={{ marginTop: 10 }}>
        <div className='col-md-4 col-sm-6 col-xs-6'>
          <div className='info-box with-border'>
            <span className='info-box-icon bg-aqua'>
              <i className='fa fa-database'></i>
            </span>
            <div className='info-box-content'>
              <span className='info-box-text'>Số mặt hàng tồn</span>
              <span className='info-box-number'>{numberGoods !== null ? numberGoods.totalGoods : 0}</span>
              <a href={`/inventory-management`} target='_blank'>
                Xem thêm <i className='fa fa-arrow-circle-right'></i>
              </a>
            </div>
          </div>
        </div>
        <div className='col-md-2 col-sm-6 col-xs-6'>
          <div className='info-box'>
            <span className='info-box-icon bg-green'>
              <i className='fa fa-cart-plus'></i>
            </span>
            <div className='info-box-content' title='Sản phẩm'>
              <span className='info-box-text'>Sản phẩm</span>
              <span className='info-box-number'>
                {numberGoods !== null ? numberGoods.totalProducts : 0}/{numberGoods !== null ? numberGoods.totalGoods : 0}
              </span>
              <a href={`/inventory-management`} target='_blank'>
                Xem thêm <i className='fa fa-arrow-circle-right'></i>
              </a>
            </div>
          </div>
        </div>
        <div className='col-md-2 col-sm-6 col-xs-6'>
          <div className='info-box'>
            <span className='info-box-icon bg-red'>
              <i className='fa  fa-cart-arrow-down'></i>
            </span>
            <div className='info-box-content' title='Nguyên vật liệu'>
              <span className='info-box-text'>Nguyên vật liệu</span>
              <span className='info-box-number'>
                {numberGoods !== null ? numberGoods.totalMaterials : 0}/{numberGoods !== null ? numberGoods.totalGoods : 0}
              </span>
              <a href={`/inventory-management`} target='_blank'>
                Xem thêm <i className='fa fa-arrow-circle-right'></i>
              </a>
            </div>
          </div>
        </div>
        <div className='col-md-2 col-sm-6 col-xs-6'>
          <div className='info-box'>
            <span className='info-box-icon bg-yellow'>
              <i className='fa  fa-bicycle'></i>
            </span>
            <div className='info-box-content' title='Công cụ dụng cụ'>
              <span className='info-box-text'>Công cụ dụng cụ</span>
              <span className='info-box-number'>5/50</span>
              <a href={`/inventory-management`} target='_blank'>
                Xem thêm <i className='fa  fa-arrow-circle-o-right'></i>
              </a>
            </div>
          </div>
        </div>
        <div className='col-md-2 col-sm-6 col-xs-6'>
          <div className='info-box'>
            <span className='info-box-icon bg-yellow'>
              <i className='fa  fa-bicycle'></i>
            </span>
            <div className='info-box-content' title='Phế phẩm'>
              <span className='info-box-text'>Phế phẩm</span>
              <span className='info-box-number'>5/50</span>
              <a href={`/inventory-management`} target='_blank'>
                Xem thêm <i className='fa  fa-arrow-circle-o-right'></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {
  getNumberGoods: GoodActions.getNumberGoods
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(InventoryDashboardHeader))
