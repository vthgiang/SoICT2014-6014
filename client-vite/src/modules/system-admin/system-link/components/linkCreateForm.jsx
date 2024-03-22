import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { RootRoleActions } from '../../root-role/redux/actions'
import { SystemLinkActions } from '../redux/actions'
import SystemLinkValidator from './systemLinkValidator'
import { DialogModal, ButtonModal, ErrorLabel, SelectBox } from '../../../../common-components'
function CreateLinkForm(props) {
  const [state, setState] = useState({})

  useEffect(() => {
    props.getAllRootRoles()
  }, [])

  const handleUrl = (e) => {
    let { value } = e.target
    let { translate } = props
    let { message } = SystemLinkValidator.validateUrl(translate, value)
    setState({
      ...state,
      linkUrl: value,
      linkUrlError: message
    })
  }

  const handleDescription = (e) => {
    let { value } = e.target
    let { translate } = props
    let { message } = SystemLinkValidator.validateDescription(translate, value)
    setState({
      ...state,
      linkDescription: value,
      linkDescriptionError: message
    })
  }

  const handleCategory = (value) => {
    setState({
      ...state,
      linkCategory: value[0]
    })
  }

  const handleRoles = (value) => {
    setState({
      ...state,
      linkRoles: value
    })
  }

  const isFormValidated = () => {
    let { linkUrl, linkDescription } = state
    let { translate } = props
    if (
      !SystemLinkValidator.validateUrl(translate, linkUrl).status ||
      !SystemLinkValidator.validateDescription(translate, linkDescription).status
    )
      return false
    return true
  }

  const save = () => {
    const { linkUrl, linkDescription, linkRoles, linkCategory } = state
    if (isFormValidated()) {
      return props.createSystemLink({
        url: linkUrl,
        description: linkDescription,
        roles: linkRoles,
        category: linkCategory
      })
    }
  }

  const { translate, rootRoles, systemLinks } = props
  const { linkUrlError, linkDescriptionError } = state

  return (
    <React.Fragment>
      <ButtonModal modalID='modal-create-page' button_name={translate('general.add')} title={translate('system_admin.system_link.add')} />
      <DialogModal
        modalID='modal-create-page'
        formID='form-create-page'
        title={translate('system_admin.system_link.add')}
        func={save}
        disableSubmit={!isFormValidated()}
      >
        <form id='form-create-page'>
          <div className={`form-group ${!linkUrlError ? '' : 'has-error'}`}>
            <label>
              {translate('system_admin.system_link.table.url')}
              <span className='text-red'> * </span>
            </label>
            <input type='text' className='form-control' onChange={handleUrl} />
            <ErrorLabel content={linkUrlError} />
          </div>
          <div className={`form-group ${!linkDescriptionError ? '' : 'has-error'}`}>
            <label>
              {translate('system_admin.system_link.table.description')}
              <span className='text-red'> * </span>
            </label>
            <input type='text' className='form-control' onChange={handleDescription} />
            <ErrorLabel content={linkDescriptionError} />
          </div>
          <div className='form-group'>
            <label>
              {translate('system_admin.system_link.table.category')}
              <span className='text-red'> * </span>
            </label>
            <SelectBox
              id={`select-link-default-category`}
              className='form-control select2'
              style={{ width: '100%' }}
              items={systemLinks.categories.map((category) => {
                return { value: category.name, text: category.name + '-' + category.description }
              })}
              onChange={handleCategory}
              multiple={false}
            />
          </div>
          <div className='form-group'>
            <label>{translate('system_admin.system_link.table.roles')}</label>
            <SelectBox
              id={`select-link-default-roles`}
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
  createSystemLink: SystemLinkActions.createSystemLink
}

const connectedCreateLinkForm = connect(mapState, actions)(withTranslate(CreateLinkForm))
export { connectedCreateLinkForm as CreateLinkForm }
