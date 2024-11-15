import React, { Component, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DeleteNotification, DatePicker, PaginateBar, DataTableSetting, SelectMulti } from '../../../../../common-components'

import { UseRequestEditForm } from './UseRequestEditForm'

import { AssetManagerActions } from '../../../admin/asset-information/redux/actions'
import { UserActions } from '../../../../super-admin/user/redux/actions'
import { RecommendDistributeActions } from '../redux/actions'
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration'
import { taskManagementActions } from '../../../../task/task-management/redux/actions'

function UseRequest(props) {
  const { translate, recommendDistribute, auth } = props

  const tableId_constructor = 'table-use-request'
  const defaultConfig = { limit: 10 }
  const limit_constructor = getTableConfiguration(tableId_constructor, defaultConfig).limit
  const [state, setState] = useState({
    tableId: tableId_constructor,
    receiptsCode: '',
    reqUseStatus: null,
    page: 0,
    limit: limit_constructor,
    reqUseEmployee: auth.user.email
  })
  const { page, limit, currentRowEdit, tableId } = state

  useEffect(() => {
    props.searchRecommendDistributes({ ...state })
    props.getUser()
  }, [])

  // Bắt sự kiện click chỉnh sửa thông tin phiếu đăng ký cấp phát
  const handleEdit = async (value) => {
    await setState((state) => {
      return {
        ...state,
        currentRowEdit: value
      }
    })
    window.$('#modal-edit-recommenddistribute').modal('show')
  }

  // Function format dữ liệu Date thành string
  const formatDate2 = (date, monthYear = false) => {
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

  // Function format ngày hiện tại thành dạnh mm-yyyy
  const formatDate = (date) => {
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

    return [month, year].join('-')
  }

  const formatDateTime = (date, typeRegisterForUse) => {
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
    if (typeRegisterForUse === 2) {
      let hour = d.getHours(),
        minutes = d.getMinutes()
      if (hour < 10) {
        hour = '0' + hour
      }

      if (minutes < 10) {
        minutes = '0' + minutes
      }

      let formatDate = [hour, minutes].join(':') + ' ' + [day, month, year].join('-')
      return formatDate
    } else {
      let formatDate = [day, month, year].join('-')
      return formatDate
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
        createReceiptsDate: value
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
        reqUseStatus: value
      }
    })
  }

  // Function bắt sự kiện tìm kiếm
  const handleSubmitSearch = async () => {
    props.searchRecommendDistributes(state)
  }

  // Bắt sự kiện setting số dòng hiện thị trên một trang
  const setLimit = async (number) => {
    await setState((state) => {
      return {
        ...state,
        limit: parseInt(number)
      }
    })
    props.searchRecommendDistributes({ ...state, limit: parseInt(number) })
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
    props.searchRecommendDistributes({ ...state, page: parseInt(page) })
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

  var listRecommendDistributes = ''

  if (recommendDistribute.isLoading === false) {
    listRecommendDistributes = recommendDistribute.listRecommendDistributes
  }

  var pageTotal =
    recommendDistribute.totalList % limit === 0
      ? parseInt(recommendDistribute.totalList / limit)
      : parseInt(recommendDistribute.totalList / limit + 1)

  var currentPage = parseInt(page / limit + 1)

  return (
    <div id='recommenddistribute' className='tab-pane'>
      <div className='box-body qlcv'>
        {/* Thanh tìm kiếm */}
        <div className='form-inline'>
          {/* Mã phiếu */}
          <div className='form-group'>
            <label className='form-control-static'>{translate('asset.general_information.form_code')}</label>
            <input
              type='text'
              className='form-control'
              name='receiptsCode'
              onChange={handleRecommendNumberChange}
              placeholder={translate('asset.general_information.form_code')}
              autoComplete='off'
            />
          </div>

          {/* Tháng */}
          <div className='form-group'>
            <label className='form-control-static'>{translate('asset.usage.time_created')}</label>
            <DatePicker id='month' dateFormat='month-year' onChange={handleMonthChange} />
          </div>
        </div>

        <div className='form-inline' style={{ marginBottom: 10 }}>
          {/* Trạng thái */}
          <div className='form-group'>
            <label className='form-control-static'>{translate('page.status')}</label>
            <SelectMulti
              id={`multiSelectStatus`}
              multiple='multiple'
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

        {/* Bảng thông tin đăng ký sử dụng tài sản */}
        <table id={tableId} className='table table-striped table-bordered table-hover'>
          <thead>
            <tr>
              <th style={{ width: '10%' }}>{translate('asset.general_information.form_code')}</th>
              <th style={{ width: '15%' }}>{translate('asset.general_information.create_date')}</th>
              <th style={{ width: '15%' }}>{translate('asset.usage.proponent')}</th>
              <th style={{ width: '17%' }}>{translate('asset.general_information.asset_code')}</th>
              <th style={{ width: '15%' }}>{translate('asset.general_information.asset_name')}</th>
              <th style={{ width: '17%' }}>{translate('asset.general_information.handover_from_date')}</th>
              <th style={{ width: '17%' }}>{translate('asset.general_information.handover_to_date')}</th>
              <th style={{ width: '17%' }}>{translate('asset.usage.task_in_use_request')}</th>
              <th style={{ width: '17%' }}>{translate('asset.usage.accountable')}</th>
              <th style={{ width: '11%' }}>{translate('asset.general_information.status')}</th>
              <th style={{ width: '120px', textAlign: 'center' }}>
                {translate('table.action')}
                <DataTableSetting
                  tableId={tableId}
                  columnArr={[
                    translate('asset.general_information.form_code'),
                    translate('asset.general_information.create_date'),
                    translate('asset.usage.proponent'),
                    translate('asset.general_information.asset_code'),
                    translate('asset.general_information.asset_name'),
                    translate('asset.general_information.handover_from_date'),
                    translate('asset.general_information.handover_to_date'),
                    translate('asset.usage.task_in_use_request'),
                    translate('asset.usage.accountable'),
                    translate('asset.general_information.status')
                  ]}
                  setLimit={setLimit}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {listRecommendDistributes && listRecommendDistributes.length !== 0
              ? listRecommendDistributes
                  .filter((item) => item.proponent && item.proponent._id === auth.user._id)
                  .map((x, index) => {
                    return (
                      <tr key={index}>
                        <td>{x.recommendNumber}</td>
                        <td>{formatDateTime(x.dateCreate)}</td>
                        <td>{x.proponent ? x.proponent.email : ''}</td>
                        <td>{x.asset ? x.asset.code : ''}</td>
                        <td>{x.asset ? x.asset.assetName : ''}</td>
                        <td>{x.asset ? formatDateTime(x.dateStartUse, x.asset.typeRegisterForUse) : ''}</td>
                        <td>{x.asset && x.dateEndUse ? formatDateTime(x.dateEndUse, x.asset.typeRegisterForUse) : ''}</td>
                        <td>{x.task ? x.task.name : ''}</td>
                        <td>{x.approver ? x.approver.email : ''}</td>
                        <td>{formatStatus(x.status)}</td>
                        <td style={{ textAlign: 'center' }}>
                          {(x.status === 'disapproved' || x.status === 'waiting_for_approval') && (
                            <a
                              onClick={() => handleEdit(x)}
                              className='edit text-yellow'
                              style={{ width: '5px' }}
                              title={translate('asset.asset_info.edit_usage_info')}
                            >
                              <i className='material-icons'>edit</i>
                            </a>
                          )}
                          <DeleteNotification
                            content={translate('asset.asset_info.delete_usage_info')}
                            data={{
                              id: x._id,
                              info: x.recommendNumber ? x.recommendNumber : ''
                            }}
                            func={props.deleteRecommendDistribute}
                          />
                        </td>
                      </tr>
                    )
                  })
              : null}
          </tbody>
        </table>
        {recommendDistribute.isLoading ? (
          <div className='table-info-panel'>{translate('confirm.loading')}</div>
        ) : (
          (!listRecommendDistributes || listRecommendDistributes.length === 0) && (
            <div className='table-info-panel'>{translate('confirm.no_data')}</div>
          )
        )}

        {/* PaginateBar */}
        <PaginateBar
          display={recommendDistribute.listRecommendDistributes?.length}
          total={recommendDistribute.totalList}
          pageTotal={pageTotal ? pageTotal : 0}
          currentPage={currentPage}
          func={setPage}
        />
      </div>

      {/* Form chỉnh sửa thông tin đăng ký sử dụng tài sản */}
      {currentRowEdit && (
        <UseRequestEditForm
          _id={currentRowEdit._id}
          recommendNumber={currentRowEdit.recommendNumber}
          dateCreate={currentRowEdit.dateCreate}
          proponent={currentRowEdit.proponent}
          reqContent={currentRowEdit.reqContent}
          asset={currentRowEdit.asset}
          task={currentRowEdit.task}
          dateStartUse={currentRowEdit.dateStartUse}
          dateEndUse={currentRowEdit.dateEndUse}
          status={currentRowEdit.status}
          approver={currentRowEdit.approver}
          note={currentRowEdit.note}
        />
      )}
    </div>
  )
}

function mapState(state) {
  const { recommendDistribute, assetsManager, assetType, user, auth } = state
  return { recommendDistribute, assetsManager, assetType, user, auth }
}

const actionCreators = {
  getAllAsset: AssetManagerActions.getAllAsset,
  getUser: UserActions.get,
  searchRecommendDistributes: RecommendDistributeActions.searchRecommendDistributes,
  deleteRecommendDistribute: RecommendDistributeActions.deleteRecommendDistribute
}

const connectedListRecommendDistribute = connect(mapState, actionCreators)(withTranslate(UseRequest))
export { connectedListRecommendDistribute as UseRequest }
