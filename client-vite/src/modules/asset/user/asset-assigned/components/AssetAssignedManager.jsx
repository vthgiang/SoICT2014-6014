import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DataTableSetting, PaginateBar, SelectMulti, TreeSelect } from '../../../../../common-components'

import { AssetManagerActions } from '../../../admin/asset-information/redux/actions'
import { AssetTypeActions } from '../../../admin/asset-type/redux/actions'
import { UserActions } from '../../../../super-admin/user/redux/actions'

import { IncidentCreateForm } from './incidentCreateForm'
import { AssetDetailForm } from '../../../admin/asset-information/components/assetDetailForm'
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration'

function AssetAssignedManager(props) {
  const tableId_constructor = 'table-asset-assign-manager'
  const defaultConfig = { limit: 10 }
  const limit_constructor = getTableConfiguration(tableId_constructor, defaultConfig).limit

  const [state, setState] = useState({
    code: '',
    assetName: '',
    // assetType: null,
    month: null,
    status: '',
    page: 0,
    limit: limit_constructor,
    tableId: tableId_constructor
  })

  useEffect(() => {
    props.getAssetTypes()
    props.getAllAsset({ ...state })
    props.getUser()
  }, [])

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

  // Bắt sự kiện click báo cáo sự cố tài sản
  const handleReport = async (value, asset) => {
    value.asset = asset
    await setState((state) => {
      return {
        ...state,
        currentRow: value
      }
    })
    window.$('#modal-create-assetcrash').modal('show')
  }

  // Function format dữ liệu Date thành string
  const formatDate2 = (date, monthYear = false) => {
    const d = new Date(date)
    let month = `${d.getMonth() + 1}`
    let day = `${d.getDate()}`
    const year = d.getFullYear()

    if (month.length < 2) {
      month = `0${month}`
    }

    if (day.length < 2) {
      day = `0${day}`
    }

    if (monthYear === true) {
      return [month, year].join('-')
    }
    return [day, month, year].join('-')
  }

  // Function format ngày hiện tại thành dạnh mm-yyyy
  const formatDate = (date) => {
    const d = new Date(date)
    let month = `${d.getMonth() + 1}`
    let day = `${d.getDate()}`
    const year = d.getFullYear()

    if (month.length < 2) {
      month = `0${month}`
    }

    if (day.length < 2) {
      day = `0${day}`
    }

    return [month, year].join('-')
  }

  // Function lưu giá trị mã tài sản vào state khi thay đổi
  const handleCodeChange = (event) => {
    const { name, value } = event.target
    setState((state) => {
      return {
        ...state,
        [name]: value
      }
    })
  }

  // Function lưu giá trị tên tài sản vào state khi thay đổi
  const handleAssetNameChange = (event) => {
    const { name, value } = event.target
    setState((state) => {
      return {
        ...state,
        [name]: value
      }
    })
  }

  // Function lưu giá trị loại tài sản vào state khi thay đổi
  const handleAssetTypeChange = (value) => {
    if (value.length === 0) {
      value = null
    }

    setState((state) => {
      return {
        ...state,
        assetType: JSON.stringify(value)
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
  // Function lưu nhóm tài sản vào state khi thay đổi
  const handleGroupChange = (value) => {
    if (value.length === 0) {
      value = null
    }

    setState((state) => {
      return {
        ...state,
        group: value
      }
    })
  }
  // Function lưu giá trị người sử dụng vào state khi thay đổi
  const handleHandoverUserChange = (value) => {
    if (value.length === 0) {
      value = null
    }

    setState((state) => {
      return {
        ...state,
        handoverUser: value
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
    props.getAllAsset(state)
  }

  // Bắt sự kiện setting số dòng hiện thị trên một trang
  const setLimit = async (number) => {
    await setState((state) => {
      return {
        ...state,
        limit: parseInt(number)
      }
    })
    props.getAllAsset({ ...state, limit: 10000, page: 0 })
  }

  // Bắt sự kiện chuyển trang
  const setPage = async (pageNumber) => {
    const page = (pageNumber - 1) * state.limit
    await setState((state) => {
      return {
        ...state,
        page: parseInt(page)
      }
    })
    props.getAllAsset({ ...state, page: 0, limit: 10000 })
  }
  const getAssetTypes = () => {
    const { assetType } = props
    const assetTypeName = assetType && assetType.listAssetTypes
    const typeArr = []
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

  const getUserAndDepartment = () => {
    const { user } = props
    const listUser = user && user.list
    const data = {
      userArr: []
    }

    listUser &&
      listUser.map((x) => {
        data.userArr.push({
          value: x._id,
          text: x.name
        })
      })

    return data
  }
  const formatStatus = (status) => {
    const { translate } = props

    if (status === 'ready_to_use') {
      return translate('asset.general_information.ready_use')
    }
    if (status === 'in_use') {
      return translate('asset.general_information.using')
    }
    if (status === 'broken') {
      return translate('asset.general_information.damaged')
    }
    if (status === 'lost') {
      return translate('asset.general_information.lost')
    }
    if (status === 'disposed') {
      return translate('asset.general_information.disposal')
    }
    return ''
  }

  const { id, translate, assetsManager, assetType, user, auth } = props
  const { page, limit, currentRowView, currentRow, tableId } = state

  let lists = ''
  const userlist = user.list
  const assettypelist = assetType.listAssetTypes
  const assetTypeName = state.assetType ? state.assetType : []

  const formater = new Intl.NumberFormat()
  if (assetsManager.isLoading === false) {
    lists = assetsManager.listAssets
  }

  const currentPage = parseInt(page / limit + 1)
  const typeArr = getAssetTypes()
  const dataSelectBox = getUserAndDepartment()
  let pageTotal = 0
  let listAssetAssigns
  let listAssetAssignShow
  if (lists && lists.length !== 0) {
    listAssetAssigns = lists.filter((item) => item.assignedToUser === auth.user._id)
    pageTotal =
      listAssetAssigns.length % limit === 0 ? parseInt(listAssetAssigns.length / limit) : parseInt(listAssetAssigns.length / limit + 1)
    listAssetAssignShow = listAssetAssigns.slice((currentPage - 1) * limit, currentPage * limit)
  }

  // console.log(pageTotal,limit,listAssetAssigns,lists,page,currentPage);
  return (
    <div id='assetassigned' className='tab-pane active'>
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
              id='multiSelectGroupInManagement'
              multiple='multiple'
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
            />
          </div>

          {/* Loại tài sản */}
          <div className='form-group'>
            <label>{translate('asset.general_information.asset_type')}</label>
            <TreeSelect data={typeArr} value={assetTypeName} handleChange={handleAssetTypeChange} mode='hierarchical' />
          </div>
        </div>

        <div className='form-inline' style={{ marginBottom: 10 }}>
          {/* Trạng thái */}
          <div className='form-group'>
            <label className='form-control-static'>{translate('page.status')}</label>
            <SelectMulti
              id='multiSelectStatus1'
              multiple='multiple'
              options={{
                nonSelectedText: translate('page.non_status'),
                allSelectedText: translate('asset.general_information.select_all_status')
              }}
              onChange={handleStatusChange}
              items={[
                { value: 'ready_to_use', text: translate('asset.general_information.ready_use') },
                { value: 'in_use', text: translate('asset.general_information.using') },
                { value: 'broken', text: translate('asset.general_information.damaged') },
                { value: 'lost', text: translate('asset.general_information.lost') },
                { value: 'disposed', text: translate('asset.general_information.disposal') }
              ]}
            />
          </div>
          {/* Button tìm kiếm */}
          <div className='form-group'>
            <label htmlFor='' />
            <button
              type='button'
              className='btn btn-success'
              title={translate('asset.general_information.search')}
              onClick={() => handleSubmitSearch()}
            >
              {translate('asset.general_information.search')}
            </button>
          </div>
        </div>

        {/* Bảng thông tin thiết bị bàn giao */}
        <table id={tableId} className='table table-striped table-bordered table-hover'>
          <thead>
            <tr>
              <th style={{ width: '8%' }}>{translate('asset.general_information.asset_code')}</th>
              <th style={{ width: '10%' }}>{translate('asset.general_information.asset_name')}</th>
              <th style={{ width: '10%' }}>{translate('asset.general_information.asset_type')}</th>
              <th style={{ width: '10%' }}>{translate('asset.general_information.asset_value')}</th>
              <th style={{ width: '10%' }}>{translate('asset.general_information.status')}</th>
              <th style={{ width: '120px', textAlign: 'center' }}>
                {translate('table.action')}
                <DataTableSetting
                  tableId={tableId}
                  columnArr={[
                    translate('asset.general_information.asset_code'),
                    translate('asset.general_information.asset_name'),
                    translate('asset.general_information.asset_type'),
                    translate('asset.general_information.asset_value'),
                    translate('asset.general_information.status')
                  ]}
                  setLimit={setLimit}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {listAssetAssignShow && listAssetAssignShow.length !== 0
              ? listAssetAssignShow.map((x, index) => (
                  <tr key={index}>
                    <td>{x.code}</td>
                    <td>{x.assetName}</td>
                    <td>
                      {x.assetType && x.assetType.length
                        ? x.assetType.map((item, index) => {
                            const suffix = index < x.assetType.length - 1 ? ', ' : ''
                            return item.typeName + suffix
                          })
                        : ''}
                    </td>
                    <td>{formater.format(parseInt(x.cost))} VNĐ</td>
                    <td>{formatStatus(x.status)}</td>
                    <td style={{ textAlign: 'center' }}>
                      <a onClick={() => handleView(x)} style={{ width: '5px' }} title={translate('asset.general_information.view')}>
                        <i className='material-icons'>view_list</i>
                      </a>
                      <a
                        onClick={() => handleReport(x, x)}
                        className='edit text-red'
                        style={{ width: '5px' }}
                        title={translate('asset.incident.report_incident')}
                      >
                        <i className='material-icons'>notification_important</i>
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
          (typeof listAssetAssigns === 'undefined' || listAssetAssigns.length === 0) && (
            <div className='table-info-panel'>{translate('confirm.no_data')}</div>
          )
        )}

        {/* PaginateBar */}
        <PaginateBar pageTotal={pageTotal || 0} currentPage={currentPage} func={setPage} />
      </div>

      {/* Form xem chi tiết tài sản */}
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
          managedBy={currentRowView.managedBy}
          assignedToUser={currentRowView.assignedToUser}
          assignedToOrganizationalUnit={currentRowView.assignedToOrganizationalUnit}
          typeRegisterForUse={currentRowView.typeRegisterForUse}
          location={currentRowView.location}
          description={currentRowView.description}
          status={currentRowView.status}
          detailInfo={currentRowView.detailInfo}
          cost={currentRowView.cost}
          residualValue={currentRowView.residualValue}
          startDepreciation={currentRowView.startDepreciation}
          usefulLife={currentRowView.usefulLife}
          depreciationType={currentRowView.depreciationType}
          maintainanceLogs={currentRowView.maintainanceLogs}
          usageLogs={currentRowView.usageLogs}
          incidentLogs={currentRowView.incidentLogs}
          disposalDate={currentRowView.disposalDate}
          disposalType={currentRowView.disposalType}
          disposalCost={currentRowView.disposalCost}
          disposalDesc={currentRowView.disposalDesc}
          archivedRecordNumber={currentRowView.archivedRecordNumber}
          files={currentRowView.files}
        />
      )}

      {/* Form thêm thông tin sự cố */}
      {currentRow && <IncidentCreateForm _id={currentRow._id} asset={currentRow.asset} />}
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

const connectedListAssetAssigned = connect(mapState, actionCreators)(withTranslate(AssetAssignedManager))
export { connectedListAssetAssigned as AssetAssignedManager }
