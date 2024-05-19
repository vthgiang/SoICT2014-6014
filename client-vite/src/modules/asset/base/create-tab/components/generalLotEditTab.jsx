import React, { useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { ErrorLabel, SelectBox, TreeSelect, ApiImage, SmartTable } from '../../../../../common-components'
import './addAsset.css'
import { UserActions } from '../../../../super-admin/user/redux/actions'
import { AssetTypeActions } from '../../../admin/asset-type/redux/actions'
import ValidationHelper from '../../../../../helpers/validationHelper'
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration'
import { getPropertyOfValue } from '../../../../../helpers/stringMethod'
import { saveListAssetsAction } from '../../../admin/asset-lot/redux/actions'
import { AssetEditForm } from '../../../admin/asset-lot/components/combinedContent'

function GeneralLotEditTab(props) {
  const dispatch = useDispatch()
  const listAssets = useSelector((state) => state.assetLotManager.listAssets)
  const assetLot = useSelector((state) => state.assetLotManager.assetLot)

  const tableId_constructor = 'table-asset-lot-edit'
  const defaultConfig = { limit: 5 }
  const limit_constructor = getTableConfiguration(tableId_constructor, defaultConfig).limit

  const [state, setState] = useState({
    detailInfo: [],
    isObj: true,
    defaultAvatar: 'image/asset_blank.jpg',
    assetType: [],
    managedBy: [],
    deleteAssetIds: [],

    limit: limit_constructor,
    page: 0
  })

  const [prevProps, setPrevProps] = useState({
    id: null,
    assignedToUser: null,
    assignedToOrganizationalUnit: null
  })

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
  const handleAssetLotNameChange = (e) => {
    const { value } = e.target
    validateAssetLotName(value, true)
  }
  const validateAssetLotName = (value, willUpdateState = true) => {
    const { message } = ValidationHelper.validateEmpty(props.translate, value)

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnAssetLotName: message,
          assetLotName: value
        }
      })
      props.handleChange('assetLotName', value)
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
   * Bắt sự kiện thay đổi loại tài sản
   */

  const handleAssetTypeChange = async (value) => {
    const { translate } = props
    const { message } = ValidationHelper.validateEmpty(translate, value[0])

    await setState((state) => {
      return {
        ...state,
        assetTypeEdit: JSON.stringify(value),
        isObj: false,
        errorOnAssetType: message
      }
    })
    props.handleChange('assetType', value)
  }

  /**
   * Bắt sự kiện thay đổi số lượng
   */
  const handleTotalChange = (e) => {
    const { value } = e.target
    validateTotal(value, true)
  }
  const validateTotal = (value, willUpdateState = true) => {
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

  if (prevProps.id !== props.id) {
    setState((state) => {
      return {
        ...state,
        id: props.id,
        img: props.img,
        avatar: props.avatar,
        total: props.total,
        price: props.price,
        supplier: props.supplier,
        code: props.code,
        assetLotName: props.assetLotName,
        assetTypeEdit: props.assetTypeEdit,
        group: props.group,

        errorOnCode: undefined,
        errorOnAssetLotName: undefined,
        errorOnAssetType: undefined
      }
    })
    setPrevProps(props)
  }

  const { id, translate, user, assetsManager, assetLotManager, role, assetType, department } = props
  const {
    img,
    defaultAvatar,
    code,
    assetLotName,
    assetTypeEdit,
    group,
    status,
    total,
    price,
    supplier,
    errorOnCode,
    errorOnAssetLotName,
    errorOnAssetType,
    errorOnTotal,
    errorOnPrice,
    usageLogs,
    tableId,
    currentRow,
    currentIndex,
    page
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

  const formatDisposalDate = (disposalDate, status) => {
    const { translate } = props
    if (status === 'disposed') {
      if (disposalDate) return formatDate(disposalDate)
      return translate('asset.general_information.not_disposal_date')
    }
    return translate('asset.general_information.not_disposal')
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

  /**
   * Bắt sự kiện xóa thông tin chi tiết
   */
  const delete_function = (item, index) => {
    // let {deleteAssetIds} = state;
    listAssets.splice(index, 1)
    dispatch(saveListAssetsAction(listAssets))
    props.handleDeleteAsset(item._id)
  }

  // Bắt sự kiện click chỉnh sửa thông tin tài sản
  const handleEdit = async (value, index) => {
    await setState({
      ...state,
      currentRow: value,
      currentIndex: index
    })
    window.$('#modal-edit-asset-in-edit-lot').modal('show')
  }

  return (
    <div id={id} className='tab-pane active'>
      <div className='row'>
        {/* Ảnh lo tài sản */}
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
              {/* Mã lô tài sản */}
              <div className={`form-group ${!errorOnCode ? '' : 'has-error'} `}>
                <label htmlFor='code'>
                  {translate('asset.asset_lot.asset_lot_code')}
                  <span className='text-red'>*</span>
                </label>
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
              <div className={`form-group ${!errorOnAssetLotName ? '' : 'has-error'} `}>
                <label htmlFor='assetName'>
                  {translate('asset.asset_lot.asset_lot_name')}
                  <span className='text-red'>*</span>
                </label>
                <input
                  type='text'
                  className='form-control'
                  name='assetName'
                  value={assetLotName}
                  onChange={handleAssetLotNameChange}
                  placeholder={translate('asset.asset_lot.asset_lot_name')}
                  autoComplete='off'
                />
                <ErrorLabel content={errorOnAssetLotName} />
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
                <label htmlFor='price'>{translate('asset.asset_lot.asset_lot_price')} </label>
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

              {/* Loại tài sản */}
              <div className={`form-group ${!errorOnAssetType ? '' : 'has-error'}`}>
                <label>
                  {translate('asset.general_information.asset_type')}
                  <span className='text-red'>*</span>
                </label>
                <TreeSelect data={typeArr} value={assetTypeEdit} handleChange={handleAssetTypeChange} mode='hierarchical' />
                <ErrorLabel content={errorOnAssetType} />
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
            </div>
          </div>
        </div>
      </div>
      <div className='row' style={{ marginTop: '1rem' }}>
        <div className='col-md-12'>
          <label>{translate('asset.asset_lot.assets_information')}:</label>
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
                        x.assetType.map((type, index, arr) => (index !== arr.length - 1 ? `${type.typeName}, ` : type.typeName))}
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
                      <a className='delete' title='Delete' data-toggle='tooltip' onClick={() => delete_function(x, index)}>
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
          {/* <PaginateBar
                        display={listAssetsDetail ? listAssetsDetail.length : null}
                        total={listAssetsDetail.length ? listAssetsDetail.length : null}
                        pageTotal={pageTotal ? pageTotal : 0}
                        currentPage={currentPage}
                        func={setPage}
                    /> */}

          {/* Form chỉnh sửa thông tin tài sản */}
          {currentRow && (
            <AssetEditForm
              _id={currentRow._id}
              index={currentIndex}
              edit
              employeeId={currentRow.managedBy}
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
              readByRoles={currentRow.readByRoles}
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
            />
          )}
        </div>
      </div>
    </div>
  )
}

function mapState(state) {
  const { assetType, user, assetsManager, role, department, assetLotManager } = state
  return { assetType, user, assetsManager, role, department, assetLotManager }
}

const actionCreators = {
  getUser: UserActions.get,
  getAssetType: AssetTypeActions.getAssetTypes
}
const generalTab = connect(mapState, actionCreators)(withTranslate(GeneralLotEditTab))
export { generalTab as GeneralLotEditTab }
