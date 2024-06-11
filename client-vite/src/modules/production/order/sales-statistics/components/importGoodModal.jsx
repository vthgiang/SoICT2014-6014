import React, { useReducer } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { GoodActions } from '../redux/actions'
import { configGood, importGoodTemplate } from './fileConfigurationImportGood'
import { DialogModal, ImportFileExcel, ShowImportData, ConFigImportFile, ExportExcel } from '../../../../../common-components'

const initialState = {
  configData: configGood,
  limit: 100,
  page: 0,
  importData: [],
  importShowData: [],
  rowError: [],
  checkFileImport: false
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_CONFIG_DATA':
      return { ...state, configData: action.payload, importData: [] }
    case 'SET_IMPORT_DATA':
      return { ...state, importData: action.payload.importData, importShowData: action.payload.importShowData, rowError: action.payload.rowError, checkFileImport: action.payload.checkFileImport }
    case 'SET_CHECK_FILE_IMPORT':
      return { ...state, checkFileImport: action.payload }
    default:
      return state
  }
}

function ImportGoodModal({ translate }) {
  const dispatch = useDispatch()
  const [state, dispatchLocal] = useReducer(reducer, initialState)
  const { list } = useSelector(state => state.Good)

  const save = () => {
    dispatch(GoodActions.importGood(state.importShowData))
  }

  const handleChangeConfig = (value) => {
    dispatchLocal({ type: 'SET_CONFIG_DATA', payload: value })
  }

  const convertDataExport = (dataExport) => {
    dataExport.dataSheets.forEach(sheet => {
      sheet.tables.forEach(table => {
        table.data = table.data.map((data, index) => ({
          STT: data.code ? index + 1 : null,
          ...data
        }))
      })
    })
    return dataExport
  }

  const checkGoodCode = (code, list) => {
    return list?.some(o => o?.code?.toString()?.trim() === code?.toString()?.trim()) ? -1 : undefined
  }

  const handleImportExcel = (value, checkFileImport) => {
    let values = value.reduce((acc, cur, i) => {
      if (cur.name) {
        acc.push({
          STT: acc.length + 1,
          ...cur
        })
      } else if (acc.length > 0) {
        acc.push({
          STT: '',
          code: '',
          name: '',
          category: '',
          baseUnit: '',
          description: '',
          numberExpirationDate: '',
          pricePerBaseUnit: '',
          salesPriceVariance: '',
          sourceType: '',
          type: ''
        })
      }
      return acc
    }, [])

    let valueShow = values.filter(item => item.name)

    if (checkFileImport) {
      let rowError = []
      values = values.map((item, i) => {
        let errorAlert = []
        if (!item.code) errorAlert.push('Mã hàng hóa không được để trống')
        if (!item.name) errorAlert.push('Tên hàng hóa không được để trống')
        if (value.filter(obj => obj?.code?.toString()?.trim() === item.code?.toString()?.trim()).length > 1) errorAlert.push('Mã hàng hóa trong file trùng lặp')
        if (checkGoodCode(item.code, list) === -1) errorAlert.push('Mã hàng hóa đã tồn tại trên hệ thống')
        if (errorAlert.length > 0) rowError.push(i + 1)
        return { ...item, error: errorAlert.length > 0, errorAlert }
      })
      dispatchLocal({
        type: 'SET_IMPORT_DATA',
        payload: { importData: values, importShowData: valueShow, rowError, checkFileImport }
      })
    } else {
      dispatchLocal({ type: 'SET_CHECK_FILE_IMPORT', payload: checkFileImport })
    }
  }

  let importDataTemplate = convertDataExport(importGoodTemplate)
  return (
    <React.Fragment>
      <DialogModal
        modalID={`import_good`}
        isLoading={false}
        formID={`form_import_good`}
        title='Thêm hàng hóa bằng import file excel'
        func={save}
        disableSubmit={false}
        size={75}
      >
        <form className='form-group' id={`form_import_good`}>
          <ConFigImportFile id='import_good_config' configData={state.configData} scrollTable={false} handleChangeConfig={handleChangeConfig} />
          <div className='row'>
            <div className='form-group col-md-6 col-xs-6'>
              <label>{translate('human_resource.choose_file')}</label>
              <ImportFileExcel configData={state.configData} handleImportExcel={handleImportExcel} />
            </div>
            <div className='form-group col-md-6 col-xs-6'>
              <label></label>
              <ExportExcel id='download_good_file' type='link' exportData={importDataTemplate} buttonName='Download file import mẫu' />
            </div>
            <div className='form-group col-md-12 col-xs-12'>
              <ShowImportData
                id='import_good_show_data'
                configData={state.configData}
                importData={state.importData}
                rowError={state.rowError}
                scrollTable={true}
                checkFileImport={state.checkFileImport}
                limit={state.limit}
                page={state.page}
              />
            </div>
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

export default withTranslate(ImportGoodModal)
