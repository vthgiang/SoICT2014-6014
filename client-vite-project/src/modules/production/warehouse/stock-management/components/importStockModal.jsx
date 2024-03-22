import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { StockActions } from '../redux/actions'
import { configStock, importStockTemplate } from './fileConfigurationImportStock'
import { DialogModal, ImportFileExcel, ShowImportData, ConFigImportFile, ExportExcel } from '../../../../../common-components'

function ImportStockModal(props) {
  const [state, setState] = useState({
    configData: configStock,
    limit: 100,
    page: 0
  })

  const { translate } = props
  const { configData, importData, rowError, checkFileImport, limit, page } = state
  const save = () => {
    const { importShowData } = state
    props.importStock(importShowData)
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
            address: dataTemporary.address,
            status: dataTemporary.status,
            startTime: dataTemporary.startTime,
            endTime: dataTemporary.endTime,
            organizationalUnitValue: dataTemporary.organizationalUnitValue,
            description: dataTemporary.description
          }
          datas = [...datas, out]
        }

        dataExport.dataSheets[i].tables[j].data = datas
      }
    }

    return dataExport
  }

  const checkStockCode = (code, list) => {
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
            address: valueTemporary.address,
            status: valueTemporary.status,
            startTime: valueTemporary.startTime,
            endTime: valueTemporary.endTime,
            organizationalUnitValue: valueTemporary.organizationalUnitValue,
            description: valueTemporary.description
          }
        ]
        valueShow = [
          ...valueShow,
          {
            code: valueTemporary.code,
            name: valueTemporary.name,
            address: valueTemporary.address,
            status: valueTemporary.status,
            startTime: valueTemporary.startTime,
            endTime: valueTemporary.endTime,
            organizationalUnitValue: valueTemporary.organizationalUnitValue,
            description: valueTemporary.description
          }
        ]
      } else {
        if (index >= 0) {
          let out = {
            STT: '',
            code: '',
            name: '',
            address: '',
            status: '',
            startTime: '',
            endTime: '',
            organizationalUnitValue: '',
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
        if (x.name === null || x.code === null || (value[i]?.code && checkCode?.length > 1) || checkStockCode(x.code, list) === -1) {
          rowError = [...rowError, i + 1]
          x = { ...x, error: true }
        }
        if (x.code === null) {
          errorAlert = [...errorAlert, 'Mã kho không được để trống']
        }
        if (x.name === null) {
          errorAlert = [...errorAlert, 'Tên kho không được để trống']
        }
        if (value[i]?.code && checkCode?.length > 1) {
          errorAlert = [...errorAlert, 'Mã kho trong file trùng lặp']
        }
        if (checkStockCode(x.code, list) === -1) {
          errorAlert = [...errorAlert, 'Mã kho đã tồn tại trên hệ thống']
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

  let importDataTemplate = convertDataExport(importStockTemplate)
  return (
    <React.Fragment>
      <DialogModal
        modalID={`import_stock`}
        isLoading={false}
        formID={`form_import_stock`}
        title='Thêm kho bằng import file excel'
        func={save}
        disableSubmit={false}
        size={75}
      >
        <form className='form-group' id={`form_import_stock`}>
          <ConFigImportFile id='import_stock_config' configData={configData} scrollTable={false} handleChangeConfig={handleChangeConfig} />
          <div className='row'>
            <div className='form-group col-md-6 col-xs-6'>
              <label>{translate('human_resource.choose_file')}</label>
              <ImportFileExcel configData={configData} handleImportExcel={handleImportExcel} />
            </div>
            <div className='form-group col-md-6 col-xs-6'>
              <label></label>
              <ExportExcel id='download_stock_file' type='link' exportData={importDataTemplate} buttonName='Download file import mẫu' />
            </div>
            <div className='form-group col-md-12 col-xs-12'>
              <ShowImportData
                id='import_stock_show_data'
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
  const { Stock } = state
  return { Stock }
}
const actions = {
  importStock: StockActions.importStock
}

export default connect(mapState, actions)(withTranslate(ImportStockModal))
