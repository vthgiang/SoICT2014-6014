import React, { Component, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal } from '../../../../common-components'
import { formatFunction } from '../../common'
import { CrmCareActions } from '../redux/action'

function InfoCareForm(props) {
  const { crm, translate, careInfoId } = props
  useEffect(() => {
    props.getCare(careInfoId)
  }, [careInfoId])
  let careInfomation
  if (crm.cares.careById) careInfomation = crm.cares.careById

  console.log('CRM - info', crm)
  return (
    <React.Fragment>
      <DialogModal
        modalID='modal-crm-care-info'
        isLoading={crm.cares.isLoading}
        formID='form-crm-care-info'
        title={translate('crm.care.info')}
        size={75}
        disableSubmit={true}
      >
        {/* Form xem công việc chăm sóc khách hàng */}
        {careInfomation && (
          <div>
            <div className='description-box' style={{ lineHeight: 1.5 }}>
              <fieldset className='scheduler-border'>
                <legend className='scheduler-border'>{'Thông tin hoạt động'} </legend>
                <div className='row'>
                  <div className='col-md-6'>
                    <div className='form-horizontal'>
                      <div className='form-group'>
                        <strong className='col-sm-4'>{translate('crm.care.customer')}</strong>
                        <div className='col-sm-8'>
                          <span>{careInfomation.customer ? careInfomation.customer.name : ''}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <div className='form-horizontal'>
                      <div className='form-group'>
                        <strong className='col-sm-4'>{translate('crm.care.caregiver')}</strong>
                        <div className='col-sm-8'>
                          <span>
                            {careInfomation.customerCareStaffs ? careInfomation.customerCareStaffs.map((o) => o.name).join(', ') : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='row'>
                  <div className='col-md-6'>
                    <div className='form-horizontal'>
                      <div className='form-group'>
                        <strong className='col-sm-4'>{translate('crm.care.name')}</strong>
                        <div className='col-sm-8'>
                          <span>{careInfomation.name ? careInfomation.name : ''}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <div className='form-horizontal'>
                      <div className='form-group'>
                        <strong className='col-sm-4'>{translate('crm.care.description')}</strong>
                        <div className='col-sm-8'>
                          <div dangerouslySetInnerHTML={{ __html: careInfomation.description ? careInfomation.description : '' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='row'>
                  <div className='col-md-6'>
                    <div className='form-horizontal'>
                      <div className='form-group'>
                        <strong className='col-sm-4'>{translate('crm.care.careType')}</strong>
                        <div className='col-sm-8'>
                          <span>
                            {careInfomation.customerCareTypes ? careInfomation.customerCareTypes.map((o) => o.name).join(', ') : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <div className='form-horizontal'>
                      <div className='form-group'>
                        <strong className='col-sm-4'>{'Độ ưu tiên'}</strong>
                        <div className='col-sm-8'>
                          <span>{careInfomation.priority ? formatFunction.formatCarePriority(careInfomation.priority) : ''}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-md-6'>
                    <div className='form-horizontal'>
                      <div className='form-group'>
                        <strong className='col-sm-4'>{translate('crm.care.status')}</strong>
                        <div className='col-sm-8'>
                          <span>{careInfomation.status ? formatFunction.formatCareStatus(careInfomation.status) : ''}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='col-md-6'>
                    <div className='form-horizontal'>
                      <div className='form-group'>
                        <strong className='col-sm-4'>{'Người tạo hoạt động'}</strong>
                        <div className='col-sm-8'>
                          <span>{careInfomation.creator ? careInfomation.creator.name : ''}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-md-6'>
                    <div className='form-horizontal'>
                      <div className='form-group'>
                        <strong className='col-sm-4'>{translate('crm.care.startDate')}</strong>
                        <div className='col-sm-8'>
                          <span>{careInfomation.startDate ? formatFunction.formatDate(careInfomation.startDate) : ''}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <div className='form-horizontal'>
                      <div className='form-group'>
                        <strong className='col-sm-4'>{translate('crm.care.endDate')}</strong>
                        <div className='col-sm-8'>
                          <span>{careInfomation.endDate ? formatFunction.formatDate(careInfomation.endDate) : ''}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-md-6'>
                    <div className='form-horizontal'>
                      <div className='form-group'>
                        <strong className='col-sm-4'>{'Chỉnh sửa lần cuối '}</strong>
                        <div className='col-sm-8'>
                          <span>{careInfomation.endDate ? formatFunction.formatDate(careInfomation.updatedAt) : ''}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <div className='form-horizontal'>
                      <div className='form-group'>
                        <strong className='col-sm-4'>{'Người chỉnh sửa'}</strong>
                        <div className='col-sm-8'>
                          <span>{'Nguyễn Văn Danh'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
            <div className='description-box' style={{ lineHeight: 1.5 }}>
              {/* <h4>Đánh giá hoạt động</h4> */}
              <fieldset className='scheduler-border'>
                <legend className='scheduler-border'>{'Đánh giá hoạt động'} </legend>
                <div className='row'>
                  <div className='col-md-6'>
                    <div className='form-horizontal'>
                      <div className='form-group'>
                        <strong className='col-sm-4'>{'Ngày hoàn thành'}</strong>
                        <div className='col-sm-8'>
                          <span>{careInfomation.completeDate ? formatFunction.formatDate(careInfomation.completeDate) : ''}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-md-6'>
                    <div className='form-horizontal'>
                      <div className='form-group'>
                        <strong className='col-sm-4'>{'Kết quả hoạt động'}</strong>
                        <div className='col-sm-8'>
                          <span>
                            {careInfomation.evaluation ? (careInfomation.evaluation.result == 1 ? 'Thành công' : 'Thất bại') : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <div className='form-horizontal'>
                      <div className='form-group'>
                        <strong className='col-sm-4'>{'Nội dung đánh giá '}</strong>
                        <div className='col-sm-8'>
                          <div
                            dangerouslySetInnerHTML={{
                              __html:
                                careInfomation.evaluation && careInfomation.evaluation.comment ? careInfomation.evaluation.comment : ''
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        )}
      </DialogModal>
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  const { crm, user } = state
  return { crm, user }
}

const mapDispatchToProps = {
  getCare: CrmCareActions.getCare
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(InfoCareForm))
