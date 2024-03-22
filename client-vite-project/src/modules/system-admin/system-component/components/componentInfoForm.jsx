import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { SystemComponentActions } from '../redux/actions'
import ValidationHelper from '../../../../helpers/validationHelper'
import { DialogModal, ErrorLabel, SelectBox } from '../../../../common-components'

function ComponentInfoForm(props) {
  const [state, setState] = useState({})

  // Thiet lap cac gia tri tu props vao state
  useEffect(() => {
    if (props.componentId !== state.componentId) {
      setState({
        ...state,
        componentId: props.componentId,
        componentName: props.componentName,
        componentDescription: props.componentDescription,
        componentRoles: props.componentRoles,
        componentLink: props.componentLink,
        componentNameError: undefined,
        componentDescriptionError: undefined
      })
    }
  }, [props.componentId])

  const handleName = (e) => {
    let { value } = e.target
    let { translate } = props
    let { message } = ValidationHelper.validateName(translate, value, 6, 255)
    setState({
      ...state,
      componentName: value,
      componentNameError: message
    })
  }

  const handleDescription = (e) => {
    let { value } = e.target
    let { translate } = props
    let { message } = ValidationHelper.validateDescription(translate, value)
    setState({
      ...state,
      componentDescription: value,
      componentDescriptionError: message
    })
  }

  const handleLink = (value) => {
    setState({
      ...state,
      componentLink: value
    })
  }

  const handleRoles = (value) => {
    setState({
      ...state,
      componentRoles: value
    })
  }

  const isFormValidated = () => {
    let { componentName, componentDescription } = state
    let { translate } = props
    if (
      !ValidationHelper.validateName(translate, componentName).status ||
      !ValidationHelper.validateDescription(translate, componentDescription).status
    )
      return false
    return true
  }

  const save = () => {
    const component = {
      name: state.componentName,
      description: state.componentDescription,
      links: state.componentLink,
      roles: state.componentRoles
    }

    if (isFormValidated()) return props.editSystemComponent(state.componentId, component)
  }

  const { translate, systemLinks, rootRoles } = props
  const { componentId, componentName, componentDescription, componentLink, componentRoles, componentNameError, componentDescriptionError } =
    state

  return (
    <React.Fragment>
      <DialogModal
        func={save}
        modalID='modal-edit-component-default'
        formID='form-edit-component-default'
        title={translate('manage_component.edit')}
        disableSubmit={!isFormValidated()}
      >
        <form id='form-edit-component-default'>
          <div className={`form-group ${componentNameError === undefined ? '' : 'has-error'}`}>
            <label>
              {translate('manage_component.name')}
              <span className='text-red'> * </span>
            </label>
            <input type='text' className='form-control' value={componentName} onChange={handleName} />
            <ErrorLabel content={componentNameError} />
          </div>
          <div className={`form-group ${componentDescriptionError === undefined ? '' : 'has-error'}`}>
            <label>
              {translate('manage_component.description')}
              <span className='text-red'> * </span>
            </label>
            <input type='text' className='form-control' value={componentDescription} onChange={handleDescription} />
            <ErrorLabel content={componentDescriptionError} />
          </div>
          <div className='form-group'>
            <label>{translate('manage_component.link')}</label>
            <SelectBox
              id={`select-component-default-link-${componentId}`}
              className='form-control select2'
              style={{ width: '100%' }}
              items={systemLinks.list.map((link) => {
                return { value: link._id, text: link.url }
              })}
              options={{ placeholder: translate('system_admin.system_component.select_link') }}
              onChange={handleLink}
              value={componentLink}
              multiple={true}
            />
          </div>
          <div className='form-group'>
            <label>{translate('manage_component.roles')}</label>
            <SelectBox
              id={`select-component-default-roles-${componentId}`}
              className='form-control select2'
              style={{ width: '100%' }}
              items={rootRoles.list.map((role) => {
                return { value: role._id, text: role.name }
              })}
              onChange={handleRoles}
              value={componentRoles}
              multiple={true}
            />
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

function mapState(state) {
  const { systemLinks, rootRoles } = state
  return { systemLinks, rootRoles }
}
const actions = {
  editSystemComponent: SystemComponentActions.editSystemComponent
}

const connectedComponentInfoForm = connect(mapState, actions)(withTranslate(ComponentInfoForm))
export { connectedComponentInfoForm as ComponentInfoForm }
