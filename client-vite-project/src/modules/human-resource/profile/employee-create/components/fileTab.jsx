import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { FileAddModal, FileEditModal } from './combinedContent'

import { AuthActions } from '../../../../auth/redux/actions'

function FileTab(props) {
  const [state, setState] = useState({})

  /** Hàm tiện ích so sánh 2 đồi tượng */
  const isEqual = (objA, objB) => {
    if (!objA || !objB) {
      return false
    }
    // Tạo các mảng chứa tên các property
    let aProps = Object.getOwnPropertyNames(objA)
    let bProps = Object.getOwnPropertyNames(objB)

    if (aProps.length !== bProps.length) {
      return false
    }
    for (let i = 0; i < aProps.length; i++) {
      let propName = aProps[i]
      if (objA[propName] !== objB[propName]) {
        return false
      }
    }
    return true
  }

  useEffect(() => {
    if (!isEqual(props.employee, state.employee)) {
      setState((state) => {
        return {
          ...state,
          id: props.id,
          files: props.files,
          archivedRecordNumber: props.employee?.archivedRecordNumber ? props.employee.archivedRecordNumber : '',
          employee: props.employee
        }
      })
    }
  }, [props.id, props.employee])

  const { translate } = props

  const { id } = props

  const { files, archivedRecordNumber, currentRow } = state

  /**
   * Bắt sự kiện click edit tài liệu đính kèm
   * @param {*} value : Tài liệu đính kèm cần chỉnh sửa
   * @param {*} index : Số thứ tự tài liệu đính kèm cần chỉnh sửa
   */
  const handleEdit = async (value, index) => {
    await setState((state) => {
      return {
        ...state,
        currentRow: { ...value, index: index }
      }
    })
    window.$(`#modal-edit-file-editFile${index}`).modal('show')
  }

  /** Function lưu các trường thông tin vào state */
  const handleChange = (e) => {
    const { name, value } = e.target
    props.handleChange(name, value)
  }

  /** Function thêm tài liệu đính kèm mặc định */
  const defaulteClick = async (e) => {
    let { translate } = props
    e.preventDefault()
    const defaulteFile = [
      {
        name: translate('human_resource.profile.diploma'),
        description: translate('human_resource.profile.disc_diploma'),
        number: '1',
        status: 'submitted',
        file: '',
        urlFile: '',
        fileUpload: ''
      },
      {
        name: translate('human_resource.profile.curriculum_vitae'),
        description: translate('human_resource.profile.disc_curriculum_vitae'),
        number: '1',
        status: 'submitted',
        file: '',
        urlFile: '',
        fileUpload: ''
      },
      {
        name: translate('human_resource.profile.img'),
        description: translate('human_resource.profile.disc_img'),
        number: '3',
        status: 'submitted',
        file: '',
        urlFile: '',
        fileUpload: ''
      },
      {
        name: translate('human_resource.profile.copy_id_card'),
        description: translate('human_resource.profile.disc_copy_id_card'),
        number: '1',
        status: 'submitted',
        file: '',
        urlFile: '',
        fileUpload: ''
      },
      {
        name: translate('human_resource.profile.health_certificate'),
        description: translate('human_resource.profile.disc_health_certificate'),
        number: '1',
        status: 'submitted',
        file: '',
        urlFile: '',
        fileUpload: ''
      },
      {
        name: translate('human_resource.profile.birth_certificate'),
        description: translate('human_resource.profile.disc_birth_certificate'),
        number: '1',
        status: 'submitted',
        file: '',
        urlFile: '',
        fileUpload: ''
      },
      {
        name: translate('human_resource.profile.job_application'),
        description: translate('human_resource.profile.disc_job_application'),
        number: '1',
        status: 'submitted',
        file: '',
        urlFile: '',
        fileUpload: ''
      },
      {
        name: translate('human_resource.profile.commitment'),
        description: translate('human_resource.profile.disc_commitment'),
        number: '1',
        status: 'submitted',
        file: '',
        urlFile: '',
        fileUpload: ''
      },
      {
        name: translate('human_resource.profile.temporary_residence_card'),
        description: translate('human_resource.profile.disc_temporary_residence_card'),
        number: '1',
        status: 'submitted',
        file: '',
        urlFile: '',
        fileUpload: ''
      },
      {
        name: translate('human_resource.profile.registration_book'),
        description: translate('human_resource.profile.registration_book'),
        number: '1',
        status: 'submitted',
        file: '',
        urlFile: '',
        fileUpload: ''
      }
    ]

    await setState({
      ...state,
      files: [...state.files, ...defaulteFile]
    })
    props.handleAddFile([...state.files, ...defaulteFile])
  }

  /**
   * Function thêm thông tin tài liệu đính kèm
   * @param {*} data : Dữ liệu thông tin tài liệu đính kèm cần thêm
   */
  const handleAddFile = async (data) => {
    const { files } = state
    await setState({
      ...state,
      files: [
        ...files,
        {
          ...data
        }
      ]
    })
    props.handleAddFile(
      [
        ...files,
        {
          ...data
        }
      ],
      data
    )
  }

  /**
   * Function chỉnh sửa thông tin tài liệu đính kèm
   * @param {*} data : Dữ liệu thông tin tài liệu đính kèm cần chỉnh sửa
   */
  const handleEditFile = async (data) => {
    const { files } = state
    files[data.index] = data
    await setState({
      ...state,
      files: files
    })
    props.handleEditFile(files, data)
  }

  /**
   * Function xoá kinh nghiệm làm việc
   * @param {*} index : Số thứ tự kinh nghiệm làm việc muốn xoá
   */
  const handleDeleteFile = async (index) => {
    let { files } = state
    let data = files[index]
    files.splice(index, 1)
    await setState({
      ...state,
      files: [...files]
    })
    props.handleDeleteFile([...files], data)
  }

  /** Function kiểm tra các trường bắt buộc phải nhập */
  const validatorInput = (value) => {
    if (value && value.toString().trim() !== '') {
      return true
    }
    return false
  }

  /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form */
  const isFormValidated = () => {
    const { employee } = state
    let result = validatorInput(employee?.employeeNumber) && validatorInput(employee?.fullName)

    if (employee?.healthInsuranceStartDate && employee?.healthInsuranceEndDate) {
      if (new Date(employee?.healthInsuranceEndDate).getTime() < new Date(employee?.healthInsuranceStartDate).getTime()) {
        return false
      }
    } else if (
      (employee?.healthInsuranceStartDate && !employee?.healthInsuranceEndDate) ||
      (!employee?.healthInsuranceStartDate && employee?.healthInsuranceEndDate)
    ) {
      return false
    }
    if (employee?.leavingDate && employee?.startingDate) {
      if (new Date(employee?.leavingDate).getTime() < new Date(employee?.startingDate).getTime()) {
        return false
      }
    } else if (employee?.leavingDate && !employee?.startingDate) {
      return false
    }
    return result
  }

  /**
   * Function dowload file
   * @param {*} e
   * @param {*} path : Đường dẫn file
   * @param {*} fileName : Tên file dùng để lưu
   */
  const requestDownloadFile = (e, path, fileName) => {
    e.preventDefault()
    props.downloadFile(path, fileName)
  }

  return (
    <div id={id} className='tab-pane'>
      <div className=' row box-body'>
        {/* Nơi lưu trữ bảng cứng */}
        <div className='col-md-4'>
          <div className='form-group'>
            <label>{translate('human_resource.profile.attachments_code')}</label>
            <input
              type='text'
              className='form-control'
              name='archivedRecordNumber'
              value={archivedRecordNumber ? archivedRecordNumber : ''}
              onChange={handleChange}
              placeholder={translate('human_resource.profile.attachments_code')}
              autoComplete='off'
            />
          </div>
        </div>
        {/* Danh sách tài liệu đính kèm */}
        <div className='col-md-12'>
          <h4 className='row col-md-6 col-xs-8'>{translate('human_resource.profile.list_attachments')}:</h4>
          <FileAddModal handleChange={handleAddFile} id={`addFile${id}`} />
          <button
            style={{ marginTop: 2, marginBottom: 10, marginRight: 15 }}
            type='submit'
            className='btn btn-primary pull-right'
            onClick={defaulteClick}
            title={translate('human_resource.profile.add_default_title')}
          >
            {translate('human_resource.profile.add_default')}
          </button>
          <table className='table table-striped table-bordered table-hover' style={{ marginBottom: 0 }}>
            <thead>
              <tr>
                <th>{translate('human_resource.profile.file_name')}</th>
                <th>{translate('table.description')}</th>
                <th>{translate('human_resource.profile.number')}</th>
                <th>{translate('table.status')}</th>
                <th>{translate('human_resource.profile.attached_files')}</th>
                <th style={{ width: '120px' }}>{translate('general.action')}</th>
              </tr>
            </thead>
            <tbody>
              {files &&
                files.length !== 0 &&
                files.map((x, index) => {
                  return (
                    <tr key={index}>
                      <td>{x.name}</td>
                      <td>{x.description}</td>
                      <td>{x.number}</td>
                      <td>{translate(`human_resource.profile.${x.status}`)}</td>
                      <td>
                        {!x.urlFile ? (
                          translate('human_resource.profile.no_files')
                        ) : (
                          <a
                            className='intable'
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => requestDownloadFile(e, `.${x.urlFile}`, x.name)}
                          >
                            <i className='fa fa-download'> &nbsp;Download!</i>
                          </a>
                        )}
                      </td>
                      <td>
                        <a
                          onClick={() => handleEdit(x, index)}
                          className='edit text-yellow'
                          style={{ width: '5px', cursor: 'pointer' }}
                          title={translate('human_resource.profile.edit_file')}
                        >
                          <i className='material-icons'>edit</i>
                        </a>
                        <a
                          className='delete'
                          title='Delete'
                          data-toggle='tooltip'
                          onClick={() => handleDeleteFile(index)}
                          style={{ cursor: 'pointer' }}
                        >
                          <i className='material-icons'></i>
                        </a>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
          {(!files || files.length === 0) && <div className='table-info-panel'>{translate('confirm.no_data')}</div>}
        </div>
      </div>
      {id === 'pageAttachments' && (
        <div className=' box-footer'>
          <button
            type='reset'
            disabled={!isFormValidated()}
            className='btn btn-success col-md-2 pull-right btnuser'
            onClick={() => props.handleSubmit()}
          >
            {translate('human_resource.profile.add_staff')}
          </button>
        </div>
      )}

      {
        /** Form chỉnh sửa tài liệu đính kèm*/
        currentRow && (
          <FileEditModal
            id={`editFile${currentRow.index}`}
            _id={currentRow._id}
            index={currentRow.index}
            name={currentRow.name}
            description={currentRow.description}
            number={currentRow.number}
            status={currentRow.status}
            file={currentRow.file}
            urlFile={currentRow.urlFile}
            fileUpload={currentRow.fileUpload}
            handleChange={handleEditFile}
          />
        )
      }
    </div>
  )
}

const actionCreators = {
  downloadFile: AuthActions.downloadFile
}

const fileTab = connect(null, actionCreators)(withTranslate(FileTab))
export { fileTab as FileTab }
