import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DialogModal, ErrorLabel, TreeSelect } from '../../../../../common-components'
import { DocumentActions } from '../../../redux/actions'
import ValidationHelper from '../../../../../helpers/validationHelper'
function CreateForm(props) {
  const [state, setState] = useState({
    archiveParent: ''
  })
  const handleName = (e) => {
    const { value } = e.target
    const { translate } = props
    const { message } = ValidationHelper.validateName(translate, value, 1, 255)
    setState({
      ...state,
      name: value,
      nameError: message
    })
  }

  const handleDescription = (e) => {
    const { value } = e.target
    setState({
      ...state,
      description: value
    })
  }

  const handleParent = (value) => {
    setState({
      ...state,
      archiveParent: value[0]
    })
  }

  const isValidateForm = () => {
    let { name } = state
    let { translate } = props
    if (!ValidationHelper.validateName(translate, name, 1, 255).status) return false
    return true
  }

  const save = () => {
    const data = {
      name: state.name,
      description: state.description,
      parent: state.archiveParent
    }
    props.createDocumentArchive(data)
  }

  const { translate, documents } = props
  const { list } = documents.administration.archives
  let { archiveParent, nameError } = state
  return (
    <React.Fragment>
      <DialogModal
        modalID='modal-create-document-archive'
        formID='form-create-document-archive'
        title='Thêm mục lưu trữ'
        disableSubmit={!isValidateForm()}
        func={save}
      >
        <form id='form-create-document-archive'>
          <div className={`form-group ${!nameError ? '' : 'has-error'}`}>
            <label>
              {translate('document.administration.archives.name')}
              <span className='text-red'>*</span>
            </label>
            <input type='text' className='form-control' onChange={handleName} />
            <ErrorLabel content={nameError} />
          </div>
          <div className='form-group'>
            <label>{translate('document.administration.archives.parent')}</label>
            <TreeSelect data={list} value={archiveParent} handleChange={handleParent} mode='radioSelect' />
          </div>
          <div className='form-group'>
            <label>{translate('document.administration.archives.description')}</label>
            <textarea style={{ minHeight: '100px' }} type='text' className='form-control' onChange={handleDescription} />
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {
  createDocumentArchive: DocumentActions.createDocumentArchive
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateForm))
