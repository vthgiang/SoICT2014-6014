import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { AssetTypeActions } from '../../../admin/asset-type/redux/actions'
import { ApiImage } from '../../../../../common-components'

function GeneralTab(props) {
  const [state, setState] = useState({
    defaultAvatar: './upload/asset/pictures/picture5.png'
  })

  const [prevProps, setPrevProps] = useState({
    id: null
  })

  useEffect(() => {
    props.getAssetTypes()
  }, [])

  // Function format dữ liệu Date thành string
  const formatDate = (date, monthYear = false) => {
    if (!date) return null
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

  const convertGroupAsset = (group) => {
    const { translate } = props
    if (group === 'building') {
      return translate('asset.dashboard.building')
    }
    if (group === 'vehicle') {
      return translate('asset.asset_info.vehicle')
    }
    if (group === 'machine') {
      return translate('asset.dashboard.machine')
    }
    if (group === 'other') {
      return translate('asset.dashboard.other')
    }
    return null
  }

  if (prevProps.id !== props.id) {
    setState({
      ...state,
      id: props.id,
      avatar: props.avatar,
      code: props.code,
      assetName: props.assetName,
      serial: props.serial,
      assetTypes: props.assetTypes,
      group: props.group,
      purchaseDate: props.purchaseDate,
      warrantyExpirationDate: props.warrantyExpirationDate,
      managedBy: props.managedBy,
      assignedToUser: props.assignedToUser,
      assignedToOrganizationalUnit: props.assignedToOrganizationalUnit,
      handoverFromDate: props.handoverFromDate,
      handoverToDate: props.handoverToDate,
      location: props.location,
      description: props.description,
      status: props.status,
      typeRegisterForUse: props.typeRegisterForUse,
      detailInfo: props.detailInfo,
      usageLogs: props.usageLogs,
      readByRoles: props.readByRoles
    })
    setPrevProps(props)
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

  const { id, translate, user, assetsManager, department, role } = props
  const userlist = user.list
  const departmentlist = department.list
  const assetbuilding = assetsManager && assetsManager.buildingAssets
  const assetbuildinglist = assetbuilding && assetbuilding.list

  const {
    avatar,
    code,
    assetName,
    serial,
    assetTypes,
    group,
    purchaseDate,
    warrantyExpirationDate,
    managedBy,
    assignedToUser,
    assignedToOrganizationalUnit,
    location,
    description,
    status,
    typeRegisterForUse,
    detailInfo,
    usageLogs,
    readByRoles
  } = state

  return (
    <div id={id} className='tab-pane active'>
      <div className='box-body'>
        <div className='row' style={{ paddingRight: '0px', paddingLeft: '0px' }}>
          {/* Anh tài sản */}
          <div className='col-md-4 ' style={{ textAlign: 'center', paddingLeft: '0px' }}>
            <div>{avatar && <ApiImage className='attachment-img avarta' id={`avater-imform-${id}`} src={`.${avatar}`} />}</div>
          </div>

          {/* Thông tin cơ bản */}
          <br />
          <div className='col-md-8  ' style={{ paddingRight: '0px', paddingLeft: '0px', minWidth: '350px' }}>
            <div>
              <div className='col-md-6'>
                {/* Mã tài sản */}
                <div className='form-group'>
                  <strong>{translate('asset.general_information.asset_code')}&emsp; </strong>
                  {code}
                </div>

                {/* Tên tài sản */}
                <div className='form-group'>
                  <strong>{translate('asset.general_information.asset_name')}&emsp; </strong>
                  {assetName}
                </div>

                {/* Số serial */}
                <div className='form-group'>
                  <strong>{translate('asset.general_information.serial_number')}&emsp; </strong>
                  {serial}
                </div>

                {/* Nhóm tài sản */}
                <div className='form-group'>
                  <strong>{translate('asset.general_information.asset_group')}&emsp; </strong>
                  {convertGroupAsset(group)}
                </div>

                {/* Loại tài sản */}
                <div className='form-group'>
                  <strong>{translate('asset.general_information.asset_type')}&emsp; </strong>
                  {assetTypes && assetTypes.length
                    ? assetTypes.map((item, index) => {
                        const suffix = index < assetTypes.length - 1 ? ', ' : ''
                        return item.typeName + suffix
                      })
                    : ''}
                </div>

                {/* Ngày nhập */}
                <div className='form-group'>
                  <strong>{translate('asset.general_information.purchase_date')}&emsp; </strong>
                  {formatDate(purchaseDate)}
                </div>

                {/* Ngày bảo hành */}
                <div className='form-group'>
                  <strong>{translate('asset.general_information.warranty_expiration_date')}&emsp; </strong>
                  {formatDate(warrantyExpirationDate)}
                </div>

                {/* Người quản lý */}
                <div className='form-group'>
                  <strong>{translate('asset.general_information.manager')}&emsp; </strong>
                  {managedBy && userlist.length && userlist.filter((item) => item._id === managedBy).pop()
                    ? userlist.filter((item) => item._id === managedBy).pop().name
                    : ''}
                </div>

                {/* Quyền được xem */}
                <div className='form-group'>
                  <strong>{translate('system_admin.system_link.table.roles')}&emsp; </strong>
                  {readByRoles
                    ? readByRoles.map((x, index) =>
                        role.list.length && role.list.filter((item) => item._id === x).pop()
                          ? role.list.filter((item) => item._id === x).pop().name + (index < readByRoles.length - 1 ? ', ' : '')
                          : ''
                      )
                    : ''}
                </div>
              </div>

              <div className='col-md-6'>
                {/* Người sử dụng */}
                <div className='form-group'>
                  <strong>{translate('asset.general_information.user')}&emsp; </strong>
                  {assignedToUser
                    ? userlist.length && userlist.filter((item) => item._id === assignedToUser).pop()
                      ? userlist.filter((item) => item._id === assignedToUser).pop().name
                      : ''
                    : ''}
                </div>

                {/* Đơn vị sử dụng */}
                <div className='form-group'>
                  <strong>{translate('asset.general_information.organization_unit')}&emsp; </strong>
                  {assignedToOrganizationalUnit
                    ? departmentlist.length && departmentlist.filter((item) => item._id === assignedToOrganizationalUnit).pop()
                      ? departmentlist.filter((item) => item._id === assignedToOrganizationalUnit).pop().name
                      : ''
                    : ''}
                </div>
                {/* Thời gian bắt đầu sử dụng */}
                <div className='form-group'>
                  <strong>{translate('asset.general_information.handover_from_date')}&emsp; </strong>
                  {status === 'in_use' && usageLogs
                    ? formatDate(usageLogs[usageLogs.length - 1] && usageLogs[usageLogs.length - 1].startDate)
                    : ''}
                </div>

                {/* Thời gian kết thúc sử dụng */}
                <div className='form-group'>
                  <strong>{translate('asset.general_information.handover_to_date')}&emsp; </strong>
                  {status === 'in_use' && usageLogs
                    ? formatDate(usageLogs[usageLogs.length - 1] && usageLogs[usageLogs.length - 1].endDate)
                    : ''}
                </div>

                {/* Vị trí */}
                <div className='form-group'>
                  <strong>{translate('asset.general_information.asset_location')}&emsp; </strong>
                  {location &&
                  assetbuildinglist &&
                  assetbuildinglist.length &&
                  assetbuildinglist.filter((item) => item._id === location).pop()
                    ? assetbuildinglist.filter((item) => item._id === location).pop().assetName
                    : ''}
                </div>

                {/* Mô tả */}
                <div className='form-group'>
                  <strong>{translate('asset.general_information.description')}&emsp; </strong>
                  {description}
                </div>

                {/* Trạng thái */}
                <div className='form-group'>
                  <strong>{translate('asset.general_information.status')}&emsp; </strong>
                  {formatStatus(status)}
                </div>

                {/* Quyền đăng ký sử dụng */}
                <div className='form-group'>
                  <strong>{translate('asset.general_information.can_register_for_use')}&emsp; </strong>
                  {typeRegisterForUse === 1
                    ? 'Không được đăng ký sử dụng'
                    : typeRegisterForUse === 2
                      ? 'Đăng ký sử dụng theo giờ'
                      : 'Đăng ký sử dụng lâu dài'}
                </div>
              </div>
            </div>

            {/* Thông tin chi tiết */}
            <div className='col-md-12'>
              <label>
                {translate('asset.general_information.asset_properties')}:
                <a style={{ cursor: 'pointer' }} title={translate('asset.general_information.asset_properties')} />
              </label>
              <div className='form-group'>
                <table className='table'>
                  <thead>
                    <tr>
                      <th style={{ paddingLeft: '0px' }}>{translate('asset.asset_info.field_name')}</th>
                      <th style={{ paddingLeft: '0px' }}>{translate('asset.asset_info.value')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!detailInfo || detailInfo.length === 0 ? (
                      <tr>
                        <td colSpan={3}>
                          <center> {translate('table.no_data')}</center>
                        </td>
                      </tr>
                    ) : (
                      detailInfo.map((x, index) => {
                        return (
                          <tr key={index}>
                            <td style={{ paddingLeft: '0px' }}>{x.nameField}</td>
                            <td style={{ paddingLeft: '0px' }}>{x.value}</td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function mapState(state) {
  const { user, assetType, assetsManager, department, role } = state
  return { user, assetType, assetsManager, department, role }
}
const actions = {
  getAssetTypes: AssetTypeActions.getAssetTypes
}
const tabGeneral = connect(mapState, actions)(withTranslate(GeneralTab))
export { tabGeneral as GeneralTab }
