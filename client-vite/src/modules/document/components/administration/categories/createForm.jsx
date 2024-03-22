import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal, ErrorLabel } from '../../../../../common-components'
import { DocumentActions } from '../../../redux/actions'
import { CategoryImportForm } from './categoryImportForm'
import ValidationHelper from '../../../../../helpers/validationHelper'

function CreateForm(props) {
  const [state, setState] = useState({})
  const handleSelect = (value) => {
    setState({
      ...state,
      value
    })
  }

  const handleName = (e) => {
    const value = e.target.value
    const { translate } = props
    const { message } = ValidationHelper.validateName(translate, value, 1, 255)
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

  const isFormValidated = () => {
    const { name } = state
    const { translate } = props
    if (!ValidationHelper.validateName(translate, name, 1, 255).status) return false
    return true
  }

  const handleAddCategory = () => {
    window.$('#modal-create-document-type').modal('show')
  }

  const handImportFile = () => {
    window.$('#modal-import-file-category').modal('show')
  }

  const save = () => {
    if (isFormValidated()) {
      const { name, description } = state
      props.createDocumentCategory({
        name,
        description
      })
    }
  }

  const { translate } = props
  const { nameError } = state
  return (
    <React.Fragment>
      <CategoryImportForm />
      <div className='form-inline'>
        <div className='dropdown pull-right' style={{ marginBottom: 15 }}>
          <button
            type='button'
            className='btn btn-success dropdown-toggler pull-right'
            data-toggle='dropdown'
            aria-expanded='true'
            title={translate('document.add')}
          >
            {translate('general.add')}
          </button>
          <ul className='dropdown-menu pull-right'>
            <li>
              <a
                href='#modal-create-document-type'
                title='ImportForm'
                onClick={(event) => {
                  handleAddCategory(event)
                }}
              >
                {translate('document.add')}
              </a>
            </li>
            <li>
              <a
                href='#modal_import_file_category'
                title='ImportForm'
                onClick={(event) => {
                  handImportFile(event)
                }}
              >
                {translate('document.import')}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <DialogModal
        modalID='modal-create-document-type'
        formID='form-create-document-type'
        title={translate('document.administration.categories.add')}
        func={save}
        disableSubmit={!isFormValidated()}
      >
        <form id='form-create-document-type'>
          <div className={`form-group ${nameError === undefined ? '' : 'has-error'}`}>
            <label>
              {translate('document.administration.categories.name')}
              <span className='text-red'>*</span>
            </label>
            <input type='text' className='form-control' onChange={handleName} placeholder={translate('document.category_example')} />
            <ErrorLabel content={nameError} />
          </div>
          <div className='form-group'>
            <label>{translate('document.administration.categories.description')}</label>
            <textarea type='text' className='form-control' onChange={handleDescription} />
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {
  createDocumentCategory: DocumentActions.createDocumentCategory
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateForm))
