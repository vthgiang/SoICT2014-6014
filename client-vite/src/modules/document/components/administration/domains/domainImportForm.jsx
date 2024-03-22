import React, { Component, useState } from 'react'
import { configDomain, exportDomain } from './fileConfigurationImportDomain.js'
import { DialogModal, ImportFileExcel, ShowImportData, ConFigImportFile, ExportExcel } from '../../../../../common-components'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { AuthActions } from '../../../../auth/redux/actions'
import { DocumentActions } from '../../../redux/actions'

function DomainImportForm(props) {
  const [state, setState] = useState({
    configData: configDomain,
    checkFileImport: true,
    rowError: [],
    importData: [],
    importShowData: [],
    limit: 100,
    page: 0
  })
  // Function thay đổi cấu hình file import
  const handleChangeConfig = (value) => {
    setState({
      ...state,
      configData: value,
      importData: []
    })
  }

  const handleImportExcel = (value, checkFileImport) => {
    let values = []
    let showValues = []
    let k = 0

    for (let i in value) {
      let x = value[i]
      if (x.name) {
        values = [
          ...values,
          {
            STT: k,
            name: x.name,
            description: x.description,
            parent: x.parent
          }
        ]
        showValues = [
          ...showValues,
          {
            STT: k,
            name: x.name,
            description: x.description,
            parent: x.parent
          }
        ]
        k++
      }
    }
    value = values
    if (checkFileImport) {
      let rowError = []
      for (let i in value) {
        let x = value[i]
        let errorAlert = []
        if (x.name === null) {
          rowError = [...rowError, i + 1]
          x = { ...x, error: true }
        }
        if (x.name === null) {
          errorAlert = [errorAlert, 'Tên danh mục không được để trống']
        }
        x = { ...x, errorAlert: errorAlert }
        value[i] = x
      }
      setState({
        ...state,
        importData: value,
        importShowData: showValues,
        rowError: rowError,
        checkFileImport: checkFileImport
      })
    } else {
      setState({
        ...state,
        checkFileImport: checkFileImport
      })
    }
  }

  const save = () => {
    let { importShowData } = state
    props.importDomain(importShowData)
  }
  const { translate } = props
  let { limit, page, importData, rowError, configData, checkFileImport } = state

  return (
    <React.Fragment>
      <DialogModal
        modalID={`modal_import_file-domain`}
        isLoading={false}
        formID={`form_import_file_domain`}
        title='Thêm danh mục bằng import file excel'
        func={save}
        disableSubmit={false}
        size={75}
      >
        <form className='form-group' id={`form_import_file`}>
          <ConFigImportFile
            id='import_taskTemplate_config_domain'
            configData={configData}
            scrollTable={false}
            handleChangeConfig={handleChangeConfig}
          />
          <div className='row'>
            <div className='form-group col-md-4 col-xs-12'>
              <label>{translate('human_resource.choose_file')}</label>
              <ImportFileExcel configData={configData} handleImportExcel={handleImportExcel} />
            </div>
            <div className='form-group col-md-4 col-xs-12'>
              <label></label>
              <ExportExcel
                id='download_template_task_template'
                type='link'
                exportData={exportDomain}
                buttonName='Download file import mẫu'
              />
            </div>
            <div className='form-group col-md-12 col-xs-12'>
              <ShowImportData
                id='import_taskTemplate_show_data'
                configData={configData}
                importData={importData}
                rowError={rowError}
                scrollTable={false}
                checkFileImport={checkFileImport}
                limit={limit}
                page={page}
              />
            </div>
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

function mapState(state) {
  const { importDomain } = state
  return { importDomain }
}
const actionCreators = {
  importDomain: DocumentActions.importDocumentDomain,
  downloadFile: AuthActions.downloadFile
}
const importFileExcel = connect(mapState, actionCreators)(withTranslate(DomainImportForm))
export { importFileExcel as DomainImportForm }
