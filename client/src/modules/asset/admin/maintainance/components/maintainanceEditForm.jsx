import React, { Component, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components'

import { MaintainanceActions } from '../redux/actions'
import { AssetManagerActions } from '../../asset-information/redux/actions'
import ValidationHelper from '../../../../../helpers/validationHelper'

function MaintainanceEditForm(props) {
  const [state, setState] = useState({
    asset: {
      _id: null
    }
  })
  const [prevProps, setPrevProps] = useState({
    _id: null
  })
  if (prevProps._id !== props._id) {
    setState({
      ...state,
      _id: props._id,
      asset: props.asset,
      maintainanceCode: props.maintainanceCode,
      createDate: props.createDate,
      type: props.type,
      description: props.description,
      startDate: props.startDate,
      endDate: props.endDate,
      expense: props.expense,
      status: props.status,
      errorOnMaintainanceCode: undefined,
      errorOnCreateDate: undefined,
      errorOnStartDate: undefined,
      errorOnDescription: undefined,
      errorOnExpense: undefined
    })
    setPrevProps(props)
  }
  const { _id, translate, assetsManager } = props
  const {
    maintainanceCode,
    createDate,
    type,
    asset,
    description,
    startDate,
    endDate,
    expense,
    status,
    errorOnMaintainanceCode,
    errorOnCreateDate,
    errorOnDescription,
    errorOnStartDate,
    errorOnExpense
  } = state

  let assetlist = assetsManager.listAssets
  console.log(assetlist)

  // kiểm tra xem id tài sản click xem có nằm trong listAsset trong selectbox chọn tài sản hay kkhoong
  // Không có thì add thêm, có rồi thì thôi
  if (assetlist) {
    const checkExist = assetlist.some((obj) => {
      obj._id = asset._id
    })
    if (!checkExist) {
      assetlist = [...assetlist, asset]
    }
  }

  useEffect(() => {
    props.getAllAsset({
      code: '',
      assetName: '',
      assetType: null,
      month: null,
      status: '',
      page: 0,
      limit: 10
    })
  }, [])

  // Bắt sự kiện thay đổi mã phiếu
  const handleMaintainanceCodeChange = (e) => {
    let { value } = e.target
    validateMaintainanceCode(value, true)
  }
  const validateMaintainanceCode = (value, willUpdateState = true) => {
    let { message } = ValidationHelper.validateCode(props.translate, value)

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnMaintainanceCode: message,
          maintainanceCode: value
        }
      })
    }
    return message === undefined
  }

  // Bắt sự kiện thay đổi "Ngày lập"
  const handleCreateDateChange = (value) => {
    validateCreateDate(value, true)
  }
  const validateCreateDate = (value, willUpdateState = true) => {
    let { message } = ValidationHelper.validateEmpty(props.translate, value)

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnCreateDate: message,
          createDate: value
        }
      })
    }
    return message === undefined
  }

  // Bắt sự kiện thay đổi loại phiếu
  const handleTypeChange = (value) => {
    if (value.length === 0) {
      value = ''
    }

    setState({
      ...state,
      type: value[0]
    })
  }

  /**
   * Bắt sự kiện thay đổi Mã tài sản
   */
  const handleAssetChange = (value) => {
    setState({
      ...state,
      asset: value[0]
    })
  }

  // Bắt sự kiện thay đổi "Nội dung"
  const handleDescriptionChange = (e) => {
    let { value } = e.target
    validateDescription(value, true)
  }
  const validateDescription = (value, willUpdateState = true) => {
    let { message } = ValidationHelper.validateEmpty(props.translate, value)

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnDescription: message,
          description: value
        }
      })
    }
    return message === undefined
  }

  // Bắt sự kiện thay đổi "Ngày thực hiện"
  const handleStartDateChange = (value) => {
    validateStartDate(value, true)
  }
  const validateStartDate = (value, willUpdateState = true) => {
    let { message } = ValidationHelper.validateEmpty(props.translate, value)

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnStartDate: message,
          startDate: value
        }
      })
    }
    return message === undefined
  }

  // Bắt sự kiện thay đổi "Ngày hoàn thành"
  const handleEndDateChange = (value) => {
    setState({
      ...state,
      endDate: value
    })
  }

  // Bắt sự kiện thay đổi "Chi phí"
  const handleExpenseChange = (e) => {
    let { value } = e.target
    validateExpense(value, true)
  }
  const validateExpense = (value, willUpdateState = true) => {
    let { message } = ValidationHelper.validateEmpty(props.translate, value)

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnExpense: message,
          expense: value
        }
      })
    }
    return message === undefined
  }

  // Bắt sự kiện thay đổi "Trạng thái phiếu"
  const handleStatusChange = (value) => {
    if (value.length === 0) {
      value = ''
    }

    setState({
      ...state,
      status: value[0]
    })
  }

  // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
  const isFormValidated = () => {
    let result = validateCreateDate(state.createDate, false)

    return result
  }

  // Bắt sự kiện submit form
  const save = () => {
    var partCreate = state.createDate.split('-')
    var createDate = [partCreate[2], partCreate[1], partCreate[0]].join('-')
    var partStart = state.startDate.split('-')
    var startDate = [partStart[2], partStart[1], partStart[0]].join('-')
    var partEnd = state.endDate.split('-')
    var endDate = [partEnd[2], partEnd[1], partEnd[0]].join('-')
    let assetId = !state.asset ? props.assetsManager.listAssets[0]._id : state.asset._id

    if (isFormValidated()) {
      let dataToSubit = {
        maintainanceCode: state.maintainanceCode,
        createDate: createDate,
        type: state.type,
        description: state.description,
        startDate: startDate,
        endDate: endDate,
        expense: state.expense,
        status: state.status,
        assetId
      }

      return props.updateMaintainance(props._id, dataToSubit)
    }
  }

  console.log(asset._id)
  console.log(assetlist)
  return (
    <React.Fragment>
      <DialogModal
        size='50'
        modalID='modal-edit-maintainance'
        isLoading={false}
        formID='form-create-maintainance'
        title={translate('asset.asset_info.edit_maintenance_card')}
        func={save}
        disableSubmit={!isFormValidated()}
      >
        {/* Form chỉnh sửa phiếu bỏ trì */}
        <form className='form-group' id='form-edit-maintainance'>
          <div className='col-md-12'>
            <div className='col-sm-6'>
              {/* Mã phiếu */}
              <div className={`form-group ${!errorOnMaintainanceCode ? '' : 'has-error'}`}>
                <label>{translate('asset.general_information.form_code')}</label>
                <input
                  type='text'
                  className='form-control'
                  name='maintainanceCode'
                  value={maintainanceCode}
                  onChange={handleMaintainanceCodeChange}
                  autoComplete='off'
                  placeholder={translate('asset.general_information.form_code')}
                />
                <ErrorLabel content={errorOnMaintainanceCode} />
              </div>

              {/* Ngày lập */}
              <div className={`form-group ${!errorOnCreateDate ? '' : 'has-error'}`}>
                <label>
                  {translate('asset.general_information.create_date')}
                  <span className='text-red'>*</span>
                </label>
                <DatePicker id={`edit-create-date${_id}`} value={createDate} onChange={handleCreateDateChange} />
                <ErrorLabel content={errorOnCreateDate} />
              </div>

              {/* Phân loại */}
              <div className='form-group'>
                <label>{translate('asset.general_information.type')}</label>
                <SelectBox
                  id={`edit-type-maintainance-asset${_id}`}
                  className='form-control select2'
                  style={{ width: '100%' }}
                  items={[
                    { value: '', text: '---Chọn phân loại---' },
                    { value: '1', text: translate('asset.asset_info.repair') },
                    { value: '2', text: translate('asset.asset_info.replace') },
                    { value: '3', text: translate('asset.asset_info.upgrade') }
                  ]}
                  value={type}
                  onChange={handleTypeChange}
                  multiple={false}
                />
              </div>

              {/* Tài sản */}
              <div className={`form-group`}>
                <label>{translate('asset.general_information.asset')}</label>
                <div>
                  <div id='edit-assetBox'>
                    <SelectBox
                      id={`edit-maintainance-asset${_id}`}
                      className='form-control select2'
                      style={{ width: '100%' }}
                      items={assetlist.map((x) => ({ value: x.id, text: x.code + ' - ' + x.assetName }))}
                      onChange={handleAssetChange}
                      value={asset.id}
                      multiple={false}
                      disabled
                    />
                  </div>
                </div>
              </div>

              {/* Nội dung */}
              <div className={`form-group ${!errorOnDescription ? '' : 'has-error'}`}>
                <label>{translate('asset.general_information.content')}</label>
                <textarea
                  className='form-control'
                  rows='3'
                  name='description'
                  value={description}
                  onChange={handleDescriptionChange}
                  autoComplete='off'
                  placeholder={translate('asset.general_information.content')}
                ></textarea>
                <ErrorLabel content={errorOnDescription} />
              </div>
            </div>

            <div className='col-sm-6'>
              {/* Ngày thực hiện */}
              <div className={`form-group ${!errorOnStartDate ? '' : 'has-error'}`}>
                <label>{translate('asset.general_information.start_date')}</label>
                <DatePicker id={`edit-start-date${_id}`} value={startDate} onChange={handleStartDateChange} />
                <ErrorLabel content={errorOnStartDate} />
              </div>

              {/* Ngày hoàn thành */}
              <div className='form-group'>
                <label>{translate('asset.general_information.end_date')}</label>
                <DatePicker id={`edit-end-date${_id}`} value={endDate} onChange={handleEndDateChange} />
              </div>

              {/* Chi phí */}
              <div className={`form-group ${!errorOnExpense ? '' : 'has-error'}`}>
                <label>{translate('asset.general_information.expense')} (VNĐ)</label>
                <input
                  type='number'
                  className='form-control'
                  name='expense'
                  value={expense}
                  onChange={handleExpenseChange}
                  autoComplete='off'
                  placeholder={translate('asset.general_information.expense')}
                />
                <ErrorLabel content={errorOnExpense} />
              </div>

              {/* Trạng thái */}
              <div className='form-group'>
                <label>{translate('asset.general_information.status')}</label>
                <SelectBox
                  id={`edit-status-maintainance-asset${_id}`}
                  className='form-control select2'
                  style={{ width: '100%' }}
                  items={[
                    { value: '', text: '---Chọn trạng thái---' },
                    { value: '1', text: translate('asset.asset_info.unfulfilled') },
                    { value: '2', text: translate('asset.asset_info.processing') },
                    { value: '3', text: translate('asset.asset_info.made') }
                  ]}
                  value={status}
                  onChange={handleStatusChange}
                  multiple={false}
                />
              </div>
            </div>
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

function mapState(state) {
  const { maintainance, assetsManager } = state
  return { maintainance, assetsManager }
}

const actionCreators = {
  getAllAsset: AssetManagerActions.getAllAsset,
  updateMaintainance: MaintainanceActions.updateMaintainance
}

const editForm = connect(mapState, actionCreators)(withTranslate(MaintainanceEditForm))
export { editForm as MaintainanceEditForm }
