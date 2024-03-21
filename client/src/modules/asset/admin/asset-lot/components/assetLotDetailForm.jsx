import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { translate } from 'react-redux-multilingual/lib/utils'
import { DialogModal } from '../../../../../common-components'
import { AttachmentTab } from '../../../base/detail-tab/components/attachmentTab'
import _isEqual from 'lodash/isEqual'
import { GeneralLotTab } from '../../../base/detail-tab/components/generalLotTab'

function AssetLotDetailForm(props) {
  const [state, setState] = useState({})
  const [prevProps, setPrevProps] = useState({
    _id: null,
    depreciationType: null,
    typeRegisterForUse: null
  })
  const { translate, assetsManager, assetLotManager } = props
  const { _id, avatar, code, assetLotName, supplier, price, total, group, assetType, archivedRecordNumber, files } = state

  if (state._id !== props._id || !_isEqual(state.files, props.files)) {
    setState({
      ...state,
      _id: props._id,
      img: process.env.REACT_APP_SERVER + props.avatar,
      avatar: props.avatar,
      code: props.code,
      assetLotName: props.assetLotName,
      price: props.price,
      total: props.total,
      group: props.group,
      assetType: props.assetType,
      supplier: props.supplier,

      archivedRecordNumber: props.archivedRecordNumber,
      files: props.files
    })
  }
  // console.log("hang assetType", assetType);
  return (
    <React.Fragment>
      <DialogModal
        size='75'
        modalID='modal-view-asset-lot'
        isLoading={assetLotManager}
        formID='form-view-asset-lot'
        title={translate('asset.asset_info.asset_info')}
        hasSaveButton={false}
      >
        <div className='nav-tabs-custom'>
          {/* Nav-tabs */}
          <ul className='nav nav-tabs'>
            <li className='active'>
              <a title={translate('asset.general_information.general_information')} data-toggle='tab' href={`#view_general${_id}`}>
                {translate('asset.general_information.general_information')}
              </a>
            </li>
            <li>
              <a title={translate('asset.general_information.attach_infomation')} data-toggle='tab' href={`#view_attachments${_id}`}>
                {translate('asset.general_information.attach_infomation')}
              </a>
            </li>
          </ul>

          <div className='tab-content'>
            {/* Thông tin chung */}
            <GeneralLotTab
              id={`view_general${_id}`}
              avatar={avatar}
              code={code}
              assetLotName={assetLotName}
              assetTypeEdit={assetType}
              group={group}
              price={price}
              total={total}
              supplier={supplier}
            />

            {/* Tài liệu đính kèm */}
            <AttachmentTab id={`view_attachments${_id}`} archivedRecordNumber={archivedRecordNumber} files={files} />
          </div>
        </div>
      </DialogModal>
    </React.Fragment>
  )
}

function mapState(state) {
  const { assetsManager, assetLotManager } = state
  return { assetsManager, assetLotManager }
}

const detailAssetLot = connect(null, null)(withTranslate(AssetLotDetailForm))
export { detailAssetLot as AssetLotDetailForm }
