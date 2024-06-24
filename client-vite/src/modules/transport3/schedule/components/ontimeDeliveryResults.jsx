import React, {useState} from 'react'
import {connect, useSelector} from 'react-redux'
import {withTranslate} from 'react-redux-multilingual'
import {formatToTimeZoneDate} from '@helpers/formatDate'
import {DialogModal, ErrorLabel} from '@common-components'
import { OrderActions } from '../../order/redux/actions'

import '@modules/crm/customer/components/customer.css'

function OntimePredictResults(props) {

  const displayOntimeStatus = (status) => {
    if (status === 1) return 'Đúng hạn';
    if (status === 0) return 'Trễ hạn';
    return 'Chưa dự báo';
  }

  const {schedule} = props

  console.log(schedule)
  return (
    <>
      <DialogModal
        modalID={`modal-ontime-delivery-results`}
        isLoading={false}
        formID={`form-ontime-delivery-results`}
        title={'Kết quả dự báo khả năng giao hàng đúng hạn'}
        msg_failure={'Lấy dữ liệu thất bại'}
        size="80"
        style={{backgroundColor: 'green'}}
      >
        {schedule && (
          <>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <strong>Mã kế hoạch giao hàng hàng: </strong>
                  <span>{schedule.code}</span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <strong>Thông tin đơn hàng</strong>
                  <table className="table table-bordered">
                    <thead>
                    <tr>
                      <th>STT</th>
                      <th>Mã đơn hàng</th>
                      <th>Đúng hạn?</th>
                    </tr>
                    </thead>
                    <tbody>
                    {schedule.orders.map((order, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{order.code}</td>
                        <td>{displayOntimeStatus(order.estimatedOntime)}</td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogModal>
    </>
  )
}

function mapStateToProps(state) {
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(OntimePredictResults))
