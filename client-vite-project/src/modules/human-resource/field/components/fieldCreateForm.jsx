import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DialogModal, ButtonModal, ErrorLabel } from '../../../../common-components'

import { FieldsActions } from '../redux/actions'
import ValidationHelper from '../../../../helpers/validationHelper'

const FieldCreateForm = (props) => {
  const [state, setState] = useState({
    name: '',
    description: ''
  })

  const handleChangeName = (e) => {
    e.preventDefault()
    const { value } = e.target
    let { translate } = props
    let { message } = ValidationHelper.validateName(translate, value, 3, 255)
    setState((state) => ({
      ...state,
      name: value,
      errorOnName: message
    }))
  }

  const handleChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target
    setState((state) => ({
      ...state,
      [name]: value
    }))
  }

  /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form */
  const isFormValidated = () => {
    let { name } = state
    let { translate } = props
    if (!ValidationHelper.validateName(translate, name, 3, 255).status) return false
    return true
  }

  /** Bắt sự kiện submit form */
  const save = () => {
    const { createFields } = props
    createFields(state)
  }

  const { translate, field } = props

  const { name, description, errorOnName } = state
  return (
    <React.Fragment>
      <ButtonModal
        modalID='modal-create-field'
        button_name={translate('human_resource.field.add_fields')}
        title={translate('human_resource.field.add_fields_title')}
      />
      <DialogModal
        size='50'
        modalID='modal-create-field'
        isLoading={field.isLoading}
        formID='form-create-annual-leave'
        title={translate('human_resource.field.add_fields_title')}
        func={save}
        disableSubmit={!isFormValidated()}
      >
        <div>
          <div className='form-group' id='form-create-field'>
            {/* Tên ngành nghề/lĩnh vực */}
            <div className={`form-group ${errorOnName && 'has-error'}`}>
              <label>
                {translate('human_resource.field.table.name')}
                <span className='text-red'>*</span>
              </label>
              <input type='text' className='form-control' name='name' value={name} onChange={handleChangeName} autoComplete='off'></input>
              <ErrorLabel content={errorOnName} />
            </div>
            {/* Mô tả */}
            <div className={`form-group`}>
              <label>{translate('human_resource.field.table.description')}</label>
              <textarea
                className='form-control'
                rows='3'
                style={{ height: 72 }}
                name='description'
                value={description}
                onChange={handleChange}
                placeholder='Enter ...'
                autoComplete='off'
              ></textarea>
            </div>
          </div>
        </div>
      </DialogModal>
    </React.Fragment>
  )
}

function mapState(state) {
  const { field } = state
  return { field }
}

const actionCreators = {
  createFields: FieldsActions.createFields
}

const createForm = connect(mapState, actionCreators)(withTranslate(FieldCreateForm))
export { createForm as FieldCreateForm }
