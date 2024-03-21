import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { PaginateBar, DataTableSetting, SelectMulti, TreeSelect } from '../../../../../common-components'

import { AssetManagerActions } from '../../../admin/asset-information/redux/actions'
import { AssetTypeActions } from '../../../admin/asset-type/redux/actions'
import { UserActions } from '../../../../super-admin/user/redux/actions'

import { UseRequestCreateForm } from './UseRequestCreateForm'
import { AssetDetailForm } from '../../../admin/asset-information/components/assetDetailForm'
import { getPropertyOfValue } from '../../../../../helpers/stringMethod'
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration'

function ListAsset(props) {
  const tableId_constructor = 'table-list-asset'
  const defaultConfig = { limit: 5 }
  const limit_constructor = getTableConfiguration(tableId_constructor, defaultConfig).limit

  const [state, setState] = useState({
    tableId: tableId_constructor,
    code: '',
    assetName: '',
    assetType: null,
    status: '',
    typeRegisterForUse: ['2', '3'],
    page: 0,
    limit: limit_constructor,
    currentRole: localStorage.getItem('currentRole')
  })
  useEffect(() => {
    props.getAssetTypes()
    props.getAllAsset({
      ...state
    })
    props.getUser()
  }, [])

  const { translate, assetsManager, assetType, user, auth } = props
  const { page, limit, currentRowView, currentRow, tableId, group, status, typeRegisterForUse } = state

  // Bắt sự kiện click xem thông tin tài sản
  const handleView = async (value) => {
    await setState((state) => {
      return {
        ...state,
        currentRowView: value
      }
    })
    window.$('#modal-view-asset').modal('show')
  }

  // Bắt sự kiện click đăng ký cấp phát tài sản
  const handleCreateRecommend = async (value, asset) => {
    value.asset = asset
    await setState((state) => {
      return {
        ...state,
        currentRow: value
      }
    })
    window.$(`#modal-create-recommenddistribute-${value._id}`).modal('show')
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

  // Function lưu giá trị mã tài sản vào state khi thay đổi
  const handleCodeChange = (event) => {
    const { name, value } = event.target
    setState({
      ...state,
      [name]: value
    })
  }

  // Function lưu giá trị tên tài sản vào state khi thay đổi
  const handleAssetNameChange = (event) => {
    const { name, value } = event.target
    setState({
      ...state,
      [name]: value
    })
  }

  // Function lưu giá trị loại tài sản vào state khi thay đổi
  const handleAssetTypeChange = (value) => {
    if (value.length === 0) {
      value = null
    }

    setState({
      ...state,
      assetType: value
    })
  }

  // Bắt sự kiện thay đổi nhóm tài sản
  const handleGroupChange = (value) => {
    if (value.length === 0) {
      value = null
    }

    setState({
      ...state,
      group: value
    })
  }

  // Function lưu giá trị status vào state khi thay đổi
  const handleStatusChange = (value) => {
    if (value.length === 0) {
      value = null
    }

    setState({
      ...state,
      status: value
    })
  }

  // Function lưu giá trị status vào state khi thay đổi
  const handleTypeRegisterForUseChange = async (value) => {
    if (value.length === 0) {
      value = null
    }

    await setState({
      ...state,
      typeRegisterForUse: value
    })
  }
  // Function bắt sự kiện tìm kiếm
  const handleSubmitSearch = async () => {
    await setState({
      ...state,
      page: 0
    })

    props.getAllAsset({ ...state, page: 0 })
  }

  // Bắt sự kiện setting số dòng hiện thị trên một trang
  const setLimit = async (number) => {
    await setState((state) => {
      return {
        ...state,
        limit: parseInt(number)
      }
    })
    props.getAllAsset({ ...state, limit: parseInt(number) })
  }

  // Bắt sự kiện chuyển trang
  const setPage = async (pageNumber) => {
    let page = (pageNumber - 1) * state.limit
    await setState({
      ...state,
      page: parseInt(page)
    })

    props.getAllAsset({ ...state, page: parseInt(page) })
  }

  const getAssetTypes = () => {
    let { assetType } = props
    let assetTypeName = assetType && assetType.listAssetTypes
    let typeArr = []
    assetTypeName.map((item) => {
      typeArr.push({
        _id: item._id,
        id: item._id,
        name: item.typeName,
        parent: item.parent ? item.parent._id : null
      })
    })
    return typeArr
  }

  const convertGroupAsset = (group) => {
    const { translate } = props
    if (group === 'building') {
      return translate('asset.dashboard.building')
    } else if (group === 'vehicle') {
      return translate('asset.dashboard.vehicle')
    } else if (group === 'machine') {
      return translate('asset.dashboard.machine')
    } else if (group === 'other') {
      return translate('asset.dashboard.other')
    }
  }

  const convertStatusAsset = (status) => {
    const { translate } = props
    if (status === 'ready_to_use') {
      return translate('asset.general_information.ready_use')
    } else if (status === 'in_use') {
      return translate('asset.general_information.using')
    } else if (status === 'broken') {
      return translate('asset.general_information.damaged')
    } else if (status === 'lost') {
      return translate('asset.general_information.lost')
    } else if (status === 'disposed') {
      return translate('asset.general_information.disposal')
    }
  }

  const converttypeRegisterForUseAsset = (value) => {
    if (value === 3) {
      return 'Đăng ký sử dụng lâu dài'
    } else if (value === 2) {
      return 'Đăng ký sử dụng theo giờ'
    }
  }

  var lists = ''
  var userlist = user.list
  var assettypelist = assetType.listAssetTypes
  let assetTypeName = state.assetType ? state.assetType : []

  if (assetsManager.isLoading === false) {
    lists = assetsManager.listAssets
  }

  var pageTotal =
    assetsManager.totalList % limit === 0 ? parseInt(assetsManager.totalList / limit) : parseInt(assetsManager.totalList / limit + 1)

  var currentPage = parseInt(page / limit + 1)
  let typeArr = getAssetTypes()

  return (
    <div id='listasset' className='tab-pane active'>
      <div className='box-body qlcv'>
        {/* Thanh tìm kiếm */}
        <div className='form-inline'>
          {/* Mã tài sản */}
          <div className='form-group'>
            <label className='form-control-static'>{translate('asset.general_information.asset_code')}</label>
            <input
              type='text'
              className='form-control'
              name='code'
              onChange={handleCodeChange}
              placeholder={translate('asset.general_information.asset_code')}
              autoComplete='off'
            />
          </div>

          {/* Tên tài sản */}
          <div className='form-group'>
            <label className='form-control-static'>{translate('asset.general_information.asset_name')}</label>
            <input
              type='text'
              className='form-control'
              name='assetName'
              onChange={handleAssetNameChange}
              placeholder={translate('asset.general_information.asset_name')}
              autoComplete='off'
            />
          </div>
        </div>

        <div className='form-inline'>
          {/* Nhóm tài sản */}
          <div className='form-group'>
            <label className='form-control-static'>{translate('asset.general_information.asset_group')}</label>
            <SelectMulti
              id={`multiSelectGroupInManagement`}
              multiple='multiple'
              value={group}
              options={{
                nonSelectedText: translate('asset.asset_info.select_group'),
                allSelectedText: translate('asset.general_information.select_all_group')
              }}
              onChange={handleGroupChange}
              items={[
                { value: 'building', text: translate('asset.dashboard.building') },
                { value: 'vehicle', text: translate('asset.asset_info.vehicle') },
                { value: 'machine', text: translate('asset.dashboard.machine') },
                { value: 'other', text: translate('asset.dashboard.other') }
              ]}
            ></SelectMulti>
          </div>

          {/* Loại tài sản */}
          <div className='form-group'>
            <label>{translate('asset.general_information.asset_type')}</label>
            <TreeSelect data={typeArr} value={assetTypeName} handleChange={handleAssetTypeChange} mode='hierarchical' />
          </div>
        </div>

        <div className='form-inline' style={{ marginBottom: 10 }}>
          {/* Quyền đăng ký sử dụng */}
          <div className='form-group'>
            <label>Quyền đăng ký</label>
            <SelectMulti
              id={`typeRegisterForUseInManagement`}
              className='form-control select2'
              multiple='multiple'
              value={typeRegisterForUse}
              options={{ nonSelectedText: 'Chọn quyền sử dụng', allSelectedText: 'Chọn tất cả' }}
              style={{ width: '100%' }}
              items={[
                { value: 2, text: 'Đăng ký sử dụng theo giờ' },
                { value: 3, text: 'Đăng ký sử dụng lâu dài' }
              ]}
              onChange={handleTypeRegisterForUseChange}
            />
          </div>

          {/* Trạng thái */}
          <div className='form-group'>
            <label className='form-control-static'>{translate('page.status')}</label>
            <SelectMulti
              id={`multiSelectStatus1`}
              multiple='multiple'
              value={status}
              options={{
                nonSelectedText: translate('page.non_status'),
                allSelectedText: translate('asset.general_information.select_all_status')
              }}
              onChange={handleStatusChange}
              items={[
                { value: 'ready_use', text: translate('asset.general_information.ready_use') },
                { value: 'using', text: translate('asset.general_information.using') },
                { value: 'damaged', text: translate('asset.general_information.damaged') },
                { value: 'lost', text: translate('asset.general_information.lost') },
                { value: 'disposal', text: translate('asset.general_information.disposal') }
              ]}
            ></SelectMulti>
          </div>

          {/* Button tìm kiếm */}
          <div className='form-group'>
            <button
              type='button'
              className='btn btn-success'
              title={translate('asset.general_information.search')}
              onClick={handleSubmitSearch}
            >
              {translate('asset.general_information.search')}
            </button>
          </div>
        </div>

        {/* Bảng đăng kí sử dụng thiết bị */}
        <table id={tableId} className='table table-striped table-bordered table-hover'>
          <thead>
            <tr>
              <th style={{ width: '8%' }}>{translate('asset.general_information.asset_code')}</th>
              <th style={{ width: '10%' }}>{translate('asset.general_information.asset_name')}</th>
              <th style={{ width: '10%' }}>{translate('asset.general_information.asset_group')}</th>
              <th style={{ width: '10%' }}>{translate('asset.general_information.asset_type')}</th>
              <th style={{ width: '10%' }}>{translate('asset.general_information.can_register')}</th>
              <th style={{ width: '10%' }}>{translate('asset.general_information.status')}</th>
              <th style={{ width: '120px', textAlign: 'center' }}>
                {translate('asset.general_information.action')}
                <DataTableSetting
                  tableId={tableId}
                  columnArr={[
                    translate('asset.general_information.asset_code'),
                    translate('asset.general_information.asset_name'),
                    translate('asset.general_information.asset_group'),
                    translate('asset.general_information.asset_type'),
                    translate('asset.general_information.can_register'),
                    translate('asset.general_information.status')
                  ]}
                  setLimit={setLimit}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {lists && lists.length !== 0
              ? lists
                  .filter((item) => item.typeRegisterForUse !== 1)
                  .map((x, index) => (
                    <tr key={index}>
                      <td>{x.code}</td>
                      <td>{x.assetName}</td>
                      <td>{convertGroupAsset(x.group)}</td>
                      <td>
                        {x.assetType && x.assetType.length
                          ? x.assetType.map((item, index) => {
                              let suffix = index < x.assetType.length - 1 ? ', ' : ''
                              return item.typeName + suffix
                            })
                          : ''}
                      </td>
                      <td>{x.typeRegisterForUse ? converttypeRegisterForUseAsset(x.typeRegisterForUse) : ''}</td>
                      <td>{convertStatusAsset(x.status)}</td>
                      <td style={{ textAlign: 'center' }}>
                        <a onClick={() => handleView(x)} style={{ width: '5px' }} title={translate('asset.general_information.view')}>
                          <i className='material-icons'>view_list</i>
                        </a>
                        <a
                          onClick={() => handleCreateRecommend(x)}
                          className='post_add'
                          style={{ width: '5px' }}
                          title={translate('menu.recommend_distribute_asset')}
                        >
                          <i className='material-icons'>post_add</i>
                        </a>
                      </td>
                    </tr>
                  ))
              : null}
          </tbody>
        </table>
        {assetsManager.isLoading ? (
          <div className='table-info-panel'>{translate('confirm.loading')}</div>
        ) : (
          (!lists || lists.length === 0) && <div className='table-info-panel'>{translate('confirm.no_data')}</div>
        )}

        {/* PaginateBar */}
        <PaginateBar
          display={assetsManager.listAssets?.length}
          total={assetsManager.totalList}
          pageTotal={pageTotal ? pageTotal : 0}
          currentPage={currentPage}
          func={setPage}
        />
      </div>

      {/* Form xem chi tiết thông tin tài sản */}
      {currentRowView && (
        <AssetDetailForm
          _id={currentRowView._id}
          avatar={currentRowView.avatar}
          code={currentRowView.code}
          assetName={currentRowView.assetName}
          serial={currentRowView.serial}
          assetType={currentRowView.assetType}
          purchaseDate={currentRowView.purchaseDate}
          warrantyExpirationDate={currentRowView.warrantyExpirationDate}
          managedBy={getPropertyOfValue(currentRowView.managedBy, '_id', true, userlist)}
          assignedToUser={currentRowView.assignedToUser}
          assignedToOrganizationalUnit={currentRowView.assignedToOrganizationalUnit}
          handoverFromDate={currentRowView.handoverFromDate}
          handoverToDate={currentRowView.handoverToDate}
          location={currentRowView.location}
          description={currentRowView.description}
          status={currentRowView.status}
          typeRegisterForUse={currentRowView.typeRegisterForUse}
          detailInfo={currentRowView.detailInfo}
          readByRoles={currentRowView.readByRoles}
          group={currentRowView.group}
          cost={currentRowView.cost}
          residualValue={currentRowView.residualValue}
          startDepreciation={currentRowView.startDepreciation}
          usefulLife={currentRowView.usefulLife}
          depreciationType={currentRowView.depreciationType}
          maintainanceLogs={currentRowView.maintainanceLogs}
          usageLogs={currentRowView.usageLogs}
          incidentLogs={currentRowView.incidentLogs}
          residualValue={currentRowView.residualValue}
          startDepreciation={currentRowView.startDepreciation}
          usefulLife={currentRowView.usefulLife}
          depreciationType={currentRowView.depreciationType}
          archivedRecordNumber={currentRowView.archivedRecordNumber}
          files={currentRowView.files}
        />
      )}

      {/* Form thêm mới phiếu đăng ký sử dụng thiết bị */}
      {currentRow && (
        <UseRequestCreateForm
          _id={currentRow._id}
          asset={currentRow._id}
          typeRegisterForUse={currentRow.typeRegisterForUse}
          managedBy={currentRow.managedBy}
        />
      )}
    </div>
  )
}

function mapState(state) {
  const { assetsManager, assetType, user, auth } = state
  return { assetsManager, assetType, user, auth }
}

const actionCreators = {
  getAssetTypes: AssetTypeActions.getAssetTypes,
  getAllAsset: AssetManagerActions.getAllAsset,
  getUser: UserActions.get
}

const connectedListAsset = connect(mapState, actionCreators)(withTranslate(ListAsset))
export { connectedListAsset as ListAsset }
