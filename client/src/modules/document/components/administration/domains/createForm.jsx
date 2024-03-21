import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DialogModal, ErrorLabel, TreeSelect } from '../../../../../common-components'
import { DocumentActions } from '../../../redux/actions'
import ValidationHelper from '../../../../../helpers/validationHelper'
function CreateForm(props) {
  const [state, setState] = useState({})
  const handleName = (e) => {
    const value = e.target.value
    const { translate } = props
    const { message } = ValidationHelper.validateName(translate, value)
    setState({
      ...state,
      name: value,
      nameError: message
    })
  }

  const handleDescription = (e) => {
    const value = e.target.value
    setState({
      ...state,
      description: value
    })
  }

  const handleParent = (value) => {
    setState({
      ...state,
      domainParent: value[0]
    })
  }

  const isValidateForm = () => {
    const { name, description } = state
    const { translate } = props
    if (!ValidationHelper.validateName(translate, name)) return false
    return true
  }

  const save = () => {
    const { name, description, domainParent } = state
    props.createDocumentDomain({
      name,
      description,
      parent: domainParent
    })
  }

  const { translate, documents } = props
  const { list } = documents.administration.domains
  const { nameError, domainParent } = state
  return (
    <React.Fragment>
      <DialogModal
        modalID='modal-create-document-domain'
        formID='form-create-document-domain'
        title={translate('document.administration.domains.add')}
        disableSubmit={!isValidateForm()}
        func={save}
      >
        <form id='form-create-document-domain'>
          <div className={`form-group ${!nameError ? '' : 'has-error'}`}>
            <label>
              {translate('document.administration.domains.name')}
              <span className='text-red'>*</span>
            </label>
            <input type='text' className='form-control' onChange={handleName} />
            <ErrorLabel content={nameError} />
          </div>
          <div className='form-group'>
            <label>{translate('document.administration.domains.parent')}</label>
            <TreeSelect data={list} value={domainParent} handleChange={handleParent} mode='radioSelect' />
          </div>
          <div className='form-group'>
            <label>{translate('document.administration.domains.description')}</label>
            <textarea style={{ minHeight: '100px' }} type='text' className='form-control' onChange={handleDescription} />
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {
  createDocumentDomain: DocumentActions.createDocumentDomain
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateForm))
