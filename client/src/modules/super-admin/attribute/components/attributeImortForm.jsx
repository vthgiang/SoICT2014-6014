import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { AttributeActions } from '../redux/actions'

import { ShowImportData, ConFigImportFile, ImportFileExcel, DialogModal, ExportExcel } from '../../../../common-components/index'

import { configurationAttributeTemplate, importAttributeTemplate } from '../components-import/fileConfigurationImportAttribute'

function AttributeImportForm(props) {
  const [state, setState] = useState({
    id: 'import_file_attribute',
    importData: undefined,
    rowError: [],
    configData: undefined,
    checkFileImport: undefined
  })

  const { importData, rowError, configData, checkFileImport, id } = state
  const { translate, page, perPage } = props // Props from parent

  // Function Thay đổi cấu hình file import
  const handleChangeConfig = (value) => {
    setState({
      ...state,
      configData: value
    })
  }

  // Xử lý file import
  const handleImportExcel = (value, checkFileImport) => {
    if (checkFileImport) {
      let rowError = []
      value = value.map((item, index) => {
        let errorAlert = []

        if (!item.attributeName) {
          rowError = [...rowError, index + 1]
          item = { ...item, error: true }
        }

        if (!item.attributeName) {
          errorAlert = [...errorAlert, 'Tên ví dụ không được bỏ trống']
        }

        return {
          ...item,
          errorAlert: errorAlert
        }
      })

      setState({
        ...state,
        importData: value,
        rowError: rowError,
        checkFileImport: true
      })
    } else {
      setState({
        ...state,
        checkFileImport: checkFileImport
      })
    }
  }

  const isFormValidated = () => {
    if (rowError.length !== 0 || !checkFileImport) {
      return false
    }
    return true
  }

  const save = () => {
    if (isFormValidated()) {
      importData && props.createAttribute(importData)
      importData &&
        props.getAttributes({
          attributeName: '',
          page: page,
          perPage: perPage
        })
    }
  }

  return (
    <React.Fragment>
      <DialogModal
        modalID={`modal-import-file-attribute-hooks`}
        isLoading={false}
        formID={`form-import-file-attribute-hooks`}
        title={translate('human_resource.add_data_by_excel')}
        func={save}
        disableSubmit={!isFormValidated()}
        size={50}
      >
        <form className='form-group' id={`form-import-file-attribute-hooks`}>
          <div className='col-md-12 col-xs-12'>
            <ConFigImportFile
              id={`import_asset_config${id}`}
              scrollTable={false}
              configData={configData ? configData : configurationAttributeTemplate}
              handleChangeConfig={handleChangeConfig}
            />
          </div>
          <div className='row'>
            <div className='col-md-4 col-xs-12'>
              <label>{translate('human_resource.choose_file')}</label>
              <ImportFileExcel
                id={'file-import-attribute'}
                configData={configData ? configData : configurationAttributeTemplate}
                handleImportExcel={handleImportExcel}
              />
            </div>
            <div className='col-md-8 col-xs-12'>
              <label></label>
              <ExportExcel
                id='download_template_attribute'
                type='link'
                exportData={importAttributeTemplate}
                buttonName='Download file import mẫu'
              />
            </div>
          </div>
          <div className='col-md-12 col-xs-12'>
            <ShowImportData
              id={`import_asset_show_data${id}`}
              configData={configData ? configData : configurationAttributeTemplate}
              importData={importData}
              rowError={rowError}
              checkFileImport={checkFileImport}
              scrollTable={false}
              limit={100}
              page={0}
            />
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

const actions = {
  createAttribute: AttributeActions.createAttribute,
  getAttributes: AttributeActions.getAttributes
}

const connectedAttributeImportForm = connect(null, actions)(withTranslate(AttributeImportForm))
export { connectedAttributeImportForm as AttributeImportForm }
