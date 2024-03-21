import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal, DatePicker, ErrorLabel, UploadFile } from '../../../../../common-components'

function AddVersion(props) {
  const [state, setState] = useState({
    name: '',
    documentIssuingDate: '',
    documentEffectiveDate: '',
    documentExpiredDate: '',

    file: '',
    urlFile: '',
    fileUpload: '',

    fileScan: '',
    urlFileScan: '',
    fileScanUpload: ''
  })
  const handleChangeVersionName = (e) => {
    const value = e.target.value
    validateVersionName(value, true)
  }

  function handleUploadFile(value) {
    const { file, urlFile, fileUpload } = state
    if (value.length !== 0) {
      if (file !== value[0].fileName && urlFile !== value[0].urlFile && fileUpload !== value[0].fileUpload) {
        setState({
          ...state,
          file: value[0].fileName,
          urlFile: value[0].urlFile,
          fileUpload: value[0].fileUpload
        })
      }
    }
  }

  function handleUploadFileScan(value) {
    const { fileScan, urlFileScan, fileScanUpload } = state
    if (value.length !== 0) {
      if (fileScan !== value[0].fileName && urlFileScan !== value[0].urlFile && fileScanUpload !== value[0].fileUpload) {
        setState({
          ...state,
          fileScan: value[0].fileName,
          urlFileScan: value[0].urlFile,
          fileScanUpload: value[0].fileUpload
        })
      }
    }
  }
  const handleIssuingDate = (value) => {
    setState({
      ...state,
      documentIssuingDate: value
    })
  }

  const handleEffectiveDate = (value) => {
    setState({
      ...state,
      documentEffectiveDate: value
    })
  }

  const handleExpiredDate = (value) => {
    setState({
      ...state,
      documentExpiredDate: value
    })
  }
  const validateVersionName = (value, willUpdateState) => {
    let msg = undefined
    const { translate } = props
    if (!value) {
      msg = translate('document.doc_version.no_blank_version_name')
    }
    if (willUpdateState) {
      setState({
        ...state,
        versionName: value,
        errorVersionName: msg
      })
    }
    return msg === undefined
  }
  const isValidateFormAddVersion = () => {
    return validateVersionName(state.versionName, false)
  }

  const save = () => {
    if (isValidateFormAddVersion()) {
      return props.handleChange(state)
    }
  }

  const { translate } = props
  const { errorVersionName } = state
  return (
    <DialogModal
      modalID='sub-modal-add-document-new-version'
      formID='sub-form-add-document-new-version'
      title={translate('document.add_version')}
      disableSubmit={!isValidateFormAddVersion()}
      func={save}
    >
      <React.Fragment>
        <div className={`form-group ${!errorVersionName ? '' : 'has-error'}`}>
          <label>
            {translate('document.doc_version.name')}
            <span className='text-red'>*</span>
          </label>
          <input type='text' onChange={handleChangeVersionName} className='form-control' />
          <ErrorLabel content={errorVersionName} />
        </div>
        <div className='form-group'>
          <label>{translate('document.upload_file')}</label>
          <UploadFile multiple={true} onChange={handleUploadFile} />
        </div>
        <div className='form-group'>
          <label>{translate('document.upload_file_scan')}</label>
          <UploadFile multiple={true} onChange={handleUploadFileScan} />
        </div>
        <div className='form-group'>
          <label>{translate('document.doc_version.issuing_date')}</label>
          <DatePicker id={`document-add-version-issuing-date`} onChange={handleIssuingDate} />
        </div>
        <div className='form-group'>
          <label>{translate('document.doc_version.effective_date')}</label>
          <DatePicker id={`document-add-version-effective-date`} onChange={handleEffectiveDate} />
        </div>
        <div className='form-group'>
          <label>{translate('document.doc_version.expired_date')}</label>
          <DatePicker id={`document-add-version-expired-date`} onChange={handleExpiredDate} />
        </div>
      </React.Fragment>
    </DialogModal>
  )
}

const mapStateToProps = (state) => state

const addVersion = connect(mapStateToProps, null)(withTranslate(AddVersion))
export { addVersion as AddVersion }
