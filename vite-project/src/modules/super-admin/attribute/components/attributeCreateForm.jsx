import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import { SelectBox, DialogModal, ErrorLabel } from '../../../../common-components'
import { withTranslate } from 'react-redux-multilingual'
import ValidationHelper from '../../../../helpers/validationHelper'
import { ATTRIBUTE_TYPE } from '../../../../helpers/constants'
import { AttributeActions } from '../redux/actions'

function AttributeCreateForm(props) {
  // Khởi tạo state
  const [state, setState] = useState({
    attributeName: '',
    description: '',
    attributeNameError: {
      message: undefined,
      status: true
    },
    type: ''
  })

  const { translate, attribute, page, perPage } = props
  const { attributeName, description, attributeNameError, type, errorOnTypeField } = state

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
    if (isFormValidated() && attributeName) {
      props.createAttribute([{ attributeName, description, type }])
      // props.getAttributes({
      //     attributeName: "",
      //     page: page,
      //     perPage: perPage
      // });
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
        modalID='modal-create-attribute-hooks'
        isLoading={attribute.isLoading}
        formID='form-create-attribute-hooks'
        title={translate('manage_attribute.add_title')}
        msg_success={translate('manage_attribute.add_success')}
        msg_failure={translate('manage_attribute.add_fail')}
        func={save}
        disableSubmit={!isFormValidated()}
        size={50}
      >
        <form id='form-create-attribute-hooks' onSubmit={() => save(translate('manage_attribute.add_success'))}>
          {/* Tên ví dụ */}
          <div className={`form-group ${attributeNameError.status ? '' : 'has-error'}`}>
            <label>
              {translate('manage_attribute.attributeName')}
              <span className='text-red'>*</span>
            </label>
            <input type='text' className='form-control' value={attributeName} onChange={handleAttributeName}></input>
            <ErrorLabel content={attributeNameError.message} />
          </div>

          <div className={`form-group ${errorOnTypeField ? 'has-error' : ''}`}>
            <label>{translate('manage_attribute.add_type')}</label>
            <SelectBox
              id={`modal-add-type`}
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
            <label>{translate('manage_attribute.attribute_description')}</label>
            <input type='text' className='form-control' value={description} onChange={handleAttributeDescription}></input>
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
  createAttribute: AttributeActions.createAttribute,
  getAttributes: AttributeActions.getAttributes
}

const connectedAttributeCreateForm = connect(mapState, actions)(withTranslate(AttributeCreateForm))
export { connectedAttributeCreateForm as AttributeCreateForm }
