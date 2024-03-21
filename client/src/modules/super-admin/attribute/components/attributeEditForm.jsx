import React, { useState } from 'react'
import { connect } from 'react-redux'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'

import { SelectBox, DialogModal, ErrorLabel } from '../../../../common-components'
import ValidationHelper from '../../../../helpers/validationHelper'

import { AttributeActions } from '../redux/actions'
import { ATTRIBUTE_TYPE } from '../../../../helpers/constants'

function AttributeEditForm(props) {
  // Khởi tạo state
  const [state, setState] = useState({
    attributeID: undefined,
    attributeName: '',
    description: '',
    attributeNameError: {
      message: undefined,
      status: true
    },
    type: ''
  })

  const { translate, attribute } = props
  const { attributeName, description, attributeNameError, attributeID, type, errorOnTypeField } = state

  // setState từ props mới
  if (props.attributeID !== attributeID) {
    setState({
      ...state,
      attributeID: props.attributeID,
      attributeName: props.attributeName,
      description: props.description,
      attributeNameError: {
        message: undefined,
        status: true
      },
      type: props.type
    })
  }

  /**
   * Hàm dùng để kiểm tra xem form đã được validate hay chưa
   */
  const isFormValidated = () => {
    if (!attributeNameError.status || !validateAttributeType(state.type, false)) {
      return false
    }
    return true
  }

  /**
   * Hàm dùng để lưu thông tin của form và gọi service tạo mới ví dụ
   */
  const save = () => {
    if (isFormValidated) {
      props.editAttribute(attributeID, { attributeName, description, type })
    }
  }

  const handleChangeAttributeType = (e) => {
    validateAttributeType(e[0])
  }

  const validateAttributeType = (value, willUpdateState = true) => {
    let msg = undefined
    const { translate } = props
    if (!value) {
      msg = translate('manage_attribute.type_not_selected')
    }
    if (willUpdateState) {
      var { type } = state
      type = value
      setState((state) => {
        return {
          ...state,
          errorOnTypeField: msg,
          type: type
        }
      })
    }
    return msg === undefined
  }

  /**
   * Hàm xử lý khi tên ví dụ thay đổi
   * @param {*} e
   */
  const handleAttributeName = (e) => {
    const { value } = e.target
    let result = ValidationHelper.validateName(translate, value, 6, 255)

    setState({
      ...state,
      attributeName: value,
      attributeNameError: result
    })
  }

  /**
   * Hàm xử lý khi mô tả ví dụ thay đổi
   * @param {*} e
   */
  const handleAttributeDescription = (e) => {
    const { value } = e.target
    setState({
      ...state,
      description: value
    })
  }

  return (
    <React.Fragment>
      <DialogModal
        modalID={`modal-edit-attribute-hooks`}
        isLoading={attribute.isLoading}
        formID={`form-edit-attribute-hooks`}
        title={translate('manage_attribute.edit_title')}
        disableSubmit={!isFormValidated}
        func={save}
        size={50}
      >
        <form id={`form-edit-attribute-hooks`}>
          {/* Tên ví dụ */}
          <div className={`form-group ${attributeNameError ? '' : 'has-error'}`}>
            <label>
              {translate('manage_attribute.attributeName')}
              <span className='text-red'>*</span>
            </label>
            <input type='text' className='form-control' value={attributeName} onChange={handleAttributeName} />
            <ErrorLabel content={attributeNameError.message} />
          </div>

          <div className={`form-group ${errorOnTypeField ? 'has-error' : ''}`}>
            <label>{translate('manage_attribute.add_type')}</label>
            <SelectBox
              id={`modal-add-type-${attributeID}`}
              className='form-control select2'
              style={{ width: '100%' }}
              value={type}
              items={ATTRIBUTE_TYPE.map((type) => {
                return { value: type.name, text: translate('manage_attribute.type' + '.' + type.name) }
              })}
              onChange={(e) => handleChangeAttributeType(e)}
              multiple={false}
              options={{ placeholder: translate('manage_attribute.type_select') }}
            />
            {errorOnTypeField && <ErrorLabel content={errorOnTypeField} />}
          </div>

          {/* Mô tả ví dụ */}
          <div className={`form-group`}>
            <label>{translate('manage_attribute.description')}</label>
            <input type='text' className='form-control' value={description} onChange={handleAttributeDescription} />
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

function mapState(state) {
  const attribute = state.attribute
  return { attribute }
}

const actions = {
  editAttribute: AttributeActions.editAttribute
}

const connectedAttributeEditForm = connect(mapState, actions)(withTranslate(AttributeEditForm))
export { connectedAttributeEditForm as AttributeEditForm }
