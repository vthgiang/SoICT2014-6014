import React, { useEffect, useState } from 'react'
import { exampleActions } from '../redux/actions'
import { connect } from 'react-redux'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import { DialogModal, ErrorLabel } from '../../../../common-components'
import ValidationHelper from '../../../../helpers/validationHelper'

const ExampleEditForm = (props) => {
  const { example, translate, exampleEdit } = props

  useEffect(() => {
    exampleEdit && props.getExampleDetail(exampleEdit)
  }, [props.exampleEdit])

  useEffect(() => {
    let currentDetailExample

    if (example.currentDetailExample) {
      currentDetailExample = example.currentDetailExample
    }
    if (currentDetailExample && !exampleName && !description) {
      setState({
        exampleName: currentDetailExample.exampleName,
        description: currentDetailExample.description
      })
    }
  })

  const [state, setState] = useState({
    exampleName: null,
    description: null
  })
  const { exampleName, description, exampleNameError } = state

  const isFormValidated = () => {
    let { translate } = props
    if (!ValidationHelper.validateName(translate, exampleName, 6, 255).status) {
      return false
    }
    return true
  }

  const save = () => {
    if (isFormValidated) {
      props.editExample(exampleEdit, { exampleName, description })
    }
  }

  const handleExampleName = (e) => {
    const { value } = e.target
    let { message } = ValidationHelper.validateName(translate, value, 6, 255)
    setState({
      exampleName: value,
      exampleNameError: message
    })
  }

  const handleExampleDescription = (e) => {
    const { value } = e.target
    setState({
      ...state,
      description: value
    })
  }

  return (
    <React.Fragment>
      <DialogModal
        modalID={`modal-edit-example`}
        isLoading={example.isLoading}
        formID={`form-edit-example`}
        title={translate('manage_example.edit_title')}
        disableSubmit={!isFormValidated()}
        func={save}
        size={50}
        maxWidth={500}
      >
        <form id={`form-edit-example`}>
          <div className={`form-group ${!exampleNameError ? '' : 'has-error'}`}>
            <label>
              {translate('manage_example.exampleName')}
              <span className='text-red'>*</span>
            </label>
            <input type='text' className='form-control' value={exampleName} onChange={handleExampleName} />
            <ErrorLabel content={exampleNameError} />
          </div>
          <div className={`form-group`}>
            <label>{translate('manage_example.example_description')}</label>
            <input type='text' className='form-control' value={description} onChange={handleExampleDescription}></input>
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  const example = state.example2
  return { example }
}

const mapDispatchToProps = {
  editExample: exampleActions.editExample,
  getExampleDetail: exampleActions.getExampleDetail
}

export default React.memo(connect(mapStateToProps, mapDispatchToProps)(withTranslate(ExampleEditForm)))
