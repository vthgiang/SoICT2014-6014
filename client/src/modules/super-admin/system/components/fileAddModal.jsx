import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DialogModal, ButtonModal, ErrorLabel, UploadFile } from '../../../../common-components'

import ValidationHelper from '../../../../helpers/validationHelper'
import { SystemActions, SystemSettingActions } from '../redux/actions'

function FileAddModal(props) {
  const [state, setState] = useState({
    description: '',
    file: '',
    urlFile: '',
    fileUpload: ''
  })

  const { translate } = props
  const { description, errorOnDiscFile } = state

  const handleChangeFile = (value) => {
    if (value.length !== 0) {
      setState({
        ...state,
        file: value[0].fileName,
        urlFile: value[0].urlFile,
        fileUpload: value[0].fileUpload
      })
    } else {
      setState({
        ...state,
        file: '',
        urlFile: '',
        fileUpload: ''
      })
    }
  }

  const handleDiscFileChange = (e) => {
    let { value } = e.target
    validateDiscFile(value, true)
  }

  const validateDiscFile = (value, willUpdateState = true) => {
    const { translate } = props
    let { message } = ValidationHelper.validateEmpty(translate, value)

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnDiscFile: message,
          description: value
        }
      })
    }
    return message === undefined
  }

  const isFormValidated = () => {
    const { description, file } = state
    return validateDiscFile(description, false) && file.match(/\.(zip)$/)
  }

  /** Bắt sự kiện submit form */
  const save = () => {
    if (isFormValidated()) {
      let formData = new FormData()
      formData.append('description', description)
      formData.append('files', state.fileUpload)
      return props.uploadBackupFiles(formData)
    }
  }

  return (
    <DialogModal
      size='50'
      modalID={`modal-create-file-super-admin-backup`}
      isLoading={false}
      formID={`form-create-file-backup`}
      title={translate('human_resource.profile.add_file')}
      func={save}
      disableSubmit={!isFormValidated()}
    >
      <form className='form-group' id={`form-create-file-backup`}>
        {/* Mô tả */}
        <div className={`form-group ${errorOnDiscFile && 'has-error'}`}>
          <label>
            {translate('table.description')}
            <span className='text-red'>*</span>
          </label>
          <input
            type='text'
            className='form-control'
            name='description'
            value={description}
            onChange={handleDiscFileChange}
            autoComplete='off'
          />
          <ErrorLabel content={errorOnDiscFile} />
        </div>
        {/* File đính kèm */}
        <div className='form-group'>
          <label htmlFor='file'>File backup upload (Dạng .zip)</label>
          <UploadFile onChange={handleChangeFile} />
        </div>
      </form>
    </DialogModal>
  )
}

const mapDispatchToProps = {
  uploadBackupFiles: SystemActions.uploadBackupFiles
}
const addModal = connect(null, mapDispatchToProps)(withTranslate(FileAddModal))
export { addModal as FileAddModal }
