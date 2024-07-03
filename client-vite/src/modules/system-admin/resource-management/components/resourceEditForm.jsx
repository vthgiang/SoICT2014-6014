import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { ResourceActions } from '../redux/actions'
import { AttributeActions } from '../../../super-admin/attribute/redux/actions'
import { DialogModal, AttributeTable } from '../../../../common-components'
import ValidationHelper from '../../../../helpers/validationHelper'

function ResourceEditForm(props) {
  const [state, setState] = useState({})

  const { resource, translate, editResource, getAttribute, i } = props
  const { id, name, type, attributes } = state

  useEffect(() => {
    if (resource.id !== state.id || resource.attributes !== state.attributes) {
      setState({
        ...state,
        id: resource.id,
        name: resource.name,
        type: resource.type,
        attributes: resource.attributes.map((a, index) => (a = { ...a, addOrder: index }))
      })
    }
  }, [resource.id, resource.attributes])

  // Function lưu các trường thông tin vào state
  const handleChange = (name, value) => {
    setState({
      ...state,
      [name]: value
    })
  }

  const handleChangeAddRowAttribute = (name, value) => {
    props.handleChangeAddRowAttribute(name, value)
  }

  useEffect(() => {
    getAttribute()
  }, [])

  const validateAttributes = () => {
    if (!attributes) return true

    if (attributes.length !== 0) {
      for (let i = 0; i < attributes.length; i++) {
        if (
          !ValidationHelper.validateEmpty(translate, attributes[i].attributeId).status ||
          !ValidationHelper.validateEmpty(translate, attributes[i].value).status
        ) {
          return false
        }
      }
    }
    return true
  }

  const isFormValidated = () => {
    if (!validateAttributes()) return false
    return true
  }

  const save = () => {
    const newResource = {
      attributes: attributes.map((x) => ({
        attributeId: x.attributeId,
        value: x.value,
        description: x.description
      }))
    }

    if (isFormValidated()) {
      return editResource(id, newResource)
    }
  }

  return (
    <DialogModal
      isLoading={resource.isLoading}
      func={save}
      modalID='modal-edit-resource'
      formID='form-edit-resource'
      title={translate('manage_resource.edit')}
      disableSubmit={!isFormValidated()}
    >
      {/* Form hỉnh sửa thông tin   */}
      <form id='form-edit-link'>
        {/* Tên của Resource */}
        <div className='form-group'>
          <label>
            {translate('manage_resource.name')}
            <span className='text-red'> * </span>
          </label>
          <input type='text' className='form-control' value={name} disabled />
        </div>

        {/* Type của Resource */}
        <div className='form-group'>
          <label>
            {translate('manage_resource.type')}
            <span className='text-red'> * </span>
          </label>
          <input type='text' className='form-control' value={type} disabled />
        </div>

        {/* Các thuộc tính của Resource */}
        <AttributeTable
          attributes={attributes}
          handleChange={handleChange}
          attributeOwner='attributes'
          translation='manage_resource'
          handleChangeAddRowAttribute={handleChangeAddRowAttribute}
          i={i}
        />
      </form>
    </DialogModal>
  )
}

function mapState(state) {
  return {}
}

const dispatchStateToProps = {
  editResource: ResourceActions.edit,
  getAttribute: AttributeActions.getAttributes
}

export default connect(mapState, dispatchStateToProps)(withTranslate(ResourceEditForm))
