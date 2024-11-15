import React, { Component, useState, useEffect } from 'react'
import { connect } from 'react-redux'

import { AssetManagerActions } from '../../asset-information/redux/actions'

import { Tree } from '../../../../../common-components'
import { withTranslate } from 'react-redux-multilingual'
import { AssetViewInfo } from '../../asset-information/components/assetViewInfo'

function BuildingAsset(props) {
  const [state, setState] = useState({
    domainParent: [],
    deleteNode: []
  })

  const { translate, assetsManager } = props
  const { currentRowView } = state
  let { buildingAssets } = assetsManager
  let list = buildingAssets && buildingAssets.list
  const dataTree =
    list &&
    list.map((node) => {
      return {
        ...node,
        id: node._id,
        text: node.assetName,
        icon: 'glyphicon glyphicon-road',
        parent: node.location ? node.location.toString() : '#',
        state: {
          opened: true
        }
      }
    })

  useEffect(() => {
    props.getListBuildingAsTree()
  }, [])

  const onChanged = async (e, data) => {
    let info = data.node ? data.node.original : ''

    await setState((state) => {
      return {
        ...state,
        currentRowView: info
      }
    })

    if (state.currentRowView) {
      window.$('#form-view-building').slideDown()
    }
  }

  return (
    <React.Fragment>
      <div className='box box-solid'>
        <div className='box-body'>
          <div className='row'>
            <div className='col-xs-12 col-sm-12 col-md-4 col-lg-4'>
              <div className='building-asset' id='building-asset'>
                <Tree id='tree-qlcv-building-asset' onChanged={onChanged} data={dataTree} plugins={false} />
              </div>
            </div>
            <div className='col-xs-12 col-sm-12 col-md-8 col-lg-8'>
              {/* Form xem thông tin tài sản */}
              {currentRowView && (
                <AssetViewInfo
                  _id={currentRowView._id}
                  avatar={currentRowView.avatar}
                  code={currentRowView.code}
                  assetName={currentRowView.assetName}
                  serial={currentRowView.serial}
                  assetType={currentRowView.assetType}
                  group={currentRowView.group}
                  purchaseDate={currentRowView.purchaseDate}
                  warrantyExpirationDate={currentRowView.warrantyExpirationDate}
                  managedBy={currentRowView.managedBy}
                  assignedToUser={currentRowView.assignedToUser}
                  assignedToOrganizationalUnit={currentRowView.assignedToOrganizationalUnit}
                  handoverFromDate={currentRowView.handoverFromDate}
                  handoverToDate={currentRowView.handoverToDate}
                  location={currentRowView.location}
                  description={currentRowView.description}
                  status={currentRowView.status}
                  typeRegisterForUse={currentRowView.typeRegisterForUse}
                  detailInfo={currentRowView.detailInfo}
                  cost={currentRowView.cost}
                  readByRoles={currentRowView.readByRoles}
                  residualValue={currentRowView.residualValue}
                  startDepreciation={currentRowView.startDepreciation}
                  usefulLife={currentRowView.usefulLife}
                  depreciationType={currentRowView.depreciationType}
                  estimatedTotalProduction={currentRowView.estimatedTotalProduction}
                  unitsProducedDuringTheYears={currentRowView.unitsProducedDuringTheYears}
                  maintainanceLogs={currentRowView.maintainanceLogs}
                  usageLogs={currentRowView.usageLogs}
                  incidentLogs={currentRowView.incidentLogs}
                  disposalDate={currentRowView.disposalDate}
                  disposalType={currentRowView.disposalType}
                  disposalCost={currentRowView.disposalCost}
                  disposalDesc={currentRowView.disposalDesc}
                  archivedRecordNumber={currentRowView.archivedRecordNumber}
                  files={currentRowView.documents}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

function mapState(state) {
  const { assetsManager, assetType } = state
  return { assetsManager, assetType }
}

const actionCreators = {
  getListBuildingAsTree: AssetManagerActions.getListBuildingAsTree
}

export default connect(mapState, actionCreators)(withTranslate(BuildingAsset))
