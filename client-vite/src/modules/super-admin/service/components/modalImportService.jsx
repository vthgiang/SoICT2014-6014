import React, { useState } from 'react'
import { connect } from 'react-redux'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import { DialogModal, ImportFileExcel, ExportExcel, ShowImportData } from '../../../../common-components'
import { ServiceActions } from '../redux/actions'

const configData = {
  sheets: {
    description: 'Thông tin dịch vụ',
    value: ['Thông tin dịch vụ']
  },
  rowHeader: {
    description: 'Số tiêu đề của bảng',
    value: 1
  },
  name: {
    columnName: 'Tên',
    description: 'Tên dịch vụ',
    value: 'Tên'
  },
  email: {
    columnName: 'Email',
    description: 'Địa chỉ email',
    value: 'Email'
  },
  password: {
    columnName: 'Mật khẩu',
    description: 'Mật khẩu',
    value: 'Mật khẩu'
  }
}

const dataImportTemplate = () => {
  return {
    fileName: 'Thông tin dịch vụ',
    dataSheets: [
      {
        sheetName: 'Thông tin dịch vụ',
        sheetTitle: 'Thông tin dịch vụ',
        tables: [
          {
            columns: [
              { key: 'name', value: 'Tên' },
              { key: 'email', value: 'Email' },
              { key: 'password', value: 'Mật khẩu' }
            ],
            data: [
              {
                name: 'Service ABC',
                email: 'abc.service.vnist@gmail.com',
                password: 'vnist123@'
              }
            ]
          }
        ]
      }
    ]
  }
}

function ModalImportService({ service, role, translate, importServices, limit = 10 }) {
  const [state, setState] = useState({
    limit: 100,
    page: 0
  })

  const _importService = () => {
    const { valueImport } = state
    const params = { limit }
    importServices({ data: valueImport }, params)
  }

  const _handleImport = (value, checkFileImport) => {
    let valueImport = []
    let showValueImport = []
    let rowError = []
    if (value?.length) {
      value.forEach((x, index) => {
        let errorAlert = []

        if (x?.name === null || x?.email === null) {
          rowError = [...rowError, index + 1]
          x = { ...x, error: true }
        }

        if (x?.name === null) {
          errorAlert = [...errorAlert, 'Tên phân quyền không được để trống']
        }

        if (x?.email === null) {
          errorAlert = [...errorAlert, 'Email dịch vụ không được để trống']
        }

        valueImport = [
          ...valueImport,
          {
            name: x?.name,
            email: x?.email,
            password: x.password
          }
        ]

        showValueImport = [...showValueImport, x]
      })
    }

    setState({
      ...state,
      showValueImport,
      valueImport,
      rowError
    })
  }

  return (
    <DialogModal
      modalID='modal-import-service'
      isLoading={service.isLoading}
      formID='form-import-service'
      title={translate('manage_service.import_title')}
      func={_importService}
      size={75}
    >
      <div className='row' style={{ display: 'flex', alignItems: 'center' }}>
        <div className='col-md-6'>
          <ImportFileExcel configData={configData} handleImportExcel={_handleImport} />
        </div>
        <div className='col-md-6'>
          <div className='form-group'>
            <ExportExcel
              type='link'
              id='downloadTemplateImport-service'
              buttonName={translate('human_resource.download_file')}
              exportData={dataImportTemplate()}
              style={{ marginLeft: '10px' }}
            />
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col-md-12 col-xs-12'>
          <ShowImportData
            id='import_roles'
            configData={configData}
            importData={state.showValueImport}
            rowError={state.rowError}
            scrollTable
            checkFileImport
            limit={state.limit}
            page={state.page}
          />
        </div>
      </div>
    </DialogModal>
  )
}

const mapStateToProps = (state) => {
  return {
    service: state.service
  }
}

const mapDispatchToProps = {
  importServices: ServiceActions.importServices
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ModalImportService))
