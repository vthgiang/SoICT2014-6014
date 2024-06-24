import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslate } from 'react-redux-multilingual'
import { RequesterActions } from '../../../system-admin/requester-management/redux/actions'
import { ResourceActions } from '../../../system-admin/resource-management/redux/actions'
import { RoleActions } from '../../role/redux/actions'
import { DialogModal, AttributeTable } from '../../../../common-components'
import ValidationHelper from '../../../../helpers/validationHelper'

export function AttributeEditForm(props) {
  const [state, setState] = useState({})
  const dispatch = useDispatch()
  const translate = useTranslate()

  const { object, objectType, i, id } = props

  const editRequester = (id, newObject) => dispatch(RequesterActions.edit(id, newObject))
  const editResource = (id, newObject) => dispatch(ResourceActions.edit(id, newObject))
  const editRole = (id, newObject) => dispatch(RoleActions.editRoleAttribute(id, newObject))
  useEffect(() => {
    if (object && (object.id !== state.id || object.attributes !== state.attributes)) {
      setState({
        ...state,
        id: object.id,
        name: object.name,
        type: object.type?.name ?? object.type,
        attributes: object.attributes.map((a, index) => (a = { ...a, addOrder: index })),
        objectType
      })
    }
  }, [object?.id, object?.attributes, objectType])

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

  const validateAttributes = () => {
    if (!state.attributes) return true

    if (state.attributes.length !== 0) {
      for (let i = 0; i < state.attributes.length; i++) {
        if (
          !ValidationHelper.validateEmpty(translate, state.attributes[i].attributeId).status ||
          !ValidationHelper.validateEmpty(translate, state.attributes[i].value).status
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
    const newObject = {
      attributes: state.attributes.map((x) => ({
        attributeId: x.attributeId,
        value: x.value,
        description: x.description
      }))
    }

    if (isFormValidated()) {
      if (objectType === 'Requester') {
        return editRequester(state.id, newObject)
      }
      if (objectType === 'Resource') {
        return editResource(state.id, newObject)
      }
      if (objectType === 'Role') {
        return editRole(state.id, newObject)
      }
    }
  }

  return (
    <DialogModal
      isLoading={false}
      func={save}
      modalID={`modal-${id}`}
      formID={`form-${id}`}
      title='Edit attributes'
      disableSubmit={!isFormValidated()}
    >
      {/* Form hỉnh sửa thông tin   */}
      <form id='form-edit-link'>
        {/* Tên của Requester */}
        <div className='form-group'>
          <label>
            Name
            <span className='text-red'> * </span>
          </label>
          <input type='text' className='form-control' value={state.name} disabled />
        </div>

        {/* Type của Requester */}
        <div className='form-group'>
          <label>
            Type
            <span className='text-red'> * </span>
          </label>
          <input type='text' className='form-control' value={state.type} disabled />
        </div>

        {/* Các thuộc tính của Requester */}
        <AttributeTable
          attributes={state.attributes}
          handleChange={handleChange}
          attributeOwner='attributes'
          translation='manage_requester'
          handleChangeAddRowAttribute={handleChangeAddRowAttribute}
          i={i}
        />
      </form>
    </DialogModal>
  )
}
