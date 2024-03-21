import React, { Component, useState } from 'react'
import { withTranslate } from 'react-redux-multilingual'
import { connect } from 'react-redux'
import { DialogModal } from '../../../../../common-components'
import { formatDate } from '../../../../../helpers/formatDate'

function BusinessDepartmentDetailForm(props) {
  const [state, setState] = useState({})

  const { businessDepartmentDetail } = props
  const roleConvert = ['title', 'Kinh doanh', 'Quản lý bán hàng', 'Kế toán']

  return (
    <React.Fragment>
      <DialogModal
        modalID={`modal-detail-business-department`}
        title={'Chi tiết cấu hình đơn vị kinh doanh'}
        formID={`form-detail-business-department`}
        size={50}
        maxWidth={500}
        hasSaveButton={false}
        hasNote={false}
      >
        <form id={`form-detail-business-department`}>
          <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
            <div className={`form-group`}>
              <strong>{'Đơn vị'}:&emsp;</strong>
              {businessDepartmentDetail.organizationalUnit ? businessDepartmentDetail.organizationalUnit.name : ''}
            </div>
          </div>
          <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
            <div className={`form-group`}>
              <strong>{'Vai trò'}:&emsp;</strong>
              {roleConvert[businessDepartmentDetail.role]}
            </div>
          </div>
          <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
            {businessDepartmentDetail.organizationalUnit &&
              businessDepartmentDetail.organizationalUnit.managers.map((role, index) => {
                return (
                  <div className={`form-group`} key={index}>
                    <strong>{role.name}: &emsp;</strong>
                    {role.users.map((user, index) => {
                      if (index === role.users.length - 1) {
                        return user.userId.name
                      }
                      return user.userId.name + ', '
                    })}
                  </div>
                )
              })}
          </div>
          <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
            <div className={`form-group`}>
              <strong>{'Được cấu hình ngày'}:&emsp;</strong>
              {formatDate(businessDepartmentDetail.createdAt)}
            </div>
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

export default connect(null, null)(withTranslate(BusinessDepartmentDetailForm))
