import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { RequesterActions } from '../redux/actions'
import { AttributeActions } from '../../../super-admin/attribute/redux/actions'
import { DialogModal, AttributeTable } from '../../../../common-components'
import ValidationHelper from '../../../../helpers/validationHelper'

function RequesterEditForm(props) {
  const [state, setState] = useState({})

  const { requester, translate, editRequester, getAttribute, i } = props
  const { id, name, type, attributes } = state

  useEffect(() => {
    if (requester.id !== state.id || requester.attributes !== state.attributes) {
      setState({
        ...state,
        id: requester.id,
        name: requester.name,
        type: requester.type,
        attributes: requester.attributes.map((a, index) => (a = { ...a, addOrder: index }))
      })
    }
  }, [requester.id, requester.attributes])

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
    const newRequester = {
      attributes: attributes.map((x) => ({
        attributeId: x.attributeId,
        value: x.value,
        description: x.description
      }))
    }

    if (isFormValidated()) {
      return editRequester(id, newRequester)
    }
  }

  return (
    <DialogModal
      isLoading={requester.isLoading}
      func={save}
      modalID='modal-edit-requester'
      formID='form-edit-requester'
      title={translate('manage_requester.edit')}
      disableSubmit={!isFormValidated()}
    >
      {/* Form hỉnh sửa thông tin   */}
      <form id='form-edit-link'>
        {/* Tên của Requester */}
        <div className='form-group'>
          <label>
            {translate('manage_requester.name')}
            <span className='text-red'> * </span>
          </label>
          <input type='text' className='form-control' value={name} disabled />
        </div>

        {/* Type của Requester */}
        <div className='form-group'>
          <label>
            {translate('manage_requester.type')}
            <span className='text-red'> * </span>
          </label>
          <input type='text' className='form-control' value={type} disabled />
        </div>

        {/* Các thuộc tính của Requester */}
        <AttributeTable
          attributes={attributes}
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

function mapState(state) {
  return {}
}

const dispatchStateToProps = {
  editRequester: RequesterActions.edit,
  getAttribute: AttributeActions.getAttributes
}

export default connect(mapState, dispatchStateToProps)(withTranslate(RequesterEditForm))
