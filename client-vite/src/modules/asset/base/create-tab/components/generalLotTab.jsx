import React, { useState, useEffect } from 'react'
import { connect, useSelector, useDispatch } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DatePicker, ErrorLabel, SelectBox, TreeSelect, ApiImage, SmartTable, PaginateBar } from '../../../../../common-components'
import './addAsset.css'
import { UserActions } from '../../../../super-admin/user/redux/actions'
import { AssetTypeActions } from '../../../admin/asset-type/redux/actions'
import { generateCode } from '../../../../../helpers/generateCode'
import ValidationHelper from '../../../../../helpers/validationHelper'
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration'
import { saveListAssetsAction } from '../../../admin/asset-lot/redux/actions'
import { getPropertyOfValue } from '../../../../../helpers/stringMethod'
import { AssetInCreateForm } from '../../../admin/asset-lot/components/combinedContent'

function GeneralLotTab(props) {
  const dispatch = useDispatch()
  const listAssets = useSelector((state) => state.assetLotManager.listAssetCreates)

  const tableId_constructor = 'table-asset-lot-create'

  const defaultConfig = { limit: 5 }
  const limit_constructor = getTableConfiguration(tableId_constructor, defaultConfig).limit

  const [state, setState] = useState({
    total: 1,
    price: 0,
    disabledGenButton: false,
    startNumber: 0,
    step: 0,
    detailInfo: [],
    isObj: true,
    defaultAvatar: 'image/asset_blank.jpg',
    assetTypes: [],
    managedBy: [],
    readByRoles: [],
    assetName: '',
    supplier: '',
    status: '',
    typeRegisterForUse: '',
    code: '',
    page: 0,
    limit: limit_constructor
  })

  const [prevProps, setPrevProps] = useState({
    id: null,
    assignedToUser: null,
    assignedToOrganizationalUnit: null
  })

  // function gen mã tài sản
  const generateAssetCode = () => {
    const { assetLot } = props
    const { total, step, startNumber } = state
    props.handleGenAssetCode(startNumber, step, listAssets, true)
  }

  const regenerateCode = () => {
    const code = generateCode('VVTM')
    setState((state) => ({
      ...state,
      code
    }))
    validateCode(code)
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

  // Bắt sự kiện chuyển trang
  const setPage = async (pageNumber) => {
    const page = (pageNumber - 1) * state.limit
    await setState({
      ...state,
      page: parseInt(page)
    })
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
      setState({
        ...state,
        errorOnCode: message,
        code: value
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
      setState({
        ...state,
        errorOnAssetName: message,
        assetName: value
      })
      props.handleChange('assetName', value)
    }
    return message === undefined
  }

  /**
   * Bắt sự kiện thay đổi số lượng
   */
  const handleTotalChange = (e) => {
    const { value } = e.target
    validateTotal(value, true)
  }
  const validateTotal = (value, willUpdateState = true) => {
    const { assetLot } = props.assetLot
    const { startNumber, step } = state
    const { message } = ValidationHelper.validateNumberInputMin(props.translate, value, 1)

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnToal: message,
          total: value
        }
      })
      props.handleChange('total', value)
    }
    return message === undefined
  }

  /**
   * Bắt sự kiện thay đổi giá
   */
  const handlePriceChange = (e) => {
    const { value } = e.target
    validatePrice(value, true)
  }

  const validatePrice = (value, willUpdateState = true) => {
    const { assetLot } = props.assetLot
    const { startNumber, step } = state
    const { message } = ValidationHelper.validateNumberInputMin(props.translate, value, 0)

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnPrice: message,
          price: value
        }
      })
      props.handleChange('price', value)
    }
    return message === undefined
  }

  const validateInput = (value) => {
    // console.log("vts validateInput value", value, value.length);
    if (value > 0 && value.length > 0) {
      return true
    }
    return false
  }

  /**
   * Bắt sự kiện thay đổi ký tự bắt đầu
   */
  const handleStarNumber = (e) => {
    const { value } = e.target
    validateStartNumber(value, true)
  }
  const validateStartNumber = (value, willUpdateState = true) => {
    const { message } = ValidationHelper.validateEmpty(props.translate, value)
    const { total, step } = state

    if (willUpdateState) {
      setState({
        ...state,
        errorOnStartNumber: message,
        startNumber: value
        // disabledGenButton: validate
      })
    }
    return message === undefined
  }

  /**
   * Bắt sự kiện thay đổi số tự tăng
   */
  const handleStep = (e) => {
    const { value } = e.target
    validateStep(value, true)
  }
  const validateStep = (value, willUpdateState = true) => {
    const { message } = ValidationHelper.validateEmpty(props.translate, value)
    const { startNumber, total } = state

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnStep: message,
          step: value
        }
      })
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
        group: value[0]
      }
    })
    props.handleChange('group', value[0])
  }

  /**
   * Bắt sự kiện thay đổi nhóm tài sản
   */
  const handleSupplierChange = (value) => {
    setState((state) => {
      return {
        ...state,
        supplier: value
      }
    })
    props.handleChange('supplier', value)
  }

  /**
   * Bắt sự kiện thay đổi loại tài sản
   */

  const handleAssetTypeChange = async (value) => {
    const { translate } = props
    const { message } = ValidationHelper.validateEmpty(translate, value[0])

    setState({
      ...state,
      assetTypes: JSON.stringify(value),
      isObj: false,
      errorOnAssetType: message
    })
    props.handleChange('assetType', value)
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
    // console.log("hang manage",value[0]);
    setState((state) => {
      return {
        ...state,
        managedBy: value[0]
      }
    })
    props.handleManageByChange(value[0])
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
    props.handleStatusChange(value[0])
  }

  const handleRoles = (value) => {
    // console.log("hang role",value);
    setState((state) => {
      return {
        ...state,
        readByRoles: value
      }
    })
    props.handleReadByRolesChange(value)
  }
  /**
   * Bắt sự kiện thay đổi quyền đăng ký sử dụng
   */
  const handleTypeRegisterForUseChange = (value) => {
    setState({
      ...state,
      typeRegisterForUse: value[0]
    })
    // console.log("hang handleTypeRegisterForUseChange", value);
    props.handleTypeRegisterChange(value[0])
  }

  /**
   * Bắt sự kiện xóa thông tin chi tiết
   */
  const delete_function = (index) => {
    listAssets.splice(index, 1)
    dispatch(saveListAssetsAction(listAssets))
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

  const formatDisposalDate = (disposalDate, status) => {
    const { translate } = props
    if (status === 'disposed') {
      if (disposalDate) return formatDate(disposalDate)
      return translate('asset.general_information.not_disposal_date')
    }
    return translate('asset.general_information.not_disposal')
  }

  // Function format ngày hiện tại thành dạnh mm-yyyy
  const formatDate2 = (date) => {
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

  const setLimit = async (number) => {
    await setState({
      ...state,
      limit: parseInt(number)
    })
    // props.getAllAsset({ ...state, limit: parseInt(number) });
  }

  const onSelectedRowsChange = (value) => {
    // setSelectedData(value)
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
        avatar: props.avatar,

        code: props.assetLot.code,
        assetName: props.assetLot.assetName,
        total: props.assetLot.total,
        price: props.assetLot.price,
        assetTypes: props.assetLot.assetType,
        group: props.assetLot.group,
        purchaseDate: props.assetLot.purchaseDate,
        warrantyExpirationDate: props.assetLot.warrantyExpirationDate,
        managedBy: props.assetLot.managedBy,
        status: props.status,
        typeRegisterForUse: props.typeRegisterForUse,
        readByRoles: props.assetLot.readByRoles,

        errorOnCode: undefined,
        errorOnAssetName: undefined,
        errorOnTotal: undefined,
        errorOnPrice: undefined,
        errorOnStep: undefined,
        errorOnStartNumber: undefined,
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

  const { id, translate, user, assetsManager, role, department, assetType } = props
  const {
    img,
    defaultAvatar,
    code,
    assetName,
    supplier,
    total,
    price,
    step,
    startNumber,
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
    disabledGenButton,
    errorOnCode,
    errorOnAssetName,
    errorOnTotal,
    errorOnPrice,
    errorOnStep,
    errorOnStartNumber,
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
    tableId,
    page,
    currentRow,
    currentIndex
  } = state

  const limit = 5
  const pageTotal = listAssets.length % limit === 0 ? parseInt(listAssets.length / limit) : parseInt(listAssets.length / limit + 1)
  const currentPage = parseInt(page / limit + 1)

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

  // Bắt sự kiện click chỉnh sửa thông tin tài sản
  const handleEdit = async (value, index) => {
    await setState({
      ...state,
      currentRow: value,
      currentIndex: index
    })
    console.log('hang modal-edit-asset-in-create-lot')
    window.$('#modal-edit-asset-in-create-lot').modal('show')
  }

  /**
   * Validate disable button
   *
   */
  useEffect(() => {
    if (
      validateInput(total) &&
      startNumber >= 0 &&
      validateInput(step) &&
      state.assetTypes.length > 0 &&
      assetName !== '' &&
      status !== '' &&
      typeRegisterForUse !== ''
    ) {
      setState({ ...state, disabledGenButton: true })
    } else {
      setState({ ...state, disabledGenButton: false })
    }
  }, [total, startNumber, step, state.assetTypes, assetName, status, typeRegisterForUse])

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
            <div id='form-create-asset-lot' className='col-md-6'>
              {/* Mã lô tài sản */}
              <div className={`form-group ${!errorOnCode ? '' : 'has-error'} `}>
                <label htmlFor='code'>
                  {translate('asset.asset_lot.asset_lot_code')}
                  <span className='text-red'>*</span>
                </label>
                <a style={{ cursor: 'pointer' }} title={translate('asset.asset_lot.generate_asset_lot_code')}>
                  <i className='fa fa-plus-square' style={{ color: '#28A745', marginLeft: 5 }} onClick={regenerateCode} />
                  <span onClick={regenerateCode}>{translate('asset.asset_lot.generate_asset_lot_code')}</span>
                </a>
                <input
                  type='text'
                  className='form-control'
                  name='code'
                  value={code}
                  onChange={handleCodeChange}
                  placeholder={translate('asset.asset_lot.asset_lot_code')}
                  autoComplete='off'
                />
                <ErrorLabel content={errorOnCode} />
              </div>

              {/* Tên lô tài sản */}
              <div className={`form-group ${!errorOnAssetName ? '' : 'has-error'} `}>
                <label htmlFor='assetName'>
                  {translate('asset.asset_lot.asset_lot_name')}
                  <span className='text-red'>*</span>
                </label>
                <input
                  type='text'
                  className='form-control'
                  name='assetName'
                  value={assetName}
                  onChange={handleAssetNameChange}
                  placeholder={translate('asset.asset_lot.asset_lot_name')}
                  autoComplete='off'
                />
                <ErrorLabel content={errorOnAssetName} />
              </div>

              {/* Loại tài sản */}
              <div className={`form-group ${!errorOnAssetType ? '' : 'has-error'}`}>
                <label>
                  {translate('asset.general_information.asset_type')}
                  <span className='text-red'>*</span>
                </label>
                <TreeSelect data={typeArr} value={state.assetTypes} handleChange={handleAssetTypeChange} mode='hierarchical' />
                <ErrorLabel content={errorOnAssetType} />
              </div>

              {/* Số lượng tài sản */}
              <div className={`form-group ${!errorOnTotal ? '' : 'has-error'} `}>
                <label htmlFor='total'>
                  {translate('asset.asset_lot.asset_lot_total')} <span className='text-red'>*</span>
                </label>
                <input
                  type='number'
                  className='form-control'
                  name='total'
                  value={total}
                  onChange={handleTotalChange}
                  placeholder={translate('asset.asset_lot.asset_lot_total')}
                  autoComplete='off'
                />
                <ErrorLabel content={errorOnTotal} />
              </div>

              {/* Giá 1 tài sản */}
              <div className={`form-group ${!errorOnPrice ? '' : 'has-error'} `}>
                <label htmlFor='total'>{translate('asset.asset_lot.asset_lot_price')} </label>
                <input
                  type='number'
                  className='form-control'
                  name='price'
                  value={price}
                  onChange={handlePriceChange}
                  placeholder={translate('asset.asset_lot.asset_lot_price')}
                  autoComplete='off'
                />
                <ErrorLabel content={errorOnPrice} />
              </div>

              <label>{translate('asset.asset_lot.rule_generate_code')}:</label>

              {/* Ky tu dau */}
              <div className={`form-group ${!errorOnStartNumber ? '' : 'has-error'} `}>
                <label htmlFor='startNumber'>
                  {translate('asset.asset_lot.start_number')}
                  <span className='text-red'>*</span>
                </label>
                <input
                  type='number'
                  className='form-control'
                  name='startNumber'
                  value={startNumber}
                  onChange={handleStarNumber}
                  placeholder={translate('asset.asset_lot.start_number')}
                  autoComplete='off'
                />
                <ErrorLabel content={errorOnStartNumber} />
              </div>

              {/* so tang */}
              <div className={`form-group ${!errorOnStep ? '' : 'has-error'} `}>
                <label htmlFor='step'>
                  {translate('asset.asset_lot.step_number')}
                  <span className='text-red'>*</span>
                </label>
                <input
                  type='number'
                  className='form-control'
                  name='step'
                  value={step}
                  onChange={handleStep}
                  placeholder={translate('asset.asset_lot.step')}
                  autoComplete='off'
                />
                <ErrorLabel content={errorOnStep} />
              </div>
              {/* button sinh tai san */}
              <button type='button' disabled={!disabledGenButton} className='btn btn-success' onClick={generateAssetCode}>
                {translate('asset.asset_lot.generate_code')}
              </button>
            </div>

            <div className='col-md-6'>
              {/* Nha cung cap */}
              <div className='form-group'>
                <label htmlFor='supplier'>{translate('asset.asset_lot.supplier')}</label>
                <input
                  type='text'
                  className='form-control'
                  name='supplier'
                  value={supplier}
                  onChange={handleSupplierChange}
                  placeholder={translate('asset.asset_lot.supplier')}
                  autoComplete='off'
                />
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
                    { value: '1', text: translate('asset.general_information.not_for_registering') },
                    { value: '2', text: translate('asset.general_information.register_by_hour') },
                    { value: '3', text: translate('asset.general_information.register_for_long_term') }
                  ]}
                  onChange={handleTypeRegisterForUseChange}
                />
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
                    { value: 'vehicle', text: translate('asset.asset_info.vehicle') },
                    { value: 'machine', text: translate('asset.asset_info.machine') },
                    { value: 'other', text: translate('asset.asset_info.other') }
                  ]}
                  onChange={handleGroupChange}
                />
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
              <label />
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
                    id={`select-read-by-roles-${id}`}
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
          </div>
        </div>
      </div>
      <div className='row' style={{ marginTop: '1rem' }}>
        <div className='col-md-12'>
          <label>
            {translate('asset.asset_lot.assets_information')}:
            {/* <a style={{ cursor: "pointer" }} title={translate('asset.general_information.asset_properties')}><i className="fa fa-save" style={{ color: "#28A745", marginLeft: 5 }}
                            onClick={saveListAsset} /><span onClick={saveListAsset}>Lưu các giá trị vừa thay đổi</span></a> */}
          </label>
          {/* Bảng thông tin tài sản */}

          <SmartTable
            tableId={tableId}
            columnData={{
              index: translate('manage_example.index'),
              assetCode: translate('asset.general_information.asset_code'),
              assetName: translate('asset.general_information.asset_name'),
              assetGroup: translate('asset.general_information.asset_group'),
              assetType: translate('asset.general_information.asset_type'),
              assetPurchaseDate: translate('asset.general_information.purchase_date'),
              assetManager: translate('asset.general_information.manager'),
              assetUser: translate('asset.general_information.user'),
              assetOrganizationUnit: translate('asset.general_information.organization_unit'),
              assetStatus: translate('asset.general_information.status'),
              assetDisposalDate: translate('asset.general_information.disposal_date')
            }}
            tableHeaderData={{
              index: <th>{translate('manage_example.index')}</th>,
              assetCode: <th>{translate('asset.general_information.asset_code')}</th>,
              assetName: <th>{translate('asset.general_information.asset_name')}</th>,
              assetGroup: <th>{translate('asset.general_information.asset_group')}</th>,
              assetType: <th>{translate('asset.general_information.asset_type')}</th>,
              assetPurchaseDate: <th>{translate('asset.general_information.purchase_date')}</th>,
              assetManager: <th>{translate('asset.general_information.manager')}</th>,
              assetUser: <th>{translate('asset.general_information.user')}</th>,
              assetOrganizationUnit: <th>{translate('asset.general_information.organization_unit')}</th>,
              assetStatus: <th>{translate('asset.general_information.status')}</th>,
              assetDisposalDate: <th>{translate('asset.general_information.disposal_date')}</th>,
              action: <th style={{ width: '120px', textAlign: 'center' }}>{translate('general.action')}</th>
            }}
            tableBodyData={
              listAssets?.length > 0 &&
              listAssets.map((x, index) => {
                return {
                  id: x?._id,
                  index: <td>{index + 1}</td>,
                  assetCode: <td>{x.code}</td>,
                  assetName: <td>{x.assetName}</td>,
                  assetGroup: <td>{convertGroupAsset(x.group)}</td>,
                  assetType: (
                    <td>
                      {x.assetType &&
                        x.assetType.length !== 0 &&
                        assetTypeName.map((type) => (x.assetType.includes(type._id) ? `${type.typeName} ` : null))}
                    </td>
                  ),
                  assetPurchaseDate: <td>{formatDate(x.purchaseDate)}</td>,
                  assetManager: <td>{getPropertyOfValue(x.managedBy, 'email', false, userlist)}</td>,
                  assetUser: <td>{getPropertyOfValue(x.assignedToUser, 'email', false, userlist)}</td>,
                  assetOrganizationUnit: <td>{getPropertyOfValue(x.assignedToOrganizationalUnit, 'name', false, departmentlist)}</td>,
                  assetStatus: <td>{formatStatus(x.status)}</td>,
                  assetDisposalDate: <td>{formatDisposalDate(x.disposalDate, x.status)}</td>,
                  action: (
                    <td style={{ textAlign: 'center' }}>
                      <a
                        className='edit text-yellow'
                        style={{ width: '5px' }}
                        title={translate('manage_example.edit')}
                        onClick={() => handleEdit(x, index)}
                      >
                        <i className='material-icons'>edit</i>
                      </a>
                      <a className='delete' title='Delete' data-toggle='tooltip' onClick={() => delete_function(index)}>
                        <i className='material-icons'></i>
                      </a>
                    </td>
                  )
                }
              })
            }
            dataDependency={listAssets}
            onSetNumberOfRowsPerpage={setLimit}
            onSelectedRowsChange={onSelectedRowsChange}
          />
          {/* PaginateBar */}
          <PaginateBar
            display={listAssets ? listAssets.length : null}
            total={listAssets.length ? listAssets.length : null}
            pageTotal={pageTotal || 0}
            currentPage={currentPage}
            func={setPage}
          />

          {/* Form chỉnh sửa thông tin tài sản */}
          {currentRow && (
            <AssetInCreateForm
              _id={currentRow.code}
              index={currentIndex}
              employeeId={managedBy}
              avatar={currentRow.avatar}
              code={currentRow.code}
              assetName={currentRow.assetName}
              serial={currentRow.serial}
              assetType={JSON.stringify(currentRow.assetType)}
              group={currentRow.group}
              purchaseDate={currentRow.purchaseDate}
              warrantyExpirationDate={currentRow.warrantyExpirationDate}
              managedBy={getPropertyOfValue(currentRow.managedBy, '_id', true, userlist)}
              assignedToUser={getPropertyOfValue(currentRow.assignedToUser, '_id', true, userlist)}
              assignedToOrganizationalUnit={getPropertyOfValue(currentRow.assignedToOrganizationalUnit, '_id', true, departmentlist)}
              handoverFromDate={currentRow.handoverFromDate}
              handoverToDate={currentRow.handoverToDate}
              location={currentRow.location}
              description={currentRow.description}
              status={currentRow.status}
              typeRegisterForUse={currentRow.typeRegisterForUse}
              detailInfo={currentRow.detailInfo}
              readByRoles={getPropertyOfValue(currentRow.readByRoles, '_id', true, role.list)}
              cost={currentRow.cost}
              residualValue={currentRow.residualValue}
              startDepreciation={currentRow.startDepreciation}
              usefulLife={currentRow.usefulLife}
              depreciationType={currentRow.depreciationType}
              estimatedTotalProduction={currentRow.estimatedTotalProduction}
              unitsProducedDuringTheYears={
                currentRow.unitsProducedDuringTheYears &&
                currentRow.unitsProducedDuringTheYears.map((x) => ({
                  month: formatDate2(x.month),
                  unitsProducedDuringTheYear: x.unitsProducedDuringTheYear
                }))
              }
              disposalDate={currentRow.disposalDate}
              disposalType={currentRow.disposalType}
              disposalCost={currentRow.disposalCost}
              disposalDesc={currentRow.disposalDesc}
              maintainanceLogs={currentRow.maintainanceLogs}
              usageLogs={currentRow.usageLogs}
              incidentLogs={currentRow.incidentLogs}
              archivedRecordNumber={currentRow.archivedRecordNumber}
              files={currentRow.documents}
              linkPage='management'
              page={page}
              listAssets={listAssets}
              edit={false}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function mapState(state) {
  const { assetType, user, assetLotManager, role, department, assetsManager } = state
  return { assetType, user, assetLotManager, role, department, assetsManager }
}

const actionCreators = {
  getUser: UserActions.get,
  getAssetType: AssetTypeActions.getAssetTypes
}
const generalLotTab = connect(mapState, actionCreators)(withTranslate(GeneralLotTab))
export { generalLotTab as GeneralLotTab }
