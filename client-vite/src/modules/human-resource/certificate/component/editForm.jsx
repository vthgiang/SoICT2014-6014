import React, { useState, useEffect } from 'react'
import { useDispatch, connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal, ErrorLabel } from '../../../../common-components'
import { CertificateActions } from '../redux/actions'
import ValidationHelper from '../../../../helpers/validationHelper'

function EditForm(props) {
  const { translate, certificateId, certificateName, certificateAbbreviation, certificateDescription, certificateScore } = props
  const dispatch = useDispatch()

  const [state, setState] = useState({
    certificateId,
    name: certificateName,
    abbreviation: certificateAbbreviation,
    description: certificateDescription,
    score: certificateScore,
    nameError: undefined,
    codeError: undefined
  })

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      certificateId,
      name: certificateName,
      abbreviation: certificateAbbreviation,
      description: certificateDescription,
      nameError: undefined,
      codeError: undefined
    }))
  }, [certificateId, certificateName, certificateAbbreviation, certificateDescription])

  const handleName = (e) => {
    const { value } = e.target
    const { message } = ValidationHelper.validateName(translate, value, 1, 255)
    setState((prevState) => ({
      ...prevState,
      name: value,
      nameError: message
    }))
  }

  const handleAbbreviation = (e) => {
    const { value } = e.target
    const { message } = ValidationHelper.validateCode(translate, value, 1, 255)
    setState((prevState) => ({
      ...prevState,
      abbreviation: value,
      codeError: message
    }))
  }

  const handleDescription = (e) => {
    const { value } = e.target
    setState((prevState) => ({
      ...prevState,
      description: value
    }))
  }

  const handleChangeScore = (e) => {
    const { value } = e.target
    setState((prevState) => ({
      ...prevState,
      score: value
    }))
  }

  const isValidateForm = () => {
    const { name } = state
    if (!ValidationHelper.validateName(translate, name, 1, 255).status) return false
    return true
  }

  const save = () => {
    dispatch(CertificateActions.editCertificate(state))
  }

  const { name, abbreviation, description, codeError, nameError, score } = state

  return (
    <DialogModal
      modalID='edit-certificate'
      formID='edit-certificate'
      title='Chỉnh sửa bằng cấp - chứng chỉ'
      disableSubmit={!isValidateForm()}
      func={save}
    >
      <form id='edit-certificate'>
        <div className={`form-group ${nameError === undefined ? '' : 'has-error'}`}>
          <label>
            Tên<span className='text-red'>*</span>
          </label>
          <input type='text' className='form-control' onChange={handleName} value={name} />
          <ErrorLabel content={nameError} />
        </div>
        <div className={`form-group ${codeError === undefined ? '' : 'has-error'}`}>
          <label>
            Tên viết tắt<span className='text-red'>*</span>
          </label>
          <input type='text' className='form-control' onChange={handleAbbreviation} value={abbreviation} />
          <ErrorLabel content={codeError} />
        </div>
        <div className='form-group'>
          <label>Mô tả</label>
          <input type='text' className='form-control' onChange={handleDescription} value={description} />
        </div>
        <div className='form-group'>
          <label>Điểm số</label>
          <input type='number' className='form-control' onChange={handleChangeScore} value={score} max={5} min={1} />
        </div>
      </form>
    </DialogModal>
  )
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {
  editCertificate: CertificateActions.editCertificate
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(EditForm))
