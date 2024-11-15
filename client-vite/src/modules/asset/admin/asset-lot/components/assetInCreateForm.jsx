import React, { Component, useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import moment from 'moment'

import { DialogModal, Scheduler } from '../../../../../common-components'
import { convertJsonObjectToFormData } from '../../../../../helpers/jsonObjectToFormDataObjectConverter'
import {
  GeneralTab,
  MaintainanceLogTab,
  UsageLogTab,
  DepreciationTab,
  IncidentLogTab,
  DisposalTab,
  FileTab
} from '../../../base/create-tab/components/combinedContent'

import { saveListAssetsAction } from '../redux/actions'
import { UseRequestActions } from '../../use-request/redux/actions'
import _isEqual from 'lodash/isEqual'
function AssetInCreateForm(props) {
  const [state, setState] = useState({
    employeeId: props.employeeId ? props.employeeId : '',

    maintainanceLogs: [],
    usageLogs: [],
    incidentLogs: [],
    files: [],
    listAssets: []
  })
  const [prevProps, setPrevProps] = useState({
    _id: null,
    code: ''
  })

  const index = props.index
  const edit = props.edit
  const dispatch = useDispatch()

  const { translate, assetLotManager } = props
  const {
    _id,
    img,
    code,
    assetName,
    serial,
    assetType,
    group,
    purchaseDate,
    warrantyExpirationDate,
    managedBy,
    assignedToUser,
    assignedToOrganizationalUnit,
    handoverFromDate,
    handoverToDate,
    location,
    description,
    status,
    typeRegisterForUse,
    detailInfo,
    usageLogs,
    maintainanceLogs,
    incidentLogs,
    disposalDate,
    disposalType,
    disposalCost,
    disposalDesc,
    files,
    readByRoles,
    listAssets
  } = state

  if (prevProps.code !== props.code) {
    setState({
      ...state,
      _id: props._id,
      img: props.avatar ? `.${props.avatar}` : null,
      avatar: '',
      code: props.code,
      assetName: props.assetName,
      serial: props.serial,
      assetType: props.assetType ? props.assetType && JSON.parse(props.assetType).map((o) => o._id || o) : [],
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
      readByRoles: props.readByRoles,
      listAssets: props.listAssets,

      // Khấu hao
      cost: props.cost,
      residualValue: props.residualValue,
      usefulLife: props.usefulLife,
      startDepreciation: props.startDepreciation,
      depreciationType: props.depreciationType,
      estimatedTotalProduction: props.estimatedTotalProduction,
      unitsProducedDuringTheYears: props.unitsProducedDuringTheYears,
      // Thanh lý
      disposalDate: props.disposalDate,
      disposalType: props.disposalType,
      disposalCost: props.disposalCost,
      disposalDesc: props.disposalDesc,
      // Bảo trì
      maintainanceLogs: props.maintainanceLogs,
      // Sử dụng
      usageLogs: props.usageLogs,
      // Sự cố
      incidentLogs: props.incidentLogs,
      // Tài liệu tham khảo
      archivedRecordNumber: props.archivedRecordNumber,
      files: props.files,

      editUsageLogs: [],
      deleteUsageLogs: [],
      editMaintainanceLogs: [],
      deleteMaintainanceLogs: [],
      editIncidentLogs: [],
      deleteIncidentLogs: [],
      editFiles: [],
      deleteFiles: [],
      page: props.page,

      errorOnCode: undefined,
      errorOnAssetName: undefined,
      errorOnSerial: undefined,
      errorOnAssetType: undefined,
      errorOnLocation: undefined,
      errorOnPurchaseDate: undefined,
      errorOnWarrantyExpirationDate: undefined,
      errorOnManagedBy: undefined,
      errorOnAssignedToUser: undefined,
      errorOnAssignedToOrganizationalUnit: undefined,
      errorOnNameField: undefined,
      errorOnValue: undefined
    })
    setPrevProps(props)
  }
  // Function upload avatar
  const handleUpload = (img, avatar) => {
    setState({
      ...state,
      img: img,
      avatar: avatar
    })
  }

  // Function lưu các trường thông tin vào state
  const handleChange = (name, value) => {
    let { listAssets } = state
    if (
      name === 'purchaseDate' ||
      name === 'warrantyExpirationDate' ||
      name === 'handoverFromDate' ||
      name === 'handoverToDate' ||
      name === 'startDepreciation' ||
      name === 'disposalDate'
    ) {
      //
      if (value) {
        var partValue = value.split('-')
        value = [partValue[2], partValue[1], partValue[0]].join('-')
      } else {
        value = null
      }
    }
    if (name === 'assetType') {
      value = JSON.stringify(value)
    }

    listAssets[index][name] = value
    setState({
      ...state,
      [name]: value,
      listAssets: listAssets
    })
    dispatch(saveListAssetsAction(listAssets, edit))
  }

  // Function thêm, chỉnh sửa thông tin bảo trì
  const handleChangeMaintainanceLog = (data, addData) => {
    const { maintainanceLogs } = state
    maintainanceLogs.push(addData)
    setState({
      ...state,
      maintainanceLogs: maintainanceLogs
    })
  }

  // Function thêm, chỉnh sửa thông tin cấp phát, điều chuyển, thu hồi
  const handleChangeUsageLog = (data, addData) => {
    const { asset, listAssets } = state
    let { usageLogs } = state
    if (usageLogs === undefined) {
      usageLogs = []
    }
    usageLogs.push(addData)

    let status = addData ? addData.status : asset.status
    listAssets[index].assignedToUser = addData ? addData.usedByUser : null
    listAssets[index].assignedToOrganizationalUnit = addData ? addData.usedByOrganizationalUnit : null
    listAssets[index].status = data.status
    setState({
      ...state,
      usageLogs: usageLogs,
      asset: {
        ...asset,
        assignedToUser: addData ? addData.usedByUser : null,
        assignedToOrganizationalUnit: addData ? addData.usedByOrganizationalUnit : null,
        status: status
      },
      listAssets: listAssets
    })
  }

  // Function thêm, chỉnh sửa thông tin sự cố thiết bị
  const handleChangeIncidentLog = (data, addData) => {
    let { incidentLogs } = state
    if (incidentLogs === undefined) {
      incidentLogs = []
    }
    incidentLogs.push(addData)
    setState({
      ...state,
      incidentLogs: incidentLogs
    })
  }

  // Function thêm thông tin tài liệu đính kèm
  const handleChangeFile = (data, addData) => {
    let { files } = state
    if (files === undefined) {
      files = []
    }
    files.push(addData)
    setState({
      ...state,
      files: files
    })
  }

  const handleRecallAsset = (data) => {
    const { asset, listAssets } = state
    listAssets[index].assignedToUser = data.assignedToUser
    listAssets[index].assignedToOrganizationalUnit = data.assignedToOrganizationalUnit
    listAssets[index].status = data.status

    setState({
      ...state,
      asset: {
        ...asset,
        assignedToUser: data.assignedToUser,
        assignedToOrganizationalUnit: data.assignedToOrganizationalUnit,
        status: data.status
      },
      listAssets: listAssets
    })
  }

  // TODO: function
  const handleChangeCourse = (data) => {
    const { assetNew } = state
    setState({
      ...state,
      assetNew: {
        ...state,
        ...assetNew
      }
    })
  }

  // function kiểm tra các trường bắt buộc phải nhập
  const validatorInput = (value) => {
    if (value !== undefined && value !== null && value.toString().trim() !== '') {
      return true
    }
    return false
  }

  // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
  const isFormValidated = () => {
    let { code, assetName, assetType, purchaseDate, status, typeRegisterForUse, depreciationType, estimatedTotalProduction } = state

    if (state !== {}) {
      let unitProductionValidate = true
      if (depreciationType === 'units_of_production') {
        unitProductionValidate = validatorInput(estimatedTotalProduction)
      }

      let result =
        validatorInput(code) &&
        validatorInput(assetName) &&
        validatorInput(assetType) &&
        validatorInput(status) &&
        validatorInput(typeRegisterForUse) &&
        unitProductionValidate
      return result
    }

    return true
  }

  const save = async () => {
    let {
      avatar,
      maintainanceLogs,
      usageLogs,
      incidentLogs,
      files,
      assignedToUser,
      assignedToOrganizationalUnit,
      handoverFromDate,
      handoverToDate,
      employeeId,
      page,
      listAssets
    } = state
    const createMaintainanceLogs = maintainanceLogs && maintainanceLogs.filter((x) => !x._id)
    const createUsageLogs = usageLogs && usageLogs.filter((x) => !x._id)
    const createIncidentLogs = incidentLogs && incidentLogs.filter((x) => !x._id)
    const createFiles = files && files.filter((x) => !x._id)

    listAssets[index].avatar = avatar
    listAssets[index].maintainanceLogs = maintainanceLogs
    listAssets[index].usageLogs = usageLogs
    listAssets[index].incidentLogs = incidentLogs
    listAssets[index].files = files

    if (!_id && _id !== '') {
      listAssets[index].createMaintainanceLogs = createMaintainanceLogs
      listAssets[index].createUsageLogs = createUsageLogs
      listAssets[index].createIncidentLogs = createIncidentLogs
      listAssets[index].createFiles = createFiles

      listAssets[index].editMaintainanceLogs = state.editMaintainanceLogs
      listAssets[index].editUsageLogs = state.editUsageLogs
      listAssets[index].editIncidentLogs = state.editIncidentLogs
      listAssets[index].editFiles = state.editFiles

      listAssets[index].deleteMaintainanceLogs = state.deleteMaintainanceLogs
      listAssets[index].deleteUsageLogs = state.deleteUsageLogs
      listAssets[index].deleteIncidentLogs = state.deleteIncidentLogs
      listAssets[index].deleteFiles = state.deleteFiles
    }

    dispatch(saveListAssetsAction(listAssets, edit))
  }

  // Function format dữ liệu Date thành string
  const formatDate = (date, monthYear = false) => {
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

  return (
    <React.Fragment>
      <DialogModal
        size='75'
        modalID={`modal-edit-asset-in-create-lot`}
        isLoading={assetLotManager.isLoading}
        formID='form-edit-asset-in-create-lot'
        title={translate('asset.general_information.edit_info')}
        func={save}
        disableSubmit={!isFormValidated()}
      >
        {/* Nav-tabs */}
        <div className='nav-tabs-custom' style={{ marginTop: '-15px' }} id='nav-tabs-create-lot'>
          {/* Nav-tabs */}
          <ul className='nav nav-tabs'>
            <li className='active'>
              <a title={translate('asset.general_information.general_information')} data-toggle='tab' href={`#edit_general_in_create_lot`}>
                {translate('asset.general_information.general_information')}
              </a>
            </li>
            <li>
              <a
                title={translate('asset.general_information.usage_information')}
                data-toggle='tab'
                href={`#usage_in_create_lot`}
                onClick={() => {
                  Scheduler.triggerOnActiveEvent('.asset-usage-scheduler')
                }}
              >
                {translate('asset.general_information.usage_information')}
              </a>
            </li>
            <li>
              <a title={translate('asset.general_information.incident_information')} data-toggle='tab' href={`#incident_in_create_lot`}>
                {translate('asset.general_information.incident_information')}
              </a>
            </li>
            <li>
              <a
                title={translate('asset.general_information.maintainance_information')}
                data-toggle='tab'
                href={`#maintainance_in_create_lot`}
              >
                {translate('asset.general_information.maintainance_information')}
              </a>
            </li>
            <li>
              <a title={translate('asset.general_information.disposal_information')} data-toggle='tab' href={`#disposal_in_create_lot`}>
                {translate('asset.general_information.disposal_information')}
              </a>
            </li>
            <li>
              <a title={translate('asset.general_information.attach_infomation')} data-toggle='tab' href={`#attachments_in_create_lot`}>
                {translate('asset.general_information.attach_infomation')}
              </a>
            </li>
          </ul>

          <div className='tab-content'>
            {/* Thông tin chung */}
            <GeneralTab
              id={`edit_general_in_create_lot`}
              img={img}
              handleChange={handleChange}
              handleUpload={handleUpload}
              // avatar={avatar}
              code={code}
              assetName={assetName}
              serial={serial}
              assetTypeEdit={assetType}
              group={group}
              purchaseDate={purchaseDate}
              warrantyExpirationDate={warrantyExpirationDate}
              managedBy={managedBy}
              assignedToUser={assignedToUser}
              assignedToOrganizationalUnit={assignedToOrganizationalUnit}
              handoverFromDate={handoverFromDate}
              handoverToDate={handoverToDate}
              location={location}
              description={description}
              status={status}
              typeRegisterForUse={typeRegisterForUse}
              detailInfo={detailInfo}
              usageLogs={usageLogs}
              readByRoles={readByRoles ? readByRoles : []}
            />

            {/* Thông tin bảo trì */}
            <MaintainanceLogTab
              id='maintainance_in_create_lot'
              maintainanceLogs={maintainanceLogs}
              handleAddMaintainance={handleChangeMaintainanceLog}
              handleEditMaintainance={handleChangeMaintainanceLog}
              handleDeleteMaintainance={handleChangeMaintainanceLog}
            />

            {/* Thông tin sử dụng */}
            <UsageLogTab
              id='usage_in_create_lot'
              usageLogs={usageLogs}
              typeRegisterForUse={listAssets[index] && listAssets[index].typeRegisterForUse ? listAssets[index].typeRegisterForUse : null}
              managedBy={listAssets[index] && listAssets[index].managedBy ? listAssets[index].managedBy : null}
              handleAddUsage={handleChangeUsageLog}
              handleEditUsage={handleChangeUsageLog}
              handleDeleteUsage={handleChangeUsageLog}
              handleRecallAsset={handleRecallAsset}
            />

            {/* Thông tin sự cố */}
            <IncidentLogTab
              id='incident_in_create_lot'
              incidentLogs={incidentLogs}
              handleAddIncident={handleChangeIncidentLog}
              handleEditIncident={handleChangeIncidentLog}
              handleDeleteIncident={handleChangeIncidentLog}
            />

            {/* Thông tin thanh lý */}
            <DisposalTab id='disposal_in_create_lot' asset={listAssets[index]} handleChange={handleChange} />

            {/* Tài liệu đính kèm */}
            <FileTab
              id='attachments_in_create_lot'
              files={files}
              asset={listAssets[index]}
              handleChange={handleChange}
              handleAddFile={handleChangeFile}
              handleEditFile={handleChangeFile}
              handleDeleteFile={handleChangeFile}
            />
          </div>
        </div>
      </DialogModal>
    </React.Fragment>
  )
}

function mapState(state) {
  const { assetsInfo, assetsManager, assetLotManager } = state
  return { assetsInfo, assetsManager, assetLotManager }
}

const actionCreators = {
  //updateInformationAsset: AssetManagerActions.updateInformationAsset,
  createUsage: UseRequestActions.createUsage
}
const editInCreateForm = connect(mapState, actionCreators)(withTranslate(AssetInCreateForm))
export { editInCreateForm as AssetInCreateForm }
