import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import moment from 'moment'

import { DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components'

import { DepreciationActions } from '../redux/actions'

import ValidationHelper from '../../../../../helpers/validationHelper'

function DepreciationEditForm(props) {
  const [state, setState] = useState({})
  const [prevProps, setPrevProps] = useState({
    _id: null
  })
  const { _id } = props
  const { translate, assetsManager } = props
  const {
    asset,
    cost,
    residualValue,
    usefulLife,
    startDepreciation,
    depreciationType,
    endDepreciation,
    annualDepreciationValue,
    monthlyDepreciationValue,
    errorOnCost,
    errorOnStartDepreciation,
    errorOnDepreciationType,
    errorOnUsefulLife,
    errorOnMonth,
    errorOnValue,
    unitsProducedDuringTheYears,
    errorOnEstimatedTotalProduction,
    estimatedTotalProduction
  } = state

  var assetlist = assetsManager.listAssets

  if (prevProps._id !== props._id) {
    setState({
      ...state,
      _id: props._id,
      asset: props.asset,
      cost: props.cost,
      residualValue: props.residualValue,
      usefulLife: props.usefulLife,
      startDepreciation: props.startDepreciation,
      endDepreciation: props.endDepreciation,
      depreciationType: props.depreciationType,
      estimatedTotalProduction: props.estimatedTotalProduction,
      unitsProducedDuringTheYears: props.unitsProducedDuringTheYears,
      errorOnStartDepreciation: undefined,
      errorOnUsefulLife: undefined
    })
    setPrevProps(props)
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

  /**
   * Bắt sự kiện thay đổi nguyên giá
   */
  const handleCostChange = (e) => {
    const { value } = e.target
    validateCost(value, true)
  }
  const validateCost = (value, willUpdateState = true) => {
    let { message } = ValidationHelper.validateEmpty(props.translate, value)

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnCost: message,
          cost: value
        }
      })
    }
    return message === undefined
  }

  /**
   * Bắt sự kiện thay đổi Giá trị thu hồi dự tính
   */
  const handleResidualValueChange = (e) => {
    const { value } = e.target
    validateResidualValue(value, true)
  }
  const validateResidualValue = (value, willUpdateState = true) => {
    let { message } = ValidationHelper.validateEmpty(props.translate, value)

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnResidualValue: message,
          residualValue: value
        }
      })
    }
    return message === undefined
  }

  /**
   * Bắt sự kiện thay đổi Thời gian trích khấu hao
   */
  const handleUsefulLifeChange = (e) => {
    const { value } = e.target
    validateUsefulLife(value, true)
  }
  const validateUsefulLife = (value, willUpdateState = true) => {
    let { message } = ValidationHelper.validateEmpty(props.translate, value)

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnUsefulLife: message,
          usefulLife: value
        }
      })
    }
    return message === undefined
  }

  /**
   * Bắt sự kiện thay đổi Thời gian bắt đầu trích khấu hao
   */
  const handleStartDepreciationChange = (value) => {
    validateStartDepreciation(value, true)
  }
  const validateStartDepreciation = (value, willUpdateState = true) => {
    let { message } = ValidationHelper.validateEmpty(props.translate, value)

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnStartDepreciation: message,
          startDepreciation: value
        }
      })
    }
    return message === undefined
  }

  /**
   * Bắt sự kiện thay đổi sản lượng theo công suất thiết kế (trong 1 năm)
   */
  const handleEstimatedTotalProductionChange = (e) => {
    const { value } = e.target
    validateEstimatedTotalProduction(value, true)
  }
  const validateEstimatedTotalProduction = (value, willUpdateState = true) => {
    let { message } = ValidationHelper.validateEmpty(props.translate, value)

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnEstimatedTotalProduction: message,
          estimatedTotalProduction: value
        }
      })
    }
    return message === undefined
  }

  /**
   * Bắt sự kiện thay đổi phương pháp khấu hao
   */
  const handleDepreciationTypeChange = (value) => {
    setState({
      ...state,
      depreciationType: value[0]
    })
  }

  const addMonthToEndDepreciation = (day) => {
    if (day) {
      let { usefulLife } = state,
        splitDay = day.toString().split('-'),
        currentDate = moment(`${splitDay[2]}-${splitDay[1]}-${splitDay[0]}`),
        futureMonth = moment(currentDate).add(usefulLife, 'M'),
        futureMonthEnd = moment(futureMonth).endOf('month')

      if (currentDate.date() !== futureMonth.date() && futureMonth.isSame(futureMonthEnd.format('YYYY-MM-DD'))) {
        futureMonth = futureMonth.add(1, 'd')
      }

      return futureMonth.format('DD-MM-YYYY')
    }
  }

  // function kiểm tra các trường bắt buộc phải nhập
  const validatorInput = (value) => {
    if (value && value.toString().trim() !== '') {
      return true
    }

    return false
  }

  // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
  const isFormValidated = () => {
    let unitProductionValidate = true

    if (state.depreciationType === 'units_of_production') {
      let { unitsProducedDuringTheYears, estimatedTotalProduction } = state
      let check = true

      if (unitsProducedDuringTheYears && unitsProducedDuringTheYears.length !== 0) {
        for (let n in unitsProducedDuringTheYears) {
          check =
            validateYear(unitsProducedDuringTheYears[n].month, n, false) &&
            validateValue(unitsProducedDuringTheYears[n].unitsProducedDuringTheYear, n, false)
          if (!check) {
            break
          }
        }
      }

      unitProductionValidate = check && validateEstimatedTotalProduction(estimatedTotalProduction, false)
    }

    let result =
      validateStartDepreciation(state.startDepreciation, false) && validatorInput(state.depreciationType) && unitProductionValidate

    return result
  }

  /**
   * Bắt sự kiện click thêm thông tin sản lượng sản phẩm
   */
  const handleAddUnitsProduced = () => {
    var unitsProducedDuringTheYears = state.unitsProducedDuringTheYears

    if (unitsProducedDuringTheYears && unitsProducedDuringTheYears.length !== 0) {
      let result

      for (let n in unitsProducedDuringTheYears) {
        result =
          validateYear(unitsProducedDuringTheYears[n].month, n) &&
          validateValue(unitsProducedDuringTheYears[n].unitsProducedDuringTheYear, n)
        if (!result) {
          validateYear(unitsProducedDuringTheYears[n].month, n)
          validateValue(unitsProducedDuringTheYears[n].unitsProducedDuringTheYear, n)
          break
        }
      }

      if (result) {
        setState({
          ...state,
          unitsProducedDuringTheYears: [...unitsProducedDuringTheYears, { month: '', unitsProducedDuringTheYear: '' }]
        })
      }
    } else {
      setState({
        ...state,
        unitsProducedDuringTheYears: [{ month: '', unitsProducedDuringTheYear: '' }]
      })
    }
  }

  /**
   * Bắt sự kiện chỉnh sửa tên trường tháng sản lượng sản phẩm
   */
  const handleMonthChange = (value, index) => {
    validateYear(value, index)
  }
  const validateYear = (value, index, willUpdateState = true) => {
    let time = value.split('-')
    let date = new Date(time[1], time[0], 0)
    let partDepreciation = state.startDepreciation.split('-')
    let startDepreciation = [partDepreciation[2], partDepreciation[1], partDepreciation[0]].join('-')

    let partEndDepreciation = state.endDepreciation.split('-')
    let endDepreciation = [partEndDepreciation[2], partEndDepreciation[1], partEndDepreciation[0]].join('-')

    let msg = undefined

    if (value.toString().trim() === '') {
      msg = 'Tháng sản lượng sản phẩm không được để trống'
    } else if (date.getTime() < new Date(startDepreciation).getTime()) {
      msg = 'Tháng sản lượng sản phẩm không được trước ngày bắt đầu tính khấu hao'
    } else if (date.getTime() > new Date(endDepreciation).getTime()) {
      msg = 'Tháng sản lượng sản phẩm không được sau ngày kết thúc tính khấu hao'
    }

    if (willUpdateState) {
      var { unitsProducedDuringTheYears } = state
      unitsProducedDuringTheYears[index] = { ...unitsProducedDuringTheYears[index], month: value }
      setState((state) => {
        return {
          ...state,
          errorOnMonth: msg,
          unitsProducedDuringTheYears: unitsProducedDuringTheYears
        }
      })
    }

    return msg === undefined
  }

  /**
   * Bắt sự kiện chỉnh sửa giá trị trường giá trị sản lượng sản phẩm
   */
  const handleChangeValue = (e, index) => {
    var { value } = e.target
    validateValue(value, index)
  }
  const validateValue = (value, className, willUpdateState = true) => {
    let { message } = ValidationHelper.validateEmpty(props.translate, value)

    if (willUpdateState) {
      var { unitsProducedDuringTheYears } = state
      unitsProducedDuringTheYears[className] = { ...unitsProducedDuringTheYears[className], unitsProducedDuringTheYear: value }
      setState((state) => {
        return {
          ...state,
          errorOnValue: message,
          unitsProducedDuringTheYears: unitsProducedDuringTheYears
        }
      })
    }
    return message === undefined
  }

  /**
   * Bắt sự kiện xóa thông tin sản lượng sản phẩm
   */
  const delete_function = (index) => {
    var { unitsProducedDuringTheYears } = state
    unitsProducedDuringTheYears.splice(index, 1)
    setState({
      ...state,
      unitsProducedDuringTheYears: unitsProducedDuringTheYears
    })
    if (unitsProducedDuringTheYears.length !== 0) {
      for (let n in unitsProducedDuringTheYears) {
        validateYear(unitsProducedDuringTheYears[n].month, n)
        validateValue(unitsProducedDuringTheYears[n].unitsProducedDuringTheYear, n)
      }
    } else {
      setState({
        ...state,
        errorOnValue: undefined,
        errorOnMonth: undefined
      })
    }
  }

  const save = () => {
    var partDepreciation = state.startDepreciation.split('-')
    var startDepreciation = [partDepreciation[2], partDepreciation[1], partDepreciation[0]].join('-')
    let assetId = !state.asset ? props.assetsManager.listAssets[0]._id : state.asset._id

    if (isFormValidated()) {
      let dataToSubmit = {
        cost: state.cost,
        usefulLife: state.usefulLife,
        startDepreciation: startDepreciation,
        residualValue: state.residualValue,
        depreciationType: state.depreciationType,
        estimatedTotalProduction: state.estimatedTotalProduction,
        unitsProducedDuringTheYears: state.unitsProducedDuringTheYears.map((x) => ({
          month: x.month,
          unitsProducedDuringTheYear: x.unitsProducedDuringTheYear
        })),
        assetId
      }
      return props.updateDepreciation(props._id, dataToSubmit)
    }
  }

  return (
    <React.Fragment>
      <DialogModal
        size='50'
        modalID='modal-edit-depreciation'
        formID='form-edit-depreciation'
        title={translate('asset.depreciation.edit_depreciation')}
        func={save}
        disableSubmit={!isFormValidated()}
      >
        {/* Form chỉnh sửa thông tin khấu hao */}
        <form className='form-group' id='form-edit-depreciation'>
          {/* Tài sản */}
          <div className='col-md-12'>
            <div className={`form-group`}>
              <label>{translate('asset.general_information.asset')}</label>
              <div>
                <div id='assetUBox'>
                  <SelectBox
                    id={`edit-incident-asset${_id}`}
                    className='form-control select2'
                    style={{ width: '100%' }}
                    items={assetlist.map((x) => ({ value: x._id, text: x.code + ' - ' + x.assetName }))}
                    onChange={handleAssetChange}
                    value={_id}
                    multiple={false}
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Nguyên giá */}
            <div className={`form-group ${!errorOnCost ? '' : 'has-error'} `}>
              <label htmlFor='cost'>
                {translate('asset.general_information.original_price')} (VNĐ)<span className='text-red'>*</span>
              </label>
              <br />
              <input
                type='number'
                className='form-control'
                name='cost'
                value={cost}
                onChange={handleCostChange}
                placeholder={translate('asset.general_information.original_price')}
                autoComplete='off'
              />
              <ErrorLabel content={errorOnCost} />
            </div>

            {/* Giá trị thu hồi ước tính */}
            <div className={`form-group`}>
              <label htmlFor='residualValue'>{translate('asset.general_information.residual_price')} (VNĐ)</label>
              <br />
              <input
                type='number'
                className='form-control'
                name='residualValue'
                value={residualValue}
                onChange={handleResidualValueChange}
                placeholder={translate('asset.general_information.residual_price')}
                autoComplete='off'
              />
            </div>

            {/* Thời gian sử dụng */}
            <div className={`form-group ${!errorOnUsefulLife ? '' : 'has-error'} `}>
              <label htmlFor='usefulLife'>
                {translate('asset.asset_info.usage_time')} (Tháng)<span className='text-red'>*</span>
              </label>
              <input
                type='number'
                className='form-control'
                name='usefulLife'
                value={usefulLife}
                onChange={handleUsefulLifeChange}
                placeholder={translate('asset.asset_info.usage_time')}
                autoComplete='off'
              />
              <ErrorLabel content={errorOnUsefulLife} />
            </div>

            {/* Thời gian bắt đầu trích khấu hao */}
            <div className={`form-group ${!errorOnStartDepreciation ? '' : 'has-error'} `}>
              <label htmlFor='startDepreciation'>
                {translate('asset.general_information.start_depreciation')}
                <span className='text-red'>*</span>
              </label>
              <DatePicker id={`startDepreciation${_id}`} value={startDepreciation} onChange={handleStartDepreciationChange} />
              <ErrorLabel content={errorOnStartDepreciation} />
            </div>

            {/* Phương pháp khấu hao */}
            <div className={`form-group ${!errorOnDepreciationType ? '' : 'has-error'}`}>
              <label htmlFor='depreciationType'>
                {translate('asset.general_information.depreciation_type')}
                <span className='text-red'>*</span>
              </label>
              <SelectBox
                id={`depreciationType${_id}`}
                className='form-control select2'
                style={{ width: '100%' }}
                value={depreciationType}
                items={[
                  { value: '', text: `---${translate('asset.depreciation.select_depreciation_type')}---` },
                  { value: 'straight_line', text: translate('asset.depreciation.line') },
                  { value: 'declining_balance', text: translate('asset.depreciation.declining_balance') },
                  { value: 'units_of_production', text: translate('asset.depreciation.units_production') }
                ]}
                onChange={handleDepreciationTypeChange}
              />
              <ErrorLabel content={errorOnDepreciationType} />
            </div>

            {/* Sản lượng theo công suất thiết kế */}
            {depreciationType == 'units_of_production' && (
              <div className={`form-group ${!errorOnEstimatedTotalProduction ? '' : 'has-error'} `}>
                <label htmlFor='estimatedTotalProduction'>
                  {translate('asset.depreciation.estimated_production')}
                  <span className='text-red'>*</span>
                </label>
                <input
                  type='number'
                  className='form-control'
                  name='estimatedTotalProduction'
                  value={estimatedTotalProduction}
                  onChange={handleEstimatedTotalProductionChange}
                  placeholder={translate('asset.depreciation.estimated_production')}
                  autoComplete='off'
                />
                <ErrorLabel content={errorOnEstimatedTotalProduction} />
              </div>
            )}

            {/* Sản lượng sản phẩm trong các năm */}
            {depreciationType == 'units_of_production' && (
              <div className='col-md-12' style={{ paddingLeft: '0px' }}>
                <label>
                  {translate('asset.depreciation.months_production')}:
                  <a style={{ cursor: 'pointer' }} title={translate('asset.general_information.asset_properties')}>
                    <i className='fa fa-plus-square' style={{ color: '#28A745', marginLeft: 5 }} onClick={handleAddUnitsProduced} />
                  </a>
                </label>
                <div className={`form-group ${!errorOnMonth && !errorOnValue ? '' : 'has-error'}`}>
                  {/* Bảng thông tin chi tiết */}
                  <table className='table table-bordered'>
                    <thead>
                      <tr>
                        <th style={{ paddingLeft: '0px' }}>{translate('page.month')}</th>
                        <th style={{ paddingLeft: '0px' }}>{translate('asset.depreciation.production')}</th>
                        <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!unitsProducedDuringTheYears || unitsProducedDuringTheYears.length === 0 ? (
                        <tr>
                          <td colSpan={3}>
                            <center> {translate('table.no_data')}</center>
                          </td>
                        </tr>
                      ) : (
                        unitsProducedDuringTheYears.map((x, index) => {
                          return (
                            <tr key={index}>
                              <td style={{ paddingLeft: '0px' }}>
                                <DatePicker
                                  id={index}
                                  dateFormat='month-year'
                                  value={x.month}
                                  onChange={(e) => handleMonthChange(e, index)}
                                />
                              </td>
                              <td style={{ paddingLeft: '0px' }}>
                                <input
                                  className='form-control'
                                  type='number'
                                  value={x.unitsProducedDuringTheYear}
                                  name='unitsProducedDuringTheYears'
                                  style={{ width: '100%' }}
                                  onChange={(e) => handleChangeValue(e, index)}
                                />
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <a className='delete' title='Delete' data-toggle='tooltip' onClick={() => delete_function(index)}>
                                  <i className='material-icons'></i>
                                </a>
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                  <ErrorLabel content={errorOnMonth} />
                  <ErrorLabel content={errorOnValue} />
                </div>
              </div>
            )}
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

function mapState(state) {
  const { assetsManager } = state
  return { assetsManager }
}

const actionCreators = {
  updateDepreciation: DepreciationActions.updateDepreciation
}

const editForm = connect(mapState, actionCreators)(withTranslate(DepreciationEditForm))
export { editForm as DepreciationEditForm }
