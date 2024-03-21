import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { CategoryActions } from '../redux/actions'
import { configCategory, importCategoryTemplate } from './fileConfigurationImportCategory'
import { DialogModal, ImportFileExcel, ShowImportData, ConFigImportFile, ExportExcel } from '../../../../../common-components'

function ImportCategoryModal(props) {
  const [state, setState] = useState({
    configData: configCategory,
    limit: 100,
    page: 0
  })

  const { translate } = props
  const { configData, importData, rowError, checkFileImport, limit, page } = state
  const save = () => {
    const { importShowData } = state
    props.importCategory(importShowData)
  }

  const handleChangeConfig = (value) => {
    setState({
      ...state,
      configData: value,
      importData: []
    })
  }

  const convertDataExport = (dataExport) => {
    for (let i = 0; i < dataExport.dataSheets.length; i++) {
      for (let j = 0; j < dataExport.dataSheets[i].tables.length; j++) {
        let datas = []
        let data = dataExport.dataSheets[i].tables[j].data

        for (let index = 0; index < data.length; index++) {
          let dataTemporary = data[index]
          let out = {
            STT: dataTemporary.code ? index + 1 : null,
            code: dataTemporary.code,
            name: dataTemporary.name,
            parent: dataTemporary.parent,
            description: dataTemporary.description
          }
          datas = [...datas, out]
        }

        dataExport.dataSheets[i].tables[j].data = datas
      }
    }

    return dataExport
  }

  const checkCategoryCode = (code, list) => {
    let checkCode
    if (list?.length) {
      checkCode = list.filter((o) => o?.code === code?.toString()?.trim())
    }
    if (checkCode?.length) return -1
  }

  const handleImportExcel = (value, checkFileImport) => {
    const { list } = props
    let values = [],
      valueShow = [],
      index = -1

    for (let i = 0; i < value.length; i++) {
      const valueTemporary = value[i]
      if (valueTemporary.name) {
        index = index + 1
        values = [
          ...values,
          {
            STT: index + 1,
            code: valueTemporary.code,
            name: valueTemporary.name,
            parent: valueTemporary.parent,
            description: valueTemporary.description
          }
        ]
        valueShow = [
          ...valueShow,
          {
            code: valueTemporary.code,
            name: valueTemporary.name,
            parent: valueTemporary.parent,
            description: valueTemporary.description
          }
        ]
      } else {
        if (index >= 0) {
          let out = {
            STT: '',
            code: '',
            name: '',
            parent: '',
            description: ''
          }
          values = [...values, out]
        }
      }
    }
    value = values

    if (checkFileImport) {
      let rowError = []
      for (let i = 0; i < value.length; i++) {
        let x = value[i],
          errorAlert = []
        const checkCode = value.filter((obj) => obj?.code?.toString()?.trim() === value[i]?.code?.toString()?.trim())
        if (x.name === null || x.code === null || (value[i]?.code && checkCode?.length > 1) || checkCategoryCode(x.code, list) === -1) {
          rowError = [...rowError, i + 1]
          x = { ...x, error: true }
        }
        if (x.code === null) {
          errorAlert = [...errorAlert, 'Mã danh mục không được để trống']
        }
        if (x.name === null) {
          errorAlert = [...errorAlert, 'Tên danh mục không được để trống']
        }
        if (value[i]?.code && checkCode?.length > 1) {
          errorAlert = [...errorAlert, 'Mã danh mục trong file trùng lặp']
        }
        if (checkCategoryCode(x.code, list) === -1) {
          errorAlert = [...errorAlert, 'Mã danh mục đã tồn tại trên hệ thống']
        }

        x = { ...x, errorAlert: errorAlert }
        value[i] = x
      }

      setState({
        ...state,
        importData: value, // show ra :))
        importShowData: valueShow, // Luuw db
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

  let importDataTemplate = convertDataExport(importCategoryTemplate)
  return (
    <React.Fragment>
      <DialogModal
        modalID={`import_category`}
        isLoading={false}
        formID={`form_import_category`}
        title='Thêm danh mục bằng import file excel'
        func={save}
        disableSubmit={false}
        size={75}
      >
        <form className='form-group' id={`form_import_category`}>
          <ConFigImportFile
            id='import_category_config'
            configData={configData}
            scrollTable={false}
            handleChangeConfig={handleChangeConfig}
          />
          <div className='row'>
            <div className='form-group col-md-6 col-xs-6'>
              <label>{translate('human_resource.choose_file')}</label>
              <ImportFileExcel configData={configData} handleImportExcel={handleImportExcel} />
            </div>
            <div className='form-group col-md-6 col-xs-6'>
              <label></label>
              <ExportExcel id='download_category_file' type='link' exportData={importDataTemplate} buttonName='Download file import mẫu' />
            </div>
            <div className='form-group col-md-12 col-xs-12'>
              <ShowImportData
                id='import_category_show_data'
                configData={configData}
                importData={importData}
                rowError={rowError}
                scrollTable={true}
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
  const { Category } = state
  return { Category }
}
const actions = {
  importCategory: CategoryActions.importCategory
}

export default connect(mapState, actions)(withTranslate(ImportCategoryModal))
