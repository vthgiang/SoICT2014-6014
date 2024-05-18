import React, { useState } from 'react'
import { useDispatch, connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DialogModal, ErrorLabel } from '../../../../common-components'
import { CertificateActions } from '../redux/actions'
import ValidationHelper from '../../../../helpers/validationHelper'

function CreateForm(props) {
  const { translate } = props
  const dispatch = useDispatch()

  const [name, setName] = useState('')
  const [abbreviation, setAbbreviation] = useState('')
  const [description, setDescription] = useState('')
  const [score, setScore] = useState(1)
  const [nameError, setNameError] = useState(undefined)
  const [codeError, setCodeError] = useState(undefined)

  const handleName = (e) => {
    const { value } = e.target
    const { message } = ValidationHelper.validateName(translate, value, 1, 255)
    setName(value)
    setNameError(message)
  }

  const handleAbbreviation = (e) => {
    const { value } = e.target
    const { message } = ValidationHelper.validateCode(translate, value, 1, 255)
    setAbbreviation(value)
    setCodeError(message)
  }

  const handleDescription = (e) => {
    setDescription(e.target.value)
  }

  const handleChangeScore = (e) => {
    setScore(e.target.value)
  }

  const isValidateForm = () => {
    if (!ValidationHelper.validateName(translate, name, 1, 255).status) return false
    if (!ValidationHelper.validateCode(translate, abbreviation, 1, 255).status) return false
    return true
  }

  const save = () => {
    const data = {
      name,
      abbreviation,
      description
    }
    dispatch(CertificateActions.createCertificate(data))
  }

  return (
    <DialogModal
      modalID='modal-create-certificate'
      formID='form-create-certificate'
      title='Thêm chứng chỉ'
      disableSubmit={!isValidateForm()}
      func={save}
    >
      <form id='form-create-certificate'>
        <div className={`form-group ${!nameError ? '' : 'has-error'}`}>
          <label>
            Tên<span className='text-red'>*</span>
          </label>
          <input type='text' className='form-control' onChange={handleName} value={name} />
          <ErrorLabel content={nameError} />
        </div>
        <div className={`form-group ${!codeError ? '' : 'has-error'}`}>
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
        {/* <div className="form-group">
              <label>Chuyên ngành</label>
              <TreeSelect data={list} value={majors} handleChange={handleMajor} mode="radioSelect" />
              <SelectBox
                id={`field-certificate-add`}
                className="form-control select2"
                style={{ width: "100%" }}
                items={list.filter(item => item.parents.length === 0).map(x => {
                  return { text: x.name, value: x._id }
                })}
                options={{ placeholder: "Chọn thông tin cha" }}
                onChange={handleMajor}
                value={majors}
                multiple={true}
              />
            </div> */}
      </form>
    </DialogModal>
  )
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {
  createCertificate: CertificateActions.createCertificate
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateForm))
