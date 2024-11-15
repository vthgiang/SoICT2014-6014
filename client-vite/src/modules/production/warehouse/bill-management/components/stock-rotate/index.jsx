import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import Swal from 'sweetalert2'
import { SelectMulti, DatePicker, DataTableSetting, PaginateBar, ConfirmNotification } from '../../../../../../common-components'

import BillDetailForm from '../genaral/billDetailForm'
import StockRotateEditForm from './stockRotateEditForm'
import StockRotateCreateForm from './stockRotateCreateForm'
import QualityControlForm from '../genaral/quatityControlForm'
import { getTableConfiguration } from '../../../../../../helpers/tableConfiguration'
import { UserGuideCreateBillRotate } from '../genaral/config.js'

function RotateManagement(props) {
  const tableId = 'rotate-management-table'
  const defaultConfig = { limit: 5 }
  const { limit } = getTableConfiguration(tableId, defaultConfig)

  const [state, setState] = useState({
    limit,
    page: 1,
    group: '5',
    tableId
  })

  const { translate, bills, stocks, user } = props
  const { listPaginate, totalPages, page, listBillByGroup } = bills
  const { listStocks } = stocks
  const { startDate, endDate, group, currentRow } = state
  const dataPartner = props.getPartner()
  const userId = localStorage.getItem('userId')

  const handleEdit = async (bill) => {
    await setState({
      ...state,
      currentRow: bill
    })

    window.$('#modal-edit-bill-rotate').modal('show')
  }

  const findIndexOfStaff = (array, id) => {
    let result = -1
    array.forEach((element, index) => {
      if (element.staff._id === id) {
        result = index
      }
    })
    return result
  }

  const showFilePreview = (data) => {
    const link = process.env.REACT_APP_SERVER + data[0].url
    Swal.fire({
      html: `
            <h4>${data[0].pageName}</h4>
            <div style="margin:0px;padding:0px;overflow:hidden">
               <iframe  frameborder="0" style="overflow:hidden;height:90vh;width:100%" height="100vh" width="100%"
                        src= ${link}
                    />
            </div>`,
      width: '100%',
      showCancelButton: false,
      showConfirmButton: false,
      showCloseButton: true,
      focusConfirm: false
    })
  }

  const handleSearchByStatus = (status) => {
    props.handleSearchByStatus(status)
  }

  const handleFinishedQualityControlStaff = async (bill) => {
    const userId = localStorage.getItem('userId')
    const index = findIndexOfStaff(bill.qualityControlStaffs, userId)
    const qcStatus = bill.qualityControlStaffs[index].status ? bill.qualityControlStaffs.status : ''
    const qcContent = bill.qualityControlStaffs[index].content ? bill.qualityControlStaffs[index].content : ''
    await setState({
      ...state,
      currentControl: bill,
      qcStatus,
      qcContent
    })
    window.$('#modal-quality-control-bill').modal('show')
  }

  return (
    <div id='bill-stock-rotate'>
      <div className='box-body qlcv'>
        <StockRotateCreateForm group={group} />
        {state.currentControl && (
          <QualityControlForm
            billId={state.currentControl._id}
            code={state.currentControl.code}
            status={state.qcStatus}
            content={state.qcContent}
          />
        )}
        <div className='form-inline'>
          <div className='form-group'>
            <label className='form-control-static'>{translate('manage_warehouse.bill_management.stock')}</label>
            <SelectMulti
              id='select-multi-stock-rotate'
              multiple='multiple'
              options={{
                nonSelectedText: 'Tổng các kho',
                allSelectedText: 'Tổng các kho'
              }}
              className='form-control select2'
              style={{ width: '100%' }}
              items={listStocks.map((x, index) => {
                return { value: x._id, text: x.name }
              })}
              onChange={props.handleStockChange}
            />
          </div>
          <div className='form-group'>
            <label className='form-control-static'>{translate('manage_warehouse.bill_management.creator')}</label>
            <SelectMulti
              id='select-multi-creator-rotate'
              multiple='multiple'
              options={{
                nonSelectedText: 'Chọn người tạo',
                allSelectedText: 'Chọn tất cả'
              }}
              className='form-control select2'
              style={{ width: '100%' }}
              items={user.list.map((x) => {
                return { value: x.id, text: x.name }
              })}
              onChange={props.handleCreatorChange}
            />
          </div>
          <a href='#show-detail' onClick={() => showFilePreview(UserGuideCreateBillRotate)}>
            <i className='fa fa-question-circle' style={{ cursor: 'pointer', marginLeft: '5px', fontSize: '20px' }} />
          </a>
        </div>
        <div className='form-inline'>
          <div className='form-group'>
            <label className='form-control-static'>{translate('manage_warehouse.bill_management.code')}</label>
            <input
              type='text'
              className='form-control'
              name='code'
              onChange={props.handleCodeChange}
              placeholder={translate('manage_warehouse.bill_management.code')}
              autoComplete='off'
            />
          </div>
          <div className='form-group'>
            <label className='form-control-static'>{translate('manage_warehouse.bill_management.type')}</label>
            <SelectMulti
              id='select-multi-type-rotate'
              multiple='multiple'
              options={{
                nonSelectedText: 'Chọn loại phiếu',
                allSelectedText: 'Chọn tất cả'
              }}
              className='form-control select2'
              style={{ width: '100%' }}
              items={[
                {
                  value: '8',
                  text: translate('manage_warehouse.bill_management.billType.8')
                }
              ]}
              onChange={props.handleTypeChange}
            />
          </div>
        </div>
        <div className='form-inline'>
          <div className='form-group'>
            <label className='form-control-static'>{translate('manage_warehouse.bill_management.from_date')}</label>
            <DatePicker
              id='book-stock-start-date-rotate'
              dateFormat='month-year'
              value={startDate}
              onChange={props.handleChangeStartDate}
            />
          </div>
          <div className='form-group'>
            <label className='form-control-static'>{translate('manage_warehouse.bill_management.to_date')}</label>
            <DatePicker id='book-stock-end-date-rotate' dateFormat='month-year' value={endDate} onChange={props.handleChangeEndDate} />
          </div>
        </div>
        <div className='form-inline'>
          <div className='form-group'>
            <label className='form-control-static'>{translate('manage_warehouse.bill_management.receipt_stock')}</label>
            <SelectMulti
              id='select-multi-partner-rotate'
              multiple='multiple'
              options={{
                nonSelectedText: 'Chọn kho chuyển',
                allSelectedText: 'Chọn tất cả'
              }}
              className='form-control select2'
              style={{ width: '100%' }}
              items={dataPartner}
              onChange={props.handlePartnerChange}
            />
          </div>
          <div className='form-group'>
            <label className='form-control-static'>{translate('manage_warehouse.bill_management.status')}</label>
            <SelectMulti
              id='select-multi-status-rotate'
              multiple='multiple'
              options={{
                nonSelectedText: 'Chọn trạng thái',
                allSelectedText: 'Chọn tất cả'
              }}
              className='form-control select2'
              style={{ width: '100%' }}
              items={[
                {
                  value: '1',
                  text: translate('manage_warehouse.bill_management.bill_status.1')
                },
                {
                  value: '2',
                  text: translate('manage_warehouse.bill_management.bill_status.2')
                },
                {
                  value: '3',
                  text: translate('manage_warehouse.bill_management.bill_status.3')
                },
                {
                  value: '4',
                  text: translate('manage_warehouse.bill_management.bill_status.4')
                },
                {
                  value: '5',
                  text: translate('manage_warehouse.bill_management.bill_status.5')
                }
              ]}
              onChange={props.handleStatusChange}
            />
          </div>
          <div className='form-group'>
            <button
              type='button'
              className='btn btn-success'
              title={translate('manage_warehouse.bill_management.search')}
              onClick={props.handleSubmitSearch}
            >
              {translate('manage_warehouse.bill_management.search')}
            </button>
          </div>
        </div>
        <div className='box-body row' style={{ display: 'flex', width: '70%', marginLeft: '5%' }}>
          <ul className='todo-list'>
            <li>
              <span className='text' style={{ cursor: 'pointer' }}>
                <a onClick={() => handleSearchByStatus('1')}>Số lượng phiếu chờ phê duyệt</a>
              </span>
              <span className='label label-info' style={{ fontSize: '11px' }}>
                {listBillByGroup.filter((item) => item.status === '1').length} Phiếu
              </span>
            </li>
            <li>
              <span className='text' style={{ cursor: 'pointer' }}>
                <a onClick={() => handleSearchByStatus('2')}>Số lượng phiếu chờ thực hiện </a>
              </span>
              <span className='label label-warning' style={{ fontSize: '11px' }}>
                {listBillByGroup.filter((item) => item.status === '2').length} Phiếu
              </span>
            </li>
          </ul>
          <ul className='todo-list' style={{ marginLeft: '20px' }}>
            <li>
              <span className='text' style={{ cursor: 'pointer' }}>
                <a onClick={() => handleSearchByStatus('3')}>Số lượng phiếu chờ kiểm định chất lượng</a>
              </span>
              <span className='label label-info' style={{ fontSize: '11px' }}>
                {listBillByGroup.filter((item) => item.status === '3').length} Phiếu
              </span>
            </li>
            <li>
              <span className='text' style={{ cursor: 'pointer' }}>
                <a onClick={() => handleSearchByStatus('5')}>Số lượng phiếu đã hoàn thành </a>
              </span>
              <span className='label label-warning' style={{ fontSize: '11px' }}>
                {listBillByGroup.filter((item) => item.status === '5').length} Phiếu
              </span>
            </li>
          </ul>
        </div>
        <BillDetailForm />
        {currentRow && (
          <StockRotateEditForm
            billId={currentRow._id}
            fromStock={currentRow.fromStock ? currentRow.fromStock._id : null}
            toStock={currentRow.toStock ? currentRow.toStock._id : null}
            code={currentRow.code}
            group={currentRow.group}
            type={currentRow.type}
            status={currentRow.status}
            oldStatus={currentRow.status}
            users={currentRow.users}
            approvers={currentRow.approvers ? currentRow.approvers : []}
            listQualityControlStaffs={currentRow.qualityControlStaffs ? currentRow.qualityControlStaffs : []}
            responsibles={currentRow.responsibles ? currentRow.responsibles : []}
            accountables={currentRow.accountables ? currentRow.accountables : []}
            name={currentRow.receiver ? currentRow.receiver.name : ''}
            phone={currentRow.receiver ? currentRow.receiver.phone : ''}
            email={currentRow.receiver ? currentRow.receiver.email : ''}
            address={currentRow.receiver ? currentRow.receiver.address : ''}
            description={currentRow.description}
            listGood={currentRow.goods}
            creator={currentRow.creator ? currentRow.creator._id : ''}
          />
        )}

        <table id={tableId} className='table table-striped table-bordered table-hover' style={{ marginTop: '15px' }}>
          <thead>
            <tr>
              <th style={{ width: '5%' }}>{translate('manage_warehouse.bill_management.index')}</th>
              <th>{translate('manage_warehouse.bill_management.code')}</th>
              <th>{translate('manage_warehouse.bill_management.type')}</th>
              <th>{translate('manage_warehouse.bill_management.status')}</th>
              <th>{translate('manage_warehouse.bill_management.creator')}</th>
              <th>{translate('manage_warehouse.bill_management.approved')}</th>
              <th>{translate('manage_warehouse.bill_management.date')}</th>
              <th>{translate('manage_warehouse.bill_management.stock')}</th>
              <th>{translate('manage_warehouse.bill_management.receipt_stock')}</th>
              <th>{translate('manage_warehouse.bill_management.infor_of_goods')}</th>
              <th style={{ width: '120px' }}>
                {translate('table.action')}
                <DataTableSetting
                  tableId={tableId}
                  columnArr={[
                    translate('manage_warehouse.bill_management.index'),
                    translate('manage_warehouse.bill_management.code'),
                    translate('manage_warehouse.bill_management.type'),
                    translate('manage_warehouse.bill_management.status'),
                    translate('manage_warehouse.bill_management.creator'),
                    translate('manage_warehouse.bill_management.approved'),
                    translate('manage_warehouse.bill_management.date'),
                    translate('manage_warehouse.bill_management.stock'),
                    translate('manage_warehouse.bill_management.receipt_stock'),
                    translate('manage_warehouse.bill_management.infor_of_goods')
                  ]}
                  setLimit={props.setLimit}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {typeof listPaginate !== undefined &&
              listPaginate.length !== 0 &&
              listPaginate.map((x, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{x.code}</td>
                  <td>{translate(`manage_warehouse.bill_management.billType.${x.type}`)}</td>
                  <td
                    style={{
                      color: translate(`manage_warehouse.bill_management.bill_color.${x.status}`)
                    }}
                  >
                    {translate(`manage_warehouse.bill_management.bill_status.${x.status}`)}
                  </td>
                  <td>{x.creator ? x.creator.name : 'Creator is deleted'}</td>
                  <td>
                    {x.approvers
                      ? x.approvers.map((a, key) => {
                          return <p key={key}>{a.approver.name}</p>
                        })
                      : 'approver is deleted'}
                  </td>
                  <td>{props.formatDate(x.updatedAt)}</td>
                  <td>{x.fromStock ? x.fromStock.name : 'Stock is deleted'}</td>
                  <td>{x.toStock ? x.toStock.name : 'Stock is deleted'}</td>
                  <td>
                    {x.status !== '7' && (
                      <div>
                        <div className='timeline-index'>
                          <div
                            className='timeline-progress'
                            style={{
                              width: `${((parseInt(x.status) - 1) / 4) * 100}%`
                            }}
                          />
                          <div className='timeline-items'>
                            <div className='tooltip-abc-completed'>
                              <div className='timeline-item active' />
                              <span className='tooltiptext-completed'>
                                <p style={{ color: 'white' }}>Tạo phiếu thành công</p>
                              </span>
                            </div>
                            <div className={`tooltip-abc${x.status === '1' ? '' : '-completed'}`}>
                              <div className={`timeline-item ${x.status === '1' ? '' : 'active'}`} />
                              <span className={`tooltiptext${x.status === '1' ? '' : '-completed'}`}>
                                <p style={{ color: 'white' }}>
                                  {x.status === '1' ? 'Cần tiến hành phê duyệt phiếu' : 'Đã phê duyệt phiếu'}
                                </p>
                              </span>
                            </div>
                            <div className={`tooltip-abc${x.status === '3' || x.status === '4' || x.status === '5' ? '-completed' : ''}`}>
                              <div
                                className={`timeline-item ${x.status === '3' || x.status === '4' || x.status === '5' ? 'active' : ''}`}
                              />
                              {(x.status === '3' || x.status === '4' || x.status === '5') && (
                                <span className='tooltiptext-completed'>
                                  <p style={{ color: 'white' }}>Phiếu đang trong quá trình thực hiện</p>
                                </span>
                              )}
                              {(x.status === '2' || x.status === '1') && (
                                <span className='tooltiptext'>
                                  <p style={{ color: 'white' }}>Phiếu chưa thực hiện</p>
                                </span>
                              )}
                            </div>

                            <div className={`tooltip-abc${props.checkRoleQualityControlStaffs(x) ? '' : '-completed'}`}>
                              <div className={`timeline-item ${props.checkRoleQualityControlStaffs(x) ? '' : 'active'}`} />
                              <span className={`tooltiptext${props.checkRoleQualityControlStaffs(x) ? '' : '-completed'}`}>
                                <p style={{ color: 'white' }}>
                                  {props.checkRoleQualityControlStaffs(x)
                                    ? 'Chưa kiểm định chất lượng hàng hóa'
                                    : 'Kiểm định chất lượng xong'}
                                </p>
                              </span>
                            </div>
                            <div className={`tooltip-abc${x.status !== '5' ? '' : '-completed'}`}>
                              <div className={`timeline-item ${x.status !== '5' ? '' : 'active'}`} />
                              <span className={`tooltiptext${x.status !== '5' ? '' : '-completed'}`}>
                                <p style={{ color: 'white' }}>{x.status !== '5' ? 'Chưa đánh lô hàng hóa' : 'Đánh lô hàng hóa xong'}</p>
                              </span>
                            </div>
                          </div>
                        </div>
                        <a>
                          <p
                            className='text-green'
                            style={{
                              whiteSpace: 'pre-wrap',
                              textAlign: 'center'
                            }}
                          >
                            {x.status === '5' && 'Đã kiểm kê xong!'}
                          </p>
                        </a>
                      </div>
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {/* show detail */}
                    <a onClick={() => props.handleShowDetailInfo(x._id)}>
                      <i className='material-icons'>view_list</i>
                    </a>
                    {/* Chỉnh sửa phiếu */}
                    {props.checkRoleCanEdit(x) && (
                      <a onClick={() => handleEdit(x)} className='text-yellow'>
                        <i className='material-icons'>edit</i>
                      </a>
                    )}
                    {/* Phê duyệt phiếu */}
                    {props.checkRoleApprovers(x) && x.status === '1' && (
                      <ConfirmNotification
                        icon='question'
                        title={translate('manage_warehouse.bill_management.approved_true')}
                        content={`${translate('manage_warehouse.bill_management.approved_true')} ${x.code}`}
                        name='check_circle_outline'
                        className='text-green'
                        func={() => props.handleFinishedApproval(x)}
                      />
                    )}
                    {/* Chuyển sang trạng thái đang thực hiện */}
                    {props.checkRoleCanEdit(x) && x.status === '2' && (
                      <ConfirmNotification
                        icon='question'
                        title={translate('manage_warehouse.bill_management.in_processing')}
                        content={`${translate('manage_warehouse.bill_management.in_processing')} ${x.code}`}
                        name='business_center'
                        className='text-violet'
                        func={() => props.handleInProcessingStatus(x)}
                      />
                    )}
                    {/* Kiểm định chất lượng */}
                    {props.checkRoleQualityControlStaffs(x) && x.status === '3' && (
                      <a onClick={() => handleFinishedQualityControlStaff(x)} className='text-green'>
                        <i className='material-icons'>check_circle</i>
                      </a>
                    )}
                    {/* Hoàn thành phiếu */}
                    {props.checkRoleCanEdit(x) && x.status === '4' && (
                      <ConfirmNotification
                        icon='question'
                        title={translate('manage_warehouse.bill_management.complete_bill')}
                        content={`${translate('manage_warehouse.bill_management.complete_bill')} ${x.code}`}
                        name='assignment_turned_in'
                        className='text-green'
                        func={() => props.handleCompleteBill(x)}
                      />
                    )}
                    {/* Chuyển phiếu sang trạng thái đã hủy */}
                    {props.checkRoleCanEdit(x) && (x.status === '5' || x.status === '3') && (
                      <ConfirmNotification
                        icon='question'
                        title={translate('manage_warehouse.bill_management.cancel_bill')}
                        content={`${translate('manage_warehouse.bill_management.cancel_bill')} ${x.code}`}
                        name='cancel'
                        className='text-red'
                        func={() => props.handleCancelBill(x)}
                      />
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {bills.isLoading ? (
          <div className='table-info-panel'>{translate('confirm.loading')}</div>
        ) : (
          (typeof listPaginate === 'undefined' || listPaginate.length === 0) && (
            <div className='table-info-panel'>{translate('confirm.no_data')}</div>
          )
        )}
        <PaginateBar pageTotal={totalPages} currentPage={page} func={props.setPage} />
      </div>
    </div>
  )
}

const mapStateToProps = (state) => state

export default connect(mapStateToProps, null)(withTranslate(RotateManagement))
