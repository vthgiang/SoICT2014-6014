import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { ShowImportData, ConFigImportFile } from '../../../../../common-components'

function AssetImportTab(props) {
  const [state, setState] = useState({
    limit: 100,
    page: 0
  })

  const { id, className = 'tab-pane', configuration, scrollTable = false, importData, rowError, checkFileImport } = props
  const { limit, page, configData } = state

  // Function Thay đổi cấu hình file import
  const handleChangeConfig = (value) => {
    setState((state) => {
      return {
        ...state,
        configData: value
      }
    })
  }

  return (
    <React.Fragment>
      <div id={id} className={className}>
        <div className='box-body row'>
          <div className='form-group col-md-12 col-xs-12' style={{ marginBottom: 5, paddingRight: 10 }}>
            <ConFigImportFile
              id={`import_asset_config${id}`}
              scrollTable={scrollTable}
              configData={configData ? configData : configuration}
              handleChangeConfig={handleChangeConfig}
            />
          </div>
          <div className='col-md-12 col-xs-12'>
            <ShowImportData
              id={`import_asset_show_data${id}`}
              configData={configData ? configData : configuration}
              importData={importData}
              rowError={rowError}
              checkFileImport={checkFileImport}
              scrollTable={scrollTable}
              limit={limit}
              page={page}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

const actions = {}

const connectedAssetImportTab = connect(null, actions)(withTranslate(AssetImportTab))
export { connectedAssetImportTab as AssetImportTab }
