import React, { useState } from 'react'
import { connect } from 'react-redux'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'

import { DialogModal, ErrorLabel } from '../../../../common-components'
import ValidationHelper from '../../../../helpers/validationHelper'

import { exampleActions } from '../redux/actions'

function ExampleEditForm(props) {
  // Khởi tạo state
  const [state, setState] = useState({
    exampleID: undefined,
    exampleName: '',
    description: '',
    exampleNameError: {
      message: undefined,
      status: true
    }
  })

  const { translate, example } = props
  const { exampleName, description, exampleNameError, exampleID } = state

  // setState từ props mới
  if (props.exampleID !== exampleID) {
    setState({
      ...state,
      exampleID: props.exampleID,
      exampleName: props.exampleName,
      description: props.description,
      exampleNameError: {
        message: undefined,
        status: true
      }
    })
  }

  /**
   * Hàm dùng để kiểm tra xem form đã được validate hay chưa
   */
  const isFormValidated = () => {
    if (!exampleNameError.status) {
      return false
    }
    return true
  }

  /**
   * Hàm dùng để lưu thông tin của form và gọi service tạo mới ví dụ
   */
  const save = () => {
    if (isFormValidated) {
      props.editExample(exampleID, { exampleName, description })
    }
  }

  /**
   * Hàm xử lý khi tên ví dụ thay đổi
   * @param {*} e
   */
  const handleExampleName = (e) => {
    const { value } = e.target
    let result = ValidationHelper.validateName(translate, value, 6, 255)

    setState({
      ...state,
      exampleName: value,
      exampleNameError: result
    })
  }

  /**
   * Hàm xử lý khi mô tả ví dụ thay đổi
   * @param {*} e
   */
  const handleExampleDescription = (e) => {
    const { value } = e.target
    setState({
      ...state,
      description: value
    })
  }

  return (
    <React.Fragment>
      <DialogModal
        modalID={`modal-edit-example-hooks`}
        isLoading={example.isLoading}
        formID={`form-edit-example-hooks`}
        title={translate('manage_example.edit_title')}
        disableSubmit={!isFormValidated}
        func={save}
        size={50}
        maxWidth={500}
      >
        <form id={`form-edit-example-hooks`}>
          {/* Tên ví dụ */}
          <div className={`form-group ${exampleNameError ? '' : 'has-error'}`}>
            <label>
              {translate('manage_example.exampleName')}
              <span className='text-red'>*</span>
            </label>
            <input type='text' className='form-control' value={exampleName} onChange={handleExampleName} />
            <ErrorLabel content={exampleNameError.message} />
          </div>

          {/* Mô tả ví dụ */}
          <div className={`form-group`}>
            <label>{translate('manage_example.description')}</label>
            <input type='text' className='form-control' value={description} onChange={handleExampleDescription} />
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

function mapState(state) {
  const example = state.example1
  return { example }
}

const actions = {
  editExample: exampleActions.editExample
}

const connectedExampleEditForm = connect(mapState, actions)(withTranslate(ExampleEditForm))
export { connectedExampleEditForm as ExampleEditForm }
