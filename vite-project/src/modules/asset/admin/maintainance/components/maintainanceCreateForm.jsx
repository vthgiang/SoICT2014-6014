import React, { Component, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { ButtonModal, DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components'

import { AssetManagerActions } from '../../asset-information/redux/actions'
import { MaintainanceActions } from '../redux/actions'

import ValidationHelper from '../../../../../helpers/validationHelper'
import { generateCode } from '../../../../../helpers/generateCode'

function MaintainanceCreateForm(props) {
  // Function format dữ liệu Date thành string
  const formatDate = (date, monthYear = false) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()

    if (month.length < 2) {
      month = '0' + month
    }

    if (day.length < 2) {
      day = '0' + day
    }

    if (monthYear === true) {
      return [month, year].join('-')
    } else {
      return [day, month, year].join('-')
    }
  }
  const [state, setState] = useState({
    newMaintainance: {
      maintainanceCode: '',
      createDate: formatDate(Date.now()),
      type: '',
      asset: '',
      description: '',
      startDate: formatDate(Date.now()),
      endDate: formatDate(Date.now()),
      expense: '',
      status: ''
    }
  })
  const { id, translate, assetsManager } = props
  const { errorOnMaintainanceCode, errorOnCreateDate, errorOnStartDate, assetError } = state
  const { maintainanceCode, createDate, type, asset, description, startDate, endDate, expense, status } = state.newMaintainance

  let assetlist = assetsManager.listAssets
  if (assetlist) {
    assetlist = assetlist.map((x) => {
      return { value: x._id, text: x.code + ' - ' + x.assetName }
    })
    assetlist.unshift({ value: '', text: `---${translate('asset.general_information.choose_asset')}---` })
  }

  const regenerateCode = () => {
    let code = generateCode('MT')
    const { newMaintainance } = state

    setState((state) => {
      return {
        ...state,
        newMaintainance: {
          ...newMaintainance,
          maintainanceCode: code
        }
      }
    })
  }

  useEffect(() => {
    window.$('#modal-create-maintainance').on('shown.bs.modal', regenerateCode)
    props.getAllAsset({ page: 0, limit: 20 })
    return () => {
      window.$('#modal-create-maintainance').unbind('shown.bs.modal', regenerateCode)
    }
  }, [])

  // Bắt sự kiện thay đổi mã phiếu
  const handleMaintainanceCodeChange = (e) => {
    const { newMaintainance } = state
    let { value } = e.target

    setState({
      ...state,
      newMaintainance: {
        ...newMaintainance,
        maintainanceCode: value
      }
    })
  }

  // Bắt sự kiện thay đổi "Ngày lập"
  const handleCreateDateChange = (value) => {
    const { newMaintainance } = state
    const { translate } = props

    let { message } = ValidationHelper.validateEmpty(translate, value)

    setState({
      ...state,
      newMaintainance: {
        ...newMaintainance,
        createDate: value
      },
      errorOnCreateDate: message
    })
  }

  // Bắt sự kiện thay đổi loại phiếu
  const handleTypeChange = (e) => {
    const { newMaintainance } = state
    let { value } = e.target

    setState({
      ...state,
      newMaintainance: {
        ...newMaintainance,
        type: value
      }
    })
  }

  /**
   * Bắt sự kiện thay đổi Mã tài sản
   */
  const handleAssetChange = (value) => {
    const { newMaintainance } = state
    const { translate } = props
    let { message } = ValidationHelper.validateName(translate, value[0], 4, 255)

    setState({
      ...state,
      newMaintainance: {
        ...newMaintainance,
        asset: value[0]
      },
      assetError: message
    })
  }

  // Bắt sự kiện thay đổi "Nội dung"
  const handleDescriptionChange = (e) => {
    const { newMaintainance } = state
    let { value } = e.target

    setState({
      ...state,
      newMaintainance: {
        ...newMaintainance,
        description: value
      }
    })
  }

  // Bắt sự kiện thay đổi "Ngày thực hiện"
  const handleStartDateChange = (value) => {
    const { newMaintainance } = state
    const { translate } = props

    let { message } = ValidationHelper.validateEmpty(translate, value)
    setState({
      ...state,
      newMaintainance: {
        ...newMaintainance,
        startDate: value
      },
      errorOnStartDate: message
    })
  }

  // Bắt sự kiện thay đổi "Ngày hoàn thành"
  const handleEndDateChange = (value) => {
    const { newMaintainance } = state

    setState({
      ...state,
      newMaintainance: {
        ...newMaintainance,
        endDate: value
      }
    })
  }

  // Bắt sự kiện thay đổi "Chi phí"
  const handleExpenseChange = (e) => {
    let { value } = e.target
    const { newMaintainance } = state

    setState({
      ...state,
      newMaintainance: {
        ...newMaintainance,
        expense: value
      }
    })
  }

  // Bắt sự kiện thay đổi "Trạng thái phiếu"
  const handleStatusChange = (e) => {
    const { newMaintainance } = state
    let { value } = e.target

    setState({
      ...state,
      newMaintainance: {
        ...newMaintainance,
        status: value
      }
    })
  }

  // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
  const isFormValidated = () => {
    const { maintainanceCode, asset, startDate } = state.newMaintainance
    const { translate } = props

    if (
      // !ValidationHelper.validateName(translate, maintainanceCode).status
      // ||
      !ValidationHelper.validateName(translate, asset).status ||
      !ValidationHelper.validateName(translate, startDate).status
    )
      return false
    return true
  }

  // Bắt sự kiện submit form
  const save = () => {
    let { maintainanceCode, createDate, type, asset, description, startDate, endDate, expense, status } = state.newMaintainance

    const partCreate = createDate.split('-')
    const createDateConverted = [partCreate[2], partCreate[1], partCreate[0]].join('-')

    const partStart = startDate.split('-')
    const startDateConverted = [partStart[2], partStart[1], partStart[0]].join('-')

    const partEnd = endDate.split('-')
    const endDateConverted = [partEnd[2], partEnd[1], partEnd[0]].join('-')

    if (isFormValidated()) {
      let dataToSubit = {
        maintainanceCode: maintainanceCode,
        createDate: createDateConverted,
        type: type,
        description: description,
        startDate: startDateConverted,
        endDate: endDateConverted,
        expense: expense,
        status: status
      }

      return props.createMaintainance(asset, dataToSubit)
    }
  }

  const onSearch = (value) => {
    props.getAllAsset({ assetName: value, page: 0, limit: 10 })
  }

  return (
    <React.Fragment>
      <ButtonModal
        modalID='modal-create-maintainance'
        button_name={translate('asset.general_information.add')}
        title={translate('asset.asset_info.add_maintenance_card')}
      />
      <DialogModal
        size='50'
        modalID='modal-create-maintainance'
        formID='form-create-maintainance'
        title={translate('asset.asset_info.add_maintenance_card')}
        func={save}
        disableSubmit={!isFormValidated()}
      >
        {/* Form thêm phiếu bảo trì */}
        <form className='form-group' id='form-create-maintainance'>
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
                <DatePicker id={`add-create-date${id}`} value={createDate} onChange={handleCreateDateChange} />
                <ErrorLabel content={errorOnCreateDate} />
              </div>

              {/* Phân loại */}
              <div className='form-group'>
                <label>{translate('asset.general_information.type')}</label>
                <select className='form-control' value={type} name='type' onChange={handleTypeChange}>
                  <option value=''>{`---${translate('asset.general_information.choose_type')}---`}</option>
                  <option value='1'>{translate('asset.asset_info.repair')}</option>
                  <option value='2'>{translate('asset.asset_info.replace')}</option>
                  <option value='3'>{translate('asset.asset_info.upgrade')}</option>
                </select>
              </div>

              {/* Tài sản */}
              <div className={`form-group ${!assetError ? '' : 'has-error'}`}>
                <label>
                  {translate('asset.general_information.asset')} <span className='text-red'>*</span>
                </label>
                <SelectBox
                  id={`create-timesheets-employee`}
                  className='form-control select2'
                  style={{ width: '100%' }}
                  items={assetlist}
                  onChange={handleAssetChange}
                  value={asset}
                  multiple={false}
                  onSearch={onSearch}
                />
                <ErrorLabel content={assetError} />
              </div>

              {/* Nội dung */}
              <div className={`form-group`}>
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
              </div>
            </div>

            <div className='col-sm-6'>
              {/* Ngày thực hiện */}
              <div className={`form-group ${!errorOnStartDate ? '' : 'has-error'}`}>
                <label>{translate('asset.general_information.start_date')}</label>
                <DatePicker id={`add-start-date${id}`} value={startDate} onChange={handleStartDateChange} />
                <ErrorLabel content={errorOnStartDate} />
              </div>

              {/* Ngày hoàn thành */}
              <div className='form-group'>
                <label>{translate('asset.general_information.end_date')}</label>
                <DatePicker id={`add-end-date${id}`} value={endDate} onChange={handleEndDateChange} />
              </div>

              {/* Chi phí */}
              <div className={`form-group`}>
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
              </div>

              {/* Trạng thái */}
              <div className='form-group'>
                <label>{translate('asset.general_information.status')}</label>
                <select className='form-control' value={status} name='status' onChange={handleStatusChange}>
                  <option value=''>{`---${translate('asset.general_information.choose_status')}---`}</option>
                  <option value='1'>{translate('asset.asset_info.unfulfilled')}</option>
                  <option value='2'>{translate('asset.asset_info.processing')}</option>
                  <option value='3'>{translate('asset.asset_info.made')}</option>
                </select>
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
  createMaintainance: MaintainanceActions.createMaintainance
}

const createForm = connect(mapState, actionCreators)(withTranslate(MaintainanceCreateForm))
export { createForm as MaintainanceCreateForm }
