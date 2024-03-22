import React, { useState } from 'react'
import { connect } from 'react-redux'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import { DialogModal, ImportFileExcel, ExportExcel, ShowImportData } from '../../../../common-components'
import { UserActions } from '../redux/actions'

const configData = {
  sheets: {
    description: 'Thông tin người dùng',
    value: ['Thông tin người dùng']
  },
  rowHeader: {
    description: 'Số tiêu đề của bảng',
    value: 1
  },
  name: {
    columnName: 'Tên',
    description: 'Tên người dùng',
    value: 'Tên'
  },
  email: {
    columnName: 'Email',
    description: 'Địa chỉ email',
    value: 'Email'
  },
  roles: {
    columnName: 'Phân quyền',
    description: 'Phân quyền được cấp cho người dùng',
    value: 'Phân quyền'
  }
}

const dataImportTemplate = (listRole) => {
  let role,
    data = []
  if (listRole && listRole.list) {
    role = listRole.list
    role.forEach((x, index) => {
      data.push({ STT: index + 1, name: x.name })
    })
  }

  return {
    fileName: 'Thông tin người dùng',
    dataSheets: [
      {
        sheetName: 'Thông tin người dùng',
        sheetTitle: 'Thông tin người dùng',
        tables: [
          {
            columns: [
              { key: 'name', value: 'Tên' },
              { key: 'email', value: 'Email' },
              { key: 'roles', value: 'Phân quyền' }
            ],
            data: [
              {
                name: 'Nguyễn Văn A',
                email: 'nva_.vnist@gmail.com',
                roles: 'Employee'
              }
            ]
          }
        ]
      },

      {
        sheetName: 'Thông tin các phân quyền',
        sheetTitle: 'Thông tin các phân quyền',
        tables: [
          {
            columns: [
              { key: 'STT', value: 'Số thứ tự' },
              { key: 'name', value: 'Tên phân quyền' }
            ],
            data: data
          }
        ]
      }
    ]
  }
}

const ModalImportUser = ({ user, role, translate, importUsers, limit = 10 }) => {
  const [state, setState] = useState({
    limit: 100,
    page: 0
  })

  const _importUser = () => {
    const { valueImport } = state
    let params = { limit }
    importUsers({ data: valueImport }, params)
  }

  const _getDataImportUser = (roles) => {
    if (roles) {
      let userRoles = roles.split(',')
      let listRoles = role?.list ? role.list : []
      let data = []

      if (userRoles) {
        for (let k = 0; k < userRoles.length; k++) {
          let findRoleId = listRoles.find((e) => e?.name?.trim()?.toLowerCase() === userRoles[k]?.trim()?.toLowerCase())
          if (findRoleId) {
            data = [...data, findRoleId._id]
          } else {
            data = [...data, -1]
          }
        }
      }
      return data
    }
  }

  const _handleImport = (value, checkFileImport) => {
    console.log('value', value)
    let valueImport = [],
      showValueImport = [],
      rowError = [],
      data = []
    if (value?.length) {
      value.forEach((x, index) => {
        let errorAlert = []
        let userRoles = x?.roles ? _getDataImportUser(x.roles) : []

        if (
          x?.name === null ||
          x?.email === null ||
          (x.roles && (_getDataImportUser(x.roles) === -1 || _getDataImportUser(x.roles).indexOf(-1) !== -1))
        ) {
          rowError = [...rowError, index + 1]
          x = { ...x, error: true }
        }

        if (x?.name === null) {
          errorAlert = [...errorAlert, 'Tên phân quyền không được để trống']
        }

        if (x?.email === null) {
          errorAlert = [...errorAlert, 'Email người dùng không được để trống']
        }

        if (x.roles && (_getDataImportUser(x.roles) === -1 || _getDataImportUser(x.roles).indexOf(-1) !== -1)) {
          errorAlert = [...errorAlert, 'Tên phân quyền không hợp lệ']
        }

        valueImport = [
          ...valueImport,
          {
            name: x?.name,
            email: x?.email,
            roles: userRoles
          }
        ]

        showValueImport = [...showValueImport, x]
      })
    }

    setState({
      ...state,
      showValueImport: showValueImport,
      valueImport: valueImport,
      rowError: rowError
    })
  }

  console.log('error', state)
  return (
    <DialogModal
      modalID='modal-import-user'
      isLoading={user.isLoading}
      formID='form-import-user'
      title={translate('manage_user.import_title')}
      func={_importUser}
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
              id='downloadTemplateImport-user'
              buttonName={translate('human_resource.download_file')}
              exportData={dataImportTemplate(role)}
              style={{ marginLeft: '10px' }}
            />
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col-md-12 col-xs-12'>
          <ShowImportData
            id={`import_roles`}
            configData={configData}
            importData={state.showValueImport}
            rowError={state.rowError}
            scrollTable={true}
            checkFileImport={true}
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
    user: state.user,
    role: state.role
  }
}

const mapDispatchToProps = {
  importUsers: UserActions.importUsers
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ModalImportUser))
