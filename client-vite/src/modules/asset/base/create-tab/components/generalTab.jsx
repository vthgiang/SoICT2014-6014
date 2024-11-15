import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DatePicker, ErrorLabel, SelectBox, TreeSelect, ApiImage } from '../../../../../common-components'
import './addAsset.css'
import { UserActions } from '../../../../super-admin/user/redux/actions'
import { AssetTypeActions } from '../../../admin/asset-type/redux/actions'
import { CategoryActions } from '../../../../production/common-production/category-management/redux/actions'
import { string2literal } from '../../../../../helpers/handleResponse'
import { generateCode } from '../../../../../helpers/generateCode'
import ValidationHelper from '../../../../../helpers/validationHelper'

function GeneralTab(props) {
  const [state, setState] = useState({
    detailInfo: [],
    isObj: true,
    defaultAvatar: 'image/asset_blank.jpg',
    assetType: [],
    isVehicle: false,
    excludingProduct: []
  })

  const [prevProps, setPrevProps] = useState({
    id: null,
    assignedToUser: null,
    assignedToOrganizationalUnit: null
  })

  const regenerateCode = () => {
    const code = generateCode('VVTM')
    setState((state) => ({
      ...state,
      code
    }))
    validateCode(code)
  }

  useEffect(() => {
    props.getCategories()
    window.$('#modal-add-asset').on('shown.bs.modal', regenerateCode)
    return () => {
      window.$('#modal-add-asset').unbind('shown.bs.modal', regenerateCode)
    }
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

  // Function upload avatar
  const handleUpload = (e) => {
    const file = e.target.files[0]

    if (file) {
      const fileLoad = new FileReader()
      fileLoad.readAsDataURL(file)
      fileLoad.onload = () => {
        setState((state) => {
          return {
            ...state,
            img: fileLoad.result
          }
        })
        props.handleUpload(fileLoad.result, file)
      }
    }
  }

  // Function lưu các trường thông tin vào state
  const handleChange = (e) => {
    const { name, value } = e.target
    setState((state) => {
      return {
        ...state,
        [name]: value
      }
    })
    props.handleChange(name, value)
  }

  /**
   * Bắt sự kiện thay đổi mã tài sản
   */
  const handleCodeChange = (e) => {
    const { value } = e.target
    validateCode(value, true)
  }
  const validateCode = (value, willUpdateState = true) => {
    const { message } = ValidationHelper.validateCode(props.translate, value)

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnCode: message,
          code: value
        }
      })
      props.handleChange('code', value)
    }
    return message === undefined
  }

  /**
   * Bắt sự kiện thay đổi tên tài sản
   */
  const handleAssetNameChange = (e) => {
    const { value } = e.target
    validateAssetName(value, true)
  }
  const validateAssetName = (value, willUpdateState = true) => {
    const { message } = ValidationHelper.validateEmpty(props.translate, value)

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnAssetName: message,
          assetName: value
        }
      })
      props.handleChange('assetName', value)
    }
    return message === undefined
  }

  /**
   * Bắt sự kiện thay đổi số serial
   */
  const handleSerialChange = (e) => {
    const { value } = e.target
    validateSerial(value, true)
  }
  const validateSerial = (value, willUpdateState = true) => {
    const { message } = ValidationHelper.validateEmpty(props.translate, value)

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnSerial: message,
          serial: value
        }
      })
      props.handleChange('serial', value)
    }
    return message === undefined
  }

  /**
   * Bắt sự kiện thay đổi nhóm tài sản
   */
  const handleGroupChange = (value) => {
    setState((state) => {
      return {
        ...state,
        isVehicle: value[0] == 'vehicle' ? true : false,
        group: value[0]
      }
    })
    props.handleChange('group', value[0])
  }

  /**
   * Bắt sự kiện thay đổi loại tài sản
   */

  const handleAssetTypeChange = async (value) => {
    const { translate } = props
    const { message } = ValidationHelper.validateEmpty(translate, value[0])

    await setState((state) => {
      return {
        ...state,
        assetType: JSON.stringify(value),
        isObj: false,
        errorOnAssetType: message
      }
    })
    props.handleChange('assetType', value)
  }

  const handleAddDefaultInfo = () => {
    const { assetType } = state
    let listAssetTypes = []
    if (assetType) {
      listAssetTypes = props.assetType.listAssetTypes.filter((type) => {
        return assetType.indexOf(type.id) > -1
      })
    }
    const defaultInfo = []
    const nameFieldList = []

    for (let i = 0; i < listAssetTypes.length; i++) {
      for (let j = 0; j < listAssetTypes[i].defaultInformation.length; j++)
        if (nameFieldList.indexOf(listAssetTypes[i].defaultInformation[j].nameField) === -1) {
          defaultInfo.push({
            nameField: listAssetTypes[i].defaultInformation[j].nameField,
            value: listAssetTypes[i].defaultInformation[j].value
          })
          nameFieldList.push(listAssetTypes[i].defaultInformation[j].nameField)
        }
    }

    setState((state) => {
      return {
        ...state,
        detailInfo: defaultInfo
      }
    })
  }

  /**
   * Bắt sự kiện thay đổi ngày nhập
   */
  const handlePurchaseDateChange = (value) => {
    validatePurchaseDate(value, true)
  }
  const validatePurchaseDate = (value, willUpdateState = true) => {
    const { message } = ValidationHelper.validateEmpty(props.translate, value)

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnPurchaseDate: message,
          purchaseDate: value
        }
      })
      props.handleChange('purchaseDate', value)
    }
    return message === undefined
  }

  /**
   * Bắt sự kiện thay đổi ngày bảo hành
   */
  const handleWarrantyExpirationDateChange = (value) => {
    validateWarrantyExpirationDate(value, true)
  }
  const validateWarrantyExpirationDate = (value, willUpdateState = true) => {
    const { message } = ValidationHelper.validateEmpty(props.translate, value)

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnWarrantyExpirationDate: message,
          warrantyExpirationDate: value
        }
      })
      props.handleChange('warrantyExpirationDate', value)
    }
    return message === undefined
  }

  /**
   * Bắt sự kiện thay đổi người quản lý
   */
  const handleManagedByChange = (value) => {
    setState((state) => {
      return {
        ...state,
        managedBy: value[0]
      }
    })
    props.handleChange('managedBy', value[0])
  }

  /**
   * Bắt sự kiện thay đổi người sử dụng
   */
  const handleAssignedToUserChange = (value) => {
    setState((state) => {
      return {
        ...state,
        assignedToUser: string2literal(value[0])
      }
    })
    props.handleChange('assignedToUser', string2literal(value[0]))
  }

  const handleAssignedToOrganizationalUnitChange = (value) => {
    setState((state) => {
      return {
        ...state,
        assignedToOrganizationalUnit: string2literal(value[0])
      }
    })
    props.handleChange('assignedToOrganizationalUnit', string2literal(value[0]))
  }

  /**
   * Bắt sự kiện thay đổi ngày bắt đầu sử dụng
   */
  const handleHandoverFromDateChange = (value) => {
    validateHandoverFromDate(value, true)
  }
  const validateHandoverFromDate = (value, willUpdateState = true) => {
    const { message } = ValidationHelper.validateEmpty(props.translate, value)

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnHandoverFromDate: message,
          handoverFromDate: value
        }
      })
      props.handleChange('handoverFromDate', value)
    }
    return message === undefined
  }

  /**
   * Function bắt sự kiện thay đổi ngày kết thúc sử dụng
   */
  const handleHandoverToDateChange = (value) => {
    validateHandoverToDate(value, true)
  }
  const validateHandoverToDate = (value, willUpdateState = true) => {
    const { message } = ValidationHelper.validateEmpty(props.translate, value)

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnHandoverToDate: message,
          handoverToDate: value
        }
      })
      props.handleChange('handoverToDate', value)
    }
    return message === undefined
  }

  /**
   * Bắt sự kiện thay đổi vị trí tài sản
   */
  const handleLocationChange = async (value) => {
    await setState((state) => {
      return {
        ...state,
        location: value[0]
      }
    })

    props.handleChange('location', value[0])
  }

  /**
   * Bắt sự kiện thay đổi mô tả
   */
  const handleDescriptionChange = (e) => {
    const { value } = e.target
    setState((state) => {
      return {
        ...state,
        description: value
      }
    })
    props.handleChange('description', value)
  }

  /**
   * Bắt sự kiện thay đổi trạng thái tài sản
   */
  const handleStatusChange = (value) => {
    setState((state) => {
      return {
        ...state,
        status: value[0]
      }
    })
    props.handleChange('status', value[0])
  }

  const handleRoles = (value) => {
    setState((state) => {
      return {
        ...state,
        readByRoles: value
      }
    })
    props.handleChange('readByRoles', value)
  }
  /**
   * Bắt sự kiện thay đổi quyền đăng ký sử dụng
   */
  const handleTypeRegisterForUseChange = (value) => {
    setState((state) => {
      return {
        ...state,
        typeRegisterForUse: value[0]
      }
    })
    props.handleChange('typeRegisterForUse', value[0])
  }

  /**
   * Bắt sự kiện click thêm Thông tin chi tiết
   */
  const handleAddDetailInfo = () => {
    const { detailInfo } = state

    if (detailInfo.length !== 0) {
      let result

      for (const n in detailInfo) {
        result = validateNameField(detailInfo[n].nameField, n) && validateValue(detailInfo[n].value, n)
        if (!result) {
          validateNameField(detailInfo[n].nameField, n)
          validateValue(detailInfo[n].value, n)
          break
        }
      }

      if (result) {
        setState((state) => {
          return {
            ...state,
            detailInfo: [...detailInfo, { nameField: '', value: '' }]
          }
        })
      }
    } else {
      setState((state) => {
        return {
          ...state,
          detailInfo: [...detailInfo, { nameField: '', value: '' }]
        }
      })
    }
  }

  /**
   * Bắt sự kiện chỉnh sửa tên trường dữ liệu thông tin chi tiết
   */
  const handleChangeNameField = (e, index) => {
    const { value } = e.target
    validateNameField(value, index)
  }
  const validateNameField = (value, className, willUpdateState = true) => {
    const { message } = ValidationHelper.validateEmpty(props.translate, value)

    if (willUpdateState) {
      const { detailInfo } = state
      detailInfo[className] = { ...detailInfo[className], nameField: value }
      setState((state) => {
        return {
          ...state,
          errorOnNameField: message,
          errorOnNameFieldPosition: message ? className : null,
          detailInfo
        }
      })
      props.handleChange('detailInfo', detailInfo)
    }
    return message === undefined
  }

  /**
   * Bắt sự kiện chỉnh sửa giá trị trường dữ liệu thông tin chi tiết
   */
  const handleChangeValue = (e, index) => {
    const { value } = e.target
    validateValue(value, index)
  }
  const validateValue = (value, className, willUpdateState = true) => {
    const { message } = ValidationHelper.validateEmpty(props.translate, value)

    if (willUpdateState) {
      const { detailInfo } = state
      detailInfo[className] = { ...detailInfo[className], value }
      setState((state) => {
        return {
          ...state,
          errorOnValue: message,
          errorOnValuePosition: message ? className : null,
          detailInfo
        }
      })
      props.handleChange('detailInfo', detailInfo)
    }
    return message === undefined
  }

  /**
   * Bắt sự kiện xóa thông tin chi tiết
   */
  const delete_function = (index) => {
    const { detailInfo } = state
    detailInfo.splice(index, 1)
    if (detailInfo.length !== 0) {
      for (const n in detailInfo) {
        validateNameField(detailInfo[n].nameField, n)
        validateValue(detailInfo[n].value, n)
      }
    } else {
      setState((state) => {
        return {
          ...state,
          detailInfo,
          errorOnValue: undefined,
          errorOnNameField: undefined
        }
      })
    }
  }

  const handleVehicleKindChange = (value) => {
    let { detailInfo } = state
    if (value) {
      if (detailInfo.length > 0) {
        detailInfo = detailInfo.filter((detailItem) => {
          return detailItem.nameField != 'vehicleKind'
        })
      }
      detailInfo = [...detailInfo, { nameField: 'vehicleKind', value: value[0] }]
    } else if (detailInfo.length > 0) {
      detailInfo = detailInfo.filter((detailItem) => {
        return detailItem.nameField != 'vehicleKind'
      })
    }
    setState((state) => {
      return {
        ...state,
        vehicle: value[0],
        detailInfo
      }
    })
    props.handleChange('detailInfo', detailInfo)
  }

  const handleExcludingProductChange = (value) => {
    console.log('tao day:::', value)
  }

  if (
    prevProps.id !== props.id ||
    prevProps.assignedToUser !== props.assignedToUser ||
    prevProps.assignedToOrganizationalUnit !== props.assignedToOrganizationalUnit
  ) {
    setState((state) => {
      return {
        ...state,
        id: props.id,
        img: props.img,
        avatar: props.avatar,

        code: props.code,
        assetName: props.assetName,
        serial: props.serial,
        assetType: props.assetTypeEdit,
        group: props.group,
        location: props.location,
        purchaseDate: props.purchaseDate,
        warrantyExpirationDate: props.warrantyExpirationDate,
        managedBy: props.managedBy,
        assignedToUser: props.assignedToUser,
        assignedToOrganizationalUnit: props.assignedToOrganizationalUnit,
        handoverFromDate: props.handoverFromDate,
        handoverToDate: props.handoverToDate,
        description: props.description,
        status: props.status,
        typeRegisterForUse: props.typeRegisterForUse,
        detailInfo: props.detailInfo,
        usageLogs: props.usageLogs,
        readByRoles: props.readByRoles,

        errorOnCode: undefined,
        errorOnAssetName: undefined,
        errorOnSerial: undefined,
        errorOnAssetType: undefined,
        errorOnLocation: undefined,
        errorOnPurchaseDate: undefined,
        errorOnWarrantyExpirationDate: undefined,
        errorOnManagedBy: undefined,
        errorOnNameField: undefined,
        errorOnValue: undefined
      }
    })
    setPrevProps(props)
  }

  const { id, translate, user, assetsManager, role, department, categories, assetType } = props
  const {
    img,
    defaultAvatar,
    code,
    assetName,
    assetTypes,
    group,
    serial,
    purchaseDate,
    warrantyExpirationDate,
    managedBy,
    isObj,
    assignedToUser,
    assignedToOrganizationalUnit,
    location,
    description,
    status,
    typeRegisterForUse,
    detailInfo,
    errorOnCode,
    errorOnAssetName,
    errorOnSerial,
    errorOnAssetType,
    errorOnLocation,
    errorOnPurchaseDate,
    errorOnWarrantyExpirationDate,
    errorOnManagedBy,
    errorOnNameField,
    errorOnValue,
    usageLogs,
    readByRoles,
    errorOnNameFieldPosition,
    errorOnValuePosition,
    vehicle,
    isVehicle,
    excludingProduct
  } = state

  const userlist = user.list
  const departmentlist = department.list
  const startDate = status == 'in_use' && usageLogs && usageLogs.length ? formatDate(usageLogs[usageLogs.length - 1].startDate) : ''
  const endDate = status == 'in_use' && usageLogs && usageLogs.length ? formatDate(usageLogs[usageLogs.length - 1].endDate) : ''

  const assetbuilding = assetsManager && assetsManager.buildingAssets
  const assetbuildinglist = assetbuilding && assetbuilding.list
  const buildingList =
    assetbuildinglist &&
    assetbuildinglist.map((node) => {
      return {
        ...node,
        id: node._id,
        name: node.assetName,
        parent: node.location
      }
    })
  const assetTypeName = assetType && assetType.listAssetTypes
  const typeArr =
    assetTypeName &&
    assetTypeName.map((item) => {
      return {
        _id: item._id,
        name: item.typeName,
        parent: item.parent ? item.parent._id : null
      }
    })
  const listCategory = categories && categories.listPaginate
  const categoryArr =
    listCategory &&
    listCategory.map((item) => {
      return {
        _id: item._id,
        name: item.name
      }
    })
  return (
    <div id={id} className='tab-pane active'>
      <div className='row'>
        {/* Ảnh tài sản */}
        <div className='col-md-4' style={{ textAlign: 'center', paddingLeft: '0px' }}>
          <div>
            {img ? (
              <ApiImage className='attachment-img avarta' id={`avatar-imform-${id}`} src={img} />
            ) : (
              <img className='customer-avatar' src={defaultAvatar} style={{ height: '100%', width: '100%' }} />
            )}
          </div>
          <div className='upload btn btn-default '>
            {translate('manage_asset.upload')}
            <input className='upload' type='file' name='file' onChange={handleUpload} />
          </div>
        </div>

        <br />
        {/* Thông tin cơ bản */}
        <div className='col-md-8' style={{ paddingLeft: '0px' }}>
          <div>
            <div id='form-create-asset-type' className='col-md-6'>
              {/* Mã tài sản */}
              <div className={`form-group ${!errorOnCode ? '' : 'has-error'} `}>
                <label htmlFor='code'>
                  {translate('asset.general_information.asset_code')}
                  <span className='text-red'>*</span>
                </label>
                <input
                  type='text'
                  className='form-control'
                  name='code'
                  value={code || ''}
                  onChange={handleCodeChange}
                  placeholder={translate('asset.general_information.asset_code')}
                  autoComplete='off'
                />
                <ErrorLabel content={errorOnCode} />
              </div>

              {/* Tên tài sản */}
              <div className={`form-group ${!errorOnAssetName ? '' : 'has-error'} `}>
                <label htmlFor='assetName'>
                  {translate('asset.general_information.asset_name')}
                  <span className='text-red'>*</span>
                </label>
                <input
                  type='text'
                  className='form-control'
                  name='assetName'
                  value={assetName || ''}
                  onChange={handleAssetNameChange}
                  placeholder={translate('asset.general_information.asset_name')}
                  autoComplete='off'
                />
                <ErrorLabel content={errorOnAssetName} />
              </div>

              {/* Số serial */}
              <div className={`form-group ${!errorOnSerial ? '' : 'has-error'} `}>
                <label htmlFor='serial'>{translate('asset.general_information.serial_number')}</label>
                <input
                  type='text'
                  className='form-control'
                  name='serial'
                  value={serial || ''}
                  onChange={handleSerialChange}
                  placeholder={translate('asset.general_information.serial_number')}
                  autoComplete='off'
                />
                <ErrorLabel content={errorOnSerial} />
              </div>

              {/* Nhóm tài sản */}
              <div className='form-group'>
                <label>{translate('asset.general_information.asset_group')}</label>
                <SelectBox
                  id={`group${id}`}
                  className='form-control select2'
                  style={{ width: '100%' }}
                  value={group}
                  items={[
                    { value: '', text: `---${translate('asset.asset_info.select_group')}---` },
                    { value: 'building', text: translate('asset.asset_info.building') },
                    { value: 'vehicle', text: translate('asset.asset_info.vehicle') },
                    { value: 'machine', text: translate('asset.asset_info.machine') },
                    { value: 'other', text: translate('asset.asset_info.other') }
                  ]}
                  onChange={handleGroupChange}
                />
              </div>

              {isVehicle && (
                <>
                  <div className='row'>
                    <div className='col-md-9 offset-md-3'>
                      <div className='form-group'>
                        <label>
                          {translate('asset.asset_info.vehicle_kind')}
                          <span className='text-red'>*</span>
                        </label>
                        <SelectBox
                          id={`vehicle${id}`}
                          className='form-control select2'
                          style={{ width: '100%' }}
                          value={vehicle}
                          items={[
                            { value: '', text: `---${translate('asset.asset_info.select_vehicle_kind')}---` },
                            { value: 'bike', text: translate('asset.asset_info.bike') },
                            { value: 'truck', text: translate('asset.asset_info.truck') }
                          ]}
                          onChange={handleVehicleKindChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-md-9 offset-md-3'>
                      <div className='form-group'>
                        <label>{translate('asset.asset_info.excluded_good_category')}</label>
                        <TreeSelect
                          data={categoryArr}
                          value={excludingProduct}
                          handleChange={handleExcludingProductChange}
                          mode='hierarchical'
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Loại tài sản */}
              <div className={`form-group ${!errorOnAssetType ? '' : 'has-error'}`}>
                <label>
                  {translate('asset.general_information.asset_type')}
                  <span className='text-red'>*</span>
                </label>
                <TreeSelect data={typeArr} value={state.assetType} handleChange={handleAssetTypeChange} mode='hierarchical' />
                <ErrorLabel content={errorOnAssetType} />
              </div>

              {/* Ngày nhập */}
              <div className={`form-group ${!errorOnPurchaseDate ? '' : 'has-error'}`}>
                <label htmlFor='purchaseDate'>{translate('asset.general_information.purchase_date')}</label>
                <DatePicker
                  id={`purchaseDate${id}`}
                  value={purchaseDate ? formatDate(purchaseDate) : ''}
                  onChange={handlePurchaseDateChange}
                />
                <ErrorLabel content={errorOnPurchaseDate} />
              </div>

              {/* Ngày bảo hành */}
              <div className={`form-group ${!errorOnWarrantyExpirationDate ? '' : 'has-error'}`}>
                <label htmlFor='warrantyExpirationDate'>{translate('asset.general_information.warranty_expiration_date')}</label>
                <DatePicker
                  id={`warrantyExpirationDate${id}`}
                  value={warrantyExpirationDate ? formatDate(warrantyExpirationDate) : ''}
                  onChange={handleWarrantyExpirationDateChange}
                />
                <ErrorLabel content={errorOnPurchaseDate} />
              </div>

              {/* Người quản lý */}
              <div className={`form-group${!errorOnManagedBy ? '' : 'has-error'}`}>
                <label>{translate('asset.general_information.manager')}</label>
                <div id='managedByBox'>
                  <SelectBox
                    id={`managedBy${id}`}
                    className='form-control select2'
                    style={{ width: '100%' }}
                    items={userlist.map((x) => {
                      return { value: x.id, text: `${x.name} - ${x.email}` }
                    })}
                    onChange={handleManagedByChange}
                    value={managedBy}
                    options={{ placeholder: '' }}
                    multiple={false}
                  />
                </div>
                <ErrorLabel content={errorOnManagedBy} />
              </div>
              {/* Quyền xem tài sản theo role */}
              <div className='form-group'>
                <label>{translate('system_admin.system_link.table.roles')}</label>
                <div>
                  <SelectBox
                    id={`select-link-default-roles-${id}`}
                    className='form-control select2'
                    style={{ width: '100%' }}
                    items={role.list.map((role) => {
                      return { value: role ? role._id : null, text: role ? role.name : '' }
                    })}
                    value={readByRoles}
                    onChange={handleRoles}
                    multiple
                  />
                </div>
              </div>
            </div>

            <div className='col-md-6'>
              {/* Vị trí tài sản */}
              <div className={`form-group ${!errorOnLocation ? '' : 'has-error'}`}>
                <label htmlFor='location'>{translate('asset.general_information.asset_location')}</label>
                <TreeSelect data={buildingList} value={[location]} handleChange={handleLocationChange} mode='radioSelect' />
                <ErrorLabel content={errorOnLocation} />
              </div>

              {/* Trạng thái */}
              <div className='form-group'>
                <label>
                  {translate('asset.general_information.status')}
                  <span className='text-red'>*</span>
                </label>
                <SelectBox
                  id={`status${id}`}
                  className='form-control select2'
                  style={{ width: '100%' }}
                  value={status}
                  items={[
                    { value: '', text: '---Chọn trạng thái---' },
                    { value: 'ready_to_use', text: translate('asset.general_information.ready_use') },
                    { value: 'in_use', text: translate('asset.general_information.using') },
                    { value: 'broken', text: translate('asset.general_information.damaged') },
                    { value: 'lost', text: translate('asset.general_information.lost') },
                    { value: 'disposed', text: translate('asset.general_information.disposal') }
                  ]}
                  onChange={handleStatusChange}
                />
              </div>

              {/* Quyền đăng ký sử dụng */}
              <div className='form-group'>
                <label>
                  {translate('asset.general_information.can_register_for_use')}
                  <span className='text-red'>*</span>
                </label>
                <SelectBox
                  id={`typeRegisterForUse${id}`}
                  className='form-control select2'
                  style={{ width: '100%' }}
                  value={typeRegisterForUse}
                  items={[
                    { value: '', text: translate('asset.general_information.select_role_to_use') },
                    { value: 1, text: translate('asset.general_information.not_for_registering') },
                    { value: 2, text: translate('asset.general_information.register_by_hour') },
                    { value: 3, text: translate('asset.general_information.register_for_long_term') }
                  ]}
                  onChange={handleTypeRegisterForUseChange}
                />
              </div>

              {/* Người sử dụng */}
              <div className='form-group'>
                <label>{translate('asset.general_information.user')}</label>
                <SelectBox
                  id={`assignedToUserBox${id}`}
                  className='form-control select2'
                  style={{ width: '100%' }}
                  value={assignedToUser ?? -1}
                  items={[
                    { value: -1, text: 'Chưa có người được giao sử dụng' },
                    ...userlist.map((x) => {
                      return { value: x.id, text: `${x.name} - ${x.email}` }
                    })
                  ]}
                  disabled
                />
              </div>

              {/* Đơn vị sử dụng */}
              <div className='form-group'>
                <label>{translate('asset.general_information.organization_unit')}</label>
                <div id='assignedToOrganizationalUnitBox'>
                  <SelectBox
                    id={`assignedToOrganizationalUnitBox${assignedToOrganizationalUnit}`}
                    className='form-control select2'
                    style={{ width: '100%' }}
                    items={[
                      { value: -1, text: 'Chưa có đơn vị được giao sử dụng' },
                      ...departmentlist.map((x) => {
                        return { value: x._id, text: x.name }
                      })
                    ]}
                    value={assignedToOrganizationalUnit ?? -1}
                    multiple={false}
                    disabled
                  />
                </div>
              </div>

              {/* Thời gian bắt đầu sử dụng */}
              <div className='form-group'>
                <label>{translate('asset.general_information.handover_from_date')}</label>
                <DatePicker id={`start-date-${id}`} value={startDate} disabled />
              </div>

              {/* Thời gian kết thúc sử dụng */}
              <div className='form-group'>
                <label>{translate('asset.general_information.handover_to_date')}</label>
                <DatePicker id={`end-date-${id}`} value={endDate} disabled />
              </div>

              {/* Mô tả */}
              <div className='form-group'>
                <label htmlFor='description'>{translate('asset.general_information.description')}</label>
                <textarea
                  className='form-control'
                  rows='3'
                  name='description'
                  value={description}
                  onChange={handleDescriptionChange}
                  placeholder='Enter ...'
                  autoComplete='off'
                />
              </div>
            </div>
          </div>

          {/* Thông tin chi tiết */}
          <div className='col-md-12'>
            <label>
              {translate('asset.general_information.asset_properties')}:
              <a style={{ cursor: 'pointer' }} title={translate('asset.general_information.asset_properties')}>
                <i className='fa fa-plus-square' style={{ color: '#28A745', marginLeft: 5 }} onClick={handleAddDetailInfo} />
                <span onClick={handleAddDetailInfo}>Thêm thuộc tính tài sản</span>
              </a>
              <a style={{ cursor: 'pointer' }} title={translate('asset.general_information.asset_default_properties')}>
                <i className='fa fa-plus-square' style={{ color: 'red', marginLeft: 20 }} onClick={handleAddDefaultInfo} />
                <span onClick={handleAddDefaultInfo}>Thêm thuộc tính mặc định của tài sản</span>
              </a>
            </label>

            {/* Bảng thông tin chi tiết */}
            <table className='table'>
              <thead>
                <tr>
                  <th style={{ paddingLeft: '0px' }}>{translate('asset.asset_info.field_name')}</th>
                  <th style={{ paddingLeft: '0px' }}>{translate('asset.asset_info.value')}</th>
                  <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}</th>
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
                        <td style={{ paddingLeft: '0px' }}>
                          <div
                            className={`form-group ${parseInt(errorOnNameFieldPosition) === index && errorOnNameField ? 'has-error' : ''}`}
                          >
                            <input
                              className='form-control'
                              type='text'
                              value={x.nameField}
                              name='nameField'
                              style={{ width: '100%' }}
                              onChange={(e) => handleChangeNameField(e, index)}
                            />
                            {parseInt(errorOnNameFieldPosition) === index && errorOnNameField && <ErrorLabel content={errorOnNameField} />}
                          </div>
                        </td>

                        <td style={{ paddingLeft: '0px' }}>
                          <div className={`form-group ${parseInt(errorOnValuePosition) === index && errorOnValue ? 'has-error' : ''}`}>
                            <input
                              className='form-control'
                              type='text'
                              value={x.value}
                              name='value'
                              style={{ width: '100%' }}
                              onChange={(e) => handleChangeValue(e, index)}
                            />
                            {parseInt(errorOnValuePosition) === index && errorOnValue && <ErrorLabel content={errorOnValue} />}
                          </div>
                        </td>

                        <td style={{ textAlign: 'center' }}>
                          <a className='delete' title='Delete' data-toggle='tooltip' onClick={() => delete_function(index)}>
                            <i className='material-icons'></i>
                          </a>
                        </td>
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
  )
}

function mapState(state) {
  const { assetType, user, assetsManager, role, department, categories } = state
  return { assetType, user, assetsManager, role, department, categories }
}

const actionCreators = {
  getUser: UserActions.get,
  getAssetType: AssetTypeActions.getAssetTypes,
  getCategories: CategoryActions.getCategories
}
const generalTab = connect(mapState, actionCreators)(withTranslate(GeneralTab))
export { generalTab as GeneralTab }
