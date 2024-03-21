import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal, Scheduler } from '../../../../../common-components'

import {
  GeneralTab,
  MaintainanceLogTab,
  UsageLogTab,
  DepreciationTab,
  IncidentLogTab,
  DisposalTab,
  AttachmentTab
} from '../../../base/detail-tab/components/combinedContent'
import { AssetViewInfo } from './assetViewInfo'

function AssetDetailForm(props) {
  const [state, setState] = useState({})
  const [prevProps, setPrevProps] = useState({
    _id: null,
    depreciationType: null,
    typeRegisterForUse: null
  })
  const { translate, assetsManager } = props
  const {
    _id,
    avatar,
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
    cost,
    residualValue,
    startDepreciation,
    usefulLife,
    depreciationType,
    estimatedTotalProduction,
    unitsProducedDuringTheYears,
    maintainanceLogs,
    usageLogs,
    incidentLogs,
    disposalDate,
    disposalType,
    disposalCost,
    disposalDesc,
    archivedRecordNumber,
    files,
    readByRoles
  } = state
  let isChange = 0
  for (const property in prevProps) {
    if (prevProps[property] !== props[property]) {
      isChange = 1
    }
  }

  if (isChange === 1) {
    setState({
      ...state,
      _id: props._id,
      img: process.env.REACT_APP_SERVER + props.avatar,
      avatar: props.avatar,
      code: props.code,
      assetName: props.assetName,
      serial: props.serial,
      assetType: props.assetType,
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
      cost: props.cost,
      residualValue: props.residualValue,
      startDepreciation: props.startDepreciation,
      usefulLife: props.usefulLife,
      estimatedTotalProduction: props.estimatedTotalProduction,
      unitsProducedDuringTheYears: props.unitsProducedDuringTheYears,
      depreciationType: props.depreciationType,
      maintainanceLogs: props.maintainanceLogs,
      usageLogs: props.usageLogs,
      incidentLogs: props.incidentLogs,
      disposalDate: props.disposalDate,
      disposalType: props.disposalType,
      disposalCost: props.disposalCost,
      disposalDesc: props.disposalDesc,
      archivedRecordNumber: props.archivedRecordNumber,
      files: props.files,
      readByRoles: props.readByRoles
    })
    setPrevProps(props)
  }

  return (
    <React.Fragment>
      <DialogModal
        size='75'
        modalID='modal-view-asset'
        isLoading={assetsManager}
        formID='form-view-asset'
        title={translate('asset.asset_info.asset_info')}
        hasSaveButton={false}
      >
        <AssetViewInfo
          id='form-view-asset'
          _id={_id}
          avatar={avatar}
          code={code}
          assetName={assetName}
          serial={serial}
          assetType={assetType}
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
          cost={cost}
          readByRoles={readByRoles}
          residualValue={residualValue}
          startDepreciation={startDepreciation}
          usefulLife={usefulLife}
          depreciationType={depreciationType}
          estimatedTotalProduction={estimatedTotalProduction}
          unitsProducedDuringTheYears={unitsProducedDuringTheYears}
          maintainanceLogs={maintainanceLogs}
          usageLogs={usageLogs}
          incidentLogs={incidentLogs}
          disposalDate={disposalDate}
          disposalType={disposalType}
          disposalCost={disposalCost}
          disposalDesc={disposalDesc}
          archivedRecordNumber={archivedRecordNumber}
          files={files}
          linkPage={props.linkPage}
        />
      </DialogModal>
    </React.Fragment>
  )
}
function mapState(state) {
  const { assetsManager } = state
  return { assetsManager }
}

const detailAsset = connect(null, null)(withTranslate(AssetDetailForm))
export { detailAsset as AssetDetailForm }
