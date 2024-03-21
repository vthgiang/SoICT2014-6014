import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { ErrorLabel, TreeSelect } from '../../../../../common-components'
import { DocumentActions } from '../../../redux/actions'
import ValidationHelper from '../../../../../helpers/validationHelper'

function EditForm(props) {
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
    if (!ValidationHelper.validateName(translate, name).status) return false
    return true
  }

  const save = () => {
    const { domainId, name, description, domainParent } = state
    if (isValidateForm())
      props.editDocumentDomain(domainId, {
        name,
        description,
        parent: domainParent
      })
  }
  useEffect(() => {
    setState({
      ...state,
      domainId: props.domainId,
      name: props.domainName,
      description: props.domainDescription,
      domainParent: props.domainParent,
      nameError: undefined,
      descriptionError: undefined
    })
  }, [props.domainId])

  const { translate, documents } = props
  const { list } = documents.administration.domains
  const { unChooseNode } = props
  const { name, description, domainParent, nameError } = state
  let listDomain = []
  for (let i in list) {
    if (!unChooseNode.includes(list[i].id)) {
      listDomain.push(list[i])
    }
  }
  const disabled = !isValidateForm()

  return (
    <div id='edit-document-domain'>
      <div className={`form-group ${nameError === undefined ? '' : 'has-error'}`}>
        <label>
          {translate('document.administration.domains.name')}
          <span className='text-red'>*</span>
        </label>
        <input type='text' className='form-control' onChange={handleName} value={name || false} />
        <ErrorLabel content={nameError} />
      </div>
      <div className='form-group'>
        <label>{translate('document.administration.domains.parent')}</label>
        <TreeSelect data={listDomain} value={[domainParent]} handleChange={handleParent} mode='radioSelect' />
      </div>
      <div className='form-group'>
        <label>{translate('document.administration.domains.description')}</label>
        <textarea style={{ minHeight: '120px' }} type='text' className='form-control' onChange={handleDescription} value={description} />
      </div>
      <div className='form-group'>
        <button className='btn btn-success pull-right' style={{ marginLeft: '5px' }} disabled={disabled} onClick={save}>
          {translate('form.save')}
        </button>
        <button
          className='btn btn-danger'
          onClick={() => {
            window.$(`#edit-document-domain`).slideUp()
          }}
        >
          {translate('form.close')}
        </button>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {
  editDocumentDomain: DocumentActions.editDocumentDomain
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(EditForm))
