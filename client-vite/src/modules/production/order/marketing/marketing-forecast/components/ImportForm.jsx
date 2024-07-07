import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

// import { exampleActions } from '../redux/actions'
import { sendRequest } from '../../../../../../helpers/requestHelper'

import { ShowImportData, ConFigImportFile, ImportFileExcel, DialogModal, ExportExcel } from '../../../../../../common-components/index'

import { configurationExampleTemplate, importExampleTemplate } from '../components/fileConfigurationImportExample'

import { toast } from 'react-toastify'
import ServerResponseAlert from '../../../../../alert/components/serverResponseAlert'

function ImportForm(props) {
  const [state, setState] = useState({
    id: 'import_file_example',
    importData: undefined,
    rowError: [],
    configData: undefined,
    checkFileImport: undefined
  })

  const { importData, rowError, configData, checkFileImport, id } = state
  const { translate, page, perPage, setStateTableData } = props // Props from parent

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

        // if (!item.exampleName) {
        //   rowError = [...rowError, index + 1]
        //   item = { ...item, error: true }
        // }

        // if (!item.exampleName) {
        //   errorAlert = [...errorAlert, 'Tên ví dụ không được bỏ trống']
        // }

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

  const save = async () => {
    // if (isFormValidated()) {
    //   importData && props.createExample(importData)
    //   importData &&
    //     props.getExamples({
    //       exampleName: '',
    //       page: page,
    //       perPage: perPage
    //     })
    // }
    // console.log(importData);
    if (isFormValidated() && importData) {
      const response = await sendRequest(
        {
          url: `${process.env.REACT_APP_SERVER}/crm/customers/forecast`,
          method: 'POST',
          data: importData
        },
        false,
        false,
        'customersForecast'
      )
      if (response.status === 200) {
        setState({
          ...state,
          id: 'import_file_example',
          importData: undefined,
          rowError: [],
        })
        toast.success(<ServerResponseAlert type='success' title='general.success' content={['Lưu thành công']} />, {
          containerId: 'toast-notification'
        })
        setStateTableData({...state, importData: response.data?.content})
      } else {
        toast.error(<ServerResponseAlert type='error' title='general.error' content={['Lưu thất bại, hãy thử lại']} />, {
          containerId: 'toast-notification'
        })
      }
    }

    // if (response.status === 201) {
    //   // setName('');
    //   // setCost('');
    //   // setChannel('Facebook');
    //   // fetchMarketingCampaign();
    // }
    // setOpenAddCampaign(false)
  }

  return (
    <React.Fragment>
      <DialogModal
        modalID={`modal-import-file-hooks`}
        isLoading={false}
        formID={`form-import-file-example-hooks`}
        title={translate('human_resource.add_data_by_excel')}
        func={save}
        disableSubmit={!isFormValidated()}
        size='100'
      >
        <form className='form-group' id={`form-import-file-example-hooks`}>
          <div className='col-md-12 col-xs-12'>
            <ConFigImportFile
              id={`import_asset_config${id}`}
              scrollTable={false}
              configData={configData ? configData : configurationExampleTemplate}
              handleChangeConfig={handleChangeConfig}
            />
          </div>
          <div className='row'>
            <div className='col-md-4 col-xs-12'>
              <label>{translate('human_resource.choose_file')}</label>
              <ImportFileExcel
                id={'file-import-example'}
                configData={configData ? configData : configurationExampleTemplate}
                handleImportExcel={handleImportExcel}
              />
            </div>
            <div className='col-md-8 col-xs-12'>
              <label></label>
              <ExportExcel
                id='download_template_example'
                type='link'
                exportData={importExampleTemplate}
                buttonName='Download file import mẫu'
              />
            </div>
          </div>
          <div className='col-md-12 col-xs-12'>
            <ShowImportData
              id={`import_asset_show_data${id}`}
              configData={configData ? configData : configurationExampleTemplate}
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

// const actions = {
//   createExample: exampleActions.createExample,
//   getExamples: exampleActions.getExamples
// }

const mapState = (state) => {
  const { department, createEmployeeKpiSet, user, createKpiUnit, auth } = state
  return { department, createEmployeeKpiSet, user, createKpiUnit, auth }
}

const connectedImportForm = connect(mapState)(withTranslate(ImportForm))
export { connectedImportForm as ImportForm }