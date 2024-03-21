import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import {
  SelectMulti,
  DatePicker,
  DataTableSetting,
  PaginateBar,
  ConfirmNotification,
  ButtonModal
} from '../../../../../../common-components'
import BillDetailForm from '../genaral/billDetailForm'
import QualityControlForm from '../genaral/quatityControlForm'
import { getTableConfiguration } from '../../../../../../helpers/tableConfiguration'
import Swal from 'sweetalert2'
import { UserGuideCreateBillTake } from '../genaral/config.js'
import GoodTakesCreateFormModal from './goodTakesCreateFormModal'
import GoodTakesWorkFlowModal from './goodTakesWorkFlowModal'
import { LotActions } from '../../../inventory-management/redux/actions'

function TakeManagement(props) {
  const tableId = 'take-management-table'
  const defaultConfig = { limit: 5 }
  const limit = getTableConfiguration(tableId, defaultConfig).limit

  const [state, setState] = useState({
    limit: limit,
    page: 1,
    group: '4',
    tableId
  })

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

  const handleShowWorkFlowModal = async (bill) => {
    await setState({
      ...state,
      billInfor: bill
    })
    let data = {
      // managementLocation: currentRole,
      good: bill.type === '2' ? '' : bill.goods.map((a) => a.good._id),
      stock: bill.fromStock._id
    }
    await props.getLotsByGood(data)
    await window.$('#good-takes-work-flow-modal').modal('show')
  }

  const handleSearchByStatus = (status) => {
    props.handleSearchByStatus(status)
  }

  const { translate, bills, stocks, user } = props
  const { listPaginate, totalPages, page, listBillByGroup } = bills
  const { listStocks } = stocks
  const { startDate, endDate, group, currentRow, createType } = state
  const dataPartner = props.getPartner()
  const userId = localStorage.getItem('userId')

  return (
    <div id='bill-stock-takes'>
      <div className='box-body qlcv'>
        <ButtonModal
          modalID={`modal-create-new-takes-bill`}
          button_name={translate('manage_warehouse.good_management.add')}
          title={translate('manage_warehouse.good_management.add_title')}
        />
        <GoodTakesCreateFormModal createType={1} />
        {state.currentControl && (
          <QualityControlForm
            billId={state.currentControl._id}
            code={state.currentControl.code}
            status={state.qcStatus}
            content={state.qcContent}
          />
        )}
        {state.billInfor && <GoodTakesWorkFlowModal billId={state.billInfor._id} billInfor={state.billInfor} />}
        <div className='form-inline'>
          <div className='form-group'>
            <label className='form-control-static'>{translate('manage_warehouse.bill_management.stock')}</label>
            <SelectMulti
              id={`select-multi-stock-take`}
              multiple='multiple'
              options={{ nonSelectedText: 'Tổng các kho', allSelectedText: 'Tổng các kho' }}
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
              id={`select-multi-creator-take`}
              multiple='multiple'
              options={{ nonSelectedText: 'Chọn người tạo', allSelectedText: 'Chọn tất cả' }}
              className='form-control select2'
              style={{ width: '100%' }}
              items={user.list.map((x) => {
                return { value: x.id, text: x.name }
              })}
              onChange={props.handleCreatorChange}
            />
          </div>
          <a href='#show-detail' onClick={() => showFilePreview(UserGuideCreateBillTake)}>
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
              id={`select-multi-type-take`}
              multiple='multiple'
              options={{ nonSelectedText: 'Chọn loại phiếu', allSelectedText: 'Chọn tất cả' }}
              className='form-control select2'
              style={{ width: '100%' }}
              items={[
                { value: '1', text: translate('manage_warehouse.bill_management.goodTakeBillType.1') },
                { value: '2', text: translate('manage_warehouse.bill_management.goodTakeBillType.2') },
                { value: '3', text: translate('manage_warehouse.bill_management.goodTakeBillType.3') },
                { value: '4', text: translate('manage_warehouse.bill_management.goodTakeBillType.4') },
                { value: '5', text: translate('manage_warehouse.bill_management.goodTakeBillType.5') },
                { value: '6', text: translate('manage_warehouse.bill_management.goodTakeBillType.6') }
              ]}
              onChange={props.handleTypeChange}
            />
          </div>
        </div>
        <div className='form-inline'>
          <div className='form-group'>
            <label className='form-control-static'>{translate('manage_warehouse.bill_management.from_date')}</label>
            <DatePicker id='book-stock-start-date-take' dateFormat='month-year' value={startDate} onChange={props.handleChangeStartDate} />
          </div>
          <div className='form-group'>
            <label className='form-control-static'>{translate('manage_warehouse.bill_management.to_date')}</label>
            <DatePicker id='book-stock-end-date-take' dateFormat='month-year' value={endDate} onChange={props.handleChangeEndDate} />
          </div>
        </div>
        <div className='form-inline'>
          <div className='form-group'>
            <label className='form-control-static'>{translate('manage_warehouse.bill_management.status')}</label>
            <SelectMulti
              id={`select-multi-status-stock-take`}
              multiple='multiple'
              options={{ nonSelectedText: 'Chọn trạng thái', allSelectedText: 'Chọn tất cả' }}
              className='form-control select2'
              style={{ width: '100%' }}
              items={[
                { value: '1', text: translate('manage_warehouse.bill_management.bill_status.1') },
                { value: '2', text: translate('manage_warehouse.bill_management.bill_status.2') },
                { value: '3', text: translate('manage_warehouse.bill_management.bill_status.3') },
                { value: '4', text: translate('manage_warehouse.bill_management.bill_status.4') },
                { value: '5', text: translate('manage_warehouse.bill_management.bill_status.5') },
                { value: '7', text: translate('manage_warehouse.bill_management.bill_status.7') }
              ]}
              onChange={props.handleStatusChange}
            />
          </div>
          <div className='form-group'>
            <label></label>
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
        <table id={tableId} className='table table-striped table-bordered table-hover' style={{ marginTop: '15px' }}>
          <thead>
            <tr>
              <th style={{ width: '5%' }}>{translate('manage_warehouse.bill_management.index')}</th>
              <th>{translate('manage_warehouse.bill_management.code')}</th>
              <th>{translate('manage_warehouse.bill_management.type')}</th>
              <th>{translate('manage_warehouse.bill_management.status')}</th>
              <th>{translate('manage_warehouse.bill_management.creator')}</th>
              <th>{translate('manage_warehouse.bill_management.date')}</th>
              <th>{translate('manage_warehouse.bill_management.stock')}</th>
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
                    translate('manage_warehouse.bill_management.date'),
                    translate('manage_warehouse.bill_management.stock')
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
                  <td>{translate(`manage_warehouse.bill_management.goodTakeBillType.${x.type}`)}</td>
                  <td style={{ color: translate(`manage_warehouse.bill_management.bill_color.${x.status}`) }}>
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

                  <td style={{ textAlign: 'center' }}>
                    {/*show detail */}
                    <a onClick={() => props.handleShowDetailInfo(x._id)}>
                      <i className='material-icons'>view_list</i>
                    </a>
                    {x.status == '1' && (
                      <a
                        onClick={() => handleShowWorkFlowModal(x)}
                        className='add text-blue'
                        style={{ width: '5px' }}
                        title='Thực hiện công việc'
                      >
                        <i className='material-icons'>assignment_turned_in</i>
                      </a>
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

const mapDispatchToProps = {
  getLotsByGood: LotActions.getLotsByGood
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TakeManagement))
