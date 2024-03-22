import React, { Component, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DeleteNotification, DatePicker, PaginateBar, DataTableSetting, SelectMulti, ExportExcel } from '../../../../../common-components'

import { PurchaseRequestActions } from '../../../admin/purchase-request/redux/actions'
import { UserActions } from '../../../../super-admin/user/redux/actions'

import { getFormatDateFromTime } from '../../../../../helpers/stringMethod'
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration'
import { formatDate, formatDate2 } from '../../../../../helpers/assetHelper.js'
import { PurchaseRequestEditForm } from './PurchaseRequestManagerEditForm'
import { PurchaseRequestDetailForm } from '../../../user/purchase-request/components/PurchaseRequestDetailForm'

function PurchaseRequestManager(props) {
  const tableId_constructor = 'table-purchase-request-manager'
  const currentMonth = formatDate(Date.now())
  const defaultConfig = { limit: 5 }
  const limit_constructor = getTableConfiguration(tableId_constructor, defaultConfig).limit
  const [state, setState] = useState({
    tableId: tableId_constructor,
    recommendNumber: '',
    proposalDate: currentMonth,
    status: ['approved', 'waiting_for_approval', 'disapproved'],
    page: 0,
    limit: limit_constructor
  })
  const { translate, purchaseRequest } = props
  const { page, limit, currentRowView, currentRow, tableId, status, proposalDate } = state

  useEffect(() => {
    props.searchPurchaseRequests(state)
    props.getUser()
  }, [])

  // Bắt sự kiện click xem thông tin phiếu đề nghị mua sắm
  const handleView = async (value) => {
    await setState((state) => {
      return {
        ...state,
        currentRowView: value
      }
    })
    window.$('#modal-view-purchaserequest').modal('show')
  }

  // Bắt sự kiện click chỉnh sửa thông tin phiếu đề nghị mua sắm
  const handleEdit = async (value) => {
    await setState((state) => {
      return {
        ...state,
        currentRow: value
      }
    })
    window.$('#modal-edit-purchaserequestmanage').modal('show')
  }

  // Function lưu giá trị mã nhân viên vào state khi thay đổi
  const handleRecommendNumberChange = (event) => {
    const { name, value } = event.target
    setState((state) => {
      return {
        ...state,
        [name]: value
      }
    })
  }

  // Function lưu giá trị tháng vào state khi thay đổi
  const handleMonthChange = (value) => {
    setState((state) => {
      return {
        ...state,
        proposalDate: value
      }
    })
  }

  // Function lưu người đề nghị vào state khi thay đổi
  const handleProposalEmployeeChange = (event) => {
    const { name, value } = event.target
    setState((state) => {
      return {
        ...state,
        [name]: value
      }
    })
  }

  // Function lưu giá trị tháng vào state khi thay đổi
  const handleApproverChange = (event) => {
    const { name, value } = event.target
    setState((state) => {
      return {
        ...state,
        [name]: value
      }
    })
  }

  // Function lưu giá trị status vào state khi thay đổi
  const handleStatusChange = (value) => {
    if (value.length === 0) {
      value = null
    }

    setState((state) => {
      return {
        ...state,
        status: value
      }
    })
  }

  // Function bắt sự kiện tìm kiếm
  const handleSubmitSearch = async () => {
    await setState((state) => {
      return {
        ...state,
        page: 0
      }
    })
    props.searchPurchaseRequests({ ...state, page: 0 })
  }

  // Bắt sự kiện setting số dòng hiện thị trên một trang
  const setLimit = async (number) => {
    await setState((state) => {
      return {
        ...state,
        limit: parseInt(number)
      }
    })
    props.searchPurchaseRequests({ ...state, limit: parseInt(number) })
  }

  // Bắt sự kiện chuyển trang
  const setPage = async (pageNumber) => {
    var page = (pageNumber - 1) * state.limit
    await setState((state) => {
      return {
        ...state,
        page: parseInt(page)
      }
    })
    props.searchPurchaseRequests({ ...state, page: parseInt(page) })
  }

  /*Chuyển đổi dữ liệu KPI nhân viên thành dữ liệu export to file excel */
  const convertDataToExportData = (data) => {
    let fileName = 'Bảng quản lý đề nghị mua sắm tài sản '
    if (data) {
      data = data.map((x, index) => {
        let code = x.recommendNumber
        let supplies = x.suppliesName
        let assigner = x.proponent ? x.proponent.email : null
        let createDate = getFormatDateFromTime(x.dateCreate, 'dd-mm-yyyy')
        let note = x.note
        let supplier = x.supplier
        let amount = x.total
        let cost = x.estimatePrice ? Intl.NumberFormat().format(parseInt(x.estimatePrice)) : null
        let status = formatStatus(x.status)
        let approver = x.approver ? x.approver.email : null

        return {
          index: index + 1,
          code: code,
          createDate: createDate,
          assigner: assigner,
          note: note,
          supplier: supplier,
          amount: amount,
          cost: cost,
          status: status,
          supplies: supplies,
          approver: approver
        }
      })
    }

    let exportData = {
      fileName: fileName,
      dataSheets: [
        {
          sheetName: 'sheet1',
          sheetTitle: fileName,
          tables: [
            {
              rowHeader: 2,
              columns: [
                { key: 'index', value: 'STT' },
                { key: 'code', value: 'Mã phiếu' },
                { key: 'assigner', value: ' Người đăng kí' },
                { key: 'approver', value: 'Người phê duyệt' },
                { key: 'createDate', value: 'Ngày tạo' },
                { key: 'supplies', value: 'Vật tư đề nghị mua sắm' },
                { key: 'note', value: 'Ghi chú' },
                { key: 'amount', value: 'Số lượng' },
                { key: 'cost', value: 'Đơn giá' },
                { key: 'supplier', value: 'Nhà cung cấp' },
                { key: 'status', value: 'Trạng thái' }
              ],
              data: data
            }
          ]
        }
      ]
    }
    return exportData
  }

  const getUserId = () => {
    let { user } = props
    let listUser = user && user.list
    let userArr = []
    listUser.map((x) => {
      userArr.push({
        value: x._id,
        text: x.name
      })
    })

    return userArr
  }

  const formatStatus = (status) => {
    const { translate } = props

    switch (status) {
      case 'approved':
        return translate('asset.usage.approved')
      case 'waiting_for_approval':
        return translate('asset.usage.waiting_approval')
      case 'disapproved':
        return translate('asset.usage.not_approved')
    }
  }

  var listPurchaseRequests = '',
    exportData
  if (purchaseRequest.isLoading === false) {
    listPurchaseRequests = purchaseRequest.listPurchaseRequests
    exportData = convertDataToExportData(listPurchaseRequests)
  }

  var pageTotal =
    purchaseRequest.totalList % limit === 0 ? parseInt(purchaseRequest.totalList / limit) : parseInt(purchaseRequest.totalList / limit + 1)

  var currentPage = parseInt(page / limit + 1)
  let userIdArr = getUserId()

  return (
    <div className='box'>
      <div className='box-body qlcv'>
        {/* Thanh tìm kiếm */}
        <div className='form-inline'>
          {/* Mã phiếu */}
          <div className='form-group'>
            <label className='form-control-static'>{translate('supplies.purchase_request.recommendNumber')}</label>
            <input
              type='text'
              className='form-control'
              name='recommendNumber'
              onChange={handleRecommendNumberChange}
              placeholder={translate('supplies.purchase_request.recommendNumber')}
              autoComplete='off'
            />
          </div>

          {/* Tháng */}
          <div className='form-group'>
            <label className='form-control-static'>{translate('supplies.purchase_request.dateCreate')}</label>
            <DatePicker value={proposalDate} id='month' dateFormat='month-year' onChange={handleMonthChange} />
          </div>
        </div>
        <div className='form-inline'>
          {/* Người đề nghị */}
          <div className='form-group'>
            <label className='form-control-static'>{translate('supplies.purchase_request.proponent')}</label>
            <input
              type='text'
              className='form-control'
              name='proponent'
              onChange={handleProposalEmployeeChange}
              placeholder='Người đề nghị'
              autoComplete='off'
            />
          </div>

          {/* Người phê duyệt */}
          <div className='form-group'>
            <label className='form-control-static'>{translate('supplies.purchase_request.approver')}</label>
            <input
              type='text'
              className='form-control'
              name='approver'
              onChange={handleApproverChange}
              placeholder='Người phê duyệt'
              autoComplete='off'
            />
          </div>
        </div>
        <div className='form-inline' style={{ marginBottom: 10 }}>
          {/* Trạng thái */}
          <div className='form-group'>
            <label className='form-control-static'>{translate('page.status')}</label>
            <SelectMulti
              id={`multiSelectStatus`}
              multiple='multiple'
              value={status}
              options={{ nonSelectedText: translate('page.non_status'), allSelectedText: translate('page.all_status') }}
              onChange={handleStatusChange}
              items={[
                { value: 'approved', text: translate('asset.usage.approved') },
                { value: 'waiting_for_approval', text: translate('asset.usage.waiting_approval') },
                { value: 'disapproved', text: translate('asset.usage.not_approved') }
              ]}
            ></SelectMulti>
          </div>

          {/* Button tìm kiếm */}
          <div className='form-group'>
            <label></label>
            <button type='button' className='btn btn-success' title={translate('page.add_search')} onClick={() => handleSubmitSearch()}>
              {translate('page.add_search')}
            </button>
          </div>
          {exportData && <ExportExcel id='export-supplies-incident-management' exportData={exportData} style={{ marginRight: 10 }} />}
        </div>

        {/* Bảng phiếu đăng ký mua sắm tài sản */}
        <table id={tableId} className='table table-striped table-bordered table-hover'>
          <thead>
            <tr>
              <th style={{ width: '10%' }}>{translate('supplies.purchase_request.recommendNumber')}</th>
              <th style={{ width: '15%' }}>{translate('supplies.purchase_request.dateCreate')}</th>
              <th style={{ width: '15%' }}>{translate('supplies.purchase_request.proponent')}</th>
              <th style={{ width: '17%' }}>{translate('supplies.purchase_request.suppliesName')}</th>
              <th style={{ width: '17%' }}>{translate('supplies.purchase_request.suppliesDescription')}</th>
              <th style={{ width: '15%' }}>{translate('supplies.purchase_request.approver')}</th>
              <th style={{ width: '17%' }}>{translate('supplies.purchase_request.note')}</th>
              <th style={{ width: '11%' }}>{translate('supplies.purchase_request.status')}</th>
              <th style={{ width: '120px', textAlign: 'center' }}>
                {translate('asset.general_information.action')}
                <DataTableSetting
                  tableId={tableId}
                  columnArr={[
                    translate('supplies.purchase_request.recommendNumber'),
                    translate('supplies.purchase_request.dateCreate'),
                    translate('supplies.purchase_request.proponent'),
                    translate('supplies.purchase_request.suppliesName'),
                    translate('supplies.purchase_request.suppliesDescription'),
                    translate('supplies.purchase_request.approver'),
                    translate('supplies.purchase_request.note'),
                    translate('supplies.purchase_request.status')
                  ]}
                  setLimit={setLimit}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {listPurchaseRequests && listPurchaseRequests.length !== 0
              ? listPurchaseRequests.map((x, index) => (
                  <tr key={index}>
                    <td>{x.recommendNumber}</td>
                    <td>{getFormatDateFromTime(x.dateCreate, 'dd-mm-yyyy')}</td>
                    <td>{x.proponent ? x.proponent.email : ''}</td>
                    <td>{x.suppliesName}</td>
                    <td>{x.suppliesDescription}</td>
                    <td>{x.approver && x.status && x.approver.length ? x.approver[0].email : ''}</td>
                    <td>{x.note}</td>
                    <td>{formatStatus(x.status)}</td>
                    <td style={{ textAlign: 'center' }}>
                      {/* <a onClick={() => handleView(x)} style={{ width: '5px' }} title={translate('supplies.manage_recommend_procure.view_recommend_card')}><i className="material-icons">view_list</i></a> */}
                      <a
                        onClick={() => handleEdit(x)}
                        className='edit text-yellow'
                        style={{ width: '5px' }}
                        title={translate('supplies.general_information.edit_recommend_card')}
                      >
                        <i className='material-icons'>edit</i>
                      </a>
                      <DeleteNotification
                        content={translate('supplies.general_information.delete_recommend_card')}
                        data={{
                          id: x._id,
                          info: x.recommendNumber + ' - ' + formatDate2(x.dateCreate)
                        }}
                        func={props.deletePurchaseRequest}
                      />
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
        {purchaseRequest.isLoading ? (
          <div className='table-info-panel'>{translate('confirm.loading')}</div>
        ) : (
          (!listPurchaseRequests || listPurchaseRequests.length === 0) && (
            <div className='table-info-panel'>{translate('confirm.no_data')}</div>
          )
        )}

        {/* PaginateBar */}
        <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={setPage} />
      </div>

      {/* Form xem chi tiết phiếu đăng ký mua sắm tài sản */}
      {currentRowView && (
        <PurchaseRequestDetailForm
          _id={currentRowView._id}
          recommendNumber={currentRowView.recommendNumber}
          dateCreate={currentRowView.dateCreate}
          proponent={currentRowView.proponent}
          suppliesName={currentRowView.suppliesName}
          suppliesDescription={currentRowView.suppliesDescription}
          supplier={currentRowView.supplier}
          total={currentRowView.total}
          unit={currentRowView.unit}
          estimatePrice={currentRowView.estimatePrice}
          approver={currentRowView.approver}
          note={currentRowView.note}
          status={currentRowView.status}
          files={currentRowView.files}
          recommendUnits={currentRowView.recommendUnits}
        />
      )}

      {/* Form chỉnh sửa phiếu đăng ký mua sắm tài sản */}
      {currentRow && (
        <PurchaseRequestEditForm
          _id={currentRow._id}
          recommendNumber={currentRow.recommendNumber}
          dateCreate={currentRow.dateCreate}
          proponent={currentRow.proponent}
          suppliesName={currentRow.suppliesName}
          suppliesDescription={currentRow.suppliesDescription}
          supplier={currentRow.supplier}
          total={currentRow.total}
          unit={currentRow.unit}
          estimatePrice={currentRow.estimatePrice}
          approver={currentRow.approver}
          note={currentRow.note}
          status={currentRow.status}
          files={currentRow.files}
          recommendUnits={currentRow.recommendUnits}
        />
      )}
    </div>
  )
}

function mapState(state) {
  const { purchaseRequest, user, auth } = state
  return { purchaseRequest, user, auth }
}

const actionCreators = {
  searchPurchaseRequests: PurchaseRequestActions.searchPurchaseRequests,
  deletePurchaseRequest: PurchaseRequestActions.deletePurchaseRequest,
  getUser: UserActions.get
}

const connectedListPurchaseRequestManager = connect(mapState, actionCreators)(withTranslate(PurchaseRequestManager))
export { connectedListPurchaseRequestManager as PurchaseRequestManager }
