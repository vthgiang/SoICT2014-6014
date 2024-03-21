import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { ButtonModal, DatePicker, DialogModal, ErrorLabel, SelectBox, TimePicker } from '../../../../../common-components'
import ValidationHelper from '../../../../../helpers/validationHelper'
import { UserActions } from '../../../../super-admin/user/redux/actions'

function UsageLogAddModal(props) {
  // Function format ngày hiện tại thành dạnh mm-yyyy
  const formatDate = (date) => {
    if (!date) return null
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

  const [state, setState] = useState({
    usedByUser: '',
    usedByOrganizationalUnit: '',
    startDate: props.startDate ? formatDate(props.startDate) : formatDate(Date.now()),
    endDate: props.endDate ? formatDate(props.endDate) : formatDate(Date.now()),
    description: '',
    startTime: props.startTime ? props.startTime : '',
    stopTime: props.stopTime ? props.stopTime : ''
  })

  /**
   * Bắt sự kiện thay đổi người sử dụng
   */
  const handleUsedByUserChange = (value) => {
    const { translate } = props
    let usedByUser = value[0] !== 'null' ? value[0] : null
    let { message } = ValidationHelper.validateEmpty(translate, usedByUser)

    setState((state) => {
      return {
        ...state,
        usedByUser: usedByUser,
        errorOnUser: message
      }
    })
  }

  /**
   * Bắt sự kiện thay đổi đơn vị sử dụng
   */
  const handleUsedByOrganizationalUnitChange = (value) => {
    let usedByOrganizationalUnit = value[0] !== 'null' ? value[0] : null
    setState((state) => {
      return {
        ...state,
        usedByOrganizationalUnit: usedByOrganizationalUnit
      }
    })
  }

  //Bắt sự kiện thay đổi "Thời gian bắt đầu sử dụng"
  const handleStartDateChange = (value) => {
    const { translate } = props
    let { message } = ValidationHelper.validateEmpty(translate, value)
    setState((state) => {
      return {
        ...state,
        startDate: value,
        errorOnStartDate: message
      }
    })
  }

  const handleStartTimeChange = (value) => {
    setState((state) => {
      return {
        ...state,
        startTime: value
      }
    })
  }
  // Bắt sự kiện thay đổi "Thời gian kết thúc sử dụng"
  const handleEndDateChange = (value) => {
    const { translate } = props
    let { message } = ValidationHelper.validateEmpty(translate, value)
    setState((state) => {
      return {
        ...state,
        endDate: value,
        errorOnEndDate: props.typeRegisterForUse == 3 ? undefined : message
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
  // Bắt sự kiện thay đổi "Nội dung"
  const handleDescriptionChange = (e) => {
    const { value } = e.target
    setState((state) => {
      return {
        ...state,
        description: value
      }
    })
  }

  // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
  const isFormValidated = () => {
    const { usedByOrganizationalUnit, usedByUser, startDate, endDate } = state
    const { translate } = props

    if (
      (!ValidationHelper.validateName(translate, usedByUser).status &&
        !ValidationHelper.validateName(translate, usedByOrganizationalUnit).status) ||
      !ValidationHelper.validateName(translate, startDate).status ||
      (props.typeRegisterForUse != 3 && !ValidationHelper.validateName(translate, endDate).status)
    )
      return false
    return true
  }

  // Bắt sự kiện submit form
  const save = async () => {
    const { user } = props
    let userlist = user.list
    let partStart, startDate, partEnd, endDate
    partStart = state.startDate.split('-')
    if (state.startTime != '') {
      let date = [partStart[2], partStart[1], partStart[0]].join('-')
      startDate = [date, state.startTime].join(' ')
    } else {
      startDate = [partStart[2], partStart[1], partStart[0]].join('-')
    }

    if (state.endDate) {
      partEnd = state.endDate.split('-')
      if (state.stopTime != '') {
        let date = [partEnd[2], partEnd[1], partEnd[0]].join('-')
        endDate = [date, state.stopTime].join(' ')
      } else {
        endDate = [partEnd[2], partEnd[1], partEnd[0]].join('-')
      }
    } else {
      endDate = undefined
    }

    if (state.usedByUser === '') {
      await setState({
        ...state,
        usedByUser: null
      })
    }

    if (state.usedByOrganizationalUnit === '') {
      await setState({
        ...state,
        usedByOrganizationalUnit: null
      })
    }

    if (isFormValidated()) {
      return props.handleChange({ ...state, startDate: startDate, endDate: endDate })
    }
  }

  const { id } = props
  const { translate, user, department } = props
  const {
    usedByUser,
    usedByOrganizationalUnit,
    startDate,
    endDate,
    description,
    errorOnDescription,
    startTime,
    stopTime,
    errorOnEndDate,
    errorOnStartDate,
    errorOnUser
  } = state

  var userlist = user.list,
    departmentlist = department.list

  return (
    <React.Fragment>
      {!props.calendarUsage && (
        <ButtonModal
          modalID={`modal-create-usage-${id}`}
          button_name={translate('asset.general_information.add')}
          title={translate('asset.asset_info.add_usage_info')}
        />
      )}
      <DialogModal
        size='50'
        modalID={`modal-create-usage-${id}`}
        isLoading={false}
        formID={`form-create-usage-${id}`}
        title={translate('asset.asset_info.add_usage_info')}
        func={save}
        disableSubmit={!isFormValidated()}
      >
        {/* Form thêm thông tin sử dụng */}
        <form className='form-group' id={`form-create-usage-${id}`}>
          <div className='col-md-12'>
            <span className='text-red'>Cần chọn người sử dụng hoặc đơn vị sử dụng</span>
            {/* Người sử dụng */}
            <div className={`form-group`}>
              <label>{translate('asset.general_information.user')}</label>
              <div>
                <div id='usedByUserBox'>
                  <SelectBox
                    id={`usedByUser${id}`}
                    className='form-control select2'
                    style={{ width: '100%' }}
                    items={[
                      { value: 'null', text: 'Chọn người sử dụng' },
                      ...userlist.map((x) => {
                        return { value: x._id, text: x.name + ' - ' + x.email }
                      })
                    ]}
                    onChange={handleUsedByUserChange}
                    value={usedByUser}
                    multiple={false}
                  />
                </div>
              </div>
            </div>

            <div className={`form-group`}>
              <label>{translate('asset.general_information.organization_unit')}</label>
              <div>
                <div id='usedByUserBox'>
                  <SelectBox
                    id={`usedByOrganizationalUnit${id}`}
                    className='form-control select2'
                    style={{ width: '100%' }}
                    items={[
                      { value: 'null', text: 'Chọn đơn vị sử dụng' },
                      ...departmentlist.map((x) => {
                        return { value: x._id, text: x.name }
                      })
                    ]}
                    onChange={handleUsedByOrganizationalUnitChange}
                    value={usedByOrganizationalUnit}
                    multiple={false}
                  />
                </div>
              </div>
            </div>

            {/* Thời gian bắt đầu sử dụng */}
            <div className={`form-group ${!errorOnStartDate ? '' : 'has-error'}`}>
              <label>
                {translate('asset.general_information.handover_from_date')}
                <span className='text-red'>*</span>
              </label>
              <DatePicker id={`add-start-date-${id}`} value={startDate} onChange={handleStartDateChange} />
              <ErrorLabel content={errorOnStartDate} />
            </div>
            {props.typeRegisterForUse == 2 && (
              <TimePicker
                id={`time-picker-start-${id}`}
                onChange={handleStartTimeChange}
                value={startTime}
                // getDefaultValue = {getDefaultStartValue}
              />
            )}

            {/* Thời gian kết thúc sử dụng */}
            <div className={`form-group ${!errorOnEndDate ? '' : 'has-error'}`}>
              <label>
                {translate('asset.general_information.handover_to_date')}
                {props.typeRegisterForUse != 3 && <span className='text-red'>*</span>}
              </label>
              <DatePicker id={`add-end-date-${id}`} value={endDate} onChange={handleEndDateChange} />
              <ErrorLabel content={errorOnEndDate} />
            </div>
            {props.typeRegisterForUse == 2 && (
              <TimePicker
                id={`time-picker-end-${id}`}
                onChange={handleStopTimeChange}
                value={stopTime}
                // getDefaultValue = {getDefaultEndValue}
              />
            )}

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
            </div>
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

function mapState(state) {
  var { user, department } = state
  return { user, department }
}

const actionCreators = {
  getUser: UserActions.get
}

const addModal = connect(mapState, actionCreators)(withTranslate(UsageLogAddModal))
export { addModal as UsageLogAddModal }
