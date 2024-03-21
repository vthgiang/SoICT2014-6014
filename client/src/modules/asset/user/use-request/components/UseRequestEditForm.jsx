import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DialogModal, TimePicker, ErrorLabel, DatePicker, SelectBox } from '../../../../../common-components'

import { RecommendDistributeActions } from '../redux/actions'
import { AssetManagerActions } from '../../../admin/asset-information/redux/actions'
import { UserActions } from '../../../../super-admin/user/redux/actions'

import ValidationHelper from '../../../../../helpers/validationHelper'
import { taskManagementActions } from '../../../../task/task-management/redux/actions'

function UseRequestEditForm(props) {
  const [state, setState] = useState({
    startTime: null,
    stopTime: null
  })
  const [prevProps, setPrevProps] = useState({
    _id: null
  })

  const getAll = true

  useEffect(() => {
    let data = { getAll }
    props.getPaginateTasks(data)
  }, [])

  const formatDate = (date) => {
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

    return [day, month, year].join('-')
  }
  // Bắt sự kiện thay đổi mã phiếu
  const handleRecommendNumberChange = (e) => {
    let value = e.target.value
    validateRecommendNumber(value, true)
  }
  const validateRecommendNumber = (value, willUpdateState = true) => {
    let { message } = ValidationHelper.validateCode(props.translate, value)

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnRecommendNumber: message,
          recommendNumber: value
        }
      })
    }
    return message === undefined
  }

  // Bắt sự kiện thay đổi "Ngày lập"
  const handleDateCreateChange = (value) => {
    validateDateCreate(value, true)
  }
  const validateDateCreate = (value, willUpdateState = true) => {
    let { message } = ValidationHelper.validateCode(props.translate, value)

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnDateCreate: message,
          dateCreate: value
        }
      })
    }
    return message === undefined
  }

  /**
   * Bắt sự kiện thay đổi người đề nghị
   */
  const handleProponentChange = (value) => {
    setState((state) => {
      return {
        ...state,
        proponent: value[0]
      }
    })
  }

  // Bắt sự kiện thay đổi "Nội dung đề nghị"
  const handleReqContentChange = (e) => {
    let value = e.target.value
    validateReqContent(value, true)
  }
  const validateReqContent = (value, willUpdateState = true) => {
    let { message } = ValidationHelper.validateCode(props.translate, value)

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnReqContent: message,
          reqContent: value
        }
      })
    }
    return message === undefined
  }

  /**
   * Bắt sự kiện thay đổi tài sản
   */
  const handleAssetChange = (value) => {
    setState((state) => {
      return {
        ...state,
        asset: value[0]
      }
    })
  }

  /**
   * Bắt sự kiện thay đổi công việc
   */
  const handleTaskChange = (value) => {
    setState((state) => {
      return {
        ...state,
        task: value[0]
      }
    })
  }

  // Bắt sự kiện thay đổi "Thời gian đăng ký sử dụng từ ngày"
  const handleDateStartUseChange = (value) => {
    validateDateStartUse(value, true)
  }
  const validateDateStartUse = (value, willUpdateState = true) => {
    let { message } = ValidationHelper.validateCode(props.translate, value)

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnDateStartUse: message,
          dateStartUse: value
        }
      })
    }
    return message === undefined
  }

  // Bắt sự kiện thay đổi "Thời gian đăng ký sử dụng đến ngày"
  const handleDateEndUseChange = (value) => {
    validateDateEndUse(value, true)
  }
  const validateDateEndUse = (value, willUpdateState = true) => {
    let { message } = ValidationHelper.validateCode(props.translate, value)

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnDateEndUse: message,
          dateEndUse: value
        }
      })
    }
    return message === undefined
  }

  const handleStartTimeChange = (value) => {
    setState((state) => {
      return {
        ...state,
        startTime: value
      }
    })
  }

  const handleStopTimeChange = (value) => {
    setState((state) => {
      return {
        ...state,
        stopTime: value
      }
    })
  }
  // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
  const isFormValidated = () => {
    let result =
      validateDateCreate(state.dateCreate, false) &&
      validateReqContent(state.reqContent, false) &&
      validateDateStartUse(state.dateCreate, false)

    return result
  }

  const save = () => {
    if (isFormValidated()) {
      return props.updateRecommendDistribute(state._id, state)
    }
  }

  if (prevProps._id !== props._id) {
    let startTime, stopTime
    if (props.asset.typeRegisterForUse == 2) {
      let dateStartUse = new Date(props.dateStartUse),
        dateEndUse = new Date(props.dateEndUse)
      let hourStart = dateStartUse.getHours(),
        minutesStart = dateStartUse.getMinutes(),
        hourEnd = dateEndUse.getHours(),
        minutesEnd = dateEndUse.getMinutes()
      if (hourStart < 10) {
        hourStart = '0' + hourStart
      }

      if (hourEnd < 10) {
        hourEnd = '0' + hourEnd
      }

      startTime = [hourStart, minutesStart].join(':')
      stopTime = [hourEnd, minutesEnd].join(':')
    }
    setState((state) => {
      return {
        ...state,
        _id: props._id,
        recommendNumber: props.recommendNumber,
        dateCreate: formatDate(props.dateCreate),
        proponent: props.proponent,
        reqContent: props.reqContent,
        asset: props.asset,
        dateStartUse: props.dateStartUse,
        dateEndUse: props.dateEndUse,
        startTime: props.asset.typeRegisterForUse == 2 ? startTime : null,
        stopTime: props.asset.typeRegisterForUse == 2 ? stopTime : null,
        approver: props.approver,
        status: props.status,
        note: props.note,
        task: props.task ? props.task._id : '',
        errorOnRecommendNumber: undefined,
        errorOnDateCreate: undefined,
        errorOnReqContent: undefined,
        errorOnDateStartUse: undefined,
        errorOnDateEndUse: undefined
      }
    })
    setPrevProps(props)
  }

  const { _id } = props
  const { translate, recommendDistribute, user, assetsManager, auth, tasks } = props
  const {
    recommendNumber,
    dateCreate,
    proponent,
    asset,
    reqContent,
    dateStartUse,
    dateEndUse,
    errorOnRecommendNumber,
    errorOnDateCreate,
    errorOnReqContent,
    errorOnDateStartUse,
    errorOnDateEndUse,
    startTime,
    stopTime,
    status,
    note,
    task
  } = state

  var assetlist = assetsManager.listAssets
  var userlist = user.list
  var taskList =
    tasks.tasks &&
    tasks.tasks.map((x) => {
      return { value: x._id, text: x.name }
    })

  return (
    <React.Fragment>
      <DialogModal
        size='50'
        modalID='modal-edit-recommenddistribute'
        isLoading={recommendDistribute.isLoading}
        formID='form-edit-recommenddistribute'
        title={translate('asset.asset_info.edit_usage_info')}
        func={save}
        disableSubmit={!isFormValidated()}
      >
        {/* Form chỉnh sửa thông tin đăng ký sử dụng tài sản */}
        <form className='form-group' id='form-edit-recommenddistribute'>
          <div className='col-md-12'>
            <div className='col-sm-6'>
              {/* Mã phiếu */}
              <div className={`form-group ${!errorOnRecommendNumber ? '' : 'has-error'}`}>
                <label>{translate('asset.general_information.form_code')}</label>
                <input
                  type='text'
                  className='form-control'
                  name='recommendNumber'
                  value={recommendNumber}
                  onChange={handleRecommendNumberChange}
                  autoComplete='off'
                  placeholder='Mã phiếu'
                />
                <ErrorLabel content={errorOnRecommendNumber} />
              </div>

              {/* Ngày lập */}
              <div className={`form-group ${!errorOnDateCreate ? '' : 'has-error'}`}>
                <label>
                  {translate('asset.general_information.create_date')}
                  <span className='text-red'>*</span>
                </label>
                <DatePicker id={`edit_start_date${_id}`} value={dateCreate} onChange={handleDateCreateChange} />
                <ErrorLabel content={errorOnDateCreate} />
              </div>

              {/* Người đề nghị */}
              <div className={`form-group`}>
                <label>{translate('asset.usage.proponent')}</label>
                <div>
                  <div id='proponentBox'>
                    <SelectBox
                      id={`proponent${_id}`}
                      className='form-control select2'
                      style={{ width: '100%' }}
                      items={userlist.map((x) => {
                        return { value: x._id, text: x.name + ' - ' + x.email }
                      })}
                      onChange={handleProponentChange}
                      value={proponent ? proponent._id : null}
                      multiple={false}
                      disabled
                    />
                  </div>
                </div>
              </div>

              {/* Nội dung đề nghị */}
              <div className={`form-group ${!errorOnReqContent ? '' : 'has-error'}`}>
                <label>
                  {translate('asset.general_information.content')}
                  <span className='text-red'>*</span>
                </label>
                <textarea
                  className='form-control'
                  rows='3'
                  name='reqContent'
                  value={reqContent}
                  onChange={handleReqContentChange}
                  autoComplete='off'
                  placeholder='Nội dung đề nghị'
                ></textarea>
                <ErrorLabel content={errorOnReqContent} />
              </div>

              {/* Ghi chú */}
              <div className='form-group'>
                <label>{translate('asset.usage.note')}</label>
                <textarea className='form-control' rows='3' name='note' value={note} disabled></textarea>
              </div>
            </div>

            <div className='col-sm-6'>
              {/* Tài sản */}
              <div className={`form-group`}>
                <label>{translate('asset.general_information.asset')}</label>
                <div>
                  <div id='assetUBox'>
                    <SelectBox
                      id={`asset${_id}`}
                      className='form-control select2'
                      style={{ width: '100%' }}
                      items={assetlist.map((x) => {
                        return { value: x._id, text: x.code + ' - ' + x.assetName }
                      })}
                      onChange={handleAssetChange}
                      value={asset ? asset._id : null}
                      multiple={false}
                      disabled
                    />
                  </div>
                </div>
              </div>

              {/* Thời gian đăng ký sử dụng từ ngày */}
              <div className={`form-group ${!errorOnDateStartUse ? '' : 'has-error'}`}>
                <label>
                  {translate('asset.general_information.handover_from_date')}
                  <span className='text-red'>*</span>
                </label>
                <DatePicker id={`edit_start_use${_id}`} value={formatDate(dateStartUse)} onChange={handleDateStartUseChange} />
                {props.asset.typeRegisterForUse == 2 && (
                  <TimePicker
                    id={`time-picker-start`}
                    onChange={handleStartTimeChange}
                    value={startTime}
                    // getDefaultValue = {getDefaultStartValue}
                  />
                )}
                <ErrorLabel content={errorOnDateStartUse} />
              </div>

              {/* Thời gian đăng ký sử dụng đến ngày */}
              <div className={`form-group ${!errorOnDateEndUse ? '' : 'has-error'}`}>
                <label>{translate('asset.general_information.handover_to_date')}</label>
                <DatePicker id={`edit_end_use${_id}`} value={formatDate(dateEndUse)} onChange={handleDateEndUseChange} />
                {props.asset.typeRegisterForUse == 2 && (
                  <TimePicker
                    id={`time-picker-end`}
                    onChange={handleStopTimeChange}
                    value={stopTime}
                    // getDefaultValue = {getDefaultEndValue}
                  />
                )}
                <ErrorLabel content={errorOnDateEndUse} />
              </div>

              {/* công việc*/}
              <div className='form-group'>
                <label>{translate('asset.usage.task_in_use_request')}</label>
                <div id='taskCreateRequestDiv'>
                  <SelectBox
                    id={`taskCreateRequestBox`}
                    className='form-control select2'
                    style={{ width: '100%' }}
                    items={[{ value: '', text: 'Chưa chọn công việc' }, ...(taskList ? taskList : [])]}
                    onChange={handleTaskChange}
                    value={task}
                    multiple={false}
                  />
                </div>
              </div>

              {/* Trạng thái */}
              <div className='form-group'>
                <label>{translate('asset.general_information.status')}</label>
                <SelectBox
                  id={`status${_id}`}
                  className='form-control select2'
                  style={{ width: '100%' }}
                  value={status}
                  items={[
                    { value: 'approved', text: translate('asset.usage.approved') },
                    { value: 'waiting_for_approval', text: translate('asset.usage.waiting_approval') },
                    { value: 'disapproved', text: translate('asset.usage.not_approved') }
                  ]}
                  disabled
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
  const { recommendDistribute, auth, user, assetsManager, tasks } = state
  return { recommendDistribute, auth, user, assetsManager, tasks }
}

const actionCreators = {
  getUser: UserActions.get,
  getAllAsset: AssetManagerActions.getAllAsset,
  updateRecommendDistribute: RecommendDistributeActions.updateRecommendDistribute,
  getPaginateTasks: taskManagementActions.getPaginateTasks
}

const editRecommendDistribute = connect(mapState, actionCreators)(withTranslate(UseRequestEditForm))
export { editRecommendDistribute as UseRequestEditForm }
