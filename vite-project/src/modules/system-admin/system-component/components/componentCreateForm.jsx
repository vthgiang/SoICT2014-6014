import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { RootRoleActions } from '../../root-role/redux/actions'
import { SystemComponentActions } from '../redux/actions'
import { SystemLinkActions } from '../../system-link/redux/actions'
import ValidationHelper from '../../../../helpers/validationHelper'
import { ButtonModal, DialogModal, ErrorLabel, SelectBox } from '../../../../common-components'

function ComponentCreateForm(props) {
  const [state, setState] = useState({
    componentName: '',
    componentDescription: '',
    componentLink: undefined,
    componentRoles: []
  })

  useEffect(() => {
    props.getAllRootRoles()
    props.getAllSystemLinks()
  }, [])

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

    if (isFormValidated()) return props.createSystemComponent(component)
  }

  const { translate, rootRoles, systemLinks } = props
  const { componentLink, componentNameError, componentDescriptionError } = state

  return (
    <React.Fragment>
      <ButtonModal
        modalID='modal-create-component'
        button_name={translate('manage_component.add')}
        title={translate('manage_component.add_title')}
      />
      <DialogModal
        modalID='modal-create-component'
        formID='form-create-component'
        title={translate('manage_component.add_title')}
        func={save}
        disableSubmit={!isFormValidated()}
      >
        <form id='form-create-component'>
          <div className={`form-group ${componentNameError === undefined ? '' : 'has-error'}`}>
            <label>
              {translate('manage_component.name')}
              <span className='text-red'> * </span>
            </label>
            <input type='text' className='form-control' onChange={handleName} />
            <ErrorLabel content={componentNameError} />
          </div>
          <div className={`form-group ${componentDescriptionError === undefined ? '' : 'has-error'}`}>
            <label>{translate('manage_component.description')}</label>
            <input type='text' className='form-control' onChange={handleDescription} />
            <ErrorLabel content={componentDescriptionError} />
          </div>
          <div className='form-group'>
            <label>{translate('manage_component.link')}</label>
            {systemLinks.list.length > 0 && (
              <SelectBox
                id={`select-component-default-link`}
                className='form-control select2'
                style={{ width: '100%' }}
                items={systemLinks.list.map((link) => {
                  return { value: link._id, text: link.url }
                })}
                value={componentLink}
                onChange={handleLink}
                options={{ placeholder: translate('system_admin.system_component.select_link') }}
                multiple={true}
              />
            )}
          </div>
          <div className='form-group'>
            <label>{translate('manage_component.roles')}</label>
            <SelectBox
              id={`select-component-default-roles`}
              className='form-control select2'
              style={{ width: '100%' }}
              items={rootRoles.list.map((role) => {
                return { value: role._id, text: role.name }
              })}
              onChange={handleRoles}
              multiple={true}
            />
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

function mapState(state) {
  const { rootRoles, systemLinks } = state
  return { rootRoles, systemLinks }
}
const actions = {
  getAllRootRoles: RootRoleActions.getAllRootRoles,
  getAllSystemLinks: SystemLinkActions.getAllSystemLinks,
  createSystemComponent: SystemComponentActions.createSystemComponent
}

const connectedComponentCreateForm = connect(mapState, actions)(withTranslate(ComponentCreateForm))
export { connectedComponentCreateForm as ComponentCreateForm }
