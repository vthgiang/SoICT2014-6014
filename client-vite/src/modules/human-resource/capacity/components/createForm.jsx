import React, { useState } from 'react'
import { useDispatch, connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DialogModal, ErrorLabel } from '../../../../common-components'
import { CapacityActions } from '../redux/actions'
import ValidationHelper from '../../../../helpers/validationHelper'

function CreateForm(props) {
  const { translate } = props
  const dispatch = useDispatch()

  const [name, setName] = useState('')
  const [key, setKey] = useState('')
  const [description, setDescription] = useState('')
  const [nameError, setNameError] = useState(undefined)
  const [codeError, setCodeError] = useState(undefined)
  const [values, setValues] = useState([])
  const { list } = props

  const initCapacityData = {
    name: '',
    key: '',
    values: [],
    errors: {

    }
  }

  const [capacityValueState, setCapacityValueState] = useState({
    listCapacityValue: [],
    currentCapacityValue: {
      ...initCapacityData
    },
    currentIndex: null,
  })

  const handleName = (e) => {
    const { value } = e.target
    const { message } = ValidationHelper.validateName(translate, value, 1, 255)
    let listName = list && list?.length > 0 ? list.map((item) => item?.name) : []
    if (listName && listName.includes(String(value))) {
      setNameError('Đã tồn tại tên năng lực rồi!')
      setName(value)
      return
    }
    setName(value)
    setNameError(message)
  }

  const handleKey = (e) => {
    const { value } = e.target
    const { message } = ValidationHelper.validateCode(translate, value, 1, 255)
    let listKey = list && list?.length > 0 ? list.map((item) => item?.key) : []

    if (listKey && listKey.includes(String(value))) {
      setCodeError('Đã tồn tại tên năng lực viết tắt rồi!')
      setKey(value)
      return
    }
    setKey(value)
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
    if (!ValidationHelper.validateCode(translate, key, 1, 255).status) return false
    return true
  }

  const save = () => {
    const data = {
      name,
      key,
      description
    }
    // dispatch(CapacityActions.createCapacity(data))
  }

  return (
    <DialogModal
      modalID='modal-create-capacity'
      formID='form-create-capacity'
      title='Thêm năng lực'
      disableSubmit={!isValidateForm()}
      func={save}
    >
      <form id='form-create-capacity'>
        <div className={`form-group ${!nameError ? '' : 'has-error'}`}>
          <label>
            Tên năng lực<span className='text-red'>*</span>
          </label>
          <input type='text' className='form-control' onChange={handleName} value={name} />
          <ErrorLabel content={nameError} />
        </div>
        <div className={`form-group ${!codeError ? '' : 'has-error'}`}>
          <label>
            Tên viết tắt (key)<span className='text-red'>*</span>
          </label>
          <input type='text' className='form-control' onChange={handleKey} value={key} />
          <ErrorLabel content={codeError} />
        </div>
        <div className='form-group'>
          <label>Mô tả</label>
          <input type='text' className='form-control' onChange={handleDescription} value={description} />
        </div>
       
        <div>
          <label>Giá trị năng lực</label>
          <table
            id='create-capacity-value-table'
            className="table table-striped table-bordered table-hover"
          >
            <thead>
              <tr>
                <th className="w-[40%]">Tên giá trị năng lực</th>
                <th className="w-[40%]">Điểm quy đổi</th>
                <th className="w-[20%]">{translate('task_template.action')}</th>
              </tr>
            </thead>
            <tbody>

              {/* Dòng để thêm */}
              <tr key={'create-capacity-add-input-value'}>
                <td>
                  <input
                    id={`create-capacity-add-value-key`}
                    className='form-control select'
                    style={{ width: '100%' }}
                    type="text"
                    // value={requireAsset?.currentAssetNumber}
                    // onChange={handleChangeCurrentTaskAssetNumber}
                  />
                </td>
                <td>
                  <input
                    id={`create-capacity-add-value-key`}
                    className='form-control select'
                    style={{ width: '100%' }}
                    type="number"
                    min={0}
                    // value={requireAsset?.currentAssetNumber}
                    // onChange={handleChangeCurrentTaskAssetNumber}
                  />
                </td>
                <td>
                  <a className={`save ${'text-green'}`}
                    title={translate('general.save')}
                    // onClick={handleAddAssetInCurrentTask}
                    style={{ width: '100%' }}
                  >
                    <i className='material-icons'>add_circle</i>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
       
      </form>
    </DialogModal>
  )
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {
  createCapacity: CapacityActions.addNewCapacity
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateForm))
