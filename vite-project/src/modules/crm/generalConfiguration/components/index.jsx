import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate, IntlActions } from 'react-redux-multilingual'
import Swal from 'sweetalert2'
import { CrmStatusActions } from '../../status/redux/actions'
import CustomerStatusAddForm from './customerStatusAddForm'
import CustomerStatusEditForm from './customerStatusEditForm'
import { formatFunction } from '../../common/index'
import { CrmCareTypeActions } from '../../careType/redux/action'
import CustomerCareTypeAddForm from './customerCareTypeAddForm'
import CustomerCareTypeEditForm from './customerCareTypeEditForm'
import { CrmCustomerRankPointActions } from '../../customerRankPoint/redux/action'
import CustomerRankPointAddForm from './customerRankPointAddForm'
import CustomerRankPointEditForm from './customerRankPointEditForm'
import CrmUnitKPIEditForm from './crmUnitKPIEditForm'
import '../../customer/components/customer.css'
import { CrmUnitKPIActions } from '../../crmUnitKPI/redux/action'

function GeneralConfiguration(props) {
  const { translate, crm } = props
  const [statusIdEdit, setStatusIdEdit] = useState()
  const [data, setData] = useState()
  const [careTypeIdEdit, setCareTypeIdEdit] = useState()
  const [careTypeEditData, setCareTypeEditData] = useState()
  const [customerRankPointEditData, setCustomerRankPointEditData] = useState()
  const [customerRankPointIdEdit, setCustomerRankPointIdEdit] = useState()

  useEffect(() => {
    props.getStatus()
    props.getCareTypes()
    props.getCustomerRankPoints()
    props.getCrmUnitKPI()
  }, [])

  const editStatus = async (id, data) => {
    await setStatusIdEdit(id)
    await setData(data)
    window.$(`#modal-crm-customer-status-edit`).modal('show')
  }
  const editCareType = async (id, data) => {
    await setCareTypeIdEdit(id)
    await setCareTypeEditData(data)
    window.$(`#modal-crm-customer-care-type-edit`).modal('show')
  }
  const editCustomerRankPoint = async (id, data) => {
    await setCustomerRankPointIdEdit(id)
    await setCustomerRankPointEditData(data)
    window.$(`#modal-crm-customer-rankPoint-edit`).modal('show')
  }

  const deleteCareType = async (id) => {
    Swal.fire({
      html: '<h3>Xóa thông tin loại hoạt động CSKH </h3>',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: translate('general.no'),
      confirmButtonText: translate('general.yes')
    }).then((res) => {
      if (res.value) {
        props.deleteCareType(id)

        props.getCareTypes()
      }
    })
  }

  const deleteStatus = async (id) => {
    Swal.fire({
      html: '<h3>Xóa thông tin trạng thái khách hàng</h3>',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: translate('general.no'),
      confirmButtonText: translate('general.yes')
    }).then((res) => {
      if (res.value) {
        props.deleteStatus(id)
        props.getStatus()
      }
    })
  }
  const deleteCustomerRankPoint = async (id) => {
    Swal.fire({
      html: '<h3>Xóa thông tin phân hạng khách hàng</h3>',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: translate('general.no'),
      confirmButtonText: translate('general.yes')
    }).then((res) => {
      if (res.value) {
        props.deleteCustomerRankPoint(id)
        props.getCustomerRankPoints()
      }
    })
  }

  let crmUnitKPI
  if (crm.crmUnitKPI && crm.crmUnitKPI.list && crm.crmUnitKPI.list.length > 0) crmUnitKPI = crm.crmUnitKPI.list[0]

  return (
    <React.Fragment>
      <div className='box generalConfiguration'>
        <div className='box-body qlcv'>
          {statusIdEdit && data && <CustomerStatusEditForm statusIdEdit={statusIdEdit} data={data} />}
          {careTypeIdEdit && careTypeEditData && <CustomerCareTypeEditForm data={careTypeEditData} />}
          {customerRankPointIdEdit && customerRankPointEditData && <CustomerRankPointEditForm data={customerRankPointEditData} />}
          <div className='description-box nav-tabs-custom'>
            <div className='tab-content'>
              <ul className='nav nav-tabs-left'>
                <li className='active'>
                  <a href='#customer-status' data-toggle='tab'>
                    {translate('crm.customer.status')}
                  </a>
                </li>
                <li>
                  {' '}
                  <a href='#customer-caretype' data-toggle='tab'>
                    {translate('crm.care.careType')}
                  </a>{' '}
                </li>
                <li>
                  {' '}
                  <a href='#customer-rank-point' data-toggle='tab'>
                    {'Phân hạng khách hàng'}
                  </a>{' '}
                </li>
                <li>
                  {' '}
                  <a href='#customer-crmUnitKPI' data-toggle='tab'>
                    {'Chỉ tiêu công việc chăm sóc khách hàng'}
                  </a>{' '}
                </li>
              </ul>
            </div>
            <div className='tab-content tab-content-right'>
              {/* Tab trạng thái khách hàng */}
              <div id={`customer-status`} className='tab-pane active'>
                <div className='description-box'>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h4 class='box-title' style={{ color: 'rgb(68,68,68)' }}>
                      Danh sách trạng thái khách hàng
                    </h4>
                    <CustomerStatusAddForm />
                  </div>
                  <ul id='sortItem' className='todo-list'>
                    {crm.status && crm.status.list && crm.status.list.length > 0
                      ? crm.status.list.map((o, index) => (
                          <li key={index}>
                            <a data-toggle='collapse' href={`#collapse_${index}`}>
                              <span style={{ margin: '0 5px', display: 'inline-block' }}>{`${index + 1}.`}</span>
                              <span className='text'>{o.name}</span>
                              <div className='tools'>
                                <i className='fa fa-edit' onClick={() => editStatus(o._id, o)} title='Chỉnh sửa trạng thái'></i>
                                <i className='fa fa-trash-o' onClick={() => deleteStatus(o._id)} title='Xóa trạng thái'></i>
                              </div>
                            </a>

                            <div id={`collapse_${index}`} class='collapse'>
                              <ul>
                                <li>Người tạo: {` ${o.creator ? o.creator.name : ''}`}</li>
                                <li>Mô tả: {` ${o.description}`}</li>
                                <li>Ngày tạo: {` ${formatFunction.formatDate(o.createdAt)}`}</li>
                              </ul>
                            </div>
                          </li>
                        ))
                      : null}
                  </ul>
                </div>
              </div>
              {/* tab cac loai hinh cham soc khach hang */}
              <div id={`customer-caretype`} className='tab-pane'>
                <div className='description-box'>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h4 class='box-title' style={{ color: 'rgb(68,68,68)' }}>
                      Danh sách các loại hoạt động CSKH
                    </h4>
                    <CustomerCareTypeAddForm />
                  </div>
                  <ul id='sortItem' className='todo-list'>
                    {crm.careTypes && crm.careTypes.list && crm.careTypes.list.length > 0
                      ? crm.careTypes.list.map((o, index) => (
                          <li key={index}>
                            <a data-toggle='collapse' href={`#collapsed_${index}`}>
                              <span style={{ margin: '0 5px', display: 'inline-block' }}>{`${index + 1}.`}</span>
                              <span className='text'>{o.name}</span>
                              <div className='tools'>
                                <i className='fa fa-edit' onClick={() => editCareType(o._id, o)} title='Chỉnh sửa loại hoạt động CSKH'></i>
                                <i className='fa fa-trash-o' onClick={() => deleteCareType(o._id)} title='Xóa loại hoạt động CSKH'></i>
                              </div>
                            </a>

                            <div id={`collapsed_${index}`} class='collapse'>
                              <ul>
                                <li>Người tạo: {` ${o.creator ? o.creator.name : ''}`}</li>
                                <li>Mô tả: {` ${o.description}`}</li>
                                <li>Ngày tạo: {` ${formatFunction.formatDate(o.createdAt)}`}</li>
                              </ul>
                            </div>
                          </li>
                        ))
                      : null}
                  </ul>
                </div>
              </div>

              {/* tab phan hang khach hang */}
              <div id={`customer-rank-point`} className='tab-pane'>
                <div className='description-box'>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h4 class='box-title' style={{ color: 'rgb(68,68,68)' }}>
                      Danh sách phân hạng khách hàng
                    </h4>
                    <CustomerRankPointAddForm />
                  </div>
                  <ul id='sortItem' className='todo-list'>
                    {crm.customerRankPoints && crm.customerRankPoints.list && crm.customerRankPoints.list.length > 0
                      ? crm.customerRankPoints.list.map((o, index) => (
                          <li key={index}>
                            <a data-toggle='collapse' href={`#collapsed_rankPoint_${index}`}>
                              <span style={{ margin: '0 5px', display: 'inline-block' }}>{`${index + 1}.`}</span>
                              <span className='text'>{o.name}</span>
                              <div className='tools'>
                                <i
                                  className='fa fa-edit'
                                  onClick={() => editCustomerRankPoint(o._id, o)}
                                  title='Chỉnh sửa phân hạng khách hàng'
                                ></i>
                                <i
                                  className='fa fa-trash-o'
                                  onClick={() => deleteCustomerRankPoint(o._id)}
                                  title='Xóa phân hạng khách hàng'
                                ></i>
                              </div>
                            </a>

                            <div id={`collapsed_rankPoint_${index}`} class='collapse'>
                              <ul>
                                <li>
                                  <strong style={{ color: 'green' }}>Số điểm tối thiểu : </strong> {` ${o.point ? o.point : ''}`}
                                </li>
                                <li>Người tạo: {` ${o.creator ? o.creator.name : ''}`}</li>
                                <li>Mô tả: {` ${o.description}`}</li>
                                <li>Ngày tạo: {` ${formatFunction.formatDate(o.createdAt)}`}</li>
                              </ul>
                            </div>
                          </li>
                        ))
                      : null}
                  </ul>
                </div>
              </div>

              {/* tab chỉ tiêu đơn vị */}
              <div id={`customer-crmUnitKPI`} className='tab-pane'>
                <div className='description-box'>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h4 class='box-title' style={{ color: 'rgb(68,68,68)' }}>
                      Chỉ tiêu đơn vị chăm sóc khách hàng
                    </h4>
                    <CrmUnitKPIEditForm />
                  </div>
                  <ul id='sortItem' className='todo-list'>
                    {crmUnitKPI ? (
                      <>
                        <li>
                          <a data-toggle='collapse' href={`#collapsed_crmUnitKPI_${1}`}>
                            <span style={{ margin: '0 5px', display: 'inline-block' }}>1</span>
                            <span className='text'>Chỉ tiêu về số lượng khách hàng mới</span>
                          </a>
                          <div id={`collapsed_crmUnitKPI_${1}`} class='collapse active'>
                            <ul>
                              <li>
                                <strong style={{ color: 'green' }}>Số lượng khách hàng mới : </strong>{' '}
                                {` ${crmUnitKPI.numberOfNewCustomers.value ? crmUnitKPI.numberOfNewCustomers.value : ''}`}
                              </li>
                              <li>
                                Trọng số của chỉ tiêu :{' '}
                                {` ${crmUnitKPI.numberOfNewCustomers.weight ? crmUnitKPI.numberOfNewCustomers.weight : ''}`}
                              </li>
                            </ul>
                          </div>
                        </li>
                        <li>
                          <a data-toggle='collapse' href={`#collapsed_crmUnitKPI_${2}`}>
                            <span style={{ margin: '0 5px', display: 'inline-block' }}>2</span>
                            <span className='text'>Chỉ tiêu về tỉ lệ mua hàng ở khách hàng mới</span>
                          </a>
                          <div id={`collapsed_crmUnitKPI_${2}`} class='collapse'>
                            <ul>
                              <li>
                                <strong style={{ color: 'green' }}>Tỉ lệ mua hàng ở khách hàng mới (%) : </strong>{' '}
                                {` ${crmUnitKPI.newCustomerBuyingRate.value ? crmUnitKPI.newCustomerBuyingRate.value : ''}`}
                              </li>
                              <li>
                                Trọng số của chỉ tiêu :{' '}
                                {` ${crmUnitKPI.newCustomerBuyingRate.weight ? crmUnitKPI.newCustomerBuyingRate.weight : ''}`}
                              </li>
                            </ul>
                          </div>
                        </li>
                        <li>
                          <a data-toggle='collapse' href={`#collapsed_crmUnitKPI_${3}`}>
                            <span style={{ margin: '0 5px', display: 'inline-block' }}>3</span>
                            <span className='text'>Chỉ tiêu về số lượng hoạt động</span>
                          </a>
                          <div id={`collapsed_crmUnitKPI_${3}`} class='collapse'>
                            <ul>
                              <li>
                                <strong style={{ color: 'green' }}>Số lượng hoạt động : </strong>{' '}
                                {` ${crmUnitKPI.totalActions.value ? crmUnitKPI.totalActions.value : ''}`}
                              </li>
                              <li>Trọng số của chỉ tiêu : {` ${crmUnitKPI.totalActions.weight ? crmUnitKPI.totalActions.weight : ''}`}</li>
                            </ul>
                          </div>
                        </li>
                        <li>
                          <a data-toggle='collapse' href={`#collapsed_crmUnitKPI_${4}`}>
                            <span style={{ margin: '0 5px', display: 'inline-block' }}>4</span>
                            <span className='text'>Chỉ tiêu về tỉ lệ hoàn thành hoạt động</span>
                          </a>
                          <div id={`collapsed_crmUnitKPI_${4}`} class='collapse'>
                            <ul>
                              <li>
                                <strong style={{ color: 'green' }}>Tỉ lệ hoàn thành hoạt động (%) : </strong>{' '}
                                {` ${crmUnitKPI.completionRate.value ? crmUnitKPI.completionRate.value : ''}`}
                              </li>
                              <li>
                                Trọng số của chỉ tiêu : {` ${crmUnitKPI.completionRate.weight ? crmUnitKPI.completionRate.weight : ''}`}
                              </li>
                            </ul>
                          </div>
                        </li>
                        <li>
                          <a data-toggle='collapse' href={`#collapsed_crmUnitKPI_${5}`}>
                            <span style={{ margin: '0 5px', display: 'inline-block' }}>5</span>
                            <span className='text'>Chỉ tiêu về tỉ lệ hoạt động thành công</span>
                          </a>
                          <div id={`collapsed_crmUnitKPI_${5}`} class='collapse'>
                            <ul>
                              <li>
                                <strong style={{ color: 'green' }}>Tỉ lệ hoạt động thành công (%) : </strong>{' '}
                                {` ${crmUnitKPI.solutionRate.value ? crmUnitKPI.solutionRate.value : ''}`}
                              </li>
                              <li>Trọng số của chỉ tiêu : {` ${crmUnitKPI.solutionRate.weight ? crmUnitKPI.solutionRate.weight : ''}`}</li>
                            </ul>
                          </div>
                        </li>
                        <li>
                          <a data-toggle='collapse' href={`#collapsed_crmUnitKPI_${6}`}>
                            <span style={{ margin: '0 5px', display: 'inline-block' }}>6</span>
                            <span className='text'>Chỉ tiêu về tỉ lệ khách hàng quay lại mua hàng</span>
                          </a>
                          <div id={`collapsed_crmUnitKPI_${6}`} class='collapse'>
                            <ul>
                              <li>
                                <strong style={{ color: 'green' }}>Tỉ lệ khách hàng quay lại mua hàng (%) : </strong>{' '}
                                {` ${crmUnitKPI.customerRetentionRate.value ? crmUnitKPI.customerRetentionRate.value : ''}`}
                              </li>
                              <li>
                                Trọng số của chỉ tiêu :{' '}
                                {` ${crmUnitKPI.customerRetentionRate.weight ? crmUnitKPI.customerRetentionRate.weight : ''}`}
                              </li>
                            </ul>
                          </div>
                        </li>
                      </>
                    ) : null}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  const { crm } = state
  return { crm }
}

const mapDispatchToProps = {
  getStatus: CrmStatusActions.getStatus,
  deleteStatus: CrmStatusActions.deleteStatus,
  getCareTypes: CrmCareTypeActions.getCareTypes,
  deleteCareType: CrmCareTypeActions.deleteCareType,
  getCustomerRankPoints: CrmCustomerRankPointActions.getCustomerRankPoints,
  deleteCustomerRankPoint: CrmCustomerRankPointActions.deleteCustomerRankPoint,
  createCustomerRankPoint: CrmCustomerRankPointActions.createCustomerRankPoint,
  getCrmUnitKPI: CrmUnitKPIActions.getCrmUnitKPI
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GeneralConfiguration))
