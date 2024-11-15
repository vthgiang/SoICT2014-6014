import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DialogModal, ImportFileExcel, ConFigImportFile, ShowImportData, ExportExcel } from '../../../../common-components'

import { configurationWorkPlan } from './fileConfigurationImportWorksPlan'

import { WorkPlanActions } from '../redux/actions'
import { AuthActions } from '../../../auth/redux/actions'

const WorkPlanImportForm = (props) => {
  const { translate } = props

  const [state, setState] = useState({
    configData: configurationWorkPlan.configurationImport(translate),
    checkFileImport: true,
    rowError: [],
    importData: [],
    month: null,
    limit: 100,
    page: 0
  })

  useEffect(() => {
    const { workPlan } = props
    workPlan.importStatus && window.$(`#modal_import_file`).modal('hide')
  }, [])
  /**
   * Function Thay đổi cấu hình file import
   * @param {*} value : Dữ liệu cấu hình file import
   */
  const handleChangeConfig = (value) => {
    setState((state) => ({
      ...state,
      configData: value,
      importData: []
    }))
  }

  /**
   * Convert dữ liệu date trong excel thành dạng dd-mm-yyyy
   * @param {*} serial : seri ngày cần format
   */
  const convertExcelDateToJSDate = (serial) => {
    let utc_days = Math.floor(serial - 25569)
    let utc_value = utc_days * 86400
    let date_info = new Date(utc_value * 1000)
    let month = date_info.getMonth() + 1
    let day = date_info.getDate()
    if (month.toString().length < 2) month = '0' + month
    if (day.toString().length < 2) day = '0' + day
    return [day, month, date_info.getFullYear()].join('-')
  }

  /**
   * Function thay đổi file import
   * @param {*} value : Dữ liệu import
   * @param {*} checkFileImport : true file import hợp lệ, false file import không hợp lệ
   */
  const handleImportExcel = (value, checkFileImport) => {
    const { translate } = props
    value = value.map((x) => {
      let startDate = typeof x.startDate === 'string' ? x.startDate : convertExcelDateToJSDate(x.startDate)
      let endDate = typeof x.endDate === 'string' ? x.endDate : convertExcelDateToJSDate(x.endDate)
      let type = x.type
      switch (type) {
        case translate('human_resource.work_plan.time_for_holiday'):
          type = 'time_for_holiday'
          break
        case translate('human_resource.work_plan.time_allow_to_leave'):
          type = 'time_allow_to_leave'
          break
        case translate('human_resource.work_plan.time_not_allow_to_leave'):
          type = 'time_not_allow_to_leave'
          break
        default:
          type = null
          break
      }
      return { type: type, startDate: startDate, endDate: endDate, description: x.description }
    })

    if (checkFileImport) {
      let rowError = []
      value = value.map((x, index) => {
        let errorAlert = []
        if (x.startDate === null || x.endDate === null || x.reason === null || x.type === null) {
          rowError = [...rowError, index + 1]
          x = { ...x, error: true }
        }
        if (x.type === null) {
          errorAlert = [...errorAlert, 'type_required']
        }
        if (x.startDate === null) {
          errorAlert = [...errorAlert, 'start_date_required']
        }
        if (x.endDate === null) {
          errorAlert = [...errorAlert, 'end_date_required']
        }
        if (x.reason === null) {
          errorAlert = [...errorAlert, 'reason_required']
        }
        x = { ...x, errorAlert: errorAlert }
        return x
      })

      setState((state) => ({
        ...state,
        importData: value,
        rowError: rowError,
        checkFileImport: checkFileImport
      }))
    } else {
      setState((state) => ({
        ...state,
        checkFileImport: checkFileImport
      }))
    }
  }

  /** Function kiểm tra lỗi của các dữ liệu nhập vào để undisable submit form */
  const isFormValidated = () => {
    let { rowError, importData } = state
    const { workPlan } = props
    if (workPlan.error.rowError !== undefined) {
      rowError = workPlan.error.rowError
      importData = workPlan.error.data
    }
    if (rowError.length === 0 && importData.length !== 0) {
      return true
    }
    return false
  }

  /** function import dữ liệu */
  const save = () => {
    const { importWorkPlan } = props
    let { importData } = state
    let data = importData
    for (let n in data) {
      let partStart = data[n].startDate.split('-')
      let startDate = [partStart[2], partStart[1], partStart[0]].join('-')
      let partEnd = data[n].endDate.split('-')
      let endDate = [partEnd[2], partEnd[1], partEnd[0]].join('-')
      data[n] = { ...data[n], startDate: startDate, endDate: endDate }
    }
    importWorkPlan(data)
  }

  /**
   * Function dowload file import mẫu
   * @param {*} e
   * @param {*} path : Đường dẫn file
   * @param {*} fileName : Tên file dùng đê lưu
   */
  const requestDownloadFile = (e, path, fileName) => {
    const { downloadFile } = props
    e.preventDefault()
    downloadFile(path, fileName)
  }

  const { workPlan } = props

  let { limit, page, importData, rowError, configData, checkFileImport } = state

  if (workPlan.error.rowError !== undefined) {
    rowError = workPlan.error.rowError
    importData = workPlan.error.data
  }

  importData = importData.map((x) => {
    x = { ...x, type: translate(`human_resource.work_plan.${x.type}`) }
    return x
  })

  let exportData = configurationWorkPlan.templateImport(translate)

  return (
    <React.Fragment>
      <DialogModal
        modalID={`modal_import_file`}
        isLoading={false}
        formID={`form_import_file`}
        title={translate('human_resource.add_data_by_excel')}
        func={save}
        disableSubmit={!isFormValidated()}
        closeOnSave={false}
        size={75}
      >
        <form className='form-group' id={`form_import_file`}>
          {/* Cấu hình file import */}
          <ConFigImportFile
            id='import_salary_config'
            configData={configData}
            textareaRow={8}
            scrollTable={false}
            handleChangeConfig={handleChangeConfig}
          />
          <div className='row'>
            {/* Chọn file import */}
            <div className='form-group col-md-4 col-xs-12 col-sm-12'>
              <label>{translate('human_resource.choose_file')}</label>
              <ImportFileExcel configData={configData} handleImportExcel={handleImportExcel} />
            </div>

            {/* Dowload file import mẫu */}
            <div className='form-group pull-right col-md-4 col-xs-12 col-sm-12'>
              <ExportExcel
                id='download_template_salary'
                type='link'
                exportData={exportData}
                buttonName={` ${translate('human_resource.download_file')}`}
              />
            </div>

            {/* Hiện thị dữ liệu import */}
            <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
              <ShowImportData
                id='import_salary_show_data'
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
  const { workPlan } = state
  return { workPlan }
}

const actionCreators = {
  importWorkPlan: WorkPlanActions.importWorkPlan,
  downloadFile: AuthActions.downloadFile
}

const importExcel = connect(mapState, actionCreators)(withTranslate(WorkPlanImportForm))
export { importExcel as WorkPlanImportForm }
