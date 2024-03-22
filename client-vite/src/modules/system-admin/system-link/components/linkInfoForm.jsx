import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { RootRoleActions } from '../../root-role/redux/actions'
import { SystemLinkActions } from '../redux/actions'
import SystemLinkValidator from './systemLinkValidator'
import { DialogModal, ErrorLabel, SelectBox } from '../../../../common-components'

function LinkInfoForm(props) {
  const [state, setState] = useState({})

  useEffect(() => {
    props.getAllRootRoles()
  }, [])

  // Thiet lap cac gia tri tu props vao state
  useEffect(() => {
    if (props.linkId !== state.linkId) {
      setState({
        ...state,
        linkId: props.linkId,
        linkUrl: props.linkUrl,
        linkCategory: props.linkCategory,
        linkDescription: props.linkDescription,
        linkRoles: props.linkRoles,
        linkUrlError: undefined,
        linkDescriptionError: undefined
      })
    }
  }, [props.linkId])

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
      linkCategory: value
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
    const { linkId, linkUrl, linkDescription, linkRoles, linkCategory } = state
    if (isFormValidated()) {
      return props.editSystemLink(linkId, {
        url: linkUrl,
        description: linkDescription,
        roles: linkRoles,
        category: linkCategory
      })
    }
  }

  const { translate, rootRoles, systemLinks } = props
  const { linkId, linkUrl, linkCategory, linkDescription, linkRoles, linkUrlError, linkDescriptionError } = state

  return (
    <DialogModal
      size='50'
      func={save}
      isLoading={systemLinks.isLoading}
      modalID='modal-edit-link-default'
      formID='form-edit-link-default'
      title={translate('manage_link.edit')}
      msg_success={translate('manage_link.edit_success')}
      msg_failure={translate('manage_link.edit_faile')}
      disableSubmit={!isFormValidated()}
    >
      <form id='form-edit-link-default'>
        <div className={`form-group ${linkUrlError === undefined ? '' : 'has-error'}`}>
          <label>
            {translate('manage_link.url')}
            <span className='text-red'> * </span>
          </label>
          <input type='text' className='form-control' value={linkUrl} onChange={handleUrl} />
          <ErrorLabel content={linkUrlError} />
        </div>
        <div className={`form-group ${linkDescriptionError === undefined ? '' : 'has-error'}`}>
          <label>
            {translate('manage_link.description')}
            <span className='text-red'> * </span>
          </label>
          <input type='text' className='form-control' value={linkDescription} onChange={handleDescription} />
          <ErrorLabel content={linkDescriptionError} />
        </div>
        <div className='form-group'>
          <label>
            {translate('manage_link.category')}
            <span className='text-red'> * </span>
          </label>
          <SelectBox
            id={`select-link-default-category-${linkId}`}
            className='form-control select2'
            style={{ width: '100%' }}
            items={systemLinks.categories.map((category) => {
              return { value: category.name, text: category.name + '-' + category.description }
            })}
            onChange={handleCategory}
            value={linkCategory}
            multiple={false}
          />
        </div>
        <div className='form-group'>
          <label>{translate('manage_link.roles')}</label>
          <SelectBox
            id={`select-link-default-roles-${linkId}`}
            className='form-control select2'
            style={{ width: '100%' }}
            items={rootRoles.list.map((role) => {
              return { value: role._id, text: role.name }
            })}
            onChange={handleRoles}
            value={linkRoles}
            multiple={true}
          />
        </div>
      </form>
    </DialogModal>
  )
}

function mapState(state) {
  const { rootRoles, systemLinks } = state
  return { rootRoles, systemLinks }
}
const actions = {
  getAllRootRoles: RootRoleActions.getAllRootRoles,
  editSystemLink: SystemLinkActions.editSystemLink
}

const connectedLinkInfoForm = connect(mapState, actions)(withTranslate(LinkInfoForm))
export { connectedLinkInfoForm as LinkInfoForm }
