import React, { Component, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DeleteNotification, DatePicker, PaginateBar, DataTableSetting, SelectMulti } from '../../../../../common-components'

import { PurchaseRequestActions } from '../../../admin/purchase-request/redux/actions'
import { UserActions } from '../../../../super-admin/user/redux/actions'

import { PurchaseRequestCreateForm } from './PurchaseRequestCreateForm'
import { PurchaseRequestDetailForm } from './PurchaseRequestDetailForm'
import { PurchaseRequestEditForm } from './PurchaseRequestEditForm'
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration'
import { formatDate } from '../../../../../helpers/assetHelper.js'
function PurchaseRequest(props) {
  const { translate, purchaseRequest, auth } = props

  const tableId_constructor = 'table-purchase-request'
  const defaultConfig = { limit: 5 }
  const limit_constructor = getTableConfiguration(tableId_constructor, defaultConfig).limit
  const [state, setState] = useState({
    tableId: tableId_constructor,
    recommendNumber: '',
    month: formatDate(Date.now()),
    status: ['approved', 'waiting_for_approval', 'disapproved'],
    page: 0,
    limit: limit_constructor,
    proponent: auth.user.email
  })

  const { page, limit, currentRowView, currentRow, tableId, month, status } = state

  var listPurchaseRequests = ''
  if (purchaseRequest.isLoading === false) {
    listPurchaseRequests = purchaseRequest.listPurchaseRequests
    console.log(purchaseRequest)
  }

  var pageTotal =
    purchaseRequest.totalList % limit === 0 ? parseInt(purchaseRequest.totalList / limit) : parseInt(purchaseRequest.totalList / limit + 1)

  var currentPage = parseInt(page / limit + 1)

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
    window.$('#modal-edit-purchaserequest').modal('show')
  }

  // Function format dữ liệu Date thành string
  const formatDate2 = (date, monthYear = false) => {
    if (!date) return null
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()

    if (month.length < 2) {
      month = '0' + month
    }

    if (day.length < 2) {
      day = '0' + day
    }

    if (monthYear === true) {
      return [month, year].join('-')
    } else {
      return [day, month, year].join('-')
    }
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
        month: value
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
  const handleSubmitSearch = () => {
    let data = state
    props.searchPurchaseRequests(data)
  }

  // Bắt sự kiện setting số dòng hiện thị trên một trang
  const setLimit = (number) => {
    setState((state) => {
      return {
        ...state,
        limit: parseInt(number)
      }
    })
    props.searchPurchaseRequests({
      ...state,
      limit: parseInt(number)
    })
  }

  // Bắt sự kiện chuyển trang
  const setPage = async (pageNumber) => {
    let page = (pageNumber - 1) * state.limit
    await setState({
      ...state,
      page: parseInt(page)
    })

    props.searchPurchaseRequests({ ...state, page: parseInt(page) })
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
      default:
        return ''
    }
  }

  return (
    <div className='box'>
      <div className='box-body qlcv'>
        {/* Form thêm mới phiếu đề nghị mua sắm vật tư */}
        {/* Cần component đăng ký mua sắm vật tư không ? - nếu có mã của component là ? */}
        <PurchaseRequestCreateForm />

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
            <DatePicker value={month} id='month' dateFormat='month-year' onChange={handleMonthChange} />
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
        </div>

        {/* Bảng thông tin đề nghị mua sắm vật tư */}
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
              ? listPurchaseRequests
                  .filter((item) => item.proponent && item.proponent._id === auth.user._id)
                  .map((x, index) => (
                    <tr key={index}>
                      <td>{x.recommendNumber}</td>
                      <td>{formatDate2(x.dateCreate)}</td>
                      <td>{x.proponent ? x.proponent.email : ''}</td>
                      <td>{x.suppliesName}</td>
                      <td>{x.suppliesDescription}</td>
                      <td>{x.approver && x.status && x.approver.length ? x.approver[0].email : ''}</td>
                      <td>{x.note}</td>
                      <td>{formatStatus(x.status)}</td>
                      <td style={{ textAlign: 'center' }}>
                        <a
                          onClick={() => handleView(x)}
                          style={{ width: '5px' }}
                          title={translate('supplies.general_information.view_recommend_card')}
                        >
                          <i className='material-icons'>view_list</i>
                        </a>
                        {(x.status === 'waiting_for_approval' || x.status === 'disapproved') && (
                          <a
                            onClick={() => handleEdit(x)}
                            className='edit text-yellow'
                            style={{ width: '5px' }}
                            title={translate('supplies.general_information.edit_recommend_card')}
                          >
                            <i className='material-icons'>edit</i>
                          </a>
                        )}
                        <DeleteNotification
                          content={translate('supplies.general_information.delete_recommend_card')}
                          data={{
                            id: x._id,
                            info: x.dateCreate ? x.recommendNumber + ' - ' + x.dateCreate.replace(/-/gi, '/') : x.recommendNumber
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
        <PaginateBar
          display={purchaseRequest.listPurchaseRequests?.length}
          total={purchaseRequest.totalList}
          pageTotal={pageTotal ? pageTotal : 0}
          currentPage={currentPage}
          func={setPage}
        />
      </div>

      {/* Form xem chi tiết phiếu đề nghị mua sắm vật tư */}
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

      {/* Form chỉnh sửa phiếu đề nghị mua sắm vật tư */}
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
          status={currentRow.status}
          approver={currentRow.approver}
          note={currentRow.note}
          files={currentRow.files}
          recommendUnits={currentRow.recommendUnits}
        />
      )}
    </div>
  )
}

function mapState(state) {
  const { purchaseRequest, auth } = state
  return { purchaseRequest, auth }
}

const actionCreators = {
  searchPurchaseRequests: PurchaseRequestActions.searchPurchaseRequests,
  deletePurchaseRequest: PurchaseRequestActions.deletePurchaseRequest,
  getUser: UserActions.get
}

const connectedListPurchaseRequest = connect(mapState, actionCreators)(withTranslate(PurchaseRequest))
export { connectedListPurchaseRequest as PurchaseRequest }
