import React, { useState, useEffect } from 'react'
import { useDispatch, connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DialogModal, ErrorLabel } from '../../../../common-components'
import { MajorActions } from '../redux/actions'
import ValidationHelper from '../../../../helpers/validationHelper'

function EditForm(props) {
  const { translate, majorId, majorName, majorCode, majorDescription, majorScore } = props
  const dispatch = useDispatch()

  const [state, setState] = useState({
    majorId,
    name: majorName,
    code: majorCode,
    description: majorDescription,
    score: majorScore,
    nameError: undefined,
    codeError: undefined
  })

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      majorId,
      name: majorName,
      code: majorCode,
      description: majorDescription,
      nameError: undefined,
      codeError: undefined
    }))
  }, [majorId, majorName, majorCode, majorDescription])

  const handleName = (e) => {
    const { value } = e.target
    const { message } = ValidationHelper.validateName(translate, value, 1, 255)
    setState((prevState) => ({
      ...prevState,
      name: value,
      nameError: message
    }))
  }

  const handleCode = (e) => {
    const { value } = e.target
    setState((prevState) => ({
      ...prevState,
      code: value,
      codeError: undefined
    }))
  }

  const handleDescription = (e) => {
    const { value } = e.target
    setState((prevState) => ({
      ...prevState,
      description: value
    }))
  }

  const isValidateForm = () => {
    const { name } = state
    if (!ValidationHelper.validateName(translate, name, 1, 255).status) return false
    return true
  }

  const save = () => {
    dispatch(MajorActions.editMajor(state))
  }

  const { name, code, description, nameError, codeError } = state

  return (
    <DialogModal modalID='edit-major' formID='edit-major' title='Chỉnh sửa chuyên ngành' disableSubmit={!isValidateForm()} func={save}>
      <form id='edit-major'>
        <div className={`form-group ${nameError === undefined ? '' : 'has-error'}`}>
          <label>
            Tên<span className='text-red'>*</span>
          </label>
          <input type='text' className='form-control' onChange={handleName} value={name} />
          <ErrorLabel content={nameError} />
        </div>
        <div className={`form-group ${codeError === undefined ? '' : 'has-error'}`}>
          <label>
            Nhãn dán<span className='text-red'>*</span>
          </label>
          <input type='text' className='form-control' onChange={handleCode} value={code} />
          <ErrorLabel content={codeError} />
        </div>
        <div className='form-group'>
          <label>Mô tả</label>
          <input type='text' className='form-control' onChange={handleDescription} value={description} />
        </div>
      </form>
    </DialogModal>
  )
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {
  editMajor: MajorActions.editMajor
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(EditForm))
